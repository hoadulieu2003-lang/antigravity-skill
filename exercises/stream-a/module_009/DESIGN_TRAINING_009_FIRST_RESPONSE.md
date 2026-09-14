# DESIGN TRAINING 009 — FIRST RESPONSE
## STREAM A: FOUNDATION INTEGRITY · MODULE 09: ACCESSIBILITY TASK COMPLETION

- **DIRECTIVE_ID**: `DESIGN_TRAINING_009`
- **MODULE_ID**: `DESIGN_TRAINING_009_ACCESSIBILITY`
- **STREAM_ID**: `FOUNDATION_INTEGRITY`
- **OWNER**: Anh — Lead Architect / Product Owner
- **CONTROLLER**: ChatGPT Architectural Controller (Sol)
- **EXECUTOR**: Antigravity (Senior AI Pair-Programmer)
- **STATUS**: `SUBMITTED_FOR_CONTROLLER_FIRST_RESPONSE_REVIEW`
- **PREREQUISITE**: `MODULE_008: CLOSED_WITH_DEBT` (`DESIGN_TRAINING_008_OWNER_WAIVER_CLOSURE_006.md`)
- **ANTI_DIRECTIVE**: `action: START_RESEARCH_AND_FIRST_RESPONSE_ONLY`
- **IMPLEMENTATION_STATUS**: `BLOCKED_PENDING_CONTROLLER_FIRST_RESPONSE_REVIEW`

---

## TỔNG QUAN ĐÁP ỨNG CHỈ THỊ (EXECUTIVE ALIGNMENT)

Em (Antigravity) kính gửi Anh (Lead Architect) và Sol (Architectural Controller) bản **First Response (Phản hồi Đầu tiên)** toàn diện cho **Module 09 (`DESIGN_TRAINING_009_ACCESSIBILITY`)** theo đúng quy định tại Section 13 của `DESIGN_TRAINING_009_DIRECTIVE.md`.

Tuân thủ nghiêm ngặt lệnh `ANTI_DIRECTIVE: action: START_RESEARCH_AND_FIRST_RESPONSE_ONLY`, toàn bộ mã nguồn (`baseline/`, `directions/`, `index.html`, `verify_module_009.js`) đang ở trạng thái **KHÓA CHẶT (BLOCKED)**, chưa thực hiện bất kỳ dòng code triển khai nào cho đến khi Controller phê duyệt bản kế hoạch này.

Bản First Response này cấu trúc đúng 5 phần bắt buộc:
1. `RESEARCH_PLAN`: Ba nguồn chuẩn mực chính thức từ W3C (không dùng blog cá nhân), phạm vi áp dụng, giới hạn và phương thức kiểm chứng.
2. `BASELINE_AUDIT_PLAN`: Danh mục 8 lỗi khả năng tiếp cận có chủ đích (`DEF-01` đến `DEF-08`) kèm banner cảnh báo bắt buộc.
3. `TWO_ACCESSIBILITY_DIRECTIONS`: So sánh chi tiết Direction A (Inline Accessible Form) và Direction B (Guided Review Flow) trên 4 chiều kích, công bố lựa chọn candidate và 2 đánh đổi kiến trúc (`Trade-offs`).
4. `CANONICAL_TASK_AND_FSM_MODEL`: Mô hình tác vụ chuẩn hóa cho hồ sơ AR-901, bảng ánh xạ accessible name của toàn bộ control, chu kỳ sống focus của modal dialog, đồ thị liên kết lỗi (`Error Association Graph`), chiến lược live-region và FSM chống cướp focus (`No-Steal FSM`).
5. `TEST_MATRIX_DRAFT_T01_T12`: Ma trận 12 kịch bản kiểm thử khóa, phương thức stress test (reflow 320px, text resize 200%, forced-colors), và phân định ranh giới rành mạch giữa dữ liệu đo đạc tự động (`Telemetry`) và đánh giá thủ công (`Manual Review`).

---

## 1. RESEARCH PLAN (KẾ HOẠCH NGHIÊN CỨU CHUẨN MỰC)

Hệ thống cam kết chỉ trích dẫn và đối chiếu từ các tài liệu chuẩn mực chính thức của W3C (W3C Recommendations & WAI-ARIA Authoring Practices Guide). Tuyệt đối không sử dụng bài viết blog làm căn cứ pháp lý (`Normative Authority`).

```
                              ┌────────────────────────────────────────────────────────┐
                              │               W3C NORMATIVE FOUNDATION                 │
                              └──────────────────────────┬─────────────────────────────┘
                                                         │
         ┌───────────────────────────────────────────────┼───────────────────────────────────────────────┐
         ▼                                               ▼                                               ▼
┌──────────────────────────────┐        ┌──────────────────────────────┐        ┌──────────────────────────────┐
│   WAI-ARIA APG DIALOG 1.2    │        │       WCAG 2.2 SC 3.3.1      │        │       WCAG 2.2 SC 4.1.3      │
│     (Modal Dialog Pattern)   │        │     (Error Identification)   │        │       (Status Messages)      │
├──────────────────────────────┤        ├──────────────────────────────┤        ├──────────────────────────────┤
│ • role="dialog"              │        │ • Textual identification     │        │ • Native live regions        │
│ • aria-modal="true"          │        │ • aria-invalid="true"        │        │ • role="status" (polite)     │
│ • Keyboard trap (Tab/Shift)  │        │ • aria-describedby linkage   │        │ • role="alert" (assertive)   │
│ • Escape dismiss             │        │ • Programmatic focus to      │        │ • Initial DOM presence       │
│ • Restore focus to trigger   │        │   first invalid control      │        │ • No-focus-steal invariant   │
└──────────────────────────────┘        └──────────────────────────────┘        └──────────────────────────────┘
```

### 1.1. Nguồn chuẩn mực 1: W3C WAI-ARIA APG — Dialog (Modal) Pattern
* **Tiêu chuẩn trích dẫn**: *W3C WAI-ARIA Authoring Practices Guide (APG) — Dialog (Modal) Pattern (W3C Working Group Note)*.
* **Điều nguồn thực sự quy định (`Normative Requirement`)**:
  1. Hộp thoại modal phải có `role="dialog"` (hoặc `role="alertdialog"` khi khẩn cấp) và thuộc tính `aria-modal="true"`.
  2. Phải có Accessible Name thông qua `aria-labelledby` trỏ tới tiêu đề hộp thoại và Accessible Description qua `aria-describedby` (nếu có đoạn dẫn).
  3. Khi mở, focus bàn phím phải lập tức di chuyển vào một phần tử tương tác bên trong hộp thoại (ưu tiên nút đóng hoặc phần tử đầu tiên hợp lý).
  4. Phải giam giữ focus (`Focus Trap`): người dùng nhấn `Tab` hoặc `Shift + Tab` không bao giờ được lọt ra các phần tử nền bên ngoài modal. Các phần tử ngoài modal phải được cô lập (`inert` hoặc `aria-hidden="true"`).
  5. Phím `Escape` phải đóng hộp thoại ngay lập tức.
  6. Khi đóng, focus **bắt buộc phải được phục hồi chuẩn xác về chính trigger element** (phần tử kích hoạt) đã mở hộp thoại đó.
* **Cách áp dụng vào Module 09**:
  - Hộp thoại hướng dẫn: `<dialog id="support-guidance-dialog" role="dialog" aria-modal="true" aria-labelledby="guidance-dialog-title">`.
  - Nút kích hoạt mở: `<button id="btn-open-guidance" type="button" aria-haspopup="dialog" aria-expanded="false">Xem hướng dẫn hỗ trợ</button>`.
  - Nút đóng: `<button id="btn-close-guidance" type="button">Đóng hướng dẫn</button>`.
  - Vòng đời: Khi nhấn `#btn-open-guidance`, dialog mở, `aria-expanded` thành `"true"`, focus chuyển vào `#btn-close-guidance`. Nhấn `Escape` hoặc nút đóng: dialog đóng, `aria-expanded` thành `"false"`, focus lập tức trả về `#btn-open-guidance`.
