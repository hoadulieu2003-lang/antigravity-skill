---
name: telegram-search
description: >-
  Kỹ năng chuyên gia vận hành cho groupultra/telegram-search (4125 ⭐).
  Tự động kích hoạt khi người dùng muốn:
    - Tự động hóa hoặc tích hợp công cụ mã nguồn mở telegram-search vào hệ thống
    - Giải quyết các tác vụ kỹ thuật chuyên sâu liên quan đến 🔍 导出并模糊搜索 Telegram 聊天记录 | Export and fuzzy search your Telegram chat history
    - Thiết lập cấu hình và vận hành lệnh CLI của groupultra/telegram-search
  KHÔNG CẦN người dùng phải nhớ tên kỹ thuật 'telegram-search'.
---

# groupultra/telegram-search — Cẩm Nang Kỹ Năng Vận Hành Chuyên Sâu

> **Nguồn gốc**: GitHub Repository `https://github.com/groupultra/telegram-search`  
> **Độ uy tín cộng đồng**: 4125 ⭐  
> **Trạng thái Quản trị**: `CANDIDATE` (Tuân thủ FRAMEWORK_V2_CAPABILITY_AND_LEARNING_REGISTRY)  
> **Tự động đóng gói lúc**: 2026-10-16 10:42:10Z

---

## 1. Bản Chất Kiến Trúc & Giá Trị Cốt Lõi (Architectural Essence)

* **Mục tiêu cốt lõi**: 🔍 导出并模糊搜索 Telegram 聊天记录 | Export and fuzzy search your Telegram chat history
* **Lĩnh vực áp dụng**: Tự động hóa lập trình, Tác tử AI (AI Agents), và Tối ưu hóa quy trình kỹ thuật.
* **Các tính năng nổi bật được trích xuất**:
- Khả năng tự động hóa và tích hợp đa nền tảng.
- Tối ưu hóa hiệu năng và độ ổn định.

---

## 2. Thông Số Kỹ Thuật & Cú Pháp Lệnh (Specifications & Contracts)

Dưới đây là các cấu trúc lệnh và cấu hình thực thi tiêu chuẩn được trích xuất từ tài liệu chính thức:

```bash
brew tap groupultra/telegram-search https://github.com/groupultra/telegram-search
brew install groupultra/telegram-search/tg-search

tg-search profile configure --apiId YOUR_API_ID --apiHash YOUR_API_HASH
tg-search auth login
brew services start groupultra/telegram-search/tg-search
tg-search daemon status

pnpm run build:packages
pnpm -F @tg-search/cli build

pnpm cli --profile work profile configure --apiId 123456 --apiHash abcdef
pnpm cli --profile work auth login
pnpm cli --profile work chats list --json
pnpm cli --profile work sync --takeout --chat 123456 --from 2026-01-01 --to 2026-12-31 --json
pnpm cli --profile work export --from 2026-01-01 --to 2026-12-31 --output ./telegram-2026 --json
```

---

## 3. Quy Trình Vận Hành Chuẩn Mực (Step-by-Step Runbook)

1. **Khảo sát Môi trường**: Kiểm tra runtime tương thích (Python / Node.js / Docker) trên máy trạm Windows.
2. **Cài đặt & Cấu hình**: Nạp biến môi trường và thiết lập tham số an toàn trong ranh giới Sandbox.
3. **Thực thi & Tự Kiểm chứng**: Chạy thử nghiệm lệnh với phạm vi nhỏ nhất (`FAST Mode`) trước khi tích hợp vào luồng chính.
4. **Bàn giao Bằng chứng**: Xuất bằng chứng kiểm chứng (`Evidence Ledger`) xác nhận kết quả trước khi kết thúc tác vụ.

---

## 4. Các Bẫy Lỗi & Ràng Buộc An Toàn (Pitfalls & Guardrails)

* **Ràng buộc Mạng & Token**: Tuân thủ nghiêm ngặt hạn mức API và cơ chế timeout an toàn.
* **Bảo vệ Secret**: Tuyệt đối không lưu trữ khóa API hoặc token riêng tư dưới dạng văn bản thô.
* **Bảo vệ Không Gian Làm Việc**: Không tự ý ghi đè hoặc thay đổi các file cấu hình hệ sinh thái cốt lõi ngoài phạm vi.