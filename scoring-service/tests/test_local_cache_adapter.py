from app.utils.local_cache_adapter import LocalCacheAdapter

def test_local_cache_adapter():
    util = LocalCacheAdapter()
    assert util.enabled is True
    res = util.run({"key": "value"})
    assert res["status"] == "OK"
