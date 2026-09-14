# DESIGN TRAINING 012 — FINAL SUBMISSION R01 REVIEW 006

```yaml
review_id: DESIGN_TRAINING_012_FINAL_REVIEW_006
stream_id: B
module: DESIGN_TRAINING_012_BRAND_AND_IMAGE_DIRECTION
submission: DESIGN_TRAINING_012_FINAL_SUBMISSION_R01
package: design_training_012_submission_r01.zip
declared_sha256: 79c0883e5b7c1912402ba3701d64598a30209f78bc7e2e7d3bf909b93b3e9daf
verified_sha256: 79c0883e5b7c1912402ba3701d64598a30209f78bc7e2e7d3bf909b93b3e9daf
declared_bytes: 2913590
verified_bytes: 2913590
declared_files: 43
verified_files: 43
zip_integrity: PASS
verdict: REPAIR_REQUIRED
module_completed: false
repair_round: 1/2
selected_direction: DIRECTION_A
selected_direction_status: ACCEPTED_AND_FROZEN
visual_direction_status: ACCEPTED_WITH_RESPONSIVE_REPAIR
evidence_debt_status: NOT_RECONCILED
independent_runner_result: 75/79_ASSERTIONS_PASS
independent_runner_exit_code: 1
B08_evidence_integrity: FAIL
B07_responsive_accessibility: FAIL
phase_6: REOPENED_FOR_BLOCKERS_ONLY
module_013: LOCKED
```

## 1. Phán quyết

Gói R01 **không đạt nghiệm thu cuối**. Phán quyết là `REPAIR_REQUIRED`, vòng sửa `1/2`.

Controller chạy trực tiếp `node verify_module_012.js` từ bản ZIP đã giải nén. Kết quả thực tế:

```text
VERIFICATION SUMMARY: 75/79 ASSERTIONS PASSED
ALL TESTS STATUS: FAILED
exit code: 1
```

Bốn assertion thất bại:

- `A01`: runner phụ thuộc tên đường dẫn chứa `stream-b` hoặc `module-012`;
- `A02`: `source_snapshot/design_training_007_submission_r04.zip` không có trong ZIP;
- `A03`: vì thiếu snapshot nên không thể xác minh SHA-256 nguồn;
- `A79`: conjunction đúng đã trả FAIL do ba lỗi trên.

Ngoài lỗi tái lập, nhiều test khóa cứng đã bị giảm từ đo browser/runtime thành tìm chuỗi trong source. Do đó file `VERIFICATION.json` đóng gói với tuyên bố `79/79 PASS` không phản ánh kết quả độc lập và không đủ để đóng Evidence Debt.

Module 13 chưa được phát hành.

## 2. Những phần đạt và phải bảo toàn

### 2.1. Package integrity — PASS

- SHA-256, byte size và 43 file khớp khai báo.
- ZIP hợp lệ, dùng forward slash và không lỗi nén.
- Có đủ hai prototype, candidate, contract, selection record, runner, report, JSON và 10 screenshot.
- Governance Waiver 005 trong ZIP khớp SHA-256 Controller: `67ba772b0d903ce5837e8cd72b87650814df011781c007f11a8a08f65bde1e44`.
- Mười screenshot vật lý khớp toàn bộ SHA-256 và byte size trong `SCREENSHOT_MANIFEST.json` khi Controller đối soát độc lập.

### 2.2. Selection — ACCEPTED

- Direction A được chọn rõ ràng với `94/100`; Direction B đạt `86/100` và được lưu trữ riêng.
- Quyết định dùng nhãn confidence `EXERCISE_SUPPORTED`.
- Candidate giữ DNA Human Field Intelligence; không có dấu hiệu lai giao diện Route Signal System.

Direction A và lựa chọn Phase 3 được **khóa bảo toàn**. Vòng sửa không được thiết kế lại art direction.

