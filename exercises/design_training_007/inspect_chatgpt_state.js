const puppeteer = require('C:/Users/game/cdp_reader/node_modules/puppeteer-core');

(async () => {
  try {
    const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
    const pages = await browser.pages();
    const chatPage = pages.find(p => p.url().includes('chatgpt.com'));
    if (!chatPage) {
      console.log('ChatGPT page not found!');
      return;
    }
    
    const state = await chatPage.evaluate(() => {
      const textarea = document.getElementById('prompt-textarea');
      const textareaText = textarea ? (textarea.innerText || textarea.value) : null;
      const sendBtn = document.querySelector('button[data-testid="send-button"]') ||
                      document.querySelector('button[aria-label*="Send prompt"]') ||
                      document.querySelector('button[aria-label*="Gửi"]');
      const stopBtn = document.querySelector('button[aria-label*="Stop generating"], button[data-testid="stop-button"]');
      
      const fileCards = Array.from(document.querySelectorAll('[data-testid*="file"], [class*="file"]')).map(el => el.innerText).filter(Boolean);
      
      const msgs = Array.from(document.querySelectorAll('[data-message-author-role]')).map(el => ({
        role: el.getAttribute('data-message-author-role'),
        textSnippet: el.innerText.slice(0, 150),
        len: el.innerText.length
      }));
      
      return {
        url: window.location.href,
        textareaText: textareaText ? textareaText.slice(0, 200) : null,
        textareaLength: textareaText ? textareaText.length : 0,
        sendBtnExists: !!sendBtn,
        sendBtnDisabled: sendBtn ? sendBtn.disabled : null,
        stopBtnExists: !!stopBtn,
        messagesCount: msgs.length,
        messages: msgs
      };
    });
    
    console.log(JSON.stringify(state, null, 2));
    await browser.disconnect();
  } catch (err) {
    console.error(err);
  }
})();
