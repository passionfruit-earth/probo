#!/bin/bash
# Update vendors in Probo with gathered security profiles
# Run: ./scripts/update-vendor-security.sh

API_URL="http://localhost:8080/api/console/v1/graphql"
API_KEY="AAAAAAAAAAAAKwAAAZx_79LvST3o4WQK.JSOS2BKLmwlhZlO1TtejLgC69hJO8eeIbkbgHzo_h7w"

MUTATION='mutation UpdateVendor($input: UpdateVendorInput!) { updateVendor(input: $input) { vendor { id name certifications securityPageUrl trustPageUrl } } }'

update_vendor() {
  local name="$1"
  local variables="$2"

  local response=$(curl -s "$API_URL" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $API_KEY" \
    -d "{\"query\": \"$MUTATION\", \"variables\": $variables}")

  if echo "$response" | grep -q '"certifications"'; then
    echo "✓ $name"
  else
    echo "✗ $name"
    echo "  $response" | head -c 200
    echo ""
  fi
}

echo "Updating vendors in Probo with security profiles..."
echo ""

# AWS
update_vendor "AWS" '{
  "input": {
    "id": "2delmZUAAAEABwAAAZyA0vU_zduKTKoE",
    "certifications": ["GDPR", "HIPAA", "PCI_DSS"],
    "securityPageUrl": "https://aws.amazon.com/security",
    "trustPageUrl": "https://aws.amazon.com/trust-center"
  }
}'

# Azure OpenAI
update_vendor "Azure OpenAI" '{
  "input": {
    "id": "2delmZUAAAEABwAAAZyA0vVc4WbOM5ah",
    "certifications": ["GDPR"],
    "securityPageUrl": "https://azure.microsoft.com/security"
  }
}'

# GitHub
update_vendor "GitHub" '{
  "input": {
    "id": "2delmZUAAAEABwAAAZyA0vV2gUjHG7eu",
    "certifications": ["SOC2_TYPE2", "GDPR"],
    "securityPageUrl": "https://github.com/security",
    "trustPageUrl": "https://github.com/trust"
  }
}'

# Linear
update_vendor "Linear" '{
  "input": {
    "id": "2delmZUAAAEABwAAAZyA0vWS4D8X-GPN",
    "certifications": ["SOC2_TYPE2", "ISO27001", "HIPAA", "GDPR"],
    "securityPageUrl": "https://linear.app/security",
    "dataProcessingAgreementUrl": "https://linear.app/dpa"
  }
}'

# PostHog
update_vendor "PostHog" '{
  "input": {
    "id": "2delmZUAAAEABwAAAZyA0vWslVo3xCbU",
    "trustPageUrl": "https://trust.vanta.com/posthog"
  }
}'

# Slack
update_vendor "Slack" '{
  "input": {
    "id": "2delmZUAAAEABwAAAZyA0vXI-muZD--I",
    "certifications": ["SOC2_TYPE2", "ISO27001", "ISO27701", "HIPAA", "GDPR"],
    "securityPageUrl": "https://slack.com/security",
    "trustPageUrl": "https://slack.com/trust",
    "dataProcessingAgreementUrl": "https://slack.com/trust/compliance/dpa"
  }
}'

# Google Workspace
update_vendor "Google Workspace" '{
  "input": {
    "id": "2delmZUAAAEABwAAAZyA0vXiOZfjsAZb",
    "certifications": ["HIPAA"],
    "securityPageUrl": "https://workspace.google.com/security"
  }
}'

# Microsoft 365
update_vendor "Microsoft 365" '{
  "input": {
    "id": "2delmZUAAAEABwAAAZyA0vYW2QBkQUYv",
    "certifications": ["GDPR"],
    "securityPageUrl": "https://www.microsoft.com/security",
    "trustPageUrl": "https://www.microsoft.com/trust-center"
  }
}'

# Notion
update_vendor "Notion" '{
  "input": {
    "id": "2delmZUAAAEABwAAAZyA0vYzes377LQU",
    "certifications": ["SOC2_TYPE2", "ISO27001", "ISO27701", "HIPAA", "GDPR"],
    "securityPageUrl": "https://notion.so/security",
    "trustPageUrl": "https://trust.vanta.com/notion"
  }
}'

# Fireflies
update_vendor "Fireflies" '{
  "input": {
    "id": "2delmZUAAAEABwAAAZyA0vZT7HHzSql5",
    "certifications": ["SOC2_TYPE2", "HIPAA", "GDPR"],
    "securityPageUrl": "https://fireflies.ai/security",
    "trustPageUrl": "https://trust.vanta.com/fireflies"
  }
}'

# Attio
update_vendor "Attio" '{
  "input": {
    "id": "2delmZUAAAEABwAAAZyA0vZwEG9xEd0J",
    "certifications": ["SOC2_TYPE2", "ISO27001", "GDPR"],
    "securityPageUrl": "https://attio.com/security",
    "trustPageUrl": "https://trust.vanta.com/attio"
  }
}'

# Unstructured
update_vendor "Unstructured" '{
  "input": {
    "id": "2delmZUAAAEABwAAAZyA0vaMdyvjwfPl",
    "certifications": ["SOC2_TYPE2", "ISO27001", "GDPR"],
    "trustPageUrl": "https://trust.vanta.com/unstructured"
  }
}'

echo ""
echo "Done!"
