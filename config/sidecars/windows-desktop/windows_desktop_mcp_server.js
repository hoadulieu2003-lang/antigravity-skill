#!/usr/bin/env node
/**
 * ════════════════════════════════════════════════════════════════════════════
 * WINDOWS DESKTOP & UI AUTOMATION MCP SUPER-ENGINE v2.0 (Stdio JSON-RPC 2.0)
 * Model Context Protocol Server for Native Windows Desktop Apps (Codex, Cursor,
 * Claude Desktop, VS Code, Win32, WPF, UWP, Electron)
 *
 * Chủ quản: Anh — Lead Architect / Product Owner
 * Phát triển & Điều hành: Em — Senior Engineering Agent / Antigravity
 * ════════════════════════════════════════════════════════════════════════════
 */

const readline = require('readline');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { execFileSync } = require('child_process');

// ════════════════════════════════════════════════════════════════════════════
// POWERSHELL + C# WIN32 / UI AUTOMATION BRIDGE
// ════════════════════════════════════════════════════════════════════════════

function runPowerShellJson(psScript, timeoutMs = 20000) {
  const tmpFile = path.join(os.tmpdir(), `agy_desktop_${process.pid}_${Date.now()}.ps1`);
  const fullScript = `
$OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$ErrorActionPreference = "Stop"
${psScript}
`;
  fs.writeFileSync(tmpFile, '\uFEFF' + fullScript, 'utf8');
  try {
    const stdout = execFileSync(
      'powershell.exe',
      ['-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass', '-File', tmpFile],
      {
        encoding: 'utf8',
        timeout: timeoutMs,
        maxBuffer: 20 * 1024 * 1024,
        windowsHide: true
      }
    );
    const trimmed = (stdout || '').trim();
    if (!trimmed) return {};
    return JSON.parse(trimmed);
  } finally {
    try {
      fs.unlinkSync(tmpFile);
    } catch (_) {}
  }
}

