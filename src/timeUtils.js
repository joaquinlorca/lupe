function getCurrentMeal(now = new Date()) {
  const day = now.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
  const h = now.getHours();
  const m = now.getMinutes();
  const totalMin = h * 60 + m;

  const isWeekend = day === 0 || day === 6;

  // Morning window: 07:30 to 13:00 (weekday) or 13:30 (weekend)
  const morningStart = 7 * 60 + 30;
  const morningEnd = isWeekend ? 13 * 60 + 30 : 13 * 60;
  if (totalMin >= morningStart && totalMin < morningEnd) return 'morning';

  // Evening window: 19:30 to midnight
  const eveningStart = 19 * 60 + 30;
  if (totalMin >= eveningStart) return 'evening';

  return null;
}

module.exports = { getCurrentMeal };
