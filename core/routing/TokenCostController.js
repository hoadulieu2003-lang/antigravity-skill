/**
 * ============================================================================
 * ANTIGRAVITY ENTERPRISE ARCHITECTURE — CORE ROUTING ENGINE
 * MODULE: TokenCostController.js (COMMONJS RUNTIME)
 * ============================================================================
 * 
 * Bộ Điều Khiển Chi Phí & Thông Lượng Token Thời Gian Thực (Dynamic Token Cost Controller)
 * Kế thừa và mở rộng từ SmartRoutingArbiterEngine.
 */

const TaskSizeTier = {
  SIZE_S: 'SIZE_S',
  SIZE_M: 'SIZE_M',
  SIZE_L: 'SIZE_L',
  SIZE_XL: 'SIZE_XL'
};

const ModelTier = {
  INHERIT_HIGH_REASONING: 'inherit',
  FLASH_FAST: 'flash',
  FLASH_LITE: 'flash_lite'
};

const ArchitecturalLayer = {
  PRESENTATION_UI: 'PRESENTATION_UI',
  API_TRANSPORT: 'API_TRANSPORT',
  APPLICATION_LOGIC: 'APPLICATION_LOGIC',
  PERSISTENCE_DB: 'PERSISTENCE_DB',
  INFRA_DEPLOY: 'INFRA_DEPLOY',
  SECURITY_AUTH: 'SECURITY_AUTH',
  TEST_SUITE: 'TEST_SUITE'
};

const AgentRole = {
  LEAD_ARCHITECT: 'LEAD_ARCHITECT',
  POD1_CORE_LOGIC: 'POD1_CORE_LOGIC',
  POD2_PERSISTENCE_REPO: 'POD2_PERSISTENCE_REPO',
  POD3_API_TRANSPORT: 'POD3_API_TRANSPORT',
  POD4_VISUAL_LAYOUT: 'POD4_VISUAL_LAYOUT',
  POD5_INTERACTION_MOTION: 'POD5_INTERACTION_MOTION',
  POD6_SMART_ROUTER: 'POD6_SMART_ROUTER',
  INDEPENDENT_AUDITOR: 'INDEPENDENT_AUDITOR',
  RESEARCH_FILE_SCANNER: 'RESEARCH_FILE_SCANNER'
};

const ExplicitOverrideDirective = {
  NONE: 'NONE',
  FORCE_MULTI_AGENT: 'FORCE_MULTI_AGENT',
  FORCE_SOLO_TURBO: 'FORCE_SOLO_TURBO'
};

const WastageAuditStatus = {
  OPTIMAL: 'OPTIMAL',
  OVER_ALLOCATION_PENALIZED: 'OVER_ALLOCATION_PENALIZED',
  UNDER_ALLOCATION_CRITICAL_RISK: 'UNDER_ALLOCATION_CRITICAL_RISK'
};

const ThroughputStatus = {
  HYPER_VELOCITY: 'HYPER_VELOCITY',
  NORMAL_OPTIMAL: 'NORMAL_OPTIMAL',
  THROTTLED_OR_SLOW: 'THROTTLED_OR_SLOW',
  CRITICAL_CONGESTION: 'CRITICAL_CONGESTION'
};

const WastageAlertSeverity = {
  OPTIMAL: 'OPTIMAL',
  WARNING: 'WARNING',
  HIGH_SEVERITY: 'HIGH_SEVERITY',
  CRITICAL_WASTAGE: 'CRITICAL_WASTAGE',
  CRITICAL_SEV1_TRUNCATION_RISK: 'CRITICAL_SEV1_TRUNCATION_RISK'
};

const TruncationRiskLevel = {
  SAFE: 'SAFE',
  WARNING_ELEVATED: 'WARNING_ELEVATED',
  CRITICAL_NEAR_TRUNCATION: 'CRITICAL_NEAR_TRUNCATION'
};

const TOKEN_CONSTANTS = Object.freeze({
  HEADROOM_128K: 131072,
  OUTPUT_MULTIPLIER_X8: 8,
  HEADROOM_32K: 32768,
  HEADROOM_8K: 8192,
  MAX_THINKING_BUDGET: 32768,
  TRUNCATION_WARNING_THRESHOLD: 0.75,
  TRUNCATION_CRITICAL_THRESHOLD: 0.90
});

