#!/bin/bash
# AWS Security Controls Verification Script
# For ISO 27001 Evidence Collection
#
# Prerequisites:
# - AWS CLI installed and configured
# - Appropriate IAM permissions to read resources
#
# Usage: ./verify-aws-controls.sh [profile]

set -e

PROFILE="${1:-default}"
OUTPUT_DIR="./aws-evidence-$(date +%Y%m%d)"
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

echo "=========================================="
echo "AWS Security Controls Verification"
echo "ISO 27001 Evidence Collection"
echo "=========================================="
echo "Profile: $PROFILE"
echo "Timestamp: $TIMESTAMP"
echo "Output: $OUTPUT_DIR"
echo ""

mkdir -p "$OUTPUT_DIR"

# Helper function
check() {
  local name="$1"
  local status="$2"
  local details="$3"

  if [ "$status" = "PASS" ]; then
    echo "[PASS] $name"
  elif [ "$status" = "WARN" ]; then
    echo "[WARN] $name - $details"
  else
    echo "[FAIL] $name - $details"
  fi
}

# ==========================================
# 1. REGION VERIFICATION (EU Data Residency)
# ==========================================
echo ""
echo "--- 1. Region Verification (EU Data Residency) ---"

REGION=$(aws configure get region --profile "$PROFILE" 2>/dev/null || echo "not-set")
echo "Configured Region: $REGION"

if [[ "$REGION" == eu-* ]]; then
  check "EU Region" "PASS" ""
else
  check "EU Region" "FAIL" "Region is $REGION, expected eu-*"
fi

# ==========================================
# 2. RDS DATABASE CONTROLS
# ==========================================
echo ""
echo "--- 2. RDS Database Controls ---"

aws rds describe-db-instances --profile "$PROFILE" --output json > "$OUTPUT_DIR/rds-instances.json" 2>/dev/null || echo "{}" > "$OUTPUT_DIR/rds-instances.json"

# Check each RDS instance
aws rds describe-db-instances --profile "$PROFILE" --query 'DBInstances[*].[DBInstanceIdentifier,StorageEncrypted,MultiAZ,BackupRetentionPeriod,DeletionProtection,PubliclyAccessible,AvailabilityZone]' --output text 2>/dev/null | while read -r db_id encrypted multi_az backup_days deletion_protection public az; do
  echo ""
  echo "Database: $db_id"
  echo "  Availability Zone: $az"

  # Encryption at rest
  if [ "$encrypted" = "True" ]; then
    check "  Encryption at rest" "PASS" ""
  else
    check "  Encryption at rest" "FAIL" "Not encrypted"
  fi

  # Multi-AZ (redundancy)
  if [ "$multi_az" = "True" ]; then
    check "  Multi-AZ deployment" "PASS" ""
  else
    check "  Multi-AZ deployment" "WARN" "Single AZ only"
  fi

  # Backup retention
  if [ "$backup_days" -ge 7 ]; then
    check "  Backup retention (${backup_days} days)" "PASS" ""
  else
    check "  Backup retention (${backup_days} days)" "WARN" "Less than 7 days"
  fi

  # Deletion protection
  if [ "$deletion_protection" = "True" ]; then
    check "  Deletion protection" "PASS" ""
  else
    check "  Deletion protection" "WARN" "Not enabled"
  fi

  # Public accessibility
  if [ "$public" = "False" ]; then
    check "  Private (not public)" "PASS" ""
  else
    check "  Private (not public)" "FAIL" "Publicly accessible!"
  fi
done

# ==========================================
# 3. S3 BUCKET CONTROLS
# ==========================================
echo ""
echo "--- 3. S3 Bucket Controls ---"

aws s3api list-buckets --profile "$PROFILE" --query 'Buckets[*].Name' --output text 2>/dev/null | tr '\t' '\n' | while read -r bucket; do
  [ -z "$bucket" ] && continue

  echo ""
  echo "Bucket: $bucket"

  # Get bucket location
  location=$(aws s3api get-bucket-location --bucket "$bucket" --profile "$PROFILE" --query 'LocationConstraint' --output text 2>/dev/null || echo "unknown")
  echo "  Region: $location"

  # Check encryption
  encryption=$(aws s3api get-bucket-encryption --bucket "$bucket" --profile "$PROFILE" 2>/dev/null && echo "enabled" || echo "disabled")
  if [ "$encryption" = "enabled" ]; then
    check "  Default encryption" "PASS" ""
  else
    check "  Default encryption" "FAIL" "Not enabled"
  fi

  # Check versioning
  versioning=$(aws s3api get-bucket-versioning --bucket "$bucket" --profile "$PROFILE" --query 'Status' --output text 2>/dev/null || echo "Disabled")
  if [ "$versioning" = "Enabled" ]; then
    check "  Versioning" "PASS" ""
  else
    check "  Versioning" "WARN" "Not enabled"
  fi

  # Check public access block
  public_block=$(aws s3api get-public-access-block --bucket "$bucket" --profile "$PROFILE" 2>/dev/null && echo "configured" || echo "not-configured")
  if [ "$public_block" = "configured" ]; then
    check "  Public access block" "PASS" ""
  else
    check "  Public access block" "WARN" "Not configured"
  fi

