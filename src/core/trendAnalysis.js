import { average } from '../utils/math.js';

export function analyzeTrend(reports) {
  if (reports.length < 2) {
    return { trend: 'insufficient_data', detail: 'Not enough reports to determine trend.' };
  }

  const sorted = [...reports].sort(
    (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
  );

  const firstHalf = sorted.slice(0, Math.floor(sorted.length / 2));
  const secondHalf = sorted.slice(Math.floor(sorted.length / 2));

  const avgFirst = average(firstHalf.map(r => r.daysLate));
  const avgSecond = average(secondHalf.map(r => r.daysLate));

  if (avgSecond > avgFirst + 5) {
    return { trend: 'worsening', detail: `Average delay increased from ${avgFirst.toFixed(1)} to ${avgSecond.toFixed(1)} days.` };
  }
  if (avgSecond < avgFirst - 5) {
    return { trend: 'improving', detail: `Average delay decreased from ${avgFirst.toFixed(1)} to ${avgSecond.toFixed(1)} days.` };
  }

  return { trend: 'stable', detail: `Average delay is relatively stable around ${avgSecond.toFixed(1)} days.` };
}
