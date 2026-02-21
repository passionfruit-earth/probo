// Google Workspace Admin SDK types for compliance-relevant data

export interface GoogleUser {
  id: string;
  primaryEmail: string;
  name: {
    fullName: string;
    givenName: string;
    familyName: string;
  };
  isAdmin: boolean;
  isDelegatedAdmin: boolean;
  suspended: boolean;
  archived: boolean;
  isEnrolledIn2Sv: boolean; // 2-Step Verification
  isEnforcedIn2Sv: boolean; // 2SV enforced by policy
  creationTime: string;
  lastLoginTime: string;
  orgUnitPath: string;
}

export interface GoogleOrgUnit {
  orgUnitId: string;
  orgUnitPath: string;
  name: string;
  description: string;
  parentOrgUnitPath: string;
}

export interface GoogleGroup {
  id: string;
  email: string;
  name: string;
  description: string;
  directMembersCount: string;
  adminCreated: boolean;
}

export interface GoogleDomain {
  domainName: string;
  isPrimary: boolean;
  verified: boolean;
  creationTime: string;
}

export interface GoogleMobileDevice {
  deviceId: string;
  email: string;
  model: string;
  os: string;
  status: string;
  lastSync: string;
  encryptionStatus: string;
}

export interface SecuritySettings {
  // Password policy (from Admin Console)
  passwordMinLength?: number;
  passwordRequireSymbols?: boolean;
  passwordRequireNumbers?: boolean;

  // 2SV settings
  twoStepVerificationEnforced?: boolean;
  twoStepVerificationEnrollmentGracePeriod?: number;

  // Session settings
  sessionDuration?: number;

  // Sharing settings
  externalSharingEnabled?: boolean;
  sharingWhitelist?: string[];
}

export interface ComplianceCheck {
  domain: string;
  checks: {
    users: {
      total: number;
      admins: number;
      suspended: number;
      with2FA: number;
      without2FA: number;
      enforced2FA: number;
      neverLoggedIn: number;
    };
    security: {
      twoFactorEnforced: boolean;
      externalSharingRestricted: boolean;
      mobileDevicesManaged: boolean;
    };
    access: {
      totalGroups: number;
      adminGroups: number;
    };
  };
  compliant: boolean;
  issues: string[];
}

export interface GoogleWorkspaceConfig {
  // Service account credentials
  serviceAccountEmail: string;
  serviceAccountKey: string; // JSON key file contents or path
  // Admin user to impersonate (required for domain-wide delegation)
  adminEmail: string;
  // Customer ID (can be "my_customer" for the account the admin belongs to)
  customerId?: string;
}
