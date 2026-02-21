#!/bin/bash

API_URL="http://localhost:8080/api/console/v1/graphql"
API_KEY="AAAAAAAAAAAAKwAAAZx_79LvST3o4WQK.JSOS2BKLmwlhZlO1TtejLgC69hJO8eeIbkbgHzo_h7w"
ORG_ID="2delmZUAAAEAAAAAAZx_7gpa_vVWYEaD"

create_vendor() {
  local name="$1"
  local description="$2"
  local category="$3"
  local website="$4"

  local response=$(curl -s "$API_URL" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $API_KEY" \
    -d @- <<EOF
{
  "query": "mutation CreateVendor(\$input: CreateVendorInput!) { createVendor(input: \$input) { vendorEdge { node { id name } } } }",
  "variables": {
    "input": {
      "organizationId": "$ORG_ID",
      "name": "$name",
      "description": "$description",
      "category": "$category",
      "websiteUrl": "$website"
    }
  }
}
EOF
)

  if echo "$response" | grep -q '"id"'; then
    echo "OK: $name ($category)"
  else
    echo "FAILED: $name - $response"
  fi
}

echo "Creating vendors..."

# Cloud Providers
create_vendor "AWS" "Hosting & Infrastructure - Critical vendor for application hosting in EU data centers" "CLOUD_PROVIDER" "https://aws.amazon.com"
create_vendor "Azure OpenAI" "AI Model Hosting - Critical vendor for LLM inference services" "CLOUD_PROVIDER" "https://azure.microsoft.com/en-us/products/ai-services/openai-service"

# Engineering
create_vendor "GitHub" "Code Repository - SSO enforced, high criticality" "ENGINEERING" "https://github.com"
create_vendor "Linear" "Issue tracker - High criticality for project management" "ENGINEERING" "https://linear.app"

# Analytics & Monitoring
create_vendor "PostHog" "Error monitoring & Analytics" "ANALYTICS" "https://posthog.com"

# Collaboration
create_vendor "Slack" "Internal communication platform - High criticality" "COLLABORATION" "https://slack.com"
create_vendor "Google Workspace" "Primary communication + storage - High criticality" "COLLABORATION" "https://workspace.google.com"
create_vendor "Google Meet" "Online meetings with clients - High criticality" "COLLABORATION" "https://meet.google.com"
create_vendor "Microsoft 365" "Online meetings with clients and SSO/MFA provider - High criticality" "COLLABORATION" "https://www.microsoft.com/microsoft-365"
create_vendor "Notion" "Internal documentation and knowledge base" "DOCUMENT_MANAGEMENT" "https://notion.so"
create_vendor "Fireflies" "Meeting logging and transcription - Low criticality" "COLLABORATION" "https://fireflies.ai"
create_vendor "Attio" "CRM - Medium criticality (Offboarded)" "COLLABORATION" "https://attio.com"

# Data Processing
create_vendor "Unstructured" "Document extraction - Medium criticality (Offboarded in Q2 2024)" "DATA_STORAGE_AND_PROCESSING" "https://unstructured.io"

# Contractors
create_vendor "4ClientsBV - Akmyrat Kadi" "Full stack contractor - NDA signed, high criticality" "ENGINEERING" ""

# Cloud Monitoring (Offboarded)
create_vendor "Sentry" "Error Monitoring - Slack alerts integrated (Offboarded, replaced by PostHog)" "CLOUD_MONITORING" "https://sentry.io"

echo ""
echo "Done! Created 15 vendors."
