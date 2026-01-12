# Safe Web Forum - Setup and Run Script
# This script installs dependencies, configures environment variables, and runs both server and client

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Safe Web Forum - Setup Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js found: $nodeVersion" -ForegroundColor Green
    
    # Check version (should be >= 20.19)
    $versionNumber = [version]($nodeVersion -replace 'v', '')
    $requiredVersion = [version]"20.19.0"
    if ($versionNumber -lt $requiredVersion) {
        Write-Host "⚠ Warning: Node.js version should be >= 20.19.0" -ForegroundColor Yellow
    }
} catch {
    Write-Host "✗ Node.js is not installed. Please install Node.js v20.19 or higher." -ForegroundColor Red
    Write-Host "Download from: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Install server dependencies
Write-Host "Installing server dependencies..." -ForegroundColor Yellow
Set-Location server
if (Test-Path "node_modules") {
    Write-Host "Server node_modules already exists. Skipping installation..." -ForegroundColor Gray
} else {
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "✗ Failed to install server dependencies" -ForegroundColor Red
        Set-Location ..
        exit 1
    }
}
Write-Host "✓ Server dependencies installed" -ForegroundColor Green
Set-Location ..

Write-Host ""

# Install client dependencies
Write-Host "Installing client dependencies..." -ForegroundColor Yellow
Set-Location client
if (Test-Path "node_modules") {
    Write-Host "Client node_modules already exists. Skipping installation..." -ForegroundColor Gray
} else {
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "✗ Failed to install client dependencies" -ForegroundColor Red
        Set-Location ..
        exit 1
    }
}
Write-Host "✓ Client dependencies installed" -ForegroundColor Green
Set-Location ..

Write-Host ""

# Configure server environment variables
Write-Host "Configuring server environment variables..." -ForegroundColor Yellow
$serverEnvPath = "server\.env"
$serverEnvExamplePath = "server\env.example"

if (-not (Test-Path $serverEnvPath)) {
    Write-Host "Creating server .env file..." -ForegroundColor Gray
    
    # Read example file
    $envContent = @()
    if (Test-Path $serverEnvExamplePath) {
        $envContent = Get-Content $serverEnvExamplePath
    }
    
    # Default values
    $port = "5000"
    $mongodbUri = ""
    $jwtSecret = ""
    $openaiApiKey = ""
    
    # Prompt for PORT
    $portInput = Read-Host "Enter server PORT (default: 5000)"
    if ($portInput -ne "") {
        $port = $portInput
    }
    
    # Prompt for MONGODB_URI (required)
    do {
        $mongodbUri = Read-Host "Enter MONGODB_URI (required, e.g., mongodb://localhost:27017/safe-web-forum)"
        if ($mongodbUri -eq "") {
            Write-Host "MONGODB_URI is required!" -ForegroundColor Red
        }
    } while ($mongodbUri -eq "")
    
    # Prompt for JWT_SECRET (required)
    do {
        $jwtSecret = Read-Host "Enter JWT_SECRET (required, any random string)"
        if ($jwtSecret -eq "") {
            Write-Host "JWT_SECRET is required!" -ForegroundColor Red
        }
    } while ($jwtSecret -eq "")
    
    # Prompt for OPENAI_API_KEY (optional)
    $openaiApiKey = Read-Host "Enter OPENAI_API_KEY (optional, press Enter to skip)"
    
    # Write .env file
    $envContent = @(
        "PORT=$port",
        "MONGODB_URI=$mongodbUri",
        "JWT_SECRET=$jwtSecret"
    )
    
    if ($openaiApiKey -ne "") {
        $envContent += "OPENAI_API_KEY=$openaiApiKey"
    }
    
    $envContent | Out-File -FilePath $serverEnvPath -Encoding utf8
    Write-Host "✓ Server .env file created" -ForegroundColor Green
} else {
    Write-Host "Server .env file already exists. Skipping..." -ForegroundColor Gray
}

Write-Host ""

# Configure client environment variables
Write-Host "Configuring client environment variables..." -ForegroundColor Yellow
$clientEnvPath = "client\.env"
$clientEnvLocalPath = "client\.env.local"

# Determine server URL from server .env (read from file whether we just created it or it already existed)
$serverPort = "5000"  # Default
if (Test-Path $serverEnvPath) {
    $serverEnvContent = Get-Content $serverEnvPath
    foreach ($line in $serverEnvContent) {
        if ($line -match "^PORT=(.+)$") {
            $serverPort = $matches[1].Trim()
            break
        }
    }
}

$serverApiUrl = "http://localhost:$serverPort"

if (-not (Test-Path $clientEnvPath) -and -not (Test-Path $clientEnvLocalPath)) {
    Write-Host "Creating client .env file..." -ForegroundColor Gray
    
    $clientEnvContent = @(
        "VITE_SERVER_API_URL=$serverApiUrl"
    )
    
    $clientEnvContent | Out-File -FilePath $clientEnvPath -Encoding utf8
    Write-Host "✓ Client .env file created with API URL: $serverApiUrl" -ForegroundColor Green
} else {
    Write-Host "Client .env file already exists. Skipping..." -ForegroundColor Gray
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Starting server and client in separate windows..." -ForegroundColor Yellow
Write-Host ""

# Get the current directory
$rootPath = Get-Location

# Start server in a new window
Write-Host "Opening server window..." -ForegroundColor Cyan
$serverScript = @"
`$Host.UI.RawUI.WindowTitle = 'Safe Web Forum - Server'
Set-Location '$rootPath\server'
Write-Host 'Starting server on port $serverPort...' -ForegroundColor Green
npm run dev
Write-Host '`nPress any key to close this window...' -ForegroundColor Yellow
`$null = `$Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')
"@

Start-Process powershell -ArgumentList "-NoExit", "-Command", $serverScript

# Wait a moment before starting client
Start-Sleep -Seconds 2

# Start client in a new window
Write-Host "Opening client window..." -ForegroundColor Cyan
$clientScript = @"
`$Host.UI.RawUI.WindowTitle = 'Safe Web Forum - Client'
Set-Location '$rootPath\client'
Write-Host 'Starting client...' -ForegroundColor Green
npm run dev
Write-Host '`nPress any key to close this window...' -ForegroundColor Yellow
`$null = `$Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')
"@

Start-Process powershell -ArgumentList "-NoExit", "-Command", $clientScript

Write-Host ""
Write-Host "✓ Server and client are starting in separate windows" -ForegroundColor Green
Write-Host ""
Write-Host "The application should be available at:" -ForegroundColor Yellow
Write-Host "  Client: http://localhost:3000" -ForegroundColor Cyan
Write-Host "  Server: http://localhost:$serverPort" -ForegroundColor Cyan
Write-Host ""
Write-Host "To stop the servers, close the PowerShell windows or press Ctrl+C in each window." -ForegroundColor Yellow
Write-Host ""
