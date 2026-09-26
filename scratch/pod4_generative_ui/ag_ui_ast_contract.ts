/**
 * ============================================================================
 * ANTIGRAVITY ENTERPRISE MULTI-AGENT ARCHITECTURE
 * POD 4: GENERATIVE AG-UI DESIGNER // MASTER VISUAL STUDIO
 * ============================================================================
 * 
 * KHẾ ƯỚC KIẾN TRÚC AST & DESIGN TOKENS CHO GENERATIVE UI (AG-UI PROTOCOL)
 * Tuân thủ nghiêm ngặt:
 *  1. 100% Luminous Light Theme Invariant (Warm Paper, Ivory, Elevated Pure White)
 *  2. Emil Kowalski Micro-interaction Physics (scale(0.965), cubic-bezier bứt tốc)
 *  3. AG-UI Protocol & CopilotKit Generative UI Standard
 *  4. PAWS (Policy-driven Agentic World Simulation - arXiv:2609.28547) State Contract
 * 
 * Chủ quản: Anh — Lead Architect / Product Owner
 * Thực thi: Pod 4 — Senior Generative AG-UI Designer & Architect
 * ============================================================================
 */

/* ==========================================================================
 * 1. DESIGN TOKENS DEFINITION (LUMINOUS LIGHT THEME INVARIANT)
 * ========================================================================== */

export const AG_DESIGN_TOKENS = {
  theme: {
    name: 'Luminous Light Theme (Giao diện Sáng Đa Tầng)',
    mode: 'light' as const,
    strictInvariant: true,
  },
  
  /** Canvas & Surface Layers (Kiến trúc Nền & Bề mặt Đa tầng) */
  surfaces: {
    canvasWarmPaper: '#FAF9F6', // Nền giấy ấm tự nhiên chống mỏi mắt
    canvasIvory: '#FDFBF7',     // Nền ngà cao cấp
    canvasAlabaster: '#F8F9FA', // Nền Alabaster trung tính
    cardElevated: '#FFFFFF',    // Bề mặt thẻ trắng tinh khiết nổi bật
    cardElevatedSubtle: '#FCFDFE',
    frostedGlass: 'rgba(255, 255, 255, 0.85)',
    overlayBackdrop: 'rgba(15, 23, 42, 0.15)',
  },

  /** Luminous Borders & Subtle Outlines (Viền Quang Học Siêu Mảnh) */
  borders: {
    hairline: '1px solid rgba(15, 23, 42, 0.07)',
    luminous: '1px solid rgba(226, 232, 240, 0.95)',
    subtle: '1px solid #E2E8F0',
    focusRing: '2px solid #2563EB',
    accentLuminous: '1px solid rgba(37, 99, 235, 0.25)',
    insetHighlight: 'inset 0 1px 0 rgba(255, 255, 255, 0.95)',
    insetHighlightTeal: 'inset 0 1px 0 rgba(13, 92, 70, 0.15)',
  },

  /** Layered Ambient + Key Shadows (Bóng Đổ Đa Tầng Siêu Mịn) */
  shadows: {
    subtle: '0 1px 2px rgba(15, 23, 42, 0.04), 0 1px 3px rgba(15, 23, 42, 0.02)',
    card: '0 1px 3px rgba(15, 23, 42, 0.03), 0 6px 16px -2px rgba(15, 23, 42, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
    cardHover: '0 3px 6px rgba(15, 23, 42, 0.04), 0 12px 24px -4px rgba(15, 23, 42, 0.07), inset 0 1px 0 rgba(255, 255, 255, 1)',
    cardActive: '0 1px 2px rgba(15, 23, 42, 0.05), inset 0 1px 1px rgba(0, 0, 0, 0.03)',
    floatingModal: '0 20px 40px -8px rgba(15, 23, 42, 0.08), 0 1px 3px rgba(15, 23, 42, 0.05)',
    glowPrimary: '0 0 20px -3px rgba(37, 99, 235, 0.18)',
    glowEmerald: '0 0 20px -3px rgba(13, 92, 70, 0.18)',
  },

  /** Palette & Semantic Colors (Bảng màu Sang trọng Đạt Chuẩn WCAG AA) */
  colors: {
    // Brand Primary (Cobalt Royal)
    primary: '#2563EB',
    primaryHover: '#1D4ED8',
    primaryActive: '#1E40AF',
    primarySurface: '#EFF6FF',
    primaryForeground: '#FFFFFF',

    // Enterprise Forest / Teal (Kế thừa KGLVS & Tabio)
    emeraldEnterprise: '#0D5C46',
    emeraldSurface: '#E6F4EE',
    emeraldHover: '#094333',
    emeraldForeground: '#FFFFFF',

    // Warning / Amber
    amberWarning: '#D97706',
    amberSurface: '#FEF3C7',
    amberForeground: '#92400E',

    // Destructive / Rose
    roseDanger: '#E11D48',
    roseSurface: '#FFE4E6',
    roseForeground: '#9F1239',

    // Neutrals & Typography
    textHead: '#0F172A',      // Slate 900
    textBody: '#334155',      // Slate 700
    textMuted: '#64748B',     // Slate 500
    textSubtle: '#94A3B8',    // Slate 400
  },

  /** Emil Kowalski Micro-interaction Physics & Timing (Động lực học vi tương tác) */
  physics: {
    // Curves
    strongEaseOut: 'cubic-bezier(0.23, 1, 0.32, 1)',
    springOvershoot: 'cubic-bezier(0.22, 1.61, 0.36, 1.0)', // Nảy nhẹ 5%
    smoothEaseInOut: 'cubic-bezier(0.77, 0, 0.175, 1)',

    // Durations
    instantPressDurationMs: 140,
    popoverTransitionMs: 200,
    modalTransitionMs: 260,

    // Scale transforms
    buttonPressScale: 'scale(0.965)',
    cardHoverLift: 'translateY(-2px)',
    tapBounce: 'scale(0.98)',
  },

  /** Radii & Spacing Geometry */
  geometry: {
    radiusSm: '6px',
    radiusMd: '10px',
    radiusLg: '14px',
    radiusXl: '20px',
    radiusFull: '9999px',
  },
} as const;

