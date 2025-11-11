@echo off
REM Jekyll build script for al-folio
REM Builds the site to _site/ directory

echo Building Jekyll site...
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

echo Building site...
bundle exec jekyll build

if %ERRORLEVEL% EQU 0 (
    echo.
    echo Build completed successfully!
    echo Site generated in _site/ directory
) else (
    echo.
    echo Build failed with error code %ERRORLEVEL%
)

echo.
pause

