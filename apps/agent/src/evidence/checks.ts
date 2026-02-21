import { GitHubClient } from "../integrations/github/client.js";
import { GoogleWorkspaceClient } from "../integrations/google/client.js";
import { saveEvidence, getLatestEvidence, diffEvidence, type EvidenceRecord } from "./store.js";

export interface CheckResult {
  evidence: EvidenceRecord;
  diff?: {
    statusChanged: boolean;
    newIssues: string[];
    resolvedIssues: string[];
    scoreChange?: number;
  };
}

/**
 * Run GitHub compliance check for a repository
 */
export async function checkGitHubRepository(
  client: GitHubClient,
  owner: string,
  repo: string
): Promise<CheckResult> {
  const compliance = await client.checkRepositoryCompliance(owner, repo);

  // Use issues from the compliance check
  const issues: string[] = [...compliance.issues];
  let score = 100;

  // Check branch protection
  if (!compliance.checks.branchProtection.enabled) {
    score -= 20;
  } else {
    if (!compliance.checks.branchProtection.requiresReviews) {
      score -= 10;
    }
    if (compliance.checks.branchProtection.requiredReviewers < 1) {
      score -= 5;
    }
  }

  // Check security alerts
  if (compliance.checks.security.dependabotAlertsOpen > 0) {
    score -= Math.min(compliance.checks.security.dependabotAlertsOpen * 5, 20);
  }
  if (compliance.checks.security.codeScanningAlertsOpen > 0) {
    score -= Math.min(compliance.checks.security.codeScanningAlertsOpen * 5, 15);
  }
  if (compliance.checks.security.criticalAlerts > 0) {
    score -= Math.min(compliance.checks.security.criticalAlerts * 10, 30);
  }

  // Check pull requests
  if (compliance.checks.pullRequests.mergedWithoutReview > 0) {
    score -= Math.min(compliance.checks.pullRequests.mergedWithoutReview * 3, 15);
  }

  score = Math.max(0, score);

  const status: EvidenceRecord["summary"]["status"] =
    score >= 80 ? "pass" : score >= 50 ? "partial" : "fail";

  // Get previous evidence for diff
  const previous = getLatestEvidence("github", `repo_${owner}_${repo}`);

  const evidence = saveEvidence(
    "github",
    `repo_${owner}_${repo}`,
    compliance as unknown as Record<string, unknown>,
    { status, issues, score },
    { organization: owner, repository: repo }
  );

  return {
    evidence,
    diff: previous ? diffEvidence(previous, evidence) : undefined,
  };
}

/**
 * Run GitHub compliance check for all accessible repositories
 */
export async function checkAllGitHubRepositories(
  client: GitHubClient,
  options?: { maxRepos?: number; filter?: (repo: { full_name: string; private: boolean }) => boolean }
): Promise<CheckResult[]> {
  const repos = await client.listRepositories();
  const results: CheckResult[] = [];

  const filteredRepos = options?.filter
    ? repos.filter(options.filter)
    : repos;

  const reposToCheck = filteredRepos.slice(0, options?.maxRepos || 10);

  for (const repo of reposToCheck) {
    try {
      const [owner, name] = repo.full_name.split("/");
      const result = await checkGitHubRepository(client, owner, name);
      results.push(result);
    } catch (error) {
      console.error(`Failed to check ${repo.full_name}:`, error);
    }
  }

  // Also save a summary evidence record
  const totalIssues = results.flatMap(r => r.evidence.summary.issues);
  const avgScore = results.reduce((sum, r) => sum + (r.evidence.summary.score || 0), 0) / results.length;

  saveEvidence(
    "github",
    "organization_summary",
    {
      repositoriesChecked: results.length,
      repositories: results.map(r => ({
        name: r.evidence.metadata?.repository,
        status: r.evidence.summary.status,
        score: r.evidence.summary.score,
        issueCount: r.evidence.summary.issues.length,
      })),
    },
    {
      status: avgScore >= 80 ? "pass" : avgScore >= 50 ? "partial" : "fail",
      issues: totalIssues,
      score: Math.round(avgScore),
    }
  );

  return results;
}

/**
 * Run Google Workspace compliance check
 */
