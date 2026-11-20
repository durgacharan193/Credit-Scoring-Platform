from app.utils.synthetic_fraud_injector import SyntheticFraudInjector

def test_synthetic_fraud_injector():
    util = SyntheticFraudInjector()
    assert util.enabled is True
    res = util.run({"key": "value"})
    assert res["status"] == "OK"
