/**
 * 🛡️ ANTIGRAVITY ENTERPRISE TEST SUITE — POD 5: AUTONOMOUS VISUAL INSPECTOR (ROUND 2 EVOLUTION)
 * Test Runner: AutonomousVisualInspector.test.js
 * 
 * Kiểm thử đơn vị độc lập toàn diện cho module AutonomousVisualInspector:
 * 1. Nhóm 1: Toán học quang học thị giác (VisualMath), màu sắc sRGB & WCAG 2.1 Contrast Ratio
 * 2. Nhóm 2: Đo đạc và phát hiện tràn viền ngang (Horizontal Overflow) trên 3 viewports (1440px, 768px, 390px)
 * 3. Nhóm 3: Kiểm toán cấu trúc DOM Bounding Box (AABB Collisions, Zero-Sized, Out-of-Bounds)
 * 4. Nhóm 4: Tích hợp StealthBrowserDriver & Mock CDP Emulation Lifecycle
 * 5. Nhóm 5: Kiểm định cơ chế Hard Gating & Báo cáo tổng hợp VisualAuditReport
 * 
 * Khởi chạy: node --experimental-strip-types core/stealth/AutonomousVisualInspector.test.js
 */

import {
  AutonomousVisualInspector,
  VisualMath,
  STANDARD_VIEWPORTS
} from './AutonomousVisualInspector.ts';

import {
  StealthBrowserDriver,
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
  console.log('🛡️ POD 5: AUTONOMOUS VISUAL INSPECTOR — UNIT TEST SUITE (ROUND 2)');
  console.log('================================================================\n');

  // --------------------------------------------------------------------------
  // NHÓM 1: TOÁN HỌC QUANG HỌC & ĐỘ TƯƠNG PHẢN WCAG 2.1
  // --------------------------------------------------------------------------
  console.log('📦 Nhóm 1: Kiểm thử VisualMath, Phân tích sRGB & Độ Tương Phản WCAG 2.1');
  
  // 1.1 Phân tích màu
  const whiteRgb = VisualMath.parseRgba('#ffffff');
  assert(whiteRgb.r === 255 && whiteRgb.g === 255 && whiteRgb.b === 255 && whiteRgb.a === 1.0, 'Phân tích chuẩn xác màu Hex #ffffff');

  const blackRgb = VisualMath.parseRgba('#000000');
  assert(blackRgb.r === 0 && blackRgb.g === 0 && blackRgb.b === 0 && blackRgb.a === 1.0, 'Phân tích chuẩn xác màu Hex #000000');

  const rgbaVal = VisualMath.parseRgba('rgba(100, 150, 200, 0.75)');
  assert(rgbaVal.r === 100 && rgbaVal.g === 150 && rgbaVal.b === 200 && rgbaVal.a === 0.75, 'Phân tích chuỗi rgba(...) chính xác');

  // 1.2 Alpha Compositing
  const semiBlack = { r: 0, g: 0, b: 0, a: 0.5 };
  const pureWhite = { r: 255, g: 255, b: 255, a: 1.0 };
  const blended = VisualMath.compositeColor(semiBlack, pureWhite);
  assert(blended.r === 128 && blended.g === 128 && blended.b === 128 && blended.a === 1.0, 'Alpha-compositing hòa trộn màu đen 50% lên nền trắng ra xám 128');

  // 1.3 Độ chói sRGB (Luminance)
  const lWhite = VisualMath.sRgbLuminance(255, 255, 255);
  const lBlack = VisualMath.sRgbLuminance(0, 0, 0);
  assert(Math.abs(lWhite - 1.0) < 0.001, 'Độ chói sRGB của màu trắng đạt giá trị tối đa 1.0');
  assert(Math.abs(lBlack - 0.0) < 0.001, 'Độ chói sRGB của màu đen đạt giá trị tối thiểu 0.0');

  // 1.4 Contrast Ratio (Tỷ lệ tương phản)
  const maxContrast = VisualMath.calculateContrastRatio(whiteRgb, blackRgb);
  assert(maxContrast === 21.0, 'Tương phản đen trên trắng đạt ngưỡng cực đại 21.0:1');

  const sameContrast = VisualMath.calculateContrastRatio(whiteRgb, whiteRgb);
  assert(sameContrast === 1.0, 'Tương phản hai màu đồng nhất là 1.0:1');

  // Kiểm tra bảng màu Luminous Light Theme: Dark Charcoal (#1a1a1a) trên Warm Paper (#FAF9F6)
  const darkCharcoal = VisualMath.parseRgba('#1a1a1a');
  const warmPaper = VisualMath.parseRgba('#faf9f6');
  const luminousContrast = VisualMath.calculateContrastRatio(darkCharcoal, warmPaper);
  assert(luminousContrast >= 15.0, `Luminous Light Theme đạt tỷ lệ tương phản xuất sắc ${luminousContrast}:1 (>= 15:1)`);

  // 1.5 Đánh giá chuẩn WCAG 2.1 AA & AAA
  const normalTextCompliance = VisualMath.evaluateWcagCompliance(4.6, 16, 400);
  assert(normalTextCompliance.passesAA === true, 'Văn bản thường (16px) với tỷ lệ 4.6:1 vượt qua chuẩn WCAG AA (>= 4.5:1)');
  assert(normalTextCompliance.passesAAA === false, 'Văn bản thường (16px) với tỷ lệ 4.6:1 chưa đạt WCAG AAA (>= 7.0:1)');

  const largeTextCompliance = VisualMath.evaluateWcagCompliance(3.2, 24, 400);
  assert(largeTextCompliance.isLargeText === true, 'Văn bản kích thước 24px được định danh chính xác là chữ lớn (Large Text)');
  assert(largeTextCompliance.passesAA === true, 'Chữ lớn đạt chuẩn WCAG AA ở ngưỡng 3.0:1');

  // --------------------------------------------------------------------------
  // NHÓM 2: ĐO ĐẠC TRÀN VIỀN NGANG (HORIZONTAL OVERFLOW) TRÊN 3 VIEWPORTS
  // --------------------------------------------------------------------------
  console.log('\n📦 Nhóm 2: Kiểm thử Đo Đạc Tràn Viền Ngang Trên 3 Viewports');

  assert(STANDARD_VIEWPORTS.desktop.width === 1440, 'Desktop Viewport chuẩn hóa 1440px');
  assert(STANDARD_VIEWPORTS.tablet.width === 768, 'Tablet Viewport chuẩn hóa 768px');
  assert(STANDARD_VIEWPORTS.mobile.width === 390, 'Mobile Viewport chuẩn hóa 390px (iPhone Retina standard)');

  // Kiểm thử tính toán tràn ngang
  const noOverflow = VisualMath.checkHorizontalOverflow(390, 390);
  assert(noOverflow.hasOverflow === false && noOverflow.overflowPx === 0, 'Khớp hoàn toàn innerWidth không phát sinh tràn ngang');

  const subpixelTolerance = VisualMath.checkHorizontalOverflow(390.8, 390);
  assert(subpixelTolerance.hasOverflow === false, 'Dung sai 1px triệt tiêu cảnh báo ảo do sai số làm tròn điểm ảnh phụ');

  const realOverflow = VisualMath.checkHorizontalOverflow(415, 390);
  assert(realOverflow.hasOverflow === true && realOverflow.overflowPx === 25, 'Phát hiện tràn ngang chính xác 25px trên Mobile 390px');

  // --------------------------------------------------------------------------
  // NHÓM 3: ĐỐI CHIẾU DOM BOUNDING BOX & VA CHẠM BỐ CỤC
  // --------------------------------------------------------------------------
  console.log('\n📦 Nhóm 3: Kiểm thử DOM Bounding Box, AABB Collision & Boundary Integrity');

  const boxA = { x: 10, y: 10, width: 100, height: 50, top: 10, right: 110, bottom: 60, left: 10 };
  const boxB = { x: 50, y: 30, width: 100, height: 50, top: 30, right: 150, bottom: 80, left: 50 };
  const boxC = { x: 200, y: 200, width: 80, height: 40, top: 200, right: 280, bottom: 240, left: 200 };

  assert(VisualMath.detectBoxCollision(boxA, boxB) === true, 'Phát hiện chính xác va chạm hộp giữa Box A và Box B');
  assert(VisualMath.detectBoxCollision(boxA, boxC) === false, 'Xác nhận Box A và Box C tách biệt, không phát sinh va chạm đè chữ');

  const zeroBox = { x: 0, y: 0, width: 0, height: 40, top: 0, right: 0, bottom: 40, left: 0 };
  assert(VisualMath.isZeroSized(zeroBox) === true, 'Nhận diện chính xác phần tử 0-width (Ghost Element)');

  const outOfBoundsBox = { x: -20, y: 10, width: 100, height: 40, top: 10, right: 80, bottom: 50, left: -20 };
  assert(VisualMath.isOutOfBounds(outOfBoundsBox, 1440, 900) === true, 'Phát hiện phần tử bị đẩy ra ngoài lề trái (left < 0)');

  // --------------------------------------------------------------------------
  // NHÓM 4: TÍCH HỢP STEALTH BROWSER DRIVER & CDP MOCK EMULATION
  // --------------------------------------------------------------------------
  console.log('\n📦 Nhóm 4: Tích Hợp StealthBrowserDriver & Vận Hành CDP Lifecycle');

  const driver = new StealthBrowserDriver(2026, 'Windows');
  const mockSession = new MockCdpSession();

  // Khởi tạo AutonomousVisualInspector kế thừa session và driver
  const inspector = new AutonomousVisualInspector(mockSession, driver);
  assert(inspector.getSession() === mockSession, 'Inspector kết nối thành công với CDP Session');
  assert(inspector.getDriver() instanceof StealthBrowserDriver, 'Inspector kế thừa StealthBrowserDriver chuẩn doanh nghiệp');

  // Kiểm toán WCAG Contrast qua CDP
  const wcagReport = await inspector.auditWcagContrast();
  assert(wcagReport.totalEvaluated > 0, 'Quét thành công danh sách các phần tử văn bản trong tài liệu');
  assert(wcagReport.aaPassRatio >= 0.95, 'Tỷ lệ đạt chuẩn WCAG AA vượt ngưỡng 95%');
  assert(wcagReport.status === 'PASS', 'Đánh giá WCAG Contrast trả về trạng thái PASS');

  // Kiểm toán Horizontal Overflow trên 3 Viewports
  const overflowReport = await inspector.auditHorizontalOverflow();
  assert(overflowReport.viewports.length === 3, 'Kiểm tra đầy đủ 3 viewports: Desktop, Tablet và Mobile');

  const cdpMetricCalls = mockSession.getCalls('Emulation.setDeviceMetricsOverride');
  assert(cdpMetricCalls.length >= 4, 'Phát lệnh CDP Emulation.setDeviceMetricsOverride cho 3 viewports + 1 khôi phục Desktop');

  const mobileTested = overflowReport.viewports.find(v => v.id === 'mobile');
  assert(mobileTested !== undefined && mobileTested.width === 390, 'Viewport Mobile 390px được kiểm toán chính xác');
  assert(overflowReport.status === 'PASS', 'Kiểm toán tràn viền ngang toàn diện đạt chuẩn PASS');

  // Kiểm toán DOM Bounding Box
  const boxReport = await inspector.auditBoundingBoxes();
  assert(boxReport.elementsAudited > 0, 'Thực hiện kiểm toán đo đạc các hộp phần tử DOM then chốt');
  assert(boxReport.zeroSizedCount === 0, 'Không phát hiện phần tử 0-size rỗng nào');
  assert(boxReport.outOfBoundsCount === 0, 'Không có phần tử layout nào bị vỡ tràn khung nhìn');

  // --------------------------------------------------------------------------
  // NHÓM 5: BỘ KIỂM TOÁN TỔNG HỢP & HARD GATING ENFORCEMENT
  // --------------------------------------------------------------------------
  console.log('\n📦 Nhóm 5: Kiểm định Báo Cáo Tổng Hợp & Cơ Chế Hard Gating Tối Cao');

  const fullReport = await inspector.runFullVisualAudit({ url: 'http://localhost:5173' });
  assert(fullReport.overallScore >= 8.5, `Điểm tổng hợp đạt chuẩn xuất sắc: ${fullReport.overallScore}/10.0 (>= 8.5)`);
  assert(fullReport.overallVerdict === 'PASS', 'Phán quyết tổng thể đạt PASS tuyệt đối');
  assert(typeof fullReport.summary === 'string' && fullReport.summary.includes('AutonomousVisualInspector'), 'Báo cáo tổng hợp xuất văn bản tóm tắt đầy đủ');

  // Thử nghiệm cơ chế Hard Gating: Giả lập vi phạm tràn màn hình trên mobile
  const customViolatingViewports = [
    { id: 'mobile', name: 'Mobile', width: 390, height: 844, deviceScaleFactor: 3, isMobile: true, hasTouch: true }
  ];

  // Mock session đặc biệt để giả lập lỗi tràn
  class OverflowingMockSession extends MockCdpSession {
    async send(method, params) {
      if (method === 'Runtime.evaluate') {
        return {
          result: {
            value: {
              innerWidth: 390,
              scrollWidth: 420,
              hasOverflow: true,
              overflowPx: 30,
              offenders: [{ selector: '.overflowing-card', tag: 'div', width: 420, scrollWidth: 420, right: 420, overflowPx: 30 }]
            }
          }
        };
      }
      return super.send(method, params);
    }
  }

  const failingInspector = new AutonomousVisualInspector(new OverflowingMockSession(), driver);
  const failingOverflowReport = await failingInspector.auditHorizontalOverflow(customViolatingViewports);
  assert(failingOverflowReport.hardGated === true, 'Cơ chế Hard Gating tự động kích hoạt khi phát hiện tràn màn hình trên mobile');
  assert(failingOverflowReport.status === 'FAIL', 'Báo cáo tràn ngang bị đánh rớt (FAIL) do vi phạm quy tắc bất biến');

  const failingFullReport = await failingInspector.runFullVisualAudit({ customViewports: customViolatingViewports });
  assert(failingFullReport.overallVerdict === 'FAIL', 'Phán quyết toàn cục bị ép cứng FAIL khi vi phạm Hard Gating');
  assert(failingFullReport.overallScore <= 6.5, `Điểm tổng hợp bị trừ phạt nặng xuống ${failingFullReport.overallScore}/10.0 (<= 6.5)`);

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