class SmartRoutingArbiterEngine {
  constructor() {
    this.MULTI_AGENT_KEYWORDS = [
      'đa agent', 'multi-agent', 'multi agent', 'cho đa agent', 'dùng đa agent',
      'nhiều agent', 'các agent', 'bầy agent', 'team agent', 'cho team vào',
      'bung team', '6 agent', 'full pod', 'teamwork', 'phân chia agent',
      'subagent', 'subagents', 'song song', 'parallel'
    ];

    this.SOLO_TURBO_KEYWORDS = [
      'làm nhanh', 'fix lẹ', 'solo', '1 agent', 'không cần subagent', 'solo turbo'
    ];
  }

  extractFeatureVector(task) {
    const promptLower = (task.prompt || '').toLowerCase();

    const multiAgentTriggerDetected =
      task.explicitOverride === ExplicitOverrideDirective.FORCE_MULTI_AGENT ||
      this.MULTI_AGENT_KEYWORDS.some(kw => promptLower.includes(kw));

    const soloTurboTriggerDetected =
      task.explicitOverride === ExplicitOverrideDirective.FORCE_SOLO_TURBO ||
      this.SOLO_TURBO_KEYWORDS.some(kw => promptLower.includes(kw));

    const fileCount = Array.isArray(task.targetFiles) ? task.targetFiles.length : 0;
    const layerCount = Array.isArray(task.affectedLayers) ? task.affectedLayers.length : 0;

    const domainFlags = task.domainFlags || {};
    const hasCriticalDomainFlag = !!(
      domainFlags.hasAsyncState ||
      domainFlags.hasCacheInvalidation ||
      domainFlags.hasDigitalSignature ||
      domainFlags.hasApprovalWorkflow ||
      domainFlags.hasDeploymentOps ||
      domainFlags.hasSecurityAuth
    );

    const explorationLimitExceeded = (task.singleThreadExplorationCount || 0) >= 3;

    let rawScore = 0.0;
    if (fileCount <= 1) {
      rawScore += fileCount * 0.5;
    } else {
      rawScore += 0.5 + (fileCount - 1) * 1.2;
    }

    if (layerCount <= 1) {
      rawScore += layerCount * 0.5;
    } else {
      rawScore += 0.5 + (layerCount - 1) * 1.0;
    }

    if (hasCriticalDomainFlag) rawScore += 2.0;
    if (explorationLimitExceeded) rawScore += 1.5;
    if (multiAgentTriggerDetected) rawScore += 3.0;

    const complexityScore = Math.min(Math.round(rawScore * 10) / 10, 10.0);

    return {
      fileCount,
      layerCount,
      hasCriticalDomainFlag,
      explorationLimitExceeded,
      multiAgentTriggerDetected,
      soloTurboTriggerDetected,
      complexityScore
    };
  }

