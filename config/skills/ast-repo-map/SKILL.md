---
name: ast-repo-map
description: >-
  Khai thác Bản đồ Cú pháp Codebase Nén (AST Repo Map) theo chuẩn Aider.
  Tự động quét và lập chỉ mục toàn bộ Class, Interface, Function Signature,
  Type definitions và Route endpoints của toàn bộ hệ sinh thái dự án để hiểu
  sâu kiến trúc đa module mà không làm tràn context window.
---

# 🗺️ AST REPO MAP & CODE ARCHITECTURE GUIDE

> **Phương pháp luận (Methodology)**: `Abstract Syntax Tree Compression (Nén Cây Cú Pháp Trừu Tượng - AST)`  
> **Bộ công cụ (Toolchain)**: `Tree-sitter` + `Aider AST Repo Map Engine`  
> **Mục tiêu tối thượng**: Nắm bắt 100% cấu trúc kiến trúc đa module với chi phí Token tối thiểu ($\le 5\%$ Context Window)  
> **Nguyên tắc vận hành**: Chuẩn song ngữ `English (Tiếng Việt)`, bám sát `Evidence Ledger (Sổ cái Bằng chứng)`.

---

## 🏛️ 1. TỔNG QUAN NGUYÊN LÝ NÉN AST (ARCHITECTURAL ESSENCE)

Khi làm việc với các dự án phức tạp hàng trăm file, việc đọc toàn bộ file mã nguồn sẽ làm tràn cửa sổ ngữ cảnh (`Context Window Overflow`) và gây suy giảm chất lượng suy luận.
**AST Repo Map** giải quyết triệt để vấn đề này bằng cách chỉ trích xuất phần "xương sống" của mã nguồn:

```mermaid
flowchart TD
    Raw["📂 Toàn Bộ Mã Nguồn Dự Án<br/>(Hàng Trăm File Code Thô)"] --> Parser["🌳 Tree-sitter AST Parser<br/>(Bộ Phân Tích Cú Pháp)"]
    Parser --> Filter["🔍 Signature Extractor<br/>(Lọc Class, Interface, Functions)"]
    Filter --> Graph["🕸️ Dependency PageRank<br/>(Xếp Hạng Tầm Quan Trọng)"]
    Graph --> Map["📜 Compact AST Repo Map<br/>(Bản Đồ Cú Pháp Nén ~2K Tokens)"]

    style Raw fill:#e1f5fe,stroke:#0288d1,stroke-width:2px;
    Parser fill:#fff9c4,stroke:#fbc02d,stroke-width:2px;
    Filter fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px;
    Graph fill:#ffe0b2,stroke:#f57c00,stroke-width:2px;
    Map fill:#e8f5e9,stroke:#388e3c,stroke-width:2px;
```

---

## 🛠️ 2. CÁC CÔNG CỤ TRUY VẤN CỐT LÕI (QUERY TOOLS)

Trong môi trường Antigravity 2.0, các tác tử khai thác Repo Map thông qua các công cụ MCP chuyên dụng:

1. **`get_ast_repo_map(targetDir, maxDepth, includeSignatures)`**:
   * *Mô tả*: Trả về cây kiến trúc nén của toàn bộ thư mục dự án.
   * *Tham số*:
     - `targetDir` (string): Thư mục mục tiêu cần lập bản đồ.
     - `maxDepth` (number): Độ sâu quét thư mục tối đa (mặc định 4).
     - `includeSignatures` (boolean): Đính kèm chữ ký hàm và kiểu dữ liệu.
2. **`search_code_symbols(query, targetDir)`**:
   * *Mô tả*: Truy tìm vị trí định nghĩa chính xác của một symbol (Class, Interface, Type, Function, Route API).
   * *Tham số*:
     - `query` (string): Tên symbol cần tìm (ví dụ: `UserSession`, `validateToken`).
     - `targetDir` (string): Thư mục giới hạn tìm kiếm.

---

## 📋 3. QUY TRÌNH VẬN HÀNH CHUẨN 3 BƯỚC (STANDARD BEST PRACTICES)

1. **Bước 1 — Định Vị Điểm Nối Trước Khi Sửa Code (`Survey & Contract Anchor`)**:
   * Gọi `get_ast_repo_map` hoặc `search_code_symbols` để định vị chính xác vị trí hàm và khế ước kiểu dữ liệu liên quan.
   * CẤM mở toàn bộ file khi chỉ cần xác định chữ ký hàm (`Function Signature`).
2. **Bước 2 — Phân Tích Ranh Giới Khế Ước (`Contract Boundary Check`)**:
   * Xác định rõ `Input Types` và `Output Types` để bảo đảm thay đổi mới không làm gãy vỡ các module phụ thuộc (`No Breaking Changes`).
3. **Bước 3 — Sửa Mã Nguồn & Tự Kiểm Chứng (`Targeted Edit & Self-Verification`)**:
   * Sửa tập trung vào đúng file mục tiêu, sau đó đối chiếu lại chữ ký kiểu để bảo đảm tính tương thích ngược hoàn hảo.

---

## 🛡️ 4. NGUYÊN TẮC BẤT BIẾN (INVARIANTS)

1. **Kỷ Luật Thuật Ngữ Song Ngữ (`Bilingual Terminology Protocol`)**:
   * Bắt buộc sử dụng chuẩn: **`English (Tiếng Việt)`** trong mọi giải thích và ghi chú *(Ví dụ: `Interface Contract (Khế ước Giao diện)`, `Cross-Module Dependency (Phụ thuộc Liên module)`)*.
2. **Ranh Giới Bất Biến Kiểu Dữ Liệu (`AST Type Contract Lock`)**:
   * Khi thực hiện tái cấu trúc (`Refactoring`), phải đóng băng khế ước kiểu dữ liệu trước để bảo đảm không xảy ra xung đột khi nhiều tác tử cùng làm việc song song.