* **Giới hạn & Ngoại lệ (`Limitations & Exceptions`)**:
  - Sử dụng phần tử native `<dialog>` kết hợp API `.showModal()` trên trình duyệt hiện đại tự động hỗ trợ top-layer và focus trapping ở tầng browser engine. Tuy nhiên, trong môi trường kiểm thử tự động không đầu (`Headless Chromium`), vẫn cần bổ sung event listener bàn phím tường minh (`keydown` bắt `Tab` và `Escape`) để đảm bảo tính tất định (`Determinism`) xuyên suốt các version trình duyệt.
* **Bằng chứng thực thi**: Kiểm chứng độc lập tại **Test T03**.

---

### 1.2. Nguồn chuẩn mực 2: WCAG 2.2 SC 3.3.1 (Error Identification) & SC 3.3.3 (Error Suggestion)
* **Tiêu chuẩn trích dẫn**: *WCAG 2.2 Understanding SC 3.3.1: Error Identification (Level A) & SC 3.3.3: Error Suggestion (Level AA)*.
* **Điều nguồn thực sự quy định (`Normative Requirement`)**:
  1. Khi phát hiện lỗi nhập liệu, phần tử bị lỗi phải được xác định rõ ràng và lỗi phải được mô tả cho người dùng bằng văn bản (`Textual Description`). Không được chỉ dựa vào viền đỏ hay biểu tượng.
  2. Nếu có thể gợi ý cách sửa, gợi ý phải được cung cấp rõ ràng cho người dùng.
  3. Mối quan hệ giữa trường nhập liệu và thông báo lỗi phải được xác định theo cách có thể đọc được bằng máy (`Programmatically Determinable`) qua `aria-describedby` hoặc `<label>`.
  4. Trạng thái lỗi phải được phản ánh bằng `aria-invalid="true"`.
* **Cách áp dụng vào Module 09**:
  - Mỗi trường lỗi được gắn `aria-invalid="true"` khi submit không hợp lệ.
  - Mỗi thông báo lỗi hiển thị cạnh field có ID duy nhất (`#error-support-type`, `#error-details-limit`, `#error-confirmation`) và được liên kết trực tiếp vào control qua thuộc tính `aria-describedby`.
  - Khối tổng hợp lỗi (`#error-summary`) nằm ở đầu form với `role="alert"`, `tabindex="-1"`, chứa danh sách các anchor link nội bộ trỏ thẳng tới từng control bị lỗi.
  - Khi submit lỗi, focus được tự động điều hướng tới trường lỗi đầu tiên theo đúng thứ tự DOM (`First invalid receives focus`).
* **Giới hạn & Ngoại lệ (`Limitations & Exceptions`)**:
  - Công cụ kiểm tra tự động chỉ quét được sự tồn tại của thuộc tính `aria-describedby` và `aria-invalid`. Ý nghĩa thực tế và độ dễ hiểu của câu thông báo lỗi đối với con người bắt buộc phải có đánh giá thủ công (`Manual Accessibility Review`).
* **Bằng chứng thực thi**: Kiểm chứng độc lập tại **Test T04, T05**.

---

### 1.3. Nguồn chuẩn mực 3: WCAG 2.2 SC 4.1.3 (Status Messages) & Live Regions
* **Tiêu chuẩn trích dẫn**: *WCAG 2.2 Understanding SC 4.1.3: Status Messages (Level AA) & W3C WAI-ARIA 1.2 Live Regions*.
* **Điều nguồn thực sự quy định (`Normative Requirement`)**:
  1. Các thông điệp trạng thái xuất hiện bất đồng bộ phải được xác định bằng phương thức lập trình sao cho công nghệ hỗ trợ (`Assistive Technology`) có thể thông báo cho người dùng mà **không cần phải di chuyển con trỏ focus**.
  2. Trạng thái thành công (`Success`) hoặc đang xử lý (`Progress / Saving`) sử dụng `role="status"` (tương đương `aria-live="polite"`).
  3. Trạng thái lỗi nghiêm trọng hoặc gián đoạn (`Failure / Alert`) sử dụng `role="alert"` (tương đương `aria-live="assertive"`).
  4. Khung chứa Live Region phải hiện diện sẵn trong DOM khởi tạo ban đầu (`Initial DOM`) trước khi nội dung văn bản được bơm vào để đảm bảo cây trợ năng đăng ký quan sát thành công.
* **Cách áp dụng vào Module 09**:
  - Tạo sẵn hai vùng live region chuyên biệt trong DOM ban đầu:
    - `<div id="live-status-region" role="status" aria-live="polite" aria-atomic="true" class="sr-only"></div>`
    - `<div id="live-alert-region" role="alert" aria-live="assertive" aria-atomic="true" class="sr-only"></div>`
  - Trạng thái Saving (800ms): Bơm chuỗi `"Đang lưu yêu cầu hỗ trợ…"` vào `#live-status-region`. Nút submit giữ nguyên node trong DOM (`#btn-save-support`), chuyển text sang `"Đang lưu yêu cầu hỗ trợ…"`, đặt `aria-busy="true"` và `aria-disabled="true"`. **Tuyệt đối không dùng native `disabled`** để tránh trình duyệt đẩy focus về `document.body`.
  - Trạng thái Lỗi mạng (Attempt 1): Bơm chuỗi `"Chưa lưu được yêu cầu hỗ trợ. Nội dung đã nhập vẫn được giữ."` vào `#live-alert-region`.
  - Trạng thái Thành công (Attempt 2): Bơm chuỗi `"Đã lưu yêu cầu hỗ trợ cho hồ sơ AR-901."` vào `#live-status-region`.
  - **Quy chuẩn No-Steal Focus Invariant**: Nếu trong 800ms đang lưu, người dùng dùng phím Tab di chuyển focus sang phần tử khác (ví dụ: quay lại kiểm tra `#field-details`), khi sự kiện save hoàn tất (dù lỗi hay thành công), hệ thống **tuyệt đối không được cướp focus** kéo ngược về nút submit hay vị trí khác. Focus hiện tại của người dùng được tôn trọng tuyệt đối.
* **Giới hạn & Ngoại lệ (`Limitations & Exceptions`)**:
  - Một số trình đọc màn hình có thể cắt ngang thông báo `polite` nếu có sự kiện bàn phím tiếp diễn ngay lập tức. Đây là hành vi chuẩn mực của spec (polite chờ luồng rảnh rỗi).
* **Bằng chứng thực thi**: Kiểm chứng độc lập tại **Test T06, T07, T08, T09**.

---

### 1.4. Các nguồn bổ trợ đã khóa trong Chỉ thị
1. **WCAG 2.2 SC 1.4.10 (Reflow - Level AA)**: Nội dung hiển thị ở viewport 320 CSS px không làm mất chức năng và không phát sinh cuộn ngang (`0 horizontal scrollbar`).
2. **WCAG 2.2 SC 2.5.8 (Target Size Minimum - Level AA) vs Quy chuẩn Dự án 44×44 CSS px**: Báo cáo phân định rạch ròi: ngưỡng chuẩn của WCAG 2.2 SC 2.5.8 là 24×24 CSS px, trong khi ngưỡng **44×44 CSS px** là quy chuẩn nội bộ nghiêm ngặt hơn của dự án TRIPFLOW.
3. **WCAG 2.2 SC 2.4.7 (Focus Visible - Level AA) & SC 1.4.11 (Non-text Contrast)**: Vòng nét focus (`Focus Ring`) dày tối thiểu 2px solid, độ tương phản >= 3:1 so với nền liền kề, hiển thị bền vững cả trong chế độ màu thông thường lẫn `forced-colors`.

