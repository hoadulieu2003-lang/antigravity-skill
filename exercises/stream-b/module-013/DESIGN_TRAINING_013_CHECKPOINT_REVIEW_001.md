Library
/
DESIGN_TRAINING_013_CHECKPOINT_REVIEW_001.md
DESIGN TRAINING 013 — CHECKPOINT 13.1 REVIEW 001
Motion Reasoning & Two-Direction Studies Gate
review_id: DESIGN_TRAINING_013_CHECKPOINT_REVIEW_001
submission: DESIGN_TRAINING_013_CHECKPOINT_13_1
stream_id: B
module: 13
title: MOTION_FOUNDATION
controller: ChatGPT Controller — Stream B
package: design_training_013_checkpoint_13_1.zip
package_sha256_claimed: cfe2377d0e655c8a841a4118eb8d04b3f049c59730222a0ab13dee60a6ae1a4e
package_sha256_measured: cfe2377d0e655c8a841a4118eb8d04b3f049c59730222a0ab13dee60a6ae1a4e
package_bytes_measured: 1423654
central_directory_entries: 15
verdict: CHECKPOINT_REPAIR_REQUIRED
checkpoint_approved: false
phase_3_selection_gate: LOCKED
module_014: LOCKED
module_repair_budget: NOT_STARTED
checkpoint_revision: R01_REQUIRED
visual_baseline: ACCEPTED
preliminary_direction_preference: STUDY_A_QUIET_CONTINUITY
issued_date: 2026-09-15
1. Phán quyết

Checkpoint 13.1 chưa đạt reasoning gate. Phần tư duy nền, lựa chọn ba pattern, visual baseline và kế hoạch 96 assertion đi đúng hướng. Tuy nhiên gói vật lý không thể tái tạo hai study, runtime vi phạm duration/queue invariants, contract tự mâu thuẫn và checker tự xác nhận hai trục divergence chưa tồn tại trong code.

Controller không mở Phase 3 cho tới khi R01 đóng đúng các finding F01–F09 dưới đây.

Đây là sửa pre-selection checkpoint, chưa dùng repair budget dành cho final submission. Anti không được triển khai selection decision, candidate/pre_critique.html hoặc critique trước khi có CHECKPOINT_APPROVED.

2. Những phần được chấp nhận và phải giữ
Hạng mục	Trạng thái	Điều kiện bảo toàn
Starter snapshot SHA-256	PASS	Giữ 8b7beb3b…48b32b
Visual baseline Direction A	PASS	Không đổi palette, typography, editorial layout hoặc canonical content
Ba pattern P1/P2/P3	PASS_CONCEPT	Giữ purpose; sửa runtime/state integrity
Motion safety caps	PASS_CONCEPT	≤300ms, delay 0, displacement ≤8px, scale ≤1.02
Reduced-motion thesis	PASS_CONCEPT	Phải bổ sung bằng chứng runtime, không chỉ mô tả
16 test / 96 assertion plan	PASS_DRAFT	Nội dung test giữ nguyên; Phase 6 mới được tuyên bố thực thi đầy đủ
4 PNG dimensions	PASS	Desktop 2880×1800; mobile 780×1688, tương ứng DPR=2
Study A visual fit	PRELIMINARY_ACCEPT	Phù hợp hơn với Calm/Prepared; chưa phải Selection Gate verdict
3. Findings khóa Phase 3
F01 — ZIP làm phẳng đường dẫn và phá định danh hai study

unzip -Z1 cho thấy:

index.html
index.html
01_study_a_desktop_normal.png
02_study_a_mobile_normal.png
03_study_b_desktop_normal.png
04_study_b_mobile_normal.png

Thay vì:

studies/option_a/index.html
studies/option_b/index.html
screenshots/01_study_a_desktop_normal.png
...

Hai entry trùng tên có thể ghi đè nhau khi giải nén. Bốn screenshot cũng không khớp đường dẫn được khai trong CHECKPOINT_13_1.yaml.

Yêu cầu đóng: ZIP giữ nguyên relative hierarchy, pure /, không duplicate entry name; exact inventory được kiểm từ central directory.

F02 — Checkpoint không self-contained và runner không portable

Hai study tham chiếu ../../assets/..., nhưng package không chứa assets/ và cũng không giữ chúng dưới studies/. Runner lại đọc các file không có trong ZIP:

const BASE_DIR = 'C:/Users/game/.gemini/exercises/stream-b/module-013';
const CHROME_PATH = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

Runner phụ thuộc toàn bộ workspace tác giả, không thể chạy từ clean unpack và không thể chứng minh screenshot được sinh từ chính source trong gói.

