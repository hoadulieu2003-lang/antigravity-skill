---
name: photoshop-studio
description: >-
  Chuyên gia đồ hoạ & Tự động hoá Adobe Photoshop 2024 qua Windows COM Bridge.
  Kích hoạt khi người dùng yêu cầu chỉnh sửa ảnh chất lượng cao, tách nền bằng Adobe Sensei AI,
  thay thế ảnh trong Smart Object mockup PSD, đổ bóng studio tự nhiên, chỉnh màu theo Photoshop Action (.atn),
  hoặc xuất file đồ hoạ chuyên nghiệp từ Photoshop.
---

# Photoshop Studio — Windows COM Automation Engine

Hệ thống điều khiển đồ hoạ chuyên nghiệp kết nối trực tiếp Antigravity 2.0 với **Adobe Photoshop 2024** thông qua giao diện `COM (Component Object Model)` trên Windows.

---

## 1. Cấu trúc và Cơ chế Cầu nối (`Bridge Architecture`)

* **Kịch bản thực thi trung tâm**:
  `python "C:\Users\game\.gemini\config\skills\photoshop-studio\scripts\ps_bridge.py" <subcommand> [options]`
* **Đặc tính kỹ thuật**:
  * Tự động thiết lập chế độ `DialogModes.NO` để ngăn các popup chặn tiến trình.
  * Hỗ trợ giao tiếp `ExtendScript (JSX)` và `Action Manager` để điều khiển mọi tính năng cấp cao của Photoshop.
  * Hỗ trợ xuất định dạng `PNG-24` trong suốt, `JPEG` chất lượng cao, và `PSD` giữ nguyên các layer.

---

## 2. Bảng lệnh CLI Thao tác Nhanh

| Lệnh | Mô tả | Tham số chính |
| :--- | :--- | :--- |
| **`status`** | Kiểm tra kết nối COM, phiên bản và tài liệu đang mở. | Không |
| **`open-file`** | Mở một tệp ảnh hoặc tệp PSD trong Photoshop. | `--path <đường-dẫn-file>` |
| **`create-document`** | Khởi tạo một canvas mới. | `--width <px> --height <px> --name <tên> --background [transparent\|white\|black]` |
| **`select-subject`** | Nhận diện và chọn chủ thể bằng Adobe Sensei AI. | Không |
| **`remove-background`**| Tự động tách nền và tạo Layer Mask bảo toàn. | Không |
| **`replace-smart-object`** | Thay thế ảnh bên trong layer Smart Object của Mockup. | `--image <ảnh-mới> [--layer <tên-layer>]` |
| **`apply-action`** | Kích hoạt Action Photoshop (.atn) để áp hiệu ứng màu. | `--name <tên-action> [--set <bộ-action>]` |
| **`export-image`** | Xuất tài liệu hiện tại ra tệp ảnh thành phẩm. | `--output <file-đích> --format [png\|jpg\|psd] [--transparent]` |
| **`eval-jsx`** | Thực thi trực tiếp đoạn mã JSX hoặc tệp script tuỳ biến. | `--script <đoạn-mã-hoặc-file-jsx>` |
| **`close-document`** | Đóng tài liệu đang thao tác an toàn. | `[--save]` |

---

## 3. Các Quy trình Thực chiến Chuẩn (`Standard Workflows`)

### Quy trình 1: Tách nền & Tạo Packshot Studio
```powershell
# 1. Mở ảnh sản phẩm thô
python "C:\Users\game\.gemini\config\skills\photoshop-studio\scripts\ps_bridge.py" open-file --path "C:\path\to\product.jpg"

# 2. Xoá nền bằng Adobe Sensei
python "C:\Users\game\.gemini\config\skills\photoshop-studio\scripts\ps_bridge.py" remove-background

# 3. Xuất ảnh PNG tách nền trong suốt
python "C:\Users\game\.gemini\config\skills\photoshop-studio\scripts\ps_bridge.py" export-image --output "C:\path\to\product_cutout.png" --format png --transparent

# 4. Đóng tài liệu
python "C:\Users\game\.gemini\config\skills\photoshop-studio\scripts\ps_bridge.py" close-document
```

### Quy trình 2: Tự động hoá Mockup qua Smart Object
```powershell
# 1. Mở file template mockup PSD
python "C:\Users\game\.gemini\config\skills\photoshop-studio\scripts\ps_bridge.py" open-file --path "C:\templates\tshirt_mockup.psd"

# 2. Thay thế hình thiết kế vào layer Smart Object (tự động warp phối cảnh)
python "C:\Users\game\.gemini\config\skills\photoshop-studio\scripts\ps_bridge.py" replace-smart-object --image "C:\artwork\logo.png" --layer "Your Design Here"

# 3. Xuất file kết quả
python "C:\Users\game\.gemini\config\skills\photoshop-studio\scripts\ps_bridge.py" export-image --output "C:\output\tshirt_preview.jpg" --format jpg --quality 95

# 4. Đóng template không lưu đè
python "C:\Users\game\.gemini\config\skills\photoshop-studio\scripts\ps_bridge.py" close-document
```

---

## 4. Tài liệu Tham khảo Kỹ thuật
* Snippet mã nguồn Action Manager và JSX nâng cao: [references/jsx_library.md](./references/jsx_library.md)
