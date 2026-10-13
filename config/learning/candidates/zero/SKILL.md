---
name: zero
description: >-
  Kỹ năng chuyên gia vận hành cho Twigpine/zero (1700 ⭐).
  Tự động kích hoạt khi người dùng muốn:
    - Tự động hóa hoặc tích hợp công cụ mã nguồn mở zero vào hệ thống
    - Giải quyết các tác vụ kỹ thuật chuyên sâu liên quan đến The coding agent that answers to you, your model, your machine, your rules
    - Thiết lập cấu hình và vận hành lệnh CLI của Twigpine/zero
  KHÔNG CẦN người dùng phải nhớ tên kỹ thuật 'zero'.
---

# Twigpine/zero — Cẩm Nang Kỹ Năng Vận Hành Chuyên Sâu

> **Nguồn gốc**: GitHub Repository `https://github.com/Twigpine/zero`  
> **Độ uy tín cộng đồng**: 1700 ⭐  
> **Trạng thái Quản trị**: `CANDIDATE` (Tuân thủ FRAMEWORK_V2_CAPABILITY_AND_LEARNING_REGISTRY)  
> **Tự động đóng gói lúc**: 2026-10-13 01:42:09Z

---

## 1. Bản Chất Kiến Trúc & Giá Trị Cốt Lõi (Architectural Essence)

* **Mục tiêu cốt lõi**: The coding agent that answers to you, your model, your machine, your rules.
* **Lĩnh vực áp dụng**: Tự động hóa lập trình, Tác tử AI (AI Agents), và Tối ưu hóa quy trình kỹ thuật.
* **Các tính năng nổi bật được trích xuất**:
- **Use the model you want.** Bring OpenAI, Anthropic, Gemini, Groq, OpenRouter,
- **Stay in control.** File writes, shell commands, network access, and
- **Works in the terminal.** The TUI has model/provider pickers, image input,
- **Works without the TUI.** `zero exec` is scriptable, supports text/JSON/
- **Keeps context local.** Sessions are stored on disk, searchable, resumable,
- **Extensible when you need it.** Use MCP servers, skills, plugins, hooks, and

---

## 2. Thông Số Kỹ Thuật & Cú Pháp Lệnh (Specifications & Contracts)

Dưới đây là các cấu trúc lệnh và cấu hình thực thi tiêu chuẩn được trích xuất từ tài liệu chính thức:

```bash
npm install -g @gitlawb/zero
zero

curl -fsSL https://raw.githubusercontent.com/Gitlawb/zero/main/scripts/install.sh | bash
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