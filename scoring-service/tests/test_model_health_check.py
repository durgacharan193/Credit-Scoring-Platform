from app.utils.model_health_check import ModelHealthCheck

def test_model_health_check():
    util = ModelHealthCheck()
    assert util.enabled is True
    res = util.run({"key": "value"})
    assert res["status"] == "OK"
