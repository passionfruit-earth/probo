#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function importFramework() {
  const endpoint = process.env.PROBO_ENDPOINT || 'http://localhost:8080/api/console/v1/graphql';
  const apiKey = process.env.PROBO_API_KEY;
  const orgId = process.env.PROBO_ORGANIZATION_ID;

  if (!apiKey || !orgId) {
    console.error('Missing PROBO_API_KEY or PROBO_ORGANIZATION_ID');
    process.exit(1);
  }

  const frameworkPath = path.join(__dirname, '../data/iso27001-import.json');
  const frameworkData = fs.readFileSync(frameworkPath);

  const query = `
    mutation ImportFramework($input: ImportFrameworkInput!) {
      importFramework(input: $input) {
        frameworkEdge {
          node {
            id
            name
          }
        }
      }
    }
  `;

  const operations = JSON.stringify({
    query,
    variables: {
      input: {
        organizationId: orgId,
        file: null
      }
    }
  });

  const map = JSON.stringify({
    '0': ['variables.input.file']
  });

  const formData = new FormData();
  formData.append('operations', operations);
  formData.append('map', map);
  formData.append('0', new Blob([frameworkData], { type: 'application/json' }), 'iso27001-import.json');

  console.log('Uploading ISO 27001 framework to Probo...');
  console.log('Endpoint:', endpoint);
  console.log('Organization ID:', orgId);

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`
    },
    body: formData
  });

  const result = await response.json();

  if (result.errors) {
    console.error('GraphQL errors:', JSON.stringify(result.errors, null, 2));
    process.exit(1);
  }

  console.log('Framework imported successfully!');
  console.log('Result:', JSON.stringify(result.data, null, 2));
}

importFramework().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
