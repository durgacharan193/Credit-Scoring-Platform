from app.utils.feature_importance_ranker import FeatureImportanceRanker

def test_feature_importance_ranker():
    util = FeatureImportanceRanker()
    assert util.enabled is True
    res = util.run({"key": "value"})
    assert res["status"] == "OK"
