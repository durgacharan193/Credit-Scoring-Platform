from app.utils.woe_calculator import WoeCalculator

def test_woe_calculator():
    util = WoeCalculator()
    assert util.enabled is True
    res = util.run({"key": "value"})
    assert res["status"] == "OK"
