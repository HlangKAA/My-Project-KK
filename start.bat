@echo off
setlocal
title The Lost Spectrum - Starting
set "ROOT=%~dp0"

echo.
echo  THE LOST SPECTRUM
echo  =================
echo.

if not exist "%ROOT%backend\venv\Scripts\python.exe" (
    echo  Backend Python is missing. Set up backend\venv first.
    goto :failed
)
if not exist "%ROOT%frontend\node_modules\.bin\vite.cmd" (
    echo  Frontend packages are missing. Run npm.cmd install in frontend.
    goto :failed
)

curl.exe -fsS --max-time 2 -o NUL "http://127.0.0.1:5000/" >nul 2>&1
if errorlevel 1 (
    echo  Starting backend on port 5000...
    start "LostSpectrum-Backend" /D "%ROOT%backend" cmd /k "venv\Scripts\python.exe run.py"
) else (
    echo  Backend is already running on port 5000.
)
call :wait_for "http://127.0.0.1:5000/" "Backend"
if errorlevel 1 goto :failed

curl.exe -fsS --max-time 2 -o NUL "http://127.0.0.1:5173/" >nul 2>&1
if errorlevel 1 (
    echo  Starting frontend on port 5173...
    start "LostSpectrum-Frontend" /D "%ROOT%frontend" cmd /k "npm.cmd run dev -- --host 127.0.0.1 --strictPort"
) else (
    echo  Frontend is already running on port 5173.
)
call :wait_for "http://127.0.0.1:5173/" "Frontend"
if errorlevel 1 goto :failed

echo.
echo  Opening the game at http://127.0.0.1:5173/
start "" "http://127.0.0.1:5173/"
if errorlevel 1 (
    echo  Browser did not open automatically. Open http://127.0.0.1:5173/ manually.
)
echo  To stop the game, close the Backend and Frontend windows.
echo.
pause
exit /b 0

:wait_for
set /a attempts=0
:wait_loop
curl.exe -fsS --max-time 2 -o NUL "%~1" >nul 2>&1
if not errorlevel 1 (
    echo  %~2 is ready.
    exit /b 0
)
set /a attempts+=1
if %attempts% GEQ 30 (
    echo  %~2 did not start. Check its server window for the error.
    exit /b 1
)
ping -n 2 127.0.0.1 >nul
goto :wait_loop

:failed
echo.
echo  Startup stopped. Fix the message above, then run start.bat again.
echo.
pause
exit /b 1
