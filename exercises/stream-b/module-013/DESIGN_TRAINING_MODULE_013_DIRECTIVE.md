# DESIGN TRAINING 013 — MOTION FOUNDATION

## Chỉ thị đào tạo và đặc tả nghiệm thu cho Stream B

```yaml
directive_id: DESIGN_TRAINING_MODULE_013
stream_id: B
stream_name: EXPRESSIVE_EXPERIENCE
module: 13
title: MOTION_FOUNDATION
authority: ChatGPT Controller — Stream B
executor: Antigravity Tab B
product_owner: Anh — Lead Architect / Product Owner / Sole Founder
status: ISSUED
issued_date: 2026-09-15
workspace_root: design-training/stream-b/module-013/
previous_module:
  module: DESIGN_TRAINING_012_BRAND_AND_IMAGE_DIRECTION
  lifecycle: CLOSED_UNDER_OWNER_WAIVER_006
  design_learning: ACCEPTED_FOR_EXERCISE
  technical_audit: FAIL_CLOSED
source_package: DESIGN_TRAINING_013_STARTER_SNAPSHOT.zip
next_module:
  module: DESIGN_TRAINING_014_MOTION_CHOREOGRAPHY
  status: LOCKED
repair_budget: 2
```

---

## 1. Mệnh lệnh thực thi

Antigravity Tab B được phép bắt đầu Module 13 trong thư mục cô lập:

```text
design-training/stream-b/module-013/
```

Module 13 dạy **ngữ pháp chuyển động ở cấp component và state transition**. Module này không dạy page choreography, scroll storytelling, parallax, cinematic sequencing hay 3D; các chủ đề đó thuộc Module 14–15.

Candidate Hướng A của Module 12 là baseline thị giác đóng băng. Anti được thêm motion có mục đích nhưng không được đổi brand thesis, palette, typography, composition, canonical data, asset language hoặc ba CSS declaration critique đã được Owner chấp nhận.

Module 12 được khép lại theo Waiver 006 nhưng technical audit vẫn `FAIL_CLOSED`. Do đó:

- không nhập `verify_module_012.js`, `VERIFICATION.json` hoặc kết luận `79/79` làm bằng chứng;
- không tuyên bố Module 12 đã PASS kỹ thuật;
- không sửa R03/R04;
- chỉ dùng HTML, assets và canonical fixture như tài nguyên thiết kế/source snapshot;
- mọi kiểm chứng Module 13 phải được viết mới và độc lập.

---

## 2. Mục tiêu học tập

Sau Module 13, Anti phải chứng minh được khả năng:

1. xác định motion purpose trước khi chọn duration hoặc easing;
2. xây token motion dùng lại được, không rải magic number;
3. biểu diễn state change bằng chuyển động tiết chế mà không trì hoãn tác vụ;
4. phân biệt enter, exit, emphasis, feedback và continuity;
5. thiết kế interruption, reversal và rapid-repeat an toàn;
6. bảo toàn focus, accessible name, DOM identity và trạng thái nghiệp vụ;
7. triển khai reduced-motion tương đương về thông tin và chức năng;
8. kiểm soát performance, layout shift và phạm vi thuộc tính được animate;
9. đo motion bằng browser runtime thay vì suy ra từ chuỗi CSS;
10. phân loại trung thực `[MEASURED]`, `[VISUAL_REVIEW]`, `[DESIGN_INTENT]` và `[EXERCISE_SUPPORTED]`.

---

## 3. Bài học cốt lõi

### 3.1. Motion là quan hệ nhân quả

Motion hợp lệ phải trả lời được:

```text
Trigger → State change → Motion cue → Settled state
```

Nếu bỏ motion mà người dùng không mất thông tin, motion chỉ có thể đóng vai trò tăng continuity hoặc giảm giật thị giác; không được mô tả nó là “cần thiết” một cách tùy tiện.

### 3.2. Duration không phải cảm tính

Duration phải xuất phát từ quãng biến đổi, độ phức tạp và mức khẩn cấp. Module này dùng ba lớp nền:

```yaml
duration_fast: 120ms
duration_base: 180ms
duration_slow: 240ms
duration_cap: 300ms
```

