Add-Type @"
using System;
using System.Runtime.InteropServices;
using System.Text;

public class ThreadDesktopInfo {
    [DllImport("user32.dll")]
    public static extern IntPtr GetThreadDesktop(uint dwThreadId);

    [DllImport("kernel32.dll")]
    public static extern uint GetCurrentThreadId();

    [DllImport("user32.dll", SetLastError = true)]
    public static extern bool GetUserObjectInformation(IntPtr hObj, int nIndex, StringBuilder pvInfo, int nLength, out int lpnLengthNeeded);

    public static string GetDesktopName() {
        uint tid = GetCurrentThreadId();
        IntPtr h = GetThreadDesktop(tid);
        if (h == IntPtr.Zero) return "NULL_DESKTOP";
        StringBuilder sb = new StringBuilder(256);
        int needed;
        bool ok = GetUserObjectInformation(h, 2, sb, 256, out needed); // UOI_NAME = 2
        return ok ? sb.ToString() : "ERROR_" + Marshal.GetLastWin32Error();
    }
}
"@

$name = [ThreadDesktopInfo]::GetDesktopName()
Write-Output "Thread Desktop Name: $name"
