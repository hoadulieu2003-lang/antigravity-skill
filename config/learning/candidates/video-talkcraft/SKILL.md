---
name: video-talkcraft
description: >-
  Kỹ năng chuyên gia vận hành cho Vincentwei1021/video-talkcraft (2339 ⭐).
  Tự động kích hoạt khi người dùng muốn:
    - Tự động hóa hoặc tích hợp công cụ mã nguồn mở video-talkcraft vào hệ thống
    - Giải quyết các tác vụ kỹ thuật chuyên sâu liên quan đến Agent skill that turns Claude Code / Codex into a motion-design studio for voiceover-driven explainer videos — word-level voiceover sync, 109 motion recipe c
    - Thiết lập cấu hình và vận hành lệnh CLI của Vincentwei1021/video-talkcraft
  KHÔNG CẦN người dùng phải nhớ tên kỹ thuật 'video-talkcraft'.
---

# Vincentwei1021/video-talkcraft — Cẩm Nang Kỹ Năng Vận Hành Chuyên Sâu

> **Nguồn gốc**: GitHub Repository `https://github.com/Vincentwei1021/video-talkcraft`  
> **Độ uy tín cộng đồng**: 2339 ⭐  
> **Trạng thái Quản trị**: `CANDIDATE` (Tuân thủ FRAMEWORK_V2_CAPABILITY_AND_LEARNING_REGISTRY)  
> **Tự động đóng gói lúc**: 2026-11-15 13:42:12Z

---

## 1. Bản Chất Kiến Trúc & Giá Trị Cốt Lõi (Architectural Essence)

* **Mục tiêu cốt lõi**: Agent skill that turns Claude Code / Codex into a motion-design studio for voiceover-driven explainer videos — word-level voiceover sync, 109 motion recipe c...
* **Lĩnh vực áp dụng**: Tự động hóa lập trình, Tác tử AI (AI Agents), và Tối ưu hóa quy trình kỹ thuật.
* **Các tính năng nổi bật được trích xuất**:
- **字级配音同步**——`scripts/timestamps_cpu.py` 把口播稿对齐到音频
- **108 张动效配方卡**——每张有意图、参数、已知坑、可直接复制的自包含 Remotion tsx 源码和可跑的 HTML 预览，
- **七层反 PPT 系统**——每场景一条极缓推进 / 拉出的相机曲线 + 让位生命周期 + 六式运动承接转场
- **经得住审片的排版纪律**——语义拍分镜、同屏元素预算、留白锚、枢轴句切镜规则、
- **三重验收**——画面健康双判定（静止段 + 并发光栅抖动，时域缺陷机器抓）、
- **[Remotion](https://www.remotion.dev/)**——驱动全部渲染的 React 视频框架

---

## 2. Thông Số Kỹ Thuật & Cú Pháp Lệnh (Specifications & Contracts)

Dưới đây là các cấu trúc lệnh và cấu hình thực thi tiêu chuẩn được trích xuất từ tài liệu chính thức:

```bash
帮我安装这个 skill：https://github.com/Vincentwei1021/video-talkcraft

git clone https://github.com/Vincentwei1021/video-talkcraft.git
cd video-talkcraft
ln -s "$(pwd)" ~/.claude/skills/video-talkcraft   # Claude Code
# 或
ln -s "$(pwd)" ~/.codex/skills/video-talkcraft    # Codex
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