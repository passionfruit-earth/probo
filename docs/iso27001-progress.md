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
| 4 | Context of the organization | IN_PROGRESS |
| 4.1 | Understanding the organization and its context | NOT_STARTED |
| 4.2 | Understanding needs and expectations of interested parties | NOT_STARTED |
| 4.3 | Determining the scope of the ISMS | IMPLEMENTED |
| 4.4 | Information security management system | IN_PROGRESS |
| 5 | Leadership | IN_PROGRESS |
| 5.1 | Leadership and commitment | IMPLEMENTED |
| 5.2 | Information Security Policy | IMPLEMENTED |
| 5.3 | Organizational roles, responsibilities and authorities | PARTIAL |
| 6 | Planning | IMPLEMENTED |
| 6.1 | Actions to address risks and opportunities | IMPLEMENTED |
| 6.1.2 | Information security risk assessment | IMPLEMENTED |
| 6.1.3 | Information security risk treatment | IMPLEMENTED |
| 6.2 | Information security objectives and planning | PARTIAL |
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
- Information Security Policy (ID: `2delmZUAAAEACgAAAZyBK4FqVlXMfR4a`)
- ISMS Scope Statement (ID: `2delmZUAAAEACgAAAZyBL_19QhhOt-6d`)
- Risk Assessment Methodology (ID: `2delmZUAAAEACgAAAZyBMRAsSsUUMvi0`)
- Statement of Applicability (ID: `2delmZUAAAEACgAAAZyBQ_orHneoAGYh`)
- Remote Working Policy (ID: `2delmZUAAAEACgAAAZyBS04A-pciTlPX`)

### Medium Priority Gaps

| # | Gap | Control | Status | Assigned |
|---|-----|---------|--------|----------|
| 7 | Remote working security policy | A.6.7 | IMPLEMENTED | - |
| 8 | Endpoint device security policy | A.8.1 | NOT_STARTED | - |
| 9 | Formal access review process | A.5.18 | NOT_STARTED | - |
| 10 | Vendor security assessment process | A.5.19 | NOT_STARTED | - |
| 11 | Security monitoring and alerting | A.8.16 | NOT_STARTED | - |
| 12 | Backup restore testing | A.8.13 | NOT_STARTED | - |

---

## Phase 3: Mandatory Documentation - IN PROGRESS

**These documents are REQUIRED by ISO 27001 clauses 4-10:**

### Clause 4 - Context

| Document | Clause | Status | Notes |
|----------|--------|--------|-------|
| ISMS Scope Statement | 4.3 | IMPLEMENTED | ID: `2delmZUAAAEACgAAAZyBL_19QhhOt-6d` |
| Context Analysis | 4.1 | NOT_STARTED | Internal/external issues affecting ISMS |
| Interested Parties Analysis | 4.2 | NOT_STARTED | Who has requirements (customers, regulators, etc.) |

### Clause 5 - Leadership

| Document | Clause | Status | Notes |
|----------|--------|--------|-------|
| Information Security Policy | 5.2 | IMPLEMENTED | ID: `2delmZUAAAEACgAAAZyBK4FqVlXMfR4a` |
| Roles & Responsibilities | 5.3 | PARTIAL | Defined in Information Security Policy |

### Clause 6 - Planning

| Document | Clause | Status | Notes |
|----------|--------|--------|-------|
| Risk Assessment Methodology | 6.1.2 | IMPLEMENTED | ID: `2delmZUAAAEACgAAAZyBMRAsSsUUMvi0` |
| Risk Assessment Report | 6.1.2 | IMPLEMENTED | 10 risks in Probo risk register |
| Risk Treatment Plan | 6.1.3 | IMPLEMENTED | Treatment documented per risk |
| Statement of Applicability (SoA) | 6.1.3 | IMPLEMENTED | ID: `2delmZUAAAEACgAAAZyBQ_orHneoAGYh` |
| Information Security Objectives | 6.2 | PARTIAL | Defined in Information Security Policy |

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

## Phase 4: Implementation & Evidence - IN PROGRESS

**Goal:** Verify controls are actually working and collect audit evidence.

### Compliance Automation

**Approach changed 2026-02-21:** Migrated from TypeScript agent to Claude Code skills.

| Skill | Purpose | Location |
|-------|---------|----------|
| `/scan <system>` | Automated compliance checks | `.claude-plugin/commands/scan.md` |
| `/probo-list` | List Probo items | `.claude-plugin/commands/probo-list.md` |
| `/probo-create` | Create items in Probo | `.claude-plugin/commands/probo-create.md` |
| `/probo-update` | Update items in Probo | `.claude-plugin/commands/probo-update.md` |
| `/probo-link` | Link items in Probo | `.claude-plugin/commands/probo-link.md` |

### Scan Status

| System | Last Scan | Findings | Status |
|--------|-----------|----------|--------|
| AWS | 2026-02-21 | 5 critical issues | ✅ Tasks created |
| GitHub | 2026-02-21 | Branch protection gaps | ✅ Tasks created |
| Google Workspace | - | - | 🔜 Pending |
| Slack | - | - | 🔜 Pending (manual) |
| Linear | - | - | 🔜 Pending |
| Vercel | - | - | 🔜 Pending |
| Notion | - | - | 🔜 Pending |
| PostHog | - | - | 🔜 Pending |
| Attio | - | - | 🔜 Pending |
| Fireflies | - | - | 🔜 Pending |
| Azure | - | - | 🔜 Pending |
| Loops | - | - | 🔜 Pending |

### AWS Findings (2026-02-21)

| Finding | Severity | Task Created |
|---------|----------|--------------|
| RDS publicly accessible | Critical | ✅ |
| CloudTrail not enabled | Critical | ✅ |
| S3 buckets not encrypted | High | ✅ |
| Root MFA status unknown | High | ✅ |
| IAM password policy gaps | Medium | ✅ |

