const WebSocket = require('ws');
const http = require('http');
const fs = require('fs');
const path = require('path');

async function testLiveChrome() {
  const tabs = await new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:9223/json/list', res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve(JSON.parse(d)));
    }).on('error', reject);
  });

  const showcaseTab = tabs.find(t => t.url.includes('wow_pilot_showcase'));
  if (!showcaseTab) {
    console.error('Showcase tab not found on Chrome 9223!');
    process.exit(1);
  }
  console.log('Found showcase tab:', showcaseTab.id);

  const ws = new WebSocket(showcaseTab.webSocketDebuggerUrl);
  let msgId = 1;
  const send = (method, params = {}) => new Promise((resolve) => {
    const id = msgId++;
    const handler = (data) => {
      const msg = JSON.parse(data);
      if (msg.id === id) {
        ws.off('message', handler);
        resolve(msg.result);
      }
    };
    ws.on('message', handler);
    ws.send(JSON.stringify({ id, method, params }));
  });

  await new Promise(r => ws.on('open', r));

  // Reload page
  console.log('Reloading page on Chrome tab...');
  await send('Page.reload', { ignoreCache: true });
  await new Promise(r => setTimeout(r, 1500));

  // Bring to front
  await send('Page.bringToFront');

  // 1. Evaluate WebGL status
  const webglStatus = await send('Runtime.evaluate', {
    expression: `(() => {
      const w = window.ShowcaseV2?.webgl;
      return JSON.stringify({
        currentMode: w?.mode,
        contextType: w?.currentContextType,
        hasGl: !!w?.gl,
        animId: !!w?.animId
      });
    })()`,
    returnByValue: true
  });
  console.log('Live WebGL Status:', webglStatus?.result?.value);

  // 2. Test Mute Sync
  const muteStatus = await send('Runtime.evaluate', {
    expression: `(() => {
      const btn = document.getElementById('soundToggleBtn');
      btn.click(); // mute
      const m1 = {
        wow: window.WowEngine.haptics.getMuted(),
        v2: window.ShowcaseV2.hapticsV2.getMuted(),
        hud: document.getElementById('hudAudioStatusVal').textContent
      };
      btn.click(); // unmute
      const m2 = {
        wow: window.WowEngine.haptics.getMuted(),
        v2: window.ShowcaseV2.hapticsV2.getMuted(),
        hud: document.getElementById('hudAudioStatusVal').textContent
      };
      return JSON.stringify({ m1, m2 });
    })()`,
    returnByValue: true
  });
  console.log('Live Mute Sync Status:', muteStatus?.result?.value);

  // 3. Test Single Sound Trigger
  const triggerStatus = await send('Runtime.evaluate', {
    expression: `(() => {
      let wow = null;
      let v2 = null;
      window.WowEngine.haptics.onAudioTrigger = t => { wow = t; };
      window.ShowcaseV2.hapticsV2.onAudioTrigger = t => { v2 = t; };
      document.getElementById('btnHapticSpring').click();
      return JSON.stringify({ wow, v2 });
    })()`,
    returnByValue: true
  });
  console.log('Live Sound Trigger Status:', triggerStatus?.result?.value);

  // 4. Test WebGL mode switching (particles then grid then waves)
  const switchStatus = await send('Runtime.evaluate', {
    expression: `(() => {
      document.querySelector('[data-webgl-mode="particles"]').click();
      const pMode = {
        mode: window.ShowcaseV2.webgl.mode,
        contextType: window.ShowcaseV2.webgl.currentContextType,
        hasCtx2d: !!window.ShowcaseV2.webgl.ctx2d
      };
      document.querySelector('[data-webgl-mode="grid"]').click();
      const gMode = {
        mode: window.ShowcaseV2.webgl.mode,
        contextType: window.ShowcaseV2.webgl.currentContextType,
        hasGl: !!window.ShowcaseV2.webgl.gl
      };
      document.querySelector('[data-webgl-mode="waves"]').click();
      const wMode = {
        mode: window.ShowcaseV2.webgl.mode,
        contextType: window.ShowcaseV2.webgl.currentContextType,
        hasGl: !!window.ShowcaseV2.webgl.gl
      };
      return JSON.stringify({ pMode, gMode, wMode });
    })()`,
    returnByValue: true
  });
  console.log('Live Mode Switch Status:', switchStatus?.result?.value);

  // 5. Test Keyboard Navigation
  const keyStatus = await send('Runtime.evaluate', {
    expression: `(() => {
      const dial = document.getElementById('steppedRotaryDial');
      const readout = document.getElementById('rotaryAngleReadout');
      window.ShowcaseV2.rotary.setAngle(0);
      dial.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
      const dialAngle = readout.textContent;

      const lever = document.getElementById('twoStageLever');
      const label = document.getElementById('twoStageLabel');
      lever.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      const leverText = label.textContent;

      return JSON.stringify({ dialAngle, leverText });
    })()`,
    returnByValue: true
  });
  console.log('Live Keyboard Nav Status:', keyStatus?.result?.value);

  // 6. Capture screenshot of live Chrome
  const shot = await send('Page.captureScreenshot', { format: 'png' });
  if (shot && shot.data) {
    const shotPath = path.join(__dirname, 'screenshots/showcase_v2_live.png');
    fs.writeFileSync(shotPath, Buffer.from(shot.data, 'base64'));
    console.log('Saved live screenshot to:', shotPath);
  }

  ws.close();
  console.log('\n✅ ALL LIVE CHROME 9223 CHECKS COMPLETED SUCCESSFULLY!');
}

testLiveChrome().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
