# 📝 Resume & Interview Prep

Everything you need to put CloudKart on a resume, LinkedIn, or talk about in an interview.

---

## 🎯 ATS-Friendly Resume Description (3–5 bullets)

> **CloudKart — Cloud-Native Microservices E-Commerce Platform** ([GitHub](https://github.com/Ayush-Gupta-0212/cloudkart))
> 
> - Designed and deployed a 4-microservice e-commerce platform on Kubernetes (Minikube + AWS K3s) using **Docker, Helm, and Terraform** — achieving zero-downtime rolling deployments verified through `helm upgrade` and `helm rollback`.
> - Built a multi-stage **CI/CD pipeline with GitHub Actions and Jenkins** that runs lint, **Jest unit tests (32 tests across 3 services)**, **Trivy image vulnerability scans**, and pushes container images to GHCR, then triggers `helm upgrade --atomic` for automatic rollback on failure.
> - Provisioned AWS infrastructure as code with **Terraform** (VPC, EC2 with K3s + Nginx Ingress, security groups, S3 remote state with DynamoDB locking), validated with `terraform validate` and parameterized for dev/staging/prod.
> - Implemented full **observability stack** (Prometheus, Grafana, Loki, Alertmanager) with custom **ServiceMonitor** + **PrometheusRule** for the four golden signals; verified end-to-end inter-service HTTP via a custom histogram metric.
> - Applied **DevSecOps**: non-root containers (UID 1001 for K8s `runAsNonRoot` verification), dropped Linux capabilities, K8s Secrets for JWT, Trivy in CI fails the build on CRITICAL/HIGH, IMDSv2-only EC2, encrypted EBS volumes, restricted SSH CIDR.

**Tech**: Kubernetes • Docker • Helm • Terraform • AWS (EC2, VPC, IAM, S3, DynamoDB) • GitHub Actions • Jenkins • Prometheus • Grafana • Loki • Nginx • Node.js • React • Bash

---

## 💼 LinkedIn "About this project" version

> Built CloudKart — a production-grade microservices e-commerce platform demonstrating modern DevOps end-to-end.
> 
> 🛠️ **Stack**: Kubernetes • Docker • Helm • Terraform • AWS • GitHub Actions • Jenkins • Prometheus • Grafana • Loki
> 
> ✅ **Highlights**: 4 microservices with 32 passing tests · zero-downtime rolling deployments · automated Trivy security scanning in CI · GHCR image registry · Helm chart with dev/staging/prod values · `terraform validate`-clean IaC for AWS free-tier · Prometheus golden-signal alerts
> 
> All code, manifests, Terraform, and CI pipelines on GitHub.
> 
> #DevOps #Kubernetes #AWS #Terraform #Helm #DevSecOps #CICD

---

## 🎙️ 5-Minute Project Explanation (interview / viva)

> "CloudKart is a cloud-native e-commerce platform I built over 5 weeks to learn modern DevOps end-to-end.
> 
> The application is **4 microservices** — a React frontend, and 3 Node.js services for users (with JWT auth), product catalog, and orders/cart. Order-service calls product-service over HTTP to validate stock and snapshot prices, so it demonstrates real inter-service communication.
> 
> Each service is **containerized with Docker**, using multi-stage Alpine builds and a non-root user with a numeric UID 1001 — that last detail matters because Kubernetes can only verify `runAsNonRoot` for numeric UIDs.
> 
> Locally, **docker-compose** brings up all 4 containers on a shared bridge network. Then I move to **Kubernetes via Minikube** — Deployments, Services, Ingress, ConfigMap, Secret, and an HPA. Same images, just orchestrated differently.
> 
> The K8s manifests are then **packaged as a Helm chart** with three values files for dev, staging, and prod. I demonstrated the full release lifecycle — `helm install`, `helm upgrade` (changed log level to debug), then `helm rollback` to revision 1 — all visible in `helm history`.
> 
> CI runs on every push via **GitHub Actions** — a matrix tests all 3 backends in parallel, then a separate job builds + Trivy scans + pushes to GHCR. CD is a **Jenkinsfile** that does `helm upgrade --atomic` so a failed deploy auto-rolls-back.
> 
> **Infrastructure is Terraform** — VPC, EC2 with K3s installed via user-data, security groups with restricted SSH, and S3 + DynamoDB for remote state with locking. It validates cleanly; one `terraform apply` deploys it.
> 
> Observability is **Prometheus + Grafana + Loki** installed via Helm. Each backend exposes `/metrics` and `/health` and `/ready`. I wrote a custom histogram `product_service_call_duration_seconds` so I can graph inter-service p50/p95/p99 latency.
> 
> The thing I'm proudest of is the **production lesson**: when I scaled to 2 replicas, login broke because each pod had its own in-memory user store. That's exactly why production microservices use a shared database — I documented this rather than hide it, and it became the cleanest teaching moment in the whole project."

---

## ⚡ Top Interview Questions to Expect

| Q | Sketch of answer |
|---|--------|
| **What's CI vs CD?** | CI = test+build on every commit; CD = auto-deploy passed builds. CloudKart has both: GHA for CI, Jenkins for CD. |
| **Container vs VM?** | Containers share host kernel, start in <1s, smaller; VMs ship a full OS, slower, more isolated. |
| **Multi-stage Dockerfile benefit?** | Final image excludes build tools + dev deps — smaller (180 MB vs 600 MB), more secure, faster to pull. |
| **What's a Pod?** | Smallest K8s unit, 1+ containers sharing network + storage. Always wrapped in higher-level controllers (Deployment, StatefulSet). |
| **Service types?** | ClusterIP (internal only), NodePort (port on every node), LoadBalancer (cloud LB), ExternalName (DNS CNAME). |
| **What is Ingress?** | HTTP/HTTPS router at the cluster edge. CloudKart uses it to send `/api/users/*` to user-service, `/` to frontend. |
| **Rolling update?** | New pods come up healthy, old ones drain, zero downtime. Configured via `strategy.rollingUpdate` (maxSurge/maxUnavailable). |
| **How does HPA work?** | Reads metrics from metrics-server; scales pods between min and max replicas when CPU/memory exceeds threshold. |
| **ConfigMap vs Secret?** | Both inject config into pods. Secrets are base64-encoded (not encrypted at rest by default — fix with Sealed Secrets / KMS). |
| **Helm vs raw kubectl?** | Helm = templating + versioning + rollback. Raw kubectl = imperative. CloudKart uses both: kubectl in Phase 2 for learning, Helm in Phase 3 for production. |
| **Terraform vs Ansible?** | Terraform = provisioning (create infra); Ansible = configuration (configure existing servers). |
| **Why remote Terraform state?** | Team collaboration, locking via DynamoDB, S3 versioning, secrets stay out of git. |
| **Four golden signals?** | Latency, traffic, errors, saturation. CloudKart's PrometheusRule alerts on all four. |
| **Metrics vs logs?** | Metrics = numbers over time (aggregatable, cheap); logs = discrete events (searchable, expensive). |
| **Trivy in CI — why?** | Fails the build if image has HIGH/CRITICAL CVEs, blocking insecure images from reaching prod. |
| **runAsNonRoot — why numeric UID?** | K8s can only verify the user isn't root if the UID is a number. Image with `USER app` fails the check. |
| **How would you rollback a bad deploy?** | `helm rollback cloudkart <revision>`. Or `--atomic` flag auto-rolls back on Helm upgrade failure. |
| **You scaled to 2 replicas and login broke. Why?** | In-memory state isn't shared between pods. Register hit pod A, login hit pod B. Production fix = shared DB (Postgres/Redis). |

---

## 🎯 Skills You Can Claim

| Domain | Specific skills |
|--------|----------------|
| **Containers** | Docker, Docker Compose, multi-stage builds, layer caching, Alpine, healthchecks |
| **Orchestration** | Kubernetes (Deployment, Service, Ingress, ConfigMap, Secret, HPA), rolling updates, probes |
| **Package management** | Helm 3 (templates, values, hooks, lifecycle, rollback) |
| **IaC** | Terraform 1.6 (modules, providers, state management, remote backend, validation) |
| **Cloud** | AWS (EC2, VPC, IAM, S3, DynamoDB, IGW, security groups, IMDSv2, gp3) |
| **CI/CD** | GitHub Actions (matrix, caching, SARIF, GHCR), Jenkins (declarative pipeline) |
| **Observability** | Prometheus, Grafana, Loki, Alertmanager, ServiceMonitor, PrometheusRule, custom metrics |
| **DevSecOps** | Trivy, runAsNonRoot, dropped capabilities, K8s Secrets, IMDSv2, encrypted EBS |
| **Languages** | Node.js (Express, JWT, bcrypt, pino), React (Vite, hooks), Bash |
| **Testing** | Jest, Supertest, integration testing, mocking `global.fetch`, coverage reports |
| **Linux** | apt, systemctl, journalctl, curl, jq, ssh, scp, cloud-init |
| **Networking** | DNS (K8s service discovery), TCP, HTTP, reverse proxy, ingress, CIDR |
| **Git / GitHub** | Conventional commits, feature branches, PRs, GitHub Container Registry, SSH keys |

---

## 🚫 Common Mistakes to Avoid in Interviews

- ❌ "I followed a tutorial" → instead: "I chose Helm over raw kubectl because…"
- ❌ Showing only code → bring screenshots of Grafana, helm history, kubectl get pods
- ❌ Memorized definitions → connect every tool to a specific problem it solves in CloudKart
- ❌ Pretending nothing went wrong → the 2-replica login bug is a strong story
- ❌ "Kubernetes is easy" → it's not; describe one concrete thing that took you time

---

## 📸 Screenshots to Have Ready

1. `helm history cloudkart` (showing install → upgrade → rollback)
2. `kubectl get pods` after deploy (all Running, all 1/1)
3. Grafana CloudKart Overview dashboard
4. GitHub Actions CI run summary
5. Trivy SARIF results in Security tab
6. `docker compose ps` showing all 4 healthy
7. `terraform validate` success
8. One curl trace going register → login → cart → order (proves end-to-end)
