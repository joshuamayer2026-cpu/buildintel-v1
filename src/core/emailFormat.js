// src/core/emailFormat.js

// intel: formatted lookup output from formatLookupOutput()
// report: formatted report output from formatReportOutput()

export function formatLookupEmail(intel) {
  const { header, summary, factors } = intel;

  const subject = `[BuildIntel] ${header.company} – ${header.project} – ${header.riskTier.toUpperCase()} (${header.riskScore}/100)`;

  const lines = [];

  lines.push(`Company: ${header.company}`);
  lines.push(`Project: ${header.project}`);
  lines.push(`Province: ${header.province}`);
  lines.push(`Risk Tier: ${header.riskTier.toUpperCase()} (${header.riskScore}/100)`);
  lines.push(`Warning: ${header.warning ? "YES" : "No"}`);
  lines.push(`Volatility: ${header.volatility}`);
  lines.push("");
  lines.push("Summary:");
  lines.push(summary);
  lines.push("");
  lines.push("Key Factors:");
  factors.forEach(f => lines.push(`- ${f}`));

  const body = lines.join("\n");

  return { subject, body };
}

export function formatReportEmail(report) {
  const { header, summary, portfolioRiskTier, portfolioRiskScore } = normalizeReportHeader(report);

  const subject = `[BuildIntel] Portfolio Report – ${header.company} (${header.province}) – ${portfolioRiskTier.toUpperCase()} (${portfolioRiskScore}/100)`;

  const lines = [];

  // Header
  lines.push(`Company: ${header.company}`);
  lines.push(`Province: ${header.province}`);
  lines.push(`Projects Analyzed: ${header.projectsAnalyzed}`);
  lines.push(`Portfolio Risk: ${portfolioRiskTier.toUpperCase()} (${portfolioRiskScore}/100)`);
  lines.push("");
  lines.push("Summary:");
  lines.push(summary);
  lines.push("");

  // Multi-project signals (high-level)
  lines.push("Multi-Project Signals:");
  if (report.multiProjectSignals && report.multiProjectSignals.companyLevel) {
    report.multiProjectSignals.companyLevel.forEach(c => {
      lines.push(
        `- Company: ${c.company} | Risk: ${c.risk} | Warning: ${
          c.warning ? "YES" : "No"
        } | Detail: ${c.detail}`
      );
    });
  } else {
    lines.push("- None available.");
  }

  lines.push("");
  lines.push("Projects:");
  lines.push("---------");

  // Project-level blocks
  report.projects.forEach(p => {
    lines.push(`Project: ${p.project}`);
    lines.push(`GC: ${p.gc}`);
    lines.push(`Owner: ${p.owner}`);
    lines.push(`Trade: ${p.trade}`);
    lines.push(`Days Late: ${p.daysLate}`);
    lines.push(`Risk Tier: ${p.riskTier.toUpperCase()} (${p.riskScore}/100)`);
    lines.push(`Warning: ${p.warning ? "YES" : "No"}`);
    lines.push(`Volatility: ${p.volatility}`);
    lines.push("Key Factors:");
    p.factors.forEach(f => lines.push(`- ${f}`));
    lines.push("");
  });

  const body = lines.join("\n");

  return { subject, body };
}

// Helper to keep header access clean
function normalizeReportHeader(report) {
  const header = report.header || {
    company: report.company,
    province: report.province,
    projectsAnalyzed: report.portfolio?.projectsAnalyzed
  };

  const portfolioRiskTier =
    report.portfolio?.tier || header.portfolioRiskTier || "low";
  const portfolioRiskScore =
    report.portfolio?.score || header.portfolioRiskScore || 0;

  return { header, summary: report.summary, portfolioRiskTier, portfolioRiskScore };
}
