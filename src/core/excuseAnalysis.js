// src/core/excuseAnalysis.js

export function analyzeExcuse(excuseText = "") {
  if (!excuseText || excuseText.trim().length === 0) {
    return {
      category: "none",
      risk: "none",
      warning: false,
      detail: "No excuse provided."
    };
  }

  const text = excuseText.toLowerCase();

  // CATEGORY: Upstream (GC/Owner delays)
  if (text.includes("gc") || text.includes("general contractor") || text.includes("owner")) {
    return {
      category: "upstream_delay",
      risk: "medium",
      warning: true,
      detail: "Payment delayed due to GC/Owner bottleneck."
    };
  }

  // CATEGORY: Financing / Bank issues
  if (text.includes("financing") || text.includes("bank") || text.includes("loan")) {
    return {
      category: "financing_issue",
      risk: "high",
      warning: true,
      detail: "Company experiencing financing or liquidity issues."
    };
  }

  // CATEGORY: Internal admin delays
  if (text.includes("accounting") || text.includes("paperwork") || text.includes("admin")) {
    return {
      category: "internal_delay",
      risk: "medium",
      warning: false,
      detail: "Internal administrative delays reported."
    };
  }

  // CATEGORY: Avoidance behavior
  if (text.includes("check is in the mail") || text.includes("mailed the check")) {
    return {
      category: "avoidance",
      risk: "high",
      warning: true,
      detail: "Classic avoidance behavior detected."
    };
  }

  // CATEGORY: Invoice review / stalling
  if (text.includes("reviewing") || text.includes("under review") || text.includes("checking quantities")) {
    return {
      category: "stalling",
      risk: "medium",
      warning: true,
      detail: "Invoice review used as a stalling tactic."
    };
  }

  // CATEGORY: Weather / seasonal
  if (text.includes("weather") || text.includes("rain") || text.includes("snow") || text.includes("winter")) {
    return {
      category: "seasonal",
      risk: "low",
      warning: false,
      detail: "Seasonal or weather-related delay."
    };
  }

  // CATEGORY: Change orders
  if (text.includes("change order") || text.includes("change-order")) {
    return {
      category: "change_order",
      risk: "medium",
      warning: true,
      detail: "Change-order approval or pricing delays."
    };
  }

  // CATEGORY: Retention
  if (text.includes("retention") || text.includes("holdback")) {
    return {
      category: "retention",
      risk: "low",
      warning: false,
      detail: "Retention-related delay (normal in construction)."
    };
  }

  // CATEGORY: Supplier / material delays
  if (text.includes("supplier") || text.includes("material") || text.includes("delivery")) {
    return {
      category: "supply_chain",
      risk: "high",
      warning: true,
      detail: "Supplier or material-related delay."
    };
  }

  // DEFAULT: Unknown excuse
  return {
    category: "unknown",
    risk: "medium",
    warning: false,
    detail: "Excuse not recognized; default medium risk applied."
  };
}
