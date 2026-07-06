export function average(nums) {
  if (!nums.length) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

export function variance(nums) {
  if (nums.length < 2) return 0;
  const avg = average(nums);
  const sqDiffs = nums.map(n => (n - avg) ** 2);
  return average(sqDiffs);
}

export function daysBetween(a, b) {
  const d1 = new Date(a);
  const d2 = new Date(b);
  return Math.abs((d2 - d1) / (1000 * 60 * 60 * 24));
}
