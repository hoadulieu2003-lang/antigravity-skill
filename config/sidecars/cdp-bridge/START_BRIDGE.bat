@echo off
chcp 65001 >nul
title CDP Bridge Orchestrator (Port 3005)
echo ============================================================
echo [LAYER 3] KHOI DONG CDP BRIDGE SERVER & ORCHESTRATOR (3005)
echo ============================================================
cd /d "%~dp0"

if not exist "node_modules" (
    echo [INFO] Dang cai dat dependencies cho CDP Bridge...
    call npm install
)

echo [INFO] Dang khoi dong Bridge Server tai http://localhost:3005 ...
node cdp_bridge_server.js
pause
