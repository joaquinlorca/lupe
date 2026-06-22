#!/bin/bash
set -e

echo "============================================"
echo "  Iniciando bot de Lupe"
echo "============================================"
echo

# Verificar que .env existe
if [ ! -f .env ]; then
    echo "ERROR: No existe el archivo .env"
    echo "Copia .env.example como .env y completa GROUP_NAME:"
    echo "  cp .env.example .env && nano .env"
    exit 1
fi

# Detectar Chromium
export PUPPETEER_EXECUTABLE_PATH=$(which chromium-browser 2>/dev/null || which chromium 2>/dev/null)
if [ -z "$PUPPETEER_EXECUTABLE_PATH" ]; then
    echo "ERROR: No se encontro Chromium. Corre primero: ./scripts/1-instalar.sh"
    exit 1
fi

# Detener instancia previa si existe
pm2 delete lupe-bot 2>/dev/null || true

# Iniciar el bot
pm2 start src/index.js --name lupe-bot \
    --env production \
    -e logs/error.log \
    -o logs/out.log

# Guardar para arranque automatico
pm2 save

echo
echo "[OK] Bot iniciado correctamente!"
echo
echo "Comandos utiles:"
echo "  pm2 logs lupe-bot     -> ver logs en tiempo real"
echo "  pm2 status            -> ver estado"
echo "  pm2 restart lupe-bot  -> reiniciar"
echo "  pm2 stop lupe-bot     -> detener"
echo
