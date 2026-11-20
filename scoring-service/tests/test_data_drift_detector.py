from app.utils.data_drift_detector import DataDriftDetector

def test_data_drift_detector():
    util = DataDriftDetector()
    assert util.enabled is True
    res = util.run({"key": "value"})
    assert res["status"] == "OK"
