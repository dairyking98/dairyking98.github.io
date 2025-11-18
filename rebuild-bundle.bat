@echo off
echo Rebuilding differential growth bundle...
echo.

cd /d "%~dp0assets\js\differential-growth"

echo Current directory: %CD%
echo.

echo Running browserify...
call npx browserify entry.js -o ../differential-growth-bundle.js

if %ERRORLEVEL% EQU 0 (
    echo.
    echo Success! Bundle created at assets/js/differential-growth-bundle.js
) else (
    echo.
    echo Build failed with error code %ERRORLEVEL%
)

pause

