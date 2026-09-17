---
name: pinvou-agent
description: >-
  Kỹ năng chuyên gia vận hành cho Pinvou/pinvou-agent (1929 ⭐).
  Tự động kích hoạt khi người dùng muốn:
    - Tự động hóa hoặc tích hợp công cụ mã nguồn mở pinvou-agent vào hệ thống
    - Giải quyết các tác vụ kỹ thuật chuyên sâu liên quan đến Open-source desktop AI agent for tools, files, knowledge, workflows, and real deliverables
    - Thiết lập cấu hình và vận hành lệnh CLI của Pinvou/pinvou-agent
  KHÔNG CẦN người dùng phải nhớ tên kỹ thuật 'pinvou-agent'.
---

# Pinvou/pinvou-agent — Cẩm Nang Kỹ Năng Vận Hành Chuyên Sâu

> **Nguồn gốc**: GitHub Repository `https://github.com/Pinvou/pinvou-agent`  
> **Độ uy tín cộng đồng**: 1929 ⭐  
> **Trạng thái Quản trị**: `CANDIDATE` (Tuân thủ FRAMEWORK_V2_CAPABILITY_AND_LEARNING_REGISTRY)  
> **Tự động đóng gói lúc**: 2026-09-14 10:42:11Z

---

## 1. Bản Chất Kiến Trúc & Giá Trị Cốt Lõi (Architectural Essence)

* **Mục tiêu cốt lõi**: Open-source desktop AI agent for tools, files, knowledge, workflows, and real deliverables.
* **Lĩnh vực áp dụng**: Tự động hóa lập trình, Tác tử AI (AI Agents), và Tối ưu hóa quy trình kỹ thuật.
* **Các tính năng nổi bật được trích xuất**:
- **Multi-session workspace** with title search — messages, tool calls, and artifacts persist with each session
- **Attachments** for PDF, Office documents, images, and text — drag, drop, or paste them in
- **Artifact panel** automatically collects every file the agent creates or edits; preview, locate, and open them in one place
- **Editable Markdown artifacts** — edit directly, or select a passage and ask the agent to revise it
- **Plan / YOLO modes** — review the plan first for complex work, or execute directly when the task is clear
- **Memory center** captures long-term preferences and context, with explicit candidate review and confirmation

---

## 2. Thông Số Kỹ Thuật & Cú Pháp Lệnh (Specifications & Contracts)

Dưới đây là các cấu trúc lệnh và cấu hình thực thi tiêu chuẩn được trích xuất từ tài liệu chính thức:

```bash
git clone --recursive https://github.com/Pinvou/pinvou-agent.git
cd pinvou-agent/pinvou3-app
npm ci
cd ..
./pinvou3-app/run-dev.sh

git submodule update --init --recursive
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