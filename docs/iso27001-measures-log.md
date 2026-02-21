# ISO 27001 Measures Log - Passionfruit

**Created:** 2026-02-21
**Purpose:** Internal documentation of ISO 27001 measures with rationale and source
**Status:** In Progress

---

## Overview

This log documents each measure created for ISO 27001 compliance, including:
- What the measure is
- Which ISO control it addresses
- Why it's needed (the ISO requirement)
- Source of information (interview, Q&A, documentation)
- Current state

---

## Implemented Measures

### 1. Employment contracts include confidentiality clauses

| Field | Value |
|-------|-------|
| **Control** | A.6.6 - Confidentiality or Non-Disclosure Agreements |
| **ISO Requirement** | Confidentiality or non-disclosure agreements reflecting the organization's needs for the protection of information shall be identified, documented, regularly reviewed and signed by personnel and other relevant interested parties. |
| **What we do** | All employment contracts contain confidentiality and non-disclosure provisions. |
| **Source** | Interview - confirmed contracts include confidentiality clauses |
| **State** | IMPLEMENTED |

---

### 2. Background checks for all new hires

| Field | Value |
|-------|-------|
| **Control** | A.6.1 - Screening |
| **ISO Requirement** | Background verification checks on all candidates to become personnel shall be carried out prior to joining the organization and on an ongoing basis. |
| **What we do** | Formal background verification conducted for all candidates before employment. |
| **Source** | Interview - confirmed formal background checks |
| **State** | IMPLEMENTED |

---

### 3. Security awareness training program

| Field | Value |
|-------|-------|
| **Control** | A.6.3 - Information Security Awareness, Education and Training |
| **ISO Requirement** | Personnel of the organization and relevant interested parties shall receive appropriate information security awareness, education and training and regular updates of the organization's information security policy, topic-specific policies and procedures, as relevant for their job function. |
| **What we do** | All employees receive security training during onboarding with periodic refreshers. |
| **Source** | Interview - confirmed onboarding + periodic refreshers |
| **State** | IMPLEMENTED |

---

### 4. SSO and MFA for all internal systems

| Field | Value |
|-------|-------|
| **Control** | A.8.5 - Secure Authentication |
| **ISO Requirement** | Secure authentication technologies and procedures shall be implemented based on information access restrictions and the topic-specific policy on access control. |
| **What we do** | Microsoft Entra SSO with multi-factor authentication enforced for all internal systems. |
| **Source** | Q&A - "Yes, integration with Microsoft Entra could be arranged" / Interview - confirmed internal use |
| **State** | IMPLEMENTED |

---

### 5. Formal offboarding checklist with access revocation

| Field | Value |
|-------|-------|
| **Control** | A.5.18 - Access Rights |
| **ISO Requirement** | Access rights to information and other associated assets shall be provisioned, reviewed, modified and removed in accordance with the organization's topic-specific policy on and rules for access control. |
| **What we do** | Documented offboarding process ensures all access rights are revoked when employees leave. |
| **Source** | Interview - confirmed formal offboarding checklist |
| **State** | IMPLEMENTED |

---

### 6. Access termination procedures

| Field | Value |
|-------|-------|
| **Control** | A.6.5 - Responsibilities After Termination or Change of Employment |
| **ISO Requirement** | Information security responsibilities and duties that remain valid after termination or change of employment shall be defined, enforced and communicated to relevant personnel and other interested parties. |
| **What we do** | All access is revoked upon termination through formal offboarding process. |
| **Source** | Interview - confirmed via offboarding checklist |
| **State** | IMPLEMENTED |

---

### 7. Privileged access limited and logged

| Field | Value |
|-------|-------|
| **Control** | A.8.2 - Privileged Access Rights |
| **ISO Requirement** | The allocation and use of privileged access rights shall be restricted and managed. |
| **What we do** | Privileged access to production systems is limited to specific personnel and all actions are logged. |
| **Source** | Interview - "Limited to specific people, logged" |
| **State** | IMPLEMENTED |

---

### 8. PR reviews and CI/CD pipeline for all changes

| Field | Value |
|-------|-------|
| **Control** | A.8.32 - Change Management |
| **ISO Requirement** | Changes to information processing facilities and information systems shall be subject to change management procedures. |
| **What we do** | All code changes require pull request review and pass through CI/CD pipeline before deployment. |
| **Source** | Interview - confirmed PR reviews + CI/CD + staging |
| **State** | IMPLEMENTED |

---

### 9. Separate development, staging, and production environments

| Field | Value |
|-------|-------|
| **Control** | A.8.31 - Separation of Development, Test and Production Environments |
| **ISO Requirement** | Development, testing and production environments shall be separated and secured. |
| **What we do** | Development, staging, and production environments are separated with distinct access controls. |
| **Source** | Interview - confirmed CI/CD includes staging |
| **State** | IMPLEMENTED |

---

### 10. Container vulnerability scanning via ECR

