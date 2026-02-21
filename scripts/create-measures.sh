#!/bin/bash

API_URL="http://localhost:8080/api/console/v1/graphql"
API_KEY="AAAAAAAAAAAAKwAAAZx_79LvST3o4WQK.JSOS2BKLmwlhZlO1TtejLgC69hJO8eeIbkbgHzo_h7w"
ORG_ID="2delmZUAAAEAAAAAAZx_7gpa_vVWYEaD"

create_and_link() {
  local name="$1"
  local description="$2"
  local category="$3"
  local control_id="$4"
  local state="$5"

  # Create measure
  local create_response=$(curl -s "$API_URL" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $API_KEY" \
    -d @- <<EOF
{
  "query": "mutation CreateMeasure(\$input: CreateMeasureInput!) { createMeasure(input: \$input) { measureEdge { node { id } } } }",
  "variables": {
    "input": {
      "organizationId": "$ORG_ID",
      "name": "$name",
      "description": "$description",
      "category": "$category"
    }
  }
}
EOF
)

  local measure_id=$(echo "$create_response" | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['createMeasure']['measureEdge']['node']['id'])" 2>/dev/null)

  if [ -z "$measure_id" ]; then
    echo "FAILED to create: $name"
    echo "$create_response"
    return 1
  fi

  # Link and update state
  curl -s "$API_URL" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $API_KEY" \
    -d @- <<EOF > /dev/null
{
  "query": "mutation { createControlMeasureMapping(input: {controlId: \"$control_id\", measureId: \"$measure_id\"}) { controlEdge { node { id } } } updateMeasure(input: {id: \"$measure_id\", state: $state}) { measure { id } } }"
}
EOF

  echo "OK: $name -> $control_id ($state)"
}

echo "Creating IMPLEMENTED measures..."

create_and_link \
  "Security awareness training program" \
  "All employees receive security training during onboarding with periodic refreshers." \
  "People" \
  "2delmZUAAAEADgAAAZyAAs3cAupXpNZU" \
  "IMPLEMENTED"

create_and_link \
  "SSO and MFA for all internal systems" \
  "Microsoft Entra SSO with multi-factor authentication is enforced for all internal systems access." \
  "Technical" \
  "2delmZUAAAEADgAAAZyAAs3m10_fnY4i" \
  "IMPLEMENTED"

create_and_link \
  "Formal offboarding checklist with access revocation" \
  "Documented offboarding process ensures all access rights are revoked when employees leave." \
  "Process" \
  "2delmZUAAAEADgAAAZyAAs3TS65V4QEC" \
  "IMPLEMENTED"

create_and_link \
  "Access termination procedures" \
  "All access is revoked upon termination or change of employment through formal offboarding process." \
  "Process" \
  "2delmZUAAAEADgAAAZyAAs3dZ2VD5Px7" \
  "IMPLEMENTED"

create_and_link \
  "Privileged access limited and logged" \
  "Privileged access to production systems is limited to specific personnel and all actions are logged." \
  "Technical" \
  "2delmZUAAAEADgAAAZyAAs3lUA2NJ7KI" \
  "IMPLEMENTED"

create_and_link \
  "PR reviews and CI/CD pipeline for all changes" \
  "All code changes require pull request review and pass through CI/CD pipeline before deployment." \
  "Process" \
  "2delmZUAAAEADgAAAZyAAs3yIOmU_1dY" \
  "IMPLEMENTED"

create_and_link \
  "Separate development, staging, and production environments" \
  "Development, staging, and production environments are separated with distinct access controls." \
  "Technical" \
  "2delmZUAAAEADgAAAZyAAs3yKYzWYg4e" \
  "IMPLEMENTED"

create_and_link \
  "Container vulnerability scanning via ECR" \
  "AWS ECR automatically scans container images for vulnerabilities before deployment." \
  "Technical" \
  "2delmZUAAAEADgAAAZyAAs3olm_iUeJW" \
  "IMPLEMENTED"

create_and_link \
  "Automated database and storage backups" \
  "RDS automated backups and S3 versioning ensure data is backed up continuously." \
  "Technical" \
  "2delmZUAAAEADgAAAZyAAs3qLt3A3gfG" \
  "IMPLEMENTED"

create_and_link \
  "Vendor inventory maintained" \
  "A list of third-party vendors and services is maintained for supplier management." \
  "Process" \
  "2delmZUAAAEADgAAAZyAAs3ToIhrp2tq" \
  "IMPLEMENTED"

