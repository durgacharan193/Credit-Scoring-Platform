import pytest
from app.modules.drift_monitor import DriftMonitor

def test_drift_monitor_initialization():
    module = DriftMonitor()
    assert module.version == "1.0.0"

def test_drift_monitor_execution():
    module = DriftMonitor()
    res = module.execute({"sample": "data"})
    assert res["status"] == "COMPLETED"
    assert res["module"] == "drift_monitor"
