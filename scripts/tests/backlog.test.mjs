import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync, writeFileSync, mkdirSync, existsSync, rmSync, readFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join, resolve} from 'node:path';
import {spawnSync} from 'node:child_process';
import {parseBacklog, selectNext, startEntry} from '../backlog.mjs';
const fixture = (id, status = 'klar', extra = '') => `## IDE-${id} — Eksempel
### A · Grundlæggende idé
Ophav: menneske
En interaktiv app.
### B · Status
- Status: ${status}
- Tilføjet: 2026-10-25
- Startet: ${status === 'i gang' ? '2026-10-25' : '—'}
- Implementeret: —
- Udgivet: —
- App: ${status === 'implementeret' ? 'apps/test/index.html' : '—'}
- Deployment: —
- Noter: —
${extra}
### C · Fuld konceptprompt
Ikke genereret endnu.
`;
test('selection respects drafts, priority, resume, deployment and historical apps', () => {
  assert.equal(selectNext(parseBacklog(fixture('001', 'kladde'))), null);
  assert.equal(selectNext(parseBacklog(fixture('001') + fixture('002'))).id, 'IDE-001');
  assert.equal(selectNext(parseBacklog(fixture('001') + fixture('002', 'i gang'))).action, 'resume');
  assert.equal(selectNext(parseBacklog(fixture('001') + fixture('002', 'implementeret'))).action, 'deploy');
  assert.equal(selectNext(parseBacklog(fixture('001', 'implementeret', '- Kø: historik') + fixture('002'))).id, 'IDE-002');
});
test('invalid states fail instead of selecting another app', () => {
  for (const source of [fixture('001') + fixture('001'), fixture('001', 'ukendt'), fixture('001', 'i gang') + fixture('002', 'i gang'), fixture('001').replace('2026-10-25', '2026-02-30'), fixture('001', 'udgivet'), fixture('001').replace('- Noter: —\n', '')]) assert.throws(() => parseBacklog(source));
});
test('fenced prompts cannot introduce fake entries or metadata', () => {
  const source = fixture('001') + '\n```markdown\n' + fixture('002', 'i gang') + '\n```\n';
  assert.equal(parseBacklog(source).length, 1);
});
test('starting changes only selected metadata and is idempotent', () => {
  const source = fixture('001', 'kladde') + fixture('002') + fixture('003');
  const result = startEntry(source);
  assert.equal(result.next.id, 'IDE-002');
  assert.ok(result.source.startsWith(fixture('001', 'kladde')));
  assert.ok(result.source.endsWith(fixture('003')));
  assert.equal(parseBacklog(result.source)[1].metadata.Status, 'i gang');
  assert.equal(startEntry(result.source).source, result.source);
});
test('runner skips empty queue, rejects occupied lock, forwards selection and releases lock on failure', () => {
  const dir = mkdtempSync(join(tmpdir(), '365-backlog-'));
  const cli = resolve('scripts/backlog.mjs');
  const run = args => spawnSync(process.execPath, [cli, ...args], {cwd: dir, encoding: 'utf8'});
  try {
    writeFileSync(join(dir, 'backlog.md'), fixture('001', 'kladde'));
    assert.equal(run(['run', '--', 'does-not-exist']).status, 0);
    assert.equal(existsSync(join(dir, '.daily-app.lock')), false);
    mkdirSync(join(dir, '.daily-app.lock'));
    assert.equal(run(['run', '--', process.execPath, '-e', 'process.exit(0)']).status, 1);
    rmSync(join(dir, '.daily-app.lock'), {recursive: true});
    writeFileSync(join(dir, 'backlog.md'), fixture('001'));
    const result = run(['run', '--', process.execPath, '-e', 'console.log(process.env.BACKLOG_ID,process.env.BACKLOG_ACTION);process.exit(7)']);
    assert.equal(result.status, 7);
    assert.match(result.stdout, /IDE-001 build/);
    assert.equal(existsSync(join(dir, '.daily-app.lock')), false);
    assert.equal(readFileSync(join(dir, 'backlog.md'), 'utf8'), fixture('001'));
  } finally { rmSync(dir, {recursive: true, force: true}); }
});
