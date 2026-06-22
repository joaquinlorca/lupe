const cron = require('node-cron');
const messages = require('./messages');

const TZ = process.env.TZ || 'America/Santiago';

function schedule(expr, fn) {
  cron.schedule(expr, fn, { timezone: TZ });
}

module.exports = function setup(send, state) {
  function remind(meal, isFirst) {
    return async () => {
      if (state.isFed(meal)) return;
      await send(messages.getReminder(meal, isFirst));
    };
  }

  function sadAndStop(meal) {
    return async () => {
      if (state.isFed(meal)) return;
      await send(messages.getSadMessage(meal));
    };
  }

  // --- MORNING ---

  // Mon-Fri: 8:00 initial, 9:30 second, then hourly 10:30/11:30, 12:30 sad
  schedule('0 8 * * 1-5', remind('morning', true));
  schedule('30 9 * * 1-5', remind('morning', false));
  schedule('30 10 * * 1-5', remind('morning', false));
  schedule('30 11 * * 1-5', remind('morning', false));
  schedule('30 12 * * 1-5', sadAndStop('morning'));

  // Sat-Sun: 11:00 initial, 12:00 follow-up, 13:00 sad
  schedule('0 11 * * 0,6', remind('morning', true));
  schedule('0 12 * * 0,6', remind('morning', false));
  schedule('0 13 * * 0,6', sadAndStop('morning'));

  // --- EVENING (all days) ---

  // 20:00 initial, hourly 21:00/22:00/23:00, 23:30 sad
  schedule('0 20 * * *', remind('evening', true));
  schedule('0 21 * * *', remind('evening', false));
  schedule('0 22 * * *', remind('evening', false));
  schedule('0 23 * * *', remind('evening', false));
  schedule('30 23 * * *', sadAndStop('evening'));

  console.log('[scheduler] All cron jobs registered');
};
