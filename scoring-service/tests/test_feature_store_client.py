from app.utils.feature_store_client import FeatureStoreClient

def test_feature_store_client():
    util = FeatureStoreClient()
    assert util.enabled is True
    res = util.run({"key": "value"})
    assert res["status"] == "OK"
