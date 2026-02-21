import {
  IAMClient,
  ListUsersCommand,
  ListMFADevicesCommand,
  ListAccessKeysCommand,
  GetAccessKeyLastUsedCommand,
  ListGroupsForUserCommand,
  ListAttachedUserPoliciesCommand,
  GetAccountPasswordPolicyCommand,
  ListRolesCommand,
  ListAttachedRolePoliciesCommand,
  GetAccountSummaryCommand,
} from "@aws-sdk/client-iam";
import {
  EC2Client,
  DescribeSecurityGroupsCommand,
} from "@aws-sdk/client-ec2";
import {
  CloudTrailClient,
  DescribeTrailsCommand,
  GetTrailStatusCommand,
  type Trail,
} from "@aws-sdk/client-cloudtrail";
import {
  S3Client,
  ListBucketsCommand,
  GetBucketVersioningCommand,
  GetBucketEncryptionCommand,
  GetBucketLoggingCommand,
  GetPublicAccessBlockCommand,
  GetBucketLocationCommand,
} from "@aws-sdk/client-s3";
import {
  STSClient,
  GetCallerIdentityCommand,
} from "@aws-sdk/client-sts";
import type {
  AWSConfig,
  IAMUser,
  IAMAccessKey,
  IAMRole,
  PasswordPolicy,
  SecurityGroup,
  SecurityGroupRule,
  CloudTrailTrail,
  CloudTrailStatus,
  S3Bucket,
  AWSAccountInfo,
  AWSComplianceCheck,
} from "./types.js";

export class AWSClient {
  private iamClient: IAMClient;
  private ec2Client: EC2Client;
  private cloudTrailClient: CloudTrailClient;
  private s3Client: S3Client;
  private stsClient: STSClient;
  private config: AWSConfig;

  constructor(config: AWSConfig) {
    this.config = config;
    const clientConfig = {
      region: config.region || "us-east-1",
      credentials: config.accessKeyId && config.secretAccessKey
        ? {
            accessKeyId: config.accessKeyId,
            secretAccessKey: config.secretAccessKey,
          }
        : undefined, // Use default credential chain if not provided
    };

    this.iamClient = new IAMClient(clientConfig);
    this.ec2Client = new EC2Client(clientConfig);
    this.cloudTrailClient = new CloudTrailClient(clientConfig);
    this.s3Client = new S3Client(clientConfig);
    this.stsClient = new STSClient(clientConfig);
  }

  // Account Info
  async getAccountInfo(): Promise<AWSAccountInfo> {
    const command = new GetCallerIdentityCommand({});
    const response = await this.stsClient.send(command);
    return {
      AccountId: response.Account!,
      Arn: response.Arn!,
      UserId: response.UserId!,
    };
  }

  // IAM Operations
  async listUsers(): Promise<IAMUser[]> {
    const users: IAMUser[] = [];
    let marker: string | undefined;

    do {
      const command = new ListUsersCommand({ Marker: marker });
      const response = await this.iamClient.send(command);

      for (const user of response.Users || []) {
        const mfaDevices = await this.listMFADevices(user.UserName as string);
        const accessKeys = await this.listAccessKeys(user.UserName as string);
        const groups = await this.listUserGroups(user.UserName as string);
        const policies = await this.listUserPolicies(user.UserName as string);

        users.push({
          UserName: user.UserName!,
          UserId: user.UserId!,
          Arn: user.Arn!,
          CreateDate: user.CreateDate!,
          PasswordLastUsed: user.PasswordLastUsed,
          MFAEnabled: mfaDevices.length > 0,
          AccessKeys: accessKeys,
          Groups: groups,
          Policies: policies,
        });
      }

      marker = response.Marker;
    } while (marker);

    return users;
  }

  private async listMFADevices(userName: string): Promise<string[]> {
    try {
      const command = new ListMFADevicesCommand({ UserName: userName });
      const response = await this.iamClient.send(command);
      return (response.MFADevices || []).map((d: { SerialNumber?: string }) => d.SerialNumber!);
    } catch {
      return [];
    }
  }

