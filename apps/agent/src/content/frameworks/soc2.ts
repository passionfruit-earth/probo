import type { FrameworkImport } from "../../client/index.js";

// SOC 2 framework definition for importing into Probo
// Note: Probo already has mitigations.json with measures that map to these controls
// This provides the actual control definitions for the importFramework mutation
export const SOC2_FRAMEWORK: FrameworkImport = {
  framework: {
    id: "soc2-2017",
    name: "SOC 2 Type II",
    controls: [
      // CC1 - Control Environment
      {
        id: "CC1.1",
        name: "CC1.1 - COSO Principle 1",
        description:
          "The entity demonstrates a commitment to integrity and ethical values.",
      },
      {
        id: "CC1.2",
        name: "CC1.2 - COSO Principle 2",
        description:
          "The board of directors demonstrates independence from management and exercises oversight of the development and performance of internal control.",
      },
      {
        id: "CC1.3",
        name: "CC1.3 - COSO Principle 3",
        description:
          "Management establishes, with board oversight, structures, reporting lines, and appropriate authorities and responsibilities in the pursuit of objectives.",
      },
      {
        id: "CC1.4",
        name: "CC1.4 - COSO Principle 4",
        description:
          "The entity demonstrates a commitment to attract, develop, and retain competent individuals in alignment with objectives.",
      },
      {
        id: "CC1.5",
        name: "CC1.5 - COSO Principle 5",
        description:
          "The entity holds individuals accountable for their internal control responsibilities in the pursuit of objectives.",
      },

      // CC2 - Communication and Information
      {
        id: "CC2.1",
        name: "CC2.1 - COSO Principle 13",
        description:
          "The entity obtains or generates and uses relevant, quality information to support the functioning of internal control.",
      },
      {
        id: "CC2.2",
        name: "CC2.2 - COSO Principle 14",
        description:
          "The entity internally communicates information, including objectives and responsibilities for internal control, necessary to support the functioning of internal control.",
      },
      {
        id: "CC2.3",
        name: "CC2.3 - COSO Principle 15",
        description:
          "The entity communicates with external parties regarding matters affecting the functioning of internal control.",
      },

      // CC3 - Risk Assessment
      {
        id: "CC3.1",
        name: "CC3.1 - COSO Principle 6",
        description:
          "The entity specifies objectives with sufficient clarity to enable the identification and assessment of risks relating to objectives.",
      },
      {
        id: "CC3.2",
        name: "CC3.2 - COSO Principle 7",
        description:
          "The entity identifies risks to the achievement of its objectives across the entity and analyzes risks as a basis for determining how the risks should be managed.",
      },
      {
        id: "CC3.3",
        name: "CC3.3 - COSO Principle 8",
        description:
          "The entity considers the potential for fraud in assessing risks to the achievement of objectives.",
      },
      {
        id: "CC3.4",
        name: "CC3.4 - COSO Principle 9",
        description:
          "The entity identifies and assesses changes that could significantly impact the system of internal control.",
      },

      // CC4 - Monitoring Activities
      {
        id: "CC4.1",
        name: "CC4.1 - COSO Principle 16",
        description:
          "The entity selects, develops, and performs ongoing and/or separate evaluations to ascertain whether the components of internal control are present and functioning.",
      },
      {
        id: "CC4.2",
        name: "CC4.2 - COSO Principle 17",
        description:
          "The entity evaluates and communicates internal control deficiencies in a timely manner to those parties responsible for taking corrective action, including senior management and the board of directors, as appropriate.",
      },

      // CC5 - Control Activities
      {
        id: "CC5.1",
        name: "CC5.1 - COSO Principle 10",
        description:
          "The entity selects and develops control activities that contribute to the mitigation of risks to the achievement of objectives to acceptable levels.",
      },
      {
        id: "CC5.2",
        name: "CC5.2 - COSO Principle 11",
        description:
          "The entity also selects and develops general control activities over technology to support the achievement of objectives.",
      },
      {
        id: "CC5.3",
        name: "CC5.3 - COSO Principle 12",
        description:
          "The entity deploys control activities through policies that establish what is expected and in procedures that put policies into action.",
      },

      // CC6 - Logical and Physical Access Controls
      {
        id: "CC6.1",
        name: "CC6.1 - Logical Access Security",
        description:
          "The entity implements logical access security software, infrastructure, and architectures over protected information assets to protect them from security events to meet the entity's objectives.",
      },
      {
        id: "CC6.2",
        name: "CC6.2 - Access Provisioning",
        description:
          "Prior to issuing system credentials and granting system access, the entity registers and authorizes new internal and external users whose access is administered by the entity.",
      },
      {
        id: "CC6.3",
        name: "CC6.3 - Access Removal",
        description:
          "The entity authorizes, modifies, or removes access to data, software, functions, and other protected information assets based on roles, responsibilities, or the system design and changes.",
      },
      {
        id: "CC6.4",
        name: "CC6.4 - Physical Access Restrictions",
        description:
          "The entity restricts physical access to facilities and protected information assets to authorized personnel to meet the entity's objectives.",
      },
      {
        id: "CC6.5",
        name: "CC6.5 - Asset Disposal",
        description:
          "The entity discontinues logical and physical protections over physical assets only after the ability to read or recover data and software from those assets has been diminished.",
      },
      {
        id: "CC6.6",
        name: "CC6.6 - External Threat Protection",
        description:
          "The entity implements logical access security measures to protect against threats from sources outside its system boundaries.",
      },
      {
        id: "CC6.7",
        name: "CC6.7 - Access Transmission Restriction",
        description:
          "The entity restricts the transmission, movement, and removal of information to authorized internal and external users and processes, and protects it during transmission.",
      },
      {
        id: "CC6.8",
        name: "CC6.8 - Malicious Software Prevention",
        description:
          "The entity implements controls to prevent or detect and act upon the introduction of unauthorized or malicious software.",
      },

      // CC7 - System Operations
      {
        id: "CC7.1",
        name: "CC7.1 - Security Event Detection",
        description:
          "To meet its objectives, the entity uses detection and monitoring procedures to identify changes to configurations that result in the introduction of new vulnerabilities.",
      },
      {
        id: "CC7.2",
        name: "CC7.2 - Security Event Monitoring",
        description:
          "The entity monitors system components and the operation of those components for anomalies that are indicative of malicious acts, natural disasters, and errors.",
      },
      {
        id: "CC7.3",
        name: "CC7.3 - Security Event Evaluation",
        description:
          "The entity evaluates security events to determine whether they could or have resulted in a failure of the entity to meet its objectives and, if so, takes action.",
      },
      {
        id: "CC7.4",
        name: "CC7.4 - Incident Response",
        description:
          "The entity responds to identified security incidents by executing a defined incident response program to understand, contain, remediate, and communicate security incidents.",
      },
      {
        id: "CC7.5",
        name: "CC7.5 - Incident Recovery",
        description:
          "The entity identifies, develops, and implements activities to recover from identified security incidents.",
      },

      // CC8 - Change Management
      {
        id: "CC8.1",
        name: "CC8.1 - Change Management",
        description:
          "The entity authorizes, designs, develops or acquires, configures, documents, tests, approves, and implements changes to infrastructure, data, software, and procedures.",
      },

      // CC9 - Risk Mitigation
      {
        id: "CC9.1",
        name: "CC9.1 - Risk Mitigation",
        description:
          "The entity identifies, selects, and develops risk mitigation activities for risks arising from potential business disruptions.",
      },
      {
        id: "CC9.2",
        name: "CC9.2 - Vendor Risk Management",
        description:
          "The entity assesses and manages risks associated with vendors and business partners.",
      },

      // A - Availability
      {
        id: "A1.1",
        name: "A1.1 - Capacity Management",
        description:
          "The entity maintains, monitors, and evaluates current processing capacity and use of system components to manage capacity demand.",
      },
      {
        id: "A1.2",
        name: "A1.2 - Environmental Protections",
        description:
          "The entity authorizes, designs, develops or acquires, implements, operates, approves, maintains, and monitors environmental protections, software, data backup processes, and recovery infrastructure.",
      },
      {
        id: "A1.3",
        name: "A1.3 - Recovery Testing",
        description:
          "The entity tests recovery plan procedures supporting system recovery to meet its objectives.",
      },

      // C - Confidentiality
      {
        id: "C1.1",
        name: "C1.1 - Confidential Information Identification",
        description:
          "The entity identifies and maintains confidential information to meet the entity's objectives related to confidentiality.",
      },
      {
        id: "C1.2",
        name: "C1.2 - Confidential Information Disposal",
        description:
          "The entity disposes of confidential information to meet the entity's objectives related to confidentiality.",
      },

      // PI - Processing Integrity
      {
        id: "PI1.1",
        name: "PI1.1 - Processing Completeness",
        description:
          "The entity obtains or generates, uses, and communicates relevant, quality information regarding the objectives related to processing, including definitions of data processed and product and service specifications.",
      },
      {
        id: "PI1.2",
        name: "PI1.2 - Processing Accuracy",
        description:
          "The entity implements policies and procedures over system inputs, including controls over completeness and accuracy.",
      },
      {
        id: "PI1.3",
        name: "PI1.3 - Processing Outputs",
        description:
          "The entity implements policies and procedures over system processing to ensure that the processing is complete, accurate, and timely.",
      },
      {
        id: "PI1.4",
        name: "PI1.4 - Processing Storage",
        description:
          "The entity implements policies and procedures to make available or deliver output completely, accurately, and timely in accordance with specifications.",
      },
      {
        id: "PI1.5",
        name: "PI1.5 - Processing Error Handling",
        description:
          "The entity implements policies and procedures to store inputs, items in processing, and outputs completely, accurately, and timely.",
      },

      // P - Privacy
      {
        id: "P1.1",
        name: "P1.1 - Privacy Notice",
        description:
          "The entity provides notice to data subjects about its privacy practices to meet the entity's objectives related to privacy.",
      },
      {
        id: "P2.1",
        name: "P2.1 - Consent",
        description:
          "The entity communicates choices available regarding the collection, use, retention, disclosure, and disposal of personal information.",
      },
      {
        id: "P3.1",
        name: "P3.1 - Collection",
        description:
          "Personal information is collected consistent with the entity's objectives related to privacy.",
      },
      {
        id: "P3.2",
        name: "P3.2 - Collection Limitation",
        description:
          "For information requiring explicit consent, the entity communicates the need for such consent.",
      },
      {
        id: "P4.1",
        name: "P4.1 - Use and Retention",
        description:
          "The entity limits the use of personal information to the purposes identified in the entity's objectives related to privacy.",
      },
      {
        id: "P4.2",
        name: "P4.2 - Retention",
        description:
          "The entity retains personal information consistent with the entity's objectives related to privacy.",
      },
      {
        id: "P4.3",
        name: "P4.3 - Disposal",
        description:
          "The entity securely disposes of personal information to meet the entity's objectives related to privacy.",
      },
      {
        id: "P5.1",
        name: "P5.1 - Access",
        description:
          "The entity grants identified and authenticated data subjects the ability to access their stored personal information.",
      },
      {
        id: "P5.2",
        name: "P5.2 - Correction",
        description:
          "The entity corrects, amends, or appends personal information based on information provided by data subjects.",
      },
      {
        id: "P6.1",
        name: "P6.1 - Disclosure",
        description:
          "The entity discloses personal information to third parties with the explicit consent of data subjects.",
      },
      {
        id: "P6.2",
        name: "P6.2 - Third-Party Disclosure",
        description:
          "The entity creates and retains a complete, accurate, and timely record of authorized disclosures of personal information.",
      },
      {
        id: "P6.3",
        name: "P6.3 - Unauthorized Disclosure",
        description:
          "The entity creates and retains a complete, accurate, and timely record of detected or reported unauthorized disclosures.",
      },
      {
        id: "P6.4",
        name: "P6.4 - Disclosure Correction",
        description:
          "The entity obtains privacy commitments from vendors and other third parties who have access to personal information.",
      },
      {
        id: "P6.5",
        name: "P6.5 - Disclosure Notification",
        description:
          "The entity obtains commitments from vendors and other third parties with access to personal information to notify the entity in the event of actual or suspected unauthorized disclosures.",
      },
      {
        id: "P6.6",
        name: "P6.6 - Third-Party Compliance",
        description:
          "The entity provides notification of breaches and incidents to affected data subjects, regulators, and others.",
      },
      {
        id: "P6.7",
        name: "P6.7 - Data Subject Notification",
        description:
          "The entity provides data subjects with an accounting of the personal information held and disclosed of requested.",
      },
      {
        id: "P7.1",
        name: "P7.1 - Quality",
        description:
          "The entity collects and maintains accurate, up-to-date, complete, and relevant personal information to meet the entity's objectives.",
      },
      {
        id: "P8.1",
        name: "P8.1 - Complaints",
        description:
          "The entity implements a process for receiving, addressing, resolving, and communicating the resolution of inquiries, complaints, and disputes.",
      },
    ],
  },
};

// Note: For measures/mitigations, use Probo's existing mitigations.json
// located at /data/mitigations.json - it already contains 65+ security
// measures with proper SOC2 and ISO27001 control mappings
