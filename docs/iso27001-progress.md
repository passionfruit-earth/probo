# ISO 27001 Certification Progress - Passionfruit

**Last Updated:** 2026-02-21
**Organization:** Passionfruit Earth B.V.
**Target:** ISO 27001:2022 Certification

---

## Overview

Passionfruit is pursuing ISO 27001:2022 certification for its AI-powered response automation platform for the food supply chain industry.

### Scope Summary

- **Product:** SaaS platform for automating customer request responses (ESG, QA questionnaires)
- **Hosting:** AWS (EU data centers) for application, AWS + Azure for AI/ML models
- **Team:** <10 people, mix of remote and co-working
- **Data:** Customer questionnaires, responses, evidence documents

---

## ISO 27001:2022 Structure

**IMPORTANT:** ISO 27001 has TWO main parts:

### 1. Mandatory Clauses 4-10 (ISMS Requirements)

These MUST be implemented by every organization:

| Clause | Title | Status |
|--------|-------|--------|
| 4 | Context of the organization | NOT_STARTED |
| 4.1 | Understanding the organization and its context | NOT_STARTED |
| 4.2 | Understanding needs and expectations of interested parties | NOT_STARTED |
| 4.3 | Determining the scope of the ISMS | DRAFT |
| 4.4 | Information security management system | NOT_STARTED |
| 5 | Leadership | NOT_STARTED |
| 5.1 | Leadership and commitment | NOT_STARTED |
| 5.2 | Information Security Policy | NOT_STARTED |
| 5.3 | Organizational roles, responsibilities and authorities | NOT_STARTED |
| 6 | Planning | NOT_STARTED |
| 6.1 | Actions to address risks and opportunities | NOT_STARTED |
| 6.1.2 | Information security risk assessment | NOT_STARTED |
| 6.1.3 | Information security risk treatment | NOT_STARTED |
| 6.2 | Information security objectives and planning | NOT_STARTED |
| 6.3 | Planning of changes | NOT_STARTED |
| 7 | Support | NOT_STARTED |
| 7.1 | Resources | NOT_STARTED |
| 7.2 | Competence | IN_PROGRESS |
| 7.3 | Awareness | IN_PROGRESS |
| 7.4 | Communication | NOT_STARTED |
| 7.5 | Documented information | NOT_STARTED |
| 8 | Operation | NOT_STARTED |
| 8.1 | Operational planning and control | NOT_STARTED |
| 8.2 | Information security risk assessment | NOT_STARTED |
| 8.3 | Information security risk treatment | NOT_STARTED |
| 9 | Performance evaluation | NOT_STARTED |
| 9.1 | Monitoring, measurement, analysis and evaluation | NOT_STARTED |
| 9.2 | Internal audit | NOT_STARTED |
| 9.3 | Management review | NOT_STARTED |
| 10 | Improvement | NOT_STARTED |
| 10.1 | Continual improvement | NOT_STARTED |
| 10.2 | Nonconformity and corrective action | NOT_STARTED |

### 2. Annex A Controls (93 Reference Controls)

These are SELECTED based on risk assessment - documented in Statement of Applicability (SoA):
- A.5: Organizational controls (37)
- A.6: People controls (8)
- A.7: Physical controls (14)
- A.8: Technological controls (34)

---

## Approach

We're using a **bottom-up approach**:
1. Map existing practices to Annex A controls first
2. Identify gaps in controls
3. Build mandatory ISMS documentation (clauses 4-10) with real context
4. Conduct risk assessment to justify control selection

---

## Phase 1: Assessment & Mapping - COMPLETED

- [x] Interviewed founders about current security practices
- [x] Reviewed existing Q&A documentation (customer security questionnaire)
- [x] Mapped 17 existing practices to ISO 27001 controls
- [x] Identified 12 gaps requiring new measures
- [x] Created measures in Probo (see `iso27001-probo-reference.md`)
- [x] Created internal rationale log (`iso27001-measures-log.md`)

---

## Phase 2: Gap Remediation - IN PROGRESS

### High Priority Gaps

