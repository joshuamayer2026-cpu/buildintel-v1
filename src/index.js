import { handleReport } from './commands/report.js';
import { handleLookup } from './commands/lookup.js';

// Simple CLI-style runner for now

async function main() {
  const [,, cmd, ...args] = process.argv;

  if (cmd === 'report') {
    const [company, project, daysLateStr, timestamp] = args;
    const daysLate = Number(daysLateStr);

    const res = await handleReport({ company, project, daysLate, timestamp });
    console.log(JSON.stringify(res, null, 2));
    return;
  }

  if (cmd === 'lookup') {
    const [company] = args;
    const res = await handleLookup(company);
    console.log(JSON.stringify(res, null, 2));
    return;
  }

  console.log('Usage:');
  console.log('  node src/index.js report <company> <project> <daysLate> <timestamp>');
  console.log('  node src/index.js lookup <company>');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
