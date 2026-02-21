import { getGitHubToken } from '../dist/integrations/github/auth.js';
import { GitHubClient } from '../dist/integrations/github/client.js';
import { checkAllGitHubRepositories, generateSummaryReport } from '../dist/evidence/index.js';

const token = getGitHubToken();
if (!token) {
  console.log('Not authenticated.');
  process.exit(1);
}

const client = new GitHubClient({ token });

console.log('Scanning GitHub repositories...\n');
const results = await checkAllGitHubRepositories(client, { maxRepos: 5 });

console.log(`Scanned ${results.length} repositories:\n`);
for (const result of results) {
  const { evidence } = result;
  const statusIcon = evidence.summary.status === 'pass' ? '✓' :
                    evidence.summary.status === 'partial' ? '~' : '✗';
  const repo = evidence.metadata?.repository || 'unknown';
  const score = evidence.summary.score || 0;

  console.log(`  ${statusIcon} ${repo}: ${score}/100`);
  if (evidence.summary.issues.length > 0) {
    evidence.summary.issues.slice(0, 2).forEach(issue => {
      console.log(`      - ${issue}`);
    });
  }
}

console.log('\nEvidence saved to ~/.probo-agent/evidence/github/');

const report = generateSummaryReport();
console.log(`\nSummary: ${report.totalIssues} total issues`);
