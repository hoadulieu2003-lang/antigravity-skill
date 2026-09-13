const puppeteer = require('C:/Users/game/cdp_reader/node_modules/puppeteer-core');
const fs = require('fs');

(async () => {
  try {
    const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
    const pages = await browser.pages();
    const chatPage = pages.find(p => p.url().includes('chatgpt.com'));
    if (!chatPage) {
      console.log('ChatGPT page not found!');
      return;
    }

    // 1. Get the last assistant message full text
    const lastMsgInfo = await chatPage.evaluate(() => {
      const msgs = document.querySelectorAll('[data-message-author-role="assistant"]');
      const last = msgs[msgs.length - 1];
      if (!last) return null;
      
      const buttons = Array.from(last.querySelectorAll('button')).map(b => ({
        ariaLabel: b.getAttribute('aria-label'),
        text: b.innerText
      }));
      
      return {
        text: last.innerText,
        html: last.innerHTML,
        buttons
      };
    });

    console.log('=== LAST ASSISTANT MESSAGE ===');
    console.log(lastMsgInfo?.text);
    console.log('Buttons:', JSON.stringify(lastMsgInfo?.buttons, null, 2));

    // Check if there is a button for DESIGN_TRAINING_007_REVIEW_002
    const reviewBtn = await chatPage.evaluate(() => {
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

    console.log('Clicked review canvas button:', reviewBtn);

    if (reviewBtn) {
      // Wait for canvas to open
      await new Promise(r => setTimeout(r, 2500));
      
      const canvasContent = await chatPage.evaluate(() => {
        const prose = document.querySelector('.ProseMirror') || 
                      document.querySelector('[class*="ProseMirror"]') ||
                      document.querySelector('[contenteditable="true"]');
        return prose ? prose.innerText : null;
      });
      
      if (canvasContent && canvasContent.length > 100) {
        console.log('Found Canvas Content! Length:', canvasContent.length);
        fs.writeFileSync('C:/Users/game/.gemini/exercises/design_training_007/DESIGN_TRAINING_007_REVIEW_002.md', canvasContent, 'utf8');
        console.log('Saved Canvas Content to DESIGN_TRAINING_007_REVIEW_002.md');
      } else {
        console.log('No canvas content found, saving message text instead.');
        fs.writeFileSync('C:/Users/game/.gemini/exercises/design_training_007/DESIGN_TRAINING_007_REVIEW_002.md', lastMsgInfo.text, 'utf8');
      }
    } else {
      fs.writeFileSync('C:/Users/game/.gemini/exercises/design_training_007/DESIGN_TRAINING_007_REVIEW_002.md', lastMsgInfo.text, 'utf8');
    }

    await browser.disconnect();
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
