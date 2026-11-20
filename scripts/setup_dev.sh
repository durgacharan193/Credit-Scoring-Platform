#!/usr/bin/env bash
set -e

echo "=== Initializing Credit Scoring Platform Development Environment ==="

echo "1. Installing backend dependencies..."
cd backend && npm install

echo "2. Generating Prisma client..."
npx prisma generate

echo "3. Installing frontend dependencies..."
cd ../frontend && npm install

echo "4. Setting up Python scoring engine virtualenv..."
cd ../scoring-service
if [ ! -d "venv" ]; then
  python3 -m venv venv
fi
source venv/bin/activate
pip install -r requirements.txt

echo "=== Development Environment Ready ==="
