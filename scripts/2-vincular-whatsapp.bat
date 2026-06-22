@echo off
echo ============================================
echo   Vincular WhatsApp del bot - Paso 2/2
echo ============================================
echo.
echo Vas a ver un codigo QR en esta ventana.
echo Abrelo con WhatsApp en el celular del SIM del bot:
echo   WhatsApp ^> Tres puntos ^> Dispositivos vinculados ^> Vincular dispositivo
echo.
echo Al terminar, el script lista los grupos disponibles.
echo Copia el nombre EXACTO del grupo de Lupe.
echo.
pause

node src/setup.js

echo.
echo ============================================
echo Copia el nombre del grupo de arriba y
echo editalo en el archivo .env:
echo   GROUP_NAME=nombre exacto del grupo
echo.
echo Luego corre: 3-iniciar-bot.bat
echo ============================================
pause
