import os
import sys
import cv2
import numpy as np
import subprocess
import time
import shutil
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

# ==============================================================================
# METRO 24H: Autonomous Monetization-Ready Video Compositor Engine (Pure Flood Edition)
# ==============================================================================

CANVAS_WIDTH = 1080
CANVAS_HEIGHT = 1920
FPS = 25.0
TOTAL_DURATION = 58.13
TOTAL_FRAMES = int(TOTAL_DURATION * FPS) # 1453 frames

WORKSPACE_DIR = Path(r"C:\Users\game\.gemini\threads_harvest")
AUDIO_FILE = Path(r"C:\Users\game\.gemini\config\sidecars\anti_live_voice\public\thoi_su_clean_voice.wav")
OUTPUT_VIDEO_PATH = Path(r"C:\Users\game\.gemini\config\sidecars\anti_live_voice\public\hanoi_flood_ugc_pro_monetized.mp4")
BRAIN_COPY_PATH = Path(r"C:\Users\game\.gemini\antigravity\brain\6f46af53-7f44-46a4-83e9-d518ccfc6f9f\hanoi_flood_ugc_pro_monetized.mp4")
STUDIO_PRO_COPY_PATH = Path(r"C:\Users\game\Documents\app\UGC_NEWS_STUDIO_PRO\hanoi_flood_ugc_pro_monetized.mp4")
TEMP_RAW_MP4 = WORKSPACE_DIR / "temp_pro_raw.mp4"

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

