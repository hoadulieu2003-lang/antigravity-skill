import os
import sys
import cv2
import numpy as np
import subprocess
import time
import shutil
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

# ==============================================================================
# THREADS CONFESSION & DRAMA STORYTELLING — APPLE FROSTED GLASS EDITION
# Master Visual Engine ($design) — Contemporary Glassmorphism & Spring Motion
# ==============================================================================

CANVAS_WIDTH = 1080
CANVAS_HEIGHT = 1920
FPS = 25.0
TOTAL_DURATION = 60.69
TOTAL_FRAMES = int(TOTAL_DURATION * FPS) # 1517 frames

BASE_DIR = Path(r"C:\Users\game\.gemini")
WORKSPACE_DIR = BASE_DIR / "threads_harvest"
CARD_MOCKUP_PATH = BASE_DIR / "document" / "app" / "threads_card_mockup.png"
AUDIO_FILE = BASE_DIR / "config" / "sidecars" / "anti_live_voice" / "public" / "threads_story_charon.wav"
OUTPUT_VIDEO_PATH = BASE_DIR / "config" / "sidecars" / "anti_live_voice" / "public" / "threads_story_charon_pro.mp4"
BRAIN_COPY_PATH = BASE_DIR / "antigravity" / "brain" / "6f46af53-7f44-46a4-83e9-d518ccfc6f9f" / "threads_story_charon_pro.mp4"
STUDIO_PRO_PATH = Path(r"C:\Users\game\Documents\app\UGC_NEWS_STUDIO_PRO\threads_story_charon_pro.mp4")
TEMP_RAW_MP4 = WORKSPACE_DIR / "temp_apple_glass_raw.mp4"

def get_ffmpeg_exe():
    candidates = [
        r"C:\Users\game\cdp_reader\node_modules\ffmpeg-static\ffmpeg.exe",
        r"C:\Users\game\node_modules\ffmpeg-static\ffmpeg.exe",
        r"C:\Users\game\Documents\app\SCRIPT_FACTORY_PRO_ECOSYSTEM\03_CDP_BRIDGE_ORCHESTRATOR\node_modules\ffmpeg-static\ffmpeg.exe",
        r"C:\Users\game\.gemini\antigravity-ide\scratch\video-editor-app\bin\ffmpeg.exe",
        "ffmpeg"
    ]
    for c in candidates:
        if Path(c).exists():
            return str(c)
    return "ffmpeg"