### 2.3. Visual quality — ACCEPTED WITH TARGETED REPAIR

- Art direction editorial ấm, typography serif/sans, nền giấy và vector field-scene tạo bản sắc riêng, không rơi vào generic AI SaaS.
- T01 có trọng tâm thị giác rõ; hệ icon, disclosure và hierarchy đủ tốt cho bài tập.
- Desktop thể hiện direction đã chọn thuyết phục.

Chỉ được sửa containment/responsive defect và các thay đổi compliance chung nêu trong review này.

## 3. F01 — Final package không tái lập được T01

Runner khai báo evidence path:

```text
source_snapshot/design_training_007_submission_r04.zip
```

nhưng archive không chứa file đó. `A01` còn phụ thuộc tên thư mục nơi Controller giải nén, nên cùng một gói có thể PASS hoặc FAIL chỉ vì tên path bên ngoài.

### Yêu cầu sửa

1. Đưa snapshot R04 thật vào đúng `source_snapshot/` và xác minh hash `e76ab08f...`.
2. Thay assertion tên-path bằng metadata bất biến trong package, ví dụ `stream_id: B`, danh sách path cho phép và kiểm tra không có `stream-a/`.
3. Runner phải PASS khi giải nén vào một thư mục ngẫu nhiên bất kỳ.
4. Không đọc source snapshot từ workspace tác giả bên ngoài ZIP.

## 4. F02 — Locked browser/runtime tests bị thay bằng string checks

Directive Mục 17 khóa phương pháp đo. Runner R01 chỉ dùng Node built-in, đọc chuỗi HTML và không khởi chạy browser. Các sai lệch chính:

| Test | Hợp đồng khóa cứng | Runner R01 thực hiện | Kết quả review |
|---|---|---|---|
| T03 | khác ≥5/7 trục với evidence source/screenshot; không class-name-only | `html.includes(...)` theo tên class/token | `INSUFFICIENT` |
| T04 | thesis → contract → selector/token → DOM/CSS/asset usage | tìm một vài chuỗi trong candidate | `INSUFFICIENT` |
| T06 | đo bounding box và focal point tại 1440/768/390 | tìm `aspect-ratio`, filename và kích thước text | `NOT_EXECUTED` |
| T07 | chặn/đổi đường dẫn ảnh trong browser, kiểm layout và broken icon | tìm background/border/sr-only trong source | `NOT_EXECUTED` |
| T10 | đo overflow, target, clipping và overlap tại ba viewport | tìm media query, `overflow-x:auto`, `min-height` | `NOT_EXECUTED` |
| T11 | computed contrast, focus indicator thật, non-color meaning | tính năm cặp màu hard-code và tìm token focus | `PARTIAL` |
| T12 | quét computed style toàn DOM | regex trên source CSS | `NOT_EXECUTED` |
| T13 | raster dimensions, loading, runtime request count | byte size và tìm `loading=` | `PARTIAL` |
| T14 | screenshot hash/dim/DPR, report parity, ZIP manifest | chỉ đếm 10 filename tồn tại | `NOT_EXECUTED` |

### Yêu cầu sửa

- Dùng browser automation portable (`puppeteer-core`/Playwright theo môi trường được ghi rõ), không chứa author path.
- Ghi `expected`, `actual`, selector/asset/file và viewport cho từng phép đo.
- Test request interception/network events thực tế; không suy ra `remote_requests: 0` từ regex URL.
- T07 phải cố ý làm hỏng **mọi runtime image/SVG request** trong candidate, sau đó đo content priority, CTA, route text, status và layout.
- T10 phải đo `scrollWidth <= clientWidth`, bounding rectangle, target `>=44×44`, clipping và overlap cho directions + pre-critique + final ở cả ba viewport.
- T11 phải kích hoạt focus bằng keyboard và đọc computed style của phần tử thực.
- T12 phải quét computed style mọi DOM element; kiểm thêm autoplay, parallax, scroll hijack và 3D effect.
- T14 phải tự tính hash/size/dimensions của 10 PNG, kiểm DPR metadata/protocol, report parity T01–T13 và nội dung ZIP/package manifest.

