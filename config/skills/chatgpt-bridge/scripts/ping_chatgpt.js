#!/usr/bin/env node
/**
 * ════════════════════════════════════════════════════════════════════════════
 * CHATGPT CDP BRIDGE — SYSTEM SKILL ENGINE
 * Autonomous Dual-Agent Bridge for Antigravity & ChatGPT via Chrome CDP (Port 9223)
 * ════════════════════════════════════════════════════════════════════════════
 */

const fs = require('fs');
const path = require('path');

// Tự động nạp puppeteer-core từ các nguồn khả dụng
let puppeteer;
const candidatePuppeteerPaths = [
  'C:/Users/game/cdp_reader/node_modules/puppeteer-core',
  'C:/Users/game/Documents/app/SCRIPT_FACTORY_PRO_ECOSYSTEM/03_CDP_BRIDGE_ORCHESTRATOR/node_modules/puppeteer-core',
  'puppeteer-core'
];

for (const p of candidatePuppeteerPaths) {
  try {
    puppeteer = require(p);
    break;
  } catch (e) {}
}

if (!puppeteer) {
  console.error('[CHATGPT-BRIDGE ERROR] Không tìm thấy module puppeteer-core!');
  process.exit(1);
}

// Cấu hình tham số dòng lệnh
const args = process.argv.slice(2);
function getArg(flag, defaultValue) {
  const index = args.indexOf(flag);
  if (index !== -1 && index + 1 < args.length) {
    return args[index + 1];
  }
  return defaultValue;
}

const targetPort = parseInt(getArg('--port', '9223'), 10);
const checkOnly = args.includes('--check-only');
const takeScreenshot = args.includes('--screenshot') || true;
const customMessage = getArg('--message', null);
const messageFile = getArg('--file', null);
const outputDir = getArg('--output-dir', 'C:/Users/game/cdp_reader');
const outputFilename = getArg('--filename', 'latest_chatgpt_directive.md');

// Thông điệp mặc định: Giới thiệu vai trò & Yêu cầu bàn giao nhiệm vụ
const DEFAULT_INTRO_MESSAGE = `Chào ChatGPT! 👋

Mình là **Antigravity (AI Senior Engineering Agent / Lead Implementer & Integrator)** đang pair-programming trực tiếp cùng **Anh (Lead Architect / Product Owner)** trên IDE và hệ thống codebase thực tế.

Theo định hướng kiến trúc mà bạn và Anh (Lead Architect) vừa bàn bạc thống nhất, mình ping trực tiếp sang đây để:
1. **Giới thiệu vai trò kết nối**: Mình là đầu cầu kỹ thuật chịu trách nhiệm hiện thực hóa, tích hợp và kiểm chứng (Verification) toàn bộ kiến trúc trên codebase.
2. **Yêu cầu giao nhiệm vụ**: Nhờ bạn chuyển giao toàn bộ chỉ đạo kỹ thuật/nhiệm vụ tiếp theo theo đúng định hướng đã chốt cùng Anh.

📌 **Yêu cầu định dạng**: Để mình có thể tự động tải về và nạp trực tiếp vào workspace thực thi, nhờ bạn đóng gói directive này dưới dạng **khối file Markdown hoàn chỉnh** (kèm tên file cụ thể ví dụ: \`K1_DIRECTIVE.md\` hoặc tương ứng), nêu rõ:
- **Mục tiêu cốt lõi (Core Objectives)**
- **Ranh giới kỹ thuật & Phạm vi (Scope & Boundaries / Non-goals)**
- **Hợp đồng dữ liệu & Giao diện (Contracts & APIs)**
- **Tiêu chí nghiệm thu (Acceptance Criteria & Verification Plan)**

Rất mong nhận được file directive chi tiết từ bạn để mình bắt tay vào triển khai ngay! 🚀`;

async function connectBrowser(port) {
  // Dual-Island Architecture: Cô lập cổng làm việc (9223), không fallback sang cổng 9222 (Tài chính)
  const targetPort = port || 9223;
  try {
    console.log(`[CDP CONNECT] Đang thử kết nối Chrome Debugging tại http://127.0.0.1:${targetPort}...`);
    const browser = await puppeteer.connect({
      browserURL: `http://127.0.0.1:${targetPort}`,
      defaultViewport: null
    });
    console.log(`[CDP CONNECT] ✓ Kết nối thành công tới port ${targetPort}!`);
    return { browser, activePort: targetPort };
  } catch (err) {
    throw new Error(
      `Không thể kết nối Chrome Remote Debugging tại cổng ${targetPort}. ` +
      `Cổng 9223 (Đảo AI & Engineering) chưa được bật. ` +
      `Hệ thống không tự ý fallback sang cổng 9222 để bảo vệ Đảo Tài Chính của Anh. Lỗi: ${err?.message}`
    );
  }
}

