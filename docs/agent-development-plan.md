# Agent Development Plan

**Last Updated:** 2026-02-21
**Purpose:** Track feature requests and improvements for the Probo compliance agent

---

## Context

During the ISO 27001 setup process, we identified several improvements needed for the agent and Probo platform to better support compliance workflows.

---

## PRIORITY 0: Continuous Vendor Monitoring (CURRENT)

### Why This Matters

ISO 27001 auditors want to see:
- **A.5.19-22**: Supplier security - vendor vetting, SOC 2 certs, DPAs
- **A.8.9**: Configuration management - secure settings enforced
- **A.8.15**: Logging - proof controls work
- **A.5.15-18**: Access control - who has access to what

We need **continuous evidence** from all vendors, not just point-in-time screenshots.

### Vendor Integration Matrix

| Vendor | ISO Controls | What to Fetch | Auth | Status |
|--------|--------------|---------------|------|--------|
| **GitHub** | A.8.25-31 (Secure dev) | Branch protection, required reviews, security alerts, access | Device Flow OAuth | **DONE** |
| **Google Workspace** | A.5.15-18 (Access), A.8.5 (Auth) | 2FA enforcement, SSO config, sharing settings, user list | OAuth2 | **DONE** |
| **AWS** | A.8.20 (Networks), A.5.15 (Access) | IAM policies, security groups, CloudTrail config | Access Key | TODO |
| **Slack** | A.5.14 (Info transfer) | Retention settings, external sharing, SSO, access | OAuth2 | TODO |
| **Linear** | A.8.25 (Dev lifecycle) | Project access, integrations | OAuth2 | TODO |
| **Vercel/Netlify** | A.8.9 (Config mgmt) | Environment vars (names only), access, deploy settings | Token | TODO |

### Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      Probo Agent                                 │
│                                                                  │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐             │
│  │   GitHub     │ │   Google     │ │    AWS       │  ...        │
│  │   Client     │ │   Client     │ │   Client     │             │
│  │  (OAuth ✓)   │ │   (OAuth)    │ │  (Keys)      │             │
│  └──────┬───────┘ └──────┬───────┘ └──────┬───────┘             │
│         │                │                │                      │
│         └────────────────┴────────────────┘                      │
│                          │                                       │
│               ┌──────────▼──────────┐                           │
│               │  Compliance Checker │                           │
│               │  - Fetch settings   │                           │
│               │  - Check policies   │                           │
│               │  - Score compliance │                           │
│               └──────────┬──────────┘                           │
│                          │                                       │
│         ┌────────────────┴────────────────┐                      │
│         │                                 │                      │
│  ┌──────▼───────┐                 ┌───────▼──────┐              │
│  │ Local Store  │                 │ Probo GraphQL│              │
│  │ ~/.probo-    │                 │ - Documents  │              │
│  │  agent/      │                 │ - Measures   │              │
│  │  evidence/   │                 │ - Risks      │              │
│  │ (history)    │                 │ (audit trail)│              │
│  └──────────────┘                 └──────────────┘              │
└─────────────────────────────────────────────────────────────────┘

Evidence Storage:
~/.probo-agent/
├── auth.json           # OAuth tokens (GitHub, etc.)
└── evidence/
    ├── github/         # GitHub compliance checks
    │   ├── 2026-02-21T10-00-00Z_repo_owner_name.json
    │   └── ...
    ├── google/         # Google Workspace checks
    └── aws/            # AWS compliance checks
