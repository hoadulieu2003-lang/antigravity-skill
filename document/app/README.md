# 🚀 UGC NEWS STUDIO PRO (QUICKSTART GUIDE)
## Công Cụ Tự Động Hóa Sản Xuất Video Thời Sự 1080x1920 Từ Dữ Liệu Mạng Xã Hội Thực Tế (UGC)

> **Chủ quản Dự án**: Anh — Lead Architect / Product Owner  
> **Cộng sự Kỹ thuật**: Em — Senior AI Engineering Agent  
> **Hệ sinh thái**: Python 3.10+ • OpenCV • FFmpeg • Chrome CDP • Gemini Multimodal Live API  

---

## 🌟 1. Giới Thiệu Chung

**UGC News Studio Pro** là công cụ chuyển đổi toàn diện từ dữ liệu mạng xã hội (Threads, Facebook, TikTok) thành các bản tin video thời sự định dạng dọc 9:16 (1080x1920 Full HD) chuẩn truyền hình số chỉ trong **vòng dưới 90 giây**.

Toàn bộ quy trình được tự động hóa khép kín:
1. **CDP Ingestion**: Tự động trích xuất video MP4 gốc (không logo/watermark) và hình ảnh 3K-4K từ phiên Chrome đang mở.
2. **AI Newsroom**: Gemini phân tích câu chuyện hiện trường, nhóm sự kiện, viết kịch bản thời sự chuẩn phong cách VTV.
3. **Studio Voice Synthesis**: Giọng đọc BTV Nữ (Aoede) hoặc BTV Nam (Charon) âm sắc trong trẻo, không tạp âm.
4. **Master Compositor**: Ghép khung hình bằng OpenCV kết hợp FFmpeg muxing, tự động vẽ đồ họa "TIN NÓNG 24H", lower-third kính mờ, và chữ ký bản quyền người đăng.

---

## 📂 2. Cấu Trúc Tài Liệu & Mã Nguồn

```text
document/app/
├── ARCHITECTURE_SPEC.md      # Đặc tả kiến trúc kỹ thuật hệ thống (5 phân hệ)
├── TOOL_BLUEPRINT.md         # Bản thiết kế chi tiết sản phẩm, API & cấu hình
├── README.md                 # Hướng dẫn khởi chạy nhanh (tài liệu này)
├── config.yaml               # Tệp cấu hình các thông số (Cổng CDP, Giọng đọc, Video)
├── cli.py                    # Giao diện dòng lệnh khởi chạy quy trình (CLI Runner)
└── core/                     # Các module mã nguồn lõi
    ├── __init__.py
    ├── config_manager.py     # Quản lý cấu hình
    ├── cdp_crawler.py        # Module cào sâu dữ liệu qua Chrome CDP
    ├── ai_newsroom.py        # Module biên tập kịch bản AI
    ├── voice_synthesizer.py  # Module tổng hợp giọng đọc sạch (Clean Voice)
    ├── video_compositor.py   # Xưởng dựng video OpenCV 1080x1920
    └── pipeline.py           # Master Pipeline Orchestrator
```

---

## ⚡ 3. Hướng Dẫn Vận Hành Nhanh

### 3.1. Chạy Trực Tiếp Bằng Lệnh CLI (Zero-Config):
```bash
python document/app/cli.py --topic "ngập lụt hà nội" --duration 58
```

### 3.2. Chạy với Tùy Biến Giọng Đọc & Đường Dẫn Đầu Ra:
```bash
python document/app/cli.py \
  --topic "tình hình bão lũ miền bắc" \
  --duration 60 \
  --voice Aoede \
  --output "C:/Users/game/.gemini/output_news_videos/ban_tin_ngap_lut.mp4"
```

### 3.3. Tích Hợp Vào Mã Nguồn Python Khác:
```python
import asyncio
from document.app.core.pipeline import NewsPipeline

async def produce_news():
    studio = NewsPipeline()
    result = await studio.run(topic="ngập lụt hà nội")
    print(f"Video sẵn sàng tại: {result['video_path']}")

if __name__ == "__main__":
    asyncio.run(produce_news())
```

---

## 🌐 4. Trải Nghiệm Giao Diện Trực Quan (Web Studio)

Giao diện Web Studio trực quan phục vụ theo chuẩn **Mandatory Light Theme Default**:
* **Địa chỉ truy cập**: [http://localhost:3050](http://localhost:3050)
* **Bản Video Demo Thành Phẩm**: [`hanoi_flood_ugc_clean.mp4`](file:///C:/Users/game/.gemini/antigravity/brain/6f46af53-7f44-46a4-83e9-d518ccfc6f9f/hanoi_flood_ugc_clean.mp4) (56.60 MB, 1080x1920 Full HD, âm thanh BTV Aoede trong trẻo).
