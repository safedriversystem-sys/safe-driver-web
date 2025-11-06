# Script to free port 3000 for Next.js dev server

Write-Host "`n=== Checking Port 3000 ===" -ForegroundColor Cyan

# Check if port 3000 is in use
$port3000 = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue

if ($port3000) {
    Write-Host "Port 3000 is in use by process ID: $($port3000.OwningProcess)" -ForegroundColor Yellow
    
    # Get process info
    $process = Get-Process -Id $port3000.OwningProcess -ErrorAction SilentlyContinue
    if ($process) {
        Write-Host "Process name: $($process.ProcessName)" -ForegroundColor Yellow
        Write-Host "Process path: $($process.Path)" -ForegroundColor Yellow
    }
    
    # Ask for confirmation
    $response = Read-Host "`nDo you want to stop this process? (Y/N)"
    if ($response -eq 'Y' -or $response -eq 'y') {
        Stop-Process -Id $port3000.OwningProcess -Force -ErrorAction SilentlyContinue
        Write-Host "✓ Port 3000 has been freed" -ForegroundColor Green
    } else {
        Write-Host "Port 3000 is still in use. Next.js will use port 3001 instead." -ForegroundColor Yellow
        Write-Host "To use port 3000, stop the process manually or run this script again." -ForegroundColor Yellow
    }
} else {
    Write-Host "✓ Port 3000 is free and available" -ForegroundColor Green
}

Write-Host "`nYou can now run: npm run dev" -ForegroundColor Cyan

