import pytest
from app.modules.synthetic_generator import SyntheticGenerator

def test_synthetic_generator_initialization():
    module = SyntheticGenerator()
    assert module.version == "1.0.0"

def test_synthetic_generator_execution():
    module = SyntheticGenerator()
    res = module.execute({"sample": "data"})
    assert res["status"] == "COMPLETED"
    assert res["module"] == "synthetic_generator"
