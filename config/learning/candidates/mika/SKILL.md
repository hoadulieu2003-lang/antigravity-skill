---
name: mika
description: >-
  Kỹ năng chuyên gia vận hành cho wangzan101/Mika (3068 ⭐).
  Tự động kích hoạt khi người dùng muốn:
    - Tự động hóa hoặc tích hợp công cụ mã nguồn mở mika vào hệ thống
    - Giải quyết các tác vụ kỹ thuật chuyên sâu liên quan đến An on-device AI agent for Android that operates apps and the web to get things done for you
    - Thiết lập cấu hình và vận hành lệnh CLI của wangzan101/Mika
  KHÔNG CẦN người dùng phải nhớ tên kỹ thuật 'mika'.
---

# wangzan101/Mika — Cẩm Nang Kỹ Năng Vận Hành Chuyên Sâu

> **Nguồn gốc**: GitHub Repository `https://github.com/wangzan101/Mika`  
> **Độ uy tín cộng đồng**: 3068 ⭐  
> **Trạng thái Quản trị**: `CANDIDATE` (Tuân thủ FRAMEWORK_V2_CAPABILITY_AND_LEARNING_REGISTRY)  
> **Tự động đóng gói lúc**: 2026-11-01 07:44:18Z

---

## 1. Bản Chất Kiến Trúc & Giá Trị Cốt Lõi (Architectural Essence)

* **Mục tiêu cốt lõi**: An on-device AI agent for Android that operates apps and the web to get things done for you.
* **Lĩnh vực áp dụng**: Tự động hóa lập trình, Tác tử AI (AI Agents), và Tối ưu hóa quy trình kỹ thuật.
* **Các tính năng nổi bật được trích xuất**:
- **There is no Mika server**: what you say and what's on your screen go only to the model provider you set up.
- **Docs**: all docs and a suggested reading order are in the [docs index](docs/README.en.md)
- **Follow the author**: X [@wangzan101](https://x.com/wangzan101)
- **Report a problem**: [open an issue](https://github.com/wangzan101/Mika/issues/new/choose); About › Send feedback in the app can attach diagnostics
- **Contribute**: add usage knowledge for an app or website (plain text, no code needed), or contribute code; see the [contributing guide](.github/CONTRIBUTING.md)

---

## 2. Thông Số Kỹ Thuật & Cú Pháp Lệnh (Specifications & Contracts)

Dưới đây là các cấu trúc lệnh và cấu hình thực thi tiêu chuẩn được trích xuất từ tài liệu chính thức:

```bash
# Tham khảo tài liệu gốc tại GitHub: wangzan101/Mika
git clone https://github.com/wangzan101/Mika.git
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