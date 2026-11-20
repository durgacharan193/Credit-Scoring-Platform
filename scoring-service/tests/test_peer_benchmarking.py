import pytest
from app.modules.peer_benchmarking import PeerBenchmarking

def test_peer_benchmarking_initialization():
    module = PeerBenchmarking()
    assert module.version == "1.0.0"

def test_peer_benchmarking_execution():
    module = PeerBenchmarking()
    res = module.execute({"sample": "data"})
    assert res["status"] == "COMPLETED"
    assert res["module"] == "peer_benchmarking"
