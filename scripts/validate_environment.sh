#!/usr/bin/env bash
set -euo pipefail
for cmd in node npm python git docker; do
  command -v "$cmd" >/dev/null 2>&1 || { echo "Missing $cmd"; exit 1; }
done
echo "Environment verification passed."
