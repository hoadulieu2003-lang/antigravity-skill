Add-Type -ReferencedAssemblies "System.Drawing.dll" @"
using System;
using System.Runtime.InteropServices;
using System.Drawing;
using System.Drawing.Imaging;

public class RealScreenCapture {
    [DllImport("user32.dll")]
    public static extern IntPtr GetDC(IntPtr hWnd);

    [DllImport("user32.dll")]
    public static extern int ReleaseDC(IntPtr hWnd, IntPtr hDC);

    [DllImport("user32.dll")]
    public static extern int GetSystemMetrics(int nIndex);

    [DllImport("gdi32.dll")]
    public static extern IntPtr CreateCompatibleDC(IntPtr hDC);

    [DllImport("gdi32.dll")]
    public static extern IntPtr CreateCompatibleBitmap(IntPtr hDC, int nWidth, int nHeight);

    [DllImport("gdi32.dll")]
    public static extern IntPtr SelectObject(IntPtr hDC, IntPtr hObject);

    [DllImport("gdi32.dll", SetLastError=true)]
    public static extern bool BitBlt(IntPtr hObject, int nXDest, int nYDest, int nWidth, int nHeight, IntPtr hObjectSource, int nXSrc, int nYSrc, int dwRop);

    [DllImport("gdi32.dll")]
    public static extern bool DeleteDC(IntPtr hDC);

    [DllImport("gdi32.dll")]
    public static extern bool DeleteObject(IntPtr hObject);

    // SRCCOPY (0x00CC0020) | CAPTUREBLT (0x40000000) = 0x40CC0020
    private const int SRCCOPY_CAPTUREBLT = 0x40CC0020;

    public static bool Capture(string filePath) {
        int width = GetSystemMetrics(0);  // SM_CXSCREEN
        int height = GetSystemMetrics(1); // SM_CYSCREEN
        if (width <= 0 || height <= 0) return false;

        IntPtr hdcSrc = GetDC(IntPtr.Zero);
        IntPtr hdcDest = CreateCompatibleDC(hdcSrc);
        IntPtr hBitmap = CreateCompatibleBitmap(hdcSrc, width, height);
        IntPtr hOld = SelectObject(hdcDest, hBitmap);

        bool bltOk = BitBlt(hdcDest, 0, 0, width, height, hdcSrc, 0, 0, SRCCOPY_CAPTUREBLT);
        int err = Marshal.GetLastWin32Error();
        Console.WriteLine("BitBlt ok: " + bltOk + ", Win32 Error: " + err + ", w: " + width + ", h: " + height);

        SelectObject(hdcDest, hOld);
        DeleteDC(hdcDest);
        ReleaseDC(IntPtr.Zero, hdcSrc);

        if (bltOk) {
            using (Bitmap bmp = Image.FromHbitmap(hBitmap)) {
                bmp.Save(filePath, ImageFormat.Png);
            }
            DeleteObject(hBitmap);
            return true;
        }

        DeleteObject(hBitmap);
        return false;
    }
}
"@

$out = "C:\Users\game\.gemini\config\sidecars\antigravity_master_hub\real_screen.png"
$res = [RealScreenCapture]::Capture($out)
Write-Output "Capture result: $res"
if ($res) {
    $item = Get-Item $out
    Write-Output "File size: $($item.Length)"
}
