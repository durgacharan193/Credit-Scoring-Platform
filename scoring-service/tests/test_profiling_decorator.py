from app.utils.profiling_decorator import ProfilingDecorator

def test_profiling_decorator():
    util = ProfilingDecorator()
    assert util.enabled is True
    res = util.run({"key": "value"})
    assert res["status"] == "OK"