STORY_TIMELINE = [
    {
        "start": 0.0, "end": 4.5,
        "is_hook": True,
        "card_tag": "BÀI HỌC CÔNG SỞ",
        "card_title": "SỰ THẬT VỀ 80% CHĂM CHỈ",
        "card_desc": "Tại sao càng cày cuốc chăm chỉ lại càng khó thăng tiến?",
        "prefix": "SỐC THẬT SỰ: ",
        "highlight": "80% SỰ CHĂM CHỈ",
        "suffix": " GẦN NHƯ LÀ VÔ NGHĨA",
        "accent": (225, 29, 72)
    },
    {
        "start": 4.5, "end": 9.0,
        "is_hook": False,
        "card_tag": "CUỘC GẶP GỠ",
        "card_title": "CÀ PHÊ VỚI SẾP LỚN",
        "card_desc": "Một buổi chiều ngồi nghe những lời phũ phàng nhất sự nghiệp",
        "prefix": "CHIỀU NAY: ",
        "highlight": "UỐNG CÀ PHÊ",
        "suffix": " VỚI MỘT SẾP LỚN TẬP ĐOÀN",
        "accent": (37, 99, 235)
    },
    {
        "start": 9.0, "end": 13.5,
        "is_hook": False,
        "card_tag": "LỜI THỨC TỈNH",
        "card_title": "CÂU NÓI PHŨ PHÀNG",
        "card_desc": "“Làm tốt việc được giao là lý do em mãi chỉ làm nhân viên!”",
        "prefix": "ANH ẤY NÓI: ",
        "highlight": "MỘT CÂU PHŨ PHÀNG",
        "suffix": " LÀM MÌNH TỈNH CẢ NGƯỜI",
        "accent": (217, 119, 6)
    },
    {
        "start": 13.5, "end": 19.5,
        "is_hook": False,
        "card_tag": "NGHỊCH LÝ CÔNG SỞ",
        "card_title": "VÌ SAO MÃI LÀ NHÂN VIÊN?",
        "card_desc": "Ngoan ngoãn, làm tốt việc chỉ là điều kiện cần tối thiểu",
        "prefix": "CHĂM CHỈ LÀM VIỆC: ",
        "highlight": "LÝ DO MÃI LÀM NHÂN VIÊN",
        "suffix": " KHÔNG THỂ LÊN SẾP",
        "accent": (79, 70, 229)
    },
    {
        "start": 19.5, "end": 25.5,
        "is_hook": False,
        "card_tag": "BẬT LÊN QUẢN LÝ",
        "card_title": "MUỐN TĂNG LƯƠNG GẤP ĐÔI?",
        "card_desc": "Cái người ta nhìn vào để thăng chức là một thứ hoàn toàn khác",
        "prefix": "MUỐN TĂNG LƯƠNG GẤP ĐÔI: ",
        "highlight": "NGƯỜI TA NHÌN VÀO",
        "suffix": " THỨ HOÀN TOÀN KHÁC",
        "accent": (13, 148, 136)
    },
    {
        "start": 25.5, "end": 31.0,
        "is_hook": False,
        "card_tag": "BẬT MÍ QUY TẮC",
        "card_title": "3 QUY LUẬT NGẦM NƠI CÔNG SỞ",
        "card_desc": "Những bài học không một trường đại học nào giảng dạy",
        "prefix": "LÚC ĐẦU BẤT MÃN: ",
        "highlight": "NGHE 3 QUY LUẬT NGẦM",
        "suffix": " THÌ MỚI NGÃ NGỬA",
        "accent": (225, 29, 72)
    },
    {
        "start": 31.0, "end": 38.5,
        "is_hook": False,
        "card_tag": "QUY LUẬT #01",
        "card_title": "CÁI BẪY 'VỊ TRÍ CÀY VIỆC'",
        "card_desc": "Sếp không thể thăng chức cho bạn vì không ai thay thế được bạn cày việc!",
        "prefix": "QUY LUẬT 1: ",
        "highlight": "NGƯỜI LÀM TỐT NHẤT",
        "suffix": " KHÔNG ĐƯỢC THĂNG CHỨC",
        "accent": (220, 38, 38)
    },
    {
        "start": 38.5, "end": 45.5,
        "is_hook": False,
        "card_tag": "QUY LUẬT #02",
        "card_title": "SỰ HIỆN DIỆN (VISIBILITY)",
        "card_desc": "Hiện diện quan trọng gấp 3 lần âm thầm. Làm 10 mà không ai biết = 0!",
        "prefix": "QUY LUẬT 2: ",
        "highlight": "SỰ HIỆN DIỆN",
        "suffix": " QUAN TRỌNG HƠN CẢ NỖ LỰC",
        "accent": (37, 99, 235)
    },
    {
        "start": 45.5, "end": 54.0,
        "is_hook": False,
        "card_tag": "QUY LUẬT #03",
        "card_title": "HÃY LÀM 'CÁI KHIÊN' CỦA SẾP",
        "card_desc": "Giải quyết nỗi đau đầu của sếp trực tiếp, sếp mới an tâm kéo bạn lên!",
        "prefix": "QUY LUẬT 3: ",
        "highlight": "GIẢI QUYẾT ĐAU ĐẦU CỦA SẾP",
        "suffix": " SẾP MỚI KÉO BẠN LÊN",
        "accent": (5, 150, 105)
    },
    {
        "start": 54.0, "end": 60.69,
        "is_hook": False,
        "card_tag": "TỔNG KẾT BÀI HỌC",
        "card_title": "BẠN THẤY CÓ ĐÚNG KHÔNG?",
        "card_desc": "Để lại bình luận chia sẻ góc nhìn thực tế của bạn bên dưới!",
        "prefix": "NGẪM LẠI: ",
        "highlight": "THẤM THÍA THẬT SỰ",
        "suffix": " BẠN THẤY CÓ ĐÚNG KHÔNG?",
        "accent": (79, 70, 229)
    }
]

