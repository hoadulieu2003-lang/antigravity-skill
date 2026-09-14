# DESIGN TRAINING 010 — FIRST RESPONSE REVIEW 001
## Responsive & Inclusive Design · TRIPFLOW Disruption Response Board

```yaml
DOCUMENT_ID: DESIGN_TRAINING_010_FIRST_RESPONSE_REVIEW_001
DIRECTIVE_ID: DESIGN_TRAINING_010
MODULE_ID: DESIGN_TRAINING_010_RESPONSIVE_INCLUSIVE_DESIGN
STREAM_ID: FOUNDATION_INTEGRITY
BRANCH_ID: TAB_A
OWNER: "Anh — Lead Architect / Product Owner"
CONTROLLER: "ChatGPT Architectural Controller (Sol)"
EXECUTOR: "Antigravity"
REVIEW_DATE: 2026-09-14
REVIEWED_SUBMISSION: "Pasted markdown(20260914-155643).md"
REVIEWED_SUBMISSION_SHA256: df3fc56a6d365b32680f7578d209ac2547145b0561149f2752423b3069c6f59e
VERDICT: FIRST_RESPONSE_CHANGES_REQUIRED
IMPLEMENTATION_AUTHORIZATION: NOT_GRANTED
IMPLEMENTATION_STATUS: BLOCKED_PENDING_CONTROLLER_FIRST_RESPONSE_R02_REVIEW
CODE_WRITTEN_BEFORE_APPROVAL: false
PLANNING_REPAIR_BUDGET_CONSUMED: 0/2
MODULE_009_DEBT_IMPORTED: false
```

---

## 1. Kết luận điều hành

First Response có cấu trúc tốt, đủ năm phần bắt buộc, phân biệt đúng nguồn chuẩn, tài liệu Understanding và project invariant; hai direction khác nhau về hình học và mô hình đọc; detail lifecycle cùng phép giao AND được mô tả đúng tinh thần directive.

Chưa cấp quyền triển khai vì còn bảy điểm kế hoạch phải sửa trước khi viết code. Đây là vòng hiệu chỉnh First Response, không tiêu thụ ngân sách hai repair rounds của sản phẩm triển khai.

---

## 2. Những phần được chấp nhận

1. Ba khai báo quản trị bắt buộc đều đúng: implementation còn bị khóa, chưa viết code và không nhập nợ kiểm chứng Module 09.
2. Research Plan phân biệt đúng 320 CSS px, text scale simulation với browser zoom, ngưỡng WCAG 24×24 và project target 44×44.
3. Baseline Audit Plan bao phủ đủ `DEF-R01`–`DEF-R07` và đưa ra candidate response tương ứng.
4. Direction A — Adaptive Ledger và Direction B — Priority Stack khác nhau thực sự về mô hình cấu trúc, không chỉ đổi token hoặc breakpoint.
5. Search normalization, workflow mapping, acknowledged local state và context-preserving detail view bám đúng đặc tả.
6. Test Matrix giữ đủ `T01`–`T14` và có bốn nhóm positive control theo Directive.

Những phần này không cần viết lại nếu việc sửa các finding bên dưới không tác động tới chúng.

---

## 3. Planning Findings bắt buộc

### P01 — Canonical fixture bị sai nguyên văn

Trong `IR-1002`, First Response ghi:

> `TF-803 · Tour Hạ Long Du Th thuyền 5 Sao`

Canonical copy khóa cứng là:

> `TF-803 · Tour Hạ Long Du Thuyền 5 Sao`

Yêu cầu sửa đúng chuỗi và thêm bước deep equality cho cả sáu tuple, đủ chín trường mỗi tuple. Không dùng từ “byte-identical” cho text lấy từ DOM; dùng exact string/code-point equality sau khi đọc `textContent` mà không normalize nội dung canonical.

### P02 — Các kết luận về trải nghiệm phải được hạ thành hypothesis

Bảng so sánh direction đang dùng các kết luận chưa có bằng chứng người dùng như “rất cao (vượt trội)”, “rất thấp”, “mượt mà”, “người dùng có thể ngỡ ngàng”, “quen dùng bảng tính” và “giảm tải nhận thức”.

Yêu cầu:

- giữ các nhận định hình học có thể chứng minh bằng telemetry;
- đổi các nhận định về tốc độ, nhận thức, thói quen và tính tự nhiên thành `DESIGN_HYPOTHESIS`;
- không chọn candidate direction trong R02; Controller sẽ phê duyệt direction sau khi kế hoạch hợp lệ.

### P03 — Baseline findings phải giữ ranh giới bằng chứng

Baseline chưa được thi công và chưa chạy audit, nhưng bảng đang dùng các kết luận “vi phạm trực tiếp/nghiêm trọng”. Directive yêu cầu phân loại theo `Observed Evidence`, `Relevant Criterion / Risk`, `Candidate Response` và không tự gắn mọi defect thành confirmed WCAG failure.

Yêu cầu đổi trạng thái trước triển khai thành `PRESCRIBED_DEFECT / POTENTIAL_FAILURE`. Chỉ nâng thành `OBSERVED_FAILURE` sau khi detector chạy trên baseline và ghi được selector, computed style, rect hoặc hành vi tương ứng. Đồng thời bổ sung nguyên văn banner baseline khóa cứng vào kế hoạch.

