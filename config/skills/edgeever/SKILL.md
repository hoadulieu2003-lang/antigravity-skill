---
name: edgeever
description: >-
  Kỹ năng chuyên gia vận hành cho tianma-if/edgeever (1420 ⭐).
  Tự động kích hoạt khi người dùng muốn:
    - Tự động hóa hoặc tích hợp công cụ mã nguồn mở edgeever vào hệ thống
    - Giải quyết các tác vụ kỹ thuật chuyên sâu liên quan đến Open-source, AI-native knowledge base & Evernote alternative with native MCP
    - Thiết lập cấu hình và vận hành lệnh CLI của tianma-if/edgeever
  KHÔNG CẦN người dùng phải nhớ tên kỹ thuật 'edgeever'.
---

# tianma-if/edgeever — Cẩm Nang Kỹ Năng Vận Hành Chuyên Sâu

> **Nguồn gốc**: GitHub Repository `https://github.com/tianma-if/edgeever`  
> **Độ uy tín cộng đồng**: 1420 ⭐  
> **Trạng thái Quản trị**: `CANDIDATE` (Tuân thủ FRAMEWORK_V2_CAPABILITY_AND_LEARNING_REGISTRY)  
> **Tự động đóng gói lúc**: 2026-09-15 16:42:08Z

---

## 1. Bản Chất Kiến Trúc & Giá Trị Cốt Lõi (Architectural Essence)

* **Mục tiêu cốt lõi**: Open-source, AI-native knowledge base & Evernote alternative with native MCP. Zero-cost on Cloudflare or Docker.
* **Lĩnh vực áp dụng**: Tự động hóa lập trình, Tác tử AI (AI Agents), và Tối ưu hóa quy trình kỹ thuật.
* **Các tính năng nổi bật được trích xuất**:
* **Memos & Stream Notes**: Clean and simple, but their social-timeline layouts differ fundamentally from the structured productivity of a classic three-pane workflow.
- **Rich Plugin API**: Extend EdgeEver with the [Plugin API](docs/plugin-development.md).
- **Unlimited Multi-Device Sync**: No commercial device caps or paywalls. Enjoy seamless synchronization across PC, tablet, and mobile via web, PWA, or browser.
- **Classic Three-Pane Layout & Focus Mode**: Clean navigation featuring notebook trees, note lists, and an expansive editor, with a desktop focus mode to eliminate distractions.
- **Unlimited Nested Notebooks**: Organize your knowledge with arbitrary folder depth.
- **Seamless Dual-View Editor**: Switch effortlessly between intuitive rich text editing and Markdown source code on desktop.

---

## 2. Thông Số Kỹ Thuật & Cú Pháp Lệnh (Specifications & Contracts)

Dưới đây là các cấu trúc lệnh và cấu hình thực thi tiêu chuẩn được trích xuất từ tài liệu chính thức:

```bash
curl -fsSL https://edgeever.org/install.sh | bash

bun install
bun run dev
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