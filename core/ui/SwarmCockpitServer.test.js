/**
 * ⚡ ANTIGRAVITY ENTERPRISE - BỘ KIỂM THỬ ĐƠN VỊ ĐỘC LẬP
 * 🏛️ POD 4: SWARM COCKPIT SERVER & UI DESIGNER AUDIT HARNESS
 * 
 * Kiểm toán toàn diện:
 * 1. Khởi tạo và vòng đời HTTP Server Node.js (start, stop, port, isRunning).
 * 2. Phục vụ dashboard HTML (GET /) chứa chuẩn Luminous Light Theme, Emil Kowalski Physics & PAWS Canvas.
 * 3. Endpoint Telemetry Hạm đội (GET /api/fleet-status) với 6 Pods và mô phỏng PAWS.
 * 4. Endpoint Design Tokens Luminous (GET /api/tokens).
 * 5. Cổng phê duyệt HITL Gate Approval & HMAC-SHA256 Signature (POST /api/hitl-approve).
 * 6. Cổng từ chối HITL Gate Rejection (POST /api/hitl-reject).
 * 7. Cập nhật chính sách PAWS thời gian thực (POST /api/paws-update).
 * 8. Bảo an, Headers chống clickjacking và kiểm toán mã lỗi 400 / 404.
 * 9. Kiểm toán độ tương phản WCAG AA >= 4.5:1.
 * 
 * Chủ quản: Anh (Lead Architect / Product Owner)
 * Tác tử kiểm toán: Pod 4 Independent Auditor
 */

const assert = require('assert');
const http = require('http');
const path = require('path');
const { SwarmCockpitServer } = require('./SwarmCockpitServer.js');
const { GenerativeAGUIEngine, LUMINOUS_DESIGN_TOKENS } = require('./GenerativeAGUIEngine.js');

let passCount = 0;
let failCount = 0;
const testResults = [];

async function test(name, fn) {
  try {
    await fn();
    passCount++;
    testResults.push({ name, status: 'PASSED' });
    console.log(`  ✓ [PASS] ${name}`);
  } catch (err) {
    failCount++;
    testResults.push({ name, status: 'FAILED', error: err.message });
    console.error(`  ✕ [FAIL] ${name}: ${err.message}`);
  }
}

// Helper thực hiện HTTP Request nội bộ (Zero External Network Calls)
function makeHttpRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body,
        });
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (postData) {
      req.write(typeof postData === 'string' ? postData : JSON.stringify(postData));
    }
    req.end();
  });
}

