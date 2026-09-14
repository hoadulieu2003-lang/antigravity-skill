# DESIGN TRAINING 009 — REVIEW 002
## Thẩm định Repair 001 · Accessibility Task Completion

```yaml
REVIEW_ID: DESIGN_TRAINING_009_REVIEW_002
MODULE_ID: DESIGN_TRAINING_009_ACCESSIBILITY
STREAM_ID: FOUNDATION_INTEGRITY
BRANCH_ID: TAB_A
SUBMISSION_ID: DESIGN_TRAINING_009_REPAIR_001
PACKAGE_REVIEWED: design_training_009_submission_r02.zip
DECLARED_SHA256: b6053a204837883148715fbefde4c65f9b6c0c51bacdbe2878fd4a4c2a467429
OBSERVED_SHA256: b6053a204837883148715fbefde4c65f9b6c0c51bacdbe2878fd4a4c2a467429
DECLARED_PACKAGE_BYTES: 1875022
OBSERVED_PACKAGE_BYTES: 1875022
DECLARED_PACKAGE_ENTRIES: 26
OBSERVED_PACKAGE_ENTRIES: 27
CONTROLLER: "ChatGPT Architectural Controller (Sol)"
OWNER: "Anh — Lead Architect / Product Owner"
EXECUTOR: "Antigravity"
VERDICT: FINAL_REPAIR_REQUIRED
MODULE_COMPLETED: false
REPAIR_ROUND_REVIEWED: 1/2
NEXT_REPAIR_ROUND: 2/2_FINAL
REPAIR_BUDGET_REMAINING_AFTER_NEXT_SUBMISSION: 0
VISUAL_DIRECTION: DIRECTION_A_ACCEPTED_AND_FROZEN
NEXT_SUBMISSION: DESIGN_TRAINING_009_REPAIR_002
```

---

## 1. Kết luận điều hành

Repair 001 đã sửa đúng phần lớn lỗi thực thi nhìn thấy trong Submission R01. SHA-256 và dung lượng archive khớp bản khai; bốn văn bản Controller hiện byte-identical; trạng thái mở mới không còn hiển thị lỗi; dialog đã được kiểm tra bằng Tab/Enter/Escape; `overflow-x: hidden` đã được gỡ; forced-colors đã tham gia conjunction; tài liệu kiểm tra công nghệ hỗ trợ đã được hạ đúng về `MANUAL_REVIEW_PENDING`; footer và hướng dẫn tái chạy đã được chỉnh.

Thẩm định ảnh cho thấy Direction A sáng, rõ, có thứ bậc tốt. Các ảnh initial, validation, network error, success, 320px, text-scale và forced-colors không cho thấy lỗi thị giác chặn nghiệm thu. **Direction A được chấp nhận và phải đóng băng trong vòng cuối.**

Module chưa thể PASS vì năm điểm chặn còn lại đều nằm ở lớp kiểm chứng. Các phép đo hiện tại chưa đáp ứng chính tiêu chí fail-closed đã khóa trong Review 001: chưa có positive/negative controls; T09 chưa chứng minh một chu trình node/focus khép kín đến retry-success; T10 chưa kiểm toán local scroller và clipping theo inventory đầy đủ; T11 vẫn dùng cặp màu focus hard-coded; T12 chỉ đếm ảnh thay vì kiểm toán toàn vẹn bằng chứng. Ngoài ra archive thực tế có 27 entry, không phải 26 như bản khai.

Đây là vòng sửa cuối 2/2. Không thiết kế lại giao diện, không đổi fixture, không đổi locked copy và không mở rộng phạm vi Module 09.

---

## 2. Phạm vi thẩm định độc lập

Controller đã:

- tính lại SHA-256, dung lượng và danh sách entry của archive;
- kiểm tra path traversal, entry trùng và dấu phân cách đường dẫn;
- giải nén, đọc candidate, baseline, hai direction, contract, report, kế hoạch assistive-tech, AX tree, verification, README, package manifest và harness;
- chạy kiểm tra cú pháp JavaScript và tính hợp lệ JSON;
- tính lại hash của source và toàn bộ screenshots, đọc kích thước PNG;
- đối chiếu byte của bốn văn bản Controller;
- xem trực quan tám trạng thái đại diện, gồm initial, validation, network error, success, 320px, text-scale và forced-colors;
- kiểm tra logic conjunction và exit behavior trực tiếp từ source harness.

Controller chưa tái chạy phiên Chromium/CDP của Antigravity trong môi trường hiện tại. Vì vậy số đo runtime trong `VERIFICATION.json` được xem là telemetry tự kiểm; các finding dưới đây được chứng minh từ source, artifact và quan hệ giữa harness với claim, không dựa trên việc tin vào kết luận tự khai.