Yêu cầu đóng: dùng __dirname; nhận --cdp-port hoặc --chrome-path; fail-closed nếu thiếu browser/Puppeteer; package có package.json, lockfile, starter source boundary, assets và hai study đúng path. Chạy lại từ thư mục mới.

F03 — Motion contract không phải source-of-truth của hai study

Contract định nghĩa:

fast: 120ms
base: 180ms
slow: 240ms

Runtime Study A dùng 100/160/220ms, Study B dùng 120/180/250ms. Các profile này không được biểu diễn trong contract. Ngoài ra contract vừa khai box-shadow trong P3 vừa liệt kê box-shadow là forbidden property; principle MP-04 lại nói “transform and opacity only” dù P2/P3 dùng color/border-color.

status: APPROVED_FOR_STUDIES cũng là self-approval trước Controller gate.

Yêu cầu đóng: contract có study_profiles.option_a và option_b hoặc một cơ chế override tường minh; mọi runtime token resolve từ contract; allowed/forbidden lists không mâu thuẫn; bỏ box-shadow khỏi P3; đổi status thành DRAFT_PENDING_CONTROLLER.

F04 — P2 vượt duration cap và sai inventory

Pending pulse triển khai:

duration: TOKENS.durationSlow,
iterations: 2

Tổng active duration là:

Study A: 220 × 2 = 440ms;

Study B: 250 × 2 = 500ms.

Cả hai vượt hard cap 300ms. MOTION_INVENTORY.md lại mô tả “pulse đơn”.

Yêu cầu đóng: một cycle duy nhất hoặc timing tổng ≤300ms; browser đo effect.getComputedTiming().activeDuration; inventory, contract và runtime phải cùng một giá trị.

F05 — P1 không thực hiện “reversal from current vector” và không đạt queue zero

Khi interrupt, code chỉ cancel animation của .disclosure-content, không cancel/đảo chiều chevron. Animation open dùng fill: 'forwards' và không được cleanup, nên settled getAnimations() có thể vẫn giữ finished effects. Khi đóng trong lúc đang mở, close keyframe bắt đầu từ opacity:1/translateY(0) thay vì progress hiện tại, tạo khả năng visual pop.

Runner chỉ chờ 250–300ms rồi xem open; không stress rapid reversal, không đo queue, không kiểm inline style cleanup.

Yêu cầu đóng: quản lý explicit animation handles; reverse hoặc khởi tạo từ computed/current progress; cancel/cleanup cả content và chevron; sau settle getAnimations({subtree:true}).length === 0; chạy 10 rapid toggles và kiểm final parity.

F06 — Tuyên bố divergence 6/6 không đúng với code

Checker tự gán:

{ name: '4. Opacity Sequencing', diff: true, ... }
{ name: '6. Interruption / Reversal', diff: true, ... }

Trong diff thực giữa hai HTML, logic animation giống nhau; chỉ token và isStudyA thay đổi. Không có implementation riêng cho “staggered 20ms opacity lead” hoặc “step reversal”.

Các khác biệt runtime hiện có thể hỗ trợ 4/6 trục: duration, easing, displacement và scale/emphasis. Điều này có thể đạt minimum 4/6, nhưng không được ghi 6/6.

Yêu cầu đóng: hoặc triển khai thật hai trục còn thiếu và đo primitive values, hoặc sửa mọi tài liệu/checker thành 4/6. Không hard-code diff:true. Hai PNG mobile đang byte-identical; đây không tự động là lỗi vì ảnh state tĩnh, nhưng chúng không được dùng để chứng minh motion divergence.

F07 — P3 tạo trigger không tương tác bằng heading

Code gắn click và cursor pointer trực tiếp lên .hero-heading (h2) nhưng không có keyboard semantics, focusability hoặc accessible role. Điều này tạo đường kích hoạt bằng pointer mà người dùng bàn phím không truy cập tương đương.

Yêu cầu đóng: xóa heading-click handler và chỉ dùng #btn-highlight-t01, hoặc chuyển thành control native thật. Controller khuyến nghị giữ một nút rõ để tránh làm heading giả thành control.

F08 — 41/41 là smoke check, chưa chứng minh các claim cốt lõi

Runner không đo:

reduced-motion runtime cho P1–P3;

duration/easing qua getAnimations();

active duration sau iterations;

P1 rapid reversal/queue cleanup;

keyboard Tab/Enter/Space;

focus/no-steal;

displacement/scale thực tế;

CLS/long task;

path/inventory parity của chính ZIP.

Hai trục divergence được hard-code, nên 41/41 không thể gọi là độc lập cho toàn bộ các claim trong checkpoint.

