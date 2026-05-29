#!/usr/bin/env bash
# scripts/rollback.sh — emergency rollback to previous Helm release.
# Usage: ./rollback.sh <env>  [revision]
# If no revision given, rolls back to the previous one.

set -euo pipefail

ENV="${1:-dev}"
REVISION="${2:-}"
NAMESPACE="cloudkart-${ENV}"

echo "▶ Helm history for ${NAMESPACE}:"
helm history cloudkart -n "${NAMESPACE}"

if [ -z "${REVISION}" ]; then
  echo
  echo "▶ Rolling back to previous revision..."
  helm rollback cloudkart -n "${NAMESPACE}" --wait --timeout 3m
else
  echo
  echo "▶ Rolling back to revision ${REVISION}..."
  helm rollback cloudkart "${REVISION}" -n "${NAMESPACE}" --wait --timeout 3m
fi

kubectl -n "${NAMESPACE}" get pods
echo "✅ Rollback complete."
