#!/usr/bin/env bash
# scripts/deploy.sh — same logic as the Jenkinsfile's Deploy stage,
# usable standalone for ad-hoc deploys or local testing.
#
# Usage:  ./deploy.sh <env> <image_tag>
# Example: ./deploy.sh dev v1.2.3

set -euo pipefail

ENV="${1:-dev}"
TAG="${2:-latest}"
NAMESPACE="cloudkart-${ENV}"
CHART="./helm/cloudkart"

echo "▶ Deploying CloudKart"
echo "  Env:        ${ENV}"
echo "  Image tag:  ${TAG}"
echo "  Namespace:  ${NAMESPACE}"
echo

helm lint "${CHART}"

helm upgrade --install cloudkart "${CHART}" \
  -f "${CHART}/values-${ENV}.yaml" \
  --set "services.user-service.image.tag=${TAG}" \
  --set "services.product-service.image.tag=${TAG}" \
  --set "services.order-service.image.tag=${TAG}" \
  --set "services.frontend.image.tag=${TAG}" \
  --namespace "${NAMESPACE}" \
  --create-namespace \
  --atomic --timeout 5m

echo
echo "▶ Smoke test..."
kubectl -n "${NAMESPACE}" wait --for=condition=available --timeout=180s deployment --all
kubectl -n "${NAMESPACE}" get pods

echo
echo "✅ CloudKart ${TAG} deployed to ${ENV}."
