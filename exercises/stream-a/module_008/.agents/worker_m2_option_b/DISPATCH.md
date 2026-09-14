# DISPATCH - worker_m2_option_b

## 2026-09-14T01:40:32Z
You are a teamwork_preview_worker subagent.
Your assigned working directory is: C:\Users\game\.gemini\exercises\stream-a\module_008\.agents\worker_m2_option_b
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
You exclusively own: `C:\Users\game\.gemini\exercises\stream-a\module_008\directions\option_b.html`.
Do NOT modify any other files.

Task Objective (Milestone 2 / R2 - Option B):
Build the complete, production-grade standalone prototype for Option B: Technical Slate High-Contrast (`directions/option_b.html`):
1. Visual & Aesthetic Architecture:
   - Canvas background: `#F8FAFC` (Cool ice slate).
   - Surface background: `#FFFFFF` (Card/Table surface).
   - Brand Primary: `#3730A3` (Technical Indigo, 9.93:1 contrast on white surface, 9.3:1 on canvas). Strictly for identity and Primary Action CTA. NEVER used for status.
   - Focus visible ring: `:focus-visible` with `2px solid #2563EB`, `outline-offset: 2px` (Cobalt, 4.94:1 contrast on canvas, 5.17:1 on surface).
   - Text hierarchy: Text Primary `#020617` (17.4:1), Text Secondary `#334155` (8.8:1), Text Muted `#475569` (7.2:1).
   - Borders: Bold structural 1.5px `#94A3B8` / `#CBD5E1`.
   - Typography: Monospace/tabular fonts for codes, badges, and figures (`ui-monospace, "SF Mono", Menlo, Consolas, monospace`, `font-variant-numeric: tabular-nums`) combined with `Inter, system-ui, sans-serif` for body.
2. Status Badges & Three Synchronized Sensory Layers:
   - NORMAL: Text `#1E293B`, Bg `#E2E8F0`, Border `1.5px solid #94A3B8` (Text/Bg: 11.87:1) | Prefix tag `[STD]` | Vietnamese label "Bình thường" | Standalone SVG square/circle icon `aria-hidden="true"`.
   - ATTENTION: Text `#9A3412`, Bg `#FFEDD5`, Border `1.5px solid #EA580C` (Text/Bg: 6.38:1) | Prefix tag `[WARN]` | Vietnamese label "Cần chú ý" | Standalone SVG warning triangle icon `aria-hidden="true"`.
   - ERROR: Text `#9F1239`, Bg `#FFE4E6`, Border `1.5px solid #E11D48` (Text/Bg: 6.68:1) | Prefix tag `[ERR]` | Vietnamese label "Lỗi đối tác" | Standalone SVG stop octagon icon `aria-hidden="true"`.
   - SUCCESS: Text `#115E59`, Bg `#CCFBF1`, Border `1.5px solid #0D9488` (Text/Bg: 6.73:1) | Prefix tag `[OK]` | Vietnamese label "Hoàn tất điều phối" | Standalone SVG check shield icon `aria-hidden="true"`.
3. Three-Tier CSS Custom Property Hierarchy in `<style>`:
   - Declare `:root`:
     (1) Primitive tokens: `--primitive-slate-*`, `--primitive-indigo-*`, `--primitive-blue-*`, `--primitive-orange-*`, `--primitive-rose-*`, `--primitive-teal-*`.
     (2) Semantic tokens: `--color-canvas-bg: var(--primitive-slate-50)`, `--color-brand-primary: var(--primitive-indigo-800)`, `--color-focus-ring: var(--primitive-blue-600)`, `--color-status-*`.
     (3) Component tokens: `--dispatch-card-bg: var(--color-surface-bg)`, `--dispatch-badge-*`.
   - Invariant: Zero component CSS classes may call `--primitive-*` directly.
4. Canonical Synthetic Ledger Fixture:
   - Header with title: "TRIPFLOW DISPATCH LEDGER — SỔ CÁI ĐIỀU PHỐI TOUR (Hướng B: Technical Slate High-Contrast)".
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
