# DESIGN TRAINING 009 — ACCESSIBILITY DIRECTIVE

## Stream A: Foundation Integrity

```yaml
DIRECTIVE_ID: DESIGN_TRAINING_009
MODULE_ID: DESIGN_TRAINING_009_ACCESSIBILITY
MODULE_NAME: ACCESSIBILITY_TASK_COMPLETION
STREAM_ID: FOUNDATION_INTEGRITY
BRANCH_ID: TAB_A
OWNER: Anh — Lead Architect / Product Owner
CONTROLLER: ChatGPT Architectural Controller (Sol)
EXECUTOR: Antigravity
STATUS: ACTIVE
PREREQUISITE:
  module_008: CLOSED_WITH_DEBT
  closure_ref: DESIGN_TRAINING_008_OWNER_WAIVER_CLOSURE_006
MAX_REPAIR_ROUNDS: 2
NEXT_MODULE: DESIGN_TRAINING_010_RESPONSIVE_INCLUSIVE_DESIGN
NEXT_MODULE_STATUS: LOCKED
```

## 1. Mục tiêu

Module 09 yêu cầu Antigravity chứng minh một nhiệm vụ hoàn chỉnh có thể được hiểu và thực hiện khi người dùng:

- chỉ dùng bàn phím;
- sử dụng cây trợ năng của trình duyệt hoặc công nghệ hỗ trợ;
- không nhận biết trạng thái chỉ bằng màu hoặc icon;
- phóng to chữ và thu hẹp viewport;
- sử dụng forced-colors;
- gặp validation error, network error và retry;
- di chuyển focus trong lúc tác vụ bất đồng bộ hoàn tất.

Mục tiêu không phải “thêm ARIA cho nhiều”. Ưu tiên native HTML, DOM order đúng, accessible name rõ, quan hệ lỗi có thể truy xuất và hành trình hoàn thành nhiệm vụ khép kín.

Module chỉ được tuyên bố đáp ứng các Success Criteria được kiểm tra trong phạm vi bài tập; cấm tuyên bố toàn bộ sản phẩm “đạt WCAG 2.2 AA”.

## 2. Bối cảnh sản phẩm

### TRIPFLOW — Bàn tiếp nhận yêu cầu hỗ trợ hành khách

Điều phối viên cần ghi nhận một yêu cầu hỗ trợ chức năng cho chuyến đi, kiểm tra lại nội dung và lưu vào hồ sơ. Không thu thập chẩn đoán y tế; chỉ ghi nhu cầu hỗ trợ thực tế cần bố trí.

```yaml
DATA_CLASSIFICATION: SYNTHETIC_TRAINING_FIXTURE
REAL_CUSTOMER_DATA: false
MEDICAL_DIAGNOSIS_COLLECTION: forbidden
BUSINESS_PERFORMANCE_CLAIMS: none
```

### Nhiệm vụ chính

> Ghi và xác nhận nhu cầu hỗ trợ cho hồ sơ AR-901, phục hồi được sau lỗi mạng, rồi kiểm tra bản đã lưu.

## 3. Canonical fixture và copy khóa

```yaml
case:
  request_id: AR-901
  booking_code: BK-24091
  passenger_display_name: Khách A
  tour_id: TF-802
  tour_name: Tour Fansipan Sapa 2 Ngày 1 Đêm
  departure: 2026-09-15 06:30 ICT
  current_status: Chưa ghi nhận yêu cầu hỗ trợ

support_type_options:
  - value: boarding
    label: Hỗ trợ lên xuống phương tiện
  - value: written_communication
    label: Giao tiếp bằng văn bản
  - value: large_print
    label: Tài liệu chữ lớn
  - value: other
    label: Hỗ trợ khác

form:
  support_type_initial: unselected
  details_initial: empty
  details_max_length: 200
  confirmation_initial: unchecked

mock_save:
  delay_ms: 800
  attempt_1: FAILURE
  attempt_2: SUCCESS
  committed_data_changes_only_after_success: true
```

