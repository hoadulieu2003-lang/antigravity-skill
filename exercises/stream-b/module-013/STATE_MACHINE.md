# STATE MACHINE SPECIFICATION — MODULE 13

```yaml
system: TRIPFLOW Daily Departure Brief
patterns:
  - P1: Disclosure Continuity FSM
  - P2: Action Feedback FSM
  - P3: Attention Without Alarm State
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
| `CLOSED` | `TOGGLE_OPEN` | `details.open === false` | `OPENING` | Kích hoạt WAAPI / CSS class `.is-opening`; mở `details.open = true` | `aria-expanded="true"` |
| `OPENING` | `ANIMATION_END` | Quá trình mở hoàn tất | `OPEN` | Gỡ class `.is-opening`; dọn sạch inline styles | `aria-expanded="true"` |
| `OPENING` | `TOGGLE_CLOSE` | Nhấp chuột trước khi mở xong | `CLOSING` | Đảo chiều vector chuyển động ngay lập tức từ vị trí hiện tại | `aria-expanded="false"` |
| `OPEN` | `TOGGLE_CLOSE` | `details.open === true` | `CLOSING` | Kích hoạt class `.is-closing` (120ms) | `aria-expanded="false"` |
| `CLOSING` | `ANIMATION_END` | Quá trình đóng hoàn tất | `CLOSED` | Đóng `details.open = false`; dọn sạch inline styles | `aria-expanded="false"` |
| `CLOSING` | `TOGGLE_OPEN` | Nhấp chuột trước khi đóng xong | `OPENING` | Đảo chiều sang trạng thái mở lập tức | `aria-expanded="true"` |

### 1.3. Cơ chế chịu gián đoạn & Khả năng truy cập
- **Bàn phím & Focus**: `summary` giữ nguyên trạng thái `document.activeElement`. Không bao giờ đánh cắp focus khi panel mở ra.
- **Reduced Motion**: Bỏ qua các bước `OPENING` và `CLOSING`, chuyển trực tiếp giữa `CLOSED` và `OPEN` với duration `0s`.

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
| Trạng thái | Nút bấm hiển thị | Thuộc tính DOM & ARIA | Hành vi tương tác | Thông báo Live Region |
|---|---|---|---|---|
| `IDLE` | "Cập nhật Nhật ký Đoàn" | `aria-disabled="false"`, `data-state="idle"` | Cho phép click / phím Enter | "" (rỗng) |
| `PENDING` | "Đang lưu nhật ký..." + spinner tĩnh | `aria-disabled="true"`, `data-state="pending"` | Khóa kích hoạt kép; bỏ qua click | "Hệ thống đang gửi cập nhật nhật ký..." |
| `SUCCESS` | "Đã cập nhật thành công ✓" | `aria-disabled="false"`, `data-state="success"` | Settle sau 2400ms trở về `IDLE` | "Cập nhật nhật ký tour T01 thành công." |
| `ERROR` | "Lỗi kết nối — Thử lại ⟳" | `aria-disabled="false"`, `data-state="error"` | Sẵn sàng cho người dùng nhấn retry | "Cập nhật nhật ký thất bại. Nhấn để thử lại." |
| `RETRY` | "Đang thử lại..." | `aria-disabled="true"`, `data-state="pending"` | Tái kích hoạt chu trình pending | "Đang thử lại cập nhật nhật ký..." |

### 2.3. Quy chuẩn bảo toàn Định danh & Tiêu điểm (Identity & Focus Invariants)
- **Cùng một nút bấm DOM duy nhất**: Nút bấm giữ nguyên con trỏ phần tử (`#btn-update-t01-log`), tuyệt đối không xóa nút cũ và tạo nút mới.
- **Bảo toàn Focus**: Khi người dùng nhấn nút bằng phím Space hoặc Enter, focus vẫn nằm tại `#btn-update-t01-log`. Khi chuyển sang `pending`, dùng thuộc tính `aria-disabled="true"` kết hợp JavaScript guard thay vì thuộc tính HTML `disabled` (để tránh trình duyệt đẩy focus ra `body`).
- **Trạng thái Canonical T01**: T01 vẫn giữ nguyên trạng thái canonical `Chờ đối tác` (Waiting Partner) xuyên suốt quá trình cập nhật nhật ký.

### 2.4. Deterministic Test Hooks (Điểm móc kiểm thử tất định)
Để phục vụ kiểm thử tự động độc lập mà không phụ thuộc vào thời gian ngẫu nhiên:
```javascript
// Hook thiết lập kết quả tiếp theo của thao tác
window.__tripflowSetActionOutcome = function(outcome) {
  // outcome: 'success' | 'error'
  window.__nextActionOutcome = outcome;
};

// Hook đọc trạng thái FSM hiện tại
window.__tripflowGetActionState = function() {
  return window.__actionFSM ? window.__actionFSM.state : 'idle';
};

// Hook đếm số lần kích hoạt và commit
window.__tripflowGetActionCounters = function() {
  return {
    attempts: window.__actionAttempts || 0,
    commits: window.__actionCommits || 0,
    errors: window.__actionErrors || 0
  };
};
```

---

## 3. Pattern P3 — Attention Without Alarm (Tập trung Điểm nghẽn T01)

### 3.1. Quy chuẩn kích hoạt
- **Trigger**: Kích hoạt tường minh qua nút "Xem Điểm nghẽn" (`#btn-highlight-t01`) hoặc khi điều phối viên nhấp vào dòng T01 trong bảng vận hành.
- **Autoplay**: Tuyệt đối **KHÔNG TỰ CHẠY** khi tải trang (`no-autoplay-on-load`).
- **Chu kỳ**: Chạy đúng 1 chu kỳ duy nhất (`iteration-count: 1`), kéo dài 240ms, sau đó ổn định trở về trạng thái nền ban đầu.
- **Biên độ an toàn**: Dịch chuyển trục Y tối đa **4px** (ngưỡng an toàn Directive là ≤8px), tỷ lệ phóng đại tối đa **1.015** (ngưỡng an toàn là ≤1.02).
- **Reduced Motion**: Thay đổi viền nổi bật (`border-color: #D97706`) trong 200ms mà không dịch chuyển không gian hay co giãn tỷ lệ.
