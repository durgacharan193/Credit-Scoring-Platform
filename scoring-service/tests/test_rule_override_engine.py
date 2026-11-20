import pytest
from app.modules.rule_override_engine import RuleOverrideEngine

def test_rule_override_engine_initialization():
    module = RuleOverrideEngine()
    assert module.version == "1.0.0"

def test_rule_override_engine_execution():
    module = RuleOverrideEngine()
    res = module.execute({"sample": "data"})
    assert res["status"] == "COMPLETED"
    assert res["module"] == "rule_override_engine"
