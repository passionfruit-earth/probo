#!/bin/bash
# Create Remote Working Policy in Probo (ISO 27001 Control A.6.7)

API_URL="http://localhost:8080/api/console/v1/graphql"
API_KEY="AAAAAAAAAAAAKwAAAZx_79LvST3o4WQK.JSOS2BKLmwlhZlO1TtejLgC69hJO8eeIbkbgHzo_h7w"
ORG_ID="2delmZUAAAEAAAAAAZx_7gpa_vVWYEaD"
APPROVER_ID="2delmZUAAAEAMwAAAZx_7gpd2SIz8U0x"

CONTENT='# Remote Working Policy

**Version:** 1.0
**Effective Date:** 2026-02-21
**Owner:** Information Security Lead
**Review Cycle:** Annual
**Classification:** Internal

---

## 1. Purpose

This policy establishes security requirements for remote working at Passionfruit Earth B.V. to protect company information and systems when employees work outside traditional office environments.

## 2. Scope

This policy applies to:
- All employees working remotely (home office, co-working spaces, travel)
- Contractors and third parties with remote access to Passionfruit systems
- All devices used for remote work (company-provided and personal)

## 3. Remote Working Arrangements

### 3.1 Approved Work Locations

| Location Type | Allowed | Requirements |
|---------------|---------|--------------|
| Home office | Yes | Secure workspace, private network |
| Co-working spaces | Yes | Screen privacy, secure belongings |
| Public spaces (cafes, airports) | Limited | VPN required, no sensitive calls |
| Hotels | Yes | VPN required, secure room storage |
| International travel | Yes | Prior notification, country restrictions apply |

### 3.2 Location Security Requirements

Remote workers must ensure:
- Private workspace for confidential discussions
- Screen not visible to unauthorized persons
- Secure storage for devices when unattended
- No recording devices in video call vicinity

## 4. Device Security

### 4.1 Required Security Measures

All devices used for remote work must have:

| Control | Requirement | Verification |
|---------|-------------|--------------|
| Full disk encryption | Enabled (FileVault/BitLocker) | IT onboarding check |
| Screen lock | Auto-lock within 5 minutes | Device policy |
| Antivirus/EDR | Active and updated | Endpoint monitoring |
| Firewall | Enabled | Device policy |
| OS updates | Within 14 days of release | Patch monitoring |
| Password/biometric | Required for unlock | Device policy |

### 4.2 Device Handling

- Never leave devices unattended in public spaces
- Use laptop locks when appropriate
- Transport devices in secure, inconspicuous bags
- Report lost or stolen devices immediately (within 1 hour)

### 4.3 Personal Devices (BYOD)

Personal devices may be used for:
- Email and calendar access (via web or approved apps)
- Slack communication
- Read-only document access

Personal devices must NOT be used for:
- Storing customer data locally
- Source code development
- Administrative system access

## 5. Network Security

### 5.1 Network Requirements

| Network Type | Allowed | Additional Requirements |
|--------------|---------|------------------------|
| Home WiFi (WPA2/3) | Yes | Strong password, updated router |
| Corporate VPN | Yes | Preferred for sensitive work |
| Public WiFi | Limited | VPN mandatory |
| Mobile hotspot | Yes | Password protected |
| Open/unsecured WiFi | No | Never permitted |

### 5.2 VPN Usage

VPN is required when:
- Using public WiFi networks
- Accessing internal development systems
- Handling sensitive customer data
- Working from high-risk locations

### 5.3 Home Network Security

Employees should:
- Use WPA2 or WPA3 encryption
- Change default router passwords
- Keep router firmware updated
- Separate work devices from IoT devices (if possible)

## 6. Data Protection

### 6.1 Data Handling Rules

| Data Type | Local Storage | Transmission | Printing |
|-----------|---------------|--------------|----------|
| Customer data | No | Encrypted only | No |
| Source code | Git only | GitHub/approved | No |
| Internal docs | Cloud only | Approved channels | Limited |
| Public info | Allowed | Any | Allowed |

### 6.2 Clear Desk/Screen Policy

- Lock screen when stepping away (even briefly)
- Close sensitive documents/tabs when not in use
- Position screen away from windows/passersby
- Use privacy screens in public spaces
- Clear whiteboards/notes after sensitive discussions

### 6.3 Secure Disposal

- Shred physical documents containing sensitive info
- Use secure delete for local files (if permitted)
- Return devices through proper channels

## 7. Communication Security

### 7.1 Approved Communication Channels