  classifyTaskComplexity(task, fixedTimestamp = null) {
    const featureVector = this.extractFeatureVector(task);
    const violations = [];

    if (featureVector.multiAgentTriggerDetected && !featureVector.soloTurboTriggerDetected) {
      return {
        taskId: task.taskId,
        assignedTier: TaskSizeTier.SIZE_L,
        confidence: 0.99,
        featureVector,
        prohibitionViolations: [],
        circuitBreakerTriggered: featureVector.explorationLimitExceeded,
        recommendedFleetSize: { minPods: 6, maxPods: 12, parallelWriters: 6 },
        rationaleVietnamese: 'Khóa cứng Đa Tác tử ngay từ lượt đầu tiên (Pre-Flight Lock) do phát hiện từ khóa cưỡng chế của Anh.',
        timestamp: fixedTimestamp || new Date().toISOString()
      };
    }

    if (featureVector.explorationLimitExceeded) {
      violations.push('Đã vượt trần khảo sát đơn luồng (>= 3 files/lệnh), kích hoạt ngắt mạch chuyển giao tác tử');
    }

    if (featureVector.fileCount > 1) {
      violations.push(`Vi phạm Size S: Chạm vào ${featureVector.fileCount} files (Yêu cầu khắt khe: Đúng 1 file duy nhất)`);
    }
    if (featureVector.layerCount >= 2) {
      violations.push(`Vi phạm Size S: Chạm vào ${featureVector.layerCount} tầng kiến trúc (Chỉ cho phép 1 tầng cục bộ)`);
    }
    const domainFlags = task.domainFlags || {};
    if (domainFlags.hasAsyncState || domainFlags.hasCacheInvalidation) {
      violations.push('Vi phạm Size S: Phát hiện nghiệp vụ Bất đồng bộ dữ liệu / Cache Invalidation (F5 stale data)');
    }
    if (domainFlags.hasDigitalSignature || domainFlags.hasApprovalWorkflow) {
      violations.push('Vi phạm Size S: Phát hiện nghiệp vụ Ký số / Luồng phê duyệt trạng thái nghiệp vụ');
    }
    if (domainFlags.hasDeploymentOps) {
      violations.push('Vi phạm Size S: Phát hiện tác vụ Triển khai (Deploy / Docker / VPS / Zalo Mini App)');
    }

    let candidateTier;

    if (violations.length === 0 && featureVector.complexityScore < 2.0) {
      candidateTier = TaskSizeTier.SIZE_S;
    } else {
      if (featureVector.complexityScore >= 7.0 || featureVector.fileCount >= 6 || featureVector.layerCount >= 4) {
        candidateTier = TaskSizeTier.SIZE_XL;
      } else if (featureVector.complexityScore >= 4.5 || featureVector.fileCount >= 3 || featureVector.layerCount >= 3) {
        candidateTier = TaskSizeTier.SIZE_L;
      } else {
        candidateTier = TaskSizeTier.SIZE_M;
      }
    }

    let recommendedFleetSize = { minPods: 1, maxPods: 1, parallelWriters: 1 };
    let rationaleVietnamese = '';

    switch (candidateTier) {
      case TaskSizeTier.SIZE_S:
        recommendedFleetSize = { minPods: 1, maxPods: 1, parallelWriters: 1 };
        rationaleVietnamese = 'Tác vụ vi mô đơn điểm: Đúng 1 file, không có cờ nhạy cảm, chạy Solo Turbo chớp nhoáng (5-15s).';
        break;
      case TaskSizeTier.SIZE_M:
        recommendedFleetSize = { minPods: 2, maxPods: 3, parallelWriters: 2 };
        rationaleVietnamese = `Tác vụ đa tầng cục bộ (Lean Squad): ${violations.length > 0 ? 'Tự động leo thang do ' + violations[0] : 'Chạm 2-3 files/tầng'}. Bung 2-3 Pods song song.`;
        break;
      case TaskSizeTier.SIZE_L:
        recommendedFleetSize = { minPods: 6, maxPods: 6, parallelWriters: 4 };
        rationaleVietnamese = 'Hệ thống lớn / Kiến trúc đa tầng: Bung trọn vẹn Hạm đội 6 Pods chuyên trách (Core, Persistence, API, UI, Motion, Test).';
        break;
      case TaskSizeTier.SIZE_XL:
        recommendedFleetSize = { minPods: 8, maxPods: 12, parallelWriters: 6 };
        rationaleVietnamese = 'Đại công trình / Tái cấu trúc toàn diện: Kích hoạt Hạm đội cực đại (Hyper Fleet) 8-12 Pods song song.';
        break;
    }

    return {
      taskId: task.taskId,
      assignedTier: candidateTier,
      confidence: 0.96,
      featureVector,
      prohibitionViolations: violations,
      circuitBreakerTriggered: featureVector.explorationLimitExceeded,
      recommendedFleetSize,
      rationaleVietnamese,
      timestamp: fixedTimestamp || new Date().toISOString()
    };
  }