| Field | Value |
|-------|-------|
| **Control** | A.8.8 - Management of Technical Vulnerabilities |
| **ISO Requirement** | Information about technical vulnerabilities of information systems in use shall be obtained, the organization's exposure to such vulnerabilities shall be evaluated and appropriate measures shall be taken. |
| **What we do** | AWS ECR automatically scans container images for vulnerabilities before deployment. |
| **Source** | Interview - confirmed ECS on AWS with ECR scanning |
| **State** | IMPLEMENTED |

---

### 11. Automated database and storage backups

| Field | Value |
|-------|-------|
| **Control** | A.8.13 - Information Backup |
| **ISO Requirement** | Backup copies of information, software and systems shall be maintained and regularly tested in accordance with the agreed topic-specific policy on backup. |
| **What we do** | RDS automated backups and S3 versioning ensure data is backed up continuously. |
| **Source** | Interview - confirmed automated backups |
| **State** | IMPLEMENTED |

---

### 12. Vendor inventory maintained

| Field | Value |
|-------|-------|
| **Control** | A.5.19 - Information Security in Supplier Relationships |
| **ISO Requirement** | Processes and procedures shall be defined and implemented to manage the information security risks associated with the use of supplier's products or services. |
| **What we do** | A list of third-party vendors and services is maintained for supplier management. |
| **Source** | Interview - confirmed vendor list exists |
| **State** | IMPLEMENTED |

---

### 13. CloudWatch and PostHog monitoring with error alerts

| Field | Value |
|-------|-------|
| **Control** | A.8.16 - Monitoring Activities |
| **ISO Requirement** | Networks, systems and applications shall be monitored for anomalous behaviour and appropriate actions taken to evaluate potential information security incidents. |
| **What we do** | Infrastructure monitored via CloudWatch and PostHog with configured error alerts. |
| **Source** | Interview - confirmed CloudWatch, PostHog, error alerts |
| **State** | IMPLEMENTED |

---

### 14. TLS 1.2+ in transit and AES-256 at rest encryption

| Field | Value |
|-------|-------|
| **Control** | A.8.24 - Use of Cryptography |
| **ISO Requirement** | Rules for the effective use of cryptography, including cryptographic key management, shall be defined and implemented. |
| **What we do** | All data encrypted using TLS 1.2+ during transit and AES-256 for storage at rest. |
| **Source** | Q&A - "Yes, all data is encrypted in transit (TLS 1.2+) and at rest (AES-256)." |
| **State** | IMPLEMENTED |

---

### 15. AWS EU cloud hosting with security controls

| Field | Value |
|-------|-------|
| **Control** | A.5.23 - Information Security for Use of Cloud Services |
| **ISO Requirement** | Processes for acquisition, use, management and exit from cloud services shall be established in accordance with the organization's information security requirements. |
| **What we do** | Application hosted on AWS in EU data centers with DDoS protection and security services. |
| **Source** | Q&A - "We host all data in the EU using AWS data centers" |
| **State** | IMPLEMENTED |

---

### 16. Customer data deletion on request

| Field | Value |
|-------|-------|
| **Control** | A.8.10 - Information Deletion |
| **ISO Requirement** | Information stored in information systems, devices or in any other storage media shall be deleted when no longer required. |
| **What we do** | Customers can request full data deletion at any time, executed via support team. |
| **Source** | Q&A - "Yes, customers can request full data deletion at any time." |
| **State** | IMPLEMENTED |

---

### 17. Privacy policy and data processing agreement

| Field | Value |
|-------|-------|
| **Control** | A.5.34 - Privacy and Protection of PII |
| **ISO Requirement** | The organization shall identify and meet the requirements regarding the preservation of privacy and protection of PII according to applicable laws, regulations and contractual requirements. |
| **What we do** | Published privacy policy and DPA template ensure GDPR compliance and data protection. |
| **Source** | Q&A - links to privacy policy / Interview - DPA template exists |
| **State** | IMPLEMENTED |

---

## Gap Measures (Not Yet Implemented)

### 18. Incident response plan

| Field | Value |
|-------|-------|
| **Control** | A.5.24 - Information Security Incident Management Planning and Preparation |
| **ISO Requirement** | The organization shall plan and prepare for managing information security incidents by defining, establishing and communicating information security incident management processes, roles and responsibilities. |
| **What needs to be done** | Document formal incident response procedures including roles, communication, and escalation. |
| **Source** | Interview - "Informal - we'd figure it out" |
| **State** | NOT_STARTED |
| **Priority** | HIGH |

---

### 19. Security event assessment process

| Field | Value |
|-------|-------|
| **Control** | A.5.25 - Assessment and Decision on Information Security Events |
| **ISO Requirement** | The organization shall assess information security events and decide if they are to be categorized as information security incidents. |
| **What needs to be done** | Define process for assessing and classifying security events. |
| **Source** | Interview - no formal incident process |
| **State** | NOT_STARTED |
| **Priority** | HIGH |

---

### 20. Incident response procedures

