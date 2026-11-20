"""Merchant lender test catalog seeder"""
LENDERS = [
    {"id": "lend-001", "name": "Apex Micro-Credit", "max_limit": 500000},
    {"id": "lend-002", "name": "Gramin Vikas Finance", "max_limit": 250000}
]
if __name__ == "__main__":
    print(f"Seeded {len(LENDERS)} institutional lenders.")
