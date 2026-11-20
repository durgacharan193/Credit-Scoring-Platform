from app.utils.canary_evaluator import CanaryEvaluator

def test_canary_evaluator():
    util = CanaryEvaluator()
    assert util.enabled is True
    res = util.run({"key": "value"})
    assert res["status"] == "OK"
