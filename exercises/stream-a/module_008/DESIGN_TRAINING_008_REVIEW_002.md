# DESIGN TRAINING 008 — CONTROLLER REVIEW 002

```yaml
REVIEW_ID: DESIGN_TRAINING_008_REVIEW_002
MODULE_ID: DESIGN_TRAINING_008
STREAM_ID: FOUNDATION_INTEGRITY
BRANCH_ID: TAB_A
SUBMISSION_ID: DESIGN_TRAINING_008_SUBMISSION_R03
PACKAGE: design_training_008_submission_r03.zip
PACKAGE_SHA256_VERIFIED: c90394ae70427a4bf2314300c0b6ef1c44442ba8fa4012df4083e5b1094a20f7
PACKAGE_SIZE_VERIFIED: 2810895
CONTROLLER: ChatGPT Architectural Controller (Sol)
VERDICT: CONDITIONAL_PASS
MODULE_COMPLETED: false
REPAIR_REQUIRED: true
REPAIR_ROUND: 2/2
REPAIR_ROUNDS_REMAINING_AFTER_THIS: 0
MODULE_009_STATUS: LOCKED
COLOR_DIRECTION: OPTION_A_REFINED_ACCEPTED
VISUAL_DIRECTION_REDESIGN_REQUIRED: false
```

## 1. Phán quyết

Repair Round 1 đã đóng phần lớn lỗi của Review 001. Gói R03 hợp lệ, có thể giải nén an toàn; SHA-256, kích thước, CRC, định dạng đường dẫn và 19 tệp đều đúng. Chín ảnh authoritative có kích thước, byte size và SHA-256 khớp `VERIFICATION.json`. Source hashes của contract, hai direction và Candidate cũng khớp tệp thực tế.

Hướng màu Option A Refined được chấp nhận. Không yêu cầu thiết kế lại màu hoặc thay đổi dữ liệu canonical.

Module chưa thể đóng vì C01, C03, C06 và C07 vẫn còn sai lệch giữa điều kiện PASS với bằng chứng thực tế; Candidate còn một lỗi responsive nhìn thấy rõ và FSM đi kèm chưa bảo toàn invariant focus như báo cáo ngụ ý. Đây là vòng sửa cuối 2/2.

## 2. Phạm vi thẩm định độc lập

```yaml
PACKAGE_INTEGRITY:
  sha256: PASS
  size: PASS
  zip_crc: PASS
  path_traversal: PASS
  forward_slashes: PASS
  entry_count: 19
SOURCE_AND_METADATA:
  json_syntax: PASS
  yaml_syntax: PASS
  javascript_syntax: PASS
  source_hashes_match: true
  screenshot_metadata_exact_match: true
VISUAL_INSPECTION:
  option_a_desktop: completed
  option_b_desktop: completed
  candidate_desktop: completed
  candidate_tablet: completed
  candidate_mobile: completed
  grayscale: completed
  deuteranopia_artifact: completed
  protanopia_artifact: completed
INDEPENDENT_RUNTIME_EXECUTION:
  status: NOT_RUN
  reason: Controller environment does not provide Chromium or puppeteer-core
```

Controller không dùng `overall_verdict: PASS` của chính harness làm bằng chứng độc lập. Phán quyết dựa trên kiểm tra source, logic harness, JSON, hash, PNG binary metadata và ảnh gốc.

## 3. Gate assessment

