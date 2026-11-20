import pytest
from app.modules.rejection_reasons import RejectionReasons

def test_rejection_reasons_initialization():
    module = RejectionReasons()
    assert module.version == "1.0.0"

def test_rejection_reasons_execution():
    module = RejectionReasons()
    res = module.execute({"sample": "data"})
    assert res["status"] == "COMPLETED"
    assert res["module"] == "rejection_reasons"
