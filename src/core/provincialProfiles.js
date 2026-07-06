// src/core/provincialProfiles.js

export function analyzeProvincialBehavior(province = "") {
  const p = (province || "").toLowerCase();

  const result = {
    province,
    riskBias: "none",
    volatilityBias: "none",
    retentionBehavior: "standard",
    seasonalSeverity: "standard",
    detail: "Provincial behavior profile applied."
  };

  // -------------------------
  // ONTARIO
  // -------------------------
  if (p === "ontario") {
    result.riskBias = "medium"; // strict prompt-payment laws
    result.volatilityBias = "high"; // severe winter + busy construction market
    result.retentionBehavior = "substantial_performance_release";
    result.seasonalSeverity = "high"; // lake-effect snow + freeze-thaw cycles
    result.detail =
      "Ontario profile: strict prompt-payment, severe winter, substantial performance retention.";
    return result;
  }

  // -------------------------
  // ALBERTA
  // -------------------------
  if (p === "alberta") {
    result.riskBias = "medium"; // prompt-payment + oil/gas volatility
    result.volatilityBias = "high"; // boom/bust cycles
    result.retentionBehavior = "lien_expiry_release";
    result.seasonalSeverity = "high"; // long winter
    result.detail =
      "Alberta profile: lien-based retention, high volatility due to boom/bust cycles.";
    return result;
  }

  // -------------------------
  // BRITISH COLUMBIA
  // -------------------------
  if (p === "british columbia" || p === "bc") {
    result.riskBias = "low"; // more stable payment behavior
    result.volatilityBias = "medium"; // weather + mountainous terrain
    result.retentionBehavior = "standard";
    result.seasonalSeverity = "medium"; // milder winter except interior
    result.detail =
      "BC profile: stable payment behavior, moderate volatility, mixed seasonal severity.";
    return result;
  }

  // -------------------------
  // QUEBEC
  // -------------------------
  if (p === "quebec") {
    result.riskBias = "medium"; // union-heavy + strict regulations
    result.volatilityBias = "medium"; // regulatory delays
    result.retentionBehavior = "standard";
    result.seasonalSeverity = "high"; // harsh winter
    result.detail =
      "Quebec profile: union-heavy environment, regulatory delays, severe winter.";
    return result;
  }

  // -------------------------
  // SASKATCHEWAN
  // -------------------------
  if (p === "saskatchewan") {
    result.riskBias = "medium"; // prompt-payment + resource economy
    result.volatilityBias = "high"; // weather + resource cycles
    result.retentionBehavior = "lien_expiry_release";
    result.seasonalSeverity = "high";
    result.detail =
      "Saskatchewan profile: lien-based retention, high volatility, severe winter.";
    return result;
  }

  // -------------------------
  // MANITOBA
  // -------------------------
  if (p === "manitoba") {
    result.riskBias = "medium"; // prompt-payment
    result.volatilityBias = "medium";
    result.retentionBehavior = "standard";
    result.seasonalSeverity = "high"; // very cold winters
    result.detail =
      "Manitoba profile: prompt-payment influence, severe winter, moderate volatility.";
    return result;
  }

  // -------------------------
  // NOVA SCOTIA
  // -------------------------
  if (p === "nova scotia") {
    result.riskBias = "medium"; // prompt-payment
    result.volatilityBias = "medium"; // coastal weather
    result.retentionBehavior = "standard";
    result.seasonalSeverity = "medium"; // coastal storms
    result.detail =
      "Nova Scotia profile: coastal weather volatility, prompt-payment influence.";
    return result;
  }

  // -------------------------
  // NEW BRUNSWICK
  // -------------------------
  if (p === "new brunswick") {
    result.riskBias = "low";
    result.volatilityBias = "medium";
    result.retentionBehavior = "standard";
    result.seasonalSeverity = "medium";
    result.detail =
      "New Brunswick profile: moderate volatility, standard retention, mixed seasonal severity.";
    return result;
  }

  // -------------------------
  // DEFAULT (other provinces/territories)
  // -------------------------
  result.detail =
    "Province not recognized; standard Canadian behavior applied.";
  return result;
}
