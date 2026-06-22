# Lupe Bot — Design Spec
*2026-06-20*

## Overview

A WhatsApp bot that speaks as Lupe (the family dog) and sends rotating reminder messages to a specific family WhatsApp group to ensure she gets fed twice a day. The bot listens for confirmation messages and stops reminding once someone acknowledges feeding her. If nobody confirms before the cutoff, it sends a sad message from Lupe and stops until the next scheduled window.

---

## Architecture

Node.js app with four focused modules:

```
lupe-bot/
├── src/
│   ├── client.js       # WhatsApp connection via whatsapp-web.js
│   ├── scheduler.js    # Cron jobs for all reminder times
│   ├── state.js        # Tracks fed status, persists to JSON, resets at midnight
│   ├── detector.js     # Listens for confirmation keywords in the group
│   └── messages.js     # Rotating message bank (all messages spoken as Lupe)
├── data/
│   └── state.json      # { "date": "YYYY-MM-DD", "morning": false, "evening": false }
├── .env                # GROUP_NAME, timezone
├── fly.toml            # Fly.io deployment config
└── package.json
```

---

## Schedule

### Monday–Friday — Morning
| Time  | Action |
|-------|--------|
| 08:00 | Initial reminder |
| 09:30 | Second reminder (if not confirmed) |
| 10:30 | Hourly reminder |
| 11:30 | Hourly reminder |
| 12:30 | Sad message → stop until evening |

### Saturday–Sunday — Morning
| Time  | Action |
|-------|--------|
| 11:00 | Initial reminder |
| 12:00 | Hourly reminder (if not confirmed) |
| 13:00 | Sad message → stop until evening |

### All Days — Evening
| Time  | Action |
|-------|--------|
| 20:00 | Initial reminder |
| 21:00 | Hourly reminder (if not confirmed) |
| 22:00 | Hourly reminder |
| 23:00 | Hourly reminder |
| 23:30 | Sad message → stop until next day |

---

## State Management

`state.json` tracks per-day feeding status:

```json
{ "date": "2026-06-20", "morning": false, "evening": false }
```

- At midnight, if the date doesn't match today, state resets automatically before any check.
- `morning` is set to `true` as soon as a confirmation is detected during a morning window.
- `evening` is set to `true` as soon as a confirmation is detected during an evening window.
- The scheduler checks the relevant flag before sending each reminder — if `true`, it skips silently.

---

## Confirmation Detection

The bot listens to every message in the target group. A message is treated as confirmation if it contains any of these keywords (case-insensitive, accent-insensitive):

```
alimentada, ya le di, yo le di, listo, ya comio, ya comió,
le di, ya esta, ya está, dada, comio, comió, ya
```

Detection is scoped by time window:
- Morning window: 07:30–14:00
- Evening window: 19:30–23:59

The keyword `ya` is only treated as a confirmation if the entire message is 1–3 words long (to avoid false positives from unrelated messages that happen to contain "ya").

When a confirmation is detected, the bot:
1. Marks the appropriate flag (`morning` or `evening`) as `true` in state.
2. Replies in the group with a grateful message from Lupe, mentioning the sender's name.

---

## Message Bank

All messages are written in first person as Lupe the dog. Each category has 7–8 variants; one is chosen randomly each time.

### Morning — Initial reminder
- "¡Buenos días! Soy yo, Lupe 🐾 ¿Alguien se acordó de mi desayuno? Tengo muuucha hambre 🥺"
- "Oigan... son las 8 y mi plato sigue vacío. ¿Me van a dejar morir de hambre o qué? 🐶"
- "Buen día familia 🌅 Aquí Lupe, reportando que aún no he comido nada. Por si no lo sabían."
- "Hola, soy Lupe y estoy hambrienta. ¿Alguien me va a dar el desayuno o tengo que pedírselo a los vecinos? 😤"
- "Desperté, moví la cola, revisé mi plato... nada. ¿Desayuno? 🍽️🐾"
- "¡Aquí Lupe! La más linda de la casa y también la más hambrienta en este momento 🐶💛"
- "Mi estómago está haciendo ruidos raros y creo que se llaman HAMBRE 🐾 Buenos días"

### Morning — Follow-up reminders
- "Sigoooo esperando 🐾 Ya pasó un rato y mi plato sigue igual de vacío..."
- "Hola, sigo yo, Lupe. Sigo aquí. Sigo hambrienta. Sin novedades 😶"
- "¿Me olvidaron? No pasa nada, les perdono, pero igual me tienen que dar de comer 🥺"
- "Tercer recordatorio oficial de Lupe: HAMBRE 🐾"
- "Miren, no quiero ser pesada pero... ¿el desayuno? 🍽️"
- "Estoy mirando la puerta con mis ojitos más tristes. Solo digo. 🐶"
- "Guys. Guys. GUYS. El plato. El plato vacío. Miren el plato. 🍽️😤"

