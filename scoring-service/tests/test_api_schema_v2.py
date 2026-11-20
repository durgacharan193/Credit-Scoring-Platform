import pytest
from app.modules.api_schema_v2 import ApiSchemaV2

def test_api_schema_v2_initialization():
    module = ApiSchemaV2()
    assert module.version == "1.0.0"

def test_api_schema_v2_execution():
    module = ApiSchemaV2()
    res = module.execute({"sample": "data"})
    assert res["status"] == "COMPLETED"
    assert res["module"] == "api_schema_v2"
