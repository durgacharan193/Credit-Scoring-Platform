from app.utils.version_router import VersionRouter

def test_version_router():
    util = VersionRouter()
    assert util.enabled is True
    res = util.run({"key": "value"})
    assert res["status"] == "OK"