/* ==========================================================================
 * 2. AG-UI COMPONENT AST HIERARCHY (CẤU TRÚC CÂY CÚ PHÁP GIAO DIỆN)
 * ========================================================================== */

export type AGUIComponentType =
  | 'WidgetContainer'
  | 'AgentTelemetryHeader'
  | 'MetricStatGrid'
  | 'PAWSSimulationDial'
  | 'PolicyInterventionPanel'
  | 'StakeholderSentimentMatrix'
  | 'HITLApprovalGate'
  | 'TactileButton'
  | 'InteractiveSlider'
  | 'BadgePill'
  | 'LiveLogStream'
  | 'ASTTreeInspector';

export interface AGUINodeBase {
  id: string;
  type: AGUIComponentType;
  label?: string;
  className?: string;
  visible?: boolean;
  disabled?: boolean;
}

/** Container chính của Generative Widget */
export interface AGUIWidgetContainerNode extends AGUINodeBase {
  type: 'WidgetContainer';
  title: string;
  subtitle?: string;
  badge?: {
    text: string;
    variant: 'neutral' | 'primary' | 'success' | 'warning' | 'danger';
  };
  layout: 'single-column' | 'two-column-split' | 'bento-grid';
  children: AGUIComponentNode[];
}

/** Header hiển thị trạng thái Agent (CopilotKit / Antigravity Agent Session) */
export interface AGUIAgentTelemetryHeaderNode extends AGUINodeBase {
  type: 'AgentTelemetryHeader';
  agentId: string;
  agentRole: string;
  status: 'idle' | 'reasoning' | 'streaming_ui' | 'awaiting_human_approval' | 'executed';
  confidenceScore: number; // 0.0 - 1.0
  activeToolName?: string;
  tokenHeadroomRemaining: number;
}

/** Lưới hiển thị chỉ số đo lường hiệu năng / tác động */
export interface AGUIMetricStatGridNode extends AGUINodeBase {
  type: 'MetricStatGrid';
  items: Array<{
    id: string;
    label: string;
    value: string | number;
    delta?: {
      direction: 'up' | 'down' | 'flat';
      percentage: number;
      label: string;
    };
    variant?: 'neutral' | 'emerald' | 'cobalt' | 'amber';
  }>;
}

/** Bảng điều khiển mô phỏng chính sách PAWS (Policy-driven Agentic World Simulation) */
export interface AGUIPAWSSimulationDialNode extends AGUINodeBase {
  type: 'PAWSSimulationDial';
  policyKey: string;
  policyName: string;
  description: string;
  dials: Array<{
    id: string;
    name: string;
    description: string;
    min: number;
    max: number;
    step: number;
    currentValue: number;
    unit: string;
    sensitivityLevel: 'low' | 'medium' | 'critical';
  }>;
}

/** Ma trận tác động tới các bên liên quan (Stakeholder Impact Matrix - arXiv:2609.28547) */
export interface AGUIStakeholderSentimentMatrixNode extends AGUINodeBase {
  type: 'StakeholderSentimentMatrix';
  timeHorizon: 'T+0h' | 'T+6h' | 'T+24h' | 'T+72h';
  stakeholders: Array<{
    id: string;
    name: string;
    role: string;
    initialSentiment: number;  // 0 - 100
    predictedSentiment: number;// 0 - 100
    adoptionFriction: 'negligible' | 'moderate' | 'high' | 'blocker';
    keyConcern: string;
  }>;
}

