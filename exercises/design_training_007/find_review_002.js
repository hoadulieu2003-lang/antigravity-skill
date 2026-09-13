const puppeteer = require('C:/Users/game/cdp_reader/node_modules/puppeteer-core');
const fs = require('fs');

(async () => {
  try {
    const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
    const pages = await browser.pages();
    const chatPage = pages.find(p => p.url().includes('chatgpt.com'));
    if (!chatPage) {
      console.log('ChatGPT page not found!');
      process.exit(1);
    }

    // Find and click the button for REVIEW_002
    const clicked = await chatPage.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const found = btns.find(b => 
        (b.getAttribute('aria-label') && b.getAttribute('aria-label').includes('DESIGN_TRAINING_007_REVIEW_002')) ||
        (b.innerText && b.innerText.includes('DESIGN_TRAINING_007_REVIEW_002'))
      );
      if (found) {
        found.click();
        return true;
      }
      return false;
    });

    console.log('Clicked button:', clicked);
    // Wait 4 seconds for canvas/slideout to open
    await new Promise(r => setTimeout(r, 4000));

    // Inspect candidate containers
    const candidates = await chatPage.evaluate(() => {
      const results = [];
      
      // Look for pre
      document.querySelectorAll('pre').forEach((el, idx) => {
        if (el.innerText && (el.innerText.includes('DESIGN_TRAINING_007') || el.innerText.includes('REVIEW_002') || el.innerText.includes('REPAIR_STATUS'))) {
          results.push({ type: 'pre', idx, len: el.innerText.length, text: el.innerText });
        }
      });

      // Look for prose / markdown containers
      document.querySelectorAll('.prose, [class*="prose"], [class*="markdown"], .ProseMirror').forEach((el, idx) => {
        if (el.innerText && (el.innerText.includes('DESIGN_TRAINING_007') || el.innerText.includes('REVIEW_002') || el.innerText.includes('REPAIR_STATUS'))) {
          results.push({ type: 'prose', idx, len: el.innerText.length, text: el.innerText });
        }
      });

      // Look for canvas / code editor
      document.querySelectorAll('[data-testid*="canvas"], [class*="canvas"]').forEach((el, idx) => {
        if (el.innerText && el.innerText.length > 500) {
          results.push({ type: 'canvas', idx, len: el.innerText.length, text: el.innerText });
        }
      });

      return results;
    });

    console.log('Candidate containers found:', candidates.length);
    for (const c of candidates) {
      console.log(`- Type: ${c.type}, Len: ${c.len}, Snippet: ${c.text.slice(0, 100).replace(/\n/g, ' ')}`);
    }

    if (candidates.length > 0) {
      // Pick the longest one that contains REVIEW_002 or REPAIR_STATUS
      candidates.sort((a, b) => b.len - a.len);
      const best = candidates[0];
      console.log(`Selected best candidate: Type ${best.type}, Len: ${best.len}`);
      fs.writeFileSync('C:/Users/game/.gemini/exercises/design_training_007/DESIGN_TRAINING_007_REVIEW_002.md', best.text, 'utf8');
      console.log('Saved to DESIGN_TRAINING_007_REVIEW_002.md');
    }

    await browser.disconnect();
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
