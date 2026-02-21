import { ProboClient } from "../client/index.js";
import { listEvidence, type EvidenceRecord } from "./store.js";

/**
 * Issue to ISO 27001 control mapping
 */
const ISSUE_TO_CONTROL: Record<string, { controlId: string; controlName: string }> = {
  // GitHub issues
  "branch protection": { controlId: "A.8.25", controlName: "Secure development lifecycle" },
  "reviewer": { controlId: "A.8.25", controlName: "Secure development lifecycle" },
  "pull request": { controlId: "A.8.25", controlName: "Secure development lifecycle" },
  "security vulnerabilities": { controlId: "A.8.8", controlName: "Management of technical vulnerabilities" },
  "dependabot": { controlId: "A.8.8", controlName: "Management of technical vulnerabilities" },
  "2fa": { controlId: "A.5.17", controlName: "Authentication information" },
  "mfa": { controlId: "A.5.17", controlName: "Authentication information" },
  "admin": { controlId: "A.5.15", controlName: "Access control" },
  "merged without review": { controlId: "A.8.25", controlName: "Secure development lifecycle" },
  // AWS issues
  "root account mfa": { controlId: "A.5.17", controlName: "Authentication information" },
  "iam user": { controlId: "A.5.17", controlName: "Authentication information" },
  "password policy": { controlId: "A.5.17", controlName: "Authentication information" },
  "access key": { controlId: "A.5.17", controlName: "Authentication information" },
  "credential": { controlId: "A.5.17", controlName: "Authentication information" },
  "cloudtrail": { controlId: "A.8.15", controlName: "Logging" },
  "s3 bucket": { controlId: "A.8.24", controlName: "Use of cryptography" },
  "public access": { controlId: "A.8.20", controlName: "Networks security" },
  "encryption": { controlId: "A.8.24", controlName: "Use of cryptography" },
  "security group": { controlId: "A.8.20", controlName: "Networks security" },
  "ssh": { controlId: "A.8.20", controlName: "Networks security" },
  "rdp": { controlId: "A.8.20", controlName: "Networks security" },
  "0.0.0.0/0": { controlId: "A.8.20", controlName: "Networks security" },
};

/**
 * Find the relevant control for an issue
 */
function findControlForIssue(issue: string): { controlId: string; controlName: string } | null {
  const lowerIssue = issue.toLowerCase();
  for (const [keyword, control] of Object.entries(ISSUE_TO_CONTROL)) {
    if (lowerIssue.includes(keyword)) {
      return control;
    }
  }
  return null;
}

export interface RiskCreationResult {
  risks: { riskId: string; name: string; controlId: string }[];
  tasks: { taskId: string; name: string }[];
  skipped: string[];
}

/**
 * Analyze evidence and create risks for failing checks
 * Only creates risks for:
 * - FAIL status items
 * - Critical issues (security vulnerabilities, no branch protection on main repos)
 */
