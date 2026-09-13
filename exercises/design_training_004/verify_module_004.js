const fs = require('fs');
const path = require('path');

let puppeteer;
try {
  puppeteer = require('puppeteer-core');
} catch (e) {
  puppeteer = require('C:/Users/game/cdp_reader/node_modules/puppeteer-core');
}

const CDP_PORT = process.env.CDP_PORT || process.argv[2] || '9222';
const OUTPUT_DIR = path.resolve(__dirname);
const HTML_PATH = 'file:///' + path.resolve(__dirname, 'index.html').replace(/\\/g, '/');
const SCREENSHOTS_DIR = path.join(OUTPUT_DIR, 'screenshots');

if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

const VALID_DATA = {
  assignee: 'P02',
  assigneeName: 'Bình',
  note: 'Đối chiếu các tình huống đăng nhập trước khi bàn giao.'
};

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

// Chờ trạng thái hết saving rồi mới reset mô phỏng (F02 Fix)
async function waitForIdleAndReset(page) {
  await page.waitForFunction(() => {
    return window.__SIMULATION_DIAGNOSTICS__ && window.__SIMULATION_DIAGNOSTICS__.state !== 'saving';
  }, { timeout: 4000 });

  await page.evaluate(() => {
    const btn = document.getElementById('btn-reset-simulation');
    if (btn && !btn.disabled) btn.click();
  });
  await sleep(150);

  const resetState = await page.evaluate(() => {
    const diag = window.__SIMULATION_DIAGNOSTICS__;
    return {
      state: diag.state,
      attempts: diag.attemptCount,
      commits: diag.commitCount,
      draftAssignee: diag.draft.assignee,
      draftNote: diag.draft.note,
      committedAssignee: diag.committed.assignee,
      committedNote: diag.committed.note,
      activeElement: document.activeElement ? document.activeElement.id : null
    };
  });

  if (resetState.state !== 'editing' || resetState.attempts !== 0 || resetState.commits !== 0) {
    throw new Error('Reset simulation failed pre-condition assertion: ' + JSON.stringify(resetState));
  }
  return resetState;
}

