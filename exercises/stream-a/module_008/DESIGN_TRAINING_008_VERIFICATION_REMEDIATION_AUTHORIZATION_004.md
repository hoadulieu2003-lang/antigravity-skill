# DESIGN TRAINING 008 — VERIFICATION REMEDIATION AUTHORIZATION 004

## Separate Audit Authorization — Stream A / Foundation Integrity

```yaml
DOCUMENT_ID: DESIGN_TRAINING_008_VERIFICATION_REMEDIATION_AUTHORIZATION_004
MODULE_ID: DESIGN_TRAINING_008
AUDIT_ID: DESIGN_TRAINING_008_VERIFICATION_REMEDIATION_AUDIT_001
AUTHORITY: Anh — Lead Architect / Product Owner
OWNER_DECISION: AUTHORIZE_SEPARATE_VERIFICATION_REMEDIATION_AUDIT
CONTROLLER: ChatGPT Architectural Controller (Sol)
EXECUTOR: Antigravity
STATUS: AUTHORIZED_IN_PROGRESS
RELATION_TO_MODULE_008: SEPARATE_AUDIT_NOT_REPAIR_ROUND_3
VISUAL_CANDIDATE: FROZEN
MODULE_009_STATUS: LOCKED_PENDING_AUDIT_PASS
```

## 1. Xác nhận quyết định quản trị

Controller xác nhận Lead Architect đã cấp thẩm quyền mở một phiên kiểm toán khắc phục độc lập cho Module 08. Phiên này không thay đổi lịch sử `REPAIR_ROUND: 2/2` và không được ghi nhận như vòng sửa thứ ba.

Mục tiêu duy nhất là phục hồi tính toàn vẹn của harness, token provenance và báo cáo kiểm toán. Phần visual candidate đã được chấp nhận trong `DESIGN_TRAINING_008_FINAL_REVIEW_003.md` phải được giữ nguyên.

## 2. Phạm vi được phép thay đổi

Antigravity chỉ được thay đổi những tệp hoặc vùng sau:

1. `verify_module_008.js` — sửa phương pháp tương tác, telemetry động, contract comparison và token audits.
2. `COLOR_CONTRACT.yaml` — chỉ sửa những trường cần thiết để có thể kiểm chứng tự động và đồng bộ runtime FSM/token provenance.
3. `DESIGN_TRAINING_008_REPORT.md` — sửa governance, trạng thái tự kiểm và số liệu được tái sinh từ harness.
4. `directions/option_b.html` — chỉ được thay literal shadow semantic bằng primitive token tương ứng.
5. `VERIFICATION.json` — phải được tái sinh từ harness sau cùng; không chỉnh tay các trường kết luận.

## 3. Phạm vi đóng băng

Các nội dung sau không được thay đổi:

- `index.html` visual candidate Option A Refined, ngoại trừ thay đổi phi thị giác tối thiểu nếu cần tạo hook kiểm toán và phải khai báo riêng trong change ledger.
- `directions/option_a.html` về thiết kế, hình học và token values đã nghiệm thu.
- Canonical fixture TF-801–TF-804.
- Nội dung nghiệp vụ, copy, bố cục, responsive behavior và Zero Motion invariant.
- Chín ảnh authoritative đã được Controller nghiệm thu. Nếu source visual hash không đổi thì không cần chụp lại.
- Hai tài liệu Review 001/002 và Final Review 003 phải được bảo tồn byte-identical nếu đưa vào gói.

## 4. Sáu yêu cầu kiểm toán bắt buộc

### A01 — Native Keyboard FSM Audit

- Không được gọi `page.focus()`, DOM `.focus()` hoặc cơ chế tương đương trong kịch bản được khai là native input.
- Bắt đầu từ clean page state.
- Dùng `Tab`, `Shift+Tab`, `Enter` và pointer input qua Puppeteer.
- Ghi focus sequence, active element, node identity và FSM state trước/trong/sau mỗi timer.
- Kiểm tra no-steal bằng việc người dùng di chuyển focus tự nhiên trong thời gian chờ.

### A02 — Dynamic Telemetry Instrument

- `programmatic_focus_in_harness` phải được suy ra tự động từ static scan hoặc instrumentation.
- Điều kiện audit: giá trị bằng `0` đối với toàn bộ native-input scenarios.
- Nếu không thu thập được thì fail closed; cấm mặc định về `0`.

### A03 — Programmatic Contract Verification

- `contract_matches_runtime_fsm` phải là kết quả so sánh có cấu trúc giữa `COLOR_CONTRACT.yaml` và runtime.
- Tối thiểu phải đối chiếu: danh sách state, transition hợp lệ, stable action selector, node identity preservation, saving guard và no-steal rule.
- Cấm gán boolean kết luận trực tiếp.

