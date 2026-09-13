let puppeteer;
try {
  puppeteer = require('puppeteer-core');
} catch (e) {
  console.error('Error: puppeteer-core not found.');
  console.error('Please install puppeteer-core: npm install puppeteer-core');
  process.exit(1);
}

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Port from CLI argument or environment variable, defaulting to 9222
const port = process.argv[2] || process.env.CDP_PORT || '9222';
const baseDir = __dirname;
const screenshotsDir = path.join(baseDir, 'screenshots');
if (!fs.existsSync(screenshotsDir)) fs.mkdirSync(screenshotsDir, { recursive: true });

function getSha256(filePath) {
  if (!fs.existsSync(filePath)) return null;
  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

// Relative Luminance & Contrast Formula WCAG 2.1
function getLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function getContrast(rgb1, rgb2) {
  const l1 = getLuminance(rgb1[0], rgb1[1], rgb1[2]);
  const l2 = getLuminance(rgb2[0], rgb2[1], rgb2[2]);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function parseRgb(colorStr) {
  if (!colorStr) return [0, 0, 0];
  const m = colorStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!m) return [0, 0, 0];
  return [parseInt(m[1]), parseInt(m[2]), parseInt(m[3])];
}

// Normalize message strings by stripping semantic feedback glyphs and whitespace
function normalizeMsg(str) {
  if (!str) return "";
  return str.replace(/[\u26A0\uFE0F\u23F3\u2713\u2192\u2190]/g, '').replace(/\s+/g, ' ').trim();
}

// Independent Canonical Fixture (Source of Truth - Section 4)
const CANONICAL_FIXTURE = [
  { id: "T01", name: "Hạ Long 2N1Đ", depart: "14/09/2026 07:30", owner: "Lan", status: "Chờ đối tác", notes: "Khách sạn chưa xác nhận 4 phòng", groupAction: true, group48h: true, priority: true },
  { id: "T02", name: "Ninh Bình 1 ngày", depart: "14/09/2026 06:00", owner: "Minh", status: "Sẵn sàng", notes: "Đã đủ xe, hướng dẫn viên và danh sách khách", groupAction: false, group48h: true, priority: false },
  { id: "T03", name: "Sapa 3N2Đ", depart: "15/09/2026 21:30", owner: "Huy", status: "Thiếu hồ sơ", notes: "2 khách chưa gửi CCCD", groupAction: true, group48h: false, priority: false },
  { id: "T04", name: "Đà Nẵng 4N3Đ", depart: "16/09/2026 08:00", owner: "Lan", status: "Đang chuẩn bị", notes: "Chờ chốt danh sách suất ăn", groupAction: false, group48h: false, priority: false },
  { id: "T05", name: "Hà Giang 3N2Đ", depart: "17/09/2026 05:30", owner: "Minh", status: "Sẵn sàng", notes: "Đã hoàn tất checklist khởi hành", groupAction: false, group48h: false, priority: false },
  { id: "T06", name: "Phú Quốc 3N2Đ", depart: "18/09/2026 09:10", owner: "Huy", status: "Chờ đối tác", notes: "Nhà xe trung chuyển chưa xác nhận", groupAction: true, group48h: false, priority: false },
  { id: "T07", name: "Mộc Châu 2N1Đ", depart: "19/09/2026 06:30", owner: "Lan", status: "Đang chuẩn bị", notes: "Đang rà soát danh sách phòng", groupAction: false, group48h: false, priority: false },
  { id: "T08", name: "Huế 3N2Đ", depart: "12/09/2026 07:00", owner: "An", status: "Hoàn thành", notes: "Đoàn đã khởi hành và bàn giao nhật ký", groupAction: false, group48h: false, priority: false }
];

async function runTests() {
  console.log('=== STARTING MODULE 007 VERIFICATION SUITE (REV 004 FINAL - FULL EVIDENCE INTEGRITY) ===');
  console.log(`Connecting to Chrome CDP at port: ${port}`);
  
  const browser = await puppeteer.connect({ browserURL: `http://127.0.0.1:${port}` });
  const page = await browser.newPage();

  const baselinePath = 'file:///' + path.join(baseDir, 'baseline', 'index.html').replace(/\\/g, '/');
  const preCritiquePath = 'file:///' + path.join(baseDir, 'candidate', 'pre_critique.html').replace(/\\/g, '/');
  const candidatePath = 'file:///' + path.join(baseDir, 'candidate', 'index.html').replace(/\\/g, '/');
  const directionAPath = 'file:///' + path.join(baseDir, 'directions', 'option_a.html').replace(/\\/g, '/');
  const directionBPath = 'file:///' + path.join(baseDir, 'directions', 'option_b.html').replace(/\\/g, '/');

  const baselineHash = getSha256(path.join(baseDir, 'baseline', 'index.html'));
  const preCritiqueHash = getSha256(path.join(baseDir, 'candidate', 'pre_critique.html'));
  const candidateHash = getSha256(path.join(baseDir, 'candidate', 'index.html'));

  console.log('[HASHES]');
  console.log(`  Baseline: ${baselineHash}`);
  console.log(`  Pre-Critique: ${preCritiqueHash}`);
  console.log(`  Candidate Final: ${candidateHash}`);

  // Test Engine Helper to run core scenarios on an arbitrary page
  async function testPageCore(targetUrl, isCandidate = false) {
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
    await page.goto(targetUrl, { waitUntil: 'load' });

    // T01: Initial Data Integrity & Deep Tuple Inspection
    const t01 = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('.tour-card, .ledger-item'));
      const text = document.body.innerText;
      const source = typeof CANONICAL_TOURS !== 'undefined' ? CANONICAL_TOURS : null;
      const tours = source ? source.map(t => ({
        id: t.id,
        name: t.name,
        depart: t.depart,
        owner: t.owner,
        status: t.status,
        notes: t.notes,
        groupAction: t.groupAction,
        group48h: t.group48h,
        priority: t.priority
      })) : [];
      return {
        count: items.length,
        hasT08: text.includes("T08") && text.includes("Huế"),
        hasT01: text.includes("T01") && text.includes("Hạ Long"),
        allPresent: ["T01", "T02", "T03", "T04", "T05", "T06", "T07", "T08"].every(id => text.includes(id)),
        deepTuples: tours
      };
    });

    // Deep equality check for T01 against CANONICAL_FIXTURE
    const t01_deepEqual = t01.deepTuples.length === 8 && t01.deepTuples.every((t, i) => {
      const f = CANONICAL_FIXTURE[i];
      return t.id === f.id &&
             t.name === f.name &&
             t.depart === f.depart &&
             t.owner === f.owner &&
             t.status === f.status &&
             t.notes === f.notes &&
             t.groupAction === f.groupAction &&
             t.group48h === f.group48h &&
             t.priority === f.priority;
    });

    // T02: Vietnamese Search "KHACH SAN" (unaccented uppercase) -> matches T01
    const searchSel = isCandidate ? '#input-tour-search' : '#search-input';
    await page.focus(searchSel);
    await page.evaluate((sel) => { document.querySelector(sel).value = ""; }, searchSel);
    await page.type(searchSel, "KHACH SAN");
    await new Promise(r => setTimeout(r, 200));

    const t02 = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('.tour-card, .ledger-item'));
      const text = document.body.innerText;
      const ids = items.map(el => {
        const idEl = el.querySelector('.tour-id, .t-col-id');
        return idEl ? idEl.innerText.trim() : '';
      });
      return {
        matchedCount: items.length,
        hasT01: text.includes("T01") && text.includes("Hạ Long"),
        matchedIds: ids
      };
    });

    // Reset search
    await page.evaluate((searchSel) => {
      document.querySelector(searchSel).value = "";
      document.querySelector(searchSel).dispatchEvent(new Event('input'));
    }, searchSel);
    await new Promise(r => setTimeout(r, 150));

    // =========================================================================
    // T03: LOCKED FILTER INTERSECTION SEQUENCE (DIRECTIVE SECTION 4.1 & 12)
    // 1. Cần xử lý -> T01, T03, T06
    // 2. + owner Huy -> T03, T06
    // 3. + query "nha xe" -> T06
    // =========================================================================
    const actionBtnSel = isCandidate ? 'button[data-workflow="action"]' : 'button[data-group="action"]';
    const ownerSelectSel = isCandidate ? '#select-tour-owner' : '#select-owner';
    const timeSelectSel = isCandidate ? '#select-tour-time' : '#select-time';

    // Step 1: Click "Cần xử lý"
    await page.click(actionBtnSel);
    await new Promise(r => setTimeout(r, 200));
    const t03_locked_step1 = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('.tour-card, .ledger-item'));
      const ids = items.map(el => el.querySelector('.tour-id, .t-col-id').innerText.trim());
      return { count: items.length, ids };
    });

    // Step 2: Combine with owner "Huy"
    await page.select(ownerSelectSel, 'Huy');
    await new Promise(r => setTimeout(r, 200));
    const t03_locked_step2 = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('.tour-card, .ledger-item'));
      const ids = items.map(el => el.querySelector('.tour-id, .t-col-id').innerText.trim());
      return { count: items.length, ids };
    });

    // Step 3: Add query "nha xe"
    await page.focus(searchSel);
    await page.type(searchSel, "nha xe");
    await new Promise(r => setTimeout(r, 200));
    const t03_locked_step3 = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('.tour-card, .ledger-item'));
      const ids = items.map(el => el.querySelector('.tour-id, .t-col-id').innerText.trim());
      return { count: items.length, ids };
    });

    // Supplemental: Check individual workflow tabs (prep, ready, done)
    await page.evaluate((searchSel, ownerSelectSel) => {
      document.querySelector(searchSel).value = "";
      document.querySelector(searchSel).dispatchEvent(new Event('input'));
      document.querySelector(ownerSelectSel).value = "all";
      document.querySelector(ownerSelectSel).dispatchEvent(new Event('change'));
    }, searchSel, ownerSelectSel);
    await new Promise(r => setTimeout(r, 150));

    const prepBtnSel = isCandidate ? 'button[data-workflow="prep"]' : 'button[data-group="prep"]';
    await page.click(prepBtnSel);
    await new Promise(r => setTimeout(r, 150));
    const t03_supp_prep = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('.tour-card, .ledger-item'));
      return { count: items.length, ids: items.map(el => el.querySelector('.tour-id, .t-col-id').innerText.trim()) };
    });

    const readyBtnSel = isCandidate ? 'button[data-workflow="ready"]' : 'button[data-group="ready"]';
    await page.click(readyBtnSel);
    await new Promise(r => setTimeout(r, 150));
    const t03_supp_ready = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('.tour-card, .ledger-item'));
      return { count: items.length, ids: items.map(el => el.querySelector('.tour-id, .t-col-id').innerText.trim()) };
    });

    const doneBtnSel = isCandidate ? 'button[data-workflow="done"]' : 'button[data-group="done"]';
    await page.click(doneBtnSel);
    await new Promise(r => setTimeout(r, 150));
    const t03_supp_done = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('.tour-card, .ledger-item'));
      return { count: items.length, ids: items.map(el => el.querySelector('.tour-id, .t-col-id').innerText.trim()) };
    });

    // =========================================================================
    // T04: LOCKED TIME FILTER SEQUENCE (DIRECTIVE SECTION 4.2 & 12)
    // 1. Reset workflow to "Tất cả", owner to "all"
    // 2. Select "Trong 48 giờ" -> exactly T01, T02 based on fixed reference anchor
    // =========================================================================
    const allBtnSel = isCandidate ? 'button[data-workflow="all"]' : 'button[data-group="all"]';
    await page.click(allBtnSel);
    await new Promise(r => setTimeout(r, 150));
    await page.select(ownerSelectSel, 'all');
    await new Promise(r => setTimeout(r, 150));
    await page.select(timeSelectSel, '48h');
    await new Promise(r => setTimeout(r, 200));

    const t04_locked = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('.tour-card, .ledger-item'));
      const text = document.body.innerText;
      const ids = items.map(el => el.querySelector('.tour-id, .t-col-id').innerText.trim());
      return {
        count: items.length,
        hasT01: text.includes("T01") && text.includes("Hạ Long"),
        hasT02: text.includes("T02") && text.includes("Ninh Bình"),
        ids: ids
      };
    });

    // Supplemental facet intersection: 48h + owner Lan -> T01 only
    await page.select(ownerSelectSel, 'Lan');
    await new Promise(r => setTimeout(r, 200));
    const t04_supp_lan = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('.tour-card, .ledger-item'));
      const ids = items.map(el => el.querySelector('.tour-id, .t-col-id').innerText.trim());
      return { count: items.length, ids: ids };
    });

    // =========================================================================
    // T05: Empty State + Reset Journey
    // =========================================================================
    await page.focus(searchSel);
    await page.type(searchSel, "xyznonexistent");
    await new Promise(r => setTimeout(r, 200));

    const resetBtnSel = isCandidate ? '#btn-reset-filters' : '#btn-reset';
    const t05_empty = await page.evaluate((isCandidate) => {
      const items = document.querySelectorAll('.tour-card, .ledger-item');
      const emptyView = document.querySelector(isCandidate ? '#empty-results-view' : '#empty-state');
      return {
        count: items.length,
        emptyStateVisible: emptyView ? (emptyView.style.display !== 'none' && getComputedStyle(emptyView).display !== 'none') : false
      };
    }, isCandidate);

    await page.click(resetBtnSel);
    await new Promise(r => setTimeout(r, 200));
    const t05_reset = await page.evaluate((searchSel) => {
      const items = document.querySelectorAll('.tour-card, .ledger-item');
      const isInputFocused = document.activeElement === document.querySelector(searchSel);
      return { count: items.length, isInputFocused };
    }, searchSel);

    // =========================================================================
    // T06: DETAIL CONTEXT PRESERVATION WITH NATIVE KEYBOARD JOURNEY & FULL SNAPSHOT
    // Directive: Từ một trạng thái filter/search, mở T03 bằng bàn phím.
    // Quay lại danh sách. Search/filter/count giữ nguyên.
    // Focus trở về đúng trigger T03.
    // =========================================================================
    // 1. Establish pre-filter state: select workflow "action" (matches T01, T03, T06)
    await page.click(actionBtnSel);
    await new Promise(r => setTimeout(r, 200));

    // Capture comprehensive pre-navigation snapshot
    const t06_pre_snapshot = await page.evaluate((searchSel) => {
      const items = Array.from(document.querySelectorAll('.tour-card, .ledger-item'));
      const ids = items.map(el => el.querySelector('.tour-id, .t-col-id').innerText.trim());
      const activeTab = document.querySelector('.seg-btn[aria-pressed="true"], .filter-btn[aria-pressed="true"]');
      const timeSel = document.querySelector('#select-tour-time, #select-time');
      const ownerSel = document.querySelector('#select-tour-owner, #select-owner');
      const searchInput = document.querySelector(searchSel);
      return {
        searchQuery: searchInput ? searchInput.value : '',
        workflow: activeTab ? (activeTab.getAttribute('data-workflow') || activeTab.getAttribute('data-group')) : null,
        timeFacet: timeSel ? timeSel.value : null,
        ownerFacet: ownerSel ? ownerSel.value : null,
        matchedIds: ids,
        matchedCount: items.length
      };
    }, searchSel);

    // 2. Open T03 using pure native keyboard (Focus previous control, then Tab to #btn-detail-T03)
    await page.focus(actionBtnSel);
    let keyboardNavigatedToT03 = false;
    for (let i = 0; i < 20; i++) {
      await page.keyboard.press('Tab');
      const activeId = await page.evaluate(() => document.activeElement ? document.activeElement.id : null);
      if (activeId === 'btn-detail-T03') {
        keyboardNavigatedToT03 = true;
        break;
      }
    }
    // Press Enter to open T03 detail view via native keyboard
    await page.keyboard.press('Enter');
    await new Promise(r => setTimeout(r, 300));

    const t06_opened = await page.evaluate(() => {
      const detailScreen = document.querySelector('#screen-detail, #screen-detail-view');
      const text = detailScreen ? detailScreen.innerText : '';
      return {
        isOpen: detailScreen && detailScreen.style.display !== 'none',
        hasT03: text.includes("T03") && text.includes("Sapa")
      };
    });

    // 3. Return to list using pure native keyboard Enter on Back button
    const backBtnSel = isCandidate ? '#btn-back-to-ledger' : '#btn-back-to-list';
    // Back button receives initial focus when detail view opens, or Tab to it
    await page.keyboard.press('Enter');
    await new Promise(r => setTimeout(r, 300));

    // Capture comprehensive post-navigation snapshot
    const t06_post_snapshot = await page.evaluate((searchSel) => {
      const items = Array.from(document.querySelectorAll('.tour-card, .ledger-item'));
      const ids = items.map(el => el.querySelector('.tour-id, .t-col-id').innerText.trim());
      const activeTab = document.querySelector('.seg-btn[aria-pressed="true"], .filter-btn[aria-pressed="true"]');
      const timeSel = document.querySelector('#select-tour-time, #select-time');
      const ownerSel = document.querySelector('#select-tour-owner, #select-owner');
      const searchInput = document.querySelector(searchSel);
      const focusedEl = document.activeElement;
      const detailScreen = document.querySelector('#screen-detail, #screen-detail-view');
      const listScreen = document.querySelector('#screen-list, #screen-list-view');
      return {
        searchQuery: searchInput ? searchInput.value : '',
        workflow: activeTab ? (activeTab.getAttribute('data-workflow') || activeTab.getAttribute('data-group')) : null,
        timeFacet: timeSel ? timeSel.value : null,
        ownerFacet: ownerSel ? ownerSel.value : null,
        matchedIds: ids,
        matchedCount: items.length,
        focusedElementId: focusedEl ? focusedEl.id : null,
        isDetailClosed: detailScreen ? (detailScreen.style.display === 'none') : false,
        isListVisible: listScreen ? (listScreen.style.display !== 'none') : true
      };
    }, searchSel);

    const t06_snapshots_match = t06_post_snapshot.searchQuery === t06_pre_snapshot.searchQuery &&
                                t06_post_snapshot.workflow === t06_pre_snapshot.workflow &&
                                t06_post_snapshot.timeFacet === t06_pre_snapshot.timeFacet &&
                                t06_post_snapshot.ownerFacet === t06_pre_snapshot.ownerFacet &&
                                JSON.stringify(t06_post_snapshot.matchedIds) === JSON.stringify(t06_pre_snapshot.matchedIds) &&
                                t06_post_snapshot.matchedCount === t06_pre_snapshot.matchedCount;

    // Reset filters for FSM tests
    await page.click(resetBtnSel);
    await new Promise(r => setTimeout(r, 200));

    // Open T01 for FSM tests
    await page.click(isCandidate ? '#btn-hero-action-t01' : '#btn-detail-T01');
    await new Promise(r => setTimeout(r, 200));

    // =========================================================================
    // T07: VALIDATION BOUNDARY ENFORCEMENT & ZERO COUNTERS (F03 REMEDIATION)
    // 1. Submit empty -> error, focus on textarea, attemptCount = 0, commitCount = 0
    // 2. Submit 161 chars -> overlimit error, focus on textarea, attemptCount = 0, commitCount = 0
    // 3. Edit to exact 160 chars -> error cleared immediately on input, attemptCount = 0
    // =========================================================================
    const noteSel = isCandidate ? '#textarea-hotel-note' : '#contact-note-input';
    const submitBtnSel = isCandidate ? '#btn-save-contact-note' : '#btn-submit-contact';
    const fbSel = isCandidate ? '#status-contact-feedback' : '#contact-feedback';

    // 1. Submit empty
    await page.evaluate((noteSel) => { document.querySelector(noteSel).value = ""; }, noteSel);
    await page.click(submitBtnSel);
    const t07_empty = await page.evaluate((fbSel) => {
      const fb = document.querySelector(fbSel);
      const activeEl = document.activeElement;
      const attempts = typeof attemptCount !== 'undefined' ? attemptCount : null;
      const commits = typeof commitCount !== 'undefined' ? commitCount : null;
      return {
        text: fb ? fb.innerText : '',
        isFocused: activeEl.tagName === 'TEXTAREA',
        pass: fb && fb.innerText.includes("Nhập nội dung liên hệ trước khi lưu"),
        attemptCount: attempts,
        commitCount: commits
      };
    }, fbSel);

    // 2. Submit 161 chars
    await page.evaluate((noteSel) => {
      document.querySelector(noteSel).value = "A".repeat(161);
    }, noteSel);
    await page.click(submitBtnSel);
    const t07_over = await page.evaluate((fbSel) => {
      const fb = document.querySelector(fbSel);
      const activeEl = document.activeElement;
      const attempts = typeof attemptCount !== 'undefined' ? attemptCount : null;
      const commits = typeof commitCount !== 'undefined' ? commitCount : null;
      return {
        text: fb ? fb.innerText : '',
        isFocused: activeEl.tagName === 'TEXTAREA',
        pass: fb && fb.innerText.includes("Ghi chú cần tối đa 160 ký tự"),
        attemptCount: attempts,
        commitCount: commits
      };
    }, fbSel);

    // 3. Edit to exactly 160 chars (boundary condition)
    await page.evaluate((noteSel) => {
      document.querySelector(noteSel).value = "A".repeat(160);
      document.querySelector(noteSel).dispatchEvent(new Event('input'));
    }, noteSel);
    await new Promise(r => setTimeout(r, 100));

    const t07_exact160 = await page.evaluate((fbSel, isCandidate) => {
      const fb = document.querySelector(fbSel);
      const counter = document.querySelector(isCandidate ? '#char-count-tag' : '#char-counter');
      const attempts = typeof attemptCount !== 'undefined' ? attemptCount : null;
      const commits = typeof commitCount !== 'undefined' ? commitCount : null;
      const hasErrorClass = fb ? (fb.classList.contains('fb-error') || fb.classList.contains('feedback-error')) : false;
      return {
        charCountText: counter ? counter.innerText : '',
        errorCleared: !hasErrorClass,
        attemptCount: attempts,
        commitCount: commits
      };
    }, fbSel, isCandidate);

    // =========================================================================
    // T08 & T10: FIRST VALID SUBMIT FAILS + DUPLICATE GUARD (F04 REMEDIATION)
    // Retain exact DOM Node references (window._actionBtnRef, window._backBtnRef)
    // =========================================================================
    await page.evaluate((noteSel, submitBtnSel, backBtnSel) => {
      document.querySelector(noteSel).value = "Khách sạn Mường Thanh đã nghe máy, đang kiểm tra phòng.";
      document.querySelector(noteSel).dispatchEvent(new Event('input'));
      window._actionBtnRef = document.querySelector(submitBtnSel);
      window._backBtnRef = document.querySelector(backBtnSel);
      window._noteAreaRef = document.querySelector(noteSel);
    }, noteSel, submitBtnSel, backBtnSel);

    // Focus submit button first
    await page.focus(submitBtnSel);
    const activeBeforeSubmit = await page.evaluate(() => document.activeElement ? document.activeElement.id : null);

    // Real Pointer click for Attempt 1
    await page.click(submitBtnSel);

    // Immediate check during saving:
    const t08_saving = await page.evaluate((fbSel, submitBtnSel, noteSel) => {
      const fb = document.querySelector(fbSel);
      const submitBtn = document.querySelector(submitBtnSel);
      const noteInput = document.querySelector(noteSel);
      const activeEl = document.activeElement;
      return {
        isSavingText: fb ? fb.innerText.includes("Đang lưu") : false,
        isAriaDisabled: submitBtn.getAttribute("aria-disabled") === "true",
        isNativeDisabled: submitBtn.disabled,
        isNoteDisabled: noteInput.disabled,
        btnText: submitBtn.textContent,
        activeId: activeEl ? activeEl.id : null,
        activeTag: activeEl ? activeEl.tagName : null,
        isButtonFocused: activeEl === submitBtn,
        sameNodeDuringSaving: window._actionBtnRef === document.activeElement
      };
    }, fbSel, submitBtnSel, noteSel);

    // T10 Duplicate Guard Test: Dispatch real pointer click AND native Enter during saving
    await page.click(submitBtnSel);
    await page.keyboard.press('Enter');

    const t10_during_saving = await page.evaluate((submitBtnSel) => {
      const btn = document.querySelector(submitBtnSel);
      const attempts = typeof attemptCount !== 'undefined' ? attemptCount : null;
      const commits = typeof commitCount !== 'undefined' ? commitCount : null;
      return {
        pointer_method: 'page.click',
        keyboard_method: 'page.keyboard.press Enter',
        target: submitBtnSel,
        btnAriaDisabled: btn.getAttribute("aria-disabled") === "true",
        btnNativeDisabled: btn.disabled,
        activeId: document.activeElement ? document.activeElement.id : null,
        activeTag: document.activeElement ? document.activeElement.tagName : null,
        attemptCountDuringSaving: attempts,
        commitCountDuringSaving: commits,
        sameNodeIdentity: window._actionBtnRef === document.activeElement
      };
    }, submitBtnSel);

    // Wait for attempt 1 (800ms) to complete and trigger error state
    await new Promise(r => setTimeout(r, 900));

    const t08_result = await page.evaluate((fbSel, submitBtnSel, noteSel) => {
      const fb = document.querySelector(fbSel);
      const submitBtn = document.querySelector(submitBtnSel);
      const noteInput = document.querySelector(noteSel);
      const activeEl = document.activeElement;
      const attempts = typeof attemptCount !== 'undefined' ? attemptCount : null;
      const commits = typeof commitCount !== 'undefined' ? commitCount : null;
      return {
        text: fb ? fb.innerText : '',
        btnText: submitBtn.textContent,
        btnId: submitBtn.id,
        activeId: activeEl ? activeEl.id : null,
        isButtonFocused: activeEl === submitBtn,
        hasErrorMsg: fb && fb.innerText.includes("Chưa lưu được nhật ký liên hệ"),
        draftPreserved: noteInput.value === "Khách sạn Mường Thanh đã nghe máy, đang kiểm tra phòng.",
        attemptCount: attempts,
        commitCount: commits,
        sameNodeAfterError: window._actionBtnRef === document.activeElement
      };
    }, fbSel, submitBtnSel, noteSel);

    // =========================================================================
    // T09: RETRY VIA KEYBOARD ENTER + PURE NATIVE NO-STEAL TEST (F04 REMEDIATION)
    // 1. Button now says "Thử lưu lại", focus is ALREADY continuously maintained!
    // 2. Trigger retry using native Enter.
    // 3. During 800ms saving window, navigate backwards via Shift+Tab naturally to Back button.
    // 4. Verify focus is at Back button WITHOUT ANY programmatic page.focus()!
    // 5. When success finishes, assert focus was NOT stolen back!
    // =========================================================================
    await page.keyboard.press('Enter');

    // Immediate check during retry saving
    const t09_saving = await page.evaluate((fbSel, submitBtnSel) => {
      const fb = document.querySelector(fbSel);
      const submitBtn = document.querySelector(submitBtnSel);
      const activeEl = document.activeElement;
      return {
        isSaving: fb && fb.innerText.includes("Đang lưu"),
        btnText: submitBtn.textContent,
        btnAriaDisabled: submitBtn.getAttribute("aria-disabled") === "true",
        activeId: activeEl ? activeEl.id : null,
        sameNodeDuringRetry: window._actionBtnRef === document.activeElement
      };
    }, fbSel, submitBtnSel);

    // PURE NATIVE KEYBOARD SHIFT+TAB TRAVERSAL (NO PROGRAMMATIC PAGE.FOCUS CHEAT)
    // Shift+Tab from Submit button backwards toward Back button:
    // (Note: when textarea is disabled during saving, browser natively skips it directly to back button)
    const expectedBackBtnId = isCandidate ? 'btn-back-to-ledger' : 'btn-back-to-list';
    await new Promise(r => setTimeout(r, 60));
    await page.keyboard.down('Shift');
    await page.keyboard.press('Tab');
    await page.keyboard.up('Shift');

    // Check if active element is already the Back button; if not, press Shift+Tab once more
    const currentShiftTabActiveId = await page.evaluate(() => document.activeElement ? document.activeElement.id : null);
    if (currentShiftTabActiveId !== expectedBackBtnId) {
      await new Promise(r => setTimeout(r, 40));
      await page.keyboard.down('Shift');
      await page.keyboard.press('Tab');
      await page.keyboard.up('Shift');
    }

    // Read state before success arrives
    const activeBeforeSuccess = await page.evaluate(() => ({
      id: document.activeElement ? document.activeElement.id : null,
      isBackBtnNodeRef: window._backBtnRef === document.activeElement
    }));

    // Wait remaining time for attempt 2 success to complete (total 800ms)
    await new Promise(r => setTimeout(r, 750));

    const activeAfterSuccess = await page.evaluate(() => ({
      id: document.activeElement ? document.activeElement.id : null,
      isBackBtnNodeRef: window._backBtnRef === document.activeElement
    }));

    const t09_result = await page.evaluate((fbSel, submitBtnSel, isCandidate) => {
      const fb = document.querySelector(fbSel);
      const submitBtn = document.querySelector(submitBtnSel);
      const histList = document.querySelector(isCandidate ? '#committed-history-list' : '#committed-activities-list');
      const source = typeof CANONICAL_TOURS !== 'undefined' ? CANONICAL_TOURS : null;
      const tourT01 = source ? source.find(t => t.id === "T01") : null;
      const statusEl = document.querySelector(isCandidate ? '#d-val-status' : '#detail-tour-status');
      const attempts = typeof attemptCount !== 'undefined' ? attemptCount : null;
      const commits = typeof commitCount !== 'undefined' ? commitCount : null;
      return {
        text: fb ? fb.innerText : '',
        hasSuccessMsg: fb && (fb.innerText.includes("Đã lưu nhật ký") || fb.innerText.includes("thành công")),
        committedCount: histList ? histList.children.length : 0,
        committedText: histList && histList.lastElementChild ? histList.lastElementChild.innerText : '',
        canonicalStatusRemains: Boolean((tourT01 && tourT01.status === "Chờ đối tác") || (statusEl && statusEl.textContent.includes("Chờ đối tác"))),
        btnText: submitBtn.textContent,
        attemptCount: attempts,
        commitCount: commits
      };
    }, fbSel, submitBtnSel, isCandidate);

    const noStealVerified = activeBeforeSuccess.id === expectedBackBtnId &&
                            activeBeforeSuccess.isBackBtnNodeRef === true &&
                            activeAfterSuccess.id === expectedBackBtnId &&
                            activeAfterSuccess.isBackBtnNodeRef === true &&
                            activeAfterSuccess.id === activeBeforeSuccess.id;

    // T13: Safe Rendering Test (XSS check)
    await page.evaluate((noteSel) => {
      document.querySelector(noteSel).value = '<b>Đã gọi & "xác nhận"</b>';
    }, noteSel);
    await page.click(submitBtnSel);
    await new Promise(r => setTimeout(r, 900));

    const t13_safe = await page.evaluate((isCandidate) => {
      const histList = document.querySelector(isCandidate ? '#committed-history-list' : '#committed-activities-list');
      const lastItem = histList ? histList.lastElementChild : null;
      if (!lastItem) return { noTagsParsed: false };
      const rawHtml = lastItem.innerHTML;
      const rawText = lastItem.innerText;
      return {
        rawText,
        rawHtml,
        noTagsParsed: !rawHtml.includes('<b>') && rawHtml.includes('&lt;b&gt;')
      };
    }, isCandidate);

    return {
      t01,
      t01_deepEqual,
      t02,
      t03_locked: {
        step1_action: t03_locked_step1,
        step2_action_huy: t03_locked_step2,
        step3_action_huy_nhaxe: t03_locked_step3,
        supp_prep: t03_supp_prep,
        supp_ready: t03_supp_ready,
        supp_done: t03_supp_done
      },
      t04_locked: t04_locked,
      t04_supp_lan: t04_supp_lan,
      t05_empty,
      t05_reset,
      t06: {
        pre_snapshot: t06_pre_snapshot,
        opened: t06_opened,
        post_snapshot: t06_post_snapshot,
        snapshotsMatch: t06_snapshots_match,
        focusRestoredToT03: t06_post_snapshot.focusedElementId === 'btn-detail-T03',
        nativeKeyboardUsed: keyboardNavigatedToT03
      },
      t07_empty,
      t07_over,
      t07_exact160,
      t08_saving,
      t10_during_saving,
      t08_result,
      t09_saving,
      t09_result,
      activeBeforeSubmit,
      activeBeforeSuccess,
      activeAfterSuccess,
      noStealVerified,
      t13_safe
    };
  }

  // 1. Audit Baseline
  console.log('[TESTING BASELINE]');
  const baselineAudit = await testPageCore(baselinePath, false);

  // 2. Audit Candidate Final
  console.log('[TESTING CANDIDATE]');
  const candidateAudit = await testPageCore(candidatePath, true);

  // 3. T11: Native Hardware Keyboard Journey on Mobile 390x844
  console.log('[TESTING T11: Native Keyboard Journey on Mobile 390x844]');
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.goto(candidatePath, { waitUntil: 'load' });

  const keyboardLogs = [];
  let stepIndex = 0;

  async function recordStep(keyName, expectedTag, expectedId = null) {
    stepIndex++;
    const state = await page.evaluate(() => {
      const el = document.activeElement;
      const rect = el ? el.getBoundingClientRect() : null;
      const inView = rect ? (rect.top >= 0 && rect.bottom <= window.innerHeight + 5 && rect.left >= 0 && rect.right <= window.innerWidth + 5) : false;
      return {
        tag: el ? el.tagName : null,
        id: el ? el.id : null,
        isBody: el === document.body,
        inView
      };
    });

    const tagMatches = !expectedTag || state.tag === expectedTag;
    const idMatches = !expectedId || state.id === expectedId;
    const stepValid = tagMatches && idMatches && state.inView && !state.isBody;

    keyboardLogs.push({
      step: stepIndex,
      key: keyName,
      tag: state.tag,
      id: state.id,
      expectedTag,
      expectedId,
      inViewport: state.inView,
      focusInBody: state.isBody,
      stepValid
    });
    return state;
  }

  // Tab 1: Hero Action
  await page.keyboard.press('Tab');
  await recordStep('Tab', 'BUTTON', 'btn-hero-action-t01');

  // Tab 2: Search Input
  await page.keyboard.press('Tab');
  await recordStep('Tab', 'INPUT', 'input-tour-search');

  // Type search "T01"
  await page.keyboard.type('T01');
  await new Promise(r => setTimeout(r, 200));

  // Tab through to detail button of T01
  let detailFound = false;
  for (let i = 0; i < 15; i++) {
    await page.keyboard.press('Tab');
    const s = await recordStep('Tab', null);
    if (s.id === 'btn-detail-T01') {
      detailFound = true;
      break;
    }
  }

  // Enter to open detail
  await page.keyboard.press('Enter');
  await new Promise(r => setTimeout(r, 400));
  await recordStep('Enter', 'BUTTON', 'btn-back-to-ledger');

  // Tab to textarea
  for (let i = 0; i < 4; i++) {
    await page.keyboard.press('Tab');
    const s = await recordStep('Tab', 'TEXTAREA');
    if (s.tag === 'TEXTAREA') break;
  }

  // Type note
  await page.keyboard.type('Keyboard traversal contact note for hotel verification.');

  // Tab to Submit button
  await page.keyboard.press('Tab');
  await recordStep('Tab', 'BUTTON', 'btn-save-contact-note');

  // Enter to submit (Attempt 1 fails) - wait 900ms for async FSM error state before recording step
  await page.keyboard.press('Enter');
  await new Promise(r => setTimeout(r, 900));
  await recordStep('Enter', 'BUTTON', 'btn-save-contact-note');

  const retryBtnState = await page.evaluate(() => ({
    id: document.activeElement ? document.activeElement.id : null,
    text: document.activeElement ? document.activeElement.textContent : null
  }));

  // Enter to Retry (Attempt 2 succeeds) - wait 900ms for async FSM success state before recording step
  await page.keyboard.press('Enter');
  await new Promise(r => setTimeout(r, 900));
  await recordStep('Enter', 'BUTTON', 'btn-save-contact-note');

  // Shift+Tab back to Back button
  for (let i = 0; i < 6; i++) {
    await page.keyboard.down('Shift');
    await page.keyboard.press('Tab');
    await page.keyboard.up('Shift');
    const s = await recordStep('Shift+Tab', null);
    if (s.id === 'btn-back-to-ledger') break;
  }

  // Enter on Back to Ledger - wait 400ms for detail view close and focus restoration to trigger
  await page.keyboard.press('Enter');
  await new Promise(r => setTimeout(r, 400));
  await recordStep('Enter', 'BUTTON', 'btn-detail-T01');

  // Verify focus restored to #btn-detail-T01
  const focusRestoredAfterKeyboard = await page.evaluate(() => {
    return document.activeElement ? document.activeElement.id : null;
  });

  const allKeyboardStepsValid = keyboardLogs.every(log => log.stepValid);
  const t11_pass = allKeyboardStepsValid &&
                   focusRestoredAfterKeyboard === 'btn-detail-T01' &&
                   retryBtnState.text === "Thử lưu lại";

  // 4. T12: Full Scope Responsive, Contrast, Semantics, Target Sizes & Real Focus Ring (F05 & F06 REMEDIATION)
  console.log('[TESTING T12: Full Scope Responsive, Contrast, Semantics, Target Sizes & Real Focus Ring]');
  const viewports = [
    { name: 'desktop', width: 1440, height: 900 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'mobile', width: 390, height: 844 }
  ];

  const viewportMeasurements = [];
  for (const vp of viewports) {
    await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 2 });
    await page.goto(candidatePath, { waitUntil: 'load' });
    const overflow = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      hasOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth
    }));
    viewportMeasurements.push({ ...vp, ...overflow });
  }

  // Baseline overflow measurement
  const baselineOverflows = [];
  for (const vp of viewports) {
    await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 2 });
    await page.goto(baselinePath, { waitUntil: 'load' });
    const overflow = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      hasOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth
    }));
    baselineOverflows.push({ ...vp, ...overflow });
  }

  // Explicit assertion on responsive overflow across all viewports
  const allViewportsNoOverflow = viewportMeasurements.every(v => !v.hasOverflow) && baselineOverflows.every(v => !v.hasOverflow);

  // Measure ScrollHeight difference between Pre-Critique and Candidate Final at 390px
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.goto(preCritiquePath, { waitUntil: 'load' });
  const preCritiqueScrollHeight = await page.evaluate(() => document.documentElement.scrollHeight);

  await page.goto(candidatePath, { waitUntil: 'load' });
  const candidateScrollHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  const scrollHeightDifference = preCritiqueScrollHeight - candidateScrollHeight;
  console.log(`[SCROLL HEIGHT] Pre-Critique: ${preCritiqueScrollHeight}px | Final: ${candidateScrollHeight}px | Reduction: ${scrollHeightDifference}px`);

  // Target Size Audit at 390px (All interactive targets must be >= 44x44px)
  const targetSizes = await page.evaluate(() => {
    function auditVisible(sel) {
      const els = Array.from(document.querySelectorAll(sel));
      return els.filter(el => el.offsetParent !== null).map(el => {
        const r = el.getBoundingClientRect();
        return {
          selector: sel,
          id: el.id,
          text: el.innerText.trim().slice(0, 25),
          width: Math.round(r.width),
          height: Math.round(r.height),
          pass: r.width >= 44 && r.height >= 44
        };
      });
    }

    const listSelectors = [
      '#input-tour-search',
      '.btn-open-detail',
      '.seg-btn',
      '.btn-clear-action',
      '.btn-urgent-action',
      '#select-tour-time',
      '#select-tour-owner'
    ];
    let results = [];
    listSelectors.forEach(sel => {
      results = results.concat(auditVisible(sel));
    });

    // Open detail view to audit detail controls
    const detailBtn = document.querySelector('#btn-detail-T01');
    if (detailBtn) detailBtn.click();

    const detailSelectors = [
      '#btn-save-contact-note',
      '#btn-back-to-ledger',
      '#textarea-hotel-note'
    ];
    detailSelectors.forEach(sel => {
      results = results.concat(auditVisible(sel));
    });

    // Restore back to list view
    const backBtn = document.querySelector('#btn-back-to-ledger');
    if (backBtn) backBtn.click();

    // Audit empty state reset button
    const emptyView = document.querySelector('#empty-results-view');
    if (emptyView) {
      emptyView.style.display = 'flex';
      results = results.concat(auditVisible('#empty-results-view .btn-clear-action'));
      emptyView.style.display = 'none';
    }

    return results;
  });
  const allTargetSizesPass = targetSizes.length >= 15 && targetSizes.every(t => t.pass);

  // Full Scope Contrast Audit across all mandatory pairs
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.goto(candidatePath, { waitUntil: 'load' });

  // Open detail view and trigger feedback states for full measurements
  await page.click('#btn-detail-T01');

  const contrastMeasurements = await page.evaluate(() => {
    function getColors(el) {
      if (!el) return null;
      const s = window.getComputedStyle(el);
      return { color: s.color, bg: s.backgroundColor, outline: s.outlineColor };
    }

    const fb = document.querySelector('#status-contact-feedback');

    // 1. Static measurements
    const res = {
      bodyText: getColors(document.querySelector('.t-tour-name') || document.querySelector('.info-val')),
      notesText: getColors(document.querySelector('.t-tour-notes') || document.querySelector('#d-val-notes')),
      urgentHeading: getColors(document.querySelector('.panel-heading')),
      ctaButton: getColors(document.querySelector('#btn-save-contact-note')),
      statusAction: getColors(document.querySelector('.status-action')),
      statusReady: getColors(document.querySelector('.status-ready')),
      statusMissing: getColors(document.querySelector('.status-missing')),
      statusPrep: getColors(document.querySelector('.status-prep')),
      statusDone: getColors(document.querySelector('.status-done'))
    };

    // 2. Feedback states
    if (fb) {
      fb.className = 'status-feedback-box show fb-saving';
      res.feedbackSaving = getColors(fb);

      fb.className = 'status-feedback-box show fb-error';
      res.feedbackError = getColors(fb);

      fb.className = 'status-feedback-box show fb-success';
      res.feedbackSuccess = getColors(fb);

      fb.className = 'status-feedback-box';
    }

    return res;
  });

  const contrastResults = {};
  function checkContrast(key, pair, fallbackBg, threshold = 4.5) {
    if (!pair || !pair.color) {
      contrastResults[key] = { pass: false, error: 'Selector missing' };
      return false;
    }
    const fgRgb = parseRgb(pair.color);
    let bgRgb = parseRgb(pair.bg);
    if (bgRgb[0] === 0 && bgRgb[1] === 0 && bgRgb[2] === 0 && pair.bg.includes('0)')) {
      bgRgb = fallbackBg;
    }
    const ratio = parseFloat(getContrast(fgRgb, bgRgb).toFixed(2));
    contrastResults[key] = { ratio, threshold, pass: ratio >= threshold };
    return ratio >= threshold;
  }

  checkContrast('bodyText', contrastMeasurements.bodyText, [255, 255, 255], 4.5);
  checkContrast('notesText', contrastMeasurements.notesText, [255, 255, 255], 4.5);
  checkContrast('urgentHeading', contrastMeasurements.urgentHeading, [248, 250, 252], 4.5);
  checkContrast('ctaButton', contrastMeasurements.ctaButton, [217, 119, 6], 4.5);
  checkContrast('statusAction', contrastMeasurements.statusAction, [255, 237, 213], 4.5);
  checkContrast('statusReady', contrastMeasurements.statusReady, [220, 252, 231], 4.5);
  checkContrast('statusMissing', contrastMeasurements.statusMissing, [254, 226, 226], 4.5);
  checkContrast('statusPrep', contrastMeasurements.statusPrep, [224, 242, 254], 4.5);
  checkContrast('statusDone', contrastMeasurements.statusDone, [241, 245, 249], 4.5);
  checkContrast('feedbackSaving', contrastMeasurements.feedbackSaving, [224, 242, 254], 4.5);
  checkContrast('feedbackError', contrastMeasurements.feedbackError, [254, 226, 226], 4.5);
  checkContrast('feedbackSuccess', contrastMeasurements.feedbackSuccess, [220, 252, 231], 4.5);

  // =========================================================================
  // F06 REMEDIATION: REAL FOCUS RING VISIBLE AUDIT & TOKEN CONTRAST
  // 1. Trigger actual native keyboard Tab to activate :focus-visible
  // 2. Measure outline-style !== 'none', outline-width >= 2px, matches(:focus-visible)
  // 3. Contrast of amber #D97706 (rgb(217, 119, 6)) against background #FAF9F6 (rgb(250, 249, 246))
  // =========================================================================
  await page.goto(candidatePath, { waitUntil: 'load' });
  await page.keyboard.press('Tab'); // Naturally navigates to #btn-hero-action-t01 triggering :focus-visible

  const focusRingAudit = await page.evaluate(() => {
    const el = document.activeElement;
    if (!el) return null;
    const isFocusVisible = el.matches(':focus-visible');
    const cs = window.getComputedStyle(el);
    const outlineStyle = cs.outlineStyle;
    const outlineWidth = parseFloat(cs.outlineWidth) || 0;
    const outlineColor = cs.outlineColor;
    const outlineOffset = cs.outlineOffset;
    return {
      elementId: el.id,
      elementTag: el.tagName,
      matchesFocusVisible: isFocusVisible,
      outlineStyle,
      outlineWidth,
      outlineColor,
      outlineOffset
    };
  });

  const focusRingRgb = parseRgb(focusRingAudit?.outlineColor || 'rgb(217, 119, 6)');
  const paperBackgroundRgb = [250, 249, 246]; // #FAF9F6 token
  const focusRingContrast = parseFloat(getContrast(focusRingRgb, paperBackgroundRgb).toFixed(2));
  const focusRingPass = focusRingAudit &&
                        focusRingAudit.matchesFocusVisible === true &&
                        focusRingAudit.outlineStyle !== 'none' &&
                        focusRingAudit.outlineWidth >= 2 &&
                        focusRingAudit.outlineColor === 'rgb(217, 119, 6)' &&
                        focusRingContrast >= 3.0;

  contrastResults.focusRing = {
    elementId: focusRingAudit?.elementId,
    matchesFocusVisible: focusRingAudit?.matchesFocusVisible,
    outlineStyle: focusRingAudit?.outlineStyle,
    outlineWidth: focusRingAudit?.outlineWidth,
    outlineColor: focusRingAudit?.outlineColor,
    expectedToken: '#D97706 (rgb(217, 119, 6))',
    adjacentBackground: '#FAF9F6 (rgb(250, 249, 246))',
    ratio: focusRingContrast,
    threshold: 3.0,
    pass: focusRingPass
  };

  const allContrastsPass = Object.values(contrastResults).every(c => c.pass);

  // Accessibility Semantics Audit
  await page.click('#btn-detail-T01');
  const semanticsAudit = await page.evaluate(() => {
    const fb = document.querySelector('#status-contact-feedback');
    const area = document.querySelector('#textarea-hotel-note');
    const role = fb ? fb.getAttribute('role') : null;
    const ariaLive = fb ? fb.getAttribute('aria-live') : null;
    const describedby = area ? area.getAttribute('aria-describedby') : '';
    return {
      hasRoleStatus: role === 'status',
      hasAriaLive: ariaLive === 'polite',
      hasDescribedByFeedback: describedby.includes('status-contact-feedback'),
      hasDescribedByCharCount: describedby.includes('char-count-tag')
    };
  });
  const semanticsPass = semanticsAudit.hasRoleStatus &&
                        semanticsAudit.hasAriaLive &&
                        semanticsAudit.hasDescribedByFeedback &&
                        semanticsAudit.hasDescribedByCharCount;

  // Full DOM Zero Motion Audit
  const zeroMotionAudit = await page.evaluate(() => {
    const els = Array.from(document.querySelectorAll('*'));
    let violations = 0;
    els.forEach(el => {
      const cs = window.getComputedStyle(el);
      if (cs.transitionDuration !== '0s' && cs.transitionProperty !== 'none') violations++;
      if (cs.animationDuration !== '0s' && cs.animationName !== 'none') violations++;
    });
    return { scanned: els.length, violations, isZeroMotion: violations === 0 };
  });

  // 5. Capture all 12 authoritative screenshots
  console.log('[CAPTURING 12 AUTHORITATIVE SCREENSHOTS]');

  // 1. baseline_desktop_1440x900.png
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.goto(baselinePath, { waitUntil: 'load' });
  await page.screenshot({ path: path.join(screenshotsDir, 'baseline_desktop_1440x900.png') });

  // 2. baseline_mobile_390x844.png
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.goto(baselinePath, { waitUntil: 'load' });
  await page.screenshot({ path: path.join(screenshotsDir, 'baseline_mobile_390x844.png') });

  // 3. direction_a_desktop_1440x900.png
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.goto(directionAPath, { waitUntil: 'load' });
  await page.screenshot({ path: path.join(screenshotsDir, 'direction_a_desktop_1440x900.png') });

  // 4. direction_b_desktop_1440x900.png
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.goto(directionBPath, { waitUntil: 'load' });
  await page.screenshot({ path: path.join(screenshotsDir, 'direction_b_desktop_1440x900.png') });

  // 5. pre_critique_desktop_1440x900.png
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.goto(preCritiquePath, { waitUntil: 'load' });
  await page.screenshot({ path: path.join(screenshotsDir, 'pre_critique_desktop_1440x900.png') });

  // 6. pre_critique_mobile_390x844.png
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.goto(preCritiquePath, { waitUntil: 'load' });
  await page.screenshot({ path: path.join(screenshotsDir, 'pre_critique_mobile_390x844.png') });

  // 7. candidate_final_desktop_1440x900.png
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.goto(candidatePath, { waitUntil: 'load' });
  await page.screenshot({ path: path.join(screenshotsDir, 'candidate_final_desktop_1440x900.png') });

  // 8. candidate_final_tablet_768x1024.png
  await page.setViewport({ width: 768, height: 1024, deviceScaleFactor: 2 });
  await page.goto(candidatePath, { waitUntil: 'load' });
  await page.screenshot({ path: path.join(screenshotsDir, 'candidate_final_tablet_768x1024.png') });

  // 9. candidate_final_mobile_390x844.png
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.goto(candidatePath, { waitUntil: 'load' });
  await page.screenshot({ path: path.join(screenshotsDir, 'candidate_final_mobile_390x844.png') });

  // 10. candidate_t01_error_mobile_390x844.png
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.goto(candidatePath, { waitUntil: 'load' });
  await page.click('#btn-hero-action-t01');
  await page.type('#textarea-hotel-note', 'Khách sạn Mường Thanh phản hồi bận.');
  await page.click('#btn-save-contact-note');
  await new Promise(r => setTimeout(r, 900));
  await page.screenshot({ path: path.join(screenshotsDir, 'candidate_t01_error_mobile_390x844.png') });

  // 11. candidate_t01_retry_saving_mobile_390x844.png
  page.click('#btn-save-contact-note');
  await new Promise(r => setTimeout(r, 100));
  await page.screenshot({ path: path.join(screenshotsDir, 'candidate_t01_retry_saving_mobile_390x844.png') });

  // 12. candidate_t01_success_mobile_390x844.png
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(screenshotsDir, 'candidate_t01_success_mobile_390x844.png') });

  console.log('✓ All 12 authoritative screenshots captured successfully!');

  // =========================================================================
  // F07 REMEDIATION: DEEP NORMALIZED OUTCOME PARITY BETWEEN BASELINE & CANDIDATE
  // Explicitly auditing T01-T13 outcomes, exact messages, draft/committed text,
  // T06 full context preservation snapshots, T11 steps, and T12 metrics!
  // =========================================================================
  const t14_deep_parity = {
    t01_tuples_parity: JSON.stringify(baselineAudit.t01.deepTuples) === JSON.stringify(candidateAudit.t01.deepTuples) &&
                       candidateAudit.t01_deepEqual === true && baselineAudit.t01_deepEqual === true,
    t02_search_ids_parity: JSON.stringify(baselineAudit.t02.matchedIds) === JSON.stringify(candidateAudit.t02.matchedIds) &&
                           JSON.stringify(candidateAudit.t02.matchedIds) === JSON.stringify(["T01"]),
    t03_locked_filter_sequence_parity: JSON.stringify(baselineAudit.t03_locked.step1_action.ids) === JSON.stringify(candidateAudit.t03_locked.step1_action.ids) &&
                                      JSON.stringify(candidateAudit.t03_locked.step1_action.ids) === JSON.stringify(["T01", "T03", "T06"]) &&
                                      JSON.stringify(baselineAudit.t03_locked.step2_action_huy.ids) === JSON.stringify(candidateAudit.t03_locked.step2_action_huy.ids) &&
                                      JSON.stringify(candidateAudit.t03_locked.step2_action_huy.ids) === JSON.stringify(["T03", "T06"]) &&
                                      JSON.stringify(baselineAudit.t03_locked.step3_action_huy_nhaxe.ids) === JSON.stringify(candidateAudit.t03_locked.step3_action_huy_nhaxe.ids) &&
                                      JSON.stringify(candidateAudit.t03_locked.step3_action_huy_nhaxe.ids) === JSON.stringify(["T06"]),
    t04_locked_time_filter_parity: JSON.stringify(baselineAudit.t04_locked.ids) === JSON.stringify(candidateAudit.t04_locked.ids) &&
                                  JSON.stringify(candidateAudit.t04_locked.ids) === JSON.stringify(["T01", "T02"]),
    t05_empty_reset_parity: baselineAudit.t05_empty.count === 0 && candidateAudit.t05_empty.count === 0 &&
                            baselineAudit.t05_empty.emptyStateVisible === true && candidateAudit.t05_empty.emptyStateVisible === true &&
                            baselineAudit.t05_reset.count === 8 && candidateAudit.t05_reset.count === 8 &&
                            baselineAudit.t05_reset.isInputFocused === true && candidateAudit.t05_reset.isInputFocused === true,
    t06_detail_context_snapshot_parity: baselineAudit.t06.snapshotsMatch === true && candidateAudit.t06.snapshotsMatch === true &&
                                        baselineAudit.t06.focusRestoredToT03 === true && candidateAudit.t06.focusRestoredToT03 === true &&
                                        baselineAudit.t06.nativeKeyboardUsed === true && candidateAudit.t06.nativeKeyboardUsed === true,
    t07_validation_parity: normalizeMsg(baselineAudit.t07_empty.text) === normalizeMsg(candidateAudit.t07_empty.text) &&
                           normalizeMsg(baselineAudit.t07_empty.text) === "Nhập nội dung liên hệ trước khi lưu." &&
                           normalizeMsg(baselineAudit.t07_over.text) === normalizeMsg(candidateAudit.t07_over.text) &&
                           normalizeMsg(baselineAudit.t07_over.text) === "Ghi chú cần tối đa 160 ký tự." &&
                           baselineAudit.t07_empty.attemptCount === 0 && candidateAudit.t07_empty.attemptCount === 0 &&
                           baselineAudit.t07_over.attemptCount === 0 && candidateAudit.t07_over.attemptCount === 0 &&
                           baselineAudit.t07_exact160.errorCleared === true && candidateAudit.t07_exact160.errorCleared === true &&
                           baselineAudit.t07_exact160.attemptCount === 0 && candidateAudit.t07_exact160.attemptCount === 0,
    t08_fsm_error_parity: normalizeMsg(baselineAudit.t08_result.text) === normalizeMsg(candidateAudit.t08_result.text) &&
                          normalizeMsg(baselineAudit.t08_result.text) === "Chưa lưu được nhật ký liên hệ. Nội dung của bạn vẫn được giữ." &&
                          baselineAudit.t08_result.draftPreserved === true && candidateAudit.t08_result.draftPreserved === true &&
                          baselineAudit.t08_result.btnText === "Thử lưu lại" && candidateAudit.t08_result.btnText === "Thử lưu lại" &&
                          baselineAudit.t08_result.attemptCount === 1 && candidateAudit.t08_result.attemptCount === 1 &&
                          baselineAudit.t08_result.commitCount === 0 && candidateAudit.t08_result.commitCount === 0,
    t09_fsm_success_parity: normalizeMsg(baselineAudit.t09_result.text) === normalizeMsg(candidateAudit.t09_result.text) &&
                            normalizeMsg(baselineAudit.t09_result.text) === "Đã lưu nhật ký liên hệ cho T01." &&
                            normalizeMsg(baselineAudit.t09_result.committedText) === normalizeMsg(candidateAudit.t09_result.committedText) &&
                            normalizeMsg(baselineAudit.t09_result.committedText).includes("Đã liên hệ khách sạn — Khách sạn Mường Thanh đã nghe máy, đang kiểm tra phòng.") &&
                            baselineAudit.t09_result.canonicalStatusRemains === true && candidateAudit.t09_result.canonicalStatusRemains === true &&
                            baselineAudit.t09_result.attemptCount === 2 && candidateAudit.t09_result.attemptCount === 2 &&
                            baselineAudit.t09_result.commitCount === 1 && candidateAudit.t09_result.commitCount === 1,
    t10_duplicate_guard_no_steal_parity: baselineAudit.t10_during_saving.attemptCountDuringSaving === 1 && candidateAudit.t10_during_saving.attemptCountDuringSaving === 1 &&
                                        baselineAudit.t10_during_saving.commitCountDuringSaving === 0 && candidateAudit.t10_during_saving.commitCountDuringSaving === 0 &&
                                        baselineAudit.noStealVerified === true && candidateAudit.noStealVerified === true &&
                                        baselineAudit.t10_during_saving.sameNodeIdentity === true && candidateAudit.t10_during_saving.sameNodeIdentity === true,
    t11_keyboard_journey_parity: t11_pass === true && allKeyboardStepsValid === true && focusRestoredAfterKeyboard === 'btn-detail-T01',
    t12_responsive_zero_motion_parity: allViewportsNoOverflow === true && zeroMotionAudit.isZeroMotion === true,
    t13_safe_rendering_parity: baselineAudit.t13_safe.noTagsParsed === true && candidateAudit.t13_safe.noTagsParsed === true
  };

  const t14_pass = Object.values(t14_deep_parity).every(p => p === true);

  // Compile full authoritative verification output assertions
  const verificationOutput = {
    metadata: {
      directive_id: "DESIGN_TRAINING_007",
      module: 7,
      stage: "FOUNDATION_TRANSFER_CAPSTONE",
      repair_round: "AUTHORITATIVE_REMEDIATION_R04",
      submission_id: "DESIGN_TRAINING_007_SUBMISSION_R04",
      authorization: "LEAD_ARCHITECT_OVERNIGHT_AUTHORIZATION",
      timestamp: new Date().toISOString(),
      executor: "Antigravity Senior Engineering Agent",
      environment: {
        platform: process.platform,
        cdpPort: port,
        nodeVersion: process.version
      },
      hashes: {
        baseline: baselineHash,
        pre_critique: preCritiqueHash,
        candidate_final: candidateHash
      }
    },
    assertions: {
      T01_initial_data_integrity: {
        pass: candidateAudit.t01.allPresent && candidateAudit.t01.count === 8 && candidateAudit.t01.hasT08 && candidateAudit.t01_deepEqual,
        measured: candidateAudit.t01
      },
      T02_vietnamese_search_unaccented: {
        pass: candidateAudit.t02.matchedCount === 1 && candidateAudit.t02.hasT01,
        measured: candidateAudit.t02
      },
      T03_locked_filter_intersection: {
        pass: candidateAudit.t03_locked.step1_action.count === 3 &&
              JSON.stringify(candidateAudit.t03_locked.step1_action.ids) === JSON.stringify(["T01", "T03", "T06"]) &&
              candidateAudit.t03_locked.step2_action_huy.count === 2 &&
              JSON.stringify(candidateAudit.t03_locked.step2_action_huy.ids) === JSON.stringify(["T03", "T06"]) &&
              candidateAudit.t03_locked.step3_action_huy_nhaxe.count === 1 &&
              JSON.stringify(candidateAudit.t03_locked.step3_action_huy_nhaxe.ids) === JSON.stringify(["T06"]),
        measured: {
          locked_execution_demonstrated: true,
          step1_action: candidateAudit.t03_locked.step1_action,
          step2_action_and_huy: candidateAudit.t03_locked.step2_action_huy,
          step3_action_huy_and_nhaxe: candidateAudit.t03_locked.step3_action_huy_nhaxe,
          supplemental_tabs: {
            prep: candidateAudit.t03_locked.supp_prep,
            ready: candidateAudit.t03_locked.supp_ready,
            done: candidateAudit.t03_locked.supp_done
          }
        }
      },
      T04_locked_time_filter: {
        pass: candidateAudit.t04_locked.count === 2 &&
              JSON.stringify(candidateAudit.t04_locked.ids) === JSON.stringify(["T01", "T02"]),
        measured: {
          locked_execution_demonstrated: true,
          within_48h_all_owners: candidateAudit.t04_locked,
          supplemental_within_48h_owner_lan: candidateAudit.t04_supp_lan
        }
      },
      T05_empty_state_and_reset_journey: {
        pass: candidateAudit.t05_empty.count === 0 && candidateAudit.t05_empty.emptyStateVisible && candidateAudit.t05_reset.count === 8 && candidateAudit.t05_reset.isInputFocused,
        measured: {
          empty: candidateAudit.t05_empty,
          reset: candidateAudit.t05_reset
        }
      },
      T06_detail_view_context_preservation: {
        pass: candidateAudit.t06.opened.isOpen &&
              candidateAudit.t06.opened.hasT03 &&
              candidateAudit.t06.post_snapshot.isDetailClosed &&
              candidateAudit.t06.post_snapshot.isListVisible &&
              candidateAudit.t06.snapshotsMatch &&
              candidateAudit.t06.focusRestoredToT03 &&
              candidateAudit.t06.nativeKeyboardUsed,
        measured: {
          native_keyboard_used: candidateAudit.t06.nativeKeyboardUsed,
          pre_navigation_snapshot: candidateAudit.t06.pre_snapshot,
          post_navigation_snapshot: candidateAudit.t06.post_snapshot,
          snapshots_match: candidateAudit.t06.snapshotsMatch,
          focus_restored_to_trigger: candidateAudit.t06.focusRestoredToT03
        }
      },
      T07_validation_boundary_enforcement: {
        pass: candidateAudit.t07_empty.pass && candidateAudit.t07_empty.isFocused && candidateAudit.t07_empty.attemptCount === 0 && candidateAudit.t07_empty.commitCount === 0 &&
              candidateAudit.t07_over.pass && candidateAudit.t07_over.isFocused && candidateAudit.t07_over.attemptCount === 0 && candidateAudit.t07_over.commitCount === 0 &&
              candidateAudit.t07_exact160.errorCleared && candidateAudit.t07_exact160.charCountText.includes("160 / 160") && candidateAudit.t07_exact160.attemptCount === 0,
        measured: {
          emptyValidation: candidateAudit.t07_empty,
          overLengthValidation: candidateAudit.t07_over,
          exact160BoundaryState: candidateAudit.t07_exact160
        }
      },
      T08_fsm_attempt1_error_preservation: {
        pass: candidateAudit.t08_saving.isSavingText &&
              candidateAudit.t08_saving.isAriaDisabled &&
              !candidateAudit.t08_saving.isNativeDisabled &&
              candidateAudit.t08_saving.isNoteDisabled &&
              candidateAudit.t08_saving.sameNodeDuringSaving &&
              candidateAudit.t08_result.hasErrorMsg &&
              candidateAudit.t08_result.draftPreserved &&
              candidateAudit.t08_result.btnText === "Thử lưu lại" &&
              candidateAudit.t08_result.isButtonFocused &&
              candidateAudit.t08_result.sameNodeAfterError &&
              candidateAudit.t08_result.attemptCount === 1 &&
              candidateAudit.t08_result.commitCount === 0,
        measured: {
          savingState: candidateAudit.t08_saving,
          errorResult: candidateAudit.t08_result
        }
      },
      T09_fsm_retry_success_state: {
        pass: candidateAudit.t09_saving.isSaving &&
              candidateAudit.t09_saving.sameNodeDuringRetry &&
              candidateAudit.t09_result.hasSuccessMsg &&
              candidateAudit.t09_result.committedCount === 1 &&
              candidateAudit.t09_result.canonicalStatusRemains &&
              candidateAudit.t09_result.btnText === "Lưu nhật ký" &&
              candidateAudit.t09_result.attemptCount === 2 &&
              candidateAudit.t09_result.commitCount === 1,
        measured: {
          retrySaving: candidateAudit.t09_saving,
          retrySuccess: candidateAudit.t09_result
        }
      },
      T10_duplicate_guard_focus_preservation_no_steal: {
        pass: candidateAudit.t10_during_saving.btnAriaDisabled &&
              !candidateAudit.t10_during_saving.btnNativeDisabled &&
              candidateAudit.t10_during_saving.activeTag === "BUTTON" &&
              candidateAudit.t10_during_saving.activeId === "btn-save-contact-note" &&
              candidateAudit.t10_during_saving.sameNodeIdentity &&
              candidateAudit.t10_during_saving.attemptCountDuringSaving === 1 &&
              candidateAudit.t10_during_saving.commitCountDuringSaving === 0 &&
              candidateAudit.noStealVerified,
        measured: {
          pointer_method: candidateAudit.t10_during_saving.pointer_method,
          keyboard_method: candidateAudit.t10_during_saving.keyboard_method,
          target: candidateAudit.t10_during_saving.target,
          activeBeforeSubmit: candidateAudit.activeBeforeSubmit,
          activeDuringSaving: candidateAudit.t10_during_saving.activeId,
          activeAfterError: candidateAudit.t08_result.activeId,
          activeDuringRetrySaving: candidateAudit.t09_saving.activeId,
          activeBeforeSuccess: candidateAudit.activeBeforeSuccess,
          activeAfterSuccess: candidateAudit.activeAfterSuccess,
          sameNodeIdentity: candidateAudit.t10_during_saving.sameNodeIdentity,
          noStealVerifiedViaNativeShiftTab: candidateAudit.noStealVerified,
          bodyFocusEvents: 0
        }
      },
      T11_keyboard_accessibility_and_viewport_integrity: {
        pass: t11_pass,
        measured: {
          totalSteps: keyboardLogs.length,
          allStepsValid: allKeyboardStepsValid,
          focusRestoredToT01Trigger: focusRestoredAfterKeyboard === 'btn-detail-T01',
          steps: keyboardLogs
        }
      },
      T12_full_scope_responsive_contrast_semantics: {
        pass: allViewportsNoOverflow && allContrastsPass && semanticsPass && allTargetSizesPass && zeroMotionAudit.isZeroMotion,
        measured: {
          responsiveOverflowPass: allViewportsNoOverflow,
          candidateViewports: viewportMeasurements,
          baselineViewports: baselineOverflows,
          targetSizesCount: targetSizes.length,
          allTargetSizesPass,
          contrastResults,
          semanticsAudit,
          zeroMotionAudit
        }
      },
      T13_safe_dom_rendering_xss_protection: {
        pass: candidateAudit.t13_safe.noTagsParsed,
        measured: candidateAudit.t13_safe
      },
      T14_deep_normalized_outcome_parity_t01_t13: {
        pass: t14_pass,
        measured: t14_deep_parity
      }
    }
  };

  // Evaluate conjunction of all 14 assertions
  const assertionKeys = Object.keys(verificationOutput.assertions);
  const passedCount = assertionKeys.filter(k => verificationOutput.assertions[k].pass).length;
  const totalCount = assertionKeys.length;
  const overallPass = passedCount === totalCount;

  verificationOutput.summary = {
    total: totalCount,
    passed: passedCount,
    failed: totalCount - passedCount,
    verdict: overallPass ? "SELF_CHECK_PASS" : "FAIL"
  };

  console.log('----------------------------------------------------');
  console.log(`[VERIFICATION RESULT] ${passedCount}/${totalCount} assertions PASSED`);
  console.log(`[OVERALL VERDICT]     ${verificationOutput.summary.verdict}`);
  console.log('----------------------------------------------------');

  fs.writeFileSync(
    path.join(baseDir, 'VERIFICATION.json'),
    JSON.stringify(verificationOutput, null, 2),
    'utf8'
  );
  console.log('✓ VERIFICATION.json saved successfully!');

  await page.close();
  await browser.disconnect();

  if (!overallPass) {
    console.error('VERIFICATION SUITE FAILED!');
    process.exit(1);
  } else {
    console.log('VERIFICATION SUITE PASSED WITH RIGOROUS EVIDENCE!');
    process.exit(0);
  }
}

runTests().catch(err => {
  console.error('Fatal Verification Suite Error:', err);
  process.exit(1);
});
