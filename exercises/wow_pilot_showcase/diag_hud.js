const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('file:///C:/Users/game/.gemini/exercises/wow_pilot_showcase/index.html', { waitUntil: 'networkidle0' });

  const hudInfo = await page.evaluate(() => {
    const hud = document.querySelector('.sticky-hud');
    const bar = document.querySelector('.hud-bar');
    const actions = document.querySelector('.hud-actions');
    const getR = el => el ? {
      left: Math.round(el.getBoundingClientRect().left),
      right: Math.round(el.getBoundingClientRect().right),
      width: Math.round(el.getBoundingClientRect().width)
    } : null;
    return {
      hud: getR(hud),
      bar: getR(bar),
      actions: getR(actions),
      links: Array.from(document.querySelectorAll('.hud-nav-links li')).map(li => ({ text: li.textContent.trim(), w: li.getBoundingClientRect().width }))
    };
  });

  console.log(JSON.stringify(hudInfo, null, 2));
  await browser.close();
})();
