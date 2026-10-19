param(
    [string]$Action = "submit_prompt",
    [string]$PromptFile = "C:\Users\game\.gemini\antigravity\brain\f021a755-5507-4b57-9ee0-a993c0cad6ce\scratch\codex_handover_prompt.txt",
    [string]$OutJson = "C:\Users\game\.gemini\antigravity\brain\f021a755-5507-4b57-9ee0-a993c0cad6ce\scratch\codex_driver_out.json",
    [string]$CapturePath = "C:\Users\game\.gemini\antigravity\brain\f021a755-5507-4b57-9ee0-a993c0cad6ce\scratch\codex_after_submit.png"
)

$OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$csharp = @"
using System;
using System.IO;
using System.Text;
using System.Threading;
using System.Diagnostics;
using System.Collections.Generic;
using System.Runtime.InteropServices;
using System.Windows.Forms;
using System.Drawing;
using System.Windows.Automation;

public class CodexWinInfo {
    public long hwnd;
    public int pid;
    public string processName;
    public string title;
    public string className;
    public bool isVisible;
    public bool isIconic;
    public int x;
    public int y;
    public int width;
    public int height;
}

public class CodexNodeInfo {
    public string controlType;
    public string name;
    public string value;
    public string className;
    public string automationId;
    public int centerX;
    public int centerY;
    public int width;
    public int height;
}

public class CodexDriverResult {
    public bool ok;
    public string action;
    public bool setThreadDesktopOk;
    public int setThreadDesktopErr;
    public long targetHwnd;
    public string statusMessage;
    public int promptLength;
    public bool foundEdit;
    public bool clickedFullView;
    public bool clickedSendButton;
    public bool isCodexBusy;
    public int userMessageCount;
    public List<CodexWinInfo> codexWindows = new List<CodexWinInfo>();
    public List<CodexNodeInfo> chatAreaTailNodes = new List<CodexNodeInfo>();
}

public static class CodexDesktopNative {
    public delegate bool EnumWindowsProc(IntPtr hWnd, IntPtr lParam);

    [DllImport("user32.dll")]
    public static extern bool SetProcessDPIAware();

    [DllImport("user32.dll", CharSet = CharSet.Unicode, SetLastError = true)]
    public static extern IntPtr OpenWindowStationW(string lpszWinSta, bool fInherit, uint dwDesiredAccess);

    [DllImport("user32.dll", SetLastError = true)]
    public static extern bool SetProcessWindowStation(IntPtr hWinSta);

    [DllImport("user32.dll", CharSet = CharSet.Unicode, SetLastError = true)]
    public static extern IntPtr OpenDesktopW(string lpszDesktop, uint dwFlags, bool fInherit, uint dwDesiredAccess);

    [DllImport("user32.dll", SetLastError = true)]
    public static extern bool SetThreadDesktop(IntPtr hDesktop);

    [DllImport("user32.dll")]
    public static extern bool EnumDesktopWindows(IntPtr hDesktop, EnumWindowsProc lpfn, IntPtr lParam);

    [DllImport("user32.dll")]
    public static extern bool EnumChildWindows(IntPtr hWndParent, EnumWindowsProc lpEnumFunc, IntPtr lParam);

    [DllImport("user32.dll")]
    public static extern bool IsWindowVisible(IntPtr hWnd);

    [DllImport("user32.dll")]
    public static extern bool IsIconic(IntPtr hWnd);

    [DllImport("user32.dll")]
    public static extern bool IsWindow(IntPtr hWnd);

    [DllImport("user32.dll", CharSet = CharSet.Unicode)]
    public static extern int GetWindowText(IntPtr hWnd, StringBuilder strText, int maxCount);

    [DllImport("user32.dll", CharSet = CharSet.Unicode)]
    public static extern int GetWindowTextLength(IntPtr hWnd);

    [DllImport("user32.dll", CharSet = CharSet.Unicode)]
    public static extern int GetClassName(IntPtr hWnd, StringBuilder lpClassName, int nMaxCount);