  private async listAccessKeys(userName: string): Promise<IAMAccessKey[]> {
    try {
      const command = new ListAccessKeysCommand({ UserName: userName });
      const response = await this.iamClient.send(command);

      const keys: IAMAccessKey[] = [];
      for (const key of response.AccessKeyMetadata || []) {
        let lastUsed: { LastUsedDate?: Date; ServiceName?: string; Region?: string } = {};
        try {
          const lastUsedCmd = new GetAccessKeyLastUsedCommand({ AccessKeyId: key.AccessKeyId! });
          const lastUsedResp = await this.iamClient.send(lastUsedCmd);
          lastUsed = lastUsedResp.AccessKeyLastUsed || {};
        } catch {
          // Ignore errors getting last used info
        }

        keys.push({
          AccessKeyId: key.AccessKeyId!,
          Status: key.Status as "Active" | "Inactive",
          CreateDate: key.CreateDate!,
          LastUsedDate: lastUsed.LastUsedDate,
          LastUsedService: lastUsed.ServiceName,
          LastUsedRegion: lastUsed.Region,
        });
      }
      return keys;
    } catch {
      return [];
    }
  }

  private async listUserGroups(userName: string): Promise<string[]> {
    try {
      const command = new ListGroupsForUserCommand({ UserName: userName });
      const response = await this.iamClient.send(command);
      return (response.Groups || []).map((g: { GroupName?: string }) => g.GroupName!);
    } catch {
      return [];
    }
  }

  private async listUserPolicies(userName: string): Promise<string[]> {
    try {
      const command = new ListAttachedUserPoliciesCommand({ UserName: userName });
      const response = await this.iamClient.send(command);
      return (response.AttachedPolicies || []).map((p: { PolicyName?: string }) => p.PolicyName!);
    } catch {
      return [];
    }
  }

  async getPasswordPolicy(): Promise<PasswordPolicy | null> {
    try {
      const command = new GetAccountPasswordPolicyCommand({});
      const response = await this.iamClient.send(command);
      const policy = response.PasswordPolicy;
      if (!policy) return null;

      return {
        MinimumPasswordLength: policy.MinimumPasswordLength || 0,
        RequireSymbols: policy.RequireSymbols || false,
        RequireNumbers: policy.RequireNumbers || false,
        RequireUppercaseCharacters: policy.RequireUppercaseCharacters || false,
        RequireLowercaseCharacters: policy.RequireLowercaseCharacters || false,
        AllowUsersToChangePassword: policy.AllowUsersToChangePassword || false,
        ExpirePasswords: policy.ExpirePasswords || false,
        MaxPasswordAge: policy.MaxPasswordAge,
        PasswordReusePrevention: policy.PasswordReusePrevention,
        HardExpiry: policy.HardExpiry,
      };
    } catch (error: unknown) {
      if ((error as { name?: string }).name === "NoSuchEntityException") {
        return null; // No password policy configured
      }
      throw error;
    }
  }

  async getAccountSummary(): Promise<Record<string, number>> {
    const command = new GetAccountSummaryCommand({});
    const response = await this.iamClient.send(command);
    return response.SummaryMap || {};
  }

  async listRoles(): Promise<IAMRole[]> {
    const roles: IAMRole[] = [];
    let marker: string | undefined;

    do {
      const command = new ListRolesCommand({ Marker: marker });
      const response = await this.iamClient.send(command);

      for (const role of response.Roles || []) {
        const policies = await this.listRolePolicies(role.RoleName!);
        roles.push({
          RoleName: role.RoleName!,
          RoleId: role.RoleId!,
          Arn: role.Arn!,
          CreateDate: role.CreateDate!,
          AssumeRolePolicyDocument: decodeURIComponent(role.AssumeRolePolicyDocument || ""),
          AttachedPolicies: policies,
        });
      }

      marker = response.Marker;
    } while (marker);

    return roles;
  }

  private async listRolePolicies(roleName: string): Promise<string[]> {
    try {
      const command = new ListAttachedRolePoliciesCommand({ RoleName: roleName });
      const response = await this.iamClient.send(command);
      return (response.AttachedPolicies || []).map((p: { PolicyName?: string }) => p.PolicyName!);
    } catch {
      return [];
    }
  }

  // EC2/VPC Operations
  async listSecurityGroups(): Promise<SecurityGroup[]> {
    const groups: SecurityGroup[] = [];
    let nextToken: string | undefined;

    do {
      const command = new DescribeSecurityGroupsCommand({ NextToken: nextToken });
      const response = await this.ec2Client.send(command);

      for (const sg of response.SecurityGroups || []) {
        groups.push({
          GroupId: sg.GroupId!,
          GroupName: sg.GroupName!,
          Description: sg.Description || "",
          VpcId: sg.VpcId || "",
          InboundRules: (sg.IpPermissions || []).map(this.parseSecurityGroupRule),
          OutboundRules: (sg.IpPermissionsEgress || []).map(this.parseSecurityGroupRule),
        });
      }

      nextToken = response.NextToken;
    } while (nextToken);

    return groups;
  }

