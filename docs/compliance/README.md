# Compliance Documentation

Source of truth for ISO 27001 compliance. Documents here are synced to Probo for auditor access.

## Structure

```
compliance/
├── input/              # Source materials (questionnaires, interviews)
├── policies/           # Policy documents → Probo
├── procedures/         # Procedure documents → Probo
├── records/            # Evidence, audits, reviews → Probo
├── scan-history/       # Security scan results
├── org-context.md      # Company details for policy generation
└── audit-log.md        # Decision tracking with rationale
```

## Workflow

```
Input (questionnaires) → Policies/Procedures (here) → Probo (auditors)
```

1. **Gather input**: Questionnaires, interviews → `input/`
2. **Create documents**: Policies, procedures → `policies/`, `procedures/`
3. **Sync to Probo**: Use `/probo-create document` or `/probo-update document`
4. **Track decisions**: Log rationale in `audit-log.md`

## Why Git + Probo?

| Git (here) | Probo |
|------------|-------|
| Source of truth | Auditor-facing |
| Version history | Published versions |
| Review via PR | Read-only for auditors |
| Markdown | Formatted display |

## Quick Reference

- **Add questionnaire**: `input/questionnaires/`
- **Create policy**: `policies/[topic]-policy.md`
- **Create procedure**: `procedures/[topic]-procedure.md`
- **Log scan**: `scan-history/YYYY-MM-DD-[system]-scan.md`
- **Log decision**: Add entry to `audit-log.md`
