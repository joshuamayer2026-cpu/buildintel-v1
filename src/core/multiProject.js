// src/core/multiProject.js

// reports: array of objects like:
// {
//   company: string,
//   project: string,
//   gc: string,
//   owner: string,
//   daysLate: number,
//   risk: "low" | "medium" | "high",
//   warning: boolean
// }

export function analyzeMultiProjectBehavior(reports = []) {
  if (!Array.isArray(reports) || reports.length === 0) {
    return {
      companyLevel: {
        risk: "none",
        warning: false,
        detail: "No reports available for multi-project analysis."
      },
      gcLevel: [],
      ownerLevel: []
    };
  }

  // Group by company, GC, owner
  const companyMap = new Map();
  const gcMap = new Map();
  const ownerMap = new Map();

  for (const r of reports) {
    const companyKey = r.company || "unknown_company";
    const gcKey = r.gc || "unknown_gc";
    const ownerKey = r.owner || "unknown_owner";

    if (!companyMap.has(companyKey)) companyMap.set(companyKey, []);
    if (!gcMap.has(gcKey)) gcMap.set(gcKey, []);
    if (!ownerMap.has(ownerKey)) ownerMap.set(ownerKey, []);

    companyMap.get(companyKey).push(r);
    gcMap.get(gcKey).push(r);
    ownerMap.get(ownerKey).push(r);
  }

  // Helper: compute risk level from reports
  function computeRisk(reportsForEntity) {
    const count = reportsForEntity.length;
    const high = reportsForEntity.filter(r => r.risk === "high").length;
    const medium = reportsForEntity.filter(r => r.risk === "medium").length;
    const warnings = reportsForEntity.filter(r => r.warning).length;

    if (high >= 2 || (high >= 1 && medium >= 2)) {
      return { risk: "high", warning: true };
    }
    if (medium >= 2 || warnings >= 2) {
      return { risk: "medium", warning: true };
    }
    if (medium >= 1 || warnings >= 1) {
      return { risk: "medium", warning: false };
    }
    if (count >= 3) {
      return { risk: "low", warning: false };
    }
    return { risk: "low", warning: false };
  }

  // Company-level analysis (systemic vs isolated)
  const companyLevel = [];
  for (const [company, companyReports] of companyMap.entries()) {
    const { risk, warning } = computeRisk(companyReports);

    let detail = "Company behavior across projects analyzed.";
    if (risk === "high") {
      detail = "Systemic multi-project risk detected for this company.";
    } else if (risk === "medium" && warning) {
      detail = "Emerging multi-project risk pattern detected.";
    } else if (risk === "medium") {
      detail = "Moderate multi-project risk with limited warnings.";
    } else {
      detail = "Low multi-project risk based on current reports.";
    }

    companyLevel.push({
      company,
      risk,
      warning,
      projects: companyReports.map(r => r.project),
      detail
    });
  }

  // GC-level analysis (is this GC a bottleneck across subs?)
  const gcLevel = [];
  for (const [gc, gcReports] of gcMap.entries()) {
    const { risk, warning } = computeRisk(gcReports);

    let detail = "GC behavior across projects analyzed.";
    if (risk === "high") {
      detail = "GC appears to be a systemic bottleneck across multiple projects.";
    } else if (risk === "medium" && warning) {
      detail = "GC shows emerging slow-pay or delay patterns.";
    } else if (risk === "medium") {
      detail = "GC has moderate delay patterns.";
    } else {
      detail = "GC shows low systemic delay risk.";
    }

    gcLevel.push({
      gc,
      risk,
      warning,
      projects: gcReports.map(r => r.project),
      companies: [...new Set(gcReports.map(r => r.company))],
      detail
    });
  }

  // Owner-level analysis (is this owner a bottleneck across GCs?)
  const ownerLevel = [];
  for (const [owner, ownerReports] of ownerMap.entries()) {
    const { risk, warning } = computeRisk(ownerReports);

    let detail = "Owner behavior across projects analyzed.";
    if (risk === "high") {
      detail = "Owner appears to be a systemic bottleneck across multiple GCs.";
    } else if (risk === "medium" && warning) {
      detail = "Owner shows emerging slow-pay or funding delay patterns.";
    } else if (risk === "medium") {
      detail = "Owner has moderate delay patterns.";
    } else {
      detail = "Owner shows low systemic delay risk.";
    }

    ownerLevel.push({
      owner,
      risk,
      warning,
      projects: ownerReports.map(r => r.project),
      gcs: [...new Set(ownerReports.map(r => r.gc))],
      detail
    });
  }

  // For now, return all levels; you can decide how to use them
  return {
    companyLevel,
    gcLevel,
    ownerLevel
  };
}
