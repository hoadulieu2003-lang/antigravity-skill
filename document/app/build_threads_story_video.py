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
# THREADS CONFESSION & DRAMA STORYTELLING COMPOSITOR (FORMAT 1)
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
TEMP_RAW_MP4 = WORKSPACE_DIR / "temp_threads_story_raw.mp4"

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

# Timeline of Subtitles & Mid-Card Stages (10 micro-phases)
STORY_TIMELINE = [
    {
        "start": 0.0, "end": 4.5,
        "is_hook": True, # Full center card pop-in
        "card_tag": "BÀI HỌC CÔNG SỞ",
        "card_title": "SỰ THẬT VỀ 80% CHĂM CHỈ",
        "card_desc": "Tại sao càng cày cuốc chăm chỉ lại càng khó thăng tiến?",
        "prefix": "SỐC THẬT SỰ: ",
        "highlight": "80% SỰ CHĂM CHỈ",
        "suffix": " GẦN NHƯ LÀ VÔ NGHĨA"
    },
    {
        "start": 4.5, "end": 9.0,
        "is_hook": False,
        "card_tag": "CUỘC GẶP GỠ",
        "card_title": "CÀ PHÊ VỚI SẾP LỚN",
        "card_desc": "Một buổi chiều ngồi nghe những lời phũ phàng nhất sự nghiệp",
        "prefix": "CHIỀU NAY: ",
        "highlight": "UỐNG CÀ PHÊ",
        "suffix": " VỚI MỘT SẾP LỚN TẬP ĐOÀN"
    },
    {
        "start": 9.0, "end": 13.5,
        "is_hook": False,
        "card_tag": "LỜI THỨC TỈNH",
        "card_title": "CÂU NÓI PHŨ PHÀNG",
        "card_desc": "“Làm tốt việc được giao là lý do em mãi chỉ làm nhân viên!”",
        "prefix": "ANH ẤY NÓI: ",
        "highlight": "MỘT CÂU PHŨ PHÀNG",
        "suffix": " LÀM MÌNH TỈNH CẢ NGƯỜI"
    },
    {
        "start": 13.5, "end": 19.5,
        "is_hook": False,
        "card_tag": "NGHỊCH LÝ CÔNG SỞ",
        "card_title": "VÌ SAO MÃI LÀ NHÂN VIÊN?",
        "card_desc": "Ngoan ngoãn, làm tốt việc chỉ là điều kiện cần tối thiểu",
        "prefix": "CHĂM CHỈ LÀM VIỆC: ",
        "highlight": "LÝ DO MÃI LÀM NHÂN VIÊN",
        "suffix": " KHÔNG THỂ LÊN SẾP"
    },
    {
        "start": 19.5, "end": 25.5,
        "is_hook": False,
        "card_tag": "BẬT LÊN QUẢN LÝ",
        "card_title": "MUỐN TĂNG LƯƠNG GẤP ĐÔI?",
        "card_desc": "Cái người ta nhìn vào để thăng chức là một thứ hoàn toàn khác",
        "prefix": "MUỐN TĂNG LƯƠNG GẤP ĐÔI: ",
        "highlight": "NGƯỜI TA NHÌN VÀO",
        "suffix": " THỨ HOÀN TOÀN KHÁC"
    },
    {
        "start": 25.5, "end": 31.0,
        "is_hook": False,
        "card_tag": "BẬT MÍ QUY TẮC",
        "card_title": "3 QUY LUẬT NGẦM NƠI CÔNG SỞ",
        "card_desc": "Những bài học không một trường đại học nào giảng dạy",
        "prefix": "LÚC ĐẦU BẤT MÃN: ",
        "highlight": "NGHE 3 QUY LUẬT NGẦM",
        "suffix": " THÌ MỚI NGÃ NGỬA"
    },
    {
        "start": 31.0, "end": 38.5,
        "is_hook": False,
        "card_tag": "QUY LUẬT #01",
        "card_title": "CÁI BẪY 'VỊ TRÍ CÀY VIỆC'",
        "card_desc": "Sếp không thể thăng chức cho bạn vì không ai thay thế được bạn cày việc!",
        "prefix": "QUY LUẬT 1: ",
        "highlight": "NGƯỜI LÀM TỐT NHẤT",
        "suffix": " KHÔNG ĐƯỢC THĂNG CHỨC"
    },
    {
        "start": 38.5, "end": 45.5,
        "is_hook": False,
        "card_tag": "QUY LUẬT #02",
        "card_title": "SỰ HIỆN DIỆN (VISIBILITY)",
        "card_desc": "Hiện diện quan trọng gấp 3 lần âm thầm. Làm 10 mà không ai biết = 0!",
        "prefix": "QUY LUẬT 2: ",
        "highlight": "SỰ HIỆN DIỆN",
        "suffix": " QUAN TRỌNG HƠN CẢ NỖ LỰC"
    },
    {
        "start": 45.5, "end": 54.0,
        "is_hook": False,
        "card_tag": "QUY LUẬT #03",
        "card_title": "HÃY LÀM 'CÁI KHIÊN' CỦA SẾP",
        "card_desc": "Giải quyết nỗi đau đầu của sếp trực tiếp, sếp mới an tâm kéo bạn lên!",
        "prefix": "QUY LUẬT 3: ",
        "highlight": "GIẢI QUYẾT ĐAU ĐẦU CỦA SẾP",
        "suffix": " SẾP MỚI KÉO BẠN LÊN"
    },
    {
        "start": 54.0, "end": 60.69,
        "is_hook": False,
        "card_tag": "TỔNG KẾT BÀI HỌC",
        "card_title": "BẠN THẤY CÓ ĐÚNG KHÔNG?",
        "card_desc": "Để lại bình luận chia sẻ góc nhìn thực tế của bạn bên dưới!",
        "prefix": "NGẪM LẠI: ",
        "highlight": "THẤM THÍA THẬT SỰ",
        "suffix": " BẠN THẤY CÓ ĐÚNG KHÔNG?"
    }
]

