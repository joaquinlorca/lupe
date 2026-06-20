require('dotenv').config();
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const path = require('path');

const DATA_PATH = path.join(__dirname, '..', 'data');

const client = new Client({
  authStrategy: new LocalAuth({ dataPath: DATA_PATH }),
  puppeteer: {
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  },
});

client.on('qr', (qr) => {
  console.log('\n=== Escanea este QR con WhatsApp en el SIM del bot ===\n');
  qrcode.generate(qr, { small: true });
});

client.on('ready', async () => {
  console.log('\n✅ Sesión guardada correctamente. Ya podés cerrar esto y deployar.');
  const chats = await client.getChats();
  const groups = chats.filter((c) => c.isGroup).map((c) => c.name);
  console.log('\nGrupos disponibles:');
  groups.forEach((g) => console.log(' -', g));
  console.log('\nCopiá el nombre exacto del grupo de Lupe a GROUP_NAME en tu .env');
  process.exit(0);
});

client.initialize();
