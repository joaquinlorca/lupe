# Lupe Bot 🐾

Bot de WhatsApp que habla como Lupe (la perra) y recuerda al grupo familiar darle de comer dos veces al día. Si nadie confirma antes del horario límite, Lupe manda un mensaje triste y para hasta la próxima comida.

---

## Horarios

| Día | Mañana | Noche |
|-----|--------|-------|
| Lunes a viernes | 8:00 → 9:30 → c/hora → triste 12:30 | 20:00 → c/hora → triste 23:30 |
| Sábado y domingo | 11:00 → 12:00 → triste 13:00 | 20:00 → c/hora → triste 23:30 |

El bot para de recordar en cuanto alguien manda un mensaje de confirmación en el grupo ("ya le di", "listo", "comió", "alimentada", etc.).

---

## Requisitos

- Laptop con **Ubuntu Server LTS** encendida 24/7
- Celular con SIM extra donde estará el WhatsApp del bot
- Repositorio clonado en la laptop

---

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/joaquinlorca/lupe.git
cd lupe
```

### 2. Instalar dependencias

Instala Node.js 18, Chromium, PM2 y configura el arranque automático:

```bash
./scripts/1-instalar.sh
```

### 3. Configurar el grupo de WhatsApp

Copia el archivo de configuración y complétalo:

```bash
cp .env.example .env
nano .env
```

Por ahora dejá `GROUP_NAME` vacío — lo completás después del paso 4.

### 4. Vincular el SIM del bot

Corrés este script, aparece un QR en la terminal, y lo escaneás con WhatsApp en el celular del SIM del bot:

```bash
./scripts/2-vincular-whatsapp.sh
```

Al terminar, el script lista todos los grupos de WhatsApp disponibles. Copiá el nombre **exacto** del grupo de Lupe y pegalo en `.env`:

```bash
nano .env
# GROUP_NAME=nombre exacto del grupo
```

### 5. Iniciar el bot

```bash
./scripts/3-iniciar-bot.sh
```

El bot queda corriendo en segundo plano y arranca automáticamente cada vez que enciende la laptop.

---

## Comandos útiles

```bash
pm2 logs lupe-bot      # ver logs en tiempo real
pm2 status             # ver si el bot está corriendo
pm2 restart lupe-bot   # reiniciar el bot
pm2 stop lupe-bot      # detener el bot
```

---

## ¿Qué pasa si la sesión de WhatsApp expira?

Eventualmente WhatsApp Web cierra la sesión (puede pasar cada pocas semanas). Cuando el bot deja de mandar mensajes, hay que re-vincular:

```bash
pm2 stop lupe-bot
rm -rf data/.wwebjs_auth
./scripts/2-vincular-whatsapp.sh
./scripts/3-iniciar-bot.sh
```

---

## Palabras que se consideran confirmación

El bot reconoce cualquier mensaje del grupo que contenga:

`alimentada` · `ya le di` · `yo le di` · `listo` · `ya comió` · `le di` · `dada` · `comió` · `ya` *(solo si el mensaje tiene 3 palabras o menos)*

La detección no distingue mayúsculas ni tildes.