Anti có thể tinh chỉnh sau đo đạc nhưng mọi giá trị production phải đi qua token. Không transition nào vượt `300ms`; delay mặc định bằng `0ms`.

### 3.3. Easing thể hiện động lực, không phải trang trí

Token seed:

```yaml
ease_standard: cubic-bezier(0.2, 0, 0, 1)
ease_enter: cubic-bezier(0, 0, 0, 1)
ease_exit: cubic-bezier(0.3, 0, 1, 1)
ease_linear: linear
```

- `enter`: giảm tốc để trạng thái mới ổn định;
- `exit`: rời nhanh, không giữ người dùng chờ;
- `standard`: thay đổi tại chỗ;
- `linear`: chỉ dùng khi vận tốc đều mang nghĩa thực sự.

Không dùng `bounce`, `elastic`, overshoot hoặc spring giả cho tác vụ vận hành.

### 3.4. Animate composite-first

Thuộc tính ưu tiên:

- `transform`;
- `opacity`;
- màu/border-color cho feedback nhỏ khi đo performance chấp nhận được.

Không animate `width`, `height`, `top`, `left`, grid track, box-shadow lớn hoặc blur liên tục trong candidate. Expansion phải dùng kỹ thuật không gây layout instability quan sát được; nếu cần chiều cao động, Anti phải giải thích và đo frame/layout.

### 3.5. Interruption là trạng thái bình thường

Người dùng có thể kích hoạt lại trước khi animation kết thúc. Hệ thống phải:

- không tạo animation queue;
- không duplicate commit;
- đảo chiều hoặc đồng bộ về state mới;
- không để inline style/token ở trạng thái nửa chừng;
- giữ cùng một action element khi nhãn/state thay đổi;
- ổn định sau rapid input.

### 3.6. Reduced motion là một mode hoàn chỉnh

Khi `prefers-reduced-motion: reduce`:

- mọi displacement không thiết yếu về `0px`;
- duration không thiết yếu về `0.01ms` hoặc `0s`;
- không delay;
- state cuối xuất hiện ngay;
- feedback text, focus, status và live-region giữ nguyên;
- không thay reduced motion bằng hiệu ứng flash mạnh.

Reduced motion không có nghĩa là xóa chức năng hoặc xóa phản hồi.

### 3.7. Nguồn nền bắt buộc đọc

- W3C WCAG 2.2 — Animation from Interactions: <https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions>
- MDN — `prefers-reduced-motion`: <https://developer.mozilla.org/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion>
- W3C CSS Easing Functions Level 2: <https://www.w3.org/TR/css-easing-2/>
- MDN — Web Animations API: <https://developer.mozilla.org/docs/Web/API/Web_Animations_API>

Anti phải ghi điều quan sát được, nguyên tắc chuyển giao và giới hạn áp dụng; không sao chép demo thành giải pháp mặc định.

---

## 4. Baseline và invariants khóa cứng

### 4.1. Baseline

`baseline/index.html` trong starter snapshot là bản sao byte-level của candidate Module 12 R03. Baseline chỉ đọc. Anti tạo:

```text
candidate/pre_critique.html
candidate/index.html
```

từ baseline và ghi mọi thay đổi trong `CHANGE_LEDGER.md`.

### 4.2. Visual invariants

- selected direction: `DIRECTION_A — Human Field Intelligence`;
- canvas sáng `#FAF8F5`;
- editorial composition và typography hiện tại;
- asset family hiện tại;
- nội dung ưu tiên T01;
- 8 tuple canonical T01–T08;
- responsive normal state ở 1440/768/390;
- không hybrid hóa Direction B;
- không dark theme.

### 4.3. Behavioral invariants

- keyboard và pointer kích hoạt cùng state machine;
- focus không bị đánh cắp khi state settle;
- không disable bằng cách làm mất focus nếu có phương án `aria-disabled` + guard;
- không duplicate action khi rapid input;
- accessible name không đổi ngoài nhãn trạng thái có chủ ý;
- reduced-motion có cùng outcome;
- refresh trả baseline state trừ khi contract nêu khác.

### 4.4. Evidence boundary từ Module 12

Các file sau bị cấm làm authoritative reference:

```text
verify_module_012.js
VERIFICATION.json
mọi tuyên bố 79/79 của Module 12
```

