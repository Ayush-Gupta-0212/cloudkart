variable "name" {
  type        = string
  description = "Name prefix for VPC resources."
}

variable "cidr" {
  type        = string
  description = "VPC CIDR (e.g. 10.0.0.0/16)."
}

variable "public_subnet_cidrs" {
  type        = list(string)
  description = "List of CIDRs for public subnets — one per AZ."
}
