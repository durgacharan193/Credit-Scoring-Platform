from app.utils.scorecard_generator import ScorecardGenerator

def test_scorecard_generator():
    util = ScorecardGenerator()
    assert util.enabled is True
    res = util.run({"key": "value"})
    assert res["status"] == "OK"