| # | Gap | Control | Status | Assigned |
|---|-----|---------|--------|----------|
| 1 | Incident response plan | A.5.24 | IMPLEMENTED | - |
| 2 | Security event assessment process | A.5.25 | IMPLEMENTED | - |
| 3 | Incident response procedures | A.5.26 | IMPLEMENTED | - |
| 4 | Post-incident review process | A.5.27 | IMPLEMENTED | - |
| 5 | Business continuity plan | A.5.29 | IMPLEMENTED | - |
| 6 | ICT disaster recovery plan | A.5.30 | IMPLEMENTED | - |

**Documents Created in Probo:**
- Incident Response Plan (ID: `2delmZUAAAEACgAAAZyBB92Ti1ha589s`)
- Business Continuity Plan (ID: `2delmZUAAAEACgAAAZyBCTbg73Nskffa`)

### Medium Priority Gaps

| # | Gap | Control | Status | Assigned |
|---|-----|---------|--------|----------|
| 7 | Remote working security policy | A.6.7 | NOT_STARTED | - |
| 8 | Endpoint device security policy | A.8.1 | NOT_STARTED | - |
| 9 | Formal access review process | A.5.18 | NOT_STARTED | - |
| 10 | Vendor security assessment process | A.5.19 | NOT_STARTED | - |
| 11 | Security monitoring and alerting | A.8.16 | NOT_STARTED | - |
| 12 | Backup restore testing | A.8.13 | NOT_STARTED | - |

---

## Phase 3: Mandatory Documentation - PENDING

**These documents are REQUIRED by ISO 27001 clauses 4-10:**

### Clause 4 - Context

| Document | Clause | Status | Notes |
|----------|--------|--------|-------|
| ISMS Scope Statement | 4.3 | DRAFT | Define boundaries and applicability |
| Context Analysis | 4.1 | NOT_STARTED | Internal/external issues affecting ISMS |
| Interested Parties Analysis | 4.2 | NOT_STARTED | Who has requirements (customers, regulators, etc.) |

### Clause 5 - Leadership

| Document | Clause | Status | Notes |
|----------|--------|--------|-------|
| Information Security Policy | 5.2 | NOT_STARTED | Top-level management commitment |
| Roles & Responsibilities | 5.3 | NOT_STARTED | Who is responsible for what |

### Clause 6 - Planning

| Document | Clause | Status | Notes |
|----------|--------|--------|-------|
| Risk Assessment Methodology | 6.1.2 | NOT_STARTED | How risks are identified/evaluated |
| Risk Assessment Report | 6.1.2 | NOT_STARTED | Actual risk register |
| Risk Treatment Plan | 6.1.3 | NOT_STARTED | How risks will be addressed |
| Statement of Applicability (SoA) | 6.1.3 | NOT_STARTED | Which Annex A controls apply and why |
| Information Security Objectives | 6.2 | NOT_STARTED | Measurable security goals |

### Clause 7 - Support

| Document | Clause | Status | Notes |
|----------|--------|--------|-------|
| Competence Records | 7.2 | IN_PROGRESS | Training records, skills matrix |
| Awareness Program | 7.3 | IN_PROGRESS | Security awareness training |
| Communication Plan | 7.4 | NOT_STARTED | What, when, who, how to communicate |
| Document Control Procedure | 7.5 | NOT_STARTED | How documents are managed |

### Clause 8 - Operation

| Document | Clause | Status | Notes |
|----------|--------|--------|-------|
| Operational Procedures | 8.1 | PARTIAL | Existing procedures need formalization |

### Clause 9 - Performance Evaluation

| Document | Clause | Status | Notes |
|----------|--------|--------|-------|
| Monitoring & Measurement Plan | 9.1 | NOT_STARTED | What to measure, how, when |
| Internal Audit Program | 9.2 | NOT_STARTED | Audit schedule, procedures |
| Management Review Records | 9.3 | NOT_STARTED | Template for management reviews |

### Clause 10 - Improvement

| Document | Clause | Status | Notes |
|----------|--------|--------|-------|
| Nonconformity Procedure | 10.2 | NOT_STARTED | How to handle nonconformities |
| Corrective Action Procedure | 10.2 | NOT_STARTED | Root cause analysis, corrective actions |

---

