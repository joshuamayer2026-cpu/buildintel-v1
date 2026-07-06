// src/core/changeOrderAnalysis.js

export function analyzeChangeOrders(excuseText = "", daysLate = 0) {
  const text = (excuseText || "").toLowerCase();

  const result = {
    changeOrderInvolved: false,
    type: "none",
    risk: "none",
    volatility: "none",
    warning: false,
    detail: "No change-order related delay detected."
  };

  // Detect any mention of change orders
  if (
    text.includes("change order") ||
    text.includes("change-order") ||
    text.includes("co #") ||
    text.includes("co#") ||
    text.includes("change request")
  ) {
    result.changeOrderInvolved = true;
  } else {
    return result; // No change-order signals
  }

  // 1. APPROVAL DELAYS
  if (
    text.includes("waiting for approval") ||
    text.includes("not approved") ||
    text.includes("pending approval") ||
    text.includes("awaiting approval")
  ) {
    result.type = "approval_delay";
    result.risk = "medium";
    result.volatility = "medium";
    result.warning = true;
    result.detail = "Change-order approval delay detected.";
    return result;
  }

  // 2. PRICING DISPUTES
  if (
    text.includes("pricing") ||
    text.includes("price dispute") ||
    text.includes("cost dispute") ||
    text.includes("negotiating price") ||
    text.includes("disagreement")
  ) {
    result.type = "pricing_dispute";
    result.risk = "medium";
    result.volatility = "high";
    result.warning = true;
    result.detail = "Change-order pricing dispute detected.";
    return result;
  }

  // 3. CHANGE-ORDER BACKLOG
  if (
    text.includes("multiple change orders") ||
    text.includes("co backlog") ||
    text.includes("backlog") ||
    text.includes("several change orders")
  ) {
    result.type = "backlog";
    result.risk = "medium";
    result.volatility = "high";
    result.warning = true;
    result.detail = "Multiple change orders stuck in backlog.";
    return result;
  }

  // 4. BILLING DELAYS
  if (
    text.includes("not billed") ||
    text.includes("billing delay") ||
    text.includes("waiting to bill") ||
    text.includes("not invoiced")
  ) {
    result.type = "billing_delay";
    result.risk = "medium";
    result.volatility = "high";
    result.warning = true;
    result.detail = "Change-order billing delay detected.";
    return result;
  }

  // DEFAULT: Change order mentioned but unclear
  result.type = "unknown";
  result.risk = "medium";
  result.volatility = "medium";
  result.warning = false;
  result.detail = "Change-order mentioned but type unclear.";

  return result;
}
