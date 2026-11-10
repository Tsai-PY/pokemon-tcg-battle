@echo off
chcp 65001 > nul
cd /d "%~dp0"
title 寶可夢紙牌 (PTCG) 跨裝置對戰伺服器 (筆電 + iPad)
color 0B

echo ===================================================================
echo ⚡ 寶可夢紙牌 (PTCG) 官方對戰系統 · 跨裝置 (筆電 + iPad) 伺服器
echo ===================================================================
echo.
echo 【連線資訊】：
echo 💻 筆記型電腦本機網址: http://localhost:3000
echo.
for /f "tokens=4" %%a in ('route print 0.0.0.0 ^| findstr 0.0.0.0 ^| findstr /v "Persistent" 2^>nul') do (
    set LOCAL_IP=%%a
)
if "%LOCAL_IP%"=="" set LOCAL_IP=172.20.10.4

echo 📱 iPad 請連接相同 Wi-Fi / 手機熱點，並在 Safari 開啟以下網址：
echo    👉 http://%LOCAL_IP%:3000
echo.
echo 👑 系統管理員預設帳號: 0988229731 / 密碼: 19710607
echo ===================================================================
echo.
echo 正在為您開啟筆電瀏覽器...
start "" "http://localhost:3000"
echo 正在啟動即時對戰伺服器...
node server.js
pause
