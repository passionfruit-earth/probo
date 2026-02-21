# Probo Compliance Agent

Autonomous compliance automation layer that sits on top of the Probo platform.

## Architecture

```
┌─────────────────────────────────────────┐
│         Compliance Agent (this)         │
│  • AI-powered compliance automation     │
│  • Framework import from official src   │
│  • Risk assessment generation           │
│  • Vendor security analysis             │
└─────────────────────────────────────────┘
                    │
                    │ GraphQL API
                    ▼
┌─────────────────────────────────────────┐
│              Probo Platform             │
│  (kept as-is, updated independently)    │
└─────────────────────────────────────────┘
```

## Content Sources

Instead of maintaining our own compliance content, we integrate with audited sources:

| Source | Content | Quality |
|--------|---------|---------|
| [NIST OSCAL](https://github.com/usnistgov/oscal-content) | NIST 800-53 Rev 5 controls | Official government source |
| [Secure Controls Framework](https://securecontrolsframework.com/) | 578 controls mapped to 100+ frameworks | Industry meta-framework |
| [StrongDM Comply](https://github.com/strongdm/comply) | 24 SOC2 policy templates | Open source, auditor-approved |

## Setup

```bash
# Install dependencies
npm install

# Copy and configure environment
cp .env.example .env
# Edit .env with your keys

# Run the agent
npm run dev
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `ANTHROPIC_API_KEY` | Your Anthropic API key for Claude |
| `PROBO_ENDPOINT` | Probo GraphQL endpoint (default: `http://localhost:8080/graphql`) |
| `PROBO_API_KEY` | API key from Probo console |
| `PROBO_ORGANIZATION_ID` | Organization ID from Probo console URL |

## Usage

### Interactive Mode

```bash
npm run dev
```

This starts an interactive CLI where you can:
- Import compliance frameworks
- Add and assess vendors
- Generate risk assessments
- Create compliance documents
- Ask compliance questions

### Commands

- `/frameworks` - List available frameworks to import
- `/vendor` - Add and assess a vendor
- `/risks` - Generate risk assessment
- `/clear` - Clear conversation history
- `/exit` - Exit the agent

### Programmatic Usage

```typescript
import { ComplianceAgent } from "@probo/agent";

const agent = new ComplianceAgent({
  anthropicApiKey: process.env.ANTHROPIC_API_KEY,
  proboEndpoint: "http://localhost:8080/graphql",
  proboApiKey: process.env.PROBO_API_KEY,
  organizationId: "your-org-id",
});

// Import a framework
await agent.setupComplianceFramework("soc2-2017");

// Assess a vendor
await agent.assessVendorSecurity("Stripe", "https://stripe.com");

// Generate risks based on context
await agent.generateRiskAssessment(
  "We are a SaaS company handling healthcare data on AWS"
);

// Interactive chat
const response = await agent.chat("What controls do we need for SOC2 security?");
```

## Available Frameworks

| ID | Name | Source |
|----|------|--------|
| `nist-800-53-rev5` | NIST SP 800-53 Rev 5 | Official NIST OSCAL repository |
| `soc2-2017` | SOC 2 Type II | Based on AICPA TSC 2017 |
| `iso27001-2022` | ISO/IEC 27001:2022 | Based on ISO standard |

## Documentation

| Document | Purpose |
|----------|---------|
| [Architecture](docs/ARCHITECTURE.md) | System design and component overview |
| [Agent Instructions](docs/AGENT_INSTRUCTIONS.md) | How the AI agent should behave |
| [Content Sources](docs/CONTENT_SOURCES.md) | Official compliance content sources we use |

## Development

```bash
# Type check
npm run check

# Build
npm run build

# Generate GraphQL types (if schema changes)
npm run codegen
```
