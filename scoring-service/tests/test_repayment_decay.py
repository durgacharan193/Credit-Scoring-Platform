import pytest
from app.modules.repayment_decay import RepaymentDecay

def test_repayment_decay_initialization():
    module = RepaymentDecay()
    assert module.version == "1.0.0"

def test_repayment_decay_execution():
    module = RepaymentDecay()
    res = module.execute({"sample": "data"})
    assert res["status"] == "COMPLETED"
    assert res["module"] == "repayment_decay"