| Gate | Controller verdict | Kết luận |
|---|---|---|
| C01 — Token architecture | FAIL_EVIDENCE | Component token vẫn tham chiếu primitive trực tiếp; harness chỉ quét selector nên bỏ sót lỗi trong `:root` |
| C02 — Two directions | PASS | Warm Editorial và Technical Slate khác có ý nghĩa về canvas, brand, typography và border strategy |
| C03 — Contrast | FAIL_EVIDENCE | Inventory tự khai báo 24 mục nhưng một số state dùng hex cứng, không được kích hoạt/đo từ DOM; nhiều vai trò render thực tế còn thiếu |
| C04 — Color independence | PASS_WITH_SOURCE_REPAIR | Ảnh và redundant cues đạt mục tiêu bài tập; attribution của hai matrix chưa được chứng minh chính xác |
| C05 — Focus indicator | PASS | Ba exact target được tới bằng Tab native; `:focus-visible`, width, style và adjacent contrast được ghi đúng |
| C06 — Responsive | CONDITIONAL | Không còn horizontal overflow và sáu trường đều hiện; caption bảng bị vỡ nghiêm trọng ở tablet/mobile |
| C07 — Evidence segregation | FAIL | Official Review 001 trong ZIP không byte-identical; report vẫn có self-certification và contract chưa khớp FSM thực tế |
| Zero Motion invariant | PASS | Candidate không còn transition, animation, keyframes; timestamp đã đóng băng |

## 4. Đánh giá thị giác

### V01 — Color direction được chấp nhận

Option A có nền giấy ấm, ink tối và accent trạng thái vừa đủ; Option B có canvas lạnh, brand indigo và biên đậm hơn. Hai hướng khác nhau về chiến lược chứ không chỉ đổi hue. Candidate Refined A giữ hierarchy rõ: data notice → header/action → KPI → controls → ledger.

### V02 — Màu không phải tín hiệu duy nhất

Ở ảnh grayscale, bốn trạng thái vẫn có nhãn tiếng Việt và SVG shape khác nhau. Ở hai ảnh CVD approximation, Attention và Error tiến gần nhau về hue, nhưng người xem vẫn phân biệt được qua nhãn và hình học. Đây là visual inspection của Controller, không phải kết quả nghiên cứu người dùng có CVD.

### V03 — Desktop đạt, mobile/tablet còn lỗi caption

Desktop đọc tốt và bảng có mật độ hợp lý. Mobile đã chuyển thành stacked cards, không bị cắt cột và không cần cuộn ngang.

Tuy nhiên, tại 768px và 390px, caption `Bảng điều phối tour synthetic (TF-801 đến TF-804)` co thành một cột rất hẹp, mỗi dòng chỉ còn một hoặc vài từ. Ở tablet, lỗi này tạo một vùng trắng lớn bên phải caption trước khi hàng đầu tiên bắt đầu. Vì vậy `allRowsHaveAllFields === true` chưa đủ để kết luận responsive cadence PASS.

### V04 — First viewport mobile còn nặng nhưng không chặn Module 08

Phần data disclaimer, brand tag và tên Candidate lặp lại nhiều lần làm viewport đầu tiên dày và đẩy controls xuống sâu. Đây là nợ content/hierarchy có thể chuyển sang Module 11; không phải blocker của hệ màu nếu không phát sinh overflow hoặc mất nội dung.

## 5. Blocking findings — Repair Round cuối 2/2

### R01 — C01 bỏ sót primitive leakage trong component tokens

`index.html` vẫn có component tokens tham chiếu trực tiếp primitive:

```css
--dispatch-table-row-hover-bg: var(--primitive-warm-neutral-50);
--dispatch-filter-tab-bg: var(--primitive-static-white);
--dispatch-filter-tab-text: var(--primitive-slate-700);
```

Ngoài ra `--dispatch-card-shadow` chứa màu `rgba(...)` trực tiếp. Điều này mâu thuẫn với contract “component → semantic → primitive”. Harness hiện chỉ tìm `var(--primitive-*)` trong selector không phải `:root`, nên tự ghi `primitive_calls_in_component_selectors: 0` dù provenance vẫn sai.

Yêu cầu:

1. Tạo semantic token còn thiếu cho table-row-hover, filter surface/text và shadow color/value hoặc xác định rõ shadow là non-color token được quản trị ở tầng thích hợp.
2. Mọi `--dispatch-*` phải tham chiếu `--color-*` hoặc semantic token hợp lệ; không gọi `--primitive-*`, không chứa hex/rgb/rgba màu trực tiếp.
3. Harness phải parse riêng các khai báo `--dispatch-*` trong `:root` của cả Candidate và hai direction.
4. C01 phải FAIL closed nếu contract thiếu, tier thiếu, component token unresolved, primitive leakage tồn tại hoặc các cờ taxonomy/brand segregation chưa được tính từ source. Không gán `true` cố định.

Acceptance:

```yaml
component_token_count: N
component_tokens_resolved_to_semantic: N
component_to_primitive_direct_refs: 0
component_literal_color_values: 0
unresolved_component_tokens: 0
hardcoded_architecture_pass_flags: 0
```

### R02 — C03 “24/24 computed measurements” chưa đúng sự thật

Trong `REQUIRED_COLOR_PAIRS`, các mục sau lấy màu khai báo cứng thay vì kích hoạt state và đo computed style:

- `primary_cta_hover`
- `primary_cta_active`
- `search_input_placeholder`
- ba focus ring entries

Hàm đo còn fallback về `#0F172A` / `#FAF9F6` khi selector hoặc màu không resolve, sau đó vẫn tăng `measuredCount`. Vì vậy cardinality 24/24 không chứng minh 24 state đã render và được đo.

Inventory cũng bỏ sót một số vai trò thực sự xuất hiện: notice banner/tag, header direction tag, clock text/boundary, KPI labels/subtext, emergency action default/hover, secondary button hover và footer/muted text. Có thể deduplicate các cặp màu vật lý giống nhau, nhưng phải ánh xạ đầy đủ mọi semantic/component role đang render vào cặp đã đo.

Yêu cầu:

1. Tạo `rendered_role_inventory` từ DOM/CSS Candidate, với mỗi role trỏ tới một `pair_id` đã đo.
2. Hover: dùng `page.hover(exactSelector)` rồi đọc `getComputedStyle`.
3. Active: dùng pointer down giữ trạng thái hoặc một cơ chế runtime thực, đọc computed style trong lúc `:active`, sau đó pointer up.
4. Placeholder: dùng `getComputedStyle(input, '::placeholder')` nếu Chromium hỗ trợ; nếu không, ghi `UNSUPPORTED` và không tính như computed measurement.
5. Focus: tiếp tục dùng kết quả C05 native Tab; không lặp lại bằng hex cứng trong C03.
6. Selector không tồn tại, pseudo-state không kích hoạt, màu transparent không resolve hoặc phép đo lỗi phải làm Gate FAIL closed; cấm fallback sang màu mặc định.
7. Bổ sung emergency action và các state thực tế còn thiếu; phân loại rõ text, large text, meaningful non-text và decorative.

Acceptance:

```yaml
rendered_role_inventory_count: N
roles_mapped_to_measured_pairs: N
unmapped_rendered_roles: 0
runtime_computed_pair_count: M
hardcoded_pair_measurements: 0
missing_selector_fallbacks: 0
state_activation_failures: 0
all_required_pairs_pass: true
```

### R03 — C06 phải sửa caption và nâng phép kiểm khả năng đọc

Nguyên nhân thị giác: khi `.dispatch-table` chuyển sang `display: block`, caption vẫn giữ table-caption geometry nên co hẹp bất thường.

Yêu cầu:

1. Đưa tiêu đề bảng ra ngoài table thành heading/label block, hoặc đặt caption mobile/tablet thành block/full inline-size theo cách semantic hợp lệ.
2. Caption phải đọc theo dòng tự nhiên tại 768px và 390px, không tạo vùng trắng lớn.
3. Giữ nguyên stacked-card structure, đủ sáu trường và zero local/global horizontal overflow.
4. Harness không được coi `cells.length >= 6` là “readable”. Bổ sung rect/visibility checks: mỗi value có width/height dương, nằm trong row/card, không bị clip, không tạo local overflow; caption width phải đạt ngưỡng hợp lý so với ledger container.
5. Chụp lại tablet full page, mobile full page và mobile first viewport.

