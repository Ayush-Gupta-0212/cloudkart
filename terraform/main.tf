# main.tf — root module.
# Composes the three modules into a complete CloudKart-ready environment.

# Auto-lookup the latest Ubuntu 22.04 LTS AMI if var.ami_id is empty.
data "aws_ami" "ubuntu" {
  count       = var.ami_id == "" ? 1 : 0
  most_recent = true
  owners      = ["099720109477"] # Canonical

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }
  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

# Read the user's local SSH public key if not provided via variable.
data "local_file" "ssh_pub" {
  count    = var.ssh_public_key == "" ? 1 : 0
  filename = pathexpand("~/.ssh/id_ed25519.pub")
}

locals {
  ami_id         = var.ami_id != "" ? var.ami_id : data.aws_ami.ubuntu[0].id
  ssh_public_key = var.ssh_public_key != "" ? var.ssh_public_key : try(data.local_file.ssh_pub[0].content, "")
}

# ─── VPC + subnets + IGW + routing ─────────────────────────────────
module "vpc" {
  source = "./modules/vpc"

  name                = "cloudkart-${var.environment}"
  cidr                = var.vpc_cidr
  public_subnet_cidrs = var.public_subnet_cidrs
}

# ─── Security groups ──────────────────────────────────────────────
module "security_groups" {
  source = "./modules/security-groups"

  vpc_id           = module.vpc.vpc_id
  name_prefix      = "cloudkart-${var.environment}"
  allowed_ssh_cidr = var.allowed_ssh_cidr
}

# ─── EC2 instance running K3s (lightweight Kubernetes) ────────────
module "k3s_node" {
  source = "./modules/ec2"

  name              = "cloudkart-${var.environment}-k3s"
  ami               = local.ami_id
  instance_type     = var.instance_type
  subnet_id         = module.vpc.public_subnet_ids[0]
  security_group_id = module.security_groups.app_sg_id
  ssh_public_key    = local.ssh_public_key
  user_data         = file("${path.module}/modules/ec2/install-k3s.sh")
}
