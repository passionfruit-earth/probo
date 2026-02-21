export { SOC2_FRAMEWORK } from "./frameworks/soc2.js";
export { ISO27001_FRAMEWORK } from "./frameworks/iso27001.js";
export {
  CONTENT_SOURCES,
  fetchNistCatalog,
  oscalToProboFramework,
  type NistOscalCatalog,
} from "./sources.js";
import type { FrameworkImport } from "../client/index.js";
import { fetchNistCatalog, oscalToProboFramework } from "./sources.js";

// Framework sources:
// - NIST 800-53: fetched from official NIST OSCAL repository
// - SOC2/ISO27001: local definitions (AICPA doesn't provide machine-readable)
// - For production: consider integrating Secure Controls Framework (SCF)

// Get framework - prefers official sources when available
export async function getFramework(
  id: string
): Promise<FrameworkImport | undefined> {
  switch (id) {
    // NIST frameworks - fetch from official OSCAL source
    case "nist-800-53":
    case "nist-800-53-rev5": {
      try {
        const catalog = await fetchNistCatalog("nist-800-53-rev5");
        return oscalToProboFramework(catalog);
      } catch (error) {
        console.warn("Failed to fetch NIST catalog, using fallback:", error);
        return undefined;
      }
    }

    // SOC2 - local definition (AICPA doesn't provide machine-readable format)
    case "soc2":
    case "soc2-2017":
      return (await import("./frameworks/soc2.js")).SOC2_FRAMEWORK;

    // ISO27001 - local definition
    case "iso27001":
    case "iso27001-2022":
      return (await import("./frameworks/iso27001.js")).ISO27001_FRAMEWORK;

    default:
      return undefined;
  }
}

export function listAvailableFrameworks(): string[] {
  return [
    "nist-800-53-rev5", // Official NIST OSCAL source
    "soc2-2017", // Local definition (based on AICPA TSC)
    "iso27001-2022", // Local definition
  ];
}

// Parse standards string like "ISO27001:2022-A.5.16;SOC2-CC6.1" into structured data
export function parseStandardsMapping(standards: string): Array<{
  framework: string;
  controlId: string;
}> {
  return standards.split(";").map((s) => {
    const trimmed = s.trim();
    if (trimmed.startsWith("ISO27001")) {
      const controlId = trimmed.replace("ISO27001:2022-", "");
      return { framework: "iso27001-2022", controlId };
    }
    if (trimmed.startsWith("SOC2")) {
      const controlId = trimmed.replace("SOC2-", "");
      return { framework: "soc2-2017", controlId };
    }
    if (trimmed.startsWith("NIST")) {
      const controlId = trimmed.replace("NIST-", "").replace("800-53-", "");
      return { framework: "nist-800-53-rev5", controlId };
    }
    return { framework: "unknown", controlId: trimmed };
  });
}
