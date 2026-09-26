# ==============================================================================
# 🚀 ANTIGRAVITY 2.0 ULTRA ACCOUNT SWITCHER (HOT-SWAP CREDENTIALS ENGINE)
# Bản quyền thuộc về: Anh (Lead Architect) & Em (Antigravity Senior Agent)
# Cơ chế: Win32 Credential Manager API (CredReadW / CredWriteW) - 100% Native & Clean
# ==============================================================================

[CmdletBinding()]
param(
    [ValidateSet("status", "save1", "save2", "swap1", "swap2", "toggle", "interactive")]
    [string]$Action = "interactive"
)

# Thiết lập bảng mã UTF-8 cho hiển thị tiếng Việt mượt mà
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

# Định nghĩa đường dẫn lưu trữ Vault
$VaultRoot = Join-Path $env:USERPROFILE ".gemini\config\account_vaults"
$Vault1 = Join-Path $VaultRoot "account1"
$Vault2 = Join-Path $VaultRoot "account2"
$ActiveMarker = Join-Path $VaultRoot "active_account.txt"

if (-not (Test-Path $VaultRoot)) {
    New-Item -ItemType Directory -Path $VaultRoot -Force | Out-Null
}
if (-not (Test-Path $Vault1)) {
    New-Item -ItemType Directory -Path $Vault1 -Force | Out-Null
}
if (-not (Test-Path $Vault2)) {
    New-Item -ItemType Directory -Path $Vault2 -Force | Out-Null
}

# ==============================================================================
# Nạp Win32 API advapi32.dll qua P/Invoke C#
# ==============================================================================
$Win32Source = @"
using System;
using System.Collections.Generic;
using System.Runtime.InteropServices;
using System.Text;

public class CredentialManager {
    public const int CRED_TYPE_GENERIC = 1;
    public const int CRED_PERSIST_LOCAL_MACHINE = 2;
    public const int CRED_PERSIST_ENTERPRISE = 3;

    [StructLayout(LayoutKind.Sequential, CharSet = CharSet.Unicode)]
    public struct CREDENTIAL {
        public int Flags;
        public int Type;
        public string TargetName;
        public string Comment;
        public System.Runtime.InteropServices.ComTypes.FILETIME LastWritten;
        public int CredentialBlobSize;
        public IntPtr CredentialBlob;
        public int Persist;
        public int AttributeCount;
        public IntPtr Attributes;
        public string TargetAlias;
        public string UserName;
    }

    [DllImport("advapi32.dll", SetLastError = true, CharSet = CharSet.Unicode)]
    public static extern bool CredReadW(string target, int type, int reservedFlag, out IntPtr credentialPtr);

    [DllImport("advapi32.dll", SetLastError = true, CharSet = CharSet.Unicode)]
    public static extern bool CredWriteW(ref CREDENTIAL userCredential, int flags);

    [DllImport("advapi32.dll", SetLastError = true, CharSet = CharSet.Unicode)]
    public static extern bool CredDeleteW(string target, int type, int flags);

    [DllImport("advapi32.dll", SetLastError = true, CharSet = CharSet.Unicode)]
    public static extern bool CredEnumerateW(string filter, int flags, out int count, out IntPtr pCredentials);

    [DllImport("advapi32.dll")]
    public static extern void CredFree(IntPtr buffer);

    public class CredentialData {
        public string TargetName;
        public string UserName;
        public string Comment;
        public int Type;
        public int Persist;
        public string BlobBase64;
    }

    public static CredentialData ReadCredential(string targetName) {
        IntPtr credPtr;
        if (!CredReadW(targetName, CRED_TYPE_GENERIC, 0, out credPtr)) {
            return null;
        }

        try {
            CREDENTIAL cred = (CREDENTIAL)Marshal.PtrToStructure(credPtr, typeof(CREDENTIAL));
            byte[] blob = new byte[cred.CredentialBlobSize];
            if (cred.CredentialBlobSize > 0 && cred.CredentialBlob != IntPtr.Zero) {
                Marshal.Copy(cred.CredentialBlob, blob, 0, cred.CredentialBlobSize);
            }

            return new CredentialData {
                TargetName = cred.TargetName,
                UserName = cred.UserName,
                Comment = cred.Comment,
                Type = cred.Type,
                Persist = cred.Persist,
                BlobBase64 = Convert.ToBase64String(blob)
            };
        } finally {
            CredFree(credPtr);
        }
    }

