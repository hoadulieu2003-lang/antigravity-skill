const fs = require('fs');
const path = require('path');

const candidatePuppeteerPaths = [
  'C:/Users/game/cdp_reader/node_modules/puppeteer-core',
  'C:/Users/game/Documents/app/SCRIPT_FACTORY_PRO_ECOSYSTEM/03_CDP_BRIDGE_ORCHESTRATOR/node_modules/puppeteer-core',
  'puppeteer-core'
];

let puppeteerModule;
for (const p of candidatePuppeteerPaths) {
  try {
    puppeteerModule = require(p);
    break;
  } catch (e) {}
}

if (!puppeteerModule) {
  console.error('Puppeteer not found');
  process.exit(1);
}

const targetUrl = 'file:///C:/Users/game/.gemini/exercises/design_training_001/index.html';
const outputDir = 'C:/Users/game/.gemini/exercises/design_training_001/screenshots';
const artifactDir = 'C:/Users/game/.gemini/antigravity/brain/68fa4f90-559f-4896-ba12-5a98a4f26362';

const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 }
];

const options = [
  { id: 'view-a', hash: '#a', code: 'option_a' },
  { id: 'view-b', hash: '#b', code: 'option_b' },
  { id: 'view-c', hash: '#c', code: 'option_c' }
];

async function run() {
  console.log('[CONNECT] Kết nối Chrome CDP tại port 9223...');
  let browser;
  try {
    browser = await puppeteerModule.connect({
      browserURL: 'http://127.0.0.1:9223',
      defaultViewport: null
    });
  } catch (e) {
    console.log('[CONNECT] Port 9223 không kết nối được, thử 9222...');
    browser = await puppeteerModule.connect({
      browserURL: 'http://127.0.0.1:9222',
      defaultViewport: null
    });
  }

  const page = await browser.newPage();

  for (const opt of options) {
    for (const vp of viewports) {
      console.log(`[CAPTURE] Đang chụp ${opt.code} tại ${vp.width}x${vp.height}...`);
      await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 2 });
      await page.goto(targetUrl, { waitUntil: 'load' });
      await page.evaluate((viewId, btnId) => {
        window.switchView(viewId, document.getElementById(btnId));
      }, opt.id, `btn-${opt.id}`);
      await new Promise(r => setTimeout(r, 600));

      const filename = `${opt.code}_${vp.name}_${vp.width}x${vp.height}.png`;
      const fullPath = path.join(outputDir, filename);
      const artifactPath = path.join(artifactDir, filename);

      await page.screenshot({ path: fullPath, fullPage: false });
      // Sao chép sang artifact directory để xem trực tiếp trong Antigravity Webview
      fs.copyFileSync(fullPath, artifactPath);
      console.log(`✓ Đã lưu: ${filename}`);
    }
  }

  await page.close();
  await browser.disconnect();
  console.log('[DONE] Đã hoàn thành chụp 6 ảnh minh chứng tại 1440px và 390px!');
}

run().catch(err => {
  console.error('[ERROR]', err);
  process.exit(1);
});
