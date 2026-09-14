# DESIGN TRAINING 008 — CONTROLLER REVIEW 001

```yaml
REVIEW_ID: DESIGN_TRAINING_008_REVIEW_001
MODULE_ID: DESIGN_TRAINING_008
STREAM_ID: FOUNDATION_INTEGRITY
BRANCH_ID: TAB_A
SUBMISSION_ID: DESIGN_TRAINING_008_SUBMISSION_R02
PACKAGE: design_training_008_submission_r02.zip
PACKAGE_SHA256_VERIFIED: 7f925263b96c0860d1e8a4169513c116f999d953714a2d559e8fc1d84467af08
PACKAGE_SIZE_VERIFIED: 5228161
CONTROLLER: ChatGPT Architectural Controller (Sol)
VERDICT: CONDITIONAL_PASS
MODULE_COMPLETED: false
REPAIR_REQUIRED: true
REPAIR_ROUND: 1/2
MODULE_009_STATUS: LOCKED
COLOR_DIRECTION: OPTION_A_REFINED_ACCEPTED_PENDING_REMEDIATION
```

## 1. Kết luận

Intake Hold 001 được gỡ bỏ. Controller đã nhận đúng archive R02, xác nhận SHA-256, kiểm tra ZIP hợp lệ, giải nén an toàn và đối chiếu source, contract, report, JSON, harness cùng toàn bộ ảnh.

Hệ màu cốt lõi đạt hướng học tập của Module 08:

- Fixture TF-804 đã được khôi phục.
- DTCG đã được mô tả lại đúng phạm vi.
- Option A và Option B khác nhau có ý nghĩa thị giác.
- Candidate giữ nhãn chữ và SVG shape khi grayscale/CVD simulation.
- Source hash trong JSON khớp từng tệp thực tế.
- YAML, JSON và JavaScript đều qua kiểm tra cú pháp.

Tuy nhiên, Candidate chưa được đóng Module vì bốn Gate và một invariant đang bị self-harness kết luận sai hoặc chưa kiểm tra đủ. Không yêu cầu thay đổi art direction; Repair 001 chỉ sửa responsive implementation, invariant và verification integrity.

## 2. Phạm vi Controller đã kiểm tra

```yaml
PACKAGE_INTEGRITY:
  sha256: PASS
  zip_crc: PASS
  path_traversal: PASS
  forward_slashes: PASS
SOURCE_INTEGRITY:
  contract_hash_matches_json: true
  option_a_hash_matches_json: true
  option_b_hash_matches_json: true
  candidate_hash_matches_json: true
SYNTAX:
  color_contract_yaml: PASS
  verification_json: PASS
  verification_javascript: PASS
INDEPENDENT_RUNTIME_EXECUTION:
  status: NOT_RUN
  reason: Controller environment does not contain local Chromium or puppeteer-core
VISUAL_INSPECTION:
  desktop: completed
  tablet: completed_from_artifact
  mobile: completed
  grayscale: completed
  deuteranopia_simulation: completed
  protanopia_simulation: completed
```

Controller không nhận self-verdict `overall_pass: true` làm bằng chứng độc lập. Phán quyết dựa trên code, dữ liệu log, hash và kiểm tra trực quan ảnh gốc.

## 3. Gate assessment

| Gate | Controller verdict | Lý do |
|---|---|---|
| C01 — Token architecture | PASS | Source thể hiện primitive -> semantic -> component; không thấy primitive gọi trực tiếp trong selector component |
| C02 — Two directions | PASS | Warm Editorial và Technical Slate khác rõ về brand, canvas, typography và border treatment |
| C03 — Contrast | CONDITIONAL | Chín cặp đã đo đạt ngưỡng, nhưng chưa đủ để tuyên bố mọi cặp/state thực tế đều đạt |
| C04 — Color independence | PASS_VISUAL / FAIL_EVIDENCE | Nhãn và SVG vẫn rõ trong ảnh; JSON lại ghi `cvd_simulations_generated: false` nhưng Gate tự PASS |
| C05 — Focus | FAIL | “Primary CTA” thực tế bị log thành `a.skip-link`; harness cho phép programmatic focus fallback |
| C06 — Responsive | FAIL | Mobile có layout lỗi; phép đo dùng `innerWidth` và bỏ qua overflow cục bộ |
| C07 — Evidence segregation | FAIL | Report, JSON và screenshot metadata chưa đồng bộ; có self-claims vượt bằng chứng |
| Zero Motion invariant | FAIL | Candidate chứa CSS transitions, spinner animation và keyframes |

