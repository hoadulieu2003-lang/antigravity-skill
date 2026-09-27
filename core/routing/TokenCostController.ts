/**
 * ============================================================================
 * ANTIGRAVITY ENTERPRISE ARCHITECTURE — CORE ROUTING ENGINE
 * MODULE: TokenCostController.ts (PRODUCTION IMPLEMENTATION)
 * ============================================================================
 * 
 * Bộ Điều Khiển Chi Phí & Thông Lượng Token Thời Gian Thực (Dynamic Token Cost Controller)
 * Kế thừa và mở rộng từ SmartRoutingArbiterEngine.
 * 
 * Nền tảng Kỹ thuật & Chuẩn mực Doanh nghiệp:
 * 1. arXiv:2609.28475 & arXiv:2609.28506:
 *    - Định tuyến độ tin cậy (Reliability Routing) & Frozen Model Tier Router.
 *    - Tiết kiệm chi phí suy luận (Cost Reduction) khi định tuyến tác vụ heuristic sang flash/flash_lite.
 * 2. AGENTS.md & GEMINI.md Enterprise Anchor:
 *    - Khóa cứng Dung lượng Đầu ra Cực đại 128K Token Headroom (131,072 Tokens) trạng thái HYPER_OVERCLOCKED_X8.
 *    - Cảnh báo Lãng phí Token (Wastage Penalty Engine) & Triệt tiêu Rủi ro Cắt cụt Mã nguồn SEV-1.
 *    - Đo đạc thông lượng thời gian thực (Throughput Measurement: tokens/sec).
 *    - Chuẩn thuật ngữ song ngữ English (Tiếng Việt).
 * 
 * @module TokenCostController
 * @version 2.0.0-PROD
 * @author Anh (Lead Architect) & Pod 6 (Senior Engineering Agent)
 */

import {
  SmartRoutingArbiterEngine,
  TaskSizeTier,
  ModelTier,
  AgentRole,
  ExplicitOverrideDirective,
  ArchitecturalLayer,
  WastageAuditStatus
} from './SmartRoutingArbiter.ts';

import type {
  ISmartRoutingArbiter,
  DomainFlags,
  TaskDescriptor,
  TaskFeatureVector,
  TaskComplexityEvaluation,
  ModelRoutingDecision,
  ThinkingBudgetAllocation,
  TokenWastageAudit
} from './SmartRoutingArbiter.ts';

// Re-export core enums and interfaces for seamless downstream consumption
export {
  TaskSizeTier,
  ModelTier,
  AgentRole,
  ExplicitOverrideDirective,
  ArchitecturalLayer,
  WastageAuditStatus
};

export type {
  DomainFlags,
  TaskDescriptor,
  TaskFeatureVector,
  TaskComplexityEvaluation,
  ModelRoutingDecision,
  ThinkingBudgetAllocation,
  TokenWastageAudit
};

// ============================================================================
// 1. ENUMS & CONSTANTS
// ============================================================================

/**
 * Trạng thái Thông lượng Token (Throughput Velocity Status)
 */
export enum ThroughputStatus {
  HYPER_VELOCITY = 'HYPER_VELOCITY',         // > 150 tokens/sec
  NORMAL_OPTIMAL = 'NORMAL_OPTIMAL',         // 60 - 150 tokens/sec
  THROTTLED_OR_SLOW = 'THROTTLED_OR_SLOW',   // 20 - 59 tokens/sec
  CRITICAL_CONGESTION = 'CRITICAL_CONGESTION' // < 20 tokens/sec
}

/**
 * Mức độ Cảnh báo Lãng phí Token (Wastage Severity Level)
 */
export enum WastageAlertSeverity {
  OPTIMAL = 'OPTIMAL',
  WARNING = 'WARNING',
  HIGH_SEVERITY = 'HIGH_SEVERITY',
  CRITICAL_WASTAGE = 'CRITICAL_WASTAGE',
  CRITICAL_SEV1_TRUNCATION_RISK = 'CRITICAL_SEV1_TRUNCATION_RISK'
}

/**
 * Mức độ Nguy cơ Cắt cụt Token (Truncation Risk Level)
 */
export enum TruncationRiskLevel {
  SAFE = 'SAFE',                               // < 75% headroom used
  WARNING_ELEVATED = 'WARNING_ELEVATED',       // 75% - 89% headroom used
  CRITICAL_NEAR_TRUNCATION = 'CRITICAL_NEAR_TRUNCATION' // >= 90% headroom used
}

