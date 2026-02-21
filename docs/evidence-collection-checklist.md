# ISO 27001 Evidence Collection Checklist

**Organization:** Passionfruit Earth B.V.
**Purpose:** Collect evidence that security controls are implemented and working

---

## How to Use This Checklist

For each control:
1. **Verify** - Check the control is actually configured
2. **Screenshot** - Take a screenshot from the console/UI
3. **Export** - Export configuration as JSON/PDF where possible
4. **Upload** - Add evidence to Probo under the relevant control/measure

---

## AWS Infrastructure Controls

### A.5.23 - Cloud Services Security

| Evidence | Source | Status | Notes |
|----------|--------|--------|-------|
| AWS account ID and region | AWS Console → Account | [ ] | |
| EU region confirmation | AWS Console → Top right | [ ] | Must be eu-west-1 or eu-central-1 |
| AWS Security Hub findings | Security Hub → Findings | [ ] | |
| AWS Config compliance | Config → Dashboard | [ ] | |

**How to collect:**
```bash
# Run verification script
./scripts/verify-aws-controls.sh

# Or manually:
aws sts get-caller-identity
aws configure get region
```

---

### A.8.13 - Information Backup

| Evidence | Source | Status | Notes |
|----------|--------|--------|-------|
| RDS automated backups | RDS → Database → Maintenance | [ ] | Screenshot backup settings |
| RDS backup retention period | RDS → Database → Configuration | [ ] | Should be ≥7 days |
| S3 versioning enabled | S3 → Bucket → Properties | [ ] | Screenshot versioning status |
| Backup restore test | Manual test | [ ] | Document restore procedure |

**How to collect:**
```bash
aws rds describe-db-instances --query 'DBInstances[*].[DBInstanceIdentifier,BackupRetentionPeriod]'
aws s3api get-bucket-versioning --bucket YOUR_BUCKET
```

**Backup Restore Test Procedure:**
1. Create a test RDS snapshot
2. Restore to a new instance
3. Verify data integrity
4. Document date, duration, and outcome
5. Delete test instance

---

### A.8.14 - Redundancy

| Evidence | Source | Status | Notes |
|----------|--------|--------|-------|
| RDS Multi-AZ deployment | RDS → Database → Configuration | [ ] | |
| ECS multi-task deployment | ECS → Service → Tasks | [ ] | |
| Load balancer configuration | EC2 → Load Balancers | [ ] | |

**How to collect:**
```bash
aws rds describe-db-instances --query 'DBInstances[*].[DBInstanceIdentifier,MultiAZ]'
aws ecs describe-services --cluster CLUSTER --services SERVICE --query 'services[*].desiredCount'
```

---

### A.8.20 - Network Security

| Evidence | Source | Status | Notes |
|----------|--------|--------|-------|
| VPC configuration | VPC → Your VPCs | [ ] | Screenshot VPC details |
| Subnet configuration | VPC → Subnets | [ ] | Private vs public subnets |
| Security groups | EC2 → Security Groups | [ ] | Export rules |
| Network ACLs | VPC → Network ACLs | [ ] | |
| VPC Flow Logs | VPC → Flow Logs | [ ] | |

**How to collect:**
```bash
aws ec2 describe-vpcs --output json > vpc-evidence.json
aws ec2 describe-security-groups --output json > security-groups-evidence.json
aws ec2 describe-flow-logs --output json > flow-logs-evidence.json
```

---

### A.8.24 - Cryptography

| Evidence | Source | Status | Notes |
|----------|--------|--------|-------|
| RDS encryption at rest | RDS → Database → Configuration | [ ] | StorageEncrypted: true |
| S3 default encryption | S3 → Bucket → Properties | [ ] | |
| KMS keys | KMS → Customer managed keys | [ ] | |
| ALB TLS configuration | EC2 → Load Balancer → Listeners | [ ] | HTTPS listener with TLS 1.2+ |
| SSL certificate | ACM → Certificates | [ ] | Valid certificate |

**How to collect:**
```bash
aws rds describe-db-instances --query 'DBInstances[*].[DBInstanceIdentifier,StorageEncrypted,KmsKeyId]'
aws s3api get-bucket-encryption --bucket YOUR_BUCKET
aws kms list-keys
aws elbv2 describe-listeners --load-balancer-arn YOUR_ALB_ARN
```

---

### A.8.15 - Logging

| Evidence | Source | Status | Notes |
|----------|--------|--------|-------|
| CloudTrail enabled | CloudTrail → Trails | [ ] | Multi-region trail |
| CloudWatch log groups | CloudWatch → Log groups | [ ] | Application logs |
| Log retention settings | CloudWatch → Log group → Settings | [ ] | |
| CloudTrail log validation | CloudTrail → Trail → Details | [ ] | |

