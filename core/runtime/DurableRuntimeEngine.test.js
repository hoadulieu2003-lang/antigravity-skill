/**
 * ⚡ ANTIGRAVITY ENTERPRISE - KHỐI KỸ THUẬT PHẦN MỀM
 * 🏛️ POD 1: RUNNER KIỂM THỬ ĐƠN VỊ ĐỘC LẬP
 * File: c:/Users/game/.gemini/core/runtime/DurableRuntimeEngine.test.js
 * 
 * Kiểm toán khép kín:
 * 1. Khởi tạo phiên & Ghi nhật ký Write-Ahead Log (WAL).
 * 2. Xác thực chuỗi băm mật mã SHA-256 (Tamper-evident Chain).
 * 3. Chụp bản sao trạng thái định kỳ (Periodic Snapshotting & Compaction).
 * 4. Luồng phê duyệt tác vụ nguy hiểm của Anh (Human-in-the-Loop Approval Gate).
 * 5. Giả lập sự cố sập nguồn & Phát hiện vùng bất định (Crash Window Detection).
 * 6. Giải quyết vùng bất định & Khôi phục chính xác (Exact Resume).
 * 7. Kiểm chứng đối soát đẳng thức dữ liệu trạng thái (State Parity & Idempotency).
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const assert = require('assert');
const {
  FileJournalStorage,
  StateReducer,
  DurableRuntimeEngine,
} = require('./DurableRuntimeEngine');

// Thư mục test cô lập
const TEST_STORAGE_DIR = path.join(__dirname, '__test_journal_store__');

function cleanTestDir() {
  if (fs.existsSync(TEST_STORAGE_DIR)) {
    fs.rmSync(TEST_STORAGE_DIR, { recursive: true, force: true });
  }
}

// Xóa file test.txt tạm thời nếu tồn tại
const tempTestTxt = path.join(__dirname, 'test.txt');
if (fs.existsSync(tempTestTxt)) {
  fs.unlinkSync(tempTestTxt);
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
  console.log('⚡ POD 1: DURABLE RUNTIME ENGINE - COMPREHENSIVE TEST SUITE');
  console.log('================================================================\n');

  cleanTestDir();
  const storage = new FileJournalStorage(TEST_STORAGE_DIR);
  const sessionId = 'session_test_enterprise_001';

  // --------------------------------------------------------------------------
  console.log('🧪 Test Group 1: Khởi Tạo Phiên & Write-Ahead Log');
  // --------------------------------------------------------------------------
  const runtime = new DurableRuntimeEngine(storage, { snapshotInterval: 3 });

  await itAsync('1.1. Khởi tạo phiên làm việc và ghi nhận sự kiện SessionStarted xuống đĩa', async () => {
    const evt = await runtime.commitEvent(sessionId, 'SessionStarted', {
      sessionId,
      initialGoal: 'Tái cấu trúc kiến trúc hạ tầng Cloudflare Workers',
      actor: 'Anh (Lead Architect)',
      modelId: 'gemini-3.8-flash',
      configuration: {
        snapshotFrequency: 3,
        requireApprovalForSideEffects: true,
        allowedTools: ['read_file', 'run_command', 'deploy_worker'],
      },
    });

    const state = runtime.getState();
    assert.strictEqual(state.currentSeq, 1);
    assert.strictEqual(state.status, 'READY');
    assert.strictEqual(state.goal, 'Tái cấu trúc kiến trúc hạ tầng Cloudflare Workers');

    // Kiểm tra file trên đĩa
    const journalPath = path.join(TEST_STORAGE_DIR, `session_${sessionId}.events.jsonl`);
    assert.ok(fs.existsSync(journalPath), 'File events.jsonl phải tồn tại trên đĩa');
    const content = fs.readFileSync(journalPath, 'utf-8');
    assert.ok(content.includes('SessionStarted'), 'Nội dung file phải chứa SessionStarted');
  });

  // --------------------------------------------------------------------------
  console.log('\n🧪 Test Group 2: Chuỗi Băm Mật Mã Tamper-Evident SHA-256');
  // --------------------------------------------------------------------------
  await itAsync('2.1. Xác thực liên kết hash chain giữa các sự kiện kế tiếp', async () => {
    const evt1 = await runtime.commitEvent(sessionId, 'AgentDecided', {
      turnId: 1,
      thoughtSummary: 'Phân tích file cấu hình wrangler.json',
      intent: 'Đọc cấu hình',
      proposedAction: 'INVOKE_TOOL',
    });

    const evt2 = await runtime.commitEvent(sessionId, 'ToolRequested', {
      callId: 'call_read_01',
      toolName: 'read_file',
      arguments: { path: 'wrangler.json' },
      isSideEffecting: false,
      idempotencyKey: 'idem_read_01',
    });

    // Hash của evt2.previousHash phải khớp chính xác với evt1.eventHash
    assert.strictEqual(evt2.previousHash, evt1.eventHash, 'previousHash của evt2 phải khớp eventHash của evt1');

    // Tính toán độc lập để kiểm chứng
    const expectedHash = StateReducer.computeEventHash(
      sessionId,
      evt2.seq,
      evt2.type,
      evt2.payload,
      evt2.previousHash
    );
    assert.strictEqual(evt2.eventHash, expectedHash, 'eventHash phải là hàm băm SHA-256 tất định');
  });

  // --------------------------------------------------------------------------
  console.log('\n🧪 Test Group 3: Snapshotting Định Kỳ & State Compaction');
  // --------------------------------------------------------------------------
  await itAsync('3.1. Tự động chụp Snapshot khi vượt ngưỡng snapshotInterval (3 events)', async () => {
    // seq = 3 (ToolRequested) đã kích hoạt snapshot đầu tiên
    const snapshotPath = path.join(TEST_STORAGE_DIR, `session_${sessionId}.snapshots.jsonl`);
    assert.ok(fs.existsSync(snapshotPath), 'File snapshots.jsonl phải tồn tại');
    const latestSnapshot = await storage.getLatestSnapshot(sessionId);
    assert.ok(latestSnapshot !== null, 'Phải truy xuất được snapshot mới nhất');
    assert.strictEqual(latestSnapshot.upToSeq, 3, 'Snapshot đầu tiên phải chốt tại seq 3');

    // Tiếp tục hoàn tất ToolExecuted
    await runtime.commitEvent(sessionId, 'ToolExecuted', {
      callId: 'call_read_01',
      toolName: 'read_file',
      status: 'SUCCESS',
      output: { compatibility_date: '2026-09-24' },
      durationMs: 35,
    });

    const state = runtime.getState();
    assert.strictEqual(state.status, 'READY');
    assert.ok(state.snapshotCount >= 1, 'snapshotCount phải >= 1');
    assert.ok(state.lastSnapshotSeq >= 3, 'lastSnapshotSeq phải >= 3');
  });

  // --------------------------------------------------------------------------
  console.log('\n🧪 Test Group 4: Human-in-the-Loop Approval Workflow');
  // --------------------------------------------------------------------------
  const sideEffectCallId = 'call_deploy_wrangler_99';

  await itAsync('4.1. Công cụ có side-effect phải chuyển sang trạng thái AWAITING_HUMAN_APPROVAL', async () => {
    await runtime.commitEvent(sessionId, 'AgentDecided', {
      turnId: 2,
      thoughtSummary: 'Triển khai Worker lên edge network',
      intent: 'Deploy Worker',
      proposedAction: 'INVOKE_TOOL',
    });

    await runtime.commitEvent(sessionId, 'ToolRequested', {
      callId: sideEffectCallId,
      toolName: 'deploy_worker',
      arguments: { environment: 'production', tag: 'v2.4.0' },
      isSideEffecting: true,
      idempotencyKey: 'idem_deploy_99',
    });

    const state = runtime.getState();
    assert.strictEqual(state.status, 'AWAITING_HUMAN_APPROVAL');
    const pendingCall = state.pendingToolCalls[sideEffectCallId];
    assert.ok(pendingCall, 'Phải lưu lệnh gọi vào pendingToolCalls');
    assert.strictEqual(pendingCall.approvalStatus, 'PENDING_APPROVAL');
  });

  await itAsync('4.2. Anh duyệt lệnh gọi và trạng thái chuyển sang EXECUTING_TOOL', async () => {
    await runtime.commitEvent(sessionId, 'HumanApproved', {
      callId: sideEffectCallId,
      approvedBy: 'Anh (Lead Architect)',
      decision: 'APPROVED',
      feedbackNotes: 'Duyệt deploy production sau khi review diff',
    });

    const state = runtime.getState();
    assert.strictEqual(state.status, 'EXECUTING_TOOL');
    const pendingCall = state.pendingToolCalls[sideEffectCallId];
    assert.strictEqual(pendingCall.approvalStatus, 'APPROVED');
  });

  // --------------------------------------------------------------------------
  console.log('\n🧪 Test Group 5: Crash Simulation & Crash Window Detection (Kiso Law)');
  // --------------------------------------------------------------------------
  await itAsync('5.1. Mô phỏng sập nguồn và khởi động lại lạnh (Cold Reboot), phát hiện chính xác vùng bất định', async () => {
    // KHÔNG ghi ToolExecuted! Giả lập tiến trình bị SIGKILL ngay tại đây.
    // Khởi tạo một thể hiện runtime hoàn toàn mới từ đĩa trống:
    const rebootedRuntime = new DurableRuntimeEngine(storage, { snapshotInterval: 3 });

    const recoveryReport = await rebootedRuntime.recover(sessionId);

    assert.ok(recoveryReport.snapshotUsed, 'Phải tận dụng Snapshot để nạp trạng thái cơ sở');
    assert.ok(recoveryReport.eventsReplayed > 0, 'Phải replay các sự kiện sau snapshot');
    assert.strictEqual(recoveryReport.uncertainCallsCount, 1, 'Phải phát hiện chính xác 1 lệnh gọi dở dang');

    const recoveredState = rebootedRuntime.getState();
    assert.strictEqual(recoveredState.status, 'AWAITING_RECOVERY_DECISION', 'Trạng thái phải là AWAITING_RECOVERY_DECISION');

    const uncertainCall = recoveredState.uncertainCalls[sideEffectCallId];
    assert.ok(uncertainCall, 'Phải lưu lệnh vào danh mục uncertainCalls');
    assert.strictEqual(uncertainCall.toolName, 'deploy_worker');
    assert.ok(uncertainCall.detectionReason.includes('pending execution before process termination'));
  });

  // --------------------------------------------------------------------------
  console.log('\n🧪 Test Group 6: Recovery Resolution & Exact Resume');
  // --------------------------------------------------------------------------
  await itAsync('6.1. Anh xác nhận xử lý vùng bất định và đưa hệ thống về đích thành công', async () => {
    const activeRuntime = new DurableRuntimeEngine(storage, { snapshotInterval: 3 });
    await activeRuntime.recover(sessionId);

    // Anh giải quyết bằng MANUAL_INTERVENTION_ACKNOWLEDGED
    await activeRuntime.resolveRecovery(
      sessionId,
      sideEffectCallId,
      'MANUAL_INTERVENTION_ACKNOWLEDGED',
      'Anh (Lead Architect)',
      'Đã kiểm tra Cloudflare Dashboard xác nhận deployment v2.4.0 đã live 100%.'
    );

    // Ghi nhận ToolExecuted
    await activeRuntime.commitEvent(sessionId, 'ToolExecuted', {
      callId: sideEffectCallId,
      toolName: 'deploy_worker',
      status: 'SUCCESS',
      output: { workerId: 'wrk_99', url: 'https://api.enterprise.antigravity.ai' },
      durationMs: 820,
    });

    // Kết thúc phiên
    await activeRuntime.commitEvent(sessionId, 'SessionCompleted', {
      finalOutput: 'Toàn bộ hạ tầng Cloudflare Workers đã được triển khai bền vững và thành công.',
      totalTurns: 2,
      totalDurationMs: 1450,
    });

    const finalState = activeRuntime.getState();
    assert.strictEqual(finalState.status, 'COMPLETED');
    assert.strictEqual(Object.keys(finalState.pendingToolCalls).length, 0);
    assert.strictEqual(Object.keys(finalState.uncertainCalls).length, 0);
    assert.strictEqual(finalState.executionHistory.length, 2);
  });

  // --------------------------------------------------------------------------
  console.log('\n🧪 Test Group 7: Idempotency & Clean State Parity');
  // --------------------------------------------------------------------------
  await itAsync('7.1. Replay lại từ đầu một phiên đã hoàn tất phải cho trạng thái đồng nhất tuyệt đối', async () => {
    const replayRuntime = new DurableRuntimeEngine(storage, { snapshotInterval: 3 });
    const result = await replayRuntime.recover(sessionId);

    assert.strictEqual(result.recoveredState.status, 'COMPLETED');
    assert.strictEqual(result.uncertainCallsCount, 0);
    assert.strictEqual(result.recoveredState.executionHistory.length, 2);
  });

  // Dọn dẹp sau khi test xong
  cleanTestDir();

  console.log('\n================================================================');
  console.log(`📊 TỔNG KẾT KIỂM THỬ: ${passCount} PASSED / ${failCount} FAILED`);
  console.log('================================================================\n');

  if (failCount > 0) {
    process.exit(1);
  }
}

runTestSuite().catch((err) => {
  console.error('Fatal Test Runner Error:', err);
  process.exit(1);
});