---

## 2. BASELINE AUDIT PLAN (KẾ HOẠCH KIỂM TOÁN BASELINE VỚI 8 DEFECTS)

Theo đúng yêu cầu tại Section 4 của Chỉ thị, thư mục `baseline/index.html` sẽ được thiết kế như một phiên bản chức năng nhưng mang **đúng 8 khuyết tật trợ năng có chủ đích (`DEF-01` đến `DEF-08`)**.

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│ ⚠️ CẢNH BÁO BẮT BUỘC TRÊN BASELINE/INDEX.HTML                                            │
│ "Bản mẫu huấn luyện có lỗi khả năng tiếp cận có chủ đích — không dùng trong sản phẩm thật."│
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

### Bảng kế hoạch 8 khuyết tật có chủ đích trong Baseline
| Mã lỗi | Mô tả hành vi lỗi trong Baseline | Điều khoản WCAG 2.2 / APG bị vi phạm | Giải pháp khắc phục trong Candidate |
| :--- | :--- | :--- | :--- |
| **`DEF-01`** | Nút Lưu dùng thẻ `<div class="btn" onclick="save()">`, không có `role="button"`, không có `tabindex="0"`, không bắt phím Enter/Space. | SC 4.1.2 Name, Role, Value<br>SC 2.1.1 Keyboard | Sử dụng native `<button type="submit" id="btn-save-support">`. |
| **`DEF-02`** | Ô nhập Chi tiết hỗ trợ chỉ dùng `placeholder="Nhập chi tiết..."`, hoàn toàn không có thẻ `<label>` hay `aria-label`. Khi người dùng gõ chữ, nhãn biến mất hoàn toàn. | SC 3.3.2 Labels or Instructions<br>SC 4.1.2 Name, Role, Value | Khai báo `<label for="field-details">Chi tiết hỗ trợ</label>` hiển thị cố định. |
| **`DEF-03`** | Báo lỗi form chỉ bằng cách đổi màu viền sang đỏ (`border-color: #EF4444`), không có câu thông báo lỗi dạng chữ và không có liên kết `aria-describedby`. | SC 1.4.1 Use of Color<br>SC 3.3.1 Error Identification | Hiển thị chuỗi lỗi text và liên kết qua `aria-describedby` + `aria-invalid="true"`. |
| **`DEF-04`** | Thứ tự DOM và thứ tự hiển thị thị giác bị đảo ngược bằng CSS (`flex-direction: column-reverse;`), khiến bàn phím Tab từ nút Submit trước rồi mới lùi lên các ô nhập liệu. | SC 1.3.2 Meaningful Sequence<br>SC 2.4.3 Focus Order | Khôi phục luồng DOM tự nhiên khớp 100% với luồng đọc thị giác từ trên xuống dưới. |
| **`DEF-05`** | Thông báo lưu và lỗi mạng được chèn vào thẻ `<div>` thông thường không có `role="status"`, `role="alert"`, hay `aria-live`. Screen reader hoàn toàn không nhận diện được khi dữ liệu thay đổi. | SC 4.1.3 Status Messages | Thiết lập live regions chuyên biệt hiện diện ngay từ DOM khởi tạo (`#live-status-region`, `#live-alert-region`). |
| **`DEF-06`** | Khi nhấn nút Lưu, mã JavaScript gán trực tiếp thuộc tính `disabled` lên nút hoặc thay thế node bằng `innerHTML = '<span>Đang lưu...</span>'`, khiến trình duyệt đẩy bật focus về `document.body`. | SC 2.4.3 Focus Order<br>APG Button Pattern | Duy trì nguyên vẹn node `#btn-save-support`, dùng `aria-disabled="true"` và cờ `isSaving` trong JS, chặn duplicate clicks mà không làm mất focus. |
| **`DEF-07`** | Các nút chọn radio và ô checkbox có kích thước vùng bấm chỉ đạt 20×20 CSS px không có padding mở rộng, vi phạm ngưỡng mục tiêu tương tác. | SC 2.5.8 Target Size (Minimum)<br>Project Invariant 44×44px | Áp dụng vùng bấm tối thiểu 44×44 CSS px qua CSS flexbox padding và min-width/min-height. |
| **`DEF-08`** | Khung chứa form được đặt cố định `width: 650px;`, không có `max-width: 100%`, gây tràn vỡ giao diện và phát sinh thanh cuộn ngang khi thu hẹp màn hình về 320 CSS px. | SC 1.4.10 Reflow | Loại bỏ fixed width, thiết lập layout linh hoạt `max-width: 100%` với CSS Grid/Flexbox và word-break an toàn. |

---

## 3. TWO ACCESSIBILITY DIRECTIONS (HAI HƯỚNG KIẾN TRÚC TIẾP CẬN)

Theo Section 5 của Chỉ thị, hai hướng kiến trúc được xây dựng độc lập trên cùng một bộ dữ liệu (`Fixture AR-901`), cùng các chuỗi copy khóa và cùng logic lưu giả lập (`mock_save`).

```
┌──────────────────────────────────────────────────┐   ┌──────────────────────────────────────────────────┐
│      DIRECTION A: INLINE ACCESSIBLE FORM         │   │       DIRECTION B: GUIDED REVIEW FLOW            │
│          (Được chọn làm Candidate)               │   │             (Hướng so sánh đối chiếu)            │
├──────────────────────────────────────────────────┤   ├──────────────────────────────────────────────────┤
│ • Mô hình đơn trang (Single-Page Form)           │   │ • Mô hình 2 bước (Two-Step Guided Flow)          │
│ • Hiển thị toàn bộ trường cùng lúc               │   │ • Bước 1: Chọn hỗ trợ / Bước 2: Kiểm tra & lưu   │
│ • Fieldset/Legend cho nhóm lựa chọn              │   │ • Step Indicator thuần text, không phụ thuộc màu │
│ • Error Summary ở đầu form & inline error        │   │ • Back/Next native button, DOM order chuẩn       │
│ • Thẻ tóm tắt kết quả lưu nằm ngay sau form      │   │ • Chuyển bước chuyển focus về Heading bước mới   │
└──────────────────────────────────────────────────┘   └──────────────────────────────────────────────────┘
```

### 3.1. Phân tích chi tiết 4 chiều kích so sánh bắt buộc

