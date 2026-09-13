<#
.SYNOPSIS
    Thiết lập Windows Scheduled Task cho Nhịp Đập Tự Học Định Kỳ Antigravity (3 tiếng/lần).
.DESCRIPTION
    Tự động đăng ký tác vụ ngầm AntigravityAutonomousLearningPulse trên Windows Task Scheduler.
    Vận hành tàng hình 100% qua run_learning_pulse_silent.vbs, tự chạy bù khi máy tính thức dậy từ Sleep.
#>

[CmdletBinding()]
param(
    [int]$IntervalHours = 3
)

$TaskName = "AntigravityAutonomousLearningPulse"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$VbsPath = Join-Path $ScriptDir "run_learning_pulse_silent.vbs"

if (!(Test-Path $VbsPath)) {
    Write-Error "Không tìm thấy file: $VbsPath"
    exit 1
}

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "🚀 ĐĂNG KÝ NHỊP ĐẬP TỰ HỌC ĐỊNH KỲ ANTIGRAVITY ($IntervalHours TIẾNG/LẦN)" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Cyan

# 1. Định nghĩa Hành Động (Action): Chạy qua wscript.exe ẩn hoàn toàn
$Action = New-ScheduledTaskAction -Execute "wscript.exe" -Argument "`"$VbsPath`""

# 2. Định nghĩa Bộ Kích Hoạt (Triggers):
#    - Trigger 1: Lặp lại mỗi 3 tiếng vô thời hạn
$TriggerDaily = New-ScheduledTaskTrigger -Daily -At "08:00"
$TriggerDaily.Repetition = (New-ScheduledTaskTrigger -Once -At "08:00" -RepetitionInterval (New-TimeSpan -Hours $IntervalHours)).Repetition

#    - Trigger 2: Kích hoạt khi Đăng nhập (Logon)
$TriggerLogon = New-ScheduledTaskTrigger -AtLogOn

$Triggers = @($TriggerDaily, $TriggerLogon)

# 3. Định nghĩa Cấu Hình Tác Vụ (Settings):
#    - StartWhenAvailable: Tự động chạy bù nếu bỏ lỡ lịch khi máy tính đang Sleep/Tắt
#    - AllowStartIfOnBatteries: Vẫn chạy khi dùng pin laptop
#    - DontStopIfGoingOnBatteries: Không bị ngắt khi rút sạc
#    - Priority: 7 (Mức ưu tiên nền, không giật lag máy)
$Settings = New-ScheduledTaskSettingsSet `
    -AllowStartIfOnBatteries `
    -DontStopIfGoingOnBatteries `
    -StartWhenAvailable `
    -Priority 7 `
    -ExecutionTimeLimit (New-TimeSpan -Minutes 15)

# 4. Đăng ký tác vụ vào Windows Task Scheduler bằng schtasks.exe chuẩn xác cho User
try {
    $trCmd = "wscript.exe `"$VbsPath`""
    $res = schtasks.exe /Create /TN $TaskName /TR $trCmd /SC HOURLY /MO $IntervalHours /F
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Đã đăng ký thành công tác vụ: $TaskName" -ForegroundColor Green
        Write-Host "   - Chu kỳ lặp: Mỗi $IntervalHours tiếng" -ForegroundColor Yellow
        Write-Host "   - Chế độ chạy: Tàng hình không hiện cửa sổ (wscript.exe)" -ForegroundColor Yellow
        Write-Host "   - Lệnh thực thi: $trCmd" -ForegroundColor Cyan
    } else {
        throw "schtasks trả về mã lỗi $LASTEXITCODE"
    }
}
catch {
    Write-Error "Lỗi khi đăng ký Scheduled Task: $_"
    exit 1
}
