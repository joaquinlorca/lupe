@echo off
echo ============================================
echo   Iniciando bot de Lupe
echo ============================================
echo.

:: Verificar que .env existe
if not exist .env (
    echo ERROR: No existe el archivo .env
    echo Copia .env.example como .env y completa GROUP_NAME
    pause
    exit /b 1
)

:: Detener instancia previa si existe
pm2 delete lupe-bot >nul 2>&1

:: Iniciar el bot con PM2
pm2 start src/index.js --name lupe-bot
if errorlevel 1 (
    echo ERROR: No se pudo iniciar el bot
    pause
    exit /b 1
)

:: Guardar para que arranque automaticamente al encender la PC
pm2 save

echo.
echo [OK] Bot iniciado correctamente!
echo.
echo Para ver los logs en tiempo real:
echo   pm2 logs lupe-bot
echo.
echo Para detener el bot:
echo   pm2 stop lupe-bot
echo.
pause
