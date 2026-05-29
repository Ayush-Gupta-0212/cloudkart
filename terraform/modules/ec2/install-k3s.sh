#!/usr/bin/env bash
# install-k3s.sh — cloud-init script that turns a fresh Ubuntu 22.04 instance
# into a single-node Kubernetes cluster running K3s.
#
# K3s is a lightweight, certified Kubernetes distro — runs in <512 MB RAM,
# perfect for free-tier EC2 and small clusters.

set -euo pipefail
exec > >(tee /var/log/install-k3s.log) 2>&1

echo "▶ apt update + upgrade..."
apt-get update -y
apt-get upgrade -y
apt-get install -y curl jq

echo "▶ Installing K3s (server, with traefik disabled — we'll use nginx-ingress)..."
curl -sfL https://get.k3s.io | \
  INSTALL_K3S_EXEC="server --disable=traefik --write-kubeconfig-mode=644" \
  sh -

echo "▶ Waiting for K3s API to be ready..."
until kubectl get nodes >/dev/null 2>&1; do
  sleep 2
done

echo "▶ Installing Helm..."
curl -fsSL https://baltocdn.com/helm/signing.asc | gpg --dearmor -o /usr/share/keyrings/helm.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/helm.gpg] https://baltocdn.com/helm/stable/debian/ all main" > /etc/apt/sources.list.d/helm-stable-debian.list
apt-get update
apt-get install -y helm

echo "▶ Installing nginx-ingress via Helm..."
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update
helm install ingress-nginx ingress-nginx/ingress-nginx \
  --namespace ingress-nginx --create-namespace \
  --set controller.service.type=LoadBalancer

echo "▶ K3s + ingress-nginx ready."
echo "▶ Kubeconfig at /etc/rancher/k3s/k3s.yaml — fetch with scp."
echo "▶ Done."
