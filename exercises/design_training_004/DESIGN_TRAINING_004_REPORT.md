# BÁO CÁO NGHIỆM THU (REV 002): MODULE 04 — THIẾT KẾ TƯƠNG TÁC
## Trạng thái, Phản hồi và Phục hồi Lỗi (Interaction Design: States, Feedback & Error Recovery)

- **Mã bài tập**: `DESIGN_TRAINING_004`
- **Mã nộp Vòng sửa 1/2**: `DESIGN_TRAINING_004_REPAIR_001`
- **Chủ quản (Product Owner)**: Anh — Lead Architect
- **Cộng sự thực thi (Executor)**: Antigravity — Senior Engineering Agent
- **Đơn vị kiểm toán & Thẩm định (Controller / Reviewer)**: ChatGPT Controller
- **Trạng thái thực nghiệm**: `ALL_GATES_PASSED (T01–T10 100% PASS, F01–F03 RESOLVED)`

---

## 1. Bảng Khắc phục Triệt để 3 Nhóm Finding Theo Review 001 (F01–F03 Matrix)

| Finding | Nội dung Yêu cầu từ Controller | Giải pháp Kiến trúc & Kỹ thuật Đã Triển khai | Bằng chứng Thực nghiệm Khép kín |
| :---: | :--- | :--- | :--- |
| **F01** | **Giữ focus ổn định trong toàn bộ lần thử lại (Retry Focus Preservation)**:<br>Tránh xóa nút `btn-retry` khỏi DOM gây rơi focus về `body` trong đoạn chờ 1.200ms của lần thử lại. Không cướp focus nếu người dùng đã tự Tab sang phần tử ổn định khác. | - **Kiến trúc Single Persistent Action Button**: Nút `#btn-submit` được giữ cố định vĩnh viễn trong DOM qua các trạng thái `editing`, `invalid`, `saving`, `error`.<br>- Khi chuyển sang `error`, nút chính đổi nhãn thành *"Thử lưu lại"* (class `.btn-retry`). Khi bấm Thử lại, nút đổi sang `aria-disabled="true"` và nhãn *"Đang lưu phân công…"*, **vẫn giữ nguyên phần tử trong DOM**, focus không bao giờ bị rơi về `body`.<br>- **Cơ chế Không cướp focus vô điều kiện**: Chỉ chuyển focus có chủ đích sang `#btn-edit-assignment` khi thành công nếu trước đó người dùng đang đứng tại nút submit. Nếu người dùng đã Tab sang phần tử ngoài form (như `#banner-notice`), focus được giữ nguyên vẹn. | - **T05**: `activeElementDuringSaving = "btn-submit"` (kết nối DOM `isButtonConnected = true`).<br>- **T10**: `activeElementDuringRetrySaving = "btn-submit"` (`buttonAriaDisabled = "true"`).<br>- **Kiểm tra bổ sung F01**: Người dùng Tab sang `#banner-notice` trong lúc saving $\to$ sau khi phản hồi về, `activeElement` vẫn là `#banner-notice` (`f01NoStealPass = PASS`).<br>- **Ảnh chụp bổ sung**: `screenshots/mobile_retry_saving_390x844.png`. |
| **F02** | **Kiểm thử đúng tiền điều kiện và đúng phương thức tương tác**:<br>- T03 để lại `saving`, cần chờ hết saving rồi mới reset sạch trước T04.<br>- T10 phải chạy hoàn toàn bằng phím native tuần tự (Tab, Shift+Tab, ArrowDown, Enter), không nhảy cóc, không dispatch event giả tạo.<br>- Phân biệt rõ `Programmatic DOM Click` vs `Pointer Click`. | - Xây dựng hàm `waitForIdleAndReset(page)`: Chờ `state !== 'saving'` với timeout xác định $\to$ click reset mô phỏng $\to$ assert nghiêm ngặt: `state === 'editing'`, `attemptCount === 0`, `commitCount === 0`, nháp/lưu rỗng.<br>- T10 chạy tuần tự 100% bằng phím native qua `page.keyboard` (Tab vào form, ArrowDown chọn select, Tab textarea, Type note, Tab submit, Enter, Enter retry). Đo rect của thông báo và nút trong viewport ở mọi bước.<br>- T06 dùng `page.click` và `page.keyboard.press('Enter')` để kích hoạt thêm 2 lần gửi trong saving.<br>- Phân loại chính xác nhãn phương thức trong log. | - `waitForIdleAndReset` đảm bảo T04 bắt đầu từ trạng thái sạch 100%.<br>- T10 đo đạc đầy đủ: `activeAfter` sau Enter rỗng = `assignee-select` (lỗi hiển thị trong viewport), `activeElement` sau Enter gửi = `btn-submit`, `activeElement` sau retry = `btn-submit`, `activeElement` sau success = `btn-edit-assignment`, `horizontalOverflow = false`.<br>- T06 xác nhận 2 lần kích hoạt thêm bằng click và phím không làm tăng `attemptCount` (vẫn giữ đúng 1). |
| **F03** | **Gói tái hiện dùng được ngoài máy tác giả (Portability)**:<br>- Không hardcode đường dẫn cá nhân `C:/Users/game/...`.<br>- Cho phép cấu hình cổng CDP linh hoạt qua tham số/biến môi trường.<br>- Chuẩn hóa liên kết tương đối trong báo cáo.<br>- Chuẩn hóa dấu gạch xuôi `/` cho các entry trong gói ZIP. | - `verify_module_004.js`: Resolve đường dẫn động dựa trên `__dirname`, nạp `puppeteer-core` linh hoạt, nhận cổng CDP qua `process.env.CDP_PORT || process.argv[2] || '9222'`.<br>- Tự động tạo thư mục `screenshots/` nếu chưa có.<br>- Toàn bộ liên kết trong báo cáo chuyển sang dạng tương đối chuẩn (`./index.html`, `./VERIFICATION.json`, `./screenshots/`).<br>- Đóng gói ZIP với cấu trúc thư mục Unix chuẩn (`screenshots/tên_ảnh.png`). | - Kịch bản chạy mượt mà trên cổng CDP chỉ định `node verify_module_004.js 9222`.<br>- Tệp ZIP giải nén an toàn trên cả Linux và Windows không bị lỗi tên file chứa dấu gạch chéo ngược. |

