#!/bin/bash
# Create AWS security remediation tasks in Probo

API_URL="http://localhost:8080/api/console/v1/graphql"
API_KEY="AAAAAAAAAAAAKwAAAZx_79LvST3o4WQK.JSOS2BKLmwlhZlO1TtejLgC69hJO8eeIbkbgHzo_h7w"
ORG_ID="2delmZUAAAEAAAAAAZx_7gpa_vVWYEaD"
OWNER_ID="2delmZUAAAEAMwAAAZx_7gpd2SIz8U0x"

# First, create measures for AWS security controls that need remediation
# Then create tasks under those measures

create_measure() {
  local name="$1"
  local description="$2"
  local category="$3"

  local response=$(curl -s "$API_URL" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $API_KEY" \
    -d "{
      \"query\": \"mutation CreateMeasure(\$input: CreateMeasureInput!) { createMeasure(input: \$input) { measureEdge { node { id name } } } }\",
      \"variables\": {
        \"input\": {
          \"organizationId\": \"$ORG_ID\",
          \"name\": \"$name\",
          \"description\": \"$description\",
          \"category\": \"$category\"
        }
      }
    }")

  local measure_id=$(echo "$response" | jq -r '.data.createMeasure.measureEdge.node.id // empty')

  if [ -n "$measure_id" ]; then
    echo "$measure_id"
  else
    echo "ERROR: $response" >&2
    echo ""
  fi
}

create_task() {
  local measure_id="$1"
  local name="$2"
  local description="$3"
  local deadline="$4"

  local response=$(curl -s "$API_URL" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $API_KEY" \
    -d "{
      \"query\": \"mutation CreateTask(\$input: CreateTaskInput!) { createTask(input: \$input) { taskEdge { node { id name } } } }\",
      \"variables\": {
        \"input\": {
          \"organizationId\": \"$ORG_ID\",
          \"measureId\": \"$measure_id\",
          \"name\": \"$name\",
          \"description\": \"$description\",
          \"assignedToId\": \"$OWNER_ID\",
          \"deadline\": \"$deadline\"
        }
      }
    }")

  if echo "$response" | jq -e '.data.createTask.taskEdge.node.id' > /dev/null 2>&1; then
    echo "[OK] Task: $name"
  else
    echo "[ERROR] Task: $name"
    echo "  $response"
  fi
}

echo "Creating AWS Security Remediation Measures and Tasks"
echo "====================================================="
echo ""

# CRITICAL: RDS publicly accessible
echo "Creating measure: RDS Network Security..."
MEASURE_RDS=$(create_measure \
  "RDS network security configuration" \
  "Configure RDS PostgreSQL instance to be private and restrict security group access. Current state: publicly accessible with 0.0.0.0/0 security group rule." \
  "Network" \
  )

if [ -n "$MEASURE_RDS" ] && [ "$MEASURE_RDS" != "ERROR:"* ]; then
  echo "[OK] Measure created: $MEASURE_RDS"
  create_task "$MEASURE_RDS" \
    "Remove 0.0.0.0/0 rule from RDS security group" \
    "Security group sg-02f1ae335ba55665f allows all ports from any IP. Remove this rule and add specific IP ranges or security group references for ECS services only." \
    "2026-02-24T23:59:59Z"
  create_task "$MEASURE_RDS" \
    "Set RDS PubliclyAccessible to false" \
    "Modify RDS instance passionfruit to set PubliclyAccessible=false. This removes the public DNS endpoint." \
    "2026-02-24T23:59:59Z"
else
  echo "[SKIP] RDS measure failed"
fi

echo ""

# CRITICAL: CloudTrail
echo "Creating measure: CloudTrail audit logging..."
MEASURE_CT=$(create_measure \
  "AWS CloudTrail audit logging" \
  "Enable CloudTrail for AWS API audit logging. Currently no trails are configured, meaning no audit trail of AWS actions." \
  "Logging" \
  )

if [ -n "$MEASURE_CT" ] && [ "$MEASURE_CT" != "ERROR:"* ]; then
  echo "[OK] Measure created: $MEASURE_CT"
  create_task "$MEASURE_CT" \
    "Create multi-region CloudTrail trail" \
    "Create a CloudTrail trail with multi-region enabled. Configure to log to S3 bucket with encryption. Enable log file validation." \
    "2026-02-24T23:59:59Z"
else
  echo "[SKIP] CloudTrail measure failed"
fi

echo ""

# CRITICAL: S3 encryption
echo "Creating measure: S3 default encryption..."
MEASURE_S3=$(create_measure \
  "S3 bucket encryption" \
  "Enable default encryption on all S3 buckets. Currently 9 buckets have no default encryption configured." \
  "Encryption" \
  )