Hai tài liệu trong `governance/` là immutable records. Chuỗi đường dẫn cũ bên trong tài liệu đã ký không phải path runtime và không được chỉnh byte.

---

## 5. Đề bài thiết kế

Biến TRIPFLOW Daily Departure Brief từ static composition thành prototype có **ba motion patterns nền tảng**, tất cả phục vụ tác vụ vận hành:

### Pattern P1 — Disclosure continuity

Áp dụng cho `Asset provenance` hoặc một panel thông tin phụ:

- trigger thật bằng `button` hoặc `summary`;
- open/close có state rõ;
- icon rotation tối đa `90deg` nếu có;
- content transition không che focus hoặc cắt text;
- rapid open/close kết thúc đúng state;
- reduced mode chuyển tức thời.

### Pattern P2 — Action feedback FSM

Dùng một action trên T01, ưu tiên “Cập nhật nhật ký”:

```text
idle → pending → success
                 ↘ error → retry → success
```

- deterministic test hook để ép error lần đầu và success lần sau;
- một DOM action element ổn định;
- pending không duplicate;
- status text là nguồn nghĩa chính;
- motion chỉ hỗ trợ state change;
- T01 vẫn giữ status canonical `Chờ đối tác`.

### Pattern P3 — Attention without alarm

Tạo emphasis một lần cho điểm nghẽn T01 sau explicit user action hoặc khi panel T01 được mở:

- không autoplay khi load;
- không pulse lặp vô hạn;
- không flash;
- không dịch chuyển quá `8px`;
- không scale vượt `1.02`;
- không gây layout shift;
- reduced mode dùng border/color/text state tức thời.

Chỉ ba patterns trên được chấm. Không thêm page transition, scroll reveal hàng loạt, animated counters, parallax, carousel autoplay hoặc background ambient motion.

---

## 6. Motion system contract

Tạo `MOTION_CONTRACT.yaml` gồm:

```yaml
version: 1
principles: []
tokens:
  duration: {}
  easing: {}
  distance: {}
  scale: {}
patterns:
  disclosure:
    trigger: ""
    states: []
    properties: []
    reduced_motion: ""
  action_feedback:
    trigger: ""
    states: []
    properties: []
    reduced_motion: ""
  attention:
    trigger: ""
    states: []
    properties: []
    reduced_motion: ""
budgets:
  max_duration_ms: 300
  max_delay_ms: 0
  max_translation_px: 8
  max_scale: 1.02
  max_concurrent_animations: 2
forbidden_properties: []
```

Mỗi pattern bắt buộc ánh xạ:

```text
purpose → trigger → states → token → selector → reduced alternative → measurement
```

---

## 7. Motion inventory và rationale

Tạo `MOTION_INVENTORY.md`. Mỗi transition là một hàng:

| ID | Pattern | Trigger | From → To | Purpose | Property | Duration | Easing | Interrupt rule | Reduced mode | Evidence |
|---|---|---|---|---|---|---:|---|---|---|---|

Rationale không được chỉ nói “mượt”, “premium”, “tự nhiên” hoặc “delightful”. Phải gắn với continuity, causality, feedback, hierarchy hoặc error recovery.

---

## 8. State machine bắt buộc

Tạo `STATE_MACHINE.md` cho P1–P3. P2 phải ghi đầy đủ:

- state;
- event;
- guard;
- side effect;
- accessible announcement;
- focus rule;
- visual/motion cue;
- interruption behavior;
- deterministic test control.

Không dùng timeout như source-of-truth duy nhất. Timer có thể mô phỏng latency nhưng business state phải được quản lý rõ và cleanup khi bị thay thế.

---

## 9. Accessibility và safety

### 9.1. Mandatory requirements

- `prefers-reduced-motion` được đọc từ browser, không chỉ toggle giả;
- có dev/test override local, mặc định không lấn OS preference;
- no-motion outcome giống normal outcome;
- live-region không announce trung gian dư thừa;
- focus indicator không bị animation che hoặc trì hoãn;
- Enter/Space/click có parity;
- không trap focus;
- không flashing >3 lần/giây;
- không loop vô hạn;
- không scroll hijack;
- không chuyển động lớn do hover trên touch layout.

### 9.2. Motion safety matrix

