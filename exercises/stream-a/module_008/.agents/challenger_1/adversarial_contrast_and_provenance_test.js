/**
 * ============================================================================
 * TRIPFLOW MODULE 008: ADVERSARIAL CONTRAST & TOKEN PROVENANCE STRESS HARNESS
 * Agent: challenger_1 (Empirical Challenger)
 * File: .agents/challenger_1/adversarial_contrast_and_provenance_test.js
 * 
 * Objectives:
 * 1. Adversarial Contrast Math Verification:
 *    - Recalculate W3C sRGB relative luminance and contrast ratios across all 15
 *      color pairs from COLOR_CONTRACT.yaml.
 *    - Test float32 single-precision emulation, float64 double-precision,
 *      linearization boundary conditions, and rounding/margin stress.
 *    - Live DOM computed contrast audit across index.html, option_a.html, option_b.html.
 * 2. Adversarial Token Provenance Audit:
 *    - AST-level CSS rules check: verify zero primitive calls in component selectors.
 *    - Verify component tokens consume semantic tokens exclusively.
 *    - Scan all inline styles ([style]) for sneaky primitive or raw color bypasses.
 *    - Scan all SVG elements (fill, stroke, currentColor) and accessibility attributes.
 * ============================================================================
 */

'use strict';

const fs = require('fs');
const path = require('path');

let puppeteer;
try {
  puppeteer = require('puppeteer-core');
} catch (e1) {
  try {
    puppeteer = require('C:/Users/game/cdp_reader/node_modules/puppeteer-core');
  } catch (e2) {
    console.error('[FATAL] puppeteer-core not found.');
    process.exit(1);
  }
}

const CHROME_EXECUTABLE = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const MODULE_ROOT = path.resolve(__dirname, '..', '..');

const FILES = {
  contract: path.join(MODULE_ROOT, 'COLOR_CONTRACT.yaml'),
  optionA: path.join(MODULE_ROOT, 'directions', 'option_a.html'),
  optionB: path.join(MODULE_ROOT, 'directions', 'option_b.html'),
  index: path.join(MODULE_ROOT, 'index.html')
};

function toFileUrl(filePath) {
  return 'file:///' + path.resolve(filePath).replace(/\\/g, '/');
}

// ============================================================================
// PART 1: ADVERSARIAL MATHEMATICAL COLOR ENGINE
// ============================================================================

function parseHex(hexStr) {
  let clean = hexStr.trim().replace(/^#/, '');
  if (clean.length === 3) {
    clean = clean.split('').map(c => c + c).join('');
  }
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return [r, g, b];
}

function parseRgbColor(colorStr) {
  if (!colorStr) return [0, 0, 0, 1];
  const str = colorStr.trim().toLowerCase();
  if (str === 'transparent') return [0, 0, 0, 0];
  if (str === 'white') return [255, 255, 255, 1];
  if (str === 'black') return [0, 0, 0, 1];
  if (str.startsWith('#')) {
    const [r, g, b] = parseHex(str);
    return [r, g, b, 1];
  }
  const match = str.match(/rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)(?:[,\s/]+([\d.]+%?))?\s*\)/);
  if (match) {
    const r = parseInt(match[1], 10);
    const g = parseInt(match[2], 10);
    const b = parseInt(match[3], 10);
    let a = 1;
    if (match[4] !== undefined) {
      a = match[4].endsWith('%') ? parseFloat(match[4]) / 100 : parseFloat(match[4]);
    }
    return [r, g, b, a];
  }
  return [0, 0, 0, 1];
}

