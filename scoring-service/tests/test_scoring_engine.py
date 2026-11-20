import pytest
from app.scoring_engine import CreditScoringEngine

def test_engine_unrated_for_empty():
    engine = CreditScoringEngine()
    result = engine.calculate_score("b1", [])
    assert result["score"] == 300
    assert result["tier"] == "UNRATED"

def test_engine_score_calculation():
    engine = CreditScoringEngine()
    txs = [
        {"id": "1", "borrower_id": "b1", "lender_id": "l1", "amount": 2000, "type": "LOAN", "status": "VERIFIED"},
        {"id": "2", "borrower_id": "b1", "lender_id": "l1", "amount": 2000, "type": "REPAYMENT", "status": "VERIFIED"},
        {"id": "3", "borrower_id": "b1", "lender_id": "l2", "amount": 1500, "type": "REPAYMENT", "status": "VERIFIED"},
    ]
    result = engine.calculate_score("b1", txs)
    assert 300 <= result["score"] <= 900
    assert "metrics" in result
