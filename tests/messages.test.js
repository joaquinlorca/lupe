const messages = require('../src/messages');

test('getReminder returns a non-empty string', () => {
  expect(typeof messages.getReminder('morning', true)).toBe('string');
  expect(messages.getReminder('morning', true).length).toBeGreaterThan(0);
  expect(typeof messages.getReminder('evening', false)).toBe('string');
});

test('getReminder varies across calls', () => {
  const results = new Set();
  for (let i = 0; i < 30; i++) results.add(messages.getReminder('morning', false));
  expect(results.size).toBeGreaterThan(1);
});

test('getSadMessage returns a non-empty string', () => {
  expect(typeof messages.getSadMessage('morning')).toBe('string');
  expect(typeof messages.getSadMessage('evening')).toBe('string');
});

test('getConfirmation includes the name', () => {
  const msg = messages.getConfirmation('morning', 'Juan');
  expect(msg).toContain('Juan');
});

test('getConfirmation varies across calls', () => {
  const results = new Set();
  for (let i = 0; i < 30; i++) results.add(messages.getConfirmation('morning', 'Juan'));
  expect(results.size).toBeGreaterThan(1);
});
