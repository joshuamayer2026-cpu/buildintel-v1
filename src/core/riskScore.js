// src/core/riskScore.js

// risk: "low" | "medium" | "high"
// volatility: "low" | "medium" | "high"
// warning: boolean
// daysLate: number
// multiProjectSignals: optional object from multiProject.js
// canadaIntegration: optional object from canadaIntegration.js

export function computeRiskScore({
  risk = "low",
  volatility = "low",
  warning = false,
  daysLate = 0,
  multiProjectSignals = null,
  canadaIntegration = null
} = {}) {
  let score = 0;
  const factors = [];

  // 1. Base risk
  if (risk === "low") {
    score += 20;
    factors.push("Base risk: low");
  } else if (risk === "medium") {
    score += 50;
    factors.push("Base risk: medium");
  } else if (risk === "high") {
    score += 80;
    factors.push("Base risk: high");
  }

  // 2. Volatility
  if (volatility === "medium") {
    score += 10;
    factors.push("Volatility: medium");
  } else if (volatility === "high") {
    score += 20;
    factors.push("Volatility: high");
  }

  // 3. Warning flag
  if (warning) {
    score += 20;
    factors.push("Warning: true");
  }

  // 4. Days late
  if (daysLate >= 90) {
    score += 30;
    factors.push("Days late: 90+");
  } else if (daysLate >= 60) {
    score += 20;
    factors.push("Days late: 60+");
  } else if (daysLate >= 30) {
    score += 10;
    factors.push("Days late: 30+");
  }

  // 5. Multi-project signals (systemic risk)
  if (multiProjectSignals) {
    const { companyLevel = [], gcLevel = [], ownerLevel = [] } =
      multiProjectSignals;

    const highCompany = companyLevel.some(c => c.risk === "high");
    const highGC = gcLevel.some(g => g.risk === "high");
    const highOwner = ownerLevel.some(o => o.risk === "high");

    if (highCompany) {
      score += 25;
      factors.push("Systemic company risk: high");
    }
    if (highGC) {
      score += 15;
      factors.push("Systemic GC risk: high");
    }
    if (highOwner) {
      score += 15;
      factors.push("Systemic owner risk: high");
    }
  }

  // 6. Canada integration (finalRisk/finalVolatility/finalWarning)
  if (canadaIntegration) {
    const { finalRisk, finalVolatility, finalWarning, province } =
      canadaIntegration;

    if (finalRisk === "medium") {
      score += 10;
      factors.push(`Canada risk adjustment (province: ${province}): medium`);
    } else if (finalRisk === "high") {
      score += 25;
      factors.push(`Canada risk adjustment (province: ${province}): high`);
    }

    if (finalVolatility === "high") {
      score += 10;
      factors.push(`Canada volatility adjustment (province: ${province}): high`);
    }

    if (finalWarning) {
      score += 10;
      factors.push(`Canada warning adjustment (province: ${province}): true`);
    }
  }

  // Clamp score
  if (score < 0) score = 0;
  if (score > 100) score = 100;

  // Tiering
  let tier = "low";
  if (score >= 70) tier = "high";
  else if (score >= 40) tier = "medium";

  return {
    score,
    tier,
    factors
  };
}
