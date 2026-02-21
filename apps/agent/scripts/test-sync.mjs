import { config } from 'dotenv';
config();

import { ProboClient } from '../dist/client/index.js';
import { syncLatestSummaryToProbo, listEvidence } from '../dist/evidence/index.js';

const proboClient = new ProboClient({
  endpoint: process.env.PROBO_ENDPOINT,
  apiKey: process.env.PROBO_API_KEY,
});

const organizationId = process.env.PROBO_ORGANIZATION_ID;

if (!organizationId) {
  console.log('PROBO_ORGANIZATION_ID not set');
  process.exit(1);
}

// Check if we have evidence
const records = listEvidence({ source: 'github', limit: 1 });
if (records.length === 0) {
  console.log('No GitHub evidence found. Run a scan first.');
  process.exit(1);
}

console.log(`Found ${records.length} GitHub evidence records`);
console.log('Syncing to Probo...\n');

try {
  const result = await syncLatestSummaryToProbo(proboClient, organizationId, 'github');
  
  if (result) {
    console.log('✓ Synced successfully!');
    console.log(`  Document: ${result.title}`);
    console.log(`  ID: ${result.documentId}`);
  } else {
    console.log('✗ Sync failed');
  }
} catch (error) {
  console.error('Error:', error.message);
}
