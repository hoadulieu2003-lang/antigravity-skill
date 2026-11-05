---
name: oh-story-claudecode
description: >-
  Kỹ năng chuyên gia vận hành cho zenstory-ai/oh-story-claudecode (8331 ⭐).
  Tự động kích hoạt khi người dùng muốn:
    - Tự động hóa hoặc tích hợp công cụ mã nguồn mở oh-story-claudecode vào hệ thống
    - Giải quyết các tác vụ kỹ thuật chuyên sâu liên quan đến Claude Code / Codex / OpenCode agent skills for writing Chinese web novels (网文): 扫榜、拆文、写作、去AI味、封面全流程，长篇短篇都支持 | 14 skills for novel writing and long-form fict
    - Thiết lập cấu hình và vận hành lệnh CLI của zenstory-ai/oh-story-claudecode
  KHÔNG CẦN người dùng phải nhớ tên kỹ thuật 'oh-story-claudecode'.
---

# zenstory-ai/oh-story-claudecode — Cẩm Nang Kỹ Năng Vận Hành Chuyên Sâu

> **Nguồn gốc**: GitHub Repository `https://github.com/zenstory-ai/oh-story-claudecode`  
> **Độ uy tín cộng đồng**: 8331 ⭐  
> **Trạng thái Quản trị**: `CANDIDATE` (Tuân thủ FRAMEWORK_V2_CAPABILITY_AND_LEARNING_REGISTRY)  
> **Tự động đóng gói lúc**: 2026-11-05 16:42:11Z

---

## 1. Bản Chất Kiến Trúc & Giá Trị Cốt Lõi (Architectural Essence)

* **Mục tiêu cốt lõi**: Claude Code / Codex / OpenCode agent skills for writing Chinese web novels (网文): 扫榜、拆文、写作、去AI味、封面全流程，长篇短篇都支持 | 14 skills for novel writing and long-form fict...
* **Lĩnh vực áp dụng**: Tự động hóa lập trình, Tác tử AI (AI Agents), và Tối ưu hóa quy trình kỹ thuật.
* **Các tính năng nổi bật được trích xuất**:
- **用文件系统当记忆** — 设定、大纲、正文、追踪各自独立维护，压缩上下文或更换会话后，从文件恢复当前进度、伏笔和未完承诺。
- **确定性检查与门禁** — 长篇写前检查细纲和追踪，写后检查截断、工程词和常见 AI 句式。支持 hooks 的宿主自动执行对应检查，其他环境按 skill 流程执行。
- **适配 7 款编程 Agent** — Claude Code · Codex CLI · Google Antigravity · OpenCode · ZCode · OpenClaw · Reasonix；能读取项目文件的通用 Web AI / Agent 环境也可使用。
- **面向的平台** — 起点、番茄、晋江、七猫、知乎盐言等长短篇平台。
- **Telegram 群**：<https://t.me/ohstoryclaudecode> —— 日常交流、踩坑、新功能讨论。
- **GitHub Discussions**：[提问 / 求助 / 分享用法](https://github.com/zenstory-ai/oh-story-claudecode/discussions)，方便检索。

---

## 2. Thông Số Kỹ Thuật & Cú Pháp Lệnh (Specifications & Contracts)

Dưới đây là các cấu trúc lệnh và cấu hình thực thi tiêu chuẩn được trích xuất từ tài liệu chính thức:

```bash
安装这个 skill https://github.com/zenstory-ai/oh-story-claudecode

改前.md:7:20     [blocking] em-dash             (么叫做命运的安排——不是巧合，而是一)
改前.md:7:22     [blocking] not-is-comparison   (不是巧合，而是一种冥冥之中的注定)
改前.md:11:1     [blocking] negation-parade     (没有犹豫，没有生涩，)
改前.md:19:3     [blocking] voice-contrast      (声音不大，却)
改前.md:21:2     [blocking] not-is-comparison   (不是一次简单的弹奏，而是一场蓄谋已久的惊艳亮相)
改前.md:3:1      [advisory] cliche-density-tic  (仿佛 一丝 深吸一口气 缓缓 微微)
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