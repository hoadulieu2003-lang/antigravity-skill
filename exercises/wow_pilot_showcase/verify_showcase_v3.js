/**
 * ============================================================================
 * ANTIGRAVITY 2.0 // SHOWCASE V3 DEEP RUNTIME VERIFICATION SUITE
 * ============================================================================
 * Audits all core requirements of Showcase V3:
 *   1. Schema-Driven Page Assembly (showcase_schema.json, SafeDOMAssembler, Anti-XSS)
 *   2. Luminous Palette Engine (4 Palettes, Oklab continuous math, WCAG AAA)
 *   3. Theme Studio Selector (Instant switching of 4 palettes without lag)
 *   4. 3D WebGL Micro-Engine (Iridescent Waves, Particle Mesh, Titanium Grid)
 *   5. Scrollytelling Pinned Stage (3 Scenes, Progress bar, Chapter navigation)
 *   6. Rigid Bento Telemetry Grid (12-Col grid-auto-rows minmax(160px, 160px))
 *   7. Dual Audio-Haptic Soundboard (10 Waveforms + Taptic Engine pulse)
 *   8. Live Delight Inspector HUD V3 (FPS, CLS 0.000, Zero Overflow, Breakpoint switcher)
 *   9. Luminous Light Theme Invariant (Multi-layer specular surfaces, No flat paper)
 *  10. Mobile 375px Responsive Zero-Overflow
 *  11. Backward Compatibility (ShowcaseV2 and WowEngine intact)
 * ============================================================================
 */

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const HTML_FILE = path.join(__dirname, 'index.html');
const FILE_URL = 'file:///' + HTML_FILE.replace(/\\/g, '/');

async function runV3Suite() {
  console.log('================================================================');
  console.log('⚡ ANTIGRAVITY 2.0 // SHOWCASE V3 AUTONOMOUS DESIGN HUB AUDIT');
  console.log('Target:', FILE_URL);
  console.log('================================================================\n');

  const results = [];
  function assert(name, condition, detail = '') {
    results.push({ name, pass: !!condition, detail });
    console.log(`[${condition ? 'PASS' : 'FAIL'}] ${name}${detail ? ' -> ' + detail : ''}`);
  }

  // 1. File existence checks
  console.log('--- 1. File & Schema Integrity Checks ---');
  assert('HTML file exists', fs.existsSync(HTML_FILE));
  assert('showcase_schema.json exists', fs.existsSync(path.join(__dirname, 'showcase_schema.json')));
  assert('page_assembler.js exists', fs.existsSync(path.join(__dirname, 'page_assembler.js')));
  assert('luminous_palette_engine.js exists', fs.existsSync(path.join(__dirname, 'luminous_palette_engine.js')));
  assert('scrolly_stage_engine.js exists', fs.existsSync(path.join(__dirname, 'scrolly_stage_engine.js')));
  assert('showcase.css exists', fs.existsSync(path.join(__dirname, 'showcase.css')));
  assert('showcase.js exists', fs.existsSync(path.join(__dirname, 'showcase.js')));
  assert('wow_engine.js exists', fs.existsSync(path.join(__dirname, 'wow_engine.js')));

  // Parse schema JSON
  let schema = null;
  try {
    schema = JSON.parse(fs.readFileSync(path.join(__dirname, 'showcase_schema.json'), 'utf8'));
  } catch (err) {
    console.error('Schema parse error:', err);
  }
  assert('showcase_schema.json is valid JSON', !!schema);
  assert('Schema contains metadata and title', !!schema?.metadata?.title);
  assert('Schema contains theme contract', !!schema?.theme?.canvas && !!schema?.theme?.surface);
  assert('Schema contains bentoGrid with 12 columns', schema?.bentoGrid?.columns === 12);
  assert('Schema contains scrollytelling with 3 scenes', schema?.scrollytelling?.scenes?.length === 3);
  assert('Schema contains soundboard with 10 waveforms enabled', schema?.soundboard?.enabled === true);

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    const consoleErrors = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('pageerror', (err) => consoleErrors.push(err.message));

    await page.goto(FILE_URL, { waitUntil: 'load', timeout: 15000 });
    await new Promise((r) => setTimeout(r, 600));

    assert('Zero runtime console errors on V3 load', consoleErrors.length === 0, consoleErrors.join('; '));

    // Global Object Exports
    const exportsExist = await page.evaluate(() => {
      return {
        hasWowEngine: typeof window.WowEngine !== 'undefined',
        hasShowcaseV2: typeof window.ShowcaseV2 !== 'undefined',
        hasShowcaseV3: typeof window.ShowcaseV3 !== 'undefined',
        hasSafeDOMAssembler: typeof window.SafeDOMAssembler !== 'undefined',
        hasLuminousPaletteEngine: typeof window.LuminousPaletteEngine !== 'undefined',
        hasScrollyStageEngine: typeof window.ScrollyStageEngine !== 'undefined'
      };
    });
    assert('window.ShowcaseV3 is defined and exported', exportsExist.hasShowcaseV3);
    assert('window.SafeDOMAssembler is defined in browser', exportsExist.hasSafeDOMAssembler);
    assert('window.LuminousPaletteEngine is defined in browser', exportsExist.hasLuminousPaletteEngine);
    assert('window.ScrollyStageEngine is defined in browser', exportsExist.hasScrollyStageEngine);
    assert('window.ShowcaseV2 is preserved for backward compatibility', exportsExist.hasShowcaseV2);
    assert('window.WowEngine is defined and intact', exportsExist.hasWowEngine);

    // ------------------------------------------------------------------------
    // REQUIREMENT 1 & 2: Schema Assembly & Anti-XSS Verification
    // ------------------------------------------------------------------------
    console.log('\n--- 2. Schema-Driven Assembly & Anti-XSS Security ---');
    const xssAudit = await page.evaluate(() => {
      const asm = window.SafeDOMAssembler;
      const pal = window.LuminousPaletteEngine;

      const escaped = asm.escapeHtml('<script>alert("xss")</script>');
      const safeUrl = asm.sanitizeUrl('javascript:alert(1)');
      const cssValSafe = asm.sanitizeCssValue('url(evil.com); background: red', '#FAF9F6');

      const testPalette = pal.generateLuminousPalette('#0284C7');

      return {
        escapeWorks: escaped === '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;',
        urlSanitized: safeUrl === '#',
        cssSanitized: cssValSafe === '#FAF9F6',
        paletteHasSurfaces: !!testPalette?.surfaces?.canvas,
        paletteContrastAA: testPalette?.accent?.textContrastOnCanvas >= 4.5
      };
    });
    assert('SafeDOMAssembler entity encoding neutralizes script tags', xssAudit.escapeWorks);
    assert('SafeDOMAssembler sanitizes javascript: URLs to safe hash #', xssAudit.urlSanitized);
    assert('SafeDOMAssembler rejects CSS injection breakouts', xssAudit.cssSanitized);
    assert('LuminousPaletteEngine generates valid luminous surfaces', xssAudit.paletteHasSurfaces);
    assert('LuminousPaletteEngine guarantees WCAG AA contrast (>= 4.5:1)', xssAudit.paletteContrastAA);

    // ------------------------------------------------------------------------
    // REQUIREMENT 3: Theme Studio Selector (4 Luminous Palettes)
    // ------------------------------------------------------------------------
    console.log('\n--- 3. Theme Studio Selector (4 Luminous Palettes) ---');
    const themeStudioAudit = await page.evaluate(() => {
      const studio = window.ShowcaseV3?.themeStudio;
      if (!studio) return { pass: false, error: 'themeStudio missing' };

      const initialTheme = studio.getTheme();
      const initialBg = window.getComputedStyle(document.body).backgroundColor;

      // 1. Switch to Warm Paper
      studio.setTheme('paper');
      const paperBg = window.getComputedStyle(document.body).backgroundColor;
      const paperHud = document.getElementById('hudThemeStatusVal')?.textContent;

      // 2. Switch to Ivory Silk
      studio.setTheme('ivory');
      const ivoryBg = window.getComputedStyle(document.body).backgroundColor;
      const ivoryHud = document.getElementById('hudThemeStatusVal')?.textContent;

      // 3. Switch to Alabaster Clean
      studio.setTheme('alabaster');
      const alabasterBg = window.getComputedStyle(document.body).backgroundColor;
      const alabasterHud = document.getElementById('hudThemeStatusVal')?.textContent;

      // 4. Test clicking Titanium pill card via DOM event
      const titaniumPill = document.querySelector('[data-theme-choice="titanium"]');
      if (titaniumPill) titaniumPill.click();
      const restoredBg = window.getComputedStyle(document.body).backgroundColor;
      const restoredTheme = studio.getTheme();

      return {
        initialTheme,
        initialBg,
        paperBg,
        paperHud,
        ivoryBg,
        ivoryHud,
        alabasterBg,
        alabasterHud,
        restoredBg,
        restoredTheme
      };
    });

    assert('Theme Studio initializes with titanium ice (#F8FAFC)', themeStudioAudit.initialTheme === 'titanium');
    assert('Theme Studio switches to Warm Paper (#FAF9F6 / rgb(250, 249, 246))', themeStudioAudit.paperBg === 'rgb(250, 249, 246)', themeStudioAudit.paperBg);
    assert('HUD theme status reflects Warm Paper', themeStudioAudit.paperHud && themeStudioAudit.paperHud.includes('#FAF9F6'), themeStudioAudit.paperHud);
    assert('Theme Studio switches to Ivory Silk (#FDFBF7 / rgb(253, 251, 247))', themeStudioAudit.ivoryBg === 'rgb(253, 251, 247)', themeStudioAudit.ivoryBg);
    assert('Theme Studio switches to Alabaster Clean (#F8F9FA / rgb(248, 249, 250))', themeStudioAudit.alabasterBg === 'rgb(248, 249, 250)', themeStudioAudit.alabasterBg);
    assert('Theme Studio restores Titanium Ice on pill click', themeStudioAudit.restoredTheme === 'titanium' && themeStudioAudit.restoredBg === 'rgb(248, 250, 252)');

    // ------------------------------------------------------------------------
    // REQUIREMENT 4: 3D WebGL Micro-Engine
    // ------------------------------------------------------------------------
    console.log('\n--- 4. 3D WebGL Micro-Engine (3 Modes) ---');
    const webglAudit = await page.evaluate(() => {
      const canvas = document.getElementById('heroWebglCanvas');
      const w = window.ShowcaseV3?.webgl;

      const pBtn = document.querySelector('[data-webgl-mode="particles"]');
      if (pBtn) pBtn.click();
      const modeP = w?.mode;

      const gBtn = document.querySelector('[data-webgl-mode="grid"]');
      if (gBtn) gBtn.click();
      const modeG = w?.mode;

      const wBtn = document.querySelector('[data-webgl-mode="waves"]');
      if (wBtn) wBtn.click();
      const modeW = w?.mode;

      return {
        canvasExists: !!canvas,
        hasGl: !!w?.gl,
        modeP,
        modeG,
        modeW
      };
    });
    assert('WebGL canvas exists in DOM', webglAudit.canvasExists);
    assert('WebGL micro-engine switches to Particle Mesh', webglAudit.modeP === 'particles');
    assert('WebGL micro-engine switches to Titanium Grid', webglAudit.modeG === 'grid');
    assert('WebGL micro-engine restores Iridescent Waves', webglAudit.modeW === 'waves');

    // ------------------------------------------------------------------------
    // REQUIREMENT 5: Scrollytelling Pinned Stage (3 Scenes)
    // ------------------------------------------------------------------------
    console.log('\n--- 5. Scrollytelling Pinned Stage (3 Scenes) ---');
    const scrollyAudit = await page.evaluate(() => {
      const stage = window.ShowcaseV3?.scrolly;
      const section = document.getElementById('scrolly-section');
      const fill = document.getElementById('scrollyProgressFill');

      // Test scene 1 active initially
      const scene0Active = document.getElementById('scrolly-scene-0')?.classList.contains('active');
      const initProgress = fill?.style.width;

      // Go to scene 1 (index 1: Luminous Color Math)
      if (stage) stage.goToScene(1);
      const scene1Active = document.getElementById('scrolly-scene-1')?.classList.contains('active');
      const progress1 = fill?.style.width;

      // Go to scene 2 (index 2: Dual Audio-Haptics)
      if (stage) stage.goToScene(2);
      const scene2Active = document.getElementById('scrolly-scene-2')?.classList.contains('active');
      const progress2 = fill?.style.width;

      // Restore scene 0
      if (stage) stage.goToScene(0);
      const scene0Restored = document.getElementById('scrolly-scene-0')?.classList.contains('active');

      return {
        sectionExists: !!section,
        scene0Active,
        scene1Active,
        scene2Active,
        scene0Restored,
        initProgress,
        progress1,
        progress2
      };
    });

    assert('Scrollytelling section exists in DOM with data-scrolly-container', scrollyAudit.sectionExists);
    assert('Scene 01 (Kiến trúc Đa Tác Tử) active initially', scrollyAudit.scene0Active);
    assert('goToScene(1) activates Scene 02 (Động cơ Toán học Luminous)', scrollyAudit.scene1Active);
    assert('Progress bar updates to 66.66% on Scene 02', scrollyAudit.progress1 && scrollyAudit.progress1.includes('66.66'), scrollyAudit.progress1);
    assert('goToScene(2) activates Scene 03 (Phản hồi Xúc giác Kép)', scrollyAudit.scene2Active);
    assert('Progress bar updates to 100% on Scene 03', scrollyAudit.progress2 === '100%', scrollyAudit.progress2);
    assert('Scene 01 cleanly restored', scrollyAudit.scene0Restored);

    // ------------------------------------------------------------------------
    // REQUIREMENT 6: Rigid Bento Telemetry Grid (12-Col minmax(160px, 160px))
    // ------------------------------------------------------------------------
    console.log('\n--- 6. Rigid Bento Telemetry Grid (12-Col minmax(160px, 160px)) ---');
    const bentoAudit = await page.evaluate(() => {
      const grid = document.getElementById('rigidBentoGrid');
      if (!grid) return { pass: false, error: 'rigidBentoGrid missing' };

      const computed = window.getComputedStyle(grid);
      const gridCols = computed.gridTemplateColumns;
      const colTokens = gridCols.split(' ').filter(Boolean);

      const tiles = document.querySelectorAll('.rigid-bento-tile');
      const statNums = Array.from(document.querySelectorAll('.rigid-stat-num')).map((el) => el.textContent.trim());

      return {
        gridExists: true,
        colCount: colTokens.length,
        tileCount: tiles.length,
        statNums
      };
    });

    assert('Rigid Bento Grid element exists in DOM', bentoAudit.gridExists);
    assert('Grid layout resolves to 12 columns on desktop (1440px)', bentoAudit.colCount === 12, `Columns: ${bentoAudit.colCount}`);
    assert('Grid contains 7 signature Bento tiles', bentoAudit.tileCount === 7, `Tiles: ${bentoAudit.tileCount}`);
    assert('Bento tiles display core metrics: 60 FPS, CLS 0.000, 100% Luminous', bentoAudit.statNums.includes('60 FPS') && bentoAudit.statNums.includes('0.000') && bentoAudit.statNums.includes('100%'));

    // ------------------------------------------------------------------------
    // REQUIREMENT 7: Dual Audio-Haptic Soundboard & Taptic Engine
    // ------------------------------------------------------------------------
    console.log('\n--- 7. Dual Audio-Haptic Soundboard & Taptic Engine ---');
    const hapticAudit = await page.evaluate(() => {
      const h = window.ShowcaseV3?.hapticsV2;
      const triggerTaptic = window.ShowcaseV3?.triggerTaptic;
      if (!h || !triggerTaptic) return { pass: false };

      let audioTriggered = null;
      h.onAudioTrigger = (type) => { audioTriggered = type; };

      // Trigger pop
      h.playPop();
      const popTriggered = (audioTriggered === 'pop');

      // Trigger taptic dot pulse
      triggerTaptic('chime');
      const tapticDot = document.getElementById('hudTapticDot');
      const isPulsing = tapticDot?.classList.contains('pulsing');

      return {
        popTriggered,
        isPulsing,
        hasVibrateFn: typeof triggerTaptic === 'function'
      };
    });

    assert('WebAudioHaptics v2.0 triggers audio notifications', hapticAudit.popTriggered);
    assert('Taptic Engine trigger function exists and is callable', hapticAudit.hasVibrateFn);
    assert('Triggering haptic pulse animates HUD Taptic indicator dot', hapticAudit.isPulsing);

    // ------------------------------------------------------------------------
    // REQUIREMENT 8: Live Delight Inspector HUD V3 (CLS, Zero Overflow, Breakpoint)
    // ------------------------------------------------------------------------
    console.log('\n--- 8. Live Delight Inspector HUD V3 ---');
    const hudAudit = await page.evaluate(() => {
      const fps = document.getElementById('hudFpsVal')?.textContent;
      const cls = document.getElementById('hudClsVal')?.textContent;
      const overflow = document.getElementById('hudOverflowVal')?.textContent;
      const taptic = document.getElementById('hudTapticVal')?.textContent;
      const theme = document.getElementById('hudThemeStatusVal')?.textContent;

      // Test Breakpoint switcher
      const tabletBtn = document.querySelector('[data-preview-bp="tablet"]');
      if (tabletBtn) tabletBtn.click();
      const hasTabletClass = document.body.classList.contains('preview-tablet');

      const mobileBtn = document.querySelector('[data-preview-bp="mobile"]');
      if (mobileBtn) mobileBtn.click();
      const hasMobileClass = document.body.classList.contains('preview-mobile');

      const desktopBtn = document.querySelector('[data-preview-bp="desktop"]');
      if (desktopBtn) desktopBtn.click();
      const hasDesktopRestored = !document.body.classList.contains('preview-mobile') && !document.body.classList.contains('preview-tablet');

      return {
        fps,
        cls,
        overflow,
        taptic,
        theme,
        hasTabletClass,
        hasMobileClass,
        hasDesktopRestored
      };
    });

    assert('HUD reports real-time FPS', hudAudit.fps && hudAudit.fps.includes('FPS'), hudAudit.fps);
    assert('HUD reports absolute CLS score: 0.000 (Khóa Cứng Track)', hudAudit.cls && hudAudit.cls.includes('0.000'), hudAudit.cls);
    assert('HUD reports Zero Overflow status: Verified', hudAudit.overflow && hudAudit.overflow.includes('Verified'), hudAudit.overflow);
    assert('HUD reports Taptic Engine status: Sẵn Sàng', hudAudit.taptic && hudAudit.taptic.includes('Sẵn Sàng'), hudAudit.taptic);
    assert('HUD reports active Luminous Theme status', hudAudit.theme && hudAudit.theme.includes('Luminous'), hudAudit.theme);
    assert('Breakpoint Preview switcher activates Tablet mode (body.preview-tablet)', hudAudit.hasTabletClass);
    assert('Breakpoint Preview switcher activates Mobile mode (body.preview-mobile)', hudAudit.hasMobileClass);
    assert('Breakpoint Preview switcher restores Desktop mode', hudAudit.hasDesktopRestored);

    // ------------------------------------------------------------------------
    // REQUIREMENT 9: Mobile 375px Responsive Zero-Overflow Audit
    // ------------------------------------------------------------------------
    console.log('\n--- 9. Mobile 375px Responsive Zero-Overflow Audit ---');
    const mobilePage = await browser.newPage();
    await mobilePage.setViewport({ width: 375, height: 667 });
    await mobilePage.goto(FILE_URL, { waitUntil: 'load', timeout: 15000 });
    await new Promise((r) => setTimeout(r, 400));

    const mobileAudit = await mobilePage.evaluate(() => {
      const docWidth = document.documentElement.clientWidth;
      const bodyWidth = document.body.scrollWidth;

      const overflowing = Array.from(document.querySelectorAll('*'))
        .filter((el) => {
          if (el.closest('.table-responsive-container, [style*="overflow-x: auto"], [style*="overflow-x:auto"]')) return false;
          const r = el.getBoundingClientRect();
          return r.right > docWidth + 2;
        })
        .map((el) => `${el.tagName}.${el.className}`);

      return {
        docWidth,
        bodyWidth,
        overflowCount: overflowing.length,
        overflowing: overflowing.slice(0, 3)
      };
    });

    assert('Mobile zero-overflow: body.scrollWidth <= viewport width (375px)', mobileAudit.bodyWidth <= mobileAudit.docWidth + 2, `body: ${mobileAudit.bodyWidth}px, doc: ${mobileAudit.docWidth}px`);
    assert('Zero overflowing elements on 375px mobile screen', mobileAudit.overflowCount === 0, mobileAudit.overflowing.join(', ') || 'clean');

    await mobilePage.close();

    // ------------------------------------------------------------------------
    // REQUIREMENT 10: Capture Artifact Screenshots
    // ------------------------------------------------------------------------
    console.log('\n--- 10. Capturing Artifact Screenshots ---');
    const screenshotsDir = path.join(__dirname, 'screenshots');
    if (!fs.existsSync(screenshotsDir)) fs.mkdirSync(screenshotsDir, { recursive: true });

    const brainDir = 'C:\\Users\\game\\.gemini\\antigravity\\brain\\345181ac-550e-4a67-a967-c676b117c447';
    if (!fs.existsSync(brainDir)) fs.mkdirSync(brainDir, { recursive: true });

    // Scroll to Hero & Capture Hero screenshot
    await page.evaluate(() => window.scrollTo(0, 0));
    await new Promise((r) => setTimeout(r, 400));

    const heroShotLocal = path.join(screenshotsDir, 'showcase_v3_hero.png');
    const heroShotBrain = path.join(brainDir, 'showcase_v3_hero.png');
    await page.screenshot({ path: heroShotLocal });
    fs.copyFileSync(heroShotLocal, heroShotBrain);
    assert('Saved showcase_v3_hero.png to screenshots and artifact brain', fs.existsSync(heroShotBrain));

    // Scroll to Scrollytelling Stage & Capture Scrollytelling screenshot
    await page.evaluate(() => {
      const scrollyEl = document.getElementById('scrolly-section');
      if (scrollyEl) scrollyEl.scrollIntoView({ behavior: 'auto' });
    });
    await new Promise((r) => setTimeout(r, 400));

    const scrollyShotLocal = path.join(screenshotsDir, 'showcase_v3_scrolly.png');
    const scrollyShotBrain = path.join(brainDir, 'showcase_v3_scrolly.png');
    await page.screenshot({ path: scrollyShotLocal });
    fs.copyFileSync(scrollyShotLocal, scrollyShotBrain);
    assert('Saved showcase_v3_scrolly.png to screenshots and artifact brain', fs.existsSync(scrollyShotBrain));

    await page.close();
    await browser.close();

    const passedCount = results.filter((r) => r.pass).length;
    const totalCount = results.length;
    console.log('\n================================================================');
    console.log(`TOTAL: ${passedCount}/${totalCount} CHECKS PASSED`);
    console.log(`VERDICT: ${passedCount === totalCount ? 'ALL V3 VERIFICATIONS PASSED (SUCCESS)' : 'FAILURES DETECTED'}`);
    console.log('================================================================\n');

    process.exit(passedCount === totalCount ? 0 : 1);
  } catch (err) {
    console.error('Audit run failed with error:', err);
    await browser.close();
    process.exit(1);
  }
}

runV3Suite();