### Chuỗi giao diện bắt buộc

```yaml
copy:
  page_heading: Ghi nhận yêu cầu hỗ trợ
  submit_idle: Lưu yêu cầu hỗ trợ
  submit_saving: Đang lưu yêu cầu hỗ trợ…
  submit_retry: Thử lưu lại
  edit_saved: Sửa yêu cầu
  open_guidance: Xem hướng dẫn hỗ trợ
  close_guidance: Đóng hướng dẫn
  error_support_type: Chọn hình thức hỗ trợ cần sắp xếp.
  error_confirmation: Xác nhận rằng yêu cầu đã được trao đổi với khách.
  error_details_limit: Chi tiết hỗ trợ không được vượt quá 200 ký tự.
  network_error: Chưa lưu được yêu cầu hỗ trợ. Nội dung đã nhập vẫn được giữ.
  success: Đã lưu yêu cầu hỗ trợ cho hồ sơ AR-901.
```

Không được đổi copy trong bản nộp để làm test dễ hơn.

## 4. Baseline requirements

Tạo `baseline/index.html` là một bản chức năng nhưng có accessibility debt được ghi rõ. Baseline dùng cùng fixture, copy và outcome với Candidate.

Baseline phải thể hiện tối thiểu tám lỗi có chủ đích để Anti audit và sửa:

1. một control dùng `div` click thay cho native button;
2. một field chỉ dùng placeholder, thiếu label bền vững;
3. lỗi chỉ đổi màu, không có text association;
4. visual order và DOM order không khớp;
5. async status không có live-region semantics;
6. action node bị thay thế hoặc native-disabled làm mất focus khi saving;
7. target nhỏ hơn 44×44 CSS px;
8. mất reflow hoặc sinh horizontal overflow ở điều kiện stress đã khóa.

Baseline phải có banner:

> Bản mẫu huấn luyện có lỗi khả năng tiếp cận có chủ đích — không dùng trong sản phẩm thật.

Không được dùng baseline như bản triển khai cuối.

## 5. Hai hướng remediation bắt buộc

Hai hướng phải cùng dữ liệu, copy và hành vi lưu; khác nhau về cấu trúc hỗ trợ nhiệm vụ.

### Direction A — Inline Accessible Form

- Một trang, toàn bộ field hiển thị cùng lúc.
- Dùng `fieldset`/`legend` cho nhóm lựa chọn.
- Error summary ở đầu form và inline error cạnh field.
- Saved summary nằm sau form.
- Ưu tiên ít bước và quan hệ ngữ nghĩa trực tiếp.

### Direction B — Guided Review Flow

- Hai bước có tên rõ: “Chọn hỗ trợ” và “Kiểm tra & lưu”.
- Step indicator phải là text, không phụ thuộc màu/vị trí.
- Back/Next là native button; DOM order khớp order đọc.
- Khi chuyển bước phải có accessible heading và focus rule được giải thích.
- Không được dùng carousel, animation hoặc route giả.

Antigravity phải triển khai `directions/option_a.html` và `directions/option_b.html`, so sánh ít nhất bốn khía cạnh:

- số bước bàn phím;
- khả năng phát hiện và sửa lỗi;
- tải ghi nhớ khi kiểm tra dữ liệu;
- độ ổn định focus.

Chọn một hướng cho `index.html` và ghi hai trade-offs. Không được chọn chỉ vì “trông đẹp hơn”.

## 6. Accessibility contract

Nộp `ACCESSIBILITY_CONTRACT.yaml` tối thiểu gồm:

