# Security / DevSecOps Practices

CloudKart applies security in every stage of the SDLC ("shift left").

## Code stage

| Practice | Tool | Status |
|----------|------|--------|
| Secret scanning | GitHub native secret scanning | ✅ enabled by default on public repos |
| Dependency scanning | `npm audit` (manual) | ✅ run before commit |
| Conventional commits | Manual | ✅ via commit message convention |

## Build stage (CI)

| Practice | Tool | Status |
|----------|------|--------|
| Lockfile-strict installs | `npm ci` | ✅ in CI and Dockerfiles |
| Static image scanning | Trivy (HIGH/CRITICAL fails build) | ✅ in `.github/workflows/ci.yml` |
| SARIF upload | GitHub Code Scanning | ✅ Trivy SARIF → Security tab |
| Build caching | docker buildx + GHA cache | ✅ in CI |
| Pinned action versions | `@v4` not `@main` | ✅ |

## Image stage

| Practice | Implementation | Status |
|----------|----------------|--------|
| Minimal base | `node:22-alpine` (~150 MB) | ✅ |
| Multi-stage build | Removes dev deps + build tools | ✅ |
| Non-root user | UID 1001 (numeric for K8s verification) | ✅ |
| `.dockerignore` | Excludes secrets, tests, .git | ✅ |
| `HEALTHCHECK` | Container-level liveness | ✅ |

## Runtime stage (Kubernetes)

| Practice | Manifest | Status |
|----------|----------|--------|
| `runAsNonRoot: true` | securityContext on Deployments | ✅ |
| `allowPrivilegeEscalation: false` | securityContext | ✅ |
| Drop all Linux capabilities | `capabilities.drop: [ALL]` | ✅ |
| Resource limits | `limits.cpu/memory` on all pods | ✅ |
| Liveness + readiness probes | All backend pods | ✅ |
| Secrets via K8s Secret | Not env literals | ✅ |
| ConfigMap for non-sensitive | `envFrom: configMapRef` | ✅ |

## Recommended next steps (future enhancements)

- [ ] **Sealed Secrets** — encrypt secrets so they can be safely committed
- [ ] **NetworkPolicy** — default-deny + explicit allows between namespaces
- [ ] **OPA Gatekeeper / Kyverno** — policy-as-code for cluster admission
- [ ] **Pod Security Standards (restricted)** — namespace-level enforcement
- [ ] **cert-manager + Let's Encrypt** — automated HTTPS
- [ ] **External Secret Manager** — AWS Secrets Manager or HashiCorp Vault
- [ ] **Falco** — runtime threat detection
- [ ] **Image signing** — Cosign + sigstore

## IAM / AWS

| Practice | Notes |
|----------|-------|
| Never use root | Use IAM user with programmatic access |
| Least privilege | Scope policies to what Terraform needs |
| MFA on IAM user | Mandatory in production |
| IMDSv2 only | `http_tokens = "required"` in EC2 module |
| EBS encryption | `encrypted = true` in EC2 module |
| State bucket encryption | `encrypt = true` in `backend.tf` |
| Restrict SSH CIDR | Set `allowed_ssh_cidr = "YOUR_IP/32"` in tfvars |

## Reporting a security issue

If you find a vulnerability, please email `itsayush0212@gmail.com` rather than opening a public issue.