| Chiều kích so sánh | Direction A — Inline Accessible Form (`directions/option_a.html`) | Direction B — Guided Review Flow (`directions/option_b.html`) |
| :--- | :--- | :--- |
| **1. Số bước bàn phím (`Keyboard Steps`)** | **Tối ưu vượt trội (~12–14 Tab stops)**.<br>Người dùng đi thẳng từ Skip link $\to$ Nút Hướng dẫn $\to$ Form controls $\to$ Nút Submit. Thao tác liên tục, không bị ngắt quãng bởi các nút chuyển bước trung gian. | **Dài hơn đáng kể (~20–22 Tab stops)**.<br>Người dùng phải Tab qua toàn bộ trường ở Bước 1 $\to$ Nút "Tiếp tục" $\to$ Tab qua danh sách kiểm tra ở Bước 2 $\to$ Nút "Lưu" (hoặc nút "Quay lại"). |
| **2. Phát hiện & Sửa lỗi (`Error Detection & Repair`)** | **Trực quan, tức thì, toàn diện**.<br>Khối Error Summary ở đầu trang liệt kê toàn bộ các trường lỗi kèm anchor link trỏ trực tiếp đến control. Người dùng bấm link hoặc Tab đến thẳng trường lỗi để sửa tại chỗ. | **Phân mảnh theo bước (`Staged Validation`)**.<br>Lỗi bước 1 được chặn ở Bước 1. Tuy nhiên, nếu ở Bước 2 người dùng nhận ra sai sót, họ phải kích hoạt nút "Quay lại", làm phát sinh tải điều hướng và chuyển đổi ngữ cảnh. |
| **3. Tải ghi nhớ khi kiểm tra (`Cognitive Memory Load`)** | **Phù hợp với tác vụ tác nghiệp nhanh**.<br>Người dùng nhìn thấy đồng thời cả lựa chọn và phần ghi chú chi tiết. Tuy nhiên, với hồ sơ nhiều thông tin, người dùng phải tự lướt mắt để kiểm tra lại trước khi nhấn Lưu. | **Giảm tải ghi nhớ tối đa cho việc thẩm định**.<br>Bước 2 dành riêng một màn hình tĩnh tóm tắt toàn bộ dữ liệu đã nhập (chế độ Read-only Review) trước khi cho phép bấm nút Lưu chính thức, giúp ngăn ngừa sai sót nghiệp vụ. |
| **4. Độ ổn định focus (`Focus Stability`)** | **Ổn định tuyệt đối, không có rủi ro chuyển trang**.<br>DOM tĩnh, không có ẩn/hiện view lớn. Focus chỉ di chuyển theo thứ tự bàn phím tự nhiên hoặc tới trường lỗi đầu tiên khi submit. Không có nguy cơ mất focus do chuyển step. | **Đòi hỏi quản lý focus chủ động và phức tạp**.<br>Khi nhấn "Tiếp tục" sang Bước 2, hệ thống phải can thiệp bằng script để chuyển focus về tiêu đề Bước 2 (`#step-2-heading` có `tabindex="-1"`). Nếu script lỗi, focus có nguy cơ rơi về `document.body`. |

### 3.2. Quyết định lựa chọn Candidate & Hai Đánh Đổi Kiến Trúc (`Trade-offs`)
- **Lựa chọn cho Candidate (`index.html`)**: **Direction A (Inline Accessible Form)**.
- **Lý do lựa chọn có căn cứ kỹ thuật (không vì thẩm mỹ cảm tính)**:
  - Bối cảnh sản phẩm là **Bàn tiếp nhận yêu cầu hỗ trợ hành khách (Passenger Support Intake Desk)** của TRIPFLOW. Đây là bàn tiếp nhận nghiệp vụ chuyên nghiệp, nơi điều phối viên phải xử lý hàng chục cuộc gọi/hồ sơ mỗi giờ. Mẫu form ngắn gồm 1 nhóm radio (4 lựa chọn), 1 ô textarea ghi chú và 1 checkbox xác nhận.
  - Việc chia nhỏ một form ngắn 3 trường thành 2 bước kiểu Wizard (Direction B) tạo ra sự cồng kềnh không cần thiết (`Artificial Complexity`), làm tăng gấp đôi số lần nhấn phím Tab và kéo dài thời gian xử lý hồ sơ. Direction A mang lại cấu trúc ngữ nghĩa đơn giản nhất, ít điểm đứt gãy nhất (`Lowest Failure Surface`), và đảm bảo cây trợ năng ổn định nhất.
- **Hai điểm đánh đổi kiến trúc bắt buộc (`Trade-offs`)**:
  1. **Đánh đổi 1: Mật độ hiển thị trên màn hình hẹp (`Visual Density vs Step Isolation`)**:
     - *Chấp nhận*: Trên màn hình nhỏ (320px) hoặc khi phóng to chữ 200%, Direction A dồn toàn bộ form và khối tóm tắt lỗi lên cùng một trang, khiến trang dài hơn và người dùng phải cuộn dọc nhiều hơn.
     - *Bù lại*: Loại bỏ hoàn toàn sự phân mảnh trạng thái (`State Fragmentation`), đảm bảo toàn bộ liên kết lỗi `aria-describedby` và anchor links luôn tồn tại trong cây DOM thực tại mọi thời điểm, không có trường nào bị ẩn trong step khác.
  2. **Đánh đổi 2: Thiếu màn hình kiểm tra chuyên biệt (`Pre-submit Verification vs Low Friction Recovery`)**:
     - *Chấp nhận*: Bỏ qua màn hình "Kiểm tra & lưu" chuyên biệt của Direction B, đòi hỏi người phối viên phải tự rà soát dữ liệu ngay trên form trước khi bấm Lưu.
     - *Bù lại*: Khi xảy ra lỗi mạng giả lập ở Attempt 1, người dùng có thể quan sát ngay nội dung bản nháp (`Draft`) vẫn đang được bảo toàn nguyên vẹn trong ô nhập liệu và nhấn nút "Thử lưu lại" ngay lập tức mà không phải thực hiện thao tác back/next qua lại giữa các bước.

---

## 4. CANONICAL TASK AND FSM MODEL (MÔ HÌNH TÁC VỤ CHUẨN HÓA & MÁY TRẠNG THÁI FSM)

### 4.1. Bảng dữ liệu định danh (`Canonical Fixture`) & Chuỗi Copy Khóa
Dữ liệu chuẩn hóa tuyệt đối không thay đổi theo Section 3 của Chỉ thị:
- `request_id`: `AR-901`
- `booking_code`: `BK-24091`
- `passenger_display_name`: `Khách A`
- `tour_id`: `TF-802`
- `tour_name`: `Tour Fansipan Sapa 2 Ngày 1 Đêm`
- `departure`: `2026-09-15 06:30 ICT`
- `current_status`: `Chưa ghi nhận yêu cầu hỗ trợ`

**Bảng khóa 12 chuỗi giao diện bắt buộc (`Locked Copy Strings`)**:
1. Tiêu đề trang (`page_heading`): `"Ghi nhận yêu cầu hỗ trợ"`
2. Nút lưu ban đầu (`submit_idle`): `"Lưu yêu cầu hỗ trợ"`
3. Nút lưu khi đang xử lý (`submit_saving`): `"Đang lưu yêu cầu hỗ trợ…"`
4. Nút thử lại (`submit_retry`): `"Thử lưu lại"`
5. Nút sửa sau khi đã lưu (`edit_saved`): `"Sửa yêu cầu"`
6. Nút mở hướng dẫn (`open_guidance`): `"Xem hướng dẫn hỗ trợ"`
7. Nút đóng hướng dẫn (`close_guidance`): `"Đóng hướng dẫn"`
8. Lỗi chưa chọn hình thức (`error_support_type`): `"Chọn hình thức hỗ trợ cần sắp xếp."`
9. Lỗi chưa xác nhận (`error_confirmation`): `"Xác nhận rằng yêu cầu đã được trao đổi với khách."`
10. Lỗi vượt quá độ dài (`error_details_limit`): `"Chi tiết hỗ trợ không được vượt quá 200 ký tự."`
11. Thông báo lỗi mạng (`network_error`): `"Chưa lưu được yêu cầu hỗ trợ. Nội dung đã nhập vẫn được giữ."`
12. Thông báo thành công (`success`): `"Đã lưu yêu cầu hỗ trợ cho hồ sơ AR-901."`

---

### 4.2. Bảng ánh xạ Accessible Name của toàn bộ Controls
Mọi phần tử tương tác đều được gán nhãn tiếp cận duy nhất và không bị che khuất khi nhập liệu:

