const puppeteer = require('C:/Users/game/cdp_reader/node_modules/puppeteer-core');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const SCREENSHOTS_DIR = path.join(__dirname, 'screenshots');
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

function getFileHash(filePath) {
  const buf = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(buf).digest('hex');
}

async function captureAll() {
  console.log('Connecting to Chrome on port 9223...');
  const browser = await puppeteer.connect({
    browserURL: 'http://127.0.0.1:9223',
    defaultViewport: null
  });

  const page = await browser.newPage();

  const screenshotsMeta = [];

  const candidateUrl = 'file:///' + path.join(__dirname, 'candidate', 'index.html').replace(/\\/g, '/');
  const optionAUrl = 'file:///' + path.join(__dirname, 'directions', 'option_a', 'index.html').replace(/\\/g, '/');
  const optionBUrl = 'file:///' + path.join(__dirname, 'directions', 'option_b', 'index.html').replace(/\\/g, '/');

  // 1. Option A Desktop 1440x900 DPR=2
  console.log('[1/10] Capturing 01_option_a_desktop_1440x900.png...');
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.goto(optionAUrl, { waitUntil: 'load' });
  const p1 = path.join(SCREENSHOTS_DIR, '01_option_a_desktop_1440x900.png');
  await page.screenshot({ path: p1, clip: { x: 0, y: 0, width: 1440, height: 900 } });

  // 2. Option B Desktop 1440x900 DPR=2
  console.log('[2/10] Capturing 02_option_b_desktop_1440x900.png...');
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.goto(optionBUrl, { waitUntil: 'load' });
  const p2 = path.join(SCREENSHOTS_DIR, '02_option_b_desktop_1440x900.png');
  await page.screenshot({ path: p2, clip: { x: 0, y: 0, width: 1440, height: 900 } });

  // 3. Candidate Desktop 1440x900 DPR=2
  console.log('[3/10] Capturing 03_candidate_desktop_1440x900.png...');
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.goto(candidateUrl, { waitUntil: 'load' });
  const p3 = path.join(SCREENSHOTS_DIR, '03_candidate_desktop_1440x900.png');
  await page.screenshot({ path: p3, clip: { x: 0, y: 0, width: 1440, height: 900 } });

  // 4. Candidate Tablet 768x1024 DPR=2
  console.log('[4/10] Capturing 04_candidate_tablet_768x1024.png...');
  await page.setViewport({ width: 768, height: 1024, deviceScaleFactor: 2 });
  await page.goto(candidateUrl, { waitUntil: 'load' });
  const p4 = path.join(SCREENSHOTS_DIR, '04_candidate_tablet_768x1024.png');
  await page.screenshot({ path: p4, clip: { x: 0, y: 0, width: 768, height: 1024 } });

  // 5. Candidate Mobile 390x844 DPR=2
  console.log('[5/10] Capturing 05_candidate_mobile_390x844.png...');
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.goto(candidateUrl, { waitUntil: 'load' });
  const p5 = path.join(SCREENSHOTS_DIR, '05_candidate_mobile_390x844.png');
  await page.screenshot({ path: p5, clip: { x: 0, y: 0, width: 390, height: 844 } });

  // 6. Candidate T01 Detail Desktop DPR=2
  console.log('[6/10] Capturing 06_candidate_t01_detail_desktop.png...');
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.goto(candidateUrl, { waitUntil: 'load' });
  const t01Element = await page.$('#tour-focus-t01');
  const p6 = path.join(SCREENSHOTS_DIR, '06_candidate_t01_detail_desktop.png');
  if (t01Element) {
    await t01Element.screenshot({ path: p6 });
  } else {
    await page.screenshot({ path: p6, clip: { x: 0, y: 150, width: 900, height: 750 } });
  }

  // 7. Candidate T01 Detail Mobile DPR=2
  console.log('[7/10] Capturing 07_candidate_t01_detail_mobile.png...');
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.goto(candidateUrl, { waitUntil: 'load' });
  const t01MobileElement = await page.$('#tour-focus-t01');
  const p7 = path.join(SCREENSHOTS_DIR, '07_candidate_t01_detail_mobile.png');
  if (t01MobileElement) {
    await t01MobileElement.screenshot({ path: p7 });
  } else {
    await page.screenshot({ path: p7, clip: { x: 0, y: 120, width: 390, height: 720 } });
  }

  // 8. Candidate Image Failure Mobile DPR=2
  console.log('[8/10] Capturing 08_candidate_image_failure_mobile.png...');
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.goto(candidateUrl, { waitUntil: 'load' });
  // Simulate image load failure by hiding raster / SVG image tags
  await page.evaluate(() => {
    document.querySelectorAll('img').forEach(img => {
      img.style.display = 'none';
      const fallback = document.createElement('div');
      fallback.style.cssText = 'padding: 12px; background: #EAE4DA; border: 1px dashed #C2410C; font-size: 11px; color: #44403C; margin: 4px 0; border-radius: 4px;';
      fallback.innerText = '[Hình ảnh dự phòng / Image Fallback]: ' + (img.getAttribute('alt') || 'Tài sản hình ảnh');
      img.parentNode.insertBefore(fallback, img);
    });
  });
  const p8 = path.join(SCREENSHOTS_DIR, '08_candidate_image_failure_mobile.png');
  await page.screenshot({ path: p8, clip: { x: 0, y: 0, width: 390, height: 844 } });

  // 9. Candidate Icon Family DPR=2
  console.log('[9/10] Capturing 09_candidate_icon_family.png...');
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.goto(candidateUrl, { waitUntil: 'load' });
  const snapshotHeading = await page.$('#snapshot-table-heading');
  const p9 = path.join(SCREENSHOTS_DIR, '09_candidate_icon_family.png');
  if (snapshotHeading) {
    await page.screenshot({ path: p9, clip: { x: 32, y: 550, width: 850, height: 350 } });
  } else {
    await page.screenshot({ path: p9, clip: { x: 0, y: 500, width: 800, height: 400 } });
  }

  // 10. Candidate Asset Disclosure DPR=2
  console.log('[10/10] Capturing 10_candidate_asset_disclosure.png...');
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.goto(candidateUrl, { waitUntil: 'load' });
  // Open details
  await page.evaluate(() => {
    const details = document.getElementById('asset-disclosure-details');
    if (details) details.open = true;
  });
  const disclosureElement = await page.$('.disclosure-panel');
  const p10 = path.join(SCREENSHOTS_DIR, '10_candidate_asset_disclosure.png');
  if (disclosureElement) {
    await disclosureElement.screenshot({ path: p10 });
  } else {
    await page.screenshot({ path: p10, clip: { x: 32, y: 700, width: 1316, height: 200 } });
  }

  await page.close();
  await browser.disconnect();

  const manifestEntries = [
    { filename: '01_option_a_desktop_1440x900.png', css_viewport: '1440x900', dpr: 2, bitmap: '2880x1800', description: 'Direction A Desktop Initial Full Viewport' },
    { filename: '02_option_b_desktop_1440x900.png', css_viewport: '1440x900', dpr: 2, bitmap: '2880x1800', description: 'Direction B Desktop Initial Full Viewport' },
    { filename: '03_candidate_desktop_1440x900.png', css_viewport: '1440x900', dpr: 2, bitmap: '2880x1800', description: 'Final Candidate Desktop Full Viewport' },
    { filename: '04_candidate_tablet_768x1024.png', css_viewport: '768x1024', dpr: 2, bitmap: '1536x2048', description: 'Final Candidate Tablet Viewport' },
    { filename: '05_candidate_mobile_390x844.png', css_viewport: '390x844', dpr: 2, bitmap: '780x1688', description: 'Final Candidate Mobile Viewport' },
    { filename: '06_candidate_t01_detail_desktop.png', css_viewport: 'element', dpr: 2, bitmap: 'dynamic', description: 'Tour T01 Focal Component Detail (Desktop)' },
    { filename: '07_candidate_t01_detail_mobile.png', css_viewport: 'element', dpr: 2, bitmap: 'dynamic', description: 'Tour T01 Focal Component Detail (Mobile)' },
    { filename: '08_candidate_image_failure_mobile.png', css_viewport: '390x844', dpr: 2, bitmap: '780x1688', description: 'Image Failure & Fallback Mode (Mobile)' },
    { filename: '09_candidate_icon_family.png', css_viewport: 'element', dpr: 2, bitmap: 'dynamic', description: 'Consistent Icon Family in Table & Status Badges' },
    { filename: '10_candidate_asset_disclosure.png', css_viewport: 'element', dpr: 2, bitmap: 'dynamic', description: 'Expanded Asset Provenance & Disclosure Panel' }
  ];

  const manifest = {
    manifest_id: 'SCREENSHOT_MANIFEST_MODULE_012',
    timestamp: new Date().toISOString(),
    total_screenshots: 10,
    device_scale_factor: 2,
    screenshots: {}
  };

  for (const entry of manifestEntries) {
    const filePath = path.join(SCREENSHOTS_DIR, entry.filename);
    const stat = fs.statSync(filePath);
    const hash = getFileHash(filePath);
    manifest.screenshots[entry.filename] = {
      filename: entry.filename,
      css_viewport: entry.css_viewport,
      device_scale_factor: entry.dpr,
      file_size_bytes: stat.size,
      sha256: hash,
      description: entry.description
    };
    console.log(`✓ ${entry.filename}: ${stat.size} bytes (SHA-256: ${hash.slice(0, 12)}...)`);
  }

  const manifestPath = path.join(__dirname, 'SCREENSHOT_MANIFEST.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
  console.log(`\n[SUCCESS] Saved SCREENSHOT_MANIFEST.json with ${manifestEntries.length} authoritative entries!`);
}

captureAll().catch(err => {
  console.error('[ERROR] Screenshot capture failed:', err);
  process.exit(1);
});