  private parseSecurityGroupRule(rule: {
    IpProtocol?: string;
    FromPort?: number;
    ToPort?: number;
    IpRanges?: Array<{ CidrIp?: string; Description?: string }>;
    Ipv6Ranges?: Array<{ CidrIpv6?: string }>;
    PrefixListIds?: Array<{ PrefixListId?: string }>;
    UserIdGroupPairs?: Array<{ GroupId?: string }>;
  }): SecurityGroupRule {
    return {
      IpProtocol: rule.IpProtocol || "",
      FromPort: rule.FromPort,
      ToPort: rule.ToPort,
      IpRanges: (rule.IpRanges || []).map(r => r.CidrIp!).filter(Boolean),
      Ipv6Ranges: (rule.Ipv6Ranges || []).map(r => r.CidrIpv6!).filter(Boolean),
      PrefixListIds: (rule.PrefixListIds || []).map(r => r.PrefixListId!).filter(Boolean),
      SecurityGroups: (rule.UserIdGroupPairs || []).map(r => r.GroupId!).filter(Boolean),
      Description: rule.IpRanges?.[0]?.Description,
    };
  }

  // CloudTrail Operations
  async listTrails(): Promise<CloudTrailTrail[]> {
    const command = new DescribeTrailsCommand({});
    const response = await this.cloudTrailClient.send(command);

    return (response.trailList || []).map((trail: Trail) => ({
      Name: trail.Name!,
      S3BucketName: trail.S3BucketName!,
      IsMultiRegionTrail: trail.IsMultiRegionTrail || false,
      IsOrganizationTrail: trail.IsOrganizationTrail || false,
      IncludeGlobalServiceEvents: trail.IncludeGlobalServiceEvents || false,
      IsLogging: false, // Will be updated by getTrailStatus
      LogFileValidationEnabled: trail.LogFileValidationEnabled || false,
      KMSKeyId: trail.KmsKeyId,
      HasCustomEventSelectors: trail.HasCustomEventSelectors || false,
      HomeRegion: trail.HomeRegion || this.config.region || "us-east-1",
    }));
  }

  async getTrailStatus(trailName: string): Promise<CloudTrailStatus> {
    const command = new GetTrailStatusCommand({ Name: trailName });
    const response = await this.cloudTrailClient.send(command);

    return {
      IsLogging: response.IsLogging || false,
      LatestDeliveryTime: response.LatestDeliveryTime,
      LatestDeliveryError: response.LatestDeliveryError,
      StartLoggingTime: response.StartLoggingTime,
      StopLoggingTime: response.StopLoggingTime,
    };
  }

  // S3 Operations
  async listBuckets(): Promise<S3Bucket[]> {
    const command = new ListBucketsCommand({});
    const response = await this.s3Client.send(command);
    const buckets: S3Bucket[] = [];

    for (const bucket of response.Buckets || []) {
      const bucketName = bucket.Name!;

      // Get bucket details - these can fail for various reasons (permissions, region)
      const [versioning, encryption, logging, publicAccess, location] = await Promise.all([
        this.getBucketVersioning(bucketName),
        this.getBucketEncryption(bucketName),
        this.getBucketLogging(bucketName),
        this.getBucketPublicAccessBlock(bucketName),
        this.getBucketLocation(bucketName),
      ]);

      buckets.push({
        Name: bucketName,
        CreationDate: bucket.CreationDate!,
        Region: location,
        IsPublic: !publicAccess || !this.isFullyBlocked(publicAccess),
        Versioning: versioning,
        Encryption: encryption,
        LoggingEnabled: logging,
        BlockPublicAccess: publicAccess,
      });
    }

    return buckets;
  }

  private async getBucketVersioning(bucketName: string): Promise<"Enabled" | "Suspended" | "Disabled"> {
    try {
      const command = new GetBucketVersioningCommand({ Bucket: bucketName });
      const response = await this.s3Client.send(command);
      if (response.Status === "Enabled") return "Enabled";
      if (response.Status === "Suspended") return "Suspended";
      return "Disabled";
    } catch {
      return "Disabled";
    }
  }

  private async getBucketEncryption(bucketName: string): Promise<"AES256" | "aws:kms" | "None"> {
    try {
      const command = new GetBucketEncryptionCommand({ Bucket: bucketName });
      const response = await this.s3Client.send(command);
      const rules = response.ServerSideEncryptionConfiguration?.Rules || [];
      for (const rule of rules) {
        const algo = rule.ApplyServerSideEncryptionByDefault?.SSEAlgorithm;
        if (algo === "aws:kms") return "aws:kms";
        if (algo === "AES256") return "AES256";
      }
      return "None";
    } catch {
      return "None";
    }
  }

