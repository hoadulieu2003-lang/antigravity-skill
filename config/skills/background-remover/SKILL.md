---
name: AI Background Remover & Packshot Studio
description: Chuyên gia & Động cơ AI Tách nền hình ảnh, tạo Packshot sản phẩm trong suốt (Transparency PNG) hoặc ghép nền Studio Dark (#1a1a1a) cho nhân vật, đạo cụ và sản phẩm thương mại.
---

# AI BACKGROUND REMOVER & PACKSHOT ISOLATION ENGINE

Hệ thống **AI Background Remover** là kỹ năng chuyên dụng cho phép tách nền đối tượng (nhân vật, sản phẩm, đạo cụ, động vật) với độ chính xác cao bằng mô hình mạng nơ-ron AI cục bộ (Rembg, U2Net, BiRefNet, IS-Net), hoàn toàn offline 100% và không phụ thuộc API bên thứ 3.

---

## 🎯 1. CÁC TRƯỜNG HỢP SỬ DỤNG CHÍNH

1. **Chuẩn Hóa Mỏ Neo Sản Phẩm (Commercial Product Packshots)**:
   - Tách nền sản phẩm thật (chai nước hoa, giày dép, điện thoại, mỹ phẩm) ➔ Tạo ảnh PNG trong suốt hoặc ghép nền studio `#1a1a1a`.
   - Nạp vào `asset_manifest.props` làm mỏ neo hình ảnh `PROP_01` cho Video Quảng Cáo.
2. **Chuẩn Hóa Chân Dung Nhân Vật (Character Studio Isolation)**:
   - Tách nền ảnh chụp người hoặc ảnh chân dung từ video ➔ Ghép vào nền tối `#1a1a1a` chuẩn Hollywood Studio.
   - Nạp vào **Kho Nhân Vật (Character Vault)** để làm mỏ neo `SUB_01`.
3. **Tách Nền Hàng Loạt (Batch Folder Processing)**:
   - Quét toàn bộ thư mục ảnh sản phẩm/nhân vật và tách nền tự động chỉ bằng 1 câu lệnh.

---

## 🛠️ 2. CÁCH SỬ DỤNG CLI (COMMAND LINE)

Script thực thi nằm tại: `C:\Users\game\cdp_reader\scripts\remove_bg.py`

### A. Tách nền 1 ảnh duy nhất (Xuất PNG trong suốt):
```bash
python C:\Users\game\cdp_reader\scripts\remove_bg.py -i "C:\path\to\product.jpg" -o "C:\path\to\product_nobg.png"
```

### B. Tách nền và ghép vào phông tối Studio (`#1a1a1a`):
```bash
python C:\Users\game\cdp_reader\scripts\remove_bg.py -i "C:\path\to\character.jpg" -o "C:\path\to\character_studio.jpg" -c "#1a1a1a"
```

### C. Tách nền và ghép vào phông trắng (`#ffffff`):
```bash
python C:\Users\game\cdp_reader\scripts\remove_bg.py -i "C:\path\to\product.jpg" -o "C:\path\to\product_white.jpg" -c "#ffffff"
```

### D. Tách nền toàn bộ thư mục (Batch Mode):
```bash
python C:\Users\game\cdp_reader\scripts\remove_bg.py -i "C:\Users\game\Downloads\product_photos\" -o "C:\Users\game\Downloads\product_photos\nobg\"
```

---

## ⚡ 3. TÍCH HỢP HỆ THỐNG SCRIPT FACTORY PRO

Khi nhận ảnh từ người dùng cho **Sản phẩm A** hoặc **Nhân vật mới**:
1. Agent chạy `remove_bg.py` để tách nền và đưa về chuẩn Studio `#1a1a1a` hoặc PNG trong suốt.
2. Đọc chuỗi Base64 kết quả ➔ Nhúng vào `master_image_base64` của `asset_manifest`.
3. Gửi sang **Google Flow Veo 3.1** với cờ `skip_generation: true` ➔ Video tạo ra giữ nguyên 100% hình thái sản phẩm/nhân vật!