const WIN32_CSHARP_HEADER = `
Add-Type -AssemblyName UIAutomationClient
Add-Type -AssemblyName UIAutomationTypes
Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

$win32Code = @"
using System;
using System.Text;
using System.Runtime.InteropServices;
using System.Collections.Generic;
using System.Diagnostics;

public class WindowInfo {
    public long hwnd;
    public int pid;
    public string processName;
    public string title;
    public string className;
    public string exePath;
    public bool isMinimized;
    public bool isForeground;
    public int x;
    public int y;
    public int width;
    public int height;
}

public static class DesktopWin32 {
    public delegate bool EnumWindowsProc(IntPtr hWnd, IntPtr lParam);

    [DllImport("user32.dll")]
    public static extern bool EnumWindows(EnumWindowsProc enumProc, IntPtr lParam);

    [DllImport("user32.dll")]
    public static extern bool EnumDesktopWindows(IntPtr hDesktop, EnumWindowsProc lpfn, IntPtr lParam);

    [DllImport("user32.dll", CharSet = CharSet.Unicode, SetLastError = true)]
    public static extern IntPtr OpenDesktopW(string lpszDesktop, uint dwFlags, bool fInherit, uint dwDesiredAccess);

    [DllImport("user32.dll", SetLastError = true)]
    public static extern bool SetThreadDesktop(IntPtr hDesktop);

    [DllImport("user32.dll", CharSet = CharSet.Unicode, SetLastError = true)]
    public static extern IntPtr OpenWindowStationW(string lpszWinSta, bool fInherit, uint dwDesiredAccess);

    [DllImport("user32.dll", SetLastError = true)]
    public static extern bool SetProcessWindowStation(IntPtr hWinSta);

    public static IntPtr EnsureDefaultDesktop() {
        IntPtr hWinSta = OpenWindowStationW("WinSta0", false, 0x037F);
        if (hWinSta != IntPtr.Zero) {
            SetProcessWindowStation(hWinSta);
        }
        IntPtr hDesk = OpenDesktopW("Default", 0, false, 0x01FF);
        if (hDesk != IntPtr.Zero) {
            SetThreadDesktop(hDesk);
        }
        return hDesk;
    }

    [DllImport("user32.dll")]
    public static extern bool IsWindowVisible(IntPtr hWnd);

    [DllImport("user32.dll")]
    public static extern bool IsIconic(IntPtr hWnd);

    [DllImport("user32.dll")]
    public static extern IntPtr GetForegroundWindow();

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
    public static extern bool ShowWindow(IntPtr hWnd, int nCmdShow);

    [DllImport("user32.dll")]
    public static extern bool SetForegroundWindow(IntPtr hWnd);

    [DllImport("user32.dll")]
    public static extern bool BringWindowToTop(IntPtr hWnd);

    [DllImport("user32.dll")]
    public static extern bool AttachThreadInput(uint idAttach, uint idAttachTo, bool fAttach);

    [DllImport("kernel32.dll")]
    public static extern uint GetCurrentThreadId();

    [DllImport("user32.dll")]
    public static extern bool SetCursorPos(int X, int Y);

    [DllImport("user32.dll")]
    public static extern void mouse_event(uint dwFlags, int dx, int dy, uint dwData, int dwExtraInfo);

    public const int SW_RESTORE = 9;
    public const int SW_SHOW = 5;
    public const uint MOUSEEVENTF_LEFTDOWN = 0x0002;
    public const uint MOUSEEVENTF_LEFTUP = 0x0004;
    public const uint MOUSEEVENTF_RIGHTDOWN = 0x0008;
    public const uint MOUSEEVENTF_RIGHTUP = 0x0010;

    [StructLayout(LayoutKind.Sequential)]
    public struct RECT {
        public int Left;
        public int Top;
        public int Right;
        public int Bottom;
    }

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

    public static List<WindowInfo> GetOpenWindows() {
        IntPtr hDesk = EnsureDefaultDesktop();
        List<WindowInfo> list = new List<WindowInfo>();
        IntPtr fg = GetForegroundWindow();
        EnumWindowsProc callback = delegate(IntPtr h, IntPtr l) {
            if (!IsWindowVisible(h)) return true;
            string title = GetTitle(h);
            if (string.IsNullOrWhiteSpace(title)) return true;
            string cls = GetClass(h);
            if (cls == "Progman" || cls == "Shell_TrayWnd") return true;

            uint wpid = 0;
            GetWindowThreadProcessId(h, out wpid);
            string procName = "";
            string exePath = "";
            try {
                Process p = Process.GetProcessById((int)wpid);
                procName = p.ProcessName;
                try { exePath = p.MainModule.FileName; } catch {}
            } catch {}

            RECT r;
            GetWindowRect(h, out r);
            WindowInfo info = new WindowInfo();
            info.hwnd = h.ToInt64();
            info.pid = (int)wpid;
            info.processName = procName;
            info.title = title;
            info.className = cls;
            info.exePath = exePath;
            info.isMinimized = IsIconic(h);
            info.isForeground = (h == fg);
            info.x = r.Left;
            info.y = r.Top;
            info.width = r.Right - r.Left;
            info.height = r.Bottom - r.Top;
            list.Add(info);
            return true;
        };
        if (hDesk != IntPtr.Zero) {
            EnumDesktopWindows(hDesk, callback, IntPtr.Zero);
        } else {
            EnumWindows(callback, IntPtr.Zero);
        }
        return list;
    }

    public static void ForceForeground(IntPtr hWnd) {
        if (IsIconic(hWnd)) {
            ShowWindow(hWnd, SW_RESTORE);
        } else {
            ShowWindow(hWnd, SW_SHOW);
        }
        IntPtr foreWnd = GetForegroundWindow();
        uint dummyPid = 0;
        uint foreThread = GetWindowThreadProcessId(foreWnd, out dummyPid);
        uint appThread = GetCurrentThreadId();
        if (foreThread != appThread) {
            AttachThreadInput(foreThread, appThread, true);
            BringWindowToTop(hWnd);
            SetForegroundWindow(hWnd);
            AttachThreadInput(foreThread, appThread, false);
        } else {
            BringWindowToTop(hWnd);
            SetForegroundWindow(hWnd);
        }
    }

    public static void ClickAt(int x, int y, string button, bool doubleClick) {
        SetCursorPos(x, y);
        System.Threading.Thread.Sleep(40);
        uint down = button == "right" ? MOUSEEVENTF_RIGHTDOWN : MOUSEEVENTF_LEFTDOWN;
        uint up = button == "right" ? MOUSEEVENTF_RIGHTUP : MOUSEEVENTF_LEFTUP;
        mouse_event(down, x, y, 0, 0);
        System.Threading.Thread.Sleep(25);
        mouse_event(up, x, y, 0, 0);
        if (doubleClick) {
            System.Threading.Thread.Sleep(60);
            mouse_event(down, x, y, 0, 0);
            System.Threading.Thread.Sleep(25);
            mouse_event(up, x, y, 0, 0);
        }
    }
}
"@
Add-Type -TypeDefinition $win32Code -Language CSharp
`;