Giữ nguyên 14 test và tổng 79 assertions. Không đổi tên/nội dung test để đạt PASS.

## 5. F03 — ED-03 và ED-04 chưa được tất toán

Runner không có canonical allowlist hoặc schema validator. T02 chỉ kiểm mỗi trường canonical có xuất hiện **ở đâu đó** trong toàn bộ HTML; nó không trích xuất tuple theo row/ID và không phát hiện fact bổ sung.

Candidate/asset vẫn chứa các operational facts ngoài eight-tuple fixture, ví dụ:

- địa danh và hoạt cảnh `Bãi Cháy`, `Cảng Tuần Châu`, xuống du thuyền/giữ chỗ tàu;
- `xe, hướng dẫn viên, bảo hiểm` đang được rà soát;
- danh sách đoàn và dịch vụ tham quan đã được rà soát đầy đủ;
- thông tin suất ăn và điều kiện dịch vụ đã được kiểm tra;
- `Suất ăn trưa Tuần Châu: Đã đặt cọc` trong SVG.

Đây chính là pattern mà Governance Waiver 005 cấm: thay blacklist cũ bằng nội dung mới nhưng chưa chứng minh membership trong allowlist.

### Yêu cầu sửa

1. Tạo canonical fixture/allowlist độc lập, machine-readable.
2. Trích xuất từng row T01–T08 theo cấu trúc DOM và deep-compare giá trị thực, không dùng six independent `includes()` trên toàn trang.
3. Mọi operational fact trong HTML/SVG/YAML/alt/desc phải thuộc canonical fixture hoặc một fictional fixture được gắn nhãn và đăng ký rõ.
4. Thêm negative fixture đưa một fact không hợp lệ vào bản sao tạm; validator bắt buộc FAIL.
5. Không được sửa Direction A/B đã khóa; nếu cần làm sạch asset dùng cho candidate, tạo candidate-specific asset/manifest entry thay vì làm thay đổi prototype nguồn.

## 6. F04 — Responsive defect hiện hữu nhưng T10 tự báo PASS

Ảnh authoritative `05_candidate_mobile_390x844.png` cho thấy:

- `.hero-heading` bị cắt ở mép phải;
- nội dung hero card vượt vùng nhìn;
- `overflow-x:hidden` ở `html` và `body` che overflow thay vì giải quyết layout.

Nguyên nhân CSS có khả năng cao gồm grid item không có `min-width: 0` và nội dung nowrap/min-content ép chiều rộng. Ở desktop, `grid-template-columns: 62% 38%` cộng `gap: 32px` cũng vượt 100% container.

### Yêu cầu sửa

- Dùng track co giãn thực, ví dụ `minmax(0, 62fr) minmax(0, 38fr)` hoặc công thức tương đương.
- Đặt `min-width: 0` đúng các grid/flex child cần thiết.
- Cho text dài wrap hợp lý; không dùng `overflow-x:hidden` như bằng chứng không overflow.
- Browser test phải FAIL nếu content rectangle vượt viewport dù page scrollbar bị ẩn.
- Chụp lại toàn bộ screenshot liên quan sau sửa.

## 7. F05 — Critique diff vượt tuyên bố “hai thay đổi”

Diff `pre_critique → final` không chỉ có hai thay đổi được nêu trong hypothesis. Ngoài viền alert và CTA, diff còn thay:

- padding alert;
- box-shadow alert;
- padding CTA;
- title document;
- badge text hiển thị;
- nhiều comment/label trạng thái.

### Yêu cầu sửa

