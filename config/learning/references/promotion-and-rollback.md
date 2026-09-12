# Promotion, Versioning & Rollback Protocol

## 1. Cổng Phê Duyệt Con Người (Human Promotion Gate)

Chỉ có 3 quyết định hợp lệ từ Anh (Product Owner):
1. **`APPROVE`**: Ứng viên được cấp phiên bản, ghi vào `registry.yaml`, tích hợp vào rules/skills tương ứng.
2. **`APPROVE_WITH_CHANGES`**: Hiệu chỉnh phạm vi (ví dụ: hạ từ GLOBAL xuống DOMAIN), cập nhật nội dung trước khi ban hành.
3. **`REJECT`**: Đưa ứng viên vào danh mục `rejected/`, lưu lý do từ chối để tránh tái đề xuất.

## 2. Quy Trình Thu Hồi & Xử Lý Mâu Thuẫn (Rollback & Contradiction)

- Mỗi quy tắc/skill được promote đều mang `version` và `rollback_action`.
- Khi xuất hiện bằng chứng mới mâu thuẫn với quy tắc cũ:
  - Hệ thống **KHÔNG TỰ Ý GHI ĐÈ** luật cũ.
  - Hệ thống đánh dấu cờ mâu thuẫn (`CONTRADICTION_FLAG`), đóng băng cả 2 bằng chứng và trình lên Anh phân xử.
