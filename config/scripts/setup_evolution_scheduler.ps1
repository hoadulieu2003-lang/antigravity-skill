<#
.SYNOPSIS
    Thiet lap Windows Scheduled Task va Khoi dong cho Co may Tu Tien Hoa He Thong Antigravity 2.0.
.DESCRIPTION
    Tu dong dang ky tac vu ngam AntigravityDailySystemEvolution tren Windows Task Scheduler (07:30 hang ngay)
    va thiet lap trigger khi User dang nhap (Logon) qua Windows Startup thu muc ca nhan.
    Van hanh tang hinh 100% qua run_evolution_daily_silent.vbs.
#>

[CmdletBinding()]
param(
    [string]$TaskName = "AntigravityDailySystemEvolution",
    [string]$DailyTime = "07:30"
)

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$VbsPath = Join-Path $ScriptDir "run_evolution_daily_silent.vbs"

if (!(Test-Path $VbsPath)) {
    Write-Error "Khong tim thay file VBScript: $VbsPath"
    exit 1
}

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "DANG KY CO MAY TU TIEN HOA HE THONG ANTIGRAVITY 2.0" -ForegroundColor Green
Write-Host "   Tac vu: $TaskName" -ForegroundColor Yellow
Write-Host "   Lich chay: Hang ngay luc $DailyTime va Khi User dang nhap (Logon)" -ForegroundColor Yellow
Write-Host "   Che do: Tang hinh (wscript.exe) WindowStyle = 0" -ForegroundColor Yellow
Write-Host "============================================================" -ForegroundColor Cyan

# 1. Dang ky Windows Task Scheduler hang ngay luc 07:30
$dailyCmd = "wscript.exe `"$VbsPath`""
$resDaily = schtasks.exe /Create /TN $TaskName /TR $dailyCmd /SC DAILY /ST $DailyTime /F

if ($LASTEXITCODE -eq 0) {
    Write-Host "[OK] Da dang ky thanh cong Windows Scheduled Task: $TaskName (luc $DailyTime)" -ForegroundColor Green
} else {
    Write-Warning "Loi khi dang ky $TaskName qua schtasks.exe"
}

# 2. Dang ky Trigger khi User Dang Nhap (Logon Trigger qua Windows Startup Folder)
$StartupDir = [Environment]::GetFolderPath('Startup')
$StartupVbsPath = Join-Path $StartupDir "AntiEvolutionStartup.vbs"

$startupVbsContent = @"
' Antigravity System Evolution - Startup Logon Trigger
' Runs completely silent on user logon after brief stabilization delay
Dim WshShell
Set WshShell = CreateObject("WScript.Shell")
WScript.Sleep 20000
WshShell.Run "wscript.exe ""$VbsPath""", 0, False
Set WshShell = Nothing
"@

try {
    [System.IO.File]::WriteAllText($StartupVbsPath, $startupVbsContent, [System.Text.Encoding]::ASCII)
    Write-Host "[OK] Da dang ky thanh cong Trigger Logon qua Windows Startup: $StartupVbsPath" -ForegroundColor Green
} catch {
    Write-Warning "Khong the tao file Startup VBS: $_"
}

# 3. Kiem tra va hien thi trang thai he thong
Write-Host "------------------------------------------------------------" -ForegroundColor Cyan
Write-Host "THONG TIN HE THONG KICH HOAT TIEN HOA:" -ForegroundColor Green

try {
    $info = schtasks.exe /Query /TN $TaskName /V /FO LIST 2>$null
    if ($info) {
        Write-Host "`n[Windows Scheduled Task: $TaskName]" -ForegroundColor Yellow
        $info | Where-Object { 
            $_ -match "^TaskName:" -or 
            $_ -match "^Status:" -or 
            $_ -match "^Next Run Time:" -or 
            $_ -match "^Task To Run:"
        } | ForEach-Object { Write-Host "   $_" -ForegroundColor White }
    }
} catch {}

if (Test-Path $StartupVbsPath) {
    Write-Host "`n[Windows Logon Trigger]" -ForegroundColor Yellow
    Write-Host "   Startup Script: $StartupVbsPath" -ForegroundColor White
    Write-Host "   Trang thai: San sang kich hoat khi User dang nhap" -ForegroundColor White
}

Write-Host "`n============================================================" -ForegroundColor Cyan
Write-Host "[HOAN TAT] He thong Tien hoa Tu tri da san sang van hanh 24/7!" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Cyan