async function run() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('   CHATGPT CDP BRIDGE — SYSTEM SKILL RUNNER                    ');
  console.log('═══════════════════════════════════════════════════════════════');

  const { browser, activePort } = await connectBrowser(targetPort);

  try {
    const pages = await browser.pages();
    console.log(`[CDP SCAN] Tìm thấy tổng cộng ${pages.length} tabs đang mở.`);

    // Tìm tab ChatGPT
    let gptPage = pages.find(p => p.url().includes('chatgpt.com'));

    if (!gptPage) {
      console.error('[CDP SCAN] ❌ Không tìm thấy tab nào mở trang chatgpt.com!');
      await browser.disconnect();
      process.exit(1);
    }

    const currentUrl = gptPage.url();
    const pageTitle = await gptPage.title();
    console.log(`[CHATGPT TAB] ✓ Đã định vị tab mục tiêu:`);
    console.log(`              - Tiêu đề: "${pageTitle}"`);
    console.log(`              - URL: ${currentUrl}`);

    await gptPage.bringToFront();

    if (checkOnly) {
      console.log('[CHECK ONLY] Chế độ kiểm tra: Kết nối hoàn toàn hợp lệ và sẵn sàng.');
      await browser.disconnect();
      return;
    }

    let messageToSend = customMessage || DEFAULT_INTRO_MESSAGE;
    if (messageFile) {
      if (fs.existsSync(messageFile)) {
        messageToSend = fs.readFileSync(messageFile, 'utf8');
      } else {
        console.error(`[WARNING] File ${messageFile} không tồn tại, dùng thông điệp mặc định.`);
      }
    }

    console.log('\n[INJECTION] Chuẩn bị gửi thông điệp giới thiệu vai trò và nhận nhiệm vụ...');
    console.log('───────────────────────────────────────────────────────────────');
    console.log(messageToSend);
    console.log('───────────────────────────────────────────────────────────────\n');

    // Chờ ô nhập liệu (Textarea / ProseMirror contenteditable)
    await gptPage.waitForSelector('[id="prompt-textarea"]', { timeout: 10000 });
    
    // Đảm bảo focus vào prompt input
    await gptPage.evaluate(() => {
      const el = document.getElementById('prompt-textarea');
      if (el) el.focus();
    });

    // Paste văn bản thông qua ClipboardEvent (tương thích 100% với ProseMirror transaction & React state)
    const injectionResult = await gptPage.evaluate((text) => {
      const el = document.getElementById('prompt-textarea');
      if (!el) return { success: false, error: 'Không tìm thấy #prompt-textarea' };

      el.focus();
      const dt = new DataTransfer();
      dt.setData('text/plain', text);
      const pasteEvent = new ClipboardEvent('paste', {
        clipboardData: dt,
        bubbles: true,
        cancelable: true
      });
      el.dispatchEvent(pasteEvent);

      return {
        success: true,
        charCount: text.length
      };
    }, messageToSend);

    console.log('[INJECTION RESULT]:', injectionResult);
    await new Promise(r => setTimeout(r, 1000));

    // Kiểm tra nút send đã xuất hiện và active chưa
    const btnCheck = await gptPage.evaluate(() => {
      const sendBtn = document.querySelector('button[data-testid="send-button"]');
      return {
        hasSendBtn: !!sendBtn,
        disabled: sendBtn ? sendBtn.disabled : null
      };
    });
    console.log('[SEND BUTTON CHECK]:', btnCheck);

    // Kích hoạt gửi tin nhắn (Send Button hoặc Enter)
    console.log('[SENDING] Đang kích hoạt gửi tin nhắn...');
    const sendClicked = await gptPage.evaluate(() => {
      const sendBtn = document.querySelector('button[data-testid="send-button"]') ||
                      document.querySelector('button[aria-label*="Send prompt"]') ||
                      document.querySelector('button[aria-label*="Gửi"]');
      if (sendBtn && !sendBtn.disabled) {
        sendBtn.click();
        return { clicked: true, method: 'send_button' };
      }
      return { clicked: false };
    });

    if (!sendClicked.clicked) {
      console.log('[SENDING] Click nút không khả dụng, gửi phím Enter qua bàn phím...');
      await gptPage.keyboard.press('Enter');
    } else {
      console.log('[SENDING] ✓ Đã bấm nút Send thành công!');
    }

    // Đợi ChatGPT bắt đầu tạo câu trả lời
    console.log('[STREAMING] Đang đợi ChatGPT bắt đầu sinh câu trả lời...');
    await new Promise(r => setTimeout(r, 5000));

    // Đếm số turns hiện tại để theo dõi turn mới
    const initialTurnCount = await gptPage.evaluate(() => {
      return document.querySelectorAll('[data-message-author-role]').length;
    });

    const maxWaitMs = 150000; // Tối đa 2.5 phút
    const pollIntervalMs = 2500;
    const startTime = Date.now();
    let isFinished = false;

    while (Date.now() - startTime < maxWaitMs) {
      const status = await gptPage.evaluate(() => {
        const stopBtn = document.querySelector(
          'button[data-testid="stop-button"], button[aria-label*="Stop"], button[aria-label*="Dừng"]'
        );
        const assistantMsgs = document.querySelectorAll('[data-message-author-role="assistant"]');
        const lastMsg = assistantMsgs[assistantMsgs.length - 1];
        return {
          isGenerating: !!stopBtn,
          textLength: lastMsg ? lastMsg.innerText.length : 0
        };
      });

      if (!status.isGenerating && status.textLength > 50 && (Date.now() - startTime > 10000)) {
        console.log(`\n[STREAMING] ✓ ChatGPT đã hoàn tất phản hồi sau ${Math.round((Date.now() - startTime) / 1000)}s (Độ dài: ${status.textLength} ký tự)!`);
        isFinished = true;
        break;
      }

      process.stdout.write('.');
      await new Promise(r => setTimeout(r, pollIntervalMs));
    }

    if (!isFinished) {
      console.log('\n[WARNING] Đã đạt giới hạn thời gian chờ streaming, tiến hành trích xuất nội dung hiện tại...');
    }

    await new Promise(r => setTimeout(r, 1500));

    // Trích xuất nội dung trả lời mới nhất của ChatGPT
    const latestResponse = await gptPage.evaluate(() => {
      const assistantMessages = Array.from(
        document.querySelectorAll('div[data-message-author-role="assistant"], article [data-message-author-role="assistant"]')
      );
      if (assistantMessages.length > 0) {
        return assistantMessages[assistantMessages.length - 1].innerText;
      }
      return '';
    });

    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('   NỘI DUNG CHATGPT PHẢN HỒI (LATEST DIRECTIVE)                ');
    console.log('═══════════════════════════════════════════════════════════════\n');
    console.log(latestResponse);
    console.log('\n═══════════════════════════════════════════════════════════════\n');

    // Lưu vào file nếu có outputDir
    if (outputDir) {
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      const targetFilePath = path.join(outputDir, outputFilename);
      const timestamp = new Date().toISOString();
      const contentToSave = `# DIRECTIVE NHẬN TỪ CHATGPT (PORT ${activePort})\n*Thời gian nhận: ${timestamp}*\n*URL: ${currentUrl}*\n\n---\n\n${latestResponse}\n`;

      fs.writeFileSync(targetFilePath, contentToSave, 'utf8');
      console.log(`[FILE EXPORT] ✓ Đã lưu chỉ đạo vào file: ${targetFilePath}`);
    }

    // Chụp ảnh bằng chứng
    if (takeScreenshot && outputDir) {
      const screenshotPath = path.join(outputDir, 'chatgpt_latest_proof.png');
      await gptPage.screenshot({ path: screenshotPath });
      console.log(`[SCREENSHOT] ✓ Đã lưu ảnh chụp bằng chứng: ${screenshotPath}`);
    }

    await browser.disconnect();
    console.log('[COMPLETED] Phiên làm việc hoàn tất thành công!');

  } catch (error) {
    console.error('[EXECUTION ERROR]', error);
    try {
      await browser.disconnect();
    } catch (e) {}
    process.exit(1);
  }
}

run().catch(console.error);