| Purpose | Primary Tool | Alternative |
|---------|--------------|-------------|
| Team chat | Slack | Google Chat |
| Video calls | Google Meet | Slack Huddle |
| Email | Google Workspace | - |
| File sharing | Google Drive | Notion |
| Customer calls | Google Meet | - |

### 7.2 Confidential Discussions

When discussing sensitive matters:
- Use private rooms or spaces
- Verify participants before sharing screens
- Use headphones in shared spaces
- Avoid speaker phone in public
- Be aware of smart speakers/assistants

### 7.3 Video Conferencing

- Use virtual backgrounds when appropriate
- Mute when not speaking
- Verify meeting links are legitimate
- Do not record without consent

## 8. Access and Authentication

### 8.1 Authentication Requirements

- Multi-factor authentication (MFA) is mandatory for all systems
- Use Microsoft Entra SSO for supported applications
- Never share credentials or MFA tokens
- Report suspicious login attempts immediately

### 8.2 Session Management

- Log out of applications when finished
- Do not save passwords in browsers (use SSO)
- Clear browser data when using shared computers (discouraged)
- Review and revoke unused application access

## 9. Incident Reporting

### 9.1 Report Immediately

Report the following within 1 hour:
- Lost or stolen devices
- Suspected account compromise
- Phishing attempts
- Unauthorized access observations
- Security vulnerabilities discovered

### 9.2 Reporting Channels

- **Primary:** #security-incidents Slack channel
- **Email:** security@passionfruit.earth
- **Phone:** Contact manager directly for urgent issues

## 10. Co-Working Space Guidelines

When using co-working spaces:
- Use lockable storage for devices during breaks
- Position screens away from high-traffic areas
- Take devices with you when leaving
- Be cautious of tailgating into secure areas
- Do not discuss confidential matters in common areas
- Verify WiFi network names (avoid evil twin attacks)

## 11. International Travel

### 11.1 Pre-Travel Requirements

- Notify IT of travel plans (country, duration)
- Review country-specific security guidance
- Consider using a travel device for high-risk countries
- Ensure VPN access is confirmed

### 11.2 High-Risk Countries

For travel to countries with elevated cyber risk:
- Use minimal data devices
- Avoid connecting to local networks where possible
- Assume devices may be accessed/copied
- Report any device inspections or seizures

### 11.3 Border Crossing

- Devices may be subject to inspection
- Do not lie about device contents
- Consider having IT remotely wipe if required
- Report any forced access to IT immediately

## 12. Compliance and Monitoring

### 12.1 Monitoring

Passionfruit may monitor:
- Access logs for company systems
- Endpoint security status
- Network connections via company VPN

### 12.2 Audits

Random audits may verify:
- Device encryption status
- Security software installation
- Compliance with this policy

## 13. Policy Violations

Violations may result in:
- Additional security training
- Restricted access privileges
- Disciplinary action
- Termination (for serious or repeated violations)

## 14. Responsibilities

### 14.1 Employees

- Comply with this policy
- Complete security awareness training
- Report security incidents
- Maintain secure workspace

### 14.2 IT/Security

- Provide secure remote access tools
- Monitor for security issues
- Support remote workers
- Update policy as needed

### 14.3 Management

- Ensure team compliance
- Approve remote work arrangements
- Report security concerns

## 15. Document Control

| Version | Date | Author | Approved By | Changes |
|---------|------|--------|-------------|---------|
| 1.0 | 2026-02-21 | Information Security Lead | CEO | Initial version |

---

*This policy supports ISO 27001:2022 Control A.6.7 (Remote Working)*

**Approved by:** _________________________ (CEO/Managing Director)

**Date:** _________________________'

CONTENT_ESCAPED=$(echo "$CONTENT" | jq -Rs .)

echo "Creating Remote Working Policy in Probo..."

response=$(curl -s "$API_URL" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $API_KEY" \
  -d "{
    \"query\": \"mutation CreateDocument(\$input: CreateDocumentInput!) { createDocument(input: \$input) { documentEdge { node { id title } } } }\",
    \"variables\": {
      \"input\": {
        \"organizationId\": \"$ORG_ID\",
        \"title\": \"Remote Working Policy\",
        \"documentType\": \"POLICY\",
        \"classification\": \"INTERNAL\",
        \"approverIds\": [\"$APPROVER_ID\"],
        \"content\": $CONTENT_ESCAPED
      }
    }
  }")

if echo "$response" | grep -q '"id"'; then
  doc_id=$(echo "$response" | jq -r '.data.createDocument.documentEdge.node.id')
  echo "[OK] Created Remote Working Policy"
  echo "  Document ID: $doc_id"
else
  echo "[ERROR] Failed to create document"
  echo "$response"
fi
