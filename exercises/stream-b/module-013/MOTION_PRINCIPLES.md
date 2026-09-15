# MOTION PRINCIPLES — MODULE 13

```yaml
system: TRIPFLOW Daily Departure Brief
stream: B (Expressive Experience)
module: 13 (Motion Foundation)
authority: Antigravity Tab B
status: DRAFT_PENDING_CONTROLLER
reference_sources:
  - "W3C WCAG 2.2 Animation from Interactions (Guideline 2.3.3)"
  - "MDN CSS prefers-reduced-motion Media Query"
  - "W3C CSS Easing Functions Level 2"
  - "MDN Web Animations API (WAAPI)"
```

---

## 1. Tuyên ngôn Cốt lõi (Core Thesis)

Trong môi trường điều phối lữ hành B2B áp lực cao (High-Pressure Operational Dispatch), chuyển động không bao giờ là vật trang trí (Ornamentation) hay biểu diễn thị giác (App Demo). Mọi chuyển động trong hệ thống TRIPFLOW Daily Departure Brief phải đóng vai trò là **Công cụ Nhận thức (Cognitive Tool)**: làm rõ ranh giới trạng thái (State Boundaries), giảm giật thị giác (Visual Discontinuity), hướng sự chú ý có chừng mực (Restrained Attention) và bảo toàn tính toàn vẹn của tác vụ mà không làm trì hoãn người điều phối.

---

## 2. Hệ Thống 6 Nguyên Lý Chuyển Động Nền Tảng (MP-01 đến MP-06)

### MP-01: Chuyển Động Là Quan Hệ Nhân Quả (Motion as Causality)
* **Quy chuẩn**: Mọi chuyển động hợp lệ bắt buộc phải trả lời được chuỗi quan hệ nhân quả nghiêm ngặt:
  $$\text{Trigger (Kích hoạt)} \longrightarrow \text{State Change (Đổi trạng thái)} \longrightarrow \text{Motion Cue (Chỉ dẫn động)} \longrightarrow \text{Settled State (Trạng thái ổn định)}$$
* **Nguyên tắc**: Nếu loại bỏ chuyển động mà người dùng không bị mất thông tin hay mất định hướng không gian, chuyển động đó chỉ đóng vai trò hỗ trợ tính liên tục (Continuity); tuyệt đối không tự phong là "thiết yếu" (Essential).
* **Ứng dụng TRIPFLOW**: Khi mở panel nguồn gốc tài sản (Disclosure Panel), việc xoay icon chỉ thị góc mở và trải nội dung xuống chứng minh mối quan hệ giữa hành vi click và sự xuất hiện của dữ liệu.

### MP-02: Thời Lượng Xuất Phát Từ Khoảng Biến Đổi (Purpose-Driven Duration)
* **Quy chuẩn**: Thời lượng (Duration) không được chọn theo cảm tính mà phải tỉ lệ thuận với quãng đường biến đổi và mức độ khẩn cấp của trạng thái. Khóa chết thang đo:
  * `duration-fast` (100–120ms): Phản hồi vi mô tại chỗ (Micro-feedback, hover, focus, toggle icon).
  * `duration-base` (160–180ms): Chuyển trạng thái component thông thường (Disclosure open/close, card expansion).
  * `duration-slow` (220–240ms): Chuyển trạng thái phức tạp, cảnh báo hoặc nhấn mạnh (Attention callout, status badge change).
* **Khóa cứng (Hard Cap)**: Tuyệt đối không transition hoặc chu kỳ hoạt ảnh nào có active duration vượt quá **300ms** (`max_duration_ms: 300`). Mọi transition đều có độ trễ mặc định bằng **0ms** (`delay: 0ms`).