/**
 * Hằng số Chuẩn mực Doanh nghiệp (Enterprise Standards Constants)
 */
export const TOKEN_CONSTANTS = Object.freeze({
  HEADROOM_128K: 131072,                // 131,072 Tokens (HYPER_OVERCLOCKED_X8)
  OUTPUT_MULTIPLIER_X8: 8,              // Multiplier khóa cứng x8
  HEADROOM_32K: 32768,                  // Size M
  HEADROOM_8K: 8192,                    // Size S
  MAX_THINKING_BUDGET: 32768,           // 32,768 Tokens suy luận kịch trần
  TRUNCATION_WARNING_THRESHOLD: 0.75,   // 75% ngưỡng cảnh báo
  TRUNCATION_CRITICAL_THRESHOLD: 0.90   // 90% ngưỡng nguy cấp
});

// ============================================================================
// 2. INTERFACES & CONTRACTS
// ============================================================================

/**
 * Bảng Đơn giá Token chuẩn hóa (Token Pricing Rates per 1,000,000 Tokens)
 */
export interface ModelPricingTier {
  promptCostPer1M: number;       // Chi phí prompt / 1M tokens ($)
  completionCostPer1M: number;   // Chi phí completion / 1M tokens ($)
  thinkingCostPer1M: number;     // Chi phí suy luận / 1M tokens ($)
}

/**
 * Cấu hình Bảng Giá Hệ Thống
 */
export type TokenPricingTable = Record<ModelTier, ModelPricingTier>;

/**
 * Hồ sơ Thực thi Token (Token Execution Record)
 */
export interface TokenExecutionRecord {
  recordId: string;
  taskId: string;
  agentRole: AgentRole;
  model: ModelTier;
  taskTier: TaskSizeTier;
  promptTokens: number;
  completionTokens: number;
  thinkingTokens?: number;
  durationMs: number;
  timestamp?: string;
}

/**
 * Chỉ số Đo đạc Thông lượng Thời gian thực (Token Throughput Metrics)
 */
export interface TokenThroughputMetrics {
  recordId: string;
  taskId: string;
  model: ModelTier;
  durationMs: number;
  elapsedSeconds: number;
  promptTokens: number;
  completionTokens: number;
  thinkingTokens: number;
  totalTokens: number;
  completionTokensPerSec: number;  // Tốc độ sinh mã (Generation Velocity)
  effectiveThroughput: number;      // Tốc độ sinh mã + suy luận (Effective Throughput)
  totalTokensPerSec: number;        // Tổng thông lượng hệ thống (Total System Throughput)
  throughputStatus: ThroughputStatus;
  statusVietnamese: string;
}

/**
 * Phân tích Chi phí Tiết kiệm (Cost Savings Analysis)
 */
export interface CostSavingsAnalysis {
  taskId: string;
  routedModel: ModelTier;
  baselineModel: ModelTier; // Luôn so sánh với INHERIT_HIGH_REASONING
  promptTokens: number;
  completionTokens: number;
  thinkingTokens: number;
  totalTokens: number;
  baselineCostUsd: number;  // Chi phí lý thuyết nếu chạy full inherit
  actualCostUsd: number;    // Chi phí thực tế với mô hình được định tuyến
  costSavedUsd: number;     // Số tiền USD tiết kiệm được
  savingsPercentage: number;// Tỷ lệ phần trăm tiết kiệm (%)
  isEconomyTier: boolean;   // true nếu định tuyến sang flash / flash_lite
  rationaleVietnamese: string;
}

/**
 * Cảnh báo Lãng phí Token (Token Wastage Alert)
 */
export interface TokenWastageAlert {
  alertId: string;
  taskId: string;
  evaluatedTier: TaskSizeTier;
  allocatedTokens: number;
  optimalBudgetRange: {
    minTokens: number;
    maxTokens: number;
  };
  severity: WastageAlertSeverity;
  penaltyScore: number;       // 0 - 100 điểm phạt
  efficiencyRatio: number;    // Tỷ số hiệu quả sử dụng
  recommendedAction: string;  // Hướng dẫn khắc phục song ngữ English (Tiếng Việt)
  autoThrottledBudget: number;// Ngân sách khuyến nghị tự động nén
  timestamp: string;
}

/**
 * Kết quả Kiểm định & Bảo vệ 128K Output Token Headroom
 */
