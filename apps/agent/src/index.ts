import { createInterface } from "readline";
import { config as dotenvConfig } from "dotenv";
import { ComplianceAgent } from "./agents/index.js";

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
console.log("\nCommands:");
console.log("  /frameworks  - Import a compliance framework");
console.log("  /vendor      - Add and assess a vendor");
console.log("  /risks       - Generate risk assessment");
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
