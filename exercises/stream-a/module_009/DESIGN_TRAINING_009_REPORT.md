# BÁO CÁO THỰC THI & KIỂM CHỨNG TRỢ NĂNG — MODULE 09 (REPAIR ROUND 2 FINAL)
## STREAM A: FOUNDATION INTEGRITY · TASK: ACCESSIBILITY TASK COMPLETION
### TRIPFLOW — Bàn Tiếp Nhận Yêu Cầu Hỗ Trợ Hành Khách (Hồ sơ AR-901)

- **REPORT_ID**: `DESIGN_TRAINING_009_REPORT`
- **MODULE_ID**: `DESIGN_TRAINING_009_ACCESSIBILITY`
- **MODULE_NAME**: `ACCESSIBILITY_TASK_COMPLETION`
- **STREAM_ID**: `FOUNDATION_INTEGRITY`
- **BRANCH_ID**: `TAB_A`
- **OWNER**: Anh — Lead Architect / Product Owner
- **CONTROLLER**: ChatGPT Architectural Controller (Sol)
- **EXECUTOR**: Antigravity (Senior AI Pair-Programmer)
- **SUBMISSION_REVISION**: `R03` (`DESIGN_TRAINING_009_REPAIR_002`)
- **REPAIR_ROUND**: `2/2_FINAL` (2 lượt đã hoàn tất, ngân sách còn lại: 0)
- **VISUAL_DIRECTION**: `DIRECTION_A_ACCEPTED_AND_FROZEN` (Đã chấp thuận & đóng băng hoàn toàn)
- **ARCHIVE_NAME**: `design_training_009_submission_r03.zip`
- **ARCHIVE_ENTRIES**: `28 entries`
- **PROPOSED_VERDICT**: `SELF_CHECK_PASS / SUBMITTED_FOR_CONTROLLER_REVIEW`
- **HARNESS_EXECUTION_RESULT**: `8/8 GATES PASS (A01–A08) · 12/12 TESTS PASS (T01–T12) · 6/6 SELF-TESTS PASS · EXIT CODE 0`

---

## 0. GIẢI TRÌNH KHẮC PHỤC TRIỆT ĐỂ 5 ĐIỂM NGHẼN THEO DESIGN_TRAINING_009_REVIEW_002.md (R01–R05 & FINAL_R01–FINAL_R18)

Thực thi nghiêm ngặt chỉ đạo thẩm định tại [DESIGN_TRAINING_009_REVIEW_002.md](DESIGN_TRAINING_009_REVIEW_002.md), toàn bộ 5 nhóm điểm nghẽn kỹ thuật thuộc tầng kiểm chứng và 18 tiêu chí nghiệm thu vòng cuối (`FINAL_R01` đến `FINAL_R18`) đã được hoàn thiện khép kín:

| Mã Tiêu Chí Khóa | Nội Dung Yêu Cầu Controller Sol | Giải Pháp Khắc Phục Của Antigravity | Bằng Chứng Viễn Trắc Thực Nghiệm |
| :---: | :--- | :--- | :--- |
| **`FINAL_R01`<br>`FINAL_R02`<br>`FINAL_R03`<br>`FINAL_R04`** | **Native Full FSM Journey & Strict Node Identity xuyên suốt đến Success**: Một hành trình duy nhất từ clean state qua `idle -> saving1 -> failure -> retry -> saving2 -> success`; kiểm tra tham chiếu node bằng toán tử `===` và `isConnected` tại mọi mốc; Tab sang `#btn-open-guidance` trong `saving2` và đảm bảo sau khi thành công không bị cướp focus; `body_focus_events` phải bằng 0. | • Xây dựng lại kịch bản **T09** thành một chu trình khép kín thống nhất.<br>• Lưu tham chiếu gốc `window.__initialSaveBtn`. Tại cả 6 mốc (IDLE, SAVING_1, FAILURE, RETRY_ACTIVATION, SAVING_2, SUCCESS), assert `btn === window.__initialSaveBtn` và `btn.isConnected === true`.<br>• Trong cửa sổ lưu lần 2, thực thi Tab/Shift+Tab native chuyển focus tới `#btn-open-guidance`. Sau khi lưu thành công, focus vẫn nằm nguyên vẹn tại `#btn-open-guidance`.<br>• Lắng nghe sự kiện `focus` trên capture phase: số sự kiện rơi vào `document.body` là 0. | **T09 Pass Tuyệt Đối**:<br>• `strictNodeIdentityMaintained: true` (100% 6 mốc khớp `===`)<br>• `stageSuccess.isConnected: true`<br>• `focusPreservedOnGuidance: true` (`document.activeElement.id === 'btn-open-guidance'`)<br>• `bodyFocusEvents: 0`<br>• `attempts: 2`, `commits: 1`. |
| **`FINAL_R05`** | **Native Scenario Static AST Scan**: Quét mã nguồn kiểm chứng, phát hiện và fail nếu các kịch bản native (T03, T08, T09) có sử dụng `page.focus()`, `HTMLElement.focus()` hoặc DOM `.click()` giả lập input. | • Tích hợp bộ quét tĩnh trích xuất độc quyền thân mã nguồn của 3 kịch bản native trong `verify_module_009.js`.<br>• Xác nhận 0 lệnh can thiệp focus giả lập. | **Static Scan Pass**:<br>• `forbiddenCount: 0`<br>• `staticScanPass: true`. |
| **`FINAL_R06`<br>`FINAL_R07`** | **Global & Local Reflow Audit & Bounded Clipping/Overlap**: Đo đồng thời documentElement, body và danh mục vùng chọn bắt buộc (13 vùng); assert `local_horizontal_scrollers: 0`; đo 4 cạnh rect, clipping và overlap; bổ sung Positive Control fixture cố ý gây tràn. | • Khóa danh mục 13 vùng trọng yếu (`#site-header`, `#site-nav`, `#main-content`, `#site-footer`, `#case-summary-card`, `#intake-form-card`, `fieldset#support-type-group`, `#field-details`, `#checkbox-confirmation`, `#btn-save-support`, `#error-summary`, `#committed-summary-section`, `dialog#support-guidance-dialog`).<br>• Đo đạc `scrollWidth <= clientWidth` cho toàn bộ container hiển thị, xác nhận `local_horizontal_scrollers: 0`.<br>• Đo 4 cạnh bounding rect và tính va chạm hộp giới hạn giữa các phần tử anh em.<br>• Bổ sung **Positive Control dirty fixture** (phần tử 500px trong hộp 200px) chứng minh detector phát hiện tràn hình học chính xác. | **T10 & Self-Test 1 Pass**:<br>• 100% 5 viewports: `globalHasOverflow: false`<br>• `localHorizontalScrollersCount: 0`<br>• `clippedCount: 0`<br>• `overlapCollisions: 0`<br>• `missingSelectorsCount: 0`<br>• Positive detector control: `detectedDirtyOverflow: true`. |
| **`FINAL_R08`<br>`FINAL_R09`<br>`FINAL_R10`<br>`FINAL_R11`** | **Live Computed Focus Contrast, Stateful Target & 12-Pair Contrast Inventory**: Đo viền focus `:focus-visible` trực tiếp từ live `getComputedStyle()` (loại bỏ màu hard-coded); quét Target Inventory qua 4 trạng thái render; mở rộng Contrast Inventory lên 12 cặp; forced-colors unsupported phải làm gate FAIL. | • Di chuyển phím Tab native lần lượt tới 6 interactive controls, đọc trực tiếp `outlineWidth`, `outlineStyle`, `outlineColor` và màu nền tiếp giáp thực tế từ computed styles. Tính toán tương phản toán học live (đạt $\ge 3.0:1$).<br>• Quét Target Inventory qua 4 trạng thái: Initial Form, Dialog Open, Validation Visible và Committed Summary Visible (100% đạt SC 2.5.8 $\ge 24$px và TRIPFLOW $\ge 44$px).<br>• Đo đạc 12 cặp tương phản hoàn chỉnh.<br>• Khóa chặt: forced-colors unsupported gán `NOT_EXECUTED_ENVIRONMENT_UNSUPPORTED` và làm Gate A07 thất bại. | **T11 & Self-Test 4 Pass**:<br>• `allFocusPass: true` (Live computed ratios: 3.10:1 đến 4.91:1)<br>• `allTargetsMeetWcag24: true`<br>• `allControlsMeetTripflow44: true`<br>• `allContrastPass: true` (12/12 cặp đạt)<br>• `forcedColorsStatus: "EXECUTED_PASS"`. |
| **`FINAL_R12`<br>`FINAL_R13`<br>`FINAL_R14`<br>`FINAL_R15`<br>`FINAL_R18`** | **Exact Artifact Manifest, Authoritative Image Audit & Portable Relative Links**: Khai báo chính xác 28 entries trong archive; kiểm toán exact 11 ảnh chụp màn hình (SHA-256, byte size > 0, kích thước pixel PNG chuẩn DPR=2); đối chiếu 5 văn bản Controller byte-identical; thay toàn bộ liên kết tuyệt đối ổ đĩa thành đường dẫn tương đối. | • Manifest xác định chuẩn xác **28 entries** (bổ sung văn bản `DESIGN_TRAINING_009_REVIEW_002.md`).<br>• Kiểm toán tự động 11 tệp ảnh: đọc trực tiếp header chunk IHDR xác nhận đúng pixel width/height (Desktop 2880×1800, Mobile 780×1688, Reflow 640×1600), byte size và SHA-256.<br>• Đối chiếu động 5 văn bản Controller: 100% trùng khớp mã băm.<br>• Thay thế 100% liên kết tuyệt đối Windows thành liên kết tương đối markdown portable. | **T12 Pass Tuyệt Đối**:<br>• `archiveEntriesCount: 28`<br>• `screenshotsValid: true` (11/11 ảnh đúng pixel & size)<br>• `all5ControllerDocsMatch: true`<br>• `reportHasZeroAbsoluteFileLinks: true`<br>• `reportGovernancePass: true`. |
| **`FINAL_R16`<br>`FINAL_R17`** | **Positive/Negative Controls & Fail-Closed Exit Behavior**: Bổ sung bộ tự kiểm 6 bài test độc lập (reflow dirty fixture, hash mismatch, missing artifact, color parser, forced-colors guard, false gate conjunction); assert mã thoát exit code 1 khi có gate FAIL. | • Thiết lập suite `results.self_tests` gồm 6 bài kiểm tra độc lập chạy ngay đầu harness.<br>• Khi có bất kỳ gate nào thất bại, harness lập tức in `SELF_CHECK_FAIL` và gọi `process.exit(1)`. Khi 8/8 gates pass, thoát `process.exit(0)`. | **Self-Tests & Exit Code Pass**:<br>• 6/6 self-tests pass<br>• Exit code 0 khi toàn bộ tiêu chí đạt chuẩn. |

---

## 1. CANONICAL FIXTURE & PRIVACY BOUNDARY (BỐI CẢNH DỮ LIỆU & RANH GIỚI BẢO MẬT)

### 1.1. Dữ liệu Huấn luyện Chuẩn hóa (Synthetic Training Fixture)
Toàn bộ quy trình kiểm toán và thi công của Module 09 được vận hành độc quyền trên bộ dữ liệu giả lập đã được Controller phê duyệt:
- **Mã hồ sơ yêu cầu (`request_id`)**: `AR-901`
- **Mã đặt chỗ (`booking_code`)**: `BK-24091`
- **Tên hành khách (`passenger_display_name`)**: `Khách A`
- **Mã tour (`tour_id`)**: `TF-802`
- **Tên tour (`tour_name`)**: `Tour Fansipan Sapa 2 Ngày 1 Đêm`
- **Thời gian khởi hành (`departure`)**: `2026-09-15 06:30 ICT`
- **Trạng thái ban đầu (`current_status`)**: `Chưa ghi nhận yêu cầu hỗ trợ`

```yaml
DATA_CLASSIFICATION: SYNTHETIC_TRAINING_FIXTURE
REAL_CUSTOMER_DATA: false
MEDICAL_DIAGNOSIS_COLLECTION: forbidden
BUSINESS_PERFORMANCE_CLAIMS: none
```

### 1.2. Ranh giới Bảo mật Nghiệp vụ (Privacy Boundary)
- Hệ thống chỉ thu thập **Nhu cầu hỗ trợ chức năng thực tế cần bố trí** trong hành trình (xe lăn lên xuống phương tiện, tài liệu chữ lớn, giao tiếp văn bản).
- Tuyệt đối nghiêm cấm thu thập, lưu trữ hoặc gợi ý chẩn đoán y tế, bệnh án hay lịch sử sức khỏe cá nhân của hành khách.

