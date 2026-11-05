---
name: dsh-image-gen
description: >-
  Kỹ năng chuyên gia vận hành cho shanliuling/dsh-image-gen (1104 ⭐).
  Tự động kích hoạt khi người dùng muốn:
    - Tự động hóa hoặc tích hợp công cụ mã nguồn mở dsh-image-gen vào hệ thống
    - Giải quyết các tác vụ kỹ thuật chuyên sâu liên quan đến 可在对话内生成、编辑、对比图像；内置 500 + 提示词、图库、多模型工作流，支持 ComfyUI。AI image studio for DeepSeek Harness — generate, edit & compare images in chat, with 500+ prompts, gallery,
    - Thiết lập cấu hình và vận hành lệnh CLI của shanliuling/dsh-image-gen
  KHÔNG CẦN người dùng phải nhớ tên kỹ thuật 'dsh-image-gen'.
---

# shanliuling/dsh-image-gen — Cẩm Nang Kỹ Năng Vận Hành Chuyên Sâu

> **Nguồn gốc**: GitHub Repository `https://github.com/shanliuling/dsh-image-gen`  
> **Độ uy tín cộng đồng**: 1104 ⭐  
> **Trạng thái Quản trị**: `CANDIDATE` (Tuân thủ FRAMEWORK_V2_CAPABILITY_AND_LEARNING_REGISTRY)  
> **Tự động đóng gói lúc**: 2026-11-05 01:14:13Z

---

## 1. Bản Chất Kiến Trúc & Giá Trị Cốt Lõi (Architectural Essence)

* **Mục tiêu cốt lõi**: 可在对话内生成、编辑、对比图像；内置 500 + 提示词、图库、多模型工作流，支持 ComfyUI。AI image studio for DeepSeek Harness — generate, edit & compare images in chat, with 500+ prompts, gallery,...
* **Lĩnh vực áp dụng**: Tự động hóa lập trình, Tác tử AI (AI Agents), và Tối ưu hóa quy trình kỹ thuật.
* **Các tính năng nổi bật được trích xuất**:
- **草图 → 成图**：随手画个轮廓，选中它说「画成卡通角色」。
- **圈哪改哪**：在已有图片上用画笔圈出局部，说「把这里换成斧头」，只改圈出的部分。
- **组合参考**：把「最近生成」或图库里的图拖进画布，或点击缩略图上的「发送到画布」，多张一起选中作为参考。同一张历史图片重复导入会自动去重。
- **角色一致性**：要求「保持这个人物 / 角色 / 物体不变」时，插件会让模型沿用参考图里的同一主体，只改场景、服装、姿势或风格，而不是重新画一个相似的人。
- **在对话里直接点名**：说「用风格 #123」「做成信息图排版」「莫兰迪色系」，Agent 会先在灵感库里检索，再把模板套到你的主题上出图。风格、排版、主题色还可以组合使用。
- **在界面里浏览**：筛选、收藏、复制，或一键带入工作台（见下方 Studio 演示）。

---

## 2. Thông Số Kỹ Thuật & Cú Pháp Lệnh (Specifications & Contracts)

Dưới đây là các cấu trúc lệnh và cấu hình thực thi tiêu chuẩn được trích xuất từ tài liệu chính thức:

```bash
pnpm dsh plugin --profile web add dsh-image-gen@latest

pnpm dsh plugin --profile web add dsh-image-gen@latest
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