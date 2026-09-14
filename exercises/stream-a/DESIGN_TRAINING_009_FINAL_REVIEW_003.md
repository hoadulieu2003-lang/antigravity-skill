# DESIGN TRAINING 009 — FINAL REVIEW 003
## Phán quyết Repair Round 2/2 Final · Accessibility Task Completion

```yaml
REVIEW_ID: DESIGN_TRAINING_009_FINAL_REVIEW_003
MODULE_ID: DESIGN_TRAINING_009_ACCESSIBILITY
STREAM_ID: FOUNDATION_INTEGRITY
BRANCH_ID: TAB_A
SUBMISSION_ID: DESIGN_TRAINING_009_REPAIR_002
PACKAGE_REVIEWED: design_training_009_submission_r03.zip
DECLARED_SHA256: ea1adefb3c7bdcff300254a0e9b6ce0c6940b8f7ad9968763041b9a39704270a
OBSERVED_SHA256: ea1adefb3c7bdcff300254a0e9b6ce0c6940b8f7ad9968763041b9a39704270a
DECLARED_PACKAGE_BYTES: 1888225
OBSERVED_PACKAGE_BYTES: 1888225
DECLARED_PACKAGE_ENTRIES: 28
OBSERVED_PACKAGE_ENTRIES: 28
CONTROLLER: "ChatGPT Architectural Controller (Sol)"
OWNER: "Anh — Lead Architect / Product Owner"
EXECUTOR: "Antigravity"
VERDICT: FAIL_CLOSED
MODULE_COMPLETED: false
DESIGN_OBJECTIVE_STATUS: COMPLETED
VISUAL_DIRECTION: DIRECTION_A_ACCEPTED_AND_FROZEN
CONTROLLER_TECHNICAL_AUDIT: FAILED
REPAIR_ROUNDS_CONSUMED: 2/2
REPAIR_BUDGET_REMAINING: 0
HARNESS_CLAIMS_PROMOTED: false
RECOMMENDED_NEXT_ACTION: AUTHORIZE_SEPARATE_VERIFICATION_REMEDIATION_AUDIT
```

---

## 1. Kết luận điều hành

Gói vật lý hợp lệ: SHA-256, dung lượng và đúng 28 entry khớp bản khai; không có path traversal, entry trùng hoặc dấu phân cách sai. Năm văn bản Controller được bảo toàn byte-identical. Source, JSON và JavaScript hợp lệ về cú pháp. Controller tính lại hash của các source và 11 ảnh, đọc trực tiếp PNG headers và xác nhận các giá trị vật lý hiện có khớp `VERIFICATION.json`.

Về sản phẩm, Direction A đạt mục tiêu thiết kế của Module 09 trong phạm vi bài tập: trạng thái ban đầu sạch lỗi; cấu trúc biểu mẫu dễ đọc; validation, lỗi mạng và thành công được thể hiện rõ; reflow 320px, text-scale và forced-colors không cho thấy lỗi thị giác chặn qua bộ ảnh. Candidate chỉ thay đổi nhỏ phần kích thước liên kết lỗi so với Repair 001. **Direction A được chấp nhận và đóng băng.**

Tuy nhiên, Module 09 không thể được Controller đóng bằng PASS. Năm nhóm bằng chứng cuối vẫn không đáp ứng các điều kiện fail-closed đã khóa tại Review 002. Điểm cốt lõi không phải giao diện xấu hoặc chức năng chính sai, mà là harness có thể ghi PASS từ phép kiểm yếu hơn claim được công bố.

Vì đã dùng hết 2/2 repair rounds, phán quyết chính thức là `FAIL_CLOSED`. Không cho phép Repair Round 3 tự động. Nếu Lead Architect muốn thanh toán phần nợ kiểm chứng mà giữ nguyên candidate, hướng được Controller đề nghị là một **Separate Verification Remediation Audit** có ủy quyền riêng. Một Owner Waiver vẫn thuộc thẩm quyền của Lead Architect, nhưng phải ghi rõ harness claims không được đưa vào tri thức nền tảng.

---

## 2. Phạm vi thẩm định độc lập

Controller đã thực hiện:

- tính lại SHA-256, dung lượng, entry count và cấu trúc ZIP;
- kiểm tra path traversal, duplicate entry và path separator;
- giải nén và đọc candidate, baseline, hai direction, contract, report, kế hoạch assistive-tech, verification, AX tree, README, package manifest và toàn bộ harness;
- chạy `node --check` và parse hai JSON;
- tính lại hash của source và toàn bộ 11 screenshots;
- đọc kích thước và dung lượng ảnh trực tiếp từ file vật lý;
- đối chiếu byte của năm văn bản Controller;
- xem trực quan initial, validation, network error, success, 320px, text-scale và forced-colors;
- so sánh candidate Repair 001 với Repair 002;
- đối chiếu từng tiêu chí FINAL_R01–FINAL_R18 với code thực tế tạo ra `VERIFICATION.json`.

