# Probo Agent Architecture

## Overview

The Probo Agent is an autonomous compliance automation layer that sits on top of the Probo platform. It communicates with Probo exclusively through its GraphQL API, keeping the two systems decoupled and independently updatable.

```
┌─────────────────────────────────────────────────────────────┐
│                    Probo Agent                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │   Claude    │  │   Tools     │  │  Content Library    │ │
│  │   (LLM)     │◄─┤  Executor   │◄─┤  • NIST OSCAL       │ │
│  │             │  │             │  │  • SOC2/ISO27001    │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
│         │                │                                  │
│         ▼                ▼                                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              GraphQL Client                          │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                           │
                           │ GraphQL over HTTPS
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    Probo Platform                           │
│  • Framework & Control management                           │
│  • Measure tracking                                         │
│  • Risk register                                            │
│  • Vendor management                                        │
│  • Document lifecycle                                       │
│  • Trust center                                             │
└─────────────────────────────────────────────────────────────┘
```

## Design Principles

### 1. Probo as Source of Truth
- All compliance data lives in Probo
- The agent never stores state locally
- Every action goes through Probo's API

### 2. Official Content Sources
- NIST 800-53: Fetched from official [NIST OSCAL repository](https://github.com/usnistgov/oscal-content)
- SOC2/ISO27001: Local definitions based on official standards
- Probo's mitigations.json: Pre-built measures with framework mappings

### 3. Decoupled Architecture
- Agent can be updated independently of Probo
- Probo can be updated without breaking the agent
- Communication only through stable GraphQL API

## Components

### GraphQL Client (`src/client/`)

Type-safe client for Probo's GraphQL API:

```typescript
const client = new ProboClient({
  endpoint: "http://localhost:8080/graphql",
  apiKey: "your-api-key"
});

// List frameworks
await client.listFrameworks(organizationId);

// Import a framework
await client.importFramework({
  organizationId,
  framework: SOC2_FRAMEWORK
});
```

### Content Library (`src/content/`)

Compliance framework definitions and official source integrations:

| File | Purpose |
|------|---------|
| `sources.ts` | Official content sources (NIST OSCAL, SCF references) |
| `index.ts` | Framework loader with fallback logic |
| `frameworks/soc2.ts` | SOC 2 Type II control definitions |
| `frameworks/iso27001.ts` | ISO 27001:2022 Annex A controls |

### AI Agent (`src/agents/`)

Claude-powered agent with tool use:

| File | Purpose |
|------|---------|
| `tools.ts` | Tool definitions for Anthropic API |
| `compliance-agent.ts` | Main agent with conversation loop |

## Data Flow

### Framework Import

```
1. User requests: "Import SOC2 framework"
2. Agent calls import_framework tool
3. Tool executor:
   - Loads SOC2_FRAMEWORK from content library
   - Calls client.importFramework()
4. GraphQL mutation sent to Probo
5. Probo creates framework + controls
6. Agent confirms to user
```

### NIST Framework Import

```
1. User requests: "Import NIST 800-53"
2. Agent calls import_framework tool
3. Tool executor:
   - Fetches from NIST OSCAL: https://github.com/usnistgov/oscal-content
   - Converts OSCAL JSON to Probo format
   - Calls client.importFramework()
4. GraphQL mutation sent to Probo
5. Agent confirms with control count
```

### Vendor Assessment

```
1. User requests: "Assess Stripe's security"
2. Agent calls create_vendor tool
3. Agent calls assess_vendor tool
4. Probo's built-in AI analyzes vendor website
5. Vendor record updated with findings
6. Agent summarizes assessment
```

## Security Considerations

### API Keys
- Anthropic API key: For Claude access
- Probo API key: Scoped to organization
- Never log or expose keys

### Data Handling
- Compliance data stays in Probo
- Agent only processes in-memory
- No local persistence of sensitive data

### Network
- All Probo communication over HTTPS in production
- GraphQL mutations are authenticated
- Rate limiting handled by Probo

## Extension Points

### Adding New Frameworks

1. Create definition in `src/content/frameworks/`
2. Add to `getFramework()` switch statement
3. Add to `listAvailableFrameworks()`
4. Update tool enum in `tools.ts`

### Adding New Tools

1. Define tool schema in `PROBO_TOOLS` array
2. Add case to `ToolExecutor.execute()`
3. Add corresponding method to `ProboClient` if needed

### Adding New Workflows

1. Add method to `ComplianceAgent` class
2. Compose using `runTask()` for autonomous execution
3. Or use `chat()` for interactive guidance
