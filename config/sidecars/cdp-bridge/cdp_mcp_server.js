#!/usr/bin/env node
/**
 * ════════════════════════════════════════════════════════════════════════════
 * CDP ENTERPRISE SUPER-ENGINE v2.0 (Stdio JSON-RPC 2.0)
 * Model Context Protocol Engine for Universal Chrome Remote Debugging & Google Flow
 * 
 * Chủ quản: Anh — Lead Architect / Product Owner
 * Phát triển & Điều hành: Em — Senior Engineering Agent / Antigravity
 * ════════════════════════════════════════════════════════════════════════════
 */

const readline = require('readline');
const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');
const puppeteer = require('puppeteer-core');
const { generateRepoMap, findSymbolInRepo } = require('./ast_repo_map');

// ════════════════════════════════════════════════════════════════════════════
// GLOBAL STATE & BROWSER CONNECTION POOL
// ════════════════════════════════════════════════════════════════════════════

const browserCache = {}; // { [port]: Browser }
let currentActivePort = 9222;
let currentActiveTargetId = null;

// Ring buffer lưu trữ console logs và page errors gần nhất (tối đa 150 mục)
const consoleLogBuffer = [];
const MAX_LOGS = 150;

function pushConsoleLog(entry) {
  consoleLogBuffer.push({
    timestamp: new Date().toISOString(),
    ...entry
  });
  if (consoleLogBuffer.length > MAX_LOGS) {
    consoleLogBuffer.shift();
  }
}

/**
 * Gắn listeners để thu thập console và error logs cho page
 */
function attachPageLogListeners(page) {
  if (page.__hasLogListeners) return;
  page.__hasLogListeners = true;

  page.on('console', (msg) => {
    try {
      pushConsoleLog({
        type: msg.type(),
        text: msg.text(),
        url: page.url(),
        location: msg.location()
      });
    } catch (e) {}
  });

  page.on('pageerror', (err) => {
    try {
      pushConsoleLog({
        type: 'error',
        text: err.message || String(err),
        url: page.url(),
        stack: err.stack || null
      });
    } catch (e) {}
  });
}

/**
 * Kết nối hoặc tái sử dụng Puppeteer CDP connection với cơ chế Auto-Fallback (9222 <-> 9223)
 */
async function getConnectedBrowser(port = null) {
  let targetPort = port || currentActivePort || 9222;
  let browser = browserCache[targetPort];

  if (browser && browser.connected) {
    return { browser, activePort: targetPort };
  }

  const candidatePorts = [targetPort, targetPort === 9222 ? 9223 : 9222];
  let lastError = null;

  for (const p of candidatePorts) {
    try {
      browser = await puppeteer.connect({
        browserURL: `http://127.0.0.1:${p}`,
        defaultViewport: null
      });

      browser.on('disconnected', () => {
        delete browserCache[p];
      });

      browserCache[p] = browser;
      currentActivePort = p;
      return { browser, activePort: p };
    } catch (err) {
      lastError = err;
    }
  }

  throw new Error(
    `Không thể kết nối Chrome Remote Debugging tại các cổng [${candidatePorts.join(', ')}]. ` +
    `Vui lòng gọi tool 'cdp_ensure_browser' để tự động mở Chrome hoặc bật Chrome với cờ '--remote-debugging-port=9222'. Chi tiết lỗi: ${lastError?.message}`
  );
}

/**
 * Định vị tab mục tiêu một cách thông minh (Universal Target Resolution)
 */
async function resolveTargetPage(browser, options = {}) {
  const pages = await browser.pages();
  if (pages.length === 0) {
    const newP = await browser.newPage();
    attachPageLogListeners(newP);
    return newP;
  }

  // Gắn log listeners cho tất cả các pages hiện hữu
  pages.forEach(attachPageLogListeners);

  // 1. Tìm theo tabIndex cụ thể
  if (typeof options.tabIndex === 'number' && options.tabIndex >= 0 && options.tabIndex < pages.length) {
    return pages[options.tabIndex];
  }

  // 2. Tìm theo targetId cụ thể
  if (options.tabId) {
    const matched = pages.find(p => {
      try {
        return p.target()._targetId === options.tabId;
      } catch (e) {
        return false;
      }
    });
    if (matched) return matched;
  }

  // 3. Tìm theo urlPattern
  if (options.urlPattern) {
    const pattern = String(options.urlPattern).toLowerCase();
    const matched = pages.find(p => (p.url() || '').toLowerCase().includes(pattern));
    if (matched) return matched;
  }

  // 4. Tìm theo titlePattern
  if (options.titlePattern) {
    const pattern = String(options.titlePattern).toLowerCase();
    for (const p of pages) {
      try {
        const title = (await p.title()).toLowerCase();
        if (title.includes(pattern)) return p;
      } catch (e) {}
    }
  }

  // 5. Nếu có currentActiveTargetId đã lưu từ trước
  if (currentActiveTargetId) {
    const matched = pages.find(p => {
      try {
        return p.target()._targetId === currentActiveTargetId;
      } catch (e) {
        return false;
      }
    });
    if (matched) return matched;
  }

  // 6. Nếu yêu cầu Flow chuyên biệt
  if (options.preferFlow) {
    const flowPage = pages.find(p => p.url().includes('labs.google/fx') || p.url().includes('flow.google.com'));
    if (flowPage) return flowPage;
  }

  // 7. Mặc định trả về page đầu tiên
  return pages[0];
}

/**
 * Tìm kiếm iFrame công cụ trong trang Google Flow
 */
async function findToolFrame(flowPage) {
  const frames = flowPage.frames();
  const main = flowPage.mainFrame();
  for (const f of frames) {
    if (f === main) continue; // Bỏ qua main frame vì main frame có thanh prompt "What do you want to create?"
    try {
      const hasApplet = await f.evaluate(() => {
        return !!document.querySelector('textarea') || !!window.__FLOW04_READY__ || !!window.__FLOW_APPLET_READY__;
      });
      if (hasApplet) return f;
    } catch (e) {}
  }
  return frames.find(f => {
    if (f === main) return false;
    const u = f.url();
    return u === 'about:srcdoc' || u.includes('flow-applet') || u.includes('scf.usercontent.goog') || u.startsWith('blob:');
  }) || null;
}

/**
 * Trợ thủ tìm element hoặc frame chứa element qua selector hoặc text
 */
async function findElementContext(page, selector, textMatch = null) {
  // Thử ở main frame
  try {
    const foundInMain = await page.evaluate(({ sel, txt }) => {
      if (sel) {
        return !!document.querySelector(sel);
      }
      if (txt) {
        const lower = txt.toLowerCase();
        return Array.from(document.querySelectorAll('*')).some(
          el => (el.innerText || el.textContent || '').toLowerCase().includes(lower) && el.offsetParent !== null
        );
      }
      return false;
    }, { sel: selector, txt: textMatch });

    if (foundInMain) return { context: page, isFrame: false };
  } catch (e) {}

  // Thử trong các iFrames
  const frames = page.frames();
  for (const f of frames) {
    try {
      const foundInFrame = await f.evaluate(({ sel, txt }) => {
        if (sel) {
          return !!document.querySelector(sel);
        }
        if (txt) {
          const lower = txt.toLowerCase();
          return Array.from(document.querySelectorAll('*')).some(
            el => (el.innerText || el.textContent || '').toLowerCase().includes(lower) && el.offsetParent !== null
          );
        }
        return false;
      }, { sel: selector, txt: textMatch });

      if (foundInFrame) return { context: f, isFrame: true };
    } catch (e) {}
  }

  return { context: page, isFrame: false };
}

// ════════════════════════════════════════════════════════════════════════════
// TRỤ CỘT 1: QUẢN LÝ PHIÊN & ĐIỀU HƯỚNG ĐA TAB (TAB ORCHESTRATION)
// ════════════════════════════════════════════════════════════════════════════

/**
 * TOOL: Liệt kê danh sách tất cả các Tab đang mở
 */
