import type {
  GitHubRepository,
  BranchProtection,
  SecurityAlert,
  CodeScanningAlert,
  PullRequest,
  PullRequestReview,
  ComplianceCheck,
} from "./types.js";

export interface GitHubClientConfig {
  token: string;
  baseUrl?: string;
}

export class GitHubClient {
  private token: string;
  private baseUrl: string;

  constructor(config: GitHubClientConfig) {
    this.token = config.token;
    this.baseUrl = config.baseUrl || "https://api.github.com";
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${this.token}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`GitHub API error: ${response.status} ${error}`);
    }

    return response.json() as Promise<T>;
  }

  // Repository operations
  async listRepositories(org?: string): Promise<GitHubRepository[]> {
    if (org) {
      return this.request<GitHubRepository[]>(`/orgs/${org}/repos?per_page=100`);
    }
    return this.request<GitHubRepository[]>("/user/repos?per_page=100");
  }

  async getRepository(owner: string, repo: string): Promise<GitHubRepository> {
    return this.request<GitHubRepository>(`/repos/${owner}/${repo}`);
  }

  // Branch protection
  async getBranchProtection(
    owner: string,
    repo: string,
    branch: string
  ): Promise<BranchProtection | null> {
    try {
      return await this.request<BranchProtection>(
        `/repos/${owner}/${repo}/branches/${branch}/protection`
      );
    } catch (error) {
      // 404 = no protection configured
      // 403 = feature not available (private repo without Pro)
      if (error instanceof Error && (error.message.includes("404") || error.message.includes("403"))) {
        return null;
      }
      throw error;
    }
  }

  // Security alerts (Dependabot)
  async getDependabotAlerts(
    owner: string,
    repo: string
  ): Promise<SecurityAlert[]> {
    try {
      return await this.request<SecurityAlert[]>(
        `/repos/${owner}/${repo}/dependabot/alerts?state=open&per_page=100`
      );
    } catch (error) {
      // 404 = not found, 403 = disabled or not available
      if (error instanceof Error && (error.message.includes("404") || error.message.includes("403"))) {
        return [];
      }
      throw error;
    }
  }

  // Code scanning alerts
  async getCodeScanningAlerts(
    owner: string,
    repo: string
  ): Promise<CodeScanningAlert[]> {
    try {
      return await this.request<CodeScanningAlert[]>(
        `/repos/${owner}/${repo}/code-scanning/alerts?state=open&per_page=100`
      );
    } catch (error) {
      // 404 = not found, 403 = disabled or not available
      if (error instanceof Error && (error.message.includes("404") || error.message.includes("403"))) {
        return [];
      }
      throw error;
    }
  }

  // Pull requests
  async listPullRequests(
    owner: string,
    repo: string,
    state: "open" | "closed" | "all" = "all"
  ): Promise<PullRequest[]> {
    return this.request<PullRequest[]>(
      `/repos/${owner}/${repo}/pulls?state=${state}&per_page=100`
    );
  }

  async getPullRequestReviews(
    owner: string,
    repo: string,
    pullNumber: number
  ): Promise<PullRequestReview[]> {
    return this.request<PullRequestReview[]>(
      `/repos/${owner}/${repo}/pulls/${pullNumber}/reviews`
    );
  }

  // Compliance check - aggregate data for a repository
  async checkRepositoryCompliance(
    owner: string,
    repo: string
  ): Promise<ComplianceCheck> {
    const repository = await this.getRepository(owner, repo);
    const protection = await this.getBranchProtection(
      owner,
      repo,
      repository.default_branch
    );
    const dependabotAlerts = await this.getDependabotAlerts(owner, repo);
    const codeScanningAlerts = await this.getCodeScanningAlerts(owner, repo);
    const recentPRs = await this.listPullRequests(owner, repo, "closed");

    // Analyze PRs for review compliance
    const mergedPRs = recentPRs.filter((pr) => pr.merged).slice(0, 20);
    let totalReviewers = 0;
    let mergedWithoutReview = 0;

    for (const pr of mergedPRs) {
      const reviews = await this.getPullRequestReviews(owner, repo, pr.number);
      const approvals = reviews.filter((r) => r.state === "APPROVED");
      if (approvals.length === 0) {
        mergedWithoutReview++;
      }
      totalReviewers += approvals.length;
    }

    const issues: string[] = [];

    // Check branch protection
    const branchProtectionCheck = {
      enabled: protection !== null,
      requiresReviews: protection?.required_pull_request_reviews !== null,
      requiredReviewers:
        protection?.required_pull_request_reviews?.required_approving_review_count ?? 0,
      dismissStaleReviews:
        protection?.required_pull_request_reviews?.dismiss_stale_reviews ?? false,
      requireCodeOwners:
        protection?.required_pull_request_reviews?.require_code_owner_reviews ?? false,
      enforceAdmins: protection?.enforce_admins?.enabled ?? false,
      requireSignedCommits: protection?.required_signatures?.enabled ?? false,
      preventForcePush: !(protection?.allow_force_pushes?.enabled ?? true),
    };

    if (!branchProtectionCheck.enabled) {
      issues.push("Branch protection is not enabled on default branch");
    }
    if (!branchProtectionCheck.requiresReviews) {
      issues.push("Pull request reviews are not required");
    }
    if (branchProtectionCheck.requiredReviewers < 1) {
      issues.push("At least 1 reviewer should be required");
    }
    if (!branchProtectionCheck.enforceAdmins) {
      issues.push("Branch protection should apply to admins");
    }

    // Check security alerts
    const criticalAlerts = dependabotAlerts.filter(
      (a) => a.security_advisory.severity === "critical"
    ).length;
    const highAlerts = dependabotAlerts.filter(
      (a) => a.security_advisory.severity === "high"
    ).length;

    if (criticalAlerts > 0) {
      issues.push(`${criticalAlerts} critical security vulnerabilities found`);
    }
    if (highAlerts > 0) {
      issues.push(`${highAlerts} high severity vulnerabilities found`);
    }

    // Check PR review practices
    if (mergedWithoutReview > 0) {
      issues.push(
        `${mergedWithoutReview} of last ${mergedPRs.length} PRs merged without review`
      );
    }

    return {
      repository: repository.full_name,
      checks: {
        branchProtection: branchProtectionCheck,
        security: {
          dependabotAlertsOpen: dependabotAlerts.length,
          codeScanningAlertsOpen: codeScanningAlerts.length,
          criticalAlerts,
          highAlerts,
        },
        pullRequests: {
          requiresReview: branchProtectionCheck.requiresReviews,
          averageReviewers:
            mergedPRs.length > 0 ? totalReviewers / mergedPRs.length : 0,
          mergedWithoutReview,
        },
      },
      compliant: issues.length === 0,
      issues,
    };
  }
}