create_and_link \
  "CloudWatch and PostHog monitoring with error alerts" \
  "Infrastructure is monitored via CloudWatch and PostHog with configured error alerts." \
  "Technical" \
  "2delmZUAAAEADgAAAZyAAs3sXPA6QLrg" \
  "IMPLEMENTED"

create_and_link \
  "TLS 1.2+ in transit and AES-256 at rest encryption" \
  "All data is encrypted using TLS 1.2+ during transit and AES-256 for storage at rest." \
  "Technical" \
  "2delmZUAAAEADgAAAZyAAs3vnbD3a7vI" \
  "IMPLEMENTED"

create_and_link \
  "AWS EU cloud hosting with security controls" \
  "Application hosted on AWS in EU data centers with DDoS protection and security services." \
  "Technical" \
  "2delmZUAAAEADgAAAZyAAs3Vc5MptubK" \
  "IMPLEMENTED"

create_and_link \
  "Customer data deletion on request" \
  "Customers can request full data deletion at any time, executed via support team." \
  "Process" \
  "2delmZUAAAEADgAAAZyAAs3pro47cHZP" \
  "IMPLEMENTED"

create_and_link \
  "Privacy policy and data processing agreement" \
  "Published privacy policy and DPA template ensure GDPR compliance and data protection." \
  "Policy" \
  "2delmZUAAAEADgAAAZyAAs3ZG-IzSWt8" \
  "IMPLEMENTED"

echo ""
echo "Creating NOT_STARTED measures (gaps)..."

create_and_link \
  "Incident response plan" \
  "Document formal incident response procedures including roles, communication, and escalation." \
  "Policy" \
  "2delmZUAAAEADgAAAZyAAs3VMOfBxo3r" \
  "NOT_STARTED"

create_and_link \
  "Security event assessment process" \
  "Define process for assessing and classifying security events." \
  "Process" \
  "2delmZUAAAEADgAAAZyAAs3WCEut7JQ6" \
  "NOT_STARTED"

create_and_link \
  "Incident response procedures" \
  "Document specific procedures for responding to security incidents." \
  "Process" \
  "2delmZUAAAEADgAAAZyAAs3Wie_ypoW_" \
  "NOT_STARTED"

create_and_link \
  "Post-incident review process" \
  "Define process for learning from security incidents and improving controls." \
  "Process" \
  "2delmZUAAAEADgAAAZyAAs3Xds3fEr2V" \
  "NOT_STARTED"

create_and_link \
  "Business continuity plan" \
  "Document plans for maintaining security during business disruptions." \
  "Policy" \
  "2delmZUAAAEADgAAAZyAAs3Yi8oFsghI" \
  "NOT_STARTED"

create_and_link \
  "ICT disaster recovery plan" \
  "Define ICT recovery procedures for business continuity." \
  "Policy" \
  "2delmZUAAAEADgAAAZyAAs3YJy_gnXa7" \
  "NOT_STARTED"

create_and_link \
  "Remote working security policy" \
  "Document security requirements for remote and co-working environments." \
  "Policy" \
  "2delmZUAAAEADgAAAZyAAs3eU86B4bqZ" \
  "NOT_STARTED"

create_and_link \
  "Endpoint device security policy" \
  "Document security requirements for laptops and user devices." \
  "Policy" \
  "2delmZUAAAEADgAAAZyAAs3llWmrAG8k" \
  "NOT_STARTED"

create_and_link \
  "Formal access review process" \
  "Establish periodic review of access rights to systems and data." \
  "Process" \
  "2delmZUAAAEADgAAAZyAAs3TS65V4QEC" \
  "NOT_STARTED"

create_and_link \
  "Vendor security assessment process" \
  "Document process for assessing vendor security before onboarding." \
  "Process" \
  "2delmZUAAAEADgAAAZyAAs3ToIhrp2tq" \
  "NOT_STARTED"

create_and_link \
  "Security monitoring and alerting" \
  "Implement security-specific alerts beyond error monitoring." \
  "Technical" \
  "2delmZUAAAEADgAAAZyAAs3sXPA6QLrg" \
  "NOT_STARTED"

create_and_link \
  "Backup restore testing" \
  "Establish regular testing of backup restoration procedures." \
  "Process" \
  "2delmZUAAAEADgAAAZyAAs3qLt3A3gfG" \
  "NOT_STARTED"

echo ""
echo "Done!"
