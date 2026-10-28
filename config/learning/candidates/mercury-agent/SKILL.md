---
name: mercury-agent
description: >-
  Kỹ năng chuyên gia vận hành cho cosmicstack-labs/mercury-agent (3680 ⭐).
  Tự động kích hoạt khi người dùng muốn:
    - Tự động hóa hoặc tích hợp công cụ mã nguồn mở mercury-agent vào hệ thống
    - Giải quyết các tác vụ kỹ thuật chuyên sâu liên quan đến Soul-driven AI agent with permission-hardened tools, token budgets, and multi-channel access
    - Thiết lập cấu hình và vận hành lệnh CLI của cosmicstack-labs/mercury-agent
  KHÔNG CẦN người dùng phải nhớ tên kỹ thuật 'mercury-agent'.
---

# cosmicstack-labs/mercury-agent — Cẩm Nang Kỹ Năng Vận Hành Chuyên Sâu

> **Nguồn gốc**: GitHub Repository `https://github.com/cosmicstack-labs/mercury-agent`  
> **Độ uy tín cộng đồng**: 3680 ⭐  
> **Trạng thái Quản trị**: `CANDIDATE` (Tuân thủ FRAMEWORK_V2_CAPABILITY_AND_LEARNING_REGISTRY)  
> **Tự động đóng gói lúc**: 2026-10-28 22:42:10Z

---

## 1. Bản Chất Kiến Trúc & Giá Trị Cốt Lõi (Architectural Essence)

* **Mục tiêu cốt lõi**: Soul-driven AI agent with permission-hardened tools, token budgets, and multi-channel access. Runs 24/7 from CLI, Telegram or More.
* **Lĩnh vực áp dụng**: Tự động hóa lập trình, Tác tử AI (AI Agents), và Tối ưu hóa quy trình kỹ thuật.
* **Các tính năng nổi bật được trích xuất**:
- **Mercury Code** turns it into a careful pair programmer inside your repository, one that only says "done" after the tests pass.
- **AUTO mode:** plans and builds in one pass, and asks once before large or risky changes.
- **Verified completion:** a task ends as done only when a build, test or typecheck ran and passed. Otherwise it stops and names the blocker.
- **Live plan:** every step is shown as pending, active or done.
- **Background work:** `/code agent <task>` hands a task to a sub-agent while you keep working.
- **Workspace view:** `/ws` to browse, stage, commit and undo; `/code diff` for a colored diff.

---

## 2. Thông Số Kỹ Thuật & Cú Pháp Lệnh (Specifications & Contracts)

Dưới đây là các cấu trúc lệnh và cấu hình thực thi tiêu chuẩn được trích xuất từ tài liệu chính thức:

```bash
# macOS / Linux
curl -fsSL https://mercuryagent.sh/install.sh | sh

# Windows (PowerShell)
irm https://mercuryagent.sh/install.ps1 | iex
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