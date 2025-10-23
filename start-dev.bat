@echo off
REM HealthMate AI - Development Startup Script (Windows)
REM This script starts both frontend and backend in development mode

echo HealthMate AI - Starting Development Environment
echo ==================================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Check if Python is installed
where python >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Python is not installed. Please install Python first.
    pause
    exit /b 1
)

REM Install frontend dependencies if needed
if not exist "node_modules" (
    echo [INFO] Installing frontend dependencies...
    call npm install
)

REM Install backend dependencies if needed
if not exist "backend-example\venv" (
    echo [INFO] Setting up Python virtual environment...
    cd backend-example
    python -m venv venv
    call venv\Scripts\activate
    pip install -r requirements.txt
    cd ..
)

REM Start backend in new window
echo [INFO] Starting Backend API (http://localhost:8000)...
start "HealthMate Backend" cmd /k "cd backend-example && venv\Scripts\activate && python app.py"

REM Wait for backend to start
timeout /t 3 /nobreak >nul

REM Start frontend in new window
echo [INFO] Starting Frontend (http://localhost:3000)...
start "HealthMate Frontend" cmd /k "npm run dev"

echo.
echo [SUCCESS] Development environment is running!
echo.
echo Frontend: http://localhost:3000
echo Backend API: http://localhost:8000
echo API Docs: http://localhost:8000/docs
echo.
echo Close the terminal windows to stop the servers.
echo.

pause
