import pytest
from app.modules.ensemble_scorer import EnsembleScorer

def test_ensemble_scorer_initialization():
    module = EnsembleScorer()
    assert module.version == "1.0.0"

def test_ensemble_scorer_execution():
    module = EnsembleScorer()
    res = module.execute({"sample": "data"})
    assert res["status"] == "COMPLETED"
    assert res["module"] == "ensemble_scorer"
