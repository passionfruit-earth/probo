#!/bin/bash
# GitHub Security Controls Verification Script
# For ISO 27001 Evidence Collection
#
# Prerequisites:
# - GitHub CLI (gh) installed and authenticated
#
# Usage: ./verify-github-controls.sh [org/repo]

set -e

REPO="${1:-passionfruit-earth/fruit-tree}"
OUTPUT_DIR="./github-evidence-$(date +%Y%m%d)"
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

echo "=========================================="
echo "GitHub Security Controls Verification"
echo "ISO 27001 Evidence Collection"
echo "=========================================="
echo "Repository: $REPO"
echo "Timestamp: $TIMESTAMP"
echo "Output: $OUTPUT_DIR"
echo ""

mkdir -p "$OUTPUT_DIR"

check() {
  local name="$1"
  local status="$2"
  local details="$3"

  if [ "$status" = "PASS" ]; then
    echo "[PASS] $name"
  elif [ "$status" = "WARN" ]; then
    echo "[WARN] $name - $details"
  else
    echo "[FAIL] $name - $details"
  fi
}

# ==========================================
# 1. REPOSITORY INFO
# ==========================================
echo "--- 1. Repository Information ---"
echo ""

gh repo view "$REPO" --json name,owner,visibility,defaultBranchRef > "$OUTPUT_DIR/repo-info.json" 2>/dev/null || echo "{}" > "$OUTPUT_DIR/repo-info.json"

visibility=$(gh repo view "$REPO" --json visibility -q '.visibility' 2>/dev/null || echo "unknown")
default_branch=$(gh repo view "$REPO" --json defaultBranchRef -q '.defaultBranchRef.name' 2>/dev/null || echo "main")

echo "Visibility: $visibility"
echo "Default branch: $default_branch"

if [ "$visibility" = "PRIVATE" ]; then
  check "Private repository" "PASS" ""
else
  check "Private repository" "WARN" "Repository is $visibility"
fi

# ==========================================
# 2. BRANCH PROTECTION
# ==========================================
echo ""
echo "--- 2. Branch Protection ($default_branch) ---"
echo ""

# Get branch protection rules
gh api "repos/$REPO/branches/$default_branch/protection" > "$OUTPUT_DIR/branch-protection.json" 2>/dev/null || echo "{}" > "$OUTPUT_DIR/branch-protection.json"

if [ -s "$OUTPUT_DIR/branch-protection.json" ] && [ "$(cat "$OUTPUT_DIR/branch-protection.json")" != "{}" ]; then

  # Required PR reviews
  required_reviewers=$(jq -r '.required_pull_request_reviews.required_approving_review_count // 0' "$OUTPUT_DIR/branch-protection.json")
  if [ "$required_reviewers" -gt 0 ]; then
    check "Required PR reviews ($required_reviewers)" "PASS" ""
  else
    check "Required PR reviews" "FAIL" "No reviews required"
  fi

  # Dismiss stale reviews
  dismiss_stale=$(jq -r '.required_pull_request_reviews.dismiss_stale_reviews // false' "$OUTPUT_DIR/branch-protection.json")
  if [ "$dismiss_stale" = "true" ]; then
    check "Dismiss stale reviews" "PASS" ""
  else
    check "Dismiss stale reviews" "WARN" "Not enabled"
  fi

  # Require status checks
  strict_checks=$(jq -r '.required_status_checks.strict // false' "$OUTPUT_DIR/branch-protection.json")
  if [ "$strict_checks" = "true" ]; then
    check "Require branches up to date" "PASS" ""
  else
    check "Require branches up to date" "WARN" "Not required"
  fi

  # Enforce admins
  enforce_admins=$(jq -r '.enforce_admins.enabled // false' "$OUTPUT_DIR/branch-protection.json")
  if [ "$enforce_admins" = "true" ]; then
    check "Enforce for admins" "PASS" ""
  else
    check "Enforce for admins" "WARN" "Admins can bypass"
  fi

  # Required signatures
  require_signatures=$(jq -r '.required_signatures.enabled // false' "$OUTPUT_DIR/branch-protection.json" 2>/dev/null || echo "false")
  if [ "$require_signatures" = "true" ]; then
    check "Require signed commits" "PASS" ""
  else
    check "Require signed commits" "WARN" "Not required"
  fi

  # Force push protection
  allow_force=$(jq -r '.allow_force_pushes.enabled // false' "$OUTPUT_DIR/branch-protection.json")
  if [ "$allow_force" = "false" ]; then
    check "Block force pushes" "PASS" ""
  else
    check "Block force pushes" "FAIL" "Force pushes allowed"
  fi

  # Deletion protection
  allow_delete=$(jq -r '.allow_deletions.enabled // false' "$OUTPUT_DIR/branch-protection.json")
  if [ "$allow_delete" = "false" ]; then
    check "Block branch deletion" "PASS" ""
  else
    check "Block branch deletion" "WARN" "Branch can be deleted"
  fi

