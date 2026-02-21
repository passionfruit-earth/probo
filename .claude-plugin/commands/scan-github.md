---
description: "Scan GitHub repos for ISO 27001 security controls"
argument-hint: "[org-name]"
---

# GitHub Security Scan

Scan GitHub organization for ISO 27001 compliance gaps.

**Default org:** passionfruit-earth

## What to check:

1. **Branch Protection** (A.8.25, A.8.32)
   - Check if main branch has protection rules or rulesets
   - Verify: required reviews, status checks, force push blocked

2. **Dependabot** (A.8.8)
   - Check for .github/dependabot.yml
   - Check for open vulnerability alerts

3. **Secret Scanning** (A.8.4)
   - Check if enabled
   - Check for exposed secrets

4. **Access Control** (A.5.15, A.8.2)
   - List admin users
   - Check for appropriate access levels

## How to run:

Use `gh` CLI (must be authenticated):

```bash
# Check repos
for repo in fruit-tree fruit-front fruit-front-lib yggdrasill; do
  echo "=== $repo ==="
  gh api "repos/passionfruit-earth/$repo/rulesets" -q '.[0] | "Ruleset: \(.name) [\(.enforcement)]"' 2>/dev/null || echo "No rulesets"
done
```

## Output format:

Create findings in this format:
- Repository name
- Control checked
- Status (PASS/FAIL/WARN)
- Gap description (if any)
- Recommended action

Then offer to create tasks in Probo for any gaps found.

## Important:

- This is READ-ONLY - never modify GitHub settings
- Log findings to docs/github-security-findings-YYYY-MM-DD.md
- Create measures and tasks in Probo for gaps