async function handleListTabs(args) {
  const { browser, activePort } = await getConnectedBrowser(args?.port);
  const pages = await browser.pages();
  const tabs = [];

  for (let i = 0; i < pages.length; i++) {
    const p = pages[i];
    attachPageLogListeners(p);
    let title = '';
    let url = '';
    let targetId = '';

    try {
      title = await p.title();
      url = p.url();
      targetId = p.target()._targetId;
    } catch (e) {
      title = '(Không thể đọc tiêu đề)';
      url = '(Không rõ URL)';
    }

    const isActive = targetId === currentActiveTargetId || (!currentActiveTargetId && i === 0);

    tabs.push({
      tabIndex: i,
      tabId: targetId,
      title,
      url,
      isActive
    });
  }

  return {
    success: true,
    connectedPort: activePort,
    totalTabs: tabs.length,
    tabs
  };
}

/**
 * TOOL: Chuyển target làm việc sang tab mong muốn
 */
async function handleSwitchTab(args) {
  const { browser, activePort } = await getConnectedBrowser(args?.port);
  const targetPage = await resolveTargetPage(browser, {
    tabIndex: args?.tabIndex,
    tabId: args?.tabId,
    urlPattern: args?.urlPattern,
    titlePattern: args?.titlePattern
  });

  if (!targetPage) {
    throw new Error('Không tìm thấy tab phù hợp với điều kiện chỉ định.');
  }

  const targetId = targetPage.target()._targetId;
  currentActiveTargetId = targetId;

  if (args?.bringToFront !== false) {
    try {
      await targetPage.bringToFront();
    } catch (e) {}
  }

  return {
    success: true,
    connectedPort: activePort,
    activeTabId: targetId,
    pageTitle: await targetPage.title(),
    pageUrl: targetPage.url(),
    message: `Đã chuyển target thành công sang tab: "${await targetPage.title()}" (${targetPage.url()})`
  };
}

/**
 * TOOL: Mở một Tab mới
 */
async function handleNewTab(args) {
  const { browser, activePort } = await getConnectedBrowser(args?.port);
  const newPage = await browser.newPage();
  attachPageLogListeners(newPage);

  const url = args?.url || 'about:blank';
  if (url && url !== 'about:blank') {
    const waitUntil = args?.waitUntil || 'domcontentloaded';
    await newPage.goto(url, { waitUntil, timeout: args?.timeoutMs || 30000 });
  }

  const targetId = newPage.target()._targetId;
  currentActiveTargetId = targetId;

  return {
    success: true,
    connectedPort: activePort,
    tabId: targetId,
    pageTitle: await newPage.title(),
    pageUrl: newPage.url(),
    message: `Đã mở tab mới thành công với URL: ${url}`
  };
}

/**
 * TOOL: Đóng Tab
 */
async function handleCloseTab(args) {
  const { browser, activePort } = await getConnectedBrowser(args?.port);
  const targetPage = await resolveTargetPage(browser, {
    tabIndex: args?.tabIndex,
    tabId: args?.tabId,
    urlPattern: args?.urlPattern
  });

  if (!targetPage) {
    throw new Error('Không tìm thấy tab để đóng.');
  }

  const closedTitle = await targetPage.title();
  const closedUrl = targetPage.url();
  await targetPage.close();

  if (currentActiveTargetId === targetPage.target()._targetId) {
    currentActiveTargetId = null;
  }

  return {
    success: true,
    connectedPort: activePort,
    closedTitle,
    closedUrl,
    message: `Đã đóng tab: "${closedTitle}" (${closedUrl})`
  };
}

/**
 * TOOL: Điều hướng URL (goto / reload / back / forward)
 */
async function handleNavigate(args) {
  const { browser, activePort } = await getConnectedBrowser(args?.port);
  const page = await resolveTargetPage(browser, args);

  const action = args?.action || 'goto';
  const waitUntil = args?.waitUntil || 'domcontentloaded';
  const timeout = args?.timeoutMs || 45000;

  let navResponse = null;

  switch (action) {
    case 'goto':
      if (!args?.url) throw new Error('Tham số url là bắt buộc khi action="goto"!');
      navResponse = await page.goto(args.url, { waitUntil, timeout });
      break;
    case 'reload':
      navResponse = await page.reload({ waitUntil, timeout });
      break;
    case 'back':
      navResponse = await page.goBack({ waitUntil, timeout });
      break;
    case 'forward':
      navResponse = await page.goForward({ waitUntil, timeout });
      break;
    default:
      throw new Error(`Hành động action='${action}' không hợp lệ (hỗ trợ: goto, reload, back, forward)`);
  }

  return {
    success: true,
    connectedPort: activePort,
    action,
    currentUrl: page.url(),
    pageTitle: await page.title(),
    httpStatus: navResponse ? navResponse.status() : null,
    message: `Điều hướng (${action}) thành công tới: ${page.url()}`
  };
}

// ════════════════════════════════════════════════════════════════════════════
// TRỤ CỘT 2: TƯƠNG TÁC CHUẨN XÁC (PRECISION INTERACTION)
// ════════════════════════════════════════════════════════════════════════════

/**
 * TOOL: Click chuột nâng cao (hỗ trợ Selector, XPath, Text, Coordinates, DoubleClick, RightClick)
 */
async function handleClick(args) {
  const { browser, activePort } = await getConnectedBrowser(args?.port);
  const page = await resolveTargetPage(browser, args);

  const selector = args?.selector;
  const text = args?.text;
  const xpath = args?.xpath;
  const coordinates = args?.coordinates; // { x, y }
  const button = args?.button || 'left'; // 'left' | 'right' | 'middle'
  const clickCount = args?.clickCount || 1;
  const delay = args?.delay || 0;
  const hoverOnly = !!args?.hoverOnly;

  // 1. Click theo tọa độ trực tiếp
  if (coordinates && typeof coordinates.x === 'number' && typeof coordinates.y === 'number') {
    if (hoverOnly) {
      await page.mouse.move(coordinates.x, coordinates.y);
      return { success: true, connectedPort: activePort, action: 'hover', coordinates };
    }
    await page.mouse.click(coordinates.x, coordinates.y, { button, clickCount, delay });
    return { success: true, connectedPort: activePort, action: 'click', coordinates };
  }

  // 2. Tìm ngữ cảnh element (main page hoặc iframe)
  const { context } = await findElementContext(page, selector, text);

  const clickResult = await context.evaluate(async ({ sel, txt, xp, btn, count, hover }) => {
    let target = null;

    if (sel) {
      target = document.querySelector(sel);
    } else if (xp) {
      const xResult = document.evaluate(xp, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
      target = xResult.singleNodeValue;
    } else if (txt) {
      const lower = txt.toLowerCase().trim();
      const candidates = Array.from(document.querySelectorAll('button, a, div[role="button"], span, input[type="button"], input[type="submit"], [tabindex]'));
      target = candidates.find(el => {
        const t = (el.innerText || el.textContent || el.value || '').toLowerCase().trim();
        return t.includes(lower) && el.offsetParent !== null;
      });
      // Mở rộng tìm toàn bộ DOM nếu chưa thấy
      if (!target) {
        target = Array.from(document.querySelectorAll('*')).find(el => {
          const t = (el.innerText || el.textContent || '').toLowerCase().trim();
          return t.includes(lower) && el.offsetParent !== null && el.children.length === 0;
        });
      }
    }

    if (!target) {
      return { success: false, reason: 'Element not found' };
    }

    // Cuộn vào tầm nhìn
    target.scrollIntoView({ behavior: 'instant', block: 'center', inline: 'center' });
    const rect = target.getBoundingClientRect();

    if (hover) {
      const ev = new MouseEvent('mouseover', { bubbles: true, cancelable: true, view: window });
      target.dispatchEvent(ev);
      return { success: true, rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height }, text: target.innerText || target.value || '' };
    }

    // Kích hoạt click sự kiện đầy đủ
    target.focus();
    for (let c = 0; c < count; c++) {
      target.click();
      target.dispatchEvent(new MouseEvent(btn === 'right' ? 'contextmenu' : 'click', {
        bubbles: true,
        cancelable: true,
        view: window,
        button: btn === 'right' ? 2 : 0
      }));
    }

    return {
      success: true,
      tag: target.tagName,
      text: (target.innerText || target.textContent || target.value || '').trim().slice(0, 100),
      rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height }
    };
  }, { sel: selector, txt: text, xp: xpath, btn: button, count: clickCount, hover: hoverOnly });

  if (!clickResult.success) {
    throw new Error(`Không tìm thấy phần tử để click (Selector: "${selector || ''}", Text: "${text || ''}", XPath: "${xpath || ''}")`);
  }

  return {
    success: true,
    connectedPort: activePort,
    clickedElement: clickResult,
    message: `Đã ${hoverOnly ? 'hover' : 'click'} thành công phần tử <${clickResult.tag}> chứa text: "${clickResult.text}"`
  };
}