const RESOLVE_WINDOW_PS_FUNC = `
function Resolve-TargetWindow {
    param(
        [long]$Hwnd = 0,
        [int]$ProcessId = 0,
        [string]$Query = "",
        [int]$WindowIndex = 0
    )
    [void][DesktopWin32]::EnsureDefaultDesktop()
    $candidates = [DesktopWin32]::GetOpenWindows()
    $matched = $null
    $matchedList = @()

    if ($Hwnd -gt 0) {
        $matchedList = @($candidates | Where-Object { $_.hwnd -eq $Hwnd })
    }
    elseif ($ProcessId -gt 0) {
        $matchedList = @($candidates | Where-Object { $_.pid -eq $ProcessId })
    }
    elseif (-not [string]::IsNullOrWhiteSpace($Query)) {
        $q = $Query.ToLowerInvariant()
        $matchedList = @($candidates | Where-Object {
            ($_.title -and $_.title.ToLowerInvariant().Contains($q)) -or
            ($_.processName -and $_.processName.ToLowerInvariant().Contains($q)) -or
            ($_.exePath -and $_.exePath.ToLowerInvariant().Contains($q)) -or
            ($_.className -and $_.className.ToLowerInvariant().Contains($q))
        })
    }

    if ($matchedList.Count -gt 0) {
        $idx = [Math]::Min([Math]::Max($WindowIndex, 0), $matchedList.Count - 1)
        $matched = $matchedList[$idx]
    }

    return @{
        matched = $matched
        matchedList = $matchedList
        all = $candidates
    }
}
`;

// ════════════════════════════════════════════════════════════════════════════
// TOOL IMPLEMENTATIONS
// ════════════════════════════════════════════════════════════════════════════

async function handleListWindows(args = {}) {
  const filter = String(args.filter || '').trim();
  const filterB64 = Buffer.from(filter, 'utf8').toString('base64');

  const ps = `
${WIN32_CSHARP_HEADER}
${RESOLVE_WINDOW_PS_FUNC}
$filterStr = [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String("${filterB64}"))
$res = Resolve-TargetWindow -Query $filterStr
$list = if ([string]::IsNullOrWhiteSpace($filterStr)) { $res.all } else { $res.matchedList }
@{
    count = @($list).Count
    windows = @($list)
} | ConvertTo-Json -Depth 6 -Compress
`;
  return runPowerShellJson(ps);
}