    public static List<CredentialData> EnumerateCredentials(string prefix) {
        List<CredentialData> list = new List<CredentialData>();
        int count = 0;
        IntPtr pCredentials;
        if (!CredEnumerateW(prefix + "*", 0, out count, out pCredentials)) {
            return list;
        }

        try {
            for (int i = 0; i < count; i++) {
                IntPtr credPtr = Marshal.ReadIntPtr(pCredentials, i * IntPtr.Size);
                CREDENTIAL cred = (CREDENTIAL)Marshal.PtrToStructure(credPtr, typeof(CREDENTIAL));
                byte[] blob = new byte[cred.CredentialBlobSize];
                if (cred.CredentialBlobSize > 0 && cred.CredentialBlob != IntPtr.Zero) {
                    Marshal.Copy(cred.CredentialBlob, blob, 0, cred.CredentialBlobSize);
                }
                list.Add(new CredentialData {
                    TargetName = cred.TargetName,
                    UserName = cred.UserName,
                    Comment = cred.Comment,
                    Type = cred.Type,
                    Persist = cred.Persist,
                    BlobBase64 = Convert.ToBase64String(blob)
                });
            }
        } finally {
            CredFree(pCredentials);
        }
        return list;
    }

    public static bool WriteCredential(CredentialData data) {
        byte[] blobBytes = Convert.FromBase64String(data.BlobBase64 ?? "");
        GCHandle handle = GCHandle.Alloc(blobBytes, GCHandleType.Pinned);
        try {
            CREDENTIAL cred = new CREDENTIAL();
            cred.Flags = 0;
            cred.Type = data.Type > 0 ? data.Type : CRED_TYPE_GENERIC;
            cred.TargetName = data.TargetName;
            cred.Comment = data.Comment;
            cred.UserName = data.UserName;
            cred.Persist = data.Persist > 0 ? data.Persist : CRED_PERSIST_LOCAL_MACHINE;
            cred.CredentialBlobSize = blobBytes.Length;
            cred.CredentialBlob = handle.AddrOfPinnedObject();
            cred.AttributeCount = 0;
            cred.Attributes = IntPtr.Zero;
            cred.TargetAlias = null;

            return CredWriteW(ref cred, 0);
        } finally {
            handle.Free();
        }
    }

    public static bool DeleteCredential(string targetName) {
        return CredDeleteW(targetName, CRED_TYPE_GENERIC, 0);
    }
}
"@

if (-not ([System.Management.Automation.PSTypeName]'CredentialManager').Type) {
    Add-Type -TypeDefinition $Win32Source -Language CSharp
}

# ==============================================================================
# Helper Functions
# ==============================================================================

function Get-AntigravityTargets {
    $targets = @("gemini:antigravity")
    # Quét thêm tất cả credential liên quan đến antigravity
    $enumerated = [CredentialManager]::EnumerateCredentials("gemini:")
    foreach ($item in $enumerated) {
        if ($item.TargetName -like "*antigravity*" -and $targets -notcontains $item.TargetName) {
            $targets += $item.TargetName
        }
    }
    return $targets
}

function Save-CurrentAccountToVault {
    param([int]$AccountIndex)

    $targetVault = if ($AccountIndex -eq 1) { $Vault1 } else { $Vault2 }
    $targets = Get-AntigravityTargets

    $savedData = @()
    foreach ($t in $targets) {
        $cred = [CredentialManager]::ReadCredential($t)
        if ($cred -ne $null) {
            $savedData += $cred
        }
    }

    if ($savedData.Count -eq 0) {
        Write-Host "❌ Không tìm thấy thông tin đăng nhập 'gemini:antigravity' trong Windows Credential Manager!" -ForegroundColor Red
        Write-Host "👉 Anh vui lòng mở Antigravity 2.0 và đăng nhập tài khoản trước khi sao lưu." -ForegroundColor Yellow
        return $false
    }

    $jsonFile = Join-Path $targetVault "credentials.json"
    $savedData | ConvertTo-Json -Depth 5 | Set-Content -Path $jsonFile -Encoding UTF8

    $meta = @{
        AccountIndex = $AccountIndex
        SavedAt = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
        TargetCount = $savedData.Count
        UserNames = ($savedData | ForEach-Object { $_.UserName }) -join ", "
    }
    $metaFile = Join-Path $targetVault "metadata.json"
    $meta | ConvertTo-Json | Set-Content -Path $metaFile -Encoding UTF8

    Set-Content -Path $ActiveMarker -Value "account$AccountIndex" -Encoding UTF8

    Write-Host "✅ Đã chụp Snapshot thành công cho Tài khoản Ultra $AccountIndex!" -ForegroundColor Green
    Write-Host "   📁 Lưu tại: $targetVault" -ForegroundColor Gray
    Write-Host "   👤 Tài khoản ghi nhận: $($meta.UserNames)" -ForegroundColor Cyan
    Write-Host "   ⏰ Thời gian: $($meta.SavedAt)" -ForegroundColor Gray
    return $true
}