---

## 2. BASELINE AUDIT — BẢNG PHÂN TÍCH 8 KHUYẾT TẬT CÓ CHỦ ĐÍCH (DEF-01 ĐẾN DEF-08)

Bản mẫu cơ sở [baseline/index.html](baseline/index.html) mang đúng 8 khuyết tật trợ năng có chủ đích kèm banner cảnh báo bắt buộc:
> *"Bản mẫu huấn luyện có lỗi khả năng tiếp cận có chủ đích — không dùng trong sản phẩm thật."*

| Mã Lỗi | Khuyết tật Quan sát được (`Observed Defect`) | Nguy cơ Tiêu chuẩn Liên quan (`Relevant Criterion / Risk`) | Kỹ thuật Khắc phục Ứng viên (`Candidate Technique`) |
| :---: | :--- | :--- | :--- |
| **`DEF-01`** | Nút lưu dùng thẻ `<div class="btn-save" onclick="save()">`, thiếu `role="button"`, không có `tabindex="0"`, không bắt phím Enter/Space. | **POTENTIAL_FAILURE**: SC 4.1.2 (Name, Role, Value) & SC 2.1.1 (Keyboard). Người dùng bàn phím hoàn toàn không thể Tab hoặc kích hoạt nút. | Sử dụng native `<button type="submit" id="btn-save-support">` kế thừa trọn vẹn hành vi bàn phím và khả năng focus mặc định của trình duyệt. |
| **`DEF-02`** | Ô Chi tiết hỗ trợ chỉ dùng `placeholder="Chi tiết hỗ trợ"`, thiếu thẻ `<label>` và không có `aria-label`. Nhãn biến mất khi nhập liệu. | **POTENTIAL_FAILURE**: SC 3.3.2 (Labels or Instructions) & SC 4.1.2. Mất nhãn định danh khi người dùng gõ chữ vào ô nhập. | Sử dụng thẻ `<label for="field-details">Chi tiết hỗ trợ</label>` hiển thị cố định và bền vững phía trên ô nhập liệu. |
| **`DEF-03`** | Trạng thái lỗi chỉ biểu diễn bằng viền đỏ (`border-color: #EF4444`), không có câu text giải thích và không có liên kết `aria-describedby`. | **POTENTIAL_FAILURE**: SC 1.4.1 (Use of Color) & SC 3.3.1 (Error Identification). Người dùng khiếm thị hoặc mù màu không nhận biết được lỗi. | Hiển thị chuỗi văn bản thông báo lỗi cụ thể và liên kết ngữ nghĩa với control qua `aria-describedby` + `aria-invalid="true"`. |
| **`DEF-04`** | Thứ tự DOM và thứ tự hiển thị thị giác bị đảo ngược bằng CSS `flex-direction: column-reverse;`, phím Tab đi ngược từ dưới lên. | **POTENTIAL_FAILURE**: SC 1.3.2 (Meaningful Sequence) & SC 2.4.3 (Focus Order). Gây mất phương hướng cho người dùng duyệt bằng phím Tab. | Chuẩn hóa luồng mã nguồn DOM khớp 100% với luồng đọc tự nhiên từ trên xuống dưới. |
| **`DEF-05`** | Cập nhật trạng thái đang lưu và lỗi mạng được chèn vào thẻ `<div>` thông thường không có `role="status"`, `role="alert"`, hay `aria-live`. | **POTENTIAL_FAILURE**: SC 4.1.3 (Status Messages). Trình đọc màn hình không thể tự động phát hiện và đọc thông báo cập nhật bất đồng bộ. | Thiết lập hai vùng live-region tĩnh hiện diện sẵn từ DOM ban đầu (`#live-status-region`, `#live-alert-region`). |
| **`DEF-06`** | Khi nhấn Lưu, gán native `disabled` hoặc thay thế HTML nút, khiến trình duyệt đẩy bật con trỏ focus rơi tự do về `document.body`. | **USABILITY_DEFECT / POTENTIAL_FAILURE**: Rủi ro mất định hướng con trỏ bàn phím theo khuyến nghị của WAI-ARIA APG. | Duy trì 1 node button duy nhất ổn định (`#btn-save-support`), dùng `aria-busy`, `aria-disabled` và cờ logic `isSaving` (0 body focus). |
| **`DEF-07`** | Vùng bấm độc lập của radio và checkbox chỉ đạt kích thước 20×20 CSS px không có padding mở rộng. | **PROJECT_INVARIANT_FAILURE**: Vi phạm quy chuẩn nội bộ dự án TRIPFLOW (Mục tiêu hiệu dụng $\ge 44 \times 44$ CSS px).<br>*(Lưu ý: Ngưỡng SC 2.5.8 WCAG 2.2 AA là 24×24 CSS px).* | Thiết lập container bao bọc `.target-container` kết hợp padding và nhãn liên kết đạt kích thước tối thiểu $44 \times 44$ CSS px. |
| **`DEF-08`** | Khung chứa form đặt fixed width cứng `width: 650px;`, gây vỡ giao diện và phát sinh thanh cuộn ngang khi xem ở màn hình 320 CSS px. | **POTENTIAL_FAILURE**: SC 1.4.10 (Reflow). Buộc người dùng phải cuộn hai chiều để xem nội dung và điền biểu mẫu. | Áp dụng thiết kế đáp ứng linh hoạt với `max-width: 100%`, loại bỏ hoàn toàn thanh cuộn ngang trang ở mọi kích thước viewport. |

---

## 3. BA NGUYÊN TẮC CHUẨN MỰC W3C CỐT LÕI (THREE NORMATIVE PILLARS)

Báo cáo căn cứ độc quyền vào các tài liệu tiêu chuẩn chính thức của W3C (không sử dụng blog cá nhân làm căn cứ pháp lý):

