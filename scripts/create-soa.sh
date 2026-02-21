#!/bin/bash
# Create Statement of Applicability in Probo (ISO 27001 Clause 6.1.3)

API_URL="http://localhost:8080/api/console/v1/graphql"
API_KEY="AAAAAAAAAAAAKwAAAZx_79LvST3o4WQK.JSOS2BKLmwlhZlO1TtejLgC69hJO8eeIbkbgHzo_h7w"
ORG_ID="2delmZUAAAEAAAAAAZx_7gpa_vVWYEaD"
APPROVER_ID="2delmZUAAAEAMwAAAZx_7gpd2SIz8U0x"

CONTENT='# Statement of Applicability (SoA)

**Version:** 1.0
**Effective Date:** 2026-02-21
**Owner:** Information Security Lead
**Review Cycle:** Annual
**Classification:** Internal

---

## 1. Purpose

This Statement of Applicability (SoA) documents the applicability of ISO 27001:2022 Annex A controls for Passionfruit Earth B.V., as required by Clause 6.1.3.

## 2. Context

- **Organization:** Passionfruit Earth B.V.
- **Business:** AI-powered SaaS for food supply chain
- **Infrastructure:** Cloud-only (AWS, Azure)
- **Team:** Less than 10 people, remote-first
- **Physical Premises:** None owned (co-working spaces)

## 3. Control Applicability Summary

| Category | Total Controls | Applicable | Not Applicable |
|----------|---------------|------------|----------------|
| A.5 Organizational (37) | 37 | 35 | 2 |
| A.6 People (8) | 8 | 8 | 0 |
| A.7 Physical (14) | 14 | 6 | 8 |
| A.8 Technological (34) | 34 | 32 | 2 |
| **Total** | **93** | **81** | **12** |

## 4. A.5 Organizational Controls

| ID | Control | Applicable | Status | Justification |
|----|---------|------------|--------|---------------|
| A.5.1 | Policies for information security | Yes | IMPLEMENTED | Information Security Policy created |
| A.5.2 | Information security roles | Yes | IMPLEMENTED | Defined in policy |
| A.5.3 | Segregation of duties | Yes | PARTIAL | Limited by team size, compensating controls in place |
| A.5.4 | Management responsibilities | Yes | IMPLEMENTED | Defined in policy |
| A.5.5 | Contact with authorities | Yes | IMPLEMENTED | GDPR DPA contact documented |
| A.5.6 | Contact with special interest groups | Yes | IMPLEMENTED | Industry groups, security communities |
| A.5.7 | Threat intelligence | Yes | IMPLEMENTED | AWS/Azure security bulletins, GitHub advisories |
| A.5.8 | Information security in project management | Yes | IMPLEMENTED | Security review in development process |
| A.5.9 | Inventory of information assets | Yes | IMPLEMENTED | Asset register in Probo |
| A.5.10 | Acceptable use of assets | Yes | PLANNED | Policy to be created |
| A.5.11 | Return of assets | Yes | IMPLEMENTED | Offboarding checklist |
| A.5.12 | Classification of information | Yes | IMPLEMENTED | Internal/Confidential/Public |
| A.5.13 | Labeling of information | Yes | PARTIAL | Document classification headers |
| A.5.14 | Information transfer | Yes | IMPLEMENTED | TLS encryption, secure channels |
| A.5.15 | Access control | Yes | IMPLEMENTED | SSO, RBAC |
| A.5.16 | Identity management | Yes | IMPLEMENTED | Microsoft Entra |
| A.5.17 | Authentication information | Yes | IMPLEMENTED | MFA enforced |
| A.5.18 | Access rights | Yes | IMPLEMENTED | Quarterly access reviews |
| A.5.19 | Supplier relationships | Yes | IMPLEMENTED | Vendor assessment process |
| A.5.20 | Addressing security in supplier agreements | Yes | IMPLEMENTED | DPAs, security clauses |
| A.5.21 | Managing security in ICT supply chain | Yes | IMPLEMENTED | Dependency scanning, vendor monitoring |
| A.5.22 | Monitoring of supplier services | Yes | IMPLEMENTED | Status page monitoring |
| A.5.23 | Information security for cloud services | Yes | IMPLEMENTED | AWS/Azure security configuration |
| A.5.24 | Incident management planning | Yes | IMPLEMENTED | Incident Response Plan |
| A.5.25 | Assessment of security events | Yes | IMPLEMENTED | Triage process documented |
| A.5.26 | Response to security incidents | Yes | IMPLEMENTED | Response procedures |
| A.5.27 | Learning from incidents | Yes | IMPLEMENTED | Post-incident review |
| A.5.28 | Collection of evidence | Yes | IMPLEMENTED | Evidence procedures |
| A.5.29 | Security during disruption | Yes | IMPLEMENTED | Business Continuity Plan |
| A.5.30 | ICT readiness for business continuity | Yes | IMPLEMENTED | DR procedures documented |
| A.5.31 | Legal requirements | Yes | IMPLEMENTED | GDPR compliance |
| A.5.32 | Intellectual property rights | Yes | IMPLEMENTED | Code ownership, licensing |
| A.5.33 | Protection of records | Yes | IMPLEMENTED | Document retention |
| A.5.34 | Privacy and PII protection | Yes | IMPLEMENTED | Privacy policy, DPAs |
| A.5.35 | Independent review | Yes | PLANNED | Annual audit scheduled |
| A.5.36 | Compliance with policies | Yes | IMPLEMENTED | Self-assessment |
| A.5.37 | Documented operating procedures | Yes | PARTIAL | Runbooks in progress |

