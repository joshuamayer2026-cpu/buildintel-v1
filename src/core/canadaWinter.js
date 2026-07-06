// src/core/canadaWinter.js

export function analyzeCanadaWinter(timestamp, excuseText = "") {
  const date = new Date(timestamp);
  const month = date.getMonth() + 1; // JS months are 0-11
  const text = (excuseText || "").toLowerCase();

  const result = {
    season: "none",
    riskAdjustment: "none",
    volatilityAdjustment: "none",
    warning: false,
    detail: "No Canadian winter adjustment applied."
  };

  // Canadian winter: December–March
  if (month === 12 || month === 1 || month === 2 || month === 3) {
    result.season = "canadian_winter";

    // Risk stays low because delays are normal
    result.riskAdjustment = "low";

    // Volatility increases because weather is severe
    result.volatilityAdjustment = "high";

    // Warnings only trigger if excuse indicates extreme disruption
    const severeWeather =
      text.includes("storm") ||
      text.includes("blizzard") ||
      text.includes("whiteout") ||
      text.includes("shutdown") ||
      text.includes("freeze-up");

    if (severeWeather) {
      result.warning = true;
      result.detail =
        "Severe Canadian winter weather detected. High volatility and warning triggered.";
    } else {
      result.warning = false;
      result.detail =
        "Canadian winter conditions detected. Low risk but high volatility applied.";
    }

    return result;
  }

  return result;
}