Tạo `MOTION_SAFETY_MATRIX.md` với ít nhất:

| Risk | Trigger | Normal mode | Reduced mode | Test |
|---|---|---|---|---|
| Vestibular displacement | user action | ≤8px | 0px | browser measurement |
| Repeated motion | rapid input | queue length 0 | queue length 0 | stress sequence |
| Focus loss | settle/reversal | same logical target | same | activeElement |
| Flash | feedback | none | none | frame/style audit |

---

## 10. Performance budget

```yaml
max_motion_duration_ms: 300
max_motion_delay_ms: 0
max_concurrent_animations: 2
layout_shift_during_pattern: 0
horizontal_overflow: 0
remote_runtime_requests: 0
long_tasks_over_50ms_from_motion: 0
animation_queue_after_settle: 0
```

`layout_shift_during_pattern: 0` phải đo bằng `PerformanceObserver` khi browser hỗ trợ; đồng thời đo bounding rect trước/sau cho những phần tử không được phép di chuyển.

---

## 11. Hai motion directions bắt buộc

Anti tạo hai motion studies trên **cùng visual baseline**:

```text
studies/option_a/index.html
studies/option_b/index.html
```

### Study A — Quiet Continuity

Seed:

- duration ngắn, biến đổi nhỏ;
- ưu tiên opacity + 2–4px transform;
- sự ổn định, liên tục và bình tĩnh;
- không biến editorial brand thành “app animation demo”.

### Study B — Explicit State Change

Seed:

- state boundary rõ hơn;
- duration/easing có độ tương phản có kiểm soát giữa enter và exit;
- feedback rõ cho pending/error/success;
- vẫn không alarmist, không bounce/spring.

Hai study phải khác nhau tối thiểu 4/6 trục:

1. duration hierarchy;
2. easing model;
3. spatial displacement;
4. opacity sequencing;
5. emphasis treatment;
6. interruption/reversal model.

Khác token trên giấy nhưng render không phân biệt được thì không tính.

---

## 12. Quy trình thực thi bắt buộc

### Phase 0 — Integrity setup

1. Giải nén starter snapshot vào đúng workspace.
2. Kiểm SHA-256 package và mọi file trong `DESIGN_TRAINING_013_STARTER_SNAPSHOT_MANIFEST.json`.
3. Ghi `STREAM_ID: B` và source provenance.
4. Tạo `CHANGE_LEDGER.md`.
5. Không sửa `baseline/`, `assets/`, `governance/`.

### Phase 1 — Motion reasoning

Tạo:

- `MOTION_PRINCIPLES.md`;
- `MOTION_CONTRACT.yaml`;
- `MOTION_INVENTORY.md`;
- `STATE_MACHINE.md`;
- `MOTION_SAFETY_MATRIX.md`;
- `TEST_MATRIX_DRAFT.md`.

### Phase 2 — Two motion studies

Tạo hai study với cùng three-pattern brief. Mỗi study phải chạy được ở 1440, 768 và 390; checkpoint chỉ yêu cầu screenshot desktop + mobile cho mỗi study.

### Checkpoint 13.1 — Reasoning and studies gate

Gửi Controller trước khi chọn hướng. Controller kiểm purpose, divergence, reduced-motion plan và state machine; chưa cần 96 assertions chạy đủ.

### Phase 3 — Selection gate

Chấm hai study theo rubric, chọn đúng một. Không hybrid hóa sau selection. Study thua được lưu nguyên trong archive.

### Phase 4 — Final candidate

Tạo `candidate/pre_critique.html` từ study thắng.

### Phase 5 — Critique

Self-critique 5–7 nhận xét có taxonomy. Chọn đúng một hypothesis. `pre_critique` → `candidate/index.html` chỉ được tối đa hai thay đổi liên quan.

### Phase 6 — Verification and packaging

Chạy browser suite, capture authoritative evidence, tạo report và ZIP. Self-check không thay thế nghiệm thu Controller.

---

## 13. Rubric chọn motion direction

| Nhóm | Điểm tối đa |
|---|---:|
| Purpose and causality | 20 |
| State clarity and feedback | 15 |
| Timing/easing coherence | 15 |
| Interruption/reversal robustness | 15 |
| Reduced-motion equivalence | 15 |
| Accessibility/focus/keyboard | 10 |
| Performance and containment | 5 |
| Brand preservation | 5 |
| **Tổng** | **100** |

