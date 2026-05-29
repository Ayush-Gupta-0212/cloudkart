variable "name" {
  type        = string
  description = "Name tag for the instance."
}

variable "ami" {
  type        = string
  description = "AMI ID (Ubuntu 22.04 LTS recommended)."
}

variable "instance_type" {
  type        = string
  description = "EC2 instance type."
  default     = "t2.micro"
}

variable "subnet_id" {
  type        = string
  description = "Subnet to launch into."
}

variable "security_group_id" {
  type        = string
  description = "Security group to attach."
}

variable "ssh_public_key" {
  type        = string
  description = "SSH public key to install on the instance."
}

variable "user_data" {
  type        = string
  description = "Cloud-init / user-data script to run on first boot."
  default     = ""
}
