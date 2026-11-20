import pytest
from app.modules.outlier_detector import OutlierDetector

def test_outlier_detector_initialization():
    module = OutlierDetector()
    assert module.version == "1.0.0"

def test_outlier_detector_execution():
    module = OutlierDetector()
    res = module.execute({"sample": "data"})
    assert res["status"] == "COMPLETED"
    assert res["module"] == "outlier_detector"
