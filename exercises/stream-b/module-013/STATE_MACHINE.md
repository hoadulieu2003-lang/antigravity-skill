# STATE MACHINE SPECIFICATION — MODULE 13

```yaml
system: TRIPFLOW Daily Departure Brief
patterns:
  - P1: Disclosure Continuity FSM
  - P2: Action Feedback FSM
  - P3: Attention Without Alarm State
revision: R01 (Reconciled with Review 001)
```

---

## 1. Pattern P1 — Disclosure Continuity FSM

### 1.1. Sơ đồ trạng thái
```text
[CLOSED] --(TOGGLE_OPEN)--> [OPENING] --(ANIMATION_END)--> [OPEN]
   ^                           |                             |
   |                           +---(INTERRUPT_CLOSE)---------+
   |                                                         |
   +----(ANIMATION_END)---- [CLOSING] <--(TOGGLE_CLOSE)------+
```

### 1.2. Bảng chuyển trạng thái
| Trạng thái hiện tại | Sự kiện kích hoạt (Event) | Điều kiện bảo vệ (Guard) | Trạng thái kế tiếp | Tác vụ đi kèm (Side Effect) | ARIA State |
|---|---|---|---|---|---|
| `CLOSED` | `TOGGLE_OPEN` | `details.open === false` | `OPENING` | Kích hoạt animation; mở `details.open = true` | `aria-expanded="true"` |
| `OPENING` | `ANIMATION_END` | Quá trình mở hoàn tất | `OPEN` | Dọn sạch inline styles; `getAnimations().length === 0` | `aria-expanded="true"` |
| `OPENING` | `TOGGLE_CLOSE` | Nhấp chuột trước khi mở xong | `CLOSING` | Đảo chiều animation từ vector/progress hiện tại; không jump/pop | `aria-expanded="false"` |
| `OPEN` | `TOGGLE_CLOSE` | `details.open === true` | `CLOSING` | Kích hoạt animation đóng | `aria-expanded="false"` |
| `CLOSING` | `ANIMATION_END` | Quá trình đóng hoàn tất | `CLOSED` | Đóng `details.open = false`; dọn sạch inline styles | `aria-expanded="false"` |
| `CLOSING` | `TOGGLE_OPEN` | Nhấp chuột trước khi đóng xong | `OPENING` | Đảo chiều sang trạng thái mở từ progress hiện tại | `aria-expanded="true"` |

### 1.3. Cơ chế chịu gián đoạn & Khả năng truy cập
- **Bàn phím & Focus**: `summary` giữ nguyên trạng thái `document.activeElement`. Không bao giờ đánh cắp focus khi panel mở ra.
- **Reversal from Current Vector**: Khi người dùng nhấn liên tục, animation được đảo chiều (`anim.reverse()` hoặc tính toán lại từ current `currentTime`/`playbackRate`), không tạo visual pop và không để lại `fill: forwards`.
- **Reduced Motion**: Bỏ qua các bước `OPENING` và `CLOSING`, chuyển trực tiếp giữa `CLOSED` và `OPEN` với duration `0s`, displacement `0px`.

---

## 2. Pattern P2 — Action Feedback FSM (Nghiệp vụ Cập nhật Nhật ký T01)

### 2.1. Sơ đồ trạng thái
```text
             +---(ERROR_EVENT)----+
             v                    |
[IDLE] -> [PENDING] -> [SUCCESS]  |
             ^                    |
             +---[RETRY]----------+
```

### 2.2. Bảng đặc tả chi tiết các pha FSM
| Trạng thái | Nút bấm hiển thị | Thuộc tính DOM & ARIA | Hành vi tương tác | Thông báo Live Region | Timing / Duration |
|---|---|---|---|---|---|
| `IDLE` | "Cập nhật Nhật ký Đoàn" | `aria-disabled="false"`, `data-state="idle"` | Cho phép click / phím Enter | "" (rỗng) | 0ms |
| `PENDING` | "Đang lưu nhật ký..." | `aria-disabled="true"`, `data-state="pending"` | Khóa kích hoạt kép; bỏ qua click | "Hệ thống đang gửi cập nhật nhật ký T01..." | Pulse đơn: activeDuration ≤ 240ms (≤ trần 300ms) |
| `SUCCESS` | "Đã cập nhật thành công ✓" | `aria-disabled="false"`, `data-state="success"` | Settle sau 3000ms trở về `IDLE` | "Cập nhật nhật ký tour T01 thành công." | Scale 1.01/1.02: 160-180ms |
| `ERROR` | "Lỗi kết nối — Thử lại ⟳" | `aria-disabled="false"`, `data-state="error"` | Sẵn sàng cho người dùng nhấn retry | "Cập nhật nhật ký thất bại. Nhấn để thử lại." | Shake 3px/6px: 100-120ms |
| `RETRY` | "Đang lưu nhật ký..." | `aria-disabled="true"`, `data-state="pending"` | Tái kích hoạt chu trình pending | "Đang thử lại cập nhật nhật ký..." | Pulse đơn: activeDuration ≤ 240ms |

### 2.3. Quy chuẩn bảo toàn Định danh & Tiêu điểm (Identity & Focus Invariants)
- **Cùng một nút bấm DOM duy nhất**: Nút bấm giữ nguyên con trỏ phần tử (`#btn-update-t01-log`), tuyệt đối không xóa nút cũ và tạo nút mới.
- **Bảo toàn Focus**: Dùng thuộc tính `aria-disabled="true"` kết hợp JavaScript guard thay vì thuộc tính HTML `disabled` để tránh trình duyệt đẩy focus ra `body`.
- **Trạng thái Canonical T01**: T01 vẫn giữ nguyên trạng thái canonical `Chờ đối tác` (Waiting Partner) xuyên suốt quá trình cập nhật nhật ký.

### 2.4. Deterministic Test Hooks
```javascript
window.__tripflowSetActionOutcome = function(outcome) { window.__nextActionOutcome = outcome; };
window.__tripflowGetActionState = function() { return window.__actionState; };
window.__tripflowGetActionCounters = function() {
  return { attempts: window.__actionAttempts, commits: window.__actionCommits, errors: window.__actionErrors };
};
```

---

## 3. Pattern P3 — Attention Without Alarm (Tập trung Điểm nghẽn T01)

### 3.1. Quy chuẩn kích hoạt
- **Trigger**: Kích hoạt **DUY NHẤT** qua nút bấm tương tác native `#btn-highlight-t01` ("Xem Điểm Nghẽn"). Tuyệt đối **KHÔNG** gắn event click vào `h2.hero-heading` để bảo vệ tính khả truy cập bàn phím (F07).
- **Autoplay**: Tuyệt đối **KHÔNG TỰ CHẠY** khi tải trang.
- **Chu kỳ**: Chạy đúng 1 chu kỳ duy nhất (`iterations: 1`), kéo dài 220ms (Study A) / 240ms (Study B) (≤ trần 300ms), sau đó ổn định trở về trạng thái nền ban đầu.
- **Biên độ an toàn**: Dịch chuyển trục Y tối đa **4px (A) / 6px (B)** (ngưỡng Directive ≤ 8px); scale tối đa **1.01 (A) / 1.02 (B)** (ngưỡng Directive ≤ 1.02).
- **Reduced Motion**: Thay đổi viền nổi bật trong 200ms mà không dịch chuyển không gian hay co giãn tỷ lệ (0px, scale 1.0).