/**
 * TOOL: Nhập văn bản vào input / textarea / ProseMirror / Lexical / Monaco
 */
async function handleTypeText(args) {
  const { browser, activePort } = await getConnectedBrowser(args?.port);
  const page = await resolveTargetPage(browser, args);

  const selector = args?.selector;
  const text = args?.text;
  const clearBefore = args?.clearBefore !== false; // Mặc định: true
  const mode = args?.mode || 'insertText'; // 'insertText' (CDP native) | 'type' (keystrokes)

  if (text === undefined || text === null) {
    throw new Error('Tham số text (nội dung cần nhập) là bắt buộc!');
  }

  const { context } = await findElementContext(page, selector);

  // 1. Focus và chuẩn bị phần tử
  const targetInfo = await context.evaluate(async ({ sel, clear }) => {
    let el = sel ? document.querySelector(sel) : document.activeElement;
    if (!el || el === document.body) {
      el = document.querySelector('input:not([type="hidden"]), textarea, [contenteditable="true"], [role="textbox"]');
    }

    if (!el) return { found: false };

    el.scrollIntoView({ behavior: 'instant', block: 'center' });
    el.focus();
    el.click();

    if (clear) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set
          || Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')?.set;
        if (nativeSetter) {
          nativeSetter.call(el, '');
        } else {
          el.value = '';
        }
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      } else if (el.isContentEditable) {
        el.innerText = '';
        el.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }

    return {
      found: true,
      tag: el.tagName,
      isEditable: el.isContentEditable,
      id: el.id || null,
      name: el.getAttribute('name') || null
    };
  }, { sel: selector, clear: clearBefore });

  if (!targetInfo.found) {
    throw new Error(`Không tìm thấy phần tử trường nhập liệu phù hợp với selector: "${selector || 'active element'}"`);
  }

  // 2. Nhập dữ liệu
  if (mode === 'insertText') {
    // Sử dụng giao thức CDP native Input.insertText — giải quyết triệt để vấn đề React state & ProseMirror / Lexical
    const client = await page.target().createCDPSession();
    await client.send('Input.insertText', { text });
    await client.detach();
  } else {
    // Mô phỏng gõ phím chân thực
    await page.keyboard.type(text, { delay: args?.keyDelay || 25 });
  }

  // Đảm bảo bắn sự kiện hoàn tất
  await context.evaluate(() => {
    const el = document.activeElement;
    if (el) {
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });

  return {
    success: true,
    connectedPort: activePort,
    target: targetInfo,
    mode,
    enteredLength: text.length,
    message: `Đã nhập thành công ${text.length} ký tự vào phần tử <${targetInfo.tag}>.`
  };
}

/**
 * TOOL: Nhấn phím đặc biệt hoặc phím tắt (Enter, Tab, Escape, Ctrl+A...)
 */
async function handlePressKey(args) {
  const { browser, activePort } = await getConnectedBrowser(args?.port);
  const page = await resolveTargetPage(browser, args);

  const key = args?.key;
  if (!key) {
    throw new Error('Tham số key (tên phím cần bấm, ví dụ: "Enter", "Tab", "Escape") là bắt buộc!');
  }

  const modifiers = args?.modifiers || []; // ['Control', 'Shift', 'Alt']

  // Nhấn giữ modifier
  for (const m of modifiers) {
    await page.keyboard.down(m);
  }

  // Nhấn phím chính
  await page.keyboard.press(key, { delay: args?.delay || 50 });

  // Nhả modifier
  for (const m of modifiers.reverse()) {
    await page.keyboard.up(m);
  }

  return {
    success: true,
    connectedPort: activePort,
    pressedKey: key,
    modifiers,
    message: `Đã bấm thành công phím: ${modifiers.length > 0 ? modifiers.join('+') + '+' : ''}${key}`
  };
}

/**
 * TOOL: Cuộn trang (Scroll)
 */
async function handleScroll(args) {
  const { browser, activePort } = await getConnectedBrowser(args?.port);
  const page = await resolveTargetPage(browser, args);

  const deltaX = args?.deltaX || 0;
  const deltaY = args?.deltaY || 0;
  const selector = args?.selector;
  const position = args?.position; // 'top' | 'bottom'

  if (selector) {
    const { context } = await findElementContext(page, selector);
    const scrolled = await context.evaluate((sel) => {
      const el = document.querySelector(sel);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return true;
      }
      return false;
    }, selector);

    if (!scrolled) {
      throw new Error(`Không tìm thấy phần tử để cuộn tới: "${selector}"`);
    }

    return { success: true, connectedPort: activePort, action: 'scrollIntoView', selector };
  }

  if (position === 'top') {
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
    return { success: true, connectedPort: activePort, action: 'scrollToTop' };
  }

  if (position === 'bottom') {
    await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }));
    return { success: true, connectedPort: activePort, action: 'scrollToBottom' };
  }

  // Cuộn theo khoảng cách pixel
  await page.evaluate(({ dx, dy }) => {
    window.scrollBy({ left: dx, top: dy, behavior: 'smooth' });
  }, { dx: deltaX, dy: deltaY });

  return {
    success: true,
    connectedPort: activePort,
    action: 'scrollBy',
    deltaX,
    deltaY
  };
}

/**
 * TOOL: Chờ đợi thông minh (Wait For Selector / Text / Navigation / Delay)
 */
async function handleWaitFor(args) {
  const { browser, activePort } = await getConnectedBrowser(args?.port);
  const page = await resolveTargetPage(browser, args);

  const selector = args?.selector;
  const text = args?.text;
  const timeout = args?.timeoutMs || 15000;
  const state = args?.state || 'visible'; // 'visible' | 'hidden'

  if (selector) {
    await page.waitForSelector(selector, {
      visible: state === 'visible',
      hidden: state === 'hidden',
      timeout
    });
    return {
      success: true,
      connectedPort: activePort,
      condition: `selector '${selector}' (${state})`,
      message: `Điều kiện chờ selector '${selector}' đã thỏa mãn.`
    };
  }

  if (text) {
    const startTime = Date.now();
    const lowerText = text.toLowerCase();

    while (Date.now() - startTime < timeout) {
      const hasText = await page.evaluate((txt) => {
        return (document.body ? document.body.innerText : '').toLowerCase().includes(txt);
      }, lowerText);

      if (hasText) {
        return {
          success: true,
          connectedPort: activePort,
          condition: `text containing "${text}"`,
          message: `Đã tìm thấy text "${text}" trên trang sau ${Date.now() - startTime}ms.`
        };
      }
      await new Promise(r => setTimeout(r, 400));
    }
    throw new Error(`Timeout ${timeout}ms: Không tìm thấy text "${text}" xuất hiện trên trang.`);
  }

  // Chờ độ trễ thông thường
  const delayMs = args?.delayMs || 1000;
  await new Promise(r => setTimeout(r, delayMs));

  return {
    success: true,
    connectedPort: activePort,
    waitedMs: delayMs,
    message: `Đã chờ tĩnh ${delayMs}ms.`
  };
}

/**
 * TOOL: Nạp file vào input upload (File Upload)
 */