| Phần tử tương tác | Selector trong Contract | Vai trò (Role) | Accessible Name xác định trước | Cơ chế gán nhãn |
| :--- | :--- | :--- | :--- | :--- |
| **Skip Link** | `#skip-link` | `link` | `"Bỏ qua đến nội dung chính"` | Native text content |
| **Nút Mở Hướng Dẫn** | `#btn-open-guidance` | `button` | `"Xem hướng dẫn hỗ trợ"` | Native text content + `aria-haspopup="dialog"` |
| **Nút Đóng Hướng Dẫn** | `#btn-close-guidance` | `button` | `"Đóng hướng dẫn"` | Native text content |
| **Nhóm Radio** | `#support-type-group` | `group / radiogroup` | `"Hình thức hỗ trợ cần sắp xếp"` | Thẻ `<legend>` trong `<fieldset>` |
| **Radio 1** | `#radio-boarding` | `radio` | `"Hỗ trợ lên xuống phương tiện"` | `<label for="radio-boarding">` |
| **Radio 2** | `#radio-written` | `radio` | `"Giao tiếp bằng văn bản"` | `<label for="radio-written">` |
| **Radio 3** | `#radio-large-print` | `radio` | `"Tài liệu chữ lớn"` | `<label for="radio-large-print">` |
| **Radio 4** | `#radio-other` | `radio` | `"Hỗ trợ khác"` | `<label for="radio-other">` |
| **Textarea Chi Tiết** | `#field-details` | `textbox` (multiline) | `"Chi tiết hỗ trợ"` | `<label for="field-details">Chi tiết hỗ trợ</label>` |
| **Checkbox Xác Nhận** | `#checkbox-confirmation` | `checkbox` | `"Xác nhận rằng yêu cầu đã được trao đổi với khách."` | `<label for="checkbox-confirmation">` |
| **Nút Lưu / Thử lại** | `#btn-save-support` | `button` | Phản ánh text hiển thị theo trạng thái: `"Lưu yêu cầu hỗ trợ"` / `"Đang lưu yêu cầu hỗ trợ…"` / `"Thử lưu lại"` | Native text content (Node duy nhất ổn định) |
| **Nút Sửa Đã Lưu** | `#btn-edit-saved` | `button` | `"Sửa yêu cầu"` | Native text content (khi committed) |

---

### 4.3. Thứ tự Focus dự kiến (`Expected Focus Order`)
Thứ tự điều hướng bằng bàn phím (phím `Tab`) hoàn toàn khớp với thứ tự hiển thị ngữ nghĩa của DOM:
1. `#skip-link` (chỉ hiển thị khi nhận focus, kích hoạt nhảy thẳng vào `#main-content`)
2. `#btn-open-guidance` (nằm ở thanh tác vụ trên cùng của hồ sơ AR-901)
3. Nhóm radio hình thức hỗ trợ: Nhấn `Tab` vào radio đã chọn (hoặc radio đầu tiên `#radio-boarding` nếu chưa chọn), dùng các phím **Mũi tên lên/xuống/trái/phải** để di chuyển giữa các options theo chuẩn W3C Radio Pattern.
4. Ô nhập văn bản `#field-details`
5. Ô đánh dấu `#checkbox-confirmation`
6. Nút gửi `#btn-save-support`
*(Khi đã lưu thành công và hiển thị bảng tóm tắt: Nút `#btn-edit-saved` sẽ nằm ngay sau phần thông tin đã lưu).*

---

### 4.4. Chu kỳ sống Focus của Dialog (`Dialog Focus Lifecycle`)
Modal Dialog tuân thủ đầy đủ 5 giai đoạn vòng đời W3C APG:
```
[ Trigger Button ] ────────( Click / Enter )────────► [ Dialog Opens ]
#btn-open-guidance                                    role="dialog", aria-modal="true"
        ▲                                                      │
        │                                                      ▼
 ( Focus Restored )                                    [ Focus Shifted ]
        │                                              Focus moves to #btn-close-guidance
        │                                                      │
        │                                                      ▼
[ Dialog Closes ] ◄───────( Escape / Close Click )──── [ Focus Trapped ]
Removes inert                                          Tab / Shift+Tab cycles strictly inside
```
1. **Khởi tạo**: `#support-guidance-dialog` được ẩn mặc định. Phần tử `#btn-open-guidance` có `aria-expanded="false"`.
2. **Kích hoạt mở**: Khi người dùng kích hoạt `#btn-open-guidance` (Click hoặc Enter/Space), lưu lại tham chiếu trigger element. Dialog hiển thị với `aria-modal="true"`. Phần tử nền `#main-content` và `#site-header` được gán thuộc tính `inert` (hoặc `aria-hidden="true"`).
3. **Chuyển dịch focus ban đầu**: Focus lập tức được chuyển vào `#btn-close-guidance`.
4. **Giam giữ focus (`Focus Trap`)**: Lắng nghe sự kiện `keydown` trên dialog. Nếu nhấn `Tab` ở phần tử tương tác cuối cùng, focus quay vòng lại phần tử đầu tiên; nếu nhấn `Shift + Tab` ở phần tử đầu tiên, focus quay về phần tử cuối cùng. Focus không thể thoát ra cửa sổ nền.
5. **Đóng và Phục hồi focus (`Dismissal & Focus Restoration`)**: Khi người dùng nhấn phím `Escape` hoặc kích hoạt `#btn-close-guidance`, dialog đóng lại, xóa bỏ cờ `inert` trên nội dung nền, `aria-expanded` trở về `"false"`, và **focus được lập tức trả về đúng phần tử trigger ban đầu (`#btn-open-guidance`)**.

---

### 4.5. Đồ thị Liên kết Lỗi (`Error Association Graph`)
```
                                ┌────────────────────────────────────────────────────────┐
                                │             <div id="error-summary">                   │
                                │           role="alert" | tabindex="-1"                 │
                                └──────────────────────────┬─────────────────────────────┘
                                                           │ (Bấm anchor link hoặc Tab)
                                ┌──────────────────────────┼─────────────────────────────┐
                                ▼                          ▼                             ▼
                     ┌─────────────────────┐    ┌─────────────────────┐       ┌─────────────────────┐
                     │    Support Type     │    │   Details Textarea  │       │  Confirmation Box   │
                     │      <fieldset>     │    │   <textarea>        │       │  <input type=check> │
                     └──────────┬──────────┘    └──────────┬──────────┘       └──────────┬──────────┘
                                │                          │                             │
                        aria-invalid="true"        aria-invalid="true"           aria-invalid="true"
                                │                          │                             │
                                ▼                          ▼                             ▼
                     aria-describedby=          aria-describedby=             aria-describedby=
                   "error-support-type"       "error-details-limit"         "error-confirmation"
                                │                          │                             │
                                ▼                          ▼                             ▼
                     ┌─────────────────────┐    ┌─────────────────────┐       ┌─────────────────────┐
                     │    <div id=         │    │    <div id=         │       │    <div id=         │
                     │"error-support-type">│    │"error-details-limit"│       │"error-confirmation" │
                     │  "Chọn hình thức    │    │"Chi tiết hỗ trợ     │       │ "Xác nhận rằng yêu  │
                     │hỗ trợ cần sắp xếp." │    │không được vượt quá  │       │cầu đã được trao đổi │
                     │                     │    │    200 ký tự."      │       │     với khách."     │
                     └─────────────────────┘    └─────────────────────┘       └─────────────────────┘
```

