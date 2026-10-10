---
name: agent-deck
description: >-
  Kỹ năng chuyên gia vận hành cho asheshgoplani/agent-deck (1051 ⭐).
  Tự động kích hoạt khi người dùng muốn:
    - Tự động hóa hoặc tích hợp công cụ mã nguồn mở agent-deck vào hệ thống
    - Giải quyết các tác vụ kỹ thuật chuyên sâu liên quan đến Terminal session manager for AI coding agents
    - Thiết lập cấu hình và vận hành lệnh CLI của asheshgoplani/agent-deck
  KHÔNG CẦN người dùng phải nhớ tên kỹ thuật 'agent-deck'.
---

# asheshgoplani/agent-deck — Cẩm Nang Kỹ Năng Vận Hành Chuyên Sâu

> **Nguồn gốc**: GitHub Repository `https://github.com/asheshgoplani/agent-deck`  
> **Độ uy tín cộng đồng**: 1051 ⭐  
> **Trạng thái Quản trị**: `CANDIDATE` (Tuân thủ FRAMEWORK_V2_CAPABILITY_AND_LEARNING_REGISTRY)  
> **Tự động đóng gói lúc**: 2026-10-10 07:42:08Z

---

## 1. Bản Chất Kiến Trúc & Giá Trị Cốt Lõi (Architectural Essence)

* **Mục tiêu cốt lõi**: Terminal session manager for AI coding agents. One TUI for Claude, Gemini, OpenCode, Codex, and more.
* **Lĩnh vực áp dụng**: Tự động hóa lập trình, Tác tử AI (AI Agents), và Tối ưu hóa quy trình kỹ thuật.
* **Các tính năng nổi bật được trích xuất**:
- **Don't rely on titles or group names as machine keys.** Both are user-editable; a script or agent matching on either is relying on something that can change under it.
- `agent-deck add . -c claude --worktree feature/a --new-branch` creates a session in a new worktree
- `agent-deck add . --worktree feature/b -b --location subdirectory` places the worktree under `.worktrees/` inside the repo
- `agent-deck worktree finish "My Session"` merges the branch, removes the worktree, and deletes the session
- `agent-deck worktree cleanup` finds and removes orphaned worktrees
- `AGENT_DECK_REPO_ROOT` — path to the main repository

---

## 2. Thông Số Kỹ Thuật & Cú Pháp Lệnh (Specifications & Contracts)

Dưới đây là các cấu trúc lệnh và cấu hình thực thi tiêu chuẩn được trích xuất từ tài liệu chính thức:

```bash
curl -fsSL https://raw.githubusercontent.com/asheshgoplani/agent-deck/main/install.sh | bash

brew install asheshgoplani/tap/agent-deck
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