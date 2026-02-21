# Compliance Documentation

Source of truth for ISO 27001 compliance. Documents here are synced to Probo for auditor access.

## Getting Started

New to this? Start here:

1. **Read the research** → `research/iso27001-research-compilation.md` (what works, what doesn't)
2. **Understand our context** → `org-context.md` (Passionfruit specifics)
3. **Learn to write policies** → `policy-templates/README.md` (auditor-friendly writing guide)
4. **Check progress** → `../iso27001-progress.md` (what's done, what's pending)

## Structure

```
compliance/
├── input/              # Source materials (questionnaires, interviews)
├── policies/           # Policy documents → Probo
├── procedures/         # Procedure documents → Probo
├── records/            # Evidence, audits, reviews → Probo
├── scan-history/       # Security scan results
├── research/           # ISO 27001 research and case studies
├── policy-templates/   # Writing guides and examples
├── org-context.md      # Company details for policy generation
└── audit-log.md        # Decision tracking with rationale
```

## Workflow

```
Research → Input (questionnaires) → Policies/Procedures (here) → Probo (auditors)
```

1. **Research**: Check `research/` for what auditors look for
2. **Gather input**: Questionnaires, interviews → `input/`
3. **Create documents**: Follow guides in `policy-templates/`
4. **Store in Git**: `policies/` or `procedures/`
5. **Sync to Probo**: Use `/probo-create document` or `/probo-update document`
6. **Track decisions**: Log rationale in `audit-log.md`

## Why Git + Probo?

| Git (here) | Probo |
|------------|-------|
| Source of truth | Auditor-facing |
| Version history | Published versions |
| Review via PR | Read-only for auditors |
| Markdown | Formatted display |
| Team collaboration | External sharing |

## Quick Reference

| Task | Location |
|------|----------|
| Add questionnaire | `input/questionnaires/` |
| Create policy | `policies/[topic]-policy.md` |
| Create procedure | `procedures/[topic]-procedure.md` |
| Log scan results | `scan-history/YYYY-MM-DD-[system]-scan.md` |
| Log decision | `audit-log.md` |
| Check writing guide | `policy-templates/README.md` |
| Review research | `research/iso27001-research-compilation.md` |

## Key Principles

From our research on successful startup audits:

1. **Describe reality** - Document what you actually do, not aspirational processes
2. **Keep it short** - 2-4 pages per policy, auditors prefer concise
3. **Be specific** - Reference actual tools (GitHub, AWS, Slack), not generic "systems"
4. **Capture evidence immediately** - Screenshot every control implementation
5. **Match interviews** - Staff must be able to explain what's in the policies