  private async getBucketLogging(bucketName: string): Promise<boolean> {
    try {
      const command = new GetBucketLoggingCommand({ Bucket: bucketName });
      const response = await this.s3Client.send(command);
      return !!response.LoggingEnabled;
    } catch {
      return false;
    }
  }

  private async getBucketPublicAccessBlock(bucketName: string): Promise<S3Bucket["BlockPublicAccess"]> {
    try {
      const command = new GetPublicAccessBlockCommand({ Bucket: bucketName });
      const response = await this.s3Client.send(command);
      const config = response.PublicAccessBlockConfiguration;
      if (!config) return null;
      return {
        BlockPublicAcls: config.BlockPublicAcls || false,
        IgnorePublicAcls: config.IgnorePublicAcls || false,
        BlockPublicPolicy: config.BlockPublicPolicy || false,
        RestrictPublicBuckets: config.RestrictPublicBuckets || false,
      };
    } catch {
      return null;
    }
  }

  private async getBucketLocation(bucketName: string): Promise<string> {
    try {
      const command = new GetBucketLocationCommand({ Bucket: bucketName });
      const response = await this.s3Client.send(command);
      // Empty string or null means us-east-1
      return response.LocationConstraint || "us-east-1";
    } catch {
      return "unknown";
    }
  }

  private isFullyBlocked(config: S3Bucket["BlockPublicAccess"]): boolean {
    if (!config) return false;
    return (
      config.BlockPublicAcls &&
      config.IgnorePublicAcls &&
      config.BlockPublicPolicy &&
      config.RestrictPublicBuckets
    );
  }

