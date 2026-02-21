---
description: "Scan AWS for ISO 27001 security controls"
argument-hint: "[aws-profile]"
---

# AWS Security Scan

Scan AWS account for ISO 27001 compliance gaps.

**Default profile:** default

## What to check:

1. **Data Residency** (GDPR)
   - Verify resources are in EU region (eu-central-1 or eu-west-1)

2. **RDS Database** (A.8.24, A.8.13, A.8.14)
   - Encryption at rest enabled
   - Backup retention >= 7 days
   - Multi-AZ enabled
   - Not publicly accessible
   - Deletion protection enabled

3. **S3 Buckets** (A.8.24, A.8.13)
   - Default encryption enabled
   - Versioning enabled
   - Public access blocked

4. **CloudTrail** (A.8.15, A.8.16)
   - Trail exists and is multi-region
   - Log file validation enabled

5. **VPC/Network** (A.8.20, A.8.22)
   - Flow logs enabled
   - Security groups reviewed (no 0.0.0.0/0 on sensitive ports)

6. **IAM** (A.5.17, A.8.2)
   - Root MFA enabled
   - Password policy configured

## How to run:

Use AWS CLI (must be configured):

```bash
# Check RDS
aws rds describe-db-instances --query 'DBInstances[*].[DBInstanceIdentifier,StorageEncrypted,MultiAZ,BackupRetentionPeriod,PubliclyAccessible]' --output table

# Check S3 encryption
for bucket in $(aws s3api list-buckets --query 'Buckets[*].Name' --output text); do
  echo "$bucket: $(aws s3api get-bucket-encryption --bucket $bucket 2>/dev/null && echo 'encrypted' || echo 'NOT ENCRYPTED')"
done

# Check CloudTrail
aws cloudtrail describe-trails --query 'trailList[*].[Name,IsMultiRegionTrail]' --output table
```

## Output format:

Create findings with:
- Resource name
- Control checked
- Status (PASS/FAIL/WARN)
- Current value vs expected
- Recommended action

Then offer to create tasks in Probo for any gaps found.

## Important:

- This is READ-ONLY - never modify AWS resources
- Log findings to docs/aws-security-findings-YYYY-MM-DD.md
- Create measures and tasks in Probo for gaps
- Be careful with credentials in environment
