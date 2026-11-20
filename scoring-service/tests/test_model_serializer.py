import pytest
from app.modules.model_serializer import ModelSerializer

def test_model_serializer_initialization():
    module = ModelSerializer()
    assert module.version == "1.0.0"

def test_model_serializer_execution():
    module = ModelSerializer()
    res = module.execute({"sample": "data"})
    assert res["status"] == "COMPLETED"
    assert res["module"] == "model_serializer"
