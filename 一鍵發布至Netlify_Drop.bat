@echo off
chcp 65001 >nul
title 寶可夢紙牌 (PTCG) 對戰系統 · 一鍵發布至 Netlify Drop
color 0A

echo =======================================================================
echo        ⚡ 寶可夢紙牌對戰系統 · 一鍵發布至 Netlify Drop (免費永久網址)
echo =======================================================================
echo.
echo 說明：
echo 1. 本程式將自動為您開啟【Netlify Drop 免費發布網頁】與【部署資料夾】。
echo 2. 您只需要將「pokemon-deploy-web」資料夾（或「pokemon-web.zip」壓縮檔）
echo    直接「拖曳」進瀏覽器 Netlify 頁面中央的虛線框中！
echo 3. 5 秒內 Netlify 就會為您生成全世界都能連線的正式 HTTPS 網址！
echo.
echo =======================================================================
echo.
echo 正在開啟 Netlify Drop 發布網頁 (https://app.netlify.com/drop)...
start "" "https://app.netlify.com/drop"

echo 正在開啟發布目錄...
explorer.exe /select,"%~dp0..\pokemon-deploy-web\index.html"

echo.
echo =======================================================================
echo 【發布步驟說明】：
echo  步驟 1：瀏覽器會自動開啟 Netlify Drop 頁面 (可用 Email 或 GitHub 免費登入)
echo  步驟 2：回到已開啟的檔案總管，將「pokemon-deploy-web」整個資料夾
echo          (或 pokemon-web.zip) 直接拖拉進 Netlify 網頁的虛線區域。
echo  步驟 3：上傳完成後，網頁會立即顯示您的專屬網址 (例如：xxxx.netlify.app)！
echo  步驟 4：點擊 [Site configuration] -> [Change site name] 即可自訂好記的網址。
echo =======================================================================
echo.
pause
