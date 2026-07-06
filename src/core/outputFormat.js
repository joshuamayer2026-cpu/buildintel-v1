// src/core/outputFormat.js

export function formatLookupOutput(intel) {
  return {
    header: {
      company: intel.company,
      project: intel.project,
      province: intel.province,
      riskTier: intel.riskTier,
      riskScore: intel.riskScore,
      warning: intel.warning,
      volatility: intel.volatility
    },

    summary: buildLookupSummary(intel),

    factors: intel.factors,

    modules: intel.modules
  };
}

export function formatReportOutput(report) {
  return {
    header: {
      company: report.company,
      province: report.province,
      projectsAnalyzed: report.portfolio.projectsAnalyzed,
      portfolioRiskTier: report.portfolio.tier,
      portfolioRiskScore: report.portfolio.score
    },

    summary: buildReportSummary(report),

    multiProjectSignals: report.multiProjectSignals,

    projects: report.projects.map(p => ({
      project: p.project,
      gc: p.gc,
      owner: p.owner,
      trade: p.trade,
      daysLate: p.daysLate,
      riskTier: p.riskTier,
      riskScore: p.riskScore,
      warning: p.warning,
      volatility: p.volatility,
      factors: p.factors,
      modules: p.modules
    }))
  };
}

function buildLookupSummary(intel) {
  const parts = [];

  parts.push(`Risk Tier: ${intel.riskTier.toUpperCase()} (${intel.riskScore}/100)`);

  if (intel.warning) {
    parts.push("⚠️ Warning triggered due to Canada-specific conditions.");
  }

  if (intel.volatility === "high") {
    parts.push("High volatility detected (seasonality, provincial behavior, or GC/owner flow).");
  }

  parts.push(`Province: ${intel.province}`);

  return parts.join(" | ");
}

function buildReportSummary(report) {
  const parts = [];

  parts.push(
    `Portfolio Risk: ${report.portfolio.tier.toUpperCase()} (${report.portfolio.score}/100)`
  );

  parts.push(`Projects analyzed: ${report.portfolio.projectsAnalyzed}`);

  const highRiskProjects = report.projects.filter(p => p.riskTier === "high");

  if (highRiskProjects.length > 0) {
    parts.push(
      `High-risk projects: ${highRiskProjects
        .map(p => p.project)
        .join(", ")}`
    );
  }

  return parts.join(" | ");
}
