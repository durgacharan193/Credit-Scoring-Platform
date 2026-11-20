from app.utils.characteristic_analysis import CharacteristicAnalysis

def test_characteristic_analysis():
    util = CharacteristicAnalysis()
    assert util.enabled is True
    res = util.run({"key": "value"})
    assert res["status"] == "OK"