```

### Implementation Plan

#### Phase 1: GitHub (DONE)
- [x] GitHub API client (`apps/agent/src/integrations/github/`)
- [x] Types for repos, branch protection, alerts, PRs
- [x] Compliance check function
- [x] Device Flow OAuth (`/auth github`)
- [x] Agent tools: `github_list_repos`, `github_check_compliance`, etc.
- [x] Evidence storage and scoring

#### Phase 2: Google Workspace (DONE)
- [x] Google Admin SDK client (`apps/agent/src/integrations/google/`)
- [x] Fetch: 2FA status, org units, users, groups, domains
- [x] Compliance checks for access control
- [x] Agent tools: `google_check_compliance`, `google_list_users`, etc.
- [ ] Device Flow OAuth (currently uses access token)

#### Phase 3: Evidence System (DONE)
- [x] Local evidence storage (`~/.probo-agent/evidence/`)
- [x] Timestamped JSON records per check
- [x] Diff detection (new issues, resolved issues)
- [x] Summary report generation
- [x] CLI commands: `/scan github`, `/scan status`, `/evidence list`
- [ ] Push to Probo as Documents

#### Phase 4: AWS (TODO)
- [ ] AWS SDK integration
- [ ] Fetch: IAM policies, security groups, CloudTrail
- [ ] Compliance checks for infrastructure
- [ ] Evidence generation

#### Phase 5: Other Vendors
- [ ] Slack integration
- [ ] Linear integration
- [ ] Hosting platforms (Vercel/Netlify)

### Evidence Automation

For each integration, automatically generate:
1. **Settings snapshot** - JSON export of current config
2. **Compliance report** - Pass/fail against policy
3. **Change log** - What changed since last check
4. **Attachable evidence** - Link to measures in Probo

### File Structure

```
apps/agent/src/
├── agents/
│   ├── compliance-agent.ts  # Main agent with tool execution
│   ├── tools.ts             # All agent tools (GitHub, Google, Probo)
│   └── index.ts
├── evidence/               # NEW: Evidence storage system
│   ├── store.ts            # Local file-based evidence storage
│   ├── checks.ts           # Compliance check runners
│   └── index.ts
├── integrations/
│   ├── github/             # DONE
│   │   ├── client.ts       # GitHub API client
│   │   ├── auth.ts         # Device Flow OAuth
│   │   ├── types.ts
│   │   └── index.ts
│   ├── google/             # DONE
│   │   ├── client.ts       # Google Admin SDK client
│   │   ├── types.ts
│   │   └── index.ts
│   └── aws/                # TODO
│       ├── client.ts
│       ├── types.ts
│       └── index.ts
├── client/                 # Probo GraphQL client
│   └── index.ts
└── index.ts               # CLI entry point
```

---

## Feature Requests

### 1. Quality Mark for Agent-Generated Content

**Problem:** When the agent creates measures, policies, or other content, there's no way to distinguish it from manually created content or Probo default content.

**Requirements:**
- Mark content created by agents with a quality indicator
- Track who/what created each piece of content
- Allow human review before content is considered "verified"

**Proposed Solution:**
- Add `source` field to measures/documents (e.g., "agent", "manual", "imported")
- Add `verified` boolean flag
- Add `verifiedBy` and `verifiedAt` fields

**Status:** NOT_STARTED

---

### 2. Notes/Rationale Field for Measures

**Problem:** Measures have name + description, but no place to document:
- Why the measure is needed (ISO requirement reference)
- Source of information (interview, document, etc.)
- Internal notes for auditors

**Current Workaround:** We created `iso27001-measures-log.md` as external documentation.

**Requirements:**
- Add notes/rationale field to measures
- Support linking to source documents
- Make visible in audit exports

**Proposed Solution:**
- Add `rationale` text field to Measure model
- Add `sourceReference` field (free text or link)
- Include in compliance reports

**Status:** NOT_STARTED

---

### 3. Interview/Assessment Mode

**Problem:** The agent interviewed the user about security practices, but this was ad-hoc. A structured assessment mode would be more efficient.

**Requirements:**
- Guided questionnaire flow for each ISO control area
- Save responses for reference
- Auto-generate measures from responses
- Track what's been assessed vs. pending

**Proposed Solution:**
- Create assessment templates per framework
- Store assessment responses in database
- Generate measures with source = "assessment"

**Status:** NOT_STARTED

---

### 4. Bulk Measure Creation with Validation

**Problem:** Creating measures via API one-by-one is slow and error-prone.

**Current Workaround:** We created `scripts/create-measures.sh` bash script.

**Requirements:**
- Import measures from structured format (JSON/CSV)
- Validate before import (check control IDs exist, required fields)
- Dry-run mode
- Report on what was created

**Proposed Solution:**
- Add `importMeasures` mutation (batch)
- Validation layer with detailed error messages
- Return import summary

**Status:** NOT_STARTED

---

### 5. Progress Dashboard / Compliance Score

**Problem:** No easy way to see overall compliance progress across a framework.

**Requirements:**
- Show % of controls with measures
- Show measure states breakdown (implemented vs not started)
- Highlight gaps by priority
- Export progress report

**Proposed Solution:**
- Add computed fields to Framework type
- Create progress summary query
- Dashboard component in console

**Status:** NOT_STARTED

---

### 6. Evidence Templates

**Problem:** Each measure needs evidence, but users don't know what evidence is expected.

**Requirements:**
- Suggest evidence types per control/measure
- Templates for common evidence (screenshots, exports, attestations)
- Checklist of required evidence per control

**Proposed Solution:**
- Add `suggestedEvidence` to Control model
- Evidence templates library
- Completeness indicator

**Status:** NOT_STARTED

---

### 7. Document Generation

**Problem:** ISO 27001 requires formal documents (policies, procedures). Currently must be created externally.

**Requirements:**
- Generate policy documents from templates
- Fill in organization-specific details
- Version control and approval workflow
- Export as PDF

**Proposed Solution:**
- Document templates per document type
- Variable substitution (org name, date, etc.)
- Approval workflow integration

**Status:** NOT_STARTED

---

### 8. Automated Vendor Security Profile Gathering

**Problem:** When adding a vendor, you need to manually research their security posture - certifications, trust pages, subprocessors, DPA availability, data locations, etc. This is time-consuming and often incomplete.

**Vision:** Agent automatically gathers all relevant security info when you add a vendor name.

**Requirements:**
- Given vendor name/URL, automatically find and fetch:
  - Trust/Security page URL
  - Certifications (SOC 2, ISO 27001, GDPR, HIPAA, etc.)
  - Subprocessors list URL
  - DPA/privacy policy URLs
  - Data processing locations
  - Security contact info
- Extract key facts using LLM
- Store structured security profile
- Flag missing critical info

**Proposed Solution:**

**Multi-strategy discovery approach:**

1. **Try common URL patterns first**
   - `/security`, `/trust`, `/trust-center`, `/compliance`
   - `/legal/security`, `/legal/privacy`, `/legal/dpa`
   - `/about/security`, `/company/security`
   - `/resources/security`, `/docs/security`

2. **Crawl homepage for links**
   - Check footer for security/trust/compliance links
   - Look for "Trust Center", "Security", "Compliance" in navigation
   - Find security badge images (SOC 2, ISO logos) and follow links

3. **Check third-party trust platforms**
   - SafeBase: `app.safebase.io/[vendor]`
   - Vanta Trust: `trust.vanta.com/[vendor]`
   - Drata: `trust.drata.com/[vendor]`
   - Whistic: `whistic.com/[vendor]`
   - OneTrust: Check vendor's OneTrust profile

4. **Web search fallback**
   - Search: "[vendor] security certifications"
   - Search: "[vendor] SOC 2 report"
   - Search: "[vendor] trust center"
   - Search: "[vendor] data processing agreement"

5. **Check public certification databases**
   - AICPA SOC report database
   - ISO certification registries
   - Cloud Security Alliance STAR registry

6. **Extract from any found page**
   - LLM parses page content for security facts
   - Identifies certifications, dates, scope
   - Extracts subprocessor info
   - Finds DPA/privacy policy links

**Data Model:**
```
VendorSecurityProfile:
  - trustPageUrl: String
  - certifications: [Certification]  # name, issueDate, expiryDate, scope
  - subprocessorsUrl: String
  - dpaUrl: String
  - privacyPolicyUrl: String
  - dataLocations: [Country]
  - securityContactEmail: String
  - lastScanned: DateTime
  - confidenceScore: Float  # How confident we are in the data
  - sourceUrls: [String]  # Where we found this info
