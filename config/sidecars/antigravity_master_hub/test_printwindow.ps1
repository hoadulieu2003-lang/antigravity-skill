Add-Type -ReferencedAssemblies "System.Drawing.dll" @"
using System;
using System.Runtime.InteropServices;
using System.Drawing;
using System.Drawing.Imaging;

public class WindowSnapshot {
    [DllImport("user32.dll")]
    public static extern IntPtr GetDesktopWindow();

    [DllImport("user32.dll")]
    public static extern IntPtr GetShellWindow();

    [DllImport("user32.dll")]
    public static extern bool PrintWindow(IntPtr hwnd, IntPtr hdcBlt, uint nFlags);

    [DllImport("user32.dll")]
    public static extern bool GetWindowRect(IntPtr hWnd, out RECT lpRect);

    [StructLayout(LayoutKind.Sequential)]
    public struct RECT {
        public int Left, Top, Right, Bottom;
    }

    public static bool CaptureWindow(IntPtr hWnd, string filePath) {
        RECT r;
        GetWindowRect(hWnd, out r);
        int width = r.Right - r.Left;
        int height = r.Bottom - r.Top;
        if (width <= 0 || height <= 0) return false;

        using (Bitmap bmp = new Bitmap(width, height)) {
            using (Graphics g = Graphics.FromImage(bmp)) {
                IntPtr hdc = g.GetHdc();
                try {
                    // PW_RENDERFULLCONTENT = 2
                    bool success = PrintWindow(hWnd, hdc, 2);
                    if (!success) {
                        success = PrintWindow(hWnd, hdc, 0);
                    }
                    g.ReleaseHdc(hdc);
                    if (success) {
                        bmp.Save(filePath, ImageFormat.Png);
                        return true;
                    }
                } catch {
                    g.ReleaseHdc(hdc);
                }
            }
        }
        return false;
    }
}
"@

$desktopHwnd = [WindowSnapshot]::GetDesktopWindow()
$ok = [WindowSnapshot]::CaptureWindow($desktopHwnd, "C:\Users\game\.gemini\config\sidecars\antigravity_master_hub\test_printwindow.png")
Write-Output "PrintWindow Success: $ok"
if ($ok) {
    Write-Output "Size: $((Get-Item C:\Users\game\.gemini\config\sidecars\antigravity_master_hub\test_printwindow.png).Length)"
}
