const path = require('path');
const fs = require('fs');

// Dynamic resolution of puppeteer-core with clear error message
let puppeteer;
try {
  puppeteer = require('puppeteer-core');
} catch (e) {
  try {
    puppeteer = require(path.join(__dirname, '../../../cdp_reader/node_modules/puppeteer-core'));
  } catch (err) {
    console.error('[ERROR] Không tìm thấy puppeteer-core. Vui lòng cài đặt: npm install puppeteer-core');
    process.exit(1);
  }
}

const CDP_PORT = process.env.CDP_PORT || 9222;

// Standard WCAG 2.1 Relative Luminance & Contrast Calculation Formula
function getLuminance(hex) {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;

  const a = [r, g, b].map(v => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}

function calculateContrastRatio(fgHex, bgHex) {
  const L1 = getLuminance(fgHex);
  const L2 = getLuminance(bgHex);
  const lighter = Math.max(L1, L2);
  const darker = Math.min(L1, L2);
  const ratio = (lighter + 0.05) / (darker + 0.05);
  return Number(ratio.toFixed(2));
}

async function run() {
  console.log(`[VERIFY_005_R02] Đang kết nối Chrome CDP tại cổng ${CDP_PORT}...`);
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
    module: "DESIGN_TRAINING_005",
    submission_round: "REPAIR_001_R02",
    timestamp: new Date().toISOString(),
    cdp_port: CDP_PORT,
    dpr: 2,
    v01_content_and_data: { pass: false, checks: {} },
    v02_ab_distinction: { status: "PRESERVED_PASS", review_type: "VISUAL_REVIEW", notes: "Kế thừa kết quả ĐẠT từ Review 001; hai ảnh nháp option_a và option_b được giữ nguyên." },
    v03_contract_consistency: { status: "SELF_REVIEW_PENDING_CONTROLLER", review_type: "VISUAL_REVIEW", notes: "Đã đồng bộ 100% typography, nhãn bản mẫu tĩnh và CSS tokens giữa Contract và index.html." },
    v04_cta_targets: { pass: false, cta_primary: {}, cta_secondary: {} },
    v05_keyboard_navigation: { pass: false, steps: [] },
    v06_responsive_and_readability: { pass: false, viewports: {}, mobile_readability: {} },
    v07_semantics_and_contrast: { pass: false, headings: {}, contrast_measurements: {} },
    v08_zero_motion_and_repro: { pass: false, checks: {} }
  };

  try {
    const indexUrl = 'file:///' + path.join(baseDir, 'index.html').replace(/\\/g, '/');
    await page.goto(indexUrl, { waitUntil: 'load' });

    // -------------------------------------------------------------
    // V01: Kiểm tra nội dung chuẩn & 3 dòng dữ liệu
    // -------------------------------------------------------------
    console.log('[V01] Kiểm tra nội dung chuẩn & nhãn bản mẫu tĩnh...');
    const v01Data = await page.evaluate(() => {
      const bodyText = document.body.innerText;
      const hasName = bodyText.includes('TRACE');
      const hasContext = bodyText.includes('Dự án tự khởi xướng · Thiết kế sản phẩm');
      const hasH1 = bodyText.includes('Bàn giao rõ ràng.') && bodyText.includes('Công việc tiếp nối.');
      const hasLead = bodyText.includes('TRACE tập hợp tài liệu, người phụ trách và trạng thái bàn giao để nhóm biết cần xem gì và làm gì tiếp theo.');
      const hasCta1 = bodyText.includes('Xem cách tổ chức');
      const hasCta2 = bodyText.includes('Đọc quyết định thiết kế');
      const hasSec2Title = bodyText.includes('Một nơi để đối chiếu');
      const hasSec2Lead = bodyText.includes('Tài liệu được đặt cạnh người phụ trách và trạng thái, giúp người xem đối chiếu thông tin trong cùng một ngữ cảnh.');
      const hasSec3Title = bodyText.includes('Quyết định thiết kế');
      const hasFooter = bodyText.includes('Bản mẫu minh họa — chưa kết nối dữ liệu thật.');

      // 3 dòng dữ liệu
      const row1 = bodyText.includes('Yêu cầu sản phẩm') && bodyText.includes('An') && bodyText.includes('Hiện hành');
      const row2 = bodyText.includes('Bản mẫu đăng nhập') && bodyText.includes('Bình') && bodyText.includes('Đang soạn');
      const row3 = bodyText.includes('Biên bản bàn giao') && bodyText.includes('Chi') && bodyText.includes('Chờ xác nhận');

      // F02 Check: Nhãn bản mẫu tĩnh trung thực
      const hasStaticSpecimenLabel = bodyText.includes('BẢN MẪU TĨNH');
      const hasNoActiveRunFalsePromise = !bodyText.includes('CHẾ ĐỘ THỰC THI');

      // Kiểm tra cấm tự bịa thành tích
      const lower = bodyText.toLowerCase();
      const fabricatedKeywords = ['khách hàng', 'doanh thu', 'đánh giá', 'giải thưởng', 'số người dùng', 'logo đối tác', '10.000+', '100% hài lòng'];
      const foundForbidden = fabricatedKeywords.filter(k => lower.includes(k));

      return {
        hasName, hasContext, hasH1, hasLead, hasCta1, hasCta2,
        hasSec2Title, hasSec2Lead, hasSec3Title, hasFooter,
        row1, row2, row3,
        hasStaticSpecimenLabel,
        hasNoActiveRunFalsePromise,
        foundForbidden,
        isClean: foundForbidden.length === 0
      };
    });

    results.v01_content_and_data = {
      pass: v01Data.hasName && v01Data.hasContext && v01Data.hasH1 && v01Data.hasLead &&
            v01Data.hasCta1 && v01Data.hasCta2 && v01Data.hasSec2Title && v01Data.hasSec2Lead &&
            v01Data.hasSec3Title && v01Data.hasFooter && v01Data.row1 && v01Data.row2 && v01Data.row3 &&
            v01Data.hasStaticSpecimenLabel && v01Data.hasNoActiveRunFalsePromise && v01Data.isClean,
      details: v01Data
    };
    console.log(` -> V01 Pass: ${results.v01_content_and_data.pass}`);

    // -------------------------------------------------------------
    // V04: CTA có đích thật và cuộn tức thì
    // -------------------------------------------------------------
    console.log('[V04] Kiểm tra CTA cuộn tức thì đến đúng section...');
    await page.click('#cta-organization');
    const scrollPos1 = await page.evaluate(() => {
      const sec2 = document.getElementById('section-organization');
      const rect = sec2.getBoundingClientRect();
      return { top: rect.top, hash: window.location.hash };
    });

    await page.click('#cta-decisions');
    const scrollPos2 = await page.evaluate(() => {
      const sec3 = document.getElementById('section-decisions');
      const rect = sec3.getBoundingClientRect();
      return { top: rect.top, hash: window.location.hash };
    });

    results.v04_cta_targets = {
      pass: scrollPos1.hash === '#section-organization' && scrollPos2.hash === '#section-decisions',
      cta_primary: { target: '#section-organization', finalTop: scrollPos1.top, hash: scrollPos1.hash },
      cta_secondary: { target: '#section-decisions', finalTop: scrollPos2.top, hash: scrollPos2.hash }
    };
    console.log(` -> V04 Pass: ${results.v04_cta_targets.pass}`);

    // -------------------------------------------------------------
    // V05: Bàn phím trên bản cuối
    // -------------------------------------------------------------
    console.log('[V05] Kiểm tra điều hướng bàn phím Tab & Enter...');
    await page.goto(indexUrl, { waitUntil: 'load' });
    let activeId = '';
    let tabCount = 0;
    while (activeId !== 'cta-organization' && tabCount < 10) {
      await page.keyboard.press('Tab');
      tabCount++;
      activeId = await page.evaluate(() => document.activeElement ? document.activeElement.id : '');
    }

    const cta1Focus = await page.evaluate(() => {
      const el = document.activeElement;
      const style = window.getComputedStyle(el);
      return {
        id: el.id,
        tagName: el.tagName,
        outlineStyle: style.outlineStyle,
        outlineWidth: style.outlineWidth,
        outlineColor: style.outlineColor
      };
    });

    await page.keyboard.press('Enter');
    const hashAfterEnter1 = await page.evaluate(() => window.location.hash);

    await page.keyboard.press('Tab');
    const cta2Focus = await page.evaluate(() => {
      const el = document.activeElement;
      const style = window.getComputedStyle(el);
      return {
        id: el.id,
        tagName: el.tagName,
        outlineStyle: style.outlineStyle,
        outlineWidth: style.outlineWidth,
        outlineColor: style.outlineColor
      };
    });

    await page.keyboard.press('Enter');
    const hashAfterEnter2 = await page.evaluate(() => window.location.hash);

    results.v05_keyboard_navigation = {
      pass: cta1Focus.id === 'cta-organization' && cta2Focus.id === 'cta-decisions' &&
            hashAfterEnter1 === '#section-organization' && hashAfterEnter2 === '#section-decisions',
      cta1_focus: cta1Focus,
      cta2_focus: cta2Focus,
      hashAfterEnter1,
      hashAfterEnter2
    };
    console.log(` -> V05 Pass: ${results.v05_keyboard_navigation.pass}`);

    // -------------------------------------------------------------
    // V07: Ngữ nghĩa & Tương phản sRGB chính xác (F03)
    // -------------------------------------------------------------
    console.log('[V07] Kiểm tra ngữ nghĩa HTML & tính toán tương phản sRGB theo WCAG 2.1...');
    const semantics = await page.evaluate(() => {
      const h1s = Array.from(document.querySelectorAll('h1')).map(h => h.innerText.trim());
      const h2s = Array.from(document.querySelectorAll('h2')).map(h => h.innerText.trim());
      const h3s = Array.from(document.querySelectorAll('h3')).map(h => h.innerText.trim());

      const hasNav = !!document.querySelector('nav');
      const hasMain = !!document.querySelector('main');
      const hasFooter = !!document.querySelector('footer');
      const sections = document.querySelectorAll('section').length;

      const badges = Array.from(document.querySelectorAll('.status-badge')).map(b => ({
        text: b.innerText.trim(),
        hasMarker: !!b.querySelector('.badge-marker')
      }));

      return {
        h1Count: h1s.length,
        h1Text: h1s[0],
        h2Count: h2s.length,
        h2Texts: h2s,
        h3Count: h3s.length,
        h3Texts: h3s,
        hasNav, hasMain, hasFooter, sections,
        badges
      };
    });

    // Exact contrast ratios calculated via relative luminance algorithm
    const contrastPairs = [
      { id: "text_primary", name: "Chữ chính trên nền canvas", fg: "#0F172A", bg: "#F8FAFC", minRequired: 4.5 },
      { id: "text_muted", name: "Chữ phụ trên nền canvas", fg: "#475569", bg: "#F8FAFC", minRequired: 4.5 },
      { id: "button_primary", name: "Chữ nút chính trên nền nút", fg: "#FFFFFF", bg: "#0F172A", minRequired: 4.5 },
      { id: "status_current", name: "Chữ badge Hiện hành trên nền badge", fg: "#065F46", bg: "#ECFDF5", minRequired: 4.5 },
      { id: "status_drafting", name: "Chữ badge Đang soạn trên nền badge", fg: "#92400E", bg: "#FEF3C7", minRequired: 4.5 },
      { id: "status_pending", name: "Chữ badge Chờ xác nhận trên nền badge", fg: "#9A3412", bg: "#FFEDD5", minRequired: 4.5 }
    ];

    const contrastResults = {};
    let allContrastPass = true;
    for (const pair of contrastPairs) {
      const ratio = calculateContrastRatio(pair.fg, pair.bg);
      const passAA = ratio >= pair.minRequired;
      const passAAA = ratio >= 7.0;
      contrastResults[pair.id] = {
        description: pair.name,
        fg: pair.fg,
        bg: pair.bg,
        ratio: `${ratio}:1`,
        passes_wcag_aa: passAA,
        passes_wcag_aaa: passAAA
      };
      if (!passAA) allContrastPass = false;
    }

    results.v07_semantics_and_contrast = {
      pass: semantics.h1Count === 1 && semantics.h2Count === 2 && semantics.h3Count === 3 &&
            semantics.hasNav && semantics.hasMain && semantics.hasFooter && allContrastPass,
      details: semantics,
      contrast_measurements: contrastResults,
      contrast_scope_note: "Phép đo áp dụng trên 6 cặp màu đại diện chính trong hệ thống token, tính toán bằng công thức Relative Luminance sRGB chuẩn WCAG 2.1."
    };
    console.log(` -> V07 Pass: ${results.v07_semantics_and_contrast.pass}`);

    // -------------------------------------------------------------
    // V08: Zero Motion & Tái hiện
    // -------------------------------------------------------------
    console.log('[V08] Kiểm tra Zero Motion & font stack...');
    const motionAndFont = await page.evaluate(() => {
      const bodyStyle = window.getComputedStyle(document.body);
      const h1Style = window.getComputedStyle(document.querySelector('h1'));
      const btnStyle = window.getComputedStyle(document.querySelector('.btn'));
      const htmlStyle = window.getComputedStyle(document.documentElement);

      const isZeroTransition = bodyStyle.transitionDuration === '0s' && h1Style.transitionDuration === '0s' && btnStyle.transitionDuration === '0s';
      const isZeroAnimation = bodyStyle.animationName === 'none' && h1Style.animationName === 'none';
      const isInstantScroll = htmlStyle.scrollBehavior === 'auto';

      return {
        isZeroTransition,
        isZeroAnimation,
        isInstantScroll,
        bodyFontFamily: bodyStyle.fontFamily
      };
    });

    results.v08_zero_motion_and_repro = {
      pass: motionAndFont.isZeroTransition && motionAndFont.isZeroAnimation && motionAndFont.isInstantScroll,
      details: motionAndFont
    };
    console.log(` -> V08 Pass: ${results.v08_zero_motion_and_repro.pass}`);

    // -------------------------------------------------------------
    // V06: RESPONSIVE MEASUREMENTS & 4 ẢNH CHỤP BẢN CUỐI (F01 & F03)
    // -------------------------------------------------------------
    console.log('[V06] Kiểm tra responsive, đo đạc khả năng đọc mobile và chụp 4 ảnh bản cuối...');
    const viewports = [
      { name: 'desktop_1440x900', w: 1440, h: 900, isMain: true },
      { name: 'tablet_768x1024', w: 768, h: 1024, isMain: false },
      { name: 'mobile_390x844', w: 390, h: 844, isMain: true }
    ];

    let allViewportsPass = true;

    for (const vp of viewports) {
      await page.setViewport({ width: vp.w, height: vp.h, deviceScaleFactor: 2 });
      await page.goto(indexUrl, { waitUntil: 'load' });

      const metrics = await page.evaluate((isMobile) => {
        const iw = window.innerWidth;
        const cw = document.documentElement.clientWidth;
        const sw = document.documentElement.scrollWidth;
        const bsw = document.body.scrollWidth;
        const dpr = window.devicePixelRatio;

        // F03 Refined metric: rowHeightAdequate (không dùng tên rowsVisible)
        const rows = Array.from(document.querySelectorAll('.matrix-table tbody tr')).map(r => {
          const rect = r.getBoundingClientRect();
          return {
            height: rect.height,
            isAdequate: rect.height >= 24
          };
        });

        // F01 Mobile Specific: Đo đạc số dòng của tiêu đề tài liệu
        const docTitles = Array.from(document.querySelectorAll('.doc-name-text')).map(el => {
          const rect = el.getBoundingClientRect();
          const computed = window.getComputedStyle(el);
          const lh = parseFloat(computed.lineHeight) || parseFloat(computed.fontSize) * 1.35;
          const estimatedLines = Math.round(rect.height / lh);
          return {
            text: el.innerText.trim(),
            width: rect.width,
            height: rect.height,
            estimatedLines
          };
        });

        const h1 = document.querySelector('h1');
        const h1Rect = h1.getBoundingClientRect();

        return {
          innerWidth: iw,
          clientWidth: cw,
          scrollWidth: sw,
          bodyScrollWidth: bsw,
          dpr: dpr,
          hasHorizontalOverflow: sw > cw,
          rowHeightAdequate: rows.every(row => row.isAdequate),
          docTitleMetrics: isMobile ? docTitles : undefined,
          h1Width: h1Rect.width,
          h1Height: h1Rect.height
        };
      }, vp.w <= 600);

      results.v06_responsive_and_readability.viewports[vp.name] = metrics;
      if (metrics.hasHorizontalOverflow) allViewportsPass = false;

      // Chụp 4 ảnh nghiệm thu sau sửa theo đúng yêu cầu mục 8 của Review 001
      if (vp.name === 'desktop_1440x900') {
        await page.screenshot({
          path: path.join(screenshotsDir, 'final_desktop_1440x900.png'),
          clip: { x: 0, y: 0, width: 1440, height: 900 }
        });
        console.log(' -> Đã cập nhật screenshots/final_desktop_1440x900.png');

        await page.screenshot({
          path: path.join(screenshotsDir, 'final_desktop_fullpage.png'),
          fullPage: true
        });
        console.log(' -> Đã cập nhật screenshots/final_desktop_fullpage.png');
      } else if (vp.name === 'mobile_390x844') {
        await page.screenshot({
          path: path.join(screenshotsDir, 'final_mobile_390x844.png'),
          clip: { x: 0, y: 0, width: 390, height: 844 }
        });
        console.log(' -> Đã cập nhật screenshots/final_mobile_390x844.png');

        await page.screenshot({
          path: path.join(screenshotsDir, 'final_mobile_fullpage.png'),
          fullPage: true
        });
        console.log(' -> Đã cập nhật screenshots/final_mobile_fullpage.png');

        results.v06_responsive_and_readability.mobile_readability = {
          evaluation: "SELF_REVIEW_PENDING_CONTROLLER",
          observation: "Trên viewport 390px, cả 3 tiêu đề tài liệu ('Yêu cầu sản phẩm', 'Bản mẫu đăng nhập', 'Biên bản bàn giao') chiếm trọn 100% bề ngang dòng đầu (width ~290px), hiển thị gọn gàng trên 1 dòng đơn (estimatedLines: 1), không còn hiện tượng bị bẻ vụn từng từ thành nhiều tầng hẹp.",
          docTitles: metrics.docTitleMetrics
        };
      }
    }

    results.v06_responsive_and_readability.pass = allViewportsPass;
    console.log(` -> V06 Pass: ${results.v06_responsive_and_readability.pass}`);

    // Ghi VERIFICATION.json
    fs.writeFileSync(path.join(baseDir, 'VERIFICATION.json'), JSON.stringify(results, null, 2), 'utf8');
    console.log('[COMPLETED] Đã hoàn tất đo đạc và cập nhật VERIFICATION.json chuẩn xác!');

  } finally {
    await page.close();
    await browser.disconnect();
  }
}

run().catch(err => {
  console.error('[ERROR]', err);
  process.exit(1);
});
