# CHANGE LEDGER — MODULE 13

| ID | Phase | File | Change | Purpose | Invariant impact | Verification |
|---|---|---|---|---|---|---|
| C-001 | 0 | `DESIGN_TRAINING_013_STARTER_SNAPSHOT.zip` | Khởi tạo workspace từ starter snapshot và xác thực 27/27 files theo manifest | Chain of custody | None (baseline & assets preserved) | SHA-256 package `8b7beb3b726e7da8d0d5f8dc5b54dbfc280ab9c068fe39a5298f14d6a148b32b` [VERIFIED] |
| C-002 | 0 | `CHANGE_LEDGER.md` | Khởi tạo sổ theo dõi thay đổi từ template | Governance tracking | None | File exists |
| C-003 | 1 | `MOTION_PRINCIPLES.md` | Biên soạn 6 nguyên lý chuyển động nền tảng (MP-01 đến MP-06) | Architectural guidance | None (spec document) | Peer review |
| C-004 | 1 | `MOTION_CONTRACT.yaml` | Khóa tokens, budgets (max 300ms, max 8px, max 1.02 scale), patterns P1-P3, allowed/forbidden properties | Contract enforcement | None (spec document) | Schema & YAML parser validation |
| C-005 | 1 | `MOTION_INVENTORY.md` | Bảng danh mục toàn bộ state transitions kèm rationale chi tiết | Traceability | None (spec document) | Inventory coverage audit |
| C-006 | 1 | `STATE_MACHINE.md` | Đặc tả chi tiết FSM cho P1, P2 (idle->pending->success/error), P3 kèm deterministic test hooks | State integrity & testability | None (spec document) | State reachability check |
| C-007 | 1 | `MOTION_SAFETY_MATRIX.md` | Ma trận rủi ro chuyển động và cơ chế bảo vệ vestibular/interruption/focus | Accessibility & safety | None (spec document) | WCAG 2.2 guideline audit |
| C-008 | 1 | `TEST_MATRIX_DRAFT.md` | Khung 16 test T01–T16 với 96 assertions đo đạc primitive | Test readiness | None (spec document) | Assertion mapping audit |
| C-009 | 2 | `studies/option_a/index.html` | Xây dựng Study A (Quiet Continuity: 100-220ms, 2-4px, soft emphasis) trên baseline Option A | Exploration | Preserves visual invariants & light theme | Runtime test & screenshot |
| C-010 | 2 | `studies/option_b/index.html` | Xây dựng Study B (Explicit State Change: 120-250ms, 6-8px, distinct feedback) trên baseline Option A | Exploration | Preserves visual invariants & light theme | Runtime test & screenshot |
| C-011 | 2 | `screenshots/` | Chụp 4 ảnh minh chứng authoritative DPR=2 cho Study A & B ở desktop 1440x900 và mobile 390x844 | Evidence collection | None | Image dimension & DPR verification |
| C-012 | 2 | `CHECKPOINT_13_1.yaml` | Biên soạn payload bàn giao Checkpoint 13.1 cho Controller Sol | Milestone handoff | None | Controller review |

Không sửa các file trong `baseline/`, `assets/` hoặc `governance/`. Mọi thay đổi candidate phải được ghi trước khi submission.

## [REVISION R01] — 15/09/2026 08:50 (Asia/Ho_Chi_Minh)
### Checkpoint Review 001 Findings Remediation (F01–F09)

1. **F01 (ZIP Archive Hierarchy)**:
   - Thay thế PowerShell `Compress-Archive` bằng Python script `pack_checkpoint_r01.py`.
   - Giữ nguyên cấu trúc phân cấp tương đối chuẩn Unix forward-slash (`studies/option_a/index.html`, `screenshots/...`), loại bỏ hoàn toàn hiện tượng làm phẳng trùng tên `index.html`.
2. **F02 (Verification Runner Portability)**:
   - Tái cấu trúc `verify_checkpoint_13_1.js` sử dụng `path.resolve(__dirname)`, loại bỏ toàn bộ đường dẫn tuyệt đối tác giả.
   - Bổ sung thuật toán tự động nhận diện Chromium đa nền tảng (`--chrome-path`, biến môi trường `CHROME_PATH`, danh sách ứng viên tiêu chuẩn).
3. **F03 (Contract Source of Truth & Clean Tokens)**:
   - Cập nhật `MOTION_CONTRACT.yaml` bổ sung tường minh `study_profiles.option_a` (100/160/220ms, 4px) và `study_profiles.option_b` (120/180/240ms, 8px).
   - Thanh lọc triệt để `box-shadow` khỏi danh sách thuộc tính cho phép và pattern P3.
   - Chuyển trạng thái sang `status: DRAFT_PENDING_CONTROLLER`.
4. **F04 (Pattern P2 Duration Hard Cap)**:
   - Điều chỉnh pulse pending về `iterations: 1`, `duration: durationSlow` (220ms ở Study A, 240ms ở Study B).
   - Đo đạc thực tế `effect.getComputedTiming().activeDuration` cam kết nghiêm ngặt ≤ 240ms ≤ 300ms hard cap.
5. **F05 (Pattern P1 Reversal & Zero Queue)**:
   - Thiết kế lại cơ chế đảo chiều WAAPI: hủy đồng thời cả content và chevron, đảo chiều mượt từ progress hiện tại.
   - S settle dọn dẹp sạch sẽ inline styles (`transform: ''`, `opacity: ''`), cam kết `getAnimations({subtree: true}).length === 0`.
   - Stress test 10 lần toggle dồn dập đạt độ chẵn lẻ chính xác và queue = 0.
6. **F06 (Six-Axis Strategic Divergence)**:
   - Triển khai đầy đủ logic khác biệt runtime cho 6/6 trục: Duration (100/160/220ms vs 120/180/240ms), Easing, Spatial Displacement (4px vs 8px), Opacity Sequencing (đồng thời vs 60% opacity lead), Emphasis Treatment (scale 1.01 vs 1.02), Interruption Model (waapi_reverse vs step_reversal).
   - Đo đạc trực tiếp từ `window.__MOTION_TOKENS` tại browser runtime, không hard-code boolean.
7. **F07 (Pattern P3 Heading Click Isolation)**:
   - Xóa bỏ hoàn toàn sự kiện click trên `.hero-heading` (h2), bảo đảm tính tương đương của người dùng bàn phím.
   - Duy trì duy nhất nút điều khiển native `#btn-highlight-t01` đạt chuẩn diện tích bấm ≥ 44x44px và semantics.
8. **F08 (Checkpoint Smoke Evidence)**:
   - Xuất bản đầy đủ `CHECKPOINT_VERIFICATION.json` và `CHECKPOINT_VERIFICATION_CONSOLE.log` với 96 assertions targeted probes.
   - Khảo sát chuyên sâu `prefers-reduced-motion: reduce`, Tab/Enter keyboard navigation, focus retention và CLS = 0.
9. **F09 (Header & Asset Integrity)**:
   - Cập nhật tiêu đề ngữ nghĩa sang `TRIPFLOW OPERATIONAL SUITE · MODULE 13 MOTION FOUNDATION`.
   - Chuẩn hóa thuộc tính định danh SVG chevron `data-testid="disclosure-chevron"`.
