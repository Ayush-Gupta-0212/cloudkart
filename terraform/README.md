# CloudKart — Terraform Infrastructure

Production-grade IaC for CloudKart on AWS. Provisions a free-tier-friendly stack:

| Resource | Why |
|----------|-----|
| **VPC + 2 public subnets** | Network isolation, HA across AZs |
| **Internet Gateway + route table** | Internet egress for the cluster |
| **Security Group** | SSH (restricted), HTTP, HTTPS, K3s API |
| **EC2 t2.micro** (free tier) | Runs K3s (single-node Kubernetes) |
| **Auto-installed K3s + Nginx Ingress** | via `user_data` cloud-init script |
| **gp3 encrypted root volume** | 20 GB, IMDSv2 only |

## Prerequisites

1. **AWS account** (free tier works).
2. **IAM user** with programmatic access (NOT root). Recommended policies: `AmazonEC2FullAccess`, `AmazonVPCFullAccess`, `AmazonS3FullAccess`, `AmazonDynamoDBFullAccess`. In prod, scope these down.
3. **AWS CLI configured**: `aws configure` (or env vars `AWS_ACCESS_KEY_ID` + `AWS_SECRET_ACCESS_KEY`).
4. **Terraform >= 1.6**.

## One-time bootstrap (state backend)

The S3 bucket + DynamoDB lock table must exist BEFORE the first `terraform init`. Run once:

```bash
aws s3api create-bucket --bucket cloudkart-tf-state --region us-east-1
aws s3api put-bucket-versioning --bucket cloudkart-tf-state \
  --versioning-configuration Status=Enabled
aws s3api put-bucket-encryption --bucket cloudkart-tf-state \
  --server-side-encryption-configuration '{"Rules":[{"ApplyServerSideEncryptionByDefault":{"SSEAlgorithm":"AES256"}}]}'
aws dynamodb create-table --table-name cloudkart-tf-lock \
  --attribute-definitions AttributeName=LockID,AttributeType=S \
  --key-schema AttributeName=LockID,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1
```

## Usage

```bash
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars: set allowed_ssh_cidr to YOUR_IP/32 (find via `curl https://checkip.amazonaws.com`)

terraform init       # download providers, configure backend
terraform fmt        # format
terraform validate   # syntax check (no AWS calls)
terraform plan       # preview
terraform apply      # provision (type "yes")

# When done:
terraform destroy    # tear it down (avoid charges)
```

## After apply

Terraform outputs the IP and SSH command. To use the cluster:

```bash
ssh ubuntu@<ip>                        # log in
kubectl get nodes                      # confirm K3s is running

# Fetch kubeconfig to your local machine:
scp ubuntu@<ip>:/etc/rancher/k3s/k3s.yaml ./kubeconfig
sed -i 's/127.0.0.1/<ip>/g' ./kubeconfig
KUBECONFIG=./kubeconfig kubectl get nodes

# Deploy CloudKart via Helm (from local laptop):
KUBECONFIG=./kubeconfig helm upgrade --install cloudkart ../helm/cloudkart \
  -f ../helm/cloudkart/values-prod.yaml \
  --namespace cloudkart --create-namespace --wait
```

## Cost

- **t2.micro**: free for 750 hours/month (≈ 1 instance running 24/7) for the first 12 months.
- **EBS gp3 20 GB**: free up to 30 GB/month.
- **VPC, IGW, SG, S3, DynamoDB**: free under typical usage.
- **Estimated total**: $0/month for the first year if you stay under free-tier limits.
- **⚠️ Always `terraform destroy` when not actively using it**, and set a billing alarm at $1.

## Cleanup

```bash
terraform destroy
# After confirmation, all resources are removed.
# Note: the S3 state bucket + DynamoDB table are NOT destroyed (they're bootstrap resources).
```
