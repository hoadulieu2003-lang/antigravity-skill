# DESIGN TRAINING 009 — FIRST RESPONSE R02 ADDENDUM
## STREAM A: FOUNDATION INTEGRITY · MODULE 09: ACCESSIBILITY TASK COMPLETION

- **ADDENDUM_ID**: `DESIGN_TRAINING_009_FIRST_RESPONSE_R02`
- **MODULE_ID**: `DESIGN_TRAINING_009_ACCESSIBILITY`
- **REFERENCE_REVIEW**: `DESIGN_TRAINING_009_FIRST_RESPONSE_REVIEW_001.md`
- **CONTROLLER**: ChatGPT Architectural Controller (Sol)
- **OWNER**: Anh — Lead Architect / Product Owner
- **EXECUTOR**: Antigravity (Senior AI Pair-Programmer)
- **STATUS**: `SUBMITTED_FOR_CONTROLLER_R02_REVIEW`
- **REPAIR_BUDGET_CONSUMED**: `0/2` (Vòng hiệu chỉnh kế hoạch trước triển khai)
- **IMPLEMENTATION_STATUS**: `BLOCKED_PENDING_CONTROLLER_R02_APPROVAL`

---

## 1. TỔNG QUAN HIỆU CHỈNH KẾ HOẠCH R02 (EXECUTIVE SUMMARY)

Antigravity trân trọng cảm ơn Architectural Controller Sol đã ban hành văn bản thẩm định chi tiết **`DESIGN_TRAINING_009_FIRST_RESPONSE_REVIEW_001.md`**.

Bản Phụ lục **`DESIGN_TRAINING_009_FIRST_RESPONSE_R02`** này giải quyết dứt điểm toàn bộ 7 phát hiện kế hoạch (**P01 — P07**), cập nhật các kịch bản kiểm thử T03, T04, T06–T11, chuẩn hóa mô hình dữ liệu giao dịch 3 lớp, và khóa chặt các tuyên bố kỹ thuật trong phạm vi cho phép (`Bounded Scope`):

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                   BẢNG ĐỐI CHIẾU ĐÓNG 7 PLANNING FINDINGS (P01 — P07)                    │
├───────┬───────────────────────────────────┬──────────────────────────────────────────────┤
│ Mã    │ Nội dung yêu cầu từ Controller   │ Giải pháp chuẩn hóa trong Addendum R02       │
├───────┼───────────────────────────────────┼──────────────────────────────────────────────┤
│ `P01` │ Sửa cách diễn giải Dialog APG     │ Dùng native <dialog> + showModal(), loại bỏ  │
│       │                                   │ aria-hidden trên shell, phân định thiết kế. │
│ `P02` │ Tránh thông báo validation lặp   │ Khóa ma trận thông báo Single-Source duy nhất│
│       │                                   │ (error-summary role=alert, live alert không lặp)│
│ `P03` │ Sửa kiểm tra text resize/reflow   │ Cho phép cuộn dọc, bỏ scrollHeight<=client; │
│       │                                   │ gắn nhãn TEXT_SCALE_SIMULATION.              │
│ `P04` │ No-steal target ngoài transaction │ Dùng #btn-open-guidance làm no-steal target; │
│       │                                   │ tách 3 lớp: Draft, Payload, Committed.       │
│ `P05` │ Forced-colors capability preflight│ Bổ sung Preflight CDP, fail-closed nếu không │
│       │                                   │ hỗ trợ; không fallback sang PASS giả.        │
│ `P06` │ Thu hẹp tuyên bố WCAG baseline   │ Tách 3 cột: Observed / Risk / Candidate Tech;│
│       │                                   │ chỉ nhận POTENTIAL / PROJECT_INVARIANT.      │
│ `P07` │ Khóa error focus & radio group    │ Auto-focus vào first invalid control;        │
│       │                                   │ error-summary focusable=true nhưng không auto│
└───────┴───────────────────────────────────┴──────────────────────────────────────────────┘
```

---

## 2. GIẢI QUYẾT CHI TIẾT 7 PLANNING FINDINGS (P01 — P07)

### 2.1. P01 — Sửa cách diễn giải Dialog APG & Phạm vi DOM Native
* **Vấn đề nhận diện từ Review 001**: R01 diễn giải APG theo hướng bắt buộc gán `aria-hidden="true"` lên vùng nền. Nếu dialog nằm trong application shell, việc gán `aria-hidden="true"` lên container tổ tiên có thể vô tình ẩn luôn chính dialog khỏi cây trợ năng. Đồng thời, `aria-expanded` không phải thuộc tính bắt buộc của dialog trigger trong APG.
* **Quy chuẩn hiệu chỉnh trong R02**:
  1. **Native Dialog Strategy**: Sử dụng phần tử native `<dialog id="support-guidance-dialog">`. Khi mở, gọi trực tiếp API `HTMLDialogElement.prototype.showModal()`. Trình duyệt Chromium tự động kích hoạt cơ chế Top-Layer và vô hiệu hóa tương tác nền (`inertness`) mà không can thiệp bằng các thuộc tính ARIA thủ công.
  2. **Không gán `aria-hidden` lên Application Shell**: Tuyệt đối không gắn `aria-hidden="true"` lên các thẻ cha hoặc container chứa dialog.
  3. **Ranh giới thuộc tính Trigger**:
     - Thuộc tính `aria-haspopup="dialog"` được khai báo trên nút `#btn-open-guidance` để công nghệ hỗ trợ nhận diện hành vi mở hộp thoại.
     - Không xem `aria-expanded` là quy định bắt buộc của W3C APG Dialog Pattern. Để tránh dư thừa ngữ nghĩa, trigger chỉ sử dụng `type="button"` và `aria-haspopup="dialog"`.
  4. **Initial Focus Design Decision**: Việc đưa con trỏ focus ban đầu vào nút đóng `#btn-close-guidance` được xác định rõ là một **Quyết định Thiết kế có chủ đích của Dự án (Project-Specific Design Decision)** nhằm tạo sự thuận tiện cho người dùng duyệt nhanh bản hướng dẫn ngắn, không phải là lựa chọn bắt buộc duy nhất của APG.