def load_fonts():
    try:
        f_top = ImageFont.truetype("segoeuib.ttf", 26)
        f_mid_tag = ImageFont.truetype("segoeuib.ttf", 24)
        f_mid_title = ImageFont.truetype("segoeuib.ttf", 36)
        f_mid_desc = ImageFont.truetype("segoeui.ttf", 28)
        f_kinetic = ImageFont.truetype("segoeuib.ttf", 44)
        f_footer = ImageFont.truetype("segoeuib.ttf", 22)
    except Exception:
        try:
            f_top = ImageFont.truetype("arialbd.ttf", 26)
            f_mid_tag = ImageFont.truetype("arialbd.ttf", 24)
            f_mid_title = ImageFont.truetype("arialbd.ttf", 36)
            f_mid_desc = ImageFont.truetype("arial.ttf", 28)
            f_kinetic = ImageFont.truetype("arialbd.ttf", 44)
            f_footer = ImageFont.truetype("arialbd.ttf", 22)
        except Exception:
            f_top = ImageFont.load_default()
            f_mid_tag = f_top
            f_mid_title = f_top
            f_mid_desc = f_top
            f_kinetic = f_top
            f_footer = f_top
    return f_top, f_mid_tag, f_mid_title, f_mid_desc, f_kinetic, f_footer

def format_frame(frame, width=CANVAS_WIDTH, height=CANVAS_HEIGHT):
    fh, fw = frame.shape[:2]
    scale = max(width / fw, height / fh)
    nw, nh = int(fw * scale), int(fh * scale)
    resized = cv2.resize(frame, (nw, nh), interpolation=cv2.INTER_LINEAR)
    x_off = (nw - width) // 2
    y_off = (nh - height) // 2
    return resized[y_off:y_off + height, x_off:x_off + width]

def apply_optical_frosted_glass(canvas, box, radius, fill_color=(255, 255, 255), fill_opacity=0.88, blur_ksize=45):
    """
    Renders genuine optical Apple Glassmorphism:
    Extracts background behind the box, applies heavy Gaussian blur, blends with milky glass tint,
    and applies rounded mask with crisp specular border reflection.
    """
    x1, y1 = max(0, box[0][0]), max(0, box[0][1])
    x2, y2 = min(CANVAS_WIDTH, box[1][0]), min(CANVAS_HEIGHT, box[1][1])
    w, h = x2 - x1, y2 - y1
    if w <= 0 or h <= 0:
        return canvas

    crop = canvas[y1:y2, x1:x2].copy()
    k = blur_ksize if blur_ksize % 2 == 1 else blur_ksize + 1
    blurred = cv2.GaussianBlur(crop, (k, k), 0)
    tint = np.full_like(crop, fill_color, dtype=np.uint8)
    glass_crop = cv2.addWeighted(blurred, 1.0 - fill_opacity, tint, fill_opacity, 0)

    # Rounded mask with smooth antialiasing
    mask_img = Image.new("L", (w, h), 0)
    mask_draw = ImageDraw.Draw(mask_img)
    mask_draw.rounded_rectangle([(0, 0), (w, h)], radius=radius, fill=255)
    mask_np = np.array(mask_img, dtype=np.float32) / 255.0
    mask_3d = np.dstack([mask_np, mask_np, mask_np])

    canvas[y1:y2, x1:x2] = (glass_crop * mask_3d + crop * (1.0 - mask_3d)).astype(np.uint8)
    return canvas

