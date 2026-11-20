import pytest
from app.modules.score_normalizer import ScoreNormalizer

def test_score_normalizer_initialization():
    module = ScoreNormalizer()
    assert module.version == "1.0.0"

def test_score_normalizer_execution():
    module = ScoreNormalizer()
    res = module.execute({"sample": "data"})
    assert res["status"] == "COMPLETED"
    assert res["module"] == "score_normalizer"