async function handleInspectUiTree(args = {}) {
  const hwnd = Number(args.hwnd || 0);
  const pid = Number(args.pid || 0);
  const query = String(args.query || args.windowTitle || args.processName || '').trim();
  const maxDepth = Math.min(Math.max(Number(args.maxDepth || 6), 1), 12);
  const maxNodes = Math.min(Math.max(Number(args.maxNodes || 250), 20), 800);
  const queryB64 = Buffer.from(query, 'utf8').toString('base64');

  const ps = `
${WIN32_CSHARP_HEADER}
${RESOLVE_WINDOW_PS_FUNC}
$qStr = [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String("${queryB64}"))
$res = Resolve-TargetWindow -Hwnd ${hwnd} -ProcessId ${pid} -Query $qStr
$win = $res.matched
if (-not $win) {
    @{ ok = $false; error = "Target window not found"; availableWindows = @($res.all | Select-Object hwnd, pid, processName, title) } | ConvertTo-Json -Depth 6 -Compress
    exit 0
}

$rootEl = [System.Windows.Automation.AutomationElement]::FromHandle([IntPtr]$win.hwnd)
$nodes = New-Object System.Collections.Generic.List[object]
$walker = [System.Windows.Automation.TreeWalker]::ControlViewWalker

function Walk-UiaNode {
    param($el, [int]$depth)
    if ($null -eq $el -or $depth -gt ${maxDepth} -or $nodes.Count -ge ${maxNodes}) { return }
    try {
        $cur = $el.Current
        $ctrlType = ""
        if ($cur.ControlType) {
            $ctrlType = $cur.ControlType.ProgrammaticName -replace "^ControlType\\.", ""
        }
        $name = $cur.Name
        $autoId = $cur.AutomationId
        $cls = $cur.ClassName
        $val = ""
        try {
            $vp = $null
            if ($el.TryGetCurrentPattern([System.Windows.Automation.ValuePattern]::Pattern, [ref]$vp)) {
                $val = $vp.Current.Value
            }
        } catch {}
        if ([string]::IsNullOrWhiteSpace($val)) {
            try {
                $tp = $null
                if ($el.TryGetCurrentPattern([System.Windows.Automation.TextPattern]::Pattern, [ref]$tp)) {
                    $val = $tp.DocumentRange.GetText(2000)
                }
            } catch {}
        }

        $r = $cur.BoundingRectangle
        $hasRect = (-not [double]::IsInfinity($r.Width)) -and (-not [double]::IsInfinity($r.Height)) -and ($r.Width -gt 0) -and ($r.Height -gt 0)
        $hasContent = (-not [string]::IsNullOrWhiteSpace($name)) -or (-not [string]::IsNullOrWhiteSpace($val)) -or (-not [string]::IsNullOrWhiteSpace($autoId)) -or ($ctrlType -in @("Button", "Edit", "Document", "ComboBox", "CheckBox", "MenuItem", "TabItem"))

        if ($hasContent -and $depth -ge 1) {
            $rectObj = $null
            if ($hasRect) {
                $rectObj = @{
                    x = [int][Math]::Round($r.X)
                    y = [int][Math]::Round($r.Y)
                    width = [int][Math]::Round($r.Width)
                    height = [int][Math]::Round($r.Height)
                    centerX = [int][Math]::Round($r.X + $r.Width / 2.0)
                    centerY = [int][Math]::Round($r.Y + $r.Height / 2.0)
                }
            }
            $nodes.Add([PSCustomObject]@{
                depth = $depth
                controlType = $ctrlType
                name = if ($name -and $name.Length -gt 600) { $name.Substring(0, 600) } else { $name }
                value = if ($val -and $val.Length -gt 1500) { $val.Substring(0, 1500) } else { $val }
                automationId = $autoId
                className = $cls
                isEnabled = $cur.IsEnabled
                rect = $rectObj
            })
        }
    } catch {}

    if ($depth -lt ${maxDepth} -and $nodes.Count -lt ${maxNodes}) {
        $child = $null
        try { $child = $walker.GetFirstChild($el) } catch {}
        while ($null -ne $child -and $nodes.Count -lt ${maxNodes}) {
            Walk-UiaNode -el $child -depth ($depth + 1)
            try { $child = $walker.GetNextSibling($child) } catch { $child = $null }
        }
    }
}

Walk-UiaNode -el $rootEl -depth 0

@{
    ok = $true
    window = $win
    nodeCount = $nodes.Count
    nodes = @($nodes)
} | ConvertTo-Json -Depth 7 -Compress
`;
  return runPowerShellJson(ps, 30000);
}

async function handleFocusWindow(args = {}) {
  const hwnd = Number(args.hwnd || 0);
  const pid = Number(args.pid || 0);
  const query = String(args.query || args.windowTitle || args.processName || '').trim();
  const queryB64 = Buffer.from(query, 'utf8').toString('base64');

  const ps = `
${WIN32_CSHARP_HEADER}
${RESOLVE_WINDOW_PS_FUNC}
$qStr = [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String("${queryB64}"))
$res = Resolve-TargetWindow -Hwnd ${hwnd} -ProcessId ${pid} -Query $qStr
$win = $res.matched
if (-not $win) {
    @{ ok = $false; error = "Target window not found" } | ConvertTo-Json -Compress
    exit 0
}
[DesktopWin32]::ForceForeground([IntPtr]$win.hwnd)
Start-Sleep -Milliseconds 150
@{
    ok = $true
    focusedWindow = $win
} | ConvertTo-Json -Depth 5 -Compress
`;
  return runPowerShellJson(ps);
}

