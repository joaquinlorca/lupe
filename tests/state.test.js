const fs = require('fs');
const path = require('path');
const os = require('os');

let statePath;
let state;

beforeEach(() => {
  statePath = path.join(os.tmpdir(), `lupe-state-${Date.now()}.json`);
  fs.writeFileSync(statePath, JSON.stringify({ date: '', morning: false, evening: false }));
  jest.resetModules();
  state = require('../src/state')(statePath);
});

afterEach(() => {
  fs.unlinkSync(statePath);
});

test('isFed returns false when state is fresh', () => {
  expect(state.isFed('morning')).toBe(false);
  expect(state.isFed('evening')).toBe(false);
});

test('markFed sets the meal to true', () => {
  state.markFed('morning');
  expect(state.isFed('morning')).toBe(true);
  expect(state.isFed('evening')).toBe(false);
});

test('state persists across instances', () => {
  state.markFed('evening');
  const state2 = require('../src/state')(statePath);
  expect(state2.isFed('evening')).toBe(true);
});

test('state resets when date changes', () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const oldDate = yesterday.toISOString().slice(0, 10);
  fs.writeFileSync(statePath, JSON.stringify({ date: oldDate, morning: true, evening: true }));
  jest.resetModules();
  const freshState = require('../src/state')(statePath);
  expect(freshState.isFed('morning')).toBe(false);
  expect(freshState.isFed('evening')).toBe(false);
});
