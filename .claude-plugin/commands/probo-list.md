---
description: "List items from Probo (measures, risks, vendors, tasks, controls, documents, frameworks, assets, audits, people)"
argument-hint: "<type>"
---

# Probo List

List items from the Probo compliance platform.

## Available types:

| Type | Description |
|------|-------------|
| `measures` | Security measures/mitigations |
| `risks` | Risk register entries |
| `vendors` | Third-party vendors |
| `tasks` | Remediation tasks |
| `controls` | Framework controls (ISO 27001) |
| `documents` | Policies and procedures |
| `frameworks` | Compliance frameworks |
| `assets` | Information assets |
| `audits` | Internal/external audits |
| `people` | Organization members |

## Configuration:

```bash
# Environment variables (check .env or apps/agent/.env)
PROBO_API_URL="http://localhost:8080/api/console/v1/graphql"
PROBO_API_KEY="your-api-key"
PROBO_ORG_ID="your-org-id"
```

## GraphQL Queries:

All queries use the `node` query with organization ID:

```bash
API_URL="http://localhost:8080/api/console/v1/graphql"
API_KEY="<your-api-key>"
ORG_ID="<your-org-id>"

# Generic query pattern
curl -s "$API_URL" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $API_KEY" \
  -d '{"query": "{ node(id: \"'$ORG_ID'\") { ... on Organization { <field> { edges { node { <fields> } } } } } }"}'
```

### Measures
```bash
curl -s "$API_URL" -H "Content-Type: application/json" -H "Authorization: Bearer $API_KEY" \
  -d '{"query": "{ node(id: \"'$ORG_ID'\") { ... on Organization { measures { edges { node { id name state category description } } } } } }"}'
```

### Risks
```bash
curl -s "$API_URL" -H "Content-Type: application/json" -H "Authorization: Bearer $API_KEY" \
  -d '{"query": "{ node(id: \"'$ORG_ID'\") { ... on Organization { risks { edges { node { id name treatment inherentLikelihood inherentImpact category } } } } } }"}'
```

### Vendors
```bash
curl -s "$API_URL" -H "Content-Type: application/json" -H "Authorization: Bearer $API_KEY" \
  -d '{"query": "{ node(id: \"'$ORG_ID'\") { ... on Organization { vendors { edges { node { id name websiteUrl description } } } } } }"}'
```

### Tasks
```bash
curl -s "$API_URL" -H "Content-Type: application/json" -H "Authorization: Bearer $API_KEY" \
  -d '{"query": "{ node(id: \"'$ORG_ID'\") { ... on Organization { tasks { edges { node { id name state deadline measure { name } } } } } } }"}'
```

### Controls
```bash
curl -s "$API_URL" -H "Content-Type: application/json" -H "Authorization: Bearer $API_KEY" \
  -d '{"query": "{ node(id: \"'$ORG_ID'\") { ... on Organization { controls { edges { node { id name referenceCode category framework { name } } } } } } }"}'
```

### Documents
```bash
curl -s "$API_URL" -H "Content-Type: application/json" -H "Authorization: Bearer $API_KEY" \
  -d '{"query": "{ node(id: \"'$ORG_ID'\") { ... on Organization { documents { edges { node { id title documentType state } } } } } }"}'
```

### Frameworks
```bash
curl -s "$API_URL" -H "Content-Type: application/json" -H "Authorization: Bearer $API_KEY" \
  -d '{"query": "{ node(id: \"'$ORG_ID'\") { ... on Organization { frameworks { edges { node { id name description } } } } } }"}'
```

### Assets
```bash
curl -s "$API_URL" -H "Content-Type: application/json" -H "Authorization: Bearer $API_KEY" \
  -d '{"query": "{ node(id: \"'$ORG_ID'\") { ... on Organization { assets { edges { node { id name assetType criticality } } } } } }"}'
```

### Audits
```bash
curl -s "$API_URL" -H "Content-Type: application/json" -H "Authorization: Bearer $API_KEY" \
  -d '{"query": "{ node(id: \"'$ORG_ID'\") { ... on Organization { audits { edges { node { id name auditType state startDate endDate } } } } } }"}'
```

### People (Organization Members)
```bash
curl -s "$API_URL" -H "Content-Type: application/json" -H "Authorization: Bearer $API_KEY" \
  -d '{"query": "{ node(id: \"'$ORG_ID'\") { ... on Organization { people { edges { node { id fullName email } } } } } }"}'
```

## Output format:

Display results in a table:
- ID, Name, State/Status, Category (for measures)
- ID, Name, Treatment, Likelihood x Impact (for risks)
- ID, Name, Website, Description (for vendors)
- ID, Name, State, Deadline, Linked Measure (for tasks)

## Important:

- This is READ-ONLY
- Use `probo-create` to add new items
- Use `probo-update` to modify existing items
- Use `probo-link` to create relationships