else
  check "Branch protection" "FAIL" "No branch protection configured"
fi

# ==========================================
# 3. DEPENDABOT / SECURITY
# ==========================================
echo ""
echo "--- 3. Security Features ---"
echo ""

# Check Dependabot alerts
dependabot_alerts=$(gh api "repos/$REPO/vulnerability-alerts" 2>/dev/null && echo "enabled" || echo "disabled")
if [ "$dependabot_alerts" = "enabled" ]; then
  check "Dependabot alerts" "PASS" ""
else
  check "Dependabot alerts" "WARN" "May not be enabled or no access"
fi

# Check for Dependabot config file
dependabot_config=$(gh api "repos/$REPO/contents/.github/dependabot.yml" 2>/dev/null && echo "exists" || echo "missing")
if [ "$dependabot_config" = "exists" ]; then
  check "Dependabot config file" "PASS" ""
  gh api "repos/$REPO/contents/.github/dependabot.yml" -q '.content' 2>/dev/null | base64 -d > "$OUTPUT_DIR/dependabot.yml" 2>/dev/null || true
else
  check "Dependabot config file" "WARN" "No .github/dependabot.yml"
fi

# Check open Dependabot alerts count
open_alerts=$(gh api "repos/$REPO/dependabot/alerts?state=open" -q 'length' 2>/dev/null || echo "unknown")
if [ "$open_alerts" = "unknown" ]; then
  echo "  Open vulnerability alerts: Unable to check"
elif [ "$open_alerts" = "0" ]; then
  check "No open vulnerability alerts" "PASS" ""
else
  check "Open vulnerability alerts: $open_alerts" "WARN" "Review and remediate"
fi

# Check for code scanning
code_scanning=$(gh api "repos/$REPO/code-scanning/alerts?state=open" -q 'length' 2>/dev/null || echo "not-enabled")
if [ "$code_scanning" = "not-enabled" ]; then
  check "Code scanning (CodeQL)" "WARN" "Not enabled or no access"
else
  if [ "$code_scanning" = "0" ]; then
    check "Code scanning (CodeQL)" "PASS" "No open alerts"
  else
    check "Code scanning alerts: $code_scanning" "WARN" "Open alerts found"
  fi
fi

# Check for secret scanning
secret_scanning=$(gh api "repos/$REPO/secret-scanning/alerts?state=open" -q 'length' 2>/dev/null || echo "not-enabled")
if [ "$secret_scanning" = "not-enabled" ]; then
  check "Secret scanning" "WARN" "Not enabled or no access"
else
  if [ "$secret_scanning" = "0" ]; then
    check "Secret scanning" "PASS" "No exposed secrets"
  else
    check "Secret scanning alerts: $secret_scanning" "FAIL" "Exposed secrets found!"
  fi
fi

# ==========================================
# 4. GITHUB ACTIONS / CI
# ==========================================
echo ""
echo "--- 4. GitHub Actions / CI ---"
echo ""

# List workflows
workflows=$(gh api "repos/$REPO/actions/workflows" -q '.workflows[].name' 2>/dev/null || echo "")
gh api "repos/$REPO/actions/workflows" > "$OUTPUT_DIR/workflows.json" 2>/dev/null || echo "{}" > "$OUTPUT_DIR/workflows.json"

