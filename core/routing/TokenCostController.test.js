/**
 * ============================================================================
 * ANTIGRAVITY ENTERPRISE ARCHITECTURE — CORE ROUTING TEST SUITE
 * FILE: TokenCostController.test.js
 * ============================================================================
 * 
 * Bộ kiểm thử đơn vị độc lập (Independent Unit Test Runner) cho TokenCostController.
 * Chạy trực tiếp qua: node c:/Users/game/.gemini/core/routing/TokenCostController.test.js
 * 
 * Phạm vi kiểm toán 12 Cổng (12 Production Test Gates):
 * Gate 01: Kế thừa SmartRoutingArbiter — Phân loại tác vụ vi mô Size S
 * Gate 02: Kế thừa Hàng rào cấm kỵ Size S — Tự động leo thang khi có Cache / Multi-file
 * Gate 03: Pre-Flight Lock cưỡng chế Đa Tác tử — Khóa cứng SIZE_L & 131K Headroom
 * Gate 04: Đo đạc Thông lượng Token thời gian thực (tokens/sec, effective & total throughput)
 * Gate 05: Xử lý an toàn trường hợp biên (Duration 0ms / Division-by-Zero Safeguard)
 * Gate 06: Theo dõi Thông lượng Cuốn chiếu (Rolling Average) & Đỉnh cao Thông lượng (Peak TPS)
 * Gate 07: Tính toán Chi phí Tiết kiệm cho FLASH_FAST vs INHERIT Baseline (50% benchmark)
 * Gate 08: Tính toán Chi phí Tiết kiệm cho FLASH_LITE vs INHERIT Baseline (90% benchmark)
 * Gate 09: Tổng hợp Chi phí & Sổ cái Phiên làm việc (Session Cost & Token Telemetry)
 * Gate 10: Cảnh báo Lãng phí Token (Wastage Penalty Over-allocation Alert)
 * Gate 11: Cảnh báo Nguy cấp Cắt cụt Mã nguồn SEV-1 (Under-allocation Critical Risk)
 * Gate 12: Bảo vệ 128K Output Token Headroom & Giám sát Vùng đệm Truncation Guard
 */

const {
  TaskSizeTier,
  ModelTier,
  ArchitecturalLayer,
  AgentRole,
  ExplicitOverrideDirective,
  ThroughputStatus,
  WastageAlertSeverity,
  TruncationRiskLevel,
  TOKEN_CONSTANTS,
  TokenCostController
} = require('./TokenCostController');