---

## 3. Ma trận gate của Controller

| Gate | Phán quyết | Nhận định |
|---|---|---|
| A01 — Semantic Structure | PASS_WITH_SCOPE | Landmarks, một H1, heading order và skip link đã có bằng chứng phù hợp. |
| A02 — Accessible Name/ARIA | PASS_WITH_SCOPE | Không phát hiện duplicate ID hoặc orphan reference; accessible-name scanner vẫn là phép suy luận DOM, không thay cho thẩm định screen reader. |
| A03 — Keyboard/Dialog | PASS | T03 dùng Tab/Enter/Escape bản địa, trap tham gia điều kiện PASS và focus trở về trigger. |
| A04 — Validation/FSM | PASS_WITH_SCOPE | Initial state, validation, giới hạn 200 ký tự, failure/retry và ba lớp dữ liệu đã được thể hiện; bằng chứng focus/node toàn chu trình được xử lý tại R01. |
| A05 — Announcement/No-Steal | FAIL | T09 chỉ chạy đến failure; chưa chứng minh cùng node qua retry và success trong một journey duy nhất, cũng chưa có static scenario scan. |
| A06 — Reflow/Text Scale | FAIL | Ma trận viewport đúng hơn nhưng detector clipping/overlap chưa đầy đủ và chưa kiểm tra local scroller/fail-closed inventory. |
| A07 — Forced Colors/Targets/Contrast | FAIL | Forced-colors đã vào conjunction, nhưng focus contrast còn hard-coded và target/contrast inventory chưa bao phủ đầy đủ trạng thái render. |
| A08 — Evidence Integrity | FAIL | Hash Controller docs đã đạt; screenshot/source/AX/report ledger chưa được audit động đầy đủ. Entry count đang lệch 26 so với 27. |

---

## 4. Blocking findings cho vòng sửa cuối

### R01 — Chu trình focus và node identity chưa khép kín đến success

**Bằng chứng**

- T09 lưu tham chiếu `window.__initialSaveBtn`, chạy lần submit đầu và dừng sau trạng thái failure.
- `nodeIdentityPreserved` chỉ so sánh node trước saving với node sau failure.
- Retry/success nằm ở T07 riêng biệt; T07 không ghi strict node reference, focus sequence hoặc body-focus events.
- Review 001 yêu cầu strict node identity xuyên suốt `idle → saving → failure → retry → success` và static scan giới hạn cho các scenario gắn nhãn native.

**Yêu cầu sửa**

1. Tạo một journey duy nhất từ clean state, hoàn thành đủ: idle, valid submit, first saving, failure, retry activation, retry saving và success.
2. Lưu một node reference ban đầu và assert bằng phép `===` tại mọi mốc; đồng thời assert `isConnected === true`.
3. Ghi `focus_sequence[]`, `fsm_state_timeline[]`, `body_focus_events` và vị trí focus trước/sau từng async completion.
4. Trong retry saving, dùng Tab/Shift+Tab bản địa chuyển focus tới `#btn-open-guidance`; success phải không cướp focus.
5. Static scanner phải giới hạn đúng thân các native scenarios và fail khi có `page.focus()`, `HTMLElement.focus()` hoặc DOM `.click()` dùng để giả lập input. Các lời gọi focus hợp lệ trong application không được tính nhầm.

### R02 — Detector reflow/clipping/overlap chưa đáp ứng R09

**Bằng chứng**

- T10 chỉ ghi `scrollW` và `clientW` cấp document; không ghi body hoặc các vùng trọng yếu.
- Không có kiểm toán `scrollWidth > clientWidth` cho form, fieldset, dialog, error summary, committed summary và các control chính; do đó chưa chứng minh `local_horizontal_scrollers: 0`.
- Inventory text chỉ gồm `label, h1, h2, legend, button, p, a.skip-link`; bỏ qua error text, hint/counter, case values, footer và nội dung dialog theo trạng thái.
- Clipping chỉ so cạnh phải của bounding rect với viewport; chưa kiểm tra cạnh trái, overflow nội bộ (`scrollWidth/scrollHeight`), cắt nội dung hoặc selector thiếu.
- Không có positive control fixture cố ý tạo overflow/clipping để chứng minh detector có thể làm gate FAIL.

**Yêu cầu sửa**