- **Quy tắc điều hướng lỗi đầu tiên (`First Invalid Focus Rule`)**:
  Khi nhấn submit với form không hợp lệ:
  1. Toàn bộ lỗi được đánh giá đồng bộ.
  2. Bơm danh sách lỗi vào `#error-summary`.
  3. Ánh xạ các thuộc tính `aria-invalid="true"` và `aria-describedby` vào các control bị lỗi.
  4. Tự động điều hướng focus bằng phương thức lập trình tới **phần tử lỗi đầu tiên theo thứ tự DOM** (ví dụ: nếu chưa chọn radio, focus tới `#radio-boarding`; nếu radio đã chọn nhưng textarea vượt ký tự, focus tới `#field-details`).

---

### 4.6. Chiến lược Vùng Thông Báo Sống (`Live Region Strategy`)
Thiết lập 2 container live region tĩnh có sẵn trong DOM từ khi load trang:
1. **Live Region Trạng thái Thông thường (`#live-status-region`)**:
   - Khai báo: `<div id="live-status-region" role="status" aria-live="polite" aria-atomic="true" class="sr-only"></div>`
   - Kịch bản kích hoạt:
     - Khi bắt đầu lưu: Bơm nội dung `"Đang lưu yêu cầu hỗ trợ…"`.
     - Khi lưu thành công (Attempt 2): Bơm nội dung `"Đã lưu yêu cầu hỗ trợ cho hồ sơ AR-901."`.
2. **Live Region Cảnh báo & Lỗi Khẩn cấp (`#live-alert-region`)**:
   - Khai báo: `<div id="live-alert-region" role="alert" aria-live="assertive" aria-atomic="true" class="sr-only"></div>`
   - Kịch bản kích hoạt:
     - Khi validation thất bại: Bơm nội dung tóm tắt lỗi tổng quan.
     - Khi gặp lỗi mạng giả lập (Attempt 1): Bơm nội dung `"Chưa lưu được yêu cầu hỗ trợ. Nội dung đã nhập vẫn được giữ."`.

---

### 4.7. Máy trạng thái FSM bất đồng bộ & Quy chuẩn Không cướp Focus (`No-Steal FSM`)

```
                 ┌────────────────────────────────────────────────────────┐
                 │                          IDLE                          │
                 │   submit_label: "Lưu yêu cầu hỗ trợ", attempts: 0      │
                 └──────────────────────────┬─────────────────────────────┘
                                            │ Submit click / Enter
                                            ▼
                                ┌───────────────────────┐
                     [Hợp lệ]   │      VALIDATING       │   [Không hợp lệ]
              ┌─────────────────┤ (Kiểm tra dữ liệu)    ├─────────────────┐
              │                 └───────────────────────┘                 │
              ▼                                                           ▼
┌──────────────────────────┐                                 ┌──────────────────────────┐
│         SAVING           │                                 │     VALIDATION_ERROR     │
│ attempts: 1 (Attempt 1)  │                                 │ attempts: 0 (Không tăng!)│
│ aria-busy: "true"        │                                 │ Focus -> First Invalid   │
│ delay: 800ms             │                                 │ Draft nguyên vẹn         │
└─────────────┬────────────┘                                 └──────────────────────────┘
              │ (Attempt 1 luôn luôn FAILURE)
              ▼
┌──────────────────────────┐
│      NETWORK_ERROR       │
│ attempts: 1, commits: 0  │
│ copy: network_error      │
│ draft: PRESERVED         │
│ button: "Thử lưu lại"    │
└─────────────┬────────────┘
              │ Click retry / Enter
              ▼
┌──────────────────────────┐
│      RETRY_SAVING        │
│ attempts: 2 (Attempt 2)  │
│ aria-busy: "true"        │
│ delay: 800ms             │
└─────────────┬────────────┘
              │ (Attempt 2 luôn luôn SUCCESS)
              ▼
┌──────────────────────────┐
│        COMMITTED         │
│ attempts: 2, commits: 1  │
│ copy: success            │
│ render: Committed Summary│
│ action: "Sửa yêu cầu"    │
└──────────────────────────┘
```

**Bốn bất biến FSM cốt lõi (`Four Core Invariants`)**:
1. **Bất biến Bộ đếm (`Counter Invariant`)**:
   - Validation thất bại: `attempts = 0`, `commits = 0`.
   - Submit hợp lệ lần 1 (Lỗi mạng giả lập sau 800ms): `attempts = 1`, `commits = 0`.
   - Retry submit lần 2 (Thành công sau 800ms): `attempts = 2`, `commits = 1`.
   - Click đúp trong khi đang saving (Duplicate Activation): Không làm tăng `attempts`, request thứ hai bị bỏ qua (`Debounced / Guarded`).
2. **Bất biến Bảo tồn Bản nháp (`Draft Preservation Invariant`)**:
   - Khi xảy ra lỗi mạng ở Attempt 1, toàn bộ giá trị đã chọn trong radio, nội dung đã gõ trong textarea và trạng thái checkbox xác nhận phải được **giữ nguyên 100% trong DOM controls**, không bị reset hoặc xóa rỗng.
3. **Bất biến Ổn định Node Nút Thao Tác (`Stable Action Node Invariant`)**:
   - Nút `#btn-save-support` là **một DOM element duy nhất** tồn tại xuyên suốt từ `IDLE` $\to$ `SAVING` $\to$ `NETWORK_ERROR` $\to$ `RETRY_SAVING` $\to$ `COMMITTED`.
   - Khi đang lưu, nút sử dụng `aria-disabled="true"` và cờ logic `isSaving = true`. Tuyệt đối không xóa nút, không thay thế bằng element khác và không dùng thuộc tính native `disabled`. Do đó, focus của người dùng đang đặt tại nút sẽ không bao giờ bị rơi về `document.body`.
4. **Bất biến Chống Cướp Focus (`No-Steal Focus Invariant`)**:
   - Nếu trong khoảng thời gian trễ 800ms của quá trình lưu, người dùng sử dụng phím Tab di chuyển focus sang phần tử khác (ví dụ: Tab lên ô `#field-details` để xem lại), thì khi quá trình lưu kết thúc (dù chuyển sang `NETWORK_ERROR` hay `COMMITTED`), hệ thống **tuyệt đối không được cướp focus kéo giật ngược về nút bấm**. Focus hiện tại của người dùng tại ô textarea phải được bảo toàn nguyên vẹn. Thông báo kết quả đã được Live Region đọc ngầm cho người dùng mà không cần giật focus.

---

## 5. TEST MATRIX DRAFT T01–T12 & STRESS TESTING METHODS

```
                               ┌────────────────────────────────────────────────────────┐
                               │           TEST MATRIX ARCHITECTURE T01–T12             │
                               └──────────────────────────┬─────────────────────────────┘
                                                          │
         ┌────────────────────────────────────────────────┼────────────────────────────────────────────────┐
         ▼                                                ▼                                                ▼
┌──────────────────────────────┐         ┌──────────────────────────────┐         ┌──────────────────────────────┐
│  STRUCTURAL & INTERACTION    │         │       FSM & RESILIENCE       │         │    STRESS & SENSORY AUDIT    │
│           (T01–T04)          │         │          (T05–T09)           │         │          (T10–T12)           │
├──────────────────────────────┤         ├──────────────────────────────┤         ├──────────────────────────────┤
│ T01: Semantic Structure Scan │         │ T05: 201-char Error & Edit   │         │ T10: Reflow, Zoom & Spacing  │
│ T02: AX Name & ARIA Graph    │         │ T06: Valid Submit Attempt 1  │         │ T11: Forced-Colors & Target  │
│ T03: Native Dialog Journey   │         │ T07: Retry Attempt 2 Success │         │ T12: AX Tree & Evidence Sync │
│ T04: Empty Submit Validation │         │ T08: Duplicate Click Guard   │         │                              │
│                              │         │ T09: No-Steal Focus Audit    │         │                              │
└──────────────────────────────┘         └──────────────────────────────┘         └──────────────────────────────┘
```

