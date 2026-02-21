---
description: "Scan a system for ISO 27001 security controls"
argument-hint: "<system: aws|github|google|slack|linear|vercel|notion|posthog|attio|fireflies|azure|loops|all>"
---

# Security Scan

Scan a system for ISO 27001 compliance gaps and gather evidence.

## Available systems:

| System | What's checked | ISO Controls |
|--------|---------------|--------------|
| `aws` | RDS, S3, CloudTrail, VPC, IAM | A.8.13, A.8.15, A.8.20, A.5.17 |
| `github` | Branch protection, Dependabot, secrets | A.8.25, A.8.32, A.8.8, A.8.4 |
| `google` | 2FA, admins, inactive users | A.5.17, A.8.5, A.5.15, A.8.2 |
| `slack` | Workspace security, 2FA, apps | A.5.17, A.8.21, A.5.15 |
| `linear` | Access control, SSO, audit logs | A.5.15, A.8.2, A.8.15 |
| `vercel` | Team access, deployments, env vars | A.8.25, A.8.32, A.5.15 |
| `notion` | Workspace security, sharing, integrations | A.5.15, A.8.12, A.5.14 |
| `posthog` | Project access, data retention, team | A.5.15, A.8.10, A.8.12 |
| `attio` | CRM access, data sharing, integrations | A.5.15, A.8.12, A.5.14 |
| `fireflies` | Recording access, data retention, sharing | A.5.15, A.8.10, A.8.12 |
| `azure` | Azure AD, OpenAI, M365 security | A.5.17, A.8.5, A.5.15 |
| `loops` | Email security, API keys, sender auth | A.8.21, A.5.14, A.8.4 |
| `all` | Run all scans | All above |

---

## AWS

Check via AWS CLI:

```bash
# RDS - encryption, backups, public access
aws rds describe-db-instances --query 'DBInstances[*].[DBInstanceIdentifier,StorageEncrypted,MultiAZ,BackupRetentionPeriod,PubliclyAccessible]' --output table

# S3 - encryption, versioning, public access
for bucket in $(aws s3api list-buckets --query 'Buckets[*].Name' --output text); do
  echo "$bucket:"
  aws s3api get-bucket-encryption --bucket $bucket 2>/dev/null || echo "  NOT ENCRYPTED"
  aws s3api get-public-access-block --bucket $bucket 2>/dev/null || echo "  PUBLIC ACCESS NOT BLOCKED"
done

# CloudTrail
aws cloudtrail describe-trails --query 'trailList[*].[Name,IsMultiRegionTrail,LogFileValidationEnabled]' --output table

# VPC Flow Logs
aws ec2 describe-flow-logs --query 'FlowLogs[*].[FlowLogId,ResourceId,TrafficType,LogDestinationType]' --output table

# IAM - root MFA, password policy
aws iam get-account-summary
aws iam get-account-password-policy
```

**Expected:**
- RDS: Encrypted, Multi-AZ, 7+ day backups, not public
- S3: Encrypted, versioned, public access blocked
- CloudTrail: Multi-region, log validation enabled
- VPC: Flow logs enabled
- IAM: Root MFA enabled, strong password policy

---

## GitHub

Check via `gh` CLI (org: passionfruit-earth):

```bash
# List repos
gh repo list passionfruit-earth --limit 100

# Check branch protection/rulesets per repo
for repo in fruit-tree fruit-front fruit-front-lib yggdrasill; do
  echo "=== $repo ==="
  gh api "repos/passionfruit-earth/$repo/rulesets" 2>/dev/null || echo "No rulesets"
  gh api "repos/passionfruit-earth/$repo/branches/main/protection" 2>/dev/null || echo "No branch protection"
done

# Dependabot alerts
gh api "repos/passionfruit-earth/fruit-tree/dependabot/alerts" --jq '.[].security_advisory.severity' 2>/dev/null

# Secret scanning
gh api "repos/passionfruit-earth/fruit-tree/secret-scanning/alerts" 2>/dev/null
```

**Expected:**
- Branch protection: Required reviews, status checks, no force push
- Dependabot: Configured, no critical alerts
- Secret scanning: Enabled, no exposed secrets

---

## Google Workspace

Check via `gcloud` or Admin API:

```bash
# List users (requires admin access)
# Check 2FA status
# Check admin users
# Check inactive accounts (>90 days)
```

**Expected:**
- 2FA: Enforced for all users
- Admins: Minimal super admins, all with 2FA
- Inactive: No accounts inactive >90 days

---

## Slack

Check via Slack Admin settings or API:

```bash
# Workspace settings (requires admin token)
# Check: https://passionfruit-earth.slack.com/admin/settings

# Via API if token available:
# curl -H "Authorization: Bearer $SLACK_TOKEN" https://slack.com/api/team.info
```

**Check manually:**
1. Go to Slack Admin > Settings
2. Authentication: SSO/2FA required?
3. Permissions: Who can install apps?
4. Data retention: Messages retained/deleted?
5. App management: Approved apps only?

**Expected:**
- 2FA or SSO required
- App installs restricted to admins
- External sharing controlled
- Audit logs available (Enterprise)

---

