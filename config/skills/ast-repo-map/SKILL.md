---
name: ast-repo-map
description: >-
  Khai thác Bản đồ Cú pháp Codebase Nén (AST Repo Map) theo chuẩn Aider.
  Tự động quét và lập chỉ mục toàn bộ Class, Interface, Function Signature,
  Type definitions và Route endpoints của toàn bộ hệ sinh thái dự án để hiểu
  sâu kiến trúc đa module mà không làm tràn context window.
---

# AST Repo Map & Code Architecture Guide

Khi thực hiện các tác vụ phát triển tính năng mới, gỡ lỗi liên module (Cross-module debugging), hoặc tái cấu trúc kiến trúc (Refactoring):

## 1. Nguyên Tắc Cốt Lõi
* **Luôn tra cứu Repo Map trước khi sửa code đa file:** Sử dụng tool `get_ast_repo_map` hoặc đọc file `CODEBASE_REPO_MAP.md` để nắm trọn vẹn toàn bộ Class, Interface và Function Signatures của các module liên quan.
* **Tra cứu chính xác vị trí hàm/kiểu dữ liệu:** Sử dụng tool `search_code_symbols` với tên hàm hoặc interface để lấy chính xác số dòng và chữ ký kiểu mà không cần mở toàn bộ file.

## 2. Các Công Cụ Khả Dụng Trong Hệ Thống
* `get_ast_repo_map(targetDir, maxDepth, includeSignatures)`: Trả về cây kiến trúc nén của toàn bộ repo.
* `search_code_symbols(query, targetDir)`: Truy tìm định nghĩa symbol (class, function, route, interface).

## 3. Quy Trình Vận Hành (Best Practice)
1. **Khảo sát:** Gọi `search_code_symbols` để xác định các file phụ thuộc.
2. **Kế hoạch:** Xác định input/output types chính xác trước khi sửa file.
3. **Thực thi:** Sửa đúng file mục tiêu, đảm bảo không phá vỡ Type Signature đã có trong Repo Map.

## 4. Tối Ưu Hóa Tiền Lưu Trữ Cú Pháp & Stigmergy (Prefix Caching & Stigmergic Indexing — EVO-20261023)
* **Tiền lưu trữ cây cú pháp (`AST Prefix Caching`)**: Ưu tiên nạp phần khung chữ ký tĩnh (`Interfaces`, `Types`, `Exported Signatures`) vào đầu ngữ cảnh để tận dụng bộ đệm tiền tố (`Context Prefix Cache`), giảm tới 70% độ trễ quét kho mã nguồn đa module.
* **Phối hợp gián tiếp qua dấu vết cú pháp (`Stigmergic Symbol Boundary` kế thừa `boxlite` & `nocobase`)**: Khi vận hành chế độ Đa Tác Tử (`Multi-Agent Mode`), sử dụng kết quả `get_ast_repo_map` để khóa cứng khế ước giao diện (`AST Contract Lock`) và phân vùng độc quyền tệp tin (`Isolated File Manifest`) cho từng Pod trước khi viết code.