async function handleDesktopClick(args = {}) {
  const hwnd = Number(args.hwnd || 0);
  const pid = Number(args.pid || 0);
  const query = String(args.query || args.windowTitle || args.processName || '').trim();
  const elementName = String(args.elementName || args.automationId || '').trim();
  const x = typeof args.x === 'number' ? Math.round(args.x) : null;
  const y = typeof args.y === 'number' ? Math.round(args.y) : null;
  const button = args.button === 'right' ? 'right' : 'left';
  const doubleClick = Boolean(args.doubleClick);

  const queryB64 = Buffer.from(query, 'utf8').toString('base64');
  const elemB64 = Buffer.from(elementName, 'utf8').toString('base64');

  const ps = `
${WIN32_CSHARP_HEADER}
${RESOLVE_WINDOW_PS_FUNC}
$qStr = [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String("${queryB64}"))
$elStr = [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String("${elemB64}"))

$win = $null
if (${hwnd} -gt 0 -or ${pid} -gt 0 -or (-not [string]::IsNullOrWhiteSpace($qStr))) {
    $res = Resolve-TargetWindow -Hwnd ${hwnd} -ProcessId ${pid} -Query $qStr
    $win = $res.matched
    if ($win) {
        [DesktopWin32]::ForceForeground([IntPtr]$win.hwnd)
        Start-Sleep -Milliseconds 120
    }
}

$targetX = ${x !== null ? x : -1}
$targetY = ${y !== null ? y : -1}
$invokedDirectly = $false

if (-not [string]::IsNullOrWhiteSpace($elStr) -and $win) {
    $rootEl = [System.Windows.Automation.AutomationElement]::FromHandle([IntPtr]$win.hwnd)
    $all = $rootEl.FindAll([System.Windows.Automation.TreeScope]::Descendants, [System.Windows.Automation.Condition]::TrueCondition)
    $qEl = $elStr.ToLowerInvariant()
    foreach ($item in $all) {
        try {
            $n = $item.Current.Name
            $aid = $item.Current.AutomationId
            if (($n -and $n.ToLowerInvariant().Contains($qEl)) -or ($aid -and $aid.ToLowerInvariant() -eq $qEl)) {
                $r = $item.Current.BoundingRectangle
                if (-not [double]::IsInfinity($r.Width) -and $r.Width -gt 0) {
                    $targetX = [int][Math]::Round($r.X + $r.Width / 2.0)
                    $targetY = [int][Math]::Round($r.Y + $r.Height / 2.0)
                    break
                }
            }
        } catch {}
    }
}

if ($targetX -lt 0 -or $targetY -lt 0) {
    @{ ok = $false; error = "Valid coordinates (x, y) or matching elementName not found" } | ConvertTo-Json -Compress
    exit 0
}

[DesktopWin32]::ClickAt($targetX, $targetY, "${button}", $${doubleClick})
@{
    ok = $true
    clickedAt = @{ x = $targetX; y = $targetY }
    button = "${button}"
    doubleClick = $${doubleClick}
    window = $win
} | ConvertTo-Json -Depth 5 -Compress
`;
  return runPowerShellJson(ps);
}

async function handleDesktopTypeText(args = {}) {
  const text = String(args.text || '');
  const hwnd = Number(args.hwnd || 0);
  const pid = Number(args.pid || 0);
  const query = String(args.query || args.windowTitle || args.processName || '').trim();
  const x = typeof args.x === 'number' ? Math.round(args.x) : null;
  const y = typeof args.y === 'number' ? Math.round(args.y) : null;
  const pressEnter = Boolean(args.pressEnter);

  const queryB64 = Buffer.from(query, 'utf8').toString('base64');
  const textB64 = Buffer.from(text, 'utf8').toString('base64');

  const ps = `
${WIN32_CSHARP_HEADER}
${RESOLVE_WINDOW_PS_FUNC}
$qStr = [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String("${queryB64}"))
$textStr = [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String("${textB64}"))

$win = $null
if (${hwnd} -gt 0 -or ${pid} -gt 0 -or (-not [string]::IsNullOrWhiteSpace($qStr))) {
    $res = Resolve-TargetWindow -Hwnd ${hwnd} -ProcessId ${pid} -Query $qStr
    $win = $res.matched
    if (-not $win) {
        @{ ok = $false; error = "Target window not found" } | ConvertTo-Json -Compress
        exit 0
    }
    [DesktopWin32]::ForceForeground([IntPtr]$win.hwnd)
    Start-Sleep -Milliseconds 150
}

if (${x !== null ? x : -1} -ge 0 -and ${y !== null ? y : -1} -ge 0) {
    [DesktopWin32]::ClickAt(${x !== null ? x : 0}, ${y !== null ? y : 0}, "left", $false)
    Start-Sleep -Milliseconds 120
}

Set-Clipboard -Value $textStr
Start-Sleep -Milliseconds 60
[System.Windows.Forms.SendKeys]::SendWait("^v")
Start-Sleep -Milliseconds 100

if ($${pressEnter}) {
    [System.Windows.Forms.SendKeys]::SendWait("{ENTER}")
}

@{
    ok = $true
    typedLength = $textStr.Length
    pressEnter = $${pressEnter}
    window = $win
} | ConvertTo-Json -Depth 5 -Compress
`;
  return runPowerShellJson(ps);
}