export interface HeadroomEnforcementResult {
  taskId: string;
  taskTier: TaskSizeTier;
  agentRole: AgentRole;
  requestedTokens: number;
  enforcedHeadroom: number;
  outputTokenMultiplier: number;
  hyperOverclockedState: boolean;
  status: 'VERIFIED_COMPLIANT' | 'OVERRIDE_ENFORCED_HEADROOM_128K' | 'THROTTLED_SIZE_S_OPTIMAL';
  rationaleVietnamese: string;
}

/**
 * Đánh giá Nguy cơ Cắt cụt Mã nguồn (Truncation Risk Assessment)
 */
export interface TruncationRiskAssessment {
  currentOutputTokens: number;
  allocatedHeadroom: number;
  remainingTokens: number;
  usagePercentage: number;
  riskLevel: TruncationRiskLevel;
  isHeadroomProtected: boolean;
  guidanceVietnamese: string;
}

/**
 * Báo cáo Tổng kết Chi phí Phiên làm việc (Session Cost Summary)
 */
export interface SessionCostSummary {
  totalExecutions: number;
  totalPromptTokens: number;
  totalCompletionTokens: number;
  totalThinkingTokens: number;
  totalTokensProcessed: number;
  totalBaselineCostUsd: number;
  totalActualCostUsd: number;
  totalCostSavedUsd: number;
  overallSavingsPercentage: number;
  averageThroughputTps: number;
  peakThroughputTps: number;
  wastageAlertCount: number;
  headroomEnforcementCount: number;
}

/**
 * Giao diện Hợp đồng ITokenCostController
 */
export interface ITokenCostController extends ISmartRoutingArbiter {
  recordThroughput(record: TokenExecutionRecord): TokenThroughputMetrics;
  calculateSavings(
    model: ModelTier,
    promptTokens: number,
    completionTokens: number,
    thinkingTokens?: number,
    taskId?: string
  ): CostSavingsAnalysis;
  auditAndAlertWastage(allocatedTokens: number, actualTier: TaskSizeTier, taskId?: string): TokenWastageAlert;
  enforceHeadroomInvariant(taskTier: TaskSizeTier, role: AgentRole, requestedTokens?: number, taskId?: string): HeadroomEnforcementResult;
  checkTruncationRisk(currentOutputTokens: number, allocatedHeadroom?: number): TruncationRiskAssessment;
  getSessionSummary(): SessionCostSummary;
  resetSession(): void;
}

// ============================================================================
// 3. PRODUCTION IMPLEMENTATION ENGINE
// ============================================================================

export class TokenCostController extends SmartRoutingArbiterEngine implements ITokenCostController {
  // Bảng giá token chuẩn hóa cho hệ sinh thái Gemini 3.8 / Flash
  public readonly pricingTable: TokenPricingTable;

  // Sổ cái lưu vết thực thi thời gian thực
  private executionHistory: TokenExecutionRecord[] = [];
  private throughputHistory: TokenThroughputMetrics[] = [];
  private wastageAlerts: TokenWastageAlert[] = [];
  private headroomEnforcements: HeadroomEnforcementResult[] = [];

  constructor(customPricing?: Partial<TokenPricingTable>) {
    super();

    // Bảng giá mặc định ($ / 1,000,000 tokens)
    // Inherit (High Reasoning): $0.15 prompt, $0.60 completion, $0.60 thinking
    // Flash Fast: $0.075 prompt (50%), $0.30 completion (50%), $0.30 thinking
    // Flash Lite: $0.015 prompt (10%), $0.06 completion (10%), $0.06 thinking
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
  }

