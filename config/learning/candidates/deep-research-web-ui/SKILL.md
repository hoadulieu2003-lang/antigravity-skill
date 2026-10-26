---
name: deep-research-web-ui
description: >-
  Kỹ năng chuyên gia vận hành cho AnotiaWang/deep-research-web-ui (2223 ⭐).
  Tự động kích hoạt khi người dùng muốn:
    - Tự động hóa hoặc tích hợp công cụ mã nguồn mở deep-research-web-ui vào hệ thống
    - Giải quyết các tác vụ kỹ thuật chuyên sâu liên quan đến AI deep-research agent that turns any question into a cited report: plans searches, reads real sources, verifies evidence
    - Thiết lập cấu hình và vận hành lệnh CLI của AnotiaWang/deep-research-web-ui
  KHÔNG CẦN người dùng phải nhớ tên kỹ thuật 'deep-research-web-ui'.
---

# AnotiaWang/deep-research-web-ui — Cẩm Nang Kỹ Năng Vận Hành Chuyên Sâu

> **Nguồn gốc**: GitHub Repository `https://github.com/AnotiaWang/deep-research-web-ui`  
> **Độ uy tín cộng đồng**: 2223 ⭐  
> **Trạng thái Quản trị**: `CANDIDATE` (Tuân thủ FRAMEWORK_V2_CAPABILITY_AND_LEARNING_REGISTRY)  
> **Tự động đóng gói lúc**: 2026-10-26 01:42:14Z

---

## 1. Bản Chất Kiến Trúc & Giá Trị Cốt Lõi (Architectural Essence)

* **Mục tiêu cốt lõi**: AI deep-research agent that turns any question into a cited report: plans searches, reads real sources, verifies evidence. Self-hosted, multi-provider, Docke...
* **Lĩnh vực áp dụng**: Tự động hóa lập trình, Tác tử AI (AI Agents), và Tối ưu hóa quy trình kỹ thuật.
* **Các tính năng nổi bật được trích xuất**:
- **Client Mode**: users enter their own API keys in the browser. This is the best fit for static deployments such as EdgeOne Pages or `pnpm generate`.
- `NUXT_WEB_SEARCH_API_KEY` supports comma-separated keys for Tavily, Google PSE and Serply, for example `key1,key2,key3`.
- `http(s)` proxies cover everything: AI providers, Google PSE, you.com, Serply, Parallel, and the Tavily / Firecrawl / CRW SDKs.

---

## 2. Thông Số Kỹ Thuật & Cú Pháp Lệnh (Specifications & Contracts)

Dưới đây là các cấu trúc lệnh và cấu hình thực thi tiêu chuẩn được trích xuất từ tài liệu chính thức:

```bash
docker run -p 3000:3000 \
  -e NUXT_PUBLIC_SERVER_MODE=true \
  -e NUXT_AI_API_KEY=your-ai-api-key \
  -e NUXT_WEB_SEARCH_API_KEY=your-search-api-key \
  -e NUXT_PUBLIC_AI_PROVIDER=openai-compatible \
  -e NUXT_PUBLIC_AI_MODEL=gpt-4o-mini \
  -e NUXT_PUBLIC_WEB_SEARCH_PROVIDER=tavily \
  anotia/deep-research-web:latest

# Copy .env.example and update it with your configuration
cp .env.example .env
docker run -p 3000:3000 --env-file .env anotia/deep-research-web:latest
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