# 14 Micro-Cut Scenes — 100% Authenticated Pure Hanoi Flood Footage Only
SCENES = [
    {
        "clip": "threads_stream_vid_08.mp4",
        "clip_offset_sec": 0.0,
        "start_sec": 0.0, "end_sec": 4.2,
        "title": "THỦ ĐÔ CHÌM TRONG BIỂN NƯỚC",
        "detail": "Mưa lớn kéo dài suốt đêm khiến các tuyến phố tê liệt hoàn toàn",
        "bullets": [
            "• Lượng mưa đo được vượt 180mm tại nhiều quận nội thành",
            "• Các trục đường chính ngập sâu từ 0.5m đến 0.8m",
            "• Bác tài Grab áo xanh bì bõm dắt xe chở học sinh tới trường"
        ],
        "kinetic_prefix": "BẢN TIN ĐẶC BIỆT: ",
        "kinetic_highlight": "MƯA LỚN LỊCH SỬ 180MM",
        "kinetic_suffix": " NGẬP NẶNG TOÀN THÀNH PHỐ"
    },
    {
        "clip": "threads_video_08.mp4",
        "clip_offset_sec": 1.0,
        "start_sec": 4.2, "end_sec": 8.4,
        "title": "GIAO THÔNG ĐÌNH TRỆ DIỆN RỘNG",
        "detail": "Phương tiện chết máy hàng loạt tại các điểm đen ngập úng",
        "bullets": [
            "• Phố Lẩu Ốc biến thành sông sau trận mưa trắng trời",
            "• Nhiều tuyến đường nội đô ách tắc cục bộ kéo dài",
            "• Hàng trăm xe máy chết máy phải dắt bộ bì bõm"
        ],
        "kinetic_prefix": "CẢNH BÁO: ",
        "kinetic_highlight": "GIAO THÔNG TÊ LIỆT",
        "kinetic_suffix": " HÀNG LOẠT XE CHẾT MÁY"
    },
    {
        "clip": "threads_stream_vid_06.mp4",
        "clip_offset_sec": 0.5,
        "start_sec": 8.4, "end_sec": 12.5,
        "title": "NGẬP SÂU TRÊN DIỆN RỘNG",
        "detail": "Nước dâng cao tràn ngập đường phố và các khu dân cư",
        "bullets": [
            "• Ô tô lội nước chật vật di chuyển giữa dòng nước lớn",
            "• Người dân mặc áo mưa bì bõm dò đường qua biển nước",
            "• Sóng nước cuồn cuộn dập dềnh mỗi khi xe lớn chạy qua"
        ],
        "kinetic_prefix": "TRỌNG ĐIỂM: ",
        "kinetic_highlight": "NƯỚC NGẬP TRẮNG ĐƯỜNG",
        "kinetic_suffix": " SÓNG DẬP DỀNH KHẮP PHỐ"
    },
    {
        "clip": "threads_video_08.mp4",
        "clip_offset_sec": 12.5,
        "start_sec": 12.5, "end_sec": 16.5,
        "title": "XE TẢI RẼ SÓNG KHỔNG LỒ",
        "detail": "Sóng nước lớn tràn vào vỉa hè và nhà dân hai bên đường",
        "bullets": [
            "• Xe tải hạng nặng lội qua vùng nước sâu gần nửa mét",
            "• Cảnh báo người đi xe máy tránh đi sát các xe tải lớn",
            "• Sóng nước đánh mạnh có thể gây ngã đổ phương tiện"
        ],
        "kinetic_prefix": "NGUY HIỂM: ",
        "kinetic_highlight": "XE TẢI RẼ SÓNG NƯỚC",
        "kinetic_suffix": " VA ĐẬP MẠNH VÀO NHÀ DÂN"
    },
    {
        "clip": "threads_video_08.mp4",
        "clip_offset_sec": 18.5,
        "start_sec": 16.5, "end_sec": 20.5,
        "title": "NGUY CƠ THỦY KÍCH Ô TÔ",
        "detail": "Cảnh báo khẩn cấp các phương tiện gầm thấp không đi vào vùng trũng",
        "bullets": [
            "• Hàng loạt xe ô tô con bị ngập nước chết máy la liệt",
            "• Chi phí sửa chữa thủy kích ước tính hàng chục triệu đồng",
            "• Đội xe cứu hộ quá tải đơn yêu cầu cứu nạn khẩn cấp"
        ],
        "kinetic_prefix": "NGUY HIỂM: ",
        "kinetic_highlight": "CẢNH BÁO THỦY KÍCH",
        "kinetic_suffix": " Ô TÔ CHẾT MÁY LA LIỆT"
    },
    {
        "clip": "threads_stream_vid_07.mp4",
        "clip_offset_sec": 1.0,
        "start_sec": 20.5, "end_sec": 24.5,
        "title": "NGƯỜI NHÁI LẶN CỐNG THOÁT NƯỚC",
        "detail": "Lực lượng công nhân thoát nước khẩn trương xử lý rác nghẽn",
        "bullets": [
            "• Người nhái đeo bình dưỡng khí lặn sâu xuống cống ngầm",
            "• Thu gom hàng tấn rác thải kẹt tại các miệng thu nước",
            "• Tinh thần trách nhiệm cao bảo đảm dòng chảy thông suốt"
        ],
        "kinetic_prefix": "HIỆN TRƯỜNG: ",
        "kinetic_highlight": "NGƯỜI NHÁI LẶN CỐNG",
        "kinetic_suffix": " KHƠI THÔNG DÒNG NƯỚC"
    },
    {
        "clip": "threads_stream_vid_07.mp4",
        "clip_offset_sec": 10.5,
        "start_sec": 24.5, "end_sec": 28.5,
        "title": "ỨNG TRỰC KHẨN CẤP 100% QUÂN SỐ",
        "detail": "Toàn bộ công nhân thoát nước túc trực tại các điểm đen ngập úng",
        "bullets": [
            "• Mở rộng các miệng cống tiêu thoát tự nhiên",
            "• Đồng đội giữ dây an toàn hỗ trợ người nhái dưới cống",
            "• Đặt biển cảnh báo nguy hiểm tại các miệng cống mở nắp"
        ],
        "kinetic_prefix": "TÚC TRỰC 24/7: ",
        "kinetic_highlight": "100% LỰC LƯỢNG",
        "kinetic_suffix": " GIẢI TỎA ĐIỂM NGHẼN RÁC"
    },
    {
        "clip": "threads_stream_vid_06.mp4",
        "clip_offset_sec": 7.2,
        "start_sec": 28.5, "end_sec": 32.5,
        "title": "TRẠM BƠM XẢ VÒI RỒNG CỨU HỘ",
        "detail": "Hệ thống trạm bơm tiêu úng vận hành cưỡng bức hết công suất",
        "bullets": [
            "• Vòi rồng xả nước áp lực lớn cuồn cuộn giải cứu khu dân cư",
            "• Vận hành liên tục ngày đêm đẩy nhanh tốc độ rút nước",
            "• Ưu tiên giải tỏa các khu dân cư và tầng hầm ngập sâu"
        ],
        "kinetic_prefix": "KHẨN TRƯƠNG: ",
        "kinetic_highlight": "TRẠM BƠM CƯỠNG BỨC",
        "kinetic_suffix": " XẢ NƯỚC HẾT CÔNG SUẤT"
    },
    {
        "clip": "threads_video_09.mp4",
        "clip_offset_sec": 0.5,
        "start_sec": 32.5, "end_sec": 36.5,
        "title": "CHUNG CƯ TÂN TÂY ĐÔ (HOÀI ĐỨC)",
        "detail": "Khu đô thị ngoại thành chìm trong biển nước mênh mông",
        "bullets": [
            "• Trời hửng nắng nhưng mực nước lũ vẫn chưa chịu rút",
            "• Sân chung cư và trục đường chính biến thành hồ nước",
            "• Mọi phương tiện gầm thấp không thể tiếp cận vào sảnh"
        ],
        "kinetic_prefix": "NGOẠI THÀNH: ",
        "kinetic_highlight": "TÂN TÂY ĐÔ NGẬP MÊNH MÔNG",
        "kinetic_suffix": " NẮNG NƯỚC KHÔNG RÚT"
    },
    {
        "clip": "threads_video_09.mp4",
        "clip_offset_sec": 4.5,
        "start_sec": 36.5, "end_sec": 40.5,
        "title": "XE ĐIỆN RẼ SÓNG NHƯ CA-NÔ",
        "detail": "Đời sống sinh hoạt của hàng nghìn cư dân bị đảo lộn",
        "bullets": [
            "• Xe ô tô rẽ sóng nước di chuyển thận trọng giữa sân",
            "• Hàng loạt cửa hàng ki-ốt phải đóng cửa sắt chống tràn",
            "• Shippers không thể giao hàng, cư dân tự tiếp tế"
        ],
        "kinetic_prefix": "SINH HOẠT ĐẢO LỘN: ",
        "kinetic_highlight": "XE ĐIỆN RẼ SÓNG",
        "kinetic_suffix": " BIỂN NƯỚC NGOẠI THÀNH"
    },
    {
        "clip": "threads_stream_vid_08.mp4",
        "clip_offset_sec": 4.5,
        "start_sec": 40.5, "end_sec": 45.0,
        "title": "CẢNH BÁO AN TOÀN ĐIỆN VÀ HỐ GA",
        "detail": "Khuyến cáo người dân bảo vệ tính mạng khi lưu thông",
        "bullets": [
            "• Tránh xa các trạm biến áp, cột điện có nguy cơ rò điện",
            "• Quan sát kỹ các cọc tiêu và nắp cống cảnh báo sụp hố",
            "• Không để trẻ nhỏ tự ý lội nước nghịch ngợm mùa mưa lũ"
        ],
        "kinetic_prefix": "ĐẶC BIỆT LƯU Ý: ",
        "kinetic_highlight": "TRÁNH XA CỘT ĐIỆN",
        "kinetic_suffix": " VÀ CÁC NẮP CỐNG HỞ"
    },
    {
        "clip": "threads_stream_vid_06.mp4",
        "clip_offset_sec": 16.0,
        "start_sec": 45.0, "end_sec": 49.5,
        "title": "DỰ BÁO THỜI TIẾT 24H TỚI",
        "detail": "Áp thấp nhiệt đới tiếp tục gây mưa dông diện rộng",
        "bullets": [
            "• Khả năng xuất hiện thêm các trận mưa lớn cục bộ",
            "• Mực nước các sông Hồng, sông Nhuệ đang lên cao",
            "• Các vùng trũng thấp cần chủ động phương án phòng ngừa"
        ],
        "kinetic_prefix": "DỰ BÁO: ",
        "kinetic_highlight": "MƯA LỚN CÒN TIẾP DIỄN",
        "kinetic_suffix": " TRONG 24 GIỜ TỚI"
    },
    {
        "clip": "threads_video_08.mp4",
        "clip_offset_sec": 4.0,
        "start_sec": 49.5, "end_sec": 54.0,
        "title": "CẬP NHẬT GIAO THÔNG LIÊN TỤC",
        "detail": "Theo dõi kênh METRO 24H để nắm bắt lộ trình thông thoáng",
        "bullets": [
            "• Bản tin thời sự số phát sóng liên tục trên các nền tảng",
            "• Phản ánh trung thực góc nhìn từ chính người dân thủ đô",
            "• Cùng chung tay hỗ trợ cộng đồng vượt qua thiên tai"
        ],
        "kinetic_prefix": "KÊNH TIN TỨC: ",
        "kinetic_highlight": "METRO 24H ĐỒNG HÀNH",
        "kinetic_suffix": " CẬP NHẬT LIÊN TỤC"
    },
    {
        "clip": "threads_stream_vid_06.mp4",
        "clip_offset_sec": 29.0,
        "start_sec": 54.0, "end_sec": 58.13,
        "title": "CHỦ ĐỘNG BẢO ĐẢM AN TOÀN",
        "detail": "Chúc quý khán giả có những lộ trình an toàn trong mùa mưa",
        "bullets": [
            "• Hạn chế di chuyển vào các khung giờ mưa lớn ngập sâu",
            "• Lưu số điện thoại đường dây nóng cứu hộ khẩn cấp 114",
            "• Nhấn Theo Dõi kênh để nhận cảnh báo giao thông sớm nhất"
        ],
        "kinetic_prefix": "KẾT NỐI: ",
        "kinetic_highlight": "CHÚC QUÝ KHÁN GIẢ",
        "kinetic_suffix": " LỘ TRÌNH AN TOÀN"
    }
]

