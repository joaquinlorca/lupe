#!/bin/bash
set -e

echo "============================================"
echo "  Instalacion del bot de Lupe - Paso 1/2"
echo "============================================"
echo

# Actualizar paquetes
echo "Actualizando paquetes del sistema..."
sudo apt-get update -qq

# Instalar Node.js 18 LTS via NodeSource
if ! command -v node &> /dev/null; then
    echo "Instalando Node.js 18..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
else
    echo "[OK] Node.js ya instalado: $(node --version)"
fi

# Instalar Chromium (requerido por whatsapp-web.js)
echo "Instalando Chromium..."
sudo apt-get install -y chromium-browser fonts-freefont-ttf --no-install-recommends

# Instalar dependencias del proyecto
echo "Instalando dependencias del proyecto..."
npm install

# Instalar PM2 globalmente
echo "Instalando PM2..."
sudo npm install -g pm2

# Configurar PM2 para arrancar con el sistema
echo "Configurando arranque automatico..."
pm2 startup systemd -u $USER --hp $HOME | tail -1 | sudo bash

echo
echo "============================================"
echo "  [OK] Instalacion completa!"
echo "  Ahora corre: ./scripts/2-vincular-whatsapp.sh"
echo "============================================"
