#!/bin/bash
# Create ISMS Scope Statement in Probo (ISO 27001 Clause 4.3)

API_URL="http://localhost:8080/api/console/v1/graphql"
API_KEY="AAAAAAAAAAAAKwAAAZx_79LvST3o4WQK.JSOS2BKLmwlhZlO1TtejLgC69hJO8eeIbkbgHzo_h7w"
ORG_ID="2delmZUAAAEAAAAAAZx_7gpa_vVWYEaD"
APPROVER_ID="2delmZUAAAEAMwAAAZx_7gpd2SIz8U0x"

CONTENT='# ISMS Scope Statement

**Version:** 1.0
**Effective Date:** 2026-02-21
**Owner:** CEO / Managing Director
**Review Cycle:** Annual
**Classification:** Internal

---

## 1. Purpose

This document defines the boundaries and applicability of the Information Security Management System (ISMS) at Passionfruit Earth B.V., as required by ISO 27001:2022 Clause 4.3.

## 2. Organization Overview

**Organization:** Passionfruit Earth B.V.
**Industry:** Food Supply Chain Technology
**Business:** AI-powered SaaS platform for automating customer request responses (ESG questionnaires, QA surveys)
**Headquarters:** Netherlands
**Team Size:** Less than 10 people
**Working Model:** Remote-first with co-working spaces

## 3. ISMS Scope

### 3.1 Scope Statement

The ISMS applies to:

**The design, development, operation, and maintenance of the Passionfruit SaaS platform, including all information processing facilities, systems, and personnel involved in delivering AI-powered response automation services for the food supply chain industry.**

### 3.2 Included in Scope

#### 3.2.1 Products and Services
- Passionfruit web application (customer-facing SaaS)
- AI/ML response generation engine
- Document and evidence management
- Customer questionnaire processing
- API integrations

#### 3.2.2 Information Assets
- Customer questionnaires and responses
- Evidence documents uploaded by customers
- AI training data and models
- Application source code and configuration
- System logs and monitoring data
- Employee and contractor information

#### 3.2.3 Technology Infrastructure
- AWS EU infrastructure (ECS, RDS, S3, CloudWatch)
- Azure OpenAI services
- Microsoft Entra (authentication/SSO)
- Development and CI/CD pipelines
- Corporate SaaS tools (Slack, Notion, Linear, etc.)

#### 3.2.4 Physical Locations
- Remote working locations (employee homes)
- Co-working spaces (as used by team members)
- No owned data centers (cloud-only infrastructure)

#### 3.2.5 Personnel
- All employees (permanent and temporary)
- Contractors with system access
- Third-party support personnel (as applicable)

### 3.3 Excluded from Scope

The following are explicitly excluded from the ISMS scope:

| Exclusion | Justification |
|-----------|---------------|
| Customer internal systems | Outside organizational control |
| Third-party vendor internal operations | Covered by vendor contracts and assessments |
| Personal devices not used for work | Not accessing company systems |
| Physical security of co-working spaces | Managed by co-working space providers |

## 4. Interfaces and Dependencies

### 4.1 External Interfaces
- Customer web browsers accessing the platform
- API connections to customer systems
- AI/ML model APIs (Azure OpenAI)
- Authentication providers (Microsoft Entra)

### 4.2 Key Dependencies
- AWS for infrastructure hosting
- Azure for AI capabilities
- Microsoft for identity management
- GitHub for source code management

## 5. Applicable Requirements

### 5.1 Legal and Regulatory
- EU General Data Protection Regulation (GDPR)
- Dutch data protection laws
- ePrivacy Directive requirements

### 5.2 Contractual
- Customer data processing agreements
- Vendor service level agreements
- NDA requirements

### 5.3 Standards
- ISO 27001:2022 certification requirements
- Industry best practices for cloud security

## 6. Risk Considerations

The scope has been defined considering:
- The nature of customer data processed (business questionnaires, ESG data)
- The cloud-based delivery model
- The small team size enabling direct oversight
- The remote working environment
- Third-party cloud provider dependencies

## 7. Scope Review

This scope statement shall be reviewed:
- At least annually
- Following significant organizational changes
- After major system or service changes
- When required by management review

## 8. Document Control

| Version | Date | Author | Approved By | Changes |
|---------|------|--------|-------------|---------|
| 1.0 | 2026-02-21 | Information Security Lead | CEO | Initial version |

---

*This document supports ISO 27001:2022 Clause 4.3*

**Approved by:** _________________________ (CEO/Managing Director)

**Date:** _________________________'

CONTENT_ESCAPED=$(echo "$CONTENT" | jq -Rs .)

echo "Creating ISMS Scope Statement in Probo..."

response=$(curl -s "$API_URL" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $API_KEY" \
  -d "{
    \"query\": \"mutation CreateDocument(\$input: CreateDocumentInput!) { createDocument(input: \$input) { documentEdge { node { id title } } } }\",
    \"variables\": {
      \"input\": {
        \"organizationId\": \"$ORG_ID\",
        \"title\": \"ISMS Scope Statement\",
        \"documentType\": \"POLICY\",
        \"classification\": \"INTERNAL\",
        \"approverIds\": [\"$APPROVER_ID\"],
        \"content\": $CONTENT_ESCAPED
      }
    }
  }")

if echo "$response" | grep -q '"id"'; then
  doc_id=$(echo "$response" | jq -r '.data.createDocument.documentEdge.node.id')
  echo "[OK] Created ISMS Scope Statement"
  echo "  Document ID: $doc_id"
else
  echo "[ERROR] Failed to create document"
  echo "$response"
fi