async function handleDesktopSendKeys(args = {}) {
  const keys = String(args.keys || '');
  const hwnd = Number(args.hwnd || 0);
  const pid = Number(args.pid || 0);
  const query = String(args.query || args.windowTitle || args.processName || '').trim();

  const queryB64 = Buffer.from(query, 'utf8').toString('base64');
  const keysB64 = Buffer.from(keys, 'utf8').toString('base64');

  const ps = `
${WIN32_CSHARP_HEADER}
${RESOLVE_WINDOW_PS_FUNC}
$qStr = [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String("${queryB64}"))
$keysStr = [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String("${keysB64}"))

$win = $null
if (${hwnd} -gt 0 -or ${pid} -gt 0 -or (-not [string]::IsNullOrWhiteSpace($qStr))) {
    $res = Resolve-TargetWindow -Hwnd ${hwnd} -ProcessId ${pid} -Query $qStr
    $win = $res.matched
    if ($win) {
        [DesktopWin32]::ForceForeground([IntPtr]$win.hwnd)
        Start-Sleep -Milliseconds 150
    }
}

[System.Windows.Forms.SendKeys]::SendWait($keysStr)
@{
    ok = $true
    keys = $keysStr
    window = $win
} | ConvertTo-Json -Depth 5 -Compress
`;
  return runPowerShellJson(ps);
}

async function handleCaptureWindow(args = {}) {
  const hwnd = Number(args.hwnd || 0);
  const pid = Number(args.pid || 0);
  const query = String(args.query || args.windowTitle || args.processName || '').trim();
  const outPath = args.outputPath
    ? String(args.outputPath)
    : path.join(os.tmpdir(), `desktop_capture_${Date.now()}.png`);

  const queryB64 = Buffer.from(query, 'utf8').toString('base64');
  const outB64 = Buffer.from(outPath, 'utf8').toString('base64');

  const ps = `
${WIN32_CSHARP_HEADER}
${RESOLVE_WINDOW_PS_FUNC}
$qStr = [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String("${queryB64}"))
$savePath = [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String("${outB64}"))

$win = $null
$x = 0; $y = 0; $w = 0; $h = 0

if (${hwnd} -gt 0 -or ${pid} -gt 0 -or (-not [string]::IsNullOrWhiteSpace($qStr))) {
    $res = Resolve-TargetWindow -Hwnd ${hwnd} -ProcessId ${pid} -Query $qStr
    $win = $res.matched
    if (-not $win) {
        @{ ok = $false; error = "Target window not found" } | ConvertTo-Json -Compress
        exit 0
    }
    [DesktopWin32]::ForceForeground([IntPtr]$win.hwnd)
    Start-Sleep -Milliseconds 200
    $rect = New-Object DesktopWin32+RECT
    [void][DesktopWin32]::GetWindowRect([IntPtr]$win.hwnd, [ref]$rect)
    $x = $rect.Left
    $y = $rect.Top
    $w = [Math]::Max(1, $rect.Right - $rect.Left)
    $h = [Math]::Max(1, $rect.Bottom - $rect.Top)
} else {
    $screen = [System.Windows.Forms.Screen]::PrimaryScreen.Bounds
    $x = $screen.X; $y = $screen.Y; $w = $screen.Width; $h = $screen.Height
}

$bmp = New-Object System.Drawing.Bitmap($w, $h)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.CopyFromScreen($x, $y, 0, 0, (New-Object System.Drawing.Size($w, $h)))
$g.Dispose()

$dir = [System.IO.Path]::GetDirectoryName($savePath)
if ($dir -and (-not (Test-Path $dir))) {
    New-Item -ItemType Directory -Path $dir -Force | Out-Null
}
$bmp.Save($savePath, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()

@{
    ok = $true
    outputPath = $savePath
    bounds = @{ x = $x; y = $y; width = $w; height = $h }
    window = $win
} | ConvertTo-Json -Depth 5 -Compress
`;
  return runPowerShellJson(ps);
}

// ════════════════════════════════════════════════════════════════════════════
// MCP TOOL DEFINITIONS (SCHEMA)
// ════════════════════════════════════════════════════════════════════════════

