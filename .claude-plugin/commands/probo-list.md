---
description: "List items from Probo (measures, risks, vendors, tasks)"
argument-hint: "<type: measures|risks|vendors|tasks|controls|documents>"
---

# Probo List

List items from the Probo compliance platform.

## Available types:

1. **measures** - Security measures/mitigations
2. **risks** - Risk register entries
3. **vendors** - Third-party vendors
4. **tasks** - Remediation tasks
5. **controls** - Framework controls (ISO 27001)
6. **documents** - Policies and procedures

## How to query:

Use the Probo GraphQL API:

```bash
API_URL="http://localhost:8080/api/console/v1/graphql"
API_KEY="<your-api-key>"
ORG_ID="<your-org-id>"

# List measures
curl -s "$API_URL" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $API_KEY" \
  -d '{"query": "query { organization(id: \"'$ORG_ID'\") { measures { edges { node { id name state category } } } } }"}'

# List risks
curl -s "$API_URL" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $API_KEY" \
  -d '{"query": "query { organization(id: \"'$ORG_ID'\") { risks { edges { node { id name treatment likelihood impact } } } } }"}'

# List vendors
curl -s "$API_URL" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $API_KEY" \
  -d '{"query": "query { organization(id: \"'$ORG_ID'\") { vendors { edges { node { id name assessmentStatus } } } } }"}'
```

## Output format:

Display results in a table format:
- ID, Name, Status/State, Category (for measures)
- ID, Name, Treatment, Likelihood x Impact = Risk Score (for risks)
- ID, Name, Assessment Status, Last Assessed (for vendors)

## Configuration:

Set these environment variables or check .env:
- PROBO_API_URL
- PROBO_API_KEY
- PROBO_ORG_ID

## Important:

- This is READ-ONLY
- Use probo-create to add new items
- Link findings from scans to existing measures
