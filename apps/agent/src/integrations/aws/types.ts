// AWS types for compliance-relevant data

export interface AWSConfig {
  accessKeyId?: string;
  secretAccessKey?: string;
  region?: string;
  // Optional: assume role for cross-account access
  roleArn?: string;
}

// IAM Types
export interface IAMUser {
  UserName: string;
  UserId: string;
  Arn: string;
  CreateDate: Date;
  PasswordLastUsed?: Date;
  MFAEnabled: boolean;
  AccessKeys: IAMAccessKey[];
  Groups: string[];
  Policies: string[];
}

export interface IAMAccessKey {
  AccessKeyId: string;
  Status: "Active" | "Inactive";
  CreateDate: Date;
  LastUsedDate?: Date;
  LastUsedService?: string;
  LastUsedRegion?: string;
}

export interface IAMRole {
  RoleName: string;
  RoleId: string;
  Arn: string;
  CreateDate: Date;
  AssumeRolePolicyDocument: string;
  AttachedPolicies: string[];
}

export interface IAMPolicy {
  PolicyName: string;
  PolicyId: string;
  Arn: string;
  DefaultVersionId: string;
  AttachmentCount: number;
  IsAttachable: boolean;
  CreateDate: Date;
  UpdateDate: Date;
}

export interface PasswordPolicy {
  MinimumPasswordLength: number;
  RequireSymbols: boolean;
  RequireNumbers: boolean;
  RequireUppercaseCharacters: boolean;
  RequireLowercaseCharacters: boolean;
  AllowUsersToChangePassword: boolean;
  ExpirePasswords: boolean;
  MaxPasswordAge?: number;
  PasswordReusePrevention?: number;
  HardExpiry?: boolean;
}

// EC2/VPC Types
export interface SecurityGroup {
  GroupId: string;
  GroupName: string;
  Description: string;
  VpcId: string;
  InboundRules: SecurityGroupRule[];
  OutboundRules: SecurityGroupRule[];
}

export interface SecurityGroupRule {
  IpProtocol: string;
  FromPort?: number;
  ToPort?: number;
  IpRanges: string[]; // CIDR blocks
  Ipv6Ranges: string[];
  PrefixListIds: string[];
  SecurityGroups: string[]; // Referenced security group IDs
  Description?: string;
}

// CloudTrail Types
export interface CloudTrailTrail {
  Name: string;
  S3BucketName: string;
  IsMultiRegionTrail: boolean;
  IsOrganizationTrail: boolean;
  IncludeGlobalServiceEvents: boolean;
  IsLogging: boolean;
  LogFileValidationEnabled: boolean;
  KMSKeyId?: string;
  HasCustomEventSelectors: boolean;
  HomeRegion: string;
}

export interface CloudTrailStatus {
  IsLogging: boolean;
  LatestDeliveryTime?: Date;
  LatestDeliveryError?: string;
  StartLoggingTime?: Date;
  StopLoggingTime?: Date;
}

// S3 Types
export interface S3Bucket {
  Name: string;
  CreationDate: Date;
  Region?: string;
  IsPublic: boolean;
  Versioning: "Enabled" | "Suspended" | "Disabled";
  Encryption: "AES256" | "aws:kms" | "None";
  LoggingEnabled: boolean;
  BlockPublicAccess: {
    BlockPublicAcls: boolean;
    IgnorePublicAcls: boolean;
    BlockPublicPolicy: boolean;
    RestrictPublicBuckets: boolean;
  } | null;
}

// Account Info
export interface AWSAccountInfo {
  AccountId: string;
  Arn: string;
  UserId: string;
}

// Compliance Check Result
export interface AWSComplianceCheck {
  accountId: string;
  region: string;
  timestamp: string;
  checks: {
    iam: {
      rootMFAEnabled: boolean;
      passwordPolicyCompliant: boolean;
      usersWithMFA: number;
      usersWithoutMFA: number;
      accessKeysOlderThan90Days: number;
      unusedCredentials: number;
    };
    cloudTrail: {
      enabled: boolean;
      multiRegion: boolean;
      logFileValidation: boolean;
      encryptedWithKMS: boolean;
    };
    s3: {
      bucketsWithPublicAccess: number;
      bucketsWithoutEncryption: number;
      bucketsWithoutVersioning: number;
      bucketsWithoutLogging: number;
    };
    networking: {
      securityGroupsWithOpenSSH: number;
      securityGroupsWithOpenRDP: number;
      securityGroupsWithWideOpen: number;
    };
  };
  compliant: boolean;
  issues: string[];
  score: number;
}
