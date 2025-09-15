@echo off
echo Starting TripNest Application...
echo.

echo Step 1: Starting Backend Server...
start "Backend Server" cmd /k "npm run server"

echo Step 2: Waiting for backend to start...
timeout /t 5 /nobreak > nul

echo Step 3: Starting Frontend...
start "Frontend" cmd /k "cd frontend && npm start"

echo.
echo TripNest is starting up!
echo Backend will be available at: http://localhost:5000
echo Frontend will be available at: http://localhost:3000
echo.
echo Press any key to close this window...
pause > nul 