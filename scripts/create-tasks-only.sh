#!/bin/bash
# Create tasks for existing measures

API_URL="http://localhost:8080/api/console/v1/graphql"
API_KEY="AAAAAAAAAAAAKwAAAZx_79LvST3o4WQK.JSOS2BKLmwlhZlO1TtejLgC69hJO8eeIbkbgHzo_h7w"
ORG_ID="2delmZUAAAEAAAAAAZx_7gpa_vVWYEaD"
OWNER_ID="2delmZUAAAEAMwAAAZx_7gpd2SIz8U0x"

# Measure IDs from previous run
MEASURE_RDS="2delmZUAAAEAAgAAAZyBWMV4JAlQhPGe"
MEASURE_CT="2delmZUAAAEAAgAAAZyBWMXAgB8xCVf-"
MEASURE_S3="2delmZUAAAEAAgAAAZyBWMXycoODgbXo"
MEASURE_RDS_BACKUP="2delmZUAAAEAAgAAAZyBWMZLLVvKFZCq"
MEASURE_VPC="2delmZUAAAEAAgAAAZyBWMakl_g8QLLM"
MEASURE_SG="2delmZUAAAEAAgAAAZyBWMbSYpp8Fk3B"

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
    echo "[OK] $name"
  else
    echo "[ERROR] $name"
    echo "  $response"
  fi
}

echo "Creating tasks..."
echo ""

# RDS Network Security tasks
echo "-- RDS Network Security --"
create_task "$MEASURE_RDS" \
  "Remove 0.0.0.0/0 rule from RDS security group" \
  "Security group sg-02f1ae335ba55665f allows all ports from any IP. Remove this rule and add specific IP ranges or security group references for ECS services only." \
  "2026-02-24T23:59:59Z"
create_task "$MEASURE_RDS" \
  "Set RDS PubliclyAccessible to false" \
  "Modify RDS instance passionfruit to set PubliclyAccessible=false. This removes the public DNS endpoint." \
  "2026-02-24T23:59:59Z"

# CloudTrail tasks
echo ""
echo "-- CloudTrail --"
create_task "$MEASURE_CT" \
  "Create multi-region CloudTrail trail" \
  "Create a CloudTrail trail with multi-region enabled. Configure to log to S3 bucket with encryption. Enable log file validation." \
  "2026-02-24T23:59:59Z"

# S3 tasks
echo ""
echo "-- S3 Encryption --"
create_task "$MEASURE_S3" \
  "Enable SSE-S3 encryption on all buckets" \
  "Enable default encryption on all 9 S3 buckets using SSE-S3 or SSE-KMS." \
  "2026-02-25T23:59:59Z"
create_task "$MEASURE_S3" \
  "Enable S3 versioning on critical buckets" \
  "Enable versioning on evidences-production and passionfruit-prod-files." \
  "2026-02-25T23:59:59Z"
create_task "$MEASURE_S3" \
  "Configure public access block on all buckets" \
  "Enable Block Public Access settings on all S3 buckets." \
  "2026-02-25T23:59:59Z"

# RDS Backup tasks
echo ""
echo "-- RDS Backup --"
create_task "$MEASURE_RDS_BACKUP" \
  "Increase RDS backup retention to 14 days" \
  "Modify RDS instance to set backup retention to 14 days minimum." \
  "2026-02-28T23:59:59Z"
create_task "$MEASURE_RDS_BACKUP" \
  "Enable RDS Multi-AZ deployment" \
  "Enable Multi-AZ on passionfruit RDS for automatic failover." \
  "2026-02-28T23:59:59Z"
create_task "$MEASURE_RDS_BACKUP" \
  "Enable RDS deletion protection" \
  "Enable deletion protection to prevent accidental deletion." \
  "2026-02-28T23:59:59Z"

# VPC tasks
echo ""
echo "-- VPC Flow Logs --"
create_task "$MEASURE_VPC" \
  "Enable VPC flow logs on production VPC" \
  "Enable flow logs to CloudWatch or S3 with appropriate retention." \
  "2026-02-28T23:59:59Z"

# Security group tasks
echo ""
echo "-- Security Groups --"
create_task "$MEASURE_SG" \
  "Audit and restrict launch-wizard security groups" \
  "Review launch-wizard-1 through launch-wizard-7. Delete unused, restrict active." \
  "2026-03-07T23:59:59Z"
create_task "$MEASURE_SG" \
  "Restrict application security groups" \
  "Review chat-api, keycloak, fruit-keycloak and restrict to specific IPs." \
  "2026-03-07T23:59:59Z"

echo ""
echo "Done!"
