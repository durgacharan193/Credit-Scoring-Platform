import pytest
from app.modules.cold_start_estimator import ColdStartEstimator

def test_cold_start_estimator_initialization():
    module = ColdStartEstimator()
    assert module.version == "1.0.0"

def test_cold_start_estimator_execution():
    module = ColdStartEstimator()
    res = module.execute({"sample": "data"})
    assert res["status"] == "COMPLETED"
    assert res["module"] == "cold_start_estimator"
