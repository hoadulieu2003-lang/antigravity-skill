---
name: whodb
description: >-
  Kỹ năng chuyên gia vận hành cho clidey/whodb (5033 ⭐).
  Tự động kích hoạt khi người dùng muốn:
    - Tự động hóa hoặc tích hợp công cụ mã nguồn mở whodb vào hệ thống
    - Giải quyết các tác vụ kỹ thuật chuyên sâu liên quan đến Where data access meets operational intelligence
    - Thiết lập cấu hình và vận hành lệnh CLI của clidey/whodb
  KHÔNG CẦN người dùng phải nhớ tên kỹ thuật 'whodb'.
---

# clidey/whodb — Cẩm Nang Kỹ Năng Vận Hành Chuyên Sâu

> **Nguồn gốc**: GitHub Repository `https://github.com/clidey/whodb`  
> **Độ uy tín cộng đồng**: 5033 ⭐  
> **Trạng thái Quản trị**: `CANDIDATE` (Tuân thủ FRAMEWORK_V2_CAPABILITY_AND_LEARNING_REGISTRY)  
> **Tự động đóng gói lúc**: 2026-09-29 19:42:10Z

---

## 1. Bản Chất Kiến Trúc & Giá Trị Cốt Lõi (Architectural Essence)

* **Mục tiêu cốt lõi**: Where data access meets operational intelligence
* **Lĩnh vực áp dụng**: Tự động hóa lập trình, Tác tử AI (AI Agents), và Tối ưu hóa quy trình kỹ thuật.
* **Các tính năng nổi bật được trích xuất**:
- **Browse and edit data** in a spreadsheet-style grid with sorting, filtering, pagination, and inline editing.
- **Understand a schema visually** with an interactive graph of tables and relationships.
- **Work through queries in a scratchpad** with multiple cells, autocomplete, history, and results kept alongside each query.
- **Move data in and out** with imports, exports, and mock-data generation for development and testing.
- **Ask questions in plain English** using a local or hosted AI provider that you choose.
- **Work from your terminal** through the WhoDB CLI and its MCP server.

---

## 2. Thông Số Kỹ Thuật & Cú Pháp Lệnh (Specifications & Contracts)

Dưới đây là các cấu trúc lệnh và cấu hình thực thi tiêu chuẩn được trích xuất từ tài liệu chính thức:

```bash
docker run --rm -it -p 8080:8080 clidey/whodb

docker run -it -p 8080:8080 \
  -v whodb-data:/data \
  -e WHODB_ENCRYPTION_KEY=your_saved_64_character_hex_key \
  clidey/whodb
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