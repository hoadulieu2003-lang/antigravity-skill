#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
=============================================================================
PERIPHERAL CDP & ECOSYSTEM AUTO-LAUNCHER (Cầu Nối Ngoại Vi & Kiểm Tra Sức Khỏe)
=============================================================================
Module tự động hoá và kiểm toán sức khoẻ toàn diện hệ sinh thái ngoại vi:

  1. Chrome CDP Remote Debugging:
     - Cổng 9222: ChatGPT / Web Automation
     - Cổng 9223: Google Flow Worker (Labs FX)
     - Tự động phát hiện và khởi chạy Chrome với cờ Remote Debugging & Profile chuẩn.
  2. Git Remote Health:
     - Kiểm tra kết nối Remote Origin, nhánh hiện tại và trạng thái sạch sẽ.
  3. Photoshop COM Bridge:
     - Kiểm tra kết nối daemon HTTP (port 28765) và COM automation capability.
  4. Telegram Master Hub:
     - Kiểm tra cấu hình Bot Token, script điều phối và trạng thái sẵn sàng.
=============================================================================
"""

import os
import sys
import json
import time
import shutil
import socket
import subprocess
import urllib.request
import urllib.error
from datetime import datetime, timezone
from pathlib import Path

# Đảm bảo UTF-8 trên Windows console
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

BASE_DIR = r"C:\Users\game\.gemini"
LOCALAPPDATA = os.environ.get("LOCALAPPDATA", r"C:\Users\game\AppData\Local")
CHROME_PROFILE_DIR = os.path.join(LOCALAPPDATA, "Google", "Chrome", "User Data Debug")
CHROME_PROFILE_2_DIR = os.path.join(LOCALAPPDATA, "Google", "Chrome", "User Data Debug 2")
PS_BRIDGE_SCRIPT = os.path.join(BASE_DIR, "config", "skills", "photoshop-studio", "scripts", "ps_bridge.py")
TELEGRAM_HUB_DIR = os.path.join(BASE_DIR, "config", "sidecars", "antigravity_master_hub")
PHOTOSHOP_DAEMON_PORT = 28765

# Các đường dẫn cài đặt tiêu chuẩn của Google Chrome trên Windows
STANDARD_CHROME_PATHS = [
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
    os.path.expandvars(r"%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe"),
    os.path.expandvars(r"%PROGRAMFILES%\Google\Chrome\Application\chrome.exe"),
    os.path.expandvars(r"%PROGRAMFILES(X86)%\Google\Chrome\Application\chrome.exe"),
]

def find_chrome_executable() -> str | None:
    """Xác định vị trí tệp thực thi chrome.exe trên máy tính Windows"""
    for path in STANDARD_CHROME_PATHS:
        if path and os.path.isfile(path):
            return path
            
    # Tra cứu qua PATH hệ thống
    which_chrome = shutil.which("chrome") or shutil.which("chrome.exe")
    if which_chrome and os.path.isfile(which_chrome):
        return which_chrome
        
    return None

def check_tcp_port_open(port: int, host: str = "127.0.0.1", timeout: float = 1.0) -> bool:
    """Kiểm tra xem một cổng TCP có đang được lắng nghe (listening) hay không"""
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        sock.settimeout(timeout)
        try:
            sock.connect((host, port))
            return True
        except (socket.timeout, ConnectionRefusedError, OSError):
            return False

def check_cdp_port(port: int = 9222, host: str = "127.0.0.1", timeout: float = 1.5) -> dict:
    """
    Kiểm tra trạng thái Chrome DevTools Protocol qua endpoint /json/version.
    Trả về thông tin chi tiết về trình duyệt, phiên bản và WebSocket Debugger URL.
    """
    url = f"http://{host}:{port}/json/version"
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Antigravity-HealthCheck/1.0"})
        with urllib.request.urlopen(req, timeout=timeout) as response:
            if response.status == 200:
                raw_data = response.read().decode("utf-8")
                data = json.loads(raw_data)
                return {
                    "port": port,
                    "status": "ONLINE",
                    "browser": data.get("Browser", "Unknown Chrome"),
                    "protocol": data.get("Protocol-Version", "Unknown"),
                    "ws_url": data.get("webSocketDebuggerUrl", ""),
                    "user_agent": data.get("User-Agent", "")
                }
            else:
                return {
                    "port": port,
                    "status": "BUSY",
                    "message": f"Cổng {port} phản hồi HTTP {response.status}"
                }
    except Exception as e:
        # Nếu HTTP request lỗi nhưng port đang mở (có thể do chặn nguồn gốc)
        if check_tcp_port_open(port, host=host, timeout=0.8):
            return {
                "port": port,
                "status": "BUSY",
                "message": f"Cổng {port} đang mở nhưng HTTP /json/version không phản hồi: {str(e)}"
            }
            
    return {
        "port": port,
        "status": "OFFLINE",
        "message": f"Cổng {port} chưa mở hoặc chưa được kích hoạt"
    }

def launch_chrome_debug(port: int = 9222, profile_dir: str = None, wait_timeout: int = 12) -> dict:
    """
    Tự động kích hoạt Google Chrome với cờ Remote Debugging và Profile cách ly an toàn.
    """
    if profile_dir is None:
        if port == 9222:
            profile_dir = CHROME_PROFILE_DIR
        elif port == 9223:
            profile_dir = CHROME_PROFILE_2_DIR
        else:
            profile_dir = os.path.join(LOCALAPPDATA, "Google", "Chrome", f"User Data Debug {port}")

    # 1. Kiểm tra nếu cổng đã sẵn sàng
    current_status = check_cdp_port(port=port)
    if current_status.get("status") == "ONLINE":
        return {
            "status": "ALREADY_ONLINE",
            "port": port,
            "message": f"Chrome Remote Debugging tại cổng {port} đã hoạt động sẵn sàng.",
            "details": current_status
        }
    if check_tcp_port_open(port):
        return {
            "status": "PORT_BUSY",
            "port": port,
            "message": f"Cổng {port} đang được sử dụng hoặc đang lắng nghe kết nối nhưng chưa sẵn sàng CDP.",
            "details": current_status
        }

    chrome_bin = find_chrome_executable()
    if not chrome_bin:
        return {
            "status": "FAILED",
            "port": port,
            "message": "Không tìm thấy file thực thi chrome.exe trên các đường dẫn tiêu chuẩn."
        }

    os.makedirs(profile_dir, exist_ok=True)

    cmd = [
        chrome_bin,
        f"--remote-debugging-port={port}",
        f"--user-data-dir={profile_dir}",
        "--remote-allow-origins=*",
        "--no-first-run",
        "--no-default-browser-check"
    ]

    print(f"[*] 🚀 Đang khởi chạy Chrome với Remote Debugging Port {port}...")
    print(f"    - Binary : {chrome_bin}")
    print(f"    - Profile: {profile_dir}")

    CREATE_NO_WINDOW = 0x08000000
    DETACHED_PROCESS = 0x00000008

    try:
        subprocess.Popen(
            cmd,
            creationflags=CREATE_NO_WINDOW | DETACHED_PROCESS,
            close_fds=True
        )
    except Exception as e:
        return {
            "status": "FAILED",
            "port": port,
            "message": f"Lỗi khởi chạy tiến trình Chrome: {str(e)}"
        }

    # Đợi và thăm dò cổng CDP hoạt động
    start_time = time.time()
    while time.time() - start_time < wait_timeout:
        time.sleep(0.8)
        probe = check_cdp_port(port=port)
        if probe.get("status") == "ONLINE":
            print(f"[✓] Cổng CDP {port} đã mở thành công! (Thời gian đáp ứng: {time.time() - start_time:.1f}s)")
            return {
                "status": "LAUNCHED",
                "port": port,
                "message": f"Khởi chạy Chrome Debugging tại cổng {port} thành công.",
                "details": probe
            }

    return {
        "status": "TIMEOUT",
        "port": port,
        "message": f"Tiến trình Chrome đã được gọi nhưng cổng {port} chưa kịp phản hồi sau {wait_timeout}s."
    }

def ensure_cdp_active(port: int = 9222) -> dict:
    """Đảm bảo cổng CDP yêu cầu luôn ở trạng thái ONLINE (tự chạy nếu chưa bật)"""
    status = check_cdp_port(port=port)
    if status.get("status") == "ONLINE":
        return status
    launch_res = launch_chrome_debug(port=port)
    return check_cdp_port(port=port)

def check_git_health(repo_dir: str = BASE_DIR) -> dict:
    """Kiểm tra sức khoẻ của Git repository và Remote Origin"""
    git_dir = os.path.join(repo_dir, ".git")
    if not os.path.exists(git_dir):
        return {"status": "NOT_A_REPO", "message": f"Thư mục {repo_dir} chưa khởi tạo Git."}

    try:
        # Lấy remote URL
        res_remote = subprocess.run(
            ["git", "remote", "get-url", "origin"],
            cwd=repo_dir, capture_output=True, text=True, encoding="utf-8", errors="replace"
        )
        origin_url = res_remote.stdout.strip() if res_remote.returncode == 0 else "None"

        # Lấy branch hiện tại
        res_branch = subprocess.run(
            ["git", "branch", "--show-current"],
            cwd=repo_dir, capture_output=True, text=True, encoding="utf-8", errors="replace"
        )
        branch = res_branch.stdout.strip() if res_branch.returncode == 0 else "unknown"

        # Lấy trạng thái thay đổi
        res_status = subprocess.run(
            ["git", "status", "--porcelain"],
            cwd=repo_dir, capture_output=True, text=True, encoding="utf-8", errors="replace"
        )
        uncommitted = len(res_status.stdout.strip().splitlines()) if res_status.stdout.strip() else 0

        # Lấy commit hash gần nhất
        res_log = subprocess.run(
            ["git", "log", "-1", "--format=%h - %s (%cr)"],
            cwd=repo_dir, capture_output=True, text=True, encoding="utf-8", errors="replace"
        )
        last_commit = res_log.stdout.strip() if res_log.returncode == 0 else "Chưa có commit"

        status = "HEALTHY" if (origin_url != "None" and uncommitted == 0) else ("DIRTY" if origin_url != "None" else "DEGRADED")
        return {
            "status": status,
            "origin_url": origin_url,
            "branch": branch,
            "uncommitted_files": uncommitted,
            "last_commit": last_commit
        }
    except Exception as e:
        return {"status": "ERROR", "message": str(e)}

def check_photoshop_health() -> dict:
    """Kiểm tra sức khoẻ của Photoshop COM Automation Bridge"""
    # 1. Kiểm tra daemon HTTP 28765
    try:
        req = urllib.request.Request(f"http://127.0.0.1:{PHOTOSHOP_DAEMON_PORT}/health")
        with urllib.request.urlopen(req, timeout=1.2) as resp:
            if resp.status == 200:
                data = json.loads(resp.read().decode("utf-8"))
                return {
                    "status": "ONLINE",
                    "mode": "HTTP_DAEMON",
                    "port": PHOTOSHOP_DAEMON_PORT,
                    "version": data.get("version", "Active"),
                    "bridge_script": PS_BRIDGE_SCRIPT
                }
    except Exception:
        pass

    # 2. Kiểm tra module pywin32 và script bridge
    win32_available = False
    try:
        import win32com.client
        win32_available = True
    except ImportError:
        pass

    script_exists = os.path.exists(PS_BRIDGE_SCRIPT)

    if win32_available and script_exists:
        return {
            "status": "STANDBY",
            "mode": "COM_DIRECT_SPAWN",
            "message": "COM bridge sẵn sàng, daemon ở chế độ nghỉ (Idle standby)",
            "bridge_script": PS_BRIDGE_SCRIPT
        }
    elif not win32_available:
        return {
            "status": "OFFLINE",
            "mode": "MISSING_PYWIN32",
            "message": "Chưa cài đặt pywin32 trong môi trường Python"
        }
    else:
        return {
            "status": "OFFLINE",
            "mode": "SCRIPT_MISSING",
            "message": f"Không tìm thấy file {PS_BRIDGE_SCRIPT}"
        }

def check_telegram_hub_health() -> dict:
    """Kiểm tra sức khoẻ của Antigravity Master Telegram Hub"""
    if not os.path.exists(TELEGRAM_HUB_DIR):
        return {"status": "NOT_FOUND", "message": f"Thư mục {TELEGRAM_HUB_DIR} không tồn tại"}

    config_file = os.path.join(TELEGRAM_HUB_DIR, "hub_config.json")
    env_local_file = os.path.join(TELEGRAM_HUB_DIR, ".env.local")
    listener_file = os.path.join(TELEGRAM_HUB_DIR, "telegram_master_listener.cjs")

    has_config = os.path.exists(config_file)
    has_listener = os.path.exists(listener_file)
    has_node = shutil.which("node") is not None

    bot_configured = False
    if has_config:
        try:
            with open(config_file, "r", encoding="utf-8") as f:
                cdata = json.load(f)
            token = cdata.get("bot_token", "")
            if token and not token.startswith("ENV:"):
                bot_configured = True
            elif os.path.exists(env_local_file):
                with open(env_local_file, "r", encoding="utf-8") as ef:
                    econtent = ef.read()
                if "TELEGRAM_BOT_TOKEN=" in econtent:
                    bot_configured = True
        except Exception:
            pass

    status = "CONFIGURED" if (has_config and has_listener and bot_configured and has_node) else "STANDBY"
    return {
        "status": status,
        "hub_dir": TELEGRAM_HUB_DIR,
        "listener_script": has_listener,
        "bot_configured": bot_configured,
        "node_runtime": has_node
    }

def check_ecosystem_health(auto_launch_cdp: bool = True) -> dict:
    """
    Thực hiện kiểm toán sức khoẻ toàn diện các cầu nối ngoại vi trong hệ sinh thái.
    Tự động khởi chạy Chrome trên cổng 9222 nếu đang tắt.
    """
    cdp_9222 = check_cdp_port(9222)
    if auto_launch_cdp and cdp_9222.get("status") != "ONLINE":
        launch_res = launch_chrome_debug(port=9222)
        cdp_9222 = check_cdp_port(9222)

    cdp_9223 = check_cdp_port(9223)
    git_status = check_git_health()
    ps_status = check_photoshop_health()
    tg_status = check_telegram_hub_health()

    now_iso = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

    return {
        "timestamp": now_iso,
        "cdp_9222": cdp_9222,
        "cdp_9223": cdp_9223,
        "git": git_status,
        "photoshop": ps_status,
        "telegram": tg_status
    }

def print_health_dashboard(report: dict):
    """In bảng điều khiển sức khoẻ hệ sinh thái trực quan"""
    print("\n" + "═" * 70)
    print("   🩺 BẢNG ĐIỀU KHIỂN SỨC KHOẺ CẦU NỐI NGOẠI VI (ECOSYSTEM HEALTH)")
    print(f"   Thời gian kiểm toán: {report.get('timestamp')}")
    print("═" * 70)

    # 1. CDP 9222
    c9222 = report.get("cdp_9222", {})
    st9222 = c9222.get("status", "OFFLINE")
    badge9222 = "🟢 ONLINE" if st9222 == "ONLINE" else "🔴 OFFLINE"
    print(f"• [CDP 9222 - ChatGPT/Web]  : {badge9222}")
    if st9222 == "ONLINE":
        print(f"  └─ Browser: {c9222.get('browser')} | WS: {c9222.get('ws_url')[:45]}...")
    else:
        print(f"  └─ Ghi chú: {c9222.get('message')}")

    # 2. CDP 9223
    c9223 = report.get("cdp_9223", {})
    st9223 = c9223.get("status", "OFFLINE")
    badge9223 = "🟢 ONLINE" if st9223 == "ONLINE" else "🟡 STANDBY"
    print(f"• [CDP 9223 - Google Flow]  : {badge9223}")
    if st9223 == "ONLINE":
        print(f"  └─ Browser: {c9223.get('browser')} | WS: {c9223.get('ws_url')[:45]}...")
    else:
        print(f"  └─ Ghi chú: Cổng dự phòng sẵn sàng cho Flow Worker khi cần render")

    # 3. Git Remote
    git = report.get("git", {})
    st_git = git.get("status", "UNKNOWN")
    badge_git = "🟢 HEALTHY" if st_git == "HEALTHY" else ("🟡 DIRTY" if st_git == "DIRTY" else "🔴 " + st_git)
    print(f"• [Git Remote Storage]      : {badge_git}")
    print(f"  ├─ Remote : {git.get('origin_url')}")
    print(f"  ├─ Branch : {git.get('branch')} (Chưa commit: {git.get('uncommitted_files')} tệp)")
    print(f"  └─ Commit : {git.get('last_commit')}")

    # 4. Photoshop COM Bridge
    ps = report.get("photoshop", {})
    st_ps = ps.get("status", "OFFLINE")
    badge_ps = "🟢 ONLINE" if st_ps == "ONLINE" else ("🟡 STANDBY" if st_ps == "STANDBY" else "🔴 OFFLINE")
    print(f"• [Photoshop COM Bridge]    : {badge_ps} (Mode: {ps.get('mode')})")
    if st_ps in ["ONLINE", "STANDBY"]:
        print(f"  └─ Script : {os.path.basename(ps.get('bridge_script', ''))}")
    else:
        print(f"  └─ Ghi chú: {ps.get('message')}")

    # 5. Telegram Master Hub
    tg = report.get("telegram", {})
    st_tg = tg.get("status", "UNKNOWN")
    badge_tg = "🟢 CONFIGURED" if st_tg == "CONFIGURED" else "🟡 " + st_tg
    print(f"• [Telegram Master Hub]     : {badge_tg}")
    print(f"  └─ Bot Token: {'Đã cấu hình' if tg.get('bot_configured') else 'Chưa cấu hình'} | Node.js: {'Có' if tg.get('node_runtime') else 'Thiếu'}")
    print("═" * 70 + "\n")

def main():
    import argparse
    parser = argparse.ArgumentParser(description="Peripheral CDP & Ecosystem Auto-Launcher")
    parser.add_argument("--check", action="store_true", help="Chỉ kiểm tra sức khoẻ hệ sinh thái (không tự kích hoạt)")
    parser.add_argument("--launch", action="store_true", help="Kích hoạt Chrome Remote Debugging port")
    parser.add_argument("--ensure", action="store_true", help="Đảm bảo Chrome Remote Debugging đang chạy (nếu tắt thì bật)")
    parser.add_argument("--port", type=int, default=9222, help="Cổng CDP cụ thể để thao tác (mặc định: 9222)")
    parser.add_argument("--json", action="store_true", help="Xuất kết quả dưới định dạng JSON")
    args = parser.parse_args()

    if args.launch or args.ensure:
        res = launch_chrome_debug(port=args.port)
        if args.json:
            print(json.dumps(res, indent=2, ensure_ascii=False))
        else:
            print(f"[{res.get('status')}] {res.get('message')}")
        return

    auto_launch = not args.check
    report = check_ecosystem_health(auto_launch_cdp=auto_launch)

    if args.json:
        print(json.dumps(report, indent=2, ensure_ascii=False))
    else:
        print_health_dashboard(report)

if __name__ == "__main__":
    main()