```yaml
minimum_score: 82
blocking_gate_override: true
confidence_label: EXERCISE_SUPPORTED
```

---

## 14. Eight blocking gates

| Gate | Điều kiện PASS |
|---|---|
| B01 — Source integrity | Snapshot/hash đúng; baseline/assets/governance không đổi; không dùng Module 12 verification làm evidence |
| B02 — Purpose traceability | Mỗi motion mapping đủ purpose → state → token → selector → reduced mode → measurement |
| B03 — Token discipline | 100% duration/easing/distance production dùng contract token; không vượt budget |
| B04 — State integrity | P1–P3 deterministic; no duplicate; rapid input settle đúng; DOM identity/focus giữ đúng |
| B05 — Reduced-motion parity | Browser emulation `reduce` cho cùng outcome, 0 displacement không thiết yếu và không delay |
| B06 — Accessibility and safety | Keyboard/pointer parity; live-region đúng; focus visible; không flash/loop/autoplay/scroll hijack |
| B07 — Performance containment | Không CLS, overflow, overlap; queue rỗng; concurrency ≤2; remote request 0 |
| B08 — Evidence integrity | Browser measurements, screenshots, JSON, report, logs và ZIP manifest nhất quán; suite fail-closed |

Một gate FAIL thì Module 13 chưa hoàn thành.

---

## 15. Locked verification tests T01–T16

`verify_module_013.js` phải dùng Chromium/Puppeteer thực, xuất `VERIFICATION.json`, exit khác `0` nếu browser/dependency/test thiếu. Mỗi test có `precondition`, `protocol`, `measurements`, atomic `assertions`, `evidence_paths`, `pass`.

Tổng assertion khóa: **96**. Không đổi số hoặc nội dung để tự làm PASS.

### T01 — Package, stream and immutable source (6)

- Stream B và workspace đúng;
- starter package hash đúng;
- baseline, 14 assets, canonical fixture, Waiver 006 và Review 008 khớp manifest;
- không write sang Stream A;
- không nhập runner/result Module 12;
- path runtime portable.

### T02 — Canonical and visual invariants (6)

- Deep-compare 8 tuples;
- T01 priority/status đúng;
- palette/canvas/type/layout invariants tồn tại;
- Direction B không bị trộn;
- normal state không đổi nội dung nghĩa;
- ba critique declarations được bảo toàn.

### T03 — Motion contract and token usage (7)

- Schema contract đủ;
- token values trong budget;
- selector usage resolve được;
- không duration/easing magic number production;
- delay 0;
- forbidden property absent;
- mappings đủ evidence.

### T04 — Study divergence and selection integrity (5)

- Hai study khác ≥4/6 trục bằng computed measurements;
- cùng content/state semantics;
- rubric đủ;
- một winner;
- zero hybridization.

### T05 — P1 disclosure lifecycle (7)

- Pointer open/close;
- native keyboard open/close;
- aria state đúng;
- content không clip;
- focus hợp lệ;
- rapid reversal settle đúng;
- animation queue 0.

### T06 — P2 action FSM (9)

- idle/pending/error/retry/success đúng;
- same action node identity;
- deterministic attempt/commit counters;
- duplicate guard;
- draft/status preserved;
- live-region strings đúng;
- focus during pending hợp lệ;
- no-steal on settle;
- canonical T01 status giữ nguyên.

### T07 — P3 attention safety (5)

- chỉ chạy sau explicit action;
- không loop;
- translate ≤8px;
- scale ≤1.02;
- settle về computed base state.

### T08 — Duration and easing runtime fidelity (6)

- Đo `getAnimations()`/computed timing cho P1–P3;
- duration khớp token;
- easing khớp token;
- delay 0;
- total active duration ≤300ms;
- finished promises settle.

### T09 — Interruption, reversal and stress (7)

- 10 rapid activations;
- no queued stale animation;
- final state theo parity activation;
- no duplicate side effect;
- cancel/reverse cleanup;
- inline style sạch;
- no unhandled rejection/error.

### T10 — Reduced-motion equivalence (8)