---

## 2. Hướng dẫn Tái hiện & Môi trường Vận hành Độc lập

### 2.1. Cấu trúc Tài sản Triển khai
- **Tệp nguồn chuẩn (`Canonical Source`)**: [`./index.html`](./index.html)
- **Tệp chỉ thị đề bài (`Spec Directive`)**: [`./DESIGN_TRAINING_004_DIRECTIVE.md`](./DESIGN_TRAINING_004_DIRECTIVE.md)
- **Tệp văn bản thẩm định Review 001**: [`./DESIGN_TRAINING_004_REVIEW_001.md`](./DESIGN_TRAINING_004_REVIEW_001.md)
- **Tệp nhật ký kiểm chứng tự động (`Verification Ledger`)**: [`./VERIFICATION.json`](./VERIFICATION.json)
- **Thư mục ảnh chụp màn hình (`DPR = 2 Screenshots`)**: [`./screenshots/`](./screenshots/)
- **Kịch bản kiểm thử tự động Puppeteer CDP (`Test Harness Script`)**: [`./verify_module_004.js`](./verify_module_004.js)

### 2.2. Cách Chạy và Tái hiện
1. **Trải nghiệm trực tiếp trên trình duyệt**:
   Mở tệp `./index.html` trên bất kỳ trình duyệt Chromium hiện đại nào. Ứng dụng chạy offline hoàn toàn, không phụ thuộc tài nguyên mạng.
2. **Chạy lại kịch bản kiểm thử tự động với cổng CDP tùy chọn**:
   ```bash
   node verify_module_004.js [PORT]
   # Ví dụ:
   node verify_module_004.js 9222
   # Hoặc:
   CDP_PORT=9222 node verify_module_004.js
   ```

---

## 3. Mô hình Máy Trạng thái Hữu hạn FSM & Cơ chế Bảo toàn Focus (F01)

