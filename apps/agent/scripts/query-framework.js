#!/usr/bin/env node

async function queryFramework() {
  const endpoint = process.env.PROBO_ENDPOINT || 'http://localhost:8080/api/console/v1/graphql';
  const apiKey = process.env.PROBO_API_KEY;
  const frameworkId = process.argv[2] || '2delmZUAAAEAAQAAAZyAAs3IFGDbQt-6';

  const query = `
    query GetFramework($id: ID!) {
      node(id: $id) {
        ... on Framework {
          id
          name
          controls(first: 10) {
            edges {
              node {
                id
                name
                description
              }
            }
            totalCount
          }
        }
      }
    }
  `;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      query,
      variables: { id: frameworkId }
    })
  });

  const result = await response.json();
  console.log(JSON.stringify(result, null, 2));
}

queryFramework().catch(console.error);