---

### 2.2. P02 — Khóa Ma Trận Thông Báo Single-Source (Loại bỏ Trùng Lặp Validation)
* **Vấn đề nhận diện từ Review 001**: R01 đồng thời gán `role="alert"` lên `#error-summary` và phát thông báo validation qua `#live-alert-region`, gây nguy cơ screen reader đọc lặp lỗi hai lần.
* **Ma trận nguồn thông báo duy nhất (`Single-Source Announcement Matrix`) khóa chặt trong R02**:

```yaml
single_source_announcement_matrix:
  validation_errors:
    announcement_source: error_summary
    element_selector: "#error-summary"
    error_summary_role: alert
    error_summary_tabindex: "-1"
    live_alert_region_repeats_validation: false
    behavior: "Chỉ phát âm thanh cảnh báo qua Error Summary khi submit không hợp lệ."

  network_error:
    announcement_source: live_alert_region
    element_selector: "#live-alert-region"
    role: alert
    aria_live: assertive
    behavior: "Phát thông báo lỗi mạng bất đồng bộ sau 800ms khi save thất bại."

  saving_progress:
    announcement_source: live_status_region
    element_selector: "#live-status-region"
    role: status
    aria_live: polite
    behavior: "Thông báo tiến trình lưu đang diễn ra."

  success_confirmation:
    announcement_source: live_status_region
    element_selector: "#live-status-region"
    role: status
    aria_live: polite
    behavior: "Thông báo đã lưu thành công vào hồ sơ AR-901."

  inline_errors:
    announcement_source: none
    linkage: aria-describedby
    behavior: "Liên kết ngữ nghĩa trực tiếp với từng control, không tạo luồng live announcement độc lập."
```

---

