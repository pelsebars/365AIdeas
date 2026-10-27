import {test} from 'node:test';
import assert from 'node:assert/strict';
import {shouldRun} from '../schedule.mjs';
test('winter slot is 05:07 UTC; summer slot is 04:07 UTC', () => {
  assert.equal(shouldRun('schedule', '2026-10-27T04:07:00Z'), false);
  assert.equal(shouldRun('schedule', '2026-10-27T05:07:00Z'), true);
  assert.equal(shouldRun('schedule', '2027-07-01T04:07:00Z'), true);
  assert.equal(shouldRun('schedule', '2027-07-01T05:07:00Z'), false);
});
test('DST transition days choose exactly one slot', () => {
  for (const day of ['2027-03-28', '2027-10-31']) {
    const slots = ['04', '05'].filter(hour => shouldRun('schedule', `${day}T${hour}:07:00Z`));
    assert.equal(slots.length, 1);
  }
});
test('manual retries run regardless of hour; unrelated triggers do not', () => {
  assert.equal(shouldRun('workflow_dispatch', '2026-10-27T12:00:00Z'), true);
  assert.equal(shouldRun('push', '2026-10-27T05:07:00Z'), false);
  assert.throws(() => shouldRun('schedule', 'bad-date'));
});
