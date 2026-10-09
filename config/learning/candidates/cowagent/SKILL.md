---
name: cowagent
description: >-
  Kỹ năng chuyên gia vận hành cho zhayujie/CowAgent (47300 ⭐).
  Tự động kích hoạt khi người dùng muốn:
    - Tự động hóa hoặc tích hợp công cụ mã nguồn mở cowagent vào hệ thống
    - Giải quyết các tác vụ kỹ thuật chuyên sâu liên quan đến Open-source personal AI assistant & Agent Harness
    - Thiết lập cấu hình và vận hành lệnh CLI của zhayujie/CowAgent
  KHÔNG CẦN người dùng phải nhớ tên kỹ thuật 'cowagent'.
---

# zhayujie/CowAgent — Cẩm Nang Kỹ Năng Vận Hành Chuyên Sâu

> **Nguồn gốc**: GitHub Repository `https://github.com/zhayujie/CowAgent`  
> **Độ uy tín cộng đồng**: 47300 ⭐  
> **Trạng thái Quản trị**: `CANDIDATE` (Tuân thủ FRAMEWORK_V2_CAPABILITY_AND_LEARNING_REGISTRY)  
> **Tự động đóng gói lúc**: 2026-10-09 10:42:09Z

---

## 1. Bản Chất Kiến Trúc & Giá Trị Cốt Lõi (Architectural Essence)

* **Mục tiêu cốt lõi**: Open-source personal AI assistant & Agent Harness. Plans tasks, runs tools and skills, self-evolves with memory and knowledge. Multi-agent, multi-model, mult...
* **Lĩnh vực áp dụng**: Tự động hóa lập trình, Tác tử AI (AI Agents), và Tối ưu hóa quy trình kỹ thuật.
* **Các tính năng nổi bật được trích xuất**:
- **[Skill Hub](https://skills.cowagent.ai/)** — open skill marketplace: browse, search, install in one click
- **GitHub / ClawHub / URL and more** — install skills from any source
- **Conversational authoring** — generate custom skills through dialogue with `skill-creator`; turn any workflow or third-party API into a reusable skill
- **[Cow Skill Hub](https://github.com/zhayujie/cow-skill-hub)** — open skill marketplace for AI Agents; works with CowAgent, OpenClaw, Claude Code, and more
- **[bot-on-anything](https://github.com/zhayujie/bot-on-anything)** — lightweight LLM application framework with integrations for Slack, Telegram, Discord, Gmail, and more
- **[AgentMesh](https://github.com/MinimalFuture/AgentMesh)** — open-source multi-agent framework for solving complex problems through team collaboration

---

## 2. Thông Số Kỹ Thuật & Cú Pháp Lệnh (Specifications & Contracts)

Dưới đây là các cấu trúc lệnh và cấu hình thực thi tiêu chuẩn được trích xuất từ tài liệu chính thức:

```bash
bash <(curl -fsSL https://cdn.link-ai.tech/code/cow/run.sh)

irm https://cdn.link-ai.tech/code/cow/run.ps1 | iex
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