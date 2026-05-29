# CloudKart Architecture

## High-Level Diagram

```
                          ┌─────────────────────────────────────────┐
                          │           User's Browser                │
                          └────────────────────┬────────────────────┘
                                               │  HTTPS (in prod)
                                               ▼
              ┌───────────────────────────────────────────────────────────┐
              │            Nginx Ingress Controller                       │
              │  Path-based routing into the cluster:                     │
              │    /api/users/*    → user-service                         │
              │    /api/products/* → product-service                      │
              │    /api/cart/*     → order-service                        │
              │    /api/orders/*   → order-service                        │
              │    /*              → frontend (React SPA)                 │
              └────────────────────┬──────────────────────────────────────┘
                                   │
                       ┌───────────┴───────────┬────────────┬─────────────┐
                       ▼                       ▼            ▼             ▼
              ┌──────────────┐         ┌──────────────┐ ┌────────┐ ┌────────────┐
              │  user-svc    │         │ product-svc  │ │ order  │ │  frontend  │
              │ Node + JWT   │         │ Node catalog │ │  svc   │ │ React+Nginx│
              │ Replicas: 1  │         │ Replicas: 1  │ │ Rep: 1 │ │ Replicas: 2│
              └──────┬───────┘         └──────┬───────┘ └────┬───┘ └────────────┘
                     │                        │              │
                     │   inter-service HTTP   │              │
                     │   (Node fetch)         ▼              │
                     │                ┌──────────────┐       │
                     │                │ product-svc  │◄──────┘
                     │                └──────────────┘
                     │  (in-memory stores — replace with PostgreSQL for HA)
                     ▼
              ┌─────────────────────────────────────────────────────────┐
              │   K8s Secret (JWT_SECRET) + ConfigMap (LOG_LEVEL, etc.) │
              └─────────────────────────────────────────────────────────┘

  ┌──────────────────────────────── Observability ─────────────────────────────┐
  │  Prometheus  ──scrapes──▶  /metrics on every pod (15s interval)            │
  │  Grafana     ──queries─▶  Prometheus + Loki for dashboards                 │
  │  Loki        ──collects─▶ pod stdout via Promtail DaemonSet                │
  │  Alertmanager ──fires──▶  on PrometheusRule conditions                     │
  └────────────────────────────────────────────────────────────────────────────┘

  ┌─────────────────── Build & Deploy (Phase 3 + 4) ─────────────────────────┐
  │   git push  →  GitHub Actions CI:                                        │
  │      • npm test (3 services in parallel matrix)                          │
  │      • helm lint                                                         │
  │      • docker build + Trivy scan                                         │
  │      • push to ghcr.io on main                                           │
  │   Jenkins CD  →  helm upgrade --atomic per environment                   │
  │   Terraform  →  AWS VPC + EC2 (K3s) on apply                             │
  └──────────────────────────────────────────────────────────────────────────┘
```

## Request Flow Example — "User adds a Mechanical Keyboard to cart"

```
1. User clicks "Add to cart" in React SPA
2. Browser sends:
     POST http://cloudkart.local/api/cart/items
     Authorization: Bearer <jwt>
     Body: { productId: "abc-123", quantity: 1 }
3. Nginx Ingress routes /api/cart/* → order-service
4. order-service:
     a. Auth middleware verifies JWT (HS256, shared secret in K8s Secret)
     b. cart route handler calls product-client.getProduct("abc-123")
     c. product-client does:
        GET http://product-service.cloudkart.svc.cluster.local:3000/api/products/abc-123
        with AbortController timeout = 3000ms
     d. product-service returns { id, name, priceInCents, stock }
     e. order-service validates stock ≥ quantity, snapshots price, persists to in-memory cart
     f. Returns updated cart {items, total, currency}
5. React updates UI
6. Meanwhile, Prometheus is scraping /metrics on all 3 backends every 15s
7. Logs flow stdout → Promtail (DaemonSet) → Loki
8. Grafana shows live RPS, error rate, inter-service latency
```

## Why each component?

| Component | Solves |
|-----------|--------|
| **Microservices** | Independent deploys, fault isolation, polyglot teams |
| **Docker** | "Works on my machine" → "Works everywhere" |
| **Kubernetes** | Self-healing, rolling updates, autoscaling, service discovery |
| **Helm** | Versioned, reproducible, multi-env deploys |
| **Ingress** | One TLS-terminated entry point, path-based routing |
| **HPA** | Auto-scales pods when CPU exceeds threshold |
| **Prometheus** | Time-series metrics, alerting source of truth |
| **Grafana** | Visualization + one place to see all metrics + logs |
| **Loki** | Cheap log aggregation, queryable like Prometheus |
| **Trivy in CI** | Catches known CVEs before image ships |
| **K8s Secret** | Sensitive data out of code |
| **runAsNonRoot** | Limits blast radius of container escape |
| **Terraform** | Infra in version control, reproducible across teams |
| **S3 + DynamoDB backend** | Team-shared Terraform state with locking |
| **K3s on EC2** | Production-like K8s on free-tier (vs $73/mo EKS) |

## Known Limitations (deferred for clarity)

1. **In-memory state** in user/product/order services → only 1 replica works.
   Fix: add PostgreSQL StatefulSet; cart can move to Redis.
2. **JWT secret** stored as plain K8s Secret (base64, not encrypted at rest).
   Fix: install Sealed Secrets or use external secret manager.
3. **TLS** not configured in dev. In prod, add cert-manager + Let's Encrypt.
4. **product-service** seeds with random UUIDs on boot → different IDs per pod.
   Fix: deterministic seed or move to DB.
