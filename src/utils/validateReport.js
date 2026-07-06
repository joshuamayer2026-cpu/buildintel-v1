export function validateReport(payload) {
  const { company, project, daysLate, timestamp } = payload;

  if (!company || typeof company !== 'string') {
    return { valid: false, error: 'company must be a non-empty string' };
  }
  if (!project || typeof project !== 'string') {
    return { valid: false, error: 'project must be a non-empty string' };
  }
  if (typeof daysLate !== 'number' || daysLate < 0) {
    return { valid: false, error: 'daysLate must be a non-negative number' };
  }
  if (!timestamp || isNaN(Date.parse(timestamp))) {
    return { valid: false, error: 'timestamp must be a valid ISO date string' };
  }

  return { valid: true, error: null };
}