def load_fonts():
    try:
        f_title = ImageFont.truetype("arialbd.ttf", 46)
        f_sub = ImageFont.truetype("arial.ttf", 30)
        f_bullet = ImageFont.truetype("arialbd.ttf", 32)
        f_kinetic = ImageFont.truetype("arialbd.ttf", 48)
        f_ticker = ImageFont.truetype("arialbd.ttf", 36)
        f_badge = ImageFont.truetype("arialbd.ttf", 26)
    except Exception:
        f_title = ImageFont.load_default()
        f_sub = f_title
        f_bullet = f_title
        f_kinetic = f_title
        f_ticker = f_title
        f_badge = f_title
    return f_title, f_sub, f_bullet, f_kinetic, f_ticker, f_badge

def format_frame(frame, width=CANVAS_WIDTH, height=CANVAS_HEIGHT):
    fh, fw = frame.shape[:2]
    scale = max(width / fw, height / fh)
    nw, nh = int(fw * scale), int(fh * scale)
    resized = cv2.resize(frame, (nw, nh), interpolation=cv2.INTER_LINEAR)
    x_off = (nw - width) // 2
    y_off = (nh - height) // 2
    return resized[y_off:y_off + height, x_off:x_off + width]

def render():
    print("[*] Khởi động Cỗ máy Dựng Video Bản Tin Thời Sự Sau Nâng Cấp (METRO 24H)...")
    print(f"[*] Tổng thời lượng: {TOTAL_DURATION}s | Tổng số khung hình: {TOTAL_FRAMES}")

    radar_img = cv2.imread(str(WORKSPACE_DIR / "radar_map_asset.png"))
    if radar_img is not None:
        radar_img = cv2.resize(radar_img, (460, 310))

    f_title, f_sub, f_bullet, f_kinetic, f_ticker, f_badge = load_fonts()

    fourcc = cv2.VideoWriter_fourcc(*"mp4v")
    writer = cv2.VideoWriter(str(TEMP_RAW_MP4), fourcc, FPS, (CANVAS_WIDTH, CANVAS_HEIGHT))

    current_scene_idx = 0
    last_scene_idx = -1
    cap = None

    t0 = time.time()
    ticker_text = "   *** BREAKING NEWS: CẢNH BÁO MƯA LỚN KÉO DÀI TẠI THỦ ĐÔ HÀ NỘI — CÁC TUYẾN ĐƯỜNG NGUYỄN TRÃI, PHẠM HÙNG, TRẦN DUY HƯNG NGẬP SÂU 0.6M — CHÍNH QUYỀN KHUYẾN CÁO NGƯỜI DÂN HẠN CHẾ RA ĐƯỜNG, ĐỀ PHÒNG THỦY KÍCH VÀ RÒ RỈ ĐIỆN ***   "

    for frame_idx in range(TOTAL_FRAMES):
        sec = frame_idx / FPS

        # Identify current scene
        while current_scene_idx < len(SCENES) - 1 and sec >= SCENES[current_scene_idx]["end_sec"]:
            current_scene_idx += 1

        scene = SCENES[current_scene_idx]
        clip_name = scene["clip"]
        offset_sec = scene.get("clip_offset_sec", 0.0)

        # Switch video capture or seek to new offset on scene transition
        if current_scene_idx != last_scene_idx or cap is None:
            if cap is not None:
                cap.release()
            clip_path = str(WORKSPACE_DIR / clip_name)
            cap = cv2.VideoCapture(clip_path)
            src_fps = cap.get(cv2.CAP_PROP_FPS) or 30.0
            start_frame = int(offset_sec * src_fps)
            cap.set(cv2.CAP_PROP_POS_FRAMES, start_frame)
            last_scene_idx = current_scene_idx

        ret, frame = cap.read()
        if not ret or frame is None:
            # Loop back to offset if clip ends before scene duration
            src_fps = cap.get(cv2.CAP_PROP_FPS) or 30.0
            start_frame = int(offset_sec * src_fps)
            cap.set(cv2.CAP_PROP_POS_FRAMES, start_frame)
            ret, frame = cap.read()
            if not ret or frame is None:
                cap.release()
                cap = cv2.VideoCapture(str(WORKSPACE_DIR / clip_name))
                cap.set(cv2.CAP_PROP_POS_FRAMES, start_frame)
                ret, frame = cap.read()
                if not ret or frame is None:
                    frame = np.zeros((CANVAS_HEIGHT, CANVAS_WIDTH, 3), dtype=np.uint8)

        # 1. Base 1080x1920 Frame (Micro-Cut B-roll)
        canvas = format_frame(frame)

        # 2. Layer 1: Top Brand Anchor (Y: 0 to 220)
        cv2.rectangle(canvas, (0, 0), (CANVAS_WIDTH, 220), (15, 23, 42), -1)
        # Red and blue top accent bars
        cv2.rectangle(canvas, (0, 0), (CANVAS_WIDTH, 8), (37, 99, 235), -1)
        cv2.rectangle(canvas, (0, 8), (420, 14), (220, 38, 38), -1)

        # 3. Layer 2: Radar Map Picture-in-Picture (Y: 235 to 555, X: 580 to 1040)
        if radar_img is not None:
            rx, ry = 580, 235
            rh, rw = radar_img.shape[:2]
            # White border container
            cv2.rectangle(canvas, (rx - 4, ry - 4), (rx + rw + 4, ry + rh + 4), (255, 255, 255), 4)
            canvas[ry:ry + rh, rx:rx + rw] = radar_img

        # 4. Layer 5: Frosted Glass Lower-Third (Y: 1240 to 1710)
        lt_overlay = canvas.copy()
        cv2.rectangle(lt_overlay, (40, 1240), (CANVAS_WIDTH - 40, 1710), (15, 23, 42), -1)
        cv2.addWeighted(lt_overlay, 0.82, canvas, 0.18, 0, canvas)
        # Red left bar
        cv2.rectangle(canvas, (40, 1240), (56, 1710), (220, 38, 38), -1)
        # Rounded white border
        cv2.rectangle(canvas, (40, 1240), (CANVAS_WIDTH - 40, 1710), (200, 210, 225), 2)

        # 5. Layer 6: Verified News Badge (Y: 1730 to 1780)
        cv2.rectangle(canvas, (40, 1730), (510, 1780), (37, 99, 235), -1)

        # 6. Layer 7: Bottom Breaking News Ticker (Y: 1840 to 1920)
        cv2.rectangle(canvas, (0, 1840), (CANVAS_WIDTH, 1920), (220, 38, 38), -1)
        cv2.rectangle(canvas, (0, 1840), (260, 1920), (153, 27, 27), -1)

        # --- PIL Overlay for Crystal-Clear Typography & Vietnamese Glyphs ---
        pil_img = Image.fromarray(cv2.cvtColor(canvas, cv2.COLOR_BGR2RGB))
        draw = ImageDraw.Draw(pil_img)

        # Draw Top Brand Header
        draw.rectangle([(40, 35), (340, 105)], fill=(255, 255, 255))
        draw.text((55, 45), "METRO 24H", font=f_title, fill=(220, 38, 38))
        draw.text((360, 52), "TIN NÓNG THỜI SỰ", font=f_sub, fill=(226, 232, 240))

        # Pulsing Live Dot
        pulse = (frame_idx // 12) % 2 == 0
        live_dot_color = (239, 68, 68) if pulse else (185, 28, 28)
        draw.ellipse([(40, 140), (66, 166)], fill=live_dot_color)
        draw.text((78, 140), "LIVE 24/7 BROADCAST", font=f_badge, fill=(255, 255, 255))

        # Weather Widget (Top Right)
        draw.text((CANVAS_WIDTH - 380, 138), "HÀ NỘI: 26°C  |  MƯA: 180MM", font=f_badge, fill=(147, 197, 253))

        # Layer 4: Kinetic Typography Subtitle (Y: 1040 to 1180)
        draw.rectangle([(40, 1060), (CANVAS_WIDTH - 40, 1180)], fill=(0, 0, 0, 200))
        # Highlighted yellow text for keyword
        draw.text((60, 1080), scene['kinetic_prefix'], font=f_kinetic, fill=(255, 255, 255))
        w_prefix = draw.textlength(scene['kinetic_prefix'], font=f_kinetic)
        draw.text((60 + w_prefix, 1080), scene['kinetic_highlight'], font=f_kinetic, fill=(250, 204, 21))
        draw.text((60, 1130), scene['kinetic_suffix'].strip(), font=f_kinetic, fill=(255, 255, 255))

        # Lower-Third Texts
        draw.text((75, 1265), scene["title"].upper(), font=f_title, fill=(239, 68, 68))
        draw.text((75, 1330), scene["detail"], font=f_sub, fill=(226, 232, 240))

        # 3 Bullet Points
        by = 1390
        for b in scene["bullets"]:
            draw.text((75, by), b, font=f_bullet, fill=(255, 255, 255))
            by += 55

        # Trust Badge Text
        draw.text((55, 1742), "✔ Verified News @METRO24H | Fair Use", font=f_badge, fill=(255, 255, 255))

        # Ticker Text Scrolling
        draw.text((25, 1858), "BREAKING", font=f_ticker, fill=(255, 255, 255))
        ticker_offset = (frame_idx * 7) % 2400
        draw.text((280 - ticker_offset, 1858), ticker_text, font=f_ticker, fill=(255, 255, 255))
        draw.text((280 - ticker_offset + 2400, 1858), ticker_text, font=f_ticker, fill=(255, 255, 255))

        # Convert back to BGR and write
        final_frame = cv2.cvtColor(np.array(pil_img), cv2.COLOR_RGB2BGR)
        writer.write(final_frame)

        if frame_idx % 200 == 0:
            print(f"[*] Đang render: {frame_idx}/{TOTAL_FRAMES} frames ({sec:.1f}s)...")

    if cap is not None:
        cap.release()
    writer.release()

    render_dur = time.time() - t0
    fps_actual = TOTAL_FRAMES / render_dur
    print(f"[+] Hoàn tất Pha 1 (OpenCV VideoWriter)! Thời gian: {render_dur:.1f}s (Tốc độ: {fps_actual:.1f} FPS)")

    # Phase 2: FFmpeg Muxing
    print("[*] Khởi động Pha 2: Muxing Container FFmpeg với giọng đọc BTV Aoede...")
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

    # Sync to Brain Artifacts & Studio Pro Ecosystem
    shutil.copy2(str(OUTPUT_VIDEO_PATH), str(BRAIN_COPY_PATH))
    STUDIO_PRO_COPY_PATH.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(str(OUTPUT_VIDEO_PATH), str(STUDIO_PRO_COPY_PATH))
    print(f"[+] Thành phẩm xuất sắc! Đã lưu tại:\n    -> {OUTPUT_VIDEO_PATH}\n    -> {BRAIN_COPY_PATH}\n    -> {STUDIO_PRO_COPY_PATH}")

    # Remove temp raw
    if TEMP_RAW_MP4.exists():
        TEMP_RAW_MP4.unlink()

if __name__ == "__main__":
    render()
