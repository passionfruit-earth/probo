import { getGitHubToken } from '../dist/integrations/github/auth.js';
import { GitHubClient } from '../dist/integrations/github/client.js';
import { checkAllGitHubRepositories } from '../dist/evidence/index.js';

const token = getGitHubToken();
if (!token) {
  console.log('Not authenticated.');
  process.exit(1);
}

const client = new GitHubClient({ token });
const org = 'passionfruit-earth';

console.log(`Scanning ${org} repositories...\n`);
const results = await checkAllGitHubRepositories(client, { maxRepos: 10, org });

console.log(`Scanned ${results.length} repositories:\n`);
for (const result of results) {
  const { evidence } = result;
  const statusIcon = evidence.summary.status === 'pass' ? '[PASS]' :
                    evidence.summary.status === 'partial' ? '[PARTIAL]' : '[FAIL]';
  const repo = evidence.metadata?.repository || 'unknown';
  const score = evidence.summary.score || 0;

  console.log(`  ${statusIcon} ${repo}: ${score}/100`);
}