- Browser emulate `prefers-reduced-motion: reduce`;
- media query match true;
- P1–P3 outcomes giống normal;
- displacement 0;
- nonessential duration ≤1ms;
- delay 0;
- announcements giống;
- focus giống.

### T11 — Keyboard, focus and announcements (7)

- Tab thật tới mỗi trigger;
- `:focus-visible` thật;
- Enter/Space parity theo native semantics;
- không BODY focus event;
- focus không tới hidden/inert content;
- live-region không duplicate;
- return focus đúng logical target.

### T12 — Responsive containment (6)

- 1440×900, 768×1024, 390×844;
- normal và reduced mode;
- `scrollWidth <= clientWidth`;
- bounding rect không clip/overlap;
- target ≥44×44;
- motion không đổi document width.

### T13 — Performance and layout stability (6)

- `layout-shift` entries có `hadRecentInput=false` tổng bằng 0;
- anchor bounding rect ổn định;
- concurrent animations ≤2;
- motion long task >50ms bằng 0;
- chỉ animate allowlisted properties;
- queue rỗng sau settle.

### T14 — Safety boundary audit (4)

- không autoplay/ambient loop;
- không flash;
- không parallax/scroll-linked effect;
- không 3D/perspective.

### T15 — Critique scope (4)

- 5–7 critique comments có taxonomy;
- một hypothesis;
- tối đa hai thay đổi liên quan;
- diff không chứa canonical/brand/unrelated edit.

### T16 — Evidence and package parity (7)

- chính xác 12 authoritative PNG;
- dimensions/DPR/hash khớp;
- clean unpack runner PASS;
- console log có runtime metadata;
- report khớp 15 test trước;
- `allPassed` conjunction T01–T15;
- ZIP inventory khớp manifest và không file dư.

### Quy tắc assertion

- 96 assertion là atomic checks, không phải 96 cờ tự khai báo;
- boolean PASS phải được suy ra từ measured primitive;
- helper validation phải kiểm membership/schema, không blacklist chuỗi;
- keyboard test dùng `page.keyboard`, không `.focus()` hoặc DOM `.click()` thay thế;
- visual review không được automation tự phong PASS;
- screenshot không chứng minh focus, a11y, performance hoặc DPR nếu không có metadata/measurement tương ứng.

---

## 16. Screenshot authoritative set

Tất cả ảnh PNG, DPR=2, chụp bởi cùng runner/capture pipeline:

```text
screenshots/
├── 01_study_a_desktop_normal.png
├── 02_study_a_mobile_normal.png
├── 03_study_b_desktop_normal.png
├── 04_study_b_mobile_normal.png
├── 05_candidate_desktop_idle.png
├── 06_candidate_tablet_disclosure_open.png
├── 07_candidate_mobile_pending.png
├── 08_candidate_mobile_error.png
├── 09_candidate_mobile_success.png
├── 10_candidate_mobile_attention_settle.png
├── 11_candidate_mobile_reduced_motion.png
└── 12_candidate_mobile_focus_visible.png
```

Animation timeline phải được chứng minh bằng measurements/event log; ảnh chỉ là state evidence, không giả làm video evidence.

---

## 17. Cấu trúc gói nộp

```text
design_training_013_submission_r01.zip
├── DESIGN_TRAINING_MODULE_013_DIRECTIVE.md
├── DESIGN_TRAINING_013_STARTER_SNAPSHOT_MANIFEST.json
├── SOURCE_PROVENANCE.md
├── PROJECT.md
├── CHANGE_LEDGER.md
├── CANONICAL_FIXTURE.json
├── MOTION_PRINCIPLES.md
├── MOTION_CONTRACT.yaml
├── MOTION_INVENTORY.md
├── STATE_MACHINE.md
├── MOTION_SAFETY_MATRIX.md
├── TEST_MATRIX_DRAFT.md
├── SELECTION_DECISION.md
├── baseline/index.html
├── studies/option_a/index.html
├── studies/option_b/index.html
├── candidate/pre_critique.html
├── candidate/index.html
├── assets/
├── verify_module_013.js
├── package.json
├── package-lock.json
├── VERIFICATION.json
├── VERIFICATION_CONSOLE.log
├── SCREENSHOT_MANIFEST.json
├── PACKAGE_MANIFEST.json
├── DESIGN_TRAINING_013_REPORT.md
├── governance/
└── screenshots/ (12 PNG)
```

