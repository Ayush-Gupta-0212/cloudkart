output "vpc_id" {
  description = "The CloudKart VPC ID."
  value       = module.vpc.vpc_id
}

output "public_subnet_ids" {
  description = "Public subnet IDs."
  value       = module.vpc.public_subnet_ids
}

output "k3s_instance_id" {
  description = "EC2 instance ID hosting K3s."
  value       = module.k3s_node.instance_id
}

output "k3s_public_ip" {
  description = "Public IP of the K3s instance — use this for SSH and HTTPS."
  value       = module.k3s_node.public_ip
}

output "k3s_public_dns" {
  description = "Public DNS of the K3s instance."
  value       = module.k3s_node.public_dns
}

output "ssh_command" {
  description = "Ready-to-run SSH command."
  value       = "ssh ubuntu@${module.k3s_node.public_ip}"
}

output "kubeconfig_fetch_command" {
  description = "Fetch the cluster kubeconfig from the instance to local."
  value       = "scp ubuntu@${module.k3s_node.public_ip}:/etc/rancher/k3s/k3s.yaml ./kubeconfig && sed -i 's/127.0.0.1/${module.k3s_node.public_ip}/g' ./kubeconfig"
}
