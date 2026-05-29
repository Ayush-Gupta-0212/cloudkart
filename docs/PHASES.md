# 🛣️ The CloudKart Journey

A reverse-chronological log of every phase, what was built, what was learned, and the verifying evidence.

---

## Phase 5 — Observability + Security + Docs ✅

**Built:**
- Prometheus + Grafana + Alertmanager via `kube-prometheus-stack` Helm chart
- Loki + Promtail for log aggregation
- Custom `ServiceMonitor` so Prometheus scrapes CloudKart backends
- Custom `PrometheusRule` with 4 alert rules covering the golden signals
- Custom Grafana dashboard JSON (`CloudKart Overview`)
- Comprehensive docs: ARCHITECTURE, SECURITY, RUNBOOK, RESUME

**Verified:**
- 3 scrape targets up (one per backend pod)
- 1,600+ requests counted per service in `http_requests_total`
- All 4 alert rules loaded, currently `inactive` (system healthy)
- Grafana accessible (admin/cloudkart)

**Lesson:** Prometheus Operator's `ServiceMonitor` CRD is the modern way to configure scraping — no editing `prometheus.yaml`.

---

## Phase 4 — Terraform + AWS ✅

**Built:**
- VPC module (2 public subnets across AZs, IGW, route table)
- EC2 module (t2.micro free-tier, encrypted gp3, IMDSv2 only)
- Security groups module (SSH restricted, HTTP/HTTPS/K3s API)
- S3 + DynamoDB remote state backend
- Cloud-init script that installs K3s + Nginx Ingress on boot
- Auto-lookup latest Ubuntu 22.04 AMI

**Verified:**
- `terraform fmt -recursive` cleaned the code
- `terraform init -backend=false` succeeded
- `terraform validate` → "Success! The configuration is valid."

**Lesson:** Remote backend (S3+DynamoDB) is non-negotiable for any team Terraform; state corruption is recoverable thanks to S3 versioning.

---

## Phase 3 — Helm + CI/CD ✅

**Built:**
- Helm chart with `range` loop over services in templates
- 4 values files: defaults + dev + staging + prod
- ConfigMap, Secret, Deployment, Service, Ingress, HPA templates
- GitHub Actions CI: matrix tests (3 backends), helm lint, Trivy scan, GHCR push
- Jenkinsfile (declarative pipeline) with `--atomic` deploy and auto-rollback

**Verified:**
- `helm lint` clean
- `helm install` → 4 pods running
- `helm upgrade --set config.LOG_LEVEL=debug` → debug active
- `helm rollback cloudkart 1` → reverted to info
- `helm history` shows full audit trail

**Lesson:** `--atomic` flag on `helm upgrade` automatically rolls back on failure — you almost never need to manually rollback.

---

## Phase 2 — Kubernetes (Minikube) ✅

**Built:**
- Minikube cluster (Docker driver, 2 CPU, 4 GB RAM)
- Raw K8s manifests: Deployment + Service per microservice
- Ingress with path-based routing
- HPA on product-service (CPU 70%)
- ConfigMap + Secret for shared config

**Verified:**
- End-to-end e-commerce flow through Ingress
- Port-forward to ingress-nginx-controller proved real cluster traffic

**Lessons:**
1. `runAsNonRoot: true` requires a **numeric** UID — `USER app` (name) fails the check. Fixed by rebuilding all 3 backends with `USER 1001`.
2. Multi-replica + in-memory store = race conditions. Registration hit pod A, login hit pod B. Scaled down to 1 replica until PostgreSQL is added.

---

## Phase 1 — Microservices + Docker ✅

**Built:**
- `user-service` (Node + Express + JWT + bcrypt) — 10 tests
- `product-service` (Node + Express + seeded catalog) — 8 tests
- `order-service` (Node + Express + JWT + fetch to product-service) — 14 tests
- `frontend` (React + Vite + Nginx with reverse-proxy)
- `docker-compose.yml` orchestrating all 4 with healthchecks + shared bridge network
- Multi-stage Alpine Dockerfiles, all under 250 MB
- Per-service `/health`, `/ready`, `/metrics` (Prometheus format)

**Verified:**
- 32 tests passing, ~80% average coverage
- `docker compose up -d` brings up entire stack in one command
- Full register → login → browse → cart → order flow works
- Nginx reverse-proxy in frontend container correctly routes `/api/*` to backends

**Lesson:** Multi-stage Docker + Alpine + non-root cuts images from ~600 MB to ~245 MB and removes most CVEs.

---

## Phase 0 — Environment Setup ✅

**Installed:** WSL2 + Ubuntu 22.04, Docker Desktop, Node.js 22, kubectl, Helm, Terraform, AWS CLI, Minikube.

**Configured:** Git defaults, SSH key for GitHub, project skeleton, initial commit.

---

## Future Enhancements (not part of the 5-week scope)

- **PostgreSQL StatefulSet** (so backends can scale > 1 replica)
- **Redis** for cart sessions
- **Sealed Secrets** so secrets can live in git
- **cert-manager + Let's Encrypt** for automatic HTTPS
- **NetworkPolicy** default-deny
- **ArgoCD** GitOps pull-based deployments
- **Tempo / Jaeger** distributed tracing
- **Sigstore + Cosign** image signing