1. Áp dụng mọi compliance/evidence/responsive patch chung lên cả `pre_critique.html` và `index.html`.
2. Giữ final diff đúng tối đa hai thay đổi thiết kế liên quan trực tiếp đến một hypothesis.
3. Với hypothesis hiện tại, phạm vi an toàn là:
   - thay đổi treatment viền alert;
   - thay đổi treatment CTA chính.
4. Loại bỏ hoặc đồng bộ các thay đổi title, badge, padding, shadow ngoài hypothesis.
5. Runner phải xuất normalized diff summary và assertion về critique scope.

## 8. F06 — Claim taxonomy bị tái vi phạm

`SELECTION_DECISION.md` và report quay lại dùng các kết luận chưa có user research như:

- “thấu hiểu sâu sắc”;
- “giảm tải nhận thức”;
- “phòng ngừa sai sót vận hành”;
- “mang tính sống còn”;
- “focal point hoàn hảo”;
- “render hoàn hảo 100%”.

### Yêu cầu sửa

- Chuyển các câu này thành `DESIGN_INTENT`, `VISUAL_REVIEW` hoặc `EXERCISE_SUPPORTED` phù hợp.
- Chỉ dùng `MEASURED` cho số liệu do runner thực sự đo và xuất actual value.
- Không dùng ngôn ngữ hiệu quả người dùng khi không có protocol và raw records.
- Thêm rule kiểm claim taxonomy trong runner, kèm negative fixture.

## 9. Repair scope 1/2

```yaml
REPAIR_SCOPE:
  F01_portable_snapshot_and_workspace_assertion: REQUIRED
  F02_restore_locked_runtime_measurement_depth: REQUIRED
  F03_canonical_allowlist_and_negative_fixture: REQUIRED
  F04_responsive_containment: REQUIRED
  F05_exact_critique_scope: REQUIRED
  F06_honest_claim_taxonomy: REQUIRED

PRESERVE:
  selected_direction: DIRECTION_A
  direction_a_source: BYTE_PRESERVE
  direction_b_source: BYTE_PRESERVE
  brand_thesis: PRESERVE_UNLESS_TAXONOMY_ONLY
  light_theme: STRICT_LOCKED
  zero_motion: STRICT_LOCKED
  canonical_metric: "2/8 = 25%"
  test_contract: T01_TO_T14_79_ASSERTIONS_IMMUTABLE

FORBIDDEN:
  - visual_redesign
  - new_features
  - test_redefinition
  - hiding_overflow_as_fix
  - assertion_by_declaration
  - claim_of_pass_before_clean_reproduction
```

## 10. Required R02 evidence

Gói `design_training_012_submission_r02.zip` phải kèm:

1. source snapshot thật trong ZIP;
2. portable executable runner và dependency/launch instructions;
3. clean-run console log từ một thư mục giải nén mới;
4. `VERIFICATION.json` sinh từ clean run, không chỉnh tay;
5. canonical allowlist/schema + positive/negative fixture evidence;
6. runtime measurements cho 1440/768/390;
7. request-failure evidence;
8. normalized critique diff evidence;
9. 10 screenshot mới và manifest hash/dimension/DPR;
10. report đã đồng bộ với actual results;
11. package filename, bytes, file count và SHA-256.

Controller sẽ tự giải nén vào path ngẫu nhiên và chạy đúng command được ghi trong report. Nếu command không tái lập `79/79`, `B08` tự động FAIL.

## 11. Current directive

```yaml
ANTI_DIRECTIVE:
  action: REPAIR_BLOCKERS_ONLY
  repair_round: 1/2
  phase_3_selection: ACCEPTED_AND_LOCKED
  art_direction_a: ACCEPTED_AND_FROZEN
  phase_6: REOPENED
  module_012_completed: false
  module_013: LOCKED
  next_submission: DESIGN_TRAINING_012_FINAL_SUBMISSION_R02
```

Module 13 chỉ được phát hành sau khi Module 12 đạt `PASS` bằng bằng chứng tái lập độc lập.

