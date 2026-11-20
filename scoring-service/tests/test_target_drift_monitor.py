from app.utils.target_drift_monitor import TargetDriftMonitor

def test_target_drift_monitor():
    util = TargetDriftMonitor()
    assert util.enabled is True
    res = util.run({"key": "value"})
    assert res["status"] == "OK"
