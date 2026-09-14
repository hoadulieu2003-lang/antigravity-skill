# DESIGN TRAINING 010 — DIRECTIVE
## Responsive & Inclusive Design · TRIPFLOW Disruption Response Board

```yaml
DIRECTIVE_ID: DESIGN_TRAINING_010
MODULE_ID: DESIGN_TRAINING_010_RESPONSIVE_INCLUSIVE_DESIGN
MODULE_NAME: RESPONSIVE_INCLUSIVE_DESIGN
STREAM_ID: FOUNDATION_INTEGRITY
BRANCH_ID: TAB_A
OWNER: "Anh — Lead Architect / Product Owner"
CONTROLLER: "ChatGPT Architectural Controller (Sol)"
EXECUTOR: "Antigravity"
ISSUED_DATE: 2026-09-14
PREREQUISITE: DESIGN_TRAINING_009_CLOSED_WITH_DEBT_BY_OWNER
IMPLEMENTATION_STATUS: BLOCKED_PENDING_FIRST_RESPONSE_REVIEW
MAX_REPAIR_ROUNDS: 2
TARGET_PACKAGE: design_training_010_submission_r01.zip
```

---

## 1. Mục tiêu đào tạo

Module 10 kiểm tra khả năng thiết kế một giao diện tác nghiệp giữ nguyên ý nghĩa, dữ liệu và hành động khi điều kiện sử dụng thay đổi mạnh:

- màn hình desktop, tablet, mobile dọc và mobile ngang;
- viewport tương đương 320 CSS px;
- chữ được phóng lớn đến 200%;
- người dùng ghi đè text spacing;
- nội dung tiếng Việt dài bất thường;
- thao tác bằng bàn phím, pointer thô và target nhỏ;
- thanh điều khiển sticky hoặc vùng nổi có nguy cơ che focus.

Responsive trong bài này không có nghĩa là “thu nhỏ desktop”. Candidate phải quyết định lại cách nhóm, thứ tự, mật độ và vị trí hành động theo không gian có sẵn, nhưng không được làm mất thông tin hoặc chức năng.

Inclusive trong bài này không được hiểu là chứng nhận toàn bộ sản phẩm phù hợp với mọi nhóm người dùng. Phạm vi chỉ gồm các ràng buộc và tình huống được khóa trong directive này. Mọi kết luận về trải nghiệm người dùng thật phải được ghi là hypothesis hoặc manual review pending nếu chưa có người thật kiểm tra.

---

## 2. Bối cảnh sản phẩm mới

TRIPFLOW mở thêm màn hình **Bảng xử lý gián đoạn tour** cho điều phối viên trực ca. Trong một ca làm, người dùng cần:

1. nhận biết tour nào cần xử lý trước;
2. tìm kiếm và lọc theo trạng thái;
3. đọc đủ thông tin tối thiểu của từng sự cố;
4. mở chi tiết mà không mất điều kiện lọc;
5. đánh dấu đã xem và quay lại đúng vị trí;
6. thực hiện toàn bộ tác vụ ở desktop hoặc điện thoại đặt dọc/ngang;
7. vẫn đọc và thao tác được khi chữ lớn hoặc khoảng cách chữ bị thay đổi.

Ứng dụng là single-page prototype dùng HTML, CSS và Vanilla JavaScript. Không backend, không đăng nhập, không dữ liệu thật và không network request.

```yaml
DATA_CLASSIFICATION: SYNTHETIC_TRAINING_FIXTURE
REAL_CUSTOMER_DATA: false
BUSINESS_PERFORMANCE_CLAIMS: none
```

---

## 3. Canonical fixture khóa cứng

Mốc thời gian quy chiếu:

```yaml
reference_time: "2026-09-14 18:00 ICT"
```

Candidate, baseline, hai direction, report và harness phải dùng đúng sáu tuple dưới đây. Không đổi ID, copy, dấu câu, người phụ trách, thời gian hoặc trạng thái.

