@echo off
REM Build script for differential growth - bundles the CommonJS modules using browserify

echo Building differential growth bundle...
echo.

REM Navigate to project root
cd /d "%~dp0"

REM Install dependencies if node_modules doesn't exist in differential-growth folder
if not exist "assets\js\differential-growth\node_modules" (
    echo Installing dependencies...
    cd assets\js\differential-growth
    call npm install vec2@1.6.0 rbush@3.0.1 rbush-knn@3.0.0 svg-points@6.0.1 file-saver@2.0.5 point-in-polygon@1.0.1 svg-pathdata@5.0.2 browserify
    cd ..\..\..
    echo.
)

REM Use the build-bundle.js script which works reliably
echo Running build script...
node build-bundle.js

if %ERRORLEVEL% EQU 0 (
    echo.
    echo Build complete! Bundle saved to assets/js/differential-growth-bundle.js
) else (
    echo.
    echo Build failed! Please check the error messages above.
    exit /b 1
)

pause
