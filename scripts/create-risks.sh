#!/bin/bash
# Create risks in Probo for ISO 27001 risk assessment

API_URL="http://localhost:8080/api/console/v1/graphql"
API_KEY="AAAAAAAAAAAAKwAAAZx_79LvST3o4WQK.JSOS2BKLmwlhZlO1TtejLgC69hJO8eeIbkbgHzo_h7w"
ORG_ID="2delmZUAAAEAAAAAAZx_7gpa_vVWYEaD"
OWNER_ID="2delmZUAAAEAMwAAAZx_7gpd2SIz8U0x"

create_risk() {
  local name="$1"
  local description="$2"
  local category="$3"
  local treatment="$4"
  local inherent_likelihood="$5"
  local inherent_impact="$6"
  local residual_likelihood="$7"
  local residual_impact="$8"

  local response=$(curl -s "$API_URL" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $API_KEY" \
    -d "{
      \"query\": \"mutation CreateRisk(\$input: CreateRiskInput!) { createRisk(input: \$input) { riskEdge { node { id name } } } }\",
      \"variables\": {
        \"input\": {
          \"organizationId\": \"$ORG_ID\",
          \"name\": \"$name\",
          \"description\": \"$description\",
          \"category\": \"$category\",
          \"treatment\": \"$treatment\",
          \"ownerId\": \"$OWNER_ID\",
          \"inherentLikelihood\": $inherent_likelihood,
          \"inherentImpact\": $inherent_impact,
          \"residualLikelihood\": $residual_likelihood,
          \"residualImpact\": $residual_impact
        }
      }
    }")

  if echo "$response" | grep -q '"id"'; then
    echo "✓ $name"
  else
    echo "✗ $name"
    echo "  $response" | head -c 200
    echo ""
  fi
}

echo "Creating risks in Probo..."
echo ""

# Data & Privacy Risks
create_risk \
  "Unauthorized access to customer data" \
  "Attacker gains access to customer questionnaires, responses, or evidence documents through compromised credentials, application vulnerability, or misconfiguration." \
  "Data Security" \
  "MITIGATED" \
  3 4 2 3

create_risk \
  "Customer data loss" \
  "Permanent loss of customer data due to accidental deletion, database corruption, or failed backup restoration." \
  "Data Security" \
  "MITIGATED" \
  2 5 1 3

create_risk \
  "GDPR compliance violation" \
  "Failure to comply with GDPR requirements leading to regulatory fines, including improper data processing, missing DPAs, or inadequate data subject rights handling." \
  "Compliance" \
  "MITIGATED" \
  2 4 1 2

# Availability Risks
create_risk \
  "Service unavailability - AWS outage" \
  "Primary cloud provider (AWS EU) experiences extended outage causing complete service disruption for customers." \
  "Availability" \
  "ACCEPTED" \
  2 4 2 3

create_risk \
  "AI service unavailability" \
  "Azure OpenAI service becomes unavailable, preventing response generation functionality." \
  "Availability" \
  "MITIGATED" \
  3 3 2 2

# Security Threats
create_risk \
  "Ransomware or malware infection" \
  "Systems infected with ransomware or malware through phishing, compromised dependencies, or vulnerable software." \
  "Security" \
  "MITIGATED" \
  2 5 1 3

create_risk \
  "Supply chain attack" \
  "Compromise through vulnerable third-party dependencies, compromised npm packages, or malicious updates to software components." \
  "Security" \
  "MITIGATED" \
  2 4 1 2

create_risk \
  "Insider threat" \
  "Malicious or negligent actions by employees or contractors leading to data exposure or system compromise." \
  "Security" \
  "MITIGATED" \
  1 4 1 2

# Operational Risks
create_risk \
  "Loss of key personnel" \
  "Departure of critical team members with specialized knowledge affecting operations and development continuity." \
  "Operational" \
  "ACCEPTED" \
  3 3 2 2

create_risk \
  "Third-party vendor failure" \
  "Critical vendor (SSO provider, monitoring service, etc.) experiences security breach or service termination affecting operations." \
  "Operational" \
  "MITIGATED" \
  2 3 1 2

echo ""
echo "Done!"
