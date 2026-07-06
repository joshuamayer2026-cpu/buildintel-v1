// src/core/canadaPromptPayment.js

// Provinces with prompt-payment legislation
const promptPaymentProvinces = new Set([
  "ontario",
  "alberta",
  "saskatchewan",
  "manitoba",
  "nova scotia"
]);

export function analyzeCanadaPromptPayment(province = "", daysLate = 0) {
  const p = (province || "").toLowerCase();

  // Default response
  const result = {
    province,
    promptPaymentProvince: false,
    riskAdjustment: "none",
    warning: false,
    detail: "No prompt-payment adjustment applied."
  };

  // If province is not in the list, no adjustment
  if (!promptPaymentProvinces.has(p)) {
    return result;
  }

  // Province has prompt-payment laws
  result.promptPaymentProvince = true;

  // Risk logic based on lateness
  if (daysLate >= 60) {
    result.riskAdjustment = "high";
    result.warning = true;
    result.detail =
      "Severe delay in a prompt-payment province. High risk adjustment applied.";
    return result;
  }

  if (daysLate >= 30) {
    result.riskAdjustment = "medium";
    result.warning = true;
    result.detail =
      "Moderate delay in a prompt-payment province. Medium risk adjustment applied.";
    return result;
  }

  if (daysLate >= 15) {
    result.riskAdjustment = "low";
    result.warning = false;
    result.detail =
      "Minor delay in a prompt-payment province. Low risk adjustment applied.";
    return result;
  }

  // Very small delays are normal
  result.riskAdjustment = "none";
  result.warning = false;
  result.detail =
    "Delay within acceptable range for prompt-payment province.";

  return result;
}
