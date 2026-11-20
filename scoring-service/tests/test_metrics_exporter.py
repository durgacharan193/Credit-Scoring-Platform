from app.utils.metrics_exporter import MetricsExporter

def test_metrics_exporter():
    util = MetricsExporter()
    assert util.enabled is True
    res = util.run({"key": "value"})
    assert res["status"] == "OK"
