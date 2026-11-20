#!/usr/bin/env bash
set -euo pipefail
echo "Running smoke tests against staging cluster..."
curl -fsS https://staging.creditscoring.org/api/health >/dev/null
