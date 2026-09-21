---
name: doc-previewer
description: Xem nhanh và trực quan hóa tài liệu (PDF, Word DOCX/DOC, PowerPoint PPTX, Excel XLSX) trực tiếp trong Antigravity 2.0 dưới dạng Artifacts (Carousel hình ảnh hoặc HTML giao diện chuẩn) và qua QuickLook trên Windows.
---

# Document Previewer Engine cho Antigravity 2.0 & Windows

Skill này cung cấp cơ chế xem nhanh tài liệu đa định dạng cho người dùng trong môi trường **Antigravity 2.0** và trên **Windows**.

## 1. Quick Look trên Windows (Spacebar Preview)
- Ứng dụng **QuickLook** (`QL-Win.QuickLook`) đã được cài đặt và tự khởi động cùng Windows.
- Khi người dùng muốn xem nhanh bất kỳ file PDF, Word (`.docx`), Excel (`.xlsx`), PowerPoint (`.pptx`):
  - Mở File Explorer, chọn tệp bất kỳ.
  - Bấm phím **Space (Phím Cách)** để mở cửa sổ xem trước tức thì (0.1s).
  - Bấm **Space** hoặc **Esc** để đóng.

## 2. In-App Preview trong Antigravity 2.0 (Artifacts & Chat)
Khi người dùng yêu cầu xem tệp bên trong Antigravity 2.0 hoặc khi Agent tạo tài liệu văn phòng:
- **Nguyên tắc Vàng**: Panel Artifacts của Antigravity chỉ render HTML, Markdown và hình ảnh. Nếu đặt link trực tiếp tới file nhị phân (`.docx`, `.pptx`, `.xlsx`), panel Artifacts sẽ mở dạng Text Editor và gây lỗi bung mã nhị phân rác `PK...`. Do đó:
  * **LUÔN LUÔN tạo kèm bản HTML Preview** bằng `doc_preview.py`.
  * **Link hiển thị cho Anh** luôn trỏ vào bản `.html` để khi click là thấy ngay giao diện chuẩn đẹp lập tức!
- **Word (.docx)**: Sử dụng `doc_preview.py` để chuyển đổi thành tệp HTML có kiểu dáng văn bản hành chính sang trọng.
- **PowerPoint (.pptx)**: Sử dụng `doc_preview.py` để chuyển đổi các slide thành bản trình chiếu Slide Deck HTML tương tác (có phím mũi tên, toàn màn hình).
- **Excel (.xlsx, .csv)**: Sử dụng `doc_preview.py` để chuyển đổi thành bảng dữ liệu HTML có tab chuyển Sheet.
- **PDF**: Sử dụng `doc_preview.py` để trích xuất các trang thành ảnh PNG độ nét cao hoặc nhúng HTML viewer.

- **Video (.mp4, .mov, .webm, .mkv)**: Sử dụng `doc_preview.py` để tạo trình phát Video Studio HTML5 tương tác cao cấp (Play/Pause, Frame-by-frame tua từng frame, Speed 0.5x-2x, Snapshot chụp ảnh frame, phím tắt Space/Mũi tên, PiP, Toàn màn hình) hiển thị trực tiếp trong Antigravity 2.0 hoặc nhúng inline qua `<agent-embed>`.

### Cú pháp chạy script:
```bash
# Preview Video (.mp4, .mov, .webm):
python "C:/Users/game/.gemini/config/skills/doc-previewer/scripts/doc_preview.py" "path/to/video.mp4" -o "C:/Users/game/.gemini/antigravity/brain/<conversation-id>/video_preview.html"

# Preview PowerPoint (.pptx):
python "C:/Users/game/.gemini/config/skills/doc-previewer/scripts/doc_preview.py" "path/to/file.pptx" -o "C:/Users/game/.gemini/antigravity/brain/<conversation-id>/slide_preview.html"

# Preview Word (.docx):
python "C:/Users/game/.gemini/config/skills/doc-previewer/scripts/doc_preview.py" "path/to/file.docx" -o "C:/Users/game/.gemini/antigravity/brain/<conversation-id>/doc_preview.html"

# Preview Excel (.xlsx):
python "C:/Users/game/.gemini/config/skills/doc-previewer/scripts/doc_preview.py" "path/to/file.xlsx" -o "C:/Users/game/.gemini/antigravity/brain/<conversation-id>/sheet_preview.html"

# Mở trực tiếp bằng trình phát mặc định của Windows (Movies & TV, Media Player, Office):
python "C:/Users/game/.gemini/config/skills/doc-previewer/scripts/doc_preview.py" "path/to/file.mp4" --open
```