async function handleUploadFile(args) {
  const { browser, activePort } = await getConnectedBrowser(args?.port);
  const page = await resolveTargetPage(browser, args);

  const selector = args?.selector || 'input[type="file"]';
  const filePath = args?.filePath;

  if (!filePath) {
    throw new Error('Tham số filePath (đường dẫn file cục bộ cần upload) là bắt buộc!');
  }

  if (!fs.existsSync(filePath)) {
    throw new Error(`File không tồn tại trên ổ đĩa: "${filePath}"`);
  }

  const inputHandle = await page.$(selector);
  if (!inputHandle) {
    throw new Error(`Không tìm thấy input file với selector: "${selector}"`);
  }

  await inputHandle.uploadFile(filePath);

  return {
    success: true,
    connectedPort: activePort,
    selector,
    uploadedFilePath: filePath,
    fileName: path.basename(filePath),
    message: `Đã nạp file "${path.basename(filePath)}" vào input "${selector}" thành công.`
  };
}

// ════════════════════════════════════════════════════════════════════════════
// TRỤ CỘT 3: QUAN SÁT & THỊ GIÁC DOM THÔNG MINH (OBSERVABILITY & INTELLIGENCE)
// ════════════════════════════════════════════════════════════════════════════

/**
 * TOOL: Trích xuất nội dung và bản đồ phần tử tương tác của trang web
 */
async function handleExtractPageContent(args) {
  const { browser, activePort } = await getConnectedBrowser(args?.port);
  const page = await resolveTargetPage(browser, args);

  const mode = args?.mode || 'interactive'; // 'interactive' | 'text' | 'markdown'
  const maxElements = args?.maxElements || 60;

  if (mode === 'text') {
    const text = await page.evaluate(() => {
      return document.body ? document.body.innerText : '';
    });
    return {
      success: true,
      connectedPort: activePort,
      pageTitle: await page.title(),
      pageUrl: page.url(),
      contentLength: text.length,
      textSnippet: text.slice(0, 5000)
    };
  }

  if (mode === 'markdown') {
    const markdown = await page.evaluate(() => {
      // Đơn giản hóa cấu trúc văn bản sang markdown
      const headings = Array.from(document.querySelectorAll('h1, h2, h3, p, li'));
      return headings.map(el => {
        const tag = el.tagName.toLowerCase();
        const t = (el.innerText || '').trim();
        if (!t) return '';
        if (tag === 'h1') return `# ${t}\n`;
        if (tag === 'h2') return `## ${t}\n`;
        if (tag === 'h3') return `### ${t}\n`;
        if (tag === 'li') return `- ${t}`;
        return `${t}\n`;
      }).filter(Boolean).join('\n');
    });
    return {
      success: true,
      connectedPort: activePort,
      pageTitle: await page.title(),
      pageUrl: page.url(),
      markdownSnippet: markdown.slice(0, 5000)
    };
  }

  // Chế độ 'interactive': Trích xuất Interactive Elements Map cho Agent
  const interactiveElements = await page.evaluate((max) => {
    function getCssSelector(el) {
      if (el.id) return `#${CSS.escape(el.id)}`;
      if (el.getAttribute('data-testid')) return `[data-testid="${CSS.escape(el.getAttribute('data-testid'))}"]`;
      if (el.getAttribute('aria-label')) return `[aria-label="${CSS.escape(el.getAttribute('aria-label'))}"]`;
      if (el.name) return `${el.tagName.toLowerCase()}[name="${CSS.escape(el.name)}"]`;

      const classes = Array.from(el.classList).filter(c => !c.includes(':') && c.length < 30).slice(0, 2);
      if (classes.length > 0) {
        const classSel = `${el.tagName.toLowerCase()}.${classes.join('.')}`;
        if (document.querySelectorAll(classSel).length === 1) return classSel;
      }

      let path = el.tagName.toLowerCase();
      let parent = el.parentElement;
      while (parent && parent !== document.body && parent !== document.documentElement) {
        if (parent.id) {
          path = `#${CSS.escape(parent.id)} > ${path}`;
          break;
        }
        parent = parent.parentElement;
      }
      return path;
    }

    const query = 'button, a[href], input, textarea, select, [role="button"], [role="textbox"], [role="tab"], [contenteditable="true"]';
    const all = Array.from(document.querySelectorAll(query));

    const visible = all.filter(el => {
      const rect = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none';
    });

    return visible.slice(0, max).map((el, idx) => {
      const text = (el.innerText || el.textContent || el.value || el.placeholder || el.getAttribute('aria-label') || '').trim().replace(/\s+/g, ' ');
      return {
        index: idx,
        tag: el.tagName.toLowerCase(),
        type: el.getAttribute('type') || null,
        text: text.slice(0, 80),
        selector: getCssSelector(el),
        id: el.id || null,
        name: el.getAttribute('name') || null,
        disabled: !!el.disabled
      };
    });
  }, maxElements);

  return {
    success: true,
    connectedPort: activePort,
    pageTitle: await page.title(),
    pageUrl: page.url(),
    totalInteractiveElements: interactiveElements.length,
    interactiveMap: interactiveElements
  };
}

/**
 * TOOL: Đọc lịch sử Console Logs và Page Errors
 */
async function handleGetConsoleLogs(args) {
  const { activePort } = await getConnectedBrowser(args?.port);
  const filterType = args?.type; // 'error' | 'warn' | 'log'
  const limit = args?.limit || 50;

  let logs = consoleLogBuffer;
  if (filterType) {
    logs = logs.filter(l => l.type === filterType);
  }

  const result = logs.slice(-limit);

  return {
    success: true,
    connectedPort: activePort,
    totalLogsBuffered: consoleLogBuffer.length,
    returnedLogs: result.length,
    logs: result
  };
}

/**
 * TOOL: Chụp ảnh màn hình thời gian thực (hỗ trợ fullPage, selector)
 */
async function handleCaptureScreenshot(args) {
  const { browser, activePort } = await getConnectedBrowser(args?.port);
  const page = await resolveTargetPage(browser, args);

  let targetPath = args?.savePath;
  if (!targetPath) {
    const timestamp = Date.now();
    targetPath = path.join('C:\\Users\\game\\.gemini\\antigravity\\brain', `screenshot_cdp_${timestamp}.png`);
  }

  const parentDir = path.dirname(targetPath);
  if (!fs.existsSync(parentDir)) {
    fs.mkdirSync(parentDir, { recursive: true });
  }

  const fullPage = !!args?.fullPage;
  const selector = args?.selector;

  if (selector) {
    const el = await page.$(selector);
    if (!el) {
      throw new Error(`Không tìm thấy phần tử để chụp ảnh màn hình: "${selector}"`);
    }
    await el.screenshot({ path: targetPath });
  } else {
    await page.screenshot({ path: targetPath, fullPage });
  }

  return {
    success: true,
    connectedPort: activePort,
    pageTitle: await page.title(),
    pageUrl: page.url(),
    screenshotPath: targetPath,
    fullPage,
    message: `Đã chụp ảnh màn hình thành công lưu tại: ${targetPath}`
  };
}

/**
 * TOOL: Đọc trạng thái sâu (Dual-mode: Google Flow React Fiber hoặc Universal DOM State)
 */
