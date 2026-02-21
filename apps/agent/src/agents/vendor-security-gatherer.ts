/**
 * Vendor Security Info Gatherer
 *
 * Multi-strategy discovery of vendor security information including:
 * - Trust/security pages
 * - Certifications (SOC 2, ISO 27001, etc.)
 * - Subprocessor lists
 * - DPA/privacy policy URLs
 */

export interface VendorSecurityProfile {
  vendorName: string;
  websiteUrl: string;
  trustPageUrl?: string;
  securityPageUrl?: string;
  certifications: Certification[];
  subprocessorsUrl?: string;
  dpaUrl?: string;
  privacyPolicyUrl?: string;
  dataLocations?: string[];
  securityContactEmail?: string;
  lastScanned: string;
  confidenceScore: number;
  sourceUrls: string[];
  rawFindings: string[];
}

export interface Certification {
  name: string;
  type: 'SOC2_TYPE1' | 'SOC2_TYPE2' | 'ISO27001' | 'ISO27701' | 'HIPAA' | 'GDPR' | 'PCI_DSS' | 'SOC1' | 'OTHER';
  issueDate?: string;
  expiryDate?: string;
  scope?: string;
  verified: boolean;
}

// Common URL patterns for security pages
const SECURITY_URL_PATTERNS = [
  '/security',
  '/trust',
  '/trust-center',
  '/compliance',
  '/legal/security',
  '/legal/privacy',
  '/legal/dpa',
  '/about/security',
  '/company/security',
  '/resources/security',
  '/docs/security',
  '/en/security',
  '/en/trust',
];

// Common trust center platforms
const TRUST_PLATFORMS = [
  { name: 'SafeBase', pattern: 'https://app.safebase.io/' },
  { name: 'Vanta Trust', pattern: 'https://trust.vanta.com/' },
  { name: 'Drata Trust', pattern: 'https://trust.drata.com/' },
  { name: 'Whistic', pattern: 'https://www.whistic.com/trust/' },
  { name: 'SecurityScorecard', pattern: 'https://securityscorecard.com/' },
];

// Certification patterns to look for in page content
const CERTIFICATION_PATTERNS = [
  { regex: /SOC\s*2\s*(Type\s*(I{1,2}|1|2))?/gi, type: 'SOC2_TYPE2' as const },
  { regex: /SOC\s*1/gi, type: 'SOC1' as const },
  { regex: /ISO\s*27001/gi, type: 'ISO27001' as const },
  { regex: /ISO\s*27701/gi, type: 'ISO27701' as const },
  { regex: /HIPAA/gi, type: 'HIPAA' as const },
  { regex: /GDPR\s*(compliant|certified)?/gi, type: 'GDPR' as const },
  { regex: /PCI[\s-]DSS/gi, type: 'PCI_DSS' as const },
];

/**
 * Try to fetch a URL and return content if successful
 */
async function tryFetch(url: string, timeout = 5000): Promise<{ ok: boolean; content?: string; finalUrl?: string }> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ProboSecurityBot/1.0)',
      },
      redirect: 'follow',
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const content = await response.text();
      return { ok: true, content, finalUrl: response.url };
    }
    return { ok: false };
  } catch {
    return { ok: false };
  }
}

/**
 * Extract base domain from URL
 */
function getBaseDomain(url: string): string {
  try {
    const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
    return `${parsed.protocol}//${parsed.host}`;
  } catch {
    return url;
  }
}

/**
 * Extract certifications from page content
 */
function extractCertifications(content: string): Certification[] {
  const certs: Certification[] = [];
  const found = new Set<string>();

  for (const { regex, type } of CERTIFICATION_PATTERNS) {
    const matches = content.match(regex);
    if (matches && !found.has(type)) {
      found.add(type);
      certs.push({
        name: matches[0],
        type,
        verified: false, // Would need manual verification
      });
    }
  }

  return certs;
}

/**
 * Look for security-related links in page content
 */
