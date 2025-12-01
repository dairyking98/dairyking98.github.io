@echo off
REM Batch script to update music visualizer index.html from source
REM Updates paths for Jekyll site and formats with Prettier

setlocal enabledelayedexpansion

set "SOURCE_DIR=C:\Users\Leonard\Documents\GitHub\musicviz2"
set "TARGET_DIR=music-visualizer"
set "INDEX_FILE=%TARGET_DIR%\index.html"

echo ========================================
echo Updating Music Visualizer Index
echo ========================================
echo.

REM Check if source file exists
if not exist "%SOURCE_DIR%\index.html" (
    echo ERROR: Source file not found: %SOURCE_DIR%\index.html
    exit /b 1
)

REM Copy index.html from source
echo [1/3] Copying index.html from source...
copy /Y "%SOURCE_DIR%\index.html" "%INDEX_FILE%" >nul
if errorlevel 1 (
    echo ERROR: Failed to copy index.html
    exit /b 1
)
echo   ✓ Copied successfully
echo.

REM Update paths for Jekyll site
echo [2/3] Updating paths for Jekyll site...
powershell -NoProfile -Command "$content = Get-Content '%INDEX_FILE%' -Raw; $content = $content -replace 'BUTTERCHURN_LIB_PATH: \"\./lib/butterchurn\.min\.js\"', 'BUTTERCHURN_LIB_PATH: \"/music-visualizer/lib/butterchurn.min.js\"'; $content = $content -replace 'PRESETS_WRAPPER_PATH: \"\./presets/butterchurn-presets-wrapper\.js\"', 'PRESETS_WRAPPER_PATH: \"/music-visualizer/presets/butterchurn-presets-wrapper.js\"'; [System.IO.File]::WriteAllText((Resolve-Path '%INDEX_FILE%'), $content, [System.Text.Encoding]::UTF8)"
if errorlevel 1 (
    echo ERROR: Failed to update paths
    exit /b 1
)
echo   ✓ Paths updated
echo.

REM Format with Prettier
echo [3/3] Formatting with Prettier...
call npx prettier --write "%INDEX_FILE%"
if errorlevel 1 (
    echo WARNING: Prettier formatting may have failed
) else (
    echo   ✓ Formatted successfully
)
echo.

echo ========================================
echo Update complete!
echo ========================================
endlocal

