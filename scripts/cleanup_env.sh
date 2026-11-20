#!/usr/bin/env bash
set -euo pipefail
echo "Cleaning node_modules, __pycache__, dist caches..."
find . -name '__pycache__' -exec rm -rf {} + 2>/dev/null || true
