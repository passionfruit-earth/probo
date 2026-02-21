---
description: "Create items in Probo (measures, risks, tasks, vendors, documents, assets, frameworks)"
argument-hint: "<type>"
---

# Probo Create

Create items in the Probo compliance platform.

## Available types:

| Type | Description |
|------|-------------|
| `measure` | Security measure/mitigation |
| `risk` | Risk register entry |
| `task` | Remediation task (linked to measure) |
| `vendor` | Third-party vendor |
| `document` | Policy or procedure |
| `asset` | Information asset |
| `framework` | Import compliance framework |

## Configuration:

```bash
API_URL="http://localhost:8080/api/console/v1/graphql"
API_KEY="<your-api-key>"
ORG_ID="<your-org-id>"
```

---

## Measure

```bash
curl -s "$API_URL" -H "Content-Type: application/json" -H "Authorization: Bearer $API_KEY" \
  -d '{"query": "mutation { createMeasure(input: {organizationId: \"'$ORG_ID'\", name: \"Measure name\", description: \"Description\", category: \"Category\"}) { measure { id name } } }"}'
```

**Fields:**
- `name` (required): Short descriptive name
- `description` (required): What the measure does
- `category` (required): Access Control, Security Operations, Data Protection, etc.

---

## Risk

```bash
curl -s "$API_URL" -H "Content-Type: application/json" -H "Authorization: Bearer $API_KEY" \
  -d '{"query": "mutation { createRisk(input: {organizationId: \"'$ORG_ID'\", name: \"Risk name\", description: \"Description\", treatment: MITIGATED, category: OPERATIONAL}) { risk { id name } } }"}'
```

**Fields:**
- `name` (required): Risk title
- `description` (required): Risk description
- `treatment` (required): MITIGATED | ACCEPTED | AVOIDED | TRANSFERRED
- `category` (required): OPERATIONAL | FINANCIAL | COMPLIANCE | STRATEGIC | REPUTATIONAL
- `inherentLikelihood` (optional): 1-5, default 3
- `inherentImpact` (optional): 1-5, default 3

---

## Task

```bash
curl -s "$API_URL" -H "Content-Type: application/json" -H "Authorization: Bearer $API_KEY" \
  -d '{"query": "mutation { createTask(input: {organizationId: \"'$ORG_ID'\", measureId: \"MEASURE_ID\", name: \"Task name\", description: \"Plain text description\", deadline: \"2026-02-28T23:59:59Z\"}) { taskEdge { node { id name } } } }"}'
```

**Fields:**
- `measureId` (required): Link to existing measure
- `name` (required): Task title
- `description` (required): Plain text (NO markdown)
- `deadline` (required): RFC3339 format (e.g., 2026-02-28T23:59:59Z)
- `assigneeId` (optional): User ID to assign task

---

## Vendor

```bash
curl -s "$API_URL" -H "Content-Type: application/json" -H "Authorization: Bearer $API_KEY" \
  -d '{"query": "mutation { createVendor(input: {organizationId: \"'$ORG_ID'\", name: \"Vendor name\", description: \"Description\", websiteUrl: \"https://vendor.com\"}) { vendorEdge { node { id name } } } }"}'
```

**Fields:**
- `name` (required): Vendor name
- `description` (optional): What the vendor provides
- `websiteUrl` (optional): Vendor website

---

## Document

```bash
curl -s "$API_URL" -H "Content-Type: application/json" -H "Authorization: Bearer $API_KEY" \
  -d '{"query": "mutation { createDocument(input: {organizationId: \"'$ORG_ID'\", title: \"Document title\", documentType: POLICY}) { document { id title } } }"}'
```

**Fields:**
- `title` (required): Document title
- `documentType` (required): POLICY | PROCEDURE | GUIDELINE | STANDARD | RECORD | OTHER

To add content, create a draft version after:
```bash
curl -s "$API_URL" -H "Content-Type: application/json" -H "Authorization: Bearer $API_KEY" \
  -d '{"query": "mutation { createDraftDocumentVersion(input: {documentId: \"DOC_ID\", content: \"Markdown content here\"}) { documentVersion { id } } }"}'
```

---

## Asset

```bash
curl -s "$API_URL" -H "Content-Type: application/json" -H "Authorization: Bearer $API_KEY" \
  -d '{"query": "mutation { createAsset(input: {organizationId: \"'$ORG_ID'\", name: \"Asset name\", assetType: APPLICATION, criticality: HIGH}) { asset { id name } } }"}'
```

**Fields:**
- `name` (required): Asset name
- `assetType` (required): APPLICATION | DATABASE | SERVER | NETWORK | DATA | PHYSICAL | OTHER
- `criticality` (required): LOW | MEDIUM | HIGH | CRITICAL
- `description` (optional): Asset description
- `ownerId` (optional): Owner user ID

---

## Framework (Import)

```bash
curl -s "$API_URL" -H "Content-Type: application/json" -H "Authorization: Bearer $API_KEY" \
  -d '{"query": "mutation { importFramework(input: {organizationId: \"'$ORG_ID'\", framework: {name: \"ISO 27001:2022\", description: \"Information Security\", controls: [...]}}) { framework { id name } } }"}'
```

Note: Framework import requires a full framework definition with controls. Usually done once during setup.

---

## Assess Vendor (AI)

Trigger Probo's AI assessment of a vendor:

```bash
curl -s "$API_URL" -H "Content-Type: application/json" -H "Authorization: Bearer $API_KEY" \
  -d '{"query": "mutation { assessVendor(input: {vendorId: \"VENDOR_ID\"}) { vendor { id name } } }"}'
```

---

## Workflow:

When creating from scan findings:
1. Find or create relevant measure
2. Link measure to ISO control(s) using `probo-link`
3. Create task for remediation
4. Set deadline (typically 3-7 days for high priority)

## Important:

- Task descriptions are PLAIN TEXT (no markdown)
- Deadlines must be RFC3339 format with timezone
- Always confirm with user before creating items
- Use `probo-list` to find existing items to link to
- Use `probo-update` to modify existing items
- Use `probo-link` to create relationships
