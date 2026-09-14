# Project: Module 08 Color System & Dispatch Ledger (TRIPFLOW)

## Architecture
- **Layered Token Architecture**: Primitive Tokens (`--primitive-*`) -> Semantic Tokens (`--color-*`) -> Component Tokens (`--dispatch-*`, `--button-*`).
- **Strict Color & State Segregation**:
  - Brand Primary (`#0F172A` in Option A, `#3730A3` in Option B) strictly reserved for identity and Primary Action CTAs; NEVER used for operational status.
  - Operational Status taxonomy (`NORMAL`, `ATTENTION`, `ERROR`, `SUCCESS`) strictly separated from Interaction FSM (`IDLE`, `VALIDATING`, `SAVING`, `FAILURE`, `CONFIRMED`).
- **Three-Tier Synchronized Sensory Layers**:
  - Layer 1: Explicit Vietnamese text labels ("Bình thường", "Cần chú ý", "Lỗi đối tác", "Hoàn tất điều phối").
  - Layer 2: Standalone SVG geometric icons (`aria-hidden="true"`, `focusable="false"`) distinct in shape (circle, triangle, octagon, shield/check).
  - Layer 3: Semantic color tokens with WCAG 2.2 AA contrast ratios (>4.5:1 text, >3.0:1 borders/focus).
- **Asynchronous FSM & Focus Preservation**:
  - `aria-disabled="true"` with `pointer-events: none` / click intercept instead of native HTML `disabled` to prevent browser Focus Eviction to `document.body`.
  - Programmatic focus transfer to "Thử lại" on `FAILURE`.
  - `aria-live="polite"` real-time announcements.
