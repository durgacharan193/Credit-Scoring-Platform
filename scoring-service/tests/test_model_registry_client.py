from app.utils.model_registry_client import ModelRegistryClient

def test_model_registry_client():
    util = ModelRegistryClient()
    assert util.enabled is True
    res = util.run({"key": "value"})
    assert res["status"] == "OK"
