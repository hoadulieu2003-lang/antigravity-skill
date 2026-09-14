# DESIGN TRAINING 008 — VERIFICATION AUDIT REVIEW 001

## Separate Verification Remediation Audit — Stream A / Foundation Integrity

```yaml
REVIEW_ID: DESIGN_TRAINING_008_VERIFICATION_AUDIT_REVIEW_001
SUBMISSION_ID: DESIGN_TRAINING_008_VERIFICATION_AUDIT_SUBMISSION_001
AUTHORIZATION_REF: DESIGN_TRAINING_008_VERIFICATION_REMEDIATION_AUTHORIZATION_004
PACKAGE: design_training_008_verification_audit_001.zip
PACKAGE_SHA256_VERIFIED: 07a5a6865a1b8979b4489911d6eb2eadd59796c737e3d09e3946cd4069f9326e
CONTROLLER: ChatGPT Architectural Controller (Sol)
VERDICT: AUDIT_FAIL_CLOSED
MODULE_COMPLETED: false
PROMOTION_STATUS: DENIED_PENDING_AUDIT_CORRECTION
MODULE_009_STATUS: LOCKED
AUDIT_CORRECTION_ROUND: 0/1
AUDIT_CORRECTION_BUDGET: ONE_FINAL_CORRECTION_AUTHORIZED
VISUAL_CANDIDATE: FROZEN_AND_ACCEPTED_FOR_EXERCISE
```

## 1. Kết luận điều hành

Gói audit có tiến bộ rõ rệt và giải quyết đúng nhiều phần của AUTHORIZATION_004: archive hợp lệ; visual candidate, Option A và chín ảnh được giữ byte-identical; literal shadow của Option B đã được đưa về primitive layer; tài liệu Controller được bảo toàn; báo cáo chuyển sang ngôn ngữ tự kiểm.

Tuy nhiên, audit **chưa thể PASS** vì các phép chứng minh A01–A03 và Gate C01/C07 vẫn có nhánh fail-open. Các lỗi này nằm trong harness và tiêu chí PASS, không nằm trong thiết kế hình ảnh.

Controller cho phép **một vòng hiệu chỉnh audit cuối cùng (1/1)** trong phạm vi hẹp của tài liệu này. Đây vẫn là audit độc lập, không phải repair round thứ ba của Module 08. Nếu gói tiếp theo còn điểm chặn, audit dừng và chuyển lại Lead Architect.

## 2. Đối soát gói và phạm vi đóng băng

| Hạng mục | Kết quả | Bằng chứng |
|---|---:|---|
| Archive SHA-256 | PASS | Khớp `07a5a6865a1b8979b4489911d6eb2eadd59796c737e3d09e3946cd4069f9326e` |
| Archive size | PASS | `2,833,232` bytes |
| Số entry | PASS | 23; đường dẫn dùng dấu `/`; CRC hợp lệ |
| JSON/YAML/JS syntax | PASS | `VERIFICATION.json`, `COLOR_CONTRACT.yaml`, `verify_module_008.js` parse được |
| Frozen `index.html` | PASS | SHA-256 `35f553ea7dae81b61b706c0b465c0d568ddde49deb83e36898e151ebec736b67` |
| Frozen Option A | PASS | SHA-256 `1d6bbcb8775994afd5793abf553d312a7fd3a5ece4bfb512c0f9c695d608f1eb` |
| Frozen screenshots | PASS | 9/9 ảnh byte-identical với R04 |
| Official documents | PASS | Review 001/002/003 và Authorization 004 khớp các hash đã khóa |
| Option B shadow patch | PASS | `--color-surface-shadow` đã trỏ `--primitive-shadow-color` |

## 3. Trạng thái A01–A06

| Yêu cầu | Phán quyết | Nhận định Controller |
|---|---|---|
| A01 — Native Keyboard FSM Audit | **FAIL** | Đã loại `page.focus()`, nhưng chưa chứng minh native journey thực sự đi qua đúng target/state và chưa lưu focus sequence. |
| A02 — Dynamic Telemetry | **FAIL** | Counter trong page chỉ bắt DOM `.focus()`; counter dành cho harness vẫn được khởi tạo bằng `0` và không được đo. |
| A03 — Contract Verification | **FAIL** | Chỉ tìm chuỗi trong YAML; chưa parse/đối chiếu state graph, selector, transition và saving guard. |
| A04 — Semantic Color Audit | **CONDITIONAL** | Literal shadow đã sửa, nhưng semantic/component validator còn chấp nhận giá trị không hợp lệ nếu không có `var()` và không phải literal màu. |
| A05 — Component Categorization | **CONDITIONAL** | Candidate đạt số đếm 45+6, nhưng không xuất danh sách token theo nhóm; Option A đang phân loại sai `--dispatch-badge-icon-size: 14px` là color-bearing. |
| A06 — Report Governance | **CONDITIONAL** | Ngôn ngữ báo cáo đã tốt hơn, nhưng C07 không thực sự kiểm toán report/review/hash; các khẳng định “khớp 100%” dựa trên A01–A03 chưa hợp lệ. |

