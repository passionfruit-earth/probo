# Compliance Decision Log

Track decisions and rationale for audit trail.

## Format

```
### [DATE] - [DECISION TITLE]

**Decision:** What was decided
**Rationale:** Why this decision was made
**ISO Control:** Related control(s)
**Made by:** Who made the decision
**Evidence:** Link to supporting docs/scans
```

---

## 2026

### 2026-02-21 - Initial ISMS Setup

**Decision:** Begin ISO 27001:2022 certification project
**Rationale:** Customer requirements, competitive advantage
**ISO Control:** All (Clause 4.1 - Understanding the organization)
**Made by:** [TODO]
**Evidence:** Project kickoff

### 2026-02-21 - Skills-based Compliance Automation

**Decision:** Use Claude Code skills instead of custom agent for compliance automation
**Rationale:**
- Simpler maintenance (markdown vs TypeScript)
- Team can use without running separate agent
- Read-only integrations by default
- No delete capability (safety)
**ISO Control:** A.8.25 (Secure development lifecycle)
**Made by:** Engineering team
**Evidence:** `.claude-plugin/` directory

### 2026-02-21 - AWS Security Gaps Identified

**Decision:** Create remediation tasks for AWS security findings
**Rationale:** Scan revealed: RDS publicly accessible, no CloudTrail, S3 not encrypted
**ISO Control:** A.8.13, A.8.15, A.8.20
**Made by:** [TODO]
**Evidence:** `docs/aws-security-findings-2026-02-21.md`

### 2026-02-21 - GitHub Branch Protection Gaps

**Decision:** Create tasks to enable branch protection on all repos
**Rationale:** Rulesets exist but enforcement is disabled on main repos
**ISO Control:** A.8.4, A.8.25
**Made by:** [TODO]
**Evidence:** `docs/github-security-findings-2026-02-21.md`

---

## Template for New Entries

```
### YYYY-MM-DD - [Title]

**Decision:**
**Rationale:**
**ISO Control:**
**Made by:**
**Evidence:**
```
