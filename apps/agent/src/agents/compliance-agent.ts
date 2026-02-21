import Anthropic from "@anthropic-ai/sdk";
import AnthropicBedrock from "@anthropic-ai/bedrock-sdk";
import { ProboClient } from "../client/index.js";
import { PROBO_TOOLS, ToolExecutor } from "./tools.js";

export interface ComplianceAgentConfig {
  // AWS Bedrock credentials
  awsAccessKeyId?: string;
  awsSecretAccessKey?: string;
  awsRegion?: string;
  // Or direct Anthropic API
  anthropicApiKey?: string;
  // Common config
  proboEndpoint: string;
  proboApiKey: string;
  model?: string;
  organizationId: string;
  // Integrations
  githubToken?: string;
}

const SYSTEM_PROMPT = `You are the Probo Compliance Agent - an AI assistant that helps organizations achieve and maintain compliance with security frameworks.

## Your Role
You automate compliance workflows by communicating with the Probo platform via its GraphQL API. You don't store data yourself - Probo is the source of truth for all compliance data.

## Capabilities
1. **Framework Management** - Import SOC2, ISO27001, NIST 800-53 frameworks
2. **Security Measures** - Create and track mitigations linked to controls
3. **Risk Register** - Identify, assess, and track risks with treatment plans
4. **Vendor Management** - Add vendors and trigger AI security assessments
5. **Documents** - Create compliance policies and procedures

## Available Frameworks

| ID | Name | Source Quality |
|----|------|----------------|
| soc2-2017 | SOC 2 Type II | Based on AICPA TSC 2017 |
| iso27001-2022 | ISO/IEC 27001:2022 | Based on ISO standard |
| nist-800-53-rev5 | NIST SP 800-53 Rev 5 | Official NIST OSCAL (live fetch) |

## Content Sources
- **NIST 800-53**: Fetched from official NIST OSCAL repository (government source)
- **SOC2/ISO27001**: Local definitions based on official standards
- **Mitigations**: Probo includes 65+ pre-built measures in /data/mitigations.json

## Risk Treatments
- MITIGATED - Risk reduced through controls
- ACCEPTED - Risk acknowledged and accepted
- AVOIDED - Risk eliminated by changing approach
- TRANSFERRED - Risk transferred (e.g., insurance)

## Behavioral Guidelines

### Be Helpful
- Offer relevant actions based on user context
- Suggest next steps after completing tasks
- Explain the "why" behind compliance requirements

### Be Accurate
- Don't make up control IDs or framework details
- Use official sources when available
- Say when you're uncertain

### Be Efficient
- Execute multiple tools when appropriate
- Don't over-confirm simple actions
- Batch related operations

### Be Clear
- Use plain language over compliance jargon
- Explain acronyms on first use
- Provide concrete examples

## Framework Knowledge

**SOC 2 Trust Services Criteria:**
- Security (CC1-CC9): Required for all SOC 2 reports
- Availability (A1): System uptime
- Processing Integrity (PI1): Accurate processing
- Confidentiality (C1): Protecting confidential info
- Privacy (P1-P8): Personal information handling

**ISO 27001:2022 Annex A (93 controls):**
- A.5: Organizational controls (37)
- A.6: People controls (8)
- A.7: Physical controls (14)
- A.8: Technological controls (34)

**NIST 800-53 Families:**
AC, AU, CA, CM, CP, IA, IR, MA, MP, PE, PL, PS, RA, SA, SC, SI, SR

Focus on actionable guidance. Help users understand what they need and execute it efficiently.`;

export class ComplianceAgent {
  private client: Anthropic | AnthropicBedrock;
  private proboClient: ProboClient;
  private toolExecutor: ToolExecutor;
  private model: string;
  private organizationId: string;
  private conversationHistory: Anthropic.MessageParam[] = [];