### 5.1. Bảng đặc tả 12 kịch bản kiểm thử T01–T12
Mỗi test được định nghĩa với điều kiện tiên quyết (`Precondition`), phương thức tương tác native bàn phím (`Interaction Method`), kết quả mong đợi (`Expected Result`), và công thức suy ra boolean thực tế:

| Mã Test | Tên Test | Điều kiện tiên quyết | Phương thức tương tác | Kết quả mong đợi & Tiêu chí xác thực boolean |
| :--- | :--- | :--- | :--- | :--- |
| **T01** | **Structure Scan** | Trang nạp lần đầu ở trạng thái IDLE. | Quét tĩnh DOM & computed styles. | - Có đủ 4 landmarks (`header`, `nav`, `main`, `footer`).<br>- Đúng 1 thẻ `h1`, heading hierarchy không nhảy cóc.<br>- DOM order khớp 100% thứ tự đọc visual.<br>- `#skip-link` hoạt động nhảy vào `#main-content`.<br>- **Boolean**: `pass = landmarksValid && singleH1 && orderMatches && skipLinkOk`. |
| **T02** | **Accessible Name & ARIA Graph** | DOM đã nạp hoàn tất. | Phân tích cây trợ năng CDP AX Tree & kiểm toán thuộc tính ID. | - 100% controls tương tác có accessible name không rỗng.<br>- 0 duplicate IDs trên toàn bộ tài liệu.<br>- 0 orphaned ARIA references (`aria-labelledby`, `aria-describedby` đều trỏ tới ID có thật trong DOM).<br>- **Boolean**: `pass = unnamedCount === 0 && dupIds === 0 && orphanRefs === 0`. |
| **T03** | **Native Dialog Journey** | Dialog đang đóng, focus tại `#btn-open-guidance`. | Nhấn `Enter` mở dialog $\to$ nhấn `Tab`/`Shift+Tab` kiểm tra trap $\to$ nhấn `Escape` đóng dialog. | - Dialog mở: `aria-modal="true"`, focus di chuyển vào `#btn-close-guidance`.<br>- Bấm `Tab`: focus bị giam trong dialog, không thoát ra ngoài.<br>- Nhấn `Escape`: dialog đóng, **focus trả về chính xác `#btn-open-guidance`**.<br>- **Boolean**: `pass = opened && focusInDialog && trapped && closedOnEsc && focusRestored`. |
| **T04** | **Submit Form Rỗng** | Form rỗng, chưa chọn radio, chưa tick xác nhận. | Nhấn `Enter` tại form hoặc kích hoạt native click trên `#btn-save-support`. | - Xuất hiện `#error-summary` ở đầu form.<br>- Focus tự động di chuyển đến lỗi đầu tiên (`#radio-boarding`).<br>- Các trường lỗi có `aria-invalid="true"` và liên kết `aria-describedby`.<br>- `attempts = 0`, `commits = 0`.<br>- **Boolean**: `pass = summaryVisible && focusFirstInvalid && ariaInvalidSet && attempts === 0`. |
| **T05** | **201 ký tự rồi sửa về 200** | Đã chọn radio và tick xác nhận; ô chi tiết nhập 201 ký tự. | Nhập 201 ký tự qua bàn phím $\to$ nhấn Submit $\to$ xóa 1 ký tự về 200 ký tự. | - Submit 201 ký tự: Bị chặn, hiển thị đúng copy `"Chi tiết hỗ trợ không được vượt quá 200 ký tự."`, `attempts = 0`.<br>- Sửa về 200 ký tự: Lỗi xóa bỏ, trường trở về hợp lệ, `attempts` vẫn giữ nguyên bằng 0.<br>- **Boolean**: `pass = errorOn201 && validOn200 && attempts === 0`. |
| **T06** | **Valid Submit Attempt 1 (Failure)** | Form hợp lệ (chọn boarding, nhập "Cần xe lăn hỗ trợ", đã tick xác nhận). | Nhấn phím `Enter` hoặc click `#btn-save-support`. | - Nút chuyển text `"Đang lưu yêu cầu hỗ trợ…"`, `aria-busy="true"`, `aria-disabled="true"`.<br>- Sau 800ms: Báo lỗi mạng đúng copy `"Chưa lưu được yêu cầu hỗ trợ. Nội dung đã nhập vẫn được giữ."`<br>- Toàn bộ bản nháp được giữ nguyên.<br>- Nút chuyển text `"Thử lưu lại"`.<br>- `attempts = 1`, `commits = 0`.<br>- **Boolean**: `pass = savingStateOk && networkErrorFired && draftRetained && attempts === 1 && commits === 0`. |
| **T07** | **Retry Attempt 2 (Success)** | Tiếp nối sau T06 (Attempt 1 đã thất bại, nút hiển thị "Thử lưu lại"). | Nhấn `#btn-save-support` lần thứ 2. | - Nút chuyển `"Đang lưu yêu cầu hỗ trợ…"`.<br>- Sau 800ms: Báo thành công đúng copy `"Đã lưu yêu cầu hỗ trợ cho hồ sơ AR-901."`<br>- Hiển thị bảng Committed Summary với dữ liệu hồ sơ.<br>- Xuất hiện nút `"Sửa yêu cầu"`.<br>- `attempts = 2`, `commits = 1`.<br>- **Boolean**: `pass = successAnnounced && summaryRendered && attempts === 2 && commits === 1`. |
| **T08** | **Duplicate Activation Guard** | Form hợp lệ, chuẩn bị submit. | Kích hoạt đồng thời 2 lần trong cửa sổ 800ms đang lưu (Click chuột + nhấn Enter). | - Nút nhận diện `isSaving = true`, bỏ qua lần kích hoạt thứ hai.<br>- Chỉ có đúng 1 network request/timer được tạo ra.<br>- Sau 800ms: `attempts` chỉ đạt đúng 1 (không vượt quá 1).<br>- **Boolean**: `pass = secondInvocationIgnored && attempts === 1`. |
| **T09** | **No-Steal Focus Audit** | Form hợp lệ, bắt đầu bấm lưu. | Bấm lưu $\to$ trong vòng 200ms lập tức nhấn phím `Tab` di chuyển focus sang `#field-details` $\to$ chờ đến 800ms khi request hoàn tất. | - Khi sự kiện hoàn tất (Failure hoặc Success), hệ thống **không giật focus quay lại nút**.<br>- Focus tại thời điểm 850ms vẫn nằm chính xác tại `#field-details`.<br>- **Boolean**: `pass = document.activeElement.id === 'field-details'`. |
| **T10** | **Reflow & Text Stress** | Mở trang Candidate trên các điều kiện stress. | Thay đổi viewport trình duyệt qua CDP: 1440×900, 768×1024, 390×844, 320×800; áp dụng font-size 200%; áp dụng WCAG text spacing. | - Tại 320 CSS px: `document.documentElement.scrollWidth <= 320` (0 horizontal scroll).<br>- Phóng to chữ 200%: Toàn bộ văn bản hiển thị đầy đủ, không bị clip, form điền và submit bình thường.<br>- Text spacing stress: Không vỡ khung, không che khuất control.<br>- **Boolean**: `pass = overflow320 === 0 && resize200Usable && textSpacingOk`. |
| **T11** | **Forced-Colors, Target & Contrast** | Chế độ forced-colors và kiểm toán chỉ số CSS. | Bật emulation forced-colors qua CDP; đo kích thước hình học BoundingBox; đo tỷ lệ tương phản sRGB. | - 100% controls tương tác chính có kích thước $\ge 44 \times 44$ CSS px.<br>- Focus ring nhìn thấy rõ ràng trên nền sáng và trong forced-colors.<br>- Các cặp màu văn bản và viền kế thừa từ Module 08 không bị suy giảm tương phản.<br>- `prefers-reduced-motion: reduce` không phát hiện animation/transition nào.<br>- **Boolean**: `pass = targetsGe44 && focusVisible && contrastPairsValid && zeroMotionValid`. |
| **T12** | **AX Tree & Evidence Integrity** | Toàn bộ các bước kiểm thử đã hoàn tất. | Trích xuất Snapshot cây trợ năng Chromium CDP Accessibility Tree; kiểm tra SHA-256 các file deliverables. | - Role, name, value trong AX Tree snapshot khớp hoàn toàn tài liệu.<br>- Mã băm SHA-256 của file source, screenshots, contract và report đồng bộ.<br>- 0 giá trị hardcoded pass trong test script.<br>- Trạng thái báo cáo ghi nhận đúng `SELF_CHECK_PASS / SUBMITTED_FOR_CONTROLLER_REVIEW`.<br>- **Boolean**: `pass = axTreeMatches && hashesMatch && noHardcoded && validClaimStatus`. |

