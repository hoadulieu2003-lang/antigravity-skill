# MOTION INVENTORY — MODULE 13

| ID | Pattern | Trigger | From → To | Purpose | Property | Duration | Easing | Interrupt rule | Reduced mode | Evidence |
|---|---|---|---|---|---|---:|---|---|---|---|
| TR-01 | P1 (Disclosure) | Click / Enter / Space trên summary | closed → open | Xoay icon chevron 90° chỉ thị hướng mở rộng panel | `transform: rotate(0deg → 90deg)` | 180ms (`base`) | `cubic-bezier(0.2, 0, 0, 1)` | Đảo chiều lập tức khi click lại | `rotate(0deg)`, 0s | `[MEASURED: T05/A01]` |
| TR-02 | P1 (Disclosure) | Click / Enter / Space trên summary | closed → open | Hiển thị bảng chi tiết nguồn gốc tài sản êm ái, không giật | `opacity: 0 → 1`, `transform: translateY(-4px → 0px)` | 180ms (`base`) | `cubic-bezier(0, 0, 0, 1)` | Hủy transition, đóng tức thì | `opacity: 1`, `translateY(0px)`, 0s | `[MEASURED: T05/A02]` |
| TR-03 | P1 (Disclosure) | Click / Enter / Space trên summary | open → closed | Thu gọn nội dung nguồn gốc tài sản về trạng thái ẩn | `opacity: 1 → 0`, `transform: translateY(0px → -4px)` | 120ms (`fast`) | `cubic-bezier(0.3, 0, 1, 1)` | Đảo chiều sang open ngay lập tức | `opacity: 0`, `translateY(0px)`, 0s | `[MEASURED: T05/A03]` |
| TR-04 | P2 (Action FSM) | Click 'Cập nhật Nhật ký Đoàn' | idle → pending | Báo hiệu hệ thống đang gửi yêu cầu đối soát tới đối tác | `opacity: 1 → 0.75 → 1` (pulse đơn) | 240ms (`slow`) | `cubic-bezier(0.2, 0, 0, 1)` | Khóa kích hoạt kép (`aria-disabled`) | `opacity: 1`, text 'Đang lưu...', 0s | `[MEASURED: T06/A01]` |
| TR-05 | P2 (Action FSM) | Sự kiện thành công (Resolved) | pending → success | Xác nhận cập nhật nhật ký thành công và đã lưu an toàn | `background-color`, `border-color`, `transform: scale(1.0 → 1.02 → 1.0)` | 200ms (`base`) | `cubic-bezier(0, 0, 0, 1)` | Trạng thái cuối ổn định, không ngắt | Đổi màu nền xanh lá sage tức thì, 0s | `[MEASURED: T06/A02]` |
| TR-06 | P2 (Action FSM) | Sự kiện lỗi (Network/Partner fail) | pending → error | Báo hiệu đối tác phản hồi lỗi, cần người điều phối thử lại | `transform: translateX(-4px → +4px → 0px)`, `border-color` | 180ms (`base`) | `cubic-bezier(0.2, 0, 0, 1)` | Cho phép click retry ngay lập tức | Viền đỏ cảnh báo tức thì, không shake, 0s | `[MEASURED: T06/A03]` |
| TR-07 | P2 (Action FSM) | Click 'Thử lại' trên nút lỗi | error → pending | Tái kích hoạt chu trình lưu nhật ký lần thứ hai | `opacity: 1 → 0.75`, hoàn nguyên nhãn | 120ms (`fast`) | `cubic-bezier(0.2, 0, 0, 1)` | Chuyển sang pending, khóa click | Chuyển nhãn ngay lập tức, 0s | `[MEASURED: T06/A04]` |
| TR-08 | P3 (Attention) | Click 'Tập trung Điểm nghẽn' | dormant → active | Hướng tầm mắt điều phối viên vào thông tin 4 phòng chưa xác nhận | `transform: translateY(0px → -4px → 0px)`, `scale: 1.0 → 1.015 → 1.0` | 240ms (`slow`) | `cubic-bezier(0, 0, 0, 1)` | Chạy 1 chu kỳ duy nhất rồi settle | Viền hổ phách sáng tức thì 200ms, 0s | `[MEASURED: T07/A01]` |

---

## Rationale Chi Tiết Theo Nhóm Chuyển Động

1. **Nhóm Disclosure Continuity (TR-01, TR-02, TR-03)**:
   * Mục tiêu: Bảo đảm tính liên tục (Continuity) khi tra cứu nguồn gốc tài sản. Người điều phối viên B2B cần biết thông tin vừa xuất hiện đến từ đâu. Việc xoay biểu tượng góc mở (Chevron) và dịch chuyển nhẹ 4px theo trục Y cung cấp chỉ dẫn không gian rõ ràng mà không che lấp nội dung bên dưới.
2. **Nhóm Action Feedback FSM (TR-04, TR-05, TR-06, TR-07)**:
   * Mục tiêu: Báo hiệu phản hồi nhân quả (Causality) và độ tin cậy nghiệp vụ. Khi nhấn "Cập nhật Nhật ký", hệ thống phản hồi trạng thái đang xử lý (Pending), hoàn tất (Success) hoặc lỗi (Error) thông qua nhãn văn bản tường minh và âm hưởng thị giác tiết chế. Biên độ chuyển động được kìm hãm ở mức 4px để không làm phân tán sự tập trung.
3. **Nhóm Attention Without Alarm (TR-08)**:
   * Mục tiêu: Nhấn mạnh điểm nghẽn khẩn cấp (Hạ Long T01 chưa xác nhận 4 phòng) một cách điềm đạm. Tuyệt đối không nhấp nháy liên tục (No infinite flashing/looping), không sử dụng âm thanh hay rung lắc mạnh gây hoảng loạn (Anti-alarmist).
