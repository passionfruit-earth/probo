---
description: "Scan vendor for security certifications and compliance"
argument-hint: "<vendor-name> [website-url]"
---

# Vendor Security Scan

Gather security information about a third-party vendor for ISO 27001 compliance.

## What to gather:

1. **Certifications** (A.5.19, A.5.21)
   - SOC 1 / SOC 2 Type II / SOC 3
   - ISO 27001, ISO 27017, ISO 27018, ISO 27701
   - CSA STAR Level 2 / CAIQ
   - PCI DSS (if payment related)
   - FedRAMP (if US government)
   - HIPAA / HITRUST (if healthcare)
   - C5 (German), IRAP (Australia), MTCS (Singapore)

2. **Data Protection** (A.5.34, A.8.11)
   - Data Processing Agreement (DPA) availability
   - GDPR compliance statement
   - Data residency options (EU)
   - Subprocessor list

3. **Security Practices** (A.5.22, A.5.23)
   - Trust center / security page
   - Bug bounty program
   - Penetration testing (recent)
   - Security incident history

## How to scan:

1. Search for trust/security page:
   - `{vendor}.com/trust`
   - `{vendor}.com/security`
   - `trust.{vendor}.com`
   - `security.{vendor}.com`

2. Common trust portals:
   - GitHub: trust.github.com, ghec.github.trust.page
   - Microsoft: servicetrust.microsoft.com
   - Google: cloud.google.com/security/compliance
   - AWS: aws.amazon.com/compliance
   - Salesforce: trust.salesforce.com
   - Atlassian: atlassian.com/trust

3. Web search:
   - `"{vendor}" SOC 2 ISO 27001 certifications`
   - `"{vendor}" trust center compliance`

## Output format:

Create vendor assessment with:
- Vendor name and website
- Certifications found (with dates if available)
- DPA status
- Data residency options
- Risk rating (Low/Medium/High)
- Gaps or concerns
- Recommendations

Then offer to:
1. Add vendor to Probo
2. Create assessment in Probo
3. Create tasks for missing items (e.g., "Request SOC 2 report from vendor")

## Important:

- This is READ-ONLY research
- Log findings to docs/vendor-assessments/VENDOR-NAME-YYYY-MM-DD.md
- Add vendor and assessment to Probo
- Flag high-risk vendors for review