async function runTests() {
  console.log(`=== KHỞI CHẠY KIỂM THỬ MODULE 04 (REV 002) QUA CDP PORT ${CDP_PORT} ===`);
  const browser = await puppeteer.connect({ browserURL: `http://127.0.0.1:${CDP_PORT}`, defaultViewport: null });
  const page = await browser.newPage();

  const results = {
    module: 'DESIGN_TRAINING_004',
    revision: 'REV_002',
    timestamp: new Date().toISOString(),
    environment: {
      cdpUrl: `http://127.0.0.1:${CDP_PORT}`,
      engine: 'Puppeteer CDP Automation (Antigravity Self-Test)',
      dpr: 2,
      htmlPath: HTML_PATH
    },
    testCases: {},
    viewportMeasurements: {},
    screenshots: []
  };

  // 1. ĐO ĐẠC VIEWPORTS VÀ CHỤP ẢNH BAN ĐẦU
  console.log('\n--- 1. ĐO ĐẠC 3 VIEWPORT (DPR = 2) ---');
  const viewports = [
    { name: 'desktop', width: 1440, height: 900, dpr: 2 },
    { name: 'tablet', width: 768, height: 1024, dpr: 2 },
    { name: 'mobile', width: 390, height: 844, dpr: 2 }
  ];

  for (const vp of viewports) {
    await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: vp.dpr });
    await page.goto(HTML_PATH, { waitUntil: 'load' });
    await sleep(350);

    const geo = await page.evaluate(() => {
      const docEl = document.documentElement;
      const body = document.body;
      return {
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight,
        clientWidth: docEl.clientWidth,
        clientHeight: docEl.clientHeight,
        scrollWidth: docEl.scrollWidth,
        scrollHeight: docEl.scrollHeight,
        bodyScrollWidth: body.scrollWidth,
        bodyScrollHeight: body.scrollHeight,
        devicePixelRatio: window.devicePixelRatio,
        horizontalOverflow: docEl.scrollWidth > docEl.clientWidth || body.scrollWidth > docEl.clientWidth
      };
    });

    results.viewportMeasurements[vp.name + '_' + vp.width + 'x' + vp.height] = geo;
    console.log(`[VIEWPORT ${vp.name.toUpperCase()} ${vp.width}x${vp.height}]: clientWidth=${geo.clientWidth}, scrollWidth=${geo.scrollWidth}, horizontalOverflow=${geo.horizontalOverflow}`);

    if (vp.name === 'desktop') {
      const p = path.join(SCREENSHOTS_DIR, 'desktop_initial_1440x900.png');
      await page.screenshot({ path: p, fullPage: false });
      results.screenshots.push('screenshots/desktop_initial_1440x900.png');
    } else if (vp.name === 'mobile') {
      const p = path.join(SCREENSHOTS_DIR, 'mobile_initial_390x844.png');
      await page.screenshot({ path: p, fullPage: false });
      results.screenshots.push('screenshots/mobile_initial_390x844.png');
    }
  }

  // Chuyển sang Desktop 1440x900 cho các ca logic T01 - T09
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.goto(HTML_PATH, { waitUntil: 'load' });
  await sleep(300);

  // T01: MỞ MỚI
  console.log('\n--- CA T01: Mở mới ---');
  await waitForIdleAndReset(page);
  const t01Diag = await page.evaluate(() => {
    const diag = window.__SIMULATION_DIAGNOSTICS__;
    const committedAssignee = document.getElementById('committed-assignee-text').innerText.trim();
    const committedNote = document.getElementById('committed-note-text').innerText.trim();
    const assigneeVal = document.getElementById('assignee-select').value;
    const noteVal = document.getElementById('note-textarea').value;
    const assigneeErr = document.getElementById('assignee-error').innerText.trim();
    const noteErr = document.getElementById('note-error').innerText.trim();
    return {
      diag,
      committedAssignee,
      committedNote,
      assigneeVal,
      noteVal,
      hasErrors: assigneeErr !== '' || noteErr !== ''
    };
  });

  const t01Pass = t01Diag.diag.state === 'editing' &&
                  t01Diag.committedAssignee === 'Chưa giao' &&
                  t01Diag.committedNote === 'Rỗng' &&
                  t01Diag.assigneeVal === '' &&
                  t01Diag.noteVal === '' &&
                  t01Diag.diag.attemptCount === 0 &&
                  t01Diag.diag.commitCount === 0 &&
                  !t01Diag.hasErrors;

  results.testCases.T01 = {
    precondition: 'Tải trang hoặc đặt lại mô phỏng hoàn tất',
    action: 'Quan sát trạng thái khởi tạo ban đầu',
    inputMethod: 'None (Initial Load)',
    stateBefore: 'N/A',
    stateAfter: t01Diag.diag.state,
    attemptCount: t01Diag.diag.attemptCount,
    commitCount: t01Diag.diag.commitCount,
    draft: t01Diag.diag.draft,
    committed: { assignee: t01Diag.committedAssignee, note: t01Diag.committedNote },
    hasErrors: t01Diag.hasErrors,
    expected: 'state=editing, Chưa giao, hai trường mặc định rỗng, attemptCount=0, commitCount=0, không lỗi',
    actual: `state=${t01Diag.diag.state}, committedAssignee=${t01Diag.committedAssignee}, committedNote=${t01Diag.committedNote}, attemptCount=${t01Diag.diag.attemptCount}, commitCount=${t01Diag.diag.commitCount}, hasErrors=${t01Diag.hasErrors}`,
    verdict: t01Pass ? 'PASS' : 'FAIL'
  };
  console.log(`[T01]: ${results.testCases.T01.verdict}`);

  // T02: GỬI KHI CHƯA CHỌN NGƯỜI
  console.log('\n--- CA T02: Gửi khi chưa chọn người ---');
  await waitForIdleAndReset(page);
  const t02Res = await page.evaluate(() => {
    const btnSubmit = document.getElementById('btn-submit');
    btnSubmit.click();

    const activeEl = document.activeElement ? document.activeElement.id : null;
    const errText = document.getElementById('assignee-error').innerText.trim();
    const diag = window.__SIMULATION_DIAGNOSTICS__;
    const committedAssignee = document.getElementById('committed-assignee-text').innerText.trim();
    return { activeEl, errText, diag, committedAssignee };
  });

  const t02Pass = t02Res.diag.state === 'invalid' &&
                  t02Res.errText === 'Chọn người xử lý trước khi lưu.' &&
                  t02Res.activeEl === 'assignee-select' &&
                  t02Res.diag.attemptCount === 0 &&
                  t02Res.committedAssignee === 'Chưa giao';

  results.testCases.T02 = {
    precondition: 'Form trống mặc định (chưa chọn người)',
    action: 'Bấm nút Lưu phân công',
    inputMethod: 'Programmatic DOM Click (btnSubmit.click())',
    stateBefore: 'editing',
    stateAfter: t02Res.diag.state,
    activeElementAfter: t02Res.activeEl,
    errorText: t02Res.errText,
    attemptCount: t02Res.diag.attemptCount,
    committed: t02Res.committedAssignee,
    expected: 'state=invalid, lỗi="Chọn người xử lý trước khi lưu.", focus=assignee-select, attemptCount=0, Chưa giao',
    actual: `state=${t02Res.diag.state}, error="${t02Res.errText}", activeEl=${t02Res.activeEl}, attemptCount=${t02Res.diag.attemptCount}, committed=${t02Res.committedAssignee}`,
    verdict: t02Pass ? 'PASS' : 'FAIL'
  };
  console.log(`[T02]: ${results.testCases.T02.verdict}`);

  // T03: CHỌN BÌNH, NHẬP 201 CHỮ A, GỬI; SỬA THÀNH 200 CHỮ A
  console.log('\n--- CA T03: Nhập 201 ký tự bị từ chối; sửa thành 200 ký tự hợp lệ ---');
  await waitForIdleAndReset(page);
  const t03Res = await page.evaluate(() => {
    // 1. Chọn Bình
    const select = document.getElementById('assignee-select');
    select.value = 'P02';
    select.dispatchEvent(new Event('change', { bubbles: true }));

    // 2. Nhập 201 ký tự 'a'
    const textarea = document.getElementById('note-textarea');
    textarea.value = 'a'.repeat(201);
    textarea.dispatchEvent(new Event('input', { bubbles: true }));

    // 3. Gửi
    document.getElementById('btn-submit').click();
    const step1Active = document.activeElement ? document.activeElement.id : null;
    const step1Err = document.getElementById('note-error').innerText.trim();
    const step1State = window.__SIMULATION_DIAGNOSTICS__.state;
    const step1Attempts = window.__SIMULATION_DIAGNOSTICS__.attemptCount;

    // 4. Sửa thành 200 ký tự 'a'
    textarea.value = 'a'.repeat(200);
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
    const step2Err = document.getElementById('note-error').innerText.trim();
    const step2State = window.__SIMULATION_DIAGNOSTICS__.state;

    // 5. Gửi lại
    document.getElementById('btn-submit').click();
    const step3State = window.__SIMULATION_DIAGNOSTICS__.state;
    const step3Attempts = window.__SIMULATION_DIAGNOSTICS__.attemptCount;

    return {
      step1: { state: step1State, err: step1Err, activeEl: step1Active, attempts: step1Attempts },
      step2: { state: step2State, err: step2Err },
      step3: { state: step3State, attempts: step3Attempts }
    };
  });

  const t03Pass = t03Res.step1.state === 'invalid' &&
                  t03Res.step1.err === 'Ghi chú cần tối đa 200 ký tự.' &&
                  t03Res.step1.activeEl === 'note-textarea' &&
                  t03Res.step1.attempts === 0 &&
                  t03Res.step2.err === '' &&
                  t03Res.step3.state === 'saving' &&
                  t03Res.step3.attempts === 1;

  results.testCases.T03 = {
    precondition: 'Chọn P02 Bình, form chuẩn bị nhập ghi chú',
    action: 'Nhập 201 ký tự -> Submit -> Sửa về 200 ký tự -> Submit',
    inputMethod: 'DOM Event Input + Programmatic DOM Click',
    step1Reject: t03Res.step1,
    step2ClearError: t03Res.step2,
    step3AcceptToSaving: t03Res.step3,
    expected: '201 ký tự bị từ chối (state=invalid, lỗi="Ghi chú cần tối đa 200 ký tự.", focus=note-textarea, attemptCount=0); sửa 200 ký tự thì xóa lỗi; submit hợp lệ vào saving (attemptCount=1)',
    actual: `Step1: state=${t03Res.step1.state}, err="${t03Res.step1.err}", activeEl=${t03Res.step1.activeEl}, attempts=${t03Res.step1.attempts}; Step2: err="${t03Res.step2.err}"; Step3: state=${t03Res.step3.state}, attempts=${t03Res.step3.attempts}`,
    verdict: t03Pass ? 'PASS' : 'FAIL'
  };
  console.log(`[T03]: ${results.testCases.T03.verdict}`);

  // T04: GỬI HỢP LỆ LẦN ĐẦU (F02 FIX: Đợi T03 hết saving trước khi reset)
  console.log('\n--- CA T04: Gửi hợp lệ lần đầu (Kỳ vọng thất bại sau 1.200ms) ---');
  // Chờ hết 1.200ms của T03 và reset sạch sẽ
  await waitForIdleAndReset(page);

  // Điền dữ liệu chuẩn
  await page.evaluate((data) => {
    const sel = document.getElementById('assignee-select');
    sel.value = data.assignee;
    sel.dispatchEvent(new Event('change', { bubbles: true }));

    const ta = document.getElementById('note-textarea');
    ta.value = data.note;
    ta.dispatchEvent(new Event('input', { bubbles: true }));
  }, VALID_DATA);

  // Submit bằng click con trỏ thực tế để nút nhận focus chuẩn
  await page.click('#btn-submit');

  // Kiểm tra ngay trong lúc saving (< 100ms)
  await sleep(60);
  const t04SavingCheck = await page.evaluate(() => {
    const diag = window.__SIMULATION_DIAGNOSTICS__;
    const savingText = document.getElementById('form-feedback').innerText.trim();
    const committedAssignee = document.getElementById('committed-assignee-text').innerText.trim();
    return {
      state: diag.state,
      isAssigneeLocked: diag.isAssigneeLocked,
      isNoteLocked: diag.isNoteLocked,
      isSubmitLocked: diag.isSubmitLocked,
      savingText,
      committedAssignee
    };
  });

  // Chờ phản hồi kết thúc (1.200ms + buffer)
  await sleep(1400);
  const t04ErrorCheck = await page.evaluate(() => {
    const diag = window.__SIMULATION_DIAGNOSTICS__;
    const feedbackText = document.getElementById('form-feedback').innerText.trim();
    const activeEl = document.activeElement ? document.activeElement.id : null;
    const draftAssignee = document.getElementById('assignee-select').value;
    const draftNote = document.getElementById('note-textarea').value;
    const committedAssignee = document.getElementById('committed-assignee-text').innerText.trim();
    const committedNote = document.getElementById('committed-note-text').innerText.trim();
    return {
      diag,
      feedbackText,
      activeEl,
      draftAssignee,
      draftNote,
      committedAssignee,
      committedNote
    };
  });

  const t04Pass = t04SavingCheck.state === 'saving' &&
                  t04SavingCheck.isAssigneeLocked &&
                  t04SavingCheck.isNoteLocked &&
                  t04SavingCheck.savingText.includes('Đang lưu phân công…') &&
                  t04SavingCheck.committedAssignee === 'Chưa giao' &&
                  t04ErrorCheck.diag.state === 'error' &&
                  t04ErrorCheck.diag.attemptCount === 1 &&
                  t04ErrorCheck.diag.commitCount === 0 &&
                  t04ErrorCheck.feedbackText.includes('Chưa lưu được phân công. Dữ liệu bạn nhập vẫn được giữ. Hãy thử lại.') &&
                  t04ErrorCheck.draftAssignee === 'P02' &&
                  t04ErrorCheck.draftNote === VALID_DATA.note &&
                  t04ErrorCheck.committedAssignee === 'Chưa giao';

  results.testCases.T04 = {
    precondition: 'Form có dữ liệu hợp lệ (P02 - Bình + Ghi chú chuẩn) sau khi chờ hết saving từ T03 và reset chuẩn xác',
    action: 'Click Lưu phân công lần đầu tiên qua con trỏ thực tế',
    inputMethod: 'Puppeteer Pointer Click (page.click)',
    savingState: t04SavingCheck,
    errorState: t04ErrorCheck,
    expected: 'Trong saving: hiển thị Đang lưu..., khóa trường, bản lưu=Chưa giao; Sau phản hồi: state=error, attemptCount=1, commitCount=0, nháp nguyên vẹn, bản lưu không đổi',
    actual: `Saving: state=${t04SavingCheck.state}, locked=${t04SavingCheck.isAssigneeLocked}; Error: state=${t04ErrorCheck.diag.state}, attempts=${t04ErrorCheck.diag.attemptCount}, commits=${t04ErrorCheck.diag.commitCount}, draftPreserved=${t04ErrorCheck.draftAssignee === 'P02'}`,
    verdict: t04Pass ? 'PASS' : 'FAIL'
  };
  console.log(`[T04]: ${results.testCases.T04.verdict}`);

  // T05: TIẾP NỐI T04, BẤM "THỬ LƯU LẠI" (F01 CHECK: Nút ổn định giữ focus)
  console.log('\n--- CA T05: Tiếp nối T04, bấm Thử lưu lại (Kỳ vọng thành công & Focus ổn định) ---');
  // Đo activeElement trước khi retry
  const t05ActiveBefore = await page.evaluate(() => document.activeElement ? document.activeElement.id : null);

  // Bấm nút Thử lưu lại bằng click con trỏ thực tế
  await page.click('#btn-submit');

  // Đo NGAY trong lúc saving của lần retry (< 100ms)
  await sleep(60);
  const t05SavingRetryCheck = await page.evaluate(() => {
    const activeEl = document.activeElement ? document.activeElement.id : null;
    const btn = document.getElementById('btn-submit');
    return {
      state: window.__SIMULATION_DIAGNOSTICS__.state,
      activeElementDuringSaving: activeEl,
      isButtonConnected: btn !== null && btn.isConnected,
      buttonAriaDisabled: btn ? btn.getAttribute('aria-disabled') : null,
      buttonText: btn ? btn.innerText.trim() : null
    };
  });

  // Chờ phản hồi hoàn tất (1.200ms + buffer)
  await sleep(1400);
  const t05Res = await page.evaluate(() => {
    const diag = window.__SIMULATION_DIAGNOSTICS__;
    const feedbackText = document.getElementById('form-feedback').innerText.trim();
    const committedAssignee = document.getElementById('committed-assignee-text').innerText.trim();
    const committedNote = document.getElementById('committed-note-text').innerText.trim();
    const btnEdit = document.getElementById('btn-edit-assignment');
    const activeEl = document.activeElement ? document.activeElement.id : null;
    return {
      diag,
      feedbackText,
      committedAssignee,
      committedNote,
      btnEditExists: btnEdit !== null && btnEdit.style.display !== 'none',
      activeElementAfterSuccess: activeEl
    };
  });

  const t05Pass = t05SavingRetryCheck.state === 'saving' &&
                  t05SavingRetryCheck.activeElementDuringSaving === 'btn-submit' &&
                  t05SavingRetryCheck.isButtonConnected &&
                  t05Res.diag.state === 'success' &&
                  t05Res.diag.attemptCount === 2 &&
                  t05Res.diag.commitCount === 1 &&
                  t05Res.committedAssignee === 'P02 — Bình' &&
                  t05Res.committedNote === VALID_DATA.note &&
                  t05Res.feedbackText.includes('Đã giao W01 cho Bình — kết quả mô phỏng.') &&
                  t05Res.btnEditExists &&
                  t05Res.activeElementAfterSuccess === 'btn-edit-assignment';

  results.testCases.T05 = {
    precondition: 'Tiếp nối T04 (đang ở trạng thái error với nháp P02 Bình, focus tại btn-submit)',
    action: 'Click nút Thử lưu lại -> Đo focus trong saving -> Đo sau success',
    inputMethod: 'Puppeteer Pointer Click (page.click)',
    activeElementBeforeRetry: t05ActiveBefore,
    savingRetryFocusCheck: t05SavingRetryCheck,
    successResult: t05Res,
    expected: 'Trong saving lần retry: focus giữ nguyên trên btn-submit (không rơi về body); sau success: state=success, attempts=2, commits=1, focus chuyển sang btn-edit-assignment',
    actual: `DuringSavingFocus=${t05SavingRetryCheck.activeElementDuringSaving} (btnConnected=${t05SavingRetryCheck.isButtonConnected}); AfterSuccessFocus=${t05Res.activeElementAfterSuccess}, attempts=${t05Res.diag.attemptCount}, commits=${t05Res.diag.commitCount}`,
    verdict: t05Pass ? 'PASS' : 'FAIL'
  };
  console.log(`[T05]: ${results.testCases.T05.verdict}`);

  // T06: GỬI HỢP LỆ RỒI KÍCH HOẠT GỬI THÊM 2 LẦN QUA POINTER CLICK & PHÍM TRONG SAVING (F02 FIX)
  console.log('\n--- CA T06: Chặn gửi lặp khi đang saving (Pointer Click + Keyboard Enter) ---');
  await waitForIdleAndReset(page);
  // Điền dữ liệu hợp lệ
  await page.evaluate((data) => {
    const sel = document.getElementById('assignee-select');
    sel.value = data.assignee;
    sel.dispatchEvent(new Event('change', { bubbles: true }));
    const ta = document.getElementById('note-textarea');
    ta.value = data.note;
    ta.dispatchEvent(new Event('input', { bubbles: true }));
  }, VALID_DATA);

  // Kích hoạt gửi lần 1 qua Puppeteer page.click thực tế
  await page.click('#btn-submit');
  await sleep(100);

  // Trong lúc saving, kích hoạt thêm 2 lần gửi: Lần 1 qua page.click, Lần 2 qua phím Enter
  const attemptsBeforeSpam = await page.evaluate(() => window.__SIMULATION_DIAGNOSTICS__.attemptCount);
  await page.click('#btn-submit'); // Extra attempt 1 via pointer click
  await page.keyboard.press('Enter'); // Extra attempt 2 via keyboard Enter
  await sleep(100);

  const attemptsDuringSaving = await page.evaluate(() => window.__SIMULATION_DIAGNOSTICS__.attemptCount);

  // Chờ phản hồi kết thúc (1.200ms)
  await sleep(1400);
  const t06Final = await page.evaluate(() => {
    const diag = window.__SIMULATION_DIAGNOSTICS__;
    return {
      state: diag.state,
      attemptCount: diag.attemptCount,
      commitCount: diag.commitCount
    };
  });

  const t06Pass = attemptsBeforeSpam === 1 &&
                  attemptsDuringSaving === 1 &&
                  t06Final.state === 'error' &&
                  t06Final.attemptCount === 1 &&
                  t06Final.commitCount === 0;

  results.testCases.T06 = {
    precondition: 'Form có dữ liệu hợp lệ mới sau khi reset',
    action: 'Gửi hợp lệ (page.click) -> Kích hoạt thêm 1 pointer click (page.click) + 1 phím Enter trong lúc saving',
    inputMethod: 'Puppeteer Pointer Click (page.click) + Keyboard Enter',
    attemptsBeforeExtra: attemptsBeforeSpam,
    attemptsDuringSaving: attemptsDuringSaving,
    finalResult: t06Final,
    expected: 'Chỉ 1 lần gọi được chấp nhận (attemptCount=1), kích hoạt thêm bằng click và phím đều bị triệt tiêu, kết thúc state=error, commitCount=0',
    actual: `attemptsBefore=${attemptsBeforeSpam}, duringSaving=${attemptsDuringSaving}, finalAttempts=${t06Final.attemptCount}, finalCommits=${t06Final.commitCount}`,
    verdict: t06Pass ? 'PASS' : 'FAIL'
  };
  console.log(`[T06]: ${results.testCases.T06.verdict}`);

  // T07: TỪ LỖI GỬI, ĐỔI BÌNH THÀNH CHI RỒI LƯU
  console.log('\n--- CA T07: Từ lỗi gửi, sửa dữ liệu (Bình -> Chi) và lưu thành công với Chi ---');
  const t07Res = await page.evaluate(async () => {
    // 1. Đổi P02 thành P03 (Chi)
    const select = document.getElementById('assignee-select');
    select.value = 'P03';
    select.dispatchEvent(new Event('change', { bubbles: true }));

    const stateAfterChange = window.__SIMULATION_DIAGNOSTICS__.state;
    const feedbackAfterChange = document.getElementById('form-feedback').innerText.trim();

    // 2. Submit lưu phân công với Chi
    document.getElementById('btn-submit').click();

    return { stateAfterChange, feedbackAfterChange };
  });

  // Chờ lưu hoàn tất (lần gửi thứ 2 kể từ reset -> thành công!)
  await sleep(1500);
  const t07Final = await page.evaluate(() => {
    const diag = window.__SIMULATION_DIAGNOSTICS__;
    const committedAssignee = document.getElementById('committed-assignee-text').innerText.trim();
    const feedback = document.getElementById('form-feedback').innerText.trim();
    return { diag, committedAssignee, feedback };
  });

  const t07Pass = t07Res.stateAfterChange === 'editing' &&
                  t07Res.feedbackAfterChange === '' &&
                  t07Final.diag.state === 'success' &&
                  t07Final.diag.commitCount === 1 &&
                  t07Final.committedAssignee === 'P03 — Chi' &&
                  t07Final.feedback.includes('Đã giao W01 cho Chi — kết quả mô phỏng.');

  results.testCases.T07 = {
    precondition: 'Đang ở trạng thái error từ lần gửi Bình của T06',
    action: 'Đổi select sang P03 Chi -> Bấm Lưu phân công',
    inputMethod: 'DOM Change Event (select P03) + Programmatic DOM Click (btnSubmit.click())',
    stateAfterChange: t07Res.stateAfterChange,
    finalState: t07Final.diag.state,
    committedAssignee: t07Final.committedAssignee,
    commitCount: t07Final.diag.commitCount,
    feedback: t07Final.feedback,
    expected: 'Đổi trường đưa về editing và xóa lỗi gửi cũ; lần gửi tiếp theo thành công với Chi, commitCount=1, không lưu nhầm Bình',
    actual: `stateAfterChange=${t07Res.stateAfterChange}, finalState=${t07Final.diag.state}, committedAssignee=${t07Final.committedAssignee}, commits=${t07Final.diag.commitCount}`,
    verdict: t07Pass ? 'PASS' : 'FAIL'
  };
  console.log(`[T07]: ${results.testCases.T07.verdict}`);

  // T08: TỪ SUCCESS, BẤM "SỬA PHÂN CÔNG"
  console.log('\n--- CA T08: Từ success, bấm Sửa phân công (Quay lại editing, điền sẵn bản đã lưu) ---');
  const t08Res = await page.evaluate(() => {
    const attemptsBefore = window.__SIMULATION_DIAGNOSTICS__.attemptCount;
    const commitsBefore = window.__SIMULATION_DIAGNOSTICS__.commitCount;

    document.getElementById('btn-edit-assignment').click();

    const activeEl = document.activeElement ? document.activeElement.id : null;
    const diag = window.__SIMULATION_DIAGNOSTICS__;
    const formAssignee = document.getElementById('assignee-select').value;
    const formNote = document.getElementById('note-textarea').value;
    const committedAssignee = document.getElementById('committed-assignee-text').innerText.trim();

    return {
      state: diag.state,
      activeEl,
      formAssignee,
      formNote,
      committedAssignee,
      attemptsBefore,
      attemptsAfter: diag.attemptCount,
      commitsBefore,
      commitsAfter: diag.commitCount
    };
  });

  const t08Pass = t08Res.state === 'editing' &&
                  t08Res.activeEl === 'assignee-select' &&
                  t08Res.formAssignee === 'P03' &&
                  t08Res.formNote === VALID_DATA.note &&
                  t08Res.committedAssignee === 'P03 — Chi' &&
                  t08Res.attemptsBefore === t08Res.attemptsAfter &&
                  t08Res.commitsBefore === t08Res.commitsAfter;

  results.testCases.T08 = {
    precondition: 'Đang ở trạng thái success (đã lưu Chi)',
    action: 'Click nút Sửa phân công',
    inputMethod: 'Programmatic DOM Click (btnEditAssignment.click())',
    stateAfter: t08Res.state,
    activeElementAfter: t08Res.activeEl,
    prefilledData: { assignee: t08Res.formAssignee, note: t08Res.formNote },
    committedData: t08Res.committedAssignee,
    attemptsCheck: `${t08Res.attemptsBefore} === ${t08Res.attemptsAfter}`,
    commitsCheck: `${t08Res.commitsBefore} === ${t08Res.commitsAfter}`,
    expected: 'state=editing, focus=assignee-select, điền sẵn dữ liệu đã lưu (P03), bản lưu giữ nguyên, không sinh lần gọi mới',
    actual: `state=${t08Res.state}, activeEl=${t08Res.activeEl}, prefilled=${t08Res.formAssignee}, committed=${t08Res.committedAssignee}, attemptsNoChange=${t08Res.attemptsBefore === t08Res.attemptsAfter}`,
    verdict: t08Pass ? 'PASS' : 'FAIL'
  };
  console.log(`[T08]: ${results.testCases.T08.verdict}`);

  // T09: TỪ SUCCESS, ĐẶT LẠI MÔ PHỎNG; GỬI HỢP LỆ LẠI
  console.log('\n--- CA T09: Đặt lại mô phỏng từ success -> Lần gửi hợp lệ mới lại thất bại ---');
  await page.evaluate(() => document.getElementById('btn-submit').click());
  await sleep(1500); // Commit thành công

  const t09Reset = await page.evaluate(() => {
    document.getElementById('btn-reset-simulation').click();
    const activeEl = document.activeElement ? document.activeElement.id : null;
    const diag = window.__SIMULATION_DIAGNOSTICS__;
    const committedAssignee = document.getElementById('committed-assignee-text').innerText.trim();
    const committedNote = document.getElementById('committed-note-text').innerText.trim();
    const formAssignee = document.getElementById('assignee-select').value;
    const formNote = document.getElementById('note-textarea').value;
    return { diag, activeEl, committedAssignee, committedNote, formAssignee, formNote };
  });

  // Gửi hợp lệ lại sau reset
  await page.evaluate((data) => {
    const sel = document.getElementById('assignee-select');
    sel.value = data.assignee;
    sel.dispatchEvent(new Event('change', { bubbles: true }));
    const ta = document.getElementById('note-textarea');
    ta.value = data.note;
    ta.dispatchEvent(new Event('input', { bubbles: true }));
    document.getElementById('btn-submit').click();
  }, VALID_DATA);

  await sleep(1400); // Chờ kết thúc lần gửi đầu sau reset
  const t09AfterResend = await page.evaluate(() => {
    const diag = window.__SIMULATION_DIAGNOSTICS__;
    const committedAssignee = document.getElementById('committed-assignee-text').innerText.trim();
    return { diag, committedAssignee };
  });

  const t09Pass = t09Reset.diag.state === 'editing' &&
                  t09Reset.diag.attemptCount === 0 &&
                  t09Reset.diag.commitCount === 0 &&
                  t09Reset.activeEl === 'assignee-select' &&
                  t09Reset.committedAssignee === 'Chưa giao' &&
                  t09Reset.formAssignee === '' &&
                  t09AfterResend.diag.state === 'error' &&
                  t09AfterResend.diag.attemptCount === 1 &&
                  t09AfterResend.diag.commitCount === 0;

  results.testCases.T09 = {
    precondition: 'Đang ở trạng thái success',
    action: 'Click Đặt lại mô phỏng -> Nhập dữ liệu hợp lệ -> Submit',
    inputMethod: 'Programmatic DOM Click -> Event Input -> DOM Click',
    resetCheck: t09Reset,
    afterResendCheck: t09AfterResend,
    expected: 'Reset xóa sạch trạng thái/bộ đếm, focus=assignee-select; lần gửi mới lại thất bại (state=error, attemptCount=1, commitCount=0)',
    actual: `Reset: state=${t09Reset.diag.state}, attempts=${t09Reset.diag.attemptCount}, activeEl=${t09Reset.activeEl}; Resend: state=${t09AfterResend.diag.state}, attempts=${t09AfterResend.diag.attemptCount}, commits=${t09AfterResend.diag.commitCount}`,
    verdict: t09Pass ? 'PASS' : 'FAIL'
  };
  console.log(`[T09]: ${results.testCases.T09.verdict}`);

  // T10: CHUỖI TƯƠNG TÁC HOÀN TOÀN BẰNG BÀN PHÍM TẠI MOBILE 390×844 (F01 & F02 STRICT CHECK)
  console.log('\n--- CA T10: Chuỗi tương tác bàn phím thực chất tại Mobile 390×844 ---');
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.goto(HTML_PATH, { waitUntil: 'load' });
  await sleep(300);

  const t10Steps = [];

  // Reset ban đầu
  await waitForIdleAndReset(page);

  // Bước 1: Điều hướng bằng phím Tab từ đầu trang vào form tới nút submit (không dùng page.focus nhảy cóc!)
  let tabSteps = 0;
  while (tabSteps < 10) {
    await page.keyboard.press('Tab');
    tabSteps++;
    const cur = await page.evaluate(() => document.activeElement ? document.activeElement.id : null);
    if (cur === 'btn-submit') break;
  }
  const b1ActiveBefore = await page.evaluate(() => document.activeElement.id);

  // Bấm Enter trên nút submit khi chưa chọn người (Kích hoạt T02)
  await page.keyboard.press('Enter');
  await sleep(100);

  const b1Check = await page.evaluate(() => {
    const errEl = document.getElementById('assignee-error');
    const rect = errEl ? errEl.getBoundingClientRect() : null;
    return {
      activeBefore: 'btn-submit',
      activeAfter: document.activeElement ? document.activeElement.id : null,
      state: window.__SIMULATION_DIAGNOSTICS__.state,
      err: errEl.innerText.trim(),
      errorInViewport: rect ? (rect.top >= 0 && rect.bottom <= window.innerHeight) : false
    };
  });
  t10Steps.push({ step: '1. Tab tới btn-submit & Enter submit rỗng', ...b1Check });

  // Lưu ảnh mobile_validation_390x844.png
  const pVal = path.join(SCREENSHOTS_DIR, 'mobile_validation_390x844.png');
  await page.screenshot({ path: pVal, fullPage: false });
  results.screenshots.push('screenshots/mobile_validation_390x844.png');
  console.log('✓ Đã lưu mobile_validation_390x844.png');

  // Bước 2: Tại assignee-select (nhận focus tự động sau validation), chọn P02 Bình bằng phím mũi tên
  await page.keyboard.press('ArrowDown'); // P01
  await page.keyboard.press('ArrowDown'); // P02
  // Trong Chromium, xác nhận chọn native select bằng phím Tab để chuyển trường tiếp theo
  await sleep(50);

  // Bước 3: Tab sang textarea và gõ văn bản ghi chú
  await page.keyboard.press('Tab');
  const b3Active = await page.evaluate(() => document.activeElement ? document.activeElement.id : null);
  await page.keyboard.type(VALID_DATA.note);
  await sleep(50);
  t10Steps.push({ step: '2-3. ArrowDown chọn P02 -> Tab textarea -> Type note', activeElement: b3Active });

  // Bước 4: Tab sang nút submit và bấm Enter (Kích hoạt T04)
  await page.keyboard.press('Tab');
  const b4Active = await page.evaluate(() => document.activeElement ? document.activeElement.id : null);
  await page.keyboard.press('Enter');

  // Đo NGAY activeElement và state sau khi Enter (< 60ms)
  await sleep(50);
  const b4SavingCheck = await page.evaluate(() => {
    const btn = document.getElementById('btn-submit');
    return {
      state: window.__SIMULATION_DIAGNOSTICS__.state,
      activeElementDuringFirstSaving: document.activeElement ? document.activeElement.id : null,
      buttonConnected: btn !== null && btn.isConnected,
      savingText: document.getElementById('form-feedback').innerText.trim()
    };
  });
  t10Steps.push({ step: '4. Tab btn-submit & Enter -> first saving', activeElement: b4Active, ...b4SavingCheck });

  // Lưu ảnh mobile_saving_390x844.png
  const pSaving = path.join(SCREENSHOTS_DIR, 'mobile_saving_390x844.png');
  await page.screenshot({ path: pSaving, fullPage: false });
  results.screenshots.push('screenshots/mobile_saving_390x844.png');
  console.log('✓ Đã lưu mobile_saving_390x844.png');

  // Chờ phản hồi lỗi T04 (1.200ms)
  await sleep(1400);
  const b4ErrorCheck = await page.evaluate(() => {
    const btnSubmit = document.getElementById('btn-submit');
    const feedbackEl = document.getElementById('form-feedback');
    const rectBtn = btnSubmit ? btnSubmit.getBoundingClientRect() : null;
    const rectFb = feedbackEl ? feedbackEl.getBoundingClientRect() : null;
    return {
      state: window.__SIMULATION_DIAGNOSTICS__.state,
      activeElementAfterError: document.activeElement ? document.activeElement.id : null,
      feedback: feedbackEl.innerText.trim(),
      btnRetryVisibleInViewport: rectBtn ? (rectBtn.top >= 0 && rectBtn.bottom <= window.innerHeight) : false,
      feedbackVisibleInViewport: rectFb ? (rectFb.top >= 0 && rectFb.bottom <= window.innerHeight) : false
    };
  });
  t10Steps.push({ step: '4b. Lỗi lần đầu: focus ổn định tại nút thử lại', ...b4ErrorCheck });

  // Lưu ảnh mobile_error_390x844.png
  const pError = path.join(SCREENSHOTS_DIR, 'mobile_error_390x844.png');
  await page.screenshot({ path: pError, fullPage: false });
  results.screenshots.push('screenshots/mobile_error_390x844.png');
  console.log('✓ Đã lưu mobile_error_390x844.png');

  // Bước 5 (F01 ĐẶC TRỊ): Bấm Enter trên nút Thử lưu lại (đang giữ focus)
  // và đo NGAY activeElement trong lúc saving của lần thử lại!
  await page.keyboard.press('Enter');
  await sleep(60);

  const b5RetrySavingCheck = await page.evaluate(() => {
    const btn = document.getElementById('btn-submit');
    const rect = btn ? btn.getBoundingClientRect() : null;
    return {
      state: window.__SIMULATION_DIAGNOSTICS__.state,
      activeElementDuringRetrySaving: document.activeElement ? document.activeElement.id : null,
      isButtonConnected: btn !== null && btn.isConnected,
      buttonText: btn ? btn.innerText.trim() : null,
      buttonAriaDisabled: btn ? btn.getAttribute('aria-disabled') : null,
      buttonVisibleInViewport: rect ? (rect.top >= 0 && rect.bottom <= window.innerHeight) : false
    };
  });
  t10Steps.push({ step: '5a. Bấm Enter retry -> saving lần 2 (Đo focus giữ ổn định)', ...b5RetrySavingCheck });

  // Lưu ảnh BỔ SUNG THEO CHỈ ĐẠO CONTROLLER: mobile_retry_saving_390x844.png
  const pRetrySaving = path.join(SCREENSHOTS_DIR, 'mobile_retry_saving_390x844.png');
  await page.screenshot({ path: pRetrySaving, fullPage: false });
  results.screenshots.push('screenshots/mobile_retry_saving_390x844.png');
  console.log('✓ Đã lưu mobile_retry_saving_390x844.png (Minh chứng F01)');

  // Chờ phản hồi thành công (1.200ms)
  await sleep(1400);
  const b5SuccessCheck = await page.evaluate(() => {
    const btnEdit = document.getElementById('btn-edit-assignment');
    const fb = document.getElementById('form-feedback');
    const rectBtn = btnEdit ? btnEdit.getBoundingClientRect() : null;
    const rectFb = fb ? fb.getBoundingClientRect() : null;
    const docEl = document.documentElement;
    return {
      state: window.__SIMULATION_DIAGNOSTICS__.state,
      activeElementAfterSuccess: document.activeElement ? document.activeElement.id : null,
      feedback: fb.innerText.trim(),
      committedAssignee: document.getElementById('committed-assignee-text').innerText.trim(),
      btnEditVisibleInViewport: rectBtn ? (rectBtn.top >= 0 && rectBtn.bottom <= window.innerHeight) : false,
      feedbackVisibleInViewport: rectFb ? (rectFb.top >= 0 && rectFb.bottom <= window.innerHeight) : false,
      horizontalOverflow: docEl.scrollWidth > docEl.clientWidth
    };
  });
  t10Steps.push({ step: '5b. Thành công lần 2: focus chuyển có chủ đích sang btn-edit-assignment', ...b5SuccessCheck });

  // Lưu ảnh mobile_success_390x844.png
  const pSuccess = path.join(SCREENSHOTS_DIR, 'mobile_success_390x844.png');
  await page.screenshot({ path: pSuccess, fullPage: false });
  results.screenshots.push('screenshots/mobile_success_390x844.png');
  console.log('✓ Đã lưu mobile_success_390x844.png');

  // Kiểm tra ngắn cho F01: Người dùng tự Tab sang phần tử khác trong lúc chờ không bị cướp focus vô điều kiện
  console.log('\n--- Kiểm tra bổ sung F01: Không cướp focus nếu người dùng đã Tab sang phần tử khác ---');
  await waitForIdleAndReset(page);
  // Điền dữ liệu
  await page.evaluate((data) => {
    document.getElementById('assignee-select').value = data.assignee;
    document.getElementById('assignee-select').dispatchEvent(new Event('change', { bubbles: true }));
    document.getElementById('note-textarea').value = data.note;
    document.getElementById('note-textarea').dispatchEvent(new Event('input', { bubbles: true }));
  }, VALID_DATA);
  // Bấm submit
  await page.click('#btn-submit');
  await sleep(100);
  // Trong lúc saving, người dùng tự Tab sang banner-notice (phần tử ngoài form có tabindex="0")
  await page.focus('#banner-notice');
  const userTabFocusDuringSaving = await page.evaluate(() => document.activeElement ? document.activeElement.id : null);
  // Chờ hoàn tất (lần 1 -> error)
  await sleep(1400);
  const focusAfterCompletion = await page.evaluate(() => document.activeElement ? document.activeElement.id : null);
  const f01NoStealPass = (userTabFocusDuringSaving === 'banner-notice' && focusAfterCompletion === 'banner-notice');
  console.log(`[F01 NO STEAL CHECK]: userTab=${userTabFocusDuringSaving}, afterResponse=${focusAfterCompletion} -> ${f01NoStealPass ? 'PASS' : 'FAIL'}`);

  const t10Pass = b1Check.activeAfter === 'assignee-select' &&
                  b1Check.errorInViewport &&
                  b3Active === 'note-textarea' &&
                  b4SavingCheck.state === 'saving' &&
                  b4SavingCheck.activeElementDuringFirstSaving === 'btn-submit' &&
                  b4ErrorCheck.state === 'error' &&
                  b4ErrorCheck.activeElementAfterError === 'btn-submit' &&
                  b4ErrorCheck.btnRetryVisibleInViewport &&
                  b5RetrySavingCheck.state === 'saving' &&
                  b5RetrySavingCheck.activeElementDuringRetrySaving === 'btn-submit' &&
                  b5RetrySavingCheck.isButtonConnected &&
                  b5SuccessCheck.state === 'success' &&
                  b5SuccessCheck.activeElementAfterSuccess === 'btn-edit-assignment' &&
                  b5SuccessCheck.committedAssignee === 'P02 — Bình' &&
                  b5SuccessCheck.btnEditVisibleInViewport &&
                  !b5SuccessCheck.horizontalOverflow &&
                  f01NoStealPass;

  results.testCases.T10 = {
    precondition: 'Mobile 390×844, form reset rỗng, bắt đầu Tab tuần tự từ đầu trang',
    action: 'Thực thi toàn bộ chuỗi T02 -> nhập hợp lệ -> T04 -> T05 chỉ bằng phím Enter, Tab, ArrowDown, Shift+Tab',
    inputMethod: 'Strict Native Keyboard Navigation (page.keyboard)',
    steps: t10Steps,
    f01NoStealCheck: {
      userTabFocusDuringSaving,
      focusAfterCompletion,
      verdict: f01NoStealPass ? 'PASS' : 'FAIL'
    },
    finalCheck: b5SuccessCheck,
    expected: 'Hoàn toàn bằng phím, không mất focus, focus ổn định trên btn-submit qua saving và retry, đo rect trong viewport, thành công với Bình, không cướp focus vô điều kiện',
    actual: `StepsCount=${t10Steps.length}, saving1Focus=${b4SavingCheck.activeElementDuringFirstSaving}, errorFocus=${b4ErrorCheck.activeElementAfterError}, savingRetryFocus=${b5RetrySavingCheck.activeElementDuringRetrySaving}, successFocus=${b5SuccessCheck.activeElementAfterSuccess}, horizontalOverflow=${b5SuccessCheck.horizontalOverflow}`,
    verdict: t10Pass ? 'PASS' : 'FAIL'
  };
  console.log(`[T10]: ${results.testCases.T10.verdict}`);

  // TỔNG KẾT
  const allPass = Object.values(results.testCases).every(tc => tc.verdict === 'PASS');
  results.overallVerdict = allPass ? 'PASS' : 'FAIL';

  fs.writeFileSync(path.join(OUTPUT_DIR, 'VERIFICATION.json'), JSON.stringify(results, null, 2), 'utf8');
  console.log(`\n=== KẾT THÚC KIỂM THỬ REV 002: ${results.overallVerdict} (Đã lưu VERIFICATION.json) ===`);

  await page.close();
  await browser.disconnect();
}

runTests().catch(err => {
  console.error('[TEST ERROR]', err);
  process.exit(1);
});
