---
name: kun
description: >-
  Kỹ năng chuyên gia vận hành cho KunAgent/Kun (6315 ⭐).
  Tự động kích hoạt khi người dùng muốn:
    - Tự động hóa hoặc tích hợp công cụ mã nguồn mở kun vào hệ thống
    - Giải quyết các tác vụ kỹ thuật chuyên sâu liên quan đến Local-first AI agent workspace for coding, writing, design, research, and automation — one runtime for desktop GUI and TUI
    - Thiết lập cấu hình và vận hành lệnh CLI của KunAgent/Kun
  KHÔNG CẦN người dùng phải nhớ tên kỹ thuật 'kun'.
---

# KunAgent/Kun — Cẩm Nang Kỹ Năng Vận Hành Chuyên Sâu

> **Nguồn gốc**: GitHub Repository `https://github.com/KunAgent/Kun`  
> **Độ uy tín cộng đồng**: 6315 ⭐  
> **Trạng thái Quản trị**: `CANDIDATE` (Tuân thủ FRAMEWORK_V2_CAPABILITY_AND_LEARNING_REGISTRY)  
> **Tự động đóng gói lúc**: 2026-10-18 04:42:09Z

---

## 1. Bản Chất Kiến Trúc & Giá Trị Cốt Lõi (Architectural Essence)

* **Mục tiêu cốt lõi**: Local-first AI agent workspace for coding, writing, design, research, and automation — one runtime for desktop GUI and TUI.
* **Lĩnh vực áp dụng**: Tự động hóa lập trình, Tác tử AI (AI Agents), và Tối ưu hóa quy trình kỹ thuật.
* **Các tính năng nổi bật được trích xuất**:
- **数据在本机。** 会话、记忆、日志存在本地；用云端模型时，只有本次请求的上下文发给你选的 Provider。
- **动手先确认。** 工具、目录和工作台权限默认需要批准；记忆和群聊不会扩大权限。
- **模型随你换。** DeepSeek、Kimi、GLM、Qwen、Ollama 等预设，也可自定义 Provider。
- **GUI 与 TUI 共用。** 同一个 `kun serve` 运行时，线程、计划和审批两边都能接着用。

---

## 2. Thông Số Kỹ Thuật & Cú Pháp Lệnh (Specifications & Contracts)

Dưới đây là các cấu trúc lệnh và cấu hình thực thi tiêu chuẩn được trích xuất từ tài liệu chính thức:

```bash
git clone --branch develop https://github.com/KunAgent/Kun.git
cd Kun && npm ci && npm run dev
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