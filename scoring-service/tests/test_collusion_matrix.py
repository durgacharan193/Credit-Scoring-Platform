import pytest
from app.modules.collusion_matrix import CollusionMatrix

def test_collusion_matrix_initialization():
    module = CollusionMatrix()
    assert module.version == "1.0.0"

def test_collusion_matrix_execution():
    module = CollusionMatrix()
    res = module.execute({"sample": "data"})
    assert res["status"] == "COMPLETED"
    assert res["module"] == "collusion_matrix"
