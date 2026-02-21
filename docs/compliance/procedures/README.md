# Procedures

ISO 27001 procedure documents. Source of truth - synced to Probo.

**Policies vs Procedures:**
- **Policy** = What we do and why (rules)
- **Procedure** = How we do it (step-by-step)

## Required Procedures

| Procedure | ISO Clause | Status | Probo Doc ID |
|-----------|------------|--------|--------------|
| Risk Assessment Procedure | 6.1.2 | | |
| Document Control Procedure | 7.5 | | |
| Internal Audit Procedure | 9.2 | | |
| Management Review Procedure | 9.3 | | |
| Corrective Action Procedure | 10.2 | | |
| Access Provisioning Procedure | A.5.18 | | |
| Incident Response Procedure | A.5.26 | | |
| Change Management Procedure | A.8.32 | | |
| Backup & Recovery Procedure | A.8.13 | | |

## Naming Convention

```
[topic]-procedure.md
```

## Procedure Structure

Each procedure should include:

1. **Document Control** - Version, date, author, approver
2. **Purpose** - What this procedure achieves
3. **Scope** - When this procedure applies
4. **Responsibilities** - Who does each step
5. **Procedure Steps** - Numbered, actionable steps
6. **Records** - What evidence is created
7. **Related Documents** - Links to policies

## Writing Procedures

**Good procedure:**
```
## Granting GitHub Access

1. Requestor submits access request in Linear
2. Team lead approves within 2 business days
3. Lars adds user to GitHub org with appropriate role
4. Lars notifies requestor via Slack
5. Access logged in GitHub audit log (automatic)
```

**Bad procedure:**
```
Access shall be granted in accordance with the principle of least
privilege following appropriate approval workflows as defined by
organizational policy requirements.
```

**Key principles:**
- Describe what you actually do today
- Use real tool names (GitHub, Linear, Slack)
- Include who does each step
- Keep steps actionable and verifiable
- If you can't demonstrate it, don't write it

## Workflow

1. Check `../org-context.md` for Passionfruit specifics
2. Document your actual process (not ideal process)
3. Create procedure here using naming convention
4. Review with team who executes the procedure
5. Sync to Probo: `/probo-create document`
6. Update Probo Doc ID in table above

## Tips

- **Start with existing processes** - Document what you already do
- **Walk through with team** - They should recognize the steps
- **Test it** - Can a new person follow it?
- **Keep it current** - Update when process changes
