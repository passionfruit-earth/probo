#!/bin/bash
# Create Risk Assessment Methodology in Probo (ISO 27001 Clause 6.1.2)

API_URL="http://localhost:8080/api/console/v1/graphql"
API_KEY="AAAAAAAAAAAAKwAAAZx_79LvST3o4WQK.JSOS2BKLmwlhZlO1TtejLgC69hJO8eeIbkbgHzo_h7w"
ORG_ID="2delmZUAAAEAAAAAAZx_7gpa_vVWYEaD"
APPROVER_ID="2delmZUAAAEAMwAAAZx_7gpd2SIz8U0x"

CONTENT='# Risk Assessment Methodology

**Version:** 1.0
**Effective Date:** 2026-02-21
**Owner:** Information Security Lead
**Review Cycle:** Annual
**Classification:** Internal

---

## 1. Purpose

This document defines the methodology for identifying, analyzing, evaluating, and treating information security risks at Passionfruit Earth B.V., as required by ISO 27001:2022 Clause 6.1.2.

## 2. Scope

This methodology applies to all information assets within the ISMS scope, including:
- Customer data and systems
- Infrastructure and applications
- Personnel and processes
- Third-party services and vendors

## 3. Risk Assessment Process

### 3.1 Process Overview

```
+-------------------+
| 1. Risk           |
|    Identification |
+--------+----------+
         |
         v
+--------+----------+
| 2. Risk           |
|    Analysis       |
+--------+----------+
         |
         v
+--------+----------+
| 3. Risk           |
|    Evaluation     |
+--------+----------+
         |
         v
+--------+----------+
| 4. Risk           |
|    Treatment      |
+--------+----------+
         |
         v
+--------+----------+
| 5. Risk           |
|    Monitoring     |
+-------------------+
```

### 3.2 Frequency

- **Full Assessment:** Annually, or after significant changes
- **Review:** Quarterly
- **Ad-hoc:** Following incidents or new threats

## 4. Risk Identification

### 4.1 Sources of Risk

Risks are identified from:
- Asset inventory review
- Threat intelligence
- Vulnerability assessments
- Security incidents
- Internal/external audits
- Regulatory changes
- Stakeholder feedback

### 4.2 Risk Categories

| Category | Examples |
|----------|----------|
| Data Security | Unauthorized access, data loss, data breach |
| Compliance | GDPR violations, contractual breaches |
| Availability | System outages, provider failures |
| Security | Malware, phishing, insider threats |
| Operational | Key person dependency, process failures |

### 4.3 Asset-Based Approach

For each critical asset:
1. Identify potential threats
2. Identify vulnerabilities that could be exploited
3. Consider existing controls
4. Document in risk register

## 5. Risk Analysis

### 5.1 Likelihood Scale (1-5)

| Level | Rating | Description | Frequency |
|-------|--------|-------------|-----------|
| 1 | Rare | Highly unlikely to occur | Less than once per 5 years |
| 2 | Unlikely | Could occur but not expected | Once per 2-5 years |
| 3 | Possible | Might occur at some time | Once per 1-2 years |
| 4 | Likely | Will probably occur | Multiple times per year |
| 5 | Almost Certain | Expected to occur | Monthly or more frequent |

### 5.2 Impact Scale (1-5)

| Level | Rating | Financial | Operational | Reputational |
|-------|--------|-----------|-------------|--------------|
| 1 | Negligible | Less than 1K EUR | Minor inconvenience | No external awareness |
| 2 | Minor | 1K-10K EUR | Limited disruption (hours) | Limited awareness |
| 3 | Moderate | 10K-50K EUR | Significant disruption (1 day) | Local media attention |
| 4 | Major | 50K-200K EUR | Severe disruption (days) | Industry attention |
| 5 | Critical | More than 200K EUR | Business threatening | National/international attention |

### 5.3 Risk Score Calculation

**Risk Score = Likelihood x Impact**

| Score | Level |
|-------|-------|
| 1-4 | Low |
| 5-9 | Medium |
| 10-15 | High |
| 16-25 | Critical |

### 5.4 Risk Matrix