### 3.1. Sơ đồ Kiến trúc FSM & Nút Hành động Cố định (Persistent Action Button)
```
[editing] <=================== (Reset Simulation / Edit Assignment) <===================+
   |                                                                                    |
   +---> (Invalid Submit) --------> [invalid] (Focus -> first invalid field)            |
   |                                                                                    |
   +---> (Valid Submit) ----------> [saving]  (#btn-submit: "Đang lưu...", aria-disabled)
                                       |
                     +-----------------+-----------------+
                     |                                   |
             (First Call Fails)                  (Second Call Succeeds)
                     |                                   |
                     v                                   v
                  [error]                            [success]
          (#btn-submit: "Thử lưu lại",         (#btn-submit: hidden;
           focus giữ nguyên trên nút)           #btn-edit-assignment: visible & focus)
                     |                                   |
              (Click Retry)                              +---> (Click Edit Assignment)
                     |                                                |
                     +---> [saving] (#btn-submit: "Đang lưu...",      +---> [editing]
                                    focus VẪN NẰM TRÊN NÚT NÀY!)
```

### 3.2. Cơ chế Bảo toàn Focus khi Retry và Chống Cướp Focus
1. **Không xóa nút khỏi DOM**: Thay vì xóa phần tử `#btn-retry` và render lại `#btn-submit` gây đứt gãy focus tree, nút chính `#btn-submit` được duy trì liên tục trong suốt vòng đời của biểu mẫu. Khi chuyển trạng thái giữa `error` $\leftrightarrow$ `saving`, nút chỉ thay đổi text hiển thị và thuộc tính `aria-disabled="true"`. Nhờ vậy, `document.activeElement` luôn là `#btn-submit`, triệt tiêu hoàn toàn hiện tượng rơi focus về `body`.
2. **Nguyên tắc Tôn trọng Điều hướng Người dùng (No Unconditional Focus Stealing)**:
   Nếu trong thời gian 1.200ms chờ lưu, người dùng đã chủ động bấm phím `Tab` để di chuyển sang một phần tử ổn định khác ngoài biểu mẫu (như `#banner-notice`), hệ thống ghi nhận trạng thái này và **tuyệt đối không kéo giật focus trở lại nút submit** khi có phản hồi từ máy chủ. Focus chỉ được chuyển có chủ đích nếu người dùng trước đó thực sự đang dừng chân tại nút submit.

---

## 4. Nghiên cứu Học thuật & Tiêu chuẩn có Nguồn gốc (Research Principles)

Ba nguyên tắc chuẩn mực được trích xuất từ W3C WAI:

### Nguyên tắc 1: Tách bạch Phản hồi Cạnh trường (Inline Feedback) và Thông báo Cấp Biểu mẫu (Form-Level Feedback)
- **Nguồn gốc cụ thể**: *W3C WAI — Form Validation & User Notifications (W3C Web Accessibility Initiative, Forms Tutorial)*.
- **Diễn giải**: Lỗi nhập liệu cục bộ của từng trường phải được đặt ngay liền kề trường đó (inline), liên kết ngữ nghĩa bằng `aria-describedby` và `aria-invalid="true"`, giúp người dùng định vị chính xác vị trí sai lệch. Ngược lại, thông báo về tiến trình hệ thống (đang lưu, lỗi máy chủ mạng, hoặc thành công) phải nằm ở cấp độ biểu mẫu tổng thể gần nút kích hoạt hành động chính.
- **Áp dụng trong bài tập**: 
  - Lỗi thiếu người xử lý (*"Chọn người xử lý trước khi lưu."*) và lỗi độ dài ghi chú (*"Ghi chú cần tối đa 200 ký tự."*) hiển thị ngay dưới thẻ control tương ứng qua `<span class="field-error" role="alert">`.
  - Phản hồi lưu phân công (Đang lưu…, Lỗi mạng, Thành công) được đặt tập trung trong container `#form-feedback` (`role="status"`, `aria-live="polite"`).
- **Ngoại lệ & Ranh giới**: Trong biểu mẫu một dòng đơn giản (như ô tìm kiếm đơn), thông báo lỗi có thể gộp chung; nhưng trong biểu mẫu phân công đa trường có độ trễ mạng, việc gộp chung sẽ gây nhầm lẫn bối cảnh.