## 5. A.6 People Controls

| ID | Control | Applicable | Status | Justification |
|----|---------|------------|--------|---------------|
| A.6.1 | Screening | Yes | IMPLEMENTED | Background checks for employees |
| A.6.2 | Terms and conditions | Yes | IMPLEMENTED | Employment contracts with security clauses |
| A.6.3 | Security awareness training | Yes | IMPLEMENTED | Onboarding training, annual refresher |
| A.6.4 | Disciplinary process | Yes | IMPLEMENTED | Defined in employee handbook |
| A.6.5 | Responsibilities after termination | Yes | IMPLEMENTED | NDA, offboarding process |
| A.6.6 | Confidentiality agreements | Yes | IMPLEMENTED | NDA in contracts |
| A.6.7 | Remote working | Yes | PLANNED | Policy to be created |
| A.6.8 | Information security event reporting | Yes | IMPLEMENTED | Slack channel, reporting process |

## 6. A.7 Physical Controls

| ID | Control | Applicable | Status | Justification |
|----|---------|------------|--------|---------------|
| A.7.1 | Physical security perimeters | No | N/A | No owned premises, cloud-only |
| A.7.2 | Physical entry | No | N/A | Co-working managed by provider |
| A.7.3 | Securing offices and facilities | No | N/A | No owned facilities |
| A.7.4 | Physical security monitoring | No | N/A | No owned premises |
| A.7.5 | Protecting against physical threats | No | N/A | Cloud infrastructure |
| A.7.6 | Working in secure areas | No | N/A | No secure areas owned |
| A.7.7 | Clear desk and screen | Yes | IMPLEMENTED | Policy for remote workers |
| A.7.8 | Equipment siting and protection | Yes | PARTIAL | Laptop security guidance |
| A.7.9 | Security of assets off-premises | Yes | IMPLEMENTED | Device encryption |
| A.7.10 | Storage media | Yes | IMPLEMENTED | Encryption, secure disposal |
| A.7.11 | Supporting utilities | No | N/A | AWS manages infrastructure |
| A.7.12 | Cabling security | No | N/A | Cloud infrastructure |
| A.7.13 | Equipment maintenance | Yes | IMPLEMENTED | Device management |
| A.7.14 | Secure disposal of equipment | Yes | IMPLEMENTED | Secure wipe procedures |

## 7. A.8 Technological Controls

