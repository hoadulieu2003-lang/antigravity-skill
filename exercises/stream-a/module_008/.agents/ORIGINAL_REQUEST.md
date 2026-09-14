# Original User Request

## Initial Request — 2026-09-14T01:30:17Z

# Teamwork Project Prompt — Module 08: Color System

Build and verify a complete, production-grade Color System and Dispatch Ledger for TRIPFLOW across two distinct visual directions, enforcing WCAG 2.2 AA contrast, color-independent redundant cues, three-tier token architecture, and programmatic forensic verification for Gates C01–C07.

Working directory: C:\Users\game\.gemini\exercises\stream-a\module_008
Integrity mode: development

Reference materials:
- C:\Users\game\.gemini\exercises\stream-a\DESIGN_TRAINING_STREAM_A_DIRECTIVE.md
- C:\Users\game\.gemini\exercises\stream-a\DESIGN_TRAINING_008_INITIAL_REVIEW_001.md
- C:\Users\game\.gemini\exercises\stream-a\DESIGN_TRAINING_008_PROPOSAL.md

## Requirements

### R1. Three-Tier Token Architecture & Contract (COLOR_CONTRACT.yaml)
Establish a strict three-tier CSS custom property hierarchy (Primitive -> Semantic -> Component) in COLOR_CONTRACT.yaml and CSS :root. Components must never reference primitive tokens directly in CSS selectors. Explicitly segregate the Brand Primary identity/action role from the Operational Status colors (NORMAL, ATTENTION, ERROR, SUCCESS). Separate operational status taxonomy from interaction FSM states (IDLE, VALIDATING, SAVING, FAILURE, CONFIRMED).

### R2. Two Distinct Visual Color Directions (directions/option_a.html & option_b.html)
Implement two fully functional, visually distinct art directions on identical synthetic canonical data:
- Direction A (Editorial Warm Dispatch): Warm Alabaster canvas (#FAF9F6), Deep Slate Ink brand primary (#0F172A), Amber focus ring (#D97706), calm pastel status badges with high-saturation subtle borders.
- Direction B (Technical Slate High-Contrast): Cool Ice Slate canvas (#F8FAFC), Technical Indigo brand primary (#3730A3), Cobalt focus ring (#2563EB), bold contrast status badges with 1.5px structural borders.
Both directions must feature distinct visual theses, temperature, brand identity, and border treatments without relying on arbitrary Delta L cutoffs.

### R3. Final Candidate Release (index.html) & Redundant Non-Color Cues
Develop the final selected candidate (index.html) managing four canonical operational tours (TF-801 to TF-804). Every operational status must present three synchronized sensory layers:
1. Explicit Vietnamese text label (status_label).
2. Distinct non-color geometric/SVG marker with aria-hidden="true".
3. High-contrast semantic color tokens (background, border, text).
Interactive task submissions must support an asynchronous FSM with retry resilience and aria-disabled behavior without focus eviction.

### R4. Automated Forensic Verification Engine (verify_module_008.js & VERIFICATION.json)
Construct a standalone Node.js Puppeteer script (verify_module_008.js) to independently verify all seven gates C01–C07:
- Audit static token provenance and verify runtime computed values.
- Calculate sRGB relative luminance and contrast ratios from live DOM computed styles for all text/background and non-text pairs.
- Measure native keyboard :focus-visible indicators across three distinct interactive contexts (Primary CTA, secondary action/filter, and interactive tour card).
- Assert 0 horizontal overflow across Desktop (1440x900), Tablet (768x1024), and Mobile (390x844).
- Capture eight authoritative DPR=2 screenshots: Option A, Option B, Final (Desktop, Tablet, Mobile), Grayscale, Deuteranopia simulation, and Protanopia simulation (using SVG feColorMatrix).
- Export all raw measurement data and simulation metadata into VERIFICATION.json.

### R5. Comprehensive Report & Portable Submission Package
Compile DESIGN_TRAINING_008_REPORT.md adhering strictly to Sol's eight required sections: Objective & synthetic data notice, three bounded principles, two directions analysis, selected direction & trade-offs, requirement-to-evidence mapping table, test results & evidence limits, self-critique (STRENGTH, DEFECT, TRADEOFF, PREFERENCE), and verdict recommendation. Package everything into design_training_008_submission_r01.zip using pure forward slashes /.

## Acceptance Criteria

### Token Provenance & Architecture (Gate C01)
- [ ] Static source analysis confirms component tokens reference semantic tokens, which reference primitive tokens; 0 primitive tokens called directly in component selectors.
- [ ] Runtime computed styles on components accurately resolve to declared design tokens.

### Strategic Color Directions (Gate C02)
- [ ] Option A and Option B render identical four-tour canonical dataset and identical operational features.
- [ ] Directions differ in canvas temperature, brand primary color, and border/status badge strategy.

### Mathematical Contrast Compliance (Gate C03)
- [ ] Computed contrast for all normal body/label text against adjacent background is >= 4.5:1 (e.g. #0F172A on #FAF9F6 = 16.96:1, #475569 on #FAF9F6 = 7.20:1).
- [ ] Computed contrast for large text and meaningful non-text boundaries/focus rings is >= 3.0:1.

### Color-Independent Usability (Gate C04)
- [ ] Every operational status badge contains visible text label and semantic inline SVG icon.
- [ ] Grayscale screenshot and SVG feColorMatrix CVD simulations (Deuteranopia & Protanopia) generated and verified.

### Focus Ring Verification (Gate C05)
- [ ] Native keyboard navigation activates :focus-visible outline >= 2px solid.
- [ ] Focus outline contrast against adjacent background is >= 3.0:1 across Primary CTA, secondary button, and tour card.

### Responsive Cadence (Gate C06)
- [ ] scrollWidth <= innerWidth across 1440x900, 768x1024, and 390x844 viewports.
- [ ] Integrated directly into boolean conjunction pass formula.

### Documentation & Deliverables (Gate C07)
- [ ] DESIGN_TRAINING_008_REPORT.md cleanly segregates Telemetry data, Visual inspection, and Design hypotheses.
- [ ] design_training_008_submission_r01.zip contains all 8 required authoritative screenshots and verified artifacts.