async function handleInspectState(args) {
  const { browser, activePort } = await getConnectedBrowser(args?.port);
  const page = await resolveTargetPage(browser, { ...args, preferFlow: true });
  const appFrame = await findToolFrame(page);

  const pageInfo = {
    connectedPort: activePort,
    pageTitle: await page.title(),
    pageUrl: page.url(),
    hasToolFrame: !!appFrame,
    isGoogleFlow: page.url().includes('labs.google/fx'),
    scenes: [],
    assets: [],
    isStoppedOnError: false,
    hasResumeButton: false,
    visibleButtons: [],
    textareaSnippet: ''
  };

  // 1. Nếu là trang Google Flow có iframe công cụ
  if (appFrame) {
    const fiberData = await appFrame.evaluate(() => {
      let scenes = [];
      let assets = [];
      const elements = Array.from(document.querySelectorAll('*'));

      for (const el of elements) {
        const fiberKey = Object.keys(el).find(k => k.startsWith('__reactFiber$') || k.startsWith('__reactInternalInstance$'));
        if (fiberKey) {
          let fiber = el[fiberKey];
          while (fiber) {
            if (fiber.memoizedState) {
              let s = fiber.memoizedState;
              while (s) {
                if (Array.isArray(s.memoizedState) && s.memoizedState.length > 0) {
                  const arr = s.memoizedState;
                  if (arr[0] && arr[0].sceneId && scenes.length === 0) {
                    scenes = arr.map(i => ({
                      sceneId: i.sceneId,
                      status: i.status,
                      error: i.error || null,
                      mediaId: i.resultMediaId || null,
                      hasVideo: !!(i.videoUrl || i.url || i.mediaUrl || i.resultBase64)
                    }));
                  }
                  if (arr[0] && arr[0].logicalId && assets.length === 0) {
                    assets = arr.map(i => ({
                      id: i.id,
                      logicalId: i.logicalId,
                      type: i.type,
                      status: i.status,
                      error: i.error || null
                    }));
                  }
                }
                s = s.next;
              }
            }
            fiber = fiber.return;
          }
        }
        if (scenes.length > 0 && assets.length > 0) break;
      }

      const text = document.body ? document.body.innerText : '';
      const isStopped = text.includes('STOPPED ON ERROR') || text.includes('Rate limit exceeded');
      const btns = Array.from(document.querySelectorAll('button')).map(b => (b.innerText || '').trim()).filter(Boolean);
      const hasResume = btns.some(t => t.includes('RESUME AUTO PIPELINE'));
      const textarea = document.querySelector('textarea');

      return {
        scenes,
        assets,
        isStoppedOnError: isStopped,
        hasResumeButton: hasResume,
        visibleButtons: btns.slice(0, 15),
        textareaSnippet: textarea ? (textarea.value || '').slice(0, 300) : ''
      };
    });

    Object.assign(pageInfo, fiberData);
  } else {
    // 2. Chế độ Universal Web Page Inspection
    const generalData = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button, a[role="button"], input[type="submit"]'))
        .map(b => (b.innerText || b.value || b.getAttribute('aria-label') || '').trim())
        .filter(Boolean)
        .slice(0, 15);

      const inputs = Array.from(document.querySelectorAll('input, textarea'))
        .map(i => i.placeholder || i.name || i.id || i.type)
        .filter(Boolean)
        .slice(0, 10);

      const textarea = document.querySelector('textarea');

      return {
        visibleButtons: btns,
        visibleInputs: inputs,
        textareaSnippet: textarea ? (textarea.value || '').slice(0, 300) : ''
      };
    });

    Object.assign(pageInfo, generalData);
  }

  return {
    success: true,
    data: pageInfo
  };
}

// ════════════════════════════════════════════════════════════════════════════
// TRỤ CỘT 4: TỰ CHỮA LÀNH & KẾ THỪA (RESILIENCE & LEGACY)
// ════════════════════════════════════════════════════════════════════════════

/**
 * TOOL: Tự động kiểm tra và khởi động Chrome Remote Debugging (Zero-Manual-CLI)
 */
async function handleEnsureBrowser(args) {
  const port = args?.port || 9222;

  // 1. Kiểm tra xem port đã mở sẵn hay chưa
  try {
    const { browser, activePort } = await getConnectedBrowser(port);
    const pages = await browser.pages();
    return {
      success: true,
      status: 'ALREADY_RUNNING',
      connectedPort: activePort,
      openTabsCount: pages.length,
      message: `Chrome Remote Debugging tại cổng ${activePort} đang hoạt động sẵn sàng (${pages.length} tabs).`
    };
  } catch (e) {
    // Port chưa mở, kích hoạt tự động qua cdp_auto_launcher.py
  }

  const launcherScript = 'C:\\Users\\game\\.gemini\\config\\scripts\\cdp_auto_launcher.py';
  if (!fs.existsSync(launcherScript)) {
    throw new Error(`Không tìm thấy script auto launcher tại: ${launcherScript}`);
  }

  try {
    const pythonCmd = `python "${launcherScript}" --port ${port} --ensure`;
    execSync(pythonCmd, { encoding: 'utf8', timeout: 15000 });

    // Đợi 2s để socket ổn định
    await new Promise(r => setTimeout(r, 2000));

    const { browser, activePort } = await getConnectedBrowser(port);
    const pages = await browser.pages();

    return {
      success: true,
      status: 'AUTONOMOUSLY_LAUNCHED',
      connectedPort: activePort,
      openTabsCount: pages.length,
      message: `Đã tự động khởi động Google Chrome Remote Debugging thành công tại cổng ${activePort}!`
    };
  } catch (launchErr) {
    throw new Error(`Không thể tự động kích hoạt Chrome: ${launchErr.message}`);
  }
}

/**
 * TOOL: Tương thích ngược cdp_click_button (ủy quyền sang handleClick)
 */
async function handleClickButton(args) {
  return await handleClick({
    port: args?.port,
    text: args?.buttonText
  });
}

/**
 * TOOL: Dán kịch bản và kích hoạt render trên Google Flow
 */
async function handleInjectAndRender(args) {
  const port = args?.port || 9222;
  const scriptPackage = args?.scriptPackage;

  if (!scriptPackage) {
    throw new Error('Tham số scriptPackage (JSON kịch bản) là bắt buộc!');
  }

  const { browser, activePort } = await getConnectedBrowser(port);
  const flowPage = await resolveTargetPage(browser, { preferFlow: true });
  let appFrame = await findToolFrame(flowPage);

  if (!appFrame) {
    await flowPage.evaluate(() => {
      const all = Array.from(document.querySelectorAll('*'));
      const batchBtn = all.find(e => e.innerText && e.innerText.trim().toLowerCase() === 'batch video final' && e.offsetParent !== null);
      if (batchBtn) batchBtn.click();
    });
    await new Promise(r => setTimeout(r, 2000));
    appFrame = await findToolFrame(flowPage);
  }

  if (!appFrame) {
    throw new Error('Không tìm thấy iframe công cụ "batch video final" trên trang Google Flow!');
  }

  // 0. Reset state
  await appFrame.evaluate(() => {
    try {
      window.dispatchEvent(new CustomEvent('AUTOPILOT_CLEAR_ALL_STATE'));
    } catch (e) {}
    const textarea = document.querySelector('textarea');
    if (textarea) {
      textarea.value = '';
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
    }
  });
  await new Promise(r => setTimeout(r, 200));

  // 1. Paste JSON
  const pasted = await appFrame.evaluate((jsonStr) => {
    try {
      window.dispatchEvent(new CustomEvent('AUTOPILOT_INJECT_PAYLOAD', { detail: JSON.parse(jsonStr) }));
    } catch (e) {}
    const textarea = document.querySelector('textarea');
    if (!textarea) return false;
    const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')?.set;
    if (nativeSetter) {
      nativeSetter.call(textarea, jsonStr);
    } else {
      textarea.value = jsonStr;
    }
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
    textarea.dispatchEvent(new Event('change', { bubbles: true }));
    textarea.dispatchEvent(new Event('blur', { bubbles: true }));
    return true;
  }, JSON.stringify(scriptPackage, null, 2));

  if (!pasted) {
    throw new Error('Không tìm thấy textarea nhập liệu JSON trong batch video final');
  }

  await new Promise(r => setTimeout(r, 1000));

  // 2. Click AUTO button
  const clickedAuto = await appFrame.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const autoBtn = btns.find(b => b.innerText && b.innerText.trim() === 'AUTO');
    if (autoBtn && !autoBtn.disabled) {
      autoBtn.click();
      return true;
    }
    return false;
  });

  await new Promise(r => setTimeout(r, 1000));

  // 3. Enable Download
  const enabledDownload = await appFrame.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const dlBtn = btns.find(b => b.innerText && (b.innerText.includes('DISABLED') || b.innerText.includes('TỰ ĐỘNG TẢI XUỐNG')));
    if (dlBtn && dlBtn.innerText.includes('DISABLED')) {
      dlBtn.click();
      return true;
    }
    return false;
  });

  return {
    success: true,
    connectedPort: activePort,
    pastedJson: true,
    clickedAuto,
    enabledDownload,
    message: `Đã nạp kịch bản "${scriptPackage.title || 'Untitled'}" (${scriptPackage.scenes?.length || 0} Scenes) và kích hoạt chế độ AUTO thành công!`
  };
}

