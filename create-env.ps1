Write-Host "Creating .env file for TripNest..." -ForegroundColor Green

$envContent = @"
MONGODB_URI=mongodb://localhost:27017/tripnest
PORT=5000
JWT_SECRET=your_jwt_secret_here
NODE_ENV=development
"@

$envContent | Out-File -FilePath ".env" -Encoding UTF8

Write-Host ""
Write-Host ".env file created successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Contents:" -ForegroundColor Yellow
Get-Content ".env"
Write-Host ""
Write-Host "Now you can run: npm run server" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to continue..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") 