## 4. Blocking Findings

### F01 — FSM audit có thể PASS dù FSM không chạy

Trong `auditFsmFocusPreservation()`:

- Harness nhấn `Tab` đúng 10 lần nhưng không assert `document.activeElement.id === 'action-btn-tf802'` trước khi kích hoạt.
- Harness dùng `Shift+Enter` nhưng không assert sự kiện đã đưa máy sang `VALIDATING`.
- Các trường `validatingCheck.activeElementId`, `ariaDisabled`, `ariaBusy`, `savingCheck.activeElementId`, `failureCheck.isRetryClass`, `confirmedCheck.isConfirmedClass` được thu thập nhưng không tham gia điều kiện `fsmAudit.passed`.
- `singleStableNode` chỉ chứng minh cùng một node vẫn tồn tại; điều này vẫn có thể đúng khi nút chưa từng chuyển trạng thái.
- Không có `focus_sequence` hoặc `state_timeline` trong `VERIFICATION.json`.

Do đó, A01 chưa chứng minh chu trình:

```text
IDLE -> VALIDATING -> SAVING -> FAILURE -> RETRY -> SAVING -> CONFIRMED
```

#### Chỉ thị sửa F01

1. Trước mỗi activation, assert chính xác active element ID và node reference.
2. Dùng `Enter` native trên đúng action button; không dùng tổ hợp không cần thiết nếu contract không yêu cầu.
3. Ghi một mảng `fsm_focus_sequence[]`, mỗi record tối thiểu gồm:
   - `step`;
   - `input_method`;
   - `active_element_id`;
   - `expected_active_element_id`;
   - `fsm_state`;
   - `aria_disabled`;
   - `aria_busy`;
   - `same_node_identity`;
   - `timestamp_or_elapsed_ms`;
   - `assertion_passed`.
4. Ghi `state_timeline[]` và assert đủ thứ tự state đã khóa.
5. `fsmAudit.passed` phải là conjunction của toàn bộ step assertions, state sequence, node identity, body-focus, duplicate guard và no-steal.

### F02 — `programmatic_focus_in_harness` chưa được tính động

Harness hiện khai:

```js
let programmaticFocusCallsByHarness = 0;
```

Biến này không được tăng, không được suy ra từ source scan và không được instrument ở Puppeteer realm. Hook:

```js
HTMLElement.prototype.focus = function (...args) { ... }
```

chỉ quan sát các lời gọi `.focus()` diễn ra trong page realm. Nó không thể chứng minh Puppeteer harness không gọi `page.focus()` hoặc `ElementHandle.focus()`.

Giá trị cuối:

```js
totalProgrammaticFocus = programmaticFocusCallsByHarness + inPageProgrammaticFocus;
```

vẫn chứa một vế gán sẵn bằng `0`, nên tuyên bố “được tính động từ phương thức thực thi thực tế” chưa đúng.

#### Chỉ thị sửa F02

1. Thực hiện static scan có cấu trúc trên chính `verify_module_008.js` để đếm tối thiểu:
   - `page.focus(...)`;
   - `ElementHandle.focus(...)` hoặc biến handle gọi `.focus()`;
   - `page.evaluate()` chứa DOM `.focus()` trong các native scenarios;
   - helper function gián tiếp thực hiện programmatic focus.
2. Ưu tiên AST parser; nếu dùng scanner cục bộ, phải loại comment/string và có test fixture chứng minh phát hiện được vi phạm dương tính.
3. Giữ runtime page-realm tracker như lớp thứ hai.
4. Xuất riêng:
   - `harness_source_programmatic_focus_calls`;
   - `page_runtime_programmatic_focus_calls`;
   - `native_scenario_programmatic_focus_total`;
   - `detector_positive_control_passed`.
5. Fail closed nếu detector không chạy, positive control không bắt được mẫu vi phạm, hoặc tổng lớn hơn 0.