### 2.3. P03 — Sửa phương pháp kiểm tra Text Resize 200% & Reflow 320px
* **Vấn đề nhận diện từ Review 001**: Tiêu chí `scrollHeight <= clientHeight` là sai về bản chất trợ năng vì khi chữ phóng to 200%, trang dài ra và phát sinh thanh cuộn dọc là hành vi hợp lệ và bình thường.
* **Quy chuẩn kiểm chứng hiệu chỉnh cho T10**:
  1. **Cho phép cuộn dọc hợp lệ (`Vertical Scrolling Explicitly Allowed`)**:
     - Bỏ hoàn toàn điều kiện `scrollHeight <= clientHeight`.
     - Điều kiện bắt buộc: **`document.documentElement.scrollWidth <= window.innerWidth`** (Hoàn toàn không có cuộn ngang ở cả 320 CSS px và khi phóng to chữ 200%).
  2. **Kiểm tra không bị vỡ hoặc che khuất chữ (`No Text Clipping / Zero Overlap`)**:
     - 100% phần tử văn bản (tiêu đề, nhãn, câu thông báo lỗi, nút CTA, nội dung dialog) phải có kích thước hình học dương (`bounding rect width > 0, height > 0`).
     - Đo đạc tự động: `scrollWidth <= clientWidth` trên từng container nội dung cục bộ, xác nhận không có `overflow: hidden` làm mất chữ (`Zero Truncation`).
  3. **Hoàn thành tác vụ trong chế độ Stress**: Người dùng vẫn thực hiện trọn vẹn chu trình điền form, xem lỗi, và kích hoạt lưu trong điều kiện chữ 200%.
  4. **Gắn nhãn hình ảnh minh chứng chính xác**:
     - File ảnh: `screenshots/final_text_resize_200_percent.png`.
     - Nhãn kỹ thuật trong `VERIFICATION.json`: **`TEXT_SCALE_SIMULATION`** (mô phỏng co giãn kích thước chữ cơ sở qua CSS/DOM), tuyệt đối **KHÔNG** ghi `BROWSER_ZOOM_CERTIFICATION`.

---

### 2.4. P04 — Mô hình Dữ liệu 3 Lớp & No-Steal Focus Target Ổn Định Ngoài Giao Dịch
* **Vấn đề nhận diện từ Review 001**: Trong R01, kịch bản T09 đề xuất người dùng Tab vào `#field-details` (textarea) trong khi đang lưu 800ms. Điều này gây xung đột luồng và điều kiện tranh chấp (`Race Condition`) giữa nội dung đang sửa và payload đang gửi.
* **Mô hình Dữ liệu Giao dịch 3 Lớp (`Three-Tier Transaction Data Model`)**:

```
[ User Form Controls ] ──( Click Submit )──► [ In-Flight Payload Snapshot ] ──( Attempt 2 Success )──► [ Committed Data Summary ]
        ▲                                                │                                                    │
        │                                                ▼                                                    ▼
(Live Draft Values)                          Chụp bất biến tại t=0ms                               Khóa vào hồ sơ AR-901
Có thể sửa tiếp sau Failure                  Không bị ảnh hưởng bởi                                Chỉ cập nhật khi SUCCESS
                                             thay đổi sau đó
```

  1. **Lớp 1 — Live Draft (`Bản nháp thời gian thực`)**: Giá trị hiện tại người dùng đang nhập trong DOM controls. Khi Attempt 1 gặp lỗi mạng, Live Draft được giữ nguyên vẹn 100%.
  2. **Lớp 2 — Payload Snapshot (`Bản chụp gói tin gửi đi`)**: Được đóng băng bất biến (`Immutable Snapshot`) tại thời điểm submit kích hoạt. Mã giả lập gửi mạng chỉ xử lý trên Payload Snapshot này.
  3. **Lớp 3 — Committed Data (`Dữ liệu đã ghi nhận`)**: Chỉ được khởi tạo và hiển thị sau khi Attempt 2 trả về `SUCCESS`, phản ánh chính xác dữ liệu từ Payload Snapshot.
* **Quy định Khóa Trạng Thái Controls trong khi Saving**:
  - Khi đang lưu (800ms): Form controls nhận `aria-disabled="true"` và class visual trạng thái xử lý, nhưng **không xóa node và không dùng native `disabled`** để tránh đẩy con trỏ focus về body.
* **Phần tử Đích No-Steal Focus Ổn Định (`Stable Non-Transaction Target`)**:
  - Trong kịch bản kiểm thử T09: Sau khi bấm Lưu, người dùng dùng phím Tab di chuyển con trỏ focus tới **`#btn-open-guidance`** (Nút "Xem hướng dẫn hỗ trợ" nằm ở thanh tiêu đề hồ sơ).
  - Đây là phần tử tương tác hoàn toàn ổn định, nằm ngoài phạm vi các trường nhập liệu đang giao dịch (`Non-transactional control`).
  - Khi quá trình lưu hoàn tất sau 800ms (cả ở Failure lẫn Success), harness xác thực: `document.activeElement.id === 'btn-open-guidance'` (Focus không bị cướp giật).

