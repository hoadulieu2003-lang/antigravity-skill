param(
    [string]$outputPath = "C:\Users\game\.gemini\antigravity-ide\brain\fd77714d-97c6-48db-9c07-b7f387af6b39\desktop_real.png"
)

Add-Type -ReferencedAssemblies "System.Drawing.dll" @"
using System;
using System.Runtime.InteropServices;
using System.Threading;
using System.Drawing;
using System.Drawing.Imaging;

public class ThreadDesktopCapture {
    [DllImport("user32.dll", SetLastError = true)]
    public static extern IntPtr OpenDesktop(string lpszDesktop, uint dwFlags, bool fInherit, uint dwDesiredAccess);

    [DllImport("user32.dll", SetLastError = true)]
    public static extern bool SetThreadDesktop(IntPtr hDesktop);

    [DllImport("user32.dll", SetLastError = true)]
    public static extern bool CloseDesktop(IntPtr hDesktop);

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

    [DllImport("user32.dll")]
    public static extern int GetSystemMetrics(int nIndex);

    const uint DESKTOP_ALL = 0x01FF;

    public static string Capture(string path) {
        string result = "UNKNOWN";

        Thread worker = new Thread(() => {
            IntPtr hDesk = OpenDesktop("default", 0, false, DESKTOP_ALL);
            if (hDesk == IntPtr.Zero) {
                result = "FAILED_OPEN_DEFAULT: " + Marshal.GetLastWin32Error();
                return;
            }

            bool setOk = SetThreadDesktop(hDesk);
            if (!setOk) {
                int err = Marshal.GetLastWin32Error();
                CloseDesktop(hDesk);
                result = "FAILED_SET_THREAD_DESKTOP: " + err;
                return;
            }

            try {
                int width = GetSystemMetrics(0);  // 1920
                int height = GetSystemMetrics(1); // 1080
                IntPtr hdcSrc = GetDC(IntPtr.Zero);
                IntPtr hdcDest = CreateCompatibleDC(hdcSrc);
                IntPtr hBmp = CreateCompatibleBitmap(hdcSrc, width, height);
                IntPtr hOld = SelectObject(hdcDest, hBmp);

                bool bltOk = BitBlt(hdcDest, 0, 0, width, height, hdcSrc, 0, 0, 0x40CC0020);
                int bltErr = Marshal.GetLastWin32Error();

                SelectObject(hdcDest, hOld);
                DeleteDC(hdcDest);
                ReleaseDC(IntPtr.Zero, hdcSrc);

                if (bltOk) {
                    string dir = System.IO.Path.GetDirectoryName(path);
                    if (!System.IO.Directory.Exists(dir)) {
                        System.IO.Directory.CreateDirectory(dir);
                    }
                    using (Bitmap bmp = Image.FromHbitmap(hBmp)) {
                        bmp.Save(path, ImageFormat.Png);
                    }
                    DeleteObject(hBmp);
                    result = "SUCCESS: " + width + "x" + height;
                } else {
                    DeleteObject(hBmp);
                    result = "FAILED_BITBLT: " + bltErr;
                }
            } catch (Exception ex) {
                result = "EXCEPTION: " + ex.Message;
            } finally {
                CloseDesktop(hDesk);
            }
        });

        worker.SetApartmentState(ApartmentState.STA);
        worker.Start();
        worker.Join(10000);

        return result;
    }
}
"@

$res = [ThreadDesktopCapture]::Capture($outputPath)
Write-Output $res
