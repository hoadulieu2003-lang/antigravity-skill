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
Khi người dùng yêu cầu xem tệp bên trong Antigravity 2.0:
- **PDF**: Sử dụng script `doc_preview.py` để trích xuất các trang thành ảnh PNG độ nét cao vào thư mục Artifacts của phiên làm việc (`brain/<conversation-id>/`) và tạo Artifact dạng `carousel` hoặc inline images.
- **Word (.docx)**: Sử dụng script `doc_preview.py` (với thư viện `mammoth`) để chuyển đổi thành tệp HTML có kiểu dáng (styling) hiện đại, xem trực tiếp trong panel Artifacts của Antigravity 2.0.

### Cú pháp chạy script:
```bash
# Preview PDF:
python "C:/Users/game/.gemini/config/skills/doc-previewer/scripts/doc_preview.py" "path/to/file.pdf" -o "C:/Users/game/.gemini/antigravity/brain/<conversation-id>/pdf_preview"

# Preview Word:
python "C:/Users/game/.gemini/config/skills/doc-previewer/scripts/doc_preview.py" "path/to/file.docx" -o "C:/Users/game/.gemini/antigravity/brain/<conversation-id>/doc_preview.html"
```
