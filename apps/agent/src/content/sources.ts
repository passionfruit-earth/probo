// Official compliance content sources
// Instead of maintaining our own control definitions, we integrate with audited sources

export const CONTENT_SOURCES = {
  // NIST OSCAL - Official government source for NIST controls in machine-readable format
  nistOscal: {
    name: "NIST OSCAL Content",
    description:
      "Official NIST SP 800-53 controls in JSON/YAML/XML format",
    repo: "https://github.com/usnistgov/oscal-content",
    license: "Public Domain (US Government)",
    catalogs: {
      "nist-800-53-rev5": {
        url: "https://raw.githubusercontent.com/usnistgov/oscal-content/main/nist.gov/SP800-53/rev5/json/NIST_SP-800-53_rev5_catalog.json",
        description: "Full NIST 800-53 Revision 5 control catalog",
      },
      "nist-800-53-rev5-low": {
        url: "https://raw.githubusercontent.com/usnistgov/oscal-content/main/nist.gov/SP800-53/rev5/json/NIST_SP-800-53_rev5_LOW-baseline_profile.json",
        description: "NIST 800-53 Low baseline",
      },
      "nist-800-53-rev5-moderate": {
        url: "https://raw.githubusercontent.com/usnistgov/oscal-content/main/nist.gov/SP800-53/rev5/json/NIST_SP-800-53_rev5_MODERATE-baseline_profile.json",
        description: "NIST 800-53 Moderate baseline",
      },
      "nist-800-53-rev5-high": {
        url: "https://raw.githubusercontent.com/usnistgov/oscal-content/main/nist.gov/SP800-53/rev5/json/NIST_SP-800-53_rev5_HIGH-baseline_profile.json",
        description: "NIST 800-53 High baseline",
      },
    },
  },

  // Secure Controls Framework - Meta-framework with mappings to 100+ standards
  scf: {
    name: "Secure Controls Framework (SCF)",
    description:
      "Meta-framework with 578+ controls mapped to SOC2, ISO27001, NIST, GDPR, etc.",
    website: "https://securecontrolsframework.com/scf-download/",
    github: "https://github.com/securecontrolsframework/securecontrolsframework",
    license: "Free for commercial use",
    note: "Download Excel/CSV from website - contains control mappings to all major frameworks",
  },

  // StrongDM Comply - SOC2 policy templates
  comply: {
    name: "StrongDM Comply",
    description: "24 SOC2 policy templates in Markdown format",
    repo: "https://github.com/strongdm/comply",
    license: "Apache 2.0",
    templates: {
      base: "https://raw.githubusercontent.com/strongdm/comply/master/example/templates/policies",
    },
  },

  // AICPA Trust Services Criteria - Official SOC2 source (reference only)
  aicpa: {
    name: "AICPA Trust Services Criteria 2017",
    description:
      "Official SOC2 Trust Services Criteria (PDF only, copyrighted)",
    website:
      "https://www.aicpa-cima.com/resources/download/2017-trust-services-criteria-with-revised-points-of-focus-2022",
    license: "AICPA Copyright - reference only",
    note: "Use SCF or our minimal definitions for machine-readable SOC2 controls",
  },
};

// Fetch NIST OSCAL catalog
export async function fetchNistCatalog(
  catalogId: keyof typeof CONTENT_SOURCES.nistOscal.catalogs = "nist-800-53-rev5"
): Promise<NistOscalCatalog> {
  const catalog = CONTENT_SOURCES.nistOscal.catalogs[catalogId];
  const response = await fetch(catalog.url);
  if (!response.ok) {
    throw new Error(`Failed to fetch NIST catalog: ${response.statusText}`);
  }
  return response.json() as Promise<NistOscalCatalog>;
}

// OSCAL Catalog types (simplified)
export interface NistOscalCatalog {
  catalog: {
    uuid: string;
    metadata: {
      title: string;
      version: string;
      "last-modified": string;
    };
    groups: NistOscalGroup[];
  };
}

export interface NistOscalGroup {
  id: string;
  class: string;
  title: string;
  controls?: NistOscalControl[];
  groups?: NistOscalGroup[];
}

export interface NistOscalControl {
  id: string;
  class: string;
  title: string;
  props?: Array<{ name: string; value: string }>;
  parts?: Array<{
    id: string;
    name: string;
    prose?: string;
    parts?: Array<{ name: string; prose: string }>;
  }>;
  controls?: NistOscalControl[]; // Nested control enhancements
}

// Convert OSCAL controls to Probo framework format
export function oscalToProboFramework(catalog: NistOscalCatalog): {
  framework: {
    id: string;
    name: string;
    controls: Array<{ id: string; name: string; description: string }>;
  };
} {
  const controls: Array<{ id: string; name: string; description: string }> = [];

  function extractControls(groups: NistOscalGroup[]) {
    for (const group of groups) {
      if (group.controls) {
        for (const control of group.controls) {
          const description =
            control.parts?.find((p) => p.name === "statement")?.prose ||
            control.title;
          controls.push({
            id: control.id.toUpperCase(),
            name: `${control.id.toUpperCase()} - ${control.title}`,
            description,
          });

          // Include control enhancements
          if (control.controls) {
            for (const enhancement of control.controls) {
              const enhDesc =
                enhancement.parts?.find((p) => p.name === "statement")?.prose ||
                enhancement.title;
              controls.push({
                id: enhancement.id.toUpperCase(),
                name: `${enhancement.id.toUpperCase()} - ${enhancement.title}`,
                description: enhDesc,
              });
            }
          }
        }
      }
      if (group.groups) {
        extractControls(group.groups);
      }
    }
  }

  extractControls(catalog.catalog.groups);

  return {
    framework: {
      id: "nist-800-53-rev5",
      name: catalog.catalog.metadata.title,
      controls,
    },
  };
}