/**
 * TOOL: Thực thi JavaScript tùy biến trong trang
 */
async function handleEvaluateScript(args) {
  const { browser, activePort } = await getConnectedBrowser(args?.port);
  const page = await resolveTargetPage(browser, args);
  const script = args?.script;
  const targetFrame = args?.targetFrame || 'tool';

  if (!script) {
    throw new Error('Tham số script (mã JavaScript) là bắt buộc!');
  }

  const appFrame = await findToolFrame(page);
  let result;

  if (targetFrame === 'tool' && appFrame) {
    result = await appFrame.evaluate(new Function(script));
  } else {
    result = await page.evaluate(new Function(script));
  }

  return {
    success: true,
    connectedPort: activePort,
    frame: targetFrame,
    result: result !== undefined ? result : null
  };
}

/**
 * TOOL: Trích xuất bản đồ cú pháp AST Codebase (Aider-style)
 */
async function handleGetAstRepoMap(args) {
  const defaultRoot = path.resolve(__dirname, '..');
  const targetDir = args?.targetDir || defaultRoot;
  const maxDepth = args?.maxDepth || 4;
  const includeSignatures = args?.includeSignatures !== false;

  const result = generateRepoMap(targetDir, { maxDepth, includeSignatures });
  return {
    success: true,
    targetDir,
    fileCount: result.fileCount,
    symbolCount: result.symbolCount,
    repoMapMarkdown: result.raw
  };
}

/**
 * TOOL: Tìm kiếm symbol mã nguồn
 */
async function handleSearchCodeSymbols(args) {
  const defaultRoot = path.resolve(__dirname, '..');
  const targetDir = args?.targetDir || defaultRoot;
  const query = args?.query;

  if (!query) {
    throw new Error('Tham số query (tên class, hàm, interface cần tìm) là bắt buộc!');
  }

  const matches = findSymbolInRepo(targetDir, query);
  return {
    success: true,
    query,
    targetDir,
    matchCount: matches.length,
    matches: matches.slice(0, 50)
  };
}

/**
 * TOOL: Gửi thông báo Telegram
 */
async function handleSendTelegramNotification(args) {
  const message = args?.message;
  const title = args?.title || 'THÔNG BÁO TỪ ANTIGRAVITY';
  const photoPath = args?.photoPath || null;

  if (!message) {
    throw new Error('Tham số message (nội dung thông báo) là bắt buộc!');
  }

  const notifierPath = 'c:\\Users\\game\\Documents\\app\\script factory final\\telegram_bridge\\telegram_notifier.cjs';
  if (!fs.existsSync(notifierPath)) {
    throw new Error(`Không tìm thấy module telegram_notifier.cjs tại: ${notifierPath}`);
  }

  const { sendTelegramAlert } = require(notifierPath);
  const res = await sendTelegramAlert({ title, message, photoPath });

  return {
    success: true,
    sentTo: 'Telegram Mobile',
    title,
    message,
    hasPhoto: !!photoPath,
    telegramResponse: res
  };
}

// ════════════════════════════════════════════════════════════════════════════
// MCP DEFINITIONS & DISPATCHER (18 TOOLS)
// ════════════════════════════════════════════════════════════════════════════