done

# ==========================================
# 4. VPC / NETWORK CONTROLS
# ==========================================
echo ""
echo "--- 4. VPC / Network Controls ---"

aws ec2 describe-vpcs --profile "$PROFILE" --output json > "$OUTPUT_DIR/vpcs.json" 2>/dev/null

aws ec2 describe-vpcs --profile "$PROFILE" --query 'Vpcs[*].[VpcId,CidrBlock,IsDefault]' --output text 2>/dev/null | while read -r vpc_id cidr is_default; do
  echo ""
  echo "VPC: $vpc_id ($cidr)"

  if [ "$is_default" = "False" ]; then
    check "  Custom VPC (not default)" "PASS" ""
  else
    check "  Custom VPC (not default)" "WARN" "Using default VPC"
  fi

  # Check for flow logs
  flow_logs=$(aws ec2 describe-flow-logs --profile "$PROFILE" --filter "Name=resource-id,Values=$vpc_id" --query 'FlowLogs[*].FlowLogId' --output text 2>/dev/null)
  if [ -n "$flow_logs" ]; then
    check "  VPC Flow Logs" "PASS" ""
  else
    check "  VPC Flow Logs" "WARN" "Not enabled"
  fi
done

# Security Groups
echo ""
echo "Security Groups with 0.0.0.0/0 ingress (review needed):"
aws ec2 describe-security-groups --profile "$PROFILE" --query 'SecurityGroups[?IpPermissions[?IpRanges[?CidrIp==`0.0.0.0/0`]]].[GroupId,GroupName]' --output text 2>/dev/null | while read -r sg_id sg_name; do
  [ -z "$sg_id" ] && continue
  echo "  - $sg_id ($sg_name)"
done

aws ec2 describe-security-groups --profile "$PROFILE" --output json > "$OUTPUT_DIR/security-groups.json" 2>/dev/null

# ==========================================
# 5. ECS CONTROLS
# ==========================================
echo ""
echo "--- 5. ECS Container Controls ---"

aws ecs list-clusters --profile "$PROFILE" --query 'clusterArns' --output text 2>/dev/null | tr '\t' '\n' | while read -r cluster_arn; do
  [ -z "$cluster_arn" ] && continue
  cluster_name=$(echo "$cluster_arn" | awk -F'/' '{print $NF}')

  echo ""
  echo "Cluster: $cluster_name"

  # Get cluster details
  aws ecs describe-clusters --profile "$PROFILE" --clusters "$cluster_arn" --output json > "$OUTPUT_DIR/ecs-cluster-$cluster_name.json" 2>/dev/null

  # Check services
  aws ecs list-services --profile "$PROFILE" --cluster "$cluster_arn" --query 'serviceArns' --output text 2>/dev/null | tr '\t' '\n' | while read -r service_arn; do
    [ -z "$service_arn" ] && continue
    service_name=$(echo "$service_arn" | awk -F'/' '{print $NF}')
    echo "  Service: $service_name"
  done
done

# ==========================================
# 6. CLOUDTRAIL (AUDIT LOGGING)
# ==========================================
echo ""
echo "--- 6. CloudTrail Audit Logging ---"

aws cloudtrail describe-trails --profile "$PROFILE" --output json > "$OUTPUT_DIR/cloudtrail.json" 2>/dev/null

trails=$(aws cloudtrail describe-trails --profile "$PROFILE" --query 'trailList[*].[Name,IsMultiRegionTrail,LogFileValidationEnabled,S3BucketName]' --output text 2>/dev/null)

if [ -n "$trails" ]; then
  echo "$trails" | while read -r trail_name multi_region log_validation bucket; do
    echo ""
    echo "Trail: $trail_name"
    echo "  S3 Bucket: $bucket"

    if [ "$multi_region" = "True" ]; then
      check "  Multi-region" "PASS" ""
    else
      check "  Multi-region" "WARN" "Single region only"
    fi

    if [ "$log_validation" = "True" ]; then
      check "  Log file validation" "PASS" ""
    else
      check "  Log file validation" "WARN" "Not enabled"
    fi
  done