```

**Example Flow:**
```
User: Add vendor "Notion"
Agent:
  1. Tries notion.so/security → 404
  2. Tries notion.so/trust → 404
  3. Crawls notion.so homepage → finds "Security" link in footer
  4. Follows to notion.so/product/security
  5. Extracts: SOC 2 Type II, ISO 27001
  6. Searches for DPA → finds notion.so/legal/dpa
  7. Checks SafeBase → finds trust.safebase.io/notion
  8. Creates vendor with all info + source URLs
```

**Status:** NOT_STARTED

---

### 9. Vendor Security Monitoring & Alerts

**Problem:** Vendor security posture changes over time - certifications expire, breaches happen, subprocessors change. No way to stay updated.

**Requirements:**
- Periodic re-scan of vendor security pages
- Detect changes (new/expired certs, new subprocessors)
- Monitor for security incidents (news, breach databases)
- Alert on significant changes
- Track security posture history

**Proposed Solution:**
- Scheduled re-scan (monthly or configurable)
- Diff detection for security page content
- Integration with breach notification services
- `VendorSecurityAlert` model
- Timeline view of vendor security changes

**Status:** NOT_STARTED

---

### 10. Smart Vendor Questionnaire Generation

**Problem:** You need to send security questionnaires to vendors, but questions should be tailored to vendor type and your specific concerns.

**Requirements:**
- Generate relevant questions based on:
  - Vendor category (cloud, SaaS, contractor, etc.)
  - Data they'll access (PII, financial, health, etc.)
  - Your compliance requirements (ISO 27001, SOC 2, GDPR)
- Pre-fill answers from gathered security profile
- Track questionnaire responses
- Score vendor risk from responses

**Proposed Solution:**
- Question bank tagged by category/data type/framework
- `generateVendorQuestionnaire(vendorId, dataTypes, frameworks)` action
- Auto-fill from `VendorSecurityProfile`
- Response tracking and scoring
- Export for sending to vendor

**Status:** NOT_STARTED

---

### 11. Vendor Data Flow Mapping

**Problem:** Need to understand what data flows to each vendor for compliance (GDPR Article 30, ISO 27001 A.5.14).

**Requirements:**
- Track what data types are shared with vendor
- Document purpose of data sharing
- Map data flows visually
- Link to processing activities (GDPR)
- Detect gaps (vendor has access but not documented)

**Proposed Solution:**
- `VendorDataFlow` model: vendor, dataTypes, purpose, legalBasis
- Visual data flow diagram
- Integration with Processing Activities (GDPR)
- Cross-reference with actual tool access (via integrations)

**Status:** NOT_STARTED

---

### 12. Vendor Comparison & Selection Helper

**Problem:** When evaluating multiple vendors for a service, need to compare security postures side-by-side.

**Requirements:**
- Compare vendors on key security criteria
- Highlight gaps and strengths
- Score against your requirements
- Generate comparison report
- Recommendation with rationale

**Proposed Solution:**
- `compareVendors(vendorIds, criteria)` action
- Side-by-side matrix view
- Weighted scoring based on your priorities
- Export comparison report
- AI-generated recommendation

**Status:** NOT_STARTED

---

### 13. Vendor Onboarding Checklist Generator

**Problem:** Each vendor needs different onboarding steps based on their access level and data sensitivity.

**Requirements:**
- Generate onboarding checklist based on:
  - Vendor criticality
  - Data types accessed
  - Access methods (API, portal, direct)
  - Your policies
- Track checklist completion
- Block access until critical items done
- Templates for common vendor types

**Proposed Solution:**
- Checklist templates by vendor category
- Dynamic generation based on vendor profile
- Integration with access provisioning
- `VendorOnboardingChecklist` model
- Approval gates

**Status:** NOT_STARTED

---

## Technical Debt

### 1. Measure Categories

**Issue:** Categories are free-text strings. Should be standardized.

**Recommendation:** Create enum or controlled vocabulary:
- Policy
- Process
- Technical
- People

---

### 2. Control Descriptions

**Issue:** Some controls imported without descriptions.

**Recommendation:** Ensure all ISO 27001 controls have full descriptions from the standard.

---

## Priority Order

### Immediate (Continuous Monitoring)

| Phase | Integration | ISO Controls | Status |
|-------|-------------|--------------|--------|
| 1 | **GitHub** | A.8.25-31 Secure dev | **DONE** (client + OAuth + evidence) |
| 2 | **Google Workspace** | A.5.15-18 Access control | **DONE** (client + tools) |
| 3 | **Evidence System** | All | **DONE** (local storage + CLI) |
| 4 | **AWS** | A.8.20 Infrastructure | TODO |
| 5 | **Slack/Other** | Various | TODO |

### Later (Platform Features)

| Priority | Feature | Impact |
|----------|---------|--------|
| 1 | Quality Mark | Trust in agent content |
| 2 | Notes/Rationale | Audit readiness |
| 3 | Bulk Import (Measures) | Efficiency |
| 4 | Progress Dashboard | Visibility |
| 5 | Interview Mode | User experience |
| 6 | Evidence Templates | Completeness |
| 7 | Document Generation | End-to-end |
| 8 | Automated Vendor Security Gathering | Smart data collection |
| 9 | Vendor Security Monitoring | Continuous awareness |
| 10 | Smart Vendor Questionnaire | Tailored assessment |
| 11 | Vendor Data Flow Mapping | GDPR/compliance |
| 12 | Vendor Comparison Helper | Decision support |
| 13 | Vendor Onboarding Checklist | Process automation |

---

## Change Log

| Date | Change | By |
|------|--------|-----|
| 2026-02-21 | Added evidence storage system (`apps/agent/src/evidence/`) | Claude |
| 2026-02-21 | Added `/scan` and `/evidence` CLI commands | Claude |
| 2026-02-21 | Google Workspace integration complete (client + tools) | Claude |
| 2026-02-21 | GitHub Device Flow OAuth implemented (`/auth github`) | Claude |
| 2026-02-21 | Restructured plan: Continuous Monitoring as Priority 0 | Claude |
| 2026-02-21 | Added vendor integration matrix (GitHub, Google, AWS, Slack) | Claude |
| 2026-02-21 | GitHub client completed in apps/agent/src/integrations/github/ | Claude |
| 2026-02-21 | Started GitHub Sync implementation | Claude |
| 2026-02-21 | Added smart vendor gathering features (8-13) | Claude/Passionfruit |
| 2026-02-21 | Initial creation based on ISO 27001 setup session | Claude/Passionfruit |
