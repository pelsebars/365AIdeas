import {test} from 'node:test';
import assert from 'node:assert/strict';
import {shouldRun} from '../schedule.mjs';

const published = day => [{metadata: {Status: 'udgivet', Udgivet: day}}];
test('duplicate dispatches stop after a publication on the same Copenhagen day', () => {
  const entries = published('2026-10-28');
  assert.equal(shouldRun('workflow_dispatch', '2026-10-28T05:07:00Z', entries), false);
  assert.equal(shouldRun('workflow_dispatch', '2026-10-28T22:59:59Z', entries), false);
  assert.equal(shouldRun('workflow_dispatch', '2026-10-28T23:00:00Z', entries), true);
});
test('Copenhagen dates follow summer time and DST transition days', () => {
  for (const [timestamp, day] of [
    ['2027-06-30T22:07:00Z', '2027-07-01'],
    ['2027-03-28T04:07:00Z', '2027-03-28'],
    ['2027-10-31T05:07:00Z', '2027-10-31'],
  ]) assert.equal(shouldRun('workflow_dispatch', timestamp, published(day)), false);
});
test('first runs and incomplete checkpoints may proceed; obsolete schedule events cannot', () => {
  assert.equal(shouldRun('workflow_dispatch', '2026-10-28T05:07:00Z', published('2026-10-27')), true);
  assert.equal(shouldRun('workflow_dispatch', '2026-10-28T05:07:00Z', [{metadata: {Status: 'implementeret', Udgivet: '—'}}]), true);
  assert.equal(shouldRun('workflow_dispatch', '2026-10-28T05:07:00Z', []), true);
  assert.equal(shouldRun('schedule', '2026-10-28T05:07:00Z'), false);
  assert.equal(shouldRun('push', '2026-10-28T05:07:00Z'), false);
  assert.throws(() => shouldRun('workflow_dispatch', 'bad-date'));
});