    [DllImport("user32.dll")]
    public static extern uint GetWindowThreadProcessId(IntPtr hWnd, out uint lpdwProcessId);

    [DllImport("user32.dll")]
    public static extern bool GetWindowRect(IntPtr hWnd, out RECT lpRect);

    [DllImport("user32.dll")]
    public static extern int GetWindowLong(IntPtr hWnd, int nIndex);

    [DllImport("user32.dll")]
    public static extern bool ShowWindow(IntPtr hWnd, int nCmdShow);

    [DllImport("user32.dll")]
    public static extern bool SetForegroundWindow(IntPtr hWnd);

    [DllImport("user32.dll")]
    public static extern IntPtr GetForegroundWindow();

    [DllImport("user32.dll")]
    public static extern IntPtr WindowFromPoint(POINT Point);

    [DllImport("user32.dll")]
    public static extern IntPtr GetAncestor(IntPtr hwnd, uint gaFlags);

    [DllImport("user32.dll")]
    public static extern bool BringWindowToTop(IntPtr hWnd);

    [DllImport("user32.dll")]
    public static extern void keybd_event(byte bVk, byte bScan, uint dwFlags, UIntPtr dwExtraInfo);

    [DllImport("user32.dll")]
    public static extern bool SetCursorPos(int X, int Y);

    [DllImport("user32.dll")]
    public static extern void mouse_event(uint dwFlags, int dx, int dy, uint dwData, int dwExtraInfo);

    [DllImport("user32.dll", SetLastError = true)]
    public static extern IntPtr SendMessageTimeout(IntPtr hWnd, uint Msg, IntPtr wParam, IntPtr lParam, uint fuFlags, uint uTimeout, out IntPtr lpdwResult);

    [DllImport("user32.dll", SetLastError = true)]
    public static extern bool PrintWindow(IntPtr hWnd, IntPtr hdcBlt, uint nFlags);

    [StructLayout(LayoutKind.Sequential)]
    public struct POINT {
        public int X;
        public int Y;
    }

    [StructLayout(LayoutKind.Sequential)]
    public struct RECT {
        public int Left;
        public int Top;
        public int Right;
        public int Bottom;
    }

    public const int SW_SHOW = 5;
    public const int SW_SHOWNA = 8;
    public const int SW_RESTORE = 9;
    public const uint GA_ROOT = 2;
    public const uint MOUSEEVENTF_LEFTDOWN = 0x0002;
    public const uint MOUSEEVENTF_LEFTUP = 0x0004;
    public const uint PW_RENDERFULLCONTENT = 0x00000002;

    public static string GetTitle(IntPtr hWnd) {
        int len = GetWindowTextLength(hWnd);
        if (len <= 0) return "";
        StringBuilder sb = new StringBuilder(len + 1);
        GetWindowText(hWnd, sb, sb.Capacity);
        return sb.ToString();
    }

    public static string GetClass(IntPtr hWnd) {
        StringBuilder sb = new StringBuilder(256);
        GetClassName(hWnd, sb, sb.Capacity);
        return sb.ToString();
    }

    public static void WakeChromium(IntPtr hWnd) {
        IntPtr res = IntPtr.Zero;
        SendMessageTimeout(hWnd, 0x003D, IntPtr.Zero, new IntPtr(-4), 0x0002, 250, out res);
        EnumChildWindows(hWnd, delegate(IntPtr child, IntPtr l) {
            IntPtr r2 = IntPtr.Zero;
            SendMessageTimeout(child, 0x003D, IntPtr.Zero, new IntPtr(-4), 0x0002, 250, out r2);
            return true;
        }, IntPtr.Zero);
    }

    public static void LeftClick(int x, int y) {
        SetCursorPos(x, y);
        Thread.Sleep(50);
        mouse_event(MOUSEEVENTF_LEFTDOWN, x, y, 0, 0);
        Thread.Sleep(35);
        mouse_event(MOUSEEVENTF_LEFTUP, x, y, 0, 0);
    }

