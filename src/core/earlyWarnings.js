import { daysBetween } from '../utils/math.js';

export function detectEarlyWarnings(reports) {
  if (!reports.length) {
    return { triggered: false, reason: 'No reports available.' };
  }

  const now = new Date();
  const recent = reports.filter(r => daysBetween(r.timestamp, now.toISOString()) <= 30);

  const highRecent = recent.filter(r => r.daysLate >= 30);

  const triggered = recent.length >= 2 || highRecent.length >= 1;

  let reason;
  if (!triggered) {
    reason = 'No recent cluster of slow-pay events detected in the last 30 days.';
  } else {
    reason = `Detected ${recent.length} report(s) in the last 30 days, ${highRecent.length} with delays ≥ 30 days.`;
  }

  return { triggered, reason };
}
