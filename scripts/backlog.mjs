import {readFileSync, mkdirSync, writeFileSync, rmSync, renameSync} from 'node:fs';
import {resolve} from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const statuses = new Set(['kladde', 'klar', 'i gang', 'implementeret', 'udgivet', 'blokeret']);
const fields = ['Status', 'Tilføjet', 'Startet', 'Implementeret', 'Udgivet', 'App', 'Deployment', 'Noter'];
export function parseBacklog(source) {
  // Ignore fenced examples and prompts when locating entries and metadata.
  let fence;
  const masked = source.split('\n').map(line => {
    const match = line.match(/^\s*(`{3,}|~{3,})/);
    if (match) {
      if (!fence) fence = match[1];
      else if (match[1][0] === fence[0] && match[1].length >= fence.length) fence = undefined;
      return ' '.repeat(line.length);
    }
    return fence ? ' '.repeat(line.length) : line;
  }).join('\n');
  const headings = [...masked.matchAll(/^## (IDE-\d+) — (.+)$/gm)];
  const ids = new Set();
  const entries = headings.map((h, index) => {
    if (ids.has(h[1])) throw Error(`Dobbelt ID: ${h[1]}`);
    ids.add(h[1]);
    const end = headings[index + 1]?.index ?? source.length;
    const block = masked.slice(h.index, end);
    const a = block.indexOf('### A · Grundlæggende idé\n');
    const b = block.indexOf('### B · Status\n');
    const c = block.indexOf('### C · Fuld konceptprompt\n');
    if (!(a >= 0 && a < b && b < c)) throw Error(`${h[1]}: A/B/C mangler eller står forkert`);
    if (!block.slice(a + '### A · Grundlæggende idé\n'.length, b).trim() || !source.slice(h.index + c + '### C · Fuld konceptprompt\n'.length, end).trim()) throw Error(`${h[1]}: Tom idé eller prompt`);
    const metadata = {};
    for (const m of block.slice(b, c).matchAll(/^- ([^:\n]+): (.*)$/gm)) {
      if (m[1] in metadata) throw Error(`${h[1]}: Dobbelt felt ${m[1]}`);
      metadata[m[1]] = m[2];
    }
    for (const field of fields) if (!metadata[field]?.trim()) throw Error(`${h[1]}: Mangler ${field}`);
    if (!statuses.has(metadata.Status)) throw Error(`${h[1]}: Ukendt status`);
    for (const field of ['Tilføjet', 'Startet', 'Implementeret', 'Udgivet']) {
      const date = metadata[field];
      if (date !== '—' && (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(Date.parse(date)) || new Date(date).toISOString().slice(0, 10) !== date)) throw Error(`${h[1]}: Ugyldig dato i ${field}`);
    }
    if (metadata.Kø && !['aktiv', 'historik'].includes(metadata.Kø)) throw Error(`${h[1]}: Ukendt kø`);
    if (metadata.Status === 'i gang' && metadata.Startet === '—') throw Error(`${h[1]}: Startdato mangler`);
    if (['implementeret', 'udgivet'].includes(metadata.Status) && metadata.App === '—') throw Error(`${h[1]}: App mangler`);
    if (metadata.Status === 'udgivet' && (metadata.Udgivet === '—' || metadata.Deployment === '—' || metadata.Implementeret === '—')) throw Error(`${h[1]}: Udgivelsesdata mangler`);
    return {id: h[1], title: h[2], metadata, start: h.index, end, b: h.index + b, c: h.index + c};
  });
  if (!entries.length) throw Error('Ingen backlogentries');
  const active = entries.filter(e => e.metadata.Kø !== 'historik' && ['i gang', 'implementeret'].includes(e.metadata.Status));
  if (active.length > 1) throw Error('Flere aktive ufærdige opgaver; afklar før næste kørsel');
  return entries;
}
export function selectNext(entries) {
  const available = entries.filter(e => e.metadata.Kø !== 'historik');
  const entry = available.find(e => ['i gang', 'implementeret'].includes(e.metadata.Status)) ?? available.find(e => e.metadata.Status === 'klar');
  return entry ? {id: entry.id, title: entry.title, action: entry.metadata.Status === 'implementeret' ? 'deploy' : entry.metadata.Status === 'i gang' ? 'resume' : 'build'} : null;
}
export function startEntry(source) {
  const entries = parseBacklog(source), next = selectNext(entries);
  if (!next || next.action !== 'build') return {source, next};
  const entry = entries.find(e => e.id === next.id);
  const today = new Intl.DateTimeFormat('sv-SE', {timeZone: 'Europe/Copenhagen', year: 'numeric', month: '2-digit', day: '2-digit'}).format(new Date());
  const metadata = source.slice(entry.b, entry.c).replace(/^- Status: klar$/m, '- Status: i gang').replace(/^- Startet: .*$/m, `- Startet: ${today}`);
  return {source: source.slice(0, entry.b) + metadata + source.slice(entry.c), next};
}
export function main(args) {
  const [command, ...rest] = args;
  const path = resolve('backlog.md');
  if (command === 'run') {
    const separator = rest.indexOf('--'), childArgs = rest.slice(separator + 1);
    if (separator !== 0 || !childArgs.length) throw Error('Brug: run -- <kommando> [argumenter]');
    const lock = resolve('.daily-app.lock');
    try { mkdirSync(lock); } catch (e) { if (e.code === 'EEXIST') throw Error('En byggekørsel har låsen. Undersøg ejeren før manuel fjernelse af .daily-app.lock.'); throw e; }
    try {
      writeFileSync(resolve(lock, 'owner.json'), JSON.stringify({pid: process.pid, started: new Date().toISOString()}));
      const next = selectNext(parseBacklog(readFileSync(path, 'utf8')));
      if (!next) { console.log('Ingen klar eller afbrudt opgave.'); return 0; }
      const child = spawnSync(childArgs[0], childArgs.slice(1), {stdio: 'inherit', env: {...process.env, BACKLOG_ID: next.id, BACKLOG_ACTION: next.action}});
      if (child.error) throw child.error;
      return child.status ?? 1;
    } finally { rmSync(lock, {recursive: true, force: true}); }
  }
  const source = readFileSync(path, 'utf8');
  const entries = parseBacklog(source);
  if (command === 'check') console.log(`OK: ${entries.length} backlogentries med gyldig status og entydig kø.`);
  else if (command === 'next') console.log(JSON.stringify(selectNext(entries)));
  else if (command === 'start') {
    const result = startEntry(source);
    if (result.source !== source) {
      const temp = `${path}.${process.pid}.tmp`;
      writeFileSync(temp, result.source);
      renameSync(temp, path);
    }
    console.log(JSON.stringify(result.next));
  } else throw Error('Brug: check | next | start | run -- <kommando>');
  return 0;
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { process.exitCode = main(process.argv.slice(2)); }
  catch (e) { console.error(e.message); process.exitCode = 1; }
}
