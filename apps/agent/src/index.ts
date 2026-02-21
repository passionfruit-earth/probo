import { createInterface } from "readline";
import { config as dotenvConfig } from "dotenv";
import { ComplianceAgent } from "./agents/index.js";
import {
  authenticateGitHub,
  getGitHubToken,
  isGitHubAuthenticated,
  clearGitHubAuth,
  GitHubClient,
} from "./integrations/github/index.js";
import {
  checkAllGitHubRepositories,
  generateSummaryReport,
  listEvidence,
  syncLatestSummaryToProbo,
  createRisksFromEvidence,
} from "./evidence/index.js";
import { ProboClient } from "./client/index.js";

// Load .env file
dotenvConfig();

// Load configuration from environment
const config = {
  // AWS Bedrock credentials
  awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
  awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  awsRegion: process.env.AWS_DEFAULT_REGION || "eu-central-1",
  // Or direct Anthropic API
  anthropicApiKey: process.env.ANTHROPIC_API_KEY,
  // Model
  model: process.env.BEDROCK_MODEL || "anthropic.claude-opus-4-6-v1",
  // Probo
  proboEndpoint: process.env.PROBO_ENDPOINT || "http://localhost:8080/graphql",
  proboApiKey: process.env.PROBO_API_KEY || "",
  organizationId: process.env.PROBO_ORGANIZATION_ID || "",
  // Integrations - check saved auth first, then env var
  githubToken: getGitHubToken(),
  githubOrg: process.env.GITHUB_ORG, // Organization to scan (optional)
  googleAccessToken: process.env.GOOGLE_ACCESS_TOKEN,
};

// Validate required config
const hasAwsCredentials = config.awsAccessKeyId && config.awsSecretAccessKey;
const hasAnthropicKey = config.anthropicApiKey;

if (!hasAwsCredentials && !hasAnthropicKey) {
  console.error("Error: Either AWS credentials (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY)");
  console.error("       or ANTHROPIC_API_KEY environment variable is required");
  process.exit(1);
}

if (!config.organizationId) {
  console.warn("Warning: PROBO_ORGANIZATION_ID not set - some operations may fail");
  console.warn("Get your organization ID from the Probo console URL\n");
}

const agent = new ComplianceAgent(config);

