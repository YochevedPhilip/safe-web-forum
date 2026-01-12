@echo off
REM Safe Web Forum - Setup and Run Script (Batch File)
REM This script installs dependencies, configures environment variables, and runs both server and client

echo ========================================
echo Safe Web Forum - Setup Script
echo ========================================
echo.

REM Check if Node.js is installed
echo Checking Node.js installation...
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed. Please install Node.js v20.19 or higher.
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo [OK] Node.js found: %NODE_VERSION%
echo.

REM Install server dependencies
echo Installing server dependencies...
cd server
if exist node_modules (
    echo Server node_modules already exists. Skipping installation...
) else (
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Failed to install server dependencies
        cd ..
        pause
        exit /b 1
    )
)
echo [OK] Server dependencies installed
cd ..
echo.

REM Install client dependencies
echo Installing client dependencies...
cd client
if exist node_modules (
    echo Client node_modules already exists. Skipping installation...
) else (
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Failed to install client dependencies
        cd ..
        pause
        exit /b 1
    )
)
echo [OK] Client dependencies installed
cd ..
echo.

REM Configure server environment variables
echo Configuring server environment variables...

REM Initialize variables
set SERVER_PORT=
set MONGODB_URI=
set JWT_SECRET=
set OPENAI_API_KEY=

REM Read from .env file if it exists
if exist "server\.env" (
    echo Reading from server .env file...
    for /f "usebackq tokens=2 delims==" %%a in ('findstr /C:"PORT=" "server\.env"') do set SERVER_PORT=%%a
    for /f "usebackq tokens=2 delims==" %%a in ('findstr /C:"MONGODB_URI=" "server\.env"') do set MONGODB_URI=%%a
    for /f "usebackq tokens=2 delims==" %%a in ('findstr /C:"JWT_SECRET=" "server\.env"') do set JWT_SECRET=%%a
    for /f "usebackq tokens=2 delims==" %%a in ('findstr /C:"OPENAI_API_KEY=" "server\.env"') do set OPENAI_API_KEY=%%a
)

REM Prompt for missing values or create new .env file
if not exist "server\.env" (
    echo Creating server .env file...
    echo.
    
    if "%SERVER_PORT%"=="" (
        set /p SERVER_PORT="Enter server PORT (default: 5000): "
        if "%SERVER_PORT%"=="" set SERVER_PORT=5000
    )
    
    if "%MONGODB_URI%"=="" (
        set /p MONGODB_URI="Enter MONGODB_URI (required, e.g., mongodb://localhost:27017/safe-web-forum): "
        if "%MONGODB_URI%"=="" (
            echo [ERROR] MONGODB_URI is required!
            pause
            exit /b 1
        )
    )
    
    if "%JWT_SECRET%"=="" (
        set /p JWT_SECRET="Enter JWT_SECRET (required, any random string): "
        if "%JWT_SECRET%"=="" (
            echo [ERROR] JWT_SECRET is required!
            pause
            exit /b 1
        )
    )
    
    if "%OPENAI_API_KEY%"=="" (
        set /p OPENAI_API_KEY="Enter OPENAI_API_KEY (optional, press Enter to skip): "
    )
    
    (
        echo PORT=%SERVER_PORT%
        echo MONGODB_URI=%MONGODB_URI%
        echo JWT_SECRET=%JWT_SECRET%
    ) > server\.env
    
    if not "%OPENAI_API_KEY%"=="" (
        echo OPENAI_API_KEY=%OPENAI_API_KEY% >> server\.env
    )
    
    echo [OK] Server .env file created
) else (
    REM Check if required values are missing and prompt for them
    set MISSING_VALUES=0
    
    if "%SERVER_PORT%"=="" (
        echo [WARNING] PORT not found in .env file
        set /p SERVER_PORT="Enter server PORT (default: 5000): "
        if "%SERVER_PORT%"=="" set SERVER_PORT=5000
        set MISSING_VALUES=1
    )
    
    if "%MONGODB_URI%"=="" (
        echo [WARNING] MONGODB_URI not found in .env file
        set /p MONGODB_URI="Enter MONGODB_URI (required): "
        if "%MONGODB_URI%"=="" (
            echo [ERROR] MONGODB_URI is required!
            pause
            exit /b 1
        )
        set MISSING_VALUES=1
    )
    
    if "%JWT_SECRET%"=="" (
        echo [WARNING] JWT_SECRET not found in .env file
        set /p JWT_SECRET="Enter JWT_SECRET (required): "
        if "%JWT_SECRET%"=="" (
            echo [ERROR] JWT_SECRET is required!
            pause
            exit /b 1
        )
        set MISSING_VALUES=1
    )
    
    if "%OPENAI_API_KEY%"=="" (
        set /p OPENAI_API_KEY="Enter OPENAI_API_KEY (optional, press Enter to skip): "
        if not "%OPENAI_API_KEY%"=="" set MISSING_VALUES=1
    )
    
    REM Update .env file if values were added
    if %MISSING_VALUES%==1 (
        (
            echo PORT=%SERVER_PORT%
            echo MONGODB_URI=%MONGODB_URI%
            echo JWT_SECRET=%JWT_SECRET%
        ) > server\.env
        
        if not "%OPENAI_API_KEY%"=="" (
            echo OPENAI_API_KEY=%OPENAI_API_KEY% >> server\.env
        )
        echo [OK] Server .env file updated
    ) else (
        echo Server .env file loaded successfully
    )
)
echo.

REM Configure client environment variables
echo Configuring client environment variables...

REM Read PORT from server .env if it exists
set SERVER_PORT=5000
if exist "server\.env" (
    for /f "tokens=2 delims==" %%a in ('findstr /C:"PORT=" server\.env') do set SERVER_PORT=%%a
)

set SERVER_API_URL=http://localhost:%SERVER_PORT%

if not exist "client\.env" if not exist "client\.env.local" (
    echo Creating client .env file...
    echo VITE_SERVER_API_URL=%SERVER_API_URL% > client\.env
    echo [OK] Client .env file created with API URL: %SERVER_API_URL%
) else (
    echo Client .env file already exists. Skipping...
)
echo.

echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Starting server and client in separate windows...
echo.

REM Start server in a new window
start "Safe Web Forum - Server" cmd /k "cd /d %~dp0server && npm run dev"

REM Wait a moment
timeout /t 2 /nobreak >nul

REM Start client in a new window
start "Safe Web Forum - Client" cmd /k "cd /d %~dp0client && npm run dev"

echo [OK] Server and client are starting in separate windows
echo.
echo The application should be available at:
echo   Client: http://localhost:3000
echo   Server: http://localhost:%SERVER_PORT%
echo.
echo To stop the servers, close the command windows or press Ctrl+C in each window.
echo.
pause
