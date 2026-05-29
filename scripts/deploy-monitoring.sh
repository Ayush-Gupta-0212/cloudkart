#!/usr/bin/env bash
# scripts/deploy-monitoring.sh — install the Prometheus + Grafana + Loki stack.

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"

echo "▶ Adding Helm repos..."
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo add grafana https://grafana.github.io/helm-charts
helm repo update

echo "▶ Installing kube-prometheus-stack (Prometheus + Grafana + Alertmanager)..."
helm upgrade --install kube-prom-stack prometheus-community/kube-prometheus-stack \
  --namespace monitoring --create-namespace \
  --set grafana.adminPassword=cloudkart \
  --set prometheus.prometheusSpec.serviceMonitorSelectorNilUsesHelmValues=false \
  --set prometheus.prometheusSpec.podMonitorSelectorNilUsesHelmValues=false \
  --wait --timeout 8m

echo "▶ Installing Loki + Promtail (logs)..."
helm upgrade --install loki grafana/loki-stack \
  --namespace monitoring \
  --set loki.persistence.enabled=false \
  --set grafana.enabled=false \
  --wait --timeout 5m

echo "▶ Applying CloudKart ServiceMonitor + alert rules..."
kubectl apply -f "${ROOT}/monitoring/prometheus/service-monitor.yaml"
kubectl apply -f "${ROOT}/monitoring/prometheus/alert-rules.yaml"

echo
echo "✅ Monitoring stack deployed."
echo
echo "Access:"
echo "  • Grafana:    kubectl port-forward -n monitoring svc/kube-prom-stack-grafana 3000:80"
echo "                http://localhost:3000  (admin / cloudkart)"
echo "  • Prometheus: kubectl port-forward -n monitoring svc/kube-prom-stack-kube-prome-prometheus 9090:9090"
echo "                http://localhost:9090"
echo "  • Loki API:   kubectl port-forward -n monitoring svc/loki 3100:3100"