---

### 2.5. P05 — Cơ Chế Kiểm Tra Khả Năng Thực Thi Forced-Colors (Capability Preflight)
* **Vấn đề nhận diện từ Review 001**: API giả lập forced-colors có thể không được hỗ trợ nhất quán tùy theo phiên bản Chromium. Harness không được phép ngầm định cho PASS nếu môi trường không thực thi được.
* **Quy trình Preflight Kiểm toán Khép Kín (`Fail-Closed Preflight Protocol`)**:
  1. Kích hoạt thông qua CDP:
     ```javascript
     await client.send('Emulation.setEmulatedMedia', {
       media: 'page',
       features: [{ name: 'forced-colors', value: 'active' }]
     });
     ```
  2. **Kiểm tra Preflight trên Runtime DOM**:
     ```javascript
     const forcedColorsActive = await page.evaluate(() => {
       return window.matchMedia('(forced-colors: active)').matches;
     });
     ```
  3. **Cơ chế phân loại kết quả kiểm toán minh bạch**:
     - Nếu `forcedColorsActive === true`: Tiến hành đo đạc độ dày viền `outline`, độ tương phản hệ thống (`CanvasText`, `Highlight`) và ghi nhận kết quả kiểm thử bình thường.
     - Nếu `forcedColorsActive === false`: Ghi nhận trường `forced_colors_emulation_supported: false` trong `VERIFICATION.json`. Kết quả subtest tự động được đánh dấu là **`NOT_EXECUTED`**, tuyệt đối **KHÔNG GHI PASS GIẢ**. Toàn bộ bằng chứng cho tiêu chí này sẽ chuyển sang kiểm toán thủ công (`Manual Review Evidence`).
  4. Metadata ảnh `screenshots/final_forced_colors.png` ghi rõ: `emulation_method: "CDP_Emulation.setEmulatedMedia"`, `chromium_version`, và `emulation_supported: true/false`.

---

### 2.6. P06 — Thu Hẹp Tuyên Bố Pháp Lý WCAG Đối Với Các Lỗi Baseline
* **Vấn đề nhận diện từ Review 001**: Một số lỗi được gán nhãn vi phạm tuyệt đối khi chưa kiểm chứng đầy đủ (ví dụ: native disabled không đương nhiên vi phạm SC 2.4.3; radio 20×20 có thể có effective target nếu label có thể bấm được; SC 3.3.1 không bắt buộc nguyên văn 2 thuộc tính ARIA).
* **Bảng phân loại chuẩn mực 3 cột theo yêu cầu R02**:

| Khuyết tật Quan sát được (`Observed Defect`) | Tiêu chí WCAG Liên quan & Rủi ro (`Relevant Criterion / Risk`) | Kỹ thuật Triển khai Ứng viên (`Candidate Technique`) |
| :--- | :--- | :--- |
| **`DEF-01`**: Control lưu dùng thẻ `div` với listener click chuột, thiếu ngữ nghĩa bàn phím. | **POTENTIAL_FAILURE**: SC 4.1.2 (Name, Role, Value) & SC 2.1.1 (Keyboard) do thiếu role và không bắt phím Enter/Space. | Sử dụng native `<button type="submit" id="btn-save-support">` kế thừa hành vi trình duyệt. |
| **`DEF-02`**: Ô chi tiết hỗ trợ chỉ dùng placeholder, không có nhãn hiển thị cố định. | **POTENTIAL_FAILURE**: SC 3.3.2 (Labels or Instructions) khi người dùng nhập nội dung làm mất chỉ dẫn. | Sử dụng `<label for="field-details">Chi tiết hỗ trợ</label>` cố định và bền vững. |
| **`DEF-03`**: Trạng thái lỗi chỉ biểu diễn bằng màu viền đỏ, không có thông báo văn bản liên kết. | **POTENTIAL_FAILURE**: SC 1.4.1 (Use of Color) và SC 3.3.1 (Error Identification). | Cung cấp thông báo lỗi bằng chữ và liên kết ngữ nghĩa qua `aria-describedby` + `aria-invalid="true"`. |
| **`DEF-04`**: Thứ tự DOM bị đảo ngược so với thứ tự hiển thị thị giác bằng CSS. | **POTENTIAL_FAILURE**: SC 1.3.2 (Meaningful Sequence) và SC 2.4.3 (Focus Order). | Chuẩn hóa thứ tự mã nguồn DOM khớp 100% luồng đọc tự nhiên từ trên xuống dưới. |
| **`DEF-05`**: Cập nhật bất đồng bộ chèn vào `div` tĩnh không có vai trò live-region. | **POTENTIAL_FAILURE**: SC 4.1.3 (Status Messages) do công nghệ hỗ trợ không tự động đọc thay đổi. | Thiết lập live regions hiện diện sẵn trong DOM khởi tạo (`#live-status-region`, `#live-alert-region`). |
| **`DEF-06`**: Gán native `disabled` làm mất con trỏ focus của người dùng đang thao tác. | **USABILITY_DEFECT / POTENTIAL_FAILURE**: Rủi ro mất định hướng con trỏ bàn phím theo APG Guidelines. | Giữ nguyên node action button, dùng `aria-disabled="true"` và cờ logic `isSaving` chặn tương tác thừa. |
| **`DEF-07`**: Vùng bấm độc lập của radio/checkbox nhỏ hơn kích thước chuẩn. | **PROJECT_INVARIANT_FAILURE**: Vi phạm quy chuẩn nội bộ dự án TRIPFLOW (Tối thiểu 44×44 CSS px).<br>*(Lưu ý: Ngưỡng SC 2.5.8 của WCAG 2.2 AA là 24×24 CSS px).* | Mở rộng vùng bấm hiệu dụng (`Effective Clickable Target`) của cả icon và label kèm padding đạt tối thiểu 44×44 CSS px. |
| **`DEF-08`**: Khung chứa form đặt fixed width cứng, sinh cuộn ngang ở màn hình hẹp. | **POTENTIAL_FAILURE**: SC 1.4.10 (Reflow) khi xem ở bề rộng 320 CSS px. | Áp dụng thiết kế đáp ứng `max-width: 100%`, loại bỏ hoàn toàn thanh cuộn ngang trang. |

---

### 2.7. P07 — Khóa Hợp Đồng Focus Khi Submit Lỗi & Cấu Trúc Nhóm Radio
* **Vấn đề nhận diện từ Review 001**: Cần làm rõ quan hệ focus giữa Error Summary và trường lỗi đầu tiên; đồng thời chuẩn hóa ngữ nghĩa lỗi của nhóm radio (lỗi thuộc về cả nhóm chứ không chỉ riêng 1 radio option).
* **Hợp đồng Trợ năng được khóa cứng (`Unambiguous Accessibility Contract`)**:

```yaml
invalid_submit_focus_contract:
  auto_focus_target: "first_invalid_control"
  error_summary_behavior:
    element_id: "error-summary"
    role: "alert"
    tabindex: "-1"
    is_auto_focused_on_submit: false
    contains_internal_anchor_links: true
    links_target:
      - href: "#support-type-group"
        label: "Chọn hình thức hỗ trợ cần sắp xếp."
      - href: "#field-details"
        label: "Chi tiết hỗ trợ không được vượt quá 200 ký tự."
      - href: "#checkbox-confirmation"
        label: "Xác nhận rằng yêu cầu đã được trao đổi với khách."

radio_group_semantic_contract:
  group_container:
    tag: "fieldset"
    id: "support-type-group"
    legend_text: "Hình thức hỗ trợ cần sắp xếp"
    aria_invalid: "true (khi chưa chọn)"
    aria_describedby: "error-support-type"
  first_focusable_option:
    id: "radio-boarding"
    aria_describedby: "error-support-type"
  focus_rule_on_empty_submit:
    action: "Focus tự động chuyển tới radio đầu tiên (#radio-boarding) đại diện cho nhóm."
```

- **Giải thích luồng thao tác**: Khi submit không hợp lệ, `#error-summary` đóng vai trò cảnh báo âm thanh (`role="alert"`) cho screen reader; con trỏ focus thị giác và bàn phím được chuyển lập tức tới **trường lỗi đầu tiên** (`#radio-boarding`). Người dùng điều hướng bàn phím có thể nhấn `Shift + Tab` để quay lại duyệt danh sách anchor link trên Error Summary nếu cần.

---

