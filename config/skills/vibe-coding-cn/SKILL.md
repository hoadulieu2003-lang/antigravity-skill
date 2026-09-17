---
name: vibe-coding-cn
description: >-
  Kỹ năng chuyên gia vận hành cho tradecatlabs/vibe-coding-cn (16237 ⭐).
  Tự động kích hoạt khi người dùng muốn:
    - Tự động hóa hoặc tích hợp công cụ mã nguồn mở vibe-coding-cn vào hệ thống
    - Giải quyết các tác vụ kỹ thuật chuyên sâu liên quan đến Vibe Coding 从入门到精通教程｜AI 结对编程工作流｜Prompt、Skill、Workflow、上下文管理、codex实战指南
    - Thiết lập cấu hình và vận hành lệnh CLI của tradecatlabs/vibe-coding-cn
  KHÔNG CẦN người dùng phải nhớ tên kỹ thuật 'vibe-coding-cn'.
---

# tradecatlabs/vibe-coding-cn — Cẩm Nang Kỹ Năng Vận Hành Chuyên Sâu

> **Nguồn gốc**: GitHub Repository `https://github.com/tradecatlabs/vibe-coding-cn`  
> **Độ uy tín cộng đồng**: 16237 ⭐  
> **Trạng thái Quản trị**: `CANDIDATE` (Tuân thủ FRAMEWORK_V2_CAPABILITY_AND_LEARNING_REGISTRY)  
> **Tự động đóng gói lúc**: 2026-09-15 19:42:11Z

---

## 1. Bản Chất Kiến Trúc & Giá Trị Cốt Lõi (Architectural Essence)

* **Mục tiêu cốt lõi**: Vibe Coding 从入门到精通教程｜AI 结对编程工作流｜Prompt、Skill、Workflow、上下文管理、codex实战指南
* **Lĩnh vực áp dụng**: Tự động hóa lập trình, Tác tử AI (AI Agents), và Tối ưu hóa quy trình kỹ thuật.
* **Các tính năng nổi bật được trích xuất**:
- `vibe-coding-cn` 是中文 Vibe Coding 从入门到精通教程，目标是把想法稳定变成可运行产品。
- **α-提示词（生成器）**：一个“母体”提示词，其唯一职责是生成其他提示词或技能。
- **Ω-提示词（优化器）**：另一个“母体”提示词，其唯一职责是优化其他提示词或技能。
* **概念是入口；不理解概念，就无法看见、触达对象**
* **只用最强模型**
* **结果主导**

---

## 2. Thông Số Kỹ Thuật & Cú Pháp Lệnh (Specifications & Contracts)

Dưới đây là các cấu trúc lệnh và cấu hình thực thi tiêu chuẩn được trích xuất từ tài liệu chính thức:

```bash
git submodule update --init --recursive
pip install -r tools/prompts-library/requirements.txt

pip install -r tools/prompts-library/scripts/requirements.txt
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