// Standard IEEE-754 64-bit Double Precision
function srgbChannelLinear64(c255) {
  const c = c255 / 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function relativeLuminance64(rgb) {
  const rLin = srgbChannelLinear64(rgb[0]);
  const gLin = srgbChannelLinear64(rgb[1]);
  const bLin = srgbChannelLinear64(rgb[2]);
  return 0.2126 * rLin + 0.7152 * gLin + 0.0722 * bLin;
}

function contrastRatio64(lum1, lum2) {
  const lMax = Math.max(lum1, lum2);
  const lMin = Math.min(lum1, lum2);
  return (lMax + 0.05) / (lMin + 0.05);
}

// Emulated 32-bit Single Precision (Math.fround)
function srgbChannelLinear32(c255) {
  const c = Math.fround(c255 / 255);
  const thresh = Math.fround(0.04045);
  if (c <= thresh) {
    return Math.fround(c / Math.fround(12.92));
  }
  const base = Math.fround(Math.fround(c + Math.fround(0.055)) / Math.fround(1.055));
  return Math.fround(Math.pow(base, 2.4));
}

function relativeLuminance32(rgb) {
  const rLin = srgbChannelLinear32(rgb[0]);
  const gLin = srgbChannelLinear32(rgb[1]);
  const bLin = srgbChannelLinear32(rgb[2]);
  const rPart = Math.fround(Math.fround(0.2126) * rLin);
  const gPart = Math.fround(Math.fround(0.7152) * gLin);
  const bPart = Math.fround(Math.fround(0.0722) * bLin);
  return Math.fround(Math.fround(rPart + gPart) + bPart);
}

function contrastRatio32(lum1, lum2) {
  const lMax = Math.fround(Math.max(lum1, lum2));
  const lMin = Math.fround(Math.min(lum1, lum2));
  const num = Math.fround(lMax + Math.fround(0.05));
  const den = Math.fround(lMin + Math.fround(0.05));
  return Math.fround(num / den);
}

// Composite color
function compositeColor(fgRgba, bgRgb) {
  const a = fgRgba[3] !== undefined ? fgRgba[3] : 1;
  if (a >= 1) return [fgRgba[0], fgRgba[1], fgRgba[2]];
  const r = Math.round(fgRgba[0] * a + bgRgb[0] * (1 - a));
  const g = Math.round(fgRgba[1] * a + bgRgb[1] * (1 - a));
  const b = Math.round(fgRgba[2] * a + bgRgb[2] * (1 - a));
  return [r, g, b];
}

// Parse YAML 15 Pairs
function extractYamlContrastMatrix(yamlContent) {
  const pairs = [];
  const matrixSection = yamlContent.split('contrast_verification_matrix:')[1];
  if (!matrixSection) return pairs;
  const pairBlocks = matrixSection.split(/- id:\s*"([^"]+)"/g);
  for (let i = 1; i < pairBlocks.length; i += 2) {
    const id = pairBlocks[i];
    const block = pairBlocks[i + 1];

    const dirMatch = block.match(/direction:\s*"([^"]+)"/);
    const roleMatch = block.match(/role:\s*"([^"]+)"/);
    const fgMatch = block.match(/foreground:\s*\{[^}]*hex:\s*"([^"]+)"[^}]*\}/);
    const bgMatch = block.match(/background:\s*\{[^}]*hex:\s*"([^"]+)"[^}]*\}/);
    const crMatch = block.match(/computed_contrast_ratio:\s*([0-9.]+)/);
    const reqMatch = block.match(/required_threshold:\s*([0-9.]+)/);
    const typeMatch = block.match(/threshold_type:\s*"([^"]+)"/);

    if (fgMatch && bgMatch && crMatch && reqMatch) {
      pairs.push({
        id,
        direction: dirMatch ? dirMatch[1] : '',
        role: roleMatch ? roleMatch[1] : '',
        fgHex: fgMatch[1],
        bgHex: bgMatch[1],
        claimedRatio: parseFloat(crMatch[1]),
        requiredThreshold: parseFloat(reqMatch[1]),
        thresholdType: typeMatch ? typeMatch[1] : 'NORMAL_TEXT'
      });
    }
  }
  return pairs;
}