### MP-03: Đường Cong Gia Tốc Thể Hiện Động Lực Học (Dynamics, Not Ornament)
* **Quy chuẩn**: Easing curve phải mô phỏng vật lý thực tế của bề mặt phẳng, phản ánh ý định chức năng của thao tác:
  * `ease-enter` (`cubic-bezier(0, 0, 0.2, 1)` / `cubic-bezier(0, 0, 0, 1)`): Giảm tốc nhanh (Decelerate) để trạng thái mới ổn định ngay lập tức trong tầm mắt người dùng.
  * `ease-exit` (`cubic-bezier(0.25, 0, 0.3, 1)` / `cubic-bezier(0.3, 0, 1, 1)`): Tăng tốc thoát (Accelerate exit), rút lui nhanh chóng để không bắt người điều phối phải chờ đợi.
  * `ease-standard` (`cubic-bezier(0.2, 0, 0.2, 1)` / `cubic-bezier(0.2, 0, 0, 1)`): Dành cho các thay đổi diễn ra tại chỗ (In-place transitions, button state).
  * `ease-linear` (`linear`): Chỉ dùng khi vận tốc đều mang giá trị ngữ nghĩa.
* **Điều cấm kỵ**: Tuyệt đối **KHÔNG** dùng hiệu ứng nảy (Bounce), co giãn (Elastic), dao động quá đà (Overshoot) hay lò xo giả (Fake Spring) trong giao diện điều phối nghiệp vụ.

### MP-04: Ưu Tiên Thuộc Tính Tổng Hợp Đồ Hoạ (Composite-First Containment)
* **Quy chuẩn**: Ưu tiên tối thượng các thuộc tính được xử lý trực tiếp bởi luồng tổng hợp (Compositor Thread):
  * ✅ **Thuộc tính ưu tiên (Primary)**: `transform` (translate, scale, rotate) và `opacity`.
  * ⚠️ **Thuộc tính trạng thái vi mô được phép (Restrained State Feedback)**: `background-color`, `border-color`, `color` cho feedback nút bấm và viền cảnh báo khi đo đạc chứng minh không drop frame và không kích hoạt layout shift.
  * ❌ **Tuyệt đối cấm (Forbidden)**: Animate `width`, `height`, `top`, `left`, `bottom`, `right`, `margin`, `padding`, `grid-template-*`, `box-shadow`, `filter` hoặc `perspective`.
* **Chỉ số kiểm soát**: Bắt buộc đạt `layout_shift_during_pattern: 0` (CLS = 0) được đo bằng `PerformanceObserver`.

### MP-05: Khả Năng Chịu Gián Đoạn & Đảo Chiều Tức Thì (Interruption Resilience)
* **Quy chuẩn**: Trong quá trình vận hành thực tế, người điều phối có thể nhấp chuột liên tục (Rapid-repeat inputs) trước khi animation hiện tại hoàn tất. Hệ thống phải:
  * Đảo chiều vector chuyển động mượt mà từ vị trí/tiến độ hiện tại (Reversal from current vector) mà không gây giật hình (No visual pop).
  * Tuyệt đối không sinh ra hàng đợi hoạt ảnh (`animation queue length = 0`).
  * Không nhân bản tác vụ ngầm hay gửi trùng lặp yêu cầu mạng (`zero duplicate side-effects`).
  * Dọn dẹp triệt để inline styles và animation objects khi chuyển động kết thúc.

### MP-06: Chế Độ Giảm Chuyển Động Là Bản Thể Tương Đương (Reduced-Motion Equivalence)
* **Quy chuẩn**: Khi người dùng kích hoạt `prefers-reduced-motion: reduce`:
  * Toàn bộ chuyển vị không gian (Spatial displacement) đưa về **`0px`**.
  * Thời lượng hoạt ảnh không thiết yếu giảm về **`0s`** (hoặc `0.01ms`).
  * Loại bỏ hoàn toàn độ trễ (`delay: 0s`).
  * Trạng thái đích (Settled State) hiển thị ngay lập tức mà không có hiệu ứng flash hay nhấp nháy mạnh.
  * **Bảo toàn 100% chức năng và ngữ nghĩa**: Toàn bộ văn bản phản hồi, nhãn trạng thái (`aria-live`), tiêu điểm bàn phím (`focus`) và luồng dữ liệu phải giữ nguyên vẹn.
