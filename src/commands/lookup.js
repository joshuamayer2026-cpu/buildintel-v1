// src/commands/lookup.js

// CORE MODULE IMPORTS
import { analyzeExcuse } from "../core/excuseAnalysis.js";
import { analyzeGCFlow } from "../core/gcOwnerFlow.js";
import { analyzeRetention } from "../core/retentionProgress.js";
import { analyzeChangeOrders } from "../core/changeOrderAnalysis.js";
import { analyzeSeasonality } from "../core/seasonality.js";
import { analyzeTradeBehavior } from "../core/tradeBehavior.js";
import { analyzeMultiProjectBehavior } from "../core/multiProject.js";

// CANADA-SPECIFIC IMPORTS
import { integrateCanadaIntelligence } from "../core/canadaIntegration.js";

// RISK SCORING IMPORT
import { computeRiskScore } from "../core/riskScore.js";

// OUTPUT FORMATTING
import { formatLookupOutput } from "../core/outputFormat.js";

export async function runLookup(report) {
  if (!report || typeof report !== "object") {
    throw new Error("runLookup: report object is required.");
  }

  // 1. Run core modules
  const excuse = analyzeExcuse(report.excuseText || "", report.daysLate || 0);
  const gcOwner = analyzeGCFlow(report.gc || "", report.owner || "");
  const retention = analyzeRetention(report.retention || {}, report.daysLate || 0);
  const changeOrders = analyzeChangeOrders(report.excuseText || "", report.daysLate || 0);
  const seasonality = analyzeSeasonality(report.timestamp, report.excuseText || "");
  const trade = analyzeTradeBehavior(report.trade || "");
  const multiProject = analyzeMultiProjectBehavior(report.companyReports || []);

  // 2. Canada integration
  const canada = integrateCanadaIntelligence({
    province: report.province || "",
    timestamp: report.timestamp,
    daysLate: report.daysLate || 0,
    excuseText: report.excuseText || "",
    retentionMentioned: report.retentionMentioned || false,
    hasCertificateForPayment: report.hasCertificateForPayment || false,
    baseRisk: excuse.risk,
    baseVolatility: excuse.volatility,
    baseWarning: excuse.warning
  });

  // 3. Unified risk scoring
  const riskScore = computeRiskScore({
    risk: canada.finalRisk,
    volatility: canada.finalVolatility,
    warning: canada.finalWarning,
    daysLate: report.daysLate || 0,
    multiProjectSignals: multiProject,
    canadaIntegration: canada
  });

  // 4. Build unified raw output
  const raw = {
    company: report.company || "Unknown company",
    project: report.project || "Unknown project",
    province: report.province || "Unknown province",

    riskTier: riskScore.tier,
    riskScore: riskScore.score,
    factors: riskScore.factors,

    warning: canada.finalWarning,
    volatility: canada.finalVolatility,

    modules: {
      excuse,
      gcOwner,
      retention,
      changeOrders,
      seasonality,
      trade,
      multiProject,
      canada
    }
  };

  // 5. Format final output
  return formatLookupOutput(raw);
}
