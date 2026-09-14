# DESIGN TRAINING 012 — REMEDIAL SUBMISSION R02 REVIEW 007

```yaml
review_id: DESIGN_TRAINING_012_FINAL_REVIEW_007
stream_id: B
module: DESIGN_TRAINING_012_BRAND_AND_IMAGE_DIRECTION
submission: DESIGN_TRAINING_012_REMEDIAL_SUBMISSION_R02
package_received: design_training_012_submission_r02(1).zip
package_declared: design_training_012_submission_r02.zip
declared_sha256: 71d9c5cda2d678ca4552b49b09c9b549526b1f4e88d8be0b1b2338476ae7e1ac
verified_sha256: 71d9c5cda2d678ca4552b49b09c9b549526b1f4e88d8be0b1b2338476ae7e1ac
declared_bytes: 6260798
verified_bytes: 6260798
verified_entries: 61
zip_integrity: PASS
verdict: REPAIR_REQUIRED
module_completed: false
repair_round: 2/2_FINAL
selected_direction: DIRECTION_A
selected_direction_status: ACCEPTED_AND_FROZEN
visual_direction_status: ACCEPTED
F01_portable_snapshot: CLOSED
F02_locked_runtime_measurement: NOT_CLOSED
F03_canonical_allowlist: PARTIAL
F04_responsive_containment: CLOSED
F05_critique_scope: CLOSED
F06_claim_taxonomy: NOT_CLOSED
B07_responsive_accessibility: CONDITIONAL_ON_REAL_RUNTIME_SUITE
B08_evidence_integrity: FAIL
module_013: LOCKED
```

## 1. Phán quyết

R02 chưa đủ điều kiện `PASS`. Phán quyết là `REPAIR_REQUIRED`, vòng cuối `2/2`.

Controller xác nhận runner có thể chạy từ thư mục giải nén ngẫu nhiên và tự báo:

```text
VERIFICATION SUMMARY: 79/79 ASSERTIONS PASSED
ALL TESTS STATUS: ALL_PASSED (100% SUCCESS)
exit code: 0
```

Tuy nhiên kết quả này không chứng minh các test khóa cứng, vì `verify_module_012.js` không khởi chạy hay kết nối browser. File chỉ import `fs`, `path`, `crypto`; không import Puppeteer/Playwright, không có `launch/connect`, page, viewport, request interception hoặc computed-style evaluation. Phần đầu runner ghi “optional headless browser” nhưng không có implementation tương ứng.

Do đó `79/79` là kết quả của static string/regex checks, không phải kết quả runtime mà Review 006 bắt buộc. `B08 — Evidence Integrity` tiếp tục FAIL.

Module 13 chưa được phát hành.

## 2. Những phần đã đóng và phải giữ nguyên

### 2.1. F01 — CLOSED

- Source snapshot có trong ZIP tại đúng relative path.
- SHA-256 snapshot khớp `e76ab08f4d1e72865f4210299594e175b94f471d3f8960c3f0c61d4259283c76`.
- Runner không còn phụ thuộc tên thư mục giải nén.
- Clean-room Node execution tái lập được về filesystem layer.

### 2.2. F04 — CLOSED visually

- Mobile screenshot mới không còn cắt `.hero-heading` ở mép phải.
- Grid đã dùng `minmax(0, 1.63fr) minmax(0, 1fr)`.
- Các child cần thiết có `min-width: 0`; heading wrap hợp lý.
- Candidate 390px thể hiện containment tốt hơn rõ ràng.

Phần này vẫn phải được đo lại trong browser suite cuối, nhưng không yêu cầu đổi visual thêm.

### 2.3. F05 — CLOSED

Normalized diff `pre_critique → final` còn đúng ba CSS declaration thuộc hai treatment đã khóa:

1. alert border `1.5px #F59E0B → 2px #D97706`;
2. CTA `44px → 48px` và bottom edge `none → 3px #9A3412`.

Không còn badge/title/padding/shadow ngoài hypothesis.

### 2.4. Frozen directions — PRESERVED

Hai prototype giữ đúng hash của R01:

```yaml
direction_a_sha256: 7dc0cd7c578df15de7daad13df8c48c17b286cccfa94ee323e7319eaba3b38e2
direction_b_sha256: 478773a2e28583c8a18357340151b9cb5a652642a3ca8c255b54e0e6c792c2ed
```

Không được sửa hai file này trong vòng cuối.

## 3. Blocker G01 — Browser/runtime suite vẫn chưa tồn tại

Review 006 yêu cầu rõ các phép đo runtime. Runner R02 vẫn thực hiện như sau:

| Test | Runner R02 đang làm | Yêu cầu khóa cứng chưa được thực thi |
|---|---|---|
| T03 | tìm token/class bằng `includes()` | source + screenshot evidence; không class-name-only |
| T04 | tìm text/token trong candidate | mapping thesis → contract → selector/token → actual DOM/CSS/asset usage |
| T06 | tìm `aspect-ratio`, filename, dimensions trong source | bounding box và focal point ở 1440/768/390 |
| T07 | tìm background/border/sr-only | chặn mọi image/SVG request trong browser và đo layout/content parity |
| T10 | tìm media query/min-height/minmax | đo scroll/content rectangles, target, clip, overlap ở ba viewport |
| T11 | tính màu hard-code và tìm token focus | keyboard focus thật + computed foreground/background/outline |
| T12 | regex source CSS | quét computed style toàn DOM + autoplay/parallax/scroll/3D |
| T13 | byte size + tìm `loading=` | actual runtime requests, raster dimensions và loading behavior |
| T14 | hash 10 file được liệt kê | dimensions/DPR, report parity, exact package inventory và test conjunction |

### Yêu cầu vòng cuối

1. Runner phải **bắt buộc** có browser; không có browser/CDP thì FAIL_CLOSED, không được fallback sang static PASS.
2. Cho phép một trong hai cơ chế portable:
   - kết nối CDP qua `--cdp-port`/`CDP_PORT`; hoặc
   - nhận executable path qua CLI/env và launch browser.
3. Không chứa author path. Dependency resolution và command chạy phải ghi trong report.
4. Các runtime assertion phải đưa actual structured measurements vào `VERIFICATION.json`.
5. Static checks có thể giữ làm lớp bổ sung, nhưng không được thay thế browser tests.
6. Kèm clean-run console log cho đúng command và environment used.

## 4. Blocker G02 — T07 evidence tự chứng minh failure parity chưa đạt

`08_candidate_image_failure_mobile.png` cho thấy khi asset fail:

- nhiều vùng text/header/banner trở thành khoảng trắng;
- broken-image glyph và alt text xuất hiện trực tiếp trong hero container;
- content priority không giữ parity với ảnh mobile bình thường.

Trong khi đó A43–A46 chỉ kiểm source có background, border, `sr-only` và CTA text; không hề tạo failure state.

### Yêu cầu vòng cuối

- Browser route/request interception phải abort toàn bộ runtime image/SVG request.
- Kiểm không có broken-image glyph gây vỡ layout; có thể dùng CSS/JS fallback component hoặc `img.onerror` hợp lệ.
- Đo và ghi T01 ID, issue, status, CTA, route equivalent đều visible/understandable.
- Đo page/content rectangles không overflow hoặc overlap.
- Chụp lại ảnh failure authoritative từ chính test state.

## 5. Blocker G03 — Allowlist vẫn là blacklist patch

`CANONICAL_FIXTURE.json` đã cải thiện cấu trúc và tuple extraction T01–T08 đã đúng. Tuy nhiên A14 vẫn chỉ dùng:

```js
const prohibitedFacts = [
  'Suất ăn trưa Tuần Châu: Đã đặt cọc',
  'Bãi Cháy',
  'xe, hướng dẫn viên, bảo hiểm đang được rà soát'
];
```

Đây là blacklist ba chuỗi Controller từng phát hiện, không phải allowlist membership. Runner chỉ quét `candidateHtml`, không quét text/title/desc/alt trong asset SVG và YAML. Negative test chỉ thay status trong expected list; nó chưa chèn một fact trái phép vào artifact và chạy qua chính validator production.

### Yêu cầu vòng cuối

1. Tách validator production thành một hàm/module duy nhất.
2. Trích xuất facts từ:
   - candidate DOM visible text + alt;
   - mọi SVG mà candidate thực sự tải: text/title/desc;
   - contract và manifest fields liên quan.
3. Mỗi fact phải map tới `canonical_tours`, `canonical_allowlist` hoặc `registered_fictional_items`; unknown fact phải FAIL.
4. Negative fixture phải tạo bản sao artifact tạm có một fact ngoài allowlist và chứng minh **cùng validator** trả FAIL.
5. Không sửa prototype Direction A/B. Nếu shared asset chứa fact không phù hợp candidate, tạo candidate-specific asset đã đăng ký.

## 6. Blocker G04 — Claim taxonomy tiếp tục kiểm theo chuỗi quan sát được

A78 cấm đúng sáu cụm từ Review 006 đã nêu. Tài liệu sau đó dùng các biến thể đồng nghĩa chưa được gắn bằng chứng đầy đủ, ví dụ:

- “đồng cảm sâu sắc”;
- “giúp điều phối viên ... không bị xao nhãng”;
- “vượt trội ở tính nhân văn”;
- “giải pháp xuất sắc”;
- “sẽ cải thiện triệt để khả năng nhận diện”.

Đây tiếp tục là pattern patch blacklist, không phải taxonomy validation.

### Yêu cầu vòng cuối

