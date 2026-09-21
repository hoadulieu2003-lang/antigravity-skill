#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
════════════════════════════════════════════════════════════════════════════
HIGH-SPEED UGC MASTER NEWS VIDEO COMPOSITOR (AUTHENTIC THREADS FOOTAGE)
Optimized with precomputed overlays & sequential frame streaming.
Renders 1080x1920 Full HD at 50+ FPS directly into FFmpeg pipe.
════════════════════════════════════════════════════════════════════════════
"""

import sys
import subprocess
from pathlib import Path
import numpy as np
import cv2
from PIL import Image, ImageDraw, ImageFont

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

BASE_DIR = Path(r"C:\Users\game\.gemini")
UGC_DIR = BASE_DIR / "threads_harvest"
PUBLIC_DIR = BASE_DIR / "config" / "sidecars" / "anti_live_voice" / "public"
ARTIFACT_DIR = Path(r"C:\Users\game\.gemini\antigravity\brain\6f46af53-7f44-46a4-83e9-d518ccfc6f9f")

FFMPEG_EXE = Path(r"C:\Users\game\cdp_reader\node_modules\ffmpeg-static\ffmpeg.exe")
AUDIO_FILE = PUBLIC_DIR / "thoi_su_master_vtv_sfx.wav"
OUTPUT_MP4 = PUBLIC_DIR / "hanoi_flood_ugc_master.mp4"
OUTPUT_ART = ARTIFACT_DIR / "hanoi_flood_ugc_master.mp4"

FONT_PATH_BOLD = "C:/Windows/Fonts/segoeui.ttf"
FONT_PATH_REG = "C:/Windows/Fonts/arial.ttf"

SEGMENTS = [
    {
        "video": UGC_DIR / "threads_stream_vid_08.mp4", # Bác Grab lội nước đưa học sinh đi học
        "start_sec": 0.0,
        "end_sec": 10.0,
        "badge": "HÀ NỘI • NƯỚC NGẬP DIỆN RỘNG",
        "headline": "NHIỀU ĐOẠN ĐƯỜNG NGẬP SÂU, PHƯƠNG TIỆN BÌ BÕM",
        "sub": "Mưa lớn kéo dài khiến các tuyến đường nội - ngoại thành chìm trong biển nước",
        "ugc_credit": "Threads @tbh_1408: \"Bác Grab nhất quyết lội nước đưa tới cổng trường\""
    },
    {
        "video": UGC_DIR / "threads_video_08.mp4", # Phố ngập trước dãy quán ăn Lẩu Ốc, xe tải ngập
        "start_sec": 10.0,
        "end_sec": 22.0,
        "badge": "VEN SÔNG BÙI • SÔNG TÍCH",
        "headline": "HƠN 5.000 CĂN NHÀ NGẬP SÂU, BÁO ĐỘNG LŨ CẤP 3",
        "sub": "Lũ sông Bùi, sông Tích rút rất chậm, nhiều khu dân cư bị cô lập hoàn toàn",
        "ugc_credit": "Video ghi nhận thực địa của người dân tại huyện ngoại thành Hà Nội"
    },
    {
        "video": UGC_DIR / "threads_stream_vid_07.mp4", # Người nhái lặn khơi thông cống xả
        "start_sec": 22.0,
        "end_sec": 34.0,
        "badge": "HIỆN TRƯỜNG THOÁT NƯỚC",
        "headline": "HUY ĐỘNG NGƯỜI NHÁI LẶN XỬ LÝ CỐNG TIÊU ÚNG",
        "sub": "Đội ngũ cứu hộ và công nhân thoát nước trực chiến 24/7 khơi thông dòng chảy",
        "ugc_credit": "Threads @hoangthatdiep23: \"Người nhái đeo bình dưỡng khí lặn giữa phố\""
    },
    {
        "video": UGC_DIR / "threads_video_09.mp4", # Khu Tân Tây Đô ngập sâu, xe điện lội nước
        "start_sec": 34.0,
        "end_sec": 46.0,
        "badge": "HOÀI ĐỨC • TÂN TÂY ĐÔ",
        "headline": "TRỜI NẮNG GẮT NHƯNG NƯỚC VẪN KHÔNG CHỊU RÚT",
        "sub": "Cư dân các toà chung cư di chuyển khó khăn, trạm sạc điện bị ngập úng",
        "ugc_credit": "Threads @nd.binh_4: \"Nắng vỡ đầu mà nước không chịu rút là sao nhể?\""
    },
    {
        "video": UGC_DIR / "threads_stream_vid_06.mp4", # Đường phố ngập xe ô tô ngập nước, người mặc áo mưa
        "start_sec": 46.0,
        "end_sec": 58.1,
        "badge": "DỰ BÁO THỜI TIẾT",
        "headline": "CẢNH BÁO ĐỢT MƯA MỚI, CHỦ ĐỘNG ỨNG PHÓ",
        "sub": "Các tỉnh miền núi phía Bắc và Tây Nguyên đề phòng sạt lở đất và ngập úng",
        "ugc_credit": "Nguồn: Dữ liệu mạng xã hội Threads & Trung tâm Dự báo KTTV Quốc gia"
    }
]

W, H = 1080, 1920
FPS = 25
TOTAL_DUR = 58.1
TOTAL_FRAMES = int(TOTAL_DUR * FPS)

# Precompute Gradients (Chỉ tính toán 1 lần duy nhất)
TOP_OVERLAY = Image.new("RGBA", (W, 280), (0, 0, 0, 0))
d_top = ImageDraw.Draw(TOP_OVERLAY)
for y in range(280):
    alpha = int(180 * (1 - y / 280))
    d_top.line([(0, y), (W, y)], fill=(0, 0, 0, alpha))

BOT_OVERLAY = Image.new("RGBA", (W, 550), (0, 0, 0, 0))
d_bot = ImageDraw.Draw(BOT_OVERLAY)
for y in range(550):
    alpha = int(230 * (y / 550)**1.2)
    d_bot.line([(0, y), (W, y)], fill=(0, 0, 0, alpha))

# Fonts
font_badge = ImageFont.truetype(FONT_PATH_BOLD, 30)
font_headline = ImageFont.truetype(FONT_PATH_BOLD, 38)
font_sub = ImageFont.truetype(FONT_PATH_REG, 28)
font_credit = ImageFont.truetype(FONT_PATH_REG, 24)
font_clock = ImageFont.truetype(FONT_PATH_BOLD, 26)

def make_frame_graphics(frame_bgr, seg, cur_time):
    """Vẽ hệ thống đồ họa tin tức truyền hình tốc độ cao"""
    img = Image.fromarray(cv2.cvtColor(frame_bgr, cv2.COLOR_BGR2RGB)).convert("RGBA")
    
    # Dán nhanh precomputed gradients
    img.paste(Image.alpha_composite(img.crop((0, 0, W, 280)), TOP_OVERLAY), (0, 0))
    img.paste(Image.alpha_composite(img.crop((0, H - 550, W, H)), BOT_OVERLAY), (0, H - 550))

    draw = ImageDraw.Draw(img, "RGBA")

    # 1. Header (Live Badge & VTV Digital style)
    draw.rounded_rectangle([40, 60, 320, 115], radius=8, fill=(220, 20, 30, 240))
    draw.text((55, 72), "TIN NÓNG 24H", fill=(255, 255, 255), font=font_badge)

    pulse = int(128 + 127 * np.sin(cur_time * 5))
    draw.ellipse([345, 80, 365, 100], fill=(255, 0, 0, pulse))
    draw.text((380, 75), "HIỆN TRƯỜNG THỰC TẾ", fill=(255, 255, 255, 230), font=font_clock)

    draw.rounded_rectangle([40, 130, 520, 175], radius=6, fill=(20, 24, 35, 200))
    draw.text((55, 138), f"📍 {seg['badge']}", fill=(255, 220, 80), font=font_clock)

    # 2. Lower-Third Bar
    card_y1 = H - 460
    card_y2 = H - 120
    draw.rounded_rectangle([35, card_y1, W - 35, card_y2], radius=16, fill=(15, 20, 30, 225), outline=(60, 75, 100, 180), width=2)
    draw.rounded_rectangle([35, card_y1, 48, card_y2], radius=4, fill=(230, 30, 40, 255))

    # Headline
    draw.text((65, card_y1 + 25), seg["headline"], fill=(255, 255, 255), font=font_headline)

    # Subtitle
    sub_text = seg["sub"]
    if len(sub_text) > 42:
        parts = [sub_text[:40], sub_text[40:].strip()]
        draw.text((65, card_y1 + 90), parts[0], fill=(220, 225, 235), font=font_sub)
        draw.text((65, card_y1 + 135), parts[1], fill=(220, 225, 235), font=font_sub)
    else:
        draw.text((65, card_y1 + 95), sub_text, fill=(220, 225, 235), font=font_sub)

    # UGC Attribution Tag
    draw.rounded_rectangle([60, card_y2 - 65, W - 60, card_y2 - 18], radius=8, fill=(35, 42, 58, 230))
    draw.text((75, card_y2 - 58), f"💬 {seg['ugc_credit']}", fill=(110, 210, 255), font=font_credit)

    # Ticker
    ticker_text = "✦ CẬP NHẬT 24/7: BẢN TIN THỜI SỰ DỮ LIỆU ĐA NGUỒN ANTIGRAVITY ✦ NGUỒN DỮ LIỆU: BÁO CHÍ CHÍNH THỐNG & CỘNG ĐỒNG THREADS VIỆT NAM ✦"
    draw.rectangle([0, H - 90, W, H], fill=(10, 14, 22, 245))
    offset_x = int((cur_time * 60) % 900)
    draw.text((40 - offset_x, H - 75), ticker_text + "    " + ticker_text, fill=(200, 210, 225), font=font_credit)

    return cv2.cvtColor(np.array(img.convert("RGB")), cv2.COLOR_RGB2BGR)

def resize_and_crop(frame):
    fh, fw = frame.shape[:2]
    scale = max(W / fw, H / fh)
    nw, nh = int(fw * scale), int(fh * scale)
    resized = cv2.resize(frame, (nw, nh), interpolation=cv2.INTER_LINEAR)
    x1 = (nw - W) // 2
    y1 = (nh - H) // 2
    return resized[y1:y1 + H, x1:x1 + W]

def compile_master_ugc_video():
    print("================================================================")
    print("🎬 KHỞI ĐỘNG CỖ MÁY BIÊN TẬP TIN TỨC VIDEO UGC THREADS SIÊU TỐC...")
    print("================================================================")
    
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
        "-preset", "ultrafast",
        "-crf", "22",
        "-pix_fmt", "yuv420p",
        "-c:a", "aac",
        "-b:a", "192k",
        "-shortest",
        str(OUTPUT_MP4)
    ]
    
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE)

    # Đọc tuần tự từng segment để đạt tốc độ cực đại (không seek liên tục)
    cur_frame_total = 0
    fallback_frame = np.full((H, W, 3), (30, 30, 35), dtype=np.uint8)

    for seg_idx, seg in enumerate(SEGMENTS):
        seg_dur = seg["end_sec"] - seg["start_sec"]
        seg_frames = int(seg_dur * FPS)
        vpath = seg["video"]
        print(f"[*] Phân cảnh #{seg_idx+1}: {seg['badge']} ({seg_dur:.1f}s, {seg_frames} frames)")
        
        cap = cv2.VideoCapture(str(vpath)) if vpath.exists() else None
        
        for f_i in range(seg_frames):
            cur_time = cur_frame_total / FPS
            frame_bgr = None
            
            if cap is not None:
                ret, frame = cap.read()
                if not ret or frame is None:
                    # Nếu hết clip, lặp lại từ đầu
                    cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
                    ret, frame = cap.read()
                if ret and frame is not None:
                    frame_bgr = resize_and_crop(frame)

            if frame_bgr is None:
                frame_bgr = fallback_frame

            final_frame = make_frame_graphics(frame_bgr, seg, cur_time)
            proc.stdin.write(final_frame.tobytes())
            cur_frame_total += 1

        if cap is not None:
            cap.release()

    proc.stdin.close()
    proc.wait()

    print("\n" + "="*70)
    print("🎉 HOÀN THÀNH BIÊN TẬP MASTER VIDEO TIN TỨC CHUẨN ĐỒ HOẠ TRUYỀN HÌNH!")
    print("="*70)
    print(f"  • Video Output: {OUTPUT_MP4}")
    print(f"  • Kích thước file: {OUTPUT_MP4.stat().st_size / (1024*1024):.2f} MB")

    # Đồng bộ sang Artifact directory
    import shutil
    shutil.copy2(OUTPUT_MP4, OUTPUT_ART)
    print(f"  • Đồng bộ sang Artifact: {OUTPUT_ART}")
    print("================================================================")

if __name__ == "__main__":
    compile_master_ugc_video()
