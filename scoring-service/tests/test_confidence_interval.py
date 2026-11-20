import pytest
from app.modules.confidence_interval import ConfidenceInterval

def test_confidence_interval_initialization():
    module = ConfidenceInterval()
    assert module.version == "1.0.0"

def test_confidence_interval_execution():
    module = ConfidenceInterval()
    res = module.execute({"sample": "data"})
    assert res["status"] == "COMPLETED"
    assert res["module"] == "confidence_interval"