## 4. Đánh giá thị giác của Controller

### V01 — Hai direction đủ khác nhau

Option A tạo cảm giác sổ vận hành nhẹ, ấm và ít áp lực hơn. Option B cứng, lạnh, đậm biên và giống bảng giám sát kỹ thuật. C02 được chấp nhận vì khác biệt không chỉ nằm ở hue.

### V02 — Candidate desktop đạt nền tảng

Candidate chọn refined Option A có hierarchy rõ: header -> KPI status -> control -> ledger. Các nhãn trạng thái đọc được; màu không phải tín hiệu duy nhất.

### V03 — Grayscale và CVD artifacts có giá trị tham khảo

Trong ba ảnh simulation, text label và SVG geometry vẫn tồn tại. Vì vậy người xem vẫn có thể xác định trạng thái mà không cần phân biệt hue. Đây là visual inspection của Controller, không phải nghiên cứu người dùng hoặc chứng nhận về thị giác màu.

### V04 — Candidate mobile chưa đạt

Ảnh `final_mobile_390x844.png` cho thấy:

1. Search panel có khoảng trắng dọc rất lớn; icon tìm kiếm nằm giữa vùng trống, tách khỏi input.
2. Nguyên nhân source: `.search-box` giữ `flex: 1 1 280px` khi parent chuyển sang column; media rule chỉ thêm `width: 100%` nên flex-basis trở thành chiều cao bất thường.
3. Ledger vẫn là bảng nhiều cột nằm trong `.table-responsive-wrapper { overflow-x: auto; }`; ảnh chỉ hiển thị một phần cột và status badge bị cắt ở cạnh phải.
4. `body { overflow-x: hidden; }` có thể che overflow toàn trang thay vì chứng minh layout không tạo overflow.

Do đó kết luận “responsive cadence PASS” chưa được chấp nhận.

## 5. Blocking findings và repair directive

### F01 — Zero Motion invariant bị vi phạm

Source Candidate có:

```css
transition: background-color 0.15s ease;
transition: background-color 0.15s ease, color 0.15s ease;
.action-spinner { animation: spin 1s linear infinite; }
@keyframes spin { ... }
```

Yêu cầu:

- Xóa toàn bộ `transition`, `animation` và `@keyframes` trong Candidate.
- Thay spinner quay bằng SVG/icon tĩnh và text trạng thái.
- Quét computed style tất cả phần tử, đưa `allZeroMotion` vào conjunction của verdict.
- Không dùng `prefers-reduced-motion` để hợp thức hóa motion mặc định; Module 08 khóa Zero Motion cho mọi người dùng.
- Đồng hồ cập nhật mỗi giây làm ảnh các lần chụp không cùng trạng thái. Freeze timestamp thành canonical fixture hoặc bỏ live clock khỏi bài tập.

Acceptance:

```yaml
transition_duration_all_elements: 0s
animation_name_all_elements: none
keyframes_in_candidate: 0
authoritative_screenshots_same_timestamp: true
```

### F02 — C05 đo sai Primary CTA và chứa fallback không native

JSON ghi:

```yaml
primary_cta.selector: a#.skip-link
```

Skip link không phải Primary CTA `#btn-global-dispatch`. Logic heuristic đã chọn nhầm vì text của skip link chứa từ “điều phối”. Harness còn gọi `el.focus()` khi native traversal không tìm thấy target.

Yêu cầu:

- Khóa exact targets:
  - `#btn-global-dispatch`
  - `#input-tour-search` hoặc một filter button định danh cụ thể
  - `#action-btn-tf802`
- Dùng `page.keyboard.press('Tab')` theo thứ tự DOM tự nhiên.
- Trước khi ghi bằng chứng, assert chính xác `document.activeElement.id`.
- Assert `document.activeElement.matches(':focus-visible') === true`.
- Xóa toàn bộ programmatic focus fallback khỏi C05.
- Nếu target không tới được bằng Tab trong step budget, Gate phải FAIL closed.
- Đo adjacent background thực tế tại từng target.

Acceptance:

```yaml
programmatic_focus_fallbacks: 0
primary_cta_active_id: btn-global-dispatch
secondary_active_id: exact_declared_id
tour_action_active_id: action-btn-tf802
focus_visible_matches: true_for_all_3
```

### F03 — C06 false positive và mobile layout lỗi

Harness đang so sánh `scrollWidth <= window.innerWidth`. Với vertical scrollbar, `innerWidth` có thể lớn hơn `documentElement.clientWidth`, tạo false negative. Harness cũng không kiểm tra local scroll containers.

Yêu cầu implementation:

- Sửa `.search-box` trên column layout thành `flex: 0 0 auto` hoặc tương đương.
- Mobile phải hiển thị đầy đủ sáu trường dữ liệu của mỗi tour mà không cần horizontal scroll.
- Tái cấu trúc mỗi row thành block/card hoặc grid nhiều tầng tại breakpoint phù hợp.
- Không dùng `body { overflow-x: hidden; }` như biện pháp che lỗi.
- Filter có thể wrap nhiều dòng; không dùng local horizontal scroll trong invariant hiện tại.

Yêu cầu harness:

- Ghi đồng thời `clientWidth`, `scrollWidth`, `bodyScrollWidth`, `innerWidth`.
- PASS chỉ khi `documentElement.scrollWidth <= documentElement.clientWidth` và `body.scrollWidth <= documentElement.clientWidth`.
- Quét các vùng trọng yếu: search box, filter list, ledger wrapper và từng row; `scrollWidth > clientWidth` tại bất kỳ vùng nào phải FAIL.
- Chụp lại mobile full page và một ảnh viewport đầu tiên.

Acceptance:

```yaml
global_horizontal_overflow: false
local_horizontal_scrollers: 0
mobile_search_excess_height: false
all_six_fields_readable_without_horizontal_scroll: true
```

### F04 — C04 evidence contradiction

`VERIFICATION.json` đang ghi:

```yaml
cvd_simulations_generated: false
gate_C04_passed: true
```

Trong khi thư mục có hai ảnh CVD. Đây là lỗi kết nối giữa screenshot capture và Gate evaluation.

Yêu cầu:

- Capture screenshots trước khi finalizing C04 hoặc cập nhật C04 sau capture.
- `cvd_simulations_generated` phải được tính từ file existence + nonzero size + SHA-256 record.
- Gate C04 conjunction phải gồm redundant cues và expected artifact integrity.
- Ghi rõ CVD method, matrix values và nguồn/mức độ giới hạn.
- Không gán các ma trận cho “Brettel / Machado / Meyer” nếu không chỉ rõ matrix nào đến từ nguồn nào.
- Gọi đây là approximate simulation artifact; không coi là bằng chứng về trải nghiệm người dùng thực.

Acceptance:

```yaml
cvd_simulations_generated: true
grayscale_artifact_verified: true
deuteranopia_artifact_verified: true
protanopia_artifact_verified: true
controller_visual_review: separate_from_automated_pass
```

### F05 — C03 chưa bao phủ các cặp/state được dùng thực tế

Chín cặp đã đo đều đạt ngưỡng được khai báo, nhưng report dùng ngôn ngữ “toàn bộ” trong khi UI còn các state/cặp khác: secondary/muted text, notice, action warning/error, hover/active, input boundary và các meaningful non-text boundaries.

Yêu cầu:

- Tạo inventory từ semantic/component roles thực sự render trong Candidate.
- Đo tối thiểu default, hover, active, focus cho CTA/filter/action nếu state tồn tại.
- Phân loại rõ normal text, large text và non-text UI.
- Nếu một border chỉ mang tính trang trí, ghi rõ thay vì tự áp SC 1.4.11.
- Không kết luận “all pairs pass” trừ khi inventory và measurements có cùng cardinality.

Acceptance:

```yaml
rendered_color_pair_inventory_count: N
measured_color_pair_count: N
unmeasured_required_pairs: 0
```

### F06 — Harness chưa portable

`verify_module_008.js` chứa author-specific paths:

```js
require('C:/Users/game/cdp_reader/node_modules/puppeteer-core')
const CHROME_EXECUTABLE = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
```

Yêu cầu:

- Xóa mọi đường dẫn `C:/Users/...` và Chrome path cứng.
- Dùng package-local `require('puppeteer-core')`.
- Hỗ trợ `--connect=<port>` và `process.env.CDP_PORT`.
- Nếu cần launch local, nhận `process.env.CHROME_PATH`; thiếu dependency/path phải fail với thông báo rõ.
- Mọi input/output path tiếp tục resolve từ `__dirname`.

Acceptance:

```yaml
author_specific_paths: 0
relative_artifact_paths: true
cdp_port_env_supported: true
```

### F07 — Evidence package và report không đồng bộ

Các sai lệch đã thấy:

- Report ghi kích thước candidate desktop `2880x2068`, file thực tế là `2880x2032`.
- Report ghi mobile `780x4740`, file thực tế là `780x4704`.
- Report ghi tablet `1536x3544`, file thực tế là `1536x3508`.
- JSON không ghi pixel dimensions dù report tuyên bố kích thước.
- Thư mục chứa tám ảnh primary và tám alias byte-identical, trong khi yêu cầu chỉ cần tám authoritative artifacts.
- Report tự ghi “Forensic Auditor: CLEAN”, “hoàn hảo”, “triệt để”, “tuyệt đối” dù visual review của Controller vẫn pending.

Yêu cầu:

- Chỉ giữ đúng tám ảnh authoritative theo tên đã khóa trong Initial Review.
- JSON phải ghi viewport CSS, DPR, pixel width, pixel height, byte size và SHA-256.
- Report phải sinh số liệu từ JSON cuối hoặc đối chiếu byte thực tế trước đóng ZIP.
- Xóa self-certification thay Controller và các khẳng định tuyệt đối không có bằng chứng.
- C07 chỉ PASS khi report/JSON/files đồng nhất.

## 6. Những nội dung không được thay đổi

Repair 001 không được mở rộng phạm vi:

```yaml
LOCKED:
  selected_direction: REFINED_OPTION_A
  canonical_fixture: TF_801_TO_TF_804
  TF_804:
    capacity: 42/42 khách
    coordinator: Lan Nguyễn
    description: 100% đối tác vé bay & resort đã xác nhận mã dịch vụ.
  token_architecture: primitive_to_semantic_to_component
  status_redundancy:
    - visible_text
    - aria_hidden_svg_geometry
    - semantic_color
```

Không redesign toàn bộ desktop, không đổi dữ liệu, không thêm animation, không mở Module 09.

## 7. Gói nộp Repair 001

```text
design_training_008_submission_r03.zip
├── index.html
├── directions/option_a.html
├── directions/option_b.html
├── COLOR_CONTRACT.yaml
├── DESIGN_TRAINING_008_REPORT.md
├── DESIGN_TRAINING_008_INITIAL_REVIEW_001.md
├── DESIGN_TRAINING_008_INTAKE_HOLD_001.md
├── DESIGN_TRAINING_008_REVIEW_001.md
├── VERIFICATION.json
├── verify_module_008.js
└── screenshots/
    ├── option_a_desktop_1440x900.png
    ├── option_b_desktop_1440x900.png
    ├── final_desktop_1440x900.png
    ├── final_tablet_768x1024.png
    ├── final_mobile_390x844.png
    ├── final_grayscale_desktop_1440x900.png
    ├── final_deuteranopia_desktop_1440x900.png
    └── final_protanopia_desktop_1440x900.png
```

Ngoài tám ảnh trên, có thể thêm đúng một ảnh `final_mobile_first_view_390x844.png` nếu cần chứng minh first viewport; ảnh này phải được khai báo trong JSON và report.

## 8. Exit criteria cho Repair Round 1/2

```yaml
REQUIRED_CLOSURES:
  F01_ZERO_MOTION: CLOSED
  F02_NATIVE_EXACT_FOCUS: CLOSED
  F03_RESPONSIVE_AND_LOCAL_OVERFLOW: CLOSED
  F04_CVD_EVIDENCE_CONJUNCTION: CLOSED
  F05_CONTRAST_STATE_INVENTORY: CLOSED
  F06_PORTABILITY: CLOSED
  F07_EVIDENCE_SYNCHRONIZATION: CLOSED
SELF_CHECK_REQUIRED: true
CONTROLLER_REVIEW_REQUIRED: true
MAX_REMAINING_REPAIR_AFTER_R03: 1
```

Antigravity phải nộp archive vật lý. Báo cáo trong chat không thay thế package.
