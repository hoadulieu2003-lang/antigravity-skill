---
name: openclawchinesetranslation
description: >-
  Kỹ năng chuyên gia vận hành cho 1186258278/OpenClawChineseTranslation (3795 ⭐).
  Tự động kích hoạt khi người dùng muốn:
    - Tự động hóa hoặc tích hợp công cụ mã nguồn mở openclawchinesetranslation vào hệ thống
    - Giải quyết các tác vụ kỹ thuật chuyên sâu liên quan đến 🦞 OpenClaw (Clawdbot/Moltbot) 汉化版 - 开源个人 AI 助手中文版 | Claude/ChatGPT LLM 接入 | WhatsApp/Telegram/Discord 多平台 | 每小时自动同步 | CLI + Dashboard 全中文 | 全流程搭建教程，以及排错指南！
    - Thiết lập cấu hình và vận hành lệnh CLI của 1186258278/OpenClawChineseTranslation
  KHÔNG CẦN người dùng phải nhớ tên kỹ thuật 'openclawchinesetranslation'.
---

# 1186258278/OpenClawChineseTranslation — Cẩm Nang Kỹ Năng Vận Hành Chuyên Sâu

> **Nguồn gốc**: GitHub Repository `https://github.com/1186258278/OpenClawChineseTranslation`  
> **Độ uy tín cộng đồng**: 3795 ⭐  
> **Trạng thái Quản trị**: `CANDIDATE` (Tuân thủ FRAMEWORK_V2_CAPABILITY_AND_LEARNING_REGISTRY)  
> **Tự động đóng gói lúc**: 2026-10-12 10:42:10Z

---

## 1. Bản Chất Kiến Trúc & Giá Trị Cốt Lõi (Architectural Essence)

* **Mục tiêu cốt lõi**: 🦞 OpenClaw (Clawdbot/Moltbot) 汉化版 - 开源个人 AI 助手中文版 | Claude/ChatGPT LLM 接入 | WhatsApp/Telegram/Discord 多平台 | 每小时自动同步 | CLI + Dashboard 全中文 | 全流程搭建教程，以及排错指南！
* **Lĩnh vực áp dụng**: Tự động hóa lập trình, Tác tử AI (AI Agents), và Tối ưu hóa quy trình kỹ thuật.
* **Các tính năng nổi bật được trích xuất**:
- **[翻译规范](docs/TRANSLATION_GUIDE.md)** — [术语表](docs/TRANSLATION_GUIDE.md#glossary) · [翻译原则](docs/TRANSLATION_GUIDE.md#principles) · [风格指南](docs/TRANSLATION_GUIDE.md#style-guide)
- **主流模型覆盖** — 支持 GPT、Claude、Gemini、Grok、Kimi 等主流前沿模型
- **价格福利** — 充值 ¥1 到账 $1 平台额度，部分线路按折扣计费
- **OpenAI Compatible** — API Base URL：`https://ciyapi.79tian.com/v1`
- **赞助推广** — 第三方服务，具体规则以词元 API 页面为准
- `-d`: 后台运行（守护进程模式）

---

## 2. Thông Số Kỹ Thuật & Cú Pháp Lệnh (Specifications & Contracts)

Dưới đây là các cấu trúc lệnh và cấu hình thực thi tiêu chuẩn được trích xuất từ tài liệu chính thức:

```bash
npm install -g @qingchencloud/openclaw-zh@latest

openclaw onboard --install-daemon
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