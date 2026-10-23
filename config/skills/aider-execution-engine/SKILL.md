---
name: aider-execution-engine
description: Kích hoạt động cơ gõ code Aider CLI qua MCP Server để tự động hóa Vibe Coding với Gemini 3.6 Flash / 3.5 Flash, auto-commit và auto-test.
---

# Aider Execution Engine Skill

Sử dụng skill này khi người dùng yêu cầu thực hiện sửa đổi code phức tạp, refactor dự án, hoặc cần đảm bảo code được tự động commit và chạy unit test tới khi PASS mà không bị lặp lỗi.

## Các công cụ được cung cấp qua MCP Server (`mcp_server_aider.py`):

1. `aider_run_task(prompt, cwd, model="gemini/gemini-3.6-flash", test_cmd="", files=[])`
   - Gọi Aider chạy task sửa code tự động với các model Gemini thế hệ mới nhất (`gemini-3.6-flash`, `gemini-3.5-flash`).
   - Thêm `--test-cmd` để Aider tự chạy test background và tự sửa lỗi nếu test fail.

2. `aider_undo(cwd)`
   - Nút hoàn tác (Rollback) khẩn cấp khi phát hiện Aider sửa sai hoặc lặp lại lỗi.

3. `aider_get_repomap(cwd)`
   - Trích xuất đồ thị cấu trúc codebase (Repo Map) từ Tree-sitter.

4. `aider_get_status(cwd)`
   - Xem nhanh trạng thái git status và lịch sử commit gần nhất.

## Quy Trình Xử Lý Chuẩn:

1. **B1: Lập Plan**: Antigravity phân tích yêu cầu và xuất Implementation Plan.
2. **B2: Gọi Aider**: Sử dụng `aider_run_task` để Aider thực thi sửa code.
3. **B3: Verification**: Kiểm tra kết quả. Nếu Aider gặp sự cố lặp, gọi `aider_undo` để rollback và thử lại với prompt rõ ràng hơn.

## 💰 Định Tuyến Mô Hình Nhận Biết Chi Phí & Khung Nhận Thức CVM (Cost-Aware Routing & CVM Harness — EVO-20261023)

* **Định tuyến Mô hình Nhận biết Chi phí (`Cost-Aware Model Routing` kế thừa `cc-haha` & `TokenCostController`)**: Tự động phân bổ các tác vụ sửa đổi boilerplate/UI sang phân tầng tốc độ cao và dành ngân sách suy luận sâu cho kiến trúc lõi, đồng thời bảo vệ trần `128K Output Token Headroom`.
* **Môi trường Thực thi Nhận thức (`Cognitive Virtual Machine - CVM` kế thừa `tianshu-harness`)**: Khóa chặt mục tiêu ban đầu (`Zero Goal Drift`), bắt buộc mọi thay đổi từ Aider phải đi kèm bằng chứng chạy `--test-cmd` đạt `Exit Code: 0` trước khi đóng gói commit.