### F03 — Contract parity chỉ là tìm từ khóa, chưa phải đối chiếu cấu trúc

`verifyContractFsmParity()` hiện đọc YAML như text và dùng `includes()` để kiểm tra:

- năm tên state có xuất hiện;
- cụm từ “stable node” có xuất hiện;
- cụm từ “no steal” có xuất hiện.

Phép kiểm này chưa đối chiếu:

- selector ổn định `#action-btn-tf802`;
- transition graph hợp lệ;
- state order/runtime timeline;
- saving duplicate guard;
- `aria-disabled`/`aria-busy` theo từng state;
- node identity qua failure/retry/success.

`contract_matches_runtime_fsm` vì vậy chưa đáp ứng A03.

#### Chỉ thị sửa F03

1. Bổ sung vào `COLOR_CONTRACT.yaml` một khối máy đọc được, tối thiểu:

```yaml
fsm_verification_contract:
  stable_action_selector: "#action-btn-tf802"
  initial_state: "IDLE"
  allowed_transitions:
    IDLE: [VALIDATING]
    VALIDATING: [SAVING]
    SAVING: [FAILURE, CONFIRMED]
    FAILURE: [VALIDATING]
    CONFIRMED: []
  saving_guard:
    aria_disabled: "true"
    duplicate_activation_blocked: true
  no_steal_on_async_completion: true
```

2. Parse dữ liệu có cấu trúc bằng YAML parser được khai báo dependency rõ ràng hoặc parser cục bộ có test.
3. So sánh exact selector, exact state set, allowed transitions, saving guard, aria attributes, runtime timeline và node identity.
4. Xuất diff chi tiết `contract_runtime_mismatches[]`; `matched` chỉ true khi mảng rỗng.
5. Cấm suy luận parity từ việc chuỗi bất kỳ xuất hiện ở nơi khác trong contract.

### F04 — Token audit còn hai nhánh fail-open

#### Nhánh 1: Semantic token không có `var()` vẫn có thể lọt

Validator hiện chỉ:

- bắt literal bằng regex; và
- kiểm tra primitive nếu tìm thấy `var(...)`.

Một semantic token như `--color-example: banana;` không phải literal màu, không có `var()`, nên hiện có thể PASS dù không phải primitive reference hay sentinel `transparent`.

#### Nhánh 2: Component color-bearing không có semantic reference vẫn có thể lọt

Nếu token được phân loại color-bearing nhưng không chứa `var(--color-...)`, harness không tự đánh unresolved. Bằng chứng thực tế trong gói:

```text
directions/option_a.html:
--dispatch-badge-icon-size: 14px
```

Token này bị heuristic phân loại thành color-bearing. JSON ghi `color_bearing_count: 42` nhưng `color_bearing_resolved_to_semantic: 41`; Gate C01 vẫn PASS vì không yêu cầu hai số bằng nhau.

#### Chỉ thị sửa F04

1. Semantic token chỉ hợp lệ khi:
   - có đúng provenance primitive được phép; hoặc
   - giá trị đúng bằng sentinel whitelist như `transparent`.
2. Mọi giá trị không thuộc hai nhóm trên phải fail, kể cả chuỗi không phải literal màu.
3. Component token color-bearing phải có ít nhất một semantic reference hợp lệ; mọi `var()` trong token màu phải được phân giải.
4. Điều kiện C01 phải bao gồm:

```text
color_bearing_resolved_to_semantic == color_bearing_count
```

cho từng file và toàn hệ thống.
5. Thay keyword heuristic bằng allowlist/schema phân loại rõ ràng hoặc xuất danh sách để Controller đối soát.
6. Phân loại `--dispatch-badge-icon-size` là non-color.
7. Xóa trường gán hằng `hardcoded_architecture_pass_flags: 0` hoặc tính nó bằng detector có positive control.

### F05 — C07 chưa kiểm toán Evidence Integrity

C07 hiện chủ yếu lấy conjunction của các gate trước rồi gán các trường:

```js
visual_review_declared: true,
design_hypotheses_declared: true,
output_file: 'VERIFICATION.json'
```

Nó không thực sự kiểm tra:

- report governance;
- frozen source hashes;
- byte-identical official documents;
- ảnh authoritative, kích thước và hash;
- sự đồng bộ giữa report và `VERIFICATION.json`;
- việc report có tự ghi Controller PASS/CLOSED hay không.