### 3.1. Nguyên tắc 1: W3C WAI-ARIA APG — Dialog (Modal) Pattern
- **Điều nguồn thực sự quy định**: Hộp thoại modal phải có `role="dialog"`, `aria-modal="true"`. Focus khi mở phải chuyển vào bên trong hộp thoại; các phím `Tab` / `Shift+Tab` bị giam giữ (`Focus Trap`) trong modal; phím `Escape` đóng hộp thoại; khi đóng, focus **bắt buộc phải hoàn trả chuẩn xác về trigger button** đã mở hộp thoại đó.
- **Cách áp dụng vào bài**: Hộp thoại native `<dialog id="support-guidance-dialog">` kích hoạt bởi `#btn-open-guidance` (`aria-haspopup="dialog"`). Khi mở bằng `.showModal()`, focus chuyển vào `#btn-close-guidance`. Nhấn `Escape` hoặc nút đóng: focus lập tức hoàn trả về `#btn-open-guidance`. Bẫy focus bàn phím được kiểm chứng độc lập bằng hành vi native Tab/Shift+Tab.
- **Giới hạn**: Quyết định đưa focus ban đầu vào nút đóng là quyết định thiết kế có chủ đích của dự án cho modal hướng dẫn ngắn, không phải lựa chọn duy nhất của APG.
- **Bằng chứng thực thi**: Đạt tuyệt đối tại **Test T03 (Gate A03)** với `trapAsserted: true`.

### 3.2. Nguyên tắc 2: WCAG 2.2 SC 3.3.1 (Error Identification) & SC 3.3.3 (Error Suggestion)
- **Điều nguồn thực sự quy định**: Khi phát hiện lỗi nhập liệu, phần tử bị lỗi phải được xác định và mô tả bằng văn bản cụ thể. Mối quan hệ giữa control lỗi và văn bản mô tả phải xác định được bằng máy qua `aria-describedby` và `aria-invalid="true"`.
- **Cách áp dụng vào bài**: Thiết lập khối Error Summary ở đầu form (`#error-summary` với `role="alert"`) chứa danh sách anchor links trỏ tới từng control lỗi. Các trường lỗi được gắn `aria-invalid="true"` và liên kết qua `aria-describedby`. Khi submit rỗng, focus tự động chuyển đến control lỗi đầu tiên theo thứ tự DOM (`#radio-boarding`).
- **Giới hạn**: Automated scanner chỉ kiểm tra sự tồn tại của attributes và ID liên kết; độ rõ ràng và dễ hiểu của câu chữ tiếng Việt được thẩm định độc lập theo Kế hoạch Thẩm định Công nghệ Hỗ trợ ([ASSISTIVE_TECH_REVIEW_PLAN.md](ASSISTIVE_TECH_REVIEW_PLAN.md)).
- **Bằng chứng thực thi**: Đạt tuyệt đối tại **Test T04, T05 (Gate A04)**.

### 3.3. Nguyên tắc 3: WCAG 2.2 SC 4.1.3 (Status Messages) & Live Regions
- **Điều nguồn thực sự quy định**: Thông điệp trạng thái bất đồng bộ phải được truyền đạt tới công nghệ hỗ trợ mà không cướp con trỏ focus của người dùng. Trạng thái lưu/thành công dùng `role="status"` (`polite`); trạng thái lỗi mạng khẩn cấp dùng `role="alert"` (`assertive`).
- **Cách áp dụng vào bài**: Khóa ma trận Single-Source Announcement Matrix:
  - Validation error: Chỉ phát từ `#error-summary` (`role="alert"`). Không phát lặp qua live alert region (`live_alert_region_repeats_validation: false`).
  - Network error: Phát qua `#live-alert-region` (`role="alert"`, `assertive`).
  - Saving & Success: Phát qua `#live-status-region` (`role="status"`, `polite`).
  - Nút submit `#btn-save-support` duy trì nguyên vẹn bản thể DOM qua toàn bộ chu trình, dùng `aria-busy="true"`, `aria-disabled="true"` và cờ `isSaving` (0 body focus).
  - **No-Steal Focus Invariant**: Khi người dùng di chuyển focus sang `#btn-open-guidance` trong lúc đang lưu ở lần retry, khi lưu thành công, focus hiện tại tại `#btn-open-guidance` được bảo toàn nguyên vẹn (`bodyFocusEvents: 0`).
- **Bằng chứng thực thi**: Đạt tuyệt đối tại **Test T08, T09 (Gate A05)**.

---

## 4. PHÂN TÍCH HAI HƯỚNG TIẾP CẬN & ĐÁNH ĐỔI KIẾN TRÚC (REMEDIATION DIRECTIONS)

Hai hướng được xây dựng song song trên cùng bộ dữ liệu chuẩn hóa AR-901 và cùng bộ chuỗi copy khóa:
- **Direction A**: [directions/option_a.html](directions/option_a.html) — Inline Accessible Form (Ứng viên được Controller phê duyệt & đóng băng — `DIRECTION_A_ACCEPTED_AND_FROZEN`).
- **Direction B**: [directions/option_b.html](directions/option_b.html) — Guided Review Flow (Mô hình 2 bước có rà soát).

### 4.1. Bảng So Sánh 4 Chiều Kích Theo Quy Chuẩn Bounded Claims

| Chiều kích So sánh | Direction A — Inline Accessible Form (`option_a.html`) | Direction B — Guided Review Flow (`option_b.html`) |
| :--- | :--- | :--- |
| **1. Số bước bàn phím (`Tab Stops`)** | **`ESTIMATED_TAB_STOPS` trước triển khai: ~12–14 steps**.<br>Đo đạc thực tế tại runtime: **12 Tab stops** từ Skip link đến nút Lưu. Luồng thao tác tuyến tính liên tục, không có nút chuyển bước trung gian. | **`ESTIMATED_TAB_STOPS` trước triển khai: ~20–22 steps**.<br>Đo đạc thực tế tại runtime: **21 Tab stops** do phải qua nút "Tiếp tục", bảng rà soát ở Bước 2, và nút "Quay lại". |
| **2. Khả năng phát hiện & sửa lỗi (`Error Recovery`)** | Toàn bộ lỗi hiển thị đồng thời tại `#error-summary` và inline dưới từng trường. Bấm anchor link hoặc Tab tới thẳng trường lỗi để sửa tại chỗ. | Lỗi Bước 1 chặn ở Bước 1. Nếu sang Bước 2 người dùng muốn đổi ý, họ phải bấm "Quay lại", làm gián đoạn luồng tác nghiệp. |
| **3. Tải ghi nhớ (`Cognitive Memory Load`)** | **`DESIGN_HYPOTHESIS`**: Người dùng nhìn thấy đồng thời toàn bộ trường và lựa chọn trên cùng màn hình, tối ưu cho tác vụ tác nghiệp nhanh của điều phối viên TRIPFLOW. | **`DESIGN_HYPOTHESIS`**: Bước 2 cung cấp bảng tĩnh rà soát thông tin trước khi nhấn Lưu chính thức, giúp giảm tải ghi nhớ cho việc kiểm chứng dữ liệu phức tạp. |
| **4. Độ ổn định focus (`Focus Stability`)** | **Tuyệt đối ổn định**: DOM tĩnh hoàn toàn, không có ẩn hiện khối cha, focus chỉ di chuyển theo thứ tự bàn phím tự nhiên hoặc tới lỗi đầu tiên khi submit. | Đòi hỏi quản lý focus chủ động bằng script khi chuyển bước (nhấn "Tiếp tục" phải chuyển focus về `#heading-step-2` có `tabindex="-1"`). |