  routeModelTier(role, taskTier, _taskContext) {
    if (role === AgentRole.RESEARCH_FILE_SCANNER) {
      return {
        agentRole: role,
        selectedModel: ModelTier.FLASH_LITE,
        reasoningBudgetMode: 'FAST_HEURISTIC',
        isFrozenRouting: true,
        stressTestBoundary: {
          overthinkingRisk: 'HIGH',
          reliabilityZone: 'HEURISTIC_SUFFICIENT'
        },
        rationaleVietnamese: 'Quét file và tra cứu mã nguồn: Sử dụng flash_lite tối ưu tốc độ và không lãng phí token suy luận.'
      };
    }

    if (role === AgentRole.POD4_VISUAL_LAYOUT || role === AgentRole.POD5_INTERACTION_MOTION) {
      return {
        agentRole: role,
        selectedModel: ModelTier.FLASH_FAST,
        reasoningBudgetMode: 'FAST_HEURISTIC',
        isFrozenRouting: true,
        stressTestBoundary: {
          overthinkingRisk: 'MEDIUM',
          reliabilityZone: 'HEURISTIC_SUFFICIENT'
        },
        rationaleVietnamese: 'Giao diện & Chuyển động: Định tuyến sang flash để bứt tốc sinh mã cực nhanh, giảm 70% độ trễ.'
      };
    }

    if (role === AgentRole.POD3_API_TRANSPORT && taskTier === TaskSizeTier.SIZE_M) {
      return {
        agentRole: role,
        selectedModel: ModelTier.FLASH_FAST,
        reasoningBudgetMode: 'FAST_HEURISTIC',
        isFrozenRouting: true,
        stressTestBoundary: {
          overthinkingRisk: 'LOW',
          reliabilityZone: 'HEURISTIC_SUFFICIENT'
        },
        rationaleVietnamese: 'API Transport tầng trung gian: Sử dụng flash giải quyết nhanh DTO và serialization.'
      };
    }

    return {
      agentRole: role,
      selectedModel: ModelTier.INHERIT_HIGH_REASONING,
      reasoningBudgetMode: 'MAX_TEST_TIME_COMPUTE_KICH_TRAN',
      isFrozenRouting: true,
      stressTestBoundary: {
        overthinkingRisk: 'LOW',
        reliabilityZone: 'REASONING_REQUIRED'
      },
      rationaleVietnamese: 'Nghiệp vụ lõi / Kiểm toán độc lập / Kiến trúc: Khóa cứng inherit Gemini 3.8 Flash High Reasoning để bảo đảm phân tích đa chiều và bằng chứng kiểm chứng khép kín.'
    };
  }

  arbitrateThinkingBudget(taskTier, role) {
    switch (taskTier) {
      case TaskSizeTier.SIZE_S:
        return {
          taskTier,
          agentRole: role,
          maxOutputTokensHeadroom: 8192,
          outputTokenMultiplier: 1,
          thinkingBudgetTokens: 2048,
          hyperOverclockedState: false
        };

      case TaskSizeTier.SIZE_M:
        return {
          taskTier,
          agentRole: role,
          maxOutputTokensHeadroom: 32768,
          outputTokenMultiplier: 2,
          thinkingBudgetTokens: 8192,
          hyperOverclockedState: false
        };

      case TaskSizeTier.SIZE_L:
      case TaskSizeTier.SIZE_XL:
      default:
        return {
          taskTier,
          agentRole: role,
          maxOutputTokensHeadroom: 131072,
          outputTokenMultiplier: 8,
          thinkingBudgetTokens: 32768,
          hyperOverclockedState: true
        };
    }
  }

  auditTokenWastage(allocatedTokens, actualTier, taskId = 'task_audit') {
    let optimalRange = { minTokens: 8192, maxTokens: 16384 };

    if (actualTier === TaskSizeTier.SIZE_M) {
      optimalRange = { minTokens: 32768, maxTokens: 65536 };
    } else if (actualTier === TaskSizeTier.SIZE_L || actualTier === TaskSizeTier.SIZE_XL) {
      optimalRange = { minTokens: 131072, maxTokens: 131072 };
    }

    if (actualTier === TaskSizeTier.SIZE_S && allocatedTokens > optimalRange.maxTokens) {
      const excessRatio = allocatedTokens / optimalRange.maxTokens;
      const penaltyScore = Math.min(Math.round((excessRatio - 1) * 15), 95);
      return {
        taskId,
        evaluatedTier: actualTier,
        allocatedTokens,
        optimalBudgetRange: optimalRange,
        status: WastageAuditStatus.OVER_ALLOCATION_PENALIZED,
        penaltyScore,
        efficiencyRatio: Math.round((optimalRange.maxTokens / allocatedTokens) * 100) / 100,
        correctiveGuidance: `Lãng phí token nghiêm trọng (${penaltyScore}/100 điểm phạt): Tác vụ vi mô Size S nhưng cấp ${allocatedTokens} tokens. Giảm ngay về 8,192 tokens.`
      };
    }

    if ((actualTier === TaskSizeTier.SIZE_L || actualTier === TaskSizeTier.SIZE_XL) && allocatedTokens < optimalRange.minTokens) {
      return {
        taskId,
        evaluatedTier: actualTier,
        allocatedTokens,
        optimalBudgetRange: optimalRange,
        status: WastageAuditStatus.UNDER_ALLOCATION_CRITICAL_RISK,
        penaltyScore: 100,
        efficiencyRatio: 0.1,
        correctiveGuidance: 'Rủi ro cắt cụt mã nguồn SEV-1 (100/100 điểm phạt): Tác vụ hệ thống Size L/XL nhưng chỉ cấp dưới 131K tokens. Bắt buộc kích hoạt HYPER_OVERCLOCKED_X8_ENGINEERING_ONLY (131,072 tokens).'
      };
    }

    return {
      taskId,
      evaluatedTier: actualTier,
      allocatedTokens,
      optimalBudgetRange: optimalRange,
      status: WastageAuditStatus.OPTIMAL,
      penaltyScore: 0,
      efficiencyRatio: 1.0,
      correctiveGuidance: 'Cấp phát tối ưu tuyệt đối: Dung lượng Headroom tương thích hoàn hảo với độ phức tạp tác vụ.'
    };
  }
}