function Restore-AccountFromVault {
    param([int]$AccountIndex, [bool]$RestartApp = $true)

    $targetVault = if ($AccountIndex -eq 1) { $Vault1 } else { $Vault2 }
    $jsonFile = Join-Path $targetVault "credentials.json"

    if (-not (Test-Path $jsonFile)) {
        Write-Host "❌ Chưa có dữ liệu snapshot cho Tài khoản $AccountIndex!" -ForegroundColor Red
        Write-Host "👉 Anh cần đăng nhập Tài khoản $AccountIndex trước, rồi chạy lệnh lưu (Save $AccountIndex)." -ForegroundColor Yellow
        return $false
    }

    Write-Host "🔄 Đang chuẩn bị chuyển đổi sang Tài khoản Ultra $AccountIndex..." -ForegroundColor Cyan

    # Đóng tiến trình Antigravity nếu đang chạy
    $processes = Get-Process -Name "antigravity", "Antigravity" -ErrorAction SilentlyContinue
    if ($processes) {
        Write-Host "⏹️ Đang dừng Antigravity 2.0 để hoán đổi token..." -ForegroundColor Yellow
        $processes | Stop-Process -Force
        Start-Sleep -Milliseconds 800
    }

    # Nạp credentials từ Vault vào Windows Credential Manager
    $rawJson = Get-Content -Path $jsonFile -Raw -Encoding UTF8
    $creds = $rawJson | ConvertFrom-Json

    $successCount = 0
    foreach ($item in $creds) {
        $cData = New-Object CredentialManager+CredentialData
        $cData.TargetName = $item.TargetName
        $cData.UserName = $item.UserName
        $cData.Comment = $item.Comment
        $cData.Type = $item.Type
        $cData.Persist = $item.Persist
        $cData.BlobBase64 = $item.BlobBase64

        if ([CredentialManager]::WriteCredential($cData)) {
            $successCount++
        }
    }

    Set-Content -Path $ActiveMarker -Value "account$AccountIndex" -Encoding UTF8
    Write-Host "⚡ Đã hoán đổi $successCount token thành công vào Windows Credential Manager!" -ForegroundColor Green

    # Khởi động lại Antigravity 2.0
    if ($RestartApp) {
        Write-Host "🚀 Đang khởi động lại Antigravity 2.0..." -ForegroundColor Cyan
        
        # Tìm đường dẫn thực thi Antigravity
        $exePaths = @(
            "$env:LOCALAPPDATA\Programs\Antigravity\Antigravity.exe",
            "$env:LOCALAPPDATA\Antigravity\Antigravity.exe",
            "$env:ProgramFiles\Antigravity\Antigravity.exe"
        )
        $foundExe = $exePaths | Where-Object { Test-Path $_ } | Select-Object -First 1

        if ($foundExe) {
            Start-Process -FilePath $foundExe
            Write-Host "🎉 Antigravity 2.0 đã mở lại trên Tài khoản Ultra $AccountIndex! Quota 5h mới toanh 100%!" -ForegroundColor Green
        } else {
            Write-Host "⚠️ Đã hoán đổi token xong! Anh có thể nhấp mở biểu tượng Antigravity 2.0 trên máy." -ForegroundColor Yellow
        }
    }

    return $true
}

