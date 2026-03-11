@echo off
set PORT=%1
if "%PORT%"=="" set PORT=8000

set HOST=127.0.0.1
set PORT=%PORT%

set "PY_CMD="
where py >nul 2>nul
if not errorlevel 1 set "PY_CMD=py -3"

if "%PY_CMD%"=="" (
  where python >nul 2>nul
  if not errorlevel 1 set "PY_CMD=python"
)

if "%PY_CMD%"=="" (
  echo.
  echo [ERROR] Python not found.
  echo Please install Python: https://www.python.org/downloads/windows/
  echo During install, check: Add Python to PATH
  echo.
  pause
  exit /b 1
)

echo.
echo [Private Mode] This site is only for your own computer.
echo Server: http://127.0.0.1:%PORT%
echo Open one of these:
echo   1) http://127.0.0.1:%PORT%/preview.html
echo   2) http://127.0.0.1:%PORT%/
echo   3) http://127.0.0.1:%PORT%/preview/
echo.
echo To stop: press Ctrl + C in this window.
echo.

%PY_CMD% server.py
