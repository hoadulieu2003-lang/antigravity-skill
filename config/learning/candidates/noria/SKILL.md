---
name: noria
description: >-
  Kỹ năng chuyên gia vận hành cho AhmadHassan-BTed/Noria (4636 ⭐).
  Tự động kích hoạt khi người dùng muốn:
    - Tự động hóa hoặc tích hợp công cụ mã nguồn mở noria vào hệ thống
    - Giải quyết các tác vụ kỹ thuật chuyên sâu liên quan đến An agentic extractor for messaging platforms
    - Thiết lập cấu hình và vận hành lệnh CLI của AhmadHassan-BTed/Noria
  KHÔNG CẦN người dùng phải nhớ tên kỹ thuật 'noria'.
---

# AhmadHassan-BTed/Noria — Cẩm Nang Kỹ Năng Vận Hành Chuyên Sâu

> **Nguồn gốc**: GitHub Repository `https://github.com/AhmadHassan-BTed/Noria`  
> **Độ uy tín cộng đồng**: 4636 ⭐  
> **Trạng thái Quản trị**: `CANDIDATE` (Tuân thủ FRAMEWORK_V2_CAPABILITY_AND_LEARNING_REGISTRY)  
> **Tự động đóng gói lúc**: 2026-11-10 04:42:11Z

---

## 1. Bản Chất Kiến Trúc & Giá Trị Cốt Lõi (Architectural Essence)

* **Mục tiêu cốt lõi**: An agentic extractor for messaging platforms. Noria receives messages & URLs via chat; scrapes web data to evaluate the content against custom scoring matric...
* **Lĩnh vực áp dụng**: Tự động hóa lập trình, Tác tử AI (AI Agents), và Tối ưu hóa quy trình kỹ thuật.
* **Các tính năng nổi bật được trích xuất**:
- **Node.js**: `>=22.12.0` (LTS highly recommended)
- **NPM**: `>=10.0.0`

---

## 2. Thông Số Kỹ Thuật & Cú Pháp Lệnh (Specifications & Contracts)

Dưới đây là các cấu trúc lệnh và cấu hình thực thi tiêu chuẩn được trích xuất từ tài liệu chính thức:

```bash
git clone https://github.com/AhmadHassan-BTed/Noria.git
cd noria
npm install

# LLM providers (use one or both)
GEMINI_API_KEY=your_gemini_api_key    # https://aistudio.google.com/
GROQ_API_KEY=your_groq_api_key        # https://console.groq.com/

# Optional: faster web scraping
JINA_API_KEY=your_jina_api_key        # https://jina.ai/reader/

# WhatsApp notification target
NOTIFICATION_TARGET=+923001234567

# Active pipelines
ACTIVE_PIPELINES=scholarships,jobs
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