| ID | Control | Applicable | Status | Justification |
|----|---------|------------|--------|---------------|
| A.8.1 | User endpoint devices | Yes | PLANNED | Policy to be created |
| A.8.2 | Privileged access rights | Yes | IMPLEMENTED | Limited admin access |
| A.8.3 | Information access restriction | Yes | IMPLEMENTED | RBAC implementation |
| A.8.4 | Access to source code | Yes | IMPLEMENTED | GitHub access controls |
| A.8.5 | Secure authentication | Yes | IMPLEMENTED | MFA, SSO |
| A.8.6 | Capacity management | Yes | IMPLEMENTED | AWS auto-scaling |
| A.8.7 | Protection against malware | Yes | IMPLEMENTED | Endpoint protection |
| A.8.8 | Management of technical vulnerabilities | Yes | IMPLEMENTED | Dependabot, patching |
| A.8.9 | Configuration management | Yes | IMPLEMENTED | Infrastructure as Code |
| A.8.10 | Information deletion | Yes | IMPLEMENTED | Data retention policies |
| A.8.11 | Data masking | Yes | PARTIAL | Production data handling |
| A.8.12 | Data leakage prevention | Yes | IMPLEMENTED | DLP controls |
| A.8.13 | Information backup | Yes | IMPLEMENTED | RDS/S3 backups |
| A.8.14 | Redundancy | Yes | IMPLEMENTED | Multi-AZ deployment |
| A.8.15 | Logging | Yes | IMPLEMENTED | CloudWatch, application logs |
| A.8.16 | Monitoring activities | Yes | IMPLEMENTED | CloudWatch alerts |
| A.8.17 | Clock synchronization | Yes | IMPLEMENTED | AWS NTP |
| A.8.18 | Use of privileged utility programs | Yes | IMPLEMENTED | Limited access |
| A.8.19 | Installation of software | Yes | IMPLEMENTED | Controlled deployment |
| A.8.20 | Networks security | Yes | IMPLEMENTED | VPC, security groups |
| A.8.21 | Security of network services | Yes | IMPLEMENTED | AWS managed services |
| A.8.22 | Segregation of networks | Yes | IMPLEMENTED | VPC segmentation |
| A.8.23 | Web filtering | No | N/A | Not applicable for SaaS |
| A.8.24 | Use of cryptography | Yes | IMPLEMENTED | TLS, AES-256 |
| A.8.25 | Secure development life cycle | Yes | IMPLEMENTED | PR reviews, CI/CD |
| A.8.26 | Application security requirements | Yes | IMPLEMENTED | Security requirements |
| A.8.27 | Secure system architecture | Yes | IMPLEMENTED | Architecture reviews |
| A.8.28 | Secure coding | Yes | IMPLEMENTED | Coding standards |
| A.8.29 | Security testing | Yes | IMPLEMENTED | Automated testing |
| A.8.30 | Outsourced development | No | N/A | Development in-house |
| A.8.31 | Separation of environments | Yes | IMPLEMENTED | Dev/staging/prod |
| A.8.32 | Change management | Yes | IMPLEMENTED | PR process |
| A.8.33 | Test information | Yes | IMPLEMENTED | Synthetic test data |
| A.8.34 | Protection of systems during audit | Yes | IMPLEMENTED | Audit access controls |

## 8. Non-Applicable Controls Summary

| ID | Control | Justification |
|----|---------|---------------|
| A.7.1 | Physical security perimeters | No owned premises - cloud only infrastructure |
| A.7.2 | Physical entry | Co-working spaces managed by providers |
| A.7.3 | Securing offices and facilities | No owned facilities |
| A.7.4 | Physical security monitoring | No owned premises to monitor |
| A.7.5 | Protecting against physical threats | Cloud infrastructure handles physical security |
| A.7.6 | Working in secure areas | No secure areas - remote team |
| A.7.11 | Supporting utilities | AWS manages power/cooling |
| A.7.12 | Cabling security | No owned data center cabling |
| A.8.23 | Web filtering | B2B SaaS - no employee web filtering needed |
| A.8.30 | Outsourced development | All development performed in-house |

## 9. Control Status Summary

| Status | Count | Percentage |
|--------|-------|------------|
| IMPLEMENTED | 62 | 77% |
| PARTIAL | 7 | 9% |
| PLANNED | 4 | 5% |
| N/A | 12 | - |

## 10. Document Control

| Version | Date | Author | Approved By | Changes |
|---------|------|--------|-------------|---------|
| 1.0 | 2026-02-21 | Information Security Lead | CEO | Initial version |

---

*This document supports ISO 27001:2022 Clause 6.1.3*

**Approved by:** _________________________ (CEO/Managing Director)

**Date:** _________________________'

CONTENT_ESCAPED=$(echo "$CONTENT" | jq -Rs .)

echo "Creating Statement of Applicability in Probo..."

response=$(curl -s "$API_URL" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $API_KEY" \
  -d "{
    \"query\": \"mutation CreateDocument(\$input: CreateDocumentInput!) { createDocument(input: \$input) { documentEdge { node { id title } } } }\",
    \"variables\": {
      \"input\": {
        \"organizationId\": \"$ORG_ID\",
        \"title\": \"Statement of Applicability\",
        \"documentType\": \"POLICY\",
        \"classification\": \"INTERNAL\",
        \"approverIds\": [\"$APPROVER_ID\"],
        \"content\": $CONTENT_ESCAPED
      }
    }
  }")

if echo "$response" | grep -q '"id"'; then
  doc_id=$(echo "$response" | jq -r '.data.createDocument.documentEdge.node.id')
  echo "[OK] Created Statement of Applicability"
  echo "  Document ID: $doc_id"
else
  echo "[ERROR] Failed to create document"
  echo "$response"
fi
