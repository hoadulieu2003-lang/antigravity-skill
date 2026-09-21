# 📐 UGC NEWS STUDIO PRO — BẢN THIẾT KẾ SẢN PHẨM & CẤU HÌNH (TOOL BLUEPRINT)

> **Chủ quản (Owner)**: Anh — Lead Architect / Product Owner  
> **Cộng sự AI**: Em — Senior Engineering Agent  
> **Thư mục ứng dụng**: `document/app/`  

---

## 📁 1. Cấu Trúc Thư Mục Ứng Dụng (Folder Structure)

```text
document/app/
├── ARCHITECTURE_SPEC.md      # Đặc tả kiến trúc kỹ thuật chuẩn Enterprise
├── TOOL_BLUEPRINT.md         # Bản thiết kế chi tiết sản phẩm, cấu hình và luồng vận hành
├── README.md                 # Hướng dẫn khởi chạy nhanh (Quickstart Guide)
├── config.yaml               # Tệp cấu hình các thông số mặc định (Ports, Voices, Video Presets)
├── cli.py                    # Giao diện dòng lệnh (Command-Line Interface)
├── server.py                 # Máy chủ Web Studio API (FastAPI / Express Server)
└── core/                     # Các module lõi thực thi quy trình
    ├── __init__.py
    ├── config_manager.py     # Bộ nạp cấu hình và biến môi trường
    ├── cdp_crawler.py        # Module cào sâu dữ liệu Threads/MXH qua Chrome DevTools Protocol
    ├── ai_newsroom.py        # Module Gemini AI biên tập kịch bản & phân cảnh B-Roll
    ├── voice_synthesizer.py  # Module tổng hợp giọng đọc BTV truyền hình (Clean Voice)
    ├── video_compositor.py   # Xưởng dựng video OpenCV 1080x1920 + Đồ họa tin tức
    └── pipeline.py           # Master Orchestrator gắn kết toàn bộ quy trình
```

---

## ⚙️ 2. Cấu Hình Hệ Thống Chuẩn (`config.yaml`)

Tệp cấu hình trung tâm cho phép người dùng tùy chỉnh mọi thông số mà không cần sửa mã nguồn:

```yaml
# ==============================================================================
# UGC News Studio Pro Configuration
# ==============================================================================

system:
  app_name: "UGC News Studio Pro"
  version: "1.0.0"
  workspace_dir: "C:/Users/game/.gemini/threads_harvest"
  output_dir: "C:/Users/game/.gemini/output_news_videos"

cdp_crawler:
  cdp_port: 9223             # Cổng Chrome DevTools Protocol (9222 hoặc 9223)
  platform: "threads"        # Nền tảng: threads | tiktok | facebook
  max_scrolls: 6             # Số lần cuộn trang tự động để lấy bài viết
  scroll_delay_sec: 1.2      # Thời gian chờ giữa các lần cuộn để DOM nạp đầy đủ
  min_video_resolution: 480  # Độ phân giải video tối thiểu để tải về

ai_newsroom:
  model: "gemini-2.5-flash"  # Mô hình Gemini phân tích kịch bản
  target_duration_sec: 58    # Thời lượng mục tiêu của video thành phẩm
  words_per_minute: 140      # Tốc độ đọc chuẩn BTV thời sự (130 - 150 WPM)
  style: "breaking_news"     # Phong cách: breaking_news | human_interest | weather

voice_engine:
  provider: "gemini_live"    # Nhà cung cấp: gemini_live | edge_tts
  gemini_voice: "Aoede"      # Giọng đọc: Aoede (Nữ thời sự) | Charon (Nam trầm ấm)
  edge_voice: "vi-VN-HoaiMyNeural" # Giọng dự phòng ngoại tuyến
  sample_rate_hz: 48000      # Tần số mẫu chuẩn phòng thu phát thanh
  strip_sfx: true            # Bỏ toàn bộ Sound Effect nhân tạo (Mặc định: true)
  target_lufs: -14.0         # Chuẩn hóa âm lượng EBU R128

video_compositor:
  width: 1080
  height: 1920
  fps: 25.0
  video_codec: "libx264"
  audio_codec: "aac"
  audio_bitrate: "192k"
  crf: 20                    # Hệ số chất lượng nén (18 - 22 cho độ nét cao)
  preset: "veryfast"
  enable_faststart: true     # Bật cờ +faststart cho phép stream ngay trên web
  graphics:
    top_bar_text: "TIN NÓNG 24H"
    sub_top_bar_text: "HIỆN TRƯỜNG THỰC TẾ"
    enable_live_rec_dot: true
    enable_lower_third: true
    enable_author_credit: true
```

