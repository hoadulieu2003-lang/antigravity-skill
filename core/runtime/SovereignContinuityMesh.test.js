/**
 * ⚡ ANTIGRAVITY ENTERPRISE - KHỐI KỸ THUẬT PHẦN MỀM
 * 🏛️ POD 1: RUNNER KIỂM THỬ ĐƠN VỊ ĐỘC LẬP
 * File: c:/Users/game/.gemini/core/runtime/SovereignContinuityMesh.test.js
 * 
 * Kiểm toán khép kín:
 * 1. Khởi tạo State Mesh & Đăng ký đội hình 6 Pods nòng cốt.
 * 2. Bảo mật mật mã HMAC-SHA256 & Phát hiện chống giả mạo (Tamper-evident).
 * 3. Đồng bộ hóa sự kiện liên Pod qua Pub/Sub & Cập nhật Vector Clocks.
 * 4. 4 Tầng Bộ nhớ Sovereign (Working, Episodic, Semantic, Procedural).
 * 5. Snapshotting định kỳ & Rút gọn trạng thái (Compaction).
 * 6. Giả lập khởi động lại lạnh (Cold Restart) & Phục hồi nguyên vẹn bộ nhớ qua nhiều phiên.
 * 7. Kiểm thử phòng thủ: Phát hiện và chặn đứng file bị sửa đổi trái phép trên ổ đĩa.
 * 8. Hợp tác chuyển giao tác vụ liên Pod (Task Handoff & Session Bridging).
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');
const {
  SovereignCryptoGuard,
  SovereignMemoryVault,
  SovereignContinuityMesh,
} = require('./SovereignContinuityMesh');

const TEST_MESH_DIR = path.join(__dirname, '__test_sovereign_mesh__');
const TEST_SECRET = 'antigravity_sovereign_fleet_master_key_2026';

function cleanTestDir() {
  if (fs.existsSync(TEST_MESH_DIR)) {
    fs.rmSync(TEST_MESH_DIR, { recursive: true, force: true });
  }
}

let passCount = 0;
let failCount = 0;

function it(description, fn) {
  try {
    fn();
    passCount++;
    console.log(`  ✅ [PASS] ${description}`);
  } catch (err) {
    failCount++;
    console.error(`  ❌ [FAIL] ${description}`);
    console.error(err);
  }
}

async function itAsync(description, fn) {
  try {
    await fn();
    passCount++;
    console.log(`  ✅ [PASS] ${description}`);
  } catch (err) {
    failCount++;
    console.error(`  ❌ [FAIL] ${description}`);
    console.error(err);
  }
}

async function runTestSuite() {
  console.log('================================================================');
  console.log('⚡ POD 1: SOVEREIGN CONTINUITY MESH - COMPREHENSIVE TEST SUITE');
  console.log('================================================================\n');

  cleanTestDir();

  // --------------------------------------------------------------------------
  console.log('🧪 Test Group 1: Khởi Tạo Lưới Trạng Thái (State Mesh) & Fleet Registration');
  // --------------------------------------------------------------------------
  const mesh = new SovereignContinuityMesh({
    meshDir: TEST_MESH_DIR,
    sovereignSecret: TEST_SECRET,
    snapshotIntervalEvents: 5,
  });

  it('1.1. Khởi tạo Lưới với đầy đủ 6 Pods nòng cốt và Vector Clocks ban đầu bằng 0', () => {
    const pods = mesh.getAllPods();
    assert.strictEqual(pods.length, 6, 'Phải có đúng 6 pods mặc định');
    
    const pod1 = mesh.getPod('pod_1');
    assert.ok(pod1 !== null, 'Pod 1 phải tồn tại');
    assert.strictEqual(pod1.status, 'IDLE');
    assert.strictEqual(pod1.currentSeq, 0);

    const vclock = mesh.getVectorClock();
    assert.strictEqual(vclock['pod_1'], 0);
    assert.strictEqual(vclock['pod_6'], 0);
  });

  it('1.2. Cập nhật trạng thái và heartbeat của Pod trong lưới', () => {
    mesh.updatePodStatus('pod_1', 'BUSY', { task: 'Continuity Mesh Bootstrap' });
    const pod1 = mesh.getPod('pod_1');
    assert.strictEqual(pod1.status, 'BUSY');
    assert.strictEqual(pod1.metadata.task, 'Continuity Mesh Bootstrap');
  });

  // --------------------------------------------------------------------------
  console.log('\n🧪 Test Group 2: Bảo Vệ Toàn Vẹn Mật Mã HMAC-SHA256 (Tamper Resistance)');
  // --------------------------------------------------------------------------
  const cryptoGuard = new SovereignCryptoGuard(TEST_SECRET);

  it('2.1. Ký và xác thực chữ ký HMAC-SHA256 với constant-time comparison', () => {
    const rawData = 'Antigravity Enterprise State Verification';
    const sig = cryptoGuard.sign(rawData);
    assert.ok(typeof sig === 'string' && sig.length === 64, 'HMAC phải là chuỗi hex 64 ký tự (256-bit)');
    assert.ok(cryptoGuard.verify(rawData, sig), 'Chữ ký hợp lệ phải được xác thực thành công');
  });

  it('2.2. Phát hiện và từ chối dữ liệu bị giả mạo hoặc sai lệch chữ ký', () => {
    const rawData = 'Antigravity Enterprise State Verification';
    const tamperedData = 'Antigravity Enterprise State Verification (TAMPERED)';
    const sig = cryptoGuard.sign(rawData);
    assert.strictEqual(cryptoGuard.verify(tamperedData, sig), false, 'Dữ liệu bị sửa đổi phải bị từ chối');

    const fakeSig = sig.substring(0, 62) + '00';
    assert.strictEqual(cryptoGuard.verify(rawData, fakeSig), false, 'Chữ ký giả mạo phải bị từ chối');
  });

  // --------------------------------------------------------------------------
  console.log('\n🧪 Test Group 3: Đồng Bộ Sự Kiện Liên Pod (Event Sync & Pub/Sub)');
  // --------------------------------------------------------------------------
  await itAsync('3.1. Phân phối sự kiện có chữ ký và thăng tiến Vector Clock nhân quả', async () => {
    let receivedEvent = null;
    const unsubscribe = mesh.subscribe('task_handoff', (evt) => {
      receivedEvent = evt;
    });

    const publishedEvt = await mesh.publish(
      'pod_6',
      'task_handoff',
      {
        mission: 'Audit Security Defense-in-Depth',
        priority: 'CRITICAL',
      },
      'pod_3'
    );

    assert.ok(receivedEvent !== null, 'Subscriber phải nhận được sự kiện');
    assert.strictEqual(receivedEvent.eventId, publishedEvt.eventId);
    assert.strictEqual(receivedEvent.senderPodId, 'pod_6');
    assert.strictEqual(receivedEvent.seq, 1);
    assert.strictEqual(receivedEvent.vectorClock['pod_6'], 1);
    assert.ok(cryptoGuard.verifyEvent(receivedEvent), 'Chữ ký sự kiện nhận được phải hợp lệ');

    unsubscribe();
  });

  // --------------------------------------------------------------------------
  console.log('\n🧪 Test Group 4: 4 Tầng Bộ Nhớ Sovereign (Working, Episodic, Semantic, Procedural)');
  // --------------------------------------------------------------------------
  it('4.1. Lưu trữ và truy xuất Working Memory với chữ ký toàn vẹn', () => {
    mesh.vault.set('session:active_task', { taskId: 'wp_r2_pod_1', stage: 'testing' }, 'WORKING', 'pod_1', ['active']);
    const val = mesh.vault.get('session:active_task');
    assert.deepStrictEqual(val, { taskId: 'wp_r2_pod_1', stage: 'testing' });
  });

  it('4.2. Ghi nhận Episodic Record (Ký ức phiên hành động)', () => {
    const episode = {
      episodeId: 'ep_20260927_001',
      taskId: 'wp_r2_pod_1',
      podId: 'pod_1',
      goal: 'Thiết kế Sovereign Continuity Mesh',
      outcome: 'SUCCESS',
      turns: 4,
      summary: 'Hoàn thành triển khai và test suite 100% xanh',
      artifacts: ['core/runtime/SovereignContinuityMesh.ts'],
      timestamp: new Date().toISOString(),
    };
    mesh.vault.recordEpisode(episode);
    const retrieved = mesh.vault.get('episodic:ep_20260927_001');
    assert.strictEqual(retrieved.outcome, 'SUCCESS');
    assert.strictEqual(retrieved.turns, 4);
  });

  it('4.3. Lưu trữ Semantic Knowledge & Procedural Invariant Rules', () => {
    // Semantic
    mesh.vault.storeSemanticFact({
      concept: 'Suzent Sovereign AI',
      definition: 'AI agent tự trị nắm giữ trọn vẹn bộ nhớ, hành vi và tính liên tục không phụ thuộc cloud SaaS',
      confidence: 1.0,
      sources: ['cyzus/suzent', 'daily_learnings.md'],
      verifiedBy: 'Anh (Lead Architect)',
    }, 'pod_1');

    const fact = mesh.vault.get('semantic:suzent_sovereign_ai');
    assert.strictEqual(fact.concept, 'Suzent Sovereign AI');
    assert.strictEqual(fact.verifiedBy, 'Anh (Lead Architect)');

    // Procedural
    mesh.vault.storeProceduralRule({
      ruleId: 'rule_luminous_light_theme',
      domain: 'UI/UX',
      condition: 'When creating UI components or mockups',
      action: 'Apply Luminous Light Theme (Warm Paper #FAF9F6, Ivory #FDFBF7, Alabaster #F8F9FA)',
      isStrictInvariant: true,
    }, 'pod_4');

    const rule = mesh.vault.get('procedural:rule_luminous_light_theme');
    assert.strictEqual(rule.isStrictInvariant, true);
  });

  // --------------------------------------------------------------------------
  console.log('\n🧪 Test Group 5: Snapshotting & Rút Gọn Trạng Thái (Compaction)');
  // --------------------------------------------------------------------------
  await itAsync('5.1. Tự động chụp Snapshot khi đạt ngưỡng snapshotIntervalEvents (5 sự kiện)', async () => {
    // Chúng ta đã publish 1 event từ pod_6 ở test 3.1. Publish thêm 4 events từ pod_1 để đủ 5.
    for (let i = 1; i <= 4; i++) {
      await mesh.publish('pod_1', 'state_sync', { tick: i });
    }

    const snapshotPath = path.join(TEST_MESH_DIR, 'sovereign_mesh.snapshot.json');
    assert.ok(fs.existsSync(snapshotPath), 'File sovereign_mesh.snapshot.json phải tồn tại trên đĩa');

    const raw = fs.readFileSync(snapshotPath, 'utf-8');
    const snapshot = JSON.parse(raw);
    assert.ok(snapshot.snapshotId.startsWith('snp_mesh_'));
    assert.strictEqual(snapshot.vectorClock['pod_1'], 4);
    assert.strictEqual(snapshot.vectorClock['pod_6'], 1);
    assert.ok(snapshot.memoryStore['episodic:ep_20260927_001'] !== undefined, 'Snapshot phải chứa episodic memory');
  });

  // --------------------------------------------------------------------------
  console.log('\n🧪 Test Group 6: Khởi Động Lại Lạnh (Cold Restart Simulation)');
  // --------------------------------------------------------------------------
  await itAsync('6.1. Giả lập tắt máy sập nguồn và khôi phục 100% trạng thái & bộ nhớ dài hạn', async () => {
    // Publish thêm 1 sự kiện sau snapshot để thử nghiệm cơ chế Snapshot + Journal replay
    await mesh.publish('pod_2', 'lifecycle', { action: 'SKILL_COMPILATION_COMPLETE' });

    // Tạo một phiên Mesh hoàn toàn mới (mô phỏng khởi động lại máy tính)
    const freshRebootMesh = new SovereignContinuityMesh({
      meshDir: TEST_MESH_DIR,
      sovereignSecret: TEST_SECRET,
    });

    const recoveryReport = await freshRebootMesh.loadFromDisk();
    assert.strictEqual(recoveryReport.snapshotLoaded, true, 'Snapshot phải được nạp thành công');
    assert.strictEqual(recoveryReport.eventsReplayed, 1, 'Phải replay chính xác 1 sự kiện sau snapshot');

    // Kiểm tra tính toàn vẹn trạng thái sau reboot
    const restoredVClock = freshRebootMesh.getVectorClock();
    assert.strictEqual(restoredVClock['pod_1'], 4, 'Vector clock của Pod 1 phải là 4');
    assert.strictEqual(restoredVClock['pod_6'], 1, 'Vector clock của Pod 6 phải là 1');
    assert.strictEqual(restoredVClock['pod_2'], 1, 'Vector clock của Pod 2 phải là 1');

    // Kiểm tra bộ nhớ dài hạn được bảo toàn
    const episodic = freshRebootMesh.vault.get('episodic:ep_20260927_001');
    assert.ok(episodic !== null);
    assert.strictEqual(episodic.outcome, 'SUCCESS');

    const semantic = freshRebootMesh.vault.get('semantic:suzent_sovereign_ai');
    assert.ok(semantic !== null);
    assert.strictEqual(semantic.concept, 'Suzent Sovereign AI');
  });

  // --------------------------------------------------------------------------
  console.log('\n🧪 Test Group 7: Kiểm Thử Phòng Thủ - Chống Sửa Đổi Trái Phép File Trên Đĩa');
  // --------------------------------------------------------------------------
  await itAsync('7.1. Chặn đứng và báo động khi file nhật ký bị can thiệp trái phép', async () => {
    const journalPath = path.join(TEST_MESH_DIR, 'sovereign_mesh.journal.jsonl');
    const content = fs.readFileSync(journalPath, 'utf-8');
    
    // Giả lập hacker sửa đổi nội dung payload trong journal
    const tamperedContent = content.replace('SKILL_COMPILATION_COMPLETE', 'INJECTED_MALICIOUS_PAYLOAD');
    fs.writeFileSync(journalPath, tamperedContent, 'utf-8');

    const defenseMesh = new SovereignContinuityMesh({
      meshDir: TEST_MESH_DIR,
      sovereignSecret: TEST_SECRET,
    });

    let detectedTamper = false;
    try {
      await defenseMesh.loadFromDisk();
    } catch (err) {
      if (err.message.includes('[TAMPER_DETECTED]')) {
        detectedTamper = true;
      }
    }
    assert.strictEqual(detectedTamper, true, 'Hệ thống bắt buộc phải phát hiện giả mạo và từ chối khởi động');

    // Khôi phục lại nội dung sạch cho các test tiếp theo
    fs.writeFileSync(journalPath, content, 'utf-8');
  });

  // --------------------------------------------------------------------------
  console.log('\n🧪 Test Group 8: Cầu Nối Phiên Tác Vụ Bền Vững (Durable Session Handoff)');
  // --------------------------------------------------------------------------
  await itAsync('8.1. Chuyển giao phiên bền vững từ Pod 1 sang Pod 3 TwinCheck', async () => {
    const handoffEvt = await mesh.bridgeSessionHandoff(
      'session_durable_kiso_99',
      'pod_1',
      'pod_3',
      {
        action: 'VERIFY_NEGATIVE_TWIN_DELTA',
        filesChanged: ['core/runtime/SovereignContinuityMesh.ts'],
        checksum: 'sha256_verified',
      }
    );

    assert.strictEqual(handoffEvt.senderPodId, 'pod_1');
    assert.strictEqual(handoffEvt.targetPodId, 'pod_3');
    assert.strictEqual(handoffEvt.channel, 'task_handoff');
    assert.strictEqual(handoffEvt.payload.sessionId, 'session_durable_kiso_99');
    assert.ok(cryptoGuard.verifyEvent(handoffEvt), 'Chữ ký bàn giao phải hoàn toàn hợp lệ');
  });

  cleanTestDir();

  // --------------------------------------------------------------------------
  console.log('\n================================================================');
  console.log(`📊 TỔNG KẾT KIỂM THỬ: ${passCount} PASSED / ${failCount} FAILED`);
  console.log('================================================================\n');

  if (failCount > 0) {
    process.exit(1);
  }
}

runTestSuite().catch(err => {
  console.error('Fatal Test Runner Error:', err);
  process.exit(1);
});
