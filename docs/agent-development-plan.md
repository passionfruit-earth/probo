# Agent Development Plan

**Last Updated:** 2026-02-21
**Purpose:** Track feature requests and improvements for the Probo compliance agent

---

## Context

During the ISO 27001 setup process, we identified several improvements needed for the agent and Probo platform to better support compliance workflows.

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

| Priority | Feature | Impact |
|----------|---------|--------|
| 1 | Quality Mark | Trust in agent content |
| 2 | Notes/Rationale | Audit readiness |
| 3 | Bulk Import | Efficiency |
| 4 | Progress Dashboard | Visibility |
| 5 | Interview Mode | User experience |
| 6 | Evidence Templates | Completeness |
| 7 | Document Generation | End-to-end |

---

## Change Log

| Date | Change | By |
|------|--------|-----|
| 2026-02-21 | Initial creation based on ISO 27001 setup session | Claude/Passionfruit |