const TOOLS = [
  // Nhóm 1: Quản lý Tab & Điều Hướng
  {
    name: "cdp_list_tabs",
    description: "Liệt kê toàn bộ các Tab đang mở trong Chrome kèm ID, vị trí index, tiêu đề, URL và trạng thái active.",
    inputSchema: {
      type: "object",
      properties: {
        port: { type: "number", description: "Port Chrome Remote Debugging (mặc định: 9222)" }
      }
    }
  },
  {
    name: "cdp_switch_tab",
    description: "Chuyển target điều khiển sang tab mong muốn bằng tabIndex, tabId, hoặc chuỗi urlPattern / titlePattern (ví dụ: 'chatgpt', 'exness', 'localhost').",
    inputSchema: {
      type: "object",
      properties: {
        tabIndex: { type: "number", description: "Số thứ tự index của tab (0, 1, 2...)" },
        tabId: { type: "string", description: "ID mục tiêu của tab (targetId)" },
        urlPattern: { type: "string", description: "Chuỗi tìm kiếm trong URL tab" },
        titlePattern: { type: "string", description: "Chuỗi tìm kiếm trong tiêu đề tab" },
        bringToFront: { type: "boolean", description: "Có đưa tab lên trước màn hình hay không (mặc định: true)" },
        port: { type: "number", description: "Port Chrome Remote Debugging (mặc định: 9222)" }
      }
    }
  },
  {
    name: "cdp_new_tab",
    description: "Mở một tab mới trên Chrome với URL chỉ định.",
    inputSchema: {
      type: "object",
      properties: {
        url: { type: "string", description: "Địa chỉ web cần mở (mặc định: about:blank)" },
        waitUntil: { type: "string", enum: ["load", "domcontentloaded", "networkidle0", "networkidle2"], description: "Thời điểm coi là tải xong" },
        timeoutMs: { type: "number", description: "Thời gian chờ tối đa mili-giây (mặc định: 30000)" },
        port: { type: "number", description: "Port Chrome Remote Debugging (mặc định: 9222)" }
      }
    }
  },
  {
    name: "cdp_close_tab",
    description: "Đóng tab được chỉ định hoặc tab hiện tại đang active.",
    inputSchema: {
      type: "object",
      properties: {
        tabIndex: { type: "number", description: "Index tab cần đóng" },
        tabId: { type: "string", description: "ID tab cần đóng" },
        urlPattern: { type: "string", description: "URL pattern của tab cần đóng" },
        port: { type: "number", description: "Port Chrome Remote Debugging (mặc định: 9222)" }
      }
    }
  },
  {
    name: "cdp_navigate",
    description: "Điều hướng tab hiện tại đến một URL mới, hoặc thực hiện tải lại trang (reload), quay lại (back), tiến lên (forward).",
    inputSchema: {
      type: "object",
      properties: {
        action: { type: "string", enum: ["goto", "reload", "back", "forward"], description: "Hành động điều hướng (mặc định: goto)" },
        url: { type: "string", description: "URL đích nếu action='goto'" },
        waitUntil: { type: "string", enum: ["load", "domcontentloaded", "networkidle0", "networkidle2"], description: "Thời điểm hoàn tất" },
        timeoutMs: { type: "number", description: "Thời gian chờ tối đa mili-giây (mặc định: 45000)" },
        port: { type: "number", description: "Port Chrome Remote Debugging (mặc định: 9222)" }
      }
    }
  },

  // Nhóm 2: Tương tác Chuẩn xác
  {
    name: "cdp_click",
    description: "Click chuột siêu chuẩn xác vào bất kỳ phần tử nào trên trang theo CSS Selector, XPath, Text hiển thị hoặc Tọa độ {x, y}. Hỗ trợ Double Click, Right Click và Hover.",
    inputSchema: {
      type: "object",
      properties: {
        selector: { type: "string", description: "CSS selector của phần tử (ví dụ: '#btn-submit', 'button.action-btn')" },
        text: { type: "string", description: "Chuỗi text hiển thị trên phần tử cần click" },
        xpath: { type: "string", description: "Đường dẫn XPath của phần tử" },
        coordinates: {
          type: "object",
          properties: {
            x: { type: "number", description: "Tọa độ X tính bằng pixel" },
            y: { type: "number", description: "Tọa độ Y tính bằng pixel" }
          },
          required: ["x", "y"],
          description: "Click trực tiếp theo tọa độ điểm ảnh"
        },
        button: { type: "string", enum: ["left", "right", "middle"], description: "Nút chuột (mặc định: left)" },
        clickCount: { type: "number", description: "Số lần click (1: click đơn, 2: double click)" },
        hoverOnly: { type: "boolean", description: "Chỉ rê chuột vào phần tử chứ không bấm" },
        port: { type: "number", description: "Port Chrome Remote Debugging (mặc định: 9222)" }
      }
    }
  },
  {
    name: "cdp_type_text",
    description: "Gõ văn bản vào ô nhập liệu, textarea, hoặc các trình soạn thảo phức tạp (ProseMirror, Lexical, ChatGPT prompt, Monaco Editor, React State) qua lệnh CDP native Input.insertText.",
    inputSchema: {
      type: "object",
      properties: {
        text: { type: "string", description: "Nội dung văn bản cần nhập" },
        selector: { type: "string", description: "CSS selector của trường nhập (nếu để trống sẽ nhập vào phần tử đang focus)" },
        clearBefore: { type: "boolean", description: "Xóa sạch nội dung cũ trước khi nhập (mặc định: true)" },
        mode: { type: "string", enum: ["insertText", "type"], description: "Chế độ nhập: 'insertText' (CDP native, hoạt động tốt trên mọi framework) hoặc 'type' (mô phỏng phím bấm)" },
        keyDelay: { type: "number", description: "Độ trễ giữa các phím nếu dùng mode='type'" },
        port: { type: "number", description: "Port Chrome Remote Debugging (mặc định: 9222)" }
      },
      required: ["text"]
    }
  },
  {
    name: "cdp_press_key",
    description: "Nhấn các phím đặc biệt (Enter, Tab, Escape, Backspace, ArrowDown, ArrowUp, Delete...) hoặc tổ hợp phím tắt (Ctrl+A, Ctrl+V...).",
    inputSchema: {
      type: "object",
      properties: {
        key: { type: "string", description: "Tên phím cần bấm (ví dụ: 'Enter', 'Tab', 'Escape', 'Backspace')" },
        modifiers: {
          type: "array",
          items: { type: "string" },
          description: "Danh sách phím bổ trợ, ví dụ: ['Control'] hoặc ['Control', 'Shift']"
        },
        port: { type: "number", description: "Port Chrome Remote Debugging (mặc định: 9222)" }
      },
      required: ["key"]
    }
  },
  {
    name: "cdp_scroll",
    description: "Cuộn trang web theo khoảng cách pixel, cuộn lên đầu trang, xuống cuối trang, hoặc cuộn một phần tử vào tầm nhìn (scrollIntoView).",
    inputSchema: {
      type: "object",
      properties: {
        selector: { type: "string", description: "CSS selector của phần tử cần cuộn tới" },
        position: { type: "string", enum: ["top", "bottom"], description: "Cuộn nhanh lên đỉnh ('top') hoặc xuống đáy trang ('bottom')" },
        deltaY: { type: "number", description: "Khoảng cách cuộn theo trục Y (dương: xuống dưới, âm: lên trên)" },
        deltaX: { type: "number", description: "Khoảng cách cuộn theo trục X" },
        port: { type: "number", description: "Port Chrome Remote Debugging (mặc định: 9222)" }
      }
    }
  },
  {
    name: "cdp_wait_for",
    description: "Chờ đợi thông minh: chờ selector xuất hiện hoặc ẩn đi, chờ một chuỗi văn bản xuất hiện trong trang, hoặc chờ thời gian tĩnh.",
    inputSchema: {
      type: "object",
      properties: {
        selector: { type: "string", description: "CSS selector cần chờ" },
        state: { type: "string", enum: ["visible", "hidden"], description: "Trạng thái cần chờ (mặc định: visible)" },
        text: { type: "string", description: "Chuỗi văn bản cần chờ xuất hiện trên trang" },
        timeoutMs: { type: "number", description: "Thời gian chờ tối đa mili-giây (mặc định: 15000)" },
        delayMs: { type: "number", description: "Chờ tĩnh số mili-giây nếu không dùng selector/text" },
        port: { type: "number", description: "Port Chrome Remote Debugging (mặc định: 9222)" }
      }
    }
  },
  {
    name: "cdp_upload_file",
    description: "Chọn và tải file từ ổ cứng máy tính nạp vào thẻ <input type='file'>.",
    inputSchema: {
      type: "object",
      properties: {
        filePath: { type: "string", description: "Đường dẫn file tuyệt đối trên máy tính cần upload" },
        selector: { type: "string", description: "CSS selector của input file (mặc định: 'input[type=\"file\"]')" },
        port: { type: "number", description: "Port Chrome Remote Debugging (mặc định: 9222)" }
      },
      required: ["filePath"]
    }
  },

  // Nhóm 3: Quan sát & Thị giác DOM
  {
    name: "cdp_extract_page_content",
    description: "Mắt thần quan sát trang web: Trích xuất bản đồ các phần tử tương tác (Interactive Elements Map gồm buttons, inputs, links kèm selector CSS duy nhất), hoặc trích xuất văn bản/markdown của trang.",
    inputSchema: {
      type: "object",
      properties: {
        mode: { type: "string", enum: ["interactive", "text", "markdown"], description: "Chế độ trích xuất (mặc định: interactive)" },
        maxElements: { type: "number", description: "Số lượng phần tử tối đa cần lấy trong mode interactive (mặc định: 60)" },
        port: { type: "number", description: "Port Chrome Remote Debugging (mặc định: 9222)" }
      }
    }
  },
  {
    name: "cdp_get_console_logs",
    description: "Đọc lịch sử log trình duyệt (console.log, console.warn, console.error) và unhandled exceptions từ các trang web để gỡ lỗi và kiểm thử frontend.",
    inputSchema: {
      type: "object",
      properties: {
        type: { type: "string", enum: ["error", "warn", "log"], description: "Lọc theo loại log" },
        limit: { type: "number", description: "Số lượng log tối đa cần lấy (mặc định: 50)" },
        port: { type: "number", description: "Port Chrome Remote Debugging (mặc định: 9222)" }
      }
    }
  },
  {
    name: "cdp_capture_screenshot",
    description: "Chụp ảnh màn hình Chrome thực tế và lưu vào file để Agent/Anh xem trực tiếp bằng chứng giao diện (hỗ trợ fullPage hoặc chụp riêng một element).",
    inputSchema: {
      type: "object",
      properties: {
        savePath: { type: "string", description: "Đường dẫn file PNG tùy chọn (mặc định: brain/artifacts)" },
        fullPage: { type: "boolean", description: "Chụp toàn bộ chiều dài trang cuộn (mặc định: false)" },
        selector: { type: "string", description: "CSS selector để chụp riêng một phần tử duy nhất" },
        port: { type: "number", description: "Port Chrome Remote Debugging (mặc định: 9222)" }
      }
    }
  },
  {
    name: "cdp_inspect_state",
    description: "Đọc trạng thái thời gian thực sâu: Nếu là Google Flow thì đọc cấu trúc React Fiber Scenes/Assets/Lỗi Rate Limit; nếu là web thông thường thì đọc tổng quan DOM, Form fields và Buttons.",
    inputSchema: {
      type: "object",
      properties: {
        port: { type: "number", description: "Port Chrome Remote Debugging (mặc định: 9222)" }
      }
    }
  },

  // Nhóm 4: Tự Chữa Lành & Kế Thừa
  {
    name: "cdp_ensure_browser",
    description: "Tự động kiểm tra trạng thái Chrome Remote Debugging (port 9222/9223). Nếu chưa bật, tự động kích hoạt Chrome Debug ngầm một cách độc lập (Zero-Manual-CLI).",
    inputSchema: {
      type: "object",
      properties: {
        port: { type: "number", description: "Port Chrome Remote Debugging mong muốn (mặc định: 9222)" }
      }
    }
  },
  {
    name: "cdp_click_button",
    description: "Tương thích ngược: Bấm một nút theo chuỗi text hiển thị (ủy quyền sang cdp_click).",
    inputSchema: {
      type: "object",
      properties: {
        buttonText: { type: "string", description: "Đoạn text của nút cần bấm" },
        port: { type: "number", description: "Port Chrome Remote Debugging (mặc định: 9222)" }
      },
      required: ["buttonText"]
    }
  },
  {
    name: "cdp_inject_and_render",
    description: "Dán kịch bản JSON 2.0 vào công cụ batch video final của Google Flow, tự động kích hoạt chế độ AUTO và bật tự động tải xuống video.",
    inputSchema: {
      type: "object",
      properties: {
        scriptPackage: { type: "object", description: "Đối tượng JSON Screenplay chuẩn 2.0 đầy đủ các Scenes, Prompts và Style" },
        port: { type: "number", description: "Port Chrome Remote Debugging (mặc định: 9222)" }
      },
      required: ["scriptPackage"]
    }
  },
  {
    name: "cdp_evaluate_script",
    description: "Thực thi đoạn mã JavaScript tùy biến trực tiếp trong tab Chrome hiện tại hoặc trong iframe công cụ about:srcdoc.",
    inputSchema: {
      type: "object",
      properties: {
        script: { type: "string", description: "Chuỗi mã JavaScript cần thực thi (phải có return nếu muốn nhận kết quả)" },
        targetFrame: { type: "string", enum: ["tool", "main"], description: "Chọn thực thi trong frame công cụ ('tool') hay tab chính ('main')" },
        port: { type: "number", description: "Port Chrome Remote Debugging (mặc định: 9222)" }
      },
      required: ["script"]
    }
  },
  {
    name: "get_ast_repo_map",
    description: "Bản đồ kiến trúc nén AST (Aider-style): Quét toàn bộ Class, Interface, Function signatures và API routes của dự án giúp Agent hiểu rõ toàn bộ codebase mà không bị tràn context.",
    inputSchema: {
      type: "object",
      properties: {
        targetDir: { type: "string", description: "Đường dẫn thư mục dự án cần quét (mặc định: thư mục gốc hệ sinh thái)" },
        maxDepth: { type: "number", description: "Độ sâu quét thư mục (mặc định: 4)" },
        includeSignatures: { type: "boolean", description: "Có bao gồm chi tiết chữ ký hàm/class hay không (mặc định: true)" }
      }
    }
  },
  {
    name: "search_code_symbols",
    description: "Truy tìm nhanh vị trí định nghĩa của bất kỳ Hàm, Class, Interface, Type hoặc Route nào trong toàn bộ dự án kèm số dòng và chữ ký kiểu dữ liệu.",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Tên hàm, class, interface hoặc route cần tìm (ví dụ: 'stitchVideoClips', 'handleCopilotChat', 'VideoOrchestrator')" },
        targetDir: { type: "string", description: "Thư mục cần tìm kiếm (mặc định: hệ sinh thái SCRIPT_FACTORY_PRO_ECOSYSTEM)" }
      },
      required: ["query"]
    }
  },
  {
    name: "send_telegram_notification",
    description: "Gửi thông báo tức thì, báo cáo nghiệm thu hoặc ảnh chụp màn hình sang điện thoại của Anh qua Telegram.",
    inputSchema: {
      type: "object",
      properties: {
        message: { type: "string", description: "Nội dung tin nhắn thông báo cần gửi về điện thoại" },
        title: { type: "string", description: "Tiêu đề thông báo (ví dụ: 'RENDER HOÀN TẤT', 'TASK COMPLETE')" },
        photoPath: { type: "string", description: "Đường dẫn file ảnh PNG/JPG đính kèm nếu muốn gửi ảnh" }
      },
      required: ["message"]
    }
  }
];

