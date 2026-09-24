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

  const result = await page.evaluate(() => {
    const docW = document.documentElement.clientWidth;
    const winW = window.innerWidth;
    const bodyW = document.body.scrollWidth;
    const docScrollW = document.documentElement.scrollWidth;
    const overflows = [];
    document.querySelectorAll('*').forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.right > docW + 2) {
        overflows.push({
          tag: el.tagName,
          id: el.id,
          className: (el.className && typeof el.className === 'string') ? el.className.slice(0, 50) : '',
          right: Math.round(r.right),
          width: Math.round(r.width),
          excess: Math.round(r.right - docW)
        });
      }
    });
    return { docW, winW, bodyW, docScrollW, overflows: overflows.slice(0, 10) };
  });

  console.log(JSON.stringify(result, null, 2));
  await browser.close();
})();
