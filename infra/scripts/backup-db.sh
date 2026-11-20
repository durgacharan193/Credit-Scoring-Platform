#!/usr/bin/env bash
set -euo pipefail
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB" | gzip > "/backups/db_$TIMESTAMP.sql.gz"
