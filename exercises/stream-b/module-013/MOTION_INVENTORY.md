# MOTION INVENTORY — MODULE 13

| ID | Pattern | Trigger | From → To | Purpose | Property | Duration | Easing | Interrupt rule | Reduced mode | Evidence |
|---|---|---|---|---|---|---:|---|---|---|---|
| TR-01 | P1 (Disclosure) | Click / Enter / Space trên summary | closed → open | Xoay icon chevron 90° chỉ thị hướng mở rộng panel | `transform: rotate(0deg → 90deg)` | 160ms (A) / 180ms (B) | `ease-standard` | Đảo chiều lập tức từ góc quay hiện tại | `rotate(0deg)`, 0s | `[MEASURED: P1/TR-01]` |
| TR-02 | P1 (Disclosure) | Click / Enter / Space trên summary | closed → open | Hiển thị bảng chi tiết nguồn gốc tài sản êm ái, không giật | `opacity: 0 → 1`, `transform: translateY(-4px/-8px → 0px)` | 160ms (A) / 180ms (B) | `ease-enter` | Đảo chiều từ vị trí hiện tại | `opacity: 1`, `translateY(0px)`, 0s | `[MEASURED: P1/TR-02]` |
| TR-03 | P1 (Disclosure) | Click / Enter / Space trên summary | open → closed | Thu gọn nội dung nguồn gốc tài sản về trạng thái ẩn | `opacity: 1 → 0`, `transform: translateY(0px → -4px/-8px)` | 100ms (A) / 120ms (B) | `ease-exit` | Đảo chiều sang open ngay lập tức | `opacity: 0`, `translateY(0px)`, 0s | `[MEASURED: P1/TR-03]` |
| TR-04 | P2 (Action FSM) | Click 'Cập nhật Nhật ký Đoàn' | idle → pending | Báo hiệu hệ thống đang gửi yêu cầu đối soát tới đối tác | `opacity: 1 → 0.75 → 1` (pulse đơn, activeDuration ≤ 240ms) | 220ms (A) / 240ms (B) | `ease-standard` | Khóa kích hoạt kép (`aria-disabled`) | `opacity: 1`, text 'Đang lưu...', 0s | `[MEASURED: P2/TR-04]` |
| TR-05 | P2 (Action FSM) | Sự kiện thành công (Resolved) | pending → success | Xác nhận cập nhật nhật ký thành công và đã lưu an toàn | `background-color`, `border-color`, `transform: scale(1.0 → 1.01/1.02 → 1.0)` | 160ms (A) / 180ms (B) | `ease-enter` | Trạng thái cuối ổn định, không ngắt | Đổi màu nền xanh lá sage tức thì, 0s | `[MEASURED: P2/TR-05]` |
| TR-06 | P2 (Action FSM) | Sự kiện lỗi (Network/Partner fail) | pending → error | Báo hiệu đối tác phản hồi lỗi, cần người điều phối thử lại | `transform: translateX(-3px/-6px → +3px/+6px → 0px)`, `border-color` | 100ms (A) / 120ms (B) | `ease-standard` | Cho phép click retry ngay lập tức | Viền đỏ cảnh báo tức thì, không shake, 0s | `[MEASURED: P2/TR-06]` |
| TR-07 | P2 (Action FSM) | Click 'Thử lại' trên nút lỗi | error → pending | Tái kích hoạt chu trình lưu nhật ký lần thứ hai | `opacity: 1 → 0.75`, hoàn nguyên nhãn | 100ms (A) / 120ms (B) | `ease-standard` | Chuyển sang pending, khóa click | Chuyển nhãn ngay lập tức, 0s | `[MEASURED: P2/TR-07]` |
| TR-08 | P3 (Attention) | Click nút 'Xem Điểm Nghẽn' (#btn-highlight-t01) | dormant → active | Hướng tầm mắt điều phối viên vào thông tin 4 phòng chưa xác nhận | `transform: translateY(0px → -4px/-6px → 0px)`, `scale: 1.0 → 1.01/1.02 → 1.0`, `border-color` | 220ms (A) / 240ms (B) | `ease-enter` | Chạy 1 chu kỳ duy nhất rồi settle | Viền hổ phách sáng tức thì 200ms, 0s | `[MEASURED: P3/TR-08]` |

---

## Rationale Chi Tiết Theo Nhóm Chuyển Động

1. **Nhóm Disclosure Continuity (TR-01, TR-02, TR-03)**:
   * Mục tiêu: Duy trì liên tục nhận thức khi tra cứu nguồn gốc tài sản. Xoay chevron 90° chỉ thị hướng mở; trải content với biên độ 4px (Study A) hoặc 8px (Study B) giúp người dùng thấy rõ quan hệ nguồn gốc mà không che lấp vùng nhìn.
2. **Nhóm Action Feedback FSM (TR-04, TR-05, TR-06, TR-07)**:
   * Mục tiêu: Phản hồi nghiệp vụ tin cậy và tức thời. Pending dùng xung đơn (single pulse) có active duration ≤ 240ms (tuân thủ nghiêm ngặt trần 300ms). Lỗi dùng shake biên độ kìm hãm (3px trong A, 6px trong B); thành công đổi màu nền và viền kèm nhãn text `aria-live="polite"` rõ ràng.
3. **Nhóm Attention Without Alarm (TR-08)**:
   * Mục tiêu: Hướng tầm mắt vào điểm nghẽn T01 sau khi người dùng chủ động click nút `#btn-highlight-t01`. Tuyệt đối không tự chạy khi tải trang (no autoplay), không loop vô hạn, không dùng box-shadow lớn, và settle sạch sẽ về trạng thái ban đầu.
