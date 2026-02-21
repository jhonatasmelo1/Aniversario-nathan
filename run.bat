@echo off
setlocal enabledelayedexpansion
set PATH=C:\Program Files\nodejs;%PATH%
cd /d "%~dp0"

echo Instalando dependências...
call "C:\Program Files\nodejs\npm.cmd" install

if %ERRORLEVEL% NEQ 0 (
  echo Erro na instalação. Tentando remover node_modules...
  rmdir /s /q node_modules
  call "C:\Program Files\nodejs\npm.cmd" cache clean --force
  echo Tentando novamente...
  call "C:\Program Files\nodejs\npm.cmd" install
)

echo.
echo Iniciando servidor de desenvolvimento...
call "C:\Program Files\nodejs\npm.cmd" run dev

pause