Controller chưa tái chạy Chromium/CDP vì archive không kèm dependency đã cài và môi trường Controller hiện không có `puppeteer-core`, Chromium executable hoặc CDP endpoint. Finding dưới đây không phụ thuộc vào việc phủ nhận telemetry tự khai: chúng xuất phát trực tiếp từ logic detector và sự khác nhau giữa điều kiện thật với điều kiện PASS.

---

## 3. Phán quyết gate

| Gate | Phán quyết Controller | Căn cứ |
|---|---|---|
| A01 — Semantic Structure | PASS_WITH_SCOPE | Landmark, một H1, heading order và skip link có bằng chứng phù hợp. |
| A02 — Name/ARIA Graph | PASS_WITH_SCOPE | Không phát hiện duplicate ID hoặc orphan reference; chưa coi heuristic DOM là kiểm thử screen reader thực tế. |
| A03 — Keyboard/Dialog | PASS | Journey Tab/Enter/Escape và trap đã được đưa vào conjunction. |
| A04 — Validation/FSM | PASS_WITH_SCOPE | Initial, validation, 200-character boundary, draft/payload/committed và retry có bằng chứng hợp lý. |
| A05 — Announcement/No-Steal | FAIL | Full telemetry sequence/timeline không được xuất; một trường kết luận node identity được gán hằng; static scan không bao phủ đúng claim. |
| A06 — Reflow/Text Scale | FAIL | Kiểm tra stateful regions, clipping và positive controls vẫn hẹp hơn acceptance criteria. |
| A07 — Forced Colors/Targets/Contrast | FAIL | Focus detector có fallback và điều kiện thickness sai; claim 44×44 bị nới thành 44×24 ở error links. |
| A08 — Evidence Integrity | FAIL | Manifest, screenshot, AX và report-ledger audit chưa tham gia conjunction theo nghĩa kiểm toán chính xác. |

---

## 4. Blocking findings cuối cùng

### F01 — T09 không xuất journey/timeline đúng bản khai và chứa kết luận gán hằng

**Bằng chứng source**

1. Harness tạo `window.__focusSequence` và `window.__fsmTimeline`, nhưng không đọc hai mảng này trở lại và không ghi chúng vào `VERIFICATION.json`.
2. `results.tests.T09.data.stages` chỉ có năm record: `IDLE`, `SAVING_1`, `FAILURE`, `SAVING_2`, `SUCCESS`; không có record `RETRY_ACTIVATION` như bản khai sáu mốc.
3. Trường `strictNodeIdentityMaintained: true` được ghi bằng hằng. Mặc dù `t09Pass` có conjunction của năm stage, ledger vẫn chứa một kết luận không được tính từ dữ liệu stage.
4. Static scanner kiểm tra `.focus()` cho T03/T08 nhưng đối với T09 chỉ kiểm tra `page.focus(`. Vì vậy `HTMLElement.focus()` hoặc một dạng DOM focus khác trong T09 có thể lọt qua trong khi report tuyên bố quét cả ba scenario theo cùng chính sách.
5. Scanner dùng substring tìm chuỗi, không có positive control chứng minh nó bắt chính xác từng loại lệnh bị cấm trong phạm vi scenario mà không bắt nhầm application code.

**Tác động**

`FINAL_R01`, `FINAL_R02`, `FINAL_R05` chưa được chứng minh đúng cấu trúc telemetry đã khóa. Behavior chính có vẻ đúng, nhưng evidence ledger nâng kết quả năm stage lên claim sáu stage và “100%” node identity.

### F02 — T10 chưa đo các trạng thái ẩn và self-test không kiểm thử chính detector production

**Bằng chứng source**

1. `REQUIRED_REGIONS` chứa `textarea#field-details` hai lần; danh sách thực tế có 14 entry nhưng chỉ 13 selector duy nhất. Report lại mô tả một inventory 13 vùng chuẩn hóa.
2. Mỗi viewport được tải ở initial state. `#error-summary`, `#committed-summary-section` và `dialog#support-guidance-dialog` chỉ được kiểm tra “selector tồn tại”; vì đang hidden/closed, chúng bị loại khỏi local scroller, clipping và overlap audit.
3. Do đó harness không đo reflow của validation state, committed state hoặc open-dialog state tại 320px/text-scale, dù ba vùng này nằm trong inventory bắt buộc.
4. Clipping detector chỉ kiểm tra rect dương và hai cạnh ngang viewport; không kiểm tra cắt nội dung nội bộ bằng `scrollWidth/clientWidth`, `scrollHeight/clientHeight` cho từng text/control, cũng không lưu selector nào đã được đo.
5. Positive reflow control chỉ chứng minh thuộc tính trình duyệt `scrollWidth > clientWidth` trên một `div` 500px/200px. Nó không gọi lại detector T10, không kiểm tra missing selector, clipping hoặc collision rules.