### A04 — Semantic Color Audit

- Sửa literal `rgba(2, 6, 23, 0.08)` trong semantic token của Option B bằng primitive token.
- Quét toàn bộ semantic color tokens `--color-*` ở Candidate và hai directions.
- Mỗi token mang màu phải tham chiếu primitive hoặc sentinel được whitelist có giải thích, ví dụ `transparent`.
- Literal `hex`, `rgb`, `rgba`, `hsl`, `hsla` ngoài primitive layer phải làm C01 fail.
- Token composite phải có provenance truy ngược đầy đủ về semantic/primitive hợp lệ.

### A05 — Component Token Categorization

- Phân loại đủ 51 component tokens.
- Báo cáo riêng:
  - color-bearing tokens;
  - composite color-bearing tokens;
  - non-color spatial/typography tokens.
- Tổng các nhóm phải bằng tổng token được phát hiện thực tế.
- Không chấp nhận tỷ lệ `45/51` nếu sáu token còn lại không có danh sách và căn cứ phân loại.

### A06 — Report Governance Alignment

- Trạng thái tối đa Anti được tự ghi là `SELF_CHECK_PASS / SUBMITTED_FOR_CONTROLLER_AUDIT`.
- Không được tự đánh dấu Controller findings là `CLOSED`.
- Không được ghi gates là phán quyết Controller `PASS`; chỉ được dùng `SELF_CHECK_PASS` hoặc `SELF_CHECK_FAIL`.
- Telemetry, visual evidence và inference phải tiếp tục tách biệt.

## 5. Điều kiện fail-closed

Audit phải tự thất bại nếu có bất kỳ điều kiện nào sau:

- Có programmatic focus trong native-input scenario.
- Có telemetry field kết luận được gán hằng thay vì tính toán.
- Có semantic/component color literal ngoài primitive layer, trừ sentinel được whitelist rõ ràng.
- Tổng phân loại token không khớp tổng token được phát hiện.
- Contract/runtime comparison thiếu trường bắt buộc hoặc không thể thực thi.
- Báo cáo tự đóng finding hay tự nhận Controller PASS.
- Visual candidate hoặc canonical fixture bị thay đổi ngoài phạm vi cho phép.

## 6. Hồ sơ nộp Audit

Gói nộp nên dùng mã:

```yaml
SUBMISSION_ID: DESIGN_TRAINING_008_VERIFICATION_AUDIT_SUBMISSION_001
PACKAGE: design_training_008_verification_audit_001.zip
```

Gói tối thiểu gồm:

- `verify_module_008.js`
- `VERIFICATION.json`
- `COLOR_CONTRACT.yaml`
- `DESIGN_TRAINING_008_REPORT.md`
- `index.html`
- `directions/option_a.html`
- `directions/option_b.html`
- `AUDIT_CHANGE_LEDGER.md`
- Tài liệu authorization này
- Các review nguồn byte-identical nếu được đóng gói

Báo cáo bàn giao phải cung cấp:

- SHA-256 archive và từng source chính;
- danh sách file thay đổi;
- diff scope xác nhận visual candidate không đổi;
- command/runtime environment dùng để chạy harness;
- exit code;
- toàn bộ kết quả audit được sinh từ lần chạy cuối.

## 7. Acceptance Criteria

Audit chỉ đủ điều kiện Controller review khi đồng thời đạt:

```yaml
native_keyboard_fsm_audit: SELF_CHECK_PASS
programmatic_focus_in_native_scenarios: 0
contract_runtime_comparison: SELF_CHECK_PASS
semantic_color_provenance: SELF_CHECK_PASS
component_token_categorization: COMPLETE
report_governance: SELF_CHECK_PASS
visual_candidate_hash_unchanged: true
canonical_fixture_unchanged: true
zero_motion_invariant: true
```

Kết quả tự kiểm không tự động mở Module 09. Chỉ phán quyết Controller sau khi đối soát gói audit mới có quyền chuyển:

```yaml
MODULE_008: COMPLETED
PROMOTION_STATUS: APPROVED
MODULE_009_STATUS: UNLOCKED
```

## 8. Trạng thái chuyển giao

```yaml
AUDIT_AUTHORIZATION: ACTIVE
EXECUTION_STATUS: ANTIGRAVITY_IN_PROGRESS
VISUAL_WORK: FROZEN
CONTROLLER_WAITING_FOR: DESIGN_TRAINING_008_VERIFICATION_AUDIT_SUBMISSION_001
```
