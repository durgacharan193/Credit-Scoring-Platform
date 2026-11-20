import pytest
from app.modules.scorecard_transformer import ScorecardTransformer

def test_scorecard_transformer_initialization():
    module = ScorecardTransformer()
    assert module.version == "1.0.0"

def test_scorecard_transformer_execution():
    module = ScorecardTransformer()
    res = module.execute({"sample": "data"})
    assert res["status"] == "COMPLETED"
    assert res["module"] == "scorecard_transformer"