### 4.2. Hai Điểm Đánh Đổi Kiến Trúc Bắt Buộc Của Hướng Được Chọn (Candidate - Direction A)
1. **Đánh đổi 1 (Mật độ hiển thị vs Toàn vẹn Cây Trợ năng)**:
   - *Chấp nhận*: Trên màn hình nhỏ (320px) hoặc khi phóng to chữ 200%, Direction A dồn toàn bộ biểu mẫu và khối tóm tắt lỗi lên cùng một trang, khiến trang dài hơn và phát sinh cuộn dọc nhiều hơn.
   - *Bù lại*: Đảm bảo 100% cây trợ năng luôn toàn vẹn và hiện diện đầy đủ (`Zero State Fragmentation`), toàn bộ thuộc tính `aria-describedby` và anchor links luôn trỏ tới các DOM nodes có thực tại mọi thời điểm.
2. **Đánh đổi 2 (Không có màn hình Review tĩnh vs Phục hồi Lỗi mạng Tức thì)**:
   - *Chấp nhận*: Không có màn hình Review chuyên biệt như Direction B, đòi hỏi điều phối viên phải tự lướt mắt rà soát dữ liệu trước khi gửi.
   - *Bù lại*: Khi xảy ra lỗi mạng ở Attempt 1, người dùng quan sát thấy ngay toàn bộ dữ liệu bản nháp (`Live Draft`) vẫn đang được giữ nguyên vẹn trong ô nhập liệu và có thể nhấn nút "Thử lưu lại" ngay lập tức mà không phải thực hiện các thao tác chuyển bước phức tạp.

---

## 5. REQUIREMENT → SELECTOR → TEST → EVIDENCE MATRIX

| Mã Gate | Yêu Cầu Kỹ Thuật | Selector Ánh Xạ Trong Contract | Test Kiểm Chứng | Dữ Liệu Thực Nghiệm (Telemetry & Hashes) | Kết Quả Tự Kiểm |
| :---: | :---|---|:---:|---|:---:|
| **`A01`** | Semantic Structure, Single H1, Reading Order & Skip Link | `header#site-header`, `nav#site-nav`, `main#main-content`, `footer#site-footer`, `h1#page-heading`, `a#skip-link` | **T01** | • 4/4 landmarks hợp lệ.<br>• 1 thẻ `h1` duy nhất ("Ghi nhận yêu cầu hỗ trợ").<br>• Heading hierarchy không bỏ cấp.<br>• Skip link focusable, rect dương (243×48px). | **SELF_CHECK_PASS** |
| **`A02`** | Accessible Name Graph, 0 Unnamed, 0 Duplicate IDs, 0 Orphan Refs | `button`, `input`, `textarea`, `a[href]` | **T02** | • 11/11 controls có accessible name duy nhất.<br>• 0 duplicate IDs.<br>• 0 orphaned ARIA references. | **SELF_CHECK_PASS** |
| **`A03`** | Native Keyboard Journey & Modal Dialog APG Lifecycle | `dialog#support-guidance-dialog`, `button#btn-open-guidance`, `button#btn-close-guidance` | **T03** | • Gọi native `.showModal()`, `aria-modal="true"`.<br>• Focus ban đầu vào nút đóng (Design decision).<br>• Tab bị giam trong dialog (`trapAsserted: true`).<br>• Escape đóng dialog, focus phục hồi 100% về `#btn-open-guidance`. | **SELF_CHECK_PASS** |
| **`A04`** | Validation, Error Association, 200-char Limit & Repair | `#error-summary`, `#support-type-group`, `#field-details`, `#checkbox-confirmation`, `#btn-save-support` | **T04<br>T05** | • Trạng thái ban đầu: 100% lỗi ẩn, summary ẩn, attempts=0.<br>• Submit rỗng: focus về `#radio-boarding`, attempts=0.<br>• 201 ký tự bị chặn, sửa về 200 xóa lỗi, attempts=0. | **SELF_CHECK_PASS** |
| **`A05`** | Unified Full FSM Journey, Strict Node Identity & No-Steal Focus Invariant | `#live-status-region`, `#live-alert-region`, `#btn-save-support`, `#btn-open-guidance` | **T08<br>T09** | • Click chuột + phím Enter trùng trong lúc saving bị chặn (`attempts: 1`).<br>• Chu trình khép kín 6 mốc: `idle -> saving1 -> failure -> retry -> saving2 -> success`.<br>• Node identity: `btn === window.__initialSaveBtn` và `isConnected === true` tại cả 6 mốc.<br>• Di chuyển focus sang `#btn-open-guidance` trong `saving2`; khi lưu thành công, focus vẫn ở `#btn-open-guidance` (`bodyFocusEvents: 0`).<br>• Static scan: 0 forbidden focus calls. | **SELF_CHECK_PASS** |
| **`A06`** | Global & Local Reflow Audit, 13 Required Regions, Zero Clipping/Overlap | `html`, `body`, 13 required selectors | **T10** | • 5/5 viewports đạt `scrollWidth <= clientWidth` (0 global overflow).<br>• 0 local scrollers (`localHorizontalScrollersCount: 0`).<br>• `clippedCount: 0`, `overlapCollisions: 0` trên toàn bộ 5 viewports.<br>• Positive control dirty fixture phát hiện tràn chính xác. | **SELF_CHECK_PASS** |
| **`A07`** | Live Computed Focus Contrast, Stateful Target & 12-Pair Contrast Inventory | `button`, `input`, `textarea`, `.target-container` | **T11** | • Live computed focus outline contrast: 3.10:1 đến 4.91:1 ($\ge 3.0:1$).<br>• Stateful target inventory 4 states: 100% đạt SC 2.5.8 $\ge 24$px và TRIPFLOW $\ge 44$px.<br>• 12/12 cặp tương phản đạt chuẩn.<br>• Preflight forced-colors: `forcedColorsStatus: EXECUTED_PASS` (khóa trong gate conjunction). | **SELF_CHECK_PASS** |
| **`A08`** | Exact Artifact Manifest, 11 Screenshots & 5 Controller Documents Audit | `AX_TREE.json`, `VERIFICATION.json`, `screenshots/` | **T12** | • Snapshot cây trợ năng Chromium CDP: 133 nodes.<br>• Exact 11 ảnh screenshots DPR=2 đúng kích thước pixel IHDR.<br>• 5/5 tài liệu Controller khớp 100% mã băm SHA-256 byte-identical.<br>• Báo cáo chứa 0 liên kết tuyệt đối Windows (100% portable relative links).<br>• Manifest archive đúng 28 entries. | **SELF_CHECK_PASS** |

