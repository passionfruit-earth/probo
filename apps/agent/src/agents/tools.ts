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
];

// Tool executor - executes tool calls against Probo API
export class ToolExecutor {
  constructor(private client: ProboClient) {}

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
