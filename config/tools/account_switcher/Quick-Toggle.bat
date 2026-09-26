@echo off
chcp 65001 >nul
title Antigravity 2.0 Quick Toggle (1-Click)
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0AntigravityAccountSwitcher.ps1" -Action toggle
timeout /t 3