const TOOLS = [
  {
    name: "desktop_list_windows",
    description: "Liệt kê toàn bộ các cửa sổ ứng dụng Desktop đang mở trên màn hình Windows (như Codex, Cursor, Claude Desktop, VS Code, v.v.) kèm HWND, PID, tên tiến trình, tiêu đề và tọa độ.",
    inputSchema: {
      type: "object",
      properties: {
        filter: {
          type: "string",
          description: "Từ khóa lọc theo tên ứng dụng hoặc tiêu đề cửa sổ (ví dụ: 'codex', 'cursor', 'claude'). Bỏ trống để lấy tất cả cửa sổ đang mở."
        }
      }
    }
  },
  {
    name: "desktop_inspect_ui_tree",
    description: "Đọc cấu trúc giao diện (Windows UI Automation Tree) của một ứng dụng Desktop đang mở. Trả về danh sách các nút bấm, ô nhập liệu, đoạn văn bản và tọa độ tương tác bên trong cửa sổ.",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Tên ứng dụng hoặc một phần tiêu đề cửa sổ cần đọc (ví dụ: 'codex')."
        },
        hwnd: {
          type: "number",
          description: "Mã định danh cửa sổ HWND (nếu đã biết từ desktop_list_windows)."
        },
        pid: {
          type: "number",
          description: "Process ID của ứng dụng (nếu đã biết)."
        },
        maxDepth: {
          type: "number",
          description: "Độ sâu tối đa khi duyệt cây UI (mặc định: 6)."
        },
        maxNodes: {
          type: "number",
          description: "Số lượng phần tử UI tối đa trả về (mặc định: 250)."
        }
      }
    }
  },
  {
    name: "desktop_focus_window",
    description: "Đưa một cửa sổ ứng dụng Desktop đang mở lên tiền cảnh (Restore nếu đang thu nhỏ và Focus).",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Tên ứng dụng hoặc tiêu đề cửa sổ cần focus (ví dụ: 'codex')."
        },
        hwnd: {
          type: "number",
          description: "Mã định danh cửa sổ HWND."
        },
        pid: {
          type: "number",
          description: "Process ID của ứng dụng."
        }
      }
    }
  },
  {
    name: "desktop_click",
    description: "Nhấp chuột vào một vị trí tọa độ (x, y) hoặc tìm theo tên nút/phần tử UI (elementName) bên trong cửa sổ Desktop App đang mở.",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Tên ứng dụng hoặc tiêu đề cửa sổ mục tiêu (ví dụ: 'codex')."
        },
        hwnd: {
          type: "number",
          description: "Mã HWND của cửa sổ."
        },
        elementName: {
          type: "string",
          description: "Tên nút bấm hoặc AutomationId cần click (hệ thống tự động tìm tọa độ tâm trong UI Tree)."
        },
        x: {
          type: "number",
          description: "Tọa độ X trên màn hình."
        },
        y: {
          type: "number",
          description: "Tọa độ Y trên màn hình."
        },
        button: {
          type: "string",
          enum: ["left", "right"],
          description: "Nút chuột cần nhấn (mặc định: 'left')."
        },
        doubleClick: {
          type: "boolean",
          description: "Nhấp đúp chuột hay không (mặc định: false)."
        }
      }
    }
  },
  {
    name: "desktop_type_text",
    description: "Nhập văn bản Unicode (tiếng Việt/tiếng Anh/code) vào cửa sổ ứng dụng Desktop đang mở (ví dụ: nhập prompt vào app Codex) qua cơ chế Clipboard Paste chuẩn xác.",
    inputSchema: {
      type: "object",
      properties: {
        text: {
          type: "string",
          description: "Nội dung văn bản cần nhập vào ứng dụng."
        },
        query: {
          type: "string",
          description: "Tên ứng dụng hoặc tiêu đề cửa sổ mục tiêu (ví dụ: 'codex')."
        },
        hwnd: {
          type: "number",
          description: "Mã HWND của cửa sổ."
        },
        x: {
          type: "number",
          description: "Tọa độ X của ô nhập liệu (nếu cần click trước khi nhập)."
        },
        y: {
          type: "number",
          description: "Tọa độ Y của ô nhập liệu (nếu cần click trước khi nhập)."
        },
        pressEnter: {
          type: "boolean",
          description: "Tự động nhấn phím Enter sau khi nhập xong (mặc định: false)."
        }
      },
      required: ["text"]
    }
  },
  {
    name: "desktop_send_keys",
    description: "Gửi tổ hợp phím tắt hoặc phím chức năng (SendKeys format, ví dụ: '{ENTER}', '^c', '^v', '{ESC}', '+{ENTER}') tới cửa sổ ứng dụng Desktop.",
    inputSchema: {
      type: "object",
      properties: {
        keys: {
          type: "string",
          description: "Chuỗi phím theo chuẩn SendKeys (ví dụ: '{ENTER}', '^a', '{TAB}')."
        },
        query: {
          type: "string",
          description: "Tên ứng dụng hoặc tiêu đề cửa sổ mục tiêu (ví dụ: 'codex')."
        },
        hwnd: {
          type: "number",
          description: "Mã HWND của cửa sổ."
        }
      },
      required: ["keys"]
    }
  },
  {
    name: "desktop_capture_window",
    description: "Chụp ảnh màn hình sắc nét (PNG) của riêng một cửa sổ Desktop App đang mở (hoặc toàn màn hình) để quan sát trực quan.",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Tên ứng dụng hoặc tiêu đề cửa sổ cần chụp (ví dụ: 'codex'). Bỏ trống nếu muốn chụp toàn màn hình."
        },
        hwnd: {
          type: "number",
          description: "Mã HWND của cửa sổ."
        },
        outputPath: {
          type: "string",
          description: "Đường dẫn lưu file ảnh PNG."
        }
      }
    }
  }
];

