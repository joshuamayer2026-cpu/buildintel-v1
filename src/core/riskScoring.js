import { average } from '../utils/math.js';

export function scoreRisk(reports) {
  if (!reports.length) {
    return { level: 'unknown', reason: 'No reports available.' };
  }

  const avgDelay = average(reports.map(r => r.daysLate));
  const maxDelay = Math.max(...reports.map(r => r.daysLate));

  let level = 'low';
  let reason = `Average delay ${avgDelay.toFixed(1)} days, max ${maxDelay} days.`;

  if (avgDelay >= 15 || maxDelay >= 30) {
    level = 'medium';
  }
  if (avgDelay >= 30 || maxDelay >= 60) {
    level = 'high';
  }

  return { level, reason };
}