### Nguyên tắc 2: Phân định Thông báo Trạng thái Không Cướp Focus (Polite Status Messages) và Điều hướng Focus Có Chủ đích (Intentional Focus Management)
- **Nguồn gốc cụ thể**: *W3C WAI — Understanding Success Criterion 4.1.3: Status Messages (WCAG 2.1 / 2.2 Level AA)*.
- **Diễn giải**: Một thông báo trạng thái (`Status Message`) cung cấp thông tin về tiến trình hoặc kết quả mà không làm gián đoạn bối cảnh làm việc bằng cách tự ý cướp focus của người dùng (`without receiving focus`). Việc cướp focus đột ngột khi trạng thái bất đồng bộ xuất hiện vi phạm tính dự đoán được (`Predictability`).
- **Áp dụng trong bài tập**: 
  - Khi biểu mẫu chuyển sang `saving`, thông báo "Đang lưu phân công…" được phát tín hiệu qua `role="status"`. Focus được giữ nguyên vẹn tại nút kích hoạt (`#btn-submit` với thuộc tính `aria-disabled="true"`).
  - Khi hoàn tất thành công, nút submit bị ẩn đi để chống gửi trùng, hệ thống chuyển focus có chủ đích sang `#btn-edit-assignment`. Tuy nhiên, nếu người dùng đã Tab sang phần tử khác trong lúc chờ, hệ thống không cướp focus trở lại.
- **Ngoại lệ & Ranh giới**: Khi xảy ra lỗi validation dữ liệu do người dùng bấm nút submit, việc chuyển focus về trường sai đầu tiên (`assigneeSelect.focus()`) là cần thiết và hợp lệ theo WCAG SC 3.3.1, giúp người dùng sửa lỗi ngay lập tức.

### Nguyên tắc 3: Bảo toàn 100% Dữ liệu Nháp khi Phục hồi Lỗi (Graceful Error Recovery & Data Preservation)
- **Nguồn gốc cụ thể**: *W3C WAI — Designing for Web Accessibility: Error Prevention & Recovery (WCAG SC 3.3.3 Error Suggestion & SC 3.3.4 Error Prevention)*.
- **Diễn giải**: Khi một giao dịch hoặc thao tác gửi dữ liệu gặp sự cố kỹ thuật phía hệ thống, giao diện người dùng có nghĩa vụ bảo toàn 100% dữ liệu mà người dùng đã nhập. Tuyệt đối không được xóa trắng biểu mẫu hoặc buộc người dùng nhập lại từ đầu, đồng thời phải cung cấp cơ chế thử lại trực tiếp ngay tại ngữ cảnh lỗi.
- **Áp dụng trong bài tập**: 
  - Khi lần gửi đầu tiên thất bại sau 1.200ms, toàn bộ giá trị trong `assignee-select` (P02 — Bình) và `note-textarea` (54 ký tự) được giữ nguyên vẹn 100%.
  - Thông báo lỗi hiển thị rõ ràng: *"Chưa lưu được phân công. Dữ liệu bạn nhập vẫn được giữ. Hãy thử lại."* đi kèm nút *"Thử lưu lại"*, cho phép gửi lại ngay chỉ với một phím bấm.
- **Ngoại lệ & Ranh giới**: Với dữ liệu nhạy cảm cao về mặt an ninh (mật khẩu OTP, mã CVV ngân hàng), dữ liệu buộc phải xóa sau xác thực thất bại. Nhưng với dữ liệu phân công công việc thông thường, bảo toàn dữ liệu là nguyên tắc tối thượng.

---

## 5. Hai Điểm Đánh đổi Thiết kế Tương tác (Interaction Design Trade-offs)

### Đánh đổi 1: Duy trì Duy nhất Một Nút Hành động Cố định (Single Persistent Action Button) vs Tạo Nút Mới Động
- **Phương án lựa chọn**: Sử dụng duy nhất một nút `#btn-submit` cố định trong DOM, thay đổi nhãn và trạng thái (`btn-primary` $\leftrightarrow$ `btn-retry`, `aria-disabled="true"`) thay vì xóa và tạo lại nút mới.
- **Lý do lựa chọn**: Giữ nguyên vị trí phần tử trong cây DOM của trình duyệt, bảo toàn focus 100% qua mọi chu kỳ `error` $\to$ `saving` $\to$ `retry`.
- **Điểm đánh đổi (Trade-off)**: Đòi hỏi logic quản trị trạng thái trong JavaScript phải chặt chẽ, tự quản lý các class CSS và chặn sự kiện thủ công khi `aria-disabled="true"`.

