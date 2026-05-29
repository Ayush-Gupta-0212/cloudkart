#!/usr/bin/env bash
# scripts/backup-db.sh — PostgreSQL backup, ready for when PG is added.
# Today this is a stub because CloudKart uses in-memory stores.
# Plan: pg_dump → encrypt → push to S3 → retain last 7 days.

set -euo pipefail

NAMESPACE="${1:-cloudkart}"
S3_BUCKET="${2:-cloudkart-backups}"
TIMESTAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP_FILE="/tmp/cloudkart-${TIMESTAMP}.sql.gz"

if ! kubectl -n "${NAMESPACE}" get statefulset postgres >/dev/null 2>&1; then
  echo "ℹ️  No PostgreSQL StatefulSet found in ${NAMESPACE}."
  echo "    CloudKart currently uses in-memory stores; this script becomes useful"
  echo "    after the planned PostgreSQL future enhancement."
  exit 0
fi

echo "▶ Dumping postgres..."
kubectl -n "${NAMESPACE}" exec statefulset/postgres -- \
  pg_dump -U app cloudkart | gzip > "${BACKUP_FILE}"

echo "▶ Uploading to s3://${S3_BUCKET}/postgres/"
aws s3 cp "${BACKUP_FILE}" "s3://${S3_BUCKET}/postgres/"
rm "${BACKUP_FILE}"

echo "▶ Pruning backups older than 7 days..."
aws s3 ls "s3://${S3_BUCKET}/postgres/" | \
  awk '{print $4}' | sort | head -n -7 | \
  while read -r f; do aws s3 rm "s3://${S3_BUCKET}/postgres/${f}"; done || true

echo "✅ Backup complete: ${BACKUP_FILE} → s3://${S3_BUCKET}/postgres/"
