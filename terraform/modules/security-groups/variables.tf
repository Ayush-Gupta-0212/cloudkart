variable "vpc_id" {
  type        = string
  description = "VPC to attach the SG to."
}

variable "name_prefix" {
  type        = string
  description = "Name prefix for SG resources."
}

variable "allowed_ssh_cidr" {
  type        = string
  description = "CIDR allowed for SSH and K3s API access."
}
