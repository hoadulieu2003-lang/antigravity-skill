---
name: claude-code-book
description: >-
  Kỹ năng chuyên gia vận hành cho lintsinghua/claude-code-book (4346 ⭐).
  Tự động kích hoạt khi người dùng muốn:
    - Tự động hóa hoặc tích hợp công cụ mã nguồn mở claude-code-book vào hệ thống
    - Giải quyết các tác vụ kỹ thuật chuyên sâu liên quan đến 《御舆：解码 Agent Harness》42万字拆解 AI Agent 的Harness骨架与神经 —— Claude Code 架构深度剖析，15 章从对话循环到构建你自己的 Agent Harness。在线阅读网站：
    - Thiết lập cấu hình và vận hành lệnh CLI của lintsinghua/claude-code-book
  KHÔNG CẦN người dùng phải nhớ tên kỹ thuật 'claude-code-book'.
---

# lintsinghua/claude-code-book — Cẩm Nang Kỹ Năng Vận Hành Chuyên Sâu

> **Nguồn gốc**: GitHub Repository `https://github.com/lintsinghua/claude-code-book`  
> **Độ uy tín cộng đồng**: 4346 ⭐  
> **Trạng thái Quản trị**: `CANDIDATE` (Tuân thủ FRAMEWORK_V2_CAPABILITY_AND_LEARNING_REGISTRY)  
> **Tự động đóng gói lúc**: 2026-11-01 10:42:10Z

---

## 1. Bản Chất Kiến Trúc & Giá Trị Cốt Lõi (Architectural Essence)

* **Mục tiêu cốt lõi**: 《御舆：解码 Agent Harness》42万字拆解 AI Agent 的Harness骨架与神经 —— Claude Code 架构深度剖析，15 章从对话循环到构建你自己的 Agent Harness。在线阅读网站：
* **Lĩnh vực áp dụng**: Tự động hóa lập trình, Tác tử AI (AI Agents), và Tối ưu hóa quy trình kỹ thuật.
* **Các tính năng nổi bật được trích xuất**:
- **初次阅读：** 从[前言](00-前言.md)开始，再读 01 → 02 → 04 → 15。
- **动手构建：** 先读基础篇与工程实践篇，增加记忆和扩展能力时查阅第二、三部分。
- **按需查阅：** 使用下方四篇附录定位模块、工具、功能标志和术语。
- **网站阅读：** [在线阅读入口](https://lintsinghua.github.io/)；也可直接点击本仓库的章节链接。

---

## 2. Thông Số Kỹ Thuật & Cú Pháp Lệnh (Specifications & Contracts)

Dưới đây là các cấu trúc lệnh và cấu hình thực thi tiêu chuẩn được trích xuất từ tài liệu chính thức:

```bash
# Tham khảo tài liệu gốc tại GitHub: lintsinghua/claude-code-book
git clone https://github.com/lintsinghua/claude-code-book.git
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