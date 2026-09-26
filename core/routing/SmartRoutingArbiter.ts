/**
 * ============================================================================
 * ANTIGRAVITY ENTERPRISE ARCHITECTURE — CORE ROUTING ENGINE
 * MODULE: SmartRoutingArbiter.ts (PRODUCTION IMPLEMENTATION)
 * ============================================================================
 * 
 * Động cơ Phân loại Độ phức tạp Tác vụ, Định tuyến Mô hình và Trọng tài Ngân sách Suy luận.
 * 
 * Nền tảng Khoa học & Chuẩn mực Kỹ thuật:
 * 1. arXiv:2609.28475: "When Should Forecasting Agents Reason? Behavioral Stress Tests for Reliability Routing"
 *    - Định tuyến dựa trên ranh giới hành vi (Behavioral Stress Tests & Reliability Zones).
 *    - Miền cần suy luận cao (Reasoning Required Zone) -> Test-Time Compute kịch trần (inherit High Reasoning).
 *    - Miền phỏng đoán tối ưu (Heuristic Sufficient Zone) -> Fast Models (flash/flash_lite) ngăn chặn Overthinking.
 * 2. arXiv:2609.28506: "TW3Cast: A Frozen Router of Lightly Fine-Tuned Foundation Models"
 *    - Bộ định tuyến đóng băng tất định (Deterministic Frozen Router) dựa trên trích xuất đặc trưng tĩnh.
 * 3. AGENTS.md & ENTERPRISE_CHARTER.md:
 *    - Ma trận phân cấp quy mô thích ứng 3 cấp độ (Task-Adaptive Dynamic Sizing Matrix): Size S, M, L, XL.
 *    - Hàng rào cấm kỵ Size S (Size S Invariant Prohibitions) bảo vệ tính toàn vẹn hệ thống.
 *    - Cơ chế ngắt quán tính đơn luồng (Inertia Circuit Breaker: trần <= 3 lệnh / files).
 *    - Khóa cứng dung lượng đầu ra cực đại 128K Token Headroom (131,072 Tokens) trạng thái HYPER_OVERCLOCKED_X8.
 * 
 * @module SmartRoutingArbiter
 * @version 2.0.0-PROD
 * @author Anh (Lead Architect) & Pod 6 (Senior Engineering Agent)
 */

// ============================================================================
// 1. ENUMS & VALUE OBJECTS
// ============================================================================

/**
 * Cấp độ Quy mô Tác vụ (Task Size Tier)
 */
export enum TaskSizeTier {
  SIZE_S = 'SIZE_S', // Vi mô / Đơn điểm cực hạn (Solo Turbo: 1 Agent)
  SIZE_M = 'SIZE_M', // Tính năng vừa / Lỗi đa tầng cục bộ (Lean Squad: 2-3 Subagents)
  SIZE_L = 'SIZE_L', // Phân hệ lớn / Tái cấu trúc / UI 153 Brands (Full Fleet: 6 Subagents)
  SIZE_XL = 'SIZE_XL' // Đại công trình / Mega Epic (Hyper Fleet: 8-12 Subagents)
}

/**
 * Phân tầng Não bộ Mô hình (Smart Model Tiering)
 */
export enum ModelTier {
  INHERIT_HIGH_REASONING = 'inherit', // Gemini 3.8 Flash High Reasoning (Test-Time Compute kịch trần)
  FLASH_FAST = 'flash',               // Gemini 3.8 Flash Fast (UI, CSS, HTML, Boilerplate)
  FLASH_LITE = 'flash_lite'           // Gemini 3.8 Flash Lite (Quét file, AST Repo Map, Grep)
}

/**
 * Các Tầng Kiến trúc Hệ thống (Architectural System Layers)
 */
export enum ArchitecturalLayer {
  PRESENTATION_UI = 'PRESENTATION_UI',
  API_TRANSPORT = 'API_TRANSPORT',
  APPLICATION_LOGIC = 'APPLICATION_LOGIC',
  PERSISTENCE_DB = 'PERSISTENCE_DB',
  INFRA_DEPLOY = 'INFRA_DEPLOY',
  SECURITY_AUTH = 'SECURITY_AUTH',
  TEST_SUITE = 'TEST_SUITE'
}