class TokenCostController extends SmartRoutingArbiterEngine {
  constructor(customPricing) {
    super();

    this.pricingTable = {
      [ModelTier.INHERIT_HIGH_REASONING]: {
        promptCostPer1M: 0.15,
        completionCostPer1M: 0.60,
        thinkingCostPer1M: 0.60,
        ...(customPricing?.[ModelTier.INHERIT_HIGH_REASONING] || {})
      },
      [ModelTier.FLASH_FAST]: {
        promptCostPer1M: 0.075,
        completionCostPer1M: 0.30,
        thinkingCostPer1M: 0.30,
        ...(customPricing?.[ModelTier.FLASH_FAST] || {})
      },
      [ModelTier.FLASH_LITE]: {
        promptCostPer1M: 0.015,
        completionCostPer1M: 0.06,
        thinkingCostPer1M: 0.06,
        ...(customPricing?.[ModelTier.FLASH_LITE] || {})
      }
    };

    this.executionHistory = [];
    this.throughputHistory = [];
    this.wastageAlerts = [];
    this.headroomEnforcements = [];
  }

  recordThroughput(record) {
    const thinkingTokens = record.thinkingTokens || 0;
    const totalTokens = record.promptTokens + record.completionTokens + thinkingTokens;

    const elapsedSeconds = Math.max((record.durationMs || 0) / 1000, 0.001);

    const completionTokensPerSec = Math.round((record.completionTokens / elapsedSeconds) * 10) / 10;
    const effectiveThroughput = Math.round(((record.completionTokens + thinkingTokens) / elapsedSeconds) * 10) / 10;
    const totalTokensPerSec = Math.round((totalTokens / elapsedSeconds) * 10) / 10;

    let throughputStatus;
    let statusVietnamese;

    if (effectiveThroughput >= 150) {
      throughputStatus = ThroughputStatus.HYPER_VELOCITY;
      statusVietnamese = 'Thông lượng siêu tốc (Hyper Velocity) >= 150 tps — Tối ưu hóa cực hạn';
    } else if (effectiveThroughput >= 60) {
      throughputStatus = ThroughputStatus.NORMAL_OPTIMAL;
      statusVietnamese = 'Thông lượng tối ưu (Normal Optimal) 60-150 tps — Hoạt động ổn định';
    } else if (effectiveThroughput >= 20) {
      throughputStatus = ThroughputStatus.THROTTLED_OR_SLOW;
      statusVietnamese = 'Thông lượng suy giảm (Throttled/Slow) 20-59 tps — Có dấu hiệu nghẽn';
    } else {
      throughputStatus = ThroughputStatus.CRITICAL_CONGESTION;
      statusVietnamese = 'Tắc nghẽn nghiêm trọng (Critical Congestion) < 20 tps — Cảnh báo trễ mạng';
    }

    const metrics = {
      recordId: record.recordId,
      taskId: record.taskId,
      model: record.model,
      durationMs: record.durationMs,
      elapsedSeconds: Math.round(elapsedSeconds * 1000) / 1000,
      promptTokens: record.promptTokens,
      completionTokens: record.completionTokens,
      thinkingTokens,
      totalTokens,
      completionTokensPerSec,
      effectiveThroughput,
      totalTokensPerSec,
      throughputStatus,
      statusVietnamese
    };

    this.executionHistory.push(record);
    this.throughputHistory.push(metrics);

    return metrics;
  }

