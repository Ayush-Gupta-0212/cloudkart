# modules/ec2/main.tf — single EC2 instance with auto-installed K3s.

resource "aws_key_pair" "this" {
  key_name   = "${var.name}-key"
  public_key = var.ssh_public_key
}

resource "aws_instance" "this" {
  ami                         = var.ami
  instance_type               = var.instance_type
  subnet_id                   = var.subnet_id
  vpc_security_group_ids      = [var.security_group_id]
  key_name                    = aws_key_pair.this.key_name
  associate_public_ip_address = true
  user_data                   = var.user_data
  user_data_replace_on_change = false

  root_block_device {
    volume_size           = 20 # 20 GB — plenty for K3s + CloudKart
    volume_type           = "gp3"
    encrypted             = true
    delete_on_termination = true
  }

  metadata_options {
    http_tokens   = "required" # IMDSv2 only (security best-practice)
    http_endpoint = "enabled"
  }

  tags = {
    Name = var.name
    Role = "k3s-server"
  }
}
