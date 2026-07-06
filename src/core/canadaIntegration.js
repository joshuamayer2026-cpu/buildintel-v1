// src/core/canadaIntegration.js

import { analyzeCanadaPromptPayment } from "./canadaPromptPayment.js";
import { analyzeCanadaWinter } from "./canadaWinter.js";
import { analyzeCCDCContractTiming } from "./ccdcTiming.js";
import { analyzeProvincialBehavior } from "./provincialProfiles.js";

export function integrateCanadaIntelligence({
  province = "",
  timestamp,
  daysLate = 0,
  excuseText = "",
  retentionMentioned = false,
  hasCertificateForPayment = false,
  baseRisk = "low",
  baseVolatility = "low",
  baseWarning = false
} = {}) {
  // -------------------------
  // 1. Load provincial profile
  // -------------------------
  const provinceProfile = analyzeProvincialBehavior(province);

  // -------------------------
  // 2. Prompt-payment adjustment
  // -------------------------
  const promptPayment = analyzeCanadaPromptPayment(province, daysLate);

  // -------------------------
  // 3. Winter severity adjustment
  // -------------------------
  const winter = analyzeCanadaWinter(timestamp, excuseText);

  // -------------------------
  // 4. CCDC contract timing adjustment
  // -------------------------
  const ccdc = analyzeCCDCContractTiming({
    province,
    daysLate,
    excuseText,
    hasCertificateForPayment,
    retentionMentioned
  });

  // -------------------------
  // 5. Merge all risk adjustments
  // -------------------------
  const riskLevels = [
    baseRisk,
    promptPayment.riskAdjustment,
    winter.riskAdjustment,
    ccdc.retentionAdjustment,
    ccdc.progressBillingAdjustment,
    ccdc.certificateAdjustment,
    provinceProfile.riskBias
  ];

  function mergeRisk(levels) {
    if (levels.includes("high")) return "high";
    if (levels.includes("medium")) return "medium";
    if (levels.includes("low")) return "low";
    return "low";
  }

  const finalRisk = mergeRisk(riskLevels);

  // -------------------------
  // 6. Merge volatility adjustments
  // -------------------------
  const volatilityLevels = [
    baseVolatility,
    winter.volatilityAdjustment,
    provinceProfile.volatilityBias
  ];

  function mergeVolatility(levels) {
    if (levels.includes("high")) return "high";
    if (levels.includes("medium")) return "medium";
    return "low";
  }

  const finalVolatility = mergeVolatility(volatilityLevels);

  // -------------------------
  // 7. Determine final warning
  // -------------------------
  const warningSignals = [
    baseWarning,
    promptPayment.warning,
    winter.warning,
    ccdc.warning
  ];

  const finalWarning = warningSignals.includes(true);

  // -------------------------
  // 8. Build final intelligence output
  // -------------------------
  return {
    province,
    finalRisk,
    finalVolatility,
    finalWarning,

    components: {
      provinceProfile,
      promptPayment,
      winter,
      ccdc
    },

    detail: `Canada integration applied for ${province}.`
  };
}
