import pytest
from app.modules.dti_calculator import DtiCalculator

def test_dti_calculator_initialization():
    module = DtiCalculator()
    assert module.version == "1.0.0"

def test_dti_calculator_execution():
    module = DtiCalculator()
    res = module.execute({"sample": "data"})
    assert res["status"] == "COMPLETED"
    assert res["module"] == "dti_calculator"