### Đánh đổi 2: Tự động Đưa Focus tới Nút Hành động Tiếp theo vs Giữ Nguyên Focus Tuyệt đối
- **Phương án lựa chọn**: Khi lần đầu lỗi, nút chính đổi nhãn thành "Thử lưu lại" và giữ focus; khi thành công, nút submit bị ẩn và focus chuyển có chủ đích sang "Sửa phân công". Nếu người dùng đã Tab sang phần tử khác, hệ thống giữ nguyên vị trí focus của người dùng.
- **Lý do lựa chọn**: Giúp người dùng bàn phím có thể nhấn phím `Enter` để Thử lại ngay lập tức mà không phải duyệt phím Tab lại từ đầu, đồng thời không gây khó chịu cho người dùng đã chủ động di chuyển sang phần tử khác.
- **Điểm đánh đổi (Trade-off)**: Cần thêm biến cờ (`wasFocusedOnSubmit`) để kiểm tra vị trí focus trước khi chuyển trạng thái.

---

## 6. Bảng Kết quả Kiểm chứng Tự động Khóa cứng (T01–T10) — Rev 002

Chạy thực nghiệm độc lập hoàn chỉnh với kịch bản `verify_module_004.js`:

| Ca Kiểm thử | Thao tác Thực tế | Phương thức Tương tác | Kết quả Kiểm tra Đo đạc | Phán quyết |
| :---: | :--- | :--- | :--- | :---: |
| **T01** | Mở trang mới | Khởi tạo trang | `state=editing`, Chưa giao, Rỗng, hai trường mặc định, `attemptCount=0`, `commitCount=0`, không lỗi. | **`PASS`** |
| **T02** | Bấm Lưu phân công khi chưa chọn người | Programmatic DOM Click | `state=invalid`, lỗi: *"Chọn người xử lý trước khi lưu."*, `activeElement=assignee-select`, `attempts=0`, bản lưu không đổi. | **`PASS`** |
| **T03** | Chọn Bình, nhập 201 ký tự 'a' $\to$ Submit $\to$ Sửa 200 ký tự 'a' $\to$ Submit | DOM Input + Programmatic Click | 201 ký tự bị từ chối (`invalid`, `activeEl=note-textarea`, `attempts=0`); sửa 200 ký tự xóa lỗi; submit vào `saving` (`attempts=1`). | **`PASS`** |
| **T04** | Chờ hết saving T03 $\to$ Reset $\to$ Nhập P02 Bình + ghi chú hợp lệ $\to$ Click Lưu phân công lần 1 | Puppeteer Pointer Click (`page.click`) | Trong saving: hiện "Đang lưu phân công…", trường bị khóa, bản lưu Chưa giao; Sau 1.200ms: `state=error`, `attempts=1`, `commits=0`, nháp nguyên vẹn. | **`PASS`** |
| **T05** | Tiếp nối T04, bấm Thử lưu lại | Puppeteer Pointer Click (`page.click`) | Trong saving lần retry: `activeElement=btn-submit` (nút ổn định, kết nối DOM); Sau 1.200ms: `state=success`, `attempts=2`, `commits=1`, `activeElement=btn-edit-assignment`. | **`PASS`** |
| **T06** | Gửi hợp lệ $\to$ Kích hoạt thêm 1 pointer click + 1 phím Enter trong lúc saving | Pointer Click + Keyboard Enter | Chỉ 1 lần gọi duy nhất được chấp nhận (`attemptCount=1`), cả 2 lần kích hoạt thêm bị triệt tiêu; kết thúc `state=error`, `commitCount=0`. | **`PASS`** |
| **T07** | Từ lỗi gửi (Bình), đổi sang Chi (P03) $\to$ Bấm Lưu phân công | DOM Change + Programmatic Click | Đổi trường đưa về `editing`, xóa lỗi gửi cũ; lần gửi thứ 2 thành công với Chi (`commits=1`), không lưu nhầm Bình. | **`PASS`** |
| **T08** | Từ `success`, bấm Sửa phân công | Programmatic DOM Click | `state=editing`, `activeElement=assignee-select`, điền sẵn dữ liệu P03 + ghi chú, bản lưu giữ nguyên, không sinh lần gọi mới. | **`PASS`** |
| **T09** | Từ `success`, bấm Đặt lại mô phỏng $\to$ Gửi hợp lệ lại | Programmatic DOM Click | Reset xóa sạch bộ đếm về 0, `activeEl=assignee-select`; lần gửi mới lại thất bại xác định (`error`, `attempts=1`, `commits=0`). | **`PASS`** |
| **T10** | Chuỗi tương tác bàn phím tuần tự tại Mobile 390×844 | Strict Native Keyboard Navigation (`page.keyboard`) | Thực thi 5 bước phím tuần tự (Tab, ArrowDown, Enter): focus ổn định trên `btn-submit` ở cả 2 lần saving, rect thông báo và nút nằm trong viewport, `horizontalOverflow=false`, kiểm tra no-steal đạt PASS. | **`PASS`** |

