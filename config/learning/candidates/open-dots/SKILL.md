---
name: open-dots
description: >-
  Kỹ năng chuyên gia vận hành cho Anil-matcha/open-dots (5501 ⭐).
  Tự động kích hoạt khi người dùng muốn:
    - Tự động hóa hoặc tích hợp công cụ mã nguồn mở open-dots vào hệ thống
    - Giải quyết các tác vụ kỹ thuật chuyên sâu liên quan đến Open-source, self-hosted AI agent workspace and alternative to OpenAI Dots, Meta Muse, Grok Bot, Instinct, Manus Cue, Claude Cowork, and ChatGPT agent
    - Thiết lập cấu hình và vận hành lệnh CLI của Anil-matcha/open-dots
  KHÔNG CẦN người dùng phải nhớ tên kỹ thuật 'open-dots'.
---

# Anil-matcha/open-dots — Cẩm Nang Kỹ Năng Vận Hành Chuyên Sâu

> **Nguồn gốc**: GitHub Repository `https://github.com/Anil-matcha/open-dots`  
> **Độ uy tín cộng đồng**: 5501 ⭐  
> **Trạng thái Quản trị**: `CANDIDATE` (Tuân thủ FRAMEWORK_V2_CAPABILITY_AND_LEARNING_REGISTRY)  
> **Tự động đóng gói lúc**: 2026-10-07 04:42:10Z

---

## 1. Bản Chất Kiến Trúc & Giá Trị Cốt Lõi (Architectural Essence)

* **Mục tiêu cốt lõi**: Open-source, self-hosted AI agent workspace and alternative to OpenAI Dots, Meta Muse, Grok Bot, Instinct, Manus Cue, Claude Cowork, and ChatGPT agent. MIT-l...
* **Lĩnh vực áp dụng**: Tự động hóa lập trình, Tác tử AI (AI Agents), và Tối ưu hóa quy trình kỹ thuật.
* **Các tính năng nổi bật được trích xuất**:
- **`poll_due_schedules`** — claims schedules whose `next_run_at` has
- **`sync_active_tasks`** — finishes tasks that have no one polling them,
- **`report_finished_runs`** — for each finished scheduled run, reported
- **Telegram**: a message with **Allow once** / **Always allow** / **Deny**
- **Web UI**: the same three choices appear inline on the task once it's

---

## 2. Thông Số Kỹ Thuật & Cú Pháp Lệnh (Specifications & Contracts)

Dưới đây là các cấu trúc lệnh và cấu hình thực thi tiêu chuẩn được trích xuất từ tài liệu chính thức:

```bash
cd backend
docker compose up -d                      # Postgres
uv sync                                   # install deps
uv run alembic upgrade head               # migrations
uv run fastapi dev app/main.py            # API (terminal 1)
uv run python -m app.telegram_bot         # bot (terminal 2)

cd ../frontend
npm install && npm run dev                # web UI (terminal 3)
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