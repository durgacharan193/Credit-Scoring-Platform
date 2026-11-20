import pytest
from app.modules.metrics_evaluator import MetricsEvaluator

def test_metrics_evaluator_initialization():
    module = MetricsEvaluator()
    assert module.version == "1.0.0"

def test_metrics_evaluator_execution():
    module = MetricsEvaluator()
    res = module.execute({"sample": "data"})
    assert res["status"] == "COMPLETED"
    assert res["module"] == "metrics_evaluator"
