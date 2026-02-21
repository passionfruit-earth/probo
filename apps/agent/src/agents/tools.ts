import Anthropic from "@anthropic-ai/sdk";
import { ProboClient } from "../client/index.js";
import {
  getFramework,
  listAvailableFrameworks,
  parseStandardsMapping,
} from "../content/index.js";
import {
  gatherVendorSecurityInfo,
  formatSecurityProfile,
} from "./vendor-security-gatherer.js";
import { GitHubClient } from "../integrations/github/index.js";
import { GoogleWorkspaceClient } from "../integrations/google/index.js";

// Tool definitions for the Anthropic SDK
export const PROBO_TOOLS: Anthropic.Tool[] = [
  {
    name: "list_frameworks",
    description:
      "List all compliance frameworks currently configured in the organization",
    input_schema: {
      type: "object" as const,
      properties: {
        organizationId: {
          type: "string",
          description: "The organization ID to list frameworks for",
        },
      },
      required: ["organizationId"],
    },
  },
  {
    name: "import_framework",
    description:
      "Import a standard compliance framework (SOC2, ISO27001) into the organization. This creates the framework with all its controls.",
    input_schema: {
      type: "object" as const,
      properties: {
        organizationId: {
          type: "string",
          description: "The organization ID to import the framework into",
        },
        frameworkId: {
          type: "string",
          enum: ["soc2-2017", "iso27001-2022", "nist-800-53-rev5"],
          description: "The framework to import. NIST 800-53 is fetched from official NIST OSCAL source.",
        },
      },
      required: ["organizationId", "frameworkId"],
    },
  },
  {
    name: "list_controls",
    description:
      "List all controls for a framework or all controls in the organization",
    input_schema: {
      type: "object" as const,
      properties: {
        organizationId: {
          type: "string",
          description: "The organization ID",
        },
        frameworkId: {
          type: "string",
          description: "Optional: filter by framework ID",
        },
      },
      required: ["organizationId"],
    },
  },
  {
    name: "list_measures",
    description:
      "List all security measures/mitigations configured in the organization",
    input_schema: {
      type: "object" as const,
      properties: {
        organizationId: {
          type: "string",
          description: "The organization ID",
        },
      },
      required: ["organizationId"],
    },
  },
  {
    name: "create_measure",
    description:
      "Create a new security measure/mitigation in the organization",
    input_schema: {
      type: "object" as const,
      properties: {
        organizationId: {
          type: "string",
          description: "The organization ID",
        },
        name: {
          type: "string",
          description: "Name of the measure",
        },
        description: {
          type: "string",
          description: "Detailed description of the measure",
        },
        category: {
          type: "string",
          description:
            "Category like 'Access Control', 'Security Operations', etc.",
        },
      },
      required: ["organizationId", "name", "description", "category"],
    },
  },
  {
    name: "list_risks",
    description: "List all risks identified in the organization",
    input_schema: {
      type: "object" as const,
      properties: {
        organizationId: {
          type: "string",
          description: "The organization ID",
        },
      },
      required: ["organizationId"],
    },
  },
  {
    name: "create_risk",
    description: "Create a new risk in the organization risk register",
    input_schema: {
      type: "object" as const,
      properties: {
        organizationId: {
          type: "string",
          description: "The organization ID",
        },
        name: {
          type: "string",
          description: "Name/title of the risk",
        },
        description: {
          type: "string",
          description: "Detailed description of the risk",
        },
        treatment: {
          type: "string",
          enum: ["MITIGATED", "ACCEPTED", "AVOIDED", "TRANSFERRED"],
          description: "How the risk will be treated",
        },
        likelihood: {
          type: "number",
          description: "Likelihood score (1-5)",
        },
        impact: {
          type: "number",
          description: "Impact score (1-5)",
        },
      },
      required: ["organizationId", "name", "description", "treatment"],
    },
  },
  {
    name: "list_vendors",
    description: "List all vendors/third-parties in the organization",
    input_schema: {
      type: "object" as const,
      properties: {
        organizationId: {
          type: "string",
          description: "The organization ID",
        },
      },
      required: ["organizationId"],
    },
  },
  {
    name: "create_vendor",
    description: "Add a new vendor to the organization",
    input_schema: {
      type: "object" as const,
      properties: {
        organizationId: {
          type: "string",
          description: "The organization ID",
        },
        name: {
          type: "string",
          description: "Vendor name",
        },
        description: {
          type: "string",
          description: "Description of what the vendor provides",
        },
        websiteUrl: {
          type: "string",
          description: "Vendor website URL",
        },
      },
      required: ["organizationId", "name"],
    },
  },
  {
    name: "assess_vendor",
    description:
      "Trigger AI assessment of a vendor based on their website. Probo will analyze the vendor's security posture.",
    input_schema: {
      type: "object" as const,
      properties: {
        vendorId: {
          type: "string",
          description: "The vendor ID to assess",
        },
      },
      required: ["vendorId"],
    },
  },
  {
    name: "list_documents",
    description:
      "List all compliance documents (policies, procedures) in the organization",
    input_schema: {
      type: "object" as const,
      properties: {
        organizationId: {
          type: "string",
          description: "The organization ID",
        },
      },
      required: ["organizationId"],
    },
  },
  {
    name: "create_document",
    description:
      "Create a new compliance document (policy, procedure, etc.)",
    input_schema: {
      type: "object" as const,
      properties: {
        organizationId: {
          type: "string",
          description: "The organization ID",
        },
        title: {
          type: "string",
          description: "Document title",
        },
        documentType: {
          type: "string",
          description: "Type like POLICY, PROCEDURE, GUIDELINE",
        },
        content: {
          type: "string",
          description: "Document content in markdown",
        },
      },
      required: ["organizationId", "title", "documentType"],
    },
  },
  {
    name: "get_available_frameworks",
    description:
      "Get the list of compliance frameworks available to import (built into the agent)",
    input_schema: {
      type: "object" as const,
      properties: {},
      required: [],
    },
  },
  {
    name: "gather_vendor_security_info",
    description:
      "Automatically gather security information about a vendor by crawling their website and trust pages. Finds certifications (SOC 2, ISO 27001, etc.), DPA links, subprocessor lists, and security contact info using multiple discovery strategies.",
    input_schema: {
      type: "object" as const,
      properties: {
        vendorName: {
          type: "string",
          description: "The vendor/company name to research",
        },
        websiteUrl: {
          type: "string",
          description: "Optional: The vendor's website URL. If not provided, will attempt to guess based on vendor name.",
        },
      },
      required: ["vendorName"],
    },
  },
  // GitHub integration tools
  {
    name: "github_list_repos",
    description:
      "List GitHub repositories for the authenticated user or an organization. Use this to see what repos are available for compliance checking.",
    input_schema: {
      type: "object" as const,
      properties: {
        organization: {
          type: "string",
          description: "Optional: GitHub organization name. If not provided, lists repos for the authenticated user.",
        },
      },
      required: [],
    },
  },
  {
    name: "github_check_compliance",
    description:
      "Run a comprehensive compliance check on a GitHub repository. Checks branch protection, security alerts, PR review practices, and more. Returns compliance status and issues found.",
    input_schema: {
      type: "object" as const,
      properties: {
        owner: {
          type: "string",
          description: "Repository owner (user or organization)",
        },
        repo: {
          type: "string",
          description: "Repository name",
        },
      },
      required: ["owner", "repo"],
    },
  },
  {
    name: "github_get_security_alerts",
    description:
      "Get open security alerts (Dependabot vulnerabilities) for a GitHub repository.",
    input_schema: {
      type: "object" as const,
      properties: {
        owner: {
          type: "string",
          description: "Repository owner (user or organization)",
        },
        repo: {
          type: "string",
          description: "Repository name",
        },
      },
      required: ["owner", "repo"],
    },
  },
  {
    name: "github_get_branch_protection",
    description:
      "Get branch protection settings for a repository's default branch. Shows required reviews, status checks, admin enforcement, etc.",
    input_schema: {
      type: "object" as const,
      properties: {
        owner: {
          type: "string",
          description: "Repository owner (user or organization)",
        },
        repo: {
          type: "string",
          description: "Repository name",
        },
      },
      required: ["owner", "repo"],
    },
  },
  // Google Workspace integration tools
  {
    name: "google_check_compliance",
    description:
      "Run a comprehensive compliance check on Google Workspace. Checks 2FA enrollment, admin users, inactive accounts, and more. Returns compliance status and issues found.",
    input_schema: {
      type: "object" as const,
      properties: {},
      required: [],
    },
  },
  {
    name: "google_list_users",
    description:
      "List all users in Google Workspace with their security status (2FA, admin, suspended, last login).",
    input_schema: {
      type: "object" as const,
      properties: {
        maxResults: {
          type: "number",
          description: "Maximum number of users to return (default 100)",
        },
      },
      required: [],
    },
  },
  {
    name: "google_get_2fa_status",
    description:
      "Get 2FA enrollment status across the Google Workspace. Shows how many users have 2FA enabled, enforced, and lists users without 2FA.",
    input_schema: {
      type: "object" as const,
      properties: {},
      required: [],
    },
  },
  {
    name: "google_get_admins",
    description:
      "List all admin users in Google Workspace (super admins and delegated admins).",
    input_schema: {
      type: "object" as const,
      properties: {},
      required: [],
    },
  },
  {
    name: "google_list_groups",
    description:
      "List all groups in Google Workspace.",
    input_schema: {
      type: "object" as const,
      properties: {},
      required: [],
    },
  },
];

