# Organization Context

This file provides context for ISO 27001 compliance work. Update this when org details change.

## Company Information

- **Legal Name:** Passionfruit Earth B.V.
- **Trading Name:** Passionfruit
- **Chamber of Commerce:** 84096705
- **Location:** Rotterdam, Netherlands
- **Industry:** B2B SaaS - ESG, Quality and Safety compliance
- **Employees:** [TODO: number]
- **Website:** www.passionfruit.earth

## Product

SaaS platform that assists clients in managing and responding to compliance information requests from customers, regulators and other stakeholders in the field of ESG, Quality and Safety.

**Key features:**
- AI-powered questionnaire automation (Azure OpenAI)
- Document extraction (Excel, Word, PDF, Portals)
- Answer library with approval trails
- Multi-tenant architecture

## ISMS Scope

- **In Scope:** Passionfruit SaaS platform, supporting infrastructure (AWS), development processes, customer data handling
- **Out of Scope:** [TODO: define exclusions]

## Data Processing

### Customer Data Types
- [x] Personal data (names, emails)
- [x] Business data (questionnaire responses, ESG data)
- [x] Documents (customer-uploaded Excel, Word, PDF)
- [x] Approval trails and metadata
- [ ] Financial data
- [ ] Health data
- [ ] Payment card data

### Data Locations
- **Primary:** AWS EU data centers (eu-west-1 / eu-central-1)
- **AI Processing:** Azure OpenAI (isolated, no training on customer data)
- **Backups:** Weekly (if contracted)

### Multi-tenancy
- Tenants logically separated via strict access controls and unique identifiers
- No data reused across tenants
- Customer data remains within its tenant

## Security Commitments (from customer questionnaires)

| Commitment | Status |
|------------|--------|
| ISO 27001 certification | In progress |
| ISAE 3402 Type 2 | Not yet (startup) |
| Data hosted in EU | Yes (AWS) |
| Right to audit | Yes (under NDA, agreed scope) |
| SSO support | Yes (Microsoft Entra) |
| MFA support | Yes (via Entra) |
| Encryption in transit | TLS 1.2+ |
| Encryption at rest | AES-256 |
| DDoS protection | Yes (AWS) |
| Data deletion on request | Yes |
| Uptime target | 99.9% |

## Regulatory Requirements

- [x] GDPR (EU customers/data)
- [ ] UK GDPR
- [ ] CCPA (California)
- [ ] HIPAA (US health data)
- [ ] PCI DSS (payment cards)
- [ ] SOC 2 (planned for future)

**Governing law:** Dutch law

## Organizational Structure

### Management
- **CEO:** [TODO]
- **CTO:** [TODO]
- **Information Security Lead:** [TODO]
- **DPO (if required):** [TODO]

### Team
- **Development team:** [TODO: names and roles]
- **Total team size:** [TODO]

### Policy Approval
- Policies approved by: [TODO: role/name]
- Review frequency: Annual

## Technology Stack

### Infrastructure
- Cloud: AWS (EU region)
- Hosting: Vercel
- Database: RDS PostgreSQL
- AI: Azure OpenAI

### Development
- Source control: GitHub (passionfruit-earth)
- CI/CD: [TODO]
- Monitoring: PostHog, LangWatch (AI monitoring)

### Business Tools
- Communication: Slack, Google Workspace
- Project management: Linear
- Documentation: Notion
- CRM: Attio
- Email: Loops
- Meetings: Fireflies

## Third-Party Vendors

See Probo vendor list. Key vendors:
1. AWS - Infrastructure
2. Azure (Microsoft) - OpenAI, Entra SSO
3. Vercel - Hosting
4. GitHub - Source control
5. Slack - Communication
6. Google Workspace - Email, docs
7. Linear - Project management
8. Notion - Documentation
9. PostHog - Analytics
10. Attio - CRM
11. Fireflies - Meeting transcription
12. Loops - Email sending

## Previous Certifications/Audits

- [ ] ISO 27001 (in progress)
- [ ] SOC 2 Type I (not yet)
- [ ] SOC 2 Type II (not yet)
- [ ] ISAE 3402 (not yet)
- [ ] Penetration test (date: [TODO])

## Key Contacts

| Role | Name | Email |
|------|------|-------|
| ISMS Owner | | |
| Technical Contact | Lars | |
| Audit Liaison | | |

## Source Documents

- `input/questionnaires/Security Checklist.docx` - Corbion security questionnaire
- `input/questionnaires/Artificial Intelligence Use Questionnaire.docx` - AI use details
- `input/questionnaires/General_Terms_and_Conditions_Passionfruit_Earth_B.V_2025_10.pdf` - T&Cs

---
*Last updated: 2026-02-21*
*Updated by: Lars*
