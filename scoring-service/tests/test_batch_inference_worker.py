import pytest
from app.modules.batch_inference_worker import BatchInferenceWorker

def test_batch_inference_worker_initialization():
    module = BatchInferenceWorker()
    assert module.version == "1.0.0"

def test_batch_inference_worker_execution():
    module = BatchInferenceWorker()
    res = module.execute({"sample": "data"})
    assert res["status"] == "COMPLETED"
    assert res["module"] == "batch_inference_worker"