- **Dual Track Organization**:
  - **Implementation Track**: M1 (R1 Token Contract) -> M2 (R2 Visual Directions A & B) -> M3 (R3 Final Candidate index.html & FSM).
  - **E2E Testing Track**: M4 (R4 Automated Puppeteer Gate Verification Engine C01–C07 & 8 DPR=2 Screenshots).
  - **Convergence & Hardening**: M5 (Pass 100% E2E tests, Adversarial Challenger, Forensic Audit) -> M6 (R5 Sol's 8-Section Report & ZIP package).

## Code Layout
- `COLOR_CONTRACT.yaml` — Authoritative YAML token hierarchy contract.
- `directions/option_a.html` — Option A: Editorial Warm Dispatch prototype (#FAF9F6, #0F172A, #D97706 focus).
- `directions/option_b.html` — Option B: Technical Slate High-Contrast prototype (#F8FAFC, #3730A3, #2563EB focus).
- `index.html` — Final release candidate with full FSM, redundant cues, and responsive ledger.
- `verify_module_008.js` — Standalone Puppeteer verification suite evaluating Gates C01–C07.
- `package_zip_008.py` — Deterministic Python script packaging ZIP with 100% forward slashes (`/`).
- `screenshots/` — 8 authoritative DPR=2 screenshots (Option A, Option B, Final Desktop, Tablet, Mobile, Grayscale, Deuteranopia, Protanopia).
- `VERIFICATION.json` — Machine-readable raw evidence ledger for Gates C01–C07.
- `DESIGN_TRAINING_008_REPORT.md` — Sol's 8-section comprehensive engineering report.
- `design_training_008_submission_r01.zip` — Packaged release archive.

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Three-Tier Token Architecture | Primitive -> Semantic -> Component custom properties in YAML and CSS :root | M1 | Spec Miner / Directive |
| 2 | Brand Primary vs Status Segregation | Brand primary never used as status color | M1, M2, M3 | Locked Correction P01 |
| 3 | Operational Status vs FSM Segregation | Domain status (NORMAL..SUCCESS) separated from FSM (IDLE..CONFIRMED) | M1, M2, M3 | Locked Correction P01 |
| 4 | Synthetic Canonical Fixture | TF-801 to TF-804 with synthetic notice banner | M2, M3 | Directive / Review |
| 5 | Option A Visual Implementation | Editorial Warm (#FAF9F6, #0F172A, #D97706 focus, pastel badges) | M2 | Original Request / Explorer 2 |
| 6 | Option B Visual Implementation | Technical Slate (#F8FAFC, #3730A3, #2563EB focus, 1.5px structural borders) | M2 | Original Request / Explorer 2 |
| 7 | Candidate UI Shell & Responsive Ledger | Layout, Header, KPI cards, Filter tabs, Table/Card responsive layout | M3 | Explorer 2 / Review |
| 8 | Redundant Non-Color Cues | Vietnamese labels + SVG geometric icons (aria-hidden="true") + colors | M3 | Locked Correction P06 |
| 9 | Asynchronous Interaction FSM | IDLE->VALIDATING->SAVING->FAILURE/CONFIRMED with aria-disabled & focus preservation | M3 | Explorer 2 / Locked P01 |
| 10 | Gate C01 Verification | Static regex audit of source CSS and runtime getComputedStyle audit | M4 | Spec Miner / Proposal |
| 11 | Gate C02 Verification | Programmatic validation of distinct visual strategies (A vs B) | M4 | Spec Miner / Locked P05 |
| 12 | Gate C03 Verification | Mathematical W3C WCAG 2.2 relative luminance & contrast ratio calculation | M4 | Spec Miner / Locked P03 |
| 13 | Gate C04 Verification | Automated DOM validation of redundant cues | M4 | Spec Miner / Locked P06 |
| 14 | Gate C05 Verification | Real keyboard Tab navigation & :focus-visible outline contrast (>=3.0:1) across 3 contexts | M4 | Spec Miner / Locked P07 |
| 15 | Gate C06 Verification | Responsive cadence: 0 horizontal overflow (1440x900, 768x1024, 390x844) | M4 | Spec Miner / Directive |
| 16 | Gate C07 Verification | Evidence Ledger output to VERIFICATION.json segregating Telemetry, Visual, Hypotheses | M4 | Spec Miner / Review |
| 17 | 8 DPR=2 Authoritative Screenshots | Option A, Option B, Final Desktop, Tablet, Mobile, Grayscale, Deuteranopia, Protanopia | M4 | Original Request / Directive |
| 18 | E2E Test Suite Execution & Pass | All gates pass with exit code 0 | M5 | Project Pattern |
| 19 | Forensic Integrity Audit | Independent verification of zero cheating / zero hardcoding / zero facade | M5 | Project Pattern / Auditor |
| 20 | Adversarial Challenger Testing | Edge cases, viewport stress, FSM race condition testing | M5 | Project Pattern / Challenger |
| 21 | Sol's 8-Section Report | DESIGN_TRAINING_008_REPORT.md following required sections | M6 | Original Request / Spec Miner |
| 22 | Forward-Slash ZIP Packaging | design_training_008_submission_r01.zip containing all 8 artifacts with pure '/' paths | M6 | Directive / Explorer 1 |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Token Contract Architecture (R1) | COLOR_CONTRACT.yaml establishing 3-tier hierarchy & segregation | None | IN_PROGRESS |
| M2 | Visual Direction Prototypes (R2) | directions/option_a.html & directions/option_b.html on TF-801..804 | M1 | PLANNED |
| M3 | Final Candidate & Resilient FSM (R3) | index.html with 3 sensory layers, aria-disabled, focus preservation | M1, M2 | PLANNED |
| M4 | E2E Verification Engine & Screenshots (R4) | verify_module_008.js (Gates C01-C07, 8 DPR=2 screenshots, VERIFICATION.json) | M1 | IN_PROGRESS |
| M5 | Final Verification, Audit & Hardening | Pass 100% E2E tests, Reviewer approvals, Challenger stress, Auditor CLEAN | M3, M4 | PLANNED |
| M6 | Sol's Report & Artifact Packaging (R5) | DESIGN_TRAINING_008_REPORT.md (8 sections) & submission zip archive | M5 | PLANNED |

## Interface Contracts
### Token Contract ↔ HTML Prototypes & Release Candidate
- Primitive tokens: `--primitive-[hue]-[step]` (e.g. `--primitive-slate-900: #0F172A`, `--primitive-amber-500: #D97706`, `--primitive-indigo-800: #3730A3`).
- Semantic tokens: `--color-canvas-bg`, `--color-surface-bg`, `--color-text-primary`, `--color-text-secondary`, `--color-text-muted`, `--color-border-subtle`, `--color-brand-primary`, `--color-focus-ring`.
- Status tokens: `--color-status-normal-{text,bg,border}`, `--color-status-attention-{text,bg,border}`, `--color-status-error-{text,bg,border}`, `--color-status-success-{text,bg,border}`.
- Component tokens: `--dispatch-card-bg`, `--dispatch-badge-padding`, `--dispatch-table-header-bg`, etc.
- Invariant: Zero direct primitive references in component classes.

### Verification Engine ↔ Artifacts
- `verify_module_008.js` inspects:
  - `COLOR_CONTRACT.yaml` (YAML parse & structure check)
  - `directions/option_a.html` (DOM, CSS tokens, contrast, DPR=2 screenshot)
  - `directions/option_b.html` (DOM, CSS tokens, contrast, DPR=2 screenshot)
  - `index.html` (DOM, CSS tokens, contrast, focus-visible outline, responsive overflow, FSM states, DPR=2 screenshots)
- Outputs `VERIFICATION.json` with exact gate results: `{ "gates": { "C01": {...}, "C02": {...}, "C03": {...}, "C04": {...}, "C05": {...}, "C06": {...}, "C07": {...} }, "overall_pass": true }`.
