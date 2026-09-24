const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

(async () => {
  const artifactDir = 'C:\\Users\\game\\.gemini\\antigravity\\brain\\c636b9b1-07d0-4910-91cc-5b4902974f0e';
  
  // Connect to live Chrome on port 9223
  let browser;
  try {
    browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9223' });
    console.log('Connected to Chrome CDP on port 9223');
  } catch (e) {
    console.log('Falling back to launching headless to take screenshots: ' + e.message);
    browser = await puppeteer.launch({
      executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      headless: 'new',
      args: ['--no-sandbox']
    });
  }

  const pages = await browser.pages();
  let page = pages.find(p => p.url().includes('wow_pilot_showcase'));
  if (!page) {
    page = await browser.newPage();
    await page.goto('file:///C:/Users/game/.gemini/exercises/wow_pilot_showcase/index.html', { waitUntil: 'networkidle0' });
  } else {
    await page.bringToFront();
    await page.reload({ waitUntil: 'networkidle0' });
  }

  await page.setViewport({ width: 1440, height: 900 });
  await new Promise(r => setTimeout(r, 1200));

  // Screenshot 1: Hero Stage
  const heroPath = path.join(artifactDir, 'showcase_v3_hero.png');
  await page.screenshot({ path: heroPath, fullPage: false });
  console.log('Captured Hero to: ' + heroPath);

  // Scroll to Bento and Scrollytelling
  await page.evaluate(() => {
    const el = document.getElementById('theme-studio') || document.getElementById('scrolly-section');
    if (el) el.scrollIntoView({ behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 800));

  const scrollyPath = path.join(artifactDir, 'showcase_v3_scrolly.png');
  await page.screenshot({ path: scrollyPath, fullPage: false });
  console.log('Captured Scrolly/Studio to: ' + scrollyPath);

  // Scroll to Rigid Bento
  await page.evaluate(() => {
    const el = document.getElementById('rigid-bento');
    if (el) el.scrollIntoView({ behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 800));

  const bentoPath = path.join(artifactDir, 'showcase_v3_bento.png');
  await page.screenshot({ path: bentoPath, fullPage: false });
  console.log('Captured Bento to: ' + bentoPath);

  // Bring to top for user interactive experience
  await page.evaluate(() => window.scrollTo(0, 0));
  console.log('All live screenshots captured and Chrome set to top for Anh');
})();