function findSecurityLinks(content: string, baseUrl: string): string[] {
  const links: string[] = [];
  const linkRegex = /href=["']([^"']+)["']/gi;
  const securityKeywords = ['security', 'trust', 'compliance', 'privacy', 'dpa', 'subprocessor', 'gdpr'];

  let match;
  while ((match = linkRegex.exec(content)) !== null) {
    const href = match[1];
    const lowerHref = href.toLowerCase();

    if (securityKeywords.some(kw => lowerHref.includes(kw))) {
      // Convert relative URLs to absolute
      if (href.startsWith('/')) {
        links.push(baseUrl + href);
      } else if (href.startsWith('http')) {
        links.push(href);
      }
    }
  }

  return [...new Set(links)]; // Deduplicate
}

/**
 * Check if content mentions subprocessors
 */
function findSubprocessorUrl(content: string, baseUrl: string): string | undefined {
  const linkRegex = /href=["']([^"']*subprocessor[^"']*)["']/gi;
  const match = linkRegex.exec(content);
  if (match) {
    const href = match[1];
    return href.startsWith('/') ? baseUrl + href : href;
  }
  return undefined;
}

/**
 * Check if content mentions DPA
 */
function findDpaUrl(content: string, baseUrl: string): string | undefined {
  const patterns = [
    /href=["']([^"']*(?:dpa|data-processing-agreement|data-processing)[^"']*)["']/gi,
  ];

  for (const regex of patterns) {
    const match = regex.exec(content);
    if (match) {
      const href = match[1];
      return href.startsWith('/') ? baseUrl + href : href;
    }
  }
  return undefined;
}

/**
 * Main function to gather vendor security information
 */
