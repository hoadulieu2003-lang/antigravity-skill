---
name: tianshu-harness
description: >-
  Kỹ năng chuyên gia vận hành cho huiliyi37/Tianshu-harness (1109 ⭐).
  Tự động kích hoạt khi người dùng muốn:
    - Tự động hóa hoặc tích hợp công cụ mã nguồn mở tianshu-harness vào hệ thống
    - Giải quyết các tác vụ kỹ thuật chuyên sâu liên quan đến 天枢harness是一个的终端编程智能体，它要回答的核心问题是：模型何以稳定地交付——目标不漂移、完成有证据、验证有闭环，不说"应该修好了"。为此它在模型与真实世界之间建立一层认知执行环境（CVM），把目标、状态、证据、资源、权限与终止条件从对话历史中外部化，由运行时持续管理。同时对deepseek v4极度优化。
    - Thiết lập cấu hình và vận hành lệnh CLI của huiliyi37/Tianshu-harness
  KHÔNG CẦN người dùng phải nhớ tên kỹ thuật 'tianshu-harness'.
---

# huiliyi37/Tianshu-harness — Cẩm Nang Kỹ Năng Vận Hành Chuyên Sâu

> **Nguồn gốc**: GitHub Repository `https://github.com/huiliyi37/Tianshu-harness`  
> **Độ uy tín cộng đồng**: 1109 ⭐  
> **Trạng thái Quản trị**: `CANDIDATE` (Tuân thủ FRAMEWORK_V2_CAPABILITY_AND_LEARNING_REGISTRY)  
> **Tự động đóng gói lúc**: 2026-10-14 04:42:10Z

---

## 1. Bản Chất Kiến Trúc & Giá Trị Cốt Lõi (Architectural Essence)

* **Mục tiêu cốt lõi**: 天枢harness是一个的终端编程智能体，它要回答的核心问题是：模型何以稳定地交付——目标不漂移、完成有证据、验证有闭环，不说"应该修好了"。为此它在模型与真实世界之间建立一层认知执行环境（CVM），把目标、状态、证据、资源、权限与终止条件从对话历史中外部化，由运行时持续管理。同时对deepseek v4极度优化。
* **Lĩnh vực áp dụng**: Tự động hóa lập trình, Tác tử AI (AI Agents), và Tối ưu hóa quy trình kỹ thuật.
* **Các tính năng nổi bật được trích xuất**:
- **稳定交付，不虚报完成** —— 这是核心。任务契约（TaskContract）钉住全局目标，交付门禁要求「完成」必须带运行时证据（测试、diff、验证命令），收敛检测独立判断认知轨迹是否还在推进——模型说完成 ≠ 运行时确认完成。
- **终端 × 桌面，一个内核** —— 纯 ANSI 自研 TUI（`tianshu`）与 Tauri 桌面端（macOS / Windows / Linux）共用同一 agent 内核，两端能力一致。
- **认知虚拟机（CVM）** —— 75 个运行时 hook 横跨 5 大阶段，在模型输出与真实动作之间加一层可观测、可纠偏的认知运行时（[理念文档](docs/reference/cvm-cognitive-runtime.md) · [A/B 实证](docs/CVM运行时对Agent模型的实证影响.md)）。
- **前缀缓存引擎，全模型适用** —— 冻结前缀 + 增量 appendix + 边界压缩，对所有支持前缀缓存的模型生效：各家模型长会话实测稳态命中率均在 **95–99%**（DeepSeek V4 另有针对性优化），显著降低 token 成本。
- `Tianshu_*_amd64.AppImage`：x86_64 台式机和笔记本
- `Tianshu_*_aarch64.AppImage`：ARM64（树莓派 64 位、ARM Linux 笔记本）

---

## 2. Thông Số Kỹ Thuật & Cú Pháp Lệnh (Specifications & Contracts)

Dưới đây là các cấu trúc lệnh và cấu hình thực thi tiêu chuẩn được trích xuất từ tài liệu chính thức:

```bash
Application / TUI / IDE / Desktop
              ↓
   Tianshu Cognitive Runtime      ← 状态 · 目标 · 证据 · 控制 · 回放
              ↓
       Foundation Models          ← DeepSeek · GLM · Claude · Codex · Grok · MiniMax · MiMo …

# macOS / Linux
bash <(curl -fsSL https://raw.githubusercontent.com/huiliyi37/Tianshu-harness/main/scripts/install-tui.sh)

# Windows（PowerShell）
powershell -ExecutionPolicy Bypass -Command "irm https://raw.githubusercontent.com/huiliyi37/Tianshu-harness/main/scripts/install-tui.ps1 | iex"

# 或 npm
npm install -g tianshu-harness
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