require('dotenv').config();
const path = require('path');
const { connect, sendToGroup } = require('./client');
const setupScheduler = require('./scheduler');
const createState = require('./state');
const { isConfirmation } = require('./detector');
const { getCurrentMeal } = require('./timeUtils');
const { getConfirmation } = require('./messages');

const STATE_PATH = path.join(__dirname, '..', 'data', 'state.json');
const state = createState(STATE_PATH);

function onGroupMessage(body, senderName) {
  const meal = getCurrentMeal();
  if (!meal) return;
  if (state.isFed(meal)) return;
  if (!isConfirmation(body)) return;

  state.markFed(meal);
  const reply = getConfirmation(meal, senderName);
  sendToGroup(reply).catch((err) => console.error('[index] Failed to send confirmation reply:', err));
}

setupScheduler(sendToGroup, state);
connect(onGroupMessage);

console.log('[lupe-bot] Starting...');
