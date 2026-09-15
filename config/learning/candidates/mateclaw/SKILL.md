---
name: mateclaw
description: >-
  Kỹ năng chuyên gia vận hành cho mateaix/mateclaw (1104 ⭐).
  Tự động kích hoạt khi người dùng muốn:
    - Tự động hóa hoặc tích hợp công cụ mã nguồn mở mateclaw vào hệ thống
    - Giải quyết các tác vụ kỹ thuật chuyên sâu liên quan đến 🤖 MateClaw — Your second brain with Multi-Agent Orchestration, MCP Protocol, Skills & Memory, Dream, and Multi-Channel Support
    - Thiết lập cấu hình và vận hành lệnh CLI của mateaix/mateclaw
  KHÔNG CẦN người dùng phải nhớ tên kỹ thuật 'mateclaw'.
---

# mateaix/mateclaw — Cẩm Nang Kỹ Năng Vận Hành Chuyên Sâu

> **Nguồn gốc**: GitHub Repository `https://github.com/mateaix/mateclaw`  
> **Độ uy tín cộng đồng**: 1104 ⭐  
> **Trạng thái Quản trị**: `CANDIDATE` (Tuân thủ FRAMEWORK_V2_CAPABILITY_AND_LEARNING_REGISTRY)  
> **Tự động đóng gói lúc**: 2026-09-15 01:42:11Z

---

## 1. Bản Chất Kiến Trúc & Giá Trị Cốt Lõi (Architectural Essence)

* **Mục tiêu cốt lõi**: 🤖 MateClaw — Your second brain with Multi-Agent Orchestration, MCP Protocol, Skills & Memory, Dream, and Multi-Channel Support. Built on Spring AI Alibaba.
* **Lĩnh vực áp dụng**: Tự động hóa lập trình, Tác tử AI (AI Agents), và Tối ưu hóa quy trình kỹ thuật.
* **Các tính năng nổi bật được trích xuất**:
- **Workspace memory** — `AGENTS.md`, `SOUL.md`, `PROFILE.md`, `MEMORY.md`, daily notes
- **ACP** — bring top-tier coding agents like Claude Code and Codex in as employees, auto-bridged to skill cards with wrapper tools
- **Tool Guard** — RBAC + approval flow + path protection. Capability needs boundaries
- **Agent interoperability** — inbound and outbound A2A with Agent Cards, JSON-RPC / SSE tasks, authentication, idempotency, and guarded network boundaries
- **Replayable execution** — live `<think>` extraction, every reasoning iteration in emission order with real duration, superseded narration, and linear trajectory export
- **Capabilities reach operations** — proactive IM push, targeted Cron delivery, model-specific context windows, progressive tool disclosure, and tool-backed action completion

---

## 2. Thông Số Kỹ Thuật & Cú Pháp Lệnh (Specifications & Contracts)

Dưới đây là các cấu trúc lệnh và cấu hình thực thi tiêu chuẩn được trích xuất từ tài liệu chính thức:

```bash
# Backend
cd mateclaw-server
mvn spring-boot:run           # http://localhost:18088

# Frontend
cd mateclaw-ui
npm install && npm run dev    # http://localhost:5173

cp .env.example .env
docker compose up -d          # http://localhost:18080
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