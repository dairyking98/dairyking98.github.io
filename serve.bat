@echo off
REM Jekyll serve script for local development
REM Starts Jekyll server with auto-reload on http://localhost:4000

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

echo The site will be available at http://localhost:4000
echo Press Ctrl+C to stop the server
echo.

bundle exec jekyll serve

pause