Acceptance:

```yaml
caption_fragmented: false
caption_width_ratio_to_ledger: ">= 0.70"
all_six_fields_present: true
all_six_fields_visible_and_not_clipped: true
global_horizontal_overflow: false
local_horizontal_scrollers: 0
```

### R04 — CVD matrix attribution chưa đủ căn cứ

Harness gán hai ma trận hằng số cho “Brettel et al. (1997) approximate projection”, nhưng không cung cấp phép suy dẫn hoặc vị trí trong nguồn chứng minh chính các hệ số đó. Paper Brettel mô tả thuật toán/projection theo không gian màu; chỉ nêu tên paper không đủ để gán trực tiếp hai ma trận 5×4 này cho tác giả.

Yêu cầu chọn một trong hai hướng:

1. Dùng một implementation có provenance rõ, ghi chính xác tên thuật toán/version, không gian màu, transformation pipeline và trích dẫn tới nguồn chứa/derive đúng hệ số; hoặc
2. Giữ ma trận hiện tại nhưng đổi tên trung thực thành `MODULE_APPROXIMATION_MATRIX`, bỏ attribution Brettel/Machado và nói rõ đây chỉ là heuristic visualization không được xác thực khoa học.

Trong cả hai hướng, thêm `color-interpolation-filters` được lựa chọn có chủ đích (`sRGB` hoặc `linearRGB`) và ghi trong JSON; kết quả ảnh phụ thuộc không gian nội suy này.

Tài liệu tham khảo để Anti đối chiếu phương pháp, không được dùng như bằng chứng tự động cho chính hệ số hiện tại:

- [Brettel, Viénot & Mollon (1997) — Computerized simulation of color appearance for dichromats](https://vision.psychol.cam.ac.uk/jdmollon/papers/Dichromat_simulation.pdf)
- [Machado, Oliveira & Fernandes (2009) — A Physiologically-based Model for Simulation of Color Vision Deficiency](https://www.inf.ufrgs.br/~oliveira/pubs_files/CVD_Simulation/Machado_Oliveira_Fernandes_CVD_Vis2009_final.pdf)

Acceptance:

```yaml
matrix_provenance: explicit_and_verifiable_or_module_heuristic
unsupported_author_attribution: false
filter_color_interpolation_space: explicitly_recorded
clinical_or_user_research_claim: false
```

### R05 — FSM/contract vẫn không bảo toàn focus ổn định

Candidate thay `container.innerHTML` ở FAILURE, tạo node Retry mới rồi gọi `retryBtn.focus()`. Các callback còn gọi `this.focus()` vô điều kiện. `auditFsmFocusPreservation` chỉ kiểm tra 100ms đầu và dùng `btn.focus()` + `btn.click()` lập trình, nên chưa chứng minh failure/retry/no-steal.

`COLOR_CONTRACT.yaml` cũng ghi `Programmatic focus shift`, trong khi các module trước đã khóa bài học stable action và no-steal.

Yêu cầu:

1. Giữ một action button node xuyên suốt IDLE → VALIDATING → SAVING → FAILURE → retry → CONFIRMED; chỉ đổi label/content/state attributes.
2. Không thay node bằng `innerHTML` của container.
3. Không gọi `this.focus()` vô điều kiện sau timer. Nếu người dùng đã Tab đi nơi khác, success không được cướp focus.
4. Dùng native keyboard/pointer trong harness; ghi node identity, active element trong first saving, failure, retry saving, success và một no-steal scenario.
5. Đồng bộ `COLOR_CONTRACT.yaml` với implementation thực tế.

Acceptance:

```yaml
single_stable_action_node: true
same_node_first_saving_failure_retry_success: true
body_focus_events: 0
no_steal_after_user_moves_focus: true
programmatic_focus_in_harness: 0
contract_matches_runtime_fsm: true
```

### R06 — Official review file bị biến đổi và report còn self-certification

Tệp `DESIGN_TRAINING_008_REVIEW_001.md` trong ZIP không byte-identical với bản Controller phát hành:

```yaml
controller_sha256: 24f1ac56be2f55292fd35c5f8afeb1c942a4620329cda96c33fce49cd0b52011
packaged_sha256: 2b63d8ccd9fcf7a3271f0241c7417c0b0e91b62d4b34d646ee43c231e4180df7
byte_identical: false
```

Khác biệt chủ yếu là Markdown bị reflow và mất cấu trúc heading/code fence, nhưng tài liệu Controller phải được lưu nguyên byte. Report dòng kết luận vẫn tự nói các phát hiện đã được “giải quyết triệt để” trong khi visual review đang chờ Controller.

Yêu cầu:

1. Đưa nguyên bản byte-identical `DESIGN_TRAINING_008_REVIEW_001.md` và `DESIGN_TRAINING_008_REVIEW_002.md` vào gói cuối.
2. Không reflow, copy lại từ chat hoặc sửa formatting tài liệu Controller.
3. Report chỉ ghi `SELF_CHECK_PASS` hoặc `SUBMITTED_FOR_CONTROLLER_REVIEW`; bỏ mọi câu tự chứng nhận đã đóng hoàn toàn/triệt để.
4. Đồng bộ source hashes, ảnh, JSON, report và contract sau mọi sửa đổi.

Acceptance:

```yaml
review_001_byte_identical: true
review_002_byte_identical: true
self_certification_claims: 0
source_hashes_match: true
screenshot_metadata_match: true
```

## 6. Những phần được giữ nguyên

Không thay đổi:

- Bốn tuple TF-801 đến TF-804.
- Art Direction Option A Refined.
- Light Theme.
- Brand/status separation về ý đồ.
- Text label + SVG shape + color cho bốn trạng thái.
- Hai direction A/B, trừ sửa token provenance và zero-regression cần thiết.
- Zero Motion.

## 7. Gói nộp cuối

Tên bắt buộc:

```text
design_training_008_submission_r04.zip
```

Thành phần tối thiểu:

```text
design_training_008_submission_r04.zip
├── index.html
├── directions/
│   ├── option_a.html
│   └── option_b.html
├── COLOR_CONTRACT.yaml
├── DESIGN_TRAINING_008_REPORT.md
├── DESIGN_TRAINING_008_INITIAL_REVIEW_001.md
├── DESIGN_TRAINING_008_INTAKE_HOLD_001.md
├── DESIGN_TRAINING_008_REVIEW_001.md
├── DESIGN_TRAINING_008_REVIEW_002.md
├── VERIFICATION.json
├── verify_module_008.js
└── screenshots/
    ├── option_a_desktop_1440x900.png
    ├── option_b_desktop_1440x900.png
    ├── final_desktop_1440x900.png
    ├── final_tablet_768x1024.png
    ├── final_mobile_390x844.png
    ├── final_mobile_first_view_390x844.png
    ├── final_grayscale_desktop_1440x900.png
    ├── final_deuteranopia_desktop_1440x900.png
    └── final_protanopia_desktop_1440x900.png
```

Loại bỏ `package_zip_008.py` khỏi gói phát hành nếu nó không phải artifact bắt buộc; packaging helper không phải bằng chứng nghiệm thu.

## 8. Điều kiện đóng Module 08

Module 08 chỉ được ký `PASS` khi:

```yaml
C01: PASS
C02: PASS
C03: PASS
C04: PASS_WITH_BOUNDED_CLAIM
C05: PASS
C06: PASS
C07: PASS
ZERO_MOTION: PASS
R01_TO_R06: CLOSED
CONTROLLER_VISUAL_REVIEW: PASS
MODULE_COMPLETED: true
PROMOTION_STATUS: APPROVED
```

Nếu R04 vẫn còn blocker sau đối soát, ngân sách sửa Module 08 đã hết. Controller sẽ dừng, không tự mở thêm vòng và báo Lead Architect quyết định.

