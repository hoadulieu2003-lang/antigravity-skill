---
name: octop
description: >-
  Kỹ năng chuyên gia vận hành cho TencentCloud/Octop (4690 ⭐).
  Tự động kích hoạt khi người dùng muốn:
    - Tự động hóa hoặc tích hợp công cụ mã nguồn mở octop vào hệ thống
    - Giải quyết các tác vụ kỹ thuật chuyên sâu liên quan đến A smarter, self-hosted AI assistant — multi-user, multi-agent
    - Thiết lập cấu hình và vận hành lệnh CLI của TencentCloud/Octop
  KHÔNG CẦN người dùng phải nhớ tên kỹ thuật 'octop'.
---

# TencentCloud/Octop — Cẩm Nang Kỹ Năng Vận Hành Chuyên Sâu

> **Nguồn gốc**: GitHub Repository `https://github.com/TencentCloud/Octop`  
> **Độ uy tín cộng đồng**: 4690 ⭐  
> **Trạng thái Quản trị**: `CANDIDATE` (Tuân thủ FRAMEWORK_V2_CAPABILITY_AND_LEARNING_REGISTRY)  
> **Tự động đóng gói lúc**: 2026-09-23 07:42:37Z

---

## 1. Bản Chất Kiến Trúc & Giá Trị Cốt Lõi (Architectural Essence)

* **Mục tiêu cốt lõi**: A smarter, self-hosted AI assistant — multi-user, multi-agent.
* **Lĩnh vực áp dụng**: Tự động hóa lập trình, Tác tử AI (AI Agents), và Tối ưu hóa quy trình kỹ thuật.
* **Các tính năng nổi bật được trích xuất**:
- **Personal assistant** — let a dedicated agent write weekly reports, organize notes, and manage your schedule; memory persists with the workspace.
- **Family sharing** — one admin account, the whole household; assign different agents and experts per member.
- **Team helper** — multiple agents collaborate in parallel, bridging Feishu / DingTalk / WeCom to route tasks into group chats.
- **Developer boost** — delegate coding tasks to OpenCode / Claude Code via ACP, or troubleshoot from the terminal with AI assistance.
- **Web automation** — use Browser AI+ to fill forms, capture screenshots, and gather public info.
- **Scheduled tasks** — configure cron in natural language so the agent pushes or runs jobs on time every day.

---

## 2. Thông Số Kỹ Thuật & Cú Pháp Lệnh (Specifications & Contracts)

Dưới đây là các cấu trúc lệnh và cấu hình thực thi tiêu chuẩn được trích xuất từ tài liệu chính thức:

```bash
curl -fsSL https://finnie-1258344699.cos.ap-guangzhou.myqcloud.com/octop/install.sh | bash

irm https://finnie-1258344699.cos.ap-guangzhou.myqcloud.com/octop/install.ps1 | iex
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