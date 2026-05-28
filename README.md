# CloudKart

> A cloud-native microservices e-commerce platform with full DevSecOps pipeline.
> Major DevOps project demonstrating end-to-end production-grade practices.

[![CI](https://img.shields.io/badge/CI-pending-lightgrey)](#)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow)](#)
[![Kubernetes](https://img.shields.io/badge/Kubernetes-ready-326CE5)](#)

---

## Architecture (high level)

```
Browser ─► Ingress (Nginx + HTTPS) ─► Kubernetes Services
                                       ├── frontend (React)
                                       ├── user-service     (Node.js)
                                       ├── product-service  (Node.js)
                                       └── order-service    (Node.js)
                                              │
                                              ├── PostgreSQL
                                              └── Redis

CI: GitHub Actions  →  DockerHub  →  Jenkins CD  →  helm upgrade
Observability: Prometheus + Grafana + Loki
IaC: Terraform on AWS (VPC + EC2 + K3s)
```

## Stack

| Category | Tools |
|----------|-------|
| Languages | Node.js, React |
| Containers | Docker, Docker Compose |
| Orchestration | Kubernetes (K3s on AWS), Helm |
| IaC | Terraform |
| Cloud | AWS — EC2, VPC, IAM, S3, Route53 |
| CI/CD | GitHub Actions, Jenkins |
| Observability | Prometheus, Grafana, Loki |
| Security | Trivy, Sealed Secrets, cert-manager, RBAC |
| Datastore | PostgreSQL, Redis |

## Project Structure

```
cloudkart/
├── services/         # 4 microservices (frontend, user, product, order)
├── kubernetes/       # raw K8s manifests
├── helm/             # Helm chart
├── terraform/        # AWS infrastructure as code
├── .github/workflows # CI pipelines
├── jenkins/          # CD pipelines
├── monitoring/       # Prometheus/Grafana/Loki configs
├── scripts/          # automation scripts
└── docs/             # architecture, runbook, setup
```

## Status

🚧 **Work in progress** — built phase by phase over 5 weeks.

- [ ] Phase 0 — Environment setup
- [ ] Phase 1 — Microservices + Docker
- [ ] Phase 2 — Kubernetes (Minikube)
- [ ] Phase 3 — Helm + CI/CD
- [ ] Phase 4 — AWS + Terraform
- [ ] Phase 5 — Monitoring + Security + Docs

## Quick start (after Phase 1)

```bash
docker compose up -d
# Frontend → http://localhost:8080
# user-svc  → http://localhost:3001
# product   → http://localhost:3002
# order     → http://localhost:3003
```

## License

MIT