function Show-Status {
    $active = if (Test-Path $ActiveMarker) { (Get-Content -Path $ActiveMarker -Raw).Trim() } else { "Chưa xác định" }
    
    Write-Host "`n========================================================" -ForegroundColor Magenta
    Write-Host "📊 TRẠNG THÁI TÀI KHOẢN ANTIGRAVITY 2.0 HIỆN TẠI" -ForegroundColor Magenta
    Write-Host "========================================================" -ForegroundColor Magenta
    Write-Host "👉 Tài khoản đang kích hoạt: " -NoNewline
    if ($active -eq "account1") {
        Write-Host "TÀI KHOẢN ULTRA 1" -ForegroundColor Green
    } elseif ($active -eq "account2") {
        Write-Host "TÀI KHOẢN ULTRA 2" -ForegroundColor Green
    } else {
        Write-Host "$active" -ForegroundColor Yellow
    }

    # Kiểm tra Vault 1
    $meta1 = Join-Path $Vault1 "metadata.json"
    if (Test-Path $meta1) {
        $m1 = Get-Content -Path $meta1 -Raw | ConvertFrom-Json
        Write-Host "📦 Vault 1 (Ultra 1): ĐÃ LƯU ($($m1.UserNames) - lưu lúc $($m1.SavedAt))" -ForegroundColor Gray
    } else {
        Write-Host "📦 Vault 1 (Ultra 1): CHƯA CÓ SNAPSHOT" -ForegroundColor DarkGray
    }

    # Kiểm tra Vault 2
    $meta2 = Join-Path $Vault2 "metadata.json"
    if (Test-Path $meta2) {
        $m2 = Get-Content -Path $meta2 -Raw | ConvertFrom-Json
        Write-Host "📦 Vault 2 (Ultra 2): ĐÃ LƯU ($($m2.UserNames) - lưu lúc $($m2.SavedAt))" -ForegroundColor Gray
    } else {
        Write-Host "📦 Vault 2 (Ultra 2): CHƯA CÓ SNAPSHOT" -ForegroundColor DarkGray
    }
    Write-Host "========================================================`n" -ForegroundColor Magenta
}

function Toggle-Account {
    $active = if (Test-Path $ActiveMarker) { (Get-Content -Path $ActiveMarker -Raw).Trim() } else { "account1" }
    if ($active -eq "account1") {
        Restore-AccountFromVault -AccountIndex 2
    } else {
        Restore-AccountFromVault -AccountIndex 1
    }
}

# ==============================================================================
# Xử lý Tham số Điều khiển
# ==============================================================================
switch ($Action) {
    "status" {
        Show-Status
    }
    "save1" {
        Save-CurrentAccountToVault -AccountIndex 1
    }
    "save2" {
        Save-CurrentAccountToVault -AccountIndex 2
    }
    "swap1" {
        Restore-AccountFromVault -AccountIndex 1
    }
    "swap2" {
        Restore-AccountFromVault -AccountIndex 2
    }
    "toggle" {
        Toggle-Account
    }
    "interactive" {
        Clear-Host
        Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
        Write-Host "║    🚀 ANTIGRAVITY 2.0 ULTRA ACCOUNT HOT-SWAP CONTROLLER    ║" -ForegroundColor Cyan
        Write-Host "║      Bộ Hoán Đổi Token Cực Nhanh 3 Giây — Zero Downtime    ║" -ForegroundColor Cyan
        Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan

        Show-Status

        Write-Host "[1] ⚡ Chuyển ngay sang Tài khoản Ultra 1 (Swap to Account 1)" -ForegroundColor Yellow
        Write-Host "[2] ⚡ Chuyển ngay sang Tài khoản Ultra 2 (Swap to Account 2)" -ForegroundColor Yellow
        Write-Host "[3] 🔀 Đổi tài khoản luân phiên (Toggle 1 <-> 2)" -ForegroundColor Cyan
        Write-Host "[4] 💾 Chụp Snapshot tài khoản hiện tại vào Vault 1 (Save Account 1)" -ForegroundColor White
        Write-Host "[5] 💾 Chụp Snapshot tài khoản hiện tại vào Vault 2 (Save Account 2)" -ForegroundColor White
        Write-Host "[6] 📊 Kiểm tra trạng thái chi tiết" -ForegroundColor White
        Write-Host "[Q] Thoát" -ForegroundColor DarkGray
        Write-Host ""
        
        $choice = Read-Host "👉 Nhập lựa chọn của Anh [1-6 hoặc Q]"
        switch ($choice) {
            "1" { Restore-AccountFromVault -AccountIndex 1 }
            "2" { Restore-AccountFromVault -AccountIndex 2 }
            "3" { Toggle-Account }
            "4" { Save-CurrentAccountToVault -AccountIndex 1 }
            "5" { Save-CurrentAccountToVault -AccountIndex 2 }
            "6" { Show-Status }
            default { Write-Host "Tạm biệt Anh!" -ForegroundColor Gray }
        }
    }
}