else
  check "CloudTrail" "FAIL" "No trails configured"
fi

# ==========================================
# 7. KMS ENCRYPTION KEYS
# ==========================================
echo ""
echo "--- 7. KMS Encryption Keys ---"

aws kms list-keys --profile "$PROFILE" --output json > "$OUTPUT_DIR/kms-keys.json" 2>/dev/null

key_count=$(aws kms list-keys --profile "$PROFILE" --query 'length(Keys)' --output text 2>/dev/null || echo "0")
echo "KMS Keys found: $key_count"

if [ "$key_count" -gt 0 ]; then
  check "KMS Keys configured" "PASS" ""
else
  check "KMS Keys configured" "WARN" "No customer-managed keys"
fi

# ==========================================
# 8. IAM CONTROLS
# ==========================================
echo ""
echo "--- 8. IAM Controls ---"

# Check for MFA on root
root_mfa=$(aws iam get-account-summary --profile "$PROFILE" --query 'SummaryMap.AccountMFAEnabled' --output text 2>/dev/null || echo "0")
if [ "$root_mfa" = "1" ]; then
  check "Root account MFA" "PASS" ""
else
  check "Root account MFA" "FAIL" "Not enabled"
fi

# Password policy
aws iam get-account-password-policy --profile "$PROFILE" --output json > "$OUTPUT_DIR/password-policy.json" 2>/dev/null

pwd_policy=$(aws iam get-account-password-policy --profile "$PROFILE" 2>/dev/null && echo "configured" || echo "not-configured")
if [ "$pwd_policy" = "configured" ]; then
  check "Password policy" "PASS" ""
else
  check "Password policy" "WARN" "Using defaults"
fi

# ==========================================
# 9. SECRETS MANAGER
# ==========================================
echo ""
echo "--- 9. Secrets Manager ---"

secret_count=$(aws secretsmanager list-secrets --profile "$PROFILE" --query 'length(SecretList)' --output text 2>/dev/null || echo "0")
echo "Secrets stored: $secret_count"

if [ "$secret_count" -gt 0 ]; then
  check "Secrets Manager in use" "PASS" ""
  aws secretsmanager list-secrets --profile "$PROFILE" --query 'SecretList[*].Name' --output text 2>/dev/null | tr '\t' '\n' | while read -r secret; do
    echo "  - $secret"
  done
else
  check "Secrets Manager in use" "WARN" "No secrets stored"
fi

# ==========================================
# 10. LOAD BALANCER / TLS
# ==========================================
echo ""
echo "--- 10. Load Balancer / TLS ---"

aws elbv2 describe-load-balancers --profile "$PROFILE" --output json > "$OUTPUT_DIR/load-balancers.json" 2>/dev/null

aws elbv2 describe-load-balancers --profile "$PROFILE" --query 'LoadBalancers[*].[LoadBalancerName,Scheme,Type]' --output text 2>/dev/null | while read -r lb_name scheme lb_type; do
  [ -z "$lb_name" ] && continue
  echo ""
  echo "Load Balancer: $lb_name ($lb_type)"
  echo "  Scheme: $scheme"

  # Get listeners
  lb_arn=$(aws elbv2 describe-load-balancers --profile "$PROFILE" --names "$lb_name" --query 'LoadBalancers[0].LoadBalancerArn' --output text 2>/dev/null)

  aws elbv2 describe-listeners --profile "$PROFILE" --load-balancer-arn "$lb_arn" --query 'Listeners[*].[Protocol,Port,SslPolicy]' --output text 2>/dev/null | while read -r protocol port ssl_policy; do
    echo "  Listener: $protocol:$port"
    if [ "$protocol" = "HTTPS" ]; then
      check "    HTTPS enabled" "PASS" ""
      echo "    SSL Policy: $ssl_policy"
    elif [ "$protocol" = "HTTP" ] && [ "$port" = "80" ]; then
      check "    HTTP (should redirect to HTTPS)" "WARN" ""
    fi
  done
done

# ==========================================
# SUMMARY
# ==========================================
echo ""
echo "=========================================="
echo "Evidence Collection Complete"
echo "=========================================="
echo ""
echo "Evidence files saved to: $OUTPUT_DIR/"
ls -la "$OUTPUT_DIR/"
echo ""
echo "Next steps:"
echo "1. Review any WARN or FAIL items above"
echo "2. Take screenshots of AWS Console for key controls"
echo "3. Upload evidence files to Probo"
echo ""