## Linear

Check via Linear settings or API:

```bash
# Linear settings: https://linear.app/passionfruit/settings/security
# API if token available
```

**Check manually:**
1. Go to Linear > Settings > Security
2. SSO: Configured?
3. 2FA: Required?
4. SCIM: User provisioning?
5. Audit log: Available?

**Expected:**
- SSO or 2FA enabled
- Access controlled by team membership
- Audit log available

---

## Vercel

Check via Vercel dashboard or CLI:

```bash
# Vercel CLI
vercel teams ls
vercel projects ls

# Check team settings: https://vercel.com/teams/passionfruit/settings
```

**Check manually:**
1. Go to Vercel > Team Settings > Security
2. SSO: Configured?
3. Access: Team members only?
4. Environment variables: Encrypted?
5. Deployment protection: Preview deployments protected?

**Expected:**
- SSO or 2FA enabled
- Team access controlled
- Production deployments restricted
- Env vars not exposed in logs

---

## Notion

Check via Notion settings:

```
Settings URL: https://www.notion.so/passionfruit/settings
```

**Check manually:**
1. Go to Settings > Security & Identity
2. SAML SSO: Configured?
3. Allowed email domains: Restricted?
4. Public page sharing: Disabled?
5. Export: Restricted to admins?
6. Guest access: Controlled?
7. Integrations: Approved only?

**Expected:**
- SSO or restricted email domains
- Public sharing disabled or controlled
- Guest access limited
- Workspace export restricted
- Integration installs controlled

---

## PostHog

Check via PostHog settings:

```
Settings URL: https://app.posthog.com/organization/settings
Project URL: https://app.posthog.com/project/settings
```

**Check manually:**
1. Go to Organization Settings > Security
2. SSO: Configured?
3. 2FA: Required?
4. Project access: Role-based?
5. Data retention: Configured?
6. API keys: Rotated regularly?
7. Permitted domains: Restricted?

**Expected:**
- SSO or 2FA enabled
- Role-based project access
- Data retention policy set
- API keys properly scoped

---

## Attio

Check via Attio settings:

```
Settings URL: https://app.attio.com/settings
```

**Check manually:**
1. Go to Settings > Security
2. SSO: Configured?
3. 2FA: Required?
4. User roles: Properly assigned?
5. API access: Controlled?
6. Data export: Restricted?
7. Integrations: Reviewed?

**Expected:**
- SSO or 2FA enabled
- Role-based access control
- API tokens scoped appropriately
- Integration permissions reviewed

---

## Fireflies

Check via Fireflies settings:

```
Settings URL: https://app.fireflies.ai/settings
```

**Check manually:**
1. Go to Settings > Privacy & Security
2. Who can access recordings?
3. Auto-join meetings: Which calendars?
4. Data retention: How long stored?
5. Sharing: External sharing disabled?
6. Integrations: Which apps connected?
7. Download: Who can download recordings?

**Expected:**
- Recording access limited to participants
- External sharing disabled
- Data retention policy defined
- Integrations reviewed and minimal

---

## Azure (M365 + OpenAI)

Check via Azure/M365 Admin:

```
Azure Portal: https://portal.azure.com
M365 Admin: https://admin.microsoft.com
Entra ID: https://entra.microsoft.com
```

**Check manually:**

### Azure AD / Entra ID:
1. Conditional Access policies configured?
2. MFA enforced for all users?
3. Privileged Identity Management (PIM) enabled?
4. Security defaults enabled?
5. Guest access policies?

### Microsoft 365:
1. Admin roles: Minimal global admins?
2. External sharing: Controlled?
3. DLP policies: Configured?
4. Audit logging: Enabled?

### Azure OpenAI:
1. API keys: Managed via Azure Key Vault?
2. Network: Private endpoints or IP restrictions?
3. RBAC: Role-based access?
4. Content filtering: Enabled?
5. Logging: Diagnostic settings configured?

**Expected:**
- MFA enforced for all users
- Conditional access policies active
- Minimal global admins
- Azure OpenAI accessed via managed identity or Key Vault
- Audit logging enabled

---

## Loops

Check via Loops settings:

```
Settings URL: https://app.loops.so/settings
```

**Check manually:**
1. Go to Settings > Team
2. Team members: Correct access levels?
3. API keys: How many? Last rotated?
4. Go to Settings > Sending
5. Sender authentication: SPF, DKIM, DMARC configured?
6. Sending domain: Verified?
7. Go to Settings > Integrations
8. Connected apps: Reviewed?

**Expected:**
- Team access properly scoped
- API keys minimal and rotated
- SPF, DKIM, DMARC all configured
- Sending domain verified
- Integrations reviewed

---

## Output format:

Log findings to: `docs/security-scan-YYYY-MM-DD.md`

For each system:
- Status: PASS / FAIL / WARN
- Evidence collected
- Gaps found
- ISO control mapping
- Recommended remediation

Then offer to create measures and tasks in Probo for gaps.

---

## Important:

- This is READ-ONLY - never modify any system
- Capture screenshots for audit evidence where CLI not available
- Store evidence in docs/evidence/
- Create tasks in Probo for any gaps found