---

### 5.2. Phương thức Stress Test kỹ thuật chuyên sâu
1. **Mô phỏng Phóng to chữ 200% (`Text Resize 200% Emulation`)**:
   - Sử dụng CDP inject style sheet cưỡng bức: `html { font-size: 200% !important; }` kết hợp kiểm tra độ co giãn đơn vị `rem`.
   - Kiểm tra `scrollHeight` và `clientHeight` của tất cả các container chứa text để xác nhận không có `overflow: hidden` gây mất chữ (`Text Clipping`).
2. **Mô phỏng Giãn khoảng cách chữ WCAG (`Text Spacing Stress Test`)**:
   - Áp dụng đoạn CSS chuẩn mực theo WCAG 2.2 SC 1.4.12:
     ```css
     * {
       line-height: 1.5 !important;
       letter-spacing: 0.12em !important;
       word-spacing: 0.16em !important;
     }
     p, span, label, legend, button, input, textarea {
       margin-bottom: 2em !important;
     }
     ```
   - Xác thực: Không có nút bấm hoặc nhãn nào bị tràn viền hoặc đè chồng lên nhau.
3. **Mô phỏng Chế độ Màu Tương phản Cao (`Forced-Colors Emulation`)**:
   - Kích hoạt qua giao thức CDP: `await page.emulateMediaFeatures([{ name: 'forced-colors', value: 'active' }])`.
   - Kiểm tra CSS: Khai báo `@media (forced-colors: active)` sử dụng các biến hệ thống (`Canvas`, `CanvasText`, `Highlight`, `HighlightText`, `ButtonBorder`), đảm bảo viền radio, viền textarea và outline focus không bị biến mất.

---

### 5.3. Phân định ranh giới giữa Dữ liệu Tự động (`Telemetry`) và Đánh giá Thủ công (`Manual Review`)
Nhằm loại bỏ hoàn toàn các tuyên bố sai sự thật (`Over-claiming`), báo cáo sẽ thiết lập ranh giới kiểm toán minh bạch:

```
┌──────────────────────────────────────────────────────────┬──────────────────────────────────────────────────────────┐
│             TELEMETRY (KIỂM TOÁN TỰ ĐỘNG)                │          MANUAL REVIEW (ĐÁNH GIÁ THỦ CÔNG)               │
├──────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────┤
│ • Cấu trúc DOM, danh sách landmarks, heading hierarchy.  │ • Tính tự nhiên và dễ hiểu của nhãn và câu thông báo     │
│ • Kiểm tra sự tồn tại của thuộc tính accessible name.     │   lỗi tiếng Việt đối với người dùng thực tế.             │
│ • Quét duplicate IDs và orphaned ARIA references.        │ • Trải nghiệm nghe thực tế trên các trình đọc màn hình   │
│ • Đo đạc kích thước hình học BoundingBox (44x44px).      │   phổ biến (NVDA, VoiceOver, JAWS).                      │
│ • Đo đạc số pixel cuộn ngang (0 scrollWidth overflow).   │ • Cảm nhận logic và nhịp độ điều hướng khi duyệt hồ sơ   │
│ • Tính toán toán học độ tương phản sRGB (Luminance).     │   với thao tác bàn phím thực tế của con người.           │
│ • Trích xuất cấu trúc phẳng Chromium CDP AX Tree.        │ • Xác nhận tính hợp lý trong ngữ cảnh nghiệp vụ điều     │
│ • Kiểm tra logic FSM (attempts counter, no-steal focus). │   phối viên du lịch TRIPFLOW.                            │
└──────────────────────────────────────────────────────────┴──────────────────────────────────────────────────────────┘
```

---

## 6. DANH MỤC TÀI LIỆU SẼ ĐÓNG GÓI TRONG GÓI NỘP CHÍNH THỨC

Khi Controller phê duyệt First Response, toàn bộ các thành phần sau sẽ được triển khai và đóng gói vào `design_training_009_submission_r01.zip`:

```
design_training_009_submission_r01.zip
├── baseline/
│   └── index.html                       # Bản cơ sở với 8 defects có chủ đích + banner disclaimer
├── directions/
│   ├── option_a.html                    # Hướng A: Inline Accessible Form
│   └── option_b.html                    # Hướng B: Guided Review Flow
├── index.html                           # Bản ứng viên chính thức (Candidate - Direction A)
├── ACCESSIBILITY_CONTRACT.yaml          # Hợp đồng trợ năng gắn chặt với DOM selector thực tế
├── DESIGN_TRAINING_009_DIRECTIVE.md     # Chỉ thị gốc đã nhận từ Controller
├── DESIGN_TRAINING_009_REPORT.md        # Báo cáo chuyên sâu chuẩn mực (11 phần theo quy định)
├── MANUAL_ACCESSIBILITY_REVIEW.md       # Đánh giá thủ công bàn phím & trải nghiệm screen reader
├── AX_TREE.json                         # Snapshot cây trợ năng Chromium CDP nguyên bản
├── VERIFICATION.json                    # Toàn bộ telemetry đo đạc từ đợt chạy cuối cùng
├── verify_module_009.js                 # Harness tự động kiểm chứng 8 Gates A01-A08 và 12 Tests T01-T12
└── screenshots/                         # 11 ảnh minh chứng tiêu chuẩn DPR=2
    ├── baseline_desktop_1440x900.png
    ├── direction_a_desktop_1440x900.png
    ├── direction_b_desktop_1440x900.png
    ├── final_desktop_1440x900.png
    ├── final_mobile_390x844.png
    ├── final_mobile_validation_390x844.png
    ├── final_mobile_network_error_390x844.png
    ├── final_mobile_success_390x844.png
    ├── final_reflow_320x800.png
    ├── final_text_resize_200_percent.png
    └── final_forced_colors.png
```

---

## 7. BÀN GIAO & TRÌNH DUYỆT (FIRST RESPONSE HANDOFF)

Kính trình Anh (Lead Architect) và Sol (Architectural Controller) thẩm định bản First Response này.

- **Trạng thái thực thi hiện tại**: `BLOCKED_PENDING_CONTROLLER_FIRST_RESPONSE_REVIEW`.
- **Hành động tiếp theo**: Ngay khi nhận được quyết định phê duyệt (`FIRST_RESPONSE_APPROVED`) từ Sol, Em sẽ lập tức tiến hành thi công mã nguồn theo đúng kiến trúc và ma trận kiểm thử đã cam kết ở trên!
