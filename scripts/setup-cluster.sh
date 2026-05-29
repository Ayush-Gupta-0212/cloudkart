#!/usr/bin/env bash
# scripts/setup-cluster.sh — one-shot local setup.
# Starts Minikube, loads images, deploys CloudKart + monitoring.

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SERVICES=(user-service product-service order-service frontend)

echo "▶ Starting Minikube..."
minikube start --driver=docker --cpus=2 --memory=4096

echo "▶ Enabling addons..."
minikube addons enable ingress
minikube addons enable metrics-server

echo "▶ Building + loading images..."
for s in "${SERVICES[@]}"; do
  echo "  building ${s}..."
  docker build -t "cloudkart/${s}:dev" "${ROOT}/services/${s}" >/dev/null
  echo "  loading ${s} into minikube..."
  minikube image load "cloudkart/${s}:dev"
done

echo "▶ Deploying CloudKart via Helm..."
helm upgrade --install cloudkart "${ROOT}/helm/cloudkart" \
  -f "${ROOT}/helm/cloudkart/values-dev.yaml" \
  --namespace cloudkart \
  --create-namespace \
  --wait --timeout 5m

echo "▶ CloudKart is up. Access via:"
echo "  kubectl port-forward -n ingress-nginx svc/ingress-nginx-controller 8080:80"
echo "  then open http://localhost:8080"
