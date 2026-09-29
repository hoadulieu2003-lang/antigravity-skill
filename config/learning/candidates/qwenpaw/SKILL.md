---
name: qwenpaw
description: >-
  Kỹ năng chuyên gia vận hành cho agentscope-ai/QwenPaw (35327 ⭐).
  Tự động kích hoạt khi người dùng muốn:
    - Tự động hóa hoặc tích hợp công cụ mã nguồn mở qwenpaw vào hệ thống
    - Giải quyết các tác vụ kỹ thuật chuyên sâu liên quan đến Your Personal AI Assistant; easy to install, deploy on your own machine or on the cloud; supports multiple chat apps with easily extensible capabilities
    - Thiết lập cấu hình và vận hành lệnh CLI của agentscope-ai/QwenPaw
  KHÔNG CẦN người dùng phải nhớ tên kỹ thuật 'qwenpaw'.
---

# agentscope-ai/QwenPaw — Cẩm Nang Kỹ Năng Vận Hành Chuyên Sâu

> **Nguồn gốc**: GitHub Repository `https://github.com/agentscope-ai/QwenPaw`  
> **Độ uy tín cộng đồng**: 35327 ⭐  
> **Trạng thái Quản trị**: `CANDIDATE` (Tuân thủ FRAMEWORK_V2_CAPABILITY_AND_LEARNING_REGISTRY)  
> **Tự động đóng gói lúc**: 2026-09-29 01:42:25Z

---

## 1. Bản Chất Kiến Trúc & Giá Trị Cốt Lõi (Architectural Essence)

* **Mục tiêu cốt lõi**: Your Personal AI Assistant; easy to install, deploy on your own machine or on the cloud; supports multiple chat apps with easily extensible capabilities.
* **Lĩnh vực áp dụng**: Tự động hóa lập trình, Tác tử AI (AI Agents), và Tối ưu hóa quy trình kỹ thuật.
* **Các tính năng nổi bật được trích xuất**:
- **Automation & scheduling**: Set up recurring tasks — news digests, report generation, multi-channel broadcasting — all on your schedule.
- **Code & development**: Read, edit, review, and test code in your projects with the unified file workspace.
- **Document processing**: Read, write, and convert PDF, Word, Excel, and PowerPoint files.
- **Information gathering**: Search the web, follow subscriptions, summarize videos, and find what you need in your personal knowledge base.
- **Multi-channel ops**: Push alerts, summaries, or AI-generated content to DingTalk, Lark, Discord, Telegram, and more — simultaneously or per channel.
- **Custom workflows**: Combine built-in capabilities, plugins, and scheduled tasks into workflows tailored to your needs.

---

## 2. Thông Số Kỹ Thuật & Cú Pháp Lệnh (Specifications & Contracts)

Dưới đây là các cấu trúc lệnh và cấu hình thực thi tiêu chuẩn được trích xuất từ tài liệu chính thức:

```bash
pip install qwenpaw
qwenpaw init --defaults
qwenpaw app

curl -fsSL https://qwenpaw.agentscope.io/install.sh | bash
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