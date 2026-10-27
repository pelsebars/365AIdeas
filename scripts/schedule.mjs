import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {appendFileSync} from 'node:fs';

// GitHub cron is UTC; two UTC slots cover Copenhagen's standard and summer time.
// Evaluate the event timestamp, not runner start time, so queue delay is harmless.
export function shouldRun(event, timestamp = new Date()) {
  if (event === 'workflow_dispatch') return true;
  if (event !== 'schedule') return false;
  const date = new Date(timestamp);
  if (!Number.isFinite(date.getTime())) throw Error('Ugyldigt eventtidspunkt');
  const hour = new Intl.DateTimeFormat('en-GB', {timeZone: 'Europe/Copenhagen', hour: '2-digit', hourCycle: 'h23'}).format(date);
  return hour === '06';
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const run = shouldRun(process.env.GITHUB_EVENT_NAME, process.env.EVENT_CREATED_AT || new Date());
  if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `run=${run}\n`);
  console.log(run ? 'Kørsel tilladt for dette tidspunkt.' : 'Spring den alternative UTC-slot over.');
}
