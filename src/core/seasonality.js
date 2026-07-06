// src/core/seasonality.js

export function analyzeSeasonality(timestamp, excuseText = "") {
  const date = new Date(timestamp);
  const month = date.getMonth() + 1; // JS months are 0-11
  const text = (excuseText || "").toLowerCase();

  const result = {
    season: "unknown",
    risk: "none",
    volatility: "none",
    warning: false,
    detail: "No seasonal pattern detected."
  };

  // WINTER: December–February
  if (month === 12 || month === 1 || month === 2) {
    result.season = "winter";
    result.risk = "low";
    result.volatility = "medium";
    result.warning = false;
    result.detail = "Winter slowdown: weather delays and reduced activity are normal.";

    // Weather excuse boosts seasonal signal
    if (
      text.includes("weather") ||
      text.includes("snow") ||
      text.includes("cold") ||
      text.includes("freeze")
    ) {
      result.detail = "Winter weather delay detected.";
    }

    return result;
  }

  // SPRING: March–May
  if (month === 3 || month === 4 || month === 5) {
    result.season = "spring";
    result.risk = "medium";
    result.volatility = "high";
    result.warning = true;
    result.detail = "Spring mobilization: cash-flow compression and startup delays common.";
    return result;
  }

  // SUMMER: June–August
  if (month === 6 || month === 7 || month === 8) {
    result.season = "summer";
    result.risk = "medium";
    result.volatility = "high";
    result.warning = true;
    result.detail = "Summer overextension: labor shortages and project overload common.";
    return result;
  }

  // FALL: September–November
  if (month === 9 || month === 10 || month === 11) {
    result.season = "fall";
    result.risk = "medium";
    result.volatility = "medium";
    result.warning = true;
    result.detail = "Fall budget exhaustion: payment delays increase as projects close out.";
    return result;
  }

  return result;
}
