# AWS Security Controls Verification - Findings

**Date:** 2026-02-21
**Assessed By:** Claude (automated) + Manual Review
**Environment:** Production (eu-central-1)
**Status:** Issues Found - Remediation Required

---

## Summary

| Severity | Count | Status |
|----------|-------|--------|
| Critical | 3 | Open |
| High | 4 | Open |
| Medium | 6 | Open |
| Passed | 6 | N/A |

---

## Critical Findings

### CRIT-001: RDS Database Publicly Accessible

| Field | Value |
|-------|-------|
| Resource | `passionfruit` (RDS PostgreSQL) |
| Finding | Database is publicly accessible with open security group |
| Security Group | `sg-02f1ae335ba55665f` (passionfruit-pg-db) |
| Rule | Inbound: 0-65535 from 0.0.0.0/0 |
| Risk | Anyone on the internet can attempt to connect to the database |
| ISO Control | A.8.20 (Network Security), A.8.22 (Network Segregation) |
| Remediation | 1. Remove 0.0.0.0/0 rule, 2. Add specific IP/SG rules, 3. Consider setting PubliclyAccessible=false |
| Priority | Immediate |

### CRIT-002: CloudTrail Not Enabled

| Field | Value |
|-------|-------|
| Resource | AWS Account |
| Finding | No CloudTrail trails configured |
| Risk | No audit logging of AWS API calls - cannot detect unauthorized access |
| ISO Control | A.8.15 (Logging), A.8.16 (Monitoring) |
| Remediation | Enable CloudTrail with multi-region trail, log to S3 with encryption |
| Priority | Immediate |

### CRIT-003: S3 Buckets Without Encryption

| Field | Value |
|-------|-------|
| Resources | All 9 S3 buckets |
| Finding | Default encryption not enabled |
| Buckets | evidences-dev, evidences-production, passionfruit-billing-reports, passionfruit-database-dump, passionfruit-earth-bucket, passionfruit-extension-manifests, passionfruit-organization-images-dev, passionfruit-prod-files, passionfruit-prod-files-logs |
| Risk | Data at rest not encrypted - compliance violation |
| ISO Control | A.8.24 (Cryptography) |
| Remediation | Enable SSE-S3 or SSE-KMS default encryption on all buckets |
| Priority | Immediate |

---

## High Findings

### HIGH-001: RDS Backup Retention Too Short

| Field | Value |
|-------|-------|
| Resource | `passionfruit` (RDS) |
| Finding | Backup retention set to 1 day |
| Risk | Insufficient recovery window for data loss scenarios |
| ISO Control | A.8.13 (Information Backup) |
| Remediation | Increase backup retention to minimum 7 days (recommend 14-30) |
| Priority | This week |

### HIGH-002: RDS No Multi-AZ

| Field | Value |
|-------|-------|
| Resource | `passionfruit` (RDS) |
| Finding | Single-AZ deployment |
| Risk | No automatic failover if AZ goes down |
| ISO Control | A.8.14 (Redundancy) |
| Remediation | Enable Multi-AZ deployment |
| Priority | This week |

### HIGH-003: RDS No Deletion Protection

| Field | Value |
|-------|-------|
| Resource | `passionfruit` (RDS) |
| Finding | Deletion protection not enabled |
| Risk | Database can be accidentally deleted |
| ISO Control | A.8.10 (Information Deletion - controlled) |
| Remediation | Enable deletion protection |
| Priority | This week |

### HIGH-004: VPC Flow Logs Not Enabled

| Field | Value |
|-------|-------|
| Resources | All 3 VPCs |
| Finding | No VPC flow logs configured |
| Risk | Cannot monitor network traffic or detect anomalies |
| ISO Control | A.8.16 (Monitoring) |
| Remediation | Enable flow logs to CloudWatch or S3 |
| Priority | This week |

---

## Medium Findings

### MED-001: S3 Buckets Without Versioning

| Field | Value |
|-------|-------|
| Resources | 8 of 9 buckets |
| Finding | Versioning not enabled |
| Risk | Cannot recover from accidental deletion/overwrite |
| ISO Control | A.8.13 (Information Backup) |
| Remediation | Enable versioning on critical buckets |

### MED-002: S3 Buckets Without Public Access Block

| Field | Value |
|-------|-------|
| Resources | All 9 buckets |
| Finding | Public access block not configured |
| Risk | Buckets could accidentally be made public |
| ISO Control | A.8.3 (Information Access Restriction) |
| Remediation | Enable block public access settings |

### MED-003: Security Groups Too Permissive

| Field | Value |
|-------|-------|
| Resources | 13 security groups with 0.0.0.0/0 |
| Finding | Multiple security groups allow inbound from any IP |
| Groups | passionfruit-pg-db, launch-wizard-*, chat-api, keycloak, etc. |
| Risk | Increased attack surface |
| ISO Control | A.8.20 (Network Security) |
| Remediation | Review and restrict to specific IPs/ranges |

### MED-004: Using Default VPC

| Field | Value |
|-------|-------|
| Resource | vpc-095182a531a167bab |
| Finding | Production resources in default VPC |
| Risk | Less control over network configuration |
| ISO Control | A.8.22 (Network Segregation) |
| Remediation | Migrate to custom VPC with proper subnet design |

### MED-005: IAM Password Policy

| Field | Value |
|-------|-------|
| Resource | AWS Account |
| Finding | Using default password policy |
| Risk | Weak password requirements |
| ISO Control | A.5.17 (Authentication) |
| Remediation | Configure custom password policy |

### MED-006: Multiple Launch Wizard Security Groups

| Field | Value |
|-------|-------|
| Resources | launch-wizard-1 through launch-wizard-7 |
| Finding | Auto-generated security groups still exist |
| Risk | Often overly permissive, indicates manual EC2 launches |
| ISO Control | A.8.9 (Configuration Management) |
| Remediation | Review and consolidate or delete unused groups |

---

## Passed Controls

| Control | Status | Evidence |
|---------|--------|----------|
| EU Region | PASS | eu-central-1 |
| RDS Encryption at Rest | PASS | StorageEncrypted=true |
| KMS Keys | PASS | 7 customer-managed keys |
| Root MFA | PASS | Enabled |
| Custom VPCs | PASS | 2 custom VPCs exist |
| ECS Clusters | PASS | 3 clusters running (dev/staging/prod) |

---

## Remediation Tracking

| ID | Finding | Owner | Due Date | Status |
|----|---------|-------|----------|--------|
| CRIT-001 | RDS publicly accessible | | | Open |
| CRIT-002 | CloudTrail not enabled | | | Open |
| CRIT-003 | S3 encryption | | | Open |
| HIGH-001 | RDS backup retention | | | Open |
| HIGH-002 | RDS Multi-AZ | | | Open |
| HIGH-003 | RDS deletion protection | | | Open |
| HIGH-004 | VPC flow logs | | | Open |

---

## Next Steps

1. Create remediation tasks in Probo
2. Assign owners and due dates
3. Execute fixes (prioritize Critical first)
4. Re-run verification script
5. Update this log with resolution dates
