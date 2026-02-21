/**
 * Gather security info for all Passionfruit vendors
 * Run: npx tsx scripts/gather-all-vendors.ts
 */

import { gatherVendorSecurityInfo, formatSecurityProfile, VendorSecurityProfile } from "../src/agents/vendor-security-gatherer.js";
import * as fs from "fs";

const vendors = [
  { name: "AWS", url: "https://aws.amazon.com" },
  { name: "Azure OpenAI", url: "https://azure.microsoft.com" },
  { name: "GitHub", url: "https://github.com" },
  { name: "Linear", url: "https://linear.app" },
  { name: "PostHog", url: "https://posthog.com" },
  { name: "Slack", url: "https://slack.com" },
  { name: "Google Workspace", url: "https://workspace.google.com" },
  { name: "Microsoft 365", url: "https://www.microsoft.com" },
  { name: "Notion", url: "https://notion.so" },
  { name: "Fireflies", url: "https://fireflies.ai" },
  { name: "Attio", url: "https://attio.com" },
  { name: "Unstructured", url: "https://unstructured.io" },
  { name: "Sentry", url: "https://sentry.io" },
];

async function main() {
  console.log("Gathering security info for all vendors...\n");

  const results: { vendor: string; profile: VendorSecurityProfile }[] = [];

  for (const vendor of vendors) {
    console.log(`\n${"=".repeat(60)}`);
    console.log(`Scanning: ${vendor.name}`);
    console.log("=".repeat(60));

    try {
      const profile = await gatherVendorSecurityInfo(vendor.name, vendor.url);
      results.push({ vendor: vendor.name, profile });

      console.log(`Confidence: ${(profile.confidenceScore * 100).toFixed(0)}%`);
      console.log(`Certifications: ${profile.certifications.map(c => c.type).join(", ") || "None found"}`);
      console.log(`Trust Page: ${profile.trustPageUrl || "Not found"}`);
      console.log(`DPA: ${profile.dpaUrl || "Not found"}`);
      console.log(`Subprocessors: ${profile.subprocessorsUrl || "Not found"}`);
    } catch (error) {
      console.error(`Error: ${error}`);
      results.push({
        vendor: vendor.name,
        profile: {
          vendorName: vendor.name,
          websiteUrl: vendor.url,
          certifications: [],
          lastScanned: new Date().toISOString(),
          confidenceScore: 0,
          sourceUrls: [],
          rawFindings: [`Error: ${error}`],
        },
      });
    }
  }

  // Generate summary report
  console.log("\n\n" + "=".repeat(60));
  console.log("SUMMARY REPORT");
  console.log("=".repeat(60));

  const summary: string[] = [
    "# Vendor Security Profiles Summary",
    "",
    `Generated: ${new Date().toISOString()}`,
    "",
    "## Overview",
    "",
    "| Vendor | Confidence | Certifications | Trust Page | DPA |",
    "|--------|------------|----------------|------------|-----|",
  ];

  for (const { vendor, profile } of results) {
    const certs = profile.certifications.map(c => c.type).join(", ") || "-";
    const trustPage = profile.trustPageUrl ? "✓" : "-";
    const dpa = profile.dpaUrl ? "✓" : "-";
    summary.push(`| ${vendor} | ${(profile.confidenceScore * 100).toFixed(0)}% | ${certs} | ${trustPage} | ${dpa} |`);
  }

  summary.push("");
  summary.push("## Detailed Profiles");
  summary.push("");

  for (const { profile } of results) {
    summary.push(formatSecurityProfile(profile));
    summary.push("");
    summary.push("---");
    summary.push("");
  }

  // Write report to file
  const reportPath = "../../docs/vendor-security-profiles.md";
  fs.writeFileSync(reportPath, summary.join("\n"));
  console.log(`\nReport written to: ${reportPath}`);

  // Also output JSON for potential API updates
  const jsonPath = "./vendor-security-data.json";
  fs.writeFileSync(jsonPath, JSON.stringify(results, null, 2));
  console.log(`JSON data written to: ${jsonPath}`);
}

main().catch(console.error);
