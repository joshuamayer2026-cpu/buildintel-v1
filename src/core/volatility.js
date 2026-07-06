import { variance } from '../utils/math.js';

export function analyzeVolatility(reports) {
  if (reports.length < 2) {
    return { volatility: 'low', detail: 'Not enough data to measure volatility.' };
  }

  const delays = reports.map(r => r.daysLate);
  const v = variance(delays);

  let volatility = 'low';
  if (v > 50) volatility = 'high';
  else if (v > 15) volatility = 'medium';

  return {
    volatility,
    detail: `Variance in delays is ${v.toFixed(1)} (higher = more inconsistent payment behavior).`
  };
}
