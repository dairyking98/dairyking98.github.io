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

REM Copy index.html from source (preserving UTF-8 encoding)
echo [1/3] Copying index.html from source with UTF-8 encoding...
powershell -NoProfile -Command "Copy-Item '%SOURCE_DIR%\index.html' -Destination '%INDEX_FILE%' -Force"
if errorlevel 1 (
    echo ERROR: Failed to copy index.html
    exit /b 1
)
echo   ✓ Copied successfully with UTF-8 encoding preserved
echo.

REM Update paths for Jekyll site (preserving UTF-8 encoding)
echo [2/3] Updating paths for Jekyll site...
powershell -NoProfile -Command "$file = '%INDEX_FILE%'; $content = Get-Content $file -Raw -Encoding UTF8; $content = $content -replace 'BUTTERCHURN_LIB_PATH: \"\./lib/butterchurn\.min\.js\"', 'BUTTERCHURN_LIB_PATH: \"/music-visualizer/lib/butterchurn.min.js\"'; $content = $content -replace 'PRESETS_WRAPPER_PATH: \"\./presets/butterchurn-presets-wrapper\.js\"', 'PRESETS_WRAPPER_PATH: \"/music-visualizer/presets/butterchurn-presets-wrapper.js\"'; Set-Content $file -Value $content -NoNewline -Encoding UTF8"
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

