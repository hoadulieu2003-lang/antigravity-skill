---
name: learn-claude-code
description: >-
  Kỹ năng chuyên gia vận hành cho shareAI-lab/learn-claude-code (79296 ⭐).
  Tự động kích hoạt khi người dùng muốn:
    - Tự động hóa hoặc tích hợp công cụ mã nguồn mở learn-claude-code vào hệ thống
    - Giải quyết các tác vụ kỹ thuật chuyên sâu liên quan đến Bash is all you need - A nano claude code–like 「agent harness」, built from 0 to 1
    - Thiết lập cấu hình và vận hành lệnh CLI của shareAI-lab/learn-claude-code
  KHÔNG CẦN người dùng phải nhớ tên kỹ thuật 'learn-claude-code'.
---

# shareAI-lab/learn-claude-code — Cẩm Nang Kỹ Năng Vận Hành Chuyên Sâu

> **Nguồn gốc**: GitHub Repository `https://github.com/shareAI-lab/learn-claude-code`  
> **Độ uy tín cộng đồng**: 79296 ⭐  
> **Trạng thái Quản trị**: `CANDIDATE` (Tuân thủ FRAMEWORK_V2_CAPABILITY_AND_LEARNING_REGISTRY)  
> **Tự động đóng gói lúc**: 2026-10-27 04:42:14Z

---

## 1. Bản Chất Kiến Trúc & Giá Trị Cốt Lõi (Architectural Essence)

* **Mục tiêu cốt lõi**: Bash is all you need - A nano claude code–like 「agent harness」, built from 0 to 1
* **Lĩnh vực áp dụng**: Tự động hóa lập trình, Tác tử AI (AI Agents), và Tối ưu hóa quy trình kỹ thuật.
* **Các tính năng nổi bật được trích xuất**:
- **Curate knowledge.** Give the agent domain expertise. Product documentation, architecture decision records, style guides, compliance requirements. Load on demand, not upfront.
- **Current track: root-level `s01-s17`**
- **Legacy transition track: `docs/` and `agents/`**
- **Heartbeat** -- every 30 seconds the harness sends the agent a message, letting it check for pending work. Nothing to do? Keep sleeping. Something appeared? Act immediately.
- **Cron** -- the agent can schedule its own future tasks, which fire automatically when the time arrives.

---

## 2. Thông Số Kỹ Thuật & Cú Pháp Lệnh (Specifications & Contracts)

Dưới đây là các cấu trúc lệnh và cấu hình thực thi tiêu chuẩn được trích xuất từ tài liệu chính thức:

```bash
s08_context_compact/
  README.md              # English, the default chapter README
  README.zh.md           # Chinese translation
  README.ja.md           # Japanese translation
  code.py                # standalone runnable implementation
  images/                # SVG diagrams (where needed)

git clone https://github.com/shareAI-lab/learn-claude-code
cd learn-claude-code
pip install -r requirements.txt
cp .env.example .env   # configure ANTHROPIC_API_KEY

python s01_agent_loop/code.py        # Start here -- one loop + bash
python s08_context_compact/code.py   # Context compaction (complex)
python s17_goal_loop/code.py         # Endpoint: continue until a checkable goal is met
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