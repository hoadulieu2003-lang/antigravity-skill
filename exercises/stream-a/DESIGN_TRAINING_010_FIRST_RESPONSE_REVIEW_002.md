# DESIGN TRAINING 010 — FIRST RESPONSE REVIEW 002
## Responsive & Inclusive Design · TRIPFLOW Disruption Response Board

```yaml
DOCUMENT_ID: DESIGN_TRAINING_010_FIRST_RESPONSE_REVIEW_002
DIRECTIVE_ID: DESIGN_TRAINING_010
MODULE_ID: DESIGN_TRAINING_010_RESPONSIVE_INCLUSIVE_DESIGN
STREAM_ID: FOUNDATION_INTEGRITY
BRANCH_ID: TAB_A
OWNER: "Anh — Lead Architect / Product Owner"
CONTROLLER: "ChatGPT Architectural Controller (Sol)"
EXECUTOR: "Antigravity"
REVIEW_DATE: 2026-09-14
REVIEWED_SUBMISSION: "Pasted markdown(20260914-173653).md"
REVIEWED_SUBMISSION_SHA256: 77a7f1c9e066a666cf0cdccf46350c0b3352e4849698460d9d0b1304395469d5
FIRST_RESPONSE_R02_VERDICT: APPROVED_WITH_LOCKED_IMPLEMENTATION_CONDITIONS
IMPLEMENTATION_AUTHORIZATION: GRANTED
SELECTED_CANDIDATE_DIRECTION: DIRECTION_A_ADAPTIVE_LEDGER
PLANNING_FINDINGS_STATUS: P01-P07_ACCEPTED_WITH_K01-K06_LOCKED
PLANNING_REPAIR_BUDGET_CONSUMED: 0/2
PRODUCT_REPAIR_BUDGET_AVAILABLE: 2/2
MODULE_009_DEBT_IMPORTED: false
```

---

## 1. Phán quyết

First Response R02 đã giải quyết đủ bản chất của `P01`–`P07`. Anti được phép bắt đầu thi công Module 10.

Controller chọn **Direction A — Adaptive Ledger** cho candidate. Đây là hướng phù hợp hơn với mục tiêu huấn luyện của Module 10 vì buộc hệ thống thay đổi cách nhóm và trình bày dữ liệu giữa desktop và mobile, trong khi vẫn phải bảo toàn nội dung, thứ tự đọc, hành động và ngữ cảnh. Direction B vẫn phải được dựng như phương án đối chiếu đầy đủ, nhưng không dùng làm candidate cuối.

Quyền triển khai đi kèm sáu điều kiện khóa dưới đây. Chúng không yêu cầu thêm một vòng First Response; chúng là acceptance conditions phải được thể hiện trong source, contract, report và verification.

---

## 2. Xác nhận xử lý P01–P07

| Finding | Kết luận Controller |
|---|---|
| `P01` | Chấp nhận: `IR-1002` đã sửa đúng và cơ chế exact string/code-point equality đã được mô tả. |
| `P02` | Chấp nhận có điều kiện `K02`: đã tách hypothesis khỏi telemetry nhưng các số liệu chưa đo phải đổi nhãn khi triển khai. |
| `P03` | Chấp nhận: baseline được phân loại `PRESCRIBED_DEFECT / POTENTIAL_FAILURE` và banner đúng nguyên văn. |
| `P04` | Chấp nhận có điều kiện `K03`: ma trận 5×5 và local inventory đã đủ, cần dùng đúng chuẩn so sánh viewport. |
| `P05` | Chấp nhận: paragraph spacing đã được giới hạn vào paragraph-like content; vertical scrolling được cho phép. |
| `P06` | Chấp nhận có điều kiện `K04`: inventory và dirty fixtures hợp lệ nhưng phải nối vào final conjunction. |
| `P07` | Chấp nhận có điều kiện `K04–K06`: các invariant đã được đưa vào thiết kế verification. |

---

## 3. Sáu điều kiện triển khai khóa cứng

### K01 — Canonical schema chỉ có chín trường khóa

Các thuộc tính `attention_label` và `attention_marker` là presentation metadata được phép bổ sung để đáp ứng color-independent signaling, nhưng không được tính thành trường canonical thứ 10/11 và không được thay đổi `attention_level`.

Harness phải có một fixture độc lập chỉ gồm đúng chín trường khóa:

1. `disruption_id`
2. `attention_level`
3. `tour_code_and_name`
4. `departure_time`
5. `assignee`
6. `passenger_count`
7. `incident_summary`
8. `next_action`
9. `operational_status`

Khi so sánh DOM text, dùng `String(expectedValue)`; không normalize, trim, đổi case hoặc bỏ dấu. Derived labels/markers được kiểm tra ở Gate R05, tách khỏi canonical deep equality Gate R01.

### K02 — Không ghi telemetry trước khi đo

Các con số trong Mục 3 R02 như `48–64px`, `80%–120%`, sáu record nằm trong một viewport hoặc `scrollWidth <= 320px` hiện mới là design target/planned measurement, chưa phải `GEOMETRIC_TELEMETRY_FACT`.

Trong report cuối:

- trước khi harness chạy: ghi `PLANNED_ACCEPTANCE_TARGET`;
- sau khi đo: chỉ ghi `MEASURED_TELEMETRY` với giá trị lấy từ `VERIFICATION.json`;
- không giữ số dự kiến nếu khác số runtime;
- mọi nhận định nhận thức tiếp tục mang nhãn `DESIGN_HYPOTHESIS` hoặc `MANUAL_REVIEW_PENDING`.

### K03 — Chuẩn hóa phép đo reflow và local overflow

