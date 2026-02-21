#!/bin/bash
# Update measures to IMPLEMENTED status in Probo

API_URL="http://localhost:8080/api/console/v1/graphql"
API_KEY="AAAAAAAAAAAAKwAAAZx_79LvST3o4WQK.JSOS2BKLmwlhZlO1TtejLgC69hJO8eeIbkbgHzo_h7w"

update_measure() {
  local id="$1"
  local name="$2"

  local response=$(curl -s "$API_URL" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $API_KEY" \
    -d "{
      \"query\": \"mutation { updateMeasure(input: {id: \\\"$id\\\", state: IMPLEMENTED}) { measure { id name state } } }\"
    }")

  if echo "$response" | grep -q "IMPLEMENTED"; then
    echo "✓ $name"
  else
    echo "✗ $name"
    echo "  $response"
  fi
}

echo "Updating measures to IMPLEMENTED..."
echo ""

# Incident Response measures (covered by Incident Response Plan document)
update_measure "2delmZUAAAEAAgAAAZyAxtBaB3roZS45" "Incident response plan"
update_measure "2delmZUAAAEAAgAAAZyAxtEVAmWQT-Br" "Security event assessment process"
update_measure "2delmZUAAAEAAgAAAZyAxtHM8FFVTcb_" "Incident response procedures"
update_measure "2delmZUAAAEAAgAAAZyAxtKAUwEg79Ov" "Post-incident review process"

# Business Continuity measures (covered by BCP document)
update_measure "2delmZUAAAEAAgAAAZyAxtNOG_9UVtq1" "Business continuity plan"
update_measure "2delmZUAAAEAAgAAAZyAxtQCrVPRM2i4" "ICT disaster recovery plan"

echo ""
echo "Done!"
