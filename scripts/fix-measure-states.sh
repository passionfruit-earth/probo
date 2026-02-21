#!/bin/bash
# Fix incorrectly marked IMPLEMENTED measures based on AWS verification

API_URL="http://localhost:8080/api/console/v1/graphql"
API_KEY="AAAAAAAAAAAAKwAAAZx_79LvST3o4WQK.JSOS2BKLmwlhZlO1TtejLgC69hJO8eeIbkbgHzo_h7w"

update_measure() {
  local id="$1"
  local name="$2"
  local state="$3"

  local response=$(curl -s "$API_URL" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $API_KEY" \
    -d "{
      \"query\": \"mutation { updateMeasure(input: {id: \\\"$id\\\", state: $state}) { measure { id name state } } }\"
    }")

  if echo "$response" | grep -q "\"state\":\"$state\""; then
    echo "[OK] $name -> $state"
  else
    echo "[ERROR] $name"
    echo "  $response"
  fi
}

echo "Fixing measure states based on AWS verification results"
echo "========================================================"
echo ""

# AWS EU cloud hosting - RDS is public, no CloudTrail, S3 not encrypted
echo "AWS EU cloud hosting with security controls"
echo "  Issue: RDS publicly accessible, no CloudTrail, S3 not encrypted"
update_measure "2delmZUAAAEAAgAAAZyAxs5BzHjAw1WM" \
  "AWS EU cloud hosting with security controls" \
  "NOT_STARTED"

echo ""

# TLS/Encryption - RDS encrypted but S3 is not
echo "TLS 1.2+ in transit and AES-256 at rest encryption"
echo "  Issue: S3 buckets have no default encryption"
update_measure "2delmZUAAAEAAgAAAZyAxs2M5-M_2Lln" \
  "TLS 1.2+ in transit and AES-256 at rest encryption" \
  "IN_PROGRESS"

echo ""

# Backups - exist but only 1 day retention
echo "Automated database and storage backups"
echo "  Issue: RDS backup retention only 1 day (should be 7+)"
update_measure "2delmZUAAAEAAgAAAZyAxst5Ewr3GaJV" \
  "Automated database and storage backups" \
  "IN_PROGRESS"

echo ""

# Monitoring - CloudWatch exists but no CloudTrail/VPC flow logs
echo "CloudWatch and PostHog monitoring with error alerts"
echo "  Issue: No CloudTrail, no VPC flow logs for security monitoring"
update_measure "2delmZUAAAEAAgAAAZyAxszYcJYYmZLM" \
  "CloudWatch and PostHog monitoring with error alerts" \
  "IN_PROGRESS"

echo ""
echo "========================================================"
echo "Done. Measures now reflect actual AWS configuration state."
