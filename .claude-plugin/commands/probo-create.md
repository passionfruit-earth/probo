---
description: "Create items in Probo (measures, risks, tasks, vendors)"
argument-hint: "<type: measure|risk|task|vendor>"
---

# Probo Create

Create items in the Probo compliance platform.

## Available types:

1. **measure** - Security measure/mitigation
2. **risk** - Risk register entry
3. **task** - Remediation task (linked to measure)
4. **vendor** - Third-party vendor

## Required fields:

### Measure
- name: Short descriptive name
- description: What the measure does
- category: Access Control, Security Operations, Data Protection, etc.

### Risk
- name: Risk title
- description: Risk description
- treatment: MITIGATED | ACCEPTED | AVOIDED | TRANSFERRED
- likelihood: 1-5 (optional, default 3)
- impact: 1-5 (optional, default 3)

### Task
- measureId: Link to existing measure
- name: Task title
- description: Plain text (no markdown)
- assignedToId: User ID (optional)
- deadline: RFC3339 format (e.g., 2026-02-28T23:59:59Z)

### Vendor
- name: Vendor name
- description: What the vendor provides (optional)
- websiteUrl: Vendor website (optional)

## How to create:

Use the Probo GraphQL API:

```bash
API_URL="http://localhost:8080/api/console/v1/graphql"
API_KEY="<your-api-key>"
ORG_ID="<your-org-id>"

# Create measure
curl -s "$API_URL" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $API_KEY" \
  -d '{"query": "mutation { createMeasure(input: {organizationId: \"'$ORG_ID'\", name: \"Measure name\", description: \"Description\", category: \"Category\"}) { measure { id name } } }"}'

# Create task (linked to measure)
curl -s "$API_URL" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $API_KEY" \
  -d '{"query": "mutation { createTask(input: {organizationId: \"'$ORG_ID'\", measureId: \"MEASURE_ID\", name: \"Task name\", description: \"Plain text description\", deadline: \"2026-02-28T23:59:59Z\"}) { taskEdge { node { id name } } } }"}'

# Create risk
curl -s "$API_URL" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $API_KEY" \
  -d '{"query": "mutation { createRisk(input: {organizationId: \"'$ORG_ID'\", name: \"Risk name\", description: \"Description\", treatment: MITIGATED, category: OPERATIONAL}) { risk { id name } } }"}'
```

## Workflow:

When creating from scan findings:
1. Find or create relevant measure
2. Link measure to ISO control(s)
3. Create task for remediation
4. Set deadline (typically 3-7 days for high priority)

## Important:

- Task descriptions are PLAIN TEXT (no markdown)
- Deadlines must be RFC3339 format with timezone
- Always confirm with user before creating items
- Use probo-list to find existing measures to link to
