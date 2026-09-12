Add-Type -ReferencedAssemblies "System.Drawing.dll" @"
using System;
using System.Runtime.InteropServices;
using System.Text;
using System.Drawing;
using System.Drawing.Imaging;

public class DesktopSwitcher {
    [DllImport("user32.dll", SetLastError = true)]
    public static extern IntPtr OpenDesktop(string lpszDesktop, uint dwFlags, bool fInherit, uint dwDesiredAccess);

    [DllImport("user32.dll", SetLastError = true)]
    public static extern bool SetThreadDesktop(IntPtr hDesktop);

    [DllImport("user32.dll", SetLastError = true)]
    public static extern bool CloseDesktop(IntPtr hDesktop);

    [DllImport("user32.dll")]
    public static extern IntPtr GetDesktopWindow();

    [DllImport("user32.dll")]
    public static extern IntPtr GetDC(IntPtr hWnd);

    [DllImport("user32.dll")]
    public static extern int ReleaseDC(IntPtr hWnd, IntPtr hDC);

    [DllImport("gdi32.dll")]
    public static extern IntPtr CreateCompatibleDC(IntPtr hDC);

    [DllImport("gdi32.dll")]
    public static extern IntPtr CreateCompatibleBitmap(IntPtr hDC, int nWidth, int nHeight);

    [DllImport("gdi32.dll")]
    public static extern IntPtr SelectObject(IntPtr hDC, IntPtr hObject);

    [DllImport("gdi32.dll", SetLastError = true)]
    public static extern bool BitBlt(IntPtr hObject, int nXDest, int nYDest, int nWidth, int nHeight, IntPtr hObjectSource, int nXSrc, int nYSrc, int dwRop);

    [DllImport("gdi32.dll")]
    public static extern bool DeleteDC(IntPtr hDC);

    [DllImport("gdi32.dll")]
    public static extern bool DeleteObject(IntPtr hObject);

    const uint DESKTOP_ALL = 0x01FF;

    public static string SwitchAndCapture(string outputPath) {
        IntPtr hDesk = OpenDesktop("default", 0, false, DESKTOP_ALL);
        if (hDesk == IntPtr.Zero) {
            return "FAILED_OPEN_DEFAULT: " + Marshal.GetLastWin32Error();
        }

        bool setOk = SetThreadDesktop(hDesk);
        if (!setOk) {
            int err = Marshal.GetLastWin32Error();
            CloseDesktop(hDesk);
            return "FAILED_SET_THREAD_DESKTOP: " + err;
        }

        try {
            int width = 1920;
            int height = 1080;
            IntPtr hdcSrc = GetDC(IntPtr.Zero);
            IntPtr hdcDest = CreateCompatibleDC(hdcSrc);
            IntPtr hBmp = CreateCompatibleBitmap(hdcSrc, width, height);
            IntPtr hOld = SelectObject(hdcDest, hBmp);

            // SRCCOPY | CAPTUREBLT
            bool bltOk = BitBlt(hdcDest, 0, 0, width, height, hdcSrc, 0, 0, 0x40CC0020);
            int bltErr = Marshal.GetLastWin32Error();

            SelectObject(hdcDest, hOld);
            DeleteDC(hdcDest);
            ReleaseDC(IntPtr.Zero, hdcSrc);

            if (bltOk) {
                using (Bitmap bmp = Image.FromHbitmap(hBmp)) {
                    bmp.Save(outputPath, ImageFormat.Png);
                }
                DeleteObject(hBmp);
                return "SUCCESS_SWITCH_AND_CAPTURE";
            } else {
                DeleteObject(hBmp);
                return "FAILED_BITBLT: " + bltErr;
            }
        } finally {
            CloseDesktop(hDesk);
        }
    }
}
"@

$out = "C:\Users\game\.gemini\config\sidecars\antigravity_master_hub\switched_desktop.png"
$res = [DesktopSwitcher]::SwitchAndCapture($out)
Write-Output "Result: $res"
if (Test-Path $out) {
    Write-Output "Size: $((Get-Item $out).Length)"
}
