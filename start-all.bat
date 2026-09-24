@echo off
echo ========================================================
echo   Starting MobileHub Full-Stack Platform
echo ========================================================
echo.
echo 1. Launching Spring Boot Backend with H2 Database...
start "MobileHub Backend (Spring Boot :8080)" cmd /k "cd backend && run.bat"

echo 2. Launching React + Vite Frontend...
start "MobileHub Frontend (Vite :5173)" cmd /k "cd frontend && run.bat"

echo.
echo All services launched!
echo - Storefront:    http://localhost:5173
echo - Admin Portal:  http://localhost:5173/admin
echo - Backend API:   http://localhost:8080
echo - Swagger Docs:  http://localhost:8080/swagger-ui.html
echo - H2 DB Console: http://localhost:8080/h2-console
echo.
pause