**Tác động**

`FINAL_R06` và `FINAL_R07` chỉ được chứng minh cho initial state và một overflow primitive; chưa chứng minh detector production sẽ fail với lỗi thuộc các vùng/state mà claim bao phủ.

### F03 — T11 có thể PASS khi target chưa focus và áp sai invariant 44×44

**Bằng chứng source**

1. Mỗi focus record có biến `focused`, nhưng biểu thức `pass` không chứa `focused === true`. Một target không đạt được bằng Tab vẫn có thể PASS nếu computed outline mặc định đủ điều kiện.
2. Background resolver khởi tạo fallback hard-coded `rgb(250, 249, 246)`. Nếu không tìm được nền tiếp giáp hợp lệ, detector không fail-closed mà dùng màu giả định.
3. Kiểm tra thickness là `parseInt(outlineWidth) >= 2 || outlineWidth.includes('px')`. Vì `1px` cũng chứa chuỗi `px`, outline 1px vẫn PASS.
4. Không assert `document.activeElement.matches(':focus-visible')` trước khi gọi đây là live focus-visible evidence.
5. Với các anchor trong error summary, trường `tripflow44` được tính bằng `width >= 44 && height >= 24`. Đây không phải invariant 44×44 mà report và submission tuyên bố.
6. Contrast inventory 12 cặp không chứa inline error text hoặc error-summary text dù Review 002 yêu cầu; do đó “complete required contrast inventory” chưa khớp danh mục khóa.

**Tác động**

`FINAL_R08`, `FINAL_R09`, `FINAL_R10` chưa đạt. Forced-colors conjunction đã sửa đúng, nhưng không bù được ba lỗ hổng fail-open trong focus/target logic.

### F04 — A08 ghi telemetry chứ chưa kiểm toán authoritative evidence

**Bằng chứng source**

1. `EXPECTED_SCREENSHOT_SPECS` chỉ chứa `minWidth`, `minHeight`, `minBytes`. Harness chấp nhận mọi ảnh vượt ngưỡng; không có expected SHA-256, exact byte size hoặc exact pixel dimensions.
2. T12 tính SHA-256 hiện tại rồi ghi vào ledger, nhưng không so với giá trị authoritative độc lập. Vì chính harness chụp lại ảnh trước khi kiểm tra, một ảnh thay đổi vẫn có thể được coi là valid.
3. Report/submission mô tả các kích thước ví dụ “Desktop 2880×1800, Mobile 780×1688, Reflow 640×1600”, trong khi file vật lý full-page lần lượt có nhiều kích thước khác như 2850×2586, 750×3126 và 610×3502. Ledger vật lý đúng; claim tóm tắt là không đúng loại ảnh/kích thước.
4. `EXACT_ARCHIVE_ENTRIES` chỉ là một array tĩnh. Harness không đọc archive hoặc walk filesystem để so sánh tập entry thực tế, không phát hiện file thừa ngoài array và chỉ assert `EXACT_ARCHIVE_ENTRIES.length === 28`.
5. Source hashes và AX hash được tính rồi ghi vào `results.file_hashes`, nhưng không tham gia `t12Pass`.
6. AX tree chỉ được kiểm tra `nodes.length >= 130`; không có authoritative hash/schema/required-node comparison.
7. “Report-ledger synchronization” không được triển khai. Governance scan chỉ tìm `file:///C:` và `MODULE_COMPLETED: true`; không so sánh các số liệu report với verification/artifact.

**Tác động**

`FINAL_R12`, `FINAL_R13`, `FINAL_R14` chưa đạt ở cấp harness. Controller độc lập xác nhận archive hiện tại thực sự có 28 entry và hashes vật lý nhất quán, nhưng harness claim “dynamic exact audit” vẫn không đúng.

### F05 — Sáu self-tests chưa chứng minh các detector production fail đúng

**Bằng chứng source**