Global overflow phải so sánh tối thiểu:

```js
document.documentElement.scrollWidth <= document.documentElement.clientWidth
document.body.scrollWidth <= document.documentElement.clientWidth
```

Không chỉ so với `window.innerWidth`, vì giá trị đó có thể bao gồm vùng scrollbar. Local detector phải đo mọi required region đang render trong từng state, fail nếu selector bắt buộc của state đó vắng mặt. Dung sai subpixel phải được giải thích và không được che overflow có ý nghĩa.

Positive control phải tạo overflow nhìn thấy về mặt layout; không dựa vào `visibility: hidden` nếu runtime của trình duyệt có thể xử lý khác mong đợi. Detector production phải bắt được cả page-level và component-level injection.

### K04 — Final conjunction phải gồm sáu positive controls

R02 mô tả bốn positive controls của Directive và thêm hai dirty fixtures cho clipping/overlap. Vì vậy final conjunction không được chỉ dùng `k = 1..4`; phải gồm tối thiểu sáu kết quả độc lập:

1. overflow detector;
2. missing-selector detector;
3. focus-obscuration detector;
4. ledger-tamper detector;
5. clipping detector;
6. overlap detector.

Mỗi positive control phải gọi chính detector production. Một control `NOT_EXECUTED`, bắt sai fixture hoặc không tạo expected failure phải làm overall self-check fail và exit code 1.

### K05 — Zero Motion phải được kiểm toán cả source lẫn runtime

Quét runtime computed styles trên toàn bộ phần tử chưa đủ để phát hiện inactive rules. Harness phải kết hợp:

- static CSS audit: `transition`, `animation`, `@keyframes`, `scroll-behavior: smooth`;
- runtime computed-style audit trên tất cả rendered states;
- static/runtime audit cho auto-rotating content, timer hoặc `requestAnimationFrame` có tác dụng thay đổi nội dung tự động.

Không cấm mọi timer/`requestAnimationFrame` một cách mù quáng; chỉ fail khi chúng tạo motion hoặc tự thay đổi content trái invariant. Detector phải có một dirty source/runtime fixture chứng minh bắt được vi phạm Zero Motion; fixture này có thể được tính là positive control thứ bảy.

### K06 — Direction A không được tạo hai nguồn nội dung cạnh tranh

Candidate phải dùng một mô hình dữ liệu và một cây record canonical làm nguồn chuẩn. Không render đồng thời một table desktop và một card list mobile rồi chỉ ẩn một bản bằng CSS nếu điều đó tạo nội dung trùng trong accessibility tree hoặc làm lệch context/focus.

Cho phép:

- một semantic list/grid duy nhất đổi layout qua CSS; hoặc
- một cấu trúc table-like duy nhất có label/value programmatically determinable khi chuyển sang mobile.

Nếu dùng native `<table>`, report phải giải thích cách giữ quan hệ header/cell và accessible reading order khi đổi presentation. DOM order phải giữ nguyên, không dùng CSS `order` để tái sắp xếp ý nghĩa.

---

## 4. Phạm vi thi công được cấp quyền

Anti được phép tạo:

- `baseline/index.html` với đúng bảy prescribed defects và banner khóa;
- `directions/option_a.html`;
- `directions/option_b.html`;
- `index.html` theo Direction A;
- `RESPONSIVE_CONTRACT.yaml`;
- `DESIGN_TRAINING_010_REPORT.md`;
- `VERIFICATION.json`;
- `verify_module_010.js`;
- dependency/replay files;
- đúng 14 authoritative screenshots theo Directive;
- gói `design_training_010_submission_r01.zip`.

Không được:

- nhập source, detector hoặc claim chưa được promote từ Module 09;
- đổi canonical fixture/copy;
- dùng network request hoặc backend;
- thêm async saving FSM;
- tự tuyên bố Controller PASS;
- vượt khỏi Light Theme hoặc Zero Motion invariants.

---

## 5. Yêu cầu nộp R01

Submission phải ghi:

```yaml
SUBMISSION_ID: DESIGN_TRAINING_010_SUBMISSION_R01
IMPLEMENTATION_AUTHORIZATION_REF: DESIGN_TRAINING_010_FIRST_RESPONSE_REVIEW_002
SELECTED_CANDIDATE_DIRECTION: DIRECTION_A_ADAPTIVE_LEDGER
SELF_CHECK_STATUS: SELF_CHECK_PASS_OR_FAIL
CONTROLLER_VERDICT: PENDING
REPAIR_BUDGET_CONSUMED: 0/2
MODULE_009_DEBT_IMPORTED: false
```

Report phải có bảng riêng cho:

1. canonical parity;
2. direction comparison và lựa chọn Direction A;
3. baseline observed audit;
4. 25-cell reflow matrix;
5. text scale/text spacing/long-content measurements;
6. native keyboard/context restoration;
7. forced-colors, target and focus-obscuration results;
8. positive-control results;
9. evidence manifest/hash ledger;
10. `Telemetry`, `Visual Review`, `Design Hypothesis`, `Manual Review Pending`.

---

## 6. Trạng thái chính thức

```yaml
FIRST_RESPONSE_R02: APPROVED_WITH_LOCKED_IMPLEMENTATION_CONDITIONS
IMPLEMENTATION_AUTHORIZATION: GRANTED
SELECTED_CANDIDATE_DIRECTION: DIRECTION_A_ADAPTIVE_LEDGER
MODULE_010_STATUS: IMPLEMENTATION_AUTHORIZED
NEXT_ACTION: BUILD_TEST_PACKAGE_AND_SUBMIT_R01
```