| ID | Mức chú ý | Tour | Khởi hành | Phụ trách | Khách | Sự cố | Việc tiếp theo | Trạng thái |
|---|---|---|---|---|---:|---|---|---|
| `IR-1001` | `CRITICAL` | `TF-802 · Tour Fansipan Sapa 2 Ngày 1 Đêm` | `2026-09-15 06:30 ICT` | `Lan Nguyễn` | `18` | `Chưa chốt được xe trung chuyển phù hợp cho hành khách sử dụng xe lăn tại điểm đón số 3.` | `Xác nhận phương án xe thay thế trước 04:30.` | `Cần xử lý` |
| `IR-1002` | `HIGH` | `TF-803 · Tour Hạ Long Du Thuyền 5 Sao` | `2026-09-15 08:00 ICT` | `Huy Trần` | `24` | `Cảng vụ phát cảnh báo dông lốc; giờ rời bến có thể thay đổi.` | `Kiểm tra thông báo cảng vụ lúc 05:30 và cập nhật cho đoàn.` | `Chờ cập nhật` |
| `IR-1003` | `MEDIUM` | `TF-804 · Tour Đảo Phú Quốc Sunset 3 Ngày 2 Đêm` | `2026-09-16 09:45 ICT` | `Mai Đỗ` | `42` | `Hai hành khách cần lối lên xuống ít bậc và vị trí ngồi gần cửa.` | `Xác nhận xe đón có bậc hỗ trợ và giữ hai ghế hàng đầu.` | `Đang phối hợp` |
| `IR-1004` | `MEDIUM` | `TF-805 · Tour Tràng An - Bái Đính 1 Ngày` | `2026-09-16 07:30 ICT` | `An Phạm` | `35` | `Nhà hàng đề nghị chuyển giờ ăn trưa từ 11:30 sang 12:15.` | `Đối chiếu lịch tham quan trước khi chấp thuận thay đổi.` | `Đang phối hợp` |
| `IR-1005` | `LOW` | `TF-806 · Hành trình Di sản miền Trung dành cho nhóm gia đình nhiều thế hệ` | `2026-09-17 05:45 ICT` | `Nguyễn Hoàng Minh Anh` | `31` | `Danh sách phòng có một tên hành khách dài hơn giới hạn hiển thị dự kiến của bản cũ.` | `Giữ nguyên tên đầy đủ; không cắt bằng dấu ba chấm nếu không có cách xem lại.` | `Chờ cập nhật` |
| `IR-1006` | `RESOLVED` | `TF-807 · Tour Mekong Buổi Sáng` | `2026-09-18 06:00 ICT` | `Bình Lê` | `16` | `Điểm đón cũ tạm đóng để sửa đường; điểm đón thay thế đã được xác nhận.` | `Không cần hành động thêm.` | `Đã ổn định` |

Mức chú ý phải có nhãn chữ tiếng Việt và ký hiệu/hình học; không được chỉ dùng màu. Chỉ `IR-1001` được dùng làm spotlight mặc định nếu direction có spotlight.

---

## 4. Nội dung và hành vi khóa cứng

### 4.1. Copy bắt buộc

```yaml
page_heading: "Bảng xử lý gián đoạn tour"
page_description: "Theo dõi tình huống ảnh hưởng đến hành trình và giữ nguyên ngữ cảnh xử lý trên mọi kích thước màn hình."
search_label: "Tìm theo mã tour, tên tour hoặc nội dung sự cố"
clear_filters: "Xóa điều kiện"
detail_action: "Xem chi tiết"
back_action: "Quay lại bảng xử lý"
acknowledge_action: "Đánh dấu đã xem"
acknowledged_state: "Đã xem"
empty_state: "Không có tình huống phù hợp với điều kiện hiện tại."
result_singular: "1 tình huống"
result_plural: "{count} tình huống"
```

### 4.2. Primary workflow navigation

- `Tất cả`: `IR-1001`–`IR-1006`.
- `Cần xử lý`: `IR-1001`.
- `Đang phối hợp`: `IR-1003`, `IR-1004`.
- `Chờ cập nhật`: `IR-1002`, `IR-1005`.
- `Đã ổn định`: `IR-1006`.

Search và workflow navigation kết hợp theo phép giao AND. Search phải trim khoảng trắng, không phân biệt hoa/thường và hỗ trợ tìm tiếng Việt không dấu trên ID, tour, sự cố, việc tiếp theo và người phụ trách.

### 4.3. Detail lifecycle

