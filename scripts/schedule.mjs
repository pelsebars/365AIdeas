import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {appendFileSync, readFileSync} from 'node:fs';
import {parseBacklog} from './backlog.mjs';

// Workflow concurrency serializes runs. Read current main after acquiring it,
// so duplicate dispatches see the publication recorded by the previous run.
export function shouldRun(event, timestamp = new Date(), entries = []) {
  if (event !== 'workflow_dispatch') return false;
  const date = new Date(timestamp);
  if (!Number.isFinite(date.getTime())) throw Error('Ugyldigt eventtidspunkt');
  const today = new Intl.DateTimeFormat('sv-SE', {timeZone: 'Europe/Copenhagen'}).format(date);
  return !entries.some(entry => entry.metadata.Status === 'udgivet' && entry.metadata.Udgivet === today);
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const run = shouldRun(process.env.GITHUB_EVENT_NAME, new Date(), parseBacklog(readFileSync('backlog.md', 'utf8')));
  if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `run=${run}\n`);
  const message = run ? 'Kørsel tilladt: ingen app er registreret udgivet i dag i Europe/Copenhagen.' : 'Spring over: en app er allerede udgivet i dag, eller triggeren er ikke workflow_dispatch.';
  console.log(message);
  if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${message}\n`);
}
