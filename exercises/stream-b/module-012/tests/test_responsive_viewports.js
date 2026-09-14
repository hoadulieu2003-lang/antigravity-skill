/**
 * Responsive Viewport Stress Test (1440px, 768px, 390px)
 */
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

async function testResponsive() {
  const tempDir = path.join(os.tmpdir(), 'chrome-resp-' + Date.now());
  fs.mkdirSync(tempDir, { recursive: true });

  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9227',
    '--user-data-dir=' + tempDir,
    '--disable-gpu'
  ]);

  try {
    let vData = null;
    for (let i = 0; i < 20; i++) {
      await new Promise(r => setTimeout(r, 200));
      try {
        const res = await fetch('http://127.0.0.1:9227/json/version');
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

    const viewports = [
      { name: 'desktop_1440', width: 1440, height: 900 },
      { name: 'tablet_768', width: 768, height: 1024 },
      { name: 'mobile_390', width: 390, height: 844 }
    ];

    const prototypes = [
      { name: 'Option A', url: 'file:///design-training/stream-b/module-012/directions/option_a/index.html' },
      { name: 'Option B', url: 'file:///design-training/stream-b/module-012/directions/option_b/index.html' }
    ];

    for (const proto of prototypes) {
      console.log(`\n=== RESPONSIVE TESTING FOR ${proto.name} ===`);
      const target = await send('Target.createTarget', { url: 'about:blank' });
      const tList = await (await fetch('http://127.0.0.1:9227/json/list')).json();
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

      for (const vp of viewports) {
        await sendP('Emulation.setDeviceMetricsOverride', {
          width: vp.width,
          height: vp.height,
          deviceScaleFactor: 2,
          mobile: vp.width < 768
        });
        await new Promise(r => setTimeout(r, 400));

        const res = await sendP('Runtime.evaluate', {
          expression: `(() => {
            const scrollW = document.documentElement.scrollWidth;
            const clientW = document.documentElement.clientWidth;
            const interactive = Array.from(document.querySelectorAll('button, a, summary'));
            const violations = interactive.map(el => {
              const r = el.getBoundingClientRect();
              return {
                tag: el.tagName,
                text: (el.innerText || '').slice(0, 25),
                w: Math.round(r.width * 10) / 10,
                h: Math.round(r.height * 10) / 10,
                valid: r.width >= 44 && r.height >= 44
              };
            }).filter(v => !v.valid);

            return {
              scrollW,
              clientW,
              hasHorizontalOverflow: scrollW > clientW,
              interactiveCount: interactive.length,
              violations
            };
          })()`,
          returnByValue: true
        });

        const data = res.result.value;
        console.log(`[${vp.name}] ClientWidth=${data.clientW}px, ScrollWidth=${data.scrollW}px, Overflow=${data.hasHorizontalOverflow ? 'FAIL' : 'PASS'}, Targets>=44px: ${data.violations.length === 0 ? 'PASS' : 'FAIL (viol=' + data.violations.length + ')'}`);
        if (data.violations.length > 0) {
          console.log('   Violations:', data.violations);
        }
      }

      pageWs.close();
      await send('Target.closeTarget', { targetId: target.targetId });
    }

    ws.close();
  } finally {
    chrome.kill('SIGKILL');
    try { fs.rmSync(tempDir, { recursive: true, force: true }); } catch (e) {}
  }
}

testResponsive().catch(console.error);
