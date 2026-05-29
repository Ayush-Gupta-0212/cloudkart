# CloudKart Runbook

Operational procedures for common scenarios.

## On-call playbook

### High error rate (alert: `CloudKartHighErrorRate`)

1. Open Grafana → CloudKart Overview dashboard.
2. Identify which service's error rate spiked (`Response status by service` panel).
3. Check logs in Loki:
   ```
   {namespace="cloudkart", app="<service>"} |= "ERROR" | json
   ```
4. Check pod status:
   ```bash
   kubectl -n cloudkart get pods
   kubectl -n cloudkart describe pod <pod>
   ```
5. If a recent deploy looks suspicious:
   ```bash
   helm history cloudkart -n cloudkart
   helm rollback cloudkart <last_good_revision> -n cloudkart
   ```

### Pod restarting frequently (alert: `CloudKartPodRestartingFrequently`)

1. Get crash logs of the previous container:
   ```bash
   kubectl -n cloudkart logs <pod> --previous
   ```
2. Common causes:
   - OOM kill → check `kubectl describe pod` → look for `OOMKilled`. Raise memory limit.
   - Failed health check → service slow on startup. Adjust `initialDelaySeconds`.
   - Crashing on boot → bad env var / secret. Verify ConfigMap + Secret.

### Inter-service latency high (alert: `CloudKartProductServiceCallSlow`)

1. Check product-service pod health:
   ```bash
   kubectl -n cloudkart top pod -l app=product-service
   ```
2. Check Prometheus query:
   ```promql
   histogram_quantile(0.95, rate(product_service_call_duration_seconds_bucket[5m]))
   ```
3. If product-service is healthy, investigate network (rare in single-node K3s but happens in multi-node EKS).

---

## Routine procedures

### Deploy a new version

```bash
# 1) Push code → CI builds + tests + pushes to ghcr.io/<owner>/<service>:<sha>
# 2) Trigger Jenkins or run locally:
./jenkins/scripts/deploy.sh dev <new-tag>
```

### Roll back a release

```bash
helm history cloudkart -n cloudkart
helm rollback cloudkart <revision> -n cloudkart --wait
# OR use the script:
./scripts/rollback.sh dev
```

### Scale a service

```bash
# Temporary (overridden on next helm upgrade):
kubectl -n cloudkart scale deployment user-service --replicas=3

# Permanent (in Helm values):
helm upgrade cloudkart ./helm/cloudkart \
  -f ./helm/cloudkart/values-dev.yaml \
  --set services.user-service.replicas=3 \
  --namespace cloudkart
```

### Add a new secret

```bash
# 1) Edit helm/cloudkart/values.yaml — add to `jwt:` or similar block.
# 2) helm upgrade — the K8s Secret rolls automatically.
# 3) Restart pods that need the new secret:
kubectl -n cloudkart rollout restart deployment/<service>
```

### Cluster smoke test

```bash
./scripts/health-check.sh cloudkart
```

---

## Local dev recovery

### Minikube cluster is sluggish / weird state

```bash
minikube stop
minikube start --driver=docker
minikube image load cloudkart/user-service:dev
minikube image load cloudkart/product-service:dev
minikube image load cloudkart/order-service:dev
minikube image load cloudkart/frontend:dev
helm upgrade --install cloudkart ./helm/cloudkart \
  -f ./helm/cloudkart/values-dev.yaml \
  --namespace cloudkart --create-namespace --wait
```

### Full reset

```bash
minikube delete
minikube start --driver=docker
# (then redo image load + helm install)
```

### Free up disk after lots of builds

```bash
docker system prune -af --volumes
minikube ssh -- 'docker system prune -af'
```

---

## AWS production

### Spin up

```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
# edit allowed_ssh_cidr to YOUR_IP/32
terraform init
terraform apply
# (deploy CloudKart via Helm using the new kubeconfig — see terraform/README.md)
```

### Tear down (avoid charges)

```bash
cd terraform
terraform destroy
```

### Disaster recovery

- **State corruption**: roll back to a previous version in S3 (versioning enabled).
- **Compromised EC2**: `terraform destroy` then re-apply — new instance with fresh keys.
- **Lost kubeconfig**: re-fetch via `scp` (see `terraform/README.md`).
