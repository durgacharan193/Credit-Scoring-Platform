import pytest
from app.modules.shap_explainer import ShapExplainer

def test_shap_explainer_initialization():
    module = ShapExplainer()
    assert module.version == "1.0.0"

def test_shap_explainer_execution():
    module = ShapExplainer()
    res = module.execute({"sample": "data"})
    assert res["status"] == "COMPLETED"
    assert res["module"] == "shap_explainer"
