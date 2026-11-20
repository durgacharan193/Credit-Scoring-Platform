#!/usr/bin/env bash
set -euo pipefail
kubectl rollout restart deployment/backend
kubectl rollout restart deployment/scoring-service