/** Human-in-the-Loop Approval Gate (Cổng phê duyệt quyền lực tối cao của Anh) */
export interface AGUIHITLApprovalGateNode extends AGUINodeBase {
  type: 'HITLApprovalGate';
  gateId: string;
  actionSummary: string;
  riskTier: 'LOW' | 'ELEVATED' | 'CRITICAL_SEV1';
  diffSnapshot?: {
    filesAffected: number;
    budgetImpactUsd: number;
    reversible: boolean;
  };
  approvalRequirements: {
    requiresOwnerSignature: boolean;
    timeoutSeconds: number;
  };
  actions: {
    approveActionId: string;
    rejectActionId: string;
    tweakParamsActionId: string;
  };
}

/** Nút bấm vi tương tác xúc giác Emil Kowalski */
export interface AGUITactileButtonNode extends AGUINodeBase {
  type: 'TactileButton';
  text: string;
  variant: 'primary' | 'emerald' | 'outline' | 'ghost' | 'danger';
  icon?: string;
  actionId: string;
  payload?: Record<string, unknown>;
  keyboardShortcutHint?: string;
}

/** Bộ thanh trượt điều chỉnh tham số sống (Live Parameter Slider) */
export interface AGUIInteractiveSliderNode extends AGUINodeBase {
  type: 'InteractiveSlider';
  sliderId: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onValueChangeActionId: string;
}

/** Badge chỉ báo trạng thái */
export interface AGUIBadgePillNode extends AGUINodeBase {
  type: 'BadgePill';
  text: string;
  variant: 'neutral' | 'emerald' | 'amber' | 'rose' | 'cobalt';
}

/** Dòng log stream thời gian thực */
export interface AGUILiveLogStreamNode extends AGUINodeBase {
  type: 'LiveLogStream';
  entries: Array<{
    timestamp: string;
    level: 'info' | 'warn' | 'success' | 'trace';
    message: string;
  }>;
}

/** Trình thanh tra cây AST giao diện thời gian thực (Inspector) */
export interface AGUIASTTreeInspectorNode extends AGUINodeBase {
  type: 'ASTTreeInspector';
  showRawJson: boolean;
}

export type AGUIComponentNode =
  | AGUIWidgetContainerNode
  | AGUIAgentTelemetryHeaderNode
  | AGUIMetricStatGridNode
  | AGUIPAWSSimulationDialNode
  | AGUIStakeholderSentimentMatrixNode
  | AGUIHITLApprovalGateNode
  | AGUITactileButtonNode
  | AGUIInteractiveSliderNode
  | AGUIBadgePillNode
  | AGUILiveLogStreamNode
  | AGUIASTTreeInspectorNode;

/* ==========================================================================
 * 3. PROTOCOL WIRE FORMAT (GIAO THỨC TRUYỀN TIN BẤT ĐỒNG BỘ AG-UI)
 * ========================================================================== */

export interface AGUIStreamMessage {
  protocolVersion: 'ag-ui/v1.0';
  sessionId: string;
  timestamp: string;
  type: 'AGENT_STATE_UPDATE' | 'GEN_UI_DIFF' | 'HUMAN_INTERACTION' | 'SIMULATION_STEP';
  
  /** Payload tương ứng với từng loại bản tin */
  payload: {
    agentId: string;
    astTree?: AGUIWidgetContainerNode;
    statePatch?: Record<string, unknown>;
    userInteraction?: {
      actionId: string;
      sourceComponentId: string;
      parameters?: Record<string, unknown>;
    };
    simulationResult?: {
      stepIndex: number;
      impactScore: number;
      stakeholderEquilibrium: boolean;
    };
  };
}

/* ==========================================================================
 * 4. PAWS POLICY SIMULATION STATE CONTRACT (arXiv:2609.28547)
 * ========================================================================== */

export interface PAWSSimulationState {
  simulationId: string;
  scenarioName: string;
  
  /** Vector chính sách can thiệp (Policy Intervention Vector) */
  policyVector: {
    agentAutonomyCeiling: number;      // 0 - 100%
    budgetCapUsdPerTurn: number;       // $0 - $1,000
    securityAuditIntensity: number;   // 1 - 5 stars
    concurrencyWorkersMax: number;     // 1 - 12 workers
  };

  /** Phản ứng của các khối thể chế (Institutional Decision Dynamics) */
  institutionalEquilibrium: {
    riskIndex: number;                 // 0 (safe) - 100 (catastrophic)
    operationalVelocity: number;       // ops/sec
    estimatedCostMultiplier: number;
  };

  /** Bản đồ tâm lý các bên liên quan theo bước sóng thời gian */
  sentimentPropagation: Record<string, {
    sentiment: number;
    friction: number;
    verdict: 'FAVORABLE' | 'SKEPTICAL' | 'ALARMED';
  }>;
}
