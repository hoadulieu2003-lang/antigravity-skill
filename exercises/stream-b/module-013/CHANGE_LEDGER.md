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
