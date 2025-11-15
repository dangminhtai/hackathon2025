# PowerShell script để chạy cả frontend và backend
# Chạy: .\start-dev.ps1

Write-Host "🚀 Đang khởi động Frontend và Backend..." -ForegroundColor Green

# Start backend server trong background
$backend = Start-Process -NoNewWindow -PassThru -FilePath "npx" -ArgumentList "tsx server/index.ts"

# Đợi một chút để backend khởi động
Start-Sleep -Seconds 2

# Start frontend dev server
Write-Host "✅ Backend đang chạy (PID: $($backend.Id))" -ForegroundColor Green
Write-Host "🌐 Đang khởi động Frontend..." -ForegroundColor Cyan

npm run dev

# Cleanup khi thoát
Write-Host "`n🛑 Đang dừng các process..." -ForegroundColor Yellow
Stop-Process -Id $backend.Id -ErrorAction SilentlyContinue