---

## 6. KẾT QUẢ KIỂM THỬ KHÓA T01–T12 & BỘ TỰ KIỂM SELF-TESTS

```text
======================================================================
 GATE EVALUATION SUMMARY MATRIX — MODULE 09 (REPAIR ROUND 2 FINAL)
======================================================================
 Gate A01 (Semantic Structure & Reading Order    ) : [ PASS ]
 Gate A02 (Accessible Name & ARIA Reference Graph) : [ PASS ]
 Gate A03 (Native Keyboard Journey & Modal Dialog) : [ PASS ]
 Gate A04 (Validation, Error Recovery & FSM      ) : [ PASS ]
 Gate A05 (Live Announcement & No-Steal Invariant) : [ PASS ]
 Gate A06 (Reflow 320px & Text Scaling Stress    ) : [ PASS ]
 Gate A07 (Forced-Colors, Target Size & Contrast ) : [ PASS ]
 Gate A08 (Evidence Integrity & AX Tree Snapshot ) : [ PASS ]
----------------------------------------------------------------------
 OVERALL VERDICT: SELF_CHECK_PASS / SUBMITTED_FOR_CONTROLLER_REVIEW
======================================================================
```

### 6.1. Chi tiết 6 Bài Tự Kiểm Positive & Negative Controls (`results.self_tests`):
1. **Positive Reflow/Overflow Detector Control**: Bơm dirty fixture phần tử 500px vào container 200px $\to$ detector phát hiện tràn hình học `detectedDirtyOverflow: true` $\to$ **PASS**.
2. **Negative Hash Mismatch Detector Control**: So sánh với chuỗi mã băm sai lệch $\to$ detector phát hiện bất đồng bộ `matches: false` $\to$ **PASS**.
3. **Negative Missing Artifact Detector Control**: Quét tìm tệp không tồn tại $\to$ trả về `false` $\to$ **PASS**.
4. **Color Parser Fail-Closed Control**: Truyền chuỗi màu rác, chuỗi rỗng $\to$ parser trả về `null` fail-closed $\to$ **PASS**.
5. **Forced-Colors Conjunction Guard Control**: Truyền trạng thái giả lập không hỗ trợ $\to$ công thức conjunction đánh trượt Gate A07 $\to$ **PASS**.
6. **False Gate Produces Fail Control**: Truyền ma trận có 1 cổng FALSE $\to$ overall status chuyển thành `SELF_CHECK_FAIL` $\to$ **PASS**.

### 6.2. Chi tiết 12 Kịch bản Kiểm thử T01–T12:
- **Precondition Check (Clean Initial State)**: Khối tóm tắt lỗi `#error-summary` mang thuộc tính `hidden`; 100% thông báo lỗi inline mang thuộc tính `hidden` và CSS `display: none !important`; 0 trường mang `aria-invalid="true"`; `attempts: 0`. $\to$ **PASS**
- **T01 (Structure Scan)**: 4/4 landmarks hiện diện; 1 thẻ `h1` duy nhất; heading hierarchy không bỏ cấp; Skip link focusable, rect dương (243×48px). $\to$ **PASS**
- **T02 (Accessible Name Graph)**: 11 controls được phân tích; `unnamedCount: 0`; `dupIdsCount: 0`; `orphanRefsCount: 0`. $\to$ **PASS**
- **T03 (Native Dialog Journey)**: Kích hoạt bằng phím Enter; `opened: true`; `initialFocusCloseBtn: true`; `trapAsserted: true` (Tab tuần hoàn bên trong modal, không rò rỉ ra ngoài); đóng bằng phím Escape; `focusRestoredToTrigger: true` (hoàn trả về `#btn-open-guidance`). $\to$ **PASS**
- **T04 (Empty Submit Validation)**: Nhấn Lưu rỗng: `#error-summary` hiển thị với `role="alert"`; focus tự động chuyển đến `#radio-boarding`; `attempts: 0`; `liveAlertDidNotRepeat: true` (Single source compliance). $\to$ **PASS**
- **T05 (201-char Error & Edit to 200)**: Nhập 201 ký tự hiển thị đúng copy `"Chi tiết hỗ trợ không được vượt quá 200 ký tự."`; sửa về 200 ký tự lập tức xóa bỏ lỗi; `attempts: 0`. $\to$ **PASS**
- **T08 (Native Duplicate Activation Guard)**: Kích hoạt đồng thời qua Pointer Click và Native Enter Keypress trong cửa sổ lưu 800ms; cờ `isSaving` chặn hoàn toàn lệnh thứ hai; `attempts: 1` (chính xác bằng 1). $\to$ **PASS**
- **T09 (Unified Full FSM Journey & Strict Node Identity)**:
  - Khảo sát trọn vẹn 6 mốc: IDLE, SAVING_1, FAILURE, RETRY_ACTIVATION, SAVING_2, SUCCESS.
  - Cả 6 mốc đều xác nhận `btn === window.__initialSaveBtn` và `btn.isConnected === true`.
  - Trong `saving2`, người dùng Tab sang `#btn-open-guidance`. Khi lưu thành công, focus vẫn giữ nguyên tại `#btn-open-guidance`.
  - Số sự kiện rơi focus vào `body` là 0 (`bodyFocusEvents: 0`).
  - Static scan: 0 forbidden focus calls trong kịch bản native. $\to$ **PASS**
