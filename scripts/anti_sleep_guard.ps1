# ============================================================================
# ANTIGRAVITY ENTERPRISE ANTI-SLEEP GUARD (KERNEL EXECUTION STATE DAEMON)
# ============================================================================
# Forces Windows Kernel & Power Manager to stay awake 24/7 using Win32 API:
# SetThreadExecutionState(ES_CONTINUOUS | ES_SYSTEM_REQUIRED | ES_DISPLAY_REQUIRED | ES_AWAYMODE_REQUIRED)
# Prevents S0 Low Power Idle (Modern Standby), Display Off, and System Sleep.
# ============================================================================

$ErrorActionPreference = "Continue"

$code = @"
using System;
using System.Runtime.InteropServices;

public static class KernelPowerGuard {
    [DllImport("kernel32.dll", CharSet = CharSet.Auto, SetLastError = true)]
    public static extern uint SetThreadExecutionState(uint esFlags);

    public const uint ES_SYSTEM_REQUIRED   = 0x00000001;
    public const uint ES_DISPLAY_REQUIRED  = 0x00000002;
    public const uint ES_AWAYMODE_REQUIRED = 0x00000040;
    public const uint ES_CONTINUOUS        = 0x80000000;

    public static uint KeepAwake() {
        return SetThreadExecutionState(ES_CONTINUOUS | ES_SYSTEM_REQUIRED | ES_DISPLAY_REQUIRED | ES_AWAYMODE_REQUIRED);
    }
}
"@

Add-Type -TypeDefinition $code -Language CSharp

# Apply powercfg rules on startup (Áp dụng chính sách nguồn điện mỗi khi khởi động)
powercfg /change standby-timeout-ac 0 | Out-Null
powercfg /change standby-timeout-dc 0 | Out-Null
powercfg /change hibernate-timeout-ac 0 | Out-Null
powercfg /change hibernate-timeout-dc 0 | Out-Null
powercfg /change monitor-timeout-ac 0 | Out-Null
powercfg /change monitor-timeout-dc 0 | Out-Null
powercfg /change disk-timeout-ac 0 | Out-Null
powercfg /change disk-timeout-dc 0 | Out-Null

$statusFile = "C:\Users\game\.gemini\scripts\anti_sleep_status.json"
$res = [KernelPowerGuard]::KeepAwake()
$state = @{
    pid = $PID
    status = "ACTIVE_AWAKE_LOCKED"
    flags = "0x80000043 (ES_CONTINUOUS | ES_SYSTEM_REQUIRED | ES_DISPLAY_REQUIRED | ES_AWAYMODE_REQUIRED)"
    lastHeartbeat = (Get-Date).ToString("o")
    apiReturn = $res
} | ConvertTo-Json
Set-Content -Path $statusFile -Value $state -Encoding UTF8
Write-Output "[AntiSleepGuard] ONLINE - PID=$PID - Win32 Return=$res - Flags=0x80000043"

while ($true) {
    Start-Sleep -Seconds 30
    $res = [KernelPowerGuard]::KeepAwake()
    $state = @{
        pid = $PID
        status = "ACTIVE_AWAKE_LOCKED"
        flags = "0x80000043 (ES_CONTINUOUS | ES_SYSTEM_REQUIRED | ES_DISPLAY_REQUIRED | ES_AWAYMODE_REQUIRED)"
        lastHeartbeat = (Get-Date).ToString("o")
        apiReturn = $res
    } | ConvertTo-Json
    Set-Content -Path $statusFile -Value $state -Encoding UTF8
}
