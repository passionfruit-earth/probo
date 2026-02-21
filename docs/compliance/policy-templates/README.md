# Policy Templates

This directory contains verified policy templates for ISO 27001:2022 compliance.

## Required Policies

| Policy | ISO Requirement | Template | Status |
|--------|-----------------|----------|--------|
| Information Security Policy | Clause 5.2 | `information-security-policy.md` | TODO |
| Access Control Policy | A.5.15 | `access-control-policy.md` | TODO |
| Acceptable Use Policy | A.5.10 | `acceptable-use-policy.md` | TODO |
| Data Classification Policy | A.5.12 | `data-classification-policy.md` | TODO |
| Remote Working Policy | A.6.7 | `remote-working-policy.md` | TODO |
| Supplier Security Policy | A.5.19-21 | `supplier-security-policy.md` | TODO |
| Incident Response Procedure | A.5.24-26 | `incident-response-procedure.md` | TODO |
| Business Continuity Plan | A.5.29-30 | `business-continuity-plan.md` | TODO |
| Change Management Procedure | A.8.32 | `change-management-procedure.md` | TODO |

## Template Structure

Each policy template should include:

1. **Document Control**
   - Version, date, author, approver
   - Review schedule
   - Distribution list

2. **Purpose**
   - Why this policy exists

3. **Scope**
   - Who/what it applies to

4. **Policy Statements**
   - Actual requirements
   - MUST/SHOULD/MAY language

5. **Roles & Responsibilities**
   - Who does what

6. **Compliance**
   - How violations are handled

7. **Related Documents**
   - Links to other policies/procedures

8. **Definitions**
   - Key terms

## Usage

1. Copy template to Probo as new document
2. Customize for organization (see `org-context.md`)
3. Review with stakeholders
4. Publish in Probo
5. Obtain signatures if required

## Writing Auditor-Friendly Policies

Auditors look for policies that are **real, practical, and actually used**. Avoid generic templates.

### Do
- **Be specific to Passionfruit** - Reference actual tools (Slack, GitHub, AWS), real roles, actual processes
- **Keep it short** - 2-4 pages max. Auditors prefer concise over comprehensive
- **Use concrete examples** - "All production deployments require PR approval" not "appropriate controls shall be implemented"
- **Match reality** - Only write what you actually do. Auditors will check
- **Use active voice** - "The CTO approves..." not "Approval shall be obtained..."
- **Include version history** - Shows the policy is maintained
- **Date everything** - Created, last reviewed, next review due

### Don't
- **No filler phrases** - Cut "in order to ensure", "it is important that", "shall be deemed to"
- **No passive voice walls** - "Access shall be granted based on..." sounds templated
- **No over-promising** - Don't claim 24/7 monitoring if you don't have it
- **No orphan policies** - Every policy needs an owner who actually reviews it
- **No copy-paste from standards** - Auditors recognize ISO text immediately

### Red Flags Auditors Look For
- Generic company name placeholders (`[COMPANY NAME]`)
- Policies that don't match interviews ("We do X" but policy says Y)
- No evidence of review (same version for years)
- Overly formal language that doesn't match company culture
- Controls described that don't exist in practice

### Good Example
> **Password Requirements**
> All Passionfruit accounts must use passwords with:
> - Minimum 12 characters
> - Managed via 1Password (company vault)
> - MFA enabled via Microsoft Entra
>
> Lars reviews access quarterly via the GitHub org member list.

### Bad Example
> **Password Requirements**
> In order to ensure the security and integrity of organizational information assets, all personnel shall be required to implement appropriate password controls in accordance with industry best practices and applicable regulatory requirements.

## Startup Success Stories

Real startups that passed ISO 27001 audits - learn from their approach:

### Ellie.ai (17 people, Finland) - Certified Nov 2025
- **Approach:** No external consultants, did it themselves
- **Key insight:** "Because we did the work ourselves, we now truly understand how our security system works"
- **Lesson:** Security became company-wide responsibility, not one person's job
- **Source:** [Cyberday case study](https://www.cyberday.ai/success-stories/ellie-ai-earns-enterprise-trust-with-iso-27001)

### Pyne (Berlin B2B SaaS) - Certified Jan 2025
- **Timeline:** 2 months (Nov 2024 → Jan 2025)
- **Approach:** Remote-first audit, async evidence upload
- **Key insight:** Time zone differences became advantage - uploaded evidence overnight for auditor review
- **Result:** Trust Center with all security credentials accelerated sales
- **Source:** [Sensiba case study](https://sensiba.com/resources/case-studies/pyne/)

### DETOXI (4 people, German healthtech) - 2024
- **Challenge:** ISO 27001 was non-negotiable for health insurance partnership
- **Reality:** No formal ISMS, no audit history, limited resources
- **Lesson:** Even 4-person startups can achieve certification with right structure

### Common Patterns from Successful Startups

1. **Describe reality, don't invent processes** - If you use GitHub PRs for code review, document that. Don't create fictional processes
2. **Keep policies short** - 2-6 pages each. Auditors prefer concise and practical
3. **Capture evidence immediately** - Every control implementation = screenshot/export stored in ISMS folder
4. **Scope narrowly but credibly** - "Entire organization" becomes endless; too narrow looks suspicious
5. **Do internal audit first** - Find gaps yourself before external auditor does

### What Auditors Actually Check
From [ISC2 implementation guide](https://www.isc2.org/Insights/2024/03/Implementing-ISO-27001-2022-for-Startups-and-SMEs):
- Does Statement of Applicability match actual risk assessment?
- Do documented controls exist in practice?
- Is executive management actually involved?
- Can staff explain their security responsibilities?

## Open Source Templates (GitHub)

Use these as **reference only** - customize heavily for Passionfruit:

### [PehanIn/ISO-27001-2022-Toolkit](https://github.com/PehanIn/ISO-27001-2022-Toolkit) (MIT License)
Most complete toolkit with 12 categories:
- Gap Assessment Plan
- Statement of Applicability (SoA)
- Risk Register
- Scope and Context Definition
- Asset Inventory
- Business Continuity & Disaster Recovery
- Information Security Policy & Procedures
- Awareness and Training Plan
- Management Review Meeting templates
- ISMS Checklists
- Internal Audit Plan
- ROI Analysis

### [D4RK-PHOENIX/iso27000toolkit](https://github.com/D4RK-PHOENIX/iso27000toolkit)
Includes:
- ISMS Governance & Implementation Guidance
- Model Information Security Policies
- Procedures, Guidelines, Supporting Documents
- Job Descriptions & Roles
- Comprehensive PDF toolkit

### How to Use These

1. **Don't copy-paste** - Auditors recognize generic templates
2. **Use as checklist** - Ensure you cover required topics
3. **Adapt language** - Make it sound like Passionfruit, not ISO
4. **Verify against reality** - Only include what you actually do
5. **Simplify** - These are often over-engineered for startups

## Sources

Templates based on:
- ISO 27001:2022 standard requirements
- ISO 27002:2022 implementation guidance
- Industry best practices
- [Drata: ISO 27001 for Startups](https://drata.com/grc-central/get-started-iso-27001/iso-27001-for-startups)
- [Vanta: ISO 27001 for Startups](https://www.vanta.com/collection/iso-27001/iso-27001-for-startups)

Note: These are templates, not legal documents. Review with compliance/legal before finalizing.
