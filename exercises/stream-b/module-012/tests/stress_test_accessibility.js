/**
 * In-depth Accessibility & Keyboard & Disclosure Stress Test
 */
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

async function testDeepA11y() {
  const tempDir = path.join(os.tmpdir(), 'chrome-a11y-' + Date.now());
  fs.mkdirSync(tempDir, { recursive: true });

  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9228',
    '--user-data-dir=' + tempDir,
    '--disable-gpu'
  ]);

  try {
    let vData = null;
    for (let i = 0; i < 20; i++) {
      await new Promise(r => setTimeout(r, 200));
      try {
        const res = await fetch('http://127.0.0.1:9228/json/version');
        if (res.ok) { vData = await res.json(); break; }
      } catch (e) {}
    }

    const ws = new WebSocket(vData.webSocketDebuggerUrl);
    await new Promise(r => ws.onopen = r);

    let id = 1;
    function send(method, params = {}) {
      return new Promise(resolve => {
        const curId = id++;
        const handler = e => {
          const d = JSON.parse(e.data);
          if (d.id === curId) {
            ws.removeEventListener('message', handler);
            resolve(d.result);
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id: curId, method, params }));
      });
    }

    const prototypes = [
      { name: 'Option A', url: 'file:///design-training/stream-b/module-012/directions/option_a/index.html' },
      { name: 'Option B', url: 'file:///design-training/stream-b/module-012/directions/option_b/index.html' }
    ];

    for (const proto of prototypes) {
      console.log(`\n=== DEEP ACCESSIBILITY AUDIT FOR ${proto.name} ===`);
      const target = await send('Target.createTarget', { url: 'about:blank' });
      const tList = await (await fetch('http://127.0.0.1:9228/json/list')).json();
      const pTarget = tList.find(t => t.id === target.targetId);
      const pageWs = new WebSocket(pTarget.webSocketDebuggerUrl);
      await new Promise(r => pageWs.onopen = r);

      let pId = 1;
      function sendP(method, params = {}) {
        return new Promise(resolve => {
          const cId = pId++;
          const handler = e => {
            const d = JSON.parse(e.data);
            if (d.id === cId) {
              pageWs.removeEventListener('message', handler);
              resolve(d.result);
            }
          };
          pageWs.addEventListener('message', handler);
          pageWs.send(JSON.stringify({ id: cId, method, params }));
        });
      }

      await sendP('Page.enable');
      await sendP('Page.navigate', { url: proto.url });
      await new Promise(r => setTimeout(r, 600));

      // 1. Audit all images and icons for alt / aria attributes
      const imageA11y = await sendP('Runtime.evaluate', {
        expression: `(() => {
          const imgs = Array.from(document.querySelectorAll('img'));
          const svgs = Array.from(document.querySelectorAll('svg'));
          
          const imgAudit = imgs.map(img => {
            const src = img.getAttribute('src');
            const alt = img.getAttribute('alt');
            const ariaHidden = img.getAttribute('aria-hidden');
            const isDecorative = alt === '' && ariaHidden === 'true';
            const isInformative = alt && alt.length > 5;
            return {
              src,
              alt,
              ariaHidden,
              isDecorative,
              isInformative,
              valid: isDecorative || isInformative
            };
          });

          const svgAudit = svgs.map(svg => {
            const ariaHidden = svg.getAttribute('aria-hidden');
            const ariaLabel = svg.getAttribute('aria-label');
            const title = svg.querySelector('title');
            const valid = ariaHidden === 'true' || Boolean(ariaLabel) || Boolean(title);
            return {
              ariaHidden,
              ariaLabel,
              hasTitle: Boolean(title),
              valid
            };
          });

          return {
            totalImgs: imgs.length,
            invalidImgs: imgAudit.filter(i => !i.valid),
            totalSvgs: svgs.length,
            invalidSvgs: svgAudit.filter(s => !s.valid),
            imgAudit
          };
        })()`,
        returnByValue: true
      });

      console.log('1. Image & SVG Alt/ARIA Audit:');
      console.log(`   Images: total=${imageA11y.result.value.totalImgs}, invalid=${imageA11y.result.value.invalidImgs.length}`);
      console.log(`   SVGs: total=${imageA11y.result.value.totalSvgs}, invalid=${imageA11y.result.value.invalidSvgs.length}`);

      // 2. Audit Disclosure toggle interaction & layout behavior
      const disclosureAudit = await sendP('Runtime.evaluate', {
        expression: `(() => {
          const details = document.querySelector('details');
          const summary = document.querySelector('summary');
          if (!details || !summary) return { found: false };

          const preHeight = details.getBoundingClientRect().height;
          const preOpen = details.open;

          // Toggle open
          summary.click();
          const postHeight = details.getBoundingClientRect().height;
          const postOpen = details.open;

          const tableInside = details.querySelector('table');
          const rowsInside = tableInside ? tableInside.querySelectorAll('tr').length : 0;

          // Check if overflow occurs when open
          const scrollW = document.documentElement.scrollWidth;
          const clientW = document.documentElement.clientWidth;

          return {
            found: true,
            preOpen,
            postOpen,
            preHeight: Math.round(preHeight),
            postHeight: Math.round(postHeight),
            expandedSuccessfully: postOpen === true && postHeight > preHeight,
            rowsInside,
            noOverflowWhenOpen: scrollW <= clientW
          };
        })()`,
        returnByValue: true
      });

      console.log('2. Disclosure (<details>) Toggle Audit:');
      console.log(`   PreHeight: ${disclosureAudit.result.value.preHeight}px -> PostHeight: ${disclosureAudit.result.value.postHeight}px`);
      console.log(`   Expanded successfully: ${disclosureAudit.result.value.expandedSuccessfully ? 'PASS' : 'FAIL'}`);
      console.log(`   Rows inside manifest: ${disclosureAudit.result.value.rowsInside}`);
      console.log(`   No overflow when open: ${disclosureAudit.result.value.noOverflowWhenOpen ? 'PASS' : 'FAIL'}`);

      // 3. Computed Zero-Motion verification
      const motionAudit = await sendP('Runtime.evaluate', {
        expression: `(() => {
          const sampleEls = Array.from(document.querySelectorAll('body, header, button, a, tr, img, summary, details, article, aside, .status-badge, .signal-badge'));
          const nonZeroDurations = [];
          sampleEls.forEach(el => {
            const style = window.getComputedStyle(el);
            const animDuration = style.animationDuration;
            const transDuration = style.transitionDuration;
            if (animDuration !== '0s' && animDuration !== '') {
              nonZeroDurations.push({ tag: el.tagName, class: el.className, prop: 'animation-duration', val: animDuration });
            }
            if (transDuration !== '0s' && transDuration !== '') {
              nonZeroDurations.push({ tag: el.tagName, class: el.className, prop: 'transition-duration', val: transDuration });
            }
          });
          return {
            sampledElements: sampleEls.length,
            violations: nonZeroDurations
          };
        })()`,
        returnByValue: true
      });

      console.log('3. Zero-Motion Computed Style Audit:');
      console.log(`   Sampled elements: ${motionAudit.result.value.sampledElements}, Nonzero violations: ${motionAudit.result.value.violations.length}`);

      pageWs.close();
      await send('Target.closeTarget', { targetId: target.targetId });
    }

    ws.close();
  } finally {
    chrome.kill('SIGKILL');
    try { fs.rmSync(tempDir, { recursive: true, force: true }); } catch (e) {}
  }
}

testDeepA11y().catch(console.error);
