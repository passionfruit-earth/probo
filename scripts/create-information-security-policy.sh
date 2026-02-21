#!/bin/bash
# Create Information Security Policy in Probo (ISO 27001 Clause 5.2)

API_URL="http://localhost:8080/api/console/v1/graphql"
API_KEY="AAAAAAAAAAAAKwAAAZx_79LvST3o4WQK.JSOS2BKLmwlhZlO1TtejLgC69hJO8eeIbkbgHzo_h7w"
ORG_ID="2delmZUAAAEAAAAAAZx_7gpa_vVWYEaD"
APPROVER_ID="2delmZUAAAEAMwAAAZx_7gpd2SIz8U0x"

CONTENT='# Information Security Policy

**Version:** 1.0
**Effective Date:** 2026-02-21
**Owner:** CEO / Managing Director
**Review Cycle:** Annual
**Classification:** Internal

---

## 1. Purpose

This policy establishes the framework for information security at Passionfruit Earth B.V. It demonstrates management commitment to protecting information assets and provides direction for the Information Security Management System (ISMS).

## 2. Scope

This policy applies to:
- All employees, contractors, and third parties with access to Passionfruit systems
- All information assets owned or managed by Passionfruit
- All information processing facilities and systems
- The SaaS platform for automating customer request responses

## 3. Policy Statement

Passionfruit is committed to:

1. **Protecting customer data** - Ensuring the confidentiality, integrity, and availability of all customer questionnaires, responses, and evidence documents entrusted to us.

2. **Maintaining compliance** - Meeting all applicable legal, regulatory, and contractual requirements, including GDPR and ISO 27001:2022.

3. **Managing risks** - Identifying, assessing, and treating information security risks in a systematic manner appropriate to our business context.

4. **Continuous improvement** - Regularly reviewing and improving our security practices to address evolving threats and business needs.

5. **Building security awareness** - Ensuring all personnel understand their security responsibilities and are competent to perform their roles securely.

## 4. Information Security Objectives

Passionfruit establishes the following measurable security objectives:

| Objective | Target | Measurement |
|-----------|--------|-------------|
| Security incidents | Less than 2 major incidents per year | Incident register |
| Awareness training | 100% completion annually | Training records |
| Vulnerability remediation | Critical: 7 days, High: 30 days | Patch tracking |
| System availability | 99.5% uptime | Monitoring metrics |
| Access reviews | Quarterly reviews completed | Review records |

## 5. Responsibilities

### 5.1 Management (CEO/CTO)
- Provide resources for the ISMS
- Approve security policies and risk treatment decisions
- Conduct management reviews
- Champion security culture

### 5.2 Information Security Lead
- Maintain the ISMS documentation
- Coordinate risk assessments
- Monitor security controls
- Report on ISMS performance
- Manage security incidents

### 5.3 All Personnel
- Comply with security policies and procedures
- Report security incidents and weaknesses
- Complete security awareness training
- Protect credentials and access rights

## 6. Key Security Principles

### 6.1 Confidentiality
- Information is classified and protected according to its sensitivity
- Access is granted on a need-to-know basis
- Customer data is encrypted at rest and in transit

### 6.2 Integrity
- Changes to systems and data are authorized and tracked
- Data validation ensures accuracy
- Audit trails maintain accountability

### 6.3 Availability
- Critical systems have defined recovery objectives
- Business continuity plans address disruption scenarios
- Backups are tested regularly

## 7. Risk Management

- Risks are identified, assessed, and treated according to our Risk Assessment Methodology
- The risk register is reviewed quarterly
- Risk treatment decisions are documented and approved by management
- Residual risks are accepted only with management approval

## 8. Compliance

Passionfruit commits to complying with:
- **GDPR** - EU General Data Protection Regulation
- **ISO 27001:2022** - Information Security Management
- **Contractual obligations** - Customer security requirements
- **Internal policies** - Supporting security policies and procedures

## 9. Policy Violations

Violations of this policy may result in:
- Disciplinary action up to and including termination
- Revocation of system access
- Legal action where appropriate

All suspected violations should be reported to the Information Security Lead.

## 10. Supporting Documents

This policy is supported by:
- Risk Assessment Methodology
- Incident Response Plan
- Business Continuity Plan
- Access Control Policy
- Acceptable Use Policy
- Data Classification Policy

## 11. Review and Approval

This policy shall be reviewed at least annually or following significant changes to the business, technology, or threat landscape.

| Version | Date | Author | Approved By | Changes |
|---------|------|--------|-------------|---------|
| 1.0 | 2026-02-21 | Information Security Lead | CEO | Initial version |

---

*This policy supports ISO 27001:2022 Clause 5.2*

**Approved by:** _________________________ (CEO/Managing Director)

**Date:** _________________________'

CONTENT_ESCAPED=$(echo "$CONTENT" | jq -Rs .)

echo "Creating Information Security Policy in Probo..."

response=$(curl -s "$API_URL" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $API_KEY" \
  -d "{
    \"query\": \"mutation CreateDocument(\$input: CreateDocumentInput!) { createDocument(input: \$input) { documentEdge { node { id title } } } }\",
    \"variables\": {
      \"input\": {
        \"organizationId\": \"$ORG_ID\",
        \"title\": \"Information Security Policy\",
        \"documentType\": \"POLICY\",
        \"classification\": \"INTERNAL\",
        \"approverIds\": [\"$APPROVER_ID\"],
        \"content\": $CONTENT_ESCAPED
      }
    }
  }")

if echo "$response" | grep -q '"id"'; then
  doc_id=$(echo "$response" | jq -r '.data.createDocument.documentEdge.node.id')
  echo "[OK] Created Information Security Policy"
  echo "  Document ID: $doc_id"
else
  echo "[ERROR] Failed to create document"
  echo "$response"
fi