1. Khóa danh sách selector/region bắt buộc và fail nếu bất kỳ selector nào vắng mặt ở trạng thái cần đo.
2. Đo đồng thời documentElement, body và các vùng trọng yếu; ghi rõ global overflow và local horizontal scrollers.
3. Với text/control, kiểm tra rect dương, bốn cạnh trong vùng chứa, `scrollWidth <= clientWidth`, `scrollHeight <= clientHeight` khi vùng không được phép cuộn, và collision rules có danh sách ngoại lệ minh bạch.
4. Chạy đúng năm cấu hình đã có: 320 default, 320 text-scale 200%, 390, 768, 1440; vertical scroll vẫn hợp lệ.
5. Thêm positive control cố ý tạo overflow hoặc clipping; detector phải bắt được và trả false. Control này không được sửa kết quả production bằng hằng số.

### R03 — Gate A07 vẫn chứa màu focus hard-coded và inventory chưa hoàn chỉnh

**Bằng chứng**

- `verify_module_009.js` khai báo trực tiếp cặp `Focus Visible Ring on Canvas` với `fg: '#2563EB'`, `bg: '#FAF9F6'`.
- Phép tính focus phía dưới tiếp tục dùng mảng RGB hard-coded thay vì `getComputedStyle()` sau khi Tab native kích hoạt `:focus-visible`.
- Target query chỉ đo trạng thái initial; control trong dialog mở và nút `#btn-edit-saved` sau success không nằm trong inventory thực thi.
- Báo cáo dùng claim “100% controls”, trong khi ledger không cung cấp ánh xạ control → effective target đầy đủ cho từng trạng thái.

**Yêu cầu sửa**

1. Kích hoạt từng focus target bằng Tab/Shift+Tab bản địa; đọc `outlineStyle`, `outlineWidth`, `outlineColor`, `outlineOffset` và nền tiếp giáp từ live computed styles. Parse/selector/transparent-resolution lỗi phải fail.
2. Đo target inventory theo các trạng thái cần thiết: initial form, dialog open, validation visible và committed summary. Ghi ID control, effective target, kích thước và ngưỡng 24/44 riêng.
3. Mở rộng contrast inventory ít nhất gồm primary/secondary text, hint/counter, inline error, error summary, button text, structural control borders, dialog controls, committed summary và focus indicators thực tế.
4. Forced-colors unsupported phải tạo `NOT_EXECUTED_ENVIRONMENT_UNSUPPORTED` và không thể đóng A07 thành PASS tự động.
5. Thêm positive/negative control cho color parser và forced-colors conjunction.

### R04 — A08 chưa phải dynamic integrity audit hoàn chỉnh

**Bằng chứng**

- T12 hiện chỉ assert `screenshotsCount >= 11`; không tính và đối chiếu SHA-256, byte size hoặc pixel dimensions của 11 ảnh trong chính gate.
- Source hashes được ghi trong `VERIFICATION.json` nhưng T12 không đối chiếu đầy đủ source, contract, AX tree và report ledger.
- Bản khai nói archive có 26 entry, trong khi Controller đếm được 27 entry. Entry thứ 27 là `screenshots/final_forced_colors.png`; đây là lỗi đồng bộ manifest, không phải lỗi ZIP.
- `DESIGN_TRAINING_009_REPORT.md` vẫn chứa nhiều liên kết `file:///C:/Users/game/...`, trái với mục tiêu portable replay.

**Yêu cầu sửa**

1. Xây exact manifest cho archive và authoritative screenshots; kiểm tra tên, count, SHA-256, byte size và PNG dimensions động. Không dùng điều kiện `>=` cho artifact bắt buộc.
2. Hash và đối chiếu source, contract, AX tree, report và official Controller documents trong A08.
3. Đối chiếu hai chiều giữa artifact vật lý, `VERIFICATION.json` và `DESIGN_TRAINING_009_REPORT.md`; mọi thiếu, thừa hoặc sai giá trị phải fail.
4. Sửa metadata package thành 27 entry nếu giữ nguyên cấu trúc hiện tại.
5. Thay toàn bộ liên kết `file:///C:/...` trong report bằng đường dẫn tương đối portable.
6. Thêm negative control hash mismatch và missing artifact; cả hai phải làm A08 false.

### R05 — Thiếu toàn bộ positive/negative controls bắt buộc

**Bằng chứng**

- Không tìm thấy positive/negative control hoặc detector self-test trong `verify_module_009.js`.
- Review 001 khóa rõ ba yêu cầu: fixture overflow/clipping hoặc hash mismatch phải fail; forced-colors unsupported không thể pass; một gate giả false phải khiến overall status FAIL và exit code 1.
- Exit behavior production đã được sửa tốt hơn, nhưng chưa có bằng chứng tự kiểm rằng detector và conjunction thực sự bắt được lỗi có chủ đích.

**Yêu cầu sửa**