## 3. CẬP NHẬT MA TRẬN KIỂM THỬ KHÓA T01–T12 (REVISED TEST MATRIX)

Các kịch bản kiểm thử T03, T04, T06–T11 được điều chỉnh chính xác theo các quy chuẩn kỹ thuật mới:

| Mã Test | Tên Test | Điều kiện & Phương thức kiểm thử chuẩn hóa R02 | Kết quả mong đợi & Tiêu chuẩn nghiệm thu Boolean |
|:---:|---|---|---|
| **T01** | **Structure Scan** | Quét cây DOM ban đầu. | 4 landmarks, đúng 1 thẻ `h1`, DOM order khớp luồng đọc, skip-link hoạt động.<br>`pass = landmarksValid && singleH1 && orderMatches && skipLinkOk` |
| **T02** | **Accessible Name Graph** | Quét CDP AX Tree Snapshot. | 0 unnamed controls, 0 duplicate IDs, 0 orphaned ARIA references.<br>`pass = unnamedCount === 0 && dupIds === 0 && orphanRefs === 0` |
| **T03** | **Native Dialog Journey** | Gọi `showModal()` trên native `<dialog>`. Bấm `Tab`/`Shift+Tab` trong dialog. Nhấn `Escape`. | - Focus ban đầu vào `#btn-close-guidance` (Design decision).<br>- Focus bị giam giữ trong dialog (Top layer native).<br>- Escape đóng dialog, **focus phục hồi về đúng `#btn-open-guidance`**.<br>`pass = opened && focusInDialog && trapped && closedOnEsc && focusRestored` |
| **T04** | **Empty Submit Validation** | Nhấn Enter hoặc click Lưu khi form rỗng. | - `#error-summary` hiển thị nội dung lỗi.<br>- Focus **tự động chuyển đến first invalid control** (`#radio-boarding`).<br>- `attempts = 0`, `commits = 0`. Live alert không lặp lại lỗi.<br>`pass = summaryVisible && activeElementIsFirstInvalid && attempts === 0` |
| **T05** | **201 ký tự rồi sửa về 200** | Nhập 201 ký tự $\to$ Submit $\to$ Xóa 1 ký tự về 200. | - 201 ký tự: Lỗi đúng copy, `attempts = 0`.<br>- 200 ký tự: Lỗi xóa bỏ, hợp lệ, `attempts = 0`.<br>`pass = errorOn201 && validOn200 && attempts === 0` |
| **T06** | **Valid Submit Attempt 1** | Form hợp lệ $\to$ Bấm Lưu. | - Nút hiển thị "Đang lưu yêu cầu hỗ trợ…", `aria-busy="true"`.<br>- Snapshot Payload được chụp tại t=0ms.<br>- Sau 800ms: Báo lỗi mạng đúng copy qua `#live-alert-region`.<br>- Toàn bộ Live Draft được giữ nguyên vẹn trong DOM controls.<br>- `attempts = 1`, `commits = 0`.<br>`pass = savingStateOk && networkErrorFired && draftRetained && attempts === 1` |
| **T07** | **Retry Attempt 2 Success** | Form giữ nguyên sau T06 $\to$ Bấm "Thử lưu lại". | - Nút chuyển trạng thái lưu lần 2.<br>- Sau 800ms: Báo thành công đúng copy qua `#live-status-region`.<br>- Committed Summary hiển thị chính xác dữ liệu từ Payload.<br>- `attempts = 2`, `commits = 1`. Nút chuyển thành "Sửa yêu cầu".<br>`pass = successAnnounced && summaryMatchesPayload && attempts === 2 && commits === 1` |
| **T08** | **Duplicate Activation Guard** | Kích hoạt submit 2 lần trong cửa sổ 800ms đang lưu. | - Lần bấm thứ 2 bị bỏ qua (`Debounced / Guarded`).<br>- `attempts` không vượt quá 1 ở Attempt 1.<br>`pass = secondInvocationIgnored && attempts === 1` |
| **T09** | **No-Steal Focus Audit** | Bấm lưu $\to$ trong 200ms nhấn `Tab` chuyển focus sang **`#btn-open-guidance`** $\to$ chờ đến khi save hoàn tất. | - Khi request hoàn tất (thành công hoặc lỗi), hệ thống không giật con trỏ.<br>- Focus tại thời điểm 850ms vẫn nằm tại `#btn-open-guidance`.<br>`pass = document.activeElement.id === 'btn-open-guidance'` |
| **T10** | **Reflow & Text Stress** | Viewport 320×800, text scale 200% CSS, text spacing WCAG. | - `scrollWidth <= clientWidth` (0 cuộn ngang).<br>- **Cho phép cuộn dọc hợp lệ**.<br>- 100% text rect dương, không bị cắt chữ hoặc đè controls.<br>- Gắn nhãn `TEXT_SCALE_SIMULATION`.<br>`pass = overflow320 === 0 && textScaleUsable && zeroClipping` |
| **T11** | **Forced-Colors & Target** | Kích hoạt CDP setEmulatedMedia `forced-colors: active`. | - Chạy Preflight: Xác nhận `matchMedia` trả về `true` trước khi đo.<br>- 100% controls chính có effective target $\ge 44 \times 44$ CSS px.<br>- Focus ring nhìn thấy rõ ràng. Không có animation.<br>`pass = preflightPassed && targetSizeOk && focusVisible && zeroMotion` |
| **T12** | **AX Tree & Evidence Sync** | Snapshot cây trợ năng Chromium CDP và đối soát mã băm. | - Cây trợ năng phản ánh đúng roles, names và states.<br>- Báo cáo tách biệt Telemetry, Manual Review, Hypothesis.<br>- Trạng thái báo cáo ghi nhận đúng `SELF_CHECK_PASS / SUBMITTED_FOR_CONTROLLER_REVIEW`.<br>`pass = axTreeMatches && hashesMatch && boundedClaims` |

