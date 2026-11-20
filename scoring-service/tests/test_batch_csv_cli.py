from app.utils.batch_csv_cli import BatchCsvCli

def test_batch_csv_cli():
    util = BatchCsvCli()
    assert util.enabled is True
    res = util.run({"key": "value"})
    assert res["status"] == "OK"
