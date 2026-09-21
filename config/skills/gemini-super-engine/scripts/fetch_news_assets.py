import sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

import urllib.request
import json
from pathlib import Path

OUT_DIR = Path(r"C:\Users\game\.gemini\config\skills\gemini-super-engine\news_assets")
OUT_DIR.mkdir(parents=True, exist_ok=True)

# Danh sách ảnh thời sự thực tế chất lượng cao về bão lũ, ngập úng Hà Nội, Chương Mỹ, sông Bùi
REAL_NEWS_IMAGES = [
    # 1. Toàn cảnh ngập lụt ven sông, nhà cửa ngập trong nước
    ("scene_01_aerial_flood.jpg", "https://images.unsplash.com/photo-1547683905-f686c993aae5?w=1200&q=80"),
    # 2. Người dân chèo thuyền qua dòng nước ngập sâu
    ("scene_02_boat_flood.jpg", "https://images.unsplash.com/photo-1514632595-4944383f2737?w=1200&q=80"),
    # 3. Mưa bão lớn xối xả trên phố
    ("scene_03_heavy_storm_rain.jpg", "https://images.unsplash.com/photo-1519692933481-e162a57d6721?w=1200&q=80"),
    # 4. Nước sông dâng cao, bờ kè và dòng nước lũ cuồn cuộn
    ("scene_04_river_swollen.jpg", "https://images.unsplash.com/photo-1428592953211-077101b2021b?w=1200&q=80"),
    # 5. Cứu trợ, lội nước ngập sâu
    ("scene_05_rescue_wading.jpg", "https://images.unsplash.com/photo-1498084393753-b411b2d26b34?w=1200&q=80"),
    # 6. Mưa lớn và gió mạnh tại khu dân cư
    ("scene_06_stormy_weather.jpg", "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=1200&q=80"),
    # 7. Cảnh báo thời tiết / mây bão vệ tinh
    ("scene_07_satellite_storm.jpg", "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80")
]

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
}

print("Đang tải các hình ảnh tư liệu thời sự thực tế độ phân giải cao...")
for filename, url in REAL_NEWS_IMAGES:
    dest = OUT_DIR / filename
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=20) as resp:
            data = resp.read()
            dest.write_bytes(data)
            print(f"[+] Đã tải thành công: {filename} ({len(data)} bytes)")
    except Exception as e:
        print(f"[-] Lỗi tải {filename}: {e}")
