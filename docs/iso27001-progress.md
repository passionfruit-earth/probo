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

## Approach

We're using a **bottom-up approach**:
1. Map existing practices to controls first
2. Identify gaps
3. Then formalize top-level documentation with real context

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
| 1 | Incident response plan | A.5.24 | NOT_STARTED | - |
| 2 | Security event assessment process | A.5.25 | NOT_STARTED | - |
| 3 | Incident response procedures | A.5.26 | NOT_STARTED | - |
| 4 | Post-incident review process | A.5.27 | NOT_STARTED | - |
| 5 | Business continuity plan | A.5.29 | NOT_STARTED | - |
| 6 | ICT disaster recovery plan | A.5.30 | NOT_STARTED | - |

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

| Document | Status | Notes |
|----------|--------|-------|
| ISMS Scope Statement | DRAFT | Scope defined, needs formal document |
| Information Security Policy | NOT_STARTED | Top-level management commitment |
| Risk Assessment Methodology | NOT_STARTED | How risks are identified/evaluated |
| Statement of Applicability (SoA) | NOT_STARTED | Which controls apply and why |
| Risk Assessment | NOT_STARTED | Actual risk register |
| Risk Treatment Plan | NOT_STARTED | How risks will be addressed |

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

## Related Files

| File | Purpose |
|------|---------|
| `iso27001-measures-log.md` | Detailed rationale for each measure |
| `iso27001-probo-reference.md` | Probo IDs and API reference |

---

## Change Log

| Date | Change | By |
|------|--------|-----|
| 2026-02-21 | Initial creation, Phase 1 completed | Claude/Passionfruit |
