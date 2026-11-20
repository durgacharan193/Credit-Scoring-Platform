"""Synthetic transaction history seeder"""
import random
import json

def generate_mock_ledger(count=50):
    return [{"id": f"tx-{i}", "amount": random.randint(1000, 50000)} for i in range(count)]

if __name__ == "__main__":
    print(f"Generated {len(generate_mock_ledger())} synthetic transactions.")
