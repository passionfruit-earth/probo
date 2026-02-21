# Compliance Content Sources

This document tracks the official and audited sources we use for compliance content, rather than maintaining our own definitions.

## Philosophy

> **Use official, audited sources whenever possible.**
>
> We don't want to maintain compliance definitions ourselves because:
> 1. Standards change over time
> 2. Incorrect definitions create audit risk
> 3. Official sources are more trustworthy
> 4. Reduces our maintenance burden

## Primary Sources

### 1. NIST OSCAL (Official)

**What:** Machine-readable compliance content from NIST

**Source:** https://github.com/usnistgov/oscal-content

**License:** Public Domain (US Government Work)

**Content Available:**
- NIST SP 800-53 Rev 4 & Rev 5 catalogs
- Low/Moderate/High baselines
- Privacy baseline
- Assessment objectives from 800-53A

**Format:** JSON, YAML, XML

**How We Use It:**
```typescript
// Fetch directly from NIST
const catalog = await fetch(
  "https://raw.githubusercontent.com/usnistgov/oscal-content/main/nist.gov/SP800-53/rev5/json/NIST_SP-800-53_rev5_catalog.json"
);

// Convert to Probo format
const framework = oscalToProboFramework(catalog);
```

**Quality:** ⭐⭐⭐⭐⭐ (Official government source)

---

### 2. Secure Controls Framework (SCF)

**What:** Meta-framework mapping 578+ controls to 100+ standards

**Source:** https://securecontrolsframework.com/scf-download/

**License:** Free for commercial use

**Content Available:**
- 578+ security controls
- Mappings to: SOC 2, ISO 27001, NIST 800-53, GDPR, HIPAA, PCI DSS, and 95+ more
- Assessment objectives
- Policy templates

**Format:** Excel, CSV

**How We Could Use It:**
- Cross-framework control mapping
- Gap analysis between frameworks
- Policy template generation

**Integration Status:** Referenced, not yet integrated

**Quality:** ⭐⭐⭐⭐⭐ (Industry standard, widely audited)

---

### 3. AICPA Trust Services Criteria

**What:** Official SOC 2 control criteria

**Source:** https://www.aicpa-cima.com/resources/download/2017-trust-services-criteria-with-revised-points-of-focus-2022

**License:** AICPA Copyright (reference only)

**Content Available:**
- 2017 Trust Services Criteria
- 2022 Points of Focus updates
- COSO principle mappings

**Format:** PDF only (not machine-readable)

**How We Use It:**
- Our `soc2.ts` definitions are based on this document
- We reference but cannot redistribute the full text

**Quality:** ⭐⭐⭐⭐⭐ (Official source, but PDF-only)

---

### 4. ISO 27001:2022 Standard

**What:** Official ISO information security standard

**Source:** https://www.iso.org/standard/27001

**License:** Copyrighted, requires purchase

**Content Available:**
- Annex A controls (93 controls in 4 themes)
- ISMS requirements

**Format:** PDF (purchased)

**How We Use It:**
- Our `iso27001.ts` definitions based on Annex A structure
- Control names and descriptions are factual, not copyrighted

**Quality:** ⭐⭐⭐⭐⭐ (Official source)

---

### 5. StrongDM Comply

**What:** Open source SOC 2 policy templates

**Source:** https://github.com/strongdm/comply

**License:** Apache 2.0

**Content Available:**
- 24 SOC 2 policy templates
- Markdown format
- Auditor-approved language

**Policies Included:**
- Access Control Policy
- Asset Management Policy
- Business Continuity Policy
- Change Management Policy
- Data Classification Policy
- Encryption Policy
- Incident Response Policy
- Information Security Policy
- Password Policy
- Risk Assessment Policy
- Vendor Management Policy
- And more...

**How We Could Use It:**
- Policy generation starting points
- Document templates for Probo

**Integration Status:** Referenced, not yet integrated

**Quality:** ⭐⭐⭐⭐ (Open source, community-maintained)

---

## Probo's Built-in Content

### Mitigations Library

**Location:** `/data/mitigations.json`

**Content:** 65+ pre-defined security mitigations with:
- Name and description
- Category (Access Control, Security Operations, etc.)
- Standards mappings (e.g., `ISO27001:2022-A.5.16;SOC2-CC6.1`)
- Importance level (MANDATORY, PREFERRED, ADVANCED)

**Example:**
```json
{
  "id": "mit-001",
  "name": "Multi-Factor Authentication",
  "category": "Identity & Access Management",
  "description": "Require MFA for all production system access",
  "standards": "ISO27001:2022-A.8.5;SOC2-CC6.1",
  "importance": "MANDATORY"
}
```

**How We Use It:**
- Reference when creating measures
- Map to framework controls
- Suggest mitigations for identified risks

---

## Content Quality Tiers

| Tier | Source Type | Examples | Usage |
|------|-------------|----------|-------|
| 1 | Official Government | NIST OSCAL | Fetch directly, use as-is |
| 2 | Industry Standard | SCF, AICPA | Reference, integrate where possible |
| 3 | Open Source | Comply | Use as templates, customize |
| 4 | Our Definitions | soc2.ts, iso27001.ts | Fallback when official sources unavailable |

---

## Future Integrations

### Planned

1. **SCF Excel Import**
   - Download and parse SCF spreadsheet
   - Extract control mappings
   - Enable cross-framework gap analysis

2. **Comply Policy Templates**
   - Import markdown templates
   - Pre-populate Probo documents
   - Customize per organization

### Considered

3. **CIS Controls**
   - Source: https://www.cisecurity.org/controls
   - Would add CIS Critical Security Controls

4. **HIPAA Mappings**
   - NIST has HIPAA-to-800-53 mappings
   - Could enable HIPAA compliance tracking

---

## Updating Content

### NIST OSCAL
Fetched dynamically - updates automatically when NIST publishes new versions.

### SOC2/ISO27001 Definitions
Manual updates required when standards change:
1. Review official standard changes
2. Update `frameworks/*.ts` files
3. Test import functionality
4. Document changes in changelog

### Probo Mitigations
Maintained by Probo team. Check for updates when upgrading Probo.
