#!/bin/bash
# Create Incident Response Plan in Probo

API_URL="http://localhost:8080/api/console/v1/graphql"
API_KEY="AAAAAAAAAAAAKwAAAZx_79LvST3o4WQK.JSOS2BKLmwlhZlO1TtejLgC69hJO8eeIbkbgHzo_h7w"
ORG_ID="2delmZUAAAEAAAAAAZx_7gpa_vVWYEaD"

CONTENT=$(cat <<'MARKDOWN'
# Incident Response Plan

**Version:** 1.0
**Effective Date:** 2026-02-21
**Owner:** Security Team
**Review Cycle:** Annual

---

## 1. Purpose

This plan establishes procedures for detecting, responding to, and recovering from information security incidents affecting Passionfruit systems, data, or operations.

## 2. Scope

Applies to all security incidents involving:
- Passionfruit production systems (AWS infrastructure)
- Customer data
- Employee credentials or access
- Third-party integrations

## 3. Incident Classification

| Severity | Description | Examples | Response Time |
|----------|-------------|----------|---------------|
| **Critical** | Active breach, data exfiltration, service down | Unauthorized DB access, ransomware | Immediate (< 15 min) |
| **High** | Potential breach, significant vulnerability | Exposed credentials, critical CVE | < 1 hour |
| **Medium** | Security weakness, no active exploitation | Misconfiguration, failed logins | < 4 hours |
| **Low** | Minor issue, informational | Policy violation, blocked phishing | < 24 hours |

## 4. Incident Response Team

| Role | Responsibility | Primary | Backup |
|------|---------------|---------|--------|
| **Incident Commander** | Overall coordination | Founder/CTO | Senior Engineer |
| **Technical Lead** | Investigation, containment | Senior Engineer | Any Engineer |
| **Communications** | Internal/external comms | Founder/CEO | Founder/CTO |

## 5. Response Procedures

### 5.1 Detection & Reporting

**Anyone who suspects a security incident must:**
1. Post immediately to **#security-incidents** Slack channel
2. Include: What, when, affected systems, how discovered
3. Do NOT attempt to fix without coordination

**Automated Detection:**
- CloudWatch alarms
- PostHog error tracking
- AWS GuardDuty alerts

### 5.2 Initial Assessment (< 15 minutes)

1. Acknowledge in Slack within 15 minutes
2. Classify severity
3. Assign Technical Lead
4. Create incident ticket

### 5.3 Containment

**Critical/High Severity:**
1. Isolate affected systems
2. Preserve evidence (do not delete logs)
3. Block malicious IPs/accounts
4. Decide: Degradation vs shutdown

### 5.4 Eradication & Recovery

1. Identify root cause
2. Remove threat
3. Patch vulnerabilities
4. Restore from clean backups if needed
5. Verify clean before restoring access

### 5.5 Communication

**Internal:** Updates in #security-incidents
**External:** Customer notification within 72 hours (GDPR)

## 6. Post-Incident Review

Within 5 business days for Critical/High:
1. Timeline of events
2. What went well
3. What could improve
4. Action items with owners

## 7. Evidence Preservation

Retain for minimum 90 days:
- CloudWatch logs
- CloudTrail logs
- Application logs
- Screenshots

---

*ISO 27001:2022 Controls: A.5.24, A.5.25, A.5.26, A.5.27, A.5.28*
MARKDOWN
)

# Escape for JSON
CONTENT_ESCAPED=$(echo "$CONTENT" | jq -Rs .)

curl -s "$API_URL" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $API_KEY" \
  -d "{
    \"query\": \"mutation CreateDocument(\$input: CreateDocumentInput!) { createDocument(input: \$input) { documentEdge { node { id title } } } }\",
    \"variables\": {
      \"input\": {
        \"organizationId\": \"$ORG_ID\",
        \"title\": \"Incident Response Plan\",
        \"documentType\": \"PROCEDURE\",
        \"classification\": \"INTERNAL\",
        \"approverIds\": [\"2delmZUAAAEAMwAAAZx_7gpd2SIz8U0x\"],
        \"content\": $CONTENT_ESCAPED
      }
    }
  }"
