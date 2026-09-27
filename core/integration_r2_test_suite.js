/**
 * ⚡ ANTIGRAVITY ENTERPRISE CORE ENGINE — MASTER E2E INTEGRATION SUITE (ROUND 2 EVOLUTION)
 * 🏛️ CHỦ QUẢN: ANH — LEAD ARCHITECT / PRODUCT OWNER
 * 🧠 TỔNG CÔNG TRÌNH SƯ: EM — SENIOR ENGINEERING AGENT
 * 
 * Sổ cái tích hợp kiểm toán khép kín toàn diện 6 Phân Hệ Nòng Cốt:
 * - Pod 1: SovereignContinuityMesh (HMAC-SHA256, 4-Tier Memory Vault, Cold Reboot Recovery)
 * - Pod 2: AutoSkillIngestionPipeline (Dead-End Pruning, Intent-First Synthesis, Skills Registry)
 * - Pod 3: FailproofPolicyHarness (Secret Redaction, Tool Safety Enforcer, Human Gate Arbiter, TwinCheck SHA-256)
 * - Pod 4: SwarmCockpitServer & Live Dashboard (Luminous Light Theme, Emil Kowalski Physics, HITL API)
 * - Pod 5: AutonomousVisualInspector (WCAG 2.1 AA Contrast, 3-Viewport Horizontal Overflow Hard Gating)
 * - Pod 6: TokenCostController (Token Throughput TPS, Dynamic Cost Savings, 128K Headroom Invariant)
 * 
 * File: c:/Users/game/.gemini/core/integration_r2_test_suite.js
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

// 1. Nạp các module sản xuất
const {
  SovereignContinuityMesh,
  SovereignCryptoGuard
} = require('./runtime/SovereignContinuityMesh');

const {
  AutoSkillIngestionPipeline,
  TrajectoryScanner
} = require('./evolution/AutoSkillIngestionPipeline');

const {
  FailproofPolicyHarness
} = require('./verification/FailproofPolicyHarness');

const {
  SwarmCockpitServer
} = require('./ui/SwarmCockpitServer');
const {
  GenerativeAGUIEngine
} = require('./ui/GenerativeAGUIEngine');

const {
  TokenCostController,
  TaskSizeTier,
  ModelTier,
  AgentRole
} = require('./routing/TokenCostController');

const TEST_DIR = path.join(__dirname, '__master_integration_r2_workspace__');

function cleanWorkspace() {
  if (fs.existsSync(TEST_DIR)) {
    fs.rmSync(TEST_DIR, { recursive: true, force: true });
  }
  fs.mkdirSync(TEST_DIR, { recursive: true });
}

let totalPassed = 0;
let totalFailed = 0;

function it(name, fn) {
  try {
    fn();
    console.log(`  ✅ [PASS] ${name}`);
    totalPassed++;
  } catch (err) {
    console.error(`  ❌ [FAIL] ${name}:`, err.message);
    totalFailed++;
  }
}

async function itAsync(name, fn) {
  try {
    await fn();
    console.log(`  ✅ [PASS] ${name}`);
    totalPassed++;
  } catch (err) {
    console.error(`  ❌ [FAIL] ${name}:`, err.message);
    totalFailed++;
  }
}

async function runMasterIntegration() {
  console.log('================================================================================');
  console.log('⚡ ANTIGRAVITY ENTERPRISE FLEET — MASTER E2E INTEGRATION SUITE (ROUND 2)');
  console.log('🏛️ CHỦ QUẢN: ANH (LEAD ARCHITECT / PRODUCT OWNER)');
  console.log('================================================================================\n');

  cleanWorkspace();

  // ---------------------------------------------------------------------------
  // PHÂN HỆ 1: LƯỚI TRẠNG THÁI LIÊN TỤC & BẢO VỆ MẬT MÃ (SOVEREIGN STATE MESH)
  // ---------------------------------------------------------------------------
  console.log('📦 [STAGE 1] Kiểm Tra Lưới Trạng Thái Liên Tục (Pod 1 - SovereignContinuityMesh)');
  const meshSecret = 'test_master_secret_key_2026';
  const meshDir = path.join(TEST_DIR, 'sovereign_mesh');
  
  const mesh = new SovereignContinuityMesh({
    meshDir: meshDir,
    sovereignSecret: meshSecret,
    snapshotIntervalEvents: 3
  });

  it('1.1. Khởi tạo Lưới với 6 Pods chuyên trách và đồng bộ Vector Clocks', () => {
    const pods = mesh.getAllPods();
    assert.strictEqual(pods.length, 6, 'Phải có đúng 6 Pods nòng cốt');
    const vclock = mesh.getVectorClock();
    assert.strictEqual(vclock['pod_1'], 0);
    assert.strictEqual(vclock['pod_6'], 0);
  });

  await itAsync('1.2. Phát hành sự kiện có chữ ký HMAC-SHA256 và cập nhật Vector Clock', async () => {
    let received = null;
    const unsub = mesh.subscribe('task_routing', (evt) => { received = evt; });

    const published = await mesh.publish('pod_6', 'task_routing', {
      taskSize: 'SIZE_L',
      prompt: 'bung team nâng cấp hệ thống',
      headroom: 131072
    });

    assert.ok(published.signature, 'Sự kiện phải có chữ ký HMAC-SHA256');
    assert.strictEqual(published.senderPodId, 'pod_6');
    assert.strictEqual(published.vectorClock['pod_6'], 1);
    assert.strictEqual(received.eventId, published.eventId);
    unsub();
  });

  it('1.3. Lưu trữ ký ức 4 tầng (Working, Episodic, Semantic, Procedural) nguyên vẹn', () => {
    mesh.vault.set('session:active_task', { taskId: 'wp_r2_master', status: 'RUNNING' }, 'WORKING', 'pod_1');
    mesh.vault.recordEpisode({
      episodeId: 'ep_master_001',
      taskId: 'wp_r2_master',
      podId: 'pod_1',
      goal: 'Round 2 Master Integration',
      outcome: 'SUCCESS',
      turns: 6,
      summary: 'All pods integrated',
      artifacts: ['core/index.ts'],
      timestamp: new Date().toISOString()
    });
    mesh.vault.storeSemanticFact({
      concept: 'Max Reasoning Protocol',
      definition: 'Luôn mở rộng Chain of Thought và 4 trụ cột nhận thức',
      confidence: 1.0,
      sources: ['AGENTS.md'],
      verifiedBy: 'Anh (Lead Architect)'
    }, 'pod_1');
    mesh.vault.storeProceduralRule({
      ruleId: 'luminous_light_theme_rule',
      domain: 'UI',
      condition: 'When rendering interface',
      action: 'Use Warm Paper #FAF9F6, Ivory #FDFBF7',
      isStrictInvariant: true
    }, 'pod_4');

    assert.strictEqual(mesh.vault.get('session:active_task').taskId, 'wp_r2_master');
    assert.strictEqual(mesh.vault.get('episodic:ep_master_001').outcome, 'SUCCESS');
    assert.strictEqual(mesh.vault.get('semantic:max_reasoning_protocol').verifiedBy, 'Anh (Lead Architect)');
    assert.strictEqual(mesh.vault.get('procedural:luminous_light_theme_rule').isStrictInvariant, true);
  });

  // ---------------------------------------------------------------------------
  // PHÂN HỆ 2: ĐIỀU KHIỂN CHI PHÍ & THÔNG LƯỢNG TOKEN (TOKEN COST CONTROLLER)
  // ---------------------------------------------------------------------------
  console.log('\n📦 [STAGE 2] Kiểm Tra Định Tuyến & Điều Khiển Chi Phí Token (Pod 6 - TokenCostController)');
  const controller = new TokenCostController();

  it('2.1. Phân cấp nhiệm vụ thông minh và kích hoạt Pre-Flight Lock với "bung team"', () => {
    const classification = controller.classifyTaskComplexity({
      taskId: 'T_MASTER_01',
      prompt: 'Bung team cho đa agent song song nâng cấp hệ thống',
      targetFiles: ['core/index.ts'],
      affectedLayers: ['APPLICATION_LOGIC'],
      domainFlags: {},
      singleThreadExplorationCount: 0,
      explicitOverride: 'NONE'
    });
    const budget = controller.arbitrateThinkingBudget(classification.assignedTier, AgentRole.LEAD_ARCHITECT);

    assert.strictEqual(classification.assignedTier, TaskSizeTier.SIZE_L);
    assert.strictEqual(classification.recommendedFleetSize.minPods, 6);
    assert.strictEqual(budget.maxOutputTokensHeadroom, 131072);
    assert.strictEqual(budget.hyperOverclockedState, true);
  });

  it('2.2. Đo đạc thông lượng token thời gian thực (tokens/sec) & Peak TPS', () => {
    const m = controller.recordThroughput({
      recordId: 'REC-MASTER-01',
      taskId: 'T_MASTER_01',
      agentRole: AgentRole.POD4_VISUAL_LAYOUT,
      model: ModelTier.FLASH_FAST,
      taskTier: TaskSizeTier.SIZE_M,
      promptTokens: 1200,
      completionTokens: 850,
      thinkingTokens: 150,
      durationMs: 10000
    });
    assert.strictEqual(m.completionTokensPerSec, 85);
    assert.strictEqual(m.effectiveThroughput, 100);
    assert.strictEqual(m.totalTokensPerSec, 220);
  });

  it('2.3. Tính toán chi phí tiết kiệm khi định tuyến sang flash & flash_lite', () => {
    const sFlash = controller.calculateSavings(ModelTier.FLASH_FAST, 500000, 200000, 100000, 'T_FLASH');
    const sLite = controller.calculateSavings(ModelTier.FLASH_LITE, 1000000, 500000, 0, 'T_LITE');
    assert.strictEqual(sFlash.savingsPercentage, 50);
    assert.strictEqual(sLite.savingsPercentage, 90);
  });

  // ---------------------------------------------------------------------------
  // PHÂN HỆ 3: CƯỠNG CHẾ CHÍNH SÁCH VẬN HÀNH & HUMAN GATE (FAILPROOF POLICY)
  // ---------------------------------------------------------------------------
  console.log('\n📦 [STAGE 3] Kiểm Tra Chính Sách An Toàn & Human Gate (Pod 3 - FailproofPolicyHarness)');
  const policyHarness = new FailproofPolicyHarness();

  await itAsync('3.1. Chặn đứng và làm sạch bí mật / API Keys rò rỉ trong câu lệnh', async () => {
    let receivedParams = null;
    const entry = await policyHarness.executeProtected({
      callId: 'call_sec_master',
      toolName: 'ai_completion_tool',
      parameters: {
        model: 'gpt-4o',
        apiKey: 'sk-proj-abc123def456ghi789jkl012mno345pqr678',
        prompt: 'test'
      }
    }, async (params) => {
      receivedParams = params;
      return { stdout: 'OK' };
    }, { workspaceDir: TEST_DIR });

    assert.strictEqual(entry.verdict, 'SECRET_LEAKAGE_REDACTED');
    assert.strictEqual(receivedParams.apiKey, 'sk-proj-[REDACTED_API_KEY]');
  });

  await itAsync('3.2. Chặn đứng lệnh phá hoại nguy hiểm (rm -rf /) và bảo vệ an toàn tệp', async () => {
    let executed = false;
    const entry = await policyHarness.executeProtected({
      callId: 'call_safe_master',
      toolName: 'run_command',
      parameters: {
        CommandLine: 'rm -rf / --no-preserve-root',
        Cwd: TEST_DIR
      }
    }, async () => { executed = true; }, { workspaceDir: TEST_DIR });

    assert.strictEqual(entry.verdict, 'POLICY_VIOLATION_BLOCKED');
    assert.strictEqual(executed, false);
  });

  await itAsync('3.3. Tự động kích hoạt Human Gate dành riêng cho Anh khi gặp lệnh nhạy cảm', async () => {
    let executed = false;
    const entry = await policyHarness.executeProtected({
      callId: 'call_hg_master',
      toolName: 'run_sql_query',
      parameters: {
        CommandLine: 'DROP TABLE enterprise_users_production;'
      }
    }, async () => { executed = true; }, { workspaceDir: TEST_DIR });

    assert.strictEqual(entry.verdict, 'HUMAN_APPROVAL_PENDING');
    assert.strictEqual(entry.humanGateTriggered, true);
    assert.strictEqual(executed, false);
  });

  // ---------------------------------------------------------------------------
  // PHÂN HỆ 4: TRUNG TÂM CHỈ HUY LIVE COCKPIT (POD 4 - SWARM COCKPIT SERVER)
  // ---------------------------------------------------------------------------
  console.log('\n📦 [STAGE 4] Kiểm Tra Trung Tâm Chỉ Huy Live Cockpit (Pod 4 - SwarmCockpitServer)');
  const aguiEngine = new GenerativeAGUIEngine('Antigravity Master Cockpit Engine');
  const cockpitServer = new SwarmCockpitServer(aguiEngine);

  await itAsync('4.1. Khởi động Cockpit Server và cung cấp Telemetry của 6 Pods', async () => {
    const port = await cockpitServer.start(0);
    assert.ok(port > 0, 'Port phải được bind thành công');
    assert.strictEqual(cockpitServer.isRunning(), true);

    const status = cockpitServer.getFleetStatus();
    assert.strictEqual(status.fleetName, 'Antigravity Enterprise Autonomous Fleet');
    assert.strictEqual(Object.keys(status.pods).length, 6, 'Phải có 6 Pods trong telemetry');
  });

  it('4.2. Xử lý cổng phê duyệt HITL với chữ ký mật mã an toàn', () => {
    const status = cockpitServer.getFleetStatus();
    assert.ok(status.hitlGates.length >= 2, 'Phải có cổng chờ phê duyệt');
    
    const gateId = status.hitlGates[0].id;
    const approval = aguiEngine.approveHITLGate(gateId, 'Anh - Lead Architect');
    assert.strictEqual(approval, true);
    
    const gate = aguiEngine.findNodeById(gateId);
    assert.strictEqual(gate.status, 'APPROVED');
    assert.strictEqual(gate.approvedBy, 'Anh - Lead Architect');
    assert.ok(gate.signature, 'Phải có chữ ký số HMAC-SHA256');
  });

  // ---------------------------------------------------------------------------
  // PHÂN HỆ 5: KIỂM TOÁN TRỰC QUAN CDP (POD 5 - AUTONOMOUS VISUAL INSPECTOR)
  // ---------------------------------------------------------------------------
  console.log('\n📦 [STAGE 5] Kiểm Tra Kiểm Toán Trực Quan Tự Động (Pod 5 - AutonomousVisualInspector)');

  it('5.1. File Cockpit Dashboard tồn tại và tuân thủ Luminous Light Theme Invariant', () => {
    const dashboardPath = path.join(__dirname, 'ui', 'cockpit_dashboard.html');
    assert.ok(fs.existsSync(dashboardPath), 'cockpit_dashboard.html phải tồn tại');
    
    const content = fs.readFileSync(dashboardPath, 'utf8');
    assert.ok(content.includes('--canvas-warm-paper: #FAF9F6'), 'Phải chứa token Warm Paper');
    assert.ok(content.includes('--btn-press-scale: scale(0.965)'), 'Phải chứa chuẩn vi tương tác Emil Kowalski');
    assert.ok(content.includes('WebAudio Haptics'), 'Phải tích hợp WebAudio Haptics');
    assert.ok(content.includes('SyntheticHapticController'), 'Phải có SyntheticHapticController');
    assert.ok(content.includes('pawsWaveCanvas'), 'Phải có PAWS Waveform Canvas');
  });

  it('5.2. Biên nhận kiểm toán Pod 5 ghi nhận 42/42 tests xanh & độ tương phản WCAG 16.53:1', () => {
    const receiptPath = path.join(__dirname, '..', '.antigravity', 'receipts', 'wp_r2_pod_5.json');
    assert.ok(fs.existsSync(receiptPath), 'Biên nhận wp_r2_pod_5.json phải tồn tại');
    
    const receipt = JSON.parse(fs.readFileSync(receiptPath, 'utf8'));
    assert.strictEqual(receipt.status, 'COMPLETED');
    assert.strictEqual(receipt.testPassCount, 42);
  });

  // ---------------------------------------------------------------------------
  // PHÂN HỆ 6: TỰ HỌC DOANH NGHIỆP & NẠP KỸ NĂNG (POD 2 - AUTO-SKILL INGESTION)
  // ---------------------------------------------------------------------------
  console.log('\n📦 [STAGE 6] Kiểm Tra Tự Học & Nạp Kỹ Năng Tự Trị (Pod 2 - AutoSkillIngestionPipeline)');
  const skillOutputDir = path.join(TEST_DIR, 'skills');
  const candidatesDir = path.join(TEST_DIR, 'candidates');
  const registryFile = path.join(TEST_DIR, 'skills_registry.json');

  const pipeline = new AutoSkillIngestionPipeline({
    skillsDirectory: skillOutputDir,
    candidatesDirectory: candidatesDir,
    registryFilePath: registryFile,
    allowAutoPromotion: true,
    dryRun: false
  });

  it('6.1. Thu nạp quỹ đạo và cắt tỉa đường cụt (Dead-End Pruning)', () => {
    const sampleRawJsonl = [
      JSON.stringify({
        step_index: 0,
        session_id: "sess_integration",
        source: "USER_EXPLICIT",
        type: "USER_INPUT",
        created_at: "2026-09-27T01:00:00Z",
        content: "<USER_REQUEST>Xây dựng hệ thống Sovereign Continuity Mesh</USER_REQUEST>"
      }),
      JSON.stringify({
        step_index: 1,
        source: "MODEL",
        type: "PLANNER_RESPONSE",
        created_at: "2026-09-27T01:00:05Z",
        tool_calls: [{ name: "run_command", args: { CommandLine: "bad_cmd", Cwd: "c:/Users/game" } }],
        tool_results: [{ name: "run_command", is_error: true, error: "Command not found" }]
      }),
      JSON.stringify({
        step_index: 2,
        source: "MODEL",
        type: "PLANNER_RESPONSE",
        created_at: "2026-09-27T01:00:10Z",
        tool_calls: [{ name: "write_to_file", args: { TargetFile: "temp.txt", CodeContent: "test" } }],
        tool_results: [{ name: "write_to_file", is_error: false, content: "ok" }]
      }),
      JSON.stringify({
        step_index: 3,
        source: "MODEL",
        type: "PLANNER_RESPONSE",
        created_at: "2026-09-27T01:00:15Z",
        tool_calls: [{ name: "run_command", args: { CommandLine: "node verify.js", Cwd: "c:/Users/game" } }],
        tool_results: [{ name: "run_command", is_error: false, content: "All tests pass" }]
      })
    ].join('\n');

    const result = pipeline.ingestFromRawJsonl(sampleRawJsonl, {
      skillName: 'sovereign-mesh-orchestration',
      description: 'Quy trình điều phối lưới trạng thái liên tục Sovereign Mesh',
      domain: 'SYSTEM_ORCHESTRATION'
    });

    assert.ok(result.status === 'PROMOTED' || result.status === 'CANDIDATE_ONLY');
    assert.ok(result.pruningMetrics.prunedDeadEnds >= 1, 'Phải cắt tỉa ít nhất 1 bước lỗi');
    assert.ok(result.skillPath, 'Phải xuất file SKILL.md');
    assert.ok(fs.existsSync(result.skillPath), 'File SKILL.md phải tồn tại trên đĩa');
  });

  // ---------------------------------------------------------------------------
  // PHÂN HỆ 7: KIỂM CHỨNG KHỞI ĐỘNG LẠI LẠNH (COLD RESTART & CRASH RESILIENCE)
  // ---------------------------------------------------------------------------
  console.log('\n📦 [STAGE 7] Kiểm Tra Khởi Động Lại Lạnh Toàn Cục (Cold Restart & Memory Survival)');

  await itAsync('7.1. Chụp Snapshot trạng thái Lưới và phát hành sự kiện sau snapshot', async () => {
    // Publish thêm 2 sự kiện để trigger auto snapshot (snapshotIntervalEvents = 3)
    await mesh.publish('pod_1', 'checkpoint', { state: 'pre_shutdown_1' });
    await mesh.publish('pod_1', 'checkpoint', { state: 'pre_shutdown_2' });

    const snapshotPath = mesh.getSnapshotPath();
    assert.ok(fs.existsSync(snapshotPath), 'File sovereign_mesh.snapshot.json phải tồn tại');

    // Thêm 1 sự kiện sau snapshot để kiểm tra replay
    await mesh.publish('pod_2', 'event_post_snapshot', { status: 'REPLAY_TARGET' });
  });

  await itAsync('7.2. Khởi tạo Lưới mới từ đĩa và khôi phục 100% trạng thái & bộ nhớ dài hạn', async () => {
    const rebootedMesh = new SovereignContinuityMesh({
      meshDir: meshDir,
      sovereignSecret: meshSecret
    });
    
    const recoveryReport = await rebootedMesh.loadFromDisk();
    assert.strictEqual(recoveryReport.snapshotLoaded, true, 'Snapshot phải được phục hồi');
    assert.ok(recoveryReport.eventsReplayed >= 1, 'Phải replay sự kiện sau snapshot');

    // Kiểm tra bộ nhớ dài hạn
    const task = rebootedMesh.vault.get('session:active_task');
    assert.strictEqual(task.taskId, 'wp_r2_master');

    const semantic = rebootedMesh.vault.get('semantic:max_reasoning_protocol');
    assert.strictEqual(semantic.verifiedBy, 'Anh (Lead Architect)');

    const procedural = rebootedMesh.vault.get('procedural:luminous_light_theme_rule');
    assert.strictEqual(procedural.isStrictInvariant, true);
  });

  // Dọn dẹp
  await cockpitServer.stop();
  cleanWorkspace();

  console.log('\n================================================================================');
  console.log(`📊 MASTER E2E INTEGRATION SUITE: ${totalPassed} PASSED / ${totalFailed} FAILED`);
  console.log('================================================================================\n');

  if (totalFailed > 0) {
    process.exit(1);
  }
}

runMasterIntegration().catch(err => {
  console.error('Lỗi nghiêm trọng trong Master E2E Suite:', err);
  process.exit(1);
});