    public static void CapturePng(IntPtr hWnd, string savePath) {
        if (string.IsNullOrEmpty(savePath)) return;
        RECT r;
        if (!GetWindowRect(hWnd, out r)) return;
        int w = Math.Max(1, r.Right - r.Left);
        int h = Math.Max(1, r.Bottom - r.Top);
        using (Bitmap bmp = new Bitmap(w, h, System.Drawing.Imaging.PixelFormat.Format32bppArgb)) {
            using (Graphics g = Graphics.FromImage(bmp)) {
                IntPtr hdc = g.GetHdc();
                bool ok = PrintWindow(hWnd, hdc, PW_RENDERFULLCONTENT);
                if (!ok) PrintWindow(hWnd, hdc, 0);
                g.ReleaseHdc(hdc);
            }
            string dir = Path.GetDirectoryName(savePath);
            if (!string.IsNullOrEmpty(dir) && !Directory.Exists(dir)) Directory.CreateDirectory(dir);
            bmp.Save(savePath, System.Drawing.Imaging.ImageFormat.Png);
        }
    }

    public static CodexDriverResult ExecuteOnDefaultDesktop(string action, string promptText, string capturePath) {
        CodexDriverResult res = new CodexDriverResult();
        res.action = action;
        res.promptLength = promptText != null ? promptText.Length : 0;

        Thread worker = new Thread(() => {
            try {
                try { SetProcessDPIAware(); } catch {}
                IntPtr hWinSta = OpenWindowStationW("WinSta0", false, 0x037F);
                if (hWinSta != IntPtr.Zero) SetProcessWindowStation(hWinSta);
                IntPtr hDesk = OpenDesktopW("Default", 0, false, 0x01FF);
                if (hDesk != IntPtr.Zero) {
                    res.setThreadDesktopOk = SetThreadDesktop(hDesk);
                    if (!res.setThreadDesktopOk) {
                        res.setThreadDesktopErr = Marshal.GetLastWin32Error();
                    }
                }

                IntPtr mainCodexHwnd = IntPtr.Zero;

                EnumWindowsProc enumCb = delegate(IntPtr h, IntPtr l) {
                    string cls = GetClass(h);
                    if (cls != "Chrome_WidgetWin_1") return true;
                    uint pid = 0;
                    GetWindowThreadProcessId(h, out pid);
                    string pName = "";
                    try {
                        Process p = Process.GetProcessById((int)pid);
                        pName = p.ProcessName;
                    } catch {}
                    if (pName != "ChatGPT") return true;

                    string title = GetTitle(h);
                    RECT r;
                    GetWindowRect(h, out r);
                    bool vis = IsWindowVisible(h);
                    bool iconic = IsIconic(h);
                    int exStyle = GetWindowLong(h, -20);
                    bool isOverlay = ((exStyle & 0x000000A0) != 0);

                    CodexWinInfo wi = new CodexWinInfo();
                    wi.hwnd = h.ToInt64();
                    wi.pid = (int)pid;
                    wi.processName = pName;
                    wi.title = title;
                    wi.className = cls;
                    wi.isVisible = vis;
                    wi.isIconic = iconic;
                    wi.x = r.Left;
                    wi.y = r.Top;
                    wi.width = r.Right - r.Left;
                    wi.height = r.Bottom - r.Top;
                    res.codexWindows.Add(wi);

                    if (!isOverlay && !string.IsNullOrEmpty(title)) {
                        mainCodexHwnd = h;
                    }
                    return true;
                };

                if (hDesk != IntPtr.Zero) {
                    EnumDesktopWindows(hDesk, enumCb, IntPtr.Zero);
                }

                if (mainCodexHwnd == IntPtr.Zero && IsWindow(new IntPtr(328696))) {
                    mainCodexHwnd = new IntPtr(328696);
                }

                if (mainCodexHwnd == IntPtr.Zero) {
                    res.ok = false;
                    res.statusMessage = "Main Codex window not found.";
                    return;
                }

                res.targetHwnd = mainCodexHwnd.ToInt64();

                if (action == "submit_prompt" && !string.IsNullOrEmpty(promptText)) {
                    Clipboard.SetText(promptText);
                    Thread.Sleep(80);
                    ShowWindow(mainCodexHwnd, SW_SHOW);
                    if (IsIconic(mainCodexHwnd)) {
                        ShowWindow(mainCodexHwnd, SW_RESTORE);
                    }
                    for (int attempt = 0; attempt < 3; attempt++) {
                        keybd_event(0x12, 0, 0, UIntPtr.Zero);
                        keybd_event(0x12, 0, 0x0002, UIntPtr.Zero);
                        BringWindowToTop(mainCodexHwnd);
                        SetForegroundWindow(mainCodexHwnd);
                        Thread.Sleep(150);
                        if (GetForegroundWindow() == mainCodexHwnd) break;
                    }
                    Thread.Sleep(150);
                } else {
                    if (!IsWindowVisible(mainCodexHwnd)) {
                        ShowWindow(mainCodexHwnd, SW_SHOWNA);
                    }
                }

                WakeChromium(mainCodexHwnd);
                Thread.Sleep(150);

                AutomationElement rootEl = AutomationElement.FromHandle(mainCodexHwnd);
                AutomationElementCollection all = rootEl.FindAll(TreeScope.Descendants, Condition.TrueCondition);

                AutomationElement editEl = null;

                foreach (AutomationElement el in all) {
                    try {
                        string ctrl = el.Current.ControlType != null ? el.Current.ControlType.ProgrammaticName.Replace("ControlType.", "") : "";
                        string name = el.Current.Name ?? "";
                        string cls = el.Current.ClassName ?? "";
                        if (ctrl == "Edit" && (cls.Contains("ProseMirror") || name.Contains("Work with Codex") || name.Contains("Ask") || name.Contains("Follow"))) {
                            editEl = el;
                        }
                    } catch {}
                }

                if (action == "submit_prompt" && editEl != null) {
                    res.foundEdit = true;
                    try { editEl.SetFocus(); } catch {}
                    System.Windows.Rect br = editEl.Current.BoundingRectangle;
                    if (!double.IsInfinity(br.Width) && br.Width > 0) {
                        int cx = (int)Math.Round(br.X + br.Width / 2.0);
                        int cy = (int)Math.Round(br.Y + br.Height / 2.0);
                        POINT pt = new POINT { X = cx, Y = cy };
                        IntPtr hitHwnd = WindowFromPoint(pt);
                        IntPtr hitRoot = hitHwnd != IntPtr.Zero ? GetAncestor(hitHwnd, GA_ROOT) : IntPtr.Zero;
                        if (hitHwnd == mainCodexHwnd || hitRoot == mainCodexHwnd) {
                            LeftClick(cx, cy);
                        }
                    }
                    Thread.Sleep(200);
                    if (GetForegroundWindow() != mainCodexHwnd) {
                        BringWindowToTop(mainCodexHwnd);
                        SetForegroundWindow(mainCodexHwnd);
                        try { editEl.SetFocus(); } catch {}
                        Thread.Sleep(150);
                    }
                    if (GetForegroundWindow() != mainCodexHwnd) {
                        res.ok = false;
                        res.statusMessage = "ABORTED_FOREGROUND_MISMATCH: Foreground window is not Codex mainCodexHwnd (" + GetForegroundWindow().ToInt64() + " != " + mainCodexHwnd.ToInt64() + "). Refusing to SendKeys!";
                        return;
                    }
                    SendKeys.SendWait("^a");
                    Thread.Sleep(60);
                    SendKeys.SendWait("^v");
                    Thread.Sleep(450);
                    if (GetForegroundWindow() == mainCodexHwnd) {
                        SendKeys.SendWait("{ENTER}");
                    }
                    Thread.Sleep(700);
                }

                AutomationElementCollection finalEls = (action == "submit_prompt")
                    ? rootEl.FindAll(TreeScope.Descendants, Condition.TrueCondition)
                    : all;

                List<CodexNodeInfo> chatNodes = new List<CodexNodeInfo>();
                int jumpMsgCount = 0;
                bool busy = false;

                foreach (AutomationElement el in finalEls) {
                    try {
                        string ctrl = el.Current.ControlType != null ? el.Current.ControlType.ProgrammaticName.Replace("ControlType.", "") : "";
                        string name = el.Current.Name ?? "";
                        string cls = el.Current.ClassName ?? "";
                        string aid = el.Current.AutomationId ?? "";
                        if (name.StartsWith("Jump to user message ")) {
                            jumpMsgCount++;
                            continue;
                        }
                        if (name == "Thinking" || name.StartsWith("Thinking ") || name.StartsWith("Running ") || name.StartsWith("Editing ") || name.StartsWith("Reading ") || (ctrl == "Button" && (name == "Stop" || name == "Cancel"))) {
                            busy = true;
                        }
                        string val = "";
                        try {
                            object vp;
                            if (el.TryGetCurrentPattern(ValuePattern.Pattern, out vp)) {
                                val = ((ValuePattern)vp).Current.Value ?? "";
                            }
                        } catch {}
                        if (!string.IsNullOrWhiteSpace(name) || !string.IsNullOrWhiteSpace(val) || ctrl == "Button" || ctrl == "Edit") {
                            System.Windows.Rect r = el.Current.BoundingRectangle;
                            CodexNodeInfo ni = new CodexNodeInfo();
                            ni.controlType = ctrl;
                            ni.name = name.Length > 350 ? name.Substring(0, 350) : name;
                            ni.value = val.Length > 350 ? val.Substring(0, 350) : val;
                            ni.className = cls;
                            ni.automationId = aid;
                            if (!double.IsInfinity(r.Width) && r.Width > 0) {
                                ni.centerX = (int)Math.Round(r.X + r.Width / 2.0);
                                ni.centerY = (int)Math.Round(r.Y + r.Height / 2.0);
                                ni.width = (int)Math.Round(r.Width);
                                ni.height = (int)Math.Round(r.Height);
                            }
                            if (ni.centerX > 140 && ni.centerY > 60) {
                                chatNodes.Add(ni);
                            }
                        }
                    } catch {}
                }

                res.userMessageCount = jumpMsgCount;
                res.isCodexBusy = busy;

                int startIdx = Math.Max(0, chatNodes.Count - 50);
                for (int i = startIdx; i < chatNodes.Count; i++) {
                    res.chatAreaTailNodes.Add(chatNodes[i]);
                }

                CapturePng(mainCodexHwnd, capturePath);
                res.ok = true;
                res.statusMessage = "Completed action: " + action + " (chatNodes=" + chatNodes.Count + ", jumpMsgCount=" + jumpMsgCount + ", busy=" + busy + ")";
            } catch (Exception ex) {
                res.ok = false;
                res.statusMessage = ex.ToString();
            }
        });

        worker.SetApartmentState(ApartmentState.STA);
        worker.Start();
        worker.Join(14000);
        return res;
    }
}
"@

Add-Type -TypeDefinition $csharp -Language CSharp -ReferencedAssemblies "System.Windows.Forms", "System.Drawing", "UIAutomationClient", "UIAutomationTypes", "WindowsBase"

$promptText = ""
if (Test-Path $PromptFile) {
    $promptText = [System.IO.File]::ReadAllText($PromptFile, [System.Text.Encoding]::UTF8)
}

$result = [CodexDesktopNative]::ExecuteOnDefaultDesktop($Action, $promptText, $CapturePath)
$json = $result | ConvertTo-Json -Depth 6
[System.IO.File]::WriteAllText($OutJson, $json, [System.Text.Encoding]::UTF8)
Write-Output $json
