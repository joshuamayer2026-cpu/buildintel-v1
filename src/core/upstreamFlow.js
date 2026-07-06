// src/core/upstreamFlow.js

export function analyzeUpstreamFlow(excuseText = "") {
  if (!excuseText || excuseText.trim().length === 0) {
    return {
      upstream: "none",
      risk: "none",
      warning: false,
      detail: "No upstream payment issue detected."
    };
  }

  const text = excuseText.toLowerCase();

  // OWNER DELAYS
  if (
    text.includes("owner") ||
    text.includes("client") ||
    text.includes("developer") ||
    text.includes("lender") ||
    text.includes("bank") && text.includes("release")
  ) {
    return {
      upstream: "owner_delay",
      risk: "medium",
      warning: true,
      detail: "Owner-side payment bottleneck detected. GC likely impacted."
    };
  }

  // GC DELAYS
  if (
    text.includes("gc") ||
    text.includes("general contractor") ||
    text.includes("prime contractor") ||
    text.includes("waiting on gc") ||
    text.includes("gc hasn't paid")
  ) {
    return {
      upstream: "gc_delay",
      risk: "medium",
      warning: true,
      detail: "GC-side payment bottleneck detected. Subcontractor likely impacted."
    };
  }

  // ARCHITECT / ENGINEER APPROVAL DELAYS
  if (
    text.includes("architect") ||
    text.includes("engineer") ||
    text.includes("approval") ||
    text.includes("certificate for payment")
  ) {
    return {
      upstream: "design_approval_delay",
      risk: "medium",
      warning: true,
      detail: "Architect/Engineer approval delay detected. Payment flow disrupted."
    };
  }

  // DRAW CYCLE DELAYS
  if (
    text.includes("draw") ||
    text.includes("draw cycle") ||
    text.includes("funds not released") ||
    text.includes("waiting on draw")
  ) {
    return {
      upstream: "draw_cycle_delay",
      risk: "medium",
      warning: true,
      detail: "Draw cycle delay detected. Payment flow temporarily stalled."
    };
  }

  // BANK / FINANCING ISSUES (CRITICAL)
  if (
    text.includes("bank") ||
    text.includes("financing") ||
    text.includes("loan") ||
    text.includes("funding issue")
  ) {
    return {
      upstream: "financing_issue",
      risk: "high",
      warning: true,
      detail: "Financing or liquidity issue detected. High risk of cascading delays."
    };
  }

  // DEFAULT CATCH-ALL
  return {
    upstream: "unknown",
    risk: "medium",
    warning: false,
    detail: "Upstream issue not recognized; default medium risk applied."
  };
}
