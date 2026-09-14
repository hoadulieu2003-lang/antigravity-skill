# DESIGN TRAINING 012 — GOVERNANCE WAIVER & PHASE 3 AUTHORIZATION 005

```yaml
decision_id: DESIGN_TRAINING_012_GOVERNANCE_WAIVER_005
stream_id: B
module: DESIGN_TRAINING_012_BRAND_AND_IMAGE_DIRECTION
checkpoint: 12.1
supersedes_operational_state_of: DESIGN_TRAINING_012_OWNER_CLOSURE_REVIEW_004
owner_decision: OPTION_A_GOVERNANCE_WAIVER_APPROVED
authority: "Anh — Lead Architect / Product Owner"
owner_decision_timestamp: "2026-09-14T14:10:00+07:00"
controller_recorded_date: "2026-09-14"
checkpoint_verdict: CHECKPOINT_APPROVED_WITH_GOVERNANCE_WAIVER
checkpoint_approved: true
design_reasoning_status: PASS
direction_a_status: FROZEN_AND_ACCEPTED_FOR_SELECTION
direction_b_status: FROZEN_AND_ACCEPTED_FOR_SELECTION
package_integrity_status: PASS
canonical_metric_status: PASS
evidence_engineering_status: WAIVED_WITH_DEBT
phase_3_selection_gate: UNLOCKED
phase_4_final_candidate: CONDITIONALLY_UNLOCKED_AFTER_SELECTION_RECORD
phase_5_critique: LOCKED_UNTIL_FINAL_CANDIDATE
phase_6_verification: LOCKED_UNTIL_CRITIQUE
module_012_completed: false
module_013: LOCKED
```

## 1. Phán quyết

Controller Stream B ghi nhận quyết định quản trị hợp lệ từ Lead Architect và chính thức ban hành **governance waiver có giới hạn** cho Checkpoint 12.1.

Checkpoint 12.1 được chấp thuận để tiếp tục lộ trình thiết kế. `Phase 3 — Selection Gate` được mở ngay. Sau khi Anti tạo hồ sơ lựa chọn hợp lệ theo Mục 4 của văn kiện này, `Phase 4 — Final Candidate` tự động được mở mà không cần thêm một checkpoint trung gian.

Waiver chỉ cho phép **hoãn** việc tất toán Evidence Debt tới Phase 5–6. Waiver không:

- biến Evidence Engineering thành `PASS`;
- xóa hoặc hạ cấp gate `B08 — Evidence Integrity`;
- thay đổi nội dung khóa cứng T01–T14 hoặc tổng 79 assertions;
- cho phép dùng `CHECKPOINT_VERIFICATION.json` như bằng chứng thay thế executable runner;
- cho phép Module 12 hoàn thành khi khoản nợ chưa được tất toán.

## 2. Phạm vi được chấp thuận

| Hạng mục | Trạng thái | Hệ quả |
|---|---|---|
| Brand thesis | `PASS` | Được dùng làm nền cho selection |
| Direction A | `FROZEN_AND_ACCEPTED_FOR_SELECTION` | Không thiết kế lại |
| Direction B | `FROZEN_AND_ACCEPTED_FOR_SELECTION` | Không thiết kế lại |
| Package integrity | `PASS` | Không cần tái kiểm ở Selection Gate |
| Canonical metric `2/8 = 25%` | `PASS` | Phải giữ nguyên trong candidate |
| Checkpoint evidence | `WAIVED_WITH_DEBT` | Bắt buộc tất toán trước final PASS |

Hai hướng chỉ được chỉnh trong candidate sau khi một hướng được chọn. Prototype nguồn trong `directions/option_a/` và `directions/option_b/` phải được giữ nguyên làm hồ sơ so sánh.

## 3. Evidence Debt Register — blocking at Phase 6

Năm khoản nợ sau được đăng ký chính thức:

| ID | Khoản nợ | Acceptance evidence bắt buộc |
|---|---|---|
| ED-01 | Thiếu executable test runner | Có `verify_module_012.js` và mọi script/config phụ trợ trong ZIP; chạy được bằng lệnh portable được ghi trong report; exit code phản ánh conjunction T01–T14 |
| ED-02 | Bốn timestamp lịch sử tuyệt đối ngoài canonical | Candidate dùng relative delta hoặc nội dung được canonical allowlist cho phép; runner kiểm tra actual DOM/text |
| ED-03 | Operational fact và địa danh ngoài canonical | Mọi fact hiển thị thuộc canonical fixture hoặc được gắn nhãn fictional fixture rõ ràng; runner kiểm HTML, SVG, YAML và alt/desc |
| ED-04 | `CHK_19` dùng blacklist | Thay bằng allowlist/schema validation; có ít nhất một negative fixture chứng minh rule bắt được fact ngoài invariant |
| ED-05 | `CHK_12` assertion-by-declaration | JSON ghi expected/actual cho từng tuple canonical T01–T08, file/source được quét và kết quả deep comparison |