---

## 7. Bảng Đo đạc Hình học 3 Viewports (Viewport Geometric Ledger)

Đo đạc thực tế trên Chromium với `Device Scale Factor (DPR) = 2`:

| Kích thước Viewport | `innerWidth` | `clientWidth` | `scrollWidth` | `scrollHeight` | `bodyScrollWidth` | Tràn ngang (`Overflow`) | DPR | Phán quyết |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Desktop (1440×900)** | 1440px | 1425px | 1425px | 920px | 1425px | **`FALSE`** (Không tràn) | 2.0 | **PASS** |
| **Tablet (768×1024)** | 768px | 768px | 768px | 864px | 768px | **`FALSE`** (Không tràn) | 2.0 | **PASS** |
| **Mobile (390×844)** | 390px | 375px | 375px | 812px | 375px | **`FALSE`** (Không tràn) | 2.0 | **PASS** |

---

## 8. Danh mục Ảnh Chụp Màn hình Minh chứng (Screenshots Ledger)

Toàn bộ 7 ảnh chụp thực nghiệm đạt tỷ lệ điểm ảnh chuẩn DPR = 2:
1. [`./screenshots/desktop_initial_1440x900.png`](./screenshots/desktop_initial_1440x900.png): Trạng thái khởi tạo Desktop.
2. [`./screenshots/mobile_initial_390x844.png`](./screenshots/mobile_initial_390x844.png): Trạng thái khởi tạo Mobile 390×844.
3. [`./screenshots/mobile_validation_390x844.png`](./screenshots/mobile_validation_390x844.png): Lỗi thiếu người xử lý (T02).
4. [`./screenshots/mobile_saving_390x844.png`](./screenshots/mobile_saving_390x844.png): Trạng thái saving lần gửi đầu tiên.
5. [`./screenshots/mobile_error_390x844.png`](./screenshots/mobile_error_390x844.png): Trạng thái error sau lần gửi đầu thất bại.
6. [`./screenshots/mobile_retry_saving_390x844.png`](./screenshots/mobile_retry_saving_390x844.png): **Minh chứng F01** — Nút `#btn-submit` giữ focus ổn định trong trạng thái saving của lần thử lại.
7. [`./screenshots/mobile_success_390x844.png`](./screenshots/mobile_success_390x844.png): Trạng thái success lưu thành công với P02 — Bình.

---

## 9. Tự Phản biện & Giới hạn Phạm vi (Adversarial Self-Reflection & Boundaries)

1. **Về tính ổn định của focus khi phần tử thay đổi nhãn**: Việc đổi text và class của cùng một nút trong DOM là giải pháp tối ưu nhất về mặt trải nghiệm bàn phím, nhưng cần đảm bảo `aria-live` hoặc `aria-label` cung cấp thông tin kịp thời để người dùng screen reader nhận biết sự thay đổi ngữ cảnh từ "Lưu phân công" sang "Thử lưu lại".
2. **Giới hạn môi trường**: Số liệu đo đạc và kiểm thử bàn phím được ghi nhận tự động qua Puppeteer CDP trên Chromium. Đây là minh chứng tự kiểm của Executor, không thay thế cho kiểm thử vật lý với bàn phím người dùng thật và phần mềm đọc màn hình chuyên dụng.
3. **Đồng nhất quy ước ký tự**: Bộ đếm ký tự đã được đồng nhất hiển thị theo độ dài chuỗi sau `trim()` (`${trimmedLen}/200`), đảm bảo người dùng nhập khoảng trắng thừa ở đầu/cuối không bị cảnh báo sai lệch so với logic xác thực.