## Phase 4: Implementation & Evidence - PENDING

For each implemented measure, collect evidence:
- Screenshots of configurations
- Policy documents
- Process documentation
- System exports

---

## Phase 5: Internal Audit - PENDING

- Conduct internal audit against ISO 27001 requirements
- Document findings
- Address non-conformities

---

## Phase 6: Certification Audit - PENDING

- Stage 1: Documentation review
- Stage 2: Implementation verification

---

## Tasks for Agents

### Documentation Tasks

| Task | Input | Output | Reference |
|------|-------|--------|-----------|
| Create Information Security Policy | Interview notes, company context | Formal policy document | ISO 27001 clause 5.2 |
| Create Risk Assessment Methodology | Company context, industry | Risk methodology document | ISO 27001 clause 6.1.2 |
| Create ISMS Scope Document | Scope summary, interview notes | Formal scope statement | ISO 27001 clause 4.3 |
| Create Incident Response Plan | Team size (<10), cloud architecture | IR plan document | A.5.24-27 |
| Create Business Continuity Plan | AWS infrastructure, critical services | BCP document | A.5.29-30 |
| Create Remote Working Policy | Remote/co-working team context | Policy document | A.6.7 |
| Create Endpoint Security Policy | Laptop usage, informal practices | Policy document | A.8.1 |

### Technical Tasks

| Task | Input | Output | Reference |
|------|-------|--------|-----------|
| Implement security alerting | CloudWatch, current error alerts | Security alerts configured | A.8.16 |
| Test backup restoration | RDS, S3 backup config | Documented restore test | A.8.13 |
| Set up access review schedule | SSO access management | Quarterly review process | A.5.18 |

---

## Current Security Stack

- **Auth:** Microsoft Entra SSO + MFA
- **Hosting:** AWS EU (ECS)
- **AI/ML:** Azure OpenAI
- **Monitoring:** CloudWatch, PostHog
- **Encryption:** TLS 1.2+, AES-256

---

## Vendor Security Assessment - COMPLETED

Security profiles gathered for 13 vendors (see `vendor-security-profiles.md`):

| Vendor | Confidence | Certifications | Trust Page | DPA |
|--------|------------|----------------|------------|-----|
| AWS | 100% | GDPR, HIPAA, PCI_DSS | ✓ | - |
| Azure OpenAI | 60% | GDPR | ✓ | - |
| GitHub | 80% | SOC2, GDPR | ✓ | - |
| Linear | 100% | SOC2, ISO27001, HIPAA, GDPR | ✓ | ✓ |
| PostHog | 30% | - | ✓ | - |
| Slack | 100% | SOC2, ISO27001, ISO27701, HIPAA, GDPR | ✓ | ✓ |
| Google Workspace | 60% | HIPAA | ✓ | - |
| Microsoft 365 | 60% | GDPR | ✓ | - |
| Notion | 100% | SOC2, ISO27001, ISO27701, HIPAA, GDPR | ✓ | - |
| Fireflies | 100% | SOC2, HIPAA, GDPR | ✓ | - |
| Attio | 100% | SOC2, ISO27001, GDPR | ✓ | - |
| Unstructured | 100% | SOC2, ISO27001, GDPR | ✓ | - |
| Sentry | 100% | SOC2, ISO27001, HIPAA, GDPR | ✓ | ✓ |

**TODO:** Complete DPA collection for vendors missing DPA links.

---

## Related Files

| File | Purpose |
|------|---------|
| `iso27001-measures-log.md` | Detailed rationale for each measure |
| `iso27001-probo-reference.md` | Probo IDs and API reference |
| `vendor-security-profiles.md` | Detailed vendor security info |
| `agent-development-plan.md` | Feature backlog for agent improvements |

---

## Change Log

| Date | Change | By |
|------|--------|-----|
| 2026-02-21 | Created Incident Response Plan and BCP in Probo | Claude/Passionfruit |
| 2026-02-21 | Added vendor security profiles | Claude/Passionfruit |
| 2026-02-21 | Added full ISO 27001 clause structure | Claude/Passionfruit |
| 2026-02-21 | Initial creation, Phase 1 completed | Claude/Passionfruit |