if [ -n "$workflows" ]; then
  check "GitHub Actions configured" "PASS" ""
  echo "  Workflows:"
  echo "$workflows" | while read -r wf; do
    echo "    - $wf"
  done
else
  check "GitHub Actions configured" "WARN" "No workflows found"
fi

# Check for security-related workflows
if echo "$workflows" | grep -qi "security\|codeql\|scan\|sast"; then
  check "Security workflow exists" "PASS" ""
else
  check "Security workflow exists" "WARN" "No dedicated security workflow"
fi

# ==========================================
# 5. ACCESS CONTROL
# ==========================================
echo ""
echo "--- 5. Access Control ---"
echo ""

# List collaborators
gh api "repos/$REPO/collaborators" > "$OUTPUT_DIR/collaborators.json" 2>/dev/null || echo "[]" > "$OUTPUT_DIR/collaborators.json"

collaborator_count=$(jq 'length' "$OUTPUT_DIR/collaborators.json" 2>/dev/null || echo "unknown")
echo "Collaborators: $collaborator_count"

# Check for admin users
admin_count=$(jq '[.[] | select(.permissions.admin == true)] | length' "$OUTPUT_DIR/collaborators.json" 2>/dev/null || echo "unknown")
echo "Admin users: $admin_count"

if [ "$admin_count" != "unknown" ] && [ "$admin_count" -le 3 ]; then
  check "Limited admin access ($admin_count admins)" "PASS" ""
else
  check "Admin access" "WARN" "$admin_count admins - review if appropriate"
fi

# List teams with access
gh api "repos/$REPO/teams" > "$OUTPUT_DIR/teams.json" 2>/dev/null || echo "[]" > "$OUTPUT_DIR/teams.json"
team_count=$(jq 'length' "$OUTPUT_DIR/teams.json" 2>/dev/null || echo "0")
echo "Teams with access: $team_count"

# ==========================================
# 6. RECENT ACTIVITY
# ==========================================
echo ""
echo "--- 6. Recent Activity (last 10 PRs) ---"
echo ""

gh pr list --repo "$REPO" --state merged --limit 10 --json number,title,author,mergedAt,reviews > "$OUTPUT_DIR/recent-prs.json" 2>/dev/null || echo "[]" > "$OUTPUT_DIR/recent-prs.json"

# Check if PRs have reviews
prs_without_reviews=$(jq '[.[] | select(.reviews | length == 0)] | length' "$OUTPUT_DIR/recent-prs.json" 2>/dev/null || echo "unknown")
total_prs=$(jq 'length' "$OUTPUT_DIR/recent-prs.json" 2>/dev/null || echo "0")

if [ "$prs_without_reviews" = "0" ] && [ "$total_prs" != "0" ]; then
  check "All recent PRs have reviews" "PASS" ""
elif [ "$prs_without_reviews" != "unknown" ]; then
  check "PRs without reviews: $prs_without_reviews/$total_prs" "WARN" "Some PRs merged without review"
fi

# ==========================================
# 7. REPOSITORY SETTINGS
# ==========================================
echo ""
echo "--- 7. Repository Settings ---"
echo ""

# Check if wiki is disabled (reduces attack surface)
wiki_enabled=$(gh repo view "$REPO" --json hasWikiEnabled -q '.hasWikiEnabled' 2>/dev/null || echo "unknown")
if [ "$wiki_enabled" = "false" ]; then
  check "Wiki disabled" "PASS" ""
else
  check "Wiki enabled" "WARN" "Consider disabling if unused"
fi

# Check if issues are used
issues_enabled=$(gh repo view "$REPO" --json hasIssuesEnabled -q '.hasIssuesEnabled' 2>/dev/null || echo "unknown")
echo "Issues enabled: $issues_enabled"

# ==========================================
# SUMMARY
# ==========================================
echo ""
echo "=========================================="
echo "Evidence Collection Complete"
echo "=========================================="
echo ""
echo "Evidence files saved to: $OUTPUT_DIR/"
ls -la "$OUTPUT_DIR/"
echo ""
echo "Next steps:"
echo "1. Review any WARN or FAIL items above"
echo "2. Create tasks for gaps in Probo"
echo "3. Screenshot GitHub settings for audit evidence"
echo ""
