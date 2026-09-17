---
name: dao-code
description: >-
  Kỹ năng chuyên gia vận hành cho tigicion/dao-code (1084 ⭐).
  Tự động kích hoạt khi người dùng muốn:
    - Tự động hóa hoặc tích hợp công cụ mã nguồn mở dao-code vào hệ thống
    - Giải quyết các tác vụ kỹ thuật chuyên sâu liên quan đến Open-source TypeScript terminal coding agent for DeepSeek-V4 — builds on DeepSeek's strong price-performance and ultra-cheap cache pricing, engineering byte-
    - Thiết lập cấu hình và vận hành lệnh CLI của tigicion/dao-code
  KHÔNG CẦN người dùng phải nhớ tên kỹ thuật 'dao-code'.
---

# tigicion/dao-code — Cẩm Nang Kỹ Năng Vận Hành Chuyên Sâu

> **Nguồn gốc**: GitHub Repository `https://github.com/tigicion/dao-code`  
> **Độ uy tín cộng đồng**: 1084 ⭐  
> **Trạng thái Quản trị**: `CANDIDATE` (Tuân thủ FRAMEWORK_V2_CAPABILITY_AND_LEARNING_REGISTRY)  
> **Tự động đóng gói lúc**: 2026-09-16 13:42:10Z

---

## 1. Bản Chất Kiến Trúc & Giá Trị Cốt Lõi (Architectural Essence)

* **Mục tiêu cốt lõi**: Open-source TypeScript terminal coding agent for DeepSeek-V4 — builds on DeepSeek's strong price-performance and ultra-cheap cache pricing, engineering byte-...
* **Lĩnh vực áp dụng**: Tự động hóa lập trình, Tác tử AI (AI Agents), và Tối ưu hóa quy trình kỹ thuật.
* **Các tính năng nổi bật được trích xuất**:
- **Claude Code** needs an Anthropic account and network access — a high bar to use out of the box in mainland China;
- **GLM's Coding Plan** has scarce quota that's often hard to grab;
- **Low unit price** — DeepSeek sits at the lowest price tier among mainstream capable models; both input and output prices are far below the top-tier closed models.
- `@` to reference a file: type `@` + a path fragment to list matches, `Tab` to complete.
- **Modes**: in plan mode, even a write/exec tool request is denied for the turn by the per-turn allow table (read-only + propose); normal mode runs as usual.
- **Cache & compaction**: the system prefix is pinned to ride DeepSeek's prefix cache; near the 1M context limit early messages are auto-compacted into a summary.

---

## 2. Thông Số Kỹ Thuật & Cú Pháp Lệnh (Specifications & Contracts)

Dưới đây là các cấu trúc lệnh và cấu hình thực thi tiêu chuẩn được trích xuất từ tài liệu chính thức:

```bash
curl -fsSL https://raw.githubusercontent.com/tigicion/dao-code/master/install.sh | sh

npx dao-code        # zero-install trial
npm i -g dao-code   # global install, command name dao
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