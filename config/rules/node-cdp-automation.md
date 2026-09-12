# 🌐 Node.js & CDP Automation Engineering Rules

Quy chuẩn kỹ thuật bắt buộc cho toàn bộ các script Node.js phụ trách kết nối Chrome DevTools Protocol và tự động hoá:

## 1. Kết nối Chrome Remote Debugging & Auto-Fallback
* **Cơ chế Dual-Port Fallback:** Luôn ưu tiên kết nối Port `9222`, tự động fallback sang Port `9223`.
* **Tái sử dụng Browser Instance:** Cache biến `browser` đã kết nối, không tạo mới liên tục.

## 2. Thao tác DOM & Frame An Toàn
* **Kiểm tra frame `about:srcdoc`:** Luôn kiểm tra `frames.find(f => f.url() === 'about:srcdoc')` trước khi gọi `evaluate()`.
* **Native Setter cho Input/Textarea:** Dùng `Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set` và trigger sự kiện `input`, `change`, `blur`.
* **Timeout Bảo Vệ:** Mọi thao tác DOM phải có timeout tối đa (15-30s), không tạo loop vô tận.

## 3. Xử lý Lỗi & Rate Limit (Veo 3.1)
* **Tự động bắt lỗi Quota:** Khi phát hiện `"STOPPED ON ERROR"`, đếm ngược 5 phút (300s) trước khi bấm `RESUME AUTO PIPELINE`.
* **Dọn dẹp tài nguyên:** Reload trang sau khi render xong để giải phóng RAM.
