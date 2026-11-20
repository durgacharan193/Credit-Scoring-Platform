import pytest
from app.modules.volatility_index import VolatilityIndex

def test_volatility_index_initialization():
    module = VolatilityIndex()
    assert module.version == "1.0.0"

def test_volatility_index_execution():
    module = VolatilityIndex()
    res = module.execute({"sample": "data"})
    assert res["status"] == "COMPLETED"
    assert res["module"] == "volatility_index"
