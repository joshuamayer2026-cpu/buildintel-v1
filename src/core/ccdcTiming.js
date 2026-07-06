// src/core/ccdcTiming.js

export function analyzeCCDCContractTiming({
  province = "",
  daysLate = 0,
  excuseText = "",
  hasCertificateForPayment = false,
  retentionMentioned = false
} = {}) {
  const p = (province || "").toLowerCase();
  const text = (excuseText || "").toLowerCase();

  const result = {
    province,
    ccdcRegion: false,
    retentionAdjustment: "none",
    progressBillingAdjustment: "none",
    certificateAdjustment: "none",
    warning: false,
    detail: "No CCDC timing adjustments applied."
  };

  // Provinces using CCDC heavily
  const ccdcProvinces = new Set([
    "ontario",
    "alberta",
    "saskatchewan",
    "manitoba",
    "british columbia",
    "nova scotia",
    "new brunswick"
  ]);

  if (!ccdcProvinces.has(p)) {
    return result; // No CCDC adjustments needed
  }

  result.ccdcRegion = true;

  // -------------------------
  // 1. RETENTION TIMING LOGIC
  // -------------------------
  if (retentionMentioned || text.includes("retention") || text.includes("holdback")) {
    // Ontario: retention released at substantial performance
    if (p === "ontario") {
      if (daysLate >= 120) {
        result.retentionAdjustment = "medium";
        result.warning = true;
        result.detail =
          "Ontario CCDC retention delay beyond substantial performance. Medium risk.";
      } else {
        result.retentionAdjustment = "low";
        result.detail =
          "Ontario CCDC retention delay within normal range.";
      }
    }

    // Alberta / Saskatchewan: retention tied to lien expiry
    else if (p === "alberta" || p === "saskatchewan") {
      if (daysLate >= 60) {
        result.retentionAdjustment = "medium";
        result.warning = true;
        result.detail =
          "Retention delay beyond lien expiry period. Medium risk.";
      } else {
        result.retentionAdjustment = "low";
        result.detail =
          "Retention delay within lien expiry norms.";
      }
    }

    // Other provinces: default CCDC retention logic
    else {
      if (daysLate >= 90) {
        result.retentionAdjustment = "medium";
        result.warning = true;
        result.detail =
          "Retention delay beyond typical CCDC norms. Medium risk.";
      } else {
        result.retentionAdjustment = "low";
        result.detail =
          "Retention delay within typical CCDC norms.";
      }
    }
  }

  // ------------------------------------
  // 2. PROGRESS BILLING / DRAW CYCLE LOGIC
  // ------------------------------------
  if (
    text.includes("progress billing") ||
    text.includes("progress payment") ||
    text.includes("draw") ||
    text.includes("milestone")
  ) {
    if (daysLate >= 45) {
      result.progressBillingAdjustment = "medium";
      result.warning = true;
      result.detail =
        "CCDC draw cycle delay beyond 45 days. Medium risk.";
    } else {
      result.progressBillingAdjustment = "low";
      result.detail =
        "CCDC draw cycle delay within normal certification/payment timelines.";
    }
  }

  // ------------------------------------
  // 3. CERTIFICATE FOR PAYMENT DELAYS
  // ------------------------------------
  if (hasCertificateForPayment || text.includes("certificate for payment")) {
    if (daysLate >= 30) {
      result.certificateAdjustment = "medium";
      result.warning = true;
      result.detail =
        "Certificate for Payment delay beyond 30 days. Medium risk.";
    } else {
      result.certificateAdjustment = "low";
      result.detail =
        "Certificate for Payment delay within normal CCDC approval timelines.";
    }
  }

  return result;
}