  calculateSavings(model, promptTokens, completionTokens, thinkingTokens = 0, taskId = 'task_calc') {
    const totalTokens = promptTokens + completionTokens + thinkingTokens;

    const inheritRates = this.pricingTable[ModelTier.INHERIT_HIGH_REASONING];
    const targetRates = this.pricingTable[model] || inheritRates;

    const baselinePromptCost = (promptTokens / 1_000_000) * inheritRates.promptCostPer1M;
    const baselineCompletionCost = (completionTokens / 1_000_000) * inheritRates.completionCostPer1M;
    const baselineThinkingCost = (thinkingTokens / 1_000_000) * inheritRates.thinkingCostPer1M;
    const baselineCostUsd = baselinePromptCost + baselineCompletionCost + baselineThinkingCost;

    const actualPromptCost = (promptTokens / 1_000_000) * targetRates.promptCostPer1M;
    const actualCompletionCost = (completionTokens / 1_000_000) * targetRates.completionCostPer1M;
    const actualThinkingCost = (thinkingTokens / 1_000_000) * targetRates.thinkingCostPer1M;
    const actualCostUsd = actualPromptCost + actualCompletionCost + actualThinkingCost;

    const costSavedUsd = Math.max(0, baselineCostUsd - actualCostUsd);
    const savingsPercentage = baselineCostUsd > 0
      ? Math.round(((baselineCostUsd - actualCostUsd) / baselineCostUsd) * 10000) / 100
      : 0;

    const isEconomyTier = model !== ModelTier.INHERIT_HIGH_REASONING;

    let rationaleVietnamese = '';
    if (model === ModelTier.FLASH_LITE) {
      rationaleVietnamese = `Định tuyến sang flash_lite: Tiết kiệm ${savingsPercentage}% ngân sách ($${costSavedUsd.toFixed(6)} USD) cho tác vụ quét file / AST Repo Map.`;
    } else if (model === ModelTier.FLASH_FAST) {
      rationaleVietnamese = `Định tuyến sang flash: Tiết kiệm ${savingsPercentage}% ngân sách ($${costSavedUsd.toFixed(6)} USD) cho tác vụ UI Layout & Motion 60 FPS.`;
    } else {
      rationaleVietnamese = 'Mô hình inherit chuẩn: Không có độ lệch chi phí (100% Test-Time Compute kịch trần cho Nghiệp vụ Lõi).';
    }

    return {
      taskId,
      routedModel: model,
      baselineModel: ModelTier.INHERIT_HIGH_REASONING,
      promptTokens,
      completionTokens,
      thinkingTokens,
      totalTokens,
      baselineCostUsd: Math.round(baselineCostUsd * 1_000_000) / 1_000_000,
      actualCostUsd: Math.round(actualCostUsd * 1_000_000) / 1_000_000,
      costSavedUsd: Math.round(costSavedUsd * 1_000_000) / 1_000_000,
      savingsPercentage,
      isEconomyTier,
      rationaleVietnamese
    };
  }

