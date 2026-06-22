require('dotenv').config();
const { Client, LocalAuth } = require('whatsapp-web.js');
const path = require('path');

const DATA_PATH = path.join(__dirname, '..', 'data');
const GROUP_NAME = process.env.GROUP_NAME;

if (!GROUP_NAME) {
  throw new Error('GROUP_NAME is not set in .env');
}

const client = new Client({
  authStrategy: new LocalAuth({ dataPath: DATA_PATH }),
  puppeteer: {
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  },
});

let groupChatId = null;

async function findGroup() {
  const chats = await client.getChats();
  const group = chats.find((c) => c.isGroup && c.name === GROUP_NAME);
  if (!group) throw new Error(`Group "${GROUP_NAME}" not found. Check GROUP_NAME in .env`);
  groupChatId = group.id._serialized;
  console.log(`[client] Connected to group: ${group.name}`);
}

function connect(onGroupMessage) {
  client.on('ready', async () => {
    console.log('[client] WhatsApp ready');
    await findGroup();
  });

  client.on('message', async (msg) => {
    if (!groupChatId) return;
    const chat = await msg.getChat();
    if (chat.id._serialized !== groupChatId) return;
    const contact = await msg.getContact();
    const name = contact.pushname || contact.number;
    onGroupMessage(msg.body, name);
  });

  client.on('disconnected', (reason) => {
    console.error('[client] Disconnected:', reason);
    process.exit(1);
  });

  client.initialize();
}

async function sendToGroup(text) {
  if (!groupChatId) {
    console.warn('[client] Group not ready yet, skipping message');
    return;
  }
  try {
    await client.sendMessage(groupChatId, text);
  } catch (err) {
    console.error('[client] Failed to send message, retrying in 5s:', err.message);
    await new Promise((r) => setTimeout(r, 5000));
    await client.sendMessage(groupChatId, text);
  }
}

module.exports = { connect, sendToGroup };
