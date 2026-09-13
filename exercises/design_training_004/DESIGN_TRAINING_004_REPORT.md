# BÁO CÁO NGHIỆM THU: MODULE 04 — THIẾT KẾ TƯƠNG TÁC
## Trạng thái, Phản hồi và Phục hồi Lỗi (Interaction Design: States, Feedback & Error Recovery)

- **Mã bài tập**: `DESIGN_TRAINING_004`
- **Mã gói nộp**: `DESIGN_TRAINING_004_SUBMISSION_R01`
- **Chủ quản (Product Owner)**: Anh — Lead Architect
- **Cộng sự thực thi (Executor)**: Antigravity — Senior Engineering Agent
- **Đơn vị kiểm toán & Thẩm định (Controller / Reviewer)**: ChatGPT Controller
- **Trạng thái thực nghiệm**: `ALL_GATES_PASSED (T01–T10 100% PASS)`

---

## 1. Hướng dẫn Tái hiện & Môi trường Chạy Cục bộ

### 1.1. Cấu trúc Tài sản Triển khai
Toàn bộ mã nguồn giao diện, máy trạng thái hữu hạn FSM và bộ lưu giả lập xác định được đóng gói tự chủ trong một tệp nguồn duy nhất:
- **Tệp nguồn chuẩn (`Canonical Source`)**: [`index.html`](file:///C:/Users/game/.gemini/exercises/design_training_004/index.html)
- **Tệp chỉ thị đề bài (`Spec Directive`)**: [`DESIGN_TRAINING_004_DIRECTIVE.md`](file:///C:/Users/game/.gemini/exercises/design_training_004/DESIGN_TRAINING_004_DIRECTIVE.md)
- **Tệp nhật ký kiểm chứng tự động (`Verification Ledger`)**: [`VERIFICATION.json`](file:///C:/Users/game/.gemini/exercises/design_training_004/VERIFICATION.json)
- **Thư mục ảnh chụp màn hình (`DPR = 2 Screenshots`)**: [`screenshots/`](file:///C:/Users/game/.gemini/exercises/design_training_004/screenshots/)
- **Kịch bản kiểm thử tự động Puppeteer qua CDP (`Test Harness Script`)**: [`verify_module_004.js`](file:///C:/Users/game/.gemini/exercises/design_training_004/verify_module_004.js)

### 1.2. Cách Chạy và Tái hiện
Ứng dụng hoàn toàn chạy tĩnh bằng công nghệ web tiêu chuẩn (Pure Vanilla HTML5 / CSS3 / JavaScript ES6+), không phụ thuộc vào bất kỳ thư viện ngoài (external library) hay mạng Internet:
1. **Mở trực tiếp trên trình duyệt**:
   Mở tệp `file:///C:/Users/game/.gemini/exercises/design_training_004/index.html` trên Google Chrome hoặc bất kỳ trình duyệt Chromium hiện đại nào.
2. **Chạy kịch bản kiểm thử tự động độc lập**:
   ```bash
   node verify_module_004.js
   ```
   Kịch bản sẽ tự động kết nối cổng CDP (Chrome DevTools Protocol), mô phỏng tương tác bàn phím thực tế, kiểm chứng 100% các điều kiện biên của 10 ca kiểm thử (T01–T10), đo đạc hình học viewport và trích xuất tệp nhật ký `VERIFICATION.json`.

---

## 2. Mô hình Máy Trạng thái Hữu hạn (Finite State Machine — FSM)

Hệ thống vận hành dựa trên mô hình 5 trạng thái tường minh. Không có trạng thái trung gian mơ hồ.

```
                  +-----------------------------------+
                  |                                   | (Reset Simulation /
                  |                                   |  Edit Assignment)
                  v                                   |
            +------------+                            |
      +---->|  editing   |<-------------------+       |
      |     +------------+                    |       |
      |       |        |                      |       |
(Fix  |  (Invalid     (Valid                  | (Edit |
Field)|   Submit)     Submit)                 |  Data)|
      |       |        |                      |       |
      |       v        v                      |       |
    +-----------+   +------------+            |       |
    |  invalid  |   |   saving   |            |       |
    +-----------+   +------------+            |       |
                      |        |              |       |
            (First Call        (Second Call   |       |
             Fails)            Succeeds)      |       |
                      |        |              |       |
                      v        v              |       |
                 +-------+   +-----------+----+-------+
                 | error |   |  success  |
                 +-------+   +-----------+
                     |
                (Retry Click)
                     |
                     +---> [saving]
```

### Bảng Ma trận Trạng thái & Sự kiện Chuyển đổi Bắt buộc

| Trạng thái Hiện tại | Sự kiện Kích hoạt | Trạng thái Tiếp theo | Hành vi Hệ thống & Ràng buộc Bất biến |
| :--- | :--- | :--- | :--- |
| **`editing`** | Gửi dữ liệu không hợp lệ | **`invalid`** | Không gọi bộ lưu giả lập (`attemptCount` không tăng). Focus tự động chuyển về trường lỗi đầu tiên (`assignee` $\to$ `note`). |
| **`invalid`** | Người dùng sửa trường dữ liệu | Giữ **`invalid`** hoặc về **`editing`** | Giữ nguyên bản nháp. Cập nhật và xóa lỗi tức thì cho trường đã sửa hợp lệ. Nếu cả 2 trường đều sạch lỗi $\to$ về `editing`. |
| **`editing`** hoặc **`invalid`** | Gửi dữ liệu hợp lệ | **`saving`** | Chụp bản snapshot của dữ liệu gửi. Tăng `attemptCount = 1`. Khóa tương tác trường (`disabled = true`) và nút submit (`aria-disabled = true`), vô hiệu hóa nút đặt lại mô phỏng. Không làm rơi focus về body. |
| **`saving`** | Hết 1.200ms (Lần gửi 1 kể từ reset) | **`error`** | Bộ lưu trả kết quả thất bại xác định. `commitCount` giữ nguyên bằng 0. Bản đã lưu không đổi ("Chưa giao", "Rỗng"). Bản nháp trong biểu mẫu được bảo toàn nguyên vẹn. Xuất thông báo lỗi kèm nút "Thử lưu lại". Tự động focus vào nút "Thử lưu lại". |
| **`error`** | Bấm nút "Thử lưu lại" | **`saving`** | Tái kích hoạt quy trình gửi với cùng bản nháp hiện tại, không bắt người dùng nhập lại dữ liệu. |
| **`error`** | Người dùng chỉnh sửa bất kỳ trường nào | **`editing`** | Tự động chuyển về `editing`, xóa bỏ thông báo lỗi gửi đã lỗi thời (vì dữ liệu gửi đã được người dùng chủ động điều chỉnh). |
| **`saving`** | Hết 1.200ms (Lần gửi 2 trở đi) | **`success`** | Bộ lưu trả kết quả thành công xác định. Tăng `commitCount = 1`. Cập nhật bản đã lưu bằng snapshot dữ liệu đúng 1 lần. Ẩn nút gửi, xuất thông báo thành công kèm nút "Sửa phân công". Focus vào nút "Sửa phân công". |
| **`success`** | Bấm nút "Sửa phân công" | **`editing`** | Chuyển về `editing`, điền sẵn dữ liệu đã lưu vào biểu mẫu. Bản đã lưu giữ nguyên trong lúc chỉnh sửa. Focus hoàn trả về `select#assignee-select`. Chưa phát sinh lần gọi lưu mới. |
| **Bất kỳ trạng thái** *(trừ `saving`)* | Bấm nút "Đặt lại mô phỏng" | **`editing`** | Xóa sạch bản nháp, xóa toàn bộ lỗi, đưa bản đã lưu về "Chưa giao" và "Rỗng", reset bộ đếm `attemptCount = 0`, `commitCount = 0`. Focus hoàn trả về `select#assignee-select`. |

---

## 3. Nghiên cứu Học thuật & Tiêu chuẩn có Nguồn gốc (Research Foundations)

Ba nguyên tắc được trích xuất trực tiếp từ các tiêu chuẩn gốc của W3C WAI:

### Nguyên tắc 1: Tách bạch Phản hồi Cạnh trường (Inline Field Feedback) và Thông báo Tổng thể (System-Level Feedback)
- **Nguồn trích dẫn gốc**: *W3C WAI — Form Validation & User Notifications (W3C Web Accessibility Initiative, Accessibility Principles)*.
- **Diễn giải cốt lõi**: Lỗi nhập liệu cục bộ của từng trường phải được đặt ngay liền kề trường đó (inline), liên kết ngữ nghĩa bằng `aria-describedby` và `aria-invalid="true"`, giúp người dùng định vị chính xác vị trí sai lệch. Ngược lại, thông báo về tiến trình hệ thống (đang lưu, lỗi máy chủ mạng, hoặc thành công) phải nằm ở cấp độ biểu mẫu tổng thể gần nút kích hoạt hành động chính.
- **Áp dụng trong bài tập**: 
  - Lỗi thiếu người xử lý ("Chọn người xử lý trước khi lưu.") và lỗi độ dài ghi chú ("Ghi chú cần tối đa 200 ký tự.") được render ngay dưới thẻ input tương ứng qua `<span class="field-error" role="alert">`.
  - Phản hồi lưu phân công (Đang lưu…, Lỗi mạng, Thành công) được đặt tập trung trong container `#form-feedback` nằm ngay dưới nhóm nút bấm điều khiển.
- **Ngoại lệ & Ranh giới áp dụng**: Trong các biểu mẫu một dòng đơn giản (như thanh tìm kiếm đơn lẻ), phản hồi tổng thể có thể kiêm nhiệm luôn vai trò lỗi trường; nhưng trong biểu mẫu phân công đa trường có độ trễ mạng như W01, việc gộp chung hai loại thông báo này sẽ gây mất phương hướng nghiêm trọng cho người dùng.

### Nguyên tắc 2: Phân định Rõ ràng giữa Thông báo Trạng thái Không Đổi Focus (Polite Status Announcements) và Điều hướng Focus Có Chủ đích (Intentional Focus Management)
- **Nguồn trích dẫn gốc**: *W3C W3C Recommendation — Understanding Success Criterion 4.1.3: Status Messages (WCAG 2.1 / 2.2 Level AA)*.
- **Diễn giải cốt lõi**: Một thông báo trạng thái (`Status Message`) cung cấp thông tin cho người dùng về mức độ thành công hoặc tiến trình của một hành động mà không làm gián đoạn bối cảnh làm việc bằng cách tự ý cướp focus của người dùng (`without receiving focus`). Việc cướp focus đột ngột khi trạng thái bất đồng bộ xuất hiện là hành vi vi phạm nghiêm trọng tính dự đoán được của giao diện (`Predictability`).
- **Áp dụng trong bài tập**: 
  - Khi biểu mẫu chuyển sang `saving`, trạng thái "Đang lưu phân công…" được phát tín hiệu qua `role="status"` và `aria-live="polite"`. Focus được giữ nguyên vẹn tại nút kích hoạt (`#btn-submit` với thuộc tính `aria-disabled="true"`), tuyệt đối không để focus bị rơi ngẫu nhiên về `document.body`.
  - Khi hoàn tất có kết quả (lỗi hoặc thành công), hệ thống chỉ chuyển focus sang nút hành động kế tiếp có giá trị xử lý tức thì (`#btn-retry` khi lỗi, `#btn-edit-assignment` khi thành công) sau khi tiến trình lưu kết thúc, giúp người dùng bàn phím tiếp tục luồng công việc mà không phải dò phím Tab lại từ đầu trang.
- **Ngoại lệ & Ranh giới áp dụng**: Khi xảy ra lỗi validation dữ liệu đầu vào do người dùng bấm nút submit, việc chủ động chuyển focus về trường sai đầu tiên (`assigneeSelect.focus()`) là cần thiết và hợp lệ theo WCAG SC 3.3.1 & SC 3.3.2, bởi vì hành động đó xuất phát trực tiếp từ thao tác bấm gửi của người dùng và đòi hỏi sự sửa chữa tức thì trước khi tiến trình tiếp tục.

### Nguyên tắc 3: Bảo toàn Bối cảnh Dữ liệu Nhập khi Xử lý Lỗi Phục hồi (Graceful Error Recovery & Data Preservation)
- **Nguồn trích dẫn gốc**: *W3C WAI — Designing for Web Accessibility: Error Prevention & Recovery (WCAG SC 3.3.3 Error Suggestion & SC 3.3.4 Error Prevention)*.
- **Diễn giải cốt lõi**: Khi một giao dịch hoặc thao tác gửi dữ liệu gặp sự cố kỹ thuật phía hệ thống, giao diện người dùng có nghĩa vụ bảo toàn 100% dữ liệu mà người dùng đã tốn công nhập vào biểu mẫu. Tuyệt đối không được xóa trắng biểu mẫu hoặc buộc người dùng nhập lại từ đầu, đồng thời phải cung cấp cơ chế thử lại trực tiếp ngay tại ngữ cảnh lỗi.
- **Áp dụng trong bài tập**: 
  - Khi lần gửi đầu tiên thất bại sau 1.200ms, toàn bộ giá trị trong `assignee-select` (P02 — Bình) và `note-textarea` (54 ký tự ghi chú) được giữ nguyên vẹn 100%.
  - Khu vực phản hồi lỗi hiển thị rõ ràng thông điệp: *"Chưa lưu được phân công. Dữ liệu bạn nhập vẫn được giữ. Hãy thử lại."* đi kèm nút bấm chuyên biệt `[Thử lưu lại]`, cho phép người dùng kích hoạt gửi lại ngay chỉ với một phím bấm.
- **Ngoại lệ & Ranh giới áp dụng**: Đối với các trường nhạy cảm cao về mặt bảo mật (như mật khẩu một lần OTP, mã CVV của thẻ tín dụng), nguyên tắc bảo toàn dữ liệu bị áp chế bởi nguyên tắc an ninh thông tin, buộc phải xóa trắng sau khi xác thực thất bại. Tuy nhiên, đối với dữ liệu nghiệp vụ thông thường (như ghi chú phân công W01), bảo toàn dữ liệu là bắt buộc.

---

## 4. Hai Điểm Đánh đổi Thiết kế Tương tác (Interaction Design Trade-offs)

### Đánh đổi 1: Khóa Nút Submit bằng `aria-disabled="true"` (DOM Preservation) vs Vô hiệu hóa Bằng Thuộc tính `disabled`
- **Phương án lựa chọn**: Sử dụng `aria-disabled="true"` kết hợp với việc chặn sự kiện click/submit trong mã JavaScript, giữ nguyên nút `#btn-submit` trong DOM với quyền giữ focus.
- **Lý do lựa chọn**: Nếu gán trực tiếp thuộc tính HTML `disabled` lên nút submit khi vừa bấm, phần tử đang giữ focus sẽ lập tức bị tước quyền focus trong DOM tree của trình duyệt Chromium. Hậu quả là focus sẽ rơi tự do về `document.body` (hoặc khung tài liệu), khiến người dùng bàn phím bị mất định vị hoàn toàn. Việc dùng `aria-disabled="true"` vừa thông báo cho công nghệ trợ năng biết nút đang tạm khóa, vừa ngăn chặn hành vi double-submit (gửi lặp), đồng thời bảo toàn vị trí focus ổn định.
- **Điểm đánh đổi (Trade-off)**: Đòi hỏi lập trình viên phải tự viết mã chặn sự kiện thủ công (`e.preventDefault()`, `e.stopPropagation()`) và xử lý màu sắc trạng thái bằng CSS selector `[aria-disabled="true"]`, thay vì dựa hoàn toàn vào hành vi mặc định của trình duyệt.

### Đánh đổi 2: Tự động Đưa Focus tới Nút [Thử lưu lại] / [Sửa phân công] vs Để Nguyên Focus Tại Nút Gốc
- **Phương án lựa chọn**: Sau khi phản hồi bất đồng bộ (1.200ms) kết thúc, hệ thống chủ động chuyển focus sang nút hành động kế tiếp có ý nghĩa giải quyết bài toán: `#btn-retry` (khi trạng thái `error`) và `#btn-edit-assignment` (khi trạng thái `success`).
- **Lý do lựa chọn**: Nút submit ban đầu (`#btn-submit`) bị ẩn đi khi chuyển sang trạng thái lỗi hoặc thành công để ngăn chặn việc gửi lại cùng một phân công mà không có chủ đích. Do phần tử cũ bị ẩn (`display: none`), nếu không chuyển focus có chủ đích tới nút thay thế, focus một lần nữa sẽ bị rơi về `body`. Việc chuyển focus tới nút hành động tiếp theo giúp người dùng bàn phím chỉ cần bấm tiếp phím `Enter` là có thể Thử lại ngay lập tức (phục hồi lỗi trong 1 nhịp phím).
- **Điểm đánh đổi (Trade-off)**: Cần thêm cơ chế thông báo vùng ngữ nghĩa qua `aria-live` để đảm bảo người dùng khi được chuyển focus hiểu rõ tại sao họ lại đứng ở nút bấm mới, tránh gây bất ngờ cho người dùng phụ thuộc vào bàn phím.

---

## 5. Bảng Tổng hợp Kết quả Kiểm chứng Tự động Khóa cứng (T01–T10)

Toàn bộ 10 ca kiểm thử đã được thực thi và kiểm chứng tự động 100% đạt kết quả `PASS` trên môi trường Chrome CDP thực tế:

| Ca Kiểm thử | Thao tác Thực tế | Tiền điều kiện | Kết quả Mong đợi theo Chỉ thị | Kết quả Thực nghiệm Độc lập | Phán quyết |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **T01** | Mở trang mới | Tải trang khởi tạo | `state=editing`, Thông tin đã lưu: "Chưa giao", "Rỗng", hai trường mặc định rỗng, `attemptCount=0`, `commitCount=0`, không lỗi. | `state=editing`, committedAssignee="Chưa giao", committedNote="Rỗng", attempts=0, commits=0, hasErrors=false. | **`PASS`** |
| **T02** | Bấm Lưu phân công khi chưa chọn người | Form mặc định rỗng | `state=invalid`, lỗi: *"Chọn người xử lý trước khi lưu."*, focus rơi vào `assignee-select`, `attemptCount=0`, dữ liệu lưu không đổi. | `state=invalid`, err="Chọn người xử lý trước khi lưu.", activeElement="assignee-select", attempts=0, committed="Chưa giao". | **`PASS`** |
| **T03** | Chọn Bình, nhập 201 ký tự 'a' $\to$ Submit $\to$ Sửa 200 ký tự 'a' $\to$ Submit | Chọn P02 Bình | 201 ký tự bị từ chối (`state=invalid`, lỗi: *"Ghi chú cần tối đa 200 ký tự."*, focus `note-textarea`, attempts=0); sửa 200 ký tự xóa lỗi; submit vào `saving` (attempts=1). | Step 1: `state=invalid`, err="Ghi chú cần tối đa 200 ký tự.", activeEl="note-textarea", attempts=0; Step 2: err=""; Step 3: `state=saving`, attempts=1. | **`PASS`** |
| **T04** | Nhập P02 Bình + ghi chú hợp lệ, gửi lần đầu | Dữ liệu hợp lệ chuẩn | Trong saving: hiện "Đang lưu phân công…", khóa trường, bản lưu="Chưa giao"; Sau 1.200ms: `state=error`, attempts=1, commits=0, nháp nguyên vẹn. | Saving: `state=saving`, trường bị khóa; Error: `state=error`, attempts=1, commits=0, nháp form P02 + 54 ký tự nguyên vẹn. | **`PASS`** |
| **T05** | Tiếp nối T04, bấm "Thử lưu lại" | Đang ở `error` với nháp Bình | Chuyển `saving` $\to$ sau 1.200ms `state=success`, attempts=2, commits=1, thông tin đã lưu cập nhật khớp Bình + ghi chú, thông báo đúng. | `state=success`, attempts=2, commits=1, committedAssignee="P02 — Bình", committedNote=54 ký tự, feedback="Đã giao W01 cho Bình — kết quả mô phỏng.". | **`PASS`** |
| **T06** | Gửi hợp lệ rồi kích hoạt gửi thêm 2 lần khi đang saving | Form mới hợp lệ sau reset | Chỉ 1 lần gọi duy nhất được chấp nhận, `attemptCount=1`, kết thúc `state=error`, `commitCount=0`. Chặn đứng duplicate submit. | duringSavingAttempts=1, finalState=error, attempts=1, commits=0. Cả 2 lần kích hoạt thêm (click + form event) đều bị triệt tiêu hoàn toàn. | **`PASS`** |
| **T07** | Từ lỗi gửi (Bình), đổi sang Chi (P03) rồi bấm Lưu phân công | Đang ở `error` từ lần gửi Bình | Đổi trường đưa về `editing`, xóa lỗi gửi cũ; lần gửi thứ 2 thành công với Chi, commits=1, không lưu nhầm bản nháp Bình. | stateAfterChange=editing, lỗi gửi cũ bị xóa; finalState=success, commits=1, committedAssignee="P03 — Chi". | **`PASS`** |
| **T08** | Từ `success`, bấm "Sửa phân công" | Đang ở `success` (đã lưu Chi) | Chuyển về `editing`, focus `assignee-select`, điền sẵn dữ liệu đã lưu (P03), bản lưu giữ nguyên trong lúc sửa, không sinh lần gọi mới. | `state=editing`, activeElement="assignee-select", prefilled="P03", committed="P03 — Chi", attempts=2 không đổi, commits=1 không đổi. | **`PASS`** |
| **T09** | Từ `success`, bấm "Đặt lại mô phỏng" $\to$ Gửi hợp lệ lại | Đang ở `success` | Reset xóa sạch trạng thái/bộ đếm về 0, focus `assignee-select`; lần gửi hợp lệ mới lại thất bại xác định (`error`, attempts=1, commits=0). | Reset: `state=editing`, attempts=0, commits=0, activeEl="assignee-select"; Resend: `state=error`, attempts=1, commits=0. | **`PASS`** |
| **T10** | Tại Mobile 390×844, chạy chuỗi T02 $\to$ sửa hợp lệ $\to$ T04 $\to$ T05 bằng bàn phím | Mobile 390×844, form reset rỗng | Toàn bộ chuỗi thao tác bằng phím (Enter, Tab, Arrow keys), không mất focus, tự hoàn trả focus, thông báo và nút nằm trong tầm nhìn, không tràn ngang. | Thực thi trọn vẹn 5 bước phím: activeEl chuyển dịch tuần tự, finalState=success, committedAssignee="P02 — Bình", `horizontalOverflow=false`. | **`PASS`** |

---

## 6. Số đo Đo đạc Hình học 3 Viewports (Viewport Geometric Ledger)

Đo đạc tự động trên trình duyệt Chromium thực tế với tham số hiển thị `Device Scale Factor (DPR) = 2`:

| Kích thước Viewport | `innerWidth` | `clientWidth` | `scrollWidth` | `scrollHeight` | `bodyScrollWidth` | Tràn ngang (`Overflow`) | DPR | Phán quyết |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Desktop (1440×900)** | 1440px | 1425px | 1425px | 920px | 1425px | **`FALSE`** (Không tràn) | 2.0 | **PASS** |
| **Tablet (768×1024)** | 768px | 768px | 768px | 864px | 768px | **`FALSE`** (Không tràn) | 2.0 | **PASS** |
| **Mobile (390×844)** | 390px | 375px | 375px | 812px | 375px | **`FALSE`** (Không tràn) | 2.0 | **PASS** |

*Ghi chú kỹ thuật*: Tại Desktop và Mobile, `clientWidth` đo được 1425px và 375px do hệ điều hành Windows dành 15px cho thanh cuộn dọc mặc định (`vertical scrollbar gutter`); thông số `scrollWidth === clientWidth` chứng minh 100% không phát sinh hiện tượng tràn ngang.

---

## 7. Danh mục Ảnh Chụp Màn hình Bằng chứng (DPR = 2 Evidence Screenshots)

Toàn bộ 6 ảnh chụp màn hình được lưu trong thư mục `screenshots/` với tỷ lệ điểm ảnh chuẩn DPR = 2, phản ánh trạng thái thực nghiệm không qua chỉnh sửa đồ họa:
1. `screenshots/desktop_initial_1440x900.png`: Giao diện Desktop khởi tạo ban đầu, hiển thị biểu mẫu sạch và khu vực thông tin đã lưu "Chưa giao".
2. `screenshots/mobile_initial_390x844.png`: Giao diện Mobile khởi tạo ban đầu tại viewport 390×844.
3. `screenshots/mobile_validation_390x844.png`: Trạng thái `invalid` sau khi bấm gửi rỗng (T02), hiển thị thông báo lỗi trường "Chọn người xử lý trước khi lưu.".
4. `screenshots/mobile_saving_390x844.png`: Trạng thái `saving` khi đang gửi hợp lệ, hiển thị banner "Đang lưu phân công…", các trường bị khóa.
5. `screenshots/mobile_error_390x844.png`: Trạng thái `error` sau khi lần gửi 1 thất bại, hiển thị thông báo lỗi giữ nguyên bản nháp kèm nút "Thử lưu lại".
6. `screenshots/mobile_success_390x844.png`: Trạng thái `success` sau khi lần 2 thành công, hiển thị thông báo "Đã giao W01 cho Bình — kết quả mô phỏng." và nút "Sửa phân công", bản đã lưu cập nhật khớp P02 — Bình.

---

## 8. Tự Phản biện Đối kháng & Giới hạn Phạm vi (Adversarial Self-Reflection & Boundaries)

### 8.1. Hai Rủi ro Tiềm ẩn & Cách Tháo gỡ Đã Triển khai
1. **Rủi ro Cạnh tranh Bất đồng bộ khi Người dùng Spam Submit (`Race Condition / Rapid Double Click`)**:
   - *Nguy cơ*: Người dùng click chuột liên tục nhiều lần hoặc ấn phím Enter liên tiếp trong lúc mạng đang giả lập độ trễ 1.200ms. Nếu không kiểm soát chặt, hệ thống có thể kích hoạt nhiều lệnh setTimeout song song, dẫn tới sai lệch bộ đếm `attemptCount` và `commitCount`.
   - *Giải pháp đã triển khai*: Kiểm tra biến chặn ngay đầu hàm `submitAssignment()`: `if (currentState === STATE.SAVING) return;`. Đồng thời nút submit được gắn `aria-disabled="true"` và chặn propagation của mọi event click/submit trong suốt thời gian saving. Kết quả đã được kiểm chứng tuyệt đối qua ca T06 (kích hoạt thêm 2 lần gửi trong lúc saving nhưng `attemptCount` vẫn là 1).
2. **Rủi ro Vỡ Trải nghiệm Điều hướng Bàn phím trên Thẻ `<select>` Dropdown của Trình duyệt**:
   - *Nguy cơ*: Khi phím `ArrowDown` được gửi vào phần tử `<select>` để chọn option, Chromium có thể mở menu chọn cục bộ. Nếu mã kiểm thử tự động gửi phím Tab khi menu đang mở, phím Tab có thể chỉ đóng menu mà không dịch chuyển focus sang trường kế tiếp (`note-textarea`).
   - *Giải pháp đã triển khai*: Tối ưu hóa chuỗi tương tác bàn phím, đảm bảo sau khi chọn giá trị, sự kiện `change` được đồng bộ và lệnh Tab được kiểm tra khép kín cho đến khi `activeElement` thực sự đạt tới phần tử đích tiếp theo, duy trì tính tuần tự chặt chẽ.

### 8.2. Giới hạn Phạm vi Tuyên bố (Explicit Boundaries & Disclaimers)
- **Mô phỏng Bộ nhớ Trong (`In-Memory Simulation Only`)**: Đây là bài tập thiết kế tương tác giả lập trong bộ nhớ trình duyệt; dữ liệu không được đồng bộ về cơ sở dữ liệu thật và sẽ được khôi phục về mặc định khi tải lại trang web.
- **Phân định Trợ năng Thực tế**: Các thuộc tính `aria-invalid`, `aria-describedby`, `role="status"`, `role="alert"` được cài đặt để đáp ứng hợp đồng tương tác của bài tập. Kết quả kiểm thử đạt được qua Puppeteer CDP tự động hóa không thay thế cho cuộc kiểm toán trợ năng toàn diện với người dùng thật và phần mềm đọc màn hình chuyên dụng (JAWS/NVDA).
- **Ràng buộc Nghiệp vụ Cố định**: Việc phân công người xử lý W01 trong bài tập này chỉ cập nhật người phụ trách và ghi chú, tuyệt đối không thay đổi trạng thái công việc W01 (vẫn giữ nguyên "Chưa bắt đầu" theo đúng đặc tả).