console.log("\nProbo Compliance Agent");
console.log("======================");
console.log("Backend:", hasAwsCredentials ? "AWS Bedrock" : "Anthropic API");
console.log("Model:", config.model);
console.log("Probo API:", config.proboEndpoint);
console.log("Organization:", config.organizationId || "(not set)");
console.log("\nIntegrations:");
console.log("  GitHub:", isGitHubAuthenticated() ? "Connected" : "Not connected (run /auth github)");
console.log("  Google:", config.googleAccessToken ? "Connected" : "Not configured (set GOOGLE_ACCESS_TOKEN)");
console.log("\nCommands:");
console.log("  /auth        - Authenticate with integrations (github, logout)");
console.log("  /scan        - Run compliance checks and save evidence");
console.log("  /sync        - Sync evidence to Probo");
console.log("  /evidence    - View saved compliance evidence");
console.log("  /frameworks  - Import a compliance framework");
console.log("  /vendor      - Add and assess a vendor");
console.log("  /risks       - Generate risk assessment");
console.log("  /github      - Check GitHub repository compliance");
console.log("  /google      - Check Google Workspace compliance");
console.log("  /clear       - Clear conversation history");
console.log("  /exit        - Exit the agent");
console.log("\nOr ask any compliance-related question.\n");

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function processInput(input: string): Promise<void> {
  const trimmed = input.trim();

  if (!trimmed) return;

  // Handle commands
  if (trimmed === "/exit" || trimmed === "/quit") {
    console.log("Goodbye!");
    rl.close();
    process.exit(0);
  }

  if (trimmed === "/clear") {
    agent.clearHistory();
    console.log("Conversation history cleared.\n");
    return;
  }

  // Auth commands
  if (trimmed === "/auth" || trimmed === "/auth help") {
    console.log("\nAuthentication commands:");
    console.log("  /auth github  - Authenticate with GitHub (Device Flow)");
    console.log("  /auth status  - Show authentication status");
    console.log("  /auth logout  - Clear saved authentication\n");
    return;
  }

  if (trimmed === "/auth github") {
    if (isGitHubAuthenticated()) {
      console.log("\nAlready authenticated with GitHub.");
      console.log("Run /auth logout to disconnect.\n");
      return;
    }

    console.log("\nStarting GitHub authentication...\n");
    try {
      await authenticateGitHub((deviceInfo) => {
        console.log("┌─────────────────────────────────────────────┐");
        console.log("│  GitHub Device Authorization                │");
        console.log("├─────────────────────────────────────────────┤");
        console.log(`│  1. Go to: ${deviceInfo.verification_uri.padEnd(30)}│`);
        console.log(`│  2. Enter code: ${deviceInfo.user_code.padEnd(25)}│`);
        console.log("└─────────────────────────────────────────────┘");
        console.log("\nWaiting for authorization...");
      });
      console.log("\n✓ GitHub authentication successful!");
      console.log("Token saved to ~/.probo-agent/auth.json\n");
      // Update config with new token
      config.githubToken = getGitHubToken();
    } catch (error) {
      console.error("\nAuthentication failed:", error instanceof Error ? error.message : String(error));
    }
    return;
  }

  if (trimmed === "/auth status") {
    console.log("\nAuthentication Status:");
    console.log("  GitHub:", isGitHubAuthenticated() ? "✓ Connected" : "✗ Not connected");
    console.log("  Google:", config.googleAccessToken ? "✓ Connected (env var)" : "✗ Not connected");
    console.log("");
    return;
  }

  if (trimmed === "/auth logout" || trimmed === "/auth logout github") {
    clearGitHubAuth();
    config.githubToken = undefined;
    console.log("\nGitHub authentication cleared.\n");
    return;
  }

  // Scan commands - run compliance checks
  if (trimmed === "/scan" || trimmed === "/scan help") {
    console.log("\nCompliance scan commands:");
    console.log("  /scan github  - Scan GitHub repositories for compliance");
    console.log("  /scan all     - Run all available compliance scans");
    console.log("  /scan status  - Show summary of latest scans\n");
    return;
  }

  if (trimmed === "/scan github" || trimmed.startsWith("/scan github ")) {
    if (!isGitHubAuthenticated()) {
      console.log("\nGitHub not authenticated. Run /auth github first.\n");
      return;
    }

    // Check for org argument: /scan github <org>
    const parts = trimmed.split(" ");
    const org = parts[2] || config.githubOrg;

    console.log(`\nScanning GitHub repositories${org ? ` for org: ${org}` : " (personal)"}...\n`);
    try {
      const client = new GitHubClient({ token: getGitHubToken()! });
      const results = await checkAllGitHubRepositories(client, { maxRepos: 10, org });

      console.log(`Scanned ${results.length} repositories:\n`);
      for (const result of results) {
        const { evidence, diff } = result;
        const statusIcon = evidence.summary.status === "pass" ? "✓" :
                          evidence.summary.status === "partial" ? "~" : "✗";
        const repo = evidence.metadata?.repository || "unknown";
        const score = evidence.summary.score || 0;

        console.log(`  ${statusIcon} ${repo}: ${score}/100`);
        if (evidence.summary.issues.length > 0) {
          evidence.summary.issues.slice(0, 3).forEach(issue => {
            console.log(`      - ${issue}`);
          });
          if (evidence.summary.issues.length > 3) {
            console.log(`      ... and ${evidence.summary.issues.length - 3} more issues`);
          }
        }
        if (diff?.newIssues.length) {
          console.log(`      NEW: ${diff.newIssues.join(", ")}`);
        }
        if (diff?.resolvedIssues.length) {
          console.log(`      RESOLVED: ${diff.resolvedIssues.join(", ")}`);
        }
      }
      console.log("\nEvidence saved to ~/.probo-agent/evidence/github/\n");
    } catch (error) {
      console.error("Scan failed:", error instanceof Error ? error.message : String(error));
    }
    return;
  }

  if (trimmed === "/scan status" || trimmed === "/scan all") {
    const report = generateSummaryReport();
    console.log("\nCompliance Scan Summary");
    console.log("=======================\n");
    for (const source of report.sources) {
      const statusIcon = source.status === "pass" ? "✓" :
                        source.status === "partial" ? "~" :
                        source.status === "fail" ? "✗" : "?";
      const lastCheck = source.lastCheck
        ? new Date(source.lastCheck).toLocaleString()
        : "Never";
      console.log(`  ${statusIcon} ${source.name.padEnd(10)} Last: ${lastCheck}  Issues: ${source.issueCount}`);
    }
    console.log(`\nTotal issues: ${report.totalIssues}`);
    console.log(`Overall status: ${report.overallStatus}\n`);
    return;
  }

  // Evidence commands
  if (trimmed === "/evidence" || trimmed === "/evidence help") {
    console.log("\nEvidence commands:");
    console.log("  /evidence list [source]  - List saved evidence records");
    console.log("  /evidence summary        - Show compliance summary\n");
    return;
  }

  if (trimmed.startsWith("/evidence list")) {
    const source = trimmed.split(" ")[2];
    const records = listEvidence({
      source: source as "github" | "google" | "aws" | undefined,
      limit: 20,
    });

    if (records.length === 0) {
      console.log("\nNo evidence records found. Run /scan to collect evidence.\n");
      return;
    }

    console.log("\nRecent Evidence Records:\n");
    for (const record of records) {
      const date = new Date(record.timestamp).toLocaleString();
      const statusIcon = record.summary.status === "pass" ? "✓" :
                        record.summary.status === "partial" ? "~" : "✗";
      console.log(`  ${statusIcon} [${record.source}] ${record.type}`);
      console.log(`    ${date} - Score: ${record.summary.score || "N/A"}, Issues: ${record.summary.issues.length}`);
    }
    console.log("");
    return;
  }

  // Sync commands - push evidence to Probo
  if (trimmed === "/sync" || trimmed === "/sync help") {
    console.log("\nSync evidence to Probo:");
    console.log("  /sync github  - Sync GitHub compliance summary");
    console.log("  /sync google  - Sync Google Workspace compliance summary");
    console.log("  /sync all     - Sync all available evidence");
    console.log("  /sync risks   - Create risks for failing compliance checks\n");
    return;
  }

  if (trimmed === "/sync github" || trimmed === "/sync google" || trimmed === "/sync all") {
    if (!config.organizationId) {
      console.log("\nError: PROBO_ORGANIZATION_ID not set.");
      console.log("Set it in .env to sync evidence to Probo.\n");
      return;
    }

    const proboClient = new ProboClient({
      endpoint: config.proboEndpoint,
      apiKey: config.proboApiKey,
    });

    const sources = trimmed === "/sync all"
      ? ["github", "google"] as const
      : [trimmed.split(" ")[1] as "github" | "google"];

    console.log("\nSyncing evidence to Probo...\n");

    for (const source of sources) {
      const records = listEvidence({ source, limit: 1 });
      if (records.length === 0) {
        console.log(`  - ${source}: No evidence found (run /scan ${source} first)`);
        continue;
      }

      try {
        const result = await syncLatestSummaryToProbo(
          proboClient,
          config.organizationId,
          source
        );

        if (result) {
          console.log(`  ✓ ${source}: Created document "${result.title}"`);
        } else {
          console.log(`  ✗ ${source}: Failed to sync`);
        }
      } catch (error) {
        console.log(`  ✗ ${source}: ${error instanceof Error ? error.message : String(error)}`);
      }
    }

    console.log("\nDone. View documents in Probo console.\n");
    return;
  }

  if (trimmed === "/sync risks" || trimmed === "/sync risks --dry-run") {
    if (!config.organizationId) {
      console.log("\nError: PROBO_ORGANIZATION_ID not set.\n");
      return;
    }

    const dryRun = trimmed.includes("--dry-run");
    const proboClient = new ProboClient({
      endpoint: config.proboEndpoint,
      apiKey: config.proboApiKey,
    });

    console.log(`\n${dryRun ? "[DRY RUN] " : ""}Creating risks from compliance evidence...\n`);

    try {
      const result = await createRisksFromEvidence(proboClient, config.organizationId, { dryRun });

      if (result.risks.length > 0) {
        console.log("Risks created:");
        for (const risk of result.risks) {
          console.log(`  - ${risk.name}`);
        }
      }

      if (result.tasks.length > 0) {
        console.log("\nTasks created:");
        for (const task of result.tasks) {
          console.log(`  - ${task.name}`);
        }
      }

      if (result.skipped.length > 0) {
        console.log("\nSkipped (low severity or few repos affected):");
        for (const skip of result.skipped.slice(0, 5)) {
          console.log(`  - ${skip}`);
        }
        if (result.skipped.length > 5) {
          console.log(`  ... and ${result.skipped.length - 5} more`);
        }
      }

      console.log(`\nSummary: ${result.risks.length} risks, ${result.tasks.length} tasks created, ${result.skipped.length} skipped\n`);
    } catch (error) {
      console.error("Error:", error instanceof Error ? error.message : String(error));
    }
    return;
  }

  if (trimmed === "/frameworks") {
    console.log("\nAvailable frameworks:");
    console.log("1. soc2-2017       - SOC 2 Type II Trust Services Criteria");
    console.log("2. iso27001-2022   - ISO/IEC 27001:2022");
    console.log("3. nist-800-53-rev5 - NIST SP 800-53 Rev 5 (official OSCAL)");
    console.log('\nType the framework ID to import, or "cancel" to abort.\n');
    return;
  }

  if (trimmed === "/vendor") {
    console.log("\nTo add a vendor, type:");
    console.log('  "Add vendor [name] with website [url]"\n');
    return;
  }

  if (trimmed === "/risks") {
    console.log("\nTo generate a risk assessment, describe your context:");
    console.log(
      '  "We are a SaaS company handling healthcare data with AWS infrastructure..."\n'
    );
    return;
  }

  if (trimmed === "/github") {
    console.log("\nGitHub compliance commands:");
    console.log('  "List my GitHub repositories"');
    console.log('  "Check compliance for owner/repo"');
    console.log('  "Show security alerts for owner/repo"');
    console.log('  "Check branch protection for owner/repo"\n');
    return;
  }

  if (trimmed === "/google") {
    console.log("\nGoogle Workspace compliance commands:");
    console.log('  "Check Google Workspace compliance"');
    console.log('  "List Google Workspace users"');
    console.log('  "Show 2FA status for Google Workspace"');
    console.log('  "List admin users in Google Workspace"');
    console.log('  "List Google Workspace groups"\n');
    return;
  }

  // Send to agent
  try {
    console.log("\n[Processing...]\n");
    const response = await agent.chat(trimmed);
    console.log(response);
    console.log("");
  } catch (error) {
    console.error(
      "Error:",
      error instanceof Error ? error.message : String(error)
    );
  }
}

function prompt(): void {
  rl.question("You: ", async (input) => {
    await processInput(input);
    prompt();
  });
}

prompt();
