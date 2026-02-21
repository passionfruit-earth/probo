---
description: "Set up API integrations for security scanning"
argument-hint: "<service: slack|linear|vercel|notion|posthog|attio|fireflies|loops|all>"
---

# Setup Integrations

Set up API access for automated security scanning.

## Quick Links

| Service | Setup URL | Token Location |
|---------|-----------|----------------|
| Slack | [Create App](https://api.slack.com/apps) | OAuth & Permissions |
| Linear | [API Settings](https://linear.app/settings/api) | Personal API keys |
| Vercel | [Tokens](https://vercel.com/account/tokens) | Account tokens |
| Notion | [Integrations](https://www.notion.so/my-integrations) | Internal integration |
| PostHog | [Personal API Keys](https://app.posthog.com/settings/user-api-keys) | User settings |
| Attio | [Developers](https://app.attio.com/settings/developers) | API keys |
| Fireflies | [Integrations](https://app.fireflies.ai/integrations) | API key |
| Loops | [API Settings](https://app.loops.so/settings/api) | API keys |

---

## Slack

**URL:** https://api.slack.com/apps

**Steps:**
1. Click **Create New App**
2. Select **From scratch**
3. Name: `Probo Security Scanner`
4. Workspace: Select your workspace
5. Click **Create App**

**Add OAuth Scopes:**
1. Go to **OAuth & Permissions** in sidebar
2. Scroll to **User Token Scopes**
3. Add these scopes:
   - `admin` (for admin settings)
   - `admin.teams:read` (team info)
   - `users:read` (user list)
   - `users:read.email` (user emails)
   - `team:read` (workspace info)

**Install:**
1. Scroll up to **Install to Workspace**
2. Click **Install to Workspace**
3. Authorize
4. Copy the **User OAuth Token** (starts with `xoxp-`)

**Save token:**
```bash
# Add to .env or environment
SLACK_TOKEN=xoxp-your-token-here
```

---

## Linear

**URL:** https://linear.app/settings/api

**Steps:**
1. Go to Settings > API > Personal API keys
2. Click **Create key**
3. Label: `Probo Security Scanner`
4. Click **Create**
5. Copy the token (shown once)

**Save token:**
```bash
LINEAR_API_KEY=lin_api_your-token-here
```

---

## Vercel

**URL:** https://vercel.com/account/tokens

**Steps:**
1. Click **Create**
2. Name: `Probo Security Scanner`
3. Scope: **Full Account** (for team access)
4. Expiration: 1 year (or no expiration)
5. Click **Create Token**
6. Copy the token (shown once)

**Save token:**
```bash
VERCEL_TOKEN=your-token-here
```

---

## Notion

**URL:** https://www.notion.so/my-integrations

**Steps:**
1. Click **New integration**
2. Name: `Probo Security Scanner`
3. Associated workspace: Select your workspace
4. Type: **Internal**
5. Capabilities: Check **Read content**, **Read user information**
6. Click **Submit**
7. Copy **Internal Integration Secret** (starts with `secret_`)

**Important:** The integration needs to be added to pages/databases to access them. For security scanning, we mainly need workspace-level access.

**Save token:**
```bash
NOTION_TOKEN=secret_your-token-here
```

---

## PostHog

**URL:** https://app.posthog.com/settings/user-api-keys

**Steps:**
1. Click **Create personal API key**
2. Label: `Probo Security Scanner`
3. Organization access: **Read** (not write)
4. Click **Create key**
5. Copy the key (shown once)

**Save token:**
```bash
POSTHOG_API_KEY=phx_your-key-here
```

---

## Attio

**URL:** https://app.attio.com/settings/developers

**Steps:**
1. Go to Settings > Developers > API Keys
2. Click **Generate new token**
3. Name: `Probo Security Scanner`
4. Permissions: **Read** access
5. Click **Generate**
6. Copy the token

**Save token:**
```bash
ATTIO_API_KEY=your-token-here
```

---

## Fireflies

**URL:** https://app.fireflies.ai/integrations

**Steps:**
1. Go to Integrations > Fireflies API
2. Or directly: https://app.fireflies.ai/api
3. Click **Generate API Key** (or view existing)
4. Copy the key

**Save token:**
```bash
FIREFLIES_API_KEY=your-key-here
```

---

## Loops

**URL:** https://app.loops.so/settings/api

**Steps:**
1. Go to Settings > API
2. Click **Generate API key** (or copy existing)
3. Copy the key

**Save token:**
```bash
LOOPS_API_KEY=your-key-here
```

---

## Save All Tokens

Create or update `.env.local` in the project root:

```bash
# Security Scanner Integrations
SLACK_TOKEN=xoxp-...
LINEAR_API_KEY=lin_api_...
VERCEL_TOKEN=...
NOTION_TOKEN=secret_...
POSTHOG_API_KEY=phx_...
ATTIO_API_KEY=...
FIREFLIES_API_KEY=...
LOOPS_API_KEY=...
```

**Important:**
- Never commit tokens to git
- Add `.env.local` to `.gitignore`
- Rotate tokens annually
- Use read-only scopes where possible

---

## Verify Setup

After saving tokens, run:
```
scan all
```

This will test each integration and report any connection issues.
