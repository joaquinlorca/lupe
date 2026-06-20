const { getCurrentMeal } = require('../src/timeUtils');

function d(dayOfWeek, hour, minute = 0) {
  // dayOfWeek: 1=Mon, 5=Fri, 6=Sat, 0=Sun
  const date = new Date(2026, 5, 15); // Monday June 15 2026
  date.setDate(date.getDate() + ((dayOfWeek - date.getDay() + 7) % 7));
  date.setHours(hour, minute, 0, 0);
  return date;
}

test('Monday 8:00 is morning', () => expect(getCurrentMeal(d(1, 8))).toBe('morning'));
test('Monday 11:00 is morning', () => expect(getCurrentMeal(d(1, 11))).toBe('morning'));
test('Monday 12:30 is still morning (cutoff send time)', () => expect(getCurrentMeal(d(1, 12, 30))).toBe('morning'));
test('Monday 13:00 is null (after morning cutoff)', () => expect(getCurrentMeal(d(1, 13))).toBeNull());
test('Monday 20:00 is evening', () => expect(getCurrentMeal(d(1, 20))).toBe('evening'));
test('Monday 23:30 is evening', () => expect(getCurrentMeal(d(1, 23, 30))).toBe('evening'));
test('Monday 7:00 is null (before morning)', () => expect(getCurrentMeal(d(1, 7))).toBeNull());
test('Saturday 11:00 is morning', () => expect(getCurrentMeal(d(6, 11))).toBe('morning'));
test('Saturday 13:00 is still morning (cutoff send time)', () => expect(getCurrentMeal(d(6, 13))).toBe('morning'));
test('Saturday 13:30 is null (after sat morning cutoff)', () => expect(getCurrentMeal(d(6, 13, 30))).toBeNull());
test('Sunday 20:00 is evening', () => expect(getCurrentMeal(d(0, 20))).toBe('evening'));
