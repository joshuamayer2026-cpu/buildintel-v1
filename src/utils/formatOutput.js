export function formatLookupOutput(company, reports, trend, risk, volatility, early, prediction) {
  const totalReports = reports.length;
  const lastReport = reports
    .slice()
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];

  return {
    company,
    summary: {
      totalReports,
      lastReport: lastReport || null
    },
    sections: {
      trend,
      risk,
      volatility,
      earlyWarnings: early,
      prediction
    }
  };
}
