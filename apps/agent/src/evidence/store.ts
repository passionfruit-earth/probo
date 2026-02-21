import * as fs from "fs";
import * as path from "path";
import * as os from "os";

export interface EvidenceRecord {
  id: string;
  source: "github" | "google" | "aws" | "manual";
  type: string; // e.g., "repository_compliance", "2fa_status", "branch_protection"
  timestamp: string;
  data: Record<string, unknown>;
  summary: {
    status: "pass" | "fail" | "partial" | "unknown";
    issues: string[];
    score?: number; // 0-100
  };
  metadata?: {
    organization?: string;
    repository?: string;
    domain?: string;
    account?: string;
  };
}

export interface EvidenceQuery {
  source?: string;
  type?: string;
  since?: Date;
  until?: Date;
  limit?: number;
}

const EVIDENCE_DIR = path.join(os.homedir(), ".probo-agent", "evidence");

/**
 * Ensure evidence directory exists
 */
function ensureDir(dir: string): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true, mode: 0o700 });
  }
}

/**
 * Generate a unique ID for evidence records
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Save evidence record to local storage
 */
export function saveEvidence(
  source: EvidenceRecord["source"],
  type: string,
  data: Record<string, unknown>,
  summary: EvidenceRecord["summary"],
  metadata?: EvidenceRecord["metadata"]
): EvidenceRecord {
  const sourceDir = path.join(EVIDENCE_DIR, source);
  ensureDir(sourceDir);

  const timestamp = new Date().toISOString();
  const record: EvidenceRecord = {
    id: generateId(),
    source,
    type,
    timestamp,
    data,
    summary,
    metadata,
  };

  // Save with timestamp-based filename for easy sorting
  const filename = `${timestamp.replace(/[:.]/g, "-")}_${type}.json`;
  const filepath = path.join(sourceDir, filename);

  fs.writeFileSync(filepath, JSON.stringify(record, null, 2), { mode: 0o600 });

  return record;
}

/**
 * List all evidence records, optionally filtered
 */
export function listEvidence(query?: EvidenceQuery): EvidenceRecord[] {
  ensureDir(EVIDENCE_DIR);

  const records: EvidenceRecord[] = [];
  const sources = query?.source
    ? [query.source]
    : fs.readdirSync(EVIDENCE_DIR).filter(f =>
        fs.statSync(path.join(EVIDENCE_DIR, f)).isDirectory()
      );

  for (const source of sources) {
    const sourceDir = path.join(EVIDENCE_DIR, source);
    if (!fs.existsSync(sourceDir)) continue;

    const files = fs.readdirSync(sourceDir)
      .filter(f => f.endsWith(".json"))
      .sort()
      .reverse(); // Most recent first

    for (const file of files) {
      try {
        const content = fs.readFileSync(path.join(sourceDir, file), "utf-8");
        const record = JSON.parse(content) as EvidenceRecord;

        // Apply filters
        if (query?.type && record.type !== query.type) continue;
        if (query?.since && new Date(record.timestamp) < query.since) continue;
        if (query?.until && new Date(record.timestamp) > query.until) continue;

        records.push(record);

        if (query?.limit && records.length >= query.limit) break;
      } catch {
        // Skip invalid files
      }
    }

    if (query?.limit && records.length >= query.limit) break;
  }

  // Sort by timestamp descending
  return records.sort((a, b) =>
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

/**
 * Get the most recent evidence record for a source/type
 */
export function getLatestEvidence(
  source: EvidenceRecord["source"],
  type: string
): EvidenceRecord | null {
  const records = listEvidence({ source, type, limit: 1 });
  return records[0] || null;
}

/**
 * Compare two evidence records and return differences
 */
export function diffEvidence(
  older: EvidenceRecord,
  newer: EvidenceRecord
): {
  statusChanged: boolean;
  newIssues: string[];
  resolvedIssues: string[];
  scoreChange?: number;
} {
  const oldIssues = new Set(older.summary.issues);
  const newIssues = new Set(newer.summary.issues);

  return {
    statusChanged: older.summary.status !== newer.summary.status,
    newIssues: [...newIssues].filter(i => !oldIssues.has(i)),
    resolvedIssues: [...oldIssues].filter(i => !newIssues.has(i)),
    scoreChange:
      older.summary.score !== undefined && newer.summary.score !== undefined
        ? newer.summary.score - older.summary.score
        : undefined,
  };
}

/**
 * Get evidence history for trend analysis
 */
export function getEvidenceHistory(
  source: EvidenceRecord["source"],
  type: string,
  days: number = 30
): EvidenceRecord[] {
  const since = new Date();
  since.setDate(since.getDate() - days);

  return listEvidence({ source, type, since });
}

/**
 * Generate a summary report of all recent evidence
 */
export function generateSummaryReport(): {
  sources: {
    name: string;
    lastCheck: string | null;
    status: string;
    issueCount: number;
  }[];
  totalIssues: number;
  overallStatus: "pass" | "fail" | "partial" | "unknown";
} {
  const sources = ["github", "google", "aws"] as const;
  const report = {
    sources: [] as {
      name: string;
      lastCheck: string | null;
      status: string;
      issueCount: number;
    }[],
    totalIssues: 0,
    overallStatus: "unknown" as "pass" | "fail" | "partial" | "unknown",
  };

  let hasPass = false;
  let hasFail = false;

  for (const source of sources) {
    const records = listEvidence({ source, limit: 1 });
    const latest = records[0];

    if (latest) {
      report.sources.push({
        name: source,
        lastCheck: latest.timestamp,
        status: latest.summary.status,
        issueCount: latest.summary.issues.length,
      });
      report.totalIssues += latest.summary.issues.length;

      if (latest.summary.status === "pass") hasPass = true;
      if (latest.summary.status === "fail") hasFail = true;
    } else {
      report.sources.push({
        name: source,
        lastCheck: null,
        status: "unknown",
        issueCount: 0,
      });
    }
  }

  if (hasFail) {
    report.overallStatus = hasPass ? "partial" : "fail";
  } else if (hasPass) {
    report.overallStatus = "pass";
  }

  return report;
}

/**
 * Clear old evidence records (older than specified days)
 */
export function pruneEvidence(olderThanDays: number = 90): number {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - olderThanDays);

  let pruned = 0;
  const sources = fs.readdirSync(EVIDENCE_DIR).filter(f =>
    fs.statSync(path.join(EVIDENCE_DIR, f)).isDirectory()
  );

  for (const source of sources) {
    const sourceDir = path.join(EVIDENCE_DIR, source);
    const files = fs.readdirSync(sourceDir).filter(f => f.endsWith(".json"));

    for (const file of files) {
      const filepath = path.join(sourceDir, file);
      try {
        const content = fs.readFileSync(filepath, "utf-8");
        const record = JSON.parse(content) as EvidenceRecord;

        if (new Date(record.timestamp) < cutoff) {
          fs.unlinkSync(filepath);
          pruned++;
        }
      } catch {
        // Skip invalid files
      }
    }
  }

  return pruned;
}