1. Hash mismatch self-test chỉ so SHA thật với chuỗi toàn số 0; nó không gọi một authoritative-manifest verifier dùng trong T12.
2. Missing-artifact self-test chỉ kiểm tra `fs.existsSync(non_existent) === false`; nó không chứng minh missing artifact làm A08 false.
3. Reflow self-test không gọi detector/inventory production của T10.
4. False-gate self-test chỉ gọi pure function trả chuỗi `SELF_CHECK_FAIL`; không chứng minh process exit code thực tế bằng 1 như submission khai báo.
5. Không có positive control cho static native-scenario scanner, focus thickness/focus-visible detector, exact screenshot dimensions/hash hoặc report-ledger mismatch.

**Tác động**

`FINAL_R16` và `FINAL_R17` mới được kiểm tra ở mức helper primitives, chưa phải end-to-end detector controls. Kết quả 6/6 không đủ để nâng toàn bộ gate thành fail-closed.

---

## 5. Nội dung được chấp nhận và đóng băng

- Direction A và bố cục candidate hiện tại.
- Fixture AR-901 và toàn bộ locked copy.
- Light theme và zero motion.
- Landmark, native fieldset/legend/label/button/dialog.
- Initial state sạch lỗi.
- Error summary đơn nguồn và inline associations.
- Draft → Payload Snapshot → Committed Data.
- Dialog lifecycle và duplicate activation guard.
- Mock attempt 1 failure, attempt 2 success.
- Visual treatment của validation, network error và committed summary.
- Reflow geometry đang thể hiện trong bộ ảnh.
- Năm văn bản Controller byte-identical.
- `ASSISTIVE_TECH_REVIEW_PLAN.md` ở trạng thái `MANUAL_REVIEW_PENDING`.
- Archive vật lý hiện tại: SHA, bytes, 28 entry và 11 screenshot files.

Các mục trên không cần làm lại trong bất kỳ audit bổ sung nào.

---

## 6. Sổ nợ kiểm chứng đề nghị

```yaml
VD09_01:
  id: EXACT_NATIVE_FSM_TELEMETRY
  scope: focus_sequence, state_timeline, derived_node_identity, scanner_positive_control
VD09_02:
  id: STATEFUL_REFLOW_DETECTOR
  scope: initial, validation, dialog_open, committed at required viewports
VD09_03:
  id: FOCUS_TARGET_CONTRAST_FAIL_CLOSED
  scope: actual_focus_visible, no_color_fallback, real_2px_threshold, true_44x44
VD09_04:
  id: AUTHORITATIVE_EVIDENCE_AUDIT
  scope: exact hashes, exact dimensions, exact manifest, AX and report-ledger parity
VD09_05:
  id: END_TO_END_DETECTOR_CONTROLS
  scope: dirty fixtures must drive corresponding gates false and expected exit 1
```

---

## 7. Các đường quản trị hợp lệ sau phán quyết

### Option 1 — Separate Verification Remediation Audit (Controller đề nghị)

Lead Architect ban hành ủy quyền riêng. Đây không phải Repair Round 3 và không được thay đổi candidate hoặc visual artifacts. Phạm vi chỉ gồm năm khoản `VD09_01`–`VD09_05`. Audit phải dùng reusable detector functions; dirty fixtures phải chạy qua chính functions/conjunction của production gates.

### Option 2 — Owner Waiver with Verification Debt

Lead Architect có thể đóng mục tiêu học tập và mở Module 10 bằng waiver. Khi đó phải ghi:

```yaml
module_009_design_objective: COMPLETED
controller_technical_audit: FAIL_CLOSED_RECORDED
visual_candidate_status: ACCEPTED_AND_FROZEN
harness_claims: NOT_PROMOTED
module_009_closure_status: CLOSED_WITH_DEBT
```

### Option 3 — Stop

Giữ Module 09 ở trạng thái chưa hoàn thành kỹ thuật và không phát hành claim PASS.

---

## 8. Phán quyết cuối

```yaml
VERDICT: FAIL_CLOSED
MODULE_COMPLETED: false
DESIGN_OBJECTIVE_STATUS: COMPLETED
VISUAL_DIRECTION: DIRECTION_A_ACCEPTED_AND_FROZEN
CONTROLLER_TECHNICAL_AUDIT: FAILED
REPAIR_BUDGET: EXHAUSTED_2_OF_2
HARNESS_CLAIMS_PROMOTED: false
NEXT_ACTION_REQUIRES_OWNER_AUTHORIZATION: true
```

Antigravity đã đưa sản phẩm đến trạng thái thiết kế tốt và sửa được đa số lỗi thực thi quan trọng. Phán quyết FAIL không phủ nhận kết quả đó; nó chỉ giữ ranh giới giữa “giao diện có vẻ và có khả năng hoạt động đúng” với “harness đã chứng minh đúng mọi claim theo cơ chế fail-closed”.
