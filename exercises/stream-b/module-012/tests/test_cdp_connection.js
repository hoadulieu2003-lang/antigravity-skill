const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

async function testCDP() {
  const tempDir = path.join(os.tmpdir(), 'chrome-test-' + Date.now());
  fs.mkdirSync(tempDir, { recursive: true });
  
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9225',
    '--user-data-dir=' + tempDir,
    '--window-size=1440,900',
    '--disable-gpu',
    '--no-first-run'
  ]);

  try {
    // Wait for Chrome to start
    let versionData = null;
    for (let i = 0; i < 20; i++) {
      await new Promise(r => setTimeout(r, 200));
      try {
        const res = await fetch('http://127.0.0.1:9225/json/version');
        if (res.ok) {
          versionData = await res.json();
          break;
        }
      } catch (e) {}
    }

    if (!versionData) {
      throw new Error('Could not connect to Chrome debugging port');
    }
    console.log('Connected to Chrome:', versionData.Browser);

    const ws = new WebSocket(versionData.webSocketDebuggerUrl);
    await new Promise((resolve, reject) => {
      ws.onopen = resolve;
      ws.onerror = reject;
    });

    console.log('WebSocket connection opened successfully');

    let msgId = 1;
    function send(method, params = {}) {
      return new Promise((resolve) => {
        const id = msgId++;
        const handler = (event) => {
          const data = JSON.parse(event.data);
          if (data.id === id) {
            ws.removeEventListener('message', handler);
            resolve(data.result);
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id, method, params }));
      });
    }

    // Create a new target/page
    const newTarget = await send('Target.createTarget', { url: 'about:blank' });
    console.log('Created target:', newTarget.targetId);

    // Connect to target
    const targetWsRes = await fetch('http://127.0.0.1:9225/json/list');
    const targets = await targetWsRes.json();
    const pageTarget = targets.find(t => t.id === newTarget.targetId);
    
    const pageWs = new WebSocket(pageTarget.webSocketDebuggerUrl);
    await new Promise(resolve => pageWs.onopen = resolve);

    let pageMsgId = 1;
    function sendPage(method, params = {}) {
      return new Promise((resolve) => {
        const id = pageMsgId++;
        const handler = (event) => {
          const data = JSON.parse(event.data);
          if (data.id === id) {
            pageWs.removeEventListener('message', handler);
            resolve(data.result);
          }
        };
        pageWs.addEventListener('message', handler);
        pageWs.send(JSON.stringify({ id, method, params }));
      });
    }

    await sendPage('Page.enable');
    const navRes = await sendPage('Page.navigate', {
      url: 'file:///design-training/stream-b/module-012/directions/option_a/index.html'
    });
    console.log('Navigated:', navRes);

    await new Promise(r => setTimeout(r, 500));

    const evalRes = await sendPage('Runtime.evaluate', {
      expression: 'document.title',
      returnByValue: true
    });
    console.log('Page Title:', evalRes.result.value);

    pageWs.close();
    ws.close();
  } finally {
    chrome.kill('SIGKILL');
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch (e) {}
  }
}

testCDP().then(() => console.log('CDP Test Done')).catch(console.error);
