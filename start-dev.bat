@echo off
echo 🚀 Đang khởi động Frontend và Backend...

REM Start backend server
start "Backend Server" cmd /k "npx tsx server/index.ts"

REM Đợi một chút
timeout /t 2 /nobreak >nul

REM Start frontend
echo ✅ Backend đang chạy
echo 🌐 Đang khởi động Frontend...
npm run dev

