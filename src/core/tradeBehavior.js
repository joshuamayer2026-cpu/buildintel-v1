// src/core/tradeBehavior.js

export function analyzeTradeBehavior(trade = "") {
  const t = (trade || "").toLowerCase();

  const result = {
    trade: trade || "unknown",
    risk: "none",
    volatility: "none",
    warning: false,
    detail: "Trade not recognized."
  };

  // CONCRETE / FOUNDATIONS
  if (
    t.includes("concrete") ||
    t.includes("foundation") ||
    t.includes("forming")
  ) {
    result.risk = "low";
    result.volatility = "low";
    result.warning = false;
    result.detail = "Concrete trade: predictable billing and low volatility.";
    return result;
  }

  // ELECTRICAL
  if (t.includes("electrical") || t.includes("electrician")) {
    result.risk = "medium";
    result.volatility = "medium";
    result.warning = true;
    result.detail =
      "Electrical trade: milestone-heavy with inspection-driven delays.";
    return result;
  }

  // HVAC / MECHANICAL
  if (
    t.includes("hvac") ||
    t.includes("mechanical") ||
    t.includes("air") ||
    t.includes("ventilation")
  ) {
    result.risk = "medium";
    result.volatility = "high";
    result.warning = true;
    result.detail =
      "HVAC/Mechanical trade: change-order heavy and scope-complex.";
    return result;
  }

  // PLUMBING
  if (t.includes("plumbing") || t.includes("plumber")) {
    result.risk = "medium";
    result.volatility = "medium";
    result.warning = true;
    result.detail =
      "Plumbing trade: inspection-dependent with moderate volatility.";
    return result;
  }

  // ROOFING
  if (t.includes("roof") || t.includes("roofing")) {
    result.risk = "medium";
    result.volatility = "high";
    result.warning = true;
    result.detail =
      "Roofing trade: highly weather-dependent with seasonal delays.";
    return result;
  }

  // FRAMING / CARPENTRY
  if (
    t.includes("framing") ||
    t.includes("carpentry") ||
    t.includes("carpenter")
  ) {
    result.risk = "low";
    result.volatility = "low";
    result.warning = false;
    result.detail =
      "Framing/Carpentry trade: fast-paced and predictable billing.";
    return result;
  }

  // FINISHING TRADES
  if (
    t.includes("drywall") ||
    t.includes("paint") ||
    t.includes("flooring") ||
    t.includes("tile") ||
    t.includes("finishing")
  ) {
    result.risk = "low";
    result.volatility = "medium";
    result.warning = false;
    result.detail =
      "Finishing trade: retention-heavy and end-of-project billing.";
    return result;
  }

  // SITEWORK / EXCAVATION
  if (
    t.includes("sitework") ||
    t.includes("excavation") ||
    t.includes("earthwork") ||
    t.includes("grading")
  ) {
    result.risk = "medium";
    result.volatility = "high";
    result.warning = true;
    result.detail =
      "Sitework trade: weather-dependent and equipment-heavy.";
    return result;
  }

  // SPECIALTY TRADES
  if (
    t.includes("fire protection") ||
    t.includes("low voltage") ||
    t.includes("glazing") ||
    t.includes("specialty")
  ) {
    result.risk = "medium";
    result.volatility = "medium";
    result.warning = true;
    result.detail =
      "Specialty trade: approval-heavy and coordination-intensive.";
    return result;
  }

  // DEFAULT
  result.risk = "medium";
  result.volatility = "medium";
  result.warning = false;
  result.detail = "Trade not recognized; default medium risk applied.";
  return result;
}
