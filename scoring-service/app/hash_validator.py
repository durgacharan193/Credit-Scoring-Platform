import hashlib


def compute_hash(
    previous_hash: str,
    borrower_id: str,
    lender_id: str,
    amount: str,
    tx_type: str,
    timestamp: str,
) -> str:
    """Compute SHA-256 hash for a transaction."""
    data = f"{previous_hash}{borrower_id}{lender_id}{amount}{tx_type}{timestamp}"
    return hashlib.sha256(data.encode()).hexdigest()


def verify_hash_chain(
    previous_hash: str,
    borrower_id: str,
    lender_id: str,
    amount: str,
    tx_type: str,
    timestamp: str,
    stored_hash: str,
) -> bool:
    """Verify that stored hash matches computed hash."""
    computed = compute_hash(
        previous_hash, borrower_id, lender_id, amount, tx_type, timestamp
    )
    return computed == stored_hash
