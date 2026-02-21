import { ProboClient } from '../src/client/index.js';
import { gatherVendorSecurityInfo, formatSecurityProfile } from '../src/agents/vendor-security-gatherer.js';
import * as dotenv from 'dotenv';

dotenv.config();

async function main() {
  const client = new ProboClient({
    endpoint: process.env.PROBO_ENDPOINT!,
    apiKey: process.env.PROBO_API_KEY!,
  });

  console.log('Fetching vendors from Probo...\n');
  const vendorsResponse = await client.listVendors(process.env.PROBO_ORGANIZATION_ID!);

  // Extract vendors from GraphQL response
  const vendors = (vendorsResponse as any).node?.vendors?.edges?.map((e: any) => e.node) || [];

  console.log(`Found ${vendors.length} vendors\n`);
  console.log('='.repeat(80));

  for (const vendor of vendors) {
    console.log(`\n## ${vendor.name}`);
    console.log(`   ID: ${vendor.id}`);
    console.log(`   Website: ${vendor.websiteUrl || 'Not set'}`);
    console.log(`   Current certifications: ${vendor.certifications?.join(', ') || 'None'}`);

    if (vendor.websiteUrl) {
      console.log(`\n   Scanning for certifications...`);
      try {
        const profile = await gatherVendorSecurityInfo(vendor.name, vendor.websiteUrl);
        console.log(`   Found ${profile.certifications.length} certifications:`);
        for (const cert of profile.certifications) {
          console.log(`     - ${cert.name} (${cert.type})`);
        }
        if (profile.trustPageUrl) {
          console.log(`   Trust page: ${profile.trustPageUrl}`);
        }
      } catch (error) {
        console.log(`   Error scanning: ${error}`);
      }
    } else {
      console.log(`   Skipping scan (no website URL)`);
    }

    console.log('-'.repeat(80));
  }
}

main().catch(console.error);
