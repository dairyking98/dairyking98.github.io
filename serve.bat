@echo off
REM Jekyll serve script for local development
REM Starts Jekyll server with auto-reload accessible on localhost and local network

echo Starting Jekyll server...
echo.

REM Check if Ruby is installed
ruby --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Ruby is not installed!
    echo.
    echo Please install Ruby first:
    echo   1. Download Ruby+Devkit from https://rubyinstaller.org/downloads/
    echo   2. See INSTALL.md for detailed instructions
    echo.
    pause
    exit /b 1
)

REM Check if dependencies are installed
if not exist "Gemfile.lock" (
    echo Dependencies not installed. Installing dependencies...
    echo.
    bundle install
    if %ERRORLEVEL% NEQ 0 (
        echo.
        echo Installation failed. Please check your Ruby and Bundler setup.
        pause
        exit /b 1
    )
    echo.
)

REM Get local IP addresses and display them
echo.
echo ========================================
echo   Server is starting...
echo ========================================
echo.
echo The site will be available at:
echo   - http://localhost:4000

REM Try PowerShell method to get local IP addresses
setlocal enabledelayedexpansion
set IP_FOUND=0
for /f "tokens=*" %%i in ('powershell -NoProfile -Command "Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.InterfaceAlias -notlike '*Loopback*' -and $_.IPAddress -notlike '169.254.*' -and $_.IPAddress -notlike '127.*'} | Select-Object -ExpandProperty IPAddress" 2^>nul') do (
    set "CURRENT_IP=%%i"
    if not "!CURRENT_IP!"=="" (
        echo   - http://!CURRENT_IP!:4000
        set IP_FOUND=1
    )
)

REM Fallback to ipconfig if PowerShell fails or no IPs found
if !IP_FOUND! EQU 0 (
    for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /i /c:"IPv4 Address" /c:"IPv4-Adresse" 2^>nul') do (
        for /f "tokens=*" %%b in ("%%a") do (
            set "IP_ADDR=%%b"
            set "IP_ADDR=!IP_ADDR: =!"
            if not "!IP_ADDR!"=="127.0.0.1" (
                set "IP_CHECK=!IP_ADDR:~0,7!"
                if not "!IP_CHECK!"=="169.254" (
                    echo   - http://!IP_ADDR!:4000
                    set IP_FOUND=1
                )
            )
        )
    )
)

if !IP_FOUND! EQU 0 (
    echo   - Network IP: Unable to detect automatically
    echo     (Check your IP with: ipconfig)
)
endlocal

echo.
echo Press Ctrl+C to stop the server
echo.

bundle exec jekyll serve --host=0.0.0.0

pause