### P04 — Ma trận reflow chưa bao phủ trạng thái và local overflow

`T10` hiện chỉ nêu phép đo global `documentElement.scrollWidth <= innerWidth`. Gate R03 yêu cầu cả page-level và component-level, đồng thời chạy trên các trạng thái cần thiết.

R02 phải khóa ma trận ít nhất:

- viewport: `1440×900`, `768×1024`, `390×844`, `320×800`, `844×390`;
- state: `initial`, `filtered`, `empty`, `detail`, `acknowledged`;
- detector: `documentElement`, `body`, shell, search/filter region, result container, từng record/card/table region và detail panel;
- điều kiện: không global overflow, không local horizontal scroller, không dùng `overflow-x: hidden` để che lỗi.

Positive control overflow phải gọi đúng production detector và làm ít nhất một state/region fail.

### P05 — Phép thử Text Spacing đang mô tả sai cách áp dụng

Chuỗi `* { margin-bottom: 2em !important; }` không phải phép biểu diễn an toàn cho paragraph spacing và có thể tự tạo khoảng cách giả trên mọi phần tử, kể cả control/layout container. Bốn giá trị cần được áp dụng đúng vai trò:

- line height: `1.5` lần cỡ chữ;
- spacing following paragraphs: `2` lần cỡ chữ;
- letter spacing: `0.12` lần cỡ chữ;
- word spacing: `0.16` lần cỡ chữ.

R02 phải mô tả selector/harness injection có giới hạn: line/letter/word spacing cho text-bearing elements; paragraph spacing chỉ cho paragraph-like blocks hoặc bằng detector tương đương chuẩn. Cho phép cuộn dọc; fail khi mất content/function, clip hoặc overlap có ý nghĩa.

### P06 — Detector clipping/overlap cần inventory và positive control

`T11` và `T12` hiện dựa trên “các khối chữ kề nhau” hoặc `scrollHeight <= clientHeight`, dễ báo sai với parent/child, inline layout, intentional overlap hoặc container auto-height.

R02 phải:

1. khóa danh mục required selectors/fields/actions cần đo ở list, empty state và detail;
2. định nghĩa clipping dựa trên visibility, overflow mode, client/scroll dimensions và geometric containment phù hợp;
3. loại parent-child và các cặp không cùng tầng khỏi overlap collision;
4. thêm dirty fixtures riêng cho clipping và overlap, gọi đúng production detectors;
5. fail closed nếu required selector vắng mặt.

### P07 — Invariants và T14 chưa được nối vào conjunction đầy đủ

First Response chưa khóa phép quét Zero Motion và chưa chỉ rõ forced-colors preflight, target inventory theo từng rendered state, focus obscuration ở mọi focus stop, cùng exact evidence ledger là điều kiện bắt buộc của final verdict.

R02 phải bổ sung:

- quét computed styles trên toàn DOM và CSS source để phát hiện `transition`, `animation`, `@keyframes`, `scroll-behavior: smooth` và auto-rotating content;
- forced-colors capability preflight; `NOT_EXECUTED` hoặc unsupported không được biến thành PASS;
- target inventory ở initial, filtered, empty, detail và acknowledged states; tách WCAG 24×24/ngoại lệ khỏi project 44×44;
- focus-obscuration detector trên từng focus stop native, xét các fixed/sticky author-created elements;
- manifest/hash/PNG dimensions/report-ledger synchronization động;
- overall verdict là phép hội của tất cả required gates, subtests và positive controls; bất kỳ missing selector/artifact/capability bắt buộc nào phải exit code 1.

---

## 4. Chỉ thị nộp First Response R02

Nộp một tệp `DESIGN_TRAINING_010_FIRST_RESPONSE_R02.md`; chưa tạo `baseline/`, `directions/`, `index.html`, `verify_module_010.js`, ảnh hoặc ZIP.

R02 chỉ cần:

1. bảng xử lý `P01`–`P07`;
2. các đoạn thay thế cho nội dung bị ảnh hưởng;
3. fixture `IR-1001`–`IR-1006` đã sửa và cơ chế exact equality;
4. test matrix/detector boundaries đã khóa lại;
5. khối trạng thái dưới đây.

```yaml
IMPLEMENTATION_STATUS: BLOCKED_PENDING_CONTROLLER_FIRST_RESPONSE_R02_REVIEW
CODE_WRITTEN_BEFORE_APPROVAL: false
MODULE_009_DEBT_IMPORTED: false
PLANNING_FINDINGS_ADDRESSED: P01-P07
```

Không được tự ghi `IMPLEMENTATION_AUTHORIZATION: GRANTED`. Quyền triển khai chỉ có hiệu lực khi Controller phát hành review R02 với trạng thái đó.

---

## 5. Trạng thái chính thức

```yaml
FIRST_RESPONSE_R01: REVIEWED
FIRST_RESPONSE_R02_REQUIRED: true
IMPLEMENTATION_AUTHORIZATION: NOT_GRANTED
MODULE_010_STATUS: PLANNING_ACTIVE
VISUAL_DIRECTION_SELECTION: DEFERRED
REPAIR_BUDGET_CONSUMED: 0/2
```

