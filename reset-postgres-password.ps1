# PostgreSQL Password Reset Script
# Run this script as Administrator

Write-Host "PostgreSQL Password Reset Script" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

$psqlPath = "C:\Program Files\PostgreSQL\17\bin\psql.exe"

if (Test-Path $psqlPath) {
    Write-Host "Found PostgreSQL at: $psqlPath" -ForegroundColor Green
    Write-Host ""
    Write-Host "Attempting to reset postgres user password to: password123" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Please enter your CURRENT postgres password when prompted..." -ForegroundColor Yellow
    Write-Host ""
    
    & $psqlPath -U postgres -d postgres -c "ALTER USER postgres WITH PASSWORD 'password123';"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✓ Password successfully reset to 'password123'" -ForegroundColor Green
        Write-Host ""
        Write-Host "Now testing the connection..." -ForegroundColor Yellow
        node -e "import('./config/database.js').catch(err => console.error(err))"
    } else {
        Write-Host ""
        Write-Host "✗ Failed to reset password. Please try the alternative method below:" -ForegroundColor Red
        Write-Host ""
        Write-Host "Alternative Method - Edit pg_hba.conf:" -ForegroundColor Yellow
        Write-Host "1. Open: C:\Program Files\PostgreSQL\17\data\pg_hba.conf" -ForegroundColor Cyan
        Write-Host "2. Find lines with 'md5' or 'scram-sha-256'" -ForegroundColor Cyan
        Write-Host "3. Change them to 'trust' temporarily" -ForegroundColor Cyan
        Write-Host "4. Restart PostgreSQL service" -ForegroundColor Cyan
        Write-Host "5. Run this script again (no password needed)" -ForegroundColor Cyan
        Write-Host "6. Change 'trust' back to 'scram-sha-256'" -ForegroundColor Cyan
        Write-Host "7. Restart PostgreSQL service again" -ForegroundColor Cyan
    }
} else {
    Write-Host "✗ PostgreSQL not found at expected location" -ForegroundColor Red
    Write-Host "Please update the `$psqlPath variable in this script" -ForegroundColor Yellow
}