**How to collect:**
```bash
aws cloudtrail describe-trails --output json > cloudtrail-evidence.json
aws logs describe-log-groups --output json > log-groups-evidence.json
```

---

### A.8.16 - Monitoring

| Evidence | Source | Status | Notes |
|----------|--------|--------|-------|
| CloudWatch alarms | CloudWatch → Alarms | [ ] | Screenshot active alarms |
| SNS notifications | SNS → Topics | [ ] | Alert destinations |
| CloudWatch dashboards | CloudWatch → Dashboards | [ ] | |

**How to collect:**
```bash
aws cloudwatch describe-alarms --output json > alarms-evidence.json
aws sns list-topics
```

---

## Authentication Controls

### A.5.16 / A.5.17 - Identity & Authentication

| Evidence | Source | Status | Notes |
|----------|--------|--------|-------|
| Microsoft Entra SSO config | Entra Admin Center | [ ] | App registrations |
| MFA enforcement | Entra → Security → MFA | [ ] | Conditional access policies |
| User list with MFA status | Entra → Users | [ ] | Export user list |
| SSO login flow | Test login | [ ] | Screenshot SSO redirect |

**How to collect:**
- Screenshot Entra conditional access policies
- Export user list with authentication methods
- Test and document SSO flow

---

### A.8.2 - Privileged Access

| Evidence | Source | Status | Notes |
|----------|--------|--------|-------|
| AWS IAM users with admin | IAM → Users | [ ] | List admin users |
| IAM roles | IAM → Roles | [ ] | |
| Root account MFA | IAM → Security credentials | [ ] | Must be enabled |
| GitHub org admins | GitHub → Settings → People | [ ] | |

**How to collect:**
```bash
aws iam list-users --output json > iam-users-evidence.json
aws iam get-account-summary
```

---

## Application Controls

### A.8.25-28 - Secure Development

| Evidence | Source | Status | Notes |
|----------|--------|--------|-------|
| GitHub branch protection | GitHub → Settings → Branches | [ ] | PR required |
| CI/CD pipeline | GitHub Actions | [ ] | Screenshot workflow |
| Dependabot alerts | GitHub → Security → Dependabot | [ ] | |
| Code review process | GitHub → Pull requests | [ ] | Example merged PR |

**How to collect:**
- Screenshot branch protection rules
- Export GitHub Actions workflow file
- Screenshot Dependabot settings
- Link to example PR with review

---

### A.8.31 - Environment Separation

| Evidence | Source | Status | Notes |
|----------|--------|--------|-------|
| Separate AWS accounts/VPCs | AWS Organizations / VPC | [ ] | Dev vs Prod |
| Different database instances | RDS Console | [ ] | |
| Environment variables | ECS Task definitions | [ ] | Different configs |

---

## Vendor Controls

### A.5.19-22 - Supplier Security

| Evidence | Source | Status | Notes |
|----------|--------|--------|-------|
| Vendor list in Probo | Probo → Vendors | [ ] | Export vendor list |
| Vendor certifications | Trust pages | [ ] | SOC2, ISO27001 reports |
| DPAs signed | Document storage | [ ] | Signed agreements |
| Vendor security reviews | Probo → Vendor assessments | [ ] | |

---

## People Controls

### A.6.3 - Security Awareness

| Evidence | Source | Status | Notes |
|----------|--------|--------|-------|
| Training completion records | Training platform / spreadsheet | [ ] | |
| Onboarding checklist | HR system | [ ] | Security training included |
| Training materials | Document storage | [ ] | |

### A.6.1 - Screening

| Evidence | Source | Status | Notes |
|----------|--------|--------|-------|
| Background check policy | HR policy document | [ ] | |
| Employment contracts | HR system | [ ] | Security clauses present |

---

## Quick Commands

Run all AWS evidence collection:
```bash
# Make script executable
chmod +x scripts/verify-aws-controls.sh

# Run verification (uses default AWS profile)
./scripts/verify-aws-controls.sh

# Run with specific profile
./scripts/verify-aws-controls.sh production
```

Evidence will be saved to `./aws-evidence-YYYYMMDD/`

---

## Evidence Upload to Probo

After collecting evidence:
1. Go to Probo → Documents or relevant Control
2. Upload screenshots/exports as attachments
3. Add description noting date and what it shows
4. Link to relevant control/measure

---

## Audit Preparation Checklist

Before certification audit:

- [ ] All controls verified (no FAIL items)
- [ ] Evidence collected for each applicable control
- [ ] Evidence dated within last 3 months
- [ ] Screenshots clearly show control is enabled
- [ ] JSON exports match screenshot data
- [ ] All evidence uploaded to Probo
- [ ] Document control table updated