---

## 4. XÁC NHẬN GIỚI HẠN TUYÊN BỐ TRƯỚC TRIỂN KHAI (BOUNDED CLAIMS CONFIRMATION)

Tuân thủ nghiêm ngặt chỉ dẫn tại Mục 4 của Review 001:
1. **Số bước bàn phím (`Tab Stops`)**:
   - Toàn bộ số lượng Tab được nêu trong phân tích Direction A (~12–14 steps) và Direction B (~20–22 steps) được xác định chính thức là **ƯỚC TÍNH THIẾT KẾ TRƯỚC TRIỂN KHAI (`ESTIMATED_TAB_STOPS`)**.
   - Số bước bàn phím thực tế chỉ được công bố sau khi mã nguồn Candidate và Option B được thi công hoàn chỉnh và đo đạc qua harness.
2. **Tải ghi nhớ & Tốc độ tác nghiệp**:
   - Được định danh chính xác là **GIẢ THUYẾT THIẾT KẾ (`DESIGN_HYPOTHESIS`)**, không xem là kết luận trải nghiệm người dùng thực tế.
3. **Mô phỏng Chữ 200%**:
   - Gắn nhãn minh chứng là `TEXT_SCALE_SIMULATION`, phân biệt rõ ràng với việc phóng to toàn bộ trang web trên trình duyệt (`Full Page Zoom`).

---

## 5. BÀN GIAO & ĐỀ NGHỊ PHÊ DUYỆT R02 ĐỂ MỞ TRIỂN KHAI ($DEV)

Bản Phụ lục **`DESIGN_TRAINING_009_FIRST_RESPONSE_R02.md`** đã đóng trọn vẹn 100% các yêu cầu tại `DESIGN_TRAINING_009_FIRST_RESPONSE_REVIEW_001.md`:
- `P01_DIALOG_SCOPE`: `corrected`
- `P02_DUPLICATE_ANNOUNCEMENT`: `eliminated`
- `P03_VERTICAL_SCROLL`: `allowed`
- `P03_TEXT_SCALE_CLAIM`: `bounded`
- `P04_TRANSACTION_DATA_LAYERS`: `explicit (Draft / Payload / Committed)`
- `P04_NO_STEAL_TARGET`: `stable_non_transaction_control (#btn-open-guidance)`
- `P05_FORCED_COLORS_PREFLIGHT`: `fail_closed`
- `P06_WCAG_MAPPING`: `bounded`
- `P07_ERROR_FOCUS_CONTRACT`: `unambiguous`

Kính đề nghị **Architectural Controller Sol** xem xét, chấp thuận bản Phụ lục R02 và chính thức phê duyệt mở khóa giai đoạn **`$dev` (Implementation Authorization)** cho **Module 09**!
