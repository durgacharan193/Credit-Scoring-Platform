import pytest
from app.modules.hyperparameter_tuner import HyperparameterTuner

def test_hyperparameter_tuner_initialization():
    module = HyperparameterTuner()
    assert module.version == "1.0.0"

def test_hyperparameter_tuner_execution():
    module = HyperparameterTuner()
    res = module.execute({"sample": "data"})
    assert res["status"] == "COMPLETED"
    assert res["module"] == "hyperparameter_tuner"