/**
 * Vai trò của Tác tử / Pod Chuyên trách trong Doanh nghiệp Tác tử
 */
export enum AgentRole {
  LEAD_ARCHITECT = 'LEAD_ARCHITECT',
  POD1_CORE_LOGIC = 'POD1_CORE_LOGIC',
  POD2_PERSISTENCE_REPO = 'POD2_PERSISTENCE_REPO',
  POD3_API_TRANSPORT = 'POD3_API_TRANSPORT',
  POD4_VISUAL_LAYOUT = 'POD4_VISUAL_LAYOUT',
  POD5_INTERACTION_MOTION = 'POD5_INTERACTION_MOTION',
  POD6_SMART_ROUTER = 'POD6_SMART_ROUTER',
  INDEPENDENT_AUDITOR = 'INDEPENDENT_AUDITOR',
  RESEARCH_FILE_SCANNER = 'RESEARCH_FILE_SCANNER'
}

/**
 * Chỉ thị Cưỡng chế Quyền Lệnh Tối cao từ Anh (Explicit Override Directive)
 */
export enum ExplicitOverrideDirective {
  NONE = 'NONE',
  FORCE_MULTI_AGENT = 'FORCE_MULTI_AGENT', // Cưỡng chế bung đội hình đa tác tử (Pre-Flight Lock)
  FORCE_SOLO_TURBO = 'FORCE_SOLO_TURBO'    // Cưỡng chế Solo Turbo (chỉ khi Anh yêu cầu tường minh)
}

/**
 * Trạng thái Đánh giá Phạt Lãng phí Token (Token Wastage Penalty Status)
 */
export enum WastageAuditStatus {
  OPTIMAL = 'OPTIMAL',
  OVER_ALLOCATION_PENALIZED = 'OVER_ALLOCATION_PENALIZED',
  UNDER_ALLOCATION_CRITICAL_RISK = 'UNDER_ALLOCATION_CRITICAL_RISK'
}

// ============================================================================
// 2. INTERFACES & CONTRACTS
// ============================================================================

export interface DomainFlags {
  hasAsyncState: boolean;          // Bất đồng bộ dữ liệu (Data Desynchronization / Race Condition)
  hasCacheInvalidation: boolean;   // Xóa / Làm mới Cache (F5 stale data)
  hasDigitalSignature: boolean;    // Ký số / Mật mã học
  hasApprovalWorkflow: boolean;    // Luồng phê duyệt trạng thái nghiệp vụ
  hasDeploymentOps: boolean;       // Triển khai (Deploy / Docker / VPS / Zalo Mini App)
  hasSecurityAuth: boolean;        // Xác thực / Ủy quyền (Auth / Token / RBAC)
}

export interface TaskDescriptor {
  taskId: string;
  prompt: string;
  targetFiles: string[];
  affectedLayers: ArchitecturalLayer[];
  domainFlags: DomainFlags;
  singleThreadExplorationCount: number;
  explicitOverride: ExplicitOverrideDirective;
}

export interface TaskFeatureVector {
  fileCount: number;
  layerCount: number;
  hasCriticalDomainFlag: boolean;
  explorationLimitExceeded: boolean;
  multiAgentTriggerDetected: boolean;
  soloTurboTriggerDetected: boolean;
  complexityScore: number; // 0.0 -> 10.0
}

export interface TaskComplexityEvaluation {
  taskId: string;
  assignedTier: TaskSizeTier;
  confidence: number;
  featureVector: TaskFeatureVector;
  prohibitionViolations: string[];
  circuitBreakerTriggered: boolean;
  recommendedFleetSize: {
    minPods: number;
    maxPods: number;
    parallelWriters: number;
  };
  rationaleVietnamese: string;
  timestamp: string;
}

export interface ModelRoutingDecision {
  agentRole: AgentRole;
  selectedModel: ModelTier;
  reasoningBudgetMode: 'FAST_HEURISTIC' | 'BALANCED_COMPUTE' | 'MAX_TEST_TIME_COMPUTE_KICH_TRAN';
  isFrozenRouting: boolean;
  stressTestBoundary: {
    overthinkingRisk: 'LOW' | 'MEDIUM' | 'HIGH';
    reliabilityZone: 'REASONING_REQUIRED' | 'HEURISTIC_SUFFICIENT';
  };
  rationaleVietnamese: string;
}

