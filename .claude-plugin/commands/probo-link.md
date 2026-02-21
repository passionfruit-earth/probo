---
description: "Link items in Probo (measure↔control, risk↔measure, control↔document)"
argument-hint: "<type>"
---

# Probo Link

Create relationships between items in Probo.

## Available link types:

| Link | Description |
|------|-------------|
| `control-measure` | Link measure to framework control |
| `risk-measure` | Link risk to mitigating measure |
| `control-document` | Link document to control as evidence |
| `risk-document` | Link document to risk |

## Configuration:

```bash
API_URL="http://localhost:8080/api/console/v1/graphql"
API_KEY="<your-api-key>"
```

---

## Link Control to Measure

Links a security measure to a framework control (e.g., ISO 27001).

```bash
curl -s "$API_URL" -H "Content-Type: application/json" -H "Authorization: Bearer $API_KEY" \
  -d '{"query": "mutation { createControlMeasureMapping(input: {controlId: \"CONTROL_ID\", measureId: \"MEASURE_ID\"}) { controlMeasureMapping { id } } }"}'
```

**Example:** Link "Branch Protection" measure to control A.8.25 (Secure development lifecycle)

---

## Link Risk to Measure

Links a risk to a measure that mitigates it.

```bash
curl -s "$API_URL" -H "Content-Type: application/json" -H "Authorization: Bearer $API_KEY" \
  -d '{"query": "mutation { createRiskMeasureMapping(input: {riskId: \"RISK_ID\", measureId: \"MEASURE_ID\"}) { riskMeasureMapping { id } } }"}'
```

**Example:** Link "Unauthorized code changes" risk to "Branch Protection" measure

---

## Link Control to Document

Links a document (policy, procedure) to a control as evidence.

```bash
curl -s "$API_URL" -H "Content-Type: application/json" -H "Authorization: Bearer $API_KEY" \
  -d '{"query": "mutation { createControlDocumentMapping(input: {controlId: \"CONTROL_ID\", documentId: \"DOCUMENT_ID\"}) { controlDocumentMapping { id } } }"}'
```

**Example:** Link "Information Security Policy" to control A.5.1

---

## Link Risk to Document

Links a document to a risk.

```bash
curl -s "$API_URL" -H "Content-Type: application/json" -H "Authorization: Bearer $API_KEY" \
  -d '{"query": "mutation { createRiskDocumentMapping(input: {riskId: \"RISK_ID\", documentId: \"DOCUMENT_ID\"}) { riskDocumentMapping { id } } }"}'
```

---

## Remove Links

### Remove Control-Measure link
```bash
curl -s "$API_URL" -H "Content-Type: application/json" -H "Authorization: Bearer $API_KEY" \
  -d '{"query": "mutation { deleteControlMeasureMapping(input: {id: \"MAPPING_ID\"}) { deletedId } }"}'
```

### Remove Risk-Measure link
```bash
curl -s "$API_URL" -H "Content-Type: application/json" -H "Authorization: Bearer $API_KEY" \
  -d '{"query": "mutation { deleteRiskMeasureMapping(input: {id: \"MAPPING_ID\"}) { deletedId } }"}'
```

---

## Common Workflows:

### After creating a measure from scan findings:
1. Use `probo-list controls` to find relevant control ID
2. Link measure to control: `createControlMeasureMapping`

### After identifying a risk:
1. Create or find mitigating measure
2. Link risk to measure: `createRiskMeasureMapping`

### Providing evidence for audit:
1. Upload/create document with evidence
2. Link document to control: `createControlDocumentMapping`

---

## Finding IDs:

Use `probo-list` to find IDs:

```bash
# Find control ID for A.8.25
probo-list controls | grep "A.8.25"

# Find measure ID
probo-list measures | grep "Branch Protection"
```

## ISO 27001 Control Examples:

| Control | Description | Common Measures |
|---------|-------------|-----------------|
| A.5.17 | Authentication | 2FA, SSO, password policy |
| A.8.4 | Access to source code | Branch protection, code review |
| A.8.8 | Vulnerability management | Dependabot, security scanning |
| A.8.25 | Secure development | SDLC, code review, testing |
| A.8.32 | Change management | CI/CD, deployment approval |

## Important:

- Always link measures to controls for audit trail
- Multiple measures can link to one control
- Multiple controls can link to one measure
- Links show compliance coverage in Probo dashboard
