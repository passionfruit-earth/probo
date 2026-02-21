# ISO 27001 Quick Start Guide

How to work on ISO 27001 compliance for Passionfruit.

## Before You Start

1. **Read the research** - `research/iso27001-research-compilation.md`
   - What makes audits succeed (40% faster vendor onboarding with cert)
   - What makes audits fail (38% of reports get rejected)
   - How other startups did it (Ellie.ai, Pyne, DETOXI)

2. **Know our context** - `org-context.md`
   - Company: Passionfruit Earth B.V., Rotterdam
   - Product: ESG/QA compliance SaaS
   - Stack: AWS, Vercel, Azure OpenAI
   - Vendors: 12 key vendors listed

## Creating a Policy

1. Check if policy exists in `policies/` table
2. Read writing guide: `policy-templates/README.md`
3. Create file: `policies/[topic]-policy.md`
4. Follow structure (see policies/README.md)
5. Keep it 2-4 pages
6. Use real tool names (GitHub, AWS, Slack)
7. Get approval
8. Sync to Probo: `/probo-create document`
9. Update table with Probo Doc ID

**Example good policy snippet:**
```markdown
## Password Requirements

All Passionfruit accounts must use:
- Minimum 12 characters
- Managed via 1Password (company vault)
- MFA enabled via Microsoft Entra

Lars reviews access quarterly via the GitHub org member list.
```

## Creating a Procedure

1. Check if procedure exists in `procedures/` table
2. Document your **actual** process (not ideal)
3. Create file: `procedures/[topic]-procedure.md`
4. Use numbered steps with who does what
5. Test: Can someone follow this?
6. Sync to Probo

**Example good procedure snippet:**
```markdown
## Granting GitHub Access

1. Requestor submits access request in Linear
2. Team lead approves within 2 business days
3. Lars adds user to GitHub org
4. Lars notifies requestor via Slack
```

## Running a Security Scan

1. Use skill: `/scan <system>`
2. Systems: aws, github, google, slack, linear, vercel, notion, posthog, attio, fireflies, azure, loops
3. Log results: `scan-history/YYYY-MM-DD-[system]-scan.md`
4. Create tasks in Probo for gaps found

## Logging Decisions

Add to `audit-log.md`:
```markdown
### YYYY-MM-DD - [Decision Title]

**Decision:** What was decided
**Rationale:** Why (reference research if relevant)
**ISO Control:** Which control this addresses
**Made by:** Who decided
**Evidence:** Where to find proof
```

## Key Files

| File | Purpose |
|------|---------|
| `org-context.md` | Company details, tech stack, vendors |
| `audit-log.md` | Decision tracking |
| `policy-templates/README.md` | How to write policies |
| `research/iso27001-research-compilation.md` | What auditors look for |
| `../iso27001-progress.md` | Overall progress tracker |

## Common Mistakes

1. **Writing aspirational policies** - Document what you do, not what you wish you did
2. **Generic language** - Use "GitHub" not "version control system"
3. **Over-promising** - Don't claim 24/7 monitoring if you don't have it
4. **Policies don't match interviews** - Staff must recognize the process
5. **No evidence** - Every control needs proof

## Getting Help

- Check research compilation for answers
- Look at startup case studies (Ellie.ai, Pyne)
- Ask in Slack
