// GitHub API types for compliance-relevant data

export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  html_url: string;
  description: string | null;
  default_branch: string;
  archived: boolean;
  visibility: "public" | "private" | "internal";
}

export interface BranchProtection {
  required_status_checks: {
    strict: boolean;
    contexts: string[];
  } | null;
  enforce_admins: {
    enabled: boolean;
  };
  required_pull_request_reviews: {
    dismiss_stale_reviews: boolean;
    require_code_owner_reviews: boolean;
    required_approving_review_count: number;
  } | null;
  required_signatures: {
    enabled: boolean;
  };
  allow_force_pushes: {
    enabled: boolean;
  };
  allow_deletions: {
    enabled: boolean;
  };
}

export interface SecurityAlert {
  number: number;
  state: "open" | "fixed" | "dismissed";
  dependency: {
    package: {
      ecosystem: string;
      name: string;
    };
    manifest_path: string;
  };
  security_advisory: {
    ghsa_id: string;
    severity: "low" | "medium" | "high" | "critical";
    summary: string;
    description: string;
  };
  created_at: string;
  fixed_at: string | null;
}

export interface CodeScanningAlert {
  number: number;
  state: "open" | "closed" | "dismissed" | "fixed";
  rule: {
    id: string;
    severity: "none" | "note" | "warning" | "error";
    description: string;
  };
  tool: {
    name: string;
  };
  most_recent_instance: {
    ref: string;
    state: string;
    location: {
      path: string;
      start_line: number;
    };
  };
  created_at: string;
  html_url: string;
}

export interface PullRequest {
  number: number;
  title: string;
  state: "open" | "closed";
  merged: boolean;
  merged_at: string | null;
  user: {
    login: string;
  };
  requested_reviewers: Array<{ login: string }>;
  html_url: string;
  created_at: string;
}

export interface PullRequestReview {
  id: number;
  user: {
    login: string;
  };
  state: "APPROVED" | "CHANGES_REQUESTED" | "COMMENTED" | "PENDING" | "DISMISSED";
  submitted_at: string;
}

export interface ComplianceCheck {
  repository: string;
  checks: {
    branchProtection: {
      enabled: boolean;
      requiresReviews: boolean;
      requiredReviewers: number;
      dismissStaleReviews: boolean;
      requireCodeOwners: boolean;
      enforceAdmins: boolean;
      requireSignedCommits: boolean;
      preventForcePush: boolean;
    };
    security: {
      dependabotAlertsOpen: number;
      codeScanningAlertsOpen: number;
      criticalAlerts: number;
      highAlerts: number;
    };
    pullRequests: {
      requiresReview: boolean;
      averageReviewers: number;
      mergedWithoutReview: number;
    };
  };
  compliant: boolean;
  issues: string[];
}
