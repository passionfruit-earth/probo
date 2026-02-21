---
description: "Update items in Probo (measures, risks, tasks, vendors)"
argument-hint: "<type> <id>"
---

# Probo Update

Update existing items in the Probo compliance platform.

## Available types:

| Type | Description |
|------|-------------|
| `measure` | Update measure state, name, description |
| `risk` | Update risk treatment, likelihood, impact |
| `task` | Update task state, deadline, assignee |
| `vendor` | Update vendor details |
| `document` | Update document metadata |

## Configuration:

```bash
API_URL="http://localhost:8080/api/console/v1/graphql"
API_KEY="<your-api-key>"
```

---

## Update Measure

```bash
curl -s "$API_URL" -H "Content-Type: application/json" -H "Authorization: Bearer $API_KEY" \
  -d '{"query": "mutation { updateMeasure(input: {id: \"MEASURE_ID\", state: IMPLEMENTED}) { measure { id name state } } }"}'
```

**Fields:**
- `id` (required): Measure ID
- `name` (optional): New name
- `description` (optional): New description
- `category` (optional): New category
- `state` (optional): NOT_STARTED | IN_PROGRESS | IMPLEMENTED | NOT_APPLICABLE

**States:**
- `NOT_STARTED` - Measure not yet implemented
- `IN_PROGRESS` - Currently being implemented
- `IMPLEMENTED` - Fully implemented and working
- `NOT_APPLICABLE` - Not relevant to organization

---

## Update Risk

```bash
curl -s "$API_URL" -H "Content-Type: application/json" -H "Authorization: Bearer $API_KEY" \
  -d '{"query": "mutation { updateRisk(input: {id: \"RISK_ID\", treatment: ACCEPTED, inherentLikelihood: 2, inherentImpact: 3}) { risk { id name treatment } } }"}'
```

**Fields:**
- `id` (required): Risk ID
- `name` (optional): New name
- `description` (optional): New description
- `treatment` (optional): MITIGATED | ACCEPTED | AVOIDED | TRANSFERRED
- `inherentLikelihood` (optional): 1-5
- `inherentImpact` (optional): 1-5
- `residualLikelihood` (optional): 1-5 (after controls)
- `residualImpact` (optional): 1-5 (after controls)

---

## Update Task

```bash
curl -s "$API_URL" -H "Content-Type: application/json" -H "Authorization: Bearer $API_KEY" \
  -d '{"query": "mutation { updateTask(input: {id: \"TASK_ID\", state: DONE}) { task { id name state } } }"}'
```

**Fields:**
- `id` (required): Task ID
- `name` (optional): New name
- `description` (optional): New description (plain text)
- `state` (optional): TODO | IN_PROGRESS | DONE
- `deadline` (optional): RFC3339 format
- `assigneeId` (optional): User ID

---

## Update Vendor

```bash
curl -s "$API_URL" -H "Content-Type: application/json" -H "Authorization: Bearer $API_KEY" \
  -d '{"query": "mutation { updateVendor(input: {id: \"VENDOR_ID\", description: \"New description\"}) { vendor { id name } } }"}'
```

**Fields:**
- `id` (required): Vendor ID
- `name` (optional): New name
- `description` (optional): New description
- `websiteUrl` (optional): New website URL

---

## Update Document

Documents use **versioning** for audit trail safety. You cannot directly edit published content.

### Update metadata only (safe)
```bash
curl -s "$API_URL" -H "Content-Type: application/json" -H "Authorization: Bearer $API_KEY" \
  -d '{"query": "mutation { updateDocument(input: {id: \"DOC_ID\", title: \"New title\"}) { document { id title } } }"}'
```

**Fields:**
- `id` (required): Document ID
- `title` (optional): New title
- `documentType` (optional): POLICY | PROCEDURE | GUIDELINE | STANDARD | RECORD | OTHER
- `description` (optional): Document description
- `classification` (optional): PUBLIC | INTERNAL | CONFIDENTIAL | RESTRICTED

### Update content (creates new version)

**Step 1:** Create a new draft version
```bash
curl -s "$API_URL" -H "Content-Type: application/json" -H "Authorization: Bearer $API_KEY" \
  -d '{"query": "mutation { createDraftDocumentVersion(input: {documentId: \"DOC_ID\", content: \"# Updated Policy\\n\\nNew content here...\"}) { documentVersion { id version } } }"}'
```

**Step 2:** Publish the new version (requires confirmation)
```bash
curl -s "$API_URL" -H "Content-Type: application/json" -H "Authorization: Bearer $API_KEY" \
  -d '{"query": "mutation { publishDocumentVersion(input: {documentVersionId: \"VERSION_ID\"}) { documentVersion { id version } } }"}'
```

**Version workflow:**
1. Draft → can edit freely
2. Published → locked, creates audit trail
3. To update published → create new draft → publish

**Safety:** Always confirm with user before publishing. Published versions may require signatures.

---

## Common Workflows:

### Mark measure as implemented
```bash
updateMeasure(input: {id: "...", state: IMPLEMENTED})
```

### Close a task
```bash
updateTask(input: {id: "...", state: DONE})
```

### Accept a risk
```bash
updateRisk(input: {id: "...", treatment: ACCEPTED})
```

### Reassign a task
```bash
updateTask(input: {id: "...", assigneeId: "USER_ID"})
```

## Important:

- Use `probo-list` to find item IDs
- Always verify changes were applied
- Document reasons for state changes in scan logs
- **Documents:** Always create new version for content changes (audit trail)
- **Documents:** Confirm with user before publishing (may require signatures)
- **No deletes:** Use Probo UI for any deletions
