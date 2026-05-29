#!/usr/bin/env bash
# scripts/health-check.sh — smoke test for a running CloudKart cluster.
# Usage: ./health-check.sh [namespace]   (default: cloudkart)

set -euo pipefail

NS="${1:-cloudkart}"
SERVICES=(user-service product-service order-service frontend)
FAILED=0

echo "▶ Health check in namespace: ${NS}"

# 1) All deployments ready?
for svc in "${SERVICES[@]}"; do
  ready=$(kubectl -n "${NS}" get deployment "${svc}" -o jsonpath='{.status.readyReplicas}' 2>/dev/null || echo "0")
  desired=$(kubectl -n "${NS}" get deployment "${svc}" -o jsonpath='{.spec.replicas}' 2>/dev/null || echo "0")
  if [ "${ready}" = "${desired}" ] && [ "${ready}" != "0" ]; then
    echo "  ✅ ${svc}: ${ready}/${desired} ready"
  else
    echo "  ❌ ${svc}: ${ready}/${desired} ready"
    FAILED=$((FAILED + 1))
  fi
done

# 2) Ingress present?
if kubectl -n "${NS}" get ingress cloudkart-ingress >/dev/null 2>&1; then
  echo "  ✅ ingress present"
else
  echo "  ❌ ingress missing"
  FAILED=$((FAILED + 1))
fi

# 3) HPA present?
if kubectl -n "${NS}" get hpa >/dev/null 2>&1; then
  echo "  ✅ HPA present"
else
  echo "  ⚠️  no HPA in namespace"
fi

if [ "${FAILED}" -gt 0 ]; then
  echo "❌ ${FAILED} check(s) failed."
  exit 1
fi
echo "🎉 All checks passed."
