variable "aws_region" {
  type        = string
  default     = "us-east-1"
  description = "AWS region to deploy into. Free-tier supports us-east-1 well."
}

variable "environment" {
  type        = string
  default     = "dev"
  description = "Environment name — drives tags and (in production) workspace separation."
  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "environment must be one of: dev, staging, prod."
  }
}

variable "owner" {
  type        = string
  default     = "ayush"
  description = "Resource owner — used in default tags."
}

variable "vpc_cidr" {
  type        = string
  default     = "10.0.0.0/16"
  description = "CIDR for the cloudkart VPC."
}

variable "public_subnet_cidrs" {
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
  description = "CIDRs for public subnets (one per AZ for HA)."
}

variable "instance_type" {
  type        = string
  default     = "t2.micro"
  description = "EC2 type. t2.micro is in the AWS free tier (750 hours/month)."
}

variable "ami_id" {
  type        = string
  default     = ""
  description = "Ubuntu 22.04 AMI id. Leave empty to auto-lookup the latest."
}

variable "allowed_ssh_cidr" {
  type        = string
  default     = "0.0.0.0/0"
  description = "CIDR allowed to SSH in. CHANGE to your IP (e.g. 1.2.3.4/32) for prod."
}

variable "ssh_public_key" {
  type        = string
  default     = ""
  description = "Public SSH key to install on the instance. Leave empty to use ~/.ssh/id_ed25519.pub."
}
