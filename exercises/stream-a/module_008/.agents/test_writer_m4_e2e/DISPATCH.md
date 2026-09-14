## 2026-09-14T01:35:13Z

You are a teamwork_preview_test_writer subagent.
Your assigned working directory is: C:\Users\game\.gemini\exercises\stream-a\module_008\.agents\test_writer_m4_e2e
Your parent orchestrator conversation ID is: ddadc42f-4bd4-4349-9f2a-586f51c6b758
Workspace root is: C:\Users\game\.gemini\exercises\stream-a\module_008

You MUST read and strictly adhere to:
- C:\Users\game\.gemini\exercises\stream-a\module_008\ORIGINAL_REQUEST.md
- C:\Users\game\.gemini\exercises\stream-a\module_008\.agents\orchestrator_1\PROJECT.md
- C:\Users\game\.gemini\exercises\stream-a\module_008\.agents\spec_miner_survey_1\handoff.md
- C:\Users\game\.gemini\exercises\stream-a\module_008\.agents\explorer_survey_1\handoff.md
- C:\Users\game\.gemini\exercises\stream-a\module_008\.agents\explorer_survey_2\handoff.md
- C:\Users\game\.gemini\exercises\stream-a\DESIGN_TRAINING_STREAM_A_DIRECTIVE.md
- C:\Users\game\.gemini\exercises\stream-a\DESIGN_TRAINING_008_INITIAL_REVIEW_001.md

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Exclusive Write Ownership:
You exclusively own: `C:\Users\game\.gemini\exercises\stream-a\module_008\verify_module_008.js`.
Do NOT modify any HTML or YAML files.

Task Objective (Milestone 4 / R4):
Build the complete, production-grade standalone Node.js Puppeteer verification engine `verify_module_008.js` to evaluate Gates C01 through C07 and capture the 8 authoritative DPR=2 screenshots.

Key Implementation Specifications:
1. Puppeteer Launch & Environment:
   - Require `puppeteer-core` (use fallback to `C:/Users/game/cdp_reader/node_modules/puppeteer-core` if standard require fails).
   - Launch with `executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe'`, args: `['--no-sandbox', '--disable-setuid-sandbox']`, headless: 'new'.
2. Gate C01: Token Provenance & Architecture:
   - Static regex audit: Scan HTML/CSS source code to ensure 3-tier hierarchy and verify that NO component selector directly calls `--primitive-*` tokens.
   - Runtime audit: Verify `window.getComputedStyle` matches declared tokens.
3. Gate C02: Strategic Color Directions:
   - Programmatically compare `directions/option_a.html` and `directions/option_b.html`.
   - Verify distinct Brand Primary, Canvas temperature, border styles, typography treatments, and that both render canonical fixtures TF-801..TF-804.
4. Gate C03: Mathematical Contrast Compliance:
   - Implement exact W3C sRGB Relative Luminance equation:
     L = 0.2126 * Rlin + 0.7152 * Glin + 0.0722 * Blin
     Contrast = (L1 + 0.05) / (L2 + 0.05)
   - Test all 4 status badges (NORMAL, ATTENTION, ERROR, SUCCESS), Primary CTA, Secondary actions, and focus rings.
   - Assert text >=4.5:1, non-text/focus >=3.0:1.
5. Gate C04: Color-Independent Usability:
   - Audit DOM for presence of 3 synchronized sensory layers:
     (1) Vietnamese label ("Bình thường", "Cần chú ý", "Lỗi đối tác", "Hoàn tất điều phối")
     (2) SVG geometric icon with `aria-hidden="true"` and `focusable="false"`
     (3) Semantic color tokens.
6. Gate C05: Real Keyboard Focus Indicator:
   - Use native `page.keyboard.press('Tab')` to navigate to:
     (1) Primary CTA button
     (2) Secondary filter/action
     (3) Interactive tour action button (TF-802)
   - Measure `:focus-visible` outline: outlineWidth >= 2px, outlineStyle === 'solid', and contrast ratio of outline color against adjacent background >= 3.0:1.
7. Gate C06: Responsive Cadence & Overflow:
   - Test at Desktop (1440x900), Tablet (768x1024), and Mobile (390x844).
   - Assert `scrollWidth <= innerWidth` (0 horizontal overflow) across all viewports.
8. Gate C07 & Evidence Ledger:
   - Output all raw telemetry, metrics, and gate results into `VERIFICATION.json` at workspace root.
   - Strictly segregate Telemetry, Visual Review, and Hypotheses in the ledger.
9. Authoritative DPR=2 Screenshot Capture:
   - Capture 8 screenshots to `C:\Users\game\.gemini\exercises\stream-a\module_008\screenshots\`:
     1. `option_a_desktop.png` (Option A, 1440x900, DPR=2)
     2. `option_b_desktop.png` (Option B, 1440x900, DPR=2)
     3. `candidate_desktop.png` (index.html, 1440x900, DPR=2)
     4. `candidate_tablet.png` (index.html, 768x1024, DPR=2)
     5. `candidate_mobile.png` (index.html, 390x844, DPR=2)
     6. `candidate_grayscale.png` (index.html with CSS grayscale(100%))
     7. `candidate_deuteranopia.png` (index.html with SVG feColorMatrix Deuteranopia)
     8. `candidate_protanopia.png` (index.html with SVG feColorMatrix Protanopia)

Verification & Delivery:
- Run syntax check on `verify_module_008.js`.
- Document implementation details in your `handoff.md`.
- Maintain `progress.md` in your directory.
- Send a message back to parent orchestrator (ddadc42f-4bd4-4349-9f2a-586f51c6b758) when done.