def render_apple_glass_video():
    print("[*] Khởi động Cỗ máy Dựng Video Apple Frosted Glass Edition ($design Master)...")
    print(f"[*] Tổng thời lượng: {TOTAL_DURATION}s | Tổng frames: {TOTAL_FRAMES} frames @ 25 FPS")

    card_pil = Image.open(str(CARD_MOCKUP_PATH)).convert("RGBA")
    f_top, f_mid_tag, f_mid_title, f_mid_desc, f_kinetic, f_footer = load_fonts()

    bg_video_path = WORKSPACE_DIR / "threads_video_05.mp4"
    if not bg_video_path.exists():
        bg_video_path = WORKSPACE_DIR / "threads_stream_vid_02.mp4"
    cap = cv2.VideoCapture(str(bg_video_path))

    fourcc = cv2.VideoWriter_fourcc(*"mp4v")
    writer = cv2.VideoWriter(str(TEMP_RAW_MP4), fourcc, FPS, (CANVAS_WIDTH, CANVAS_HEIGHT))

    current_phase_idx = 0
    t0 = time.time()

    for frame_idx in range(TOTAL_FRAMES):
        sec = frame_idx / FPS

        while current_phase_idx < len(STORY_TIMELINE) - 1 and sec >= STORY_TIMELINE[current_phase_idx]["end"]:
            current_phase_idx += 1
        
        phase = STORY_TIMELINE[current_phase_idx]

        ret, frame = cap.read()
        if not ret or frame is None:
            cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
            ret, frame = cap.read()
            if not ret or frame is None:
                frame = np.zeros((CANVAS_HEIGHT, CANVAS_WIDTH, 3), dtype=np.uint8)

        # 1. Base 1080x1920 Frame
        raw_canvas = format_frame(frame)

        # 2. Light Atmospheric Frosted Backdrop (100% Light Theme Invariant)
        # Apply dreamy soft blur to B-roll
        blurred_bg = cv2.GaussianBlur(raw_canvas, (31, 31), 0)
        # Blend with elegant warm light wash (cream/sky airy tone)
        light_wash = np.full_like(raw_canvas, (244, 247, 252), dtype=np.uint8)
        canvas = cv2.addWeighted(blurred_bg, 0.45, light_wash, 0.55, 0)

        # 3. Dynamic Card Coordinates (Spring Interpolation between 3.8s and 4.6s)
        if sec < 3.8:
            # Center Hook
            progress = min(1.0, sec / 3.8)
            card_scale = 0.98 + 0.03 * progress
            card_y = 520
        elif sec < 4.6:
            # Smooth Spring Ease-Out Glide from Center to Top Anchor
            t = (sec - 3.8) / 0.8
            ease = 1.0 - pow(1.0 - t, 3) # Cubic ease-out
            card_scale = 1.01 - (1.01 - 0.74) * ease
            card_y = int(520 - (520 - 120) * ease)
        else:
            # Anchored Top Position
            card_scale = 0.74
            card_y = 120

        # 4. Render Apple Frosted Glass Elements on Canvas (OpenCV Optical Glass)
        
        # A. Top Capsule Glass
        top_capsule_box = [(180, 38), (900, 92)]
        apply_optical_frosted_glass(canvas, top_capsule_box, radius=26, fill_color=(255, 255, 255), fill_opacity=0.92, blur_ksize=25)

        # B. Middle Insight Rule Card (Active after transition begins)
        if sec >= 4.0:
            fade_in = min(1.0, (sec - 4.0) / 0.6)
            mid_box = [(65, 700), (CANVAS_WIDTH - 65, 1260)]
            apply_optical_frosted_glass(canvas, mid_box, radius=32, fill_color=(255, 255, 255), fill_opacity=0.94, blur_ksize=45)

        # C. Kinetic Subtitle Container (Apple Dark Frosted Glass for Maximum Contrast)
        sub_box = [(50, 1370), (CANVAS_WIDTH - 50, 1570)]
        apply_optical_frosted_glass(canvas, sub_box, radius=26, fill_color=(15, 23, 42), fill_opacity=0.88, blur_ksize=35)

        # Convert to PIL for crisp typography and alpha card compositing
        pil_img = Image.fromarray(cv2.cvtColor(canvas, cv2.COLOR_BGR2RGB))
        draw = ImageDraw.Draw(pil_img)

        # 5. Draw Borders & Reflections (Apple Specular Highlights)
        # Top Capsule Specular Rim
        draw.rounded_rectangle(top_capsule_box, radius=26, outline=(255, 255, 255), width=2)
        # Pulsing Amber Live Dot
        draw.ellipse([(205, 54), (223, 72)], fill=(245, 158, 11))
        draw.text((238, 51), "THREADS CONFESSION • BÀI HỌC CÔNG SỞ", font=f_top, fill=(15, 23, 42))

        # 6. Composite Threads Card Mockup
        cw, ch = int(card_pil.width * card_scale), int(card_pil.height * card_scale)
        card_scaled = card_pil.resize((cw, ch), Image.Resampling.LANCZOS)
        card_x = (CANVAS_WIDTH - cw) // 2
        pil_img.paste(card_scaled, (card_x, card_y), card_scaled)

        # 7. Render Middle Insight Card Details (if sec >= 4.0)
        if sec >= 4.0:
            # Specular Rim
            draw.rounded_rectangle(mid_box, radius=32, outline=(255, 255, 255), width=2)

            accent_color = phase.get("accent", (220, 38, 38))
            # Left Inset Accent Pill
            draw.rounded_rectangle([(84, 730), (96, 1230)], radius=6, fill=accent_color)

            # Category Tag Badge (Frosted Capsule)
            draw.rounded_rectangle([(125, 740), (415, 792)], radius=18, fill=(241, 245, 249))
            draw.text((145, 752), phase["card_tag"].upper(), font=f_mid_tag, fill=accent_color)

            # Main Title (36px Bold)
            draw.text((125, 825), phase["card_title"], font=f_mid_title, fill=(15, 23, 42))

            # Hairline Divider
            draw.line([(125, 905), (CANVAS_WIDTH - 125, 905)], fill=(226, 232, 240), width=2)

            # Description Paragraph (Auto-wrap)
            desc_text = phase["card_desc"]
            if len(desc_text) > 40 and "\n" not in desc_text:
                mid_pt = len(desc_text) // 2
                split_idx = desc_text.rfind(" ", 0, mid_pt + 8)
                if split_idx != -1:
                    d_line1 = desc_text[:split_idx]
                    d_line2 = desc_text[split_idx+1:]
                    draw.text((125, 935), d_line1, font=f_mid_desc, fill=(51, 65, 85))
                    draw.text((125, 980), d_line2, font=f_mid_desc, fill=(51, 65, 85))
                else:
                    draw.text((125, 950), desc_text, font=f_mid_desc, fill=(51, 65, 85))
            else:
                draw.text((125, 950), desc_text, font=f_mid_desc, fill=(51, 65, 85))

            # Insight Tip Pill (Inner Glass)
            draw.rounded_rectangle([(125, 1080), (CANVAS_WIDTH - 125, 1165)], radius=20, fill=(248, 250, 252), outline=(226, 232, 240), width=1)
            draw.text((155, 1105), "★ Góc nhìn thực tế từ các quản lý cấp cao", font=f_mid_desc, fill=(71, 85, 105))

        # 8. Kinetic Subtitles Details
        draw.rounded_rectangle(sub_box, radius=26, outline=(255, 255, 255, 180), width=2)
        # Line 1: Prefix + Highlight
        line1_x = 80
        draw.text((line1_x, 1400), phase["prefix"], font=f_kinetic, fill=(255, 255, 255))
        w_pref = draw.textlength(phase["prefix"], font=f_kinetic)
        draw.text((line1_x + w_pref, 1400), phase["highlight"], font=f_kinetic, fill=(250, 204, 21)) # Yellow highlight

        # Line 2: Suffix
        draw.text((line1_x, 1475), phase["suffix"].strip(), font=f_kinetic, fill=(241, 245, 249))

        # 9. Bottom Progress Bar & Footer
        # Frosted footer background
        draw.rectangle([(0, 1835), (CANVAS_WIDTH, 1920)], fill=(248, 250, 252))
        draw.line([(0, 1835), (CANVAS_WIDTH, 1835)], fill=(226, 232, 240), width=1)

        # Progress Track
        draw.rectangle([(60, 1890), (CANVAS_WIDTH - 60, 1902)], fill=(226, 232, 240))
        progress_w = int((sec / TOTAL_DURATION) * (CANVAS_WIDTH - 120))
        if progress_w > 12:
            draw.rounded_rectangle([(60, 1890), (60 + progress_w, 1902)], radius=6, fill=(37, 99, 235))
        elif progress_w > 0:
            draw.rectangle([(60, 1890), (60 + progress_w, 1902)], fill=(37, 99, 235))

        # Footer CTA Text
        draw.text((65, 1850), "► BÌNH LUẬN GÓC NHÌN CỦA BẠN BÊN DƯỚI", font=f_footer, fill=(71, 85, 105))
        draw.text((CANVAS_WIDTH - 380, 1850), "FOLLOW @THREADS_STORY", font=f_footer, fill=(37, 99, 235))

        final_frame = cv2.cvtColor(np.array(pil_img), cv2.COLOR_RGB2BGR)
        writer.write(final_frame)

        if frame_idx % 250 == 0:
            print(f"[*] Đang render Apple Glass: {frame_idx}/{TOTAL_FRAMES} frames ({sec:.1f}s)...")

    cap.release()
    writer.release()
    render_dur = time.time() - t0
    fps_actual = TOTAL_FRAMES / render_dur
    print(f"[+] Hoàn tất Pha 1 (OpenCV Glassmorphism)! Thời gian: {render_dur:.1f}s ({fps_actual:.1f} FPS)")

    # Phase 2: FFmpeg Muxing
    print("[*] Khởi động Pha 2: FFmpeg Muxing luồng âm thanh Charon...")
    ffmpeg_bin = get_ffmpeg_exe()
    cmd = [
        ffmpeg_bin, "-y",
        "-i", str(TEMP_RAW_MP4),
        "-i", str(AUDIO_FILE),
        "-c:v", "libx264",
        "-preset", "veryfast",
        "-crf", "19",
        "-pix_fmt", "yuv420p",
        "-movflags", "+faststart",
        "-c:a", "aac",
        "-b:a", "192k",
        "-shortest",
        str(OUTPUT_VIDEO_PATH)
    ]
    subprocess.run(cmd, check=True)

    # Copy to Brain & Studio Pro
    shutil.copy2(str(OUTPUT_VIDEO_PATH), str(BRAIN_COPY_PATH))
    STUDIO_PRO_PATH.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(str(OUTPUT_VIDEO_PATH), str(STUDIO_PRO_PATH))
    print(f"[+] Thành phẩm Apple Glass Edition xuất sắc! Đã lưu tại:\n    -> {OUTPUT_VIDEO_PATH}\n    -> {BRAIN_COPY_PATH}\n    -> {STUDIO_PRO_PATH}")

    if TEMP_RAW_MP4.exists():
        TEMP_RAW_MP4.unlink()

if __name__ == "__main__":
    render_apple_glass_video()