async function handleToolCall(name, args) {
  switch (name) {
    case "desktop_list_windows":
      return await handleListWindows(args);
    case "desktop_inspect_ui_tree":
      return await handleInspectUiTree(args);
    case "desktop_focus_window":
      return await handleFocusWindow(args);
    case "desktop_click":
      return await handleDesktopClick(args);
    case "desktop_type_text":
      return await handleDesktopTypeText(args);
    case "desktop_send_keys":
      return await handleDesktopSendKeys(args);
    case "desktop_capture_window":
      return await handleCaptureWindow(args);
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

// ════════════════════════════════════════════════════════════════════════════
// CLI MODE & JSON-RPC 2.0 STDIO TRANSPORT
// ════════════════════════════════════════════════════════════════════════════

if (process.argv[2] === "--cli") {
  const toolName = process.argv[3];
  const rawArgs = process.argv[4] ? JSON.parse(process.argv[4]) : {};
  handleToolCall(toolName, rawArgs)
    .then((res) => {
      process.stdout.write(JSON.stringify(res, null, 2) + "\n");
      process.exit(0);
    })
    .catch((err) => {
      process.stderr.write(JSON.stringify({ ok: false, error: err.message }) + "\n");
      process.exit(1);
    });
} else {
  function sendJsonRpcResponse(id, result, error = null) {
    const response = { jsonrpc: "2.0", id };
    if (error) response.error = error;
    else response.result = result;
    process.stdout.write(JSON.stringify(response) + "\n");
  }

  const rl = readline.createInterface({
    input: process.stdin,
    terminal: false
  });

  rl.on('line', async (line) => {
    const trimmed = line.trim();
    if (!trimmed) return;

    let request;
    try {
      request = JSON.parse(trimmed);
    } catch (_) {
      sendJsonRpcResponse(null, null, { code: -32700, message: "Parse error" });
      return;
    }

    const { id, method, params } = request;
    if (id === undefined || id === null) return;

    try {
      switch (method) {
        case "initialize":
          sendJsonRpcResponse(id, {
            protocolVersion: "2024-11-05",
            capabilities: { tools: {} },
            serverInfo: {
              name: "windows-desktop-mcp",
              version: "2.0.0"
            }
          });
          break;
        case "ping":
          sendJsonRpcResponse(id, {});
          break;
        case "tools/list":
          sendJsonRpcResponse(id, { tools: TOOLS });
          break;
        case "tools/call": {
          const toolName = params?.name;
          const toolArgs = params?.arguments || {};
          try {
            const result = await handleToolCall(toolName, toolArgs);
            sendJsonRpcResponse(id, {
              content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
            });
          } catch (callErr) {
            sendJsonRpcResponse(id, {
              isError: true,
              content: [{ type: "text", text: `[Windows Desktop MCP Error] ${callErr.message}` }]
            });
          }
          break;
        }
        default:
          sendJsonRpcResponse(id, null, {
            code: -32601,
            message: `Method '${method}' not found`
          });
      }
    } catch (globalErr) {
      sendJsonRpcResponse(id, null, {
        code: -32603,
        message: globalErr.message
      });
    }
  });

  process.stderr.write("[Windows Desktop MCP v2.0] Started and listening on stdio JSON-RPC 2.0 (7 Desktop UIA Tools Ready)\n");
}
