/**
 * Test script for vendor security gathering
 * Run: npx tsx scripts/test-vendor-gather.ts
 */

import { gatherVendorSecurityInfo, formatSecurityProfile } from "../src/agents/vendor-security-gatherer.js";

async function main() {
  const testVendors = [
    { name: "Notion", url: "https://notion.so" },
    { name: "Slack", url: "https://slack.com" },
    { name: "AWS", url: "https://aws.amazon.com" },
  ];

  for (const vendor of testVendors) {
    console.log(`\n${"=".repeat(60)}`);
    console.log(`Testing: ${vendor.name}`);
    console.log("=".repeat(60));

    try {
      const profile = await gatherVendorSecurityInfo(vendor.name, vendor.url);
      console.log(formatSecurityProfile(profile));
      console.log("\n--- Raw Findings ---");
      for (const finding of profile.rawFindings) {
        console.log(`  ${finding}`);
      }
    } catch (error) {
      console.error(`Error: ${error}`);
    }
  }
}

main().catch(console.error);
