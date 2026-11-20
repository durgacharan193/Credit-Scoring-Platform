#!/usr/bin/env bash
set -e

echo "=== Running Backend Unit Tests ==="
cd backend && npm test -- --passWithNoTests

echo "=== Running Scoring Service Tests ==="
cd ../scoring-service
source venv/bin/activate
pytest tests/ -v

echo "=== All Tests Completed Successfully ==="