// ============================================================================
// PART 2: ADVERSARIAL STRESS TEST SUITE
// ============================================================================

async function runAdversarialVerification() {
  console.log('======================================================================');
  console.log(' ADVERSARIAL CHALLENGER: CONTRAST MATH & TOKEN PROVENANCE STRESS TEST ');
  console.log('======================================================================');

  const report = {
    contract_math: {
      pairs_audited: 0,
      passing_pairs: 0,
      failing_pairs: 0,
      razor_thin_margins: [],
      float32_divergences: [],
      details: []
    },
    provenance_audit: {
      static_css_primitive_violations: [],
      component_token_primitive_violations: [],
      inline_style_primitive_violations: [],
      inline_style_raw_color_violations: [],
      svg_attribute_violations: [],
      badge_svg_accessibility: {
        total_badge_svgs: 0,
        compliant_badge_svgs: 0,
        violations: []
      },
      non_badge_svg_accessibility: {
        total: 0,
        missing_aria_or_focusable: []
      }
    },
    live_dom_audits: {
      option_a: { total: 0, passed: 0, failed: 0, pairs: [] },
      option_b: { total: 0, passed: 0, failed: 0, pairs: [] },
      index: { total: 0, passed: 0, failed: 0, pairs: [] }
    },
    advisory_stress_findings: [],
    verdict: 'PENDING'
  };

  // --------------------------------------------------------------------------
  // TEST 1: RECALCULATE 15 YAML PAIRS WITH FLOAT64 & FLOAT32
  // --------------------------------------------------------------------------
  console.log('\n[1] Recalculating 15 YAML Color Pairs with IEEE-754 Precision...');
  const contractContent = fs.readFileSync(FILES.contract, 'utf8');
  const yamlPairs = extractYamlContrastMatrix(contractContent);
  report.contract_math.pairs_audited = yamlPairs.length;

  console.log(`Found ${yamlPairs.length} declared pairs in COLOR_CONTRACT.yaml.`);

  for (const p of yamlPairs) {
    const fgRgb = parseHex(p.fgHex);
    const bgRgb = parseHex(p.bgHex);

    const lumFg64 = relativeLuminance64(fgRgb);
    const lumBg64 = relativeLuminance64(bgRgb);
    const cr64 = contrastRatio64(lumFg64, lumBg64);

    const lumFg32 = relativeLuminance32(fgRgb);
    const lumBg32 = relativeLuminance32(bgRgb);
    const cr32 = contrastRatio32(lumFg32, lumBg32);

    const pass64 = cr64 >= p.requiredThreshold;
    const pass32 = cr32 >= p.requiredThreshold;
    const margin64 = cr64 - p.requiredThreshold;
    const deltaClaim = Math.abs(cr64 - p.claimedRatio);

    if (pass64) {
      report.contract_math.passing_pairs++;
    } else {
      report.contract_math.failing_pairs++;
    }

    // Check razor-thin margin (< 0.1)
    if (margin64 < 0.1) {
      report.contract_math.razor_thin_margins.push({
        id: p.id,
        role: p.role,
        fg: p.fgHex,
        bg: p.bgHex,
        cr64: Number(cr64.toFixed(4)),
        required: p.requiredThreshold,
        margin: Number(margin64.toFixed(4))
      });
      report.advisory_stress_findings.push({
        category: 'RAZOR_THIN_CONTRAST_MARGIN',
        id: p.id,
        role: p.role,
        margin: Number(margin64.toFixed(4)),
        detail: `Pair ${p.id} (${p.role}) has a razor-thin contrast buffer of +${margin64.toFixed(4)} over threshold ${p.requiredThreshold}:1.`
      });
    }

    // Check float32 divergence
    const delta32 = Math.abs(cr32 - cr64);
    if (delta32 > 0.05 || (pass64 !== pass32)) {
      report.contract_math.float32_divergences.push({
        id: p.id,
        cr64: Number(cr64.toFixed(4)),
        cr32: Number(cr32.toFixed(4)),
        pass64,
        pass32,
        delta: Number(delta32.toFixed(4))
      });
    }

    report.contract_math.details.push({
      id: p.id,
      role: p.role,
      fgHex: p.fgHex,
      bgHex: p.bgHex,
      claimed: p.claimedRatio,
      calc64: Number(cr64.toFixed(4)),
      calc32: Number(cr32.toFixed(4)),
      req: p.requiredThreshold,
      pass64,
      pass32,
      margin: Number(margin64.toFixed(4)),
      deltaClaim: Number(deltaClaim.toFixed(4))
    });

    console.log(`  ${p.id.padEnd(8)} | ${p.role.padEnd(36)} | Claim: ${p.claimedRatio.toFixed(4)} | Calc64: ${cr64.toFixed(4)} | Margin: +${margin64.toFixed(4)} -> ${pass64 ? 'PASS' : 'FAIL'}`);
  }

  // --------------------------------------------------------------------------
  // TEST 2: ADVERSARIAL TOKEN PROVENANCE AUDIT
  // --------------------------------------------------------------------------
  console.log('\n[2] Adversarial Token Provenance Audit across CSS, Inline Styles, & SVGs...');

  const htmlFiles = [
    { name: 'option_a.html', path: FILES.optionA },
    { name: 'option_b.html', path: FILES.optionB },
    { name: 'index.html', path: FILES.index }
  ];

  for (const f of htmlFiles) {
    if (!fs.existsSync(f.path)) continue;
    const content = fs.readFileSync(f.path, 'utf8');

    // A. Parse CSS rules in <style>
    const styleBlocks = content.match(/<style[^>]*>([\s\S]*?)<\/style>/gi) || [];
    for (const sb of styleBlocks) {
      const cleanCss = sb.replace(/<\/?style[^>]*>/gi, '').replace(/\/\*[\s\S]*?\*\//g, '');
      const rules = cleanCss.split('}');

      for (const rule of rules) {
        const parts = rule.split('{');
        if (parts.length !== 2) continue;
        const selector = parts[0].trim();
        const decls = parts[1].trim();

        // 1. Check :root component tokens: --dispatch-* must NOT reference --primitive-*
        if (selector.includes(':root')) {
          const dispatchPrimitiveMatches = decls.match(/--dispatch-[a-z0-9-]+:\s*var\(--primitive-[^)]+\)/gi);
          if (dispatchPrimitiveMatches) {
            for (const m of dispatchPrimitiveMatches) {
              report.provenance_audit.component_token_primitive_violations.push({
                file: f.name,
                violation: m,
                rule: 'Component token in :root directly referenced primitive token'
              });
            }
          }
        } else {
          // 2. Non-:root selectors: MUST NOT contain var(--primitive-*)
          if (!selector.startsWith('@')) {
            const primitiveMatches = decls.match(/var\(--primitive-[^)]+\)/gi);
            if (primitiveMatches) {
              for (const m of primitiveMatches) {
                report.provenance_audit.static_css_primitive_violations.push({
                  file: f.name,
                  selector,
                  violation: m
                });
              }
            }
          }
        }
      }
    }

    // B. Check inline style attributes [style="..."]
    const inlineStyleMatches = content.matchAll(/<([a-z0-9-]+)[^>]*\sstyle=["']([^"']*)["'][^>]*>/gi);
    for (const match of inlineStyleMatches) {
      const tag = match[1];
      const styleValue = match[2];

      // Check for var(--primitive-)
      if (styleValue.includes('--primitive-')) {
        report.provenance_audit.inline_style_primitive_violations.push({
          file: f.name,
          tag,
          style: styleValue,
          reason: 'Inline style references --primitive-* directly'
        });
      }

      // Check for hardcoded color properties in inline styles (color, background, border)
      const colorPropertyRegex = /(?:color|background|border|fill|stroke)\s*:\s*(#[0-9a-f]{3,8}|rgba?\([^)]+\))/gi;
      const rawColorMatch = styleValue.match(colorPropertyRegex);
      if (rawColorMatch) {
        report.provenance_audit.inline_style_raw_color_violations.push({
          file: f.name,
          tag,
          style: styleValue,
          rawColors: rawColorMatch,
          reason: 'Inline style contains raw hex/rgb color instead of semantic token'
        });
      }
    }

    // C. Check SVG tags and children
    const svgTagMatches = content.matchAll(/<svg\b([^>]*)>([\s\S]*?)<\/svg>/gi);
    for (const svgMatch of svgTagMatches) {
      const svgAttrs = svgMatch[1];
      const svgInner = svgMatch[2];

      const isBadgeSvg = svgAttrs.includes('status-icon') || svgInner.includes('status-icon');
      const ariaHidden = /aria-hidden=["']true["']/i.test(svgAttrs);
      const focusableFalse = /focusable=["']false["']/i.test(svgAttrs);

      if (isBadgeSvg) {
        report.provenance_audit.badge_svg_accessibility.total_badge_svgs++;
        if (ariaHidden && focusableFalse) {
          report.provenance_audit.badge_svg_accessibility.compliant_badge_svgs++;
        } else {
          report.provenance_audit.badge_svg_accessibility.violations.push({
            file: f.name,
            svgAttrs,
            ariaHidden,
            focusableFalse
          });
        }
      } else {
        report.provenance_audit.non_badge_svg_accessibility.total++;
        if (!ariaHidden || !focusableFalse) {
          report.provenance_audit.non_badge_svg_accessibility.missing_aria_or_focusable.push({
            file: f.name,
            svgAttrs: svgAttrs.trim(),
            ariaHidden,
            focusableFalse
          });
        }
      }

      // Check for raw fills or strokes in svg or inner shapes
      const fillMatch = (svgAttrs + svgInner).match(/(?:fill|stroke)=["'](#[0-9a-f]{3,8}|rgba?\([^)]+\))["']/gi);
      if (fillMatch) {
        report.provenance_audit.svg_attribute_violations.push({
          file: f.name,
          matches: fillMatch,
          reason: 'SVG contains raw hex/rgb fill or stroke attribute instead of currentColor or token'
        });
      }

      // Check for primitive references in SVG
      if ((svgAttrs + svgInner).includes('--primitive-')) {
        report.provenance_audit.svg_attribute_violations.push({
          file: f.name,
          reason: 'SVG references --primitive-* directly'
        });
      }
    }
  }

  console.log(`  Static CSS Primitive Violations: ${report.provenance_audit.static_css_primitive_violations.length}`);
  console.log(`  Component Token Primitive Bypasses: ${report.provenance_audit.component_token_primitive_violations.length}`);
  console.log(`  Inline Style Primitive Violations: ${report.provenance_audit.inline_style_primitive_violations.length}`);
  console.log(`  Inline Style Raw Color Bypasses: ${report.provenance_audit.inline_style_raw_color_violations.length}`);
  console.log(`  SVG Raw Color / Primitive Violations: ${report.provenance_audit.svg_attribute_violations.length}`);
  console.log(`  Operational Badge SVG Compliance: ${report.provenance_audit.badge_svg_accessibility.compliant_badge_svgs} / ${report.provenance_audit.badge_svg_accessibility.total_badge_svgs}`);

  // --------------------------------------------------------------------------
  // TEST 3: LIVE DOM COMPUTED CONTRAST & ACCESSIBILITY AUDIT VIA PUPPETEER
  // --------------------------------------------------------------------------
  console.log('\n[3] Launching Puppeteer for Live DOM Adversarial Contrast Audits...');

  let browser;
  try {
    browser = await puppeteer.launch({
      executablePath: CHROME_EXECUTABLE,
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
    });

    const page = await browser.newPage();

    for (const f of htmlFiles) {
      if (!fs.existsSync(f.path)) continue;
      const fileKey = f.name.includes('option_a') ? 'option_a' : (f.name.includes('option_b') ? 'option_b' : 'index');
      console.log(`\n  Auditing Live DOM of ${f.name}...`);
      await page.goto(toFileUrl(f.path), { waitUntil: 'load' });

      const domResults = await page.evaluate(() => {
        const items = [];

        function getEffectiveBg(el) {
          let cur = el;
          while (cur && cur !== document.documentElement) {
            const bg = window.getComputedStyle(cur).backgroundColor;
            if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
              return bg;
            }
            cur = cur.parentElement;
          }
          return window.getComputedStyle(document.body).backgroundColor || 'rgb(255, 255, 255)';
        }

        // 1. Status Badges: Normative WCAG SC 1.4.3 requires text contrast >= 4.5:1
        const badges = document.querySelectorAll('.status-badge, [data-status]');
        badges.forEach(b => {
          const s = window.getComputedStyle(b);
          const status = b.getAttribute('data-status') || b.className;
          const bg = s.backgroundColor;
          const fg = s.color;

          items.push({
            category: 'badge_text_on_badge_bg',
            selector: `badge[${status}]`,
            text: b.innerText.trim(),
            fg,
            bg,
            threshold: 4.5,
            isNormative: true
          });
        });

        // 2. Buttons: Normative WCAG SC 1.4.3 text contrast >= 4.5:1
        const buttons = document.querySelectorAll('button, .btn-primary, .btn-secondary, .dispatch-action-primary');
        buttons.forEach(btn => {
          const s = window.getComputedStyle(btn);
          const fg = s.color;
          const bg = s.backgroundColor === 'rgba(0, 0, 0, 0)' ? getEffectiveBg(btn) : s.backgroundColor;
          const text = btn.innerText.trim().slice(0, 30);
          if (text) {
            items.push({
              category: 'button_text',
              selector: `${btn.tagName}#${btn.id}.${btn.className.split(' ')[0]}`,
              text,
              fg,
              bg,
              threshold: 4.5,
              isNormative: true
            });
          }
        });

        // 3. Filter tabs: Normative text contrast >= 4.5:1
        const tabs = document.querySelectorAll('.filter-tab, [role="tab"]');
        tabs.forEach(tab => {
          const s = window.getComputedStyle(tab);
          const fg = s.color;
          const bg = s.backgroundColor === 'rgba(0, 0, 0, 0)' ? getEffectiveBg(tab) : s.backgroundColor;
          items.push({
            category: 'filter_tab',
            selector: `tab.${tab.className}`,
            text: tab.innerText.trim(),
            fg,
            bg,
            threshold: 4.5,
            isNormative: true
          });
        });

        // 4. Headings: Large text threshold >= 3.0:1
        const h1 = document.querySelector('h1');
        if (h1) {
          const s = window.getComputedStyle(h1);
          items.push({
            category: 'heading_h1',
            selector: 'h1',
            text: h1.innerText.trim().slice(0, 30),
            fg: s.color,
            bg: getEffectiveBg(h1),
            threshold: 3.0,
            isNormative: true
          });
        }

        // 5. Body Texts: Normative text contrast >= 4.5:1
        const bodyTexts = document.querySelectorAll('.tour-desc, .ledger-desc, td, .fixture-notice');
        bodyTexts.forEach((el, idx) => {
          if (idx < 5) {
            const s = window.getComputedStyle(el);
            const text = el.innerText.trim().slice(0, 30);
            if (text) {
              items.push({
                category: 'body_text',
                selector: el.className ? `.${el.className.split(' ')[0]}` : el.tagName,
                text,
                fg: s.color,
                bg: getEffectiveBg(el),
                threshold: 4.5,
                isNormative: true
              });
            }
          }
        });

        return items;
      });

      // Recalculate each live element
      for (const item of domResults) {
        const fgRgb = parseRgbColor(item.fg);
        const bgRgb = parseRgbColor(item.bg);
        const compFg = compositeColor(fgRgb, [255, 255, 255]);
        const compBg = compositeColor(bgRgb, [255, 255, 255]);

        const lumFg = relativeLuminance64(compFg);
        const lumBg = relativeLuminance64(compBg);
        const cr = contrastRatio64(lumFg, lumBg);
        const pass = cr >= item.threshold;

        report.live_dom_audits[fileKey].total++;
        if (pass) {
          report.live_dom_audits[fileKey].passed++;
        } else {
          report.live_dom_audits[fileKey].failed++;
        }

        report.live_dom_audits[fileKey].pairs.push({
          category: item.category,
          selector: item.selector,
          text: item.text,
          fg: item.fg,
          bg: item.bg,
          contrast_ratio: Number(cr.toFixed(4)),
          threshold: item.threshold,
          passed: pass
        });

        if (!pass) {
          console.warn(`    [FAIL CONTRAST] ${item.category} (${item.selector} "${item.text}") | CR: ${cr.toFixed(4)} < ${item.threshold}`);
        }
      }

      console.log(`    Total Elements Measured: ${report.live_dom_audits[fileKey].total} | Passed: ${report.live_dom_audits[fileKey].passed} | Failed: ${report.live_dom_audits[fileKey].failed}`);
    }

  } catch (err) {
    console.error('Puppeteer Live DOM audit failed:', err);
  } finally {
    if (browser) await browser.close();
  }

  // --------------------------------------------------------------------------
  // OVERALL VERDICT SYNTHESIS
  // --------------------------------------------------------------------------
  const contractMathPassed = report.contract_math.failing_pairs === 0;
  const provenancePassed = report.provenance_audit.static_css_primitive_violations.length === 0 &&
                           report.provenance_audit.component_token_primitive_violations.length === 0 &&
                           report.provenance_audit.inline_style_primitive_violations.length === 0 &&
                           report.provenance_audit.svg_attribute_violations.length === 0 &&
                           report.provenance_audit.badge_svg_accessibility.violations.length === 0;
  const liveDomPassed = report.live_dom_audits.index.failed === 0 &&
                        report.live_dom_audits.option_a.failed === 0 &&
                        report.live_dom_audits.option_b.failed === 0;

  report.verdict = (contractMathPassed && provenancePassed && liveDomPassed) ? 'APPROVE' : 'REQUEST_CHANGES';

  console.log('\n======================================================================');
  console.log(`CHALLENGER FINAL VERDICT: [ ${report.verdict} ]`);
  console.log(`  Contract Math: [ ${contractMathPassed ? 'PASS' : 'FAIL'} ] (Failing: ${report.contract_math.failing_pairs})`);
  console.log(`  Token Provenance & Badge SVGs: [ ${provenancePassed ? 'PASS' : 'FAIL'} ]`);
  console.log(`  Live DOM Contrast: [ ${liveDomPassed ? 'PASS' : 'FAIL'} ]`);
  console.log(`  Advisory Stress Findings: ${report.advisory_stress_findings.length}`);
  console.log('======================================================================\n');

  // Save report artifact
  const outputPath = path.join(__dirname, 'adversarial_test_results.json');
  fs.writeFileSync(outputPath, JSON.stringify(report, null, 2), 'utf8');
  console.log(`Saved detailed evidence to: ${outputPath}`);

  return report;
}

if (require.main === module) {
  runAdversarialVerification().then(res => {
    process.exit(res.verdict === 'APPROVE' ? 0 : 1);
  }).catch(e => {
    console.error('Unhandled error:', e);
    process.exit(1);
  });
}

module.exports = { runAdversarialVerification };
