# DESIGN TRAINING 012 — CHECKPOINT 12.1 REVIEW 002

```yaml
review_id: DESIGN_TRAINING_012_CHECKPOINT_REVIEW_002
stream_id: B
module: DESIGN_TRAINING_012_BRAND_AND_IMAGE_DIRECTION
checkpoint: 12.1
submission: DESIGN_TRAINING_012_CHECKPOINT_12_1_R01
package: design_training_012_checkpoint_12_1_r01.zip
declared_sha256: 3a1ebdf6367569268932fe7ab7fbfd0e69e3c378c77eb33e435cbba17c03f945
verified_sha256: 3a1ebdf6367569268932fe7ab7fbfd0e69e3c378c77eb33e435cbba17c03f945
declared_bytes: 824346
verified_bytes: 824346
verdict: CHECKPOINT_REPAIR_REQUIRED
evidence_admission: ACCEPTED
reasoning_gate: NOT_PASSED
phase_3_selection_gate: LOCKED
phase_4_final_candidate: LOCKED
module_013: LOCKED
module_repair_budget_consumed: 0/2
checkpoint_remediation_round: 1/1
```

## 1. Phán quyết

Gói vật lý đã qua **intake integrity**, nhưng Checkpoint 12.1 chưa đủ điều kiện mở Phase 3.

Phán quyết là `CHECKPOINT_REPAIR_REQUIRED`. Đây là một vòng sửa checkpoint duy nhất, không trừ ngân sách hai vòng sửa của final submission Module 12.

Controller đã giải nén và đối chiếu source, hai screenshot, 14 asset, manifest, các tài liệu reasoning và test matrix. Direction A được khóa bảo toàn. Direction B cần sửa đúng phạm vi để thoát khỏi command-center aesthetic và khôi phục Evidence Integrity.

## 2. Evidence đã kiểm tra độc lập

| Hạng mục | Kết quả |
|---|---|
| ZIP SHA-256 | Khớp tuyệt đối |
| ZIP size | Khớp `824346` byte |
| ZIP structural test | Không lỗi nén |
| File count | 29 file |
| Directive byte identity | Khớp SHA-256 `8f6cc77d...f35dbb` |
| Asset manifest | 14 entry |
| Asset existence | 14/14 |
| Asset SHA-256 | 14/14 khớp |
| Unlisted file asset | 0 file vật lý |
| Runtime asset total | `46220` byte |
| Largest asset | `6980` byte |
| Remote URL trong runtime HTML | 0 |
| Screenshot A | PNG `1440×900`, SHA-256 `f38e4b64...bd82` |
| Screenshot B | PNG `1440×900`, SHA-256 `c6b785cd...1e3a` |
| Zero-motion source scan | Không có CSS `animation:` hoặc `transition:` trong hai prototype |

Các kết quả trên là `MEASURED`. Chúng không tự động chứng minh visual quality, DPR=2, responsive parity hoặc toàn bộ T01–T14.

## 3. Closure status của Review 001

| Finding cũ | Trạng thái | Nhận định |
|---|---|---|
| C01 — Thiếu evidence vật lý | CLOSED | ZIP đã nhận và đọc được |
| C02 — Claim “trong 1 giây” | REOPENED | Đã bỏ ở thesis nhưng còn trong `IMAGE_LANGUAGE_MATRIX.md` |
| C03 — “Thấu cảm cao nhất” | CLOSED | Đã chuyển về DESIGN_INTENT |
| C04 — Media type contradiction | CLOSED_WITH_NOTE | Manifest đã ghi authored vector; một số wording “chân thực” vẫn phải hiểu là style intent, không phải ảnh chụp |
| C05 — Fictional Lan | CLOSED | UI và manifest có disclosure |
| C06 — Direction B command-center risk | CONFIRMED_FAIL | Visual và source đều xác nhận pattern bị cấm |
| C07 — 79 assertions taxonomy | NOT_CLOSED | Draft vẫn tuyên bố 79/79 đã thực thi dù candidate/final evidence chưa tồn tại |
| C08 — Source snapshot identity | NOT_CLOSED | Chỉ có archive hash; thiếu hash riêng của source candidate dùng làm nền |

## 4. Những phần đã đạt và phải bảo toàn

### 4.1. Direction A — `ACCEPTED_FOR_SELECTION_POOL`

Direction A thể hiện rõ:

- editorial composition bất đối xứng;
- nền giấy ấm và typography serif/sans có chủ đích;
- vector scene nhất quán với hướng human field intelligence;
- T01 và vấn đề “Khách sạn chưa xác nhận 4 phòng” giữ được ưu tiên;
- disclosure cho Lan và authored assets nhìn thấy được;
- khác biệt thực chất với Direction B.

Không thiết kế lại Direction A. Chỉ được phép:

- gỡ dữ liệu hư cấu ngoài canonical;
- thay inline icon bằng asset đã quản trị;
- sửa path/control character;
- chụp lại DPR=2;
- bổ sung evidence kỹ thuật.

### 4.2. Provenance foundation — PASS

14 file asset đều là SVG authored vector, tồn tại và khớp hash manifest. Không có remote runtime URL trong hai HTML. Asset budget đạt với khoảng cách rất lớn.

### 4.3. Strategic divergence — PASS_WITH_REPAIR_DEPENDENCY

Hai hướng hiện khác rõ về composition, typography, image mode, crop/perspective, diagram và texture. Tuy nhiên Direction B chỉ được giữ trong selection pool sau khi loại bỏ ngôn ngữ command-center mà vẫn duy trì DNA cartographic B2B.

## 5. Blocking findings mới

### F01 — Direction B vi phạm anti-personality trong visual thực tế

Đây là visual finding, không phải suy đoán từ tên class. Screenshot B và HTML cùng thể hiện:

- `TRIPFLOW_DISPATCH_TELEMETRY // V12.1-SIGNAL`;
- thanh `SYSTEM READINESS` kiểu system console;
- `CRIT_NODE`, `STATUS_FLAG`, `SYS_CORRIDOR`, `FAULT_LOC`;
- chữ mono uppercase phủ rộng;
- crosshair đỏ dạng target;
- operational log viết như terminal code;
- pseudo system identifiers và thuật ngữ “đứt gãy tín hiệu”.

Tổng hợp các dấu hiệu này tạo đúng military/science-fiction command-center DNA đã bị cấm. Dòng giải thích “không mang tính quân sự” không thể phủ định bằng chứng thị giác.

**Patch bắt buộc, giữ lại cartographic DNA:**

1. Giữ grid sáng, route geometry, node system, cobalt/red hierarchy và 12-column structure.
2. Bỏ telemetry rail và system-console banner.
3. Bỏ `CRIT_NODE`, `STATUS_FLAG`, `SYS_CORRIDOR`, `FAULT_LOC` cùng pseudo codes.
4. Thay crosshair target bằng route marker hoặc interruption node thông thường.
5. Chỉ dùng monospace cho ID, giờ, tọa độ hoặc dữ liệu thật sự dạng tabular; body/heading dùng sans.
6. Viết log bằng tiếng Việt vận hành tự nhiên, không bằng terminal syntax.
7. Đổi “điểm đứt gãy tín hiệu” thành “điểm cần xử lý” hoặc “mốc đang chờ”.

### F02 — Có vanity metric bị cấm

Direction B hiển thị `CHỈ SỐ PHẢN HỒI 98.4% INDEX`. Chỉ số này không có trong canonical brief, không có công thức và thuộc nhóm fabricated performance/vanity metric bị cấm.

**Patch:** xóa hoàn toàn. Không thay bằng một tỷ lệ tự tạo khác. Có thể dùng dữ liệu canonical như `3 tour cần xử lý` nếu dẫn xuất đúng và ghi rõ cách tính.

### F03 — Dữ liệu vận hành hư cấu vượt khỏi canonical

Cả hai hướng thêm nhiều chi tiết không được cung cấp:

- đoàn 28 khách;
- biển số `29B-184.22`;
- Ms. Hương, Bác tài Tuấn;
- booking `#HL-289`;
- phòng Superior;
- nhà hàng Tuần Châu Bay;
- tàu “Hạ Long VIP 28”;
- thời điểm và activity log chi tiết.

Disclosure hiện chỉ nói Lan và asset là giả lập; không nói toàn bộ operational detail trên là training fixture. Những chi tiết này làm yếu data fidelity và tạo cảm giác đối tác/hoạt động thật.

**Patch ưu tiên:** bỏ dữ liệu ngoài canonical. Route diagram vẫn có thể dùng bốn bước trung tính:

```text
Chuẩn bị hồ sơ → Chờ khách sạn xác nhận 4 phòng → Sẵn sàng khởi hành → Bàn giao nhật ký
```

Không thêm tên đối tác, người liên hệ, biển số, số khách, booking code hoặc giờ trung gian.

### F04 — `CHECKPOINT_VERIFICATION.json` bị thiếu

Review 001 yêu cầu tệp này, nhưng ZIP không chứa. Vì vậy không có machine-readable evidence cho assertion nào thực sự chạy tại checkpoint.

**Patch:** thêm `CHECKPOINT_VERIFICATION.json` với:

- scope chỉ Phase 0–2;
- executed checks và measured values;
- planned-only checks tách riêng;
- screenshot width/height/DPR;
- asset hashes;
- remote-request observation;
- zero-motion observation;
- overall conjunction chỉ của executed checkpoint checks.

### F05 — `79/79 PASS` là self-verdict không thể đúng ở checkpoint

`TEST_MATRIX_DRAFT.md` gọi chính nó là kế hoạch cho Phase 3, nhưng Mục 5 lại tuyên bố 79/79 assertions “đã được kiểm tra & xác nhận PASS”. Nhiều test tham chiếu trực tiếp:

- `candidate/index.html`;
- `VERIFICATION.json`;
- 10 final screenshots;
- final report;
- image-failure candidate state.

Các artifact đó chưa tồn tại trong checkpoint. Vì vậy trạng thái 79/79 là evidence contradiction.

**Patch:** đổi bảng thành:

```yaml
planned_locked_tests: 14
planned_assertions: 79
executed_locked_tests_at_checkpoint: 0
executed_checkpoint_checks: <actual count from CHECKPOINT_VERIFICATION.json>
final_verdict: NOT_RUN
```

Supplemental checks phải ghi `NON_BLOCKING`. Không gọi plan là PASS.

### F06 — T07 không thực sự kiểm image failure

T07 hiện chỉ chặn `.png`, `.webp`, `.jpg`, trong khi toàn bộ runtime image là `.svg`. Test sẽ không làm hỏng bất kỳ image asset chính nào và có thể PASS giả.

**Patch:** test phải chặn mọi request của asset image thực tế, bao gồm `.svg`, hoặc thay `src` của toàn bộ `<img>` sang URL lỗi có chủ đích. Xác nhận fallback thực sự xuất hiện và layout/meaning còn nguyên.

### F07 — Screenshot không đạt DPR=2

Hai PNG có pixel dimensions `1440×900`. Với CSS viewport `1440×900` và `deviceScaleFactor: 2`, authoritative bitmap phải có kích thước `2880×1800`, trừ khi công cụ chụp có rescale được khai báo — hồ sơ không khai báo rescale.

Tên file cũng thiếu suffix `_dpr2` đã khóa trong Review 001.

**Patch:** chụp lại:

```text
screenshots/option_a_desktop_1440x900_dpr2.png  # bitmap 2880×1800
screenshots/option_b_desktop_1440x900_dpr2.png  # bitmap 2880×1800
```

Ghi CSS viewport, device scale factor và bitmap dimensions trong JSON.

### F08 — Absolute author path còn trong package

Các tài liệu còn chứa `design-training/...`, gồm manifest, PROJECT, thesis, reference board, change ledger, image matrix và test matrix. Điều này vi phạm yêu cầu relative/portable package.

**Patch:** thay toàn bộ bằng:

```text
design-training/stream-b/module-012/
```

Không để drive letter, username hoặc path máy tác giả trong artifact.

### F09 — Control characters làm hỏng tài liệu

Kiểm tra byte phát hiện:

- `PROJECT.md`: 6 control characters ngoài tab/newline/CR;
- `TEST_MATRIX_DRAFT.md`: 3 control characters ngoài tab/newline/CR.

Chúng xuất hiện ở các chuỗi như `assets/` và `verify_module_012.js`, có dấu hiệu escape `\a`/`\v` bị chuyển thành byte điều khiển.

**Patch:** loại bỏ toàn bộ byte `0x00–0x08`, `0x0B`, `0x0C`, `0x0E–0x1F` khỏi text artifacts; giữ tab/newline/CR hợp lệ.

### F10 — Runtime có inline SVG ngoài asset governance

Source chứa:

- Direction A: 6 inline `<svg>`;
- Direction B: 2 inline `<svg>`.

