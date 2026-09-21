import sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

import urllib.request
import json
from pathlib import Path

SFX_VAULT = Path(r"C:\Users\game\.gemini\config\skills\gemini-super-engine\sfx_vault")
SFX_VAULT.mkdir(parents=True, exist_ok=True)

# Thử nghiệm download một số SFX mẫu từ kho mở bản quyền miễn phí Mixkit
SAMPLE_SFX = {
    "thunder_strike": "https://assets.mixkit.co/active_storage/sfx/1271/1271-preview.mp3",
    "heavy_rain": "https://assets.mixkit.co/active_storage/sfx/1253/1253-preview.mp3",
    "breaking_news_jingle": "https://assets.mixkit.co/active_storage/sfx/2874/2874-preview.mp3",
    "cinematic_swoosh": "https://assets.mixkit.co/active_storage/sfx/2006/2006-preview.mp3"
}

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

print("Đang crawl thử nghiệm các hiệu ứng âm thanh mẫu...")
for name, url in SAMPLE_SFX.items():
    out_file = SFX_VAULT / f"{name}.mp3"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=20) as resp:
            data = resp.read()
            out_file.write_bytes(data)
            print(f"[+] Download thành công {name}.mp3 ({len(data)} bytes)!")
    except Exception as e:
        print(f"[-] Lỗi tải {name}: {e}")