def load_fonts():
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

def render_story_video():
    print("[*] Khởi động Cỗ máy Dựng Video Threads Confession & Drama Storytelling (Format 1)...")
    print(f"[*] Tổng thời lượng: {TOTAL_DURATION}s | Tổng frames: {TOTAL_FRAMES} frames @ 25 FPS")

    # Load Threads Card Mockup
    card_pil = Image.open(str(CARD_MOCKUP_PATH)).convert("RGBA")
    f_top, f_mid_tag, f_mid_title, f_mid_desc, f_kinetic, f_footer = load_fonts()

    # Load B-roll background video
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

        # Update current phase
        while current_phase_idx < len(STORY_TIMELINE) - 1 and sec >= STORY_TIMELINE[current_phase_idx]["end"]:
            current_phase_idx += 1
        
        phase = STORY_TIMELINE[current_phase_idx]

        # Read B-roll frame
        ret, frame = cap.read()
        if not ret or frame is None:
            cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
            ret, frame = cap.read()
            if not ret or frame is None:
                frame = np.zeros((CANVAS_HEIGHT, CANVAS_WIDTH, 3), dtype=np.uint8)

        # 1. Base 1080x1920 Frame
        canvas = format_frame(frame)

        # 2. Dark Atmospheric Glass Overlay
        overlay = canvas.copy()
        # Top gradient (lighter for Threads Card)
        cv2.rectangle(overlay, (0, 0), (CANVAS_WIDTH, 500), (20, 28, 45), -1)
        # Mid & Lower (deeper for Subtitles & Contrast)
        cv2.rectangle(overlay, (0, 500), (CANVAS_WIDTH, CANVAS_HEIGHT), (15, 23, 42), -1)
        # Blend overlay (72% dark overlay + 28% atmospheric video)
        cv2.addWeighted(overlay, 0.76, canvas, 0.24, 0, canvas)

        # Convert to PIL for precision typography and alpha-channel compositing
        pil_img = Image.fromarray(cv2.cvtColor(canvas, cv2.COLOR_BGR2RGB))
        draw = ImageDraw.Draw(pil_img)

        # 3. Top Header Capsule (Wider for clean padding)
        capsule_box = [(170, 38), (910, 92)]
        draw.rounded_rectangle(capsule_box, radius=26, fill=(255, 255, 255), outline=(226, 232, 240), width=1)
        # Amber icon
        draw.ellipse([(195, 54), (213, 72)], fill=(245, 158, 11))
        draw.text((228, 52), "THREADS CONFESSION • BÀI HỌC CÔNG SỞ", font=f_top, fill=(15, 23, 42))

        # 4. Threads Card Mockup (Animated Hook -> Anchored Header)
        if sec < 4.5:
            # Phase 1: Center Hook Pop-in (Scale 0.98 -> 1.02)
            progress = sec / 4.5
            scale = 0.98 + 0.04 * progress
            cw, ch = int(card_pil.width * scale), int(card_pil.height * scale)
            card_scaled = card_pil.resize((cw, ch), Image.Resampling.LANCZOS)
            card_x = (CANVAS_WIDTH - cw) // 2
            card_y = 540
            pil_img.paste(card_scaled, (card_x, card_y), card_scaled)
        else:
            # Phase 2: Anchored Top Mini-Card (Scale 0.74, Y: 120)
            cw, ch = int(card_pil.width * 0.74), int(card_pil.height * 0.74)
            card_scaled = card_pil.resize((cw, ch), Image.Resampling.LANCZOS)
            card_x = (CANVAS_WIDTH - cw) // 2
            card_y = 125
            pil_img.paste(card_scaled, (card_x, card_y), card_scaled)

            # 5. Middle Insight / Rule Card (Y: 720 to 1240)
            mid_box = [(60, 720), (CANVAS_WIDTH - 60, 1220)]
            draw.rounded_rectangle(mid_box, radius=28, fill=(255, 255, 255), outline=(226, 232, 240), width=2)
            
            # Left accent bar (neatly inset inside card)
            accent_color = (220, 38, 38) if "QUY LUẬT" in phase["card_tag"] else (37, 99, 235)
            draw.rounded_rectangle([(78, 746), (90, 1194)], radius=5, fill=accent_color)

            # Category Tag Badge
            draw.rounded_rectangle([(120, 760), (405, 810)], radius=16, fill=(241, 245, 249))
            draw.text((140, 772), phase["card_tag"].upper(), font=f_mid_tag, fill=accent_color)

            # Main Title
            draw.text((120, 840), phase["card_title"], font=f_mid_title, fill=(15, 23, 42))

            # Separator
            draw.line([(120, 915), (CANVAS_WIDTH - 120, 915)], fill=(241, 245, 249), width=2)

            # Description Paragraph (Multi-line text handling)
            desc_text = phase["card_desc"]
            if len(desc_text) > 42 and "\n" not in desc_text:
                mid_pt = len(desc_text) // 2
                split_idx = desc_text.rfind(" ", 0, mid_pt + 8)
                if split_idx != -1:
                    d_line1 = desc_text[:split_idx]
                    d_line2 = desc_text[split_idx+1:]
                    draw.text((120, 945), d_line1, font=f_mid_desc, fill=(51, 65, 85))
                    draw.text((120, 990), d_line2, font=f_mid_desc, fill=(51, 65, 85))
                else:
                    draw.text((120, 960), desc_text, font=f_mid_desc, fill=(51, 65, 85))
            else:
                draw.text((120, 960), desc_text, font=f_mid_desc, fill=(51, 65, 85))

            # Insight Tip Pill
            draw.rounded_rectangle([(120, 1075), (CANVAS_WIDTH - 120, 1155)], radius=18, fill=(248, 250, 252), outline=(226, 232, 240), width=1)
            draw.text((145, 1100), "★ Góc nhìn thực tế từ các quản lý cấp cao", font=f_mid_desc, fill=(71, 85, 105))

        # 6. Kinetic Subtitles Container (Y: 1380 to 1580)
        sub_box = [(50, 1380), (CANVAS_WIDTH - 50, 1560)]
        draw.rounded_rectangle(sub_box, radius=24, fill=(15, 23, 42), outline=(255, 255, 255), width=2)

        # Draw 3-part kinetic subtitle
        # Line 1: Prefix + Highlight
        line1_x = 80
        draw.text((line1_x, 1410), phase["prefix"], font=f_kinetic, fill=(255, 255, 255))
        w_pref = draw.textlength(phase["prefix"], font=f_kinetic)
        draw.text((line1_x + w_pref, 1410), phase["highlight"], font=f_kinetic, fill=(250, 204, 21)) # Yellow highlight

        # Line 2: Suffix
        draw.text((line1_x, 1480), phase["suffix"].strip(), font=f_kinetic, fill=(241, 245, 249))

        # 7. Bottom Progress Bar & Footer (Y: 1840 to 1920)
        # Progress track
        draw.rectangle([(0, 1890), (CANVAS_WIDTH, 1905)], fill=(30, 41, 59))
        progress_w = int((sec / TOTAL_DURATION) * CANVAS_WIDTH)
        draw.rectangle([(0, 1890), (progress_w, 1905)], fill=(37, 99, 235))

        # Footer CTA Text
        draw.text((70, 1845), "► BÌNH LUẬN GÓC NHÌN CỦA BẠN BÊN DƯỚI", font=f_footer, fill=(203, 213, 225))
        draw.text((CANVAS_WIDTH - 380, 1845), "FOLLOW @THREADS_STORY", font=f_footer, fill=(250, 204, 21))

        # Write final frame
        final_frame = cv2.cvtColor(np.array(pil_img), cv2.COLOR_RGB2BGR)
        writer.write(final_frame)

        if frame_idx % 250 == 0:
            print(f"[*] Đang render: {frame_idx}/{TOTAL_FRAMES} frames ({sec:.1f}s)...")

    cap.release()
    writer.release()
    render_dur = time.time() - t0
    fps_actual = TOTAL_FRAMES / render_dur
    print(f"[+] Hoàn tất Pha 1 (OpenCV VideoWriter)! Thời gian: {render_dur:.1f}s ({fps_actual:.1f} FPS)")

    # Phase 2: FFmpeg Muxing with Gemini TTS Charon Voice
    print("[*] Khởi động Pha 2: FFmpeg Muxing luồng âm thanh Charon...")
    ffmpeg_bin = get_ffmpeg_exe()
    cmd = [
        ffmpeg_bin, "-y",
        "-i", str(TEMP_RAW_MP4),
        "-i", str(AUDIO_FILE),
        "-c:v", "libx264",
        "-preset", "veryfast",
        "-crf", "20",
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
    print(f"[+] Thành phẩm xuất sắc! Đã lưu tại:\n    -> {OUTPUT_VIDEO_PATH}\n    -> {BRAIN_COPY_PATH}\n    -> {STUDIO_PRO_PATH}")

    # Cleanup temp
    if TEMP_RAW_MP4.exists():
        TEMP_RAW_MP4.unlink()

if __name__ == "__main__":
    render_story_video()