---

## 💻 3. Hướng Dẫn Sử Dụng Giao Diện Dòng Lệnh (`CLI Usage`)

Lập trình viên hoặc kíp biên tập có thể khởi chạy quy trình sản xuất video bằng một dòng lệnh duy nhất:

### Lệnh Sản Xuất Cơ Bản:
```bash
python cli.py --topic "ngập lụt hà nội" --duration 60 --voice female
```

### Lệnh Đầy Đủ Tùy Biến:
```bash
python cli.py \
  --topic "tình hình bão lũ miền bắc" \
  --platform threads \
  --duration 58 \
  --voice Aoede \
  --no-sfx \
  --output "C:/Users/game/.gemini/output_news_videos/ban_tin_ngap_lut.mp4"
```

### Giải Thích Các Tham Số CLI:
* `--topic` *(bắt buộc)*: Từ khóa hoặc chủ đề tin nóng cần khai thác trên mạng xã hội.
* `--platform` *(mặc định: threads)*: Nền tảng cào dữ liệu (`threads`, `tiktok`, `facebook`).
* `--duration` *(mặc định: 58)*: Thời lượng video mong muốn tính bằng giây.
* `--voice` *(mặc định: Aoede)*: Tên giọng đọc AI (`Aoede` - Nữ VTV, `Charon` - Nam chính luận, `HoaiMy` - Nữ dịu dàng).
* `--no-sfx` *(mặc định: bật)*: Bỏ toàn bộ âm thanh hiệu ứng nhân tạo, chỉ giữ giọng nói sạch 100%.
* `--output`: Đường dẫn lưu file MP4 thành phẩm.

---

## 🖥️ 4. Thiết Kế Giao Diện Web Studio (Light Theme Default)

Tuân thủ nghiêm ngặt quy chuẩn **Mandatory Light Theme Default Invariant**:

```text
+-------------------------------------------------------------------------------+
| 🌐 UGC NEWS STUDIO PRO                    [ Trạng thái: Chrome CDP Sẵn Sàng ] |
+-------------------------------------------------------------------------------+
|                                                                               |
|  [🔍 Nhập chủ đề: "ngập lụt hà nội"]   [ Nền tảng: Threads ▼ ]   [🚀 TẠO NGAY] |
|                                                                               |
|  +-----------------------------+  +----------------------------------------+  |
|  | 📺 XEM TRƯỚC VIDEO THÀNH PHẨM|  | 📝 KỊCH BẢN THỜI SỰ & PHÂN CẢNH B-ROLL |  |
|  |                             |  |                                        |  |
|  |    +-------------------+    |  | • 00-10s: Bác Grab lội nước (@tbh_1408)|  |
|  |    |                   |    |  |   "Mưa lớn kéo dài suốt đêm qua..."    |  |
|  |    |  1080x1920 MP4    |    |  | • 10-22s: Phố Lẩu Ốc ngập sâu          |  |
|  |    |  (Full HD Dọc)    |    |  |   "Nhiều phương tiện bị chết máy..."   |  |
|  |    |                   |    |  | • 22-34s: Người nhái lặn cống (@hoang) |  |
|  |    +-------------------+    |  |   "Lực lượng thoát nước ứng trực..."   |  |
|  |                             |  | • 34-46s: Chung cư Tân Tây Đô          |  |
|  |  ▶ Phát   00:15 / 00:58  🔊 |  | • 46-58s: Khuyến cáo người dân         |  |
|  |                             |  |                                        |  |
|  |  [⬇️ TẢI VIDEO MP4 (56 MB)]  |  | [🎙️ Giọng: BTV Nữ Aoede (Clean 100%)]  |  |
|  +-----------------------------+  +----------------------------------------+  |
|                                                                               |
|  📁 KHO TƯ LIỆU THỰC ĐỊA VỪA CÀO ĐƯỢC:                                         |
|  [ Clip 1: Bác Grab ] [ Clip 2: Lẩu Ốc ] [ Clip 3: Người nhái ] [ Clip 4 ]   |
+-------------------------------------------------------------------------------+
```
