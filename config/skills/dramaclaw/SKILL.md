---
name: dramaclaw
description: >-
  Kỹ năng chuyên gia vận hành cho dramaclaw/dramaclaw (5692 ⭐).
  Tự động kích hoạt khi người dùng muốn:
    - Tự động hóa hoặc tích hợp công cụ mã nguồn mở dramaclaw vào hệ thống
    - Giải quyết các tác vụ kỹ thuật chuyên sâu liên quan đến A general-purpose AIGC video engine: script to finished film in one pipeline — dramas, ads, product videos, otome games, and more
    - Thiết lập cấu hình và vận hành lệnh CLI của dramaclaw/dramaclaw
  KHÔNG CẦN người dùng phải nhớ tên kỹ thuật 'dramaclaw'.
---

# dramaclaw/dramaclaw — Cẩm Nang Kỹ Năng Vận Hành Chuyên Sâu

> **Nguồn gốc**: GitHub Repository `https://github.com/dramaclaw/dramaclaw`  
> **Độ uy tín cộng đồng**: 5692 ⭐  
> **Trạng thái Quản trị**: `CANDIDATE` (Tuân thủ FRAMEWORK_V2_CAPABILITY_AND_LEARNING_REGISTRY)  
> **Tự động đóng gói lúc**: 2026-09-15 07:42:12Z

---

## 1. Bản Chất Kiến Trúc & Giá Trị Cốt Lõi (Architectural Essence)

* **Mục tiêu cốt lõi**: A general-purpose AIGC video engine: script to finished film in one pipeline — dramas, ads, product videos, otome games, and more. | 通用 AIGC 视频引擎 —— 从剧本到成片一条...
* **Lĩnh vực áp dụng**: Tự động hóa lập trình, Tác tử AI (AI Agents), và Tối ưu hóa quy trình kỹ thuật.
* **Các tính năng nổi bật được trích xuất**:
- **Audio** &mdash; speech synthesis with a voice library, reference voices, music generation
- **Canvas skills** &mdash; one-click skills such as sketch-from-context, frame-from-context, set-background, scene-360, frame review and beat-graph planning
- **Episode planning & script generation** &mdash; chapter segmentation, beat planning, multi-episode arcs; adaptive / literal / staged script modes with review-and-repair loops
- **Storyboards & first frames** &mdash; beat-driven stylized generation, grid splitting, image-pool selection
- **Voice-over, video composition & export** &mdash; emotion-aware speech, episode assembly, video + subtitle export and the full asset pack
- **Visual Style** &mdash; upload a reference image to extract style parameters and apply them across the whole project

---

## 2. Thông Số Kỹ Thuật & Cú Pháp Lệnh (Specifications & Contracts)

Dưới đây là các cấu trúc lệnh và cấu hình thực thi tiêu chuẩn được trích xuất từ tài liệu chính thức:

```bash
git clone https://github.com/dramaclaw/dramaclaw.git
git clone https://github.com/dramaclaw/dramaclaw-gateway.git   # bundled gateway, built from ../dramaclaw-gateway
cd dramaclaw

cp .env.example .env
# Edit .env — set PROMPT_EXPORT_PASSWORD to a non-default value.

docker compose up -d --build   # builds and starts three services: api / newapi (bundled gateway) / web

docker compose -f docker-compose.release.yml up -d
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