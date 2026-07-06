import { scoreRisk } from './riskScoring.js';
import { analyzeTrend } from './trendAnalysis.js';
import { detectEarlyWarnings } from './earlyWarnings.js';

export function generatePrediction(reports) {
  const risk = scoreRisk(reports);
  const trend = analyzeTrend(reports);
  const early = detectEarlyWarnings(reports);

  if (risk.level === 'high' && (trend.trend === 'worsening' || early.triggered)) {
    return {
      prediction: 'likely_slow_pay',
      rationale: 'High risk level combined with worsening trend or recent early-warning signals.'
    };
  }

  if (risk.level === 'medium' && (trend.trend === 'worsening' || early.triggered)) {
    return {
      prediction: 'elevated_risk',
      rationale: 'Medium risk with signs of worsening behavior or recent issues.'
    };
  }

  return {
    prediction: 'normal',
    rationale: 'No strong indicators of escalating slow-pay behavior at this time.'
  };
}
