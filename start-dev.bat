@echo off
set PATH=C:\Program Files\nodejs;%PATH%
echo Instalando dependências...
"C:\Program Files\nodejs\npm.cmd" install
echo.
echo Iniciando servidor de desenvolvimento...
"C:\Program Files\nodejs\npm.cmd" run dev
pause
