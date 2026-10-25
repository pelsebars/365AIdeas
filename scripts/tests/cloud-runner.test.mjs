import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync, writeFileSync, readFileSync, rmSync, mkdirSync, existsSync} from 'node:fs';
import {join, resolve} from 'node:path';
import {tmpdir} from 'node:os';
import {execFileSync, spawnSync} from 'node:child_process';
import {validatePatchPaths} from '../cloud-runner.mjs';

test('app patches cannot modify workflow, dependencies or queue infrastructure', () => {
  validatePatchPaths(['backlog.md', 'apps/test/index.html', 'tests/browser/test.spec.mjs', 'scripts/check-test.mjs']);
  for (const path of ['.github/workflows/daily-app.yml', 'package.json', 'scripts/cloud-runner.mjs', 'scripts/backlog.mjs', 'apps/test/../../.git/config', 'apps/test/.env', 'node_modules/a']) assert.throws(() => validatePatchPaths([path]));
});
test('candidate roundtrip keeps new files and rejects forged manifest', () => {
  const dir = mkdtempSync(join(tmpdir(), '365-cloud-'));
  const cli = resolve('scripts/cloud-runner.mjs');
  const git = (...args) => execFileSync('git', args, {cwd: dir, encoding: 'utf8'}).trim();
  const run = (command, env) => spawnSync(process.execPath, [cli, command], {cwd: dir, encoding: 'utf8', env: {...process.env, ...env}});
  try {
    git('init', '-q'); git('config', 'user.name', 'Test'); git('config', 'user.email', 'test@example.org');
    writeFileSync(join(dir, '.gitignore'), '.runner-artifacts/\n');
    writeFileSync(join(dir, 'index.html'), 'original');
    git('add', '.'); git('commit', '-qm', 'base');
    const base = git('rev-parse', 'HEAD');
    writeFileSync(join(dir, 'index.html'), 'changed');
    mkdirSync(join(dir, 'apps/test'), {recursive: true});
    writeFileSync(join(dir, 'apps/test/index.html'), 'new app');
    assert.equal(run('capture', {BASE_SHA: base}).status, 0);
    git('reset', '--hard', base);
    rmSync(join(dir, 'apps'), {recursive: true, force: true});
    const artifactDir = join(dir, '.runner-artifacts');
    assert.equal(run('apply', {ARTIFACT_DIR: artifactDir}).status, 0);
    assert.equal(readFileSync(join(dir, 'apps/test/index.html'), 'utf8'), 'new app');
    assert.equal(readFileSync(join(dir, 'index.html'), 'utf8'), 'changed');
    const remote = join(dir, 'remote.git');
    execFileSync('git', ['init', '--bare', '-q', remote]);
    git('remote', 'add', 'origin', remote);
    git('push', '-q', 'origin', `${base}:refs/heads/main`);
    const output = join(dir, 'outputs');
    writeFileSync(output, '');
    assert.equal(run('checkpoint', {BASE_SHA: base, PRIOR_SHA: '', BACKLOG_ID: 'IDE-001', GITHUB_OUTPUT: output}).status, 0);
    const candidate = readFileSync(output, 'utf8').match(/commit=(\w+)/)[1];
    assert.ok(git('ls-remote', 'origin', 'refs/heads/main').startsWith(base));
    assert.ok(git('ls-remote', 'origin', 'refs/heads/codex/daily-app-work').startsWith(candidate));
    assert.equal(run('publish', {BASE_SHA: '0'.repeat(40), CANDIDATE_SHA: candidate}).status, 1);
    assert.ok(git('ls-remote', 'origin', 'refs/heads/main').startsWith(base));
    assert.equal(run('publish', {BASE_SHA: base, CANDIDATE_SHA: candidate}).status, 0);
    assert.ok(git('ls-remote', 'origin', 'refs/heads/main').startsWith(candidate));
    git('reset', '--hard', base);
    const manifest = JSON.parse(readFileSync(join(artifactDir, 'manifest.json'), 'utf8'));
    manifest.paths = ['index.html'];
    writeFileSync(join(artifactDir, 'manifest.json'), JSON.stringify(manifest));
    assert.equal(run('apply', {ARTIFACT_DIR: artifactDir}).status, 1);
  } finally { rmSync(dir, {recursive: true, force: true}); }
});
