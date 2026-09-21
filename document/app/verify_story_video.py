import os
import sys
import cv2
import numpy as np
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

BASE_DIR = Path(r"C:\Users\game\.gemini")
VIDEO_PATH = BASE_DIR / "config" / "sidecars" / "anti_live_voice" / "public" / "threads_story_charon_pro.mp4"
BRAIN_DIR = BASE_DIR / "antigravity" / "brain" / "6f46af53-7f44-46a4-83e9-d518ccfc6f9f"

VERIFY_TIMESTAMPS = [
    {"sec": 2.0, "name": "snap_story_01_hook_card.jpg", "label": "HOOK (02s): THẺ THREADS TRUNG TÂM"},
    {"sec": 4.2, "name": "snap_story_02_spring_glide.jpg", "label": "SPRING GLIDE (4.2s): NỘI SUY TRƯỢT LÊN ĐỈNH"},
    {"sec": 34.0, "name": "snap_story_03_rule01_trap.jpg", "label": "QUY LUẬT 01 (34s): KÍNH MỜ APPLE GLASS"},
    {"sec": 50.0, "name": "snap_story_04_rule03_shield.jpg", "label": "QUY LUẬT 03 (50s): LÀM CÁI KHIÊN CỦA SẾP"}
]

def extract_and_verify():
    if not VIDEO_PATH.exists():
        print(f"[-] Video chưa tồn tại: {VIDEO_PATH}")
        return False

    cap = cv2.VideoCapture(str(VIDEO_PATH))
    fps = cap.get(cv2.CAP_PROP_FPS) or 25.0
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    print(f"[*] Đang kiểm toán video: {VIDEO_PATH.name} ({total_frames} frames, {fps} FPS)...")

    extracted_images = []
    for item in VERIFY_TIMESTAMPS:
        target_frame = int(item["sec"] * fps)
        cap.set(cv2.CAP_PROP_POS_FRAMES, min(target_frame, total_frames - 1))
        ret, frame = cap.read()
        if ret and frame is not None:
            out_path = BRAIN_DIR / item["name"]
            cv2.imwrite(str(out_path), frame, [cv2.IMWRITE_JPEG_QUALITY, 95])
            print(f"[+] Đã trích xuất khung hình {item['sec']}s -> {out_path.name}")
            extracted_images.append((out_path, item["label"]))
        else:
            print(f"[-] Không thể đọc frame tại {item['sec']}s")

    cap.release()

    # Create 2x2 Collage Grid for Easy Visual Review
    if len(extracted_images) == 4:
        grid_w, grid_h = 1080, 1920
        thumb_w, thumb_h = 540, 960
        collage = Image.new("RGB", (grid_w, grid_h), (15, 23, 42))
        draw = ImageDraw.Draw(collage)
        try:
            font_title = ImageFont.truetype("arialbd.ttf", 22)
        except Exception:
            font_title = ImageFont.load_default()

        positions = [(0, 0), (thumb_w, 0), (0, thumb_h), (thumb_w, thumb_h)]
        for idx, (img_path, label) in enumerate(extracted_images):
            img = Image.open(str(img_path))
            thumb = img.resize((thumb_w, thumb_h), Image.Resampling.LANCZOS)
            x, y = positions[idx]
            collage.paste(thumb, (x, y))
            
            # Label banner
            draw.rectangle([(x, y + thumb_h - 60), (x + thumb_w, y + thumb_h)], fill=(15, 23, 42))
            draw.text((x + 15, y + thumb_h - 45), label, font=font_title, fill=(250, 204, 21))

        collage_path = BRAIN_DIR / "threads_story_4grid_audit.jpg"
        collage.save(str(collage_path), quality=95)
        print(f"[+] Đã tạo ảnh kiểm toán tổng hợp 4-Grid: {collage_path.name}")
        return True
    return False

if __name__ == "__main__":
    extract_and_verify()
