// src/commands/report.js

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
import { formatReportOutput } from "../core/outputFormat.js";

export async function runReport(report) {
  if (!report || typeof report !== "object") {
    throw new Error("runReport: report object is required.");
  }

  const { company, province, projects = [] } = report;

  if (!Array.isArray(projects) || projects.length === 0) {
    throw new Error("runReport: projects[] is required.");
  }

  // 1. Multi-project signals
  const multiProjectSignals = analyzeMultiProjectBehavior(
    projects.map(p => ({
      company,
      project: p.project,
      gc: p.gc,
      owner: p.owner,
      daysLate: p.daysLate,
      risk: "medium",
      warning: false
    }))
  );

  // 2. Analyze each project
  const projectResults = [];

  for (const p of projects) {
    const excuse = analyzeExcuse(p.excuseText || "", p.daysLate || 0);
    const gcOwner = analyzeGCFlow(p.gc || "", p.owner || "");
    const retention = analyzeRetention(p.retention || {}, p.daysLate || 0);
    const changeOrders = analyzeChangeOrders(p.excuseText || "", p.daysLate || 0);
    const seasonality = analyzeSeasonality(p.timestamp, p.excuseText || "");
    const trade = analyzeTradeBehavior(p.trade || "");

    const canada = integrateCanadaIntelligence({
      province,
      timestamp: p.timestamp,
      daysLate: p.daysLate || 0,
      excuseText: p.excuseText || "",
      retentionMentioned: p.retentionMentioned || false,
      hasCertificateForPayment: p.hasCertificateForPayment || false,
      baseRisk: excuse.risk,
      baseVolatility: excuse.volatility,
      baseWarning: excuse.warning
    });

    const riskScore = computeRiskScore({
      risk: canada.finalRisk,
      volatility: canada.finalVolatility,
      warning: canada.finalWarning,
      daysLate: p.daysLate || 0,
      multiProjectSignals,
      canadaIntegration: canada
    });

    projectResults.push({
      project: p.project,
      gc: p.gc,
      owner: p.owner,
      trade: p.trade,
      daysLate: p.daysLate,

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
        canada
      }
    });
  }

  // 3. Portfolio-level risk
  const portfolioRisk = (() => {
    const scores = projectResults.map(p => p.riskScore);
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;

    let tier = "low";
    if (avg >= 70) tier = "high";
    else if (avg >= 40) tier = "medium";

    return {
      score: Math.round(avg),
      tier,
      projectsAnalyzed: projects.length
    };
  })();

  // 4. Build raw report output
  const raw = {
    company,
    province,
    portfolio: portfolioRisk,
    multiProjectSignals,
    projects: projectResults
  };

  // 5. Format final output
  return formatReportOutput(raw);
}
