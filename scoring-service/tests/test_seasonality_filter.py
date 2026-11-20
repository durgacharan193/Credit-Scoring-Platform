import pytest
from app.modules.seasonality_filter import SeasonalityFilter

def test_seasonality_filter_initialization():
    module = SeasonalityFilter()
    assert module.version == "1.0.0"

def test_seasonality_filter_execution():
    module = SeasonalityFilter()
    res = module.execute({"sample": "data"})
    assert res["status"] == "COMPLETED"
    assert res["module"] == "seasonality_filter"
