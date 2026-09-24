@echo off
title Enable MobileHub LAN Sharing (Firewall Rule)
echo ===================================================================
echo     Allowing MobileHub through Windows Firewall for Wi-Fi Access
echo ===================================================================
echo.
echo Note: Right-click this file and select 'Run as administrator' if prompted.
echo.
netsh advfirewall firewall add rule name="MobileHub Vite 5173" dir=in action=allow protocol=TCP localport=5173
netsh advfirewall firewall add rule name="MobileHub Backend 8080" dir=in action=allow protocol=TCP localport=8080
echo.
echo Firewall rules added! Any mobile phone on your Wi-Fi can now connect.
echo.
pause
