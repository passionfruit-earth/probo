#!/bin/bash
# Create Business Continuity Plan in Probo

API_URL="http://localhost:8080/api/console/v1/graphql"
API_KEY="AAAAAAAAAAAAKwAAAZx_79LvST3o4WQK.JSOS2BKLmwlhZlO1TtejLgC69hJO8eeIbkbgHzo_h7w"
ORG_ID="2delmZUAAAEAAAAAAZx_7gpa_vVWYEaD"
APPROVER_ID="2delmZUAAAEAMwAAAZx_7gpd2SIz8U0x"

CONTENT=$(cat <<'MARKDOWN'
# Business Continuity Plan

**Version:** 1.0
**Effective Date:** 2026-02-21
**Owner:** CTO
**Review Cycle:** Annual

---

## 1. Purpose

This plan ensures Passionfruit can maintain or quickly resume critical business operations during and after a disruption to our systems or services.

## 2. Scope

Covers all critical systems:
- Production application (AWS ECS)
- Database (AWS RDS PostgreSQL)
- File storage (AWS S3)
- AI/ML services (Azure OpenAI)
- Authentication (Microsoft Entra)

## 3. Critical Systems & Dependencies

| System | Purpose | Provider | Criticality | RTO | RPO |
|--------|---------|----------|-------------|-----|-----|
| Web Application | Core SaaS platform | AWS ECS | Critical | 4 hours | 1 hour |
| Database | Customer data | AWS RDS | Critical | 2 hours | 15 min |
| Object Storage | Documents, evidence | AWS S3 | High | 4 hours | 24 hours |
| AI/ML API | Response generation | Azure OpenAI | High | 8 hours | N/A |
| Authentication | User login | Microsoft Entra | Critical | 1 hour | N/A |
| Monitoring | Observability | CloudWatch/PostHog | Medium | 24 hours | N/A |

**RTO** = Recovery Time Objective (max acceptable downtime)
**RPO** = Recovery Point Objective (max acceptable data loss)

## 4. Backup Strategy

### 4.1 Database (RDS PostgreSQL)

- **Automated Backups:** Daily, retained 7 days
- **Point-in-time Recovery:** Enabled (5-minute granularity)
- **Cross-region Replica:** [TODO: Implement]

**Recovery Procedure:**
```bash
# Restore from snapshot
aws rds restore-db-instance-from-db-snapshot \
  --db-instance-identifier probo-restored \
  --db-snapshot-identifier <snapshot-id>

# Or point-in-time recovery
aws rds restore-db-instance-to-point-in-time \
  --source-db-instance-identifier probo-prod \
  --target-db-instance-identifier probo-restored \
  --restore-time 2026-02-21T12:00:00Z
```

### 4.2 Object Storage (S3)

- **Versioning:** Enabled
- **Replication:** [TODO: Cross-region replication]
- **Lifecycle:** Non-current versions retained 30 days

### 4.3 Application Configuration

- **Infrastructure as Code:** Terraform in Git
- **Secrets:** AWS Secrets Manager
- **Container Images:** ECR with immutable tags

## 5. Disaster Recovery Procedures

### 5.1 Scenario: Single Service Failure

**Trigger:** One ECS service unhealthy
**Response:**
1. ECS auto-restarts failed tasks
2. If persistent, check CloudWatch logs
3. Roll back to previous task definition if needed

```bash
aws ecs update-service --cluster probo-prod \
  --service probo-api \
  --task-definition probo-api:<previous-version>
```

### 5.2 Scenario: Database Failure

**Trigger:** RDS instance unavailable
**Response:**
1. Check AWS Health Dashboard
2. If RDS issue, wait for AWS resolution
3. If data corruption, restore from backup
4. Update application connection string if needed

### 5.3 Scenario: Full Region Outage

**Trigger:** AWS EU region unavailable
**Response:**
1. Activate status page with outage notice
2. Notify customers via email
3. If extended (>4 hours), consider cross-region failover
4. [TODO: Document cross-region failover procedure]

### 5.4 Scenario: Azure OpenAI Unavailable

**Trigger:** AI service returns errors
**Response:**
1. Application should gracefully degrade
2. Queue requests for retry
3. If extended, consider AWS Bedrock fallback
4. Notify customers of degraded service

## 6. Communication During Outage

### Internal

- **Primary:** #incidents Slack channel
- **Backup:** Phone tree (see emergency contacts)
- **Update frequency:** Every 30 minutes during active incident

### External

- **Status Page:** [TODO: Set up status page]
- **Customer Email:** For major outages (>1 hour)
- **Template:**

```
Subject: Passionfruit Service Disruption - [Date]

We are currently experiencing a service disruption affecting [describe impact].

Current Status: [Investigating / Identified / Resolving]
Started: [Time UTC]
Expected Resolution: [ETA if known]

We will provide updates every [30 minutes / 1 hour].

For urgent matters, contact: support@passionfruit.earth
```

## 7. Recovery Priorities

1. **Authentication** - Users must be able to log in
2. **Database** - Core data must be accessible
3. **API** - Application functionality
4. **AI Features** - Response generation (can degrade gracefully)
5. **Monitoring** - Observability

## 8. Testing Schedule

| Test Type | Frequency | Last Tested | Next Due |
|-----------|-----------|-------------|----------|
| Backup Restoration | Quarterly | - | Q1 2026 |
| Failover Drill | Annually | - | 2026 |
| Communication Test | Semi-annually | - | Q2 2026 |

## 9. Emergency Contacts

| Role | Name | Phone | Email |
|------|------|-------|-------|
| Primary On-Call | [TBD] | [TBD] | [TBD] |
| Secondary On-Call | [TBD] | [TBD] | [TBD] |
| AWS Support | - | - | Support Console |

## 10. Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-02-21 | Claude/Passionfruit | Initial version |

---

*ISO 27001:2022 Controls: A.5.29, A.5.30*
MARKDOWN
)

CONTENT_ESCAPED=$(echo "$CONTENT" | jq -Rs .)

curl -s "$API_URL" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $API_KEY" \
  -d "{
    \"query\": \"mutation CreateDocument(\$input: CreateDocumentInput!) { createDocument(input: \$input) { documentEdge { node { id title } } } }\",
    \"variables\": {
      \"input\": {
        \"organizationId\": \"$ORG_ID\",
        \"title\": \"Business Continuity Plan\",
        \"documentType\": \"PROCEDURE\",
        \"classification\": \"INTERNAL\",
        \"approverIds\": [\"$APPROVER_ID\"],
        \"content\": $CONTENT_ESCAPED
      }
    }
  }"