Chúng không có entry trong manifest và một số dùng `stroke-width="2"`, trong khi icon contract mô tả family `1.75px`. Vì vậy claim “100% runtime graphical assets registered” chưa chính xác.

**Patch:** ưu tiên thay inline SVG bằng sáu icon file đã quản trị. Nếu cần icon mới, tạo file, thêm manifest entry và hash. Không tạo một family phụ không được contract hóa.

### F11 — Source candidate hash còn thiếu

Checkpoint chỉ ghi hash archive Module 07 R04. Chưa có hash của file candidate thực tế được dùng làm source snapshot.

**Patch:** ghi riêng:

```yaml
source_archive_sha256: e76ab08f...
source_candidate_relative_path: "..."
source_candidate_sha256: "..."
```

Nếu prototype không kế thừa trực tiếp HTML candidate mà chỉ kế thừa brief/data, ghi rõ `source_candidate_usage: REFERENCE_ONLY`.

### F12 — Claim “1 giây” vẫn còn trong Image Language Matrix

`IMAGE_LANGUAGE_MATRIX.md` vẫn ghi icon giúp người vận hành phân loại “chỉ trong 1 giây quét mắt”. Không có user-study protocol cho claim này.

**Patch:** đổi thành `DESIGN_INTENT hỗ trợ phân loại khi quét`, không dùng số thời gian.

## 6. Required checkpoint patch scope

Đây là vòng sửa checkpoint cuối. Chỉ được làm:

```yaml
allowed:
  - preserve_direction_a
  - remove_noncanonical_operational_details
  - de_militarize_direction_b
  - remove_vanity_metric
  - correct_claim_taxonomy
  - repair_test_matrix_status
  - repair_svg_failure_test_design
  - add_checkpoint_verification_json
  - replace_or_register_inline_icons
  - remove_absolute_paths_and_control_bytes
  - record_source_candidate_identity
  - recapture_two_dpr2_screenshots
forbidden:
  - final_candidate
  - selection_decision
  - module_13_work
  - cross_stream_write
  - unrelated_feature_addition
```

## 7. Resubmission package

Nộp:

```text
design_training_012_checkpoint_12_1_r02.zip
```

Giữ cấu trúc Review 001, bổ sung `CHECKPOINT_VERIFICATION.json`. Không cần tạo full `VERIFICATION.json`, final report hoặc 10 screenshot.

Submission message:

```yaml
submission_type: DESIGN_TRAINING_012_CHECKPOINT_12_1_R02
stream_id: B
package: design_training_012_checkpoint_12_1_r02.zip
package_sha256: "..."
package_bytes: 0
files_count: 0
source_archive_sha256: "..."
source_candidate_sha256: "..."
direction_a_preserved: true
direction_b_command_center_removed: true
fabricated_vanity_metrics: 0
noncanonical_partner_person_data: 0
absolute_author_paths: 0
invalid_control_characters: 0
inline_unregistered_svg_assets: 0
screenshot_css_viewport: "1440x900"
screenshot_dpr: 2
screenshot_bitmap_dimensions: "2880x1800"
checkpoint_checks_passed: 0
checkpoint_checks_total: 0
planned_final_tests_status: NOT_RUN
open_risks: []
```

## 8. Re-review boundary

Ở R02, Controller chỉ tái kiểm F01–F12. Nếu tất cả đóng:

```yaml
VERDICT: CHECKPOINT_APPROVED
PHASE_3_SELECTION_GATE: OPEN
PHASE_4_FINAL_CANDIDATE: OPEN_AFTER_SELECTION
MODULE_REPAIR_BUDGET_CONSUMED: 0/2
```

Nếu vẫn còn blocker evidence hoặc Direction B vẫn là command-center aesthetic, checkpoint sẽ `FAIL_CLOSED` và chuyển Lead Architect quyết định; không mở vòng checkpoint thứ ba.

## 9. Lệnh hiện hành

```yaml
ANTI_DIRECTIVE:
  action: REPAIR_CHECKPOINT
  target: DESIGN_TRAINING_012_CHECKPOINT_12_1_R02
  scope: F01-F12_ONLY
  direction_a: PRESERVE
  direction_b: REPAIR_WITHIN_CARTOGRAPHIC_THESIS
  phase_3: LOCKED
  phase_4: LOCKED
  module_013: LOCKED
  module_repair_budget_consumed: 0
```

