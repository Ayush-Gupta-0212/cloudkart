# Setup Guide (Phase 0)

This document tracks the one-time environment setup for CloudKart on Windows 11.

## Prerequisites

| Tool | Min Version | Purpose |
|------|-------------|---------|
| Git | 2.40+ | Version control |
| Node.js | 20 LTS+ | Runs all microservices |
| npm | 10+ | Package manager |
| VS Code | latest | Editor |
| WSL2 + Ubuntu 22.04 | latest | Linux env for Docker + DevOps tooling |
| Docker Desktop | latest | Build/run containers |
| kubectl | 1.29+ | K8s CLI (Phase 2) |
| Minikube | 1.32+ | Local K8s cluster (Phase 2) |
| Helm | 3.13+ | K8s package manager (Phase 3) |
| Terraform | 1.6+ | IaC (Phase 4) |
| AWS CLI | v2 | AWS (Phase 4) |

## Step 1 — Configure Git ✅ Done by setup script
```powershell
git config --global init.defaultBranch main
git config --global pull.rebase false
git config --global core.autocrlf input
git config --global core.editor "code --wait"
```

## Step 2 — Install WSL2 + Ubuntu (manual)
```powershell
# Open PowerShell AS ADMINISTRATOR, then:
wsl --install -d Ubuntu-22.04
# Reboot when prompted, then set Ubuntu username/password on first launch
```

## Step 3 — Install Docker Desktop (manual)
1. Download from https://www.docker.com/products/docker-desktop/
2. Install (defaults are fine)
3. Settings → General → "Use the WSL 2 based engine" (default ON)
4. Settings → Resources → WSL Integration → enable Ubuntu-22.04
5. Verify: `docker --version` and `docker run hello-world`

## Step 4 — SSH key (already generated)
- Public key: `~/.ssh/id_ed25519.pub` (in Windows: `C:\Users\ayush\.ssh\id_ed25519.pub`)
- Add to GitHub: https://github.com/settings/keys → New SSH key → paste contents
- Test: `ssh -T git@github.com`

## Step 5 — Repo is initialized in `cloudkart/`
- `cd cloudkart`
- `git status` should show clean working tree on `main` branch after first commit

## Troubleshooting

### `wsl --install` says feature not enabled
Run as admin:
```powershell
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
# Reboot, then `wsl --install` again
```

### Docker won't start
- Make sure WSL2 is installed first (`wsl --status` should show version 2)
- In BIOS, enable Virtualization (VT-x or AMD-V)
- Restart Docker Desktop after Windows reboot

### SSH key not accepted by GitHub
- Verify public key copied entirely (single line starting with `ssh-ed25519`)
- Run `ssh -T git@github.com` — should say "Hi <username>!"
