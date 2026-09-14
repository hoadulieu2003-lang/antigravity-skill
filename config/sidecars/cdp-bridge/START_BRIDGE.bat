@echo off
chcp 65001 >nul
title CDP Enterprise Bridge MCP Server (Port 9222/9223)
echo ============================================================
echo [LAYER 3] KHOI DONG CDP ENTERPRISE BRIDGE MCP SERVER (v2.0)
echo ============================================================
cd /d "%~dp0"

if not exist "node_modules" (
    echo [INFO] Dang cai dat dependencies cho CDP Bridge...
    call npm install
)

echo [INFO] Dang khoi dong CDP Enterprise MCP Server...
node cdp_mcp_server.js
pause
