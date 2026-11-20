from app.utils.waterfall_formatter import WaterfallFormatter

def test_waterfall_formatter():
    util = WaterfallFormatter()
    assert util.enabled is True
    res = util.run({"key": "value"})
    assert res["status"] == "OK"
