## 2026-09-14T01:40:32Z
You are a teamwork_preview_worker subagent.
Your assigned working directory is: C:\Users\game\.gemini\exercises\stream-a\module_008\.agents\worker_m2_option_a
Your parent orchestrator conversation ID is: ddadc42f-4bd4-4349-9f2a-586f51c6b758
Workspace root is: C:\Users\game\.gemini\exercises\stream-a\module_008

You MUST read and strictly adhere to:
- C:\Users\game\.gemini\exercises\stream-a\module_008\ORIGINAL_REQUEST.md
- C:\Users\game\.gemini\exercises\stream-a\module_008\.agents\orchestrator_1\PROJECT.md
- C:\Users\game\.gemini\exercises\stream-a\module_008\COLOR_CONTRACT.yaml
- C:\Users\game\.gemini\exercises\stream-a\module_008\.agents\explorer_survey_2\handoff.md
- C:\Users\game\.gemini\exercises\stream-a\DESIGN_TRAINING_STREAM_A_DIRECTIVE.md
- C:\Users\game\.gemini\exercises\stream-a\DESIGN_TRAINING_008_INITIAL_REVIEW_001.md

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Exclusive Write Ownership:
You exclusively own: `C:\Users\game\.gemini\exercises\stream-a\module_008\directions\option_a.html`.
Do NOT modify any other files.

Task Objective (Milestone 2 / R2 - Option A):
Build the complete, production-grade standalone prototype for Option A: Editorial Warm Dispatch (`directions/option_a.html`):
1. Visual & Aesthetic Architecture:
   - Canvas background: `#FAF9F6` (Alabaster warm paper).
   - Surface background: `#FFFFFF` (Card/Table background).
   - Brand Primary: `#0F172A` (Slate ink, 16.96:1 contrast on canvas). Strictly for header identity, logo, and Primary Action CTA. NEVER used for status.
   - Focus visible ring: `:focus-visible` with `2px solid #D97706`, `outline-offset: 2px` (Amber, 3.03:1 contrast on canvas, 3.19:1 on surface).
   - Text hierarchy: Text Primary `#0F172A` (16.96:1), Text Secondary `#475569` (7.20:1), Text Muted `#64748B` (4.85:1).
   - Borders: Subtle 1px `#E2E8F0`.
   - Typography: Humanist Sans-Serif stack (`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`).
2. Status Badges & Three Synchronized Sensory Layers:
   - NORMAL: Text `#475569`, Bg `#F1F5F9`, Border `1px solid #CBD5E1` (Text/Bg: 6.92:1) | Vietnamese label "Bình thường" | Standalone SVG circle icon `aria-hidden="true"` `focusable="false"`.
   - ATTENTION: Text `#B45309`, Bg `#FEF3C7`, Border `1px solid #F59E0B` (Text/Bg: 4.51:1) | Vietnamese label "Cần chú ý" | Standalone SVG warning triangle icon `aria-hidden="true"`.
   - ERROR: Text `#BE123C`, Bg `#FFE4E6`, Border `1px solid #F43F5E` (Text/Bg: 5.24:1) | Vietnamese label "Lỗi đối tác" | Standalone SVG stop octagon icon `aria-hidden="true"`.
   - SUCCESS: Text `#15803D`, Bg `#DCFCE7`, Border `1px solid #22C55E` (Text/Bg: 4.57:1) | Vietnamese label "Hoàn tất điều phối" | Standalone SVG check shield icon `aria-hidden="true"`.
3. Three-Tier CSS Custom Property Hierarchy in `<style>`:
   - Declare `:root`:
     (1) Primitive tokens: `--primitive-slate-*`, `--primitive-warm-*`, `--primitive-amber-*`, `--primitive-rose-*`, `--primitive-green-*`.
     (2) Semantic tokens: `--color-canvas-bg: var(--primitive-warm-50)`, `--color-brand-primary: var(--primitive-slate-900)`, `--color-focus-ring: var(--primitive-amber-500)`, `--color-status-*`.
     (3) Component tokens: `--dispatch-card-bg: var(--color-surface-bg)`, `--dispatch-badge-*`.
   - Invariant: Zero component CSS classes may call `--primitive-*` directly.
4. Canonical Synthetic Ledger Fixture:
   - Header with title: "TRIPFLOW DISPATCH LEDGER — SỔ CÁI ĐIỀU PHỐI TOUR (Hướng A: Editorial Warm Dispatch)".
   - Synthetic Notice Banner: `<aside class="fixture-notice" role="note" aria-label="Thông báo dữ liệu thử nghiệm"><span class="badge-tag">DATA_CLASSIFICATION: SYNTHETIC_TRAINING_FIXTURE</span> <span>Dữ liệu giả lập huấn luyện nội bộ — Không đại diện cho khách hàng hoặc hiệu suất thực tế.</span></aside>`.
   - 4 KPI summary cards (Tổng tour: 4, Bình thường: 1, Cần chú ý: 1, Lỗi đối tác: 1, Hoàn tất: 1).
   - Control bar with search input and filter tabs.
   - Ledger Table (with `<caption>`, `<thead>`, `<tbody>`, `<th scope="col">` on Desktop/Tablet, responsive card grid on mobile):
     - TF-801 (HAN-NBI-01): "Tour Tràng An - Bái Đính 1 Ngày" | NORMAL | 35/35 khách | Huy Trần.
     - TF-802 (HAN-SAP-02): "Tour Fansipan Sapa 2 Ngày 1 Đêm" | ATTENTION | 18/20 khách | Lan Nguyễn | Nút thao tác: "Rà soát xe trung chuyển".
     - TF-803 (HPH-HLB-03): "Tour Hạ Long Du Thuyền 5 Sao" | ERROR | 24/24 khách | Huy Trần | Nút thao tác khẩn cấp: "Kích hoạt phương án dự phòng".
     - TF-804 (SGN-PQU-04): "Tour Đảo Phú Quốc Sunset 3 Ngày 2 Đêm" | SUCCESS | 42/42 khách | Lan Nguyễn | Đã đóng hồ sơ.
5. Asynchronous Interaction FSM & Focus Preservation:
   - Implement FSM states (IDLE, VALIDATING, SAVING, FAILURE, CONFIRMED).
   - On clicking action button, transition to VALIDATING -> SAVING.
   - Use `aria-disabled="true"` and JavaScript intercept instead of native HTML `disabled`, preventing browser focus eviction to `document.body`.
   - Programmatic focus transfer to "Thử lại" on failure.
   - Live announcer `<div role="status" aria-live="polite" class="sr-only">`.
6. Responsive Cadence (Zero Overflow):
   - Desktop 1440x900, Tablet 768x1024, Mobile 390x844. Must have 0 horizontal overflow (`scrollWidth <= innerWidth`).

Verification & Delivery:
- Verify that `directions/option_a.html` is valid HTML5.
- Document token structures, contrast measurements, and verification evidence in `handoff.md` in your working directory.
- Maintain `progress.md` in your directory.
- Send a message back to parent orchestrator (ddadc42f-4bd4-4349-9f2a-586f51c6b758) when done.
