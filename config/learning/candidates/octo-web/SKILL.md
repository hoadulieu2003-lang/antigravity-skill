---
name: octo-web
description: >-
  Kỹ năng chuyên gia vận hành cho Mininglamp-OSS/octo-web (1212 ⭐).
  Tự động kích hoạt khi người dùng muốn:
    - Tự động hóa hoặc tích hợp công cụ mã nguồn mở octo-web vào hệ thống
    - Giải quyết các tác vụ kỹ thuật chuyên sâu liên quan đến Web & desktop (Electron) client for the OCTO open workplace — one React + TypeScript codebase shipping browser and PC surfaces, with first-class AI agent UX
    - Thiết lập cấu hình và vận hành lệnh CLI của Mininglamp-OSS/octo-web
  KHÔNG CẦN người dùng phải nhớ tên kỹ thuật 'octo-web'.
---

# Mininglamp-OSS/octo-web — Cẩm Nang Kỹ Năng Vận Hành Chuyên Sâu

> **Nguồn gốc**: GitHub Repository `https://github.com/Mininglamp-OSS/octo-web`  
> **Độ uy tín cộng đồng**: 1212 ⭐  
> **Trạng thái Quản trị**: `CANDIDATE` (Tuân thủ FRAMEWORK_V2_CAPABILITY_AND_LEARNING_REGISTRY)  
> **Tự động đóng gói lúc**: 2026-11-03 01:42:09Z

---

## 1. Bản Chất Kiến Trúc & Giá Trị Cốt Lõi (Architectural Essence)

* **Mục tiêu cốt lõi**: Web & desktop (Electron) client for the OCTO open workplace — one React + TypeScript codebase shipping browser and PC surfaces, with first-class AI agent UX.
* **Lĩnh vực áp dụng**: Tự động hóa lập trình, Tác tử AI (AI Agents), và Tối ưu hóa quy trình kỹ thuật.
* **Các tính năng nổi bật được trích xuất**:
- **Full bilingual shell.** English and Simplified Chinese ship together out of the box; i18n keys live in `src/locales/` and are enforced in CI.
- **[TangSengDaoDaoWeb](https://github.com/TangSengDaoDao/TangSengDaoDaoWeb)** — our upstream, by the TangSengDaoDao team.
- **[WuKongIM](https://github.com/WuKongIM/WuKongIM)** — the real-time messaging core that `octo-server` drives behind this client.

---

## 2. Thông Số Kỹ Thuật & Cú Pháp Lệnh (Specifications & Contracts)

Dưới đây là các cấu trúc lệnh và cấu hình thực thi tiêu chuẩn được trích xuất từ tài liệu chính thức:

```bash
git clone https://github.com/Mininglamp-OSS/octo-web.git
cd octo-web
pnpm install
pnpm dev

pnpm build        # build the browser bundle
pnpm pc:dev       # launch the Electron shell against the dev build
pnpm pc:package   # produce a distributable PC bundle (macOS / Windows / Linux)
pnpm test         # run unit + component tests
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