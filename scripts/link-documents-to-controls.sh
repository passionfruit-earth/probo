#!/bin/bash
# Link documents to controls in Probo

API_URL="http://localhost:8080/api/console/v1/graphql"
API_KEY="AAAAAAAAAAAAKwAAAZx_79LvST3o4WQK.JSOS2BKLmwlhZlO1TtejLgC69hJO8eeIbkbgHzo_h7w"

# Document IDs
IR_PLAN="2delmZUAAAEACgAAAZyBB92Ti1ha589s"
BCP="2delmZUAAAEACgAAAZyBCTbg73Nskffa"

# Control IDs (from iso27001-probo-reference.md)
# A.5.24 Information Security Incident Management Planning and Preparation
CONTROL_A524="2delmZUAAAEADgAAAZyAAs3VMOfBxo3r"
# A.5.25 Assessment and Decision on Information Security Events
CONTROL_A525="2delmZUAAAEADgAAAZyAAs3WCEut7JQ6"
# A.5.26 Response to Information Security Incidents
CONTROL_A526="2delmZUAAAEADgAAAZyAAs3Wie_ypoW_"
# A.5.27 Learning from Information Security Incidents
CONTROL_A527="2delmZUAAAEADgAAAZyAAs3Xds3fEr2V"
# A.5.28 Collection of Evidence
CONTROL_A528="2delmZUAAAEADgAAAZyAAs3XAwBzvXPf"
# A.5.29 Information Security During Disruption
CONTROL_A529="2delmZUAAAEADgAAAZyAAs3Yi8oFsghI"
# A.5.30 ICT Readiness for Business Continuity
CONTROL_A530="2delmZUAAAEADgAAAZyAAs3YJy_gnXa7"

link_doc_to_control() {
  local doc_id="$1"
  local control_id="$2"
  local control_name="$3"

  local response=$(curl -s "$API_URL" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $API_KEY" \
    -d "{
      \"query\": \"mutation { createControlDocumentMapping(input: {controlId: \\\"$control_id\\\", documentId: \\\"$doc_id\\\"}) { controlEdge { node { id } } documentEdge { node { id } } } }\"
    }")

  if echo "$response" | grep -q "documentEdge"; then
    echo "✓ Linked to $control_name"
  else
    echo "✗ $control_name - $response"
  fi
}

echo "Linking Incident Response Plan to controls..."
link_doc_to_control "$IR_PLAN" "$CONTROL_A524" "A.5.24"
link_doc_to_control "$IR_PLAN" "$CONTROL_A525" "A.5.25"
link_doc_to_control "$IR_PLAN" "$CONTROL_A526" "A.5.26"
link_doc_to_control "$IR_PLAN" "$CONTROL_A527" "A.5.27"
link_doc_to_control "$IR_PLAN" "$CONTROL_A528" "A.5.28"

echo ""
echo "Linking Business Continuity Plan to controls..."
link_doc_to_control "$BCP" "$CONTROL_A529" "A.5.29"
link_doc_to_control "$BCP" "$CONTROL_A530" "A.5.30"

echo ""
echo "Done!"
