# 🛒 CloudKart

> **Cloud-native microservices e-commerce platform** demonstrating end-to-end DevOps: containers, Kubernetes, Helm, CI/CD, IaC, and full observability.
> Built as a college major project — runs on a student laptop, ships to AWS free tier.

[![CI](https://img.shields.io/badge/CI-passing-success)](https://github.com/Ayush-Gupta-0212/cloudkart/actions)
[![Kubernetes](https://img.shields.io/badge/Kubernetes-1.35-326CE5?logo=kubernetes&logoColor=white)](https://kubernetes.io)
[![Helm](https://img.shields.io/badge/Helm-3-0F1689?logo=helm&logoColor=white)](https://helm.sh)
[![Terraform](https://img.shields.io/badge/Terraform-1.6-844FBA?logo=terraform&logoColor=white)](https://www.terraform.io)
[![Docker](https://img.shields.io/badge/Docker-29-2496ED?logo=docker&logoColor=white)](https://docker.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 🏗️ What it is

**4 microservices** (React + 3× Node) packaged as **4 Docker images**, orchestrated by **Kubernetes**, configured via a **Helm chart** (dev/staging/prod values), provisioned on **AWS** with **Terraform**, with **GitHub Actions CI** building+scanning+pushing to GHCR and **Jenkins CD** doing `helm upgrade`. Full **Prometheus + Grafana + Loki** observability stack. DevSecOps practices throughout.

| | |
|---|---|
| ⏱️ Build time | 5 weeks |
| 📦 Services | 4 (user, product, order, frontend) |
| 🧪 Tests | 32 passing (~80% avg coverage) |
| 🐳 Images | All Alpine, multi-stage, non-root, ~245MB each |
| ☸️ K8s objects | Deployments + Services + Ingress + Secret + ConfigMap + HPA |
| 📊 Observability | Prometheus, Grafana, Loki, Alertmanager, ServiceMonitor, PrometheusRule |
| 🔒 DevSecOps | Trivy in CI, runAsNonRoot, dropped caps, K8s Secrets, IMDSv2, encrypted EBS |
| ☁️ AWS resources | VPC, 2 public subnets across AZs, EC2 (K3s), SG, S3 (state), DynamoDB (lock) |

---

## 🖼️ Architecture

```
Browser → Ingress (Nginx) ──┬─► frontend (React + Nginx)
                            ├─► user-service    (Node + JWT)
                            ├─► product-service (Node, catalog)
                            └─► order-service   (Node)─HTTP─► product-service

Observability  : Prometheus + Grafana + Loki + Alertmanager
Build / Deploy : GitHub Actions CI → ghcr.io → Jenkins CD → helm upgrade
Infra          : Terraform → AWS (VPC, EC2 K3s, S3 backend)
```

Full diagram + request walkthrough: **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)**.

---

## 🧰 Tech Stack

| Layer | Tools |
|-------|-------|
| **Languages** | Node.js 22, React 18, Bash |
| **Containers** | Docker, Docker Compose |
| **Orchestration** | Kubernetes 1.35, K3s, Minikube |
| **Package mgr** | Helm 3 |
| **IaC** | Terraform 1.6, AWS Provider 5 |
| **Cloud** | AWS (EC2, VPC, IAM, S3, DynamoDB, IGW, SG) |
| **CI/CD** | GitHub Actions, Jenkins, GHCR |
| **Ingress** | Nginx Ingress Controller |
| **Observability** | Prometheus, Grafana, Loki, Promtail, Alertmanager |
| **Security** | Trivy, K8s Secrets, RBAC, runAsNonRoot, IMDSv2 |
| **Quality** | Jest, Supertest, ESLint, Helm lint, terraform fmt/validate |
| **OS** | Alpine Linux, Ubuntu 22.04 (in EC2) |

---

## 🚀 Quick Start

### Local — Docker Compose (one command)

```bash
git clone git@github.com:Ayush-Gupta-0212/cloudkart.git
cd cloudkart
docker compose up --build -d
# Open http://localhost:8080
```

### Local — Kubernetes (Minikube)

```bash
# (assumes minikube + kubectl + helm installed)
minikube start --driver=docker --cpus=2 --memory=4096
minikube addons enable ingress

# Load images into the cluster
for s in user-service product-service order-service frontend; do
  docker build -t cloudkart/$s:dev ./services/$s
  minikube image load cloudkart/$s:dev
done

# Deploy via Helm
helm upgrade --install cloudkart ./helm/cloudkart \
  -f ./helm/cloudkart/values-dev.yaml \
  --namespace cloudkart --create-namespace --wait

# Access via Ingress
kubectl port-forward -n ingress-nginx svc/ingress-nginx-controller 8080:80
# Open http://localhost:8080
```

### Production — AWS

See **[terraform/README.md](terraform/README.md)**.

---

## 📂 Repository Structure

```
cloudkart/
├── services/                    # 4 microservices, each independently buildable
│   ├── user-service/            #   Express + JWT + bcrypt
│   ├── product-service/         #   Express + seeded catalog
│   ├── order-service/           #   Express + cart + product-service client
│   └── frontend/                #   React + Vite + Nginx (multi-stage)
├── kubernetes/base/             # Raw K8s manifests (Phase 2 — pre-Helm)
├── helm/cloudkart/              # Helm chart (Phase 3 — production deploys)
│   ├── values.yaml              #   defaults
│   ├── values-dev.yaml          #   dev overrides
│   ├── values-staging.yaml      #   staging overrides
│   ├── values-prod.yaml         #   prod overrides (3 replicas, cert-manager, etc.)
│   └── templates/               #   parameterized manifests
├── terraform/                   # AWS Infrastructure as Code (Phase 4)
│   ├── main.tf, providers.tf, backend.tf, variables.tf, outputs.tf
│   └── modules/{vpc, ec2, security-groups}/
├── monitoring/                  # Phase 5 — observability configs
│   ├── prometheus/              #   ServiceMonitor + alert rules
│   ├── grafana/dashboards/      #   CloudKart Overview dashboard JSON
│   └── loki/
├── .github/workflows/ci.yml     # GitHub Actions CI (Phase 3)
├── jenkins/                     # Declarative CD pipeline (Phase 3)
├── scripts/                     # Bash automation (deploy, rollback, health-check, backup)
├── docs/                        # ARCHITECTURE.md, SECURITY.md, RUNBOOK.md, SETUP.md
├── docker-compose.yml           # Local dev orchestration
└── README.md
```

---

## ✅ What Each Phase Delivered

| Phase | Outcome |
|-------|---------|
| **0 — Env setup** | Git, Docker, Node, WSL2, kubectl, Helm, Terraform installed; SSH key on GitHub |
| **1 — Microservices + Docker** | 4 services with tests, Dockerfiles, docker-compose with healthchecks |
| **2 — Kubernetes** | Minikube cluster, raw manifests, Ingress routing, HPA, secrets, configmaps |
| **3 — Helm + CI/CD** | Chart with dev/staging/prod values, GitHub Actions matrix CI, Jenkinsfile CD |
| **4 — Terraform + AWS** | VPC + EC2 (K3s) + SG + S3/DynamoDB backend, validated with `terraform validate` |
| **5 — Observability + Docs** | Prometheus + Grafana + Loki + Alertmanager, custom dashboard, alert rules |

Every phase is its own commit on `main` — git log reads like a tutorial.

---

## 🧪 Verified Working

- ✅ `npm test` — 32 tests pass across 3 backend services
- ✅ `docker compose up -d` — full stack via single command
- ✅ `helm install` — deployed on Minikube, end-to-end e-commerce flow works through Ingress
- ✅ `helm upgrade` + `helm rollback` — full revision history works
- ✅ `terraform validate` — IaC is syntactically + semantically clean
- ✅ `helm lint` — chart is valid
- ✅ Cross-service HTTP via service DNS proven (order-service → product-service)
- ✅ Prometheus scraped metrics from real container traffic (`http_requests_total`)

---

## 📚 Documentation

- **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** — system design, request flow, component justification
- **[docs/SECURITY.md](docs/SECURITY.md)** — DevSecOps practices per stage
- **[docs/RUNBOOK.md](docs/RUNBOOK.md)** — on-call playbook, common procedures
- **[docs/SETUP.md](docs/SETUP.md)** — prerequisite installation
- **[terraform/README.md](terraform/README.md)** — AWS deployment guide

---

## 🛣️ Roadmap / Future Enhancements

- [ ] **PostgreSQL** for users + orders (so backends can scale > 1 replica)
- [ ] **Redis** for cart sessions
- [ ] **Sealed Secrets** so secrets can be committed safely
- [ ] **cert-manager + Let's Encrypt** for automatic HTTPS
- [ ] **NetworkPolicy** default-deny between namespaces
- [ ] **ArgoCD** — GitOps pull-based deployments
- [ ] **Istio / Linkerd** — service mesh for mTLS + observability
- [ ] **Tempo / Jaeger** — distributed tracing (the 3rd pillar of observability)
- [ ] **Karpenter / Cluster Autoscaler** — node-level autoscaling on EKS
- [ ] **OPA / Kyverno** — policy-as-code admission control

---

## 💰 Cost

- **Local dev**: $0 (laptop only)
- **AWS free tier**: ~$0/month for first 12 months if you stay under EC2 t2.micro 750h/mo + EBS 30 GB
- **After free tier**: ~$10–15/month for t2.micro 24/7

Always `terraform destroy` when not actively using it. Set a billing alarm at $1.

---

## 👤 Author

**Ayush Gupta** — `itsayush0212@gmail.com` — [GitHub](https://github.com/Ayush-Gupta-0212)

---

## 📜 License

MIT — see [LICENSE](LICENSE)
