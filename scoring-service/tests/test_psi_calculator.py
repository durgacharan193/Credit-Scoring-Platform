from app.utils.psi_calculator import PsiCalculator

def test_psi_calculator():
    util = PsiCalculator()
    assert util.enabled is True
    res = util.run({"key": "value"})
    assert res["status"] == "OK"
