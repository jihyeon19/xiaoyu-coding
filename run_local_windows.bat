@echo off
set PORT=%1
if "%PORT%"=="" set PORT=8000

set HOST=127.0.0.1
set PORT=%PORT%

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

python server.py
