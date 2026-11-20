"""Synthetic borrower personas seeder"""
import json

PERSONAS = [
    {"name": "Ramesh Kumar", "business": "Kirana Store", "city": "Jaipur", "tier": "A"},
    {"name": "Priya Sharma", "business": "Textile Weaving", "city": "Surat", "tier": "B"},
]
if __name__ == "__main__":
    print(f"Seeded {len(PERSONAS)} borrower personas.")
