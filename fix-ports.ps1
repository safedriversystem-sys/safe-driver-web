# Script to fix port conflicts and start Firebase emulators

Write-Host "`n=== Fixing Port Conflicts ===" -ForegroundColor Cyan

# Kill processes on port 8080
Write-Host "`nChecking port 8080..." -ForegroundColor Yellow
$port8080 = Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue
if ($port8080) {
    Write-Host "Found process $($port8080.OwningProcess) on port 8080. Stopping..." -ForegroundColor Yellow
    Stop-Process -Id $port8080.OwningProcess -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 1
    Write-Host "✓ Port 8080 freed" -ForegroundColor Green
} else {
    Write-Host "✓ Port 8080 is free" -ForegroundColor Green
}

# Kill processes on port 9000
Write-Host "`nChecking port 9000..." -ForegroundColor Yellow
$port9000 = Get-NetTCPConnection -LocalPort 9000 -ErrorAction SilentlyContinue
if ($port9000) {
    Write-Host "Found process $($port9000.OwningProcess) on port 9000. Stopping..." -ForegroundColor Yellow
    Stop-Process -Id $port9000.OwningProcess -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 1
    Write-Host "✓ Port 9000 freed" -ForegroundColor Green
} else {
    Write-Host "✓ Port 9000 is free" -ForegroundColor Green
}

# Kill all Java processes (Firebase emulators)
Write-Host "`nChecking for Java processes (Firebase emulators)..." -ForegroundColor Yellow
$javaProcesses = Get-Process java -ErrorAction SilentlyContinue
if ($javaProcesses) {
    Write-Host "Found $($javaProcesses.Count) Java process(es). Stopping..." -ForegroundColor Yellow
    $javaProcesses | Stop-Process -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 1
    Write-Host "✓ Java processes stopped" -ForegroundColor Green
} else {
    Write-Host "✓ No Java processes found" -ForegroundColor Green
}

Write-Host "`n=== Ports are now free! ===" -ForegroundColor Green
Write-Host "`nYou can now start Firebase emulators with:" -ForegroundColor Cyan
Write-Host "  npm run firebase:emulators" -ForegroundColor White
Write-Host ""

