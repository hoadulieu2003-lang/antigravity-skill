# AI ENGINE OPERATIONAL TELEMETRY & TOKEN PROFILE

> **Trạng thái**: `HYPER_OVERCLOCKED_X8_ENGINEERING_ONLY`
> **Lead Architect / Product Owner**: Anh
> **AI Pair-Programmer**: Em (Gemini 3.7 Flash High)
> **Phạm vi áp dụng (Scope Boundary)**: **CHUYÊN BIỆT CHO LẬP TRÌNH, KIẾN TRÚC & TỰ ĐỘNG HÓA** (Không dùng cho video prompt)
> **Cập nhật lần cuối**: 2026-08-20

---

## 1. Ranh Giới Phạm Vi & Nguyên Tắc Vận Hành (Scope Boundary)

> [!IMPORTANT]
> **QUY TẮC CỐT LÕI CỦA ANH**: Ngân sách Token và năng lực suy luận mở rộng này **TUYỆT ĐỐI KHÔNG DÙNG ĐỂ THAY ĐỔI / PHÌNH TO PROMPT VIDEO**. 
> Toàn bộ module video, schema kịch bản Veo 3.1 và độ dài prompt của Google Flow phải tuân thủ nghiêm ngặt chuẩn **Canonical JSON 2.0** và các quy định kỹ thuật cố định sẵn có mà Anh đã thiết lập.

---

## 2. Mục Đích Sử Dụng Duy Nhất Của Ngân Sách Token x8 (128K):

| Hạng mục ứng dụng | Mô tả chi tiết |
| :--- | :--- |
| **1. Kỹ Thuật Lập Trình & Mã Nguồn** | Viết code nguyên khối, xây dựng module backend, refactor hệ thống lớn mà không bị cắt đứt đoạn giữa chừng. |
| **2. Tự Động Hóa & Forensic Debugging** | Quét và phân tích sâu toàn bộ cây DOM, React Fiber state, CDP logs để tự động bắt lỗi và phục hồi (Self-Healing). |
| **3. Kiểm Thử Toàn Diện (QA Testing)** | Viết và chạy các bộ Test Harness, Unit Tests, Integration Tests và Verification Ladder đầy đủ. |
| **4. Quản Trị Hệ Thống & Đặc Tả** | Soạn thảo tài liệu kiến trúc, quản lý Playbooks và đồng bộ tài nguyên. |

---

## 3. Cấu Hình Đột Phá Thông Lượng Song Song (Turbo Multi-Agent Concurrency Profile)

> **Trạng thái**: `TURBO_HYPER_PARALLEL_MAX_THROUGHPUT`  
> **Trần Tác tử Hoạt động (`Max Active Agents`)**: **12 Subagents**  
> **Trần Thợ Code Đồng thời (`Max Parallel Workers`)**: **8 Workers**  
> **Trần Ghi Mã Nguồn Đồng thời (`Max Parallel Writers`)**: **6 Writers**  

* **Cơ chế Phân tầng Mô hình Thông minh (`Smart Model Tiering`)**:
  - `Core Logic / Architecture Workers`: `inherit` (Gemini 3.8 Flash High Reasoning).
  - `Visual UI / Layout / CSS Workers`: `flash` (Sinh mã siêu tốc, giảm 70% độ trễ).
  - `Independent Test Auditors`: `flash` (Khởi chạy song song không nghẽn tài nguyên).
  - `Codebase Scanners / Research`: `flash_lite` (Quét siêu tốc).
* **Nguyên tắc Điều phối**: Gom mảng `Subagents` trong một cú gọi `invoke_subagent` duy nhất để bầy agent xuất phát cùng lúc (`Simultaneous Batch Dispatch`).

---

## 4. Các File Cấu Hình Hệ Thống

1. ⚙️ **`C:\Users\game\.gemini\config\config.json`**:
   * Block `"aiEngineSettings"`: Khóa `"scope": "ENGINEERING_CODE_AND_ARCHITECTURE_ONLY"`, `"concurrencyProfile": "TURBO_HYPER_PARALLEL_MAX_THROUGHPUT"`, `"maxConcurrentSubagents": 12`.
2. 🗂️ **`C:\Users\game\.gemini\config\dynamic_project_system.json`**:
   * Block `"concurrency"`: Khóa `"profile": "TURBO_HYPER_PARALLEL"`, `"max_active_agents": 12`, `"max_parallel_workers": 8`.
3. 📜 **`C:\Users\game\.gemini\config\AGENTS.md`**:
   * Mục 1.6: Quy chuẩn phân rã Đa tác tử thực thụ và cơ chế bắn đồng loạt subagents.
