@echo off
chcp 65001 >nul
title Antigravity 2.0 Ultra Account Switcher
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0AntigravityAccountSwitcher.ps1" interactive
pause