async function handleToolCall(name, args) {
  switch (name) {
    // Nhóm 1: Tab & Điều Hướng
    case "cdp_list_tabs":
      return await handleListTabs(args);
    case "cdp_switch_tab":
      return await handleSwitchTab(args);
    case "cdp_new_tab":
      return await handleNewTab(args);
    case "cdp_close_tab":
      return await handleCloseTab(args);
    case "cdp_navigate":
      return await handleNavigate(args);

    // Nhóm 2: Tương Tác Chuẩn Xác
    case "cdp_click":
      return await handleClick(args);
    case "cdp_type_text":
      return await handleTypeText(args);
    case "cdp_press_key":
      return await handlePressKey(args);
    case "cdp_scroll":
      return await handleScroll(args);
    case "cdp_wait_for":
      return await handleWaitFor(args);
    case "cdp_upload_file":
      return await handleUploadFile(args);

    // Nhóm 3: Quan Sát & Thị Giác DOM
    case "cdp_extract_page_content":
      return await handleExtractPageContent(args);
    case "cdp_get_console_logs":
      return await handleGetConsoleLogs(args);
    case "cdp_capture_screenshot":
      return await handleCaptureScreenshot(args);
    case "cdp_inspect_state":
      return await handleInspectState(args);

    // Nhóm 4: Tự Chữa Lành & Kế Thừa
    case "cdp_ensure_browser":
      return await handleEnsureBrowser(args);
    case "cdp_click_button":
      return await handleClickButton(args);
    case "cdp_inject_and_render":
      return await handleInjectAndRender(args);
    case "cdp_evaluate_script":
      return await handleEvaluateScript(args);
    case "get_ast_repo_map":
      return await handleGetAstRepoMap(args);
    case "search_code_symbols":
      return await handleSearchCodeSymbols(args);
    case "send_telegram_notification":
      return await handleSendTelegramNotification(args);

    default:
      throw new Error(`Tool không tồn tại: ${name}`);
  }
}

// ════════════════════════════════════════════════════════════════════════════
// JSON-RPC 2.0 STDIO TRANSPORT
// ════════════════════════════════════════════════════════════════════════════

function sendJsonRpcResponse(id, result, error = null) {
  const response = {
    jsonrpc: "2.0",
    id: id
  };
  if (error) {
    response.error = error;
  } else {
    response.result = result;
  }
  const str = JSON.stringify(response);
  process.stdout.write(str + "\n");
}

const rl = readline.createInterface({
  input: process.stdin,
  terminal: false
});

rl.on('line', async (line) => {
  const trimmed = line.trim();
  if (!trimmed) return;

  let request;
  try {
    request = JSON.parse(trimmed);
  } catch (e) {
    sendJsonRpcResponse(null, null, { code: -32700, message: "Parse error" });
    return;
  }

  const { id, method, params } = request;

  // Handle Notifications (no ID)
  if (id === undefined || id === null) {
    if (method === "notifications/initialized") {
      // Client ready
    }
    return;
  }

  try {
    switch (method) {
      case "initialize":
        sendJsonRpcResponse(id, {
          protocolVersion: "2024-11-05",
          capabilities: {
            tools: {}
          },
          serverInfo: {
            name: "cdp-enterprise-super-engine",
            version: "2.0.0"
          }
        });
        break;

      case "ping":
        sendJsonRpcResponse(id, {});
        break;

      case "tools/list":
        sendJsonRpcResponse(id, {
          tools: TOOLS
        });
        break;

      case "tools/call": {
        const toolName = params?.name;
        const toolArgs = params?.arguments || {};
        try {
          const result = await handleToolCall(toolName, toolArgs);
          sendJsonRpcResponse(id, {
            content: [
              {
                type: "text",
                text: JSON.stringify(result, null, 2)
              }
            ]
          });
        } catch (callErr) {
          sendJsonRpcResponse(id, {
            isError: true,
            content: [
              {
                type: "text",
                text: `[CDP MCP Error] ${callErr.message}`
              }
            ]
          });
        }
        break;
      }

      default:
        sendJsonRpcResponse(id, null, {
          code: -32601,
          message: `Method '${method}' not found`
        });
    }
  } catch (globalErr) {
    sendJsonRpcResponse(id, null, {
      code: -32603,
      message: globalErr.message
    });
  }
});

process.stderr.write("[CDP MCP Server v2.0] Started and listening on stdio JSON-RPC 2.0 (22 Enterprise Tools Ready)\n");
