#!/bin/bash
set -e

echo "============================================"
echo "  Vincular WhatsApp del bot - Paso 2/2"
echo "============================================"
echo
echo "Vas a ver un codigo QR en esta terminal."
echo "Abrilo con WhatsApp en el celular del SIM del bot:"
echo "  WhatsApp > Tres puntos > Dispositivos vinculados > Vincular dispositivo"
echo
echo "Presiona Enter para continuar..."
read

export PUPPETEER_EXECUTABLE_PATH=$(which chromium-browser || which chromium)
node src/setup.js

echo
echo "============================================"
echo "Copia el nombre EXACTO del grupo de arriba."
echo "Luego edita el archivo .env:"
echo
echo "  nano .env"
echo
echo "Y completa:"
echo "  GROUP_NAME=nombre exacto del grupo"
echo
echo "Luego corre: ./scripts/3-iniciar-bot.sh"
echo "============================================"