```yaml
landmarks:
  required: [header, nav, main, footer]
headings:
  single_h1: true
  no_skipped_levels: true
controls:
  native_first: true
  positive_tabindex: forbidden
  target_min_css_px: 44
dialog:
  selector: "#support-guidance-dialog"
  modal: true
  escape_closes: true
  focus_restored_to_trigger: true
form:
  first_invalid_receives_focus: true
  errors_use_aria_describedby: true
  invalid_fields_use_aria_invalid: true
fsm:
  stable_action_selector: "#btn-save-support"
  no_focus_steal: true
  draft_preserved_after_failure: true
status_messages:
  saving: polite
  network_failure: assertive
  success: polite
invariants:
  theme: LIGHT_THEME
  zero_motion: true
  horizontal_overflow: forbidden
```

Contract phải ánh xạ tới selector thật, không chỉ là tài liệu mô tả.

## 7. Gate A01–A08

### A01 — Semantic Structure & Reading Order

PASS khi:

- có landmark hợp lý và đúng một `h1`;
- heading hierarchy không bỏ cấp;
- DOM order khớp trình tự đọc và trình tự thao tác;
- skip link hoạt động bằng bàn phím;
- không dùng ARIA thay thế native semantics khi native element phù hợp;
- bảng tóm tắt dữ liệu dùng cấu trúc có quan hệ đọc rõ ràng.

### A02 — Accessible Name, Description & State

PASS khi:

- mọi control có accessible name duy nhất và phù hợp hành động;
- label hiển thị không biến mất khi nhập;
- hint/error được liên kết bằng ID thật;
- required, expanded, modal, invalid, busy và disabled state phản ánh runtime;
- icon trang trí dùng `aria-hidden="true"`; icon mang nghĩa có text equivalent;
- không có duplicate ID hoặc orphaned ARIA reference.

### A03 — Native Keyboard Journey & Dialog

PASS khi hoàn thành hành trình chỉ với `Tab`, `Shift+Tab`, phím mũi tên, `Space`, `Enter` và `Escape`:

1. kích hoạt skip link;
2. mở hộp thoại hướng dẫn;
3. focus vào nội dung/hành động hợp lý trong dialog;
4. Tab không thoát khỏi modal khi dialog mở;
5. Escape đóng dialog;
6. focus trở lại đúng trigger;
7. điền và gửi form;
8. không có bước nào rơi focus ngoài ý muốn về `body`.

Không dùng `page.focus()`, DOM `.focus()` hoặc `.click()` để thay thế input native trong test journey. Application code chỉ được dùng programmatic focus khi có lý do accessibility đã được contract hóa, ví dụ focus first invalid hoặc đưa focus vào modal; phải phân biệt với harness.

### A04 — Validation, Error Association & Recovery

PASS khi:

- submit thiếu dữ liệu không tăng attempt counter;
- error summary liệt kê lỗi và link/focus đến field tương ứng;
- field sai có `aria-invalid="true"` và error description được liên kết;
- focus đi tới lỗi đầu tiên theo DOM order;
- nhập 201 ký tự bị chặn khi submit; sửa về 200 xóa trạng thái lỗi;
- draft giữ nguyên sau network failure;
- retry không bắt nhập lại;
- committed summary chỉ đổi sau success.

### A05 — Status Announcement, Stable Action & No-Steal

PASS khi:

- live-region container tồn tại từ initial DOM;
- saving và success dùng status announcement phù hợp; network failure được thông báo đủ rõ;
- một action button node ổn định xuyên suốt idle/saving/failure/retry/success;
- duplicate activation trong saving không tạo request thứ hai;
- focus không rơi về body;
- nếu người dùng di chuyển focus trong lúc saving, success không cướp focus;
- nếu người dùng vẫn ở action button, trạng thái mới có thể được nhận biết mà không cần nhảy focus tùy tiện.

### A06 — Resize, Reflow & Text Spacing

PASS khi:

- 1440×900, 768×1024, 390×844 và 320×800 không mất chức năng;
- ở 320 CSS px không có horizontal page scrolling cho nội dung chính;
- mô phỏng text resize 200% vẫn đọc, nhập, sửa lỗi và submit được;
- áp dụng text-spacing stress vẫn không clip text hoặc che control;
- zoom/reflow không làm thay đổi DOM reading order;
- không dùng `overflow-x: hidden` để che lỗi.

### A07 — Target, Contrast, Forced Colors & Sensory Independence

PASS khi:

- project target tối thiểu 44×44 CSS px cho control chính; ngoại lệ phải được liệt kê và chứng minh;
- focus indicator nhìn thấy trong default theme và forced-colors;
- Candidate không làm giảm các contrast pairs đã khóa từ Module 08;
- forced-colors không làm mất border, selected state, invalid state hoặc focus;
- `prefers-reduced-motion: reduce` không phát hiện animation/transition;
- state/error/success luôn có text; không phụ thuộc riêng vào màu, icon hoặc vị trí.

Lưu ý: 44×44 là project invariant nghiêm hơn ngưỡng Target Size Minimum 24×24 CSS px của WCAG 2.2 AA; không được mô tả 44×44 là nguyên văn ngưỡng WCAG.

### A08 — Evidence Integrity & Bounded Claims

PASS khi:

- `VERIFICATION.json` được sinh từ lần chạy cuối;
- cung cấp accessibility tree snapshot từ Chromium/CDP;
- automated audit được mô tả là evidence bổ trợ, không thay thế assistive-technology user testing;
- report tách `TELEMETRY`, `MANUAL_REVIEW`, `DESIGN_HYPOTHESIS`;
- source, screenshot, contract và report hashes đồng bộ;
- không có hardcoded PASS booleans hoặc fallback values làm test giả đạt;
- report chỉ dùng `SELF_CHECK_PASS / SUBMITTED_FOR_CONTROLLER_REVIEW` trước phán quyết Controller.

## 8. Bộ test khóa T01–T12

| Test | Kịch bản khóa | Kết quả bắt buộc |
|---|---|---|
| T01 | Structure scan | Landmarks/headings/DOM order/skip link đạt A01 |
| T02 | Accessible-name and ARIA reference graph | 0 unnamed controls, duplicate IDs, orphaned refs |
| T03 | Native dialog journey | Open, contained Tab, Escape close, focus restoration |
| T04 | Submit form rỗng bằng Enter | Error summary xuất hiện; focus lỗi đầu; attempts=0 |
| T05 | 201 ký tự rồi sửa 200 | Lỗi đúng copy; sửa được; attempts vẫn 0 trước submit hợp lệ |
| T06 | Valid submit attempt 1 | Saving 800ms → failure; draft giữ; attempts=1; commits=0 |
| T07 | Retry attempt 2 | Success; committed summary đúng; attempts=2; commits=1 |
| T08 | Duplicate activation during saving | Pointer + Enter không làm attempts vượt 1 |
| T09 | No-steal | Chuyển focus tự nhiên khi saving; success giữ focus hiện tại |
| T10 | Responsive/reflow/text stress | 1440/768/390/320, text 200%, text spacing: không mất chức năng/tràn |
| T11 | Forced-colors/reduced-motion/targets/contrast | Đạt A07 và có computed evidence |
| T12 | AX tree and evidence integrity | Role/name/state đúng; hashes đồng bộ; claim có giới hạn |

Mỗi test phải có precondition, interaction method, expected result, actual result và boolean được suy ra từ assertions. Không dùng số đếm đơn thuần thay thế thẩm định chất lượng.

## 9. Nghiên cứu bắt buộc

Report phải dùng tối thiểu ba nguyên tắc từ nguồn chính thức, ghi rõ:

- tiêu chí hoặc pattern;
- điều nguồn thực sự nói;
- cách áp dụng vào bài;
- giới hạn/ngoại lệ;
- bằng chứng thực thi.

Nguồn ưu tiên:

- [WCAG 2.2 — W3C Recommendation](https://www.w3.org/TR/WCAG22/)
- [Understanding SC 2.4.7 Focus Visible](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html)
- [Understanding SC 3.3.1 Error Identification](https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html)
- [Understanding SC 3.3.3 Error Suggestion](https://www.w3.org/WAI/WCAG22/Understanding/error-suggestion.html)
- [Understanding SC 4.1.3 Status Messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html)
- [Understanding SC 1.4.10 Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)
- [Understanding SC 2.5.8 Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
- [WAI-ARIA Authoring Practices — Dialog Modal Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)

Không dùng nguồn blog làm normative authority khi W3C đã có nguồn trực tiếp.

## 10. Bằng chứng hình ảnh tối thiểu

```text
screenshots/
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

Ảnh phải ghi viewport, DPR, state và source hash trong `VERIFICATION.json`. Forced-colors screenshot phải ghi rõ phương thức emulation và giới hạn của emulation.

## 11. Gói nộp

```text
design_training_009_submission_r01.zip
├── baseline/
│   └── index.html
├── directions/
│   ├── option_a.html
│   └── option_b.html
├── index.html
├── ACCESSIBILITY_CONTRACT.yaml
├── DESIGN_TRAINING_009_DIRECTIVE.md
├── DESIGN_TRAINING_009_REPORT.md
├── MANUAL_ACCESSIBILITY_REVIEW.md
├── AX_TREE.json
├── VERIFICATION.json
├── verify_module_009.js
└── screenshots/
```

Yêu cầu đóng gói:

- pure forward slashes;
- không đường dẫn tác giả tuyệt đối;
- script resolve từ `__dirname`;
- dependency và lệnh chạy được ghi rõ;
- ZIP có SHA-256 và entry manifest;
- user input chỉ render bằng `textContent`/DOM API an toàn;
- không đưa `node_modules`, helper đóng gói hoặc file tạm vào ZIP.

## 12. Quy chuẩn báo cáo

`DESIGN_TRAINING_009_REPORT.md` bắt buộc có:

1. canonical fixture và privacy boundary;
2. baseline audit đủ tám defects;
3. ba nguyên tắc có nguồn và phạm vi;
4. hai remediation directions và trade-offs;
5. hướng được chọn;
6. requirement → selector → test → evidence matrix;
7. kết quả T01–T12;
8. telemetry / manual review / hypothesis tách biệt;
9. limitations: AX tree không đồng nghĩa user testing;
10. self-critique theo `STRENGTH`, `DEFECT`, `TRADEOFF`, `PREFERENCE`;
11. trạng thái tối đa `SELF_CHECK_PASS / SUBMITTED_FOR_CONTROLLER_REVIEW`.

## 13. Required first response

Anti chưa thi công source trước khi Controller duyệt first response. Phản hồi đầu tiên phải gồm:

```yaml
REQUIRED_FIRST_RESPONSE:
  - RESEARCH_PLAN
  - BASELINE_AUDIT_PLAN
  - TWO_ACCESSIBILITY_DIRECTIONS
  - CANONICAL_TASK_AND_FSM_MODEL
  - TEST_MATRIX_DRAFT_T01_T12
```

Anti phải chỉ ra trước:

- accessible name của từng control;
- focus order dự kiến;
- dialog focus lifecycle;
- error association graph;
- live-region strategy;
- 200% resize và forced-colors test method;
- phần nào tự động kiểm tra được và phần nào cần manual review.

## 14. Lệnh bắt đầu

```yaml
ANTI_DIRECTIVE:
  action: START_RESEARCH_AND_FIRST_RESPONSE_ONLY
  task: DESIGN_TRAINING_009_ACCESSIBILITY
  implementation_status: BLOCKED_PENDING_CONTROLLER_FIRST_RESPONSE_REVIEW
  max_repair_rounds: 2
  next_module_locked: DESIGN_TRAINING_010_RESPONSIVE_INCLUSIVE_DESIGN
```

