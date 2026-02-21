# Policies

ISO 27001 policy documents. These are the source of truth - synced to Probo for auditor access.

**Before writing**: Read the writing guide at `../policy-templates/README.md`

## Required Policies

| Policy | ISO Clause | Status | Probo Doc ID |
|--------|------------|--------|--------------|
| Information Security Policy | 5.2 | | |
| Access Control Policy | A.5.15-18 | | |
| Cryptography Policy | A.8.24 | | |
| Data Classification Policy | A.5.12-13 | | |
| Acceptable Use Policy | A.5.10 | | |
| Remote Working Policy | A.6.7 | | |
| Supplier Security Policy | A.5.19-22 | | |
| Incident Response Policy | A.5.24-28 | | |
| Business Continuity Policy | A.5.29-30 | | |

## Naming Convention

```
[topic]-policy.md
```

Examples:
- `information-security-policy.md`
- `access-control-policy.md`

## Policy Structure

Each policy should include:

1. **Document Control** - Version, date, author, approver, review schedule
2. **Purpose** - Why this policy exists (1-2 sentences)
3. **Scope** - Who/what it applies to
4. **Policy Statements** - Requirements (MUST/SHOULD/MAY)
5. **Roles & Responsibilities** - Who does what
6. **Compliance** - How violations are handled
7. **Related Documents** - Links to other policies/procedures

**Keep policies 2-4 pages**. Auditors prefer concise over comprehensive.

## Workflow

1. Check `../org-context.md` for Passionfruit specifics
2. Read writing guide at `../policy-templates/README.md`
3. Create policy here using naming convention
4. Review and approve (get sign-off)
5. Sync to Probo: `/probo-create document`
6. Update Probo Doc ID in table above
7. Log decision in `../audit-log.md`

## Writing Tips (Quick Reference)

**Do:**
- Reference actual tools: "GitHub", "AWS", "Slack"
- Use active voice: "The CTO approves..."
- Be specific: "All PRs require 1 review"

**Don't:**
- Generic placeholders: "[COMPANY NAME]"
- Filler: "in order to ensure..."
- Over-promise: Don't claim 24/7 monitoring if you don't have it

See `../policy-templates/README.md` for full guide with examples.