  constructor(config: ComplianceAgentConfig) {
    // Use Bedrock if AWS credentials are provided, otherwise use direct Anthropic API
    if (config.awsAccessKeyId && config.awsSecretAccessKey) {
      this.client = new AnthropicBedrock({
        awsAccessKey: config.awsAccessKeyId,
        awsSecretKey: config.awsSecretAccessKey,
        awsRegion: config.awsRegion || "eu-central-1",
      });
      this.model = config.model || "anthropic.claude-opus-4-6-v1";
      console.log(`[Agent] Using AWS Bedrock with model: ${this.model}`);
    } else if (config.anthropicApiKey) {
      this.client = new Anthropic({ apiKey: config.anthropicApiKey });
      this.model = config.model || "claude-sonnet-4-20250514";
      console.log(`[Agent] Using Anthropic API with model: ${this.model}`);
    } else {
      throw new Error("Either AWS credentials or Anthropic API key required");
    }

    this.proboClient = new ProboClient({
      endpoint: config.proboEndpoint,
      apiKey: config.proboApiKey,
    });
    this.toolExecutor = new ToolExecutor(this.proboClient, config.githubToken);
    this.organizationId = config.organizationId;
  }

  async chat(userMessage: string): Promise<string> {
    // Add user message to history
    this.conversationHistory.push({
      role: "user",
      content: userMessage,
    });

    // Call Claude with tools
    let response = await this.client.messages.create({
      model: this.model,
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      tools: PROBO_TOOLS,
      messages: this.conversationHistory,
    });

    // Handle tool use loop
    while (response.stop_reason === "tool_use") {
      const toolUseBlocks = response.content.filter(
        (block): block is Anthropic.ToolUseBlock => block.type === "tool_use"
      );

      const toolResults: Anthropic.ToolResultBlockParam[] = [];

      for (const toolUse of toolUseBlocks) {
        console.log(`[Agent] Executing tool: ${toolUse.name}`);

        // Inject organizationId if the tool needs it and it's not provided
        const input = toolUse.input as Record<string, unknown>;
        const toolDef = PROBO_TOOLS.find((t) => t.name === toolUse.name);
        const properties = toolDef?.input_schema.properties as Record<string, unknown> | undefined;
        if (
          properties &&
          "organizationId" in properties &&
          !input.organizationId
        ) {
          input.organizationId = this.organizationId;
        }

        const result = await this.toolExecutor.execute(toolUse.name, input);
        console.log(`[Agent] Tool result: ${result.slice(0, 200)}...`);

        toolResults.push({
          type: "tool_result",
          tool_use_id: toolUse.id,
          content: result,
        });
      }

      // Add assistant response and tool results to history
      this.conversationHistory.push({
        role: "assistant",
        content: response.content,
      });
      this.conversationHistory.push({
        role: "user",
        content: toolResults,
      });

      // Continue the conversation
      response = await this.client.messages.create({
        model: this.model,
        max_tokens: 4096,
        system: SYSTEM_PROMPT,
        tools: PROBO_TOOLS,
        messages: this.conversationHistory,
      });
    }

    // Extract text response
    const textBlocks = response.content.filter(
      (block): block is Anthropic.TextBlock => block.type === "text"
    );
    const assistantMessage = textBlocks.map((b) => b.text).join("\n");

    // Add final response to history
    this.conversationHistory.push({
      role: "assistant",
      content: response.content,
    });

    return assistantMessage;
  }

  // Reset conversation
  clearHistory(): void {
    this.conversationHistory = [];
  }

  // Run a specific task autonomously
  async runTask(taskDescription: string): Promise<string> {
    const prompt = `Please complete the following task autonomously. Execute all necessary tool calls to complete it fully.

Task: ${taskDescription}

Organization ID: ${this.organizationId}

After completing all actions, provide a summary of what was done.`;

    return this.chat(prompt);
  }

  // Pre-built tasks for common compliance workflows
  async setupComplianceFramework(
    frameworkId: "soc2-2017" | "iso27001-2022" | "nist-800-53-rev5"
  ): Promise<string> {
    return this.runTask(
      `Import the ${frameworkId} compliance framework into the organization and list all controls that were added.`
    );
  }

  async assessVendorSecurity(vendorName: string, websiteUrl: string): Promise<string> {
    return this.runTask(
      `Add a new vendor named "${vendorName}" with website ${websiteUrl}, then trigger an AI security assessment of the vendor.`
    );
  }

  async generateRiskAssessment(context: string): Promise<string> {
    return this.runTask(
      `Based on the following context, identify and create appropriate risks in the risk register with likelihood/impact scores and treatment strategies:\n\n${context}`
    );
  }

  async createComplianceDocument(
    title: string,
    documentType: string,
    requirements: string
  ): Promise<string> {
    return this.runTask(
      `Create a compliance document titled "${title}" of type ${documentType}. Requirements:\n${requirements}`
    );
  }
}