Điều kiện tất toán:

```text
ED-01 ∧ ED-02 ∧ ED-03 ∧ ED-04 ∧ ED-05 = true
```

Thiếu bất kỳ một khoản nào thì `B08 = FAIL`, bất kể tổng điểm rubric hoặc self-verdict.

## 4. Lệnh thực hiện Phase 3 — Selection Gate

Anti tự chấm Direction A và Direction B theo đúng rubric Mục 15 của Directive, trên cùng một thang điểm và cùng bằng chứng. Tạo `SELECTION_DECISION.md` gồm:

1. bảng điểm đủ 8 nhóm cho cả hai hướng, tổng `/100`;
2. ba lý do chọn hướng thắng;
3. hai trade-off được chấp nhận;
4. một strength của hướng không chọn được giữ trong archive nhưng **không trộn** vào candidate;
5. quyết định rõ `SELECT_DIRECTION_A` hoặc `SELECT_DIRECTION_B`;
6. confidence đúng nhãn `EXERCISE_SUPPORTED`;
7. xác nhận không dùng user-research claim khi không có protocol và raw records.

Selection hợp lệ khi:

- hướng được chọn đạt tối thiểu `80/100`;
- không có blocking gate thiết kế bị FAIL;
- điểm số truy vết được tới artifact/source;
- không sửa hai prototype để làm thay đổi kết quả chấm;
- không chọn bằng sở thích palette đơn thuần.

Ngay khi `SELECTION_DECISION.md` thỏa các điều kiện trên, Anti được phép bắt đầu Phase 4 theo Directive.

## 5. Biên thực hiện Phase 4 — Final Candidate

Anti tạo:

```text
candidate/pre_critique.html
candidate/index.html
BRAND_IMAGE_CONTRACT.yaml
```

Các invariant bắt buộc:

- chỉ triển khai DNA của **một** hướng đã chọn;
- Direction A và Direction B nguồn giữ nguyên;
- không lai strength của hướng thua vào candidate;
- light theme bắt buộc;
- zero motion tuyệt đối: animation và transition có effective duration `0s`;
- giữ dữ liệu canonical T01–T08 và derived metric `2/8 = 25%`;
- asset phải đăng ký trong manifest, có hash, provenance và disclosure;
- không remote runtime request;
- hoạt động ở `1440`, `768` và `390` CSS px;
- không thay test để hợp thức hóa implementation.

## 6. Điều kiện Phase 5–6 và final PASS

Phase 5 và Phase 6 tiếp tục tuân thủ toàn bộ Directive gốc. Final submission phải có executable verification thật và cấu trúc gói tại Mục 19.

Controller chỉ có thể cấp `PASS / MODULE_COMPLETED: true` khi đồng thời:

```yaml
B01_to_B08: PASS
T01_to_T14: PASS
assertions: 79/79
rubric_score: ">= 80/100"
evidence_debt: 0
visual_quality: CONTROLLER_ACCEPTED
```

Waiver này hết hiệu lực đối với mọi khoản nợ tại thời điểm Phase 6 được nộp. Không có waiver kế thừa cho final acceptance.

## 7. Directive hiện hành cho Antigravity Tab B

```yaml
ANTI_DIRECTIVE:
  stream_id: B
  action: PROCEED
  phase_3: START_NOW
  required_output: SELECTION_DECISION.md
  phase_4: START_AFTER_VALID_SELECTION_RECORD
  source_directions: FREEZE_AND_PRESERVE
  evidence_debt: REGISTER_AND_CLOSE_BY_PHASE_6
  phase_5_6_test_contract: IMMUTABLE
  cross_stream_write: FORBIDDEN
  module_013: LOCKED
  next_controller_submission: DESIGN_TRAINING_012_FINAL_SUBMISSION_R01
```

Không cần nộp thêm một gói chỉ để xin phép chuyển Phase 3 sang Phase 4. `SELECTION_DECISION.md` phải được đưa vào final package để Controller kiểm toán cùng candidate và verification evidence.

## 8. Kết luận

```yaml
CHECKPOINT_12_1: APPROVED_WITH_GOVERNANCE_WAIVER
PHASE_3_SELECTION_GATE: OPEN
PHASE_4_FINAL_CANDIDATE: AUTHORIZED_AFTER_VALID_SELECTION_RECORD
MODULE_COMPLETED: false
EVIDENCE_DEBT: BLOCKING_AT_FINAL
```