export async function gatherVendorSecurityInfo(
  vendorName: string,
  websiteUrl?: string
): Promise<VendorSecurityProfile> {
  const profile: VendorSecurityProfile = {
    vendorName,
    websiteUrl: websiteUrl || '',
    certifications: [],
    lastScanned: new Date().toISOString(),
    confidenceScore: 0,
    sourceUrls: [],
    rawFindings: [],
  };

  // If no URL provided, try to guess it
  if (!websiteUrl) {
    const guessedUrl = `https://${vendorName.toLowerCase().replace(/\s+/g, '')}.com`;
    const result = await tryFetch(guessedUrl);
    if (result.ok) {
      websiteUrl = guessedUrl;
      profile.websiteUrl = guessedUrl;
      profile.rawFindings.push(`Guessed website URL: ${guessedUrl}`);
    }
  }

  if (!websiteUrl) {
    profile.rawFindings.push('Could not determine website URL');
    return profile;
  }

  const baseUrl = getBaseDomain(websiteUrl);

  // Strategy 1: Try common URL patterns
  profile.rawFindings.push('Strategy 1: Trying common URL patterns...');

  for (const pattern of SECURITY_URL_PATTERNS) {
    const url = baseUrl + pattern;
    const result = await tryFetch(url);

    if (result.ok && result.content) {
      profile.rawFindings.push(`Found: ${url}`);
      profile.sourceUrls.push(url);

      // Categorize the URL
      if (pattern.includes('trust') || pattern.includes('security')) {
        profile.trustPageUrl = profile.trustPageUrl || url;
        profile.securityPageUrl = profile.securityPageUrl || url;
      }
      if (pattern.includes('dpa')) {
        profile.dpaUrl = profile.dpaUrl || url;
      }

      // Extract certifications
      const certs = extractCertifications(result.content);
      for (const cert of certs) {
        if (!profile.certifications.find(c => c.type === cert.type)) {
          profile.certifications.push(cert);
          profile.rawFindings.push(`Found certification: ${cert.name}`);
        }
      }

      // Find more security links
      const links = findSecurityLinks(result.content, baseUrl);
      for (const link of links) {
        if (!profile.sourceUrls.includes(link)) {
          profile.rawFindings.push(`Found security link: ${link}`);
        }
      }

      // Find specific URLs
      if (!profile.subprocessorsUrl) {
        profile.subprocessorsUrl = findSubprocessorUrl(result.content, baseUrl);
        if (profile.subprocessorsUrl) {
          profile.rawFindings.push(`Found subprocessors page: ${profile.subprocessorsUrl}`);
        }
      }

      if (!profile.dpaUrl) {
        profile.dpaUrl = findDpaUrl(result.content, baseUrl);
        if (profile.dpaUrl) {
          profile.rawFindings.push(`Found DPA: ${profile.dpaUrl}`);
        }
      }
    }
  }

  // Strategy 2: Crawl homepage for security links
  profile.rawFindings.push('Strategy 2: Crawling homepage for security links...');

  const homepageResult = await tryFetch(baseUrl);
  if (homepageResult.ok && homepageResult.content) {
    const links = findSecurityLinks(homepageResult.content, baseUrl);

    for (const link of links.slice(0, 5)) { // Limit to first 5 links
      if (!profile.sourceUrls.includes(link)) {
        const result = await tryFetch(link);
        if (result.ok && result.content) {
          profile.sourceUrls.push(link);
          profile.rawFindings.push(`Found via homepage: ${link}`);

          const certs = extractCertifications(result.content);
          for (const cert of certs) {
            if (!profile.certifications.find(c => c.type === cert.type)) {
              profile.certifications.push(cert);
              profile.rawFindings.push(`Found certification: ${cert.name}`);
            }
          }
        }
      }
    }
  }

  // Strategy 3: Check trust center platforms
  profile.rawFindings.push('Strategy 3: Checking trust center platforms...');

  const vendorSlug = vendorName.toLowerCase().replace(/\s+/g, '-');
  for (const platform of TRUST_PLATFORMS) {
    const url = platform.pattern + vendorSlug;
    const result = await tryFetch(url);

    if (result.ok) {
      profile.trustPageUrl = profile.trustPageUrl || url;
      profile.sourceUrls.push(url);
      profile.rawFindings.push(`Found on ${platform.name}: ${url}`);
      profile.confidenceScore += 0.2; // Trust platforms increase confidence
    }
  }

  // Calculate confidence score
  let confidence = 0;
  if (profile.trustPageUrl || profile.securityPageUrl) confidence += 0.3;
  if (profile.certifications.length > 0) confidence += 0.2 * Math.min(profile.certifications.length, 3);
  if (profile.dpaUrl) confidence += 0.1;
  if (profile.subprocessorsUrl) confidence += 0.1;
  if (profile.sourceUrls.length > 2) confidence += 0.1;

  profile.confidenceScore = Math.min(confidence, 1);
  profile.rawFindings.push(`Confidence score: ${(profile.confidenceScore * 100).toFixed(0)}%`);

  return profile;
}

/**
 * Format profile for display
 */
export function formatSecurityProfile(profile: VendorSecurityProfile): string {
  const lines: string[] = [
    `## Security Profile: ${profile.vendorName}`,
    '',
    `**Website:** ${profile.websiteUrl || 'Unknown'}`,
    `**Confidence Score:** ${(profile.confidenceScore * 100).toFixed(0)}%`,
    `**Last Scanned:** ${profile.lastScanned}`,
    '',
  ];

  if (profile.trustPageUrl) {
    lines.push(`**Trust/Security Page:** ${profile.trustPageUrl}`);
  }

  if (profile.certifications.length > 0) {
    lines.push('', '### Certifications');
    for (const cert of profile.certifications) {
      lines.push(`- ${cert.name} (${cert.type})${cert.verified ? ' ✓' : ''}`);
    }
  } else {
    lines.push('', '### Certifications', 'No certifications found automatically. Manual verification recommended.');
  }

  if (profile.dpaUrl) {
    lines.push('', `**Data Processing Agreement:** ${profile.dpaUrl}`);
  }

  if (profile.subprocessorsUrl) {
    lines.push(`**Subprocessors List:** ${profile.subprocessorsUrl}`);
  }

  if (profile.sourceUrls.length > 0) {
    lines.push('', '### Sources', ...profile.sourceUrls.map(url => `- ${url}`));
  }

  return lines.join('\n');
}