  // Compliance Check
  async checkCompliance(): Promise<AWSComplianceCheck> {
    const accountInfo = await this.getAccountInfo();
    const issues: string[] = [];
    let score = 100;

    // IAM checks
    const users = await this.listUsers();
    const passwordPolicy = await this.getPasswordPolicy();
    const accountSummary = await this.getAccountSummary();

    const usersWithMFA = users.filter(u => u.MFAEnabled).length;
    const usersWithoutMFA = users.filter(u => !u.MFAEnabled).length;

    // Check for root MFA
    const rootMFAEnabled = accountSummary["AccountMFAEnabled"] === 1;
    if (!rootMFAEnabled) {
      issues.push("Root account MFA is not enabled");
      score -= 20;
    }

    // Check users without MFA
    if (usersWithoutMFA > 0) {
      issues.push(`${usersWithoutMFA} IAM user(s) do not have MFA enabled`);
      score -= Math.min(15, usersWithoutMFA * 3);
    }

    // Check password policy
    const passwordPolicyCompliant = this.isPasswordPolicyCompliant(passwordPolicy);
    if (!passwordPolicyCompliant) {
      issues.push("Password policy does not meet security requirements");
      score -= 10;
    }

    // Check access keys older than 90 days
    const now = new Date();
    const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    let oldAccessKeys = 0;
    let unusedCredentials = 0;

    for (const user of users) {
      for (const key of user.AccessKeys) {
        if (key.Status === "Active" && key.CreateDate < ninetyDaysAgo) {
          oldAccessKeys++;
        }
        // Check for unused credentials (no use in last 90 days)
        if (key.Status === "Active" && (!key.LastUsedDate || key.LastUsedDate < ninetyDaysAgo)) {
          unusedCredentials++;
        }
      }
    }

    if (oldAccessKeys > 0) {
      issues.push(`${oldAccessKeys} access key(s) are older than 90 days`);
      score -= Math.min(10, oldAccessKeys * 2);
    }

    if (unusedCredentials > 0) {
      issues.push(`${unusedCredentials} credential(s) have not been used in 90+ days`);
      score -= Math.min(5, unusedCredentials);
    }

    // CloudTrail checks
    const trails = await this.listTrails();
    let cloudTrailEnabled = false;
    let cloudTrailMultiRegion = false;
    let cloudTrailLogValidation = false;
    let cloudTrailEncrypted = false;

    for (const trail of trails) {
      try {
        const status = await this.getTrailStatus(trail.Name);
        if (status.IsLogging) {
          cloudTrailEnabled = true;
          if (trail.IsMultiRegionTrail) cloudTrailMultiRegion = true;
          if (trail.LogFileValidationEnabled) cloudTrailLogValidation = true;
          if (trail.KMSKeyId) cloudTrailEncrypted = true;
        }
      } catch {
        // Trail might be in different region
      }
    }

    if (!cloudTrailEnabled) {
      issues.push("CloudTrail is not enabled");
      score -= 15;
    } else {
      if (!cloudTrailMultiRegion) {
        issues.push("CloudTrail is not configured for multi-region");
        score -= 5;
      }
      if (!cloudTrailLogValidation) {
        issues.push("CloudTrail log file validation is not enabled");
        score -= 5;
      }
      if (!cloudTrailEncrypted) {
        issues.push("CloudTrail logs are not encrypted with KMS");
        score -= 5;
      }
    }

    // S3 checks
    const buckets = await this.listBuckets();
    const bucketsWithPublicAccess = buckets.filter(b => b.IsPublic).length;
    const bucketsWithoutEncryption = buckets.filter(b => b.Encryption === "None").length;
    const bucketsWithoutVersioning = buckets.filter(b => b.Versioning === "Disabled").length;
    const bucketsWithoutLogging = buckets.filter(b => !b.LoggingEnabled).length;

    if (bucketsWithPublicAccess > 0) {
      issues.push(`${bucketsWithPublicAccess} S3 bucket(s) may have public access`);
      score -= Math.min(15, bucketsWithPublicAccess * 5);
    }

    if (bucketsWithoutEncryption > 0) {
      issues.push(`${bucketsWithoutEncryption} S3 bucket(s) do not have encryption enabled`);
      score -= Math.min(10, bucketsWithoutEncryption * 2);
    }

    // Security Group checks
    const securityGroups = await this.listSecurityGroups();
    let openSSH = 0;
    let openRDP = 0;
    let wideOpen = 0;

    for (const sg of securityGroups) {
      for (const rule of sg.InboundRules) {
        const hasOpenCidr = rule.IpRanges.includes("0.0.0.0/0") ||
                           rule.Ipv6Ranges.includes("::/0");

        if (hasOpenCidr) {
          if (rule.FromPort === 22 || (rule.FromPort && rule.FromPort <= 22 && rule.ToPort && rule.ToPort >= 22)) {
            openSSH++;
          }
          if (rule.FromPort === 3389 || (rule.FromPort && rule.FromPort <= 3389 && rule.ToPort && rule.ToPort >= 3389)) {
            openRDP++;
          }
          if (rule.IpProtocol === "-1" || (rule.FromPort === 0 && rule.ToPort === 65535)) {
            wideOpen++;
          }
        }
      }
    }

    if (openSSH > 0) {
      issues.push(`${openSSH} security group(s) allow SSH (port 22) from 0.0.0.0/0`);
      score -= Math.min(15, openSSH * 5);
    }

    if (openRDP > 0) {
      issues.push(`${openRDP} security group(s) allow RDP (port 3389) from 0.0.0.0/0`);
      score -= Math.min(15, openRDP * 5);
    }

    if (wideOpen > 0) {
      issues.push(`${wideOpen} security group(s) allow all traffic from 0.0.0.0/0`);
      score -= Math.min(20, wideOpen * 10);
    }

    // Ensure score doesn't go below 0
    score = Math.max(0, score);

    return {
      accountId: accountInfo.AccountId,
      region: this.config.region || "us-east-1",
      timestamp: new Date().toISOString(),
      checks: {
        iam: {
          rootMFAEnabled,
          passwordPolicyCompliant,
          usersWithMFA,
          usersWithoutMFA,
          accessKeysOlderThan90Days: oldAccessKeys,
          unusedCredentials,
        },
        cloudTrail: {
          enabled: cloudTrailEnabled,
          multiRegion: cloudTrailMultiRegion,
          logFileValidation: cloudTrailLogValidation,
          encryptedWithKMS: cloudTrailEncrypted,
        },
        s3: {
          bucketsWithPublicAccess,
          bucketsWithoutEncryption,
          bucketsWithoutVersioning,
          bucketsWithoutLogging,
        },
        networking: {
          securityGroupsWithOpenSSH: openSSH,
          securityGroupsWithOpenRDP: openRDP,
          securityGroupsWithWideOpen: wideOpen,
        },
      },
      compliant: issues.length === 0,
      issues,
      score,
    };
  }

  private isPasswordPolicyCompliant(policy: PasswordPolicy | null): boolean {
    if (!policy) return false;

    // Check for minimum security requirements
    return (
      policy.MinimumPasswordLength >= 14 &&
      policy.RequireSymbols &&
      policy.RequireNumbers &&
      policy.RequireUppercaseCharacters &&
      policy.RequireLowercaseCharacters &&
      policy.ExpirePasswords &&
      (policy.MaxPasswordAge || 0) <= 90 &&
      (policy.PasswordReusePrevention || 0) >= 24
    );
  }
}
