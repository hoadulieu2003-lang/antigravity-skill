Add-Type @"
  using System;
  using System.Runtime.InteropServices;
  using System.Text;
  public class WinFocus {
    [DllImport("user32.dll")] public static extern IntPtr GetForegroundWindow();
    [DllImport("user32.dll")] public static extern int GetWindowText(IntPtr hWnd, StringBuilder text, int count);
    [DllImport("user32.dll")] public static extern uint GetWindowThreadProcessId(IntPtr hWnd, out uint processId);
  }
"@
$hwnd = [WinFocus]::GetForegroundWindow()
$sb = New-Object System.Text.StringBuilder 512
[WinFocus]::GetWindowText($hwnd, $sb, 512) | Out-Null
$p = 0
[WinFocus]::GetWindowThreadProcessId($hwnd, [ref]$p) | Out-Null
$proc = Get-Process -Id $p -ErrorAction SilentlyContinue
[PSCustomObject]@{
  Title = $sb.ToString()
  Process = if ($proc) { $proc.ProcessName } else { "Unknown" }
  Pid = $p
} | ConvertTo-Json -Compress
