# GitHub Security Controls Verification - Findings

**Date:** 2026-02-21
**Assessed By:** Claude (automated)
**Organization:** passionfruit-earth
**Status:** Gaps Found - Remediation Required

---

## Summary

| Repository | Branch Protection | Dependabot | CI/CD |
|------------|------------------|------------|-------|
| fruit-tree (backend) | FAIL - None | FAIL - No config | PASS |
| fruit-front (frontend) | FAIL - None | Not checked | Not checked |
| fruit-front-lib (extensions) | FAIL - None | Not checked | Not checked |
| yggdrasill (IaC) | PASS - Protected | Not checked | PASS |

---

## Critical Findings

### GH-001: No Branch Protection on Main Application Repos

| Field | Value |
|-------|-------|
| Repositories | fruit-tree, fruit-front, fruit-front-lib |
| Finding | Main branch has no protection rules |
| Risk | Code can be pushed directly to main without review, force pushes allowed |
| ISO Control | A.8.25 (Secure Development), A.8.32 (Change Management) |
| Remediation | Enable branch protection with required PR reviews |
| Priority | High |

**What's missing:**
- No required PR reviews before merge
- No required status checks
- Force pushes allowed
- Branch deletion allowed
- Admins can bypass (no protection exists)

### GH-002: No Dependabot Configuration

| Field | Value |
|-------|-------|
| Repository | fruit-tree (and likely others) |
| Finding | No .github/dependabot.yml file |
| Risk | Dependencies not automatically checked for vulnerabilities |
| ISO Control | A.8.8 (Management of Technical Vulnerabilities) |
| Remediation | Add Dependabot config for npm/pip/docker dependencies |
| Priority | Medium |

---

## Passed Controls

### yggdrasill (Infrastructure as Code)

| Control | Status | Value |
|---------|--------|-------|
| Branch protection | PASS | Enabled |
| Required PR reviews | PASS | 1 required |
| Required status checks | PASS | Preview, Format Checks |
| Block force push | PASS | Blocked |
| Block deletion | PASS | Blocked |

**Could improve:**
- Dismiss stale reviews: Not enabled
- Enforce for admins: Not enabled

### fruit-tree CI/CD

| Control | Status |
|---------|--------|
| GitHub Actions configured | PASS |
| CI workflow | PASS |
| Deployment workflows | PASS (Dev, Staging, Prod) |

---

## Recommended Branch Protection Settings

For fruit-tree, fruit-front, fruit-front-lib:

```
Required PR reviews: 1
Dismiss stale reviews: Yes
Require status checks: Yes (CI must pass)
Require branches up to date: Yes
Enforce for admins: Yes (optional but recommended)
Block force pushes: Yes
Block deletions: Yes
```

---

## Remediation Tasks

| ID | Task | Repo | Priority | Due |
|----|------|------|----------|-----|
| GH-001a | Enable branch protection on main | fruit-tree | High | 2026-02-24 |
| GH-001b | Enable branch protection on main | fruit-front | High | 2026-02-24 |
| GH-001c | Enable branch protection on main | fruit-front-lib | High | 2026-02-24 |
| GH-002 | Add Dependabot config | fruit-tree | Medium | 2026-02-28 |
| GH-003 | Enable secret scanning | All repos | Medium | 2026-02-28 |

---

## Evidence Collected

- Branch protection status for 4 repos
- Workflow list for fruit-tree
- Admin user list

---

## Next Steps

1. Create measures and tasks in Probo
2. Enable branch protection via GitHub Settings or API
3. Add Dependabot configuration files
4. Re-verify after remediation