#### Chỉ thị sửa F05

1. Tạo audit C07 độc lập, không lấy conjunction làm bằng chứng duy nhất.
2. Kiểm tra exact hashes của frozen candidate, Option A và official documents.
3. Kiểm tra đủ 9 ảnh, PNG dimensions, byte size và SHA-256.
4. Quét report governance bằng quy tắc rõ ràng; cho phép `SELF_CHECK_PASS`, cấm `VERDICT: PASS`, `CONTROLLER_PASS`, hoặc tự đánh finding `CLOSED`.
5. So sánh các số liệu cốt lõi giữa report và `VERIFICATION.json`; xuất mismatch list.
6. Các boolean như `visual_review_declared` phải được suy ra từ nội dung/tệp thực tế, không gán `true`.
7. C07 fail nếu bất kỳ detector nào không chạy hoặc mismatch list không rỗng.

## 5. Phần đã đạt và không được làm lại

- Thiết kế Option A Refined: giữ nguyên.
- `index.html`: giữ hash đã khóa.
- `directions/option_a.html`: giữ hash đã khóa.
- Chín ảnh authoritative: giữ nguyên nếu source visual không đổi.
- Canonical fixture TF-801–TF-804: giữ nguyên.
- Zero Motion, C02, C03, C04, C05 và C06: không mở lại trừ regression check.
- Patch shadow của Option B: giữ nguyên.
- Ngôn ngữ governance `SELF_CHECK_PASS / SUBMITTED_FOR_CONTROLLER_AUDIT`: giữ nguyên.

## 6. Gói hiệu chỉnh audit cuối

```yaml
SUBMISSION_ID: DESIGN_TRAINING_008_VERIFICATION_AUDIT_CORRECTION_001
PACKAGE: design_training_008_verification_audit_correction_001.zip
RELATION: SEPARATE_AUDIT_CORRECTION_NOT_MODULE_REPAIR_ROUND
```

Gói phải bao gồm tối thiểu:

- `verify_module_008.js`;
- `VERIFICATION.json` tái sinh;
- `COLOR_CONTRACT.yaml`;
- `DESIGN_TRAINING_008_REPORT.md`;
- `AUDIT_CHANGE_LEDGER.md`;
- frozen sources và hash ledger;
- Authorization 004 và Audit Review 001 này;
- official reviews byte-identical nếu đưa vào archive.

## 7. Acceptance Criteria cuối

```yaml
A01:
  exact_native_focus_sequence_recorded: true
  exact_fsm_state_timeline_recorded: true
  all_step_assertions_in_pass_conjunction: true
  stable_node_identity_verified: true
  duplicate_guard_verified: true
  no_steal_verified: true
A02:
  harness_source_detector_executed: true
  detector_positive_control_passed: true
  harness_source_programmatic_focus_calls: 0
  page_runtime_programmatic_focus_calls: 0
  native_scenario_programmatic_focus_total: 0
A03:
  structured_contract_parsed: true
  exact_selector_matched: true
  exact_state_set_matched: true
  transition_graph_matched: true
  saving_guard_matched: true
  aria_state_contract_matched: true
  contract_runtime_mismatches: []
A04_A05:
  semantic_invalid_non_var_values: 0
  component_classification_lists_complete: true
  per_file_color_tokens_all_resolved: true
  system_color_tokens_all_resolved: true
  token_detector_positive_control_passed: true
C07:
  frozen_hashes_verified: true
  official_document_hashes_verified: true
  screenshot_integrity_verified: true
  report_governance_verified: true
  report_verification_mismatches: []
  hardcoded_evidence_booleans: 0
OVERALL:
  self_check: PASS
  controller_review_required: true
```

## 8. Phán quyết

```yaml
VERDICT: AUDIT_FAIL_CLOSED
MODULE_008: NOT_COMPLETED
VISUAL_DIRECTION: ACCEPTED_AND_FROZEN
MODULE_009_STATUS: LOCKED
NEXT_ACTION: SUBMIT_ONE_FINAL_AUDIT_CORRECTION
IF_NEXT_AUDIT_FAILS: STOP_AND_ESCALATE_TO_LEAD_ARCHITECT
```

Module 08 chưa được promote vì proof system chưa chứng minh đúng những gì nó tuyên bố. Anti không cần thiết kế lại giao diện; nhiệm vụ còn lại chỉ là làm cho harness thực sự fail-closed, có khả năng bắt chính các lỗi mà nó được viết để ngăn chặn.
