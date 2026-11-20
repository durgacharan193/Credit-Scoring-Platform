from app.utils.prediction_audit_logger import PredictionAuditLogger

def test_prediction_audit_logger():
    util = PredictionAuditLogger()
    assert util.enabled is True
    res = util.run({"key": "value"})
    assert res["status"] == "OK"
