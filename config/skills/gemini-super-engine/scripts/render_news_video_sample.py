#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
════════════════════════════════════════════════════════════════════════════
AUTOMATED NEWS VIDEO COMPOSITOR FOR ANTIGRAVITY 2.0
Assembles real news footage, Ken Burns smooth motion, broadcast lower-thirds,
synchronized typography, and master audio into a ready-to-air 1080x1920 MP4.
════════════════════════════════════════════════════════════════════════════
"""

import sys
import subprocess
from pathlib import Path
import numpy as np
import cv2
from PIL import Image, ImageDraw, ImageFont

# Đảm bảo UTF-8
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

BASE_DIR = Path(r"C:\Users\game\.gemini")
ASSET_DIR = BASE_DIR / "config" / "skills" / "gemini-super-engine" / "news_assets"
PUBLIC_DIR = BASE_DIR / "config" / "sidecars" / "anti_live_voice" / "public"
ARTIFACT_DIR = Path(r"C:\Users\game\.gemini\antigravity\brain\6f46af53-7f44-46a4-83e9-d518ccfc6f9f")

FFMPEG_EXE = Path(r"C:\Users\game\cdp_reader\node_modules\ffmpeg-static\ffmpeg.exe")
AUDIO_FILE = PUBLIC_DIR / "thoi_su_master_vtv_sfx.wav"
OUTPUT_MP4 = PUBLIC_DIR / "hanoi_flood_sample.mp4"
OUTPUT_ART = ARTIFACT_DIR / "hanoi_flood_sample.mp4"

FONT_PATH_BOLD = "C:/Windows/Fonts/segoeui.ttf"
FONT_PATH_REG = "C:/Windows/Fonts/arial.ttf"

# Các phân cảnh kịch bản 58 giây
SCENES = [
    {
        "img": ASSET_DIR / "scene_01_aerial_flood.jpg",
        "duration": 8.0,
        "headline": "HÀ NỘI: LŨ SÔNG BÙI, SÔNG TÍCH BÁO ĐỘNG 3",
        "sub": "Dù mưa tại miền Bắc đã dừng, lũ sông Tích và sông Bùi vẫn rút rất chậm"
    },
    {
        "img": ASSET_DIR / "scene_02_boat_flood.jpg",
        "duration": 8.5,
        "headline": "HƠN 5.000 CĂN NHÀ VẪN NGẬP TRONG NƯỚC",
        "sub": "Đến sáng 21/9, hàng nghìn nhà tại Ninh Bình và Hà Nội vẫn ngập sâu"
    },
    {
        "img": ASSET_DIR / "scene_04_river_swollen.jpg",
        "duration": 8.5,
        "headline": "VÙNG VEN SÔNG CHỊU THIỆT HẠI NẶNG NỀ",
        "sub": "Nước sông cuồn cuộn dâng cao, các khu vực trũng thấp ven sông bị chia cắt"
    },
    {
        "img": ASSET_DIR / "scene_05_rescue_wading.jpg",
        "duration": 9.0,
        "headline": "MƯA LŨ LÀM 3 NGƯỜI THIỆT MẠNG TẠI PHÚ THỌ",
        "sub": "8 căn nhà bị sập và 111 nhà hư hỏng nặng, công tác ứng cứu được đẩy mạnh"
    },
    {
        "img": ASSET_DIR / "scene_06_stormy_weather.jpg",
        "duration": 9.0,
        "headline": "DỰ BÁO LŨ TIẾP TỤC XUỐNG CHẬM TRONG 24H TỚI",
        "sub": "Cuộc sống của hàng nghìn hộ dân ngoại thành vẫn chưa thể sớm ổn định"
    },
    {
        "img": ASSET_DIR / "scene_03_heavy_storm_rain.jpg",
        "duration": 8.0,
        "headline": "TÂY NGUYÊN VÀ NAM BỘ BƯỚC VÀO ĐỢT MƯA LỚN",
        "sub": "Đợt mưa dồn dập kéo dài đến 24/9, nguy cơ ngập úng diện rộng đô thị"
    },
    {
        "img": ASSET_DIR / "scene_07_satellite_storm.jpg",
        "duration": 7.0,
        "headline": "THEO DÕI SÁT SAO BẢN TIN THỜI TIẾT TIẾP THEO",
        "sub": "Chủ động các biện pháp phòng chống ngập úng và an toàn tính mạng"
    }
]

def render_video():
    print("================================================================")
    print("🎬 BẮT ĐẦU RENDER VIDEO TIN TỨC THỜI SỰ 1080x1920 (FULL HD)...")
    print("================================================================")

    W, H = 1080, 1920
    FPS = 25
    
    font_badge = ImageFont.truetype(FONT_PATH_BOLD, 32)
    font_headline = ImageFont.truetype(FONT_PATH_BOLD, 36)
    font_sub = ImageFont.truetype(FONT_PATH_REG, 30)
    font_source = ImageFont.truetype(FONT_PATH_REG, 24)

    # Khởi tạo tiến trình FFmpeg pipe
    cmd = [
        str(FFMPEG_EXE),
        "-y",
        "-f", "rawvideo",
        "-vcodec", "rawvideo",
        "-s", f"{W}x{H}",
        "-pix_fmt", "bgr24",
        "-r", str(FPS),
        "-i", "-",
        "-i", str(AUDIO_FILE),
        "-c:v", "libx264",
        "-pix_fmt", "yuv420p",
        "-preset", "veryfast",
        "-crf", "20",
        "-c:a", "aac",
        "-b:a", "192k",
        "-shortest",
        str(OUTPUT_MP4)
    ]
    
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE)

    total_scenes = len(SCENES)
    for sc_idx, sc in enumerate(SCENES, 1):
        img_path = sc["img"]
        duration = sc["duration"]
        headline = sc["headline"]
        sub = sc["sub"]

        print(f"[*] Render Phân cảnh {sc_idx:02d}/{total_scenes:02d} ({duration}s): {headline[:35]}...")

        # Đọc ảnh gốc và chuyển sang RGB
        src_bgr = cv2.imread(str(img_path))
        if src_bgr is None:
            continue
        ih, iw = src_bgr.shape[:2]

        num_frames = int(duration * FPS)

        for f_idx in range(num_frames):
            t = f_idx / num_frames # 0.0 -> 1.0
            zoom = 1.0 + 0.08 * t   # Ken Burns zoom từ 1.0 đến 1.08
            
            # Crop vùng ảnh theo tỷ lệ 1080:1280 (cho khu vực hiển thị trung tâm)
            crop_w = int(iw / zoom)
            crop_h = int(crop_w * (1280 / 1080))
            if crop_h > ih:
                crop_h = ih
                crop_w = int(crop_h * (1080 / 1280))
            
            x1 = (iw - crop_w) // 2
            y1 = int((ih - crop_h) * (0.3 + 0.2 * t)) # slow vertical drift
            x2 = x1 + crop_w
            y2 = y1 + crop_h
            
            cropped = src_bgr[max(0, y1):min(ih, y2), max(0, x1):min(iw, x2)]
            resized_main = cv2.resize(cropped, (1080, 1280), interpolation=cv2.INTER_LINEAR)

            # Tạo khung nền Canvas 1080x1920 (Màu xám đen tin tức sang trọng #0F172A)
            canvas = np.zeros((H, W, 3), dtype=np.uint8)
            canvas[:] = (20, 23, 30) # Gần đen

            # Đặt hình ảnh vào giữa (y = 160 đến y = 1440)
            canvas[160:1440, 0:1080] = resized_main

            # Chuyển sang PIL Image để vẽ Typography sắc nét
            img_pil = Image.fromarray(cv2.cvtColor(canvas, cv2.COLOR_BGR2RGB))
            draw = ImageDraw.Draw(img_pil)

            # 1. HEADER BAR TRÊN CÙNG
            # Vạch đỏ thương hiệu
            draw.rectangle([(0, 0), (1080, 8)], fill="#DC2626")
            # Pill badge trực tiếp
            draw.rounded_rectangle([(40, 45), (380, 105)], radius=12, fill="#DC2626")
            draw.text((65, 58), "🔴 TIN NÓNG THỜI SỰ", font=font_badge, fill="#FFFFFF")
            # Đồng hồ thời gian
            draw.text((800, 62), "21/09 | 11:30", font=font_badge, fill="#94A3B8")

            # 2. LOWER-THIRD GRAPHIC (Băng rôn thời sự đài truyền hình)
            # Dải tin khẩn cấp (Breaking Bar) màu đỏ
            draw.rectangle([(0, 1440), (1080, 1530)], fill="#DC2626")
            draw.text((40, 1460), headline, font=font_headline, fill="#FFFFFF")

            # Khung phụ đề chính (News Ticker Box) màu xanh navy đậm
            draw.rectangle([(0, 1530), (1080, 1780)], fill="#0F172A")
            # Viền trên nhẹ
            draw.line([(0, 1530), (1080, 1530)], fill="#334155", width=2)
            
            # Subtitle lời thoại BTV
            draw.text((40, 1570), sub, font=font_sub, fill="#F8FAFC")
            
            # Ghi chú nguồn tin báo chí
            draw.text((40, 1710), "📌 Nguồn: TTXVN / Tư Liệu Hiện Trường MXH", font=font_source, fill="#94A3B8")

            # Footer gradient
            draw.rectangle([(0, 1890), (1080, 1920)], fill="#1E293B")

            # Chuyển ngược lại BGR để đẩy vào FFmpeg
            frame_bgr = cv2.cvtColor(np.array(img_pil), cv2.COLOR_RGB2BGR)
            proc.stdin.write(frame_bgr.tobytes())

    proc.stdin.close()
    proc.wait()

    # Sao chép sang thư mục artifacts để lưu trữ
    if OUTPUT_MP4.exists():
        OUTPUT_ART.write_bytes(OUTPUT_MP4.read_bytes())
        file_size_mb = OUTPUT_MP4.stat().st_size / (1024 * 1024)
        print(f"\n[+] RENDER HOÀN TẤT THÀNH CÔNG RỰC RỠ!")
        print(f"  • Đường dẫn file: {OUTPUT_MP4}")
        print(f"  • Dung lượng: {file_size_mb:.2f} MB")
        print(f"  • Độ phân giải: 1080x1920 (Vertical 9:16 Full HD 25 FPS)")
        print("================================================================")
        return True
    return False

if __name__ == "__main__":
    render_video()
