/**
 * Skill: Scan Vendor Certifications
 *
 * Scans all vendors (or a specific vendor) for security certifications
 * and updates them in Probo.
 */

import { ProboClient } from '../client/index.js';
import {
  gatherVendorSecurityInfo,
  type Certification,
  type CertificationType,
} from '../agents/vendor-security-gatherer.js';

export interface ScanVendorCertsOptions {
  organizationId: string;
  vendorName?: string; // If provided, only scan this vendor
  dryRun?: boolean; // If true, don't update Probo
}

export interface VendorCertScanResult {
  vendorId: string;
  vendorName: string;
  websiteUrl: string | null;
  currentCerts: string[];
  foundCerts: Certification[];
  newCerts: string[];
  updated: boolean;
  error?: string;
}

export interface ScanVendorCertsResult {
  scannedCount: number;
  updatedCount: number;
  newCertsFound: number;
  results: VendorCertScanResult[];
}

/**
 * Scan vendors for certifications and optionally update Probo
 */
export async function scanVendorCertifications(
  client: ProboClient,
  options: ScanVendorCertsOptions
): Promise<ScanVendorCertsResult> {
  const { organizationId, vendorName, dryRun = false } = options;

  // Fetch vendors from Probo
  const vendorsResponse = await client.listVendors(organizationId);
  let vendors = (vendorsResponse as any).node?.vendors?.edges?.map((e: any) => e.node) || [];

  // Filter to specific vendor if requested
  if (vendorName) {
    vendors = vendors.filter((v: any) =>
      v.name.toLowerCase().includes(vendorName.toLowerCase())
    );
  }

  const results: VendorCertScanResult[] = [];
  let updatedCount = 0;
  let newCertsFound = 0;

  for (const vendor of vendors) {
    const result: VendorCertScanResult = {
      vendorId: vendor.id,
      vendorName: vendor.name,
      websiteUrl: vendor.websiteUrl,
      currentCerts: vendor.certifications || [],
      foundCerts: [],
      newCerts: [],
      updated: false,
    };

    if (!vendor.websiteUrl) {
      result.error = 'No website URL configured';
      results.push(result);
      continue;
    }

    try {
      // Scan for certifications
      const profile = await gatherVendorSecurityInfo(vendor.name, vendor.websiteUrl);
      result.foundCerts = profile.certifications;

      // Find new certifications (not already in Probo)
      const currentCertTypes = new Set(result.currentCerts);
      const newCerts: string[] = [];

      for (const cert of profile.certifications) {
        if (!currentCertTypes.has(cert.type)) {
          newCerts.push(cert.type);
          newCertsFound++;
        }
      }

      result.newCerts = newCerts;

      // Update Probo if there are new certs and not dry run
      if (newCerts.length > 0 && !dryRun) {
        const allCerts = [...new Set([...result.currentCerts, ...newCerts])];
        await client.updateVendor({
          id: vendor.id,
          certifications: allCerts,
        });
        result.updated = true;
        updatedCount++;
      }
    } catch (error) {
      result.error = error instanceof Error ? error.message : String(error);
    }

    results.push(result);
  }

  return {
    scannedCount: vendors.length,
    updatedCount,
    newCertsFound,
    results,
  };
}

/**
 * Format scan results for console output
 */
export function formatScanResults(results: ScanVendorCertsResult, dryRun: boolean): string {
  const lines: string[] = [
    '',
    `Scanned ${results.scannedCount} vendors`,
    `Found ${results.newCertsFound} new certifications`,
    dryRun ? '(Dry run - no changes made)' : `Updated ${results.updatedCount} vendors`,
    '',
    '─'.repeat(70),
  ];

  for (const result of results.results) {
    const statusIcon = result.error ? 'x' :
                       result.updated ? '+' :
                       result.newCerts.length > 0 ? '~' : '-';

    lines.push(`${statusIcon} ${result.vendorName}`);

    if (result.error) {
      lines.push(`    Error: ${result.error}`);
    } else if (result.foundCerts.length > 0) {
      lines.push(`    Current: ${result.currentCerts.join(', ') || 'None'}`);
      lines.push(`    Found: ${result.foundCerts.map(c => c.type).join(', ')}`);
      if (result.newCerts.length > 0) {
        lines.push(`    NEW: ${result.newCerts.join(', ')}`);
      }
    } else {
      lines.push(`    No certifications found on website`);
    }
  }

  lines.push('─'.repeat(70));
  lines.push('');

  return lines.join('\n');
}