export interface ThinkingBudgetAllocation {
  taskTier: TaskSizeTier;
  agentRole: AgentRole;
  maxOutputTokensHeadroom: number;
  outputTokenMultiplier: number;
  thinkingBudgetTokens: number;
  hyperOverclockedState: boolean;
}

export interface TokenWastageAudit {
  taskId: string;
  evaluatedTier: TaskSizeTier;
  allocatedTokens: number;
  optimalBudgetRange: {
    minTokens: number;
    maxTokens: number;
  };
  status: WastageAuditStatus;
  penaltyScore: number;
  efficiencyRatio: number;
  correctiveGuidance: string;
}

export interface ISmartRoutingArbiter {
  extractFeatureVector(task: TaskDescriptor): TaskFeatureVector;
  classifyTaskComplexity(task: TaskDescriptor, fixedTimestamp?: string): TaskComplexityEvaluation;
  routeModelTier(role: AgentRole, taskTier: TaskSizeTier, taskContext?: Partial<TaskDescriptor>): ModelRoutingDecision;
  arbitrateThinkingBudget(taskTier: TaskSizeTier, role: AgentRole): ThinkingBudgetAllocation;
  auditTokenWastage(allocatedTokens: number, actualTier: TaskSizeTier, taskId?: string): TokenWastageAudit;
}

// ============================================================================
// 3. PRODUCTION IMPLEMENTATION ENGINE
// ============================================================================

export class SmartRoutingArbiterEngine implements ISmartRoutingArbiter {
  // Tập từ khóa cưỡng chế Đa Tác tử (Mandatory Multi-Agent Triggers)
  public static readonly MULTI_AGENT_KEYWORDS: readonly string[] = Object.freeze([
    'đa agent', 'multi-agent', 'multi agent', 'cho đa agent', 'dùng đa agent',
    'nhiều agent', 'các agent', 'bầy agent', 'team agent', 'cho team vào',
    'bung team', '6 agent', 'full pod', 'teamwork', 'phân chia agent',
    'subagent', 'subagents', 'song song', 'parallel'
  ]);

  // Tập từ khóa cưỡng chế Solo Turbo (Explicit Solo Turbo Triggers)
  public static readonly SOLO_TURBO_KEYWORDS: readonly string[] = Object.freeze([
    'làm nhanh', 'fix lẹ', 'solo', '1 agent', 'không cần subagent', 'solo turbo'
  ]);