### GitHub Findings (2026-02-21)

| Finding | Severity | Task Created |
|---------|----------|--------------|
| Branch protection rulesets exist but not enforced | High | ✅ |
| Missing required reviews on some repos | Medium | ✅ |

### Evidence Storage

- Scan results: `docs/compliance/scan-history/`
- AWS evidence: `aws-evidence-20260221/`
- GitHub findings: `docs/github-security-findings-2026-02-21.md`
- AWS findings: `docs/aws-security-findings-2026-02-21.md`

### Pending Scan Tasks

Create these tasks in Probo for completing manual scans:

| System | Task | ISO Controls | Priority |
|--------|------|--------------|----------|
| Google Workspace | Complete security scan: 2FA, admins, sharing settings | A.5.15-18, A.8.5 | High |
| Slack | Complete security scan: SSO, retention, app permissions | A.5.14, A.5.17 | Medium |
| Linear | Complete security scan: SSO, access control, audit logs | A.5.15, A.8.2 | Medium |
| Vercel | Complete security scan: team access, env vars, deployments | A.8.25, A.8.32 | Medium |
| Notion | Complete security scan: sharing, guests, integrations | A.5.15, A.8.12 | Medium |
| PostHog | Complete security scan: project access, data retention | A.5.15, A.8.10 | Low |
| Attio | Complete security scan: CRM access, integrations | A.5.15, A.8.12 | Low |
| Fireflies | Complete security scan: recording access, retention | A.5.15, A.8.10 | Low |
| Azure | Complete security scan: Entra ID, MFA, OpenAI access | A.5.17, A.8.5 | High |
| Loops | Complete security scan: API keys, sender auth (SPF/DKIM) | A.8.21, A.5.14 | Low |

**How to complete each scan:**
1. Go to system's admin/settings page
2. Follow checklist in `.claude-plugin/commands/scan.md`
3. Document findings in `docs/compliance/scan-history/YYYY-MM-DD-[system]-scan.md`
4. Create remediation tasks for any gaps found

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
| ~~Create Information Security Policy~~ | ~~Interview notes, company context~~ | ~~Formal policy document~~ | ~~ISO 27001 clause 5.2~~ ✓ |
| ~~Create Risk Assessment Methodology~~ | ~~Company context, industry~~ | ~~Risk methodology document~~ | ~~ISO 27001 clause 6.1.2~~ ✓ |
| ~~Create ISMS Scope Document~~ | ~~Scope summary, interview notes~~ | ~~Formal scope statement~~ | ~~ISO 27001 clause 4.3~~ ✓ |
| ~~Create Statement of Applicability~~ | ~~Control mapping, risk assessment~~ | ~~SoA document~~ | ~~ISO 27001 clause 6.1.3~~ ✓ |
| ~~Create Incident Response Plan~~ | ~~Team size (<10), cloud architecture~~ | ~~IR plan document~~ | ~~A.5.24-27~~ ✓ |
| ~~Create Business Continuity Plan~~ | ~~AWS infrastructure, critical services~~ | ~~BCP document~~ | ~~A.5.29-30~~ ✓ |
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

## Risk Assessment - IN PROGRESS

Initial risk register created in Probo (10 risks identified):

| Risk | Category | Treatment | Inherent | Residual |
|------|----------|-----------|----------|----------|
| Unauthorized access to customer data | Data Security | MITIGATED | 3×4=12 | 2×3=6 |
| Customer data loss | Data Security | MITIGATED | 2×5=10 | 1×3=3 |
| GDPR compliance violation | Compliance | MITIGATED | 2×4=8 | 1×2=2 |
| Service unavailability - AWS outage | Availability | ACCEPTED | 2×4=8 | 2×3=6 |
| AI service unavailability | Availability | MITIGATED | 3×3=9 | 2×2=4 |
| Ransomware or malware infection | Security | MITIGATED | 2×5=10 | 1×3=3 |
| Supply chain attack | Security | MITIGATED | 2×4=8 | 1×2=2 |
| Insider threat | Security | MITIGATED | 1×4=4 | 1×2=2 |
| Loss of key personnel | Operational | ACCEPTED | 3×3=9 | 2×2=4 |
| Third-party vendor failure | Operational | MITIGATED | 2×3=6 | 1×2=2 |

**Risk Score:** Likelihood × Impact (1-5 scale each)

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
| `evidence-collection-checklist.md` | AWS and control verification guide |
| `agent-development-plan.md` | Feature backlog for agent improvements |

---

## Change Log

| Date | Change | By |
|------|--------|-----|
| 2026-02-21 | Migrated to skills-based automation | Lars |
| 2026-02-21 | Created compliance docs structure (`docs/compliance/`) | Lars |
| 2026-02-21 | Scanned AWS - 5 critical findings, tasks created | Lars |
| 2026-02-21 | Scanned GitHub - branch protection gaps found | Lars |
| 2026-02-21 | Created 20 remediation tasks in Probo | Lars |
| 2026-02-21 | Created Remote Working Policy (A.6.7) | Passionfruit |
| 2026-02-21 | Created mandatory ISMS docs: Information Security Policy, ISMS Scope, Risk Methodology, SoA | Passionfruit |
| 2026-02-21 | Created 10 risks in Probo risk register | Passionfruit |
| 2026-02-21 | Created Incident Response Plan and BCP in Probo | Passionfruit |
| 2026-02-21 | Added vendor security profiles | Passionfruit |
| 2026-02-21 | Added full ISO 27001 clause structure | Passionfruit |
| 2026-02-21 | Initial creation, Phase 1 completed | Passionfruit |
