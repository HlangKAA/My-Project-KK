@echo off
title The Lost Spectrum - Starting...
color 0C

echo.
echo  ========================================
echo     THE LOST SPECTRUM - Starting Up
echo  ========================================
echo.

:: ─── Start Backend (Flask) ───
echo  [1/2] Starting Backend (Flask :5000)...
cd /d "%~dp0backend"

:: Activate venv and run Flask in background
start "LostSpectrum-Backend" cmd /k "call venv\Scripts\activate && python run.py"

:: Wait a moment for backend to boot
timeout /t 3 /nobreak >nul

:: ─── Start Frontend (Vite) ───
echo  [2/2] Starting Frontend (Vite :5173)...
cd /d "%~dp0frontend"

start "LostSpectrum-Frontend" cmd /k "npm.cmd run dev"

:: Wait for Vite to boot
timeout /t 4 /nobreak >nul

:: ─── Open Browser ───
echo.
echo  ========================================
echo     Opening browser...
echo  ========================================
echo.
start http://localhost:5173

echo  All systems online!
echo  Backend: http://localhost:5000
echo  Frontend: http://localhost:5173
echo.
echo  Close this window anytime.
echo  To stop servers, close the Backend and Frontend windows.
echo.
pause
