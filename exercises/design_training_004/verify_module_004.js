const puppeteer = require('C:/Users/game/cdp_reader/node_modules/puppeteer-core');
const fs = require('fs');
const path = require('path');

const HTML_PATH = 'file:///C:/Users/game/.gemini/exercises/design_training_004/index.html';
const OUTPUT_DIR = 'C:/Users/game/.gemini/exercises/design_training_004';
const SCREENSHOTS_DIR = path.join(OUTPUT_DIR, 'screenshots');

const VALID_DATA = {
  assignee: 'P02',
  assigneeName: 'Bình',
  note: 'Đối chiếu các tình huống đăng nhập trước khi bàn giao.'
};

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function runTests() {
  console.log('=== KHỞI CHẠY KIỂM THỬ TỰ ĐỘNG MODULE 04 (DESIGN_TRAINING_004) ===');
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9223', defaultViewport: null });
  const page = await browser.newPage();

  const results = {
    module: 'DESIGN_TRAINING_004',
    timestamp: new Date().toISOString(),
    environment: {
      cdpUrl: 'http://127.0.0.1:9223',
      engine: 'Puppeteer CDP Automation (Antigravity Self-Test)',
      dpr: 2
    },
    testCases: {},
    viewportMeasurements: {},
    screenshots: []
  };

  // 1. ĐO ĐẠC HÌNH HỌC 3 VIEWPORT VÀ CHỤP ẢNH INITIAL
  console.log('\n--- 1. ĐO ĐẠC VIEWPORT & CHỤP ẢNH BAN ĐẦU ---');
  const viewports = [
    { name: 'desktop', width: 1440, height: 900, dpr: 2 },
    { name: 'tablet', width: 768, height: 1024, dpr: 2 },
    { name: 'mobile', width: 390, height: 844, dpr: 2 }
  ];

  for (const vp of viewports) {
    await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: vp.dpr });
    await page.goto(HTML_PATH, { waitUntil: 'load' });
    await sleep(400);

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
      results.screenshots.push('desktop_initial_1440x900.png');
      console.log('✓ Đã lưu desktop_initial_1440x900.png');
    } else if (vp.name === 'mobile') {
      const p = path.join(SCREENSHOTS_DIR, 'mobile_initial_390x844.png');
      await page.screenshot({ path: p, fullPage: false });
      results.screenshots.push('mobile_initial_390x844.png');
      console.log('✓ Đã lưu mobile_initial_390x844.png');
    }
  }

  // Chuyển sang Desktop chuẩn 1440x900 để kiểm thử logic tổng quát T01 - T09
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.goto(HTML_PATH, { waitUntil: 'load' });
  await sleep(300);

  // Helper hàm reset mô phỏng
  async function resetSimulation() {
    await page.evaluate(() => {
      const btn = document.getElementById('btn-reset-simulation');
      if (btn) btn.click();
    });
    await sleep(100);
  }

  // T01: MỞ MỚI
  console.log('\n--- CA T01: Mở mới ---');
  await resetSimulation();
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
    precondition: 'Tải trang hoặc đặt lại mô phỏng',
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
  await resetSimulation();
  const t02Res = await page.evaluate(async () => {
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
    action: 'Click nút Lưu phân công',
    inputMethod: 'Pointer Click (btn-submit)',
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
  await resetSimulation();
  const t03Res = await page.evaluate(async () => {
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
    inputMethod: 'DOM Event Input + Pointer Click',
    step1Reject: t03Res.step1,
    step2ClearError: t03Res.step2,
    step3AcceptToSaving: t03Res.step3,
    expected: '201 ký tự bị từ chối (state=invalid, lỗi="Ghi chú cần tối đa 200 ký tự.", focus=note-textarea, attemptCount=0); sửa 200 ký tự thì xóa lỗi; submit hợp lệ vào saving (attemptCount=1)',
    actual: `Step1: state=${t03Res.step1.state}, err="${t03Res.step1.err}", activeEl=${t03Res.step1.activeEl}, attempts=${t03Res.step1.attempts}; Step2: err="${t03Res.step2.err}"; Step3: state=${t03Res.step3.state}, attempts=${t03Res.step3.attempts}`,
    verdict: t03Pass ? 'PASS' : 'FAIL'
  };
  console.log(`[T03]: ${results.testCases.T03.verdict}`);

  // T04: NHẬP DỮ LIỆU HỢP LỆ VÀ GỬI LẦN ĐẦU
  console.log('\n--- CA T04: Gửi hợp lệ lần đầu (Kỳ vọng thất bại sau 1.200ms) ---');
  await resetSimulation();
  // Điền dữ liệu chuẩn
  await page.evaluate((data) => {
    const sel = document.getElementById('assignee-select');
    sel.value = data.assignee;
    sel.dispatchEvent(new Event('change', { bubbles: true }));

    const ta = document.getElementById('note-textarea');
    ta.value = data.note;
    ta.dispatchEvent(new Event('input', { bubbles: true }));
  }, VALID_DATA);

  // Submit
  await page.evaluate(() => document.getElementById('btn-submit').click());

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

  // Chờ phản hồi kết thúc (1.200ms + buffer 200ms = 1.400ms)
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
    precondition: 'Form có dữ liệu hợp lệ (P02 - Bình + Ghi chú chuẩn)',
    action: 'Click Lưu phân công lần đầu tiên',
    inputMethod: 'Pointer Click (btn-submit)',
    savingState: t04SavingCheck,
    errorState: t04ErrorCheck,
    expected: 'Trong saving: hiển thị Đang lưu..., khóa trường, bản lưu=Chưa giao; Sau phản hồi: state=error, attemptCount=1, commitCount=0, nháp nguyên vẹn, bản lưu không đổi',
    actual: `Saving: state=${t04SavingCheck.state}, locked=${t04SavingCheck.isAssigneeLocked}; Error: state=${t04ErrorCheck.diag.state}, attempts=${t04ErrorCheck.diag.attemptCount}, commits=${t04ErrorCheck.diag.commitCount}, draftPreserved=${t04ErrorCheck.draftAssignee === 'P02'}`,
    verdict: t04Pass ? 'PASS' : 'FAIL'
  };
  console.log(`[T04]: ${results.testCases.T04.verdict}`);

  // T05: TIẾP NỐI T04, BẤM "THỬ LƯU LẠI"
  console.log('\n--- CA T05: Tiếp nối T04, bấm Thử lưu lại (Kỳ vọng thành công) ---');
  // Bấm nút Thử lưu lại
  await page.evaluate(() => {
    const btnRetry = document.getElementById('btn-retry');
    if (btnRetry) btnRetry.click();
  });

  // Chờ phản hồi hoàn tất (1.200ms + buffer)
  await sleep(1500);
  const t05Res = await page.evaluate(() => {
    const diag = window.__SIMULATION_DIAGNOSTICS__;
    const feedbackText = document.getElementById('form-feedback').innerText.trim();
    const committedAssignee = document.getElementById('committed-assignee-text').innerText.trim();
    const committedNote = document.getElementById('committed-note-text').innerText.trim();
    const btnEditExists = document.getElementById('btn-edit-assignment') !== null;
    const activeEl = document.activeElement ? document.activeElement.id : null;
    return {
      diag,
      feedbackText,
      committedAssignee,
      committedNote,
      btnEditExists,
      activeEl
    };
  });

  const t05Pass = t05Res.diag.state === 'success' &&
                  t05Res.diag.attemptCount === 2 &&
                  t05Res.diag.commitCount === 1 &&
                  t05Res.committedAssignee === 'P02 — Bình' &&
                  t05Res.committedNote === VALID_DATA.note &&
                  t05Res.feedbackText.includes('Đã giao W01 cho Bình — kết quả mô phỏng.') &&
                  t05Res.btnEditExists;

  results.testCases.T05 = {
    precondition: 'Tiếp nối T04 (đang ở trạng thái error với nháp P02 Bình)',
    action: 'Click nút Thử lưu lại',
    inputMethod: 'Pointer Click (btn-retry)',
    stateBefore: 'error',
    stateAfter: t05Res.diag.state,
    attemptCount: t05Res.diag.attemptCount,
    commitCount: t05Res.diag.commitCount,
    committed: { assignee: t05Res.committedAssignee, note: t05Res.committedNote },
    feedbackText: t05Res.feedbackText,
    expected: 'state=success, attemptCount=2, commitCount=1, thông tin đã lưu khớp Bình + ghi chú, thông báo đúng, có nút Sửa phân công',
    actual: `state=${t05Res.diag.state}, attempts=${t05Res.diag.attemptCount}, commits=${t05Res.diag.commitCount}, committedAssignee=${t05Res.committedAssignee}, feedback="${t05Res.feedbackText}"`,
    verdict: t05Pass ? 'PASS' : 'FAIL'
  };
  console.log(`[T05]: ${results.testCases.T05.verdict}`);

  // T06: GỬI HỢP LỆ RỒI KÍCH HOẠT GỬI THÊM 2 LẦN TRONG LÚC SAVING
  console.log('\n--- CA T06: Chặn gửi lặp khi đang saving (Idempotency / Anti-duplicate) ---');
  await resetSimulation();
  // Điền dữ liệu hợp lệ
  await page.evaluate((data) => {
    const sel = document.getElementById('assignee-select');
    sel.value = data.assignee;
    sel.dispatchEvent(new Event('change', { bubbles: true }));
    const ta = document.getElementById('note-textarea');
    ta.value = data.note;
    ta.dispatchEvent(new Event('input', { bubbles: true }));
  }, VALID_DATA);

  // Kích hoạt submit lần 1
  await page.evaluate(() => document.getElementById('btn-submit').click());
  await sleep(100);

  // Trong lúc saving, kích hoạt thêm 2 lần gửi bằng click và form submit
  const extraSubmissions = await page.evaluate(() => {
    const btn = document.getElementById('btn-submit');
    const form = document.getElementById('assignment-form');

    // Lần gửi thêm 1: Pointer click vào nút submit
    btn.click();
    // Lần gửi thêm 2: Gửi sự kiện submit lên form
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    return {
      attemptCountDuringSaving: window.__SIMULATION_DIAGNOSTICS__.attemptCount,
      stateDuringSaving: window.__SIMULATION_DIAGNOSTICS__.state
    };
  });

  // Chờ phản hồi kết thúc
  await sleep(1400);
  const t06Final = await page.evaluate(() => {
    const diag = window.__SIMULATION_DIAGNOSTICS__;
    return {
      state: diag.state,
      attemptCount: diag.attemptCount,
      commitCount: diag.commitCount
    };
  });

  const t06Pass = extraSubmissions.attemptCountDuringSaving === 1 &&
                  t06Final.state === 'error' &&
                  t06Final.attemptCount === 1 &&
                  t06Final.commitCount === 0;

  results.testCases.T06 = {
    precondition: 'Form có dữ liệu hợp lệ mới sau khi reset',
    action: 'Submit hợp lệ -> Kích hoạt gửi thêm 2 lần trong lúc saving (1 click + 1 form submit event)',
    inputMethod: 'Mixed: Pointer click + DOM submit event during saving',
    extraSubmissionCheck: extraSubmissions,
    finalState: t06Final,
    expected: 'Chỉ 1 lần gọi được chấp nhận, attemptCount=1, kết thúc state=error, commitCount=0',
    actual: `duringSavingAttempts=${extraSubmissions.attemptCountDuringSaving}, finalState=${t06Final.state}, finalAttempts=${t06Final.attemptCount}, finalCommits=${t06Final.commitCount}`,
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
    precondition: 'Đang ở trạng thái error từ lần gửi Bình',
    action: 'Đổi select sang P03 Chi -> Bấm Lưu phân công',
    inputMethod: 'DOM Change Event (select P03) + Pointer Click (btn-submit)',
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
    inputMethod: 'Pointer Click (btn-edit-assignment)',
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
    inputMethod: 'Pointer Click (btn-reset-simulation) -> Input -> Submit',
    resetCheck: t09Reset,
    afterResendCheck: t09AfterResend,
    expected: 'Reset xóa sạch trạng thái/bộ đếm, focus=assignee-select; lần gửi mới lại thất bại (state=error, attemptCount=1, commitCount=0)',
    actual: `Reset: state=${t09Reset.diag.state}, attempts=${t09Reset.diag.attemptCount}, activeEl=${t09Reset.activeEl}; Resend: state=${t09AfterResend.diag.state}, attempts=${t09AfterResend.diag.attemptCount}, commits=${t09AfterResend.diag.commitCount}`,
    verdict: t09Pass ? 'PASS' : 'FAIL'
  };
  console.log(`[T09]: ${results.testCases.T09.verdict}`);

  // T10: TẠI 390×844, CHẠY CHUỖI T02 -> SỬA HỢP LỆ -> T04 -> T05 HOÀN TOÀN BẰNG BÀN PHÍM
  console.log('\n--- CA T10: Chuỗi tương tác bàn phím hoàn chỉnh tại Mobile 390×844 ---');
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.goto(HTML_PATH, { waitUntil: 'load' });
  await sleep(300);

  const t10Steps = [];

  // Bước 0: Reset mô phỏng
  await page.evaluate(() => document.getElementById('btn-reset-simulation').click());
  await sleep(100);

  // Bước 1: Focus vào nút submit và bấm Enter khi chưa chọn người (Kích hoạt T02)
  await page.focus('#btn-submit');
  await page.keyboard.press('Enter');
  await sleep(100);
  const b1Check = await page.evaluate(() => {
    return {
      activeBefore: 'btn-submit',
      activeAfter: document.activeElement ? document.activeElement.id : null,
      state: window.__SIMULATION_DIAGNOSTICS__.state,
      err: document.getElementById('assignee-error').innerText.trim()
    };
  });
  t10Steps.push({ step: '1. Bấm Enter submit rỗng', ...b1Check });

  // Lưu ảnh mobile_validation_390x844.png
  const pVal = path.join(SCREENSHOTS_DIR, 'mobile_validation_390x844.png');
  await page.screenshot({ path: pVal, fullPage: false });
  results.screenshots.push('mobile_validation_390x844.png');
  console.log('✓ Đã lưu mobile_validation_390x844.png');

  // Bước 2: Tại select#assignee-select (đã nhận focus từ validation), dùng phím mũi tên chọn P02 Bình
  await page.keyboard.press('ArrowDown'); // P01
  await page.keyboard.press('ArrowDown'); // P02
  await page.evaluate(() => {
    document.getElementById('assignee-select').dispatchEvent(new Event('change', { bubbles: true }));
  });
  await sleep(50);

  // Bước 3: Tab sang textarea#note-textarea và gõ ghi chú hợp lệ
  while (await page.evaluate(() => document.activeElement.id !== 'note-textarea')) {
    await page.keyboard.press('Tab');
    await sleep(50);
  }
  const b3Active = await page.evaluate(() => document.activeElement ? document.activeElement.id : null);
  await page.keyboard.type(VALID_DATA.note);
  await sleep(50);
  t10Steps.push({ step: '2-3. Chọn Bình & gõ ghi chú bằng bàn phím', activeElement: b3Active });

  // Bước 4: Tab sang nút Lưu phân công và bấm Enter (Kích hoạt T04)
  while (await page.evaluate(() => document.activeElement.id !== 'btn-submit')) {
    await page.keyboard.press('Tab');
    await sleep(50);
  }
  const b4Active = await page.evaluate(() => document.activeElement ? document.activeElement.id : null);
  await page.keyboard.press('Enter');

  // Đọc NGAY trạng thái saving trong 50ms trước khi timeout kết thúc
  await sleep(50);
  const b4SavingCheck = await page.evaluate(() => {
    return {
      state: window.__SIMULATION_DIAGNOSTICS__.state,
      savingText: document.getElementById('form-feedback').innerText.trim()
    };
  });
  t10Steps.push({ step: '4. Tab nút submit và bấm Enter -> saving', activeElement: b4Active, ...b4SavingCheck });

  // Lưu ảnh mobile_saving_390x844.png trong lúc saving
  const pSaving = path.join(SCREENSHOTS_DIR, 'mobile_saving_390x844.png');
  await page.screenshot({ path: pSaving, fullPage: false });
  results.screenshots.push('mobile_saving_390x844.png');
  console.log('✓ Đã lưu mobile_saving_390x844.png');

  // Chờ phản hồi lỗi T04 (1.200ms)
  await sleep(1400);
  const b4ErrorCheck = await page.evaluate(() => {
    const btnRetry = document.getElementById('btn-retry');
    const rect = btnRetry ? btnRetry.getBoundingClientRect() : null;
    return {
      state: window.__SIMULATION_DIAGNOSTICS__.state,
      activeElement: document.activeElement ? document.activeElement.id : null,
      feedback: document.getElementById('form-feedback').innerText.trim(),
      btnRetryVisibleInViewport: rect ? (rect.top >= 0 && rect.bottom <= window.innerHeight) : false
    };
  });
  t10Steps.push({ step: '4b. Kết quả lỗi lần đầu', ...b4ErrorCheck });

  // Lưu ảnh mobile_error_390x844.png
  const pError = path.join(SCREENSHOTS_DIR, 'mobile_error_390x844.png');
  await page.screenshot({ path: pError, fullPage: false });
  results.screenshots.push('mobile_error_390x844.png');
  console.log('✓ Đã lưu mobile_error_390x844.png');

  // Bước 5: Nút Thử lưu lại đang có focus (tự động nhận focus), bấm Enter (Kích hoạt T05)
  await page.keyboard.press('Enter');
  await sleep(1500); // Chờ thành công

  const b5SuccessCheck = await page.evaluate(() => {
    const btnEdit = document.getElementById('btn-edit-assignment');
    const rect = btnEdit ? btnEdit.getBoundingClientRect() : null;
    const docEl = document.documentElement;
    return {
      state: window.__SIMULATION_DIAGNOSTICS__.state,
      activeElement: document.activeElement ? document.activeElement.id : null,
      feedback: document.getElementById('form-feedback').innerText.trim(),
      committedAssignee: document.getElementById('committed-assignee-text').innerText.trim(),
      btnEditVisibleInViewport: rect ? (rect.top >= 0 && rect.bottom <= window.innerHeight) : false,
      horizontalOverflow: docEl.scrollWidth > docEl.clientWidth
    };
  });
  t10Steps.push({ step: '5. Bấm Thử lưu lại -> thành công', ...b5SuccessCheck });

  // Lưu ảnh mobile_success_390x844.png
  const pSuccess = path.join(SCREENSHOTS_DIR, 'mobile_success_390x844.png');
  await page.screenshot({ path: pSuccess, fullPage: false });
  results.screenshots.push('mobile_success_390x844.png');
  console.log('✓ Đã lưu mobile_success_390x844.png');

  const t10Pass = b1Check.activeAfter === 'assignee-select' &&
                  b4SavingCheck.state === 'saving' &&
                  b4ErrorCheck.state === 'error' &&
                  b5SuccessCheck.state === 'success' &&
                  b5SuccessCheck.committedAssignee === 'P02 — Bình' &&
                  !b5SuccessCheck.horizontalOverflow;

  results.testCases.T10 = {
    precondition: 'Mobile 390×844, bắt đầu từ form reset rỗng',
    action: 'Thực thi toàn bộ chuỗi T02 -> nhập hợp lệ -> T04 -> T05 chỉ bằng phím Enter, Tab, Arrow keys',
    inputMethod: 'Automated Keyboard Navigation (page.keyboard)',
    steps: t10Steps,
    finalCheck: b5SuccessCheck,
    expected: 'Không mất focus, tự hoàn trả focus về select khi lỗi, focus vào retry button khi lỗi gửi, thành công với Bình, không tràn ngang',
    actual: `StepsCount=${t10Steps.length}, savingCheck=${b4SavingCheck.state}, finalState=${b5SuccessCheck.state}, committedAssignee=${b5SuccessCheck.committedAssignee}, horizontalOverflow=${b5SuccessCheck.horizontalOverflow}`,
    verdict: t10Pass ? 'PASS' : 'FAIL'
  };
  console.log(`[T10]: ${results.testCases.T10.verdict}`);

  // TỔNG KẾT VÀ XUẤT FILE VERIFICATION.JSON
  const allPass = Object.values(results.testCases).every(tc => tc.verdict === 'PASS');
  results.overallVerdict = allPass ? 'PASS' : 'FAIL';

  fs.writeFileSync(path.join(OUTPUT_DIR, 'VERIFICATION.json'), JSON.stringify(results, null, 2), 'utf8');
  console.log(`\n=== KẾT THÚC KIỂM THỬ: ${results.overallVerdict} (Đã lưu VERIFICATION.json) ===`);

  await page.close();
  await browser.disconnect();
}

runTests().catch(err => {
  console.error('[TEST ERROR]', err);
  process.exit(1);
});
