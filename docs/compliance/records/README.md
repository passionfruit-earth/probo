# Records

ISO 27001 records and evidence. Source of truth - synced to Probo.

## Record Types

| Record Type | ISO Clause | Frequency |
|-------------|------------|-----------|
| Risk Assessment Results | 6.1.2 | Annual |
| Internal Audit Reports | 9.2 | Annual |
| Management Review Minutes | 9.3 | Annual |
| Training Records | 7.2 | Ongoing |
| Incident Reports | A.5.26 | As needed |
| Access Reviews | A.5.18 | Quarterly |
| Vendor Reviews | A.5.22 | Annual |

## Naming Convention

```
YYYY-MM-DD-[type]-[topic].md
```

Examples:
- `2026-02-21-audit-internal-audit-q1.md`
- `2026-03-15-review-management-review.md`
- `2026-01-10-incident-phishing-attempt.md`

## Workflow

1. Create record here after event
2. Sync to Probo using `/probo-create document`
3. Link to relevant controls/measures