  /**
   * 1. Đo đạc thông lượng token thời gian thực (tokens/sec)
   */
  public recordThroughput(record: TokenExecutionRecord): TokenThroughputMetrics {
    const thinkingTokens = record.thinkingTokens || 0;
    const totalTokens = record.promptTokens + record.completionTokens + thinkingTokens;

    // Ngăn chặn lỗi chia cho 0 (Division by Zero Safeguard)
    const elapsedSeconds = Math.max((record.durationMs || 0) / 1000, 0.001);

    const completionTokensPerSec = Math.round((record.completionTokens / elapsedSeconds) * 10) / 10;
    const effectiveThroughput = Math.round(((record.completionTokens + thinkingTokens) / elapsedSeconds) * 10) / 10;
    const totalTokensPerSec = Math.round((totalTokens / elapsedSeconds) * 10) / 10;

    // Đánh giá trạng thái thông lượng
    let throughputStatus: ThroughputStatus;
    let statusVietnamese: string;

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

    const metrics: TokenThroughputMetrics = {
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

  /**
   * 2. Tính toán chi phí tiết kiệm khi định tuyến sang flash/flash_lite thay vì inherit
   */
  public calculateSavings(
    model: ModelTier,
    promptTokens: number,
    completionTokens: number,
    thinkingTokens: number = 0,
    taskId: string = 'task_calc'
  ): CostSavingsAnalysis {
    const totalTokens = promptTokens + completionTokens + thinkingTokens;

    const inheritRates = this.pricingTable[ModelTier.INHERIT_HIGH_REASONING];
    const targetRates = this.pricingTable[model] || inheritRates;

    // Chi phí baseline nếu chạy hoàn toàn trên inherit (High Reasoning)
    const baselinePromptCost = (promptTokens / 1_000_000) * inheritRates.promptCostPer1M;
    const baselineCompletionCost = (completionTokens / 1_000_000) * inheritRates.completionCostPer1M;
    const baselineThinkingCost = (thinkingTokens / 1_000_000) * inheritRates.thinkingCostPer1M;
    const baselineCostUsd = baselinePromptCost + baselineCompletionCost + baselineThinkingCost;

    // Chi phí thực tế với mô hình được định tuyến
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

  /**
   * 3. Cảnh báo lãng phí token (Wastage Penalty Warning)
   */
  public auditAndAlertWastage(
    allocatedTokens: number,
    actualTier: TaskSizeTier,
    taskId: string = 'task_audit'
  ): TokenWastageAlert {
    const audit = this.auditTokenWastage(allocatedTokens, actualTier, taskId);

    let severity: WastageAlertSeverity;
    let autoThrottledBudget = allocatedTokens;

    if (audit.status === WastageAuditStatus.UNDER_ALLOCATION_CRITICAL_RISK) {
      severity = WastageAlertSeverity.CRITICAL_SEV1_TRUNCATION_RISK;
      autoThrottledBudget = TOKEN_CONSTANTS.HEADROOM_128K; // Tự động nâng cấp lên 128K
    } else if (audit.status === WastageAuditStatus.OVER_ALLOCATION_PENALIZED) {
      if (audit.penaltyScore >= 75) {
        severity = WastageAlertSeverity.CRITICAL_WASTAGE;
      } else if (audit.penaltyScore >= 40) {
        severity = WastageAlertSeverity.HIGH_SEVERITY;
      } else {
        severity = WastageAlertSeverity.WARNING;
      }
      autoThrottledBudget = audit.optimalBudgetRange.maxTokens; // Nén về trần tối ưu
    } else {
      severity = WastageAlertSeverity.OPTIMAL;
    }

    const alert: TokenWastageAlert = {
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

  /**
   * 4. Bảo vệ Dung Lượng Đầu Ra Cực Đại 128K Output Token Headroom (131,072 Tokens)
   */
  public enforceHeadroomInvariant(
    taskTier: TaskSizeTier,
    role: AgentRole,
    requestedTokens: number = 0,
    taskId: string = 'task_headroom'
  ): HeadroomEnforcementResult {
    // Các vai trò lõi hoặc quy mô Size L/XL bắt buộc khóa cứng 128K Headroom
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

      const result: HeadroomEnforcementResult = {
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

    // Size S
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

  /**
   * 5. Giám sát Vùng Đệm và Ngăn Ngừa Cắt Cụt Mã Nguồn (Buffer & Truncation Guard)
   */
  public checkTruncationRisk(
    currentOutputTokens: number,
    allocatedHeadroom: number = TOKEN_CONSTANTS.HEADROOM_128K
  ): TruncationRiskAssessment {
    const safeHeadroom = Math.max(allocatedHeadroom, 1);
    const usagePercentage = Math.round((currentOutputTokens / safeHeadroom) * 10000) / 100;
    const remainingTokens = Math.max(0, safeHeadroom - currentOutputTokens);

    let riskLevel: TruncationRiskLevel;
    let guidanceVietnamese: string;

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

  /**
   * 6. Xuất Báo cáo Tổng kết Chi phí & Thông lượng của Toàn bộ Phiên làm việc
   */
  public getSessionSummary(): SessionCostSummary {
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

  /**
   * Đặt lại phiên làm việc (Reset telemetry)
   */
  public resetSession(): void {
    this.executionHistory = [];
    this.throughputHistory = [];
    this.wastageAlerts = [];
    this.headroomEnforcements = [];
  }
}
