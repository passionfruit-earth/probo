import * as fs from "fs";
import * as path from "path";
import * as os from "os";

export interface DeviceCodeResponse {
  device_code: string;
  user_code: string;
  verification_uri: string;
  expires_in: number;
  interval: number;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  scope: string;
}

export interface StoredAuth {
  github?: {
    access_token: string;
    token_type: string;
    scope: string;
    created_at: string;
  };
}

const CONFIG_DIR = path.join(os.homedir(), ".probo-agent");
const AUTH_FILE = path.join(CONFIG_DIR, "auth.json");

// GitHub OAuth App Client ID - this is a public identifier, not a secret
// Override with GITHUB_CLIENT_ID environment variable if needed
const DEFAULT_CLIENT_ID = "Ov23liAgzQUyW3Wiglca";

export function getClientId(): string {
  return process.env.GITHUB_CLIENT_ID || DEFAULT_CLIENT_ID;
}

/**
 * Start the GitHub Device Flow authentication
 * Returns the device code info for user to complete auth
 */
export async function startDeviceFlow(): Promise<DeviceCodeResponse> {
  const clientId = getClientId();

  const response = await fetch("https://github.com/login/device/code", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: clientId,
      scope: "repo read:org admin:repo_hook read:user",
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to start device flow: ${error}`);
  }

  return response.json() as Promise<DeviceCodeResponse>;
}

/**
 * Poll GitHub for the access token after user completes authorization
 */
export async function pollForToken(
  deviceCode: string,
  interval: number = 5,
  expiresIn: number = 900
): Promise<TokenResponse> {
  const clientId = getClientId();
  const startTime = Date.now();
  const expiresAt = startTime + expiresIn * 1000;

  while (Date.now() < expiresAt) {
    await sleep(interval * 1000);

    const response = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: clientId,
        device_code: deviceCode,
        grant_type: "urn:ietf:params:oauth:grant-type:device_code",
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Token request failed: ${error}`);
    }

    const data = await response.json() as Record<string, string>;

    if (data.error) {
      switch (data.error) {
        case "authorization_pending":
          // User hasn't completed auth yet, keep polling
          continue;
        case "slow_down":
          // We're polling too fast, increase interval
          interval += 5;
          continue;
        case "expired_token":
          throw new Error("Device code expired. Please try again.");
        case "access_denied":
          throw new Error("User denied authorization.");
        default:
          throw new Error(`OAuth error: ${data.error} - ${data.error_description}`);
      }
    }

    if (data.access_token) {
      return data as unknown as TokenResponse;
    }
  }

  throw new Error("Device code expired. Please try again.");
}

/**
 * Save authentication tokens to local config file
 */
export function saveAuth(auth: StoredAuth): void {
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true, mode: 0o700 });
  }

  const existing = loadAuth();
  const merged = { ...existing, ...auth };

  fs.writeFileSync(AUTH_FILE, JSON.stringify(merged, null, 2), {
    mode: 0o600,
  });
}

/**
 * Load saved authentication tokens
 */
export function loadAuth(): StoredAuth {
  try {
    if (fs.existsSync(AUTH_FILE)) {
      const content = fs.readFileSync(AUTH_FILE, "utf-8");
      return JSON.parse(content) as StoredAuth;
    }
  } catch {
    // Invalid file, return empty
  }
  return {};
}

/**
 * Get GitHub token - from env var or saved auth
 */
export function getGitHubToken(): string | undefined {
  // Environment variable takes precedence
  if (process.env.GITHUB_TOKEN) {
    return process.env.GITHUB_TOKEN;
  }

  // Check saved auth
  const auth = loadAuth();
  return auth.github?.access_token;
}

/**
 * Check if GitHub is authenticated
 */
export function isGitHubAuthenticated(): boolean {
  return !!getGitHubToken();
}

/**
 * Clear GitHub authentication
 */
export function clearGitHubAuth(): void {
  const auth = loadAuth();
  delete auth.github;
  saveAuth(auth);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Full device flow authentication
 * Returns the token after user completes authorization
 */
export async function authenticateGitHub(
  onDeviceCode: (info: DeviceCodeResponse) => void
): Promise<TokenResponse> {
  const deviceInfo = await startDeviceFlow();
  onDeviceCode(deviceInfo);

  const token = await pollForToken(
    deviceInfo.device_code,
    deviceInfo.interval,
    deviceInfo.expires_in
  );

  // Save token
  saveAuth({
    github: {
      ...token,
      created_at: new Date().toISOString(),
    },
  });

  return token;
}
