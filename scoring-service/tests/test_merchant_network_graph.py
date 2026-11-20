import pytest
from app.modules.merchant_network_graph import MerchantNetworkGraph

def test_merchant_network_graph_initialization():
    module = MerchantNetworkGraph()
    assert module.version == "1.0.0"

def test_merchant_network_graph_execution():
    module = MerchantNetworkGraph()
    res = module.execute({"sample": "data"})
    assert res["status"] == "COMPLETED"
    assert res["module"] == "merchant_network_graph"
