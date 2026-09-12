Add-Type -ReferencedAssemblies "System.Drawing.dll" @"
using System;
using System.Runtime.InteropServices;
using System.Drawing;
using System.Drawing.Imaging;
using System.Collections.Generic;

public class AppCapture {
    [DllImport("user32.dll")]
    public static extern bool EnumWindows(EnumWindowsProc enumProc, IntPtr lParam);
    public delegate bool EnumWindowsProc(IntPtr hWnd, IntPtr lParam);

    [DllImport("user32.dll")]
    public static extern bool IsWindowVisible(IntPtr hWnd);

    [DllImport("user32.dll", CharSet = CharSet.Auto)]
    public static extern int GetWindowText(IntPtr hWnd, System.Text.StringBuilder lpString, int nMaxCount);

    [DllImport("user32.dll")]
    public static extern bool GetWindowRect(IntPtr hWnd, out RECT lpRect);

    [DllImport("user32.dll")]
    public static extern bool PrintWindow(IntPtr hwnd, IntPtr hdcBlt, uint nFlags);

    [StructLayout(LayoutKind.Sequential)]
    public struct RECT {
        public int Left, Top, Right, Bottom;
    }

    public static string CaptureFirstVisibleWindow(string outputPath) {
        IntPtr targetHwnd = IntPtr.Zero;
        string targetTitle = "";

        EnumWindows((hWnd, lParam) => {
            if (IsWindowVisible(hWnd)) {
                RECT r;
                GetWindowRect(hWnd, out r);
                int w = r.Right - r.Left;
                int h = r.Bottom - r.Top;
                if (w > 400 && h > 300) {
                    var sb = new System.Text.StringBuilder(256);
                    GetWindowText(hWnd, sb, 256);
                    string t = sb.ToString();
                    if (!string.IsNullOrEmpty(t) && !t.Contains("Program Manager")) {
                        targetHwnd = hWnd;
                        targetTitle = t;
                        return false; // Stop enumeration
                    }
                }
            }
            return true;
        }, IntPtr.Zero);

        if (targetHwnd == IntPtr.Zero) return "NO_WINDOW_FOUND";

        RECT rect;
        GetWindowRect(targetHwnd, out rect);
        int width = rect.Right - rect.Left;
        int height = rect.Bottom - rect.Top;

        using (Bitmap bmp = new Bitmap(width, height)) {
            using (Graphics g = Graphics.FromImage(bmp)) {
                IntPtr hdc = g.GetHdc();
                // PW_RENDERFULLCONTENT = 2
                bool ok = PrintWindow(targetHwnd, hdc, 2);
                if (!ok) ok = PrintWindow(targetHwnd, hdc, 0);
                g.ReleaseHdc(hdc);

                if (ok) {
                    bmp.Save(outputPath, ImageFormat.Png);
                    return "CAPTURED: " + targetTitle + " (" + width + "x" + height + ")";
                }
            }
        }

        return "PRINTWINDOW_FAILED: " + targetTitle;
    }
}
"@

$out = "C:\Users\game\.gemini\config\sidecars\antigravity_master_hub\window_captured.png"
$res = [AppCapture]::CaptureFirstVisibleWindow($out)
Write-Output $res
if (Test-Path $out) {
    Write-Output "Size: $((Get-Item $out).Length)"
}
