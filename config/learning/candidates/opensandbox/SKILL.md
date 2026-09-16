---
name: opensandbox
description: >-
  Kỹ năng chuyên gia vận hành cho opensandbox-group/OpenSandbox (15341 ⭐).
  Tự động kích hoạt khi người dùng muốn:
    - Tự động hóa hoặc tích hợp công cụ mã nguồn mở opensandbox vào hệ thống
    - Giải quyết các tác vụ kỹ thuật chuyên sâu liên quan đến Secure, Fast, and Extensible Sandbox runtime for AI agents
    - Thiết lập cấu hình và vận hành lệnh CLI của opensandbox-group/OpenSandbox
  KHÔNG CẦN người dùng phải nhớ tên kỹ thuật 'opensandbox'.
---

# opensandbox-group/OpenSandbox — Cẩm Nang Kỹ Năng Vận Hành Chuyên Sâu

> **Nguồn gốc**: GitHub Repository `https://github.com/opensandbox-group/OpenSandbox`  
> **Độ uy tín cộng đồng**: 15341 ⭐  
> **Trạng thái Quản trị**: `CANDIDATE` (Tuân thủ FRAMEWORK_V2_CAPABILITY_AND_LEARNING_REGISTRY)  
> **Tự động đóng gói lúc**: 2026-09-16 10:24:19Z

---

## 1. Bản Chất Kiến Trúc & Giá Trị Cốt Lõi (Architectural Essence)

* **Mục tiêu cốt lõi**: Secure, Fast, and Extensible Sandbox runtime for AI agents.
* **Lĩnh vực áp dụng**: Tự động hóa lập trình, Tác tử AI (AI Agents), và Tối ưu hóa quy trình kỹ thuật.
* **Các tính năng nổi bật được trích xuất**:
- **[code-interpreter](docs/examples/code-interpreter.md)** - End-to-end Code Interpreter SDK workflow in a sandbox.
- **[aio-sandbox](docs/examples/aio-sandbox.md)** - All-in-One sandbox setup using the OpenSandbox SDK.
- **[langgraph](docs/examples/langgraph.md)** - LangGraph state-machine workflow that creates/runs a sandbox job with fallback retry.
- **[google-adk](docs/examples/google-adk.md)** - Google ADK agent using OpenSandbox tools to write/read files and run commands.
- **[openclaw](docs/examples/openclaw.md)** - Launch an OpenClaw Gateway inside a sandbox.
- **[chrome](docs/examples/chrome.md)** - Chromium sandbox with VNC and DevTools access for automation and debugging.

---

## 2. Thông Số Kỹ Thuật & Cú Pháp Lệnh (Specifications & Contracts)

Dưới đây là các cấu trúc lệnh và cấu hình thực thi tiêu chuẩn được trích xuất từ tài liệu chính thức:

```bash
pip install opensandbox

npm install @alibaba-group/opensandbox
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