export async function createRisksFromEvidence(
  client: ProboClient,
  organizationId: string,
  options?: {
    source?: "github" | "google" | "aws";
    dryRun?: boolean;
  }
): Promise<RiskCreationResult> {
  const result: RiskCreationResult = { risks: [], tasks: [], skipped: [] };

  const sources = options?.source
    ? [options.source]
    : (["github", "google", "aws"] as const);

  // Group issues by control to avoid duplicate risks
  const issuesByControl: Map<string, {
    controlName: string;
    issues: string[];
    repos: string[];
    severity: "high" | "medium" | "low";
  }> = new Map();

  for (const source of sources) {
    const records = listEvidence({ source, limit: 50 });

    for (const record of records) {
      // Only process failing or partial checks
      if (record.summary.status === "pass") continue;

      // Skip organization summaries (already captured in individual records)
      if (record.type.includes("organization_summary")) continue;

      const repoName = record.metadata?.repository || record.metadata?.domain || "unknown";

      for (const issue of record.summary.issues) {
        const control = findControlForIssue(issue);
        if (!control) continue;

        const key = control.controlId;
        const existing = issuesByControl.get(key);

        // Determine severity based on issue type
        let severity: "high" | "medium" | "low" = "low";
        if (issue.toLowerCase().includes("critical") || issue.toLowerCase().includes("secret")) {
          severity = "high";
        } else if (issue.toLowerCase().includes("security") || issue.toLowerCase().includes("vulnerabilit")) {
          severity = "high";
        } else if (issue.toLowerCase().includes("branch protection") || issue.toLowerCase().includes("without review")) {
          severity = "medium";
        }

        if (existing) {
          if (!existing.issues.includes(issue)) {
            existing.issues.push(issue);
          }
          if (!existing.repos.includes(repoName)) {
            existing.repos.push(repoName);
          }
          // Upgrade severity if needed
          if (severity === "high" || (severity === "medium" && existing.severity === "low")) {
            existing.severity = severity;
          }
        } else {
          issuesByControl.set(key, {
            controlName: control.controlName,
            issues: [issue],
            repos: [repoName],
            severity,
          });
        }
      }
    }
  }

  // Create risks for grouped issues
  for (const [controlId, data] of issuesByControl) {
    // Only create risks for medium/high severity or if many repos affected
    if (data.severity === "low" && data.repos.length < 3) {
      result.skipped.push(`${controlId}: ${data.issues[0]} (low severity, few repos)`);
      continue;
    }

    const riskName = `[${controlId}] ${data.controlName} - Compliance Gap`;
    const description = [
      `**Control:** ${controlId} - ${data.controlName}`,
      "",
      `**Affected repositories:** ${data.repos.length}`,
      data.repos.slice(0, 5).map(r => `- ${r}`).join("\n"),
      data.repos.length > 5 ? `- ... and ${data.repos.length - 5} more` : "",
      "",
      "**Issues found:**",
      ...data.issues.slice(0, 5).map(i => `- ${i}`),
      data.issues.length > 5 ? `- ... and ${data.issues.length - 5} more` : "",
      "",
      "*Identified by automated compliance scan*",
    ].filter(Boolean).join("\n");

    // Map severity to likelihood/impact
    const inherentLikelihood = data.severity === "high" ? 4 : data.severity === "medium" ? 3 : 2;
    const inherentImpact = data.severity === "high" ? 4 : data.severity === "medium" ? 3 : 2;

    if (options?.dryRun) {
      result.risks.push({ riskId: "(dry-run)", name: riskName, controlId });
      result.tasks.push({ taskId: "(dry-run)", name: `Review: ${riskName}` });
      continue;
    }

    try {
      // Create the risk
      const createResult = await client.createRisk({
        organizationId,
        name: riskName,
        description,
        category: "TECHNICAL",
        treatment: "MITIGATED", // Default to mitigated - needs review
        inherentLikelihood,
        inherentImpact,
      });

      const riskId = (createResult as { createRisk: { riskEdge: { node: { id: string } } } })
        .createRisk.riskEdge.node.id;

      result.risks.push({ riskId, name: riskName, controlId });

      // Create a task to review/remediate
      const taskName = `Review compliance gap: ${controlId} - ${data.controlName}`;
      const taskDescription = [
        `Review the compliance gap identified by automated scanning.`,
        "",
        `**Affected repositories:** ${data.repos.length}`,
        data.repos.slice(0, 3).map(r => `- ${r}`).join("\n"),
        data.repos.length > 3 ? `- ... and ${data.repos.length - 3} more` : "",
        "",
        "**Recommended actions:**",
        ...getRecommendedActions(data.issues),
        "",
        `*Related risk: ${riskName}*`,
      ].filter(Boolean).join("\n");

      try {
        const taskResult = await client.createTask({
          organizationId,
          name: taskName,
          description: taskDescription,
        });

        const taskId = (taskResult as { createTask: { taskEdge: { node: { id: string } } } })
          .createTask.taskEdge.node.id;

        result.tasks.push({ taskId, name: taskName });
      } catch (taskError) {
        console.error(`Failed to create task for ${controlId}:`, taskError);
      }
    } catch (error) {
      console.error(`Failed to create risk for ${controlId}:`, error);
      result.skipped.push(`${controlId}: Failed to create - ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  return result;
}

/**
 * Get recommended actions based on issues found
 */
function getRecommendedActions(issues: string[]): string[] {
  const actions: string[] = [];
  const lowerIssues = issues.map(i => i.toLowerCase()).join(" ");

  // GitHub actions
  if (lowerIssues.includes("branch protection")) {
    actions.push("- Enable branch protection on default branches");
  }
  if (lowerIssues.includes("reviewer") || lowerIssues.includes("review")) {
    actions.push("- Require at least 1 code review before merging");
  }
  if (lowerIssues.includes("vulnerabilit") || lowerIssues.includes("security alert")) {
    actions.push("- Review and remediate security alerts");
  }
  if (lowerIssues.includes("admin")) {
    actions.push("- Review admin permissions and apply least privilege");
  }
  if (lowerIssues.includes("2fa") || lowerIssues.includes("mfa")) {
    actions.push("- Enable and enforce MFA for all users");
  }

  // AWS actions
  if (lowerIssues.includes("root account mfa")) {
    actions.push("- Enable MFA on the AWS root account immediately");
  }
  if (lowerIssues.includes("password policy")) {
    actions.push("- Configure IAM password policy (14+ chars, complexity, 90-day expiry)");
  }
  if (lowerIssues.includes("access key") && lowerIssues.includes("90 days")) {
    actions.push("- Rotate access keys older than 90 days");
  }
  if (lowerIssues.includes("unused") && lowerIssues.includes("credential")) {
    actions.push("- Review and disable unused IAM credentials");
  }
  if (lowerIssues.includes("cloudtrail")) {
    actions.push("- Enable CloudTrail with multi-region and log validation");
  }
  if (lowerIssues.includes("s3") && lowerIssues.includes("public")) {
    actions.push("- Enable S3 Block Public Access on all buckets");
  }
  if (lowerIssues.includes("s3") && lowerIssues.includes("encryption")) {
    actions.push("- Enable default encryption on all S3 buckets");
  }
  if (lowerIssues.includes("security group") && (lowerIssues.includes("ssh") || lowerIssues.includes("22"))) {
    actions.push("- Restrict SSH (port 22) access to specific IP ranges");
  }
  if (lowerIssues.includes("security group") && (lowerIssues.includes("rdp") || lowerIssues.includes("3389"))) {
    actions.push("- Restrict RDP (port 3389) access to specific IP ranges");
  }
  if (lowerIssues.includes("0.0.0.0/0") || lowerIssues.includes("wide open")) {
    actions.push("- Review security groups with 0.0.0.0/0 ingress rules");
  }

  if (actions.length === 0) {
    actions.push("- Review the issues and determine appropriate remediation");
  }

  return actions;
}
