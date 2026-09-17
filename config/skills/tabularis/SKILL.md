---
name: tabularis
description: >-
  Kỹ năng chuyên gia vận hành cho TabularisDB/tabularis (4952 ⭐).
  Tự động kích hoạt khi người dùng muốn:
    - Tự động hóa hoặc tích hợp công cụ mã nguồn mở tabularis vào hệ thống
    - Giải quyết các tác vụ kỹ thuật chuyên sâu liên quan đến Open-source desktop SQL workspace with 3 built-in database drivers and 16 shipped plugins, including SQL Server, DuckDB, ClickHouse and Redis
    - Thiết lập cấu hình và vận hành lệnh CLI của TabularisDB/tabularis
  KHÔNG CẦN người dùng phải nhớ tên kỹ thuật 'tabularis'.
---

# TabularisDB/tabularis — Cẩm Nang Kỹ Năng Vận Hành Chuyên Sâu

> **Nguồn gốc**: GitHub Repository `https://github.com/TabularisDB/tabularis`  
> **Độ uy tín cộng đồng**: 4952 ⭐  
> **Trạng thái Quản trị**: `CANDIDATE` (Tuân thủ FRAMEWORK_V2_CAPABILITY_AND_LEARNING_REGISTRY)  
> **Tự động đóng gói lúc**: 2026-09-16 07:42:12Z

---

## 1. Bản Chất Kiến Trúc & Giá Trị Cốt Lõi (Architectural Essence)

* **Mục tiêu cốt lõi**: Open-source desktop SQL workspace with 3 built-in database drivers and 16 shipped plugins, including SQL Server, DuckDB, ClickHouse and Redis. Built-in MCP s...
* **Lĩnh vực áp dụng**: Tự động hóa lập trình, Tác tử AI (AI Agents), và Tối ưu hóa quy trình kỹ thuật.
* **Các tính năng nổi bật được trích xuất**:
- **SSH Tunneling** with automatic readiness detection.
- **Per-Connection Appearance:** override the icon ([Lucide](https://lucide.dev/icons/), emoji, or custom image) and accent color of each saved connection.
- **Tree View:** Browse tables, columns, keys, indexes, views, and stored routines, with inline editing from the sidebar.
- **ER Diagram:** Interactive Entity-Relationship visualization (pan, zoom, layout) with selective table diagram generation.
- **Context Actions:** Show data, count rows, modify schema, duplicate/delete tables.
- **SQL Dump & Import:** Export and restore databases with a single flow.

---

## 2. Thông Số Kỹ Thuật & Cú Pháp Lệnh (Specifications & Contracts)

Dưới đây là các cấu trúc lệnh và cấu hình thực thi tiêu chuẩn được trích xuất từ tài liệu chính thức:

```bash
winget install Debba.Tabularis                                   # Windows
brew install --cask tabularis  # macOS
sudo snap install tabularis                                      # Linux

winget install Debba.Tabularis
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