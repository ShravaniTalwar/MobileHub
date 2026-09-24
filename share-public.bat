@echo off
title MobileHub - Live Public Customer Link
color 0B
echo ===================================================================
echo     MobileHub - Live Public Link for Customers
echo ===================================================================
echo.
echo IMPORTANT:
echo 1. Keep this black window OPEN. If you close it, the link will stop.
echo 2. Make sure MobileHub is already running (start-all.bat).
echo.
echo Connecting to secure tunnel...
echo Copy the https://... link shown below and send it to your customer!
echo ===================================================================
echo.

:tunnel_loop
ssh -p 443 -o StrictHostKeyChecking=no -o ServerAliveInterval=15 -R0:localhost:5173 a.pinggy.io
echo.
echo Tunnel disconnected. Reconnecting in 3 seconds...
timeout /t 3 /nobreak >nul
goto tunnel_loop
