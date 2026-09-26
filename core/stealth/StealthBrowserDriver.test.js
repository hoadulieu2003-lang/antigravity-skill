/**
 * 🛡️ ANTIGRAVITY ENTERPRISE TEST SUITE — POD 5: STEALTH BROWSER SPECIALIST
 * Test Runner: StealthBrowserDriver.test.js
 * 
 * Kiểm thử đơn vị độc lập toàn diện cho module StealthBrowserDriver.
 * Khởi chạy: node --experimental-strip-types core/stealth/StealthBrowserDriver.test.js
 */

import {
  StealthBrowserDriver,
  StealthProfileFactory,
  AntiFingerprintInterceptor,
  NativeInputController,
  SeededPRNG,
  MockCdpSession
} from './StealthBrowserDriver.ts';

let passedCount = 0;
let failedCount = 0;

function assert(condition, description) {
  if (condition) {
    passedCount++;
    console.log(`  ✅ [PASS] ${description}`);
  } else {
    failedCount++;
    console.error(`  ❌ [FAIL] ${description}`);
  }
}

async function runAllTests() {
  console.log('================================================================');
  console.log('🛡️ POD 5: STEALTH BROWSER DRIVER — UNIT TEST EXECUTION SUITE');
  console.log('================================================================\n');

  // --------------------------------------------------------------------------
  // NHÓM 1: KIỂM THỬ DETERMINISTIC PRNG
  // --------------------------------------------------------------------------
  console.log('📦 Nhóm 1: Kiểm thử Deterministic PRNG & Phân Phối');
  const prng1 = new SeededPRNG(1337);
  const prng2 = new SeededPRNG(1337);
  const val1 = prng1.next();
  const val2 = prng2.next();
  assert(val1 === val2, 'Cùng seed sinh ra chuỗi số ngẫu nhiên ban đầu khớp 100%');
  assert(val1 >= 0 && val1 < 1, 'Giá trị next() luôn nằm trong khoảng [0, 1)');

  const intVal = prng1.nextInt(10, 20);
  assert(intVal >= 10 && intVal <= 20, 'nextInt(10, 20) luôn trả về số nguyên trong khoảng [10, 20]');

  const gaussian = prng1.nextGaussian(50, 10);
  assert(!isNaN(gaussian) && isFinite(gaussian), 'nextGaussian() sinh số thực phân phối chuẩn hợp lệ');

  // --------------------------------------------------------------------------
  // NHÓM 2: KIỂM THỬ STEALTH PROFILE FACTORY
  // --------------------------------------------------------------------------
  console.log('\n📦 Nhóm 2: Kiểm thử StealthProfileFactory & Độc Bản Danh Tính');
  const winProfile1 = StealthProfileFactory.createDeterministicProfile(42, 'Windows');
  const winProfile2 = StealthProfileFactory.createDeterministicProfile(42, 'Windows');
  assert(winProfile1.userAgent === winProfile2.userAgent, 'Bất biến Seed-Consistency: UserAgent khớp 100%');
  assert(winProfile1.webgl.renderer === winProfile2.webgl.renderer, 'Bất biến Seed-Consistency: WebGL Renderer khớp 100%');
  assert(winProfile1.hardware.hardwareConcurrency === 16, 'Windows profile thiết lập hardwareConcurrency = 16 cores');
  assert(winProfile1.screen.width === 1920 && winProfile1.screen.height === 1080, 'Windows screen metrics đạt chuẩn Full HD 1920x1080');

  const macProfile = StealthProfileFactory.createDeterministicProfile(88, 'macOS');
  assert(macProfile.clientHints.platform === 'macOS', 'macOS profile có clientHints.platform là macOS');
  assert(macProfile.clientHints.architecture === 'arm', 'macOS profile gán architecture là ARM');
  assert(macProfile.webgl.vendor.includes('Apple'), 'macOS WebGL Vendor chỉ định GPU của Apple');

  // --------------------------------------------------------------------------
  // NHÓM 3: KIỂM THỬ ANTI-FINGERPRINT INTERCEPTOR
  // --------------------------------------------------------------------------
  console.log('\n📦 Nhóm 3: Kiểm thử AntiFingerprintInterceptor & Script Injection');
  const interceptor = new AntiFingerprintInterceptor();
  const script = interceptor.generateStealthInjectionScript(winProfile1);
  
  assert(script.includes("webdriver") && script.includes("get: () => undefined"), 'Ngụy trang loại bỏ cờ navigator.webdriver');
  assert(script.includes("window.chrome.app") && script.includes("window.chrome.runtime"), 'Giả lập môi trường chrome runtime chuẩn');
  assert(script.includes("Notification.permission"), 'Đồng bộ hóa truy vấn navigator.permissions.query');
  assert(script.includes("37445") && script.includes("37446"), 'Hook WebGL getParameter trả về GPU xịn');
  assert(script.includes("AudioBuffer.prototype.copyFromChannel"), 'Thêm vi nhiễu chống AudioContext fingerprinting');
  assert(script.includes("cdc_"), 'Thanh trừng các biến rò rỉ chromedriver (CDC variables)');

  // Kiểm thử phát lệnh CDP Session
  const mockSession = new MockCdpSession();
  const injectionRes = await interceptor.applyToCdp(mockSession, winProfile1);
  assert(injectionRes.scriptIdentifier === 'mock_stealth_script_v2', 'Nạp thành công script World 0 vào Page.addScriptToEvaluateOnNewDocument');

  const expectedMethods = [
    'Page.enable',
    'Runtime.enable',
    'Network.setUserAgentOverride',
    'Emulation.setDeviceMetricsOverride',
    'Emulation.setTimezoneOverride',
    'Emulation.setLocaleOverride',
    'Emulation.setTouchEmulationEnabled',
    'Page.addScriptToEvaluateOnNewDocument'
  ];
  const allMethodsCalled = expectedMethods.every(m => mockSession.getCalls(m).length > 0);
  assert(allMethodsCalled, 'Phát đầy đủ 8 phương thức CDP quan trọng để bảo vệ môi trường');

  // --------------------------------------------------------------------------
  // NHÓM 4: KIỂM THỬ NATIVE INPUT CONTROLLER
  // --------------------------------------------------------------------------
  console.log('\n📦 Nhóm 4: Kiểm thử NativeInputController & Động Học Bézier');
  const input = new NativeInputController(101);
  const cp = input.generateControlPoints({ x: 0, y: 0 }, { x: 500, y: 500 });
  const startPt = input.calculateBezierPoint(0, cp);
  const endPt = input.calculateBezierPoint(1, cp);
  assert(startPt.x === 0 && startPt.y === 0, 'Điểm đầu đường cong Bézier (t=0) trùng với điểm xuất phát');
  assert(endPt.x === 500 && endPt.y === 500, 'Điểm cuối đường cong Bézier (t=1) trùng với điểm đích');

  // Di chuyển chuột
  const mouseSession = new MockCdpSession();
  await input.moveMouse(mouseSession, { x: 50, y: 50 }, { x: 400, y: 300 }, { steps: 15 });
  const moveCalls = mouseSession.getCalls('Input.dispatchMouseEvent').filter(c => c.params?.type === 'mouseMoved');
  assert(moveCalls.length >= 15, 'moveMouse sinh ra chuỗi sự kiện mouseMoved liên tục');

  // Click chuột (Hover -> Press -> Hold -> Release)
  const clickSession = new MockCdpSession();
  await input.click(clickSession, { x: 200, y: 150 }, { dwellTimeMs: 40 });
  const pressed = clickSession.getCalls('Input.dispatchMouseEvent').filter(c => c.params?.type === 'mousePressed');
  const released = clickSession.getCalls('Input.dispatchMouseEvent').filter(c => c.params?.type === 'mouseReleased');
  assert(pressed.length === 1 && released.length === 1, 'Chu trình click chuột hoàn thiện (1 press, 1 release)');

  // Gõ phím insertText (Google Flow / Lexical)
  const textSession = new MockCdpSession();
  await input.typeText(textSession, 'Antigravity Pod 5', { mode: 'insertText' });
  const insertCalls = textSession.getCalls('Input.insertText');
  assert(insertCalls.length === 1 && insertCalls[0].params?.text === 'Antigravity Pod 5', 'Input.insertText được gửi nguyên vẹn');

  // Gõ phím chức năng (Enter)
  await input.pressKey(textSession, 'Enter');
  const keyCalls = textSession.getCalls('Input.dispatchKeyEvent');
  assert(keyCalls.some(k => k.params?.type === 'rawKeyDown' && k.params?.key === 'Enter'), 'Gửi native rawKeyDown cho phím Enter');
  assert(keyCalls.some(k => k.params?.type === 'keyUp' && k.params?.key === 'Enter'), 'Gửi native keyUp cho phím Enter');

  // --------------------------------------------------------------------------
  // NHÓM 5: KIỂM THỬ TÍCH HỢP TỔNG THỂ (STEALTH BROWSER DRIVER)
  // --------------------------------------------------------------------------
  console.log('\n📦 Nhóm 5: Kiểm thử Tích Hợp StealthBrowserDriver');
  const driver = new StealthBrowserDriver(777, 'Windows');
  const driverSession = new MockCdpSession();
  const attachResult = await driver.attach(driverSession);
  assert(attachResult.overridesApplied.length >= 7, 'Gắn driver thành công với hơn 7 overrides được thiết lập');
  assert(driver.getInput() instanceof NativeInputController, 'Driver cung cấp bộ điều khiển đầu vào NativeInputController hợp lệ');

  // --------------------------------------------------------------------------
  // TỔNG KẾT KẾT QUẢ KIỂM THỬ
  // --------------------------------------------------------------------------
  console.log('\n================================================================');
  console.log(`📊 KẾT QUẢ KIỂM THỬ: ${passedCount} PASSED / ${failedCount} FAILED`);
  console.log('================================================================');

  if (failedCount > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runAllTests().catch(err => {
  console.error('Unhandled Test Runner Exception:', err);
  process.exit(1);
});