### Morning — Sad message (cutoff)
- "Bueno... ya es tarde y nadie me dio de comer 😢 Espero que esta noche se acuerden de mí. Con amor, Lupe 🐾"
- "Me rindo. Voy a dormir con hambre. Que conste en acta 🐾💔"
- "Está bien, no importa. Solo soy Lupe. Solo tengo hambre. Todo bien 😢"
- "Día difícil hoy. Mi plato siguió vacío toda la mañana. Nos vemos a la noche 🐾"
- "Firmado: Lupe. Hambrienta. Decepcionada. Pero igual los quiero 💛😢"

### Evening — Initial reminder
- "Buenas noches 🌙 Soy Lupe y es hora de mi cena. ¿Quién me alimenta hoy? 🍽️🐾"
- "Ya es de noche y mi pancita está vacía otra vez 🐶 ¿Cena? ¿Alguien?"
- "¡Hora de cenar! Al menos eso espero. Aquí Lupe, con mucha fe 🐾🌙"
- "Oigan, ya cenaron ustedes ¿verdad? ¿Y yo? 🥺🍽️"
- "Se me ocurrió que quizás se olvidaron de mi cena. Solo quería mencionarlo 🐾"
- "Reporting for dinner duty 🐾 ¿Quién viene primero?"
- "La noche llegó y con ella mi hambre. Clásico Lupe 🌙🐶"

### Evening — Follow-up reminders
(same structure as morning follow-ups, adapted for evening context)
- "Llevo un rato esperando la cena... 🌙🐾"
- "¿Les llegó mi mensaje anterior? Por si acaso: todavía no ceno 🍽️"
- "Mis ojos brillan en la oscuridad y también de hambre 🐾🌙"
- "Otro recordatorio nocturno de parte de Lupe. La más hambrienta del barrio 🐶"
- "No dormí la siesta para esperarlos y así me tratan 😤🐾"
- "Lupe nocturna aquí, aún sin cenar 🌙"
- "¿Cena? ¿Ceeeena? 🍽️🐾"

### Evening — Sad message (cutoff)
- "Ya es muy tarde y no cené 😢 Buenas noches de todas formas. Los quiero aunque me hagan pasar hambre. Lupe 🐾"
- "Ok, me voy a dormir. Sin cena. Que el hambre sea mi manta 🐾💔"
- "No importa. Ya me acostumbré. Mentira, no me acostumbré 😢🐾"
- "Firmado: Lupe. Hambrienta de noche. Con fe en que mañana será distinto 🌙🐾"
- "Buenas noches familia 🌙 No cené, pero igual los quiero. Hasta mañana 🐾💛"

### Confirmation response (morning)
- "¡Gracias [nombre]! 🐾 Ya estoy desayunando, qué rico todo 💛"
- "¡[nombre] me salvó la mañana! 🐾🍽️ ¡Qué rico el desayuno!"
- "¡Yaaaay, gracias [nombre]! 🐾 Estoy feliz y con la pancita llena 💛"
- "¡[nombre] es mi héroe de hoy! 🐶❤️ ¡Ya desayuné!"
- "Misión desayuno cumplida gracias a [nombre] 🐾 ¡Lupe satisfecha!"

### Confirmation response (evening)
- "¡Gracias [nombre]! 🐾 Ya estoy cenando, qué rico todo 💛"
- "¡[nombre] me salvó la noche! 🐾🍽️ ¡Qué rica la cena!"
- "¡Yaaaay, gracias [nombre]! 🐾 Lupe feliz y con la pancita llena 🌙💛"
- "¡[nombre] es mi héroe de esta noche! 🐶❤️ ¡Ya cené!"
- "Misión cena cumplida gracias a [nombre] 🐾 ¡Buenas noches con la panza llena!"

---

## Deployment

### Fly.io (free tier)
- Single Node.js process, minimal RAM usage (~128MB)
- WhatsApp session stored in a Fly persistent volume (1GB free)
- No sleep / always-on within free limits

### Environment variables (.env)
```
GROUP_NAME=<exact WhatsApp group name>
TIMEZONE=America/Santiago
```

### Initial setup (manual, one-time)
1. `npm install` on local machine
2. `node src/setup.js` → QR appears in terminal
3. Scan QR with the extra SIM's WhatsApp
4. Session saved to `data/.wwebjs_auth/`
5. `fly launch` + `fly volumes create lupe_data` + `fly deploy`

### Session expiry
WhatsApp Web sessions can expire (typically every few weeks). When this happens:
- The bot logs a warning and stops sending
- User must re-run `node src/setup.js` locally and re-deploy
- Future improvement: add a push notification (email/Telegram) when session expires

---

## Error Handling

- **Group not found:** Bot logs error on startup and exits with clear message
- **Message send failure:** Retry once after 5 seconds, then log and skip
- **State file corrupt:** Reset to `{ morning: false, evening: false }` for today and continue
- **WhatsApp disconnected:** Log warning, attempt reconnect; if it fails, exit (Fly.io restarts the process automatically)

---

## Out of Scope (for now)

- Multi-pet support
- Admin commands via WhatsApp (e.g., "!skip tonight")
- Push notifications when session expires
- Web dashboard