1. Kích hoạt `Xem chi tiết` mở detail view trong cùng page.
2. Detail phải hiển thị đủ chín trường canonical.
3. `Đánh dấu đã xem` là trạng thái giao diện cục bộ; không đổi canonical operational status.
4. Phản hồi `Đã xem` phải có text và programmatic state (`aria-pressed` hoặc cấu trúc semantic tương đương), không chỉ đổi màu.
5. `Quay lại bảng xử lý` bảo toàn search, workflow, matched IDs, count, scroll position hợp lý và trả focus về đúng trigger vừa mở.
6. Không dùng async network FSM trong Module 10; mục tiêu là adaptive layout và context preservation.

---

## 5. Baseline bắt buộc

`baseline/index.html` dùng đúng canonical fixture nhưng cố ý chứa đúng bảy defect sau, kèm banner:

> Bản mẫu baseline có lỗi responsive và inclusive có chủ đích — không dùng trong sản phẩm thật.

| Defect | Observed defect khóa cứng |
|---|---|
| `DEF-R01` | App shell có `min-width: 1180px`, tạo horizontal overflow ở 320/390px. |
| `DEF-R02` | Mobile ẩn cột “Khách” và “Việc tiếp theo”, gây mất thông tin. |
| `DEF-R03` | Tên tour và người phụ trách dài bị ellipsis, không có cơ chế xem đầy đủ. |
| `DEF-R04` | Giao diện hiển thị thông báo yêu cầu xoay ngang trên portrait, hạn chế orientation. |
| `DEF-R05` | Sticky action bar che phần tử đang focus khi viewport thấp hoặc text scale 200%. |
| `DEF-R06` | Control chính chỉ khoảng 32×32 CSS px và mức chú ý chỉ được phân biệt bằng màu. |
| `DEF-R07` | Text spacing override làm cắt nhãn tab, nút và nội dung card. |

Baseline là đối tượng audit, không phải mẫu thiết kế để sửa trực tiếp thành candidate. Report phải phân loại defect thành observed evidence, relevant criterion/risk và candidate response; không tự gắn nhãn toàn bộ là confirmed WCAG failure nếu chưa đủ bằng chứng.

---

## 6. Hai direction bắt buộc

Anti phải tạo hai chiến lược thực sự khác nhau trên cùng fixture và hành vi:

### Direction A — Adaptive Ledger

- Desktop ưu tiên bảng/lưới đối chiếu nhiều trường.
- Tablet giảm số cột nhưng không ẩn dữ liệu; thông tin chuyển vào sub-row hoặc disclosure rõ ràng.
- Mobile tái cấu trúc thành card nhiều tầng; hành động giữ gần ID/priority.
- Quan hệ giữa label và value phải còn rõ khi table semantics không còn phù hợp.

### Direction B — Priority Stack

- Không lấy bảng desktop làm hình học gốc.
- Dùng danh sách phân cấp theo mức chú ý, mỗi item có summary và vùng chi tiết nội tuyến hoặc detail view.
- Desktop mở rộng bằng intrinsic columns; mobile giữ cùng mô hình đọc dọc.
- Ưu tiên continuity giữa các kích thước hơn mật độ so sánh hàng ngang.

First Response phải so sánh ít nhất năm chiều:

1. tốc độ quét nhiều bản ghi trên desktop;
2. khả năng đọc đầy đủ trên 320px;
3. hành trình bàn phím;
4. rủi ro mất ngữ cảnh khi đổi view;
5. khả năng chịu text scale/text spacing/long content.

Chỉ chọn một direction cho candidate sau khi Controller phê duyệt First Response.

---

## 7. Invariants

```yaml
theme: LIGHT_THEME_ONLY
motion: ZERO_MOTION
transitions: 0
animations: 0
smooth_scroll: false
auto_rotating_content: false
horizontal_page_overflow: forbidden
hidden_canonical_fields_on_small_screens: forbidden
color_as_only_signal: forbidden
content_order_css_dom_mismatch: forbidden
user_input_innerHTML_interpolation: forbidden
```

Additional project rules:

- Mọi primary control phải hướng tới effective target tối thiểu 44×44 CSS px. Báo cáo phải tách đây là project invariant khỏi ngưỡng/ngoại lệ của WCAG SC 2.5.8.
- Không khóa portrait hoặc landscape.
- Không dùng CSS `order` để tạo reading order khác DOM order.
- Không dùng `overflow-x: hidden` để che lỗi.
- Không truncate canonical text trừ khi có cơ chế trên cùng page để tiếp cận toàn bộ nội dung bằng bàn phím và pointer.
- Sticky/fixed content không được che toàn bộ phần tử đang focus.
- Không sao chép harness hoặc claim chưa được promote từ Module 09.

