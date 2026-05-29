# backend.tf — remote state in S3 with DynamoDB locking.
#
# CRITICAL setup BEFORE `terraform init`:
#   1. Create the bucket + lock table (one-time, by hand or with a bootstrap script):
#        aws s3api create-bucket --bucket cloudkart-tf-state --region us-east-1
#        aws s3api put-bucket-versioning --bucket cloudkart-tf-state \
#          --versioning-configuration Status=Enabled
#        aws dynamodb create-table --table-name cloudkart-tf-lock \
#          --attribute-definitions AttributeName=LockID,AttributeType=S \
#          --key-schema AttributeName=LockID,KeyType=HASH \
#          --billing-mode PAY_PER_REQUEST
#
#   2. Then `terraform init` will migrate state to S3.
#
# Why remote state?
#   - Team collaboration (everyone reads the same state)
#   - DynamoDB lock prevents two `apply`s racing
#   - S3 versioning lets you roll back state if needed
#   - State stays out of git (it contains secrets)

terraform {
  backend "s3" {
    bucket         = "cloudkart-tf-state"
    key            = "envs/dev/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "cloudkart-tf-lock"
    encrypt        = true
  }
}