export async function checkGoogleWorkspace(
  client: GoogleWorkspaceClient
): Promise<CheckResult> {
  const compliance = await client.checkCompliance();

  const issues = compliance.issues;
  let score = 100;

  // Calculate score based on checks
  const userChecks = compliance.checks.users;

  // 2FA coverage
  const twoFAPercent = (userChecks.with2FA / userChecks.total) * 100;
  if (twoFAPercent < 100) {
    score -= Math.round((100 - twoFAPercent) * 0.3); // Up to 30 points
  }

  // 2FA enforcement
  const enforcedPercent = (userChecks.enforced2FA / userChecks.total) * 100;
  if (enforcedPercent < 100) {
    score -= Math.round((100 - enforcedPercent) * 0.2); // Up to 20 points
  }

  // Inactive users
  if (userChecks.neverLoggedIn > 0) {
    score -= Math.min(userChecks.neverLoggedIn * 2, 10);
  }

  // Too many admins
  if (userChecks.admins > 5) {
    score -= Math.min((userChecks.admins - 5) * 3, 15);
  }

  score = Math.max(0, score);

  const status: EvidenceRecord["summary"]["status"] =
    score >= 80 ? "pass" : score >= 50 ? "partial" : "fail";

  const previous = getLatestEvidence("google", "workspace_compliance");

  const evidence = saveEvidence(
    "google",
    "workspace_compliance",
    compliance as unknown as Record<string, unknown>,
    { status, issues, score },
    { domain: compliance.domain }
  );

  return {
    evidence,
    diff: previous ? diffEvidence(previous, evidence) : undefined,
  };
}

/**
 * ISO 27001 control mapping
 */
export const ISO27001_CONTROL_MAPPING = {
  // Access Control
  "A.5.15": {
    name: "Access control",
    checks: ["github_branch_protection", "google_admin_users"],
  },
  "A.5.16": {
    name: "Identity management",
    checks: ["google_user_list", "google_inactive_users"],
  },
  "A.5.17": {
    name: "Authentication information",
    checks: ["google_2fa_status", "github_2fa_status"],
  },
  "A.5.18": {
    name: "Access rights",
    checks: ["github_collaborators", "google_groups"],
  },

  // Secure Development
  "A.8.25": {
    name: "Secure development lifecycle",
    checks: ["github_branch_protection", "github_required_reviews"],
  },
  "A.8.26": {
    name: "Application security requirements",
    checks: ["github_security_alerts", "github_code_scanning"],
  },
  "A.8.27": {
    name: "Secure system architecture",
    checks: ["github_dependabot", "github_secret_scanning"],
  },
  "A.8.28": {
    name: "Secure coding",
    checks: ["github_branch_protection", "github_required_status_checks"],
  },

  // Configuration Management
  "A.8.9": {
    name: "Configuration management",
    checks: ["github_repo_settings", "google_security_settings"],
  },

  // Vulnerability Management
  "A.8.8": {
    name: "Management of technical vulnerabilities",
    checks: ["github_dependabot", "github_security_alerts"],
  },
};

/**
 * Generate ISO 27001 compliance report from evidence
 */
export function generateISO27001Report(): {
  controls: {
    id: string;
    name: string;
    status: "pass" | "fail" | "partial" | "not_assessed";
    evidence: string[];
    issues: string[];
  }[];
  overallCompliance: number;
} {
  const controls: {
    id: string;
    name: string;
    status: "pass" | "fail" | "partial" | "not_assessed";
    evidence: string[];
    issues: string[];
  }[] = [];

  // This would need to be expanded with actual evidence lookup
  // For now, return structure for the relevant controls
  for (const [controlId, control] of Object.entries(ISO27001_CONTROL_MAPPING)) {
    controls.push({
      id: controlId,
      name: control.name,
      status: "not_assessed",
      evidence: [],
      issues: [],
    });
  }

  const assessed = controls.filter(c => c.status !== "not_assessed");
  const passing = assessed.filter(c => c.status === "pass" || c.status === "partial");
  const overallCompliance = assessed.length > 0
    ? Math.round((passing.length / assessed.length) * 100)
    : 0;

  return { controls, overallCompliance };
}