---

## 8. Nguồn chuẩn và ranh giới diễn giải

Các trang Understanding của W3C là tài liệu giải thích, không phải nội dung normative thay thế WCAG 2.2 Recommendation. Báo cáo phải tách rõ tiêu chí chuẩn, technique lựa chọn và invariant riêng của bài tập.

1. [WCAG 2.2 Recommendation](https://www.w3.org/TR/WCAG22/)
2. [Understanding SC 1.4.10 Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)
3. [Understanding SC 1.4.4 Resize Text](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html)
4. [Understanding SC 1.4.12 Text Spacing](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html)
5. [Understanding SC 1.3.4 Orientation](https://www.w3.org/WAI/WCAG22/Understanding/orientation.html)
6. [Understanding SC 2.5.8 Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
7. [Understanding SC 2.4.11 Focus Not Obscured (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html)

Ranh giới bắt buộc:

- Reflow 320 CSS px cho phép vertical scrolling; không đồng nghĩa mọi table luôn bị cấm horizontal scrolling. Riêng bài này project invariant yêu cầu không có page-level hoặc component-level horizontal scroll.
- Text scale simulation không được gọi là browser zoom nếu chỉ inject CSS font size.
- Text Spacing không yêu cầu tác giả đặt mặc định các giá trị test; yêu cầu nội dung không mất khi người dùng override.
- Orientation yêu cầu không hạn chế view/operation vào một hướng trừ trường hợp essential; fixture này không có ngoại lệ essential.
- SC 2.5.8 dùng 24×24 CSS px cùng các ngoại lệ nêu trong tiêu chí; 44×44 là yêu cầu nghiêm hơn của dự án.
- Automated telemetry không chứng minh usability hoặc trải nghiệm của người khuyết tật ngoài những thuộc tính được đo.

---

## 9. Gates R01–R07

### Gate R01 — Canonical Data & Content Parity

Pass khi:

- đủ đúng sáu tuple và chín trường;
- search/workflow mapping đúng;
- không mất, tự sửa hoặc bịa dữ liệu;
- baseline, directions và candidate có content parity;
- long name/copy giữ nguyên và có thể đọc đầy đủ.

### Gate R02 — Adaptive Information Architecture

Pass khi:

- có hai direction khác nhau về mô hình cấu trúc, không chỉ đổi breakpoint/token;
- candidate có design thesis và lý do lựa chọn;
- 1440, 768, 390, 320 và 844×390 đều giữ đủ thông tin/hành động;
- thay đổi vị trí/nhóm không làm sai DOM/reading order;
- desktop density và mobile readability đều được Controller xem ảnh.

### Gate R03 — Reflow, Resize & Text Spacing

Pass khi:

- 320×800 không có page/component horizontal scroll theo project invariant;
- text scale 200% không mất nội dung/chức năng và cho phép cuộn dọc;
- text spacing override theo SC 1.4.12 không clip/overlap/truncate nội dung bắt buộc;
- long-content stress không làm vỡ layout;
- detector chạy trên initial, filtered, empty, detail và acknowledged states cần thiết.

### Gate R04 — Orientation, Focus & Input Targets

Pass khi:

- portrait và landscape đều vận hành được, không có rotate-device gate;
- native Tab/Shift+Tab/Enter/Space journey hoàn tất search → filter → detail → acknowledge → back;
- focus không rơi body, không bị sticky/fixed content che hoàn toàn;
- back phục hồi đúng trigger;
- mọi primary control đạt project target 44×44; SC 2.5.8 được báo riêng theo đúng ngưỡng và ngoại lệ.

### Gate R05 — Inclusive Perception & Semantics

Pass khi:

- mức chú ý và acknowledged state không dùng màu làm tín hiệu duy nhất;
- landmarks, headings, list/table semantics và accessible names phù hợp với direction;
- result count/empty/acknowledged feedback có text và announcement phù hợp mà không cướp focus;
- forced-colors inspection không làm biến mất border/focus/selected state thiết yếu;
- không tuyên bố screen-reader PASS khi chưa có manual operator evidence.

### Gate R06 — Context Preservation & Interaction Integrity

Pass khi:

- AND filtering đúng;
- mở detail/back giữ query, workflow, count, IDs và focus trigger;
- acknowledged UI state không làm đổi canonical operational status;
- reset đưa về sáu item và focus về search;
- user-derived text được render bằng `textContent`/DOM API, không nội suy `innerHTML`.

### Gate R07 — Evidence Integrity & Bounded Claims

Pass khi:

- report tách Telemetry, Visual Review, Design Hypothesis và Manual Review Pending;
- verification fail-closed, không hard-code gate result;
- source/docs/JSON/ảnh có exact manifest và hash ledger đồng bộ;
- detector có tối thiểu positive controls cho overflow, missing selector, focus obscuration và ledger mismatch;
- script tái chạy portable bằng dependency manifest, CLI/`CDP_PORT`, đường dẫn tương đối;
- không nhập hoặc tự tuyên bố đã thanh toán verification debt của Module 09.

---

## 10. Locked test matrix T01–T14

| Test | Kịch bản | Expected result |
|---|---|---|
| `T01` | Load default | Đủ `IR-1001`–`IR-1006`; đúng count; không lỗi/truncation giả. |
| `T02` | Search `  XE LAN  ` | Chỉ `IR-1001`; trim/case/unaccented pass. |
| `T03` | Workflow `Đang phối hợp` | Đúng `IR-1003`, `IR-1004`. |
| `T04` | Workflow `Chờ cập nhật` + search `nguyen hoang minh anh` | Đúng `IR-1005`. |
| `T05` | Query không khớp; reset | Empty state; reset về sáu item và focus search. |
| `T06` | Mở `IR-1005` | Đủ chín trường; tên dài và toàn bộ copy đọc được. |
| `T07` | Acknowledge `IR-1001` | Text `Đã xem`, programmatic state đúng; operational status vẫn `Cần xử lý`. |
| `T08` | Back từ `IR-1005` trong filtered state | Query/workflow/IDs/count giữ nguyên; focus về trigger `IR-1005`. |
| `T09` | Native keyboard journey | Không pointer/programmatic focus; hoàn thành search/filter/detail/acknowledge/back; 0 body focus. |
| `T10` | Viewport matrix | 1440×900, 768×1024, 390×844, 320×800, 844×390: không mất data/action, không horizontal scroll. |
| `T11` | Text scale 200% tại 320×800 | Không mất chức năng, clip hoặc overlap; vertical scroll hợp lệ. |
| `T12` | Text spacing override | Áp dụng bốn giá trị SC 1.4.12; không mất content/function. |
| `T13` | Long-content + orientation stress | Portrait/landscape đều dùng được; long fixture không bị inaccessible truncation. |
| `T14` | Forced-colors, target, focus obscuration, evidence integrity | Required subtests đều executed; unsupported không biến thành PASS; ledger đồng bộ. |

Tất cả test phải bắt đầu từ precondition rõ ràng hoặc reset độc lập. Không dùng kết quả test trước làm tiền điều kiện ngầm cho test sau.

---

## 11. Evidence policy

### 11.1. Telemetry được phép kết luận

- kích thước viewport/client/scroll;
- bounding rect và local scroller;
- DOM order, active element và focus restoration;
- visible/hidden state;
- canonical values và matched IDs;
- computed styles, target size và forced-colors capability;
- hash, bytes, pixel dimensions và manifest.

### 11.2. Không được suy ra chỉ từ telemetry

- “dễ dùng hơn cho mọi người”;
- “giảm tải nhận thức”;
- “hoàn hảo trên mọi thiết bị”;
- “đạt chứng nhận WCAG toàn diện”;
- screen-reader speech output chưa được người thật ghi nhận.

### 11.3. Harness discipline

- Không gán sẵn `PASS`, `true`, count hoặc hash rồi dùng lại làm bằng chứng.
- Missing selector, invalid color, unsupported required capability, missing artifact hoặc false gate phải tạo `SELF_CHECK_FAIL` và exit code 1.
- Positive control phải gọi chính detector production, không chỉ kiểm tra browser primitive.
- Không yêu cầu harness tự đọc file ZIP đang được tạo sau khi harness chạy. Exact package manifest được kiểm tra bởi packaging verification riêng; source evidence manifest phải được harness kiểm tra trước đóng gói.

---

## 12. Authoritative screenshots

Yêu cầu đúng 14 ảnh PNG, DPR=2 nếu môi trường hỗ trợ; tên file khóa cứng:

1. `baseline_desktop_1440x900.png`
2. `baseline_mobile_390x844.png`
3. `direction_a_desktop_1440x900.png`
4. `direction_a_mobile_390x844.png`
5. `direction_b_desktop_1440x900.png`
6. `direction_b_mobile_390x844.png`
7. `final_desktop_1440x900.png`
8. `final_tablet_768x1024.png`
9. `final_mobile_portrait_390x844.png`
10. `final_mobile_landscape_844x390.png`
11. `final_reflow_320x800.png`
12. `final_text_scale_200_percent_320x800.png`
13. `final_text_spacing_320x800.png`
14. `final_long_content_mobile_390x844.png`

Ảnh full-page phải được mô tả là full-page; không ghi kích thước ảnh bằng kích thước viewport. Ledger phải ghi riêng viewport, DPR, actual PNG width/height, byte size, hash, state và capture method.

---

## 13. Deliverables

```text
design_training_010_submission_r01.zip
├── baseline/
│   └── index.html
├── directions/
│   ├── option_a.html
│   └── option_b.html
├── index.html
├── RESPONSIVE_CONTRACT.yaml
├── DESIGN_TRAINING_010_DIRECTIVE.md
├── DESIGN_TRAINING_010_FIRST_RESPONSE.md
├── DESIGN_TRAINING_010_REPORT.md
├── VERIFICATION.json
├── verify_module_010.js
├── package.json
├── README.md
└── screenshots/
    └── 14 authoritative PNG files
```

Internal ZIP paths phải dùng `/`; không path traversal, duplicate entry, author-machine absolute path hoặc packaging helper. Report links dùng đường dẫn tương đối.

---

## 14. Required First Response — chưa được code

Trước khi triển khai, Anti chỉ được tạo `DESIGN_TRAINING_010_FIRST_RESPONSE.md` gồm đúng năm phần:

1. `RESEARCH_PLAN`: diễn giải có giới hạn các nguồn ở Section 8.
2. `BASELINE_AUDIT_PLAN`: cách chứng minh đúng bảy defect, không vượt claim.
3. `TWO_RESPONSIVE_DIRECTIONS`: cấu trúc, content order và trade-offs của A/B trên desktop/mobile.
4. `CANONICAL_CONTENT_AND_INTERACTION_MODEL`: xác nhận sáu tuple, mapping filter và detail lifecycle.
5. `TEST_MATRIX_DRAFT`: cách thực thi T01–T14, state setup, detector boundaries và positive controls.

First Response phải ghi rõ:

```yaml
IMPLEMENTATION_STATUS: BLOCKED_PENDING_CONTROLLER_FIRST_RESPONSE_REVIEW
CODE_WRITTEN_BEFORE_APPROVAL: false
MODULE_009_DEBT_IMPORTED: false
```

Không tạo `baseline/`, `directions/`, `index.html` hoặc harness chức năng trước khi Controller ban hành `IMPLEMENTATION_AUTHORIZATION: GRANTED`.

---

## 15. Quy tắc nghiệm thu

```yaml
VERDICT_OPTIONS:
  - PASS
  - REPAIR_REQUIRED
  - FAIL_CLOSED
MODULE_COMPLETED_REQUIRES:
  - R01
  - R02
  - R03
  - R04
  - R05
  - R06
  - R07
MAX_REPAIR_ROUNDS: 2
OWNER_WAIVER: RECORDED_SEPARATELY_IF_USED
```

Controller có quyền giữ candidate ở trạng thái visual accepted nhưng từ chối claim của harness. Không có self-assessment nào tự động trở thành Controller verdict.

---

## 16. Anti Directive

```yaml
action: START_RESEARCH_AND_FIRST_RESPONSE_ONLY
required_output: DESIGN_TRAINING_010_FIRST_RESPONSE.md
implementation_authorization: NOT_GRANTED
stop_condition: WAIT_FOR_CONTROLLER_FIRST_RESPONSE_REVIEW
```

Antigravity phải dừng sau First Response và chờ phê duyệt. Không thi công sớm.
