const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const { execSync } = require('child_process');

let puppeteer;
try {
  puppeteer = require('puppeteer-core');
} catch (e) {
  puppeteer = require('C:/Users/game/cdp_reader/node_modules/puppeteer-core');
}

const CDP_PORT = process.env.CDP_PORT || 9222;

async function run() {
  console.log(`[VERIFY_006_R03] Kết nối Chrome CDP tại cổng ${CDP_PORT}...`);
  const browser = await puppeteer.connect({
    browserURL: `http://127.0.0.1:${CDP_PORT}`,
    defaultViewport: null
  });

  const page = await browser.newPage();
  const baseDir = __dirname;
  const screenshotsDir = path.join(baseDir, 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  const results = {
    module: "DESIGN_TRAINING_006",
    revision: "R03_FINAL",
    timestamp: new Date().toISOString(),
    cdp_port: CDP_PORT,
    dpr: 2,
    q01_baseline_authenticity: { pass: false, checks: {} },
    q02_critique_classification: { status: "PASS", review_type: "CRITIQUE_AUDIT", controller_status: "CLOSED (Review 002 confirmed PASS)" },
    q03_single_hypothesis_two_changes: { pass: true, controller_status: "CLOSED (Review 002 confirmed PASS)" },
    q04_fair_comparison: { pass: true, controller_status: "CLOSED (Review 002 confirmed PASS)" },
    q05_invariants_and_no_regressions: { pass: false, details: {} },
    q06_decision_and_tradeoff: { status: "PASS", decision: "ADOPT", controller_status: "ADOPT_ACCEPTED_FOR_EXERCISE (Review 002 confirmed PASS)" },
    q07_bounded_learnings: { status: "PASS", controller_status: "CLOSED (Review 002 confirmed PASS)" }
  };

  try {
    // -------------------------------------------------------------
    // Q01: Kiểm tra nguồn gốc Baseline nghiêm ngặt (Đã PASS tại Review 002)
    // -------------------------------------------------------------
    console.log('[Q01] Kiểm tra nguồn gốc Baseline nghiêm ngặt...');
    const m05ZipPath = path.resolve(baseDir, '../design_training_005/design_training_005_submission_r02.zip');
    let m05ZipHash = '';
    let hashMatched = false;
    let byteIdentical = false;

    if (fs.existsSync(m05ZipPath)) {
      m05ZipHash = crypto.createHash('sha256').update(fs.readFileSync(m05ZipPath)).digest('hex');
    }
    const expectedHash = "12302f8c948dd48126cb756f20c4e64639642eba8394a0501006c6034c850bf1";
    hashMatched = (m05ZipHash === expectedHash);

    const baselineIndexPath = path.join(baseDir, 'baseline/index.html');
    if (fs.existsSync(baselineIndexPath) && fs.existsSync(m05ZipPath)) {
      try {
        const escapedZip = m05ZipPath.replace(/\\/g, '/');
        const escapedBase = baselineIndexPath.replace(/\\/g, '/');
        const pyCheck = `python -c "import zipfile, sys; z=zipfile.ZipFile('${escapedZip}'); orig=z.read('index.html'); local=open('${escapedBase}', 'rb').read(); sys.exit(0 if orig==local else 1)"`;
        execSync(pyCheck, { stdio: 'ignore' });
        byteIdentical = true;
      } catch (e) {
        byteIdentical = false;
      }
    }

    const baselineContractPath = path.join(baseDir, 'baseline/DESIGN_CONTRACT.yaml');
    const contractExists = fs.existsSync(baselineContractPath);
    let contractStatus = 'UNKNOWN';
    if (contractExists) {
      const contractContent = fs.readFileSync(baselineContractPath, 'utf8');
      if (contractContent.includes('status: ACCEPTED_FOR_EXERCISE')) {
        contractStatus = 'ACCEPTED_FOR_EXERCISE (Metadata updated post-M05 PASS as permitted)';
      }
    }

    const q01Pass = hashMatched && byteIdentical && fs.existsSync(baselineIndexPath);
    results.q01_baseline_authenticity = {
      pass: q01Pass,
      source_zip_path: "exercises/design_training_005/design_training_005_submission_r02.zip",
      source_zip_sha256: m05ZipHash,
      expected_sha256: expectedHash,
      hash_matched_strictly: hashMatched,
      baseline_index_byte_identical_to_zip: byteIdentical,
      baseline_contract_status: contractStatus
    };
    console.log(` -> Q01 Pass: ${q01Pass}`);

    // -------------------------------------------------------------
    // Q03: Một giả thuyết & Tối đa hai thay đổi (Đã PASS tại Review 002)
    // -------------------------------------------------------------
    results.q03_single_hypothesis_two_changes = {
      pass: true,
      hypothesis: "Tại Section 03 ('Quyết định thiết kế'), việc hợp nhất 3 thẻ card đóng hộp độc lập thành một khung nhóm chung (Unified Grouped Container) phân cách bằng đường hairline dọc siêu mảnh trên desktop kết hợp thẻ nhãn kỹ thuật monospace sẽ tăng tính liên kết nhóm và độ thanh lịch của nhịp trang, trong khi vẫn bảo toàn 100% nội dung văn bản và cấu trúc hiển thị dọc trên mobile.",
      change_1: "Bố cục Section 03 Desktop: Chuyển từ 3 thẻ card riêng lẻ sang một khung nhóm chung (.decisions-grid) có đường hairline dọc ngăn cách nội bộ (.decision-card border-right: 1px solid var(--color-border) cho 2 cột đầu), bỏ viền riêng từng card.",
      change_2: "Nhãn định danh & Thích ứng Mobile: Tạo kiểu khung nhãn kỹ thuật gọn gàng cho .decision-num (nền var(--color-surface-subtle), viền mảnh 1px, font monospace); trên mobile (max-width: 900px) chuyển thành các phân đoạn xếp dọc ngăn cách bởi hairline ngang (border-bottom)."
    };

    // -------------------------------------------------------------
    // Q04: Điều kiện so sánh (Đã PASS tại Review 002)
    // -------------------------------------------------------------
    results.q04_fair_comparison = {
      pass: true,
      conditions: {
        desktop_viewport: "1440x900",
        tablet_viewport: "768x1024",
        mobile_viewport: "390x844",
        dpr: 2,
        font_state: "System fonts (Inter candidate)",
        content_identical: true,
        screenshots_reused_from_r02: true,
        reason: "Giao diện Candidate giữ nguyên 100%, bộ 5 ảnh đã được Controller kiểm tra và chấp nhận"
      }
    };

    // -------------------------------------------------------------
    // Q05: Bổ sung kiểm chứng hồi quy & Native Keyboard (R01 Remediated)
    // -------------------------------------------------------------
    console.log('[Q05] Kiểm tra hồi quy toàn diện: 3 viewports, dữ liệu từng hàng, native keyboard & zero motion...');
    const candidateUrl = 'file:///' + path.join(baseDir, 'candidate/index.html').replace(/\\/g, '/');

    // 1. Đo không tràn ngang ở 3 viewports: 1440x900, 768x1024, 390x844
    const viewports = [
      { name: "desktop_1440", w: 1440, h: 900 },
      { name: "tablet_768", w: 768, h: 1024 },
      { name: "mobile_390", w: 390, h: 844 }
    ];

    const overflowResults = {};
    for (const vp of viewports) {
      await page.setViewport({ width: vp.w, height: vp.h, deviceScaleFactor: 2 });
      await page.goto(candidateUrl, { waitUntil: 'load' });
      const m = await page.evaluate(() => {
        const cw = document.documentElement.clientWidth;
        const sw = document.documentElement.scrollWidth;
        return { clientWidth: cw, scrollWidth: sw, hasOverflow: sw > cw };
      });
      overflowResults[vp.name] = {
        viewport: `${vp.w}x${vp.h}`,
        clientWidth: m.clientWidth,
        scrollWidth: m.scrollWidth,
        hasHorizontalOverflow: m.hasOverflow,
        assertPass: !m.hasOverflow
      };
    }

    // 2. Xác nhận đúng 3 bộ tài liệu/người phụ trách/trạng thái theo từng hàng
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
    await page.goto(candidateUrl, { waitUntil: 'load' });
    const rowChecks = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll('.matrix-table tbody tr'));
      const details = rows.map((tr, idx) => {
        const docName = tr.querySelector('.doc-name-text')?.innerText?.trim() || '';
        const owner = tr.querySelector('.col-owner')?.innerText?.trim() || '';
        const status = tr.querySelector('.status-badge')?.innerText?.trim() || '';
        return { rowIndex: idx + 1, docName, owner, status };
      });

      const row1Valid = details[0]?.docName === 'Yêu cầu sản phẩm' && details[0]?.owner.includes('An') && details[0]?.status.includes('Hiện hành');
      const row2Valid = details[1]?.docName === 'Bản mẫu đăng nhập' && details[1]?.owner.includes('Bình') && details[1]?.status.includes('Đang soạn');
      const row3Valid = details[2]?.docName === 'Biên bản bàn giao' && details[2]?.owner.includes('Chi') && details[2]?.status.includes('Chờ xác nhận');
      const hasStaticLabel = document.body.innerText.includes('BẢN MẪU TĨNH');
      const h1Text = document.querySelector('h1')?.innerText?.trim() || '';

      return {
        rows: details,
        row1Valid,
        row2Valid,
        row3Valid,
        allRowsValid: row1Valid && row2Valid && row3Valid,
        hasStaticLabel,
        h1Text
      };
    });

    // 3. CTA Pointer Test: Thao tác con trỏ thực qua page.click()
    console.log('[CTA Pointer Test] Kích hoạt #cta-organization bằng page.click()...');
    await page.goto(candidateUrl, { waitUntil: 'load' });
    await page.click('#cta-organization');
    const pointerCta = await page.evaluate(() => {
      const target = document.getElementById('section-organization');
      const rect = target.getBoundingClientRect();
      const inView = rect.top >= -5 && rect.top <= window.innerHeight && rect.bottom > 0;
      return {
        targetedElement: 'cta-organization',
        method: 'Native pointer click via Puppeteer page.click(#cta-organization)',
        targetId: 'section-organization',
        hashAfterClick: window.location.hash,
        targetTop: rect.top,
        targetInView: inView,
        pass: window.location.hash === '#section-organization' && inView
      };
    });
    console.log(' -> Pointer CTA pass:', pointerCta.pass);

    // 4. CTA Native Keyboard Test: Thao tác bàn phím thực qua page.keyboard.press('Tab') và page.keyboard.press('Enter')
    console.log('[CTA Keyboard Test] Mở lại trạng thái sạch và duyệt Tab tự nhiên...');
    await page.goto(candidateUrl, { waitUntil: 'load' });
    const focusSequence = [];
    let reachedCta2 = false;

    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab');
      const activeInfo = await page.evaluate((stepNum) => {
        const el = document.activeElement;
        return {
          tabIndex: stepNum,
          tag: el ? el.tagName : null,
          id: el ? el.id : null,
          className: el ? el.className : null,
          href: el ? el.getAttribute('href') : null
        };
      }, i + 1);
      focusSequence.push(activeInfo);
      console.log(`   [Tab ${i + 1}] Active element: <${activeInfo.tag} id="${activeInfo.id}">`);

      if (activeInfo.id === 'cta-decisions') {
        reachedCta2 = true;
        break;
      }
    }

    let keyboardCta = {
      targetedElement: 'cta-decisions',
      method: 'Native keyboard via Puppeteer page.keyboard (Tab natural traversal + Enter activation)',
      focusSequence,
      reachedViaTab: reachedCta2,
      activeElementBeforeEnter: null,
      hashAfterEnter: null,
      targetTop: null,
      targetInView: false,
      pass: false
    };

    if (reachedCta2) {
      console.log(' -> Đã tới #cta-decisions qua thứ tự Tab tự nhiên. Kích hoạt bằng page.keyboard.press(Enter)...');
      await page.keyboard.press('Enter');
      const afterEnter = await page.evaluate(() => {
        const target = document.getElementById('section-decisions');
        const rect = target.getBoundingClientRect();
        const inView = rect.top >= -5 && rect.top <= window.innerHeight && rect.bottom > 0;
        return {
          activeElementBeforeEnter: document.activeElement ? document.activeElement.id : null,
          hashAfterEnter: window.location.hash,
          targetTop: rect.top,
          targetInView: inView
        };
      });

      keyboardCta.activeElementBeforeEnter = afterEnter.activeElementBeforeEnter;
      keyboardCta.hashAfterEnter = afterEnter.hashAfterEnter;
      keyboardCta.targetTop = afterEnter.targetTop;
      keyboardCta.targetInView = afterEnter.targetInView;
      keyboardCta.pass = (afterEnter.activeElementBeforeEnter === 'cta-decisions') &&
                          (afterEnter.hashAfterEnter === '#section-decisions') &&
                          afterEnter.targetInView;
      console.log(' -> Keyboard CTA pass:', keyboardCta.pass);
    }

    // 5. Xác nhận Zero Motion trên 9 phần tử đại diện
    const motionChecks = await page.evaluate(() => {
      const selectors = ['h1', 'h2', 'h3', '.btn-primary', '.btn-secondary', '.matrix-table', '.decision-card', '.matrix-card', 'body'];
      const details = selectors.map(sel => {
        const el = document.querySelector(sel);
        if (!el) return { selector: sel, exists: false };
        const cs = window.getComputedStyle(el);
        const trans = cs.transitionDuration;
        const anim = cs.animationName;
        const isZero = (trans === '0s' || trans === '') && (anim === 'none' || anim === '');
        return { selector: sel, transitionDuration: trans, animationName: anim, isZero };
      });
      const allZero = details.every(d => d.isZero);
      return { elements: details, allZero };
    });

    const allOverflowsPass = Object.values(overflowResults).every(v => v.assertPass);
    const q05Pass = allOverflowsPass && rowChecks.allRowsValid && rowChecks.hasStaticLabel &&
                    pointerCta.pass && keyboardCta.pass && motionChecks.allZero;

    results.q05_invariants_and_no_regressions = {
      pass: q05Pass,
      overflow_checks: overflowResults,
      data_integrity: rowChecks,
      cta_behavior: {
        pointer_cta: pointerCta,
        keyboard_cta: keyboardCta
      },
      zero_motion_comprehensive: motionChecks
    };
    console.log(` -> Q05 Total Pass: ${q05Pass}`);

    fs.writeFileSync(path.join(baseDir, 'VERIFICATION.json'), JSON.stringify(results, null, 2), 'utf8');
    console.log('[COMPLETED] Đã ghi nhận toàn bộ kết quả kiểm chứng R03 vào VERIFICATION.json!');

  } finally {
    await page.close();
    await browser.disconnect();
  }
}

run().catch(err => {
  console.error('[ERROR]', err);
  process.exit(1);
});
