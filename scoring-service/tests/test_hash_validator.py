import pytest
from app.hash_validator import compute_hash, verify_hash_chain

def test_compute_hash():
    data = {
        "id": "tx1",
        "borrower_id": "b1",
        "lender_id": "l1",
        "amount": 1000.0,
        "type": "LOAN",
        "previous_hash": "0" * 64
    }
    h1 = compute_hash(data)
    h2 = compute_hash(data)
    assert len(h1) == 64
    assert h1 == h2

def test_verify_hash_chain_valid():
    tx1 = {
        "id": "1",
        "borrower_id": "b1",
        "lender_id": "l1",
        "amount": 1000.0,
        "type": "LOAN",
        "previous_hash": "0" * 64
    }
    h1 = compute_hash(tx1)
    tx1["current_hash"] = h1

    tx2 = {
        "id": "2",
        "borrower_id": "b1",
        "lender_id": "l1",
        "amount": 1000.0,
        "type": "REPAYMENT",
        "previous_hash": h1
    }
    h2 = compute_hash(tx2)
    tx2["current_hash"] = h2

    is_valid, err = verify_hash_chain([tx1, tx2])
    assert is_valid is True
    assert err is None
