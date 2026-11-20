from app.utils.payload_validator import PayloadValidator

def test_payload_validator():
    util = PayloadValidator()
    assert util.enabled is True
    res = util.run({"key": "value"})
    assert res["status"] == "OK"
