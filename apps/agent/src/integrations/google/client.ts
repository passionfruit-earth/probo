import type {
  GoogleUser,
  GoogleOrgUnit,
  GoogleGroup,
  GoogleDomain,
  ComplianceCheck,
  GoogleWorkspaceConfig,
} from "./types.js";

export interface GoogleWorkspaceClientConfig {
  // OAuth2 access token (from service account or user auth)
  accessToken: string;
  // Customer ID (use "my_customer" for the admin's domain)
  customerId?: string;
}

export class GoogleWorkspaceClient {
  private accessToken: string;
  private customerId: string;
  private baseUrl = "https://admin.googleapis.com";

  constructor(config: GoogleWorkspaceClientConfig) {
    this.accessToken = config.accessToken;
    this.customerId = config.customerId || "my_customer";
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = endpoint.startsWith("http") ? endpoint : `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Google API error: ${response.status} ${error}`);
    }

    return response.json() as Promise<T>;
  }

  // User operations
  async listUsers(maxResults = 500): Promise<GoogleUser[]> {
    const users: GoogleUser[] = [];
    let pageToken: string | undefined;

    do {
      const params = new URLSearchParams({
        customer: this.customerId,
        maxResults: String(Math.min(maxResults, 500)),
        projection: "full",
      });
      if (pageToken) {
        params.set("pageToken", pageToken);
      }

      const response = await this.request<{
        users?: GoogleUser[];
        nextPageToken?: string;
      }>(`/admin/directory/v1/users?${params}`);

      if (response.users) {
        users.push(...response.users);
      }
      pageToken = response.nextPageToken;
    } while (pageToken && users.length < maxResults);

    return users;
  }

  async getUser(userKey: string): Promise<GoogleUser> {
    return this.request<GoogleUser>(
      `/admin/directory/v1/users/${encodeURIComponent(userKey)}?projection=full`
    );
  }

  // Org unit operations
  async listOrgUnits(): Promise<GoogleOrgUnit[]> {
    const response = await this.request<{ organizationUnits?: GoogleOrgUnit[] }>(
      `/admin/directory/v1/customer/${this.customerId}/orgunits?type=all`
    );
    return response.organizationUnits || [];
  }

  // Group operations
  async listGroups(maxResults = 200): Promise<GoogleGroup[]> {
    const groups: GoogleGroup[] = [];
    let pageToken: string | undefined;

    do {
      const params = new URLSearchParams({
        customer: this.customerId,
        maxResults: String(Math.min(maxResults, 200)),
      });
      if (pageToken) {
        params.set("pageToken", pageToken);
      }

      const response = await this.request<{
        groups?: GoogleGroup[];
        nextPageToken?: string;
      }>(`/admin/directory/v1/groups?${params}`);

      if (response.groups) {
        groups.push(...response.groups);
      }
      pageToken = response.nextPageToken;
    } while (pageToken && groups.length < maxResults);

    return groups;
  }

  // Domain operations
  async listDomains(): Promise<GoogleDomain[]> {
    const response = await this.request<{ domains?: GoogleDomain[] }>(
      `/admin/directory/v1/customer/${this.customerId}/domains`
    );
    return response.domains || [];
  }

  // 2FA status for users
  async get2FAStatus(): Promise<{
    total: number;
    enrolled: number;
    enforced: number;
    notEnrolled: string[];
  }> {
    const users = await this.listUsers();
    const notEnrolled = users
      .filter((u) => !u.isEnrolledIn2Sv && !u.suspended && !u.archived)
      .map((u) => u.primaryEmail);

    return {
      total: users.filter((u) => !u.suspended && !u.archived).length,
      enrolled: users.filter((u) => u.isEnrolledIn2Sv).length,
      enforced: users.filter((u) => u.isEnforcedIn2Sv).length,
      notEnrolled,
    };
  }

  // Admin users
  async getAdminUsers(): Promise<GoogleUser[]> {
    const users = await this.listUsers();
    return users.filter((u) => u.isAdmin || u.isDelegatedAdmin);
  }

  // Compliance check - aggregate data for the workspace
  async checkCompliance(): Promise<ComplianceCheck> {
    const [users, groups, domains] = await Promise.all([
      this.listUsers(),
      this.listGroups(),
      this.listDomains(),
    ]);

    const activeUsers = users.filter((u) => !u.suspended && !u.archived);
    const admins = users.filter((u) => u.isAdmin || u.isDelegatedAdmin);
    const with2FA = activeUsers.filter((u) => u.isEnrolledIn2Sv);
    const enforced2FA = activeUsers.filter((u) => u.isEnforcedIn2Sv);
    const neverLoggedIn = activeUsers.filter((u) => !u.lastLoginTime);

    const issues: string[] = [];

    // Check 2FA coverage
    const twoFAPercent = (with2FA.length / activeUsers.length) * 100;
    if (twoFAPercent < 100) {
      issues.push(
        `${activeUsers.length - with2FA.length} users (${(100 - twoFAPercent).toFixed(1)}%) do not have 2FA enabled`
      );
    }

    // Check if 2FA is enforced
    const enforcedPercent = (enforced2FA.length / activeUsers.length) * 100;
    if (enforcedPercent < 100) {
      issues.push(
        `2FA is not enforced for ${activeUsers.length - enforced2FA.length} users`
      );
    }

    // Check for inactive users
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const inactiveUsers = activeUsers.filter((u) => {
      if (!u.lastLoginTime) return true;
      return new Date(u.lastLoginTime) < thirtyDaysAgo;
    });
    if (inactiveUsers.length > 0) {
      issues.push(`${inactiveUsers.length} users have not logged in for 30+ days`);
    }

    // Check admin count
    if (admins.length > 5) {
      issues.push(`High number of admin users: ${admins.length} (recommend < 5)`);
    }

    // Check for super admins without 2FA
    const adminsWithout2FA = admins.filter((u) => !u.isEnrolledIn2Sv);
    if (adminsWithout2FA.length > 0) {
      issues.push(
        `${adminsWithout2FA.length} admin users do not have 2FA enabled: ${adminsWithout2FA.map((u) => u.primaryEmail).join(", ")}`
      );
    }

    const primaryDomain = domains.find((d) => d.isPrimary);

    return {
      domain: primaryDomain?.domainName || "unknown",
      checks: {
        users: {
          total: activeUsers.length,
          admins: admins.length,
          suspended: users.filter((u) => u.suspended).length,
          with2FA: with2FA.length,
          without2FA: activeUsers.length - with2FA.length,
          enforced2FA: enforced2FA.length,
          neverLoggedIn: neverLoggedIn.length,
        },
        security: {
          twoFactorEnforced: enforcedPercent === 100,
          externalSharingRestricted: false, // Would need additional API calls
          mobileDevicesManaged: false, // Would need Mobile Management API
        },
        access: {
          totalGroups: groups.length,
          adminGroups: 0, // Would need to check group roles
        },
      },
      compliant: issues.length === 0,
      issues,
    };
  }
}

/**
 * Create a Google Workspace client using a simple access token.
 *
 * To get an access token for testing:
 * 1. Go to Google Cloud Console > APIs & Services > Credentials
 * 2. Create OAuth 2.0 credentials
 * 3. Use OAuth Playground (https://developers.google.com/oauthplayground)
 * 4. Authorize with scopes:
 *    - https://www.googleapis.com/auth/admin.directory.user.readonly
 *    - https://www.googleapis.com/auth/admin.directory.group.readonly
 *    - https://www.googleapis.com/auth/admin.directory.domain.readonly
 *    - https://www.googleapis.com/auth/admin.directory.orgunit.readonly
 * 5. Exchange for access token
 *
 * For production, use a service account with domain-wide delegation.
 */
export function createGoogleWorkspaceClient(
  accessToken: string,
  customerId?: string
): GoogleWorkspaceClient {
  return new GoogleWorkspaceClient({ accessToken, customerId });
}
