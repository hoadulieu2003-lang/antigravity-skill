/**
 * Empirical Accessibility & Canonical Data Test Suite
 * Challenger 2 — Module 12 Brand & Image Direction (Stream B)
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const CANONICAL_SNAPSHOT = [
  { id: 'T01', tour: 'Hạ Long 2N1Đ', departure: '14/09/2026 07:30', assignee: 'Lan', status: 'Chờ đối tác', note: 'Khách sạn chưa xác nhận 4 phòng' },
  { id: 'T02', tour: 'Ninh Bình 1 ngày', departure: '14/09/2026 06:00', assignee: 'Minh', status: 'Sẵn sàng', note: 'Đã đủ xe, hướng dẫn viên và danh sách khách' },
  { id: 'T03', tour: 'Sapa 3N2Đ', departure: '15/09/2026 21:30', assignee: 'Huy', status: 'Thiếu hồ sơ', note: '2 khách chưa gửi CCCD' },
  { id: 'T04', tour: 'Đà Nẵng 4N3Đ', departure: '16/09/2026 08:00', assignee: 'Lan', status: 'Đang chuẩn bị', note: 'Chờ chốt danh sách suất ăn' },
  { id: 'T05', tour: 'Hà Giang 3N2Đ', departure: '17/09/2026 05:30', assignee: 'Minh', status: 'Sẵn sàng', note: 'Đã hoàn tất checklist khởi hành' },
  { id: 'T06', tour: 'Phú Quốc 3N2Đ', departure: '18/09/2026 09:10', assignee: 'Huy', status: 'Chờ đối tác', note: 'Nhà xe trung chuyển chưa xác nhận' },
  { id: 'T07', tour: 'Mộc Châu 2N1Đ', departure: '19/09/2026 06:30', assignee: 'Lan', status: 'Đang chuẩn bị', note: 'Đang rà soát danh sách phòng' },
  { id: 'T08', tour: 'Huế 3N2Đ', departure: '12/09/2026 07:00', assignee: 'An', status: 'Hoàn thành', note: 'Đoàn đã khởi hành và bàn giao nhật ký' }
];

async function runEmpiricalSuite() {
  const tempDir = path.join(os.tmpdir(), 'chrome-challenger2-' + Date.now());
  fs.mkdirSync(tempDir, { recursive: true });

  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9226',
    '--user-data-dir=' + tempDir,
    '--window-size=1440,900',
    '--disable-gpu',
    '--no-first-run'
  ]);

  const results = {
    timestamp: new Date().toISOString(),
    option_a: {},
    option_b: {},
    summary: { totalTests: 0, passed: 0, failed: 0 }
  };

  try {
    let versionData = null;
    for (let i = 0; i < 25; i++) {
      await new Promise(r => setTimeout(r, 200));
      try {
        const res = await fetch('http://127.0.0.1:9226/json/version');
        if (res.ok) {
          versionData = await res.json();
          break;
        }
      } catch (e) {}
    }

    if (!versionData) throw new Error('Cannot connect to Chrome headless on port 9226');
    console.log('[CHALLENGER 2] Connected to Chrome engine:', versionData.Browser);

    const rootWs = new WebSocket(versionData.webSocketDebuggerUrl);
    await new Promise(r => rootWs.onopen = r);

    let msgId = 1;
    function sendRoot(method, params = {}) {
      return new Promise(resolve => {
        const id = msgId++;
        const handler = (e) => {
          const d = JSON.parse(e.data);
          if (d.id === id) {
            rootWs.removeEventListener('message', handler);
            resolve(d.result);
          }
        };
        rootWs.addEventListener('message', handler);
        rootWs.send(JSON.stringify({ id, method, params }));
      });
    }

    async function evaluateInPage(fileUrl, pageName) {
      console.log(`\n================================================================`);
      console.log(`TESTING PROTOTYPE: ${pageName}`);
      console.log(`URL: ${fileUrl}`);
      console.log(`================================================================`);

      const target = await sendRoot('Target.createTarget', { url: 'about:blank' });
      const targetsRes = await fetch('http://127.0.0.1:9226/json/list');
      const targets = await targetsRes.json();
      const pageTarget = targets.find(t => t.id === target.targetId);

      const pageWs = new WebSocket(pageTarget.webSocketDebuggerUrl);
      await new Promise(r => pageWs.onopen = r);

      let pId = 1;
      function sendPage(method, params = {}) {
        return new Promise(resolve => {
          const id = pId++;
          const handler = (e) => {
            const d = JSON.parse(e.data);
            if (d.id === id) {
              pageWs.removeEventListener('message', handler);
              resolve(d.result);
            }
          };
          pageWs.addEventListener('message', handler);
          pageWs.send(JSON.stringify({ id, method, params }));
        });
      }

      await sendPage('Page.enable');
      await sendPage('DOM.enable');
      await sendPage('CSS.enable');
      await sendPage('Emulation.setDeviceMetricsOverride', {
        width: 1440,
        height: 900,
        deviceScaleFactor: 1,
        mobile: false
      });

      await sendPage('Page.navigate', { url: fileUrl });
      await new Promise(r => setTimeout(r, 600));

      // TASK 1: TOUCH & CLICK TARGETS (>= 44x44 CSS px)
      const targetEval = await sendPage('Runtime.evaluate', {
        expression: `(() => {
          const interactiveSelectors = ['button', 'a', 'summary', 'input', 'select', 'textarea', '[role="button"]', '[tabindex="0"]'];
          const elements = Array.from(document.querySelectorAll(interactiveSelectors.join(',')));
          const details = elements.map(el => {
            const rect = el.getBoundingClientRect();
            const tag = el.tagName.toLowerCase();
            const text = (el.innerText || el.getAttribute('aria-label') || el.title || el.id || '').trim().replace(/\\s+/g, ' ').slice(0, 40);
            const isVisible = rect.width > 0 && rect.height > 0 && window.getComputedStyle(el).display !== 'none' && window.getComputedStyle(el).visibility !== 'hidden';
            const meetsTarget = rect.width >= 44 && rect.height >= 44;
            return {
              tag,
              id: el.id || null,
              className: el.className || null,
              text,
              width: Math.round(rect.width * 100) / 100,
              height: Math.round(rect.height * 100) / 100,
              isVisible,
              meetsTarget
            };
          }).filter(e => e.isVisible);

          const violations = details.filter(e => !e.meetsTarget);
          return { totalInteractive: details.length, violations, details };
        })()`,
        returnByValue: true
      });

      // TASK 2: COLOR CONTRAST (WCAG 2.2 AA)
      const contrastEval = await sendPage('Runtime.evaluate', {
        expression: `(() => {
          function parseRgb(colorStr) {
            const match = colorStr.match(/rgba?\\((\\d+),\\s*(\\d+),\\s*(\\d+)(?:,\\s*([\\d.]+))?\\)/);
            if (!match) return null;
            return {
              r: parseInt(match[1]),
              g: parseInt(match[2]),
              b: parseInt(match[3]),
              a: match[4] !== undefined ? parseFloat(match[4]) : 1
            };
          }

          function sRGBtoLin(c) {
            const v = c / 255;
            return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
          }

          function getLuminance(rgb) {
            return 0.2126 * sRGBtoLin(rgb.r) + 0.7152 * sRGBtoLin(rgb.g) + 0.0722 * sRGBtoLin(rgb.b);
          }

          function getContrast(rgb1, rgb2) {
            const l1 = getLuminance(rgb1);
            const l2 = getLuminance(rgb2);
            const max = Math.max(l1, l2);
            const min = Math.min(l1, l2);
            return (max + 0.05) / (min + 0.05);
          }

          function getEffectiveBg(el) {
            let cur = el;
            while (cur && cur !== document.documentElement) {
              const bg = window.getComputedStyle(cur).backgroundColor;
              const parsed = parseRgb(bg);
              if (parsed && parsed.a > 0.05) {
                return parsed;
              }
              cur = cur.parentElement;
            }
            return { r: 250, g: 248, b: 245, a: 1 }; // Default light background fallback
          }

          // Test distinct key text selectors
          const sampleSelectors = [
            'body', '.brand-logo-text, .brand-id-group h1', '.brand-badge, .direction-badge-b',
            '.brand-promise-quote, .brand-promise-terminal', '.brand-promise-author',
            '.hero-heading, .focal-route-title', '.tour-id-pill, .tour-code-tag',
            '.bottleneck-alert-box h3, .signal-break-body h3', '.bottleneck-alert-box p, .signal-break-body p',
            '.status-badge.badge-waiting, .signal-badge.badge-hazard',
            '.status-badge.badge-ready, .signal-badge.badge-telemetry',
            '.status-badge.badge-missing, .signal-badge.badge-fault',
            '.status-badge.badge-prep, .signal-badge.badge-prep',
            '.status-badge.badge-done, .signal-badge.badge-archived',
            '.btn-action-primary, .btn-terminal-primary',
            '.btn-action-secondary, .btn-terminal-secondary',
            '.snapshot-table th, .matrix-table th',
            '.snapshot-table td, .matrix-table td',
            '.table-action-btn, .matrix-action-link',
            '.coordinator-info h3, .operator-id-text h3',
            '.fictional-disclosure-pill, .operator-badge-box span',
            '.disclosure-summary, .disclosure-summary-bar',
            '.site-footer, .telemetry-footer',
            '.log-time, .feed-timestamp'
          ];

          const contrastResults = [];
          for (const sel of sampleSelectors) {
            const els = Array.from(document.querySelectorAll(sel));
            for (const el of els) {
              const style = window.getComputedStyle(el);
              const text = (el.innerText || '').trim().replace(/\\s+/g, ' ').slice(0, 30);
              if (!text) continue;
              const fg = parseRgb(style.color);
              const bg = getEffectiveBg(el);
              if (fg && bg) {
                const ratio = getContrast(fg, bg);
                const fontSize = parseFloat(style.fontSize);
                const fontWeight = parseInt(style.fontWeight) || (style.fontWeight === 'bold' ? 700 : 400);
                const isLarge = fontSize >= 24 || (fontSize >= 18.66 && fontWeight >= 700);
                const required = isLarge ? 3.0 : 4.5;
                contrastResults.push({
                  selector: sel,
                  text,
                  fg: 'rgb(' + fg.r + ',' + fg.g + ',' + fg.b + ')',
                  bg: 'rgb(' + bg.r + ',' + bg.g + ',' + bg.b + ')',
                  ratio: Math.round(ratio * 100) / 100,
                  required,
                  isLarge,
                  passes: ratio >= required
                });
                break; // 1 sample per selector
              }
            }
          }

          const fails = contrastResults.filter(r => !r.passes);
          return { totalTested: contrastResults.length, fails, results: contrastResults };
        })()`,
        returnByValue: true
      });

      // TASK 3: NON-COLOR STATUS DEPENDENCY
      const nonColorEval = await sendPage('Runtime.evaluate', {
        expression: `(() => {
          const badges = Array.from(document.querySelectorAll('.status-badge, .signal-badge'));
          const audit = badges.map(b => {
            const hasSvgOrImg = b.querySelector('svg, img') !== null;
            const text = (b.innerText || '').trim();
            const hasText = text.length > 0;
            const style = window.getComputedStyle(b);
            const hasBorder = style.borderWidth !== '0px' && style.borderStyle !== 'none';
            const shapeDistinct = style.borderRadius !== '0px';
            return {
              text,
              hasSvgOrImg,
              hasText,
              hasBorder,
              shapeDistinct,
              fullyCompliant: hasSvgOrImg && hasText && (hasBorder || shapeDistinct)
            };
          });

          // Check if any status is indicated solely by color anywhere in the document
          const nonCompliant = audit.filter(a => !a.fullyCompliant);
          return { totalBadges: audit.length, nonCompliant, audit };
        })()`,
        returnByValue: true
      });

      // TASK 4: COMPLEX ROUTE DIAGRAM ACCESSIBILITY (<ol> ORDERED LIST)
      const diagramEval = await sendPage('Runtime.evaluate', {
        expression: `(() => {
          // Look for route diagram section
          const diagrams = Array.from(document.querySelectorAll('img[src*="route_narrative"], img[src*="route_schematic"]'));
          const results = diagrams.map(img => {
            const container = img.closest('section') || img.closest('div[aria-labelledby]') || img.parentElement.parentElement;
            const ol = container ? container.querySelector('ol') : document.querySelector('ol');
            const alt = img.getAttribute('alt');
            let olItems = [];
            let isAccessibleToSr = false;
            if (ol) {
              olItems = Array.from(ol.querySelectorAll('li')).map(li => li.innerText.trim());
              const style = window.getComputedStyle(ol);
              // Must NOT be display: none or visibility: hidden or aria-hidden="true"
              isAccessibleToSr = style.display !== 'none' && style.visibility !== 'hidden' && ol.getAttribute('aria-hidden') !== 'true';
            }
            return {
              imgSrc: img.getAttribute('src'),
              hasAlt: Boolean(alt && alt.length > 20),
              altText: alt,
              hasOrderedList: Boolean(ol),
              isAccessibleToSr,
              itemCount: olItems.length,
              olItems
            };
          });
          return results;
        })()`,
        returnByValue: true
      });

      // TASK 5: IMAGE FAILURE PARITY & LAYOUT STABILITY
      const imageFailureEval = await sendPage('Runtime.evaluate', {
        expression: `(() => {
          // Record layout state before hiding images
          const preScrollWidth = document.documentElement.scrollWidth;
          const preClientWidth = document.documentElement.clientWidth;
          const heroPreRect = (document.querySelector('#tour-focus-t01, #focal-t01-signal') || document.body).getBoundingClientRect();
          const tablePreRect = (document.querySelector('table') || document.body).getBoundingClientRect();

          // Inject image hiding CSS
          const style = document.createElement('style');
          style.id = 'stress-test-img-hide';
          style.textContent = 'img, svg { display: none !important; }';
          document.head.appendChild(style);

          // Measure post-hide layout state
          const postScrollWidth = document.documentElement.scrollWidth;
          const postClientWidth = document.documentElement.clientWidth;
          const heroPostRect = (document.querySelector('#tour-focus-t01, #focal-t01-signal') || document.body).getBoundingClientRect();
          const tablePostRect = (document.querySelector('table') || document.body).getBoundingClientRect();

          // Check if critical texts are still visible and non-zero
          const t01Text = document.body.innerText.includes('Khách sạn chưa xác nhận 4 phòng');
          const t08Text = document.body.innerText.includes('Huế 3N2Đ');
          const buttonsVisible = Array.from(document.querySelectorAll('button, a.btn-action-primary, a.btn-terminal-primary')).every(b => {
            const r = b.getBoundingClientRect();
            return r.width > 0 && r.height > 0;
          });

          const noHorizontalOverflow = postScrollWidth <= postClientWidth;
          const layoutMaintained = heroPostRect.height > 100 && tablePostRect.height > 100;

          // Remove stress style
          document.head.removeChild(style);

          return {
            preScrollWidth,
            preClientWidth,
            postScrollWidth,
            postClientWidth,
            noHorizontalOverflow,
            heroPreHeight: Math.round(heroPreRect.height),
            heroPostHeight: Math.round(heroPostRect.height),
            tablePreHeight: Math.round(tablePreRect.height),
            tablePostHeight: Math.round(tablePostRect.height),
            t01TextPreserved: t01Text,
            t08TextPreserved: t08Text,
            buttonsUsable: buttonsVisible,
            layoutStableWithoutImages: noHorizontalOverflow && layoutMaintained && t01Text && buttonsVisible
          };
        })()`,
        returnByValue: true
      });

      // TASK 6: CANONICAL DATASET T01–T08 PARITY
      const dataParityEval = await sendPage('Runtime.evaluate', {
        expression: `(() => {
          const rows = Array.from(document.querySelectorAll('tbody tr'));
          const extractedTours = rows.map(r => {
            const cells = Array.from(r.querySelectorAll('td')).map(c => c.innerText.trim().replace(/\\s+/g, ' '));
            return {
              rawCells: cells,
              id: cells[0] ? (cells[0].match(/T0[1-8]/) || [cells[0]])[0] : '',
              tour: cells[1] || '',
              departure: cells[2] || '',
              assignee: cells[3] || '',
              status: cells[4] || '',
              note: cells[5] || ''
            };
          }).filter(t => t.id.startsWith('T0'));

          // Check Header Anchor
          const bodyText = document.body.innerText;
          const hasTimeAnchor = bodyText.includes('13/09/2026') && (bodyText.includes('18:00') || bodyText.includes('18:00:00'));
          
          // Check for forbidden fabricated terms
          const forbiddenCheck = {
            hasRevenueOrMoney: /\\$\\d+|\\d+\\s*(triệu|tỷ|USD|VND|đồng)|doanh thu|lợi nhuận/i.test(bodyText),
            hasFakeAwards: /top 1|giải thưởng|best travel|award|5 sao|sao vàng/i.test(bodyText),
            hasFakeRatings: /\\b[45]\\.[0-9]\\s*\\/\\s*5|5\\s*star|rating/i.test(bodyText)
          };

          return {
            hasTimeAnchor,
            forbiddenCheck,
            extractedCount: extractedTours.length,
            extractedTours
          };
        })()`,
        returnByValue: true
      });

      pageWs.close();
      await sendRoot('Target.closeTarget', { targetId: target.targetId });

      return {
        targetEval: targetEval.result.value,
        contrastEval: contrastEval.result.value,
        nonColorEval: nonColorEval.result.value,
        diagramEval: diagramEval.result.value,
        imageFailureEval: imageFailureEval.result.value,
        dataParityEval: dataParityEval.result.value
      };
    }

    // Evaluate Option A
    const optAUrl = 'file:///design-training/stream-b/module-012/directions/option_a/index.html';
    results.option_a = await evaluateInPage(optAUrl, 'Option A: Human Field Intelligence');

    // Evaluate Option B
    const optBUrl = 'file:///design-training/stream-b/module-012/directions/option_b/index.html';
    results.option_b = await evaluateInPage(optBUrl, 'Option B: Route Signal System');

    rootWs.close();
  } finally {
    chrome.kill('SIGKILL');
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch (e) {}
  }

  // SAVE AND ANALYZE RESULTS
  const outPath = path.join(__dirname, 'challenger_2_empirical_results.json');
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2), 'utf8');
  console.log(`\nResults written to ${outPath}`);

  // PRINT EXECUTIVE SUMMARY
  console.log('\n================================================================');
  console.log('CHALLENGER 2 EMPIRICAL AUDIT REPORT');
  console.log('================================================================');

  function analyzeOption(name, opt) {
    console.log(`\n>>> AUDITING ${name.toUpperCase()} <<<`);
    
    // 1. Targets
    const targets = opt.targetEval;
    console.log(`1. Touch/Click Targets (>= 44x44px): ${targets.violations.length === 0 ? 'PASS' : 'FAIL'}`);
    console.log(`   Total interactive: ${targets.totalInteractive}, Violations: ${targets.violations.length}`);
    if (targets.violations.length > 0) {
      console.log('   Violations:', targets.violations);
    }

    // 2. Contrast
    const contrast = opt.contrastEval;
    console.log(`2. Color Contrast (WCAG 2.2 AA): ${contrast.fails.length === 0 ? 'PASS' : 'FAIL'}`);
    console.log(`   Sample selectors tested: ${contrast.totalTested}, Failures: ${contrast.fails.length}`);
    if (contrast.fails.length > 0) {
      console.log('   Failures:', contrast.fails);
    }

    // 3. Non-color status
    const nonColor = opt.nonColorEval;
    console.log(`3. Non-Color Status Dependency: ${nonColor.nonCompliant.length === 0 ? 'PASS' : 'FAIL'}`);
    console.log(`   Total status badges: ${nonColor.totalBadges}, Non-compliant: ${nonColor.nonCompliant.length}`);

    // 4. Diagram accessibility
    const diagram = opt.diagramEval;
    const diagramPass = diagram.length > 0 && diagram.every(d => d.hasOrderedList && d.isAccessibleToSr && d.itemCount >= 4);
    console.log(`4. Complex Diagram Accessibility (<ol>): ${diagramPass ? 'PASS' : 'FAIL'}`);
    diagram.forEach(d => {
      console.log(`   Diagram [${d.imgSrc}]: hasAlt=${d.hasAlt}, hasOL=${d.hasOrderedList}, accessibleSR=${d.isAccessibleToSr}, items=${d.itemCount}`);
    });

    // 5. Image Failure Parity
    const imgFail = opt.imageFailureEval;
    console.log(`5. Image Failure Parity: ${imgFail.layoutStableWithoutImages ? 'PASS' : 'FAIL'}`);
    console.log(`   Overflow: ${imgFail.noHorizontalOverflow ? 'NONE' : 'DETECTED'}, Hero Height: ${imgFail.heroPreHeight}px -> ${imgFail.heroPostHeight}px, Table Height: ${imgFail.tablePreHeight}px -> ${imgFail.tablePostHeight}px, Buttons Usable: ${imgFail.buttonsUsable}`);

    // 6. Canonical Data
    const data = opt.dataParityEval;
    let dataMatches = true;
    const mismatches = [];

    if (data.extractedCount !== 8) {
      dataMatches = false;
      mismatches.push(`Expected 8 tours, found ${data.extractedCount}`);
    }

    CANONICAL_SNAPSHOT.forEach(canon => {
      const found = data.extractedTours.find(t => t.id === canon.id);
      if (!found) {
        dataMatches = false;
        mismatches.push(`Missing tour ${canon.id}`);
      } else {
        if (!found.tour.includes(canon.tour)) {
          dataMatches = false;
          mismatches.push(`${canon.id} tour name mismatch: expected "${canon.tour}", got "${found.tour}"`);
        }
        if (!found.departure.includes(canon.departure)) {
          dataMatches = false;
          mismatches.push(`${canon.id} departure mismatch: expected "${canon.departure}", got "${found.departure}"`);
        }
        if (!found.assignee.includes(canon.assignee)) {
          dataMatches = false;
          mismatches.push(`${canon.id} assignee mismatch: expected "${canon.assignee}", got "${found.assignee}"`);
        }
        if (!found.status.includes(canon.status)) {
          dataMatches = false;
          mismatches.push(`${canon.id} status mismatch: expected "${canon.status}", got "${found.status}"`);
        }
        if (!found.note.includes(canon.note)) {
          dataMatches = false;
          mismatches.push(`${canon.id} note mismatch: expected "${canon.note}", got "${found.note}"`);
        }
      }
    });

    console.log(`6. Canonical Dataset T01-T08 Parity: ${dataMatches ? 'PASS' : 'FAIL'}`);
    console.log(`   Anchor match: ${data.hasTimeAnchor ? 'PASS' : 'FAIL'}`);
    console.log(`   Fabricated content check: ${!data.forbiddenCheck.hasRevenueOrMoney && !data.forbiddenCheck.hasFakeAwards && !data.forbiddenCheck.hasFakeRatings ? 'CLEAN (PASS)' : 'FLAGGED (FAIL)'}`);
    if (mismatches.length > 0) {
      console.log('   Mismatches:', mismatches);
    }
  }

  analyzeOption('Option A', results.option_a);
  analyzeOption('Option B', results.option_b);
}

runEmpiricalSuite().catch(console.error);