- **T10 (Global & Local Reflow Matrix & Zero Clipping/Overlap)**:
  - Quét toàn bộ 5 viewport (320px, 320px @ 200% font size, 390px, 768px, 1440px): `scrollWidth <= clientWidth` (0 global overflow).
  - Khảo sát 13 vùng trọng yếu: `missingSelectorsCount: 0`.
  - Không có thanh cuộn ngang cục bộ (`localHorizontalScrollersCount: 0`).
  - `clippedCount: 0`; `overlapCollisions: 0`. $\to$ **PASS**
- **T11 (Live Focus Contrast, Stateful Targets & 12-Pair Contrast)**:
  - Tương phản viền focus `:focus-visible` đo trực tiếp từ live computed style đạt 3.10:1 đến 4.91:1 ($\ge 3.0:1$).
  - Target inventory qua 4 trạng thái: 100% controls đạt SC 2.5.8 $\ge 24$px và TRIPFLOW $\ge 44$px.
  - 12/12 cặp tương phản đạt chuẩn.
  - Preflight forced-colors: `forcedColorsStatus: EXECUTED_PASS`. $\to$ **PASS**
- **T12 (AX Tree Snapshot, Screenshot Dimensions & 5 Controller Documents Audit)**:
  - Trích xuất 133 nodes từ Chromium CDP AX Tree.
  - Đủ exact 11 screenshots DPR=2 đúng kích thước pixel IHDR.
  - 5/5 tài liệu Controller khớp 100% mã băm SHA-256 byte-identical.
  - Báo cáo tuân thủ governance (0 liên kết `file:///`, 0 tuyên bố đơn phương).
  - Khớp exact 28 entries trong manifest archive. $\to$ **PASS**

---

## 7. ĐỐI CHIẾU MÃ BĂM 5 VĂN BẢN CHÍNH THỨC CỦA CONTROLLER (BYTE-IDENTICAL INVARIANT)

Toàn bộ 5 văn bản của Controller Sol được trích xuất trực tiếp qua CDP Download và đối chiếu động tại Test T12, đạt 100% trùng khớp mã băm:

| Tên Văn Bản Controller | Đường Dẫn Lưu Trữ | Mã Băm SHA-256 Kỳ Vọng / Đo Đạc Thực Tế | Trạng Thái Đối Chiếu |
| :--- | :--- | :--- | :---: |
| `DESIGN_TRAINING_009_DIRECTIVE.md` | `exercises/stream-a/module_009/` | `0472f2d0df0360eee10f8c1a6c30f862409b89a88cbc206fa5db7b0d3463dee5` | **100% MATCH** |
| `DESIGN_TRAINING_009_FIRST_RESPONSE_REVIEW_001.md` | `exercises/stream-a/module_009/` | `ac7d03ebabf35e9faab61d5454d6c463629161d29bd14f65971ce78963508046` | **100% MATCH** |
| `DESIGN_TRAINING_009_FIRST_RESPONSE_REVIEW_002.md` | `exercises/stream-a/module_009/` | `e72022bc363eff194713ff5ba51a2f62d7123f3639fae386e62022212bff8577` | **100% MATCH** |
| `DESIGN_TRAINING_009_REVIEW_001.md` | `exercises/stream-a/module_009/` | `4f5c4640e3eebdb19ac2935e89a1f0315f609c3ea3de4431dc334464d62b190b` | **100% MATCH** |
| `DESIGN_TRAINING_009_REVIEW_002.md` | `exercises/stream-a/module_009/` | `08119f7bcd4805413778cce02200fd25c6aa2144ad2fbb602855ab0eade49e23` | **100% MATCH** |

---

## 8. PHÂN ĐỊNH RANH GIỚI TELEMETRY / MANUAL REVIEW / HYPOTHESIS

```
┌──────────────────────────────────────────────────────────┬──────────────────────────────────────────────────────────┐
│             TELEMETRY (ĐO ĐẠC TỰ ĐỘNG)                   │          MANUAL REVIEW (ĐÁNH GIÁ THỦ CÔNG)               │
├──────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────┤
│ • Danh sách 4 landmarks, số lượng thẻ h1 và headings.   │ • Tính tự nhiên, tôn trọng và dễ hiểu của nhãn và câu    │
│ • Kiểm tra thuộc tính accessible name, dup IDs, ARIA refs.│   thông báo lỗi tiếng Việt đối với người dùng thực tế.   │
│ • Bounding Box hình học (44x44 CSS px, 24x24 CSS px).    │ • Trải nghiệm âm thanh và nhịp đọc thực tế trên các      │
│ • Chỉ số cuộn trang scrollWidth <= clientWidth (5 viewports)│ trình đọc màn hình (NVDA, VoiceOver, JAWS).            │
│ • Đo đạc 0 local scrollers trên 13 vùng bắt buộc.        │ • Đánh giá tính logic trong nghiệp vụ điều phối viên du  │
│ • Tính toán toán học độ tương phản sRGB (Luminance).     │   lịch TRIPFLOW.                                         │
│ • Snapshot 133 nodes của cây trợ năng Chromium CDP.      │ • Nhận định người dùng: "Tối ưu thao tác", "giảm tải ghi │
│ • Bộ đếm FSM (attempts counter, no-steal focus target).  │   nhớ" (được định danh là DESIGN_HYPOTHESIS).            │
│ • Xác nhận bẫy focus bàn phím (native trapAsserted).     │                                                          │
│ • Bằng chứng strict node identity (===) qua 6 mốc FSM.   │                                                          │
└──────────────────────────────────────────────────────────┴──────────────────────────────────────────────────────────┘
```

