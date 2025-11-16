@echo off
REM Fast Jekyll build script for al-folio
REM Optimized for development - skips slow operations
REM Builds the site to _site/ directory

echo Building Jekyll site (FAST MODE - Development)...
echo.
echo NOTE: This build skips:
echo   - External source fetching (RSS feeds, etc.)
echo   - ImageMagick image processing
echo   - Some slow plugins
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

echo Building site in FAST mode...
echo.
echo Optimizations enabled:
echo   - ImageMagick disabled (no responsive images)
echo   - External sources disabled (no network calls)
echo   - Incremental build (only changed files)
echo   - jekyll-terser disabled (no JS minification)
echo.
REM Use JEKYLL_ENV=development to potentially skip some optimizations
REM Use --incremental for faster rebuilds (only processes changed files)
REM Use _config_dev.yml to disable slow features like ImageMagick and external sources
set JEKYLL_ENV=development
bundle exec bin/jekyll build --incremental --config _config.yml,_config_dev.yml

if %ERRORLEVEL% EQU 0 (
    echo.
    echo Build completed successfully (FAST MODE)!
    echo Site generated in _site/ directory
    echo.
    echo For production build with all features, use: build.bat
) else (
    echo.
    echo Build failed with error code %ERRORLEVEL%
)

echo.
pause

