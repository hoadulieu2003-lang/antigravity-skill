---
name: bitterbot-desktop
description: >-
  Kỹ năng chuyên gia vận hành cho Bitterbot-AI/bitterbot-desktop (2478 ⭐).
  Tự động kích hoạt khi người dùng muốn:
    - Tự động hóa hoặc tích hợp công cụ mã nguồn mở bitterbot-desktop vào hệ thống
    - Giải quyết các tác vụ kỹ thuật chuyên sâu liên quan đến Bitterbot - a mesh of agents that turns shared experience into collective capability
    - Thiết lập cấu hình và vận hành lệnh CLI của Bitterbot-AI/bitterbot-desktop
  KHÔNG CẦN người dùng phải nhớ tên kỹ thuật 'bitterbot-desktop'.
---

# Bitterbot-AI/bitterbot-desktop — Cẩm Nang Kỹ Năng Vận Hành Chuyên Sâu

> **Nguồn gốc**: GitHub Repository `https://github.com/Bitterbot-AI/bitterbot-desktop`  
> **Độ uy tín cộng đồng**: 2478 ⭐  
> **Trạng thái Quản trị**: `CANDIDATE` (Tuân thủ FRAMEWORK_V2_CAPABILITY_AND_LEARNING_REGISTRY)  
> **Tự động đóng gói lúc**: 2026-10-28 19:42:11Z

---

## 1. Bản Chất Kiến Trúc & Giá Trị Cốt Lõi (Architectural Essence)

* **Mục tiêu cốt lõi**: Bitterbot - a mesh of agents that turns shared experience into collective capability.
* **Lĩnh vực áp dụng**: Tự động hóa lập trình, Tác tử AI (AI Agents), và Tối ưu hóa quy trình kỹ thuật.
* **Các tính năng nổi bật được trích xuất**:
- **Friends' agents are untrusted input.** Their messages are scanned, can never trigger a tool, and never enter your agent's searchable memory.
- **Nothing private leaves by default.** Disclosure requests are denied unless you allow a category for a circle, and even then the answer waits for you.
- **Tamper-evident.** Shared notes and expenses are signed, hash-chained events; corrections are reversals, never edits.
- **Offline delivery.** Relay mailboxes hold messages encrypted to the recipient, so the mailbox host cannot read them.
- **Shortcuts follow the newest model.** `opus`, `sonnet`, `haiku`, and `fable` point at the newest model of that family your provider serves.
- **Costs are tracked per model** from live provider prices. Estimates are marked `~$`, and `bitterbot doctor` flags models it cannot price.

---

## 2. Thông Số Kỹ Thuật & Cú Pháp Lệnh (Specifications & Contracts)

Dưới đây là các cấu trúc lệnh và cấu hình thực thi tiêu chuẩn được trích xuất từ tài liệu chính thức:

```bash
curl -fsSL https://github.com/Bitterbot-AI/bitterbot-desktop/releases/latest/download/install.sh | bash

irm https://raw.githubusercontent.com/Bitterbot-AI/bitterbot-desktop/main/scripts/install.ps1 | iex
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