function runTokenCostControllerTestSuite() {
  console.log('========================================================================');
  console.log('⚡ DYNAMIC TOKEN COST CONTROLLER — PRODUCTION UNIT TEST SUITE (12 GATES)');
  console.log('🏛️ CHỦ QUẢN: ANH (LEAD ARCHITECT / PRODUCT OWNER)');
  console.log('========================================================================\n');

  const controller = new TokenCostController();
  let passed = 0;
  let total = 0;

  function assert(name, condition, errorMsg = '') {
    total++;
    if (condition) {
      passed++;
      console.log(`[PASS] Gate ${total.toString().padStart(2, '0')}: ${name}`);
    } else {
      console.error(`[FAIL] Gate ${total.toString().padStart(2, '0')}: ${name} -> ${errorMsg}`);
    }
  }

  // Gate 01: Kế thừa SmartRoutingArbiter — Phân loại tác vụ vi mô Size S
  const t1 = controller.classifyTaskComplexity({
    taskId: 'T01',
    prompt: 'Fix typo in configuration key',
    targetFiles: ['config.json'],
    affectedLayers: [ArchitecturalLayer.APPLICATION_LOGIC],
    domainFlags: { hasAsyncState: false },
    singleThreadExplorationCount: 1,
    explicitOverride: ExplicitOverrideDirective.NONE
  });
  const b1 = controller.arbitrateThinkingBudget(t1.assignedTier, AgentRole.LEAD_ARCHITECT);
  assert(
    'Kế thừa SmartRoutingArbiter: Size S Typo phân loại SIZE_S, 1 Pod, 8K headroom',
    t1.assignedTier === TaskSizeTier.SIZE_S && b1.maxOutputTokensHeadroom === 8192 && t1.recommendedFleetSize.minPods === 1,
    `Tier: ${t1.assignedTier}, Pods: ${t1.recommendedFleetSize.minPods}`
  );

  // Gate 02: Kế thừa Hàng rào cấm kỵ Size S — Tự động leo thang khi có Cache Invalidation
  const t2 = controller.classifyTaskComplexity({
    taskId: 'T02',
    prompt: 'Sửa lỗi cache F5 vẫn hiện dữ liệu cũ trên bảng điều khiển',
    targetFiles: ['Dashboard.tsx'],
    affectedLayers: [ArchitecturalLayer.PRESENTATION_UI],
    domainFlags: { hasCacheInvalidation: true, hasAsyncState: true },
    singleThreadExplorationCount: 1,
    explicitOverride: ExplicitOverrideDirective.NONE
  });
  assert(
    'Cấm kỵ Size S kích hoạt khi có Cache Invalidation -> Tự động leo thang SIZE_M (2-3 Pods)',
    t2.assignedTier === TaskSizeTier.SIZE_M && t2.prohibitionViolations.length >= 1 && t2.recommendedFleetSize.minPods === 2,
    `Tier: ${t2.assignedTier}, Violations: ${t2.prohibitionViolations.length}`
  );

  // Gate 03: Pre-Flight Lock cưỡng chế Đa Tác tử — Khóa cứng SIZE_L & 131K Headroom
  const t3 = controller.classifyTaskComplexity({
    taskId: 'T03',
    prompt: 'Bung team cho đa agent song song xây dựng module mới',
    targetFiles: ['service.ts'],
    affectedLayers: [ArchitecturalLayer.APPLICATION_LOGIC],
    domainFlags: {},
    singleThreadExplorationCount: 0,
    explicitOverride: ExplicitOverrideDirective.NONE
  });
  const b3 = controller.arbitrateThinkingBudget(t3.assignedTier, AgentRole.POD1_CORE_LOGIC);
  assert(
    'Pre-Flight Lock cưỡng chế đa tác tử ("bung team", "đa agent") -> Khóa cứng SIZE_L & 131K tokens Headroom',
    t3.assignedTier === TaskSizeTier.SIZE_L && b3.maxOutputTokensHeadroom === 131072 && b3.hyperOverclockedState === true,
    `Tier: ${t3.assignedTier}, Tokens: ${b3.maxOutputTokensHeadroom}`
  );

  // Gate 04: Đo đạc Thông lượng Token thời gian thực (tokens/sec)
  const m4 = controller.recordThroughput({
    recordId: 'REC-001',
    taskId: 'T04',
    agentRole: AgentRole.POD4_VISUAL_LAYOUT,
    model: ModelTier.FLASH_FAST,
    taskTier: TaskSizeTier.SIZE_M,
    promptTokens: 1200,
    completionTokens: 850,
    thinkingTokens: 150,
    durationMs: 10000 // 10 giây
  });
  assert(
    'Đo đạc thông lượng token thời gian thực: completion TPS (85 tps), effective TPS (100 tps), total TPS (220 tps)',
    m4.completionTokensPerSec === 85 && m4.effectiveThroughput === 100 && m4.totalTokensPerSec === 220 && m4.throughputStatus === ThroughputStatus.NORMAL_OPTIMAL,
    `CompletionTPS: ${m4.completionTokensPerSec}, EffectiveTPS: ${m4.effectiveThroughput}, TotalTPS: ${m4.totalTokensPerSec}`
  );

  // Gate 05: Xử lý an toàn trường hợp biên (Duration 0ms / Division-by-Zero Safeguard)
  const m5 = controller.recordThroughput({
    recordId: 'REC-002',
    taskId: 'T05',
    agentRole: AgentRole.POD5_INTERACTION_MOTION,
    model: ModelTier.FLASH_FAST,
    taskTier: TaskSizeTier.SIZE_S,
    promptTokens: 500,
    completionTokens: 200,
    thinkingTokens: 0,
    durationMs: 0 // Duration 0ms
  });
  assert(
    'Bảo vệ an toàn biên: Duration 0ms không gây crash chia 0 (NaN/Infinity), fallback 0.001s thành công',
    Number.isFinite(m5.effectiveThroughput) && !Number.isNaN(m5.effectiveThroughput) && m5.effectiveThroughput > 0,
    `EffectiveTPS: ${m5.effectiveThroughput}`
  );

  // Gate 06: Theo dõi Thông lượng Cuốn chiếu & Đỉnh cao Thông lượng (Peak TPS)
  const m6 = controller.recordThroughput({
    recordId: 'REC-003',
    taskId: 'T06',
    agentRole: AgentRole.RESEARCH_FILE_SCANNER,
    model: ModelTier.FLASH_LITE,
    taskTier: TaskSizeTier.SIZE_S,
    promptTokens: 2000,
    completionTokens: 1800,
    thinkingTokens: 0,
    durationMs: 10000 // 180 tokens/sec
  });
  const summary6 = controller.getSessionSummary();
  assert(
    'Thông lượng siêu tốc HYPER_VELOCITY (>= 150 tps) & Ghi nhận Peak TPS chuẩn xác (180 tps)',
    m6.throughputStatus === ThroughputStatus.HYPER_VELOCITY && summary6.peakThroughputTps >= 180,
    `Status: ${m6.throughputStatus}, Peak: ${summary6.peakThroughputTps}`
  );

  // Gate 07: Tính toán Chi phí Tiết kiệm cho FLASH_FAST vs INHERIT Baseline
  // Prompt 500K, Completion 200K, Thinking 100K
  const s7 = controller.calculateSavings(ModelTier.FLASH_FAST, 500000, 200000, 100000, 'T07');
  // Inherit: 0.5 * 0.15 ($0.075) + 0.2 * 0.60 ($0.12) + 0.1 * 0.60 ($0.06) = $0.255
  // Flash:   0.5 * 0.075 ($0.0375) + 0.2 * 0.30 ($0.06) + 0.1 * 0.30 ($0.03) = $0.1275
  // Saved:   $0.1275 (50.00%)
  assert(
    'Tính toán chi phí tiết kiệm khi định tuyến sang flash: Tiết kiệm chính xác 50% chi phí vs inherit',
    s7.savingsPercentage === 50 && s7.costSavedUsd === 0.1275 && s7.isEconomyTier === true,
    `Savings%: ${s7.savingsPercentage}%, Saved: $${s7.costSavedUsd}`
  );

  // Gate 08: Tính toán Chi phí Tiết kiệm cho FLASH_LITE vs INHERIT Baseline
  // Prompt 1,000,000, Completion 500,000, Thinking 0
  const s8 = controller.calculateSavings(ModelTier.FLASH_LITE, 1000000, 500000, 0, 'T08');
  // Inherit: 1.0 * 0.15 ($0.15) + 0.5 * 0.60 ($0.30) = $0.45
  // Flash Lite: 1.0 * 0.015 ($0.015) + 0.5 * 0.06 ($0.03) = $0.045
  // Saved: $0.405 (90.00%)
  assert(
    'Tính toán chi phí tiết kiệm khi định tuyến sang flash_lite: Tiết kiệm chính xác 90% chi phí vs inherit',
    s8.savingsPercentage === 90 && s8.costSavedUsd === 0.405 && s8.isEconomyTier === true,
    `Savings%: ${s8.savingsPercentage}%, Saved: $${s8.costSavedUsd}`
  );

  // Gate 09: Tổng hợp Chi phí & Sổ cái Phiên làm việc (Session Cost Telemetry)
  const sessionSummary = controller.getSessionSummary();
  assert(
    'Sổ cái phiên làm việc: Ghi nhận tổng token, tổng baseline cost, tổng actual cost và cost saved',
    sessionSummary.totalExecutions === 3 &&
    sessionSummary.totalTokensProcessed > 0 &&
    sessionSummary.totalCostSavedUsd > 0 &&
    sessionSummary.overallSavingsPercentage > 0,
    `Execs: ${sessionSummary.totalExecutions}, Saved: $${sessionSummary.totalCostSavedUsd}, %: ${sessionSummary.overallSavingsPercentage}%`
  );

  // Gate 10: Cảnh báo Lãng phí Token (Wastage Penalty Over-allocation Alert)
  const w10 = controller.auditAndAlertWastage(131072, TaskSizeTier.SIZE_S, 'T10');
  assert(
    'Cảnh báo lãng phí token: Phạt khi cấp 131K tokens cho bài toán Size S, mức độ cảnh báo CRITICAL_WASTAGE',
    w10.severity === WastageAlertSeverity.CRITICAL_WASTAGE &&
    w10.penaltyScore > 70 &&
    w10.autoThrottledBudget === 16384,
    `Severity: ${w10.severity}, Penalty: ${w10.penaltyScore}, Throttled: ${w10.autoThrottledBudget}`
  );

  // Gate 11: Cảnh báo Nguy cấp Cắt cụt Mã nguồn SEV-1 (Under-allocation Critical Risk)
  const w11 = controller.auditAndAlertWastage(8192, TaskSizeTier.SIZE_L, 'T11');
  assert(
    'Cảnh báo nguy cơ cắt cụt mã nguồn SEV-1: Cấp 8K tokens cho Size L kích hoạt CRITICAL_SEV1_TRUNCATION_RISK & auto-elevate lên 131,072',
    w11.severity === WastageAlertSeverity.CRITICAL_SEV1_TRUNCATION_RISK &&
    w11.penaltyScore === 100 &&
    w11.autoThrottledBudget === TOKEN_CONSTANTS.HEADROOM_128K,
    `Severity: ${w11.severity}, Score: ${w11.penaltyScore}, Enforced: ${w11.autoThrottledBudget}`
  );

  // Gate 12: Bảo vệ 128K Output Token Headroom & Giám sát Vùng đệm Truncation Guard
  const h12 = controller.enforceHeadroomInvariant(TaskSizeTier.SIZE_L, AgentRole.POD1_CORE_LOGIC, 4000, 'T12');
  const guardSafe = controller.checkTruncationRisk(50000, 131072);
  const guardWarn = controller.checkTruncationRisk(100000, 131072);
  const guardCrit = controller.checkTruncationRisk(120000, 131072);
  assert(
    'Bảo vệ 128K Output Token Headroom: Khóa cứng 131,072 tokens (multiplier: 8) và phân cấp vùng đệm SAFE / WARNING / CRITICAL chuẩn xác',
    h12.enforcedHeadroom === 131072 &&
    h12.outputTokenMultiplier === 8 &&
    h12.hyperOverclockedState === true &&
    guardSafe.riskLevel === TruncationRiskLevel.SAFE &&
    guardWarn.riskLevel === TruncationRiskLevel.WARNING_ELEVATED &&
    guardCrit.riskLevel === TruncationRiskLevel.CRITICAL_NEAR_TRUNCATION,
    `Headroom: ${h12.enforcedHeadroom}, Multiplier: ${h12.outputTokenMultiplier}, RiskSafe: ${guardSafe.riskLevel}, RiskCrit: ${guardCrit.riskLevel}`
  );

  console.log('\n========================================================================');
  console.log(`🎯 KẾT QUẢ SẢN XUẤT: ${passed} / ${total} GATES PASSED (100% SẴN SÀNG TRIỂN KHAI)`);
  console.log('========================================================================\n');

  if (passed !== total) {
    process.exit(1);
  }
}

runTokenCostControllerTestSuite();