1. Bổ sung self-tests không phụ thuộc kết quả candidate cho tối thiểu: reflow/clipping detector, hash/artifact detector, color parser, forced-colors conjunction và overall-gate conjunction.
2. Mỗi control phải có dirty fixture xác định, expected failure count và assert detector bắt đúng; cấm gán kết quả `passed: true` thủ công.
3. Một gate giả false phải sinh `SELF_CHECK_FAIL`; kiểm tra exit behavior qua pure function hoặc child process để chứng minh exit code dự kiến là 1 mà không làm hỏng run thành công chính.
4. Ghi toàn bộ kết quả detector self-tests vào `VERIFICATION.json` và đưa chúng vào conjunction của gate tương ứng.

---

## 5. Các nội dung đã đạt và phải giữ nguyên

- Direction A và candidate hiện byte-identical: chấp nhận, không cần tạo refinement giả.
- Fixture AR-901, locked copy và mô hình Draft → Payload Snapshot → Committed Data.
- Trạng thái initial sạch lỗi; validation summary đơn nguồn; inline associations.
- Native dialog lifecycle T03 và duplicate guard T08.
- Light theme, zero motion và hệ màu hiện tại.
- Bố cục desktop/mobile hiện tại và toàn bộ thay đổi giúp reflow 320px.
- Bốn văn bản Controller đang byte-identical.
- `ASSISTIVE_TECH_REVIEW_PLAN.md` ở trạng thái `MANUAL_REVIEW_PENDING`.
- Footer có claim giới hạn và package có README/package manifest.

---

## 6. Acceptance criteria cho Repair 002 — vòng cuối

```yaml
FINAL_R01_NATIVE_FULL_FSM_JOURNEY: true
FINAL_R02_STABLE_NODE_IDENTITY_ALL_STATES: true
FINAL_R03_BODY_FOCUS_EVENTS_ZERO: true
FINAL_R04_NO_STEAL_AFTER_RETRY_SUCCESS: true
FINAL_R05_NATIVE_SCENARIO_STATIC_SCAN: true
FINAL_R06_GLOBAL_AND_LOCAL_REFLOW_AUDIT: true
FINAL_R07_CLIPPING_OVERLAP_INVENTORY_FAIL_CLOSED: true
FINAL_R08_LIVE_COMPUTED_FOCUS_CONTRAST: true
FINAL_R09_COMPLETE_STATEFUL_TARGET_INVENTORY: true
FINAL_R10_COMPLETE_REQUIRED_CONTRAST_INVENTORY: true
FINAL_R11_FORCED_COLORS_UNSUPPORTED_CANNOT_PASS: true
FINAL_R12_EXACT_ARTIFACT_MANIFEST: true
FINAL_R13_SCREENSHOT_HASH_SIZE_DIMENSION_AUDIT: true
FINAL_R14_SOURCE_AX_REPORT_LEDGER_SYNCHRONIZED: true
FINAL_R15_PORTABLE_RELATIVE_REPORT_LINKS: true
FINAL_R16_DETECTOR_POSITIVE_NEGATIVE_CONTROLS: true
FINAL_R17_FALSE_GATE_PRODUCES_FAIL_AND_EXIT_1: true
FINAL_R18_ARCHIVE_ENTRY_COUNT_ACCURATE: true
```

Mọi điều kiện trên phải được tính động. Missing selector, parse failure, missing artifact, hash mismatch, unsupported forced-colors, self-test detector false hoặc gate false đều phải dẫn đến `SELF_CHECK_FAIL`; không được quy đổi thành PASS bằng fallback.

---

## 7. Gói nộp vòng cuối

Tên đề nghị:

`design_training_009_submission_r03.zip`

Mã nộp:

`DESIGN_TRAINING_009_REPAIR_002`

Gói giữ nguyên cấu trúc hiện tại, cập nhật harness, contract/report/verification/AX tree khi cần và tái tạo đúng các ảnh bị ảnh hưởng bởi phép kiểm. Không thêm helper đóng gói vào archive. Báo cáo chỉ được ghi `SELF_CHECK_PASS / SUBMITTED_FOR_CONTROLLER_REVIEW`; không tự ghi `MODULE_COMPLETED: true`.

---

## 8. Phán quyết

```yaml
VERDICT: FINAL_REPAIR_REQUIRED
MODULE_COMPLETED: false
VISUAL_DIRECTION: DIRECTION_A_ACCEPTED_AND_FROZEN
REPAIR_ROUND_NEXT: 2/2_FINAL
REPAIR_SCOPE: VERIFICATION_AND_EVIDENCE_ONLY
```

Repair 001 là bước tiến lớn và phần sản phẩm nhìn thấy đã đạt hướng nghiệm thu. Vòng cuối chỉ cần làm cho bằng chứng khớp mức chắc chắn của các claim đang đưa ra. Nếu toàn bộ FINAL_R01–FINAL_R18 được chứng minh động, Module 09 có thể được xem xét đóng chính thức.