Yêu cầu đóng: đặt tên kết quả CHECKPOINT_SMOKE, xuất CHECKPOINT_VERIFICATION.json và console log. Bổ sung targeted assertions cho F04–F07, reduced mode và archive inventory. Không chạy hoặc tuyên bố 96/96 ở checkpoint.

F09 — Asset/header integrity chưa sạch

Hai study thêm một inline SVG chevron không có manifest entry, trong khi asset language được kế thừa/frozen. Header vẫn ghi MODULE 12 BRAND & IMAGE DIRECTION, gây sai lifecycle trong chính Module 13.

Yêu cầu đóng: dùng CSS/native marker hoặc đăng ký asset chức năng theo policy mới của Module 13; cập nhật header nghĩa thành MODULE 13 MOTION FOUNDATION nhưng không đổi visual system.

4. Đánh giá reasoning
Trục	Kết quả
Motion as causality	PASS_CONCEPT
Purpose-driven timing	REPAIR — runtime vượt cap
Composite-first	REPAIR — contract tự mâu thuẫn
Interruption resilience	FAIL_RUNTIME
Reduced-motion equivalence	PASS_PLAN / NOT_MEASURED
State-machine integrity	REPAIR
Two-study divergence	PASS_MINIMUM_4_OF_6 / CLAIM_6_OF_6_REJECTED
Evidence integrity	FAIL
5. Inventory bắt buộc cho Checkpoint R01
design_training_013_checkpoint_13_1_r01.zip
├── DESIGN_TRAINING_MODULE_013_DIRECTIVE.md
├── DESIGN_TRAINING_013_STARTER_SNAPSHOT.zip
├── DESIGN_TRAINING_013_STARTER_SNAPSHOT_MANIFEST.json
├── PROJECT.md
├── SOURCE_PROVENANCE.md
├── CHECKPOINT_13_1.yaml
├── CHANGE_LEDGER.md
├── MOTION_PRINCIPLES.md
├── MOTION_CONTRACT.yaml
├── MOTION_INVENTORY.md
├── STATE_MACHINE.md
├── MOTION_SAFETY_MATRIX.md
├── TEST_MATRIX_DRAFT.md
├── baseline/index.html
├── assets/
├── governance/
├── studies/
│   ├── option_a/index.html
│   └── option_b/index.html
├── verify_checkpoint_13_1.js
├── package.json
├── package-lock.json
├── CHECKPOINT_VERIFICATION.json
├── CHECKPOINT_VERIFICATION_CONSOLE.log
├── CHECKPOINT_PACKAGE_MANIFEST.json
└── screenshots/
    ├── 01_study_a_desktop_normal.png
    ├── 02_study_a_mobile_normal.png
    ├── 03_study_b_desktop_normal.png
    └── 04_study_b_mobile_normal.png

Nếu muốn giảm dung lượng, baseline/assets/governance có thể nằm trong starter ZIP thay vì lặp unpacked, nhưng runner clean-unpack phải tự resolve chúng một cách portable và package manifest phải nói rõ. Không được phụ thuộc một workspace ngoài gói.

6. Targeted acceptance cho R01

R01 được CHECKPOINT_APPROVED khi đồng thời đạt:

ZIP hierarchy và exact inventory đúng, không duplicate path;

clean unpack runner chạy được mà không author path;

contract/profile/runtime thống nhất;

P2 active duration ≤300ms;

P1 rapid reversal không pop, không queue, cleanup đủ;

P3 chỉ có native interactive trigger;

divergence được đo đúng—4/6 trung thực hoặc 6/6 có implementation;

reduced-motion targeted probes PASS;

checkpoint claims khớp JSON/log/source/screenshots;

visual baseline và Study A/B hiện tại được bảo toàn ngoài các sửa liên quan.

7. Lệnh thực thi
ANTI_REPAIR_DIRECTIVE:
  authorization: REPAIR_CHECKPOINT_13_1
  revision: R01
  scope: F01_TO_F09_ONLY
  phase_3: LOCKED
  candidate_build: FORBIDDEN
  selection_decision: FORBIDDEN
  module_014: LOCKED
  preserve_visual_baseline: true
  preliminary_preference: STUDY_A_QUIET_CONTINUITY
  checkpoint_96_assertions: DO_NOT_RUN_OR_CLAIM
  resubmit_to: ChatGPT_Controller_Stream_B

Không thiết kế lại Direction A. Không mở thêm pattern. Không biến checkpoint repair thành verification framework lớn; chỉ đóng chín sai lệch về package, contract, runtime và evidence nêu trên.