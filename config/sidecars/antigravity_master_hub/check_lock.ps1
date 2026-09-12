Add-Type @"
using System;
using System.Runtime.InteropServices;
public class WinLock {
    [DllImport("user32.dll")]
    public static extern IntPtr OpenInputDesktop(uint dwFlags, bool fInherit, uint dwDesiredAccess);
    [DllImport("user32.dll")]
    public static extern bool CloseDesktop(IntPtr hDesktop);
}
"@

$h = [WinLock]::OpenInputDesktop(0, $false, 1)
if ($h -eq [IntPtr]::Zero) {
    Write-Output "STATUS: LOCKED_OR_NO_INPUT_DESKTOP"
} else {
    Write-Output "STATUS: UNLOCKED"
    [WinLock]::CloseDesktop($h) | Out-Null
}