async function runTestSuite() {
  console.log('================================================================');
  console.log('⚡ POD 4: SWARM COCKPIT SERVER & LIVE UI — SUITE KIỂM THỬ ĐƠN VỊ');
  console.log('🏛️ CHỦ QUẢN: ANH (LEAD ARCHITECT / PRODUCT OWNER)');
  console.log('================================================================');

  let server = null;
  let testPort = 0;

  // ----------------------------------------------------------------------------
  // SUITE 1: SERVER LIFECYCLE & INITIALIZATION
  // ----------------------------------------------------------------------------
  console.log('\n--- SUITE 1: SERVER LIFECYCLE & PORT BINDING ---');

  await test('TEST 01: Server Initialization - Khởi tạo SwarmCockpitServer với 2 cổng HITL mặc định', async () => {
    const engine = new GenerativeAGUIEngine('Test Fleet');
    server = new SwarmCockpitServer(engine);
    assert.strictEqual(server.isRunning(), false);
    assert.strictEqual(server.getPort(), null);

    const status = server.getFleetStatus();
    assert.ok(status);
    assert.strictEqual(status.fleetName, 'Antigravity Enterprise Autonomous Fleet');
    assert.strictEqual(status.hitlGates.length >= 2, true);
  });

  await test('TEST 02: Dynamic Port Start & Graceful Shutdown - Khởi động và dừng server an toàn', async () => {
    // Port 0 cho phép OS cấp phát port ngẫu nhiên khả dụng
    testPort = await server.start(0);
    assert.ok(testPort > 0, `Port phải là số nguyên dương hợp lệ, thực tế: ${testPort}`);
    assert.strictEqual(server.isRunning(), true);
    assert.strictEqual(server.getPort(), testPort);

    // Kiểm tra tính lũy đẳng khi start lần 2
    const secondStartPort = await server.start(testPort);
    assert.strictEqual(secondStartPort, testPort);
  });

  // ----------------------------------------------------------------------------
  // SUITE 2: STATIC DASHBOARD HTML DELIVERY
  // ----------------------------------------------------------------------------
  console.log('\n--- SUITE 2: DASHBOARD HTML DELIVERY & LUMINOUS INVARIANTS ---');

  await test('TEST 03: GET / Dashboard HTML - Phục vụ file cockpit_dashboard.html với status 200', async () => {
    const res = await makeHttpRequest({
      hostname: '127.0.0.1',
      port: testPort,
      path: '/',
      method: 'GET',
    });

    assert.strictEqual(res.statusCode, 200);
    assert(res.headers['content-type'].includes('text/html'));
    assert(res.body.includes('Antigravity Enterprise Fleet'));
    assert(res.body.includes('pawsWaveCanvas'), 'Phải chứa canvas sóng PAWS 60 FPS');
  });

  await test('TEST 04: HTML Luminous Invariants - Xác thực mã màu Warm Paper và Emil Kowalski Physics', async () => {
    const res = await makeHttpRequest({
      hostname: '127.0.0.1',
      port: testPort,
      path: '/cockpit',
      method: 'GET',
    });

    assert.strictEqual(res.statusCode, 200);
    assert(res.body.includes('#FAF9F6'), 'Phải chứa mã màu Warm Paper #FAF9F6');
    assert(res.body.includes('scale(0.965)'), 'Phải chứa tỷ lệ co lún scale(0.965)');
    assert(res.body.includes('SyntheticHapticController'), 'Phải tích hợp bộ điều khiển WebAudio Haptics');
  });

  // ----------------------------------------------------------------------------
  // SUITE 3: FLEET TELEMETRY STATUS API (GET /api/fleet-status)
  // ----------------------------------------------------------------------------
  console.log('\n--- SUITE 3: FLEET TELEMETRY STATUS API ---');

  await test('TEST 05: GET /api/fleet-status - Trả về đầy đủ thông số 6 Pods chuyên trách', async () => {
    const res = await makeHttpRequest({
      hostname: '127.0.0.1',
      port: testPort,
      path: '/api/fleet-status',
      method: 'GET',
    });

    assert.strictEqual(res.statusCode, 200);
    assert(res.headers['content-type'].includes('application/json'));

    const data = JSON.parse(res.body);
    assert.strictEqual(data.version, '2.0.0-PROD');
    assert.strictEqual(data.founder, 'Anh (Lead Architect & Sole Owner)');
    assert.strictEqual(data.totalVerifiedTests, 82);

    // Xác thực 6 Pods
    const pods = data.pods;
    const requiredPods = ['pod1', 'pod2', 'pod3', 'pod4', 'pod5', 'pod6'];
    for (const p of requiredPods) {
      assert.ok(pods[p], `Pod ${p} bắt buộc phải có mặt`);
      assert.strictEqual(pods[p].status, 'HEALTHY');
      assert.ok(pods[p].throughputOps > 0);
      assert.ok(pods[p].testsPassed > 0);
    }
  });

  await test('TEST 06: PAWS Simulation & 72h Waveform Telemetry - Dữ liệu sóng động lực học chuẩn xác', async () => {
    const res = await makeHttpRequest({
      hostname: '127.0.0.1',
      port: testPort,
      path: '/api/fleet-status',
      method: 'GET',
    });

    const data = JSON.parse(res.body);
    const paws = data.paws;
    assert.ok(paws);
    assert.ok(paws.simulation.velocityOps >= 120);
    assert.strictEqual(typeof paws.simulation.isEquilibriumStable, 'boolean');
    assert.strictEqual(paws.waveform72h.length, 13);
    assert.strictEqual(paws.waveform72h[0].tHours, 0);
    assert.strictEqual(paws.waveform72h[12].tHours, 72);
  });

  // ----------------------------------------------------------------------------
  // SUITE 4: DESIGN TOKENS ENDPOINT (GET /api/tokens)
  // ----------------------------------------------------------------------------
  console.log('\n--- SUITE 4: LUMINOUS TOKENS ENDPOINT ---');

  await test('TEST 07: GET /api/tokens - Cung cấp chuẩn Design Tokens Luminous và Physics', async () => {
    const res = await makeHttpRequest({
      hostname: '127.0.0.1',
      port: testPort,
      path: '/api/tokens',
      method: 'GET',
    });

    assert.strictEqual(res.statusCode, 200);
    const tokens = JSON.parse(res.body);
    assert.strictEqual(tokens.mode, 'light');
    assert.strictEqual(tokens.colors.canvasWarmPaper, '#FAF9F6');
    assert.strictEqual(tokens.physics.buttonPressScale, 'scale(0.965)');
    assert.strictEqual(tokens.physics.durationClickMs, 140);
  });

  // ----------------------------------------------------------------------------
  // SUITE 5: HUMAN-IN-THE-LOOP (HITL) APPROVAL & REJECTION
  // ----------------------------------------------------------------------------
  console.log('\n--- SUITE 5: HITL APPROVAL & CRYPTOGRAPHIC SIGNATURE ---');

  let targetGateId = '';

  await test('TEST 08: POST /api/hitl-approve - Phê duyệt cổng giải phóng với chữ ký HMAC-SHA256', async () => {
    const statusRes = await makeHttpRequest({
      hostname: '127.0.0.1',
      port: testPort,
      path: '/api/fleet-status',
      method: 'GET',
    });
    const statusData = JSON.parse(statusRes.body);
    const pendingGate = statusData.hitlGates.find((g) => g.status === 'PENDING_APPROVAL');
    assert.ok(pendingGate, 'Phải có ít nhất 1 gate PENDING_APPROVAL');
    targetGateId = pendingGate.id;

    const approveRes = await makeHttpRequest(
      {
        hostname: '127.0.0.1',
        port: testPort,
        path: '/api/hitl-approve',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      {
        gateId: targetGateId,
        approverName: 'Anh — Lead Architect & Sole Owner',
        signatureKey: 'OWNER_SUPREME_RELEASE_KEY',
      }
    );

    assert.strictEqual(approveRes.statusCode, 200);
    const approveData = JSON.parse(approveRes.body);
    assert.strictEqual(approveData.success, true);
    assert.strictEqual(approveData.status, 'APPROVED');
    assert.strictEqual(approveData.gateId, targetGateId);
    assert.ok(approveData.signature && approveData.signature.length === 64, 'Chữ ký HMAC-SHA256 phải đủ 64 hex');
  });

  await test('TEST 09: HITL Gate State Persistence - Cổng đã duyệt phản ánh chuẩn xác trên GET /api/fleet-status', async () => {
    const statusRes = await makeHttpRequest({
      hostname: '127.0.0.1',
      port: testPort,
      path: '/api/fleet-status',
      method: 'GET',
    });
    const statusData = JSON.parse(statusRes.body);
    const approvedGate = statusData.hitlGates.find((g) => g.id === targetGateId);
    assert.ok(approvedGate);
    assert.strictEqual(approvedGate.status, 'APPROVED');
    assert.strictEqual(approvedGate.approvedBy, 'Anh — Lead Architect & Sole Owner');
  });

  await test('TEST 10: POST /api/hitl-reject - Từ chối hành động an toàn', async () => {
    const statusRes = await makeHttpRequest({
      hostname: '127.0.0.1',
      port: testPort,
      path: '/api/fleet-status',
      method: 'GET',
    });
    const statusData = JSON.parse(statusRes.body);
    const remainingPending = statusData.hitlGates.find((g) => g.status === 'PENDING_APPROVAL');
    assert.ok(remainingPending, 'Phải còn 1 gate để test từ chối');

    const rejectRes = await makeHttpRequest(
      {
        hostname: '127.0.0.1',
        port: testPort,
        path: '/api/hitl-reject',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      {
        gateId: remainingPending.id,
        approverName: 'Anh — Lead Architect & Sole Owner',
      }
    );

    assert.strictEqual(rejectRes.statusCode, 200);
    const rejectData = JSON.parse(rejectRes.body);
    assert.strictEqual(rejectData.success, true);
    assert.strictEqual(rejectData.status, 'REJECTED');
  });

  // ----------------------------------------------------------------------------
  // SUITE 6: REALTIME PAWS POLICY UPDATE
  // ----------------------------------------------------------------------------
  console.log('\n--- SUITE 6: REALTIME PAWS POLICY UPDATE (POST /api/paws-update) ---');

  await test('TEST 11: POST /api/paws-update - Cập nhật vector chính sách và tính toán lại vận tốc/rủi ro', async () => {
    const updateRes = await makeHttpRequest(
      {
        hostname: '127.0.0.1',
        port: testPort,
        path: '/api/paws-update',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      {
        autonomyCeiling: 85,
        parallelWorkers: 10,
        auditRigorLevel: 5,
      }
    );

    assert.strictEqual(updateRes.statusCode, 200);
    const updateData = JSON.parse(updateRes.body);
    assert.strictEqual(updateData.success, true);
    assert.strictEqual(updateData.policy.autonomyCeiling, 85);
    assert.strictEqual(updateData.policy.parallelWorkers, 10);
    assert.strictEqual(updateData.policy.auditRigorLevel, 5);
    assert.ok(updateData.simulation.velocityOps >= 120);
    assert.strictEqual(updateData.waveform72h.length, 13);
  });

  // ----------------------------------------------------------------------------
  // SUITE 7: ERROR HANDLING & SECURITY HEADERS
  // ----------------------------------------------------------------------------
  console.log('\n--- SUITE 7: ERROR HANDLING & SECURITY HEADERS ---');

  await test('TEST 12: 404 Not Found - Xử lý chuẩn xác endpoint không tồn tại', async () => {
    const res = await makeHttpRequest({
      hostname: '127.0.0.1',
      port: testPort,
      path: '/api/non-existent-route',
      method: 'GET',
    });

    assert.strictEqual(res.statusCode, 404);
    const data = JSON.parse(res.body);
    assert.strictEqual(data.error, 'Endpoint Not Found');
  });

  await test('TEST 13: 400 Bad Request - Từ chối phê duyệt thiếu gateId', async () => {
    const res = await makeHttpRequest(
      {
        hostname: '127.0.0.1',
        port: testPort,
        path: '/api/hitl-approve',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      {}
    );

    assert.strictEqual(res.statusCode, 400);
    const data = JSON.parse(res.body);
    assert.strictEqual(data.success, false);
  });

  await test('TEST 14: Security Headers - Kiểm tra X-Content-Type-Options và X-Frame-Options', async () => {
    const res = await makeHttpRequest({
      hostname: '127.0.0.1',
      port: testPort,
      path: '/api/health',
      method: 'GET',
    });

    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.headers['x-content-type-options'], 'nosniff');
    assert.strictEqual(res.headers['x-frame-options'], 'SAMEORIGIN');
  });

  // ----------------------------------------------------------------------------
  // SUITE 8: WCAG AA CONTRAST & ACCESSIBILITY AUDIT
  // ----------------------------------------------------------------------------
  console.log('\n--- SUITE 8: WCAG CONTRAST & ACCESSIBILITY AUDIT ---');

  await test('TEST 15: WCAG AA Compliance - Tỷ lệ tương phản Text Head / Warm Paper >= 4.5:1', async () => {
    const engine = server.getEngine();
    const compliance = engine.verifyLuminousContrastCompliance();
    assert.strictEqual(compliance.passed, true);
    assert(compliance.ratio >= 4.5, `Độ tương phản thực tế: ${compliance.ratio}:1`);
  });

  // Dọn dẹp tắt server
  await server.stop();
  assert.strictEqual(server.isRunning(), false);

  // ----------------------------------------------------------------------------
  // TỔNG KẾT
  // ----------------------------------------------------------------------------
  console.log('\n================================================================');
  console.log(`📊 TỔNG KẾT KIỂM THỬ: ${passCount} PASSED / ${passCount + failCount} TESTS (${failCount} FAILED)`);
  console.log('================================================================');

  if (failCount > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTestSuite().catch((err) => {
  console.error('Lỗi nghiêm trọng trong runner kiểm thử:', err);
  process.exit(1);
});