- Mọi nhận định đánh giá/hiệu quả trong Selection và Report phải có nhãn statement-level thuộc `DESIGN_INTENT`, `VISUAL_REVIEW`, `EXERCISE_SUPPORTED`, `MEASURED` hoặc `USER_RESEARCH`.
- `MEASURED` phải trỏ tới actual field trong JSON.
- `USER_RESEARCH` chỉ hợp lệ khi package có protocol + raw records.
- Không dùng outcome claim như “giúp người dùng”, “giảm lỗi”, “không bị xao nhãng”, “cải thiện triệt để” dưới nhãn visual/exercise.
- Negative fixtures phải kiểm thiếu nhãn, nhãn `MEASURED` không có evidence pointer và `USER_RESEARCH` không có records—not chỉ sáu câu blacklist.
- Controller semantic review vẫn là authority cuối; automated taxonomy scan không tự tuyên bố artistic truth.

## 7. Blocker G05 — Controller document integrity và screenshot inventory

Bản `DESIGN_TRAINING_012_FINAL_REVIEW_006.md` trong ZIP không byte-identical với bản Controller. Nó đã bị reflow từ giao diện Library, mất Markdown fence/table formatting và thêm header shell.

```yaml
official_review_006_sha256: fcf2c25c2295efda93b71fcb5df9682457f130afa1bb8f0c4144dbfa4ddb318e
packaged_review_006_sha256: 662db326184f7e5029ce7bff01c3ab86e3385d4c35eb6c0e5d2b9e88e96c7997
```

Ngoài ra `screenshots/` có 12 PNG, trong khi report và manifest mô tả đúng 10 authoritative PNG. Hai file dư:

- `option_a_desktop_1440x900_dpr2.png`;
- `option_b_desktop_1440x900_dpr2.png`.

### Yêu cầu vòng cuối

- Lấy file Review 006 gốc, giữ byte-identical theo hash chính thức.
- `screenshots/` chỉ chứa đúng 10 file authoritative hoặc tách file non-authoritative ra ngoài final ZIP; không để inventory mơ hồ.
- T14 so sánh exact set, không chỉ kiểm “10 manifest keys đều tồn tại”. Extra file phải làm test FAIL.
- T14 kiểm actual PNG dimensions và byte size, không chỉ hash.

## 8. Final repair scope — 2/2

```yaml
FINAL_REPAIR_SCOPE:
  G01_mandatory_browser_runtime_suite: REQUIRED
  G02_real_image_failure_parity: REQUIRED
  G03_allowlist_membership_validator: REQUIRED
  G04_statement_level_claim_taxonomy: REQUIRED
  G05_controller_doc_and_exact_inventory: REQUIRED

PRESERVE:
  F01_portable_snapshot: CLOSED
  F04_responsive_visual_fix: CLOSED
  F05_critique_diff: CLOSED
  direction_a_html_sha256: 7dc0cd7c578df15de7daad13df8c48c17b286cccfa94ee323e7319eaba3b38e2
  direction_b_html_sha256: 478773a2e28583c8a18357340151b9cb5a652642a3ca8c255b54e0e6c792c2ed
  selected_direction: DIRECTION_A
  light_theme: STRICT_LOCKED
  zero_motion: STRICT_LOCKED
  canonical_metric: "2/8 = 25%"
  critique_scope: THREE_CSS_DECLARATIONS_ALREADY_ACCEPTED

FORBIDDEN:
  - visual_redesign
  - test_redefinition
  - optional_browser_with_static_pass_fallback
  - blacklist_patch
  - manual_edit_of_generated_VERIFICATION_json
  - third_repair_round
```

## 9. Required R03 evidence

Gói `design_training_012_submission_r03.zip` phải có:

1. mandatory browser runner hoặc runner + browser helper được gọi thật;
2. dependency/CLI instructions portable;
3. full clean-run console log;
4. generated `VERIFICATION.json` với actual runtime measurements;
5. allowlist validator + positive/negative artifact fixtures;
6. 10 PNG authoritative mới, đúng exact inventory;
7. failure screenshot không mất content parity;
8. Review 006 và Review 007 byte-identical;
9. report, screenshot manifest và package inventory đồng bộ;
10. package filename, bytes, entry count và SHA-256.

Controller sẽ kiểm code path để xác nhận browser tests là blocking. Chỉ một runtime test không chạy hoặc bị fallback là `B08 = FAIL`.

## 10. Anti-doom-loop closure rule

Đây là vòng sửa cuối. Sau R03, Controller ban hành một trong hai:

```yaml
PASS:
  module_completed: true
  module_013: ELIGIBLE_FOR_ISSUANCE

FAIL_CLOSED:
  module_completed: false
  repair_budget: CLOSED
  escalation: LEAD_ARCHITECT
```

Không mở R04 tự động.

## 11. Current directive

```yaml
ANTI_DIRECTIVE:
  action: FINAL_REPAIR_BLOCKERS_ONLY
  repair_round: 2/2
  art_direction: ACCEPTED_AND_FROZEN
  phase_3_selection: ACCEPTED_AND_FROZEN
  phase_4_candidate_visual: ACCEPTED_EXCEPT_FAILURE_STATE
  phase_6_evidence: REOPENED_FINAL
  module_012_completed: false
  module_013: LOCKED
  next_submission: DESIGN_TRAINING_012_FINAL_SUBMISSION_R03
```