```
Impact
  5 |  5  | 10  | 15  | 20  | 25  |
  4 |  4  |  8  | 12  | 16  | 20  |
  3 |  3  |  6  |  9  | 12  | 15  |
  2 |  2  |  4  |  6  |  8  | 10  |
  1 |  1  |  2  |  3  |  4  |  5  |
    +-----+-----+-----+-----+-----+
      1     2     3     4     5    Likelihood
```

## 6. Risk Evaluation

### 6.1 Risk Appetite

Passionfruit has the following risk appetite:

| Risk Level | Appetite | Required Action |
|------------|----------|-----------------|
| Critical (16-25) | Unacceptable | Immediate treatment required |
| High (10-15) | Low tolerance | Treatment plan within 30 days |
| Medium (5-9) | Moderate tolerance | Review and consider treatment |
| Low (1-4) | Acceptable | Monitor and review periodically |

### 6.2 Prioritization

Risks are prioritized by:
1. Inherent risk score (before controls)
2. Residual risk score (after controls)
3. Business criticality of affected assets
4. Regulatory implications

## 7. Risk Treatment

### 7.1 Treatment Options

| Option | Code | Description | When to Use |
|--------|------|-------------|-------------|
| Mitigate | MITIGATED | Implement controls to reduce risk | Risk is unacceptable, controls are available |
| Accept | ACCEPTED | Accept the risk without treatment | Risk is within appetite, cost of treatment exceeds benefit |
| Avoid | AVOIDED | Eliminate the risk source | Risk cannot be adequately mitigated |
| Transfer | TRANSFERRED | Share risk with third party | Insurance or outsourcing is appropriate |

### 7.2 Control Selection

Controls are selected from:
1. ISO 27001:2022 Annex A (93 controls)
2. Industry best practices
3. Vendor recommendations
4. Regulatory requirements

### 7.3 Residual Risk

After treatment:
1. Re-assess likelihood and impact
2. Calculate residual risk score
3. Obtain management approval for residual risks
4. Document acceptance decision

## 8. Risk Register

### 8.1 Required Information

Each risk entry includes:
- Unique identifier
- Risk name and description
- Category
- Asset(s) affected
- Threat and vulnerability
- Existing controls
- Inherent likelihood and impact
- Treatment decision
- Planned/implemented controls
- Residual likelihood and impact
- Risk owner
- Review date

### 8.2 Maintenance

The risk register is:
- Maintained in Probo
- Updated quarterly or after changes
- Reviewed by management
- Archived for audit purposes

## 9. Roles and Responsibilities

| Role | Responsibilities |
|------|------------------|
| Management | Approve risk appetite, treatment decisions, resources |
| Information Security Lead | Facilitate assessments, maintain register, report |
| Risk Owners | Identify risks, implement treatments, monitor |
| All Personnel | Report risks and incidents |

## 10. Integration with ISMS

Risk assessment informs:
- Statement of Applicability (control selection)
- Information Security Objectives
- Internal audit planning
- Management review
- Continual improvement

## 11. Document Control

| Version | Date | Author | Approved By | Changes |
|---------|------|--------|-------------|---------|
| 1.0 | 2026-02-21 | Information Security Lead | CEO | Initial version |

---

*This document supports ISO 27001:2022 Clause 6.1.2*

**Approved by:** _________________________ (CEO/Managing Director)

**Date:** _________________________'

CONTENT_ESCAPED=$(echo "$CONTENT" | jq -Rs .)

echo "Creating Risk Assessment Methodology in Probo..."

response=$(curl -s "$API_URL" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $API_KEY" \
  -d "{
    \"query\": \"mutation CreateDocument(\$input: CreateDocumentInput!) { createDocument(input: \$input) { documentEdge { node { id title } } } }\",
    \"variables\": {
      \"input\": {
        \"organizationId\": \"$ORG_ID\",
        \"title\": \"Risk Assessment Methodology\",
        \"documentType\": \"PROCEDURE\",
        \"classification\": \"INTERNAL\",
        \"approverIds\": [\"$APPROVER_ID\"],
        \"content\": $CONTENT_ESCAPED
      }
    }
  }")

if echo "$response" | grep -q '"id"'; then
  doc_id=$(echo "$response" | jq -r '.data.createDocument.documentEdge.node.id')
  echo "[OK] Created Risk Assessment Methodology"
  echo "  Document ID: $doc_id"
else
  echo "[ERROR] Failed to create document"
  echo "$response"
fi