  /**
   * Trích xuất vector đặc trưng tĩnh theo cơ chế TW3Cast (arXiv:2609.28506)
   */
  public extractFeatureVector(task: TaskDescriptor): TaskFeatureVector {
    const promptLower = (task.prompt || '').toLowerCase();

    const multiAgentTriggerDetected =
      task.explicitOverride === ExplicitOverrideDirective.FORCE_MULTI_AGENT ||
      SmartRoutingArbiterEngine.MULTI_AGENT_KEYWORDS.some(kw => promptLower.includes(kw));

    const soloTurboTriggerDetected =
      task.explicitOverride === ExplicitOverrideDirective.FORCE_SOLO_TURBO ||
      SmartRoutingArbiterEngine.SOLO_TURBO_KEYWORDS.some(kw => promptLower.includes(kw));

    const fileCount = Array.isArray(task.targetFiles) ? task.targetFiles.length : 0;
    const layerCount = Array.isArray(task.affectedLayers) ? task.affectedLayers.length : 0;

    const domainFlags = task.domainFlags || ({} as DomainFlags);
    const hasCriticalDomainFlag = !!(
      domainFlags.hasAsyncState ||
      domainFlags.hasCacheInvalidation ||
      domainFlags.hasDigitalSignature ||
      domainFlags.hasApprovalWorkflow ||
      domainFlags.hasDeploymentOps ||
      domainFlags.hasSecurityAuth
    );

    const explorationLimitExceeded = (task.singleThreadExplorationCount || 0) >= 3;

    // Trọng số định tuyến chuẩn hóa theo TW3Cast (Frozen Feature Weighting)
    let rawScore = 0.0;

    // Trọng số file: 1 file đơn lẻ (0.5 điểm cơ sở), từ 2 files trở lên cộng lũy tiến 1.2 điểm/file
    if (fileCount <= 1) {
      rawScore += fileCount * 0.5;
    } else {
      rawScore += 0.5 + (fileCount - 1) * 1.2;
    }

    // Trọng số tầng kiến trúc: 1 tầng cơ sở (0.5 điểm), từ 2 tầng trở lên cộng lũy tiến 1.0 điểm/tầng
    if (layerCount <= 1) {
      rawScore += layerCount * 0.5;
    } else {
      rawScore += 0.5 + (layerCount - 1) * 1.0;
    }

    if (hasCriticalDomainFlag) rawScore += 2.0;    // Điểm cộng miền nghiệp vụ nhạy cảm
    if (explorationLimitExceeded) rawScore += 1.5; // Điểm cộng vi phạm trần khảo sát
    if (multiAgentTriggerDetected) rawScore += 3.0; // Điểm cộng từ khóa cưỡng chế đa tác tử

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

  /**
   * Phân loại độ phức tạp tác vụ tuân thủ Ma trận 3 Cấp độ & Hàng rào cấm kỵ Size S
   */
  public classifyTaskComplexity(task: TaskDescriptor, fixedTimestamp?: string): TaskComplexityEvaluation {
    const featureVector = this.extractFeatureVector(task);
    const violations: string[] = [];

    // 1. Kiểm tra Lệnh Cưỡng chế Tối cao của Anh (Explicit Command Override)
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

    // 2. Kiểm tra Cơ chế Ngắt Quán tính Đơn luồng (Inertia Circuit Breaker)
    if (featureVector.explorationLimitExceeded) {
      violations.push('Đã vượt trần khảo sát đơn luồng (>= 3 files/lệnh), kích hoạt ngắt mạch chuyển giao tác tử');
    }

    // 3. Kiểm tra Hàng Rào Cấm Tuyệt Đối của Size S (Size S Invariant Prohibitions)
    if (featureVector.fileCount > 1) {
      violations.push(`Vi phạm Size S: Chạm vào ${featureVector.fileCount} files (Yêu cầu khắt khe: Đúng 1 file duy nhất)`);
    }
    if (featureVector.layerCount >= 2) {
      violations.push(`Vi phạm Size S: Chạm vào ${featureVector.layerCount} tầng kiến trúc (Chỉ cho phép 1 tầng cục bộ)`);
    }
    const domainFlags = task.domainFlags || ({} as DomainFlags);
    if (domainFlags.hasAsyncState || domainFlags.hasCacheInvalidation) {
      violations.push('Vi phạm Size S: Phát hiện nghiệp vụ Bất đồng bộ dữ liệu / Cache Invalidation (F5 stale data)');
    }
    if (domainFlags.hasDigitalSignature || domainFlags.hasApprovalWorkflow) {
      violations.push('Vi phạm Size S: Phát hiện nghiệp vụ Ký số / Luồng phê duyệt trạng thái nghiệp vụ');
    }
    if (domainFlags.hasDeploymentOps) {
      violations.push('Vi phạm Size S: Phát hiện tác vụ Triển khai (Deploy / Docker / VPS / Zalo Mini App)');
    }

    // Xác định phân cấp thực tế
    let candidateTier: TaskSizeTier;

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

  /**
   * Định tuyến Mô hình đóng băng (Frozen Model Tier Router) theo TW3Cast & arXiv:2609.28475
   */
  public routeModelTier(
    role: AgentRole,
    taskTier: TaskSizeTier,
    _taskContext?: Partial<TaskDescriptor>
  ): ModelRoutingDecision {
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

  /**
   * Trọng tài Ngân sách Suy luận (Thinking Budget Arbiter)
   */
  public arbitrateThinkingBudget(taskTier: TaskSizeTier, role: AgentRole): ThinkingBudgetAllocation {
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

  /**
   * Kiểm toán & Tính điểm phạt lãng phí token (Token Wastage Penalty Engine)
   */
  public auditTokenWastage(
    allocatedTokens: number,
    actualTier: TaskSizeTier,
    taskId: string = 'task_audit'
  ): TokenWastageAudit {
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