Không đóng gói `node_modules`, browser binary/profile, temp, cache, source Stream A hoặc verification artifacts Module 12.

---

## 18. Report bắt buộc

`DESIGN_TRAINING_013_REPORT.md` gồm:

1. Executive summary;
2. Waiver 006 và source boundary;
3. Snapshot integrity;
4. Canonical/brand invariants;
5. Motion principles;
6. Contract/tokens;
7. Pattern P1;
8. Pattern P2 FSM;
9. Pattern P3;
10. Study A;
11. Study B;
12. Six-axis divergence;
13. Selection rubric;
14. Reduced-motion equivalence;
15. Interruption/reversal;
16. Accessibility/focus/live-region;
17. Performance/CLS/containment;
18. Critique taxonomy/hypothesis/diff;
19. T01–T16 results and 96 assertions;
20. B01–B08 self-assessment;
21. Known limitations/open risks;
22. Exact package inventory;
23. Self-verdict.

Claim taxonomy:

- `[MEASURED: Txx/Ayy/path]` cho runtime measurement có pointer;
- `[VISUAL_REVIEW]` cho phán đoán nhìn;
- `[DESIGN_INTENT]` cho mục tiêu;
- `[EXERCISE_SUPPORTED]` cho kết luận trong bài;
- `[USER_RESEARCH]` chỉ khi có protocol và raw record người dùng thật.

---

## 19. Checkpoint 13.1 submission contract

```yaml
submission_type: DESIGN_TRAINING_013_CHECKPOINT_13_1
stream_id: B
workspace: design-training/stream-b/module-013/
starter_snapshot_sha256: "..."
immutable_source_check: PASS
motion_principles:
  - "..."
motion_tokens:
  duration: {}
  easing: {}
  distance: {}
pattern_p1:
  purpose: "..."
  normal: "..."
  reduced: "..."
pattern_p2:
  purpose: "..."
  states: []
  interruption_rule: "..."
pattern_p3:
  purpose: "..."
  trigger: "..."
  safety_caps: {}
study_a:
  name: "..."
  six_axis_summary: "..."
study_b:
  name: "..."
  six_axis_summary: "..."
test_matrix_draft_path: TEST_MATRIX_DRAFT.md
open_questions: []
```

Đính kèm package checkpoint có các tài liệu Phase 0–2, hai study, bốn screenshot DPR=2 và checkpoint verification thực thi riêng. Không tuyên bố 96/96 trước Phase 6.

---

## 20. Acceptance và anti-doom-loop

```yaml
PASS:
  module_completed: true
  module_014: eligible_for_issuance
REPAIR_REQUIRED:
  module_completed: false
  repair_round: 1_or_2
FAIL_CLOSED:
  module_completed: false
  repair_budget: closed
  escalation: Lead_Architect
```

```yaml
max_repair_rounds: 2
scope_per_round: blockers_only
visual_rewrite_after_selection: forbidden_unless_controller_orders
test_redefinition_to_make_pass: forbidden
self_authorized_third_round: forbidden
```

PASS yêu cầu B01–B08, T01–T16, 96/96 atomic assertions, rubric ≥82 và Controller visual review đạt. Một con số self-check không thay phán quyết độc lập.

---

## 21. Lệnh kích hoạt

```yaml
ANTI_DIRECTIVE:
  authorization: START_NOW
  stream_id: B
  task: DESIGN_TRAINING_013_MOTION_FOUNDATION
  allowed_phase:
    - PHASE_0_INTEGRITY_SETUP
    - PHASE_1_MOTION_REASONING
    - PHASE_2_TWO_MOTION_STUDIES
  first_gate: CHECKPOINT_13_1
  module_014: LOCKED
  module_012_r04: FORBIDDEN
  cross_stream_write: FORBIDDEN
```

Antigravity Tab B: bắt đầu từ snapshot phát hành, không hỏi lại dữ kiện đã khóa. Chỉ chuyển cấp khi checksum/source không khớp, workspace xung đột hoặc một invariant không thể đồng thời thỏa mãn.
