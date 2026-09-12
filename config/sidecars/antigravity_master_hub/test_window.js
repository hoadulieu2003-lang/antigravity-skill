const { exec } = require('child_process');

const psScript = `
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
$sb = New-Object System.Text.StringBuilder 256
[WinFocus]::GetWindowText($hwnd, $sb, 256) | Out-Null
$pid = 0
[WinFocus]::GetWindowThreadProcessId($hwnd, [ref]$pid) | Out-Null
$proc = Get-Process -Id $pid -ErrorAction SilentlyContinue
[PSCustomObject]@{
  Title = $sb.ToString()
  ProcessName = if ($proc) { $proc.ProcessName } else { "Unknown" }
  ProcessId = $pid
} | ConvertTo-Json
`;

exec(`powershell -NoProfile -NonInteractive -Command "${psScript.replace(/"/g, '\\"')}"`, (err, stdout, stderr) => {
  if (err) {
    console.error('ERROR:', err);
    console.error('STDERR:', stderr);
  } else {
    console.log('ACTIVE_WINDOW_JSON:', stdout.trim());
  }
});