// Tool executor - executes tool calls against Probo API and external integrations
export class ToolExecutor {
  private githubClient: GitHubClient | null = null;
  private googleClient: GoogleWorkspaceClient | null = null;

  constructor(
    private client: ProboClient,
    options?: {
      githubToken?: string;
      googleAccessToken?: string;
    }
  ) {
    if (options?.githubToken) {
      this.githubClient = new GitHubClient({ token: options.githubToken });
    }
    if (options?.googleAccessToken) {
      this.googleClient = new GoogleWorkspaceClient({
        accessToken: options.googleAccessToken,
      });
    }
  }

  async execute(
    toolName: string,
    input: Record<string, unknown>
  ): Promise<string> {
    try {
      switch (toolName) {
        case "list_frameworks": {
          const result = await this.client.listFrameworks(
            input.organizationId as string
          );
          return JSON.stringify(result, null, 2);
        }

        case "import_framework": {
          const framework = await getFramework(input.frameworkId as string);
          if (!framework) {
            return JSON.stringify({
              error: `Framework ${input.frameworkId} not found. Available: ${listAvailableFrameworks().join(", ")}`,
            });
          }
          const result = await this.client.importFramework({
            organizationId: input.organizationId as string,
            framework,
          });
          return JSON.stringify(result, null, 2);
        }

        case "list_controls": {
          const result = await this.client.listControls(
            input.organizationId as string,
            input.frameworkId as string | undefined
          );
          return JSON.stringify(result, null, 2);
        }

        case "list_measures": {
          const result = await this.client.listMeasures(
            input.organizationId as string
          );
          return JSON.stringify(result, null, 2);
        }

        case "create_measure": {
          const result = await this.client.createMeasure({
            organizationId: input.organizationId as string,
            name: input.name as string,
            description: input.description as string,
            category: input.category as string,
          });
          return JSON.stringify(result, null, 2);
        }

        case "list_risks": {
          const result = await this.client.listRisks(
            input.organizationId as string
          );
          return JSON.stringify(result, null, 2);
        }

        case "create_risk": {
          const result = await this.client.createRisk({
            organizationId: input.organizationId as string,
            name: input.name as string,
            description: input.description as string,
            treatment: input.treatment as
              | "MITIGATED"
              | "ACCEPTED"
              | "AVOIDED"
              | "TRANSFERRED",
            likelihood: input.likelihood as number | undefined,
            impact: input.impact as number | undefined,
          });
          return JSON.stringify(result, null, 2);
        }

        case "list_vendors": {
          const result = await this.client.listVendors(
            input.organizationId as string
          );
          return JSON.stringify(result, null, 2);
        }

        case "create_vendor": {
          const result = await this.client.createVendor({
            organizationId: input.organizationId as string,
            name: input.name as string,
            description: input.description as string | undefined,
            websiteUrl: input.websiteUrl as string | undefined,
          });
          return JSON.stringify(result, null, 2);
        }

        case "assess_vendor": {
          const result = await this.client.assessVendor({
            vendorId: input.vendorId as string,
          });
          return JSON.stringify(result, null, 2);
        }

        case "list_documents": {
          const result = await this.client.listDocuments(
            input.organizationId as string
          );
          return JSON.stringify(result, null, 2);
        }

        case "create_document": {
          const result = await this.client.createDocument({
            organizationId: input.organizationId as string,
            title: input.title as string,
            documentType: input.documentType as string,
            content: input.content as string | undefined,
          });
          return JSON.stringify(result, null, 2);
        }

        case "get_available_frameworks": {
          return JSON.stringify({
            frameworks: listAvailableFrameworks(),
            description:
              "These are pre-built compliance frameworks that can be imported into your organization using import_framework",
          });
        }

        case "gather_vendor_security_info": {
          const profile = await gatherVendorSecurityInfo(
            input.vendorName as string,
            input.websiteUrl as string | undefined
          );
          // Return both structured data and formatted summary
          return JSON.stringify({
            profile,
            summary: formatSecurityProfile(profile),
          }, null, 2);
        }

        // GitHub integration tools
        case "github_list_repos": {
          if (!this.githubClient) {
            return JSON.stringify({
              error: "GitHub not configured. Set GITHUB_TOKEN environment variable.",
            });
          }
          const repos = await this.githubClient.listRepositories(
            input.organization as string | undefined
          );
          return JSON.stringify({
            count: repos.length,
            repositories: repos.map((r) => ({
              name: r.full_name,
              private: r.private,
              default_branch: r.default_branch,
              url: r.html_url,
            })),
          }, null, 2);
        }

        case "github_check_compliance": {
          if (!this.githubClient) {
            return JSON.stringify({
              error: "GitHub not configured. Set GITHUB_TOKEN environment variable.",
            });
          }
          const compliance = await this.githubClient.checkRepositoryCompliance(
            input.owner as string,
            input.repo as string
          );
          return JSON.stringify(compliance, null, 2);
        }

        case "github_get_security_alerts": {
          if (!this.githubClient) {
            return JSON.stringify({
              error: "GitHub not configured. Set GITHUB_TOKEN environment variable.",
            });
          }
          const alerts = await this.githubClient.getDependabotAlerts(
            input.owner as string,
            input.repo as string
          );
          return JSON.stringify({
            count: alerts.length,
            alerts: alerts.map((a) => ({
              severity: a.security_advisory.severity,
              package: `${a.dependency.package.ecosystem}/${a.dependency.package.name}`,
              summary: a.security_advisory.summary,
              state: a.state,
              created: a.created_at,
            })),
          }, null, 2);
        }

        case "github_get_branch_protection": {
          if (!this.githubClient) {
            return JSON.stringify({
              error: "GitHub not configured. Set GITHUB_TOKEN environment variable.",
            });
          }
          const repo = await this.githubClient.getRepository(
            input.owner as string,
            input.repo as string
          );
          const protection = await this.githubClient.getBranchProtection(
            input.owner as string,
            input.repo as string,
            repo.default_branch
          );
          if (!protection) {
            return JSON.stringify({
              branch: repo.default_branch,
              protected: false,
              message: "No branch protection configured",
            });
          }
          return JSON.stringify({
            branch: repo.default_branch,
            protected: true,
            settings: {
              requiresReviews: protection.required_pull_request_reviews !== null,
              requiredReviewers: protection.required_pull_request_reviews?.required_approving_review_count ?? 0,
              dismissStaleReviews: protection.required_pull_request_reviews?.dismiss_stale_reviews ?? false,
              requireCodeOwners: protection.required_pull_request_reviews?.require_code_owner_reviews ?? false,
              enforceAdmins: protection.enforce_admins?.enabled ?? false,
              requireSignedCommits: protection.required_signatures?.enabled ?? false,
              allowForcePush: protection.allow_force_pushes?.enabled ?? false,
              allowDeletions: protection.allow_deletions?.enabled ?? false,
            },
          }, null, 2);
        }

        // Google Workspace integration tools
        case "google_check_compliance": {
          if (!this.googleClient) {
            return JSON.stringify({
              error: "Google Workspace not configured. Set GOOGLE_ACCESS_TOKEN environment variable.",
            });
          }
          const compliance = await this.googleClient.checkCompliance();
          return JSON.stringify(compliance, null, 2);
        }

        case "google_list_users": {
          if (!this.googleClient) {
            return JSON.stringify({
              error: "Google Workspace not configured. Set GOOGLE_ACCESS_TOKEN environment variable.",
            });
          }
          const maxResults = (input.maxResults as number) || 100;
          const users = await this.googleClient.listUsers(maxResults);
          return JSON.stringify({
            count: users.length,
            users: users.map((u) => ({
              email: u.primaryEmail,
              name: u.name?.fullName,
              isAdmin: u.isAdmin,
              is2FAEnabled: u.isEnrolledIn2Sv,
              is2FAEnforced: u.isEnforcedIn2Sv,
              suspended: u.suspended,
              lastLogin: u.lastLoginTime,
              orgUnit: u.orgUnitPath,
            })),
          }, null, 2);
        }

        case "google_get_2fa_status": {
          if (!this.googleClient) {
            return JSON.stringify({
              error: "Google Workspace not configured. Set GOOGLE_ACCESS_TOKEN environment variable.",
            });
          }
          const status = await this.googleClient.get2FAStatus();
          return JSON.stringify({
            summary: {
              total: status.total,
              enrolled: status.enrolled,
              enforced: status.enforced,
              notEnrolled: status.notEnrolled.length,
              enrollmentRate: `${((status.enrolled / status.total) * 100).toFixed(1)}%`,
            },
            usersWithout2FA: status.notEnrolled,
          }, null, 2);
        }

        case "google_get_admins": {
          if (!this.googleClient) {
            return JSON.stringify({
              error: "Google Workspace not configured. Set GOOGLE_ACCESS_TOKEN environment variable.",
            });
          }
          const admins = await this.googleClient.getAdminUsers();
          return JSON.stringify({
            count: admins.length,
            admins: admins.map((u) => ({
              email: u.primaryEmail,
              name: u.name?.fullName,
              isSuperAdmin: u.isAdmin,
              isDelegatedAdmin: u.isDelegatedAdmin,
              is2FAEnabled: u.isEnrolledIn2Sv,
              lastLogin: u.lastLoginTime,
            })),
          }, null, 2);
        }

        case "google_list_groups": {
          if (!this.googleClient) {
            return JSON.stringify({
              error: "Google Workspace not configured. Set GOOGLE_ACCESS_TOKEN environment variable.",
            });
          }
          const groups = await this.googleClient.listGroups();
          return JSON.stringify({
            count: groups.length,
            groups: groups.map((g) => ({
              email: g.email,
              name: g.name,
              description: g.description,
              members: g.directMembersCount,
            })),
          }, null, 2);
        }

        default:
          return JSON.stringify({ error: `Unknown tool: ${toolName}` });
      }
    } catch (error) {
      return JSON.stringify({
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
}
