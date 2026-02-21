# Scan History

This directory stores results from security scans for audit evidence.

## Naming Convention

```
YYYY-MM-DD-[system]-scan.md
```

Examples:
- `2026-02-21-aws-scan.md`
- `2026-02-21-github-scan.md`
- `2026-03-01-quarterly-all-scan.md`

## Scan Schedule

| System | Frequency | Last Scan | Next Due |
|--------|-----------|-----------|----------|
| AWS | Monthly | 2026-02-21 | 2026-03-21 |
| GitHub | Monthly | 2026-02-21 | 2026-03-21 |
| Google Workspace | Monthly | - | - |
| Slack | Quarterly | - | - |
| Linear | Quarterly | - | - |
| Vercel | Quarterly | - | - |
| Notion | Quarterly | - | - |
| PostHog | Quarterly | - | - |
| Attio | Quarterly | - | - |
| Fireflies | Quarterly | - | - |
| Azure | Monthly | - | - |
| Loops | Quarterly | - | - |
| Vendors | Semi-annually | - | - |

## Scan Result Format

Each scan should document:

```markdown
# [System] Security Scan - YYYY-MM-DD

## Summary
- **Status:** PASS / FAIL / PARTIAL
- **Critical issues:** X
- **Warnings:** Y
- **Scan method:** CLI / Manual / API

## Findings

### [Finding 1]
- **Severity:** Critical / High / Medium / Low
- **Control:** A.X.XX
- **Current state:**
- **Expected state:**
- **Evidence:** [screenshot/command output]
- **Remediation:** Task created in Probo: [link/ID]

## Evidence Collected
- [List of screenshots, exports, logs]

## Actions Taken
- Task IDs created:
- Measures updated:

## Next Steps
-
```

## Existing Scans

- [2026-02-21 AWS findings](../aws-security-findings-2026-02-21.md)
- [2026-02-21 GitHub findings](../github-security-findings-2026-02-21.md)
