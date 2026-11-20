import hashlib
import math
from datetime import datetime
from typing import Any, Dict, List, Tuple

import asyncpg


class CreditScoringEngine:

    BASE_SCORE = 300
    MAX_SCORE = 900

    # Weight configuration
    WEIGHTS = {
        "repayment_punctuality": 0.35,  # 35% weight
        "loan_volume": 0.20,            # 20% weight
        "lender_diversity": 0.25,       # 25% weight
        "transaction_history": 0.20,    # 20% weight
    }

    # Penalty configuration
    PENALTIES = {
        "collusion_closed_loop": -100,  # Trading with only 1-2 lenders
        "rapid_roundtrip": -50,         # Repayment within 2h of loan (suspicious)
        "hash_chain_invalid": -150,     # Tampered chain
    }

    async def compute_score(
        self, borrower_id: str, conn: asyncpg.Connection
    ) -> Dict[str, Any]:
        """
        Full scoring algorithm:
        1. Fetch all VERIFIED transactions for borrower
        2. Compute each sub-score
        3. Apply penalties
        4. Clamp to 300-900
        5. Determine risk tier
        """
        transactions = await conn.fetch(
            """SELECT t.*, u.id as lender_user_id
               FROM "Transaction" t
               JOIN "User" u ON u.id = t."lenderId"
               WHERE t."borrowerId" = $1 AND t.status = 'VERIFIED'
               ORDER BY t."createdAt" ASC""",
            borrower_id,
        )

        if not transactions:
            return self._empty_report(borrower_id)

        tx_list = [dict(t) for t in transactions]

        # Compute sub-scores
        punctuality_score, punctuality_pct = self._compute_punctuality(tx_list)
        volume_score = self._compute_volume_score(tx_list)
        diversity_score, unique_lenders = self._compute_diversity_score(tx_list)
        history_score = self._compute_history_score(tx_list)

        # Weighted base score (before penalties)
        raw_score = (
            self.BASE_SCORE
            + (punctuality_score * self.WEIGHTS["repayment_punctuality"] * 600)
            + (volume_score * self.WEIGHTS["loan_volume"] * 600)
            + (diversity_score * self.WEIGHTS["lender_diversity"] * 600)
            + (history_score * self.WEIGHTS["transaction_history"] * 600)
        )

        # Apply penalties
        penalties_applied: List[str] = []
        penalty_total = 0

        # Collusion check: only 1-2 unique lenders
        if unique_lenders <= 2 and len(tx_list) >= 5:
            penalty_total += self.PENALTIES["collusion_closed_loop"]
            penalties_applied.append("collusion_closed_loop")

        # Rapid round-trip repayment check
        if self._detect_rapid_roundtrip(tx_list):
            penalty_total += self.PENALTIES["rapid_roundtrip"]
            penalties_applied.append("rapid_roundtrip")

        # Verify hash chain integrity
        chain_valid = await self._verify_full_chain(borrower_id, conn)
        if not chain_valid:
            penalty_total += self.PENALTIES["hash_chain_invalid"]
            penalties_applied.append("hash_chain_invalid")

        # Final score
        final_score = int(max(300, min(900, raw_score + penalty_total)))

        loans = [t for t in tx_list if t["type"] == "LOAN"]
        repayments = [t for t in tx_list if t["type"] == "REPAYMENT"]

        return {
            "borrower_id": borrower_id,
            "score": final_score,
            "risk_tier": self._get_risk_tier(final_score),
            "punctuality_pct": round(punctuality_pct * 100, 2),
            "unique_lender_count": unique_lenders,
            "total_loans": len(loans),
            "total_repayments": len(repayments),
            "collusion_flag": "collusion_closed_loop" in penalties_applied,
            "hash_chain_valid": chain_valid,
            "penalties_applied": penalties_applied,
        }

    def _compute_punctuality(self, transactions: List[Dict]) -> Tuple[float, float]:
        """
        Punctuality: ratio of repayments made on or before dueDate.
        Only counts loan-repayment pairs where dueDate was set.
        """
        loans_with_due = [
            t for t in transactions if t["type"] == "LOAN" and t.get("dueDate")
        ]
        if not loans_with_due:
            return 0.5, 0.5  # neutral if no due dates

        on_time = 0
        for loan in loans_with_due:
            matching_repayments = [
                t
                for t in transactions
                if t["type"] == "REPAYMENT"
                and t["lenderId"] == loan["lenderId"]
                and t.get("verifiedAt") is not None
                and t["verifiedAt"] <= loan["dueDate"]
            ]
            if matching_repayments:
                on_time += 1

        ratio = on_time / len(loans_with_due)
        return ratio, ratio

    def _compute_volume_score(self, transactions: List[Dict]) -> float:
        """Score based on total transaction volume (logarithmic scaling)."""
        total_amount = sum(float(t["amount"]) for t in transactions)
        if total_amount <= 0:
            return 0.0
        # Log scale: 100 -> ~0.033, 10000 -> ~0.067, 1,000,000 -> 0.1 (capped at 1.0)
        # Using /6.0 so log10(1_000_000)=6 gives 1.0
        score = min(1.0, math.log10(total_amount + 1) / 6.0)
        return score

    def _compute_diversity_score(self, transactions: List[Dict]) -> Tuple[float, int]:
        """Score based on number of unique lenders."""
        unique_lenders = len(set(t["lenderId"] for t in transactions))
        # 1 lender=0.1, 3=0.3, 5=0.5, 10+=1.0
        score = min(1.0, unique_lenders / 10.0)
        return score, unique_lenders

    def _compute_history_score(self, transactions: List[Dict]) -> float:
        """Score based on length of credit history."""
        if len(transactions) < 2:
            return 0.1
        oldest = min(t["createdAt"] for t in transactions)
        newest = max(t["createdAt"] for t in transactions)
        if isinstance(oldest, str):
            oldest = datetime.fromisoformat(oldest)
            newest = datetime.fromisoformat(newest)
        days = (newest - oldest).days
        # 30 days -> ~0.075, 180 days -> 0.45, 400+ days -> 1.0
        return min(1.0, days / 400.0)

    def _detect_rapid_roundtrip(self, transactions: List[Dict]) -> bool:
        """
        Detect unnatural rapid repayments:
        A repayment verified within 2 hours of its matching loan is suspicious.
        Only flag if this pattern occurs 3+ times.
        """
        loans = {t["id"]: t for t in transactions if t["type"] == "LOAN"}
        repayments = [t for t in transactions if t["type"] == "REPAYMENT"]

        rapid_count = 0
        for repayment in repayments:
            for loan in loans.values():
                if loan["lenderId"] == repayment["lenderId"] and repayment.get(
                    "verifiedAt"
                ) and loan.get("verifiedAt"):
                    r_time = repayment["verifiedAt"]
                    l_time = loan["verifiedAt"]
                    if isinstance(r_time, str):
                        r_time = datetime.fromisoformat(r_time)
                        l_time = datetime.fromisoformat(l_time)
                    if 0 <= (r_time - l_time).total_seconds() <= 7200:  # 2 hours
                        rapid_count += 1
                        break

        return rapid_count >= 3

    async def _verify_full_chain(
        self, borrower_id: str, conn: asyncpg.Connection
    ) -> bool:
        """Verify the entire hash chain for a borrower is unbroken."""
        transactions = await conn.fetch(
            """SELECT "previousHash", "currentHash", "borrowerId", "lenderId",
                      amount, type, "verifiedAt"
               FROM "Transaction"
               WHERE "borrowerId" = $1 AND status = 'VERIFIED' AND "currentHash" IS NOT NULL
               ORDER BY "verifiedAt" ASC""",
            borrower_id,
        )

        for tx in transactions:
            prev = tx["previousHash"]
            stored = tx["currentHash"]
            amount_str = str(tx["amount"])
            ts_str = tx["verifiedAt"].isoformat() if tx["verifiedAt"] else ""
            data = (
                f"{prev}{tx['borrowerId']}{tx['lenderId']}"
                f"{amount_str}{tx['type']}{ts_str}"
            )
            computed = hashlib.sha256(data.encode()).hexdigest()
            if computed != stored:
                return False
        return True

    def _get_risk_tier(self, score: int) -> str:
        if score >= 750:
            return "EXCELLENT"
        if score >= 700:
            return "GOOD"
        if score >= 650:
            return "FAIR"
        if score >= 600:
            return "AVERAGE"
        if score >= 550:
            return "BELOW_AVERAGE"
        return "POOR"

    def _empty_report(self, borrower_id: str) -> Dict[str, Any]:
        return {
            "borrower_id": borrower_id,
            "score": 300,
            "risk_tier": "UNRATED",
            "punctuality_pct": 0.0,
            "unique_lender_count": 0,
            "total_loans": 0,
            "total_repayments": 0,
            "collusion_flag": False,
            "hash_chain_valid": True,
            "penalties_applied": [],
        }
