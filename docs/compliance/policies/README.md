# Policies

ISO 27001 policy documents. These are the source of truth - synced to Probo for auditor access.

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
2. **Purpose** - Why this policy exists
3. **Scope** - Who/what it applies to
4. **Policy Statements** - Requirements (MUST/SHOULD/MAY)
5. **Roles & Responsibilities** - Who does what
6. **Compliance** - How violations are handled
7. **Related Documents** - Links to other policies/procedures

## Workflow

1. Create/edit policy here
2. Review and approve
3. Sync to Probo using `/probo-create document` or `/probo-update document`
4. Update Probo Doc ID in table above
