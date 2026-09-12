#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
=============================================================================
SYNCHRONIZATION VAULT ENGINE (Động cơ Đồng bộ Kho Tri thức Đa Thiết bị)
=============================================================================
Quản trị đồng bộ hóa hai chiều (Two-Way Synchronization) giữa Laptop (Master)
và các máy tính phụ (PC Slaves) thông qua Private Git Repository (Kho lưu trữ Git riêng tư).

Chức năng chính:
  1. --init <repo_url>   : Khởi tạo Git repository, trỏ remote origin và đẩy commit đầu tiên.
  2. --push [msg]        : Quét thay đổi, kiểm tra an toàn bảo mật, commit và đẩy lên Git remote.
  3. --pull              : Kéo tri thức và kỹ năng mới nhất từ Git remote về máy.
  4. --status            : Kiểm tra trạng thái đồng bộ, commit gần nhất và tệp đang sửa đổi.
  5. --bootstrap <url>   : Khởi tạo nhanh trên máy mới (PC Slave) từ URL repo.
=============================================================================
"""

import os
import sys
import subprocess
import argparse
from datetime import datetime
from pathlib import Path

# Đảm bảo terminal console Windows luôn xuất Unicode UTF-8 chuẩn xác
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

# Đường dẫn gốc của Vault (C:\Users\game\.gemini)
VAULT_DIR = Path(__file__).resolve().parent.parent.parent

# Danh sách mẫu tệp cấm commit (Security Invariant - AGENTS.md Rule 14)
FORBIDDEN_PATTERNS = [
    ".env",
    "hub_config.json",
    "antigravity_master_hub/.env.local",
    "id_rsa",
    "id_ed25519",
    "credentials.json",
    ".credentials",
]

def run_git_command(args, cwd=VAULT_DIR, check=True):
    """
    Thực thi lệnh Git với chuẩn đầu ra UTF-8.
    """
    cmd = ["git"] + args
    result = subprocess.run(
        cmd,
        cwd=cwd,
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace"
    )
    if check and result.returncode != 0:
        raise RuntimeError(f"Lệnh Git thất bại: {' '.join(cmd)}\nLỗi: {result.stderr.strip()}")
    return result

def check_git_installed():
    """
    Kiểm tra Git CLI đã được cài đặt trên hệ thống chưa.
    """
    try:
        res = run_git_command(["--version"], check=False)
        if res.returncode != 0:
            print("[!] CẢNH BÁO: Không tìm thấy Git trên hệ thống. Vui lòng cài đặt Git.")
            return False
        return True
    except Exception:
        print("[!] CẢNH BÁO: Không thể gọi lệnh 'git'. Vui lòng kiểm tra PATH môi trường.")
        return False

def ensure_git_user_configured():
    """
    Đảm bảo định danh Git tác giả (Git Author Identity) được thiết lập,
    tránh lỗi 'Author identity unknown' khi commit trên máy mới.
    """
    res_name = run_git_command(["config", "user.name"], check=False)
    if not res_name.stdout.strip():
        run_git_command(["config", "user.name", "Antigravity Pair-Programmer"])
    res_email = run_git_command(["config", "user.email"], check=False)
    if not res_email.stdout.strip():
        run_git_command(["config", "user.email", "pair-programmer@antigravity.local"])

def audit_safety_before_commit():
    """
    Kiểm toán an toàn trước khi commit (Pre-Commit Security Audit).
    Bảo đảm không có khóa bảo mật (Secrets/API Tokens) bị đưa vào Git.
    """
    res = run_git_command(["diff", "--cached", "--name-only"], check=False)
    if res.returncode != 0:
        return True
    staged_files = res.stdout.strip().splitlines()
    leaks = []
    for f in staged_files:
        for pattern in FORBIDDEN_PATTERNS:
            if pattern in f:
                leaks.append(f)
    if leaks:
        print("[X] PHÁT HIỆN RỦI RO BẢO MẬT (Security Risk Detected):")
        for leak in leaks:
            print(f"    - Tệp nhạy cảm bị stage: {leak}")
        print("[!] Huỷ bỏ thao tác commit để bảo vệ an toàn (AGENTS.md Rule 14).")
        return False
    return True

def get_vault_status():
    """
    Hiển thị trạng thái đồng bộ hiện tại của Vault.
    """
    print("\n" + "=" * 60)
    print("  KHO TRI THỨC VÀ KỸ NĂNG (KNOWLEDGE & SKILLS VAULT)")
    print(f"  Đường dẫn cục bộ: {VAULT_DIR}")
    print("=" * 60)

    if not (VAULT_DIR / ".git").is_dir():
        print("[i] Trạng thái: Chưa khởi tạo Git Repository.")
        print("    Gợi ý: Chạy lệnh `python sync_vault.py --init <REPO_URL>` để bắt đầu.")
        return

    # Lấy remote URL
    res_remote = run_git_command(["remote", "get-url", "origin"], check=False)
    origin_url = res_remote.stdout.strip() if res_remote.returncode == 0 else "Chưa cấu hình (Not configured)"
    print(f"  Remote Origin (Kho lưu trữ từ xa) : {origin_url}")

    # Lấy nhánh hiện tại
    res_branch = run_git_command(["branch", "--show-current"], check=False)
    branch = res_branch.stdout.strip() if res_branch.returncode == 0 else "unknown"
    print(f"  Current Branch (Nhánh hiện tại)    : {branch}")

    # Lấy commit gần nhất
    res_log = run_git_command(["log", "-1", "--format=%h - %s (%cr)"], check=False)
    last_commit = res_log.stdout.strip() if res_log.returncode == 0 else "Chưa có commit nào."
    print(f"  Last Commit (Bản ghi gần nhất)     : {last_commit}")

    # Kiểm tra trạng thái working tree
    res_status = run_git_command(["status", "--porcelain"], check=False)
    changes = res_status.stdout.strip().splitlines() if res_status.stdout.strip() else []
    if changes:
        print(f"\n  [!] Có {len(changes)} tệp có thay đổi chưa được đồng bộ:")
        for c in changes[:10]:
            print(f"      {c}")
        if len(changes) > 10:
            print(f"      ... và {len(changes) - 10} tệp khác.")
    else:
        print("\n  [v] Trạng thái làm việc sạch sẽ (Working tree clean). Đã đồng bộ với commit cục bộ.")
    print("=" * 60 + "\n")

def init_vault(repo_url):
    """
    Khởi tạo Git repo và thiết lập đẩy lần đầu lên GitHub Private Repo.
    """
    print(f"[*] Bắt đầu khởi tạo Vault tại: {VAULT_DIR}")
    ensure_git_user_configured()
    if not (VAULT_DIR / ".git").is_dir():
        print("[+] Chạy `git init`...")
        run_git_command(["init"])
        run_git_command(["branch", "-M", "main"])
    
    # Cấu hình remote
    res_remotes = run_git_command(["remote"], check=False)
    if "origin" in res_remotes.stdout.splitlines():
        print(f"[+] Cập nhật URL remote origin thành: {repo_url}")
        run_git_command(["remote", "set-url", "origin", repo_url])
    else:
        print(f"[+] Thêm remote origin: {repo_url}")
        run_git_command(["remote", "add", "origin", repo_url])

    # Stage và commit
    print("[+] Quét và đóng gói tệp tin theo .gitignore...")
    run_git_command(["add", "."])

    if not audit_safety_before_commit():
        sys.exit(1)

    res_staged = run_git_command(["diff", "--cached", "--name-only"], check=False)
    if not res_staged.stdout.strip():
        print("[i] Không có tệp tin nào cần commit.")
    else:
        now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        commit_msg = f"feat(vault): initial enterprise knowledge and skills vault [{now_str}]"
        print(f"[+] Tạo commit khởi đầu: '{commit_msg}'")
        run_git_command(["commit", "-m", commit_msg])

    # Push
    print(f"[+] Đẩy toàn bộ tri thức lên Remote Origin (main)...")
    res_push = run_git_command(["push", "-u", "origin", "main"], check=False)
    if res_push.returncode == 0:
        print("\n[V] THÀNH CÔNG: Kho tri thức đã được đẩy lên Git Repository thành công!")
        print(f"    Kho lưu trữ: {repo_url}")
    else:
        print("\n[!] CẢNH BÁO: Chưa thể đẩy trực tiếp lên Remote. Chi tiết:")
        print(res_push.stderr if res_push.stderr else res_push.stdout)
        print("    Vui lòng kiểm tra quyền truy cập (SSH key hoặc GitHub Personal Access Token/gh auth).")

def push_vault(custom_msg=None):
    """
    Tự động quét, commit và đẩy các thay đổi mới lên Git Remote.
    """
    if not (VAULT_DIR / ".git").is_dir():
        print("[!] Lỗi: Vault chưa được khởi tạo Git. Vui lòng chạy `--init <REPO_URL>` trước.")
        return

    ensure_git_user_configured()
    print("[*] Quét các thay đổi trong kho tri thức và kỹ năng...")
    run_git_command(["add", "."])

    if not audit_safety_before_commit():
        sys.exit(1)

    res_staged = run_git_command(["diff", "--cached", "--name-only"], check=False)
    if not res_staged.stdout.strip():
        print("[v] Kho tri thức đã ở trạng thái mới nhất. Không có thay đổi nào cần đẩy.")
        return

    now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    msg = custom_msg or f"sync(vault): auto-sync knowledge & skills [{now_str}]"
    print(f"[+] Tạo bản ghi Commit (Ghi nhận): {msg}")
    run_git_command(["commit", "-m", msg])

    print("[+] Đang đẩy dữ liệu lên Remote Origin...")
    res_push = run_git_command(["push", "origin", "main"], check=False)
    if res_push.returncode == 0:
        print("[V] ĐỒNG BỘ THÀNH CÔNG (Sync Complete): Dữ liệu mới đã được cập nhật lên đám mây.")
    else:
        print("[!] Đẩy thất bại. Có thể có xung đột hoặc lỗi kết nối mạng:")
        print(res_push.stderr if res_push.stderr else res_push.stdout)

def pull_vault():
    """
    Kéo dữ liệu mới nhất từ Git Remote về máy trạm.
    """
    if not (VAULT_DIR / ".git").is_dir():
        print("[!] Lỗi: Vault chưa được khởi tạo Git. Vui lòng chạy `--init <REPO_URL>` trước.")
        return

    print("[*] Đang kéo tri thức và kỹ năng mới từ Remote Origin...")
    res_pull = run_git_command(["pull", "--rebase", "origin", "main"], check=False)
    if res_pull.returncode == 0:
        print("[V] KÉO DỮ LIỆU HOÀN TẤT (Pull Succeeded): Toàn bộ kỹ năng và tri thức đã đồng bộ mới nhất.")
        get_vault_status()
    else:
        print("[!] Kéo thất bại. Chi tiết lỗi:")
        print(res_pull.stderr if res_pull.stderr else res_pull.stdout)

def bootstrap_slave(repo_url):
    """
    Thiết lập nhanh trên máy phụ (PC Slave):
    Khởi tạo Git, kéo toàn bộ file từ remote về mà không làm hỏng file cục bộ.
    """
    print(f"[*] Bắt đầu Bootstrap cấu hình máy phụ từ: {repo_url}")
    if not (VAULT_DIR / ".git").is_dir():
        run_git_command(["init"])
        run_git_command(["branch", "-M", "main"])
    
    # Cấu hình remote
    res_remotes = run_git_command(["remote"], check=False)
    if "origin" in res_remotes.stdout.splitlines():
        run_git_command(["remote", "set-url", "origin", repo_url])
    else:
        run_git_command(["remote", "add", "origin", repo_url])

    print("[+] Đang tải dữ liệu từ Remote...")
    run_git_command(["fetch", "origin", "main"])
    print("[+] Đang đồng bộ cấu hình vào thư mục làm việc...")
    run_git_command(["reset", "--hard", "origin/main"])
    run_git_command(["branch", "--set-upstream-to=origin/main", "main"])
    print("[V] BOOTSTRAP HOÀN TẤT: Máy tính đã được trang bị đầy đủ toàn bộ kỹ năng và cẩm nang!")
    get_vault_status()

def main():
    parser = argparse.ArgumentParser(description="Synchronization Vault Engine for Antigravity")
    parser.add_argument("--init", type=str, metavar="REPO_URL", help="Khởi tạo Vault và liên kết với Git Remote")
    parser.add_argument("--push", nargs="?", const="", metavar="COMMIT_MSG", help="Commit và đẩy các thay đổi lên Remote")
    parser.add_argument("--pull", action="store_true", help="Kéo dữ liệu mới nhất từ Remote về máy")
    parser.add_argument("--status", action="store_true", help="Xem trạng thái đồng bộ hiện tại")
    parser.add_argument("--bootstrap", type=str, metavar="REPO_URL", help="Khởi tạo nhanh trên máy tính phụ (PC Slave)")

    args = parser.parse_args()

    if not check_git_installed():
        sys.exit(1)

    if args.init:
        init_vault(args.init)
    elif args.push is not None:
        msg = args.push if args.push else None
        push_vault(msg)
    elif args.pull:
        pull_vault()
    elif args.bootstrap:
        bootstrap_slave(args.bootstrap)
    else:
        get_vault_status()

if __name__ == "__main__":
    main()
