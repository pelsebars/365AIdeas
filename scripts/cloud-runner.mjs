import {execFileSync} from 'node:child_process';
import {readFileSync, writeFileSync, mkdirSync, existsSync, lstatSync} from 'node:fs';
import {resolve} from 'node:path';
import {parseBacklog, selectNext, startEntry} from './backlog.mjs';

const git = (...args) => execFileSync('git', args, {encoding: 'utf8'}).trim();
const out = (key, value) => {
  if (process.env.GITHUB_OUTPUT) writeFileSync(process.env.GITHUB_OUTPUT, `${key}=${value}\n`, {flag: 'a'});
};
const workBranch = 'codex/daily-app-work';
export function permittedPath(path) {
  return /^(apps\/[a-z0-9-]+\/.+|tests\/browser\/[a-z0-9-]+\.spec\.mjs|scripts\/check-[a-z0-9-]+\.mjs)$/.test(path)
    && !path.split('/').some(x => x === '..' || x.startsWith('.'))
    || ['index.html', 'style.css', 'README.md', 'backlog.md'].includes(path);
}
export function validatePatchPaths(paths) {
  for (const path of paths) if (!permittedPath(path)) throw Error(`Ændring uden for app-opgaven: ${path}`);
}
export function selectedApp(source, id) {
  const entry = parseBacklog(source).find(e => e.id === id);
  if (!entry || entry.metadata.Status !== 'implementeret' || entry.metadata.Implementeret === '—') throw Error('Den valgte opgave er ikke markeret implementeret med dato');
  const match = entry.metadata.App.match(/(?:^|\()(apps\/[a-z0-9-]+\/index\.html)(?:\)|$)/);
  if (!match) throw Error('App skal pege på apps/<slug>/index.html');
  if (!existsSync(match[1])) throw Error('App-filen findes ikke');
  return match[1].replace('index.html', '');
}
function capture(base) {
  mkdirSync('.runner-artifacts', {recursive: true});
  const paths = [...new Set([
    ...git('diff', '--name-only', base).split('\n'),
    ...git('ls-files', '--others', '--exclude-standard').split('\n'),
  ].filter(Boolean))].filter(p => !p.startsWith('.runner-artifacts/'));
  validatePatchPaths(paths);
  for (const path of paths) if (existsSync(path) && lstatSync(path).isSymbolicLink()) throw Error(`Symlink ikke tilladt: ${path}`);
  if (paths.length) git('add', '--', ...paths);
  const patch = execFileSync('git', ['diff', '--cached', '--binary', base], {maxBuffer: 100 * 1024 * 1024});
  writeFileSync('.runner-artifacts/candidate.patch', patch);
  writeFileSync('.runner-artifacts/manifest.json', JSON.stringify({base, paths}, null, 2));
}
function apply(folder) {
  const manifest = JSON.parse(readFileSync(`${folder}/manifest.json`, 'utf8'));
  validatePatchPaths(manifest.paths);
  if (git('rev-parse', 'HEAD') !== manifest.base) throw Error('Patchens base matcher ikke checkout');
  const patch = resolve(folder, 'candidate.patch');
  if (readFileSync(patch).length) {
    git('apply', '--check', patch);
    git('apply', '--index', patch);
  }
  const paths = git('diff', '--cached', '--name-only').split('\n').filter(Boolean);
  validatePatchPaths(paths);
  for (const path of paths) if (existsSync(path) && lstatSync(path).isSymbolicLink()) throw Error('Symlink i patch');
  // Protect infrastructure against paths omitted from a forged manifest.
  const actual = [...paths].sort();
  if (JSON.stringify(actual) !== JSON.stringify([...manifest.paths].sort())) throw Error('Manifest matcher ikke patch');
}
function checkpoint() {
  const base = process.env.BASE_SHA;
  const prior = process.env.PRIOR_SHA;
  git('config', 'user.name', 'github-actions[bot]');
  git('config', 'user.email', '41898282+github-actions[bot]@users.noreply.github.com');
  const parents = ['-p', base];
  if (prior && prior !== base) parents.push('-p', prior);
  const commit = git('commit-tree', git('write-tree'), ...parents, '-m', `Daily app checkpoint: ${process.env.BACKLOG_ID}`);
  git('push', 'origin', `${commit}:refs/heads/${workBranch}`);
  out('commit', commit);
  return commit;
}
async function verifyDeployment(sha, appPath) {
  const repo = process.env.GITHUB_REPOSITORY;
  for (let attempt = 0; attempt < 30; attempt++) {
    const statuses = JSON.parse(execFileSync('gh', ['api', `repos/${repo}/commits/${sha}/status`], {encoding: 'utf8'})).statuses;
    const vercel = statuses.find(s => s.context?.toLowerCase() === 'vercel');
    if (vercel && ['failure', 'error'].includes(vercel.state)) throw Error('Vercel deployment fejlede');
    if (vercel?.state === 'success') {
      const base = 'https://365aideas.vercel.app/';
      for (const path of ['', appPath]) {
        const response = await fetch(new URL(path, base));
        if (!response.ok) throw Error(`Offentlig URL fejlede: ${response.status}`);
        const body = await response.text();
        if (!path && !body.includes(appPath)) throw Error('App-opslaget mangler på offentlig forside');
      }
      return new URL(appPath, base).href;
    }
    await new Promise(r => setTimeout(r, 20000));
  }
  throw Error('Vercel-status blev ikke bekræftet inden 10 minutter. Opgaven forbliver implementeret.');
}
export async function main(command) {
  if (command === 'prepare') {
    const base = git('rev-parse', 'HEAD');
    out('base', base);
    const refs = git('ls-remote', '--heads', 'origin', workBranch);
    if (refs) {
      git('fetch', 'origin', workBranch);
      const prior = git('rev-parse', 'FETCH_HEAD');
      out('prior', prior);
      git('config', 'user.name', 'github-actions[bot]');
      git('config', 'user.email', '41898282+github-actions[bot]@users.noreply.github.com');
      git('merge', '--no-edit', prior);
    }
    const next = selectNext(parseBacklog(readFileSync('backlog.md', 'utf8')));
    out('has_work', Boolean(next));
    if (!next) return;
    out('id', next.id); out('action', next.action);
    writeFileSync('backlog.md', startEntry(readFileSync('backlog.md', 'utf8')).source);
    mkdirSync('.runner-artifacts', {recursive: true});
    writeFileSync('.runner-artifacts/selection.json', JSON.stringify(next, null, 2));
  } else if (command === 'capture') capture(process.env.BASE_SHA);
  else if (command === 'apply') apply(process.env.ARTIFACT_DIR);
  else if (command === 'ready') {
    const app = selectedApp(readFileSync('backlog.md', 'utf8'), process.env.BACKLOG_ID);
    out('app', app);
    if (!existsSync(`tests/browser/${app.split('/')[1]}.spec.mjs`)) throw Error('Appens funktionelle browsertest mangler');
    const expected = process.env.BACKLOG_ID;
    const baseEntries = parseBacklog(git('show', `${process.env.BASE_SHA}:backlog.md`));
    const entries = parseBacklog(readFileSync('backlog.md', 'utf8'));
    if (baseEntries.length !== entries.length) throw Error('Kørslen må ikke tilføje eller fjerne idéer');
    for (const before of baseEntries) {
      const after = entries.find(e => e.id === before.id);
      if (!after) throw Error('Backlog-ID fjernet');
      const baseText = git('show', `${process.env.BASE_SHA}:backlog.md`);
      if (before.id !== expected && baseText.slice(before.start, before.end) !== readFileSync('backlog.md', 'utf8').slice(after.start, after.end)) throw Error('En anden backlogentry er ændret');
      const idea = block => block.slice(block.indexOf('### A ·'), block.indexOf('### B ·'));
      if (idea(baseText.slice(before.start, before.end)) !== idea(readFileSync('backlog.md', 'utf8').slice(after.start, after.end))) throw Error('Oprindelig idé er ændret');
    }
  } else if (command === 'checkpoint') checkpoint();
  else if (command === 'publish') {
    const sha = process.env.CANDIDATE_SHA;
    git('fetch', 'origin', 'main');
    if (git('rev-parse', 'FETCH_HEAD') !== process.env.BASE_SHA) throw Error('main ændret under bygning; checkpoint er gemt. Genkør med den nye base.');
    git('push', 'origin', `${sha}:refs/heads/main`);
  } else if (command === 'verify') {
    const app = selectedApp(readFileSync('backlog.md', 'utf8'), process.env.BACKLOG_ID);
    const url = await verifyDeployment(process.env.CANDIDATE_SHA, app);
    out('url', url);
    const source = readFileSync('backlog.md', 'utf8');
    const entry = parseBacklog(source).find(e => e.id === process.env.BACKLOG_ID);
    const date = new Intl.DateTimeFormat('sv-SE', {timeZone: 'Europe/Copenhagen'}).format(new Date());
    const metadata = source.slice(entry.b, entry.c).replace(/^- Status: .*$/m, '- Status: udgivet').replace(/^- Udgivet: .*$/m, `- Udgivet: ${date}`).replace(/^- Deployment: .*$/m, `- Deployment: ${url}`);
    writeFileSync('backlog.md', source.slice(0, entry.b) + metadata + source.slice(entry.c));
    git('add', 'backlog.md');
    git('commit', '-m', `Verify daily app deployment: ${entry.id}`);
    git('push', 'origin', 'HEAD:main');
    git('push', 'origin', '--delete', workBranch);
  } else throw Error('Ukendt cloudkommando');
}
if (process.argv[1] && resolve(process.argv[1]) === new URL(import.meta.url).pathname) {
  main(process.argv[2]).catch(e => { console.error(e.message); process.exitCode = 1; });
}
