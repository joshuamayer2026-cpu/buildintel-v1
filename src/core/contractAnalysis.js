// src/core/contractAnalysis.js

export function analyzeContractFactors(excuseText = "", daysLate = 0) {
  const text = (excuseText || "").toLowerCase();

  // Default response
  const result = {
    retention: {
      involved: false,
      risk: "none",
      warning: false,
      detail: "No retention-related delay detected."
    },
    progressBilling: {
      involved: false,
      risk: "none",
      warning: false,
      detail: "No progress-billing delay detected."
    },
    combinedRisk: "none",
    combinedWarning: false
  };

  // RETENTION DETECTION
  if (
    text.includes("retention") ||
    text.includes("holdback") ||
    text.includes("retainage")
  ) {
    result.retention.involved = true;

    // Retention delays are normal unless extreme
    if (daysLate >= 120) {
      result.retention.risk = "medium";
      result.retention.warning = true;
      result.retention.detail = "Retention delay is unusually long (120+ days).";
    } else {
      result.retention.risk = "low";
      result.retention.warning = false;
      result.retention.detail = "Retention-related delay (normal in construction).";
    }
  }

  // PROGRESS BILLING DETECTION
  if (
    text.includes("progress billing") ||
    text.includes("progress payment") ||
    text.includes("milestone") ||
    text.includes("phase") ||
    text.includes("draw") && !text.includes("owner")
  ) {
    result.progressBilling.involved = true;

    // Progress billing delays increase volatility, not risk
    if (daysLate >= 45) {
      result.progressBilling.risk = "medium";
      result.progressBilling.warning = true;
      result.progressBilling.detail =
        "Progress billing milestone delay is significant (45+ days).";
    } else {
      result.progressBilling.risk = "low";
      result.progressBilling.warning = false;
      result.progressBilling.detail =
        "Progress billing delay detected (normal milestone transition).";
    }
  }

  // COMBINED RISK LOGIC
  const risks = [result.retention.risk, result.progressBilling.risk];

  if (risks.includes("medium")) {
    result.combinedRisk = "medium";
    result.combinedWarning = true;
  } else if (risks.includes("low")) {
    result.combinedRisk = "low";
    result.combinedWarning = false;
  }

  return result;
}