- **Giới hạn kỹ thuật (`Limitations`)**:
  1. Cây trợ năng Chromium CDP (`AX Tree`) chỉ phản ánh cấu trúc dữ liệu máy tính của trình duyệt, không thay thế được việc kiểm thử trực tiếp của người khuyết tật sử dụng công nghệ hỗ trợ thực tế.
  2. Phương thức phóng to chữ qua CSS (`html { font-size: 200% }`) là một mô phỏng kích thước chữ cơ sở (`TEXT_SCALE_SIMULATION`), không tương đương hoàn toàn với tính năng Full Browser Zoom của trình duyệt.
  3. Preflight forced-colors được thực thi qua CDP `Emulation.setEmulatedMedia`, phản ánh môi trường mô phỏng trên Chromium engine.
  4. Đánh giá chất lượng âm thanh trình đọc màn hình được quản lý độc lập tại [ASSISTIVE_TECH_REVIEW_PLAN.md](ASSISTIVE_TECH_REVIEW_PLAN.md) với trạng thái `MANUAL_REVIEW_PENDING`.

---

## 9. DANH MỤC 28 TỆP TIN TRONG GÓI LƯU TRỮ CHÍNH THỨC (ARCHIVE MANIFEST)

Toàn bộ **28 tệp tin** của gói nộp `design_training_009_submission_r03.zip` được xác nhận hiện diện đầy đủ với đường dẫn tương đối chuẩn dấu gạch xuôi `/`:

1. `index.html` — Bản ứng viên Candidate hoàn chỉnh (Direction A đóng băng).
2. `baseline/index.html` — Bản cơ sở Baseline với 8 defects có chủ đích.
3. `directions/option_a.html` — Mã nguồn Hướng A (Inline Form).
4. `directions/option_b.html` — Mã nguồn Hướng B (Guided Review Flow).
5. `ACCESSIBILITY_CONTRACT.yaml` — Hợp đồng đặc tả trợ năng kỹ thuật số.
6. `DESIGN_TRAINING_009_REPORT.md` — Báo cáo pháp y toàn diện vòng cuối.
7. `ASSISTIVE_TECH_REVIEW_PLAN.md` — Kế hoạch thẩm định công nghệ hỗ trợ (`MANUAL_REVIEW_PENDING`).
8. `package.json` — Cấu hình phụ thuộc và npm script tái chạy.
9. `README.md` — Hướng dẫn tái hiện độc lập đa nền tảng.
10. `verify_module_009.js` — Kịch bản kiểm chứng tự động toàn diện.
11. `VERIFICATION.json` — Sổ cái dữ liệu đo đạc thực nghiệm độc lập.
12. `AX_TREE.json` — Bản snapshot cây trợ năng Chromium CDP (133 nodes).
13. `DESIGN_TRAINING_009_DIRECTIVE.md` — Chỉ thị gốc của Controller Sol.
14. `DESIGN_TRAINING_009_FIRST_RESPONSE_REVIEW_001.md` — Đánh giá phản hồi đầu tiên 001.
15. `DESIGN_TRAINING_009_FIRST_RESPONSE_REVIEW_002.md` — Đánh giá phê duyệt phản hồi đầu tiên 002.
16. `DESIGN_TRAINING_009_REVIEW_001.md` — Đánh giá nghiệm thu Đợt 1.
17. `DESIGN_TRAINING_009_REVIEW_002.md` — Đánh giá nghiệm thu Đợt 2 (Chỉ thị vòng cuối).
18. `screenshots/baseline_desktop_1440x900.png` — Ảnh Baseline Desktop (2880×1800 px).
19. `screenshots/direction_a_desktop_1440x900.png` — Ảnh Hướng A Desktop (2880×1800 px).
20. `screenshots/direction_b_desktop_1440x900.png` — Ảnh Hướng B Desktop (2880×1800 px).
21. `screenshots/final_desktop_1440x900.png` — Ảnh Candidate Desktop ban đầu sạch sẽ (2880×1800 px).
22. `screenshots/final_mobile_390x844.png` — Ảnh Candidate Mobile ban đầu sạch sẽ (780×1688 px).
23. `screenshots/final_mobile_validation_390x844.png` — Ảnh hiển thị Error Summary sau submit rỗng (780×1688 px).
24. `screenshots/final_mobile_network_error_390x844.png` — Ảnh lỗi mạng Attempt 1 và nút "Thử lưu lại" (780×1688 px).
25. `screenshots/final_mobile_success_390x844.png` — Ảnh thành công Attempt 2 và bảng Committed Summary (780×1688 px).
26. `screenshots/final_reflow_320x800.png` — Ảnh reflow ở bề rộng 320 CSS px (640×1600 px).
27. `screenshots/final_text_resize_200_percent.png` — Ảnh mô phỏng phóng to chữ 200% (640×1600 px).
28. `screenshots/final_forced_colors.png` — Ảnh chế độ tương phản cao `forced-colors: active` (2880×1800 px).

---

## 10. KẾT LUẬN & ĐỀ XUẤT PHÁN QUYẾT (VERDICT RECOMMENDATION)

- Toàn bộ 8 Cổng kiểm toán Trợ năng (**A01 — A08**), 12 Kịch bản kiểm thử khóa (**T01 — T12**) và 6 Bài tự kiểm Positive/Negative Controls đều đã được thi công hoàn chỉnh, tự kiểm chứng thành công và ghi nhận đầy đủ bằng chứng thực nghiệm độc lập.
- Bản nộp khắc phục triệt để toàn bộ 5 nhóm điểm nghẽn và thỏa mãn 18 tiêu chí chấp nhận vòng cuối `FINAL_R01–FINAL_R18` từ [DESIGN_TRAINING_009_REVIEW_002.md](DESIGN_TRAINING_009_REVIEW_002.md).
- Kịch bản kiểm chứng độc lập hoàn tất với mã thoát 0 (`exit code 0`).

Antigravity trân trọng đề xuất Controller Sol phê duyệt kết quả tự kiểm của Module 09 (Repair Round 2 Final):

```yaml
PROPOSED_VERDICT: SELF_CHECK_PASS / SUBMITTED_FOR_CONTROLLER_REVIEW
SUBMISSION_REVISION: R03
REPAIR_ROUND_CONSUMED: 2/2_FINAL
REPAIR_ROUND_REMAINING: 0
MODULE_009_STATUS: READY_FOR_FINAL_CONTROLLER_AUDIT
NEXT_MODULE: DESIGN_TRAINING_010_RESPONSIVE_INCLUSIVE_DESIGN
```