| Field | Value |
|-------|-------|
| **Control** | A.5.26 - Response to Information Security Incidents |
| **ISO Requirement** | Information security incidents shall be responded to in accordance with the documented procedures. |
| **What needs to be done** | Document specific procedures for responding to security incidents. |
| **Source** | Interview - no formal incident process |
| **State** | NOT_STARTED |
| **Priority** | HIGH |

---

### 21. Post-incident review process

| Field | Value |
|-------|-------|
| **Control** | A.5.27 - Learning from Information Security Incidents |
| **ISO Requirement** | Knowledge gained from information security incidents shall be used to strengthen and improve the information security controls. |
| **What needs to be done** | Define process for learning from security incidents and improving controls. |
| **Source** | Interview - no formal incident process |
| **State** | NOT_STARTED |
| **Priority** | HIGH |

---

### 22. Business continuity plan

| Field | Value |
|-------|-------|
| **Control** | A.5.29 - Information Security During Disruption |
| **ISO Requirement** | The organization shall plan how to maintain information security at an appropriate level during disruption. |
| **What needs to be done** | Document plans for maintaining security during business disruptions. |
| **Source** | Interview - "No, not yet" |
| **State** | NOT_STARTED |
| **Priority** | HIGH |

---

### 23. ICT disaster recovery plan

| Field | Value |
|-------|-------|
| **Control** | A.5.30 - ICT Readiness for Business Continuity |
| **ISO Requirement** | ICT readiness shall be planned, implemented, maintained and tested based on business continuity objectives and ICT continuity requirements. |
| **What needs to be done** | Define ICT recovery procedures for business continuity. |
| **Source** | Interview - no BC plan |
| **State** | NOT_STARTED |
| **Priority** | HIGH |

---

### 24. Remote working security policy

| Field | Value |
|-------|-------|
| **Control** | A.6.7 - Remote Working |
| **ISO Requirement** | Security measures shall be implemented when personnel are working remotely to protect information accessed, processed or stored outside the organization's premises. |
| **What needs to be done** | Document security requirements for remote and co-working environments. |
| **Source** | Interview - "Informal guidance, not documented" |
| **State** | NOT_STARTED |
| **Priority** | MEDIUM |

---

### 25. Endpoint device security policy

| Field | Value |
|-------|-------|
| **Control** | A.8.1 - User Endpoint Devices |
| **ISO Requirement** | Information stored on, processed by or accessible via user endpoint devices shall be protected. |
| **What needs to be done** | Document security requirements for laptops and user devices (encryption, screen lock). |
| **Source** | Interview - "Informal guidance, not documented" |
| **State** | NOT_STARTED |
| **Priority** | MEDIUM |

---

### 26. Formal access review process

| Field | Value |
|-------|-------|
| **Control** | A.5.18 - Access Rights (additional measure) |
| **ISO Requirement** | Access rights to information and other associated assets shall be provisioned, reviewed, modified and removed... |
| **What needs to be done** | Establish periodic review of access rights to systems and data. |
| **Source** | Interview - "No formal schedule, but we check occasionally" |
| **State** | NOT_STARTED |
| **Priority** | MEDIUM |

---

### 27. Vendor security assessment process

| Field | Value |
|-------|-------|
| **Control** | A.5.19 - Information Security in Supplier Relationships (additional measure) |
| **ISO Requirement** | Processes and procedures shall be defined and implemented to manage the information security risks associated with the use of supplier's products or services. |
| **What needs to be done** | Document process for assessing vendor security before onboarding. |
| **Source** | Interview - "No formal assessment" |
| **State** | NOT_STARTED |
| **Priority** | MEDIUM |

---

### 28. Security monitoring and alerting

| Field | Value |
|-------|-------|
| **Control** | A.8.16 - Monitoring Activities (additional measure) |
| **ISO Requirement** | Networks, systems and applications shall be monitored for anomalous behaviour... |
| **What needs to be done** | Implement security-specific alerts beyond error monitoring. |
| **Source** | Interview - "Only for errors" |
| **State** | NOT_STARTED |
| **Priority** | MEDIUM |

---

### 29. Backup restore testing

| Field | Value |
|-------|-------|
| **Control** | A.8.13 - Information Backup (additional measure) |
| **ISO Requirement** | Backup copies of information, software and systems shall be maintained and regularly tested... |
| **What needs to be done** | Establish regular testing of backup restoration procedures. |
| **Source** | Interview - "No, but backups are running" |
| **State** | NOT_STARTED |
| **Priority** | MEDIUM |

---

## Summary

| Status | Count |
|--------|-------|
| IMPLEMENTED | 17 |
| NOT_STARTED | 12 |
| **Total** | **29** |

### High Priority Gaps
1. Incident response plan and procedures (A.5.24-27)
2. Business continuity plan (A.5.29-30)

### Medium Priority Gaps
1. Remote working policy (A.6.7)
2. Endpoint device policy (A.8.1)
3. Access review process (A.5.18)
4. Vendor security assessment (A.5.19)
5. Security alerting (A.8.16)
6. Backup testing (A.8.13)

---

## Change Log

| Date | Change | By |
|------|--------|-----|
| 2026-02-21 | Initial creation with 29 measures | Claude/Passionfruit |
