import fs from 'fs-extra';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), 'data', 'reports.json');

export async function loadReports() {
  try {
    const exists = await fs.pathExists(DATA_PATH);
    if (!exists) {
      await fs.writeJson(DATA_PATH, []);
      return [];
    }
    const data = await fs.readJson(DATA_PATH);
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error('Error loading reports:', err);
    return [];
  }
}

export async function saveReport(report) {
  try {
    const reports = await loadReports();
    reports.push(report);
    await fs.writeJson(DATA_PATH, reports, { spaces: 2 });
    return report;
  } catch (err) {
    console.error('Error saving report:', err);
    throw err;
  }
}
