---
name: invisible-playwright-mcp
description: >-
  Kỹ năng chuyên gia vận hành cho feder-cr/invisible_playwright_mcp (31634 ⭐).
  Tự động kích hoạt khi người dùng muốn:
    - Tự động hóa hoặc tích hợp công cụ mã nguồn mở invisible-playwright-mcp vào hệ thống
    - Giải quyết các tác vụ kỹ thuật chuyên sâu liên quan đến An AI agent that drives a real anti-detect browser: say what you want in plain English and it navigates, clicks, types and extracts
    - Thiết lập cấu hình và vận hành lệnh CLI của feder-cr/invisible_playwright_mcp
  KHÔNG CẦN người dùng phải nhớ tên kỹ thuật 'invisible-playwright-mcp'.
---

# feder-cr/invisible_playwright_mcp — Cẩm Nang Kỹ Năng Vận Hành Chuyên Sâu

> **Nguồn gốc**: GitHub Repository `https://github.com/feder-cr/invisible_playwright_mcp`  
> **Độ uy tín cộng đồng**: 31634 ⭐  
> **Trạng thái Quản trị**: `CANDIDATE` (Tuân thủ FRAMEWORK_V2_CAPABILITY_AND_LEARNING_REGISTRY)  
> **Tự động đóng gói lúc**: 2026-09-23 07:42:38Z

---

## 1. Bản Chất Kiến Trúc & Giá Trị Cốt Lõi (Architectural Essence)

* **Mục tiêu cốt lõi**: An AI agent that drives a real anti-detect browser: say what you want in plain English and it navigates, clicks, types and extracts. MCP server for coding ag...
* **Lĩnh vực áp dụng**: Tự động hóa lập trình, Tác tử AI (AI Agents), và Tối ưu hóa quy trình kỹ thuật.
* **Các tính năng nổi bật được trích xuất**:
- **`--openrouter-key`** Your key, or the `OPENROUTER_API_KEY` variable.
- **`--model`** An OpenRouter model id, or `INVISIBLE_MCP_MODEL`. Defaults to `z-ai/glm-5.3-flash`.
- **`--proxy`** Optional. `http://user:pass@proxy.example.com:8080` or
- **`--binary`** An engine binary you already have. It must be the build the seal
- **`--seed`** An integer. Same seed, same browser identity, every run.
- **`--profile-dir`** A directory to keep the profile in, so logins and cookies

---

## 2. Thông Số Kỹ Thuật & Cú Pháp Lệnh (Specifications & Contracts)

Dưới đây là các cấu trúc lệnh và cấu hình thực thi tiêu chuẩn được trích xuất từ tài liệu chính thức:

```bash
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
$env:Path = "$env:USERPROFILE\.local\bin;$env:Path"

curl -LsSf https://astral.sh/uv/install.sh | sh
source $HOME/.local/bin/env
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