  auditAndAlertWastage(allocatedTokens, actualTier, taskId = 'task_audit') {
    const audit = this.auditTokenWastage(allocatedTokens, actualTier, taskId);

    let severity;
    let autoThrottledBudget = allocatedTokens;

    if (audit.status === WastageAuditStatus.UNDER_ALLOCATION_CRITICAL_RISK) {
      severity = WastageAlertSeverity.CRITICAL_SEV1_TRUNCATION_RISK;
      autoThrottledBudget = TOKEN_CONSTANTS.HEADROOM_128K;
    } else if (audit.status === WastageAuditStatus.OVER_ALLOCATION_PENALIZED) {
      if (audit.penaltyScore >= 75) {
        severity = WastageAlertSeverity.CRITICAL_WASTAGE;
      } else if (audit.penaltyScore >= 40) {
        severity = WastageAlertSeverity.HIGH_SEVERITY;
      } else {
        severity = WastageAlertSeverity.WARNING;
      }
      autoThrottledBudget = audit.optimalBudgetRange.maxTokens;
    } else {
      severity = WastageAlertSeverity.OPTIMAL;
    }

    const alert = {
      alertId: `WAST-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      taskId,
      evaluatedTier: actualTier,
      allocatedTokens,
      optimalBudgetRange: audit.optimalBudgetRange,
      severity,
      penaltyScore: audit.penaltyScore,
      efficiencyRatio: audit.efficiencyRatio,
      recommendedAction: audit.correctiveGuidance,
      autoThrottledBudget,
      timestamp: new Date().toISOString()
    };

    if (severity !== WastageAlertSeverity.OPTIMAL) {
      this.wastageAlerts.push(alert);
    }

    return alert;
  }

  enforceHeadroomInvariant(taskTier, role, requestedTokens = 0, taskId = 'task_headroom') {
    const isCriticalScale =
      taskTier === TaskSizeTier.SIZE_L ||
      taskTier === TaskSizeTier.SIZE_XL ||
      role === AgentRole.POD1_CORE_LOGIC ||
      role === AgentRole.INDEPENDENT_AUDITOR ||
      role === AgentRole.LEAD_ARCHITECT;

    if (isCriticalScale) {
      const enforcedHeadroom = TOKEN_CONSTANTS.HEADROOM_128K;
      const status = requestedTokens < enforcedHeadroom
        ? 'OVERRIDE_ENFORCED_HEADROOM_128K'
        : 'VERIFIED_COMPLIANT';

      const result = {
        taskId,
        taskTier,
        agentRole: role,
        requestedTokens,
        enforcedHeadroom,
        outputTokenMultiplier: TOKEN_CONSTANTS.OUTPUT_MULTIPLIER_X8,
        hyperOverclockedState: true,
        status,
        rationaleVietnamese: status === 'OVERRIDE_ENFORCED_HEADROOM_128K'
          ? 'Cưỡng chế nâng lên 131,072 Tokens (HYPER_OVERCLOCKED_X8_ENGINEERING_ONLY) để chống cắt cụt mã nguồn SEV-1.'
          : 'Dung lượng Headroom 128K đã được khóa cứng và tuân thủ tuyệt đối chuẩn mực kiến trúc.'
      };

      this.headroomEnforcements.push(result);
      return result;
    }

    if (taskTier === TaskSizeTier.SIZE_M) {
      const enforcedHeadroom = TOKEN_CONSTANTS.HEADROOM_32K;
      return {
        taskId,
        taskTier,
        agentRole: role,
        requestedTokens,
        enforcedHeadroom,
        outputTokenMultiplier: 2,
        hyperOverclockedState: false,
        status: 'VERIFIED_COMPLIANT',
        rationaleVietnamese: 'Tác vụ Size M: Phân bổ 32,768 Tokens Headroom (multiplier: 2) cân bằng giữa tốc độ và độ an toàn.'
      };
    }

    const enforcedHeadroom = TOKEN_CONSTANTS.HEADROOM_8K;
    return {
      taskId,
      taskTier,
      agentRole: role,
      requestedTokens,
      enforcedHeadroom,
      outputTokenMultiplier: 1,
      hyperOverclockedState: false,
      status: 'THROTTLED_SIZE_S_OPTIMAL',
      rationaleVietnamese: 'Tác vụ vi mô Size S: Phân bổ 8,192 Tokens Headroom (multiplier: 1) ngăn chặn lãng phí token suy luận.'
    };
  }

  checkTruncationRisk(currentOutputTokens, allocatedHeadroom = TOKEN_CONSTANTS.HEADROOM_128K) {
    const safeHeadroom = Math.max(allocatedHeadroom, 1);
    const usagePercentage = Math.round((currentOutputTokens / safeHeadroom) * 10000) / 100;
    const remainingTokens = Math.max(0, safeHeadroom - currentOutputTokens);

    let riskLevel;
    let guidanceVietnamese;

    if (usagePercentage >= TOKEN_CONSTANTS.TRUNCATION_CRITICAL_THRESHOLD * 100) {
      riskLevel = TruncationRiskLevel.CRITICAL_NEAR_TRUNCATION;
      guidanceVietnamese = `NGUY CẤP (Đã dùng ${usagePercentage}% / Còn lại ${remainingTokens} tokens): Nguy cơ cắt cụt mã nguồn sắp xảy ra! Kích hoạt ngay phân rã Work Packages cuốn chiếu.`;
    } else if (usagePercentage >= TOKEN_CONSTANTS.TRUNCATION_WARNING_THRESHOLD * 100) {
      riskLevel = TruncationRiskLevel.WARNING_ELEVATED;
      guidanceVietnamese = `CẢNH BÁO (Đã dùng ${usagePercentage}% / Còn lại ${remainingTokens} tokens): Tiếp cận ngưỡng đệm 75%. Khuyến nghị giám sát dung lượng file xuất.`;
    } else {
      riskLevel = TruncationRiskLevel.SAFE;
      guidanceVietnamese = `AN TOÀN (Đã dùng ${usagePercentage}% / Còn lại ${remainingTokens} tokens): Vùng đệm 128K Headroom dồi dào, không có nguy cơ gián đoạn.`;
    }

    return {
      currentOutputTokens,
      allocatedHeadroom: safeHeadroom,
      remainingTokens,
      usagePercentage,
      riskLevel,
      isHeadroomProtected: safeHeadroom >= TOKEN_CONSTANTS.HEADROOM_128K,
      guidanceVietnamese
    };
  }

  getSessionSummary() {
    let totalPromptTokens = 0;
    let totalCompletionTokens = 0;
    let totalThinkingTokens = 0;
    let totalBaselineCostUsd = 0;
    let totalActualCostUsd = 0;
    let totalThroughputSum = 0;
    let peakThroughputTps = 0;

    for (const record of this.executionHistory) {
      totalPromptTokens += record.promptTokens;
      totalCompletionTokens += record.completionTokens;
      totalThinkingTokens += record.thinkingTokens || 0;

      const savings = this.calculateSavings(
        record.model,
        record.promptTokens,
        record.completionTokens,
        record.thinkingTokens || 0,
        record.taskId
      );

      totalBaselineCostUsd += savings.baselineCostUsd;
      totalActualCostUsd += savings.actualCostUsd;
    }

    for (const t of this.throughputHistory) {
      totalThroughputSum += t.effectiveThroughput;
      if (t.effectiveThroughput > peakThroughputTps) {
        peakThroughputTps = t.effectiveThroughput;
      }
    }

    const totalExecutions = this.executionHistory.length;
    const totalTokensProcessed = totalPromptTokens + totalCompletionTokens + totalThinkingTokens;
    const totalCostSavedUsd = Math.max(0, totalBaselineCostUsd - totalActualCostUsd);
    const overallSavingsPercentage = totalBaselineCostUsd > 0
      ? Math.round((totalCostSavedUsd / totalBaselineCostUsd) * 10000) / 100
      : 0;
    const averageThroughputTps = totalExecutions > 0
      ? Math.round((totalThroughputSum / totalExecutions) * 10) / 10
      : 0;

    return {
      totalExecutions,
      totalPromptTokens,
      totalCompletionTokens,
      totalThinkingTokens,
      totalTokensProcessed,
      totalBaselineCostUsd: Math.round(totalBaselineCostUsd * 1_000_000) / 1_000_000,
      totalActualCostUsd: Math.round(totalActualCostUsd * 1_000_000) / 1_000_000,
      totalCostSavedUsd: Math.round(totalCostSavedUsd * 1_000_000) / 1_000_000,
      overallSavingsPercentage,
      averageThroughputTps,
      peakThroughputTps,
      wastageAlertCount: this.wastageAlerts.length,
      headroomEnforcementCount: this.headroomEnforcements.length
    };
  }

  resetSession() {
    this.executionHistory = [];
    this.throughputHistory = [];
    this.wastageAlerts = [];
    this.headroomEnforcements = [];
  }
}

module.exports = {
  TaskSizeTier,
  ModelTier,
  ArchitecturalLayer,
  AgentRole,
  ExplicitOverrideDirective,
  WastageAuditStatus,
  ThroughputStatus,
  WastageAlertSeverity,
  TruncationRiskLevel,
  TOKEN_CONSTANTS,
  SmartRoutingArbiterEngine,
  TokenCostController
};
