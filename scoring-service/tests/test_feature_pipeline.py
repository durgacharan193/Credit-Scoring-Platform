import pytest
from app.modules.feature_pipeline import FeaturePipeline

def test_feature_pipeline_initialization():
    module = FeaturePipeline()
    assert module.version == "1.0.0"

def test_feature_pipeline_execution():
    module = FeaturePipeline()
    res = module.execute({"sample": "data"})
    assert res["status"] == "COMPLETED"
    assert res["module"] == "feature_pipeline"