if [ -n "$MEASURE_S3" ] && [ "$MEASURE_S3" != "ERROR:"* ]; then
  echo "[OK] Measure created: $MEASURE_S3"
  create_task "$MEASURE_S3" \
    "Enable SSE-S3 encryption on all buckets" \
    "Enable default encryption using SSE-S3 or SSE-KMS on: evidences-dev, evidences-production, passionfruit-billing-reports, passionfruit-database-dump, passionfruit-earth-bucket, passionfruit-extension-manifests, passionfruit-organization-images-dev, passionfruit-prod-files, passionfruit-prod-files-logs" \
    "2026-02-25T23:59:59Z"
  create_task "$MEASURE_S3" \
    "Enable S3 versioning on critical buckets" \
    "Enable versioning on evidences-production and passionfruit-prod-files buckets to allow recovery from accidental deletion." \
    "2026-02-25T23:59:59Z"
  create_task "$MEASURE_S3" \
    "Configure public access block on all buckets" \
    "Enable Block Public Access settings on all 9 S3 buckets to prevent accidental public exposure." \
    "2026-02-25T23:59:59Z"
else
  echo "[SKIP] S3 measure failed"
fi

echo ""

# HIGH: RDS backup and redundancy
echo "Creating measure: RDS backup and redundancy..."
MEASURE_RDS_BACKUP=$(create_measure \
  "RDS backup and high availability" \
  "Configure RDS for proper backup retention and high availability. Current backup retention is only 1 day and no Multi-AZ." \
  "Backup" \
  )

if [ -n "$MEASURE_RDS_BACKUP" ] && [ "$MEASURE_RDS_BACKUP" != "ERROR:"* ]; then
  echo "[OK] Measure created: $MEASURE_RDS_BACKUP"
  create_task "$MEASURE_RDS_BACKUP" \
    "Increase RDS backup retention to 14 days" \
    "Modify RDS instance to set backup retention period to 14 days (minimum 7 required for ISO 27001)." \
    "2026-02-28T23:59:59Z"
  create_task "$MEASURE_RDS_BACKUP" \
    "Enable RDS Multi-AZ deployment" \
    "Enable Multi-AZ on passionfruit RDS instance for automatic failover capability." \
    "2026-02-28T23:59:59Z"
  create_task "$MEASURE_RDS_BACKUP" \
    "Enable RDS deletion protection" \
    "Enable deletion protection to prevent accidental database deletion." \
    "2026-02-28T23:59:59Z"
else
  echo "[SKIP] RDS backup measure failed"
fi

echo ""

# HIGH: VPC flow logs
echo "Creating measure: VPC flow logs..."
MEASURE_VPC=$(create_measure \
  "VPC flow logs for network monitoring" \
  "Enable VPC flow logs for network traffic monitoring and anomaly detection. Currently no flow logs configured on any VPC." \
  "Monitoring" \
  )

if [ -n "$MEASURE_VPC" ] && [ "$MEASURE_VPC" != "ERROR:"* ]; then
  echo "[OK] Measure created: $MEASURE_VPC"
  create_task "$MEASURE_VPC" \
    "Enable VPC flow logs on production VPC" \
    "Enable flow logs on production VPC to CloudWatch Logs or S3. Configure appropriate retention period." \
    "2026-02-28T23:59:59Z"
else
  echo "[SKIP] VPC measure failed"
fi

echo ""

# MEDIUM: Security group review
echo "Creating measure: Security group review..."
MEASURE_SG=$(create_measure \
  "Security group access review" \
  "Review and restrict security groups that allow 0.0.0.0/0 access. 13 security groups currently allow inbound from any IP." \
  "Network" \
  )

if [ -n "$MEASURE_SG" ] && [ "$MEASURE_SG" != "ERROR:"* ]; then
  echo "[OK] Measure created: $MEASURE_SG"
  create_task "$MEASURE_SG" \
    "Audit and restrict launch-wizard security groups" \
    "Review launch-wizard-1 through launch-wizard-7 security groups. Delete unused ones and restrict rules on active ones." \
    "2026-03-07T23:59:59Z"
  create_task "$MEASURE_SG" \
    "Restrict application security groups" \
    "Review chat-api, keycloak, fruit-keycloak security groups and restrict to specific IP ranges or security group references." \
    "2026-03-07T23:59:59Z"
else
  echo "[SKIP] Security group measure failed"
fi

echo ""
echo "====================================================="
echo "Done! Check Probo for created measures and tasks."
