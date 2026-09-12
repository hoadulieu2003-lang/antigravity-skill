Add-Type @"
using System;
using System.Runtime.InteropServices;
using System.Text;

public class WinStationInfo {
    [DllImport("user32.dll")]
    public static extern IntPtr GetProcessWindowStation();

    [DllImport("user32.dll", SetLastError = true)]
    public static extern bool GetUserObjectInformation(IntPtr hObj, int nIndex, StringBuilder pvInfo, int nLength, out int lpnLengthNeeded);

    public static string GetStationName() {
        IntPtr h = GetProcessWindowStation();
        if (h == IntPtr.Zero) return "NULL_STATION";
        StringBuilder sb = new StringBuilder(256);
        int needed;
        bool ok = GetUserObjectInformation(h, 2, sb, 256, out needed); // UOI_NAME = 2
        return ok ? sb.ToString() : "ERROR_" + Marshal.GetLastWin32Error();
    }
}
"@

$name = [WinStationInfo]::GetStationName()
Write-Output "Window Station Name: $name"
