@echo off
echo ============================================
echo   Instalacion del bot de Lupe - Paso 1/2
echo ============================================
echo.

:: Verificar que Node.js este instalado
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js no esta instalado.
    echo.
    echo Instala Node.js desde: https://nodejs.org
    echo Descarga la version LTS y ejecuta el instalador.
    echo Luego vuelve a correr este script.
    pause
    exit /b 1
)

echo [OK] Node.js detectado:
node --version
echo.

:: Instalar dependencias del proyecto
echo Instalando dependencias del proyecto...
call npm install
if errorlevel 1 (
    echo ERROR: Fallo npm install
    pause
    exit /b 1
)
echo [OK] Dependencias instaladas
echo.

:: Instalar PM2 globalmente
echo Instalando PM2 (gestor de procesos)...
call npm install -g pm2
if errorlevel 1 (
    echo ERROR: Fallo la instalacion de PM2
    pause
    exit /b 1
)
echo [OK] PM2 instalado
echo.

:: Instalar pm2-windows-startup
echo Configurando inicio automatico con Windows...
call npm install -g pm2-windows-startup
if errorlevel 1 (
    echo ERROR: Fallo pm2-windows-startup
    pause
    exit /b 1
)
call pm2-startup install
echo [OK] Inicio automatico configurado
echo.

echo ============================================
echo   Listo! Ahora corre: 2-vincular-whatsapp.bat
echo ============================================
pause
