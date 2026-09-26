/**
 * 🏛️ ANTIGRAVITY ENTERPRISE INDEPENDENT AUDIT COMMISSION
 * Core Verification Module: TwinCheckVerifier
 * 
 * Based on ArXiv Foundations:
 * - arXiv:2609.26836: 'Silent Failures in Agent-Tool Interaction: An Audit of ToolUniverse'
 * - arXiv:2609.26911: 'TwinCheck: Evidence-Grounded Negative-Twin Verification for Stateful Tool Agents'
 * 
 * Production implementation providing:
 * 1. Physical State Delta Verification (Filesystem, SHA-256 cryptographic grounding)
 * 2. Counterfactual Negative-Twin Synthesis & Sensitivity Stress-Testing
 * 3. Immutable Evidence Ledger Emission & Zero-Trust Verdicts
 */

import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

// ============================================================================
// 1. AST Core Types & Khế Ước Cấu Trúc
// ============================================================================

export type SideEffectType =
  | 'FILE_CREATE'
  | 'FILE_MODIFY'
  | 'FILE_DELETE'
  | 'ENV_SET'
  | 'PROCESS_SPAWN'
  | 'DB_RECORD_MUTATION'
  | 'ZERO_SIDE_EFFECT_READONLY';

export interface ExpectedSideEffect {
  type: SideEffectType;
  target: string;
  contentPattern?: string;
  minBytes?: number;
  maxBytes?: number;
  expectedSha256?: string;
  isStrictlyConfined?: boolean;
}

export interface ToolCallAST {
  callId: string;
  toolName: string;
  parameters: Record<string, unknown>;
  intent: string;
  declaredSideEffects: ExpectedSideEffect[];
  allowedPathBoundaries?: string[];
  timestamp: number;
}

export interface FileMetadata {
  path: string;
  exists: boolean;
  sizeBytes: number;
  sha256: string;
  mtimeMs: number;
  permissions?: number;
}

export interface PhysicalStateSnapshot {
  snapshotId: string;
  capturedAt: number;
  rootPath: string;
  files: Record<string, FileMetadata>;
  envVars: Record<string, string>;
  snapshotChecksum: string;
}

export interface FileDelta {
  path: string;
  mutationType: 'CREATED' | 'MODIFIED' | 'DELETED';
  previousSizeBytes?: number;
  currentSizeBytes?: number;
  previousSha256?: string;
  currentSha256?: string;
  byteDelta: number;
}

export interface StateDelta {
  deltaId: string;
  fromSnapshotId: string;
  toSnapshotId: string;
  createdFiles: FileDelta[];
  modifiedFiles: FileDelta[];
  deletedFiles: string[];
  unintendedMutations: FileDelta[];
  missingExpectedEffects: ExpectedSideEffect[];
  isConforming: boolean;
  computedAt: number;
}

export interface ToolExecutionResult {
  callId: string;
  exitCode: number;
  stdout: string;
  stderr: string;
  durationMs: number;
  returnedValue?: unknown;
}

export type PerturbationStrategy =
  | 'CORRUPTED_TARGET_PATH'
  | 'VACUOUS_PAYLOAD'
  | 'CONTRADICTORY_INTENT'
  | 'ISOLATED_DRY_RUN'
  | 'MUTATION_INVERSION';

export interface NegativeTwinSpec {
  twinId: string;
  originalCallId: string;
  strategy: PerturbationStrategy;
  perturbedParameters: Record<string, unknown>;
  counterfactualHypothesis: string;
  expectedOutcome: 'MUST_REJECT' | 'MUTATE_DIFFERENTLY' | 'ZERO_MUTATION';
}

export interface SensitivityReport {
  isSensitive: boolean;
  divergenceScore: number; // 0.0 to 1.0 (0.0 = Sensitivity Collapse)
  twinExitCode: number;
  twinStdout: string;
  twinDelta: StateDelta;
  reasoning: string;
  detectedAnomaly?: 'SENSITIVITY_COLLAPSE' | 'MOCK_HALLUCINATION' | 'SILENT_BYPASS';
}

export type AuditVerdictStatus =
  | 'VERIFIED_GENUINE'
  | 'SILENT_FAILURE_NO_OP'
  | 'UNINTENDED_STATE_LEAKAGE'
  | 'HALLUCINATED_MOCK_SUCCESS'
  | 'SENSITIVITY_COLLAPSE';

export interface EvidenceLedgerEntry {
  auditId: string;
  callId: string;
  toolName: string;
  verdict: AuditVerdictStatus;
  confidenceScore: number; // 0.0 to 1.0
  preSnapshotChecksum: string;
  postSnapshotChecksum: string;
  physicalMutationsDetected: {
    createdCount: number;
    modifiedCount: number;
    deletedCount: number;
    leakageCount: number;
  };
  sha256Evidence: Array<{
    target: string;
    preHash?: string;
    postHash?: string;
    verified: boolean;
  }>;
  negativeTwinEvidence: {
    twinId: string;
    strategy: PerturbationStrategy;
    divergenceScore: number;
    hypothesisConfirmed: boolean;
  };
  remediationAdvice: string;
  auditedAt: string;
}

// ============================================================================
// 2. StateDeltaVerifier: Kiểm Chứng Độ Lệch Trạng Thái Vật Lý Thực Tế
// ============================================================================

export class StateDeltaVerifier {
  public calculateFileSha256(filePath: string): string {
    if (!fs.existsSync(filePath)) return '';
    try {
      const buffer = fs.readFileSync(filePath);
      return crypto.createHash('sha256').update(buffer).digest('hex');
    } catch {
      return '';
    }
  }

  public async captureSnapshot(targetPaths: string[], baseDir: string): Promise<PhysicalStateSnapshot> {
    const files: Record<string, FileMetadata> = {};
    const normalizedBase = path.resolve(baseDir);
    const candidatePaths = new Set<string>();

    targetPaths.forEach(p => candidatePaths.add(path.resolve(baseDir, p)));

    const walkDir = (currentDir: string) => {
      if (!fs.existsSync(currentDir)) return;
      try {
        const entries = fs.readdirSync(currentDir, { withFileTypes: true });
        for (const entry of entries) {
          const fullPath = path.join(currentDir, entry.name);
          if (entry.isDirectory()) {
            walkDir(fullPath);
          } else if (entry.isFile()) {
            candidatePaths.add(path.resolve(fullPath));
          }
        }
      } catch {
        // Safe fallback for permission restricted dirs
      }
    };
    walkDir(normalizedBase);

    for (const absPath of candidatePaths) {
      const relPath = path.relative(normalizedBase, absPath).replace(/\\/g, '/');
      const exists = fs.existsSync(absPath);
      if (exists) {
        try {
          const stat = fs.statSync(absPath);
          files[relPath] = {
            path: relPath,
            exists: true,
            sizeBytes: stat.size,
            sha256: this.calculateFileSha256(absPath),
            mtimeMs: stat.mtimeMs
          };
        } catch {
          files[relPath] = { path: relPath, exists: false, sizeBytes: 0, sha256: '', mtimeMs: 0 };
        }
      } else {
        files[relPath] = { path: relPath, exists: false, sizeBytes: 0, sha256: '', mtimeMs: 0 };
      }
    }

    const snapshotHash = crypto
      .createHash('sha256')
      .update(JSON.stringify(files))
      .digest('hex');

    return {
      snapshotId: `snap_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      capturedAt: Date.now(),
      rootPath: normalizedBase,
      files,
      envVars: { ...process.env } as Record<string, string>,
      snapshotChecksum: snapshotHash
    };
  }

  public computeDelta(
    pre: PhysicalStateSnapshot,
    post: PhysicalStateSnapshot,
    expected: ExpectedSideEffect[]
  ): StateDelta {
    const createdFiles: FileDelta[] = [];
    const modifiedFiles: FileDelta[] = [];
    const deletedFiles: string[] = [];
    const unintendedMutations: FileDelta[] = [];
    const missingExpectedEffects: ExpectedSideEffect[] = [];

    const preFiles = pre.files;
    const postFiles = post.files;
    const allPaths = new Set([...Object.keys(preFiles), ...Object.keys(postFiles)]);
    const declaredTargets = new Set(expected.map(e => e.target.replace(/\\/g, '/')));

    for (const relPath of allPaths) {
      const before = preFiles[relPath];
      const after = postFiles[relPath];

      if ((!before || !before.exists) && after && after.exists) {
        const delta: FileDelta = {
          path: relPath,
          mutationType: 'CREATED',
          previousSizeBytes: 0,
          currentSizeBytes: after.sizeBytes,
          previousSha256: '',
          currentSha256: after.sha256,
          byteDelta: after.sizeBytes
        };
        createdFiles.push(delta);

        if (!declaredTargets.has(relPath)) {
          unintendedMutations.push(delta);
        }
      } else if (before && before.exists && (!after || !after.exists)) {
        deletedFiles.push(relPath);
        if (!declaredTargets.has(relPath)) {
          unintendedMutations.push({
            path: relPath,
            mutationType: 'DELETED',
            previousSizeBytes: before.sizeBytes,
            currentSizeBytes: 0,
            previousSha256: before.sha256,
            currentSha256: '',
            byteDelta: -before.sizeBytes
          });
        }
      } else if (before && before.exists && after && after.exists) {
        if (before.sha256 !== after.sha256 || before.sizeBytes !== after.sizeBytes) {
          const delta: FileDelta = {
            path: relPath,
            mutationType: 'MODIFIED',
            previousSizeBytes: before.sizeBytes,
            currentSizeBytes: after.sizeBytes,
            previousSha256: before.sha256,
            currentSha256: after.sha256,
            byteDelta: after.sizeBytes - before.sizeBytes
          };
          modifiedFiles.push(delta);

          if (!declaredTargets.has(relPath)) {
            unintendedMutations.push(delta);
          }
        }
      }
    }

    for (const exp of expected) {
      const normTarget = exp.target.replace(/\\/g, '/');
      const after = postFiles[normTarget];
      const before = preFiles[normTarget];

      if (exp.type === 'FILE_CREATE') {
        if (!after || !after.exists) {
          missingExpectedEffects.push(exp);
        } else if (exp.minBytes && after.sizeBytes < exp.minBytes) {
          missingExpectedEffects.push(exp);
        } else if (exp.maxBytes && after.sizeBytes > exp.maxBytes) {
          missingExpectedEffects.push(exp);
        } else if (exp.expectedSha256 && after.sha256 !== exp.expectedSha256) {
          missingExpectedEffects.push(exp);
        }
      } else if (exp.type === 'FILE_MODIFY') {
        if (!after || !after.exists || !before || before.sha256 === after.sha256) {
          missingExpectedEffects.push(exp);
        } else if (exp.expectedSha256 && after.sha256 !== exp.expectedSha256) {
          missingExpectedEffects.push(exp);
        }
      } else if (exp.type === 'FILE_DELETE') {
        if (after && after.exists) {
          missingExpectedEffects.push(exp);
        }
      }
    }

    const isConforming = missingExpectedEffects.length === 0 && unintendedMutations.length === 0;

    return {
      deltaId: `delta_${Date.now()}`,
      fromSnapshotId: pre.snapshotId,
      toSnapshotId: post.snapshotId,
      createdFiles,
      modifiedFiles,
      deletedFiles,
      unintendedMutations,
      missingExpectedEffects,
      isConforming,
      computedAt: Date.now()
    };
  }
}

// ============================================================================
// 3. NegativeTwinSimulator: Bản Sao Đối Kháng Thử Thách Độ Nhạy
// ============================================================================

export class NegativeTwinSimulator {
  public synthesizeNegativeTwin(toolCall: ToolCallAST): NegativeTwinSpec {
    const params = { ...toolCall.parameters };

    if (params.targetPath || params.filePath || params.path) {
      const key = params.targetPath ? 'targetPath' : params.filePath ? 'filePath' : 'path';
      return {
        twinId: `twin_neg_${Date.now()}`,
        originalCallId: toolCall.callId,
        strategy: 'CORRUPTED_TARGET_PATH',
        perturbedParameters: {
          ...params,
          [key]: 'forbidden_illegal_dir/null_device_invalid.bin'
        },
        counterfactualHypothesis: 'A genuine tool must fail or throw an error when executing against an invalid/forbidden path.',
        expectedOutcome: 'MUST_REJECT'
      };
    }

    return {
      twinId: `twin_neg_${Date.now()}`,
      originalCallId: toolCall.callId,
      strategy: 'CONTRADICTORY_INTENT',
      perturbedParameters: {
        ...params,
        __twincheck_adversarial_probe__: true,
        force_invalid_action: true
      },
      counterfactualHypothesis: 'A genuine tool should differentiate and not produce identical mock success output.',
      expectedOutcome: 'MUST_REJECT'
    };
  }

  public evaluateSensitivity(
    positiveResult: ToolExecutionResult,
    positiveDelta: StateDelta,
    twinResult: ToolExecutionResult,
    twinDelta: StateDelta,
    spec: NegativeTwinSpec
  ): SensitivityReport {
    const stdoutIdentical = (positiveResult.stdout || '').trim() === (twinResult.stdout || '').trim();
    const exitCodeIdentical = positiveResult.exitCode === twinResult.exitCode;
    const deltaIdentical =
      positiveDelta.createdFiles.length === twinDelta.createdFiles.length &&
      positiveDelta.modifiedFiles.length === twinDelta.modifiedFiles.length &&
      positiveDelta.deletedFiles.length === twinDelta.deletedFiles.length;

    let divergenceScore = 1.0;
    let anomaly: 'SENSITIVITY_COLLAPSE' | 'MOCK_HALLUCINATION' | 'SILENT_BYPASS' | undefined;

    if (stdoutIdentical && exitCodeIdentical && deltaIdentical) {
      divergenceScore = 0.0;
      anomaly = 'SENSITIVITY_COLLAPSE';
    } else if (spec.expectedOutcome === 'MUST_REJECT' && twinResult.exitCode === 0 && !twinResult.stderr) {
      divergenceScore = 0.2;
      anomaly = 'MOCK_HALLUCINATION';
    } else if (exitCodeIdentical && stdoutIdentical) {
      divergenceScore = 0.3;
    }

    return {
      isSensitive: divergenceScore >= 0.7,
      divergenceScore,
      twinExitCode: twinResult.exitCode,
      twinStdout: twinResult.stdout,
      twinDelta,
      reasoning: anomaly
        ? `Adversarial twin triggered ${anomaly}: tool behaved identically or claimed success despite counterfactual perturbation.`
        : `Tool exhibited proper sensitivity: counterfactual input produced expected rejection or distinct state.`,
      detectedAnomaly: anomaly
    };
  }
}

// ============================================================================
// 4. TwinCheckVerifier: Engine Kiểm Toán & Sổ Cái Bằng Chứng
// ============================================================================

export class TwinCheckVerifier {
  private deltaVerifier: StateDeltaVerifier;
  private twinSimulator: NegativeTwinSimulator;

  constructor(deltaVerifier?: StateDeltaVerifier, twinSimulator?: NegativeTwinSimulator) {
    this.deltaVerifier = deltaVerifier || new StateDeltaVerifier();
    this.twinSimulator = twinSimulator || new NegativeTwinSimulator();
  }

  public async audit(
    toolCall: ToolCallAST,
    executor: (params: Record<string, unknown>) => Promise<ToolExecutionResult>,
    workspaceDir: string
  ): Promise<EvidenceLedgerEntry> {
    const auditId = `audit_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const targets = toolCall.declaredSideEffects.map(e => e.target);

    // 1. Chụp snapshot trạng thái vật lý trước khi chạy
    const preSnapshot = await this.deltaVerifier.captureSnapshot(targets, workspaceDir);

    // 2. Chạy tool thực tế
    const positiveResult = await executor(toolCall.parameters);

    // 3. Chụp snapshot trạng thái vật lý sau khi chạy & tính State Delta
    const postSnapshot = await this.deltaVerifier.captureSnapshot(targets, workspaceDir);
    const positiveDelta = this.deltaVerifier.computeDelta(preSnapshot, postSnapshot, toolCall.declaredSideEffects);

    // 4. Sinh bản sao đối kháng phản thực tế (Negative Twin) và kích hoạt
    const twinSpec = this.twinSimulator.synthesizeNegativeTwin(toolCall);
    const twinPreSnapshot = await this.deltaVerifier.captureSnapshot(targets, workspaceDir);
    const twinResult = await executor(twinSpec.perturbedParameters);
    const twinPostSnapshot = await this.deltaVerifier.captureSnapshot(targets, workspaceDir);
    const twinDelta = this.deltaVerifier.computeDelta(twinPreSnapshot, twinPostSnapshot, []);

    // 5. Phân tích độ nhạy cảm (Sensitivity Analysis)
    const sensitivity = this.twinSimulator.evaluateSensitivity(
      positiveResult,
      positiveDelta,
      twinResult,
      twinDelta,
      twinSpec
    );

    // 6. Ban hành phán quyết kiểm toán dựa trên phân cấp an ninh nghiêm ngặt
    let verdict: AuditVerdictStatus = 'VERIFIED_GENUINE';
    let confidenceScore = 1.0;
    let remediationAdvice = 'State delta matches declared contract with zero leakage; negative-twin verified.';

    // Ưu tiên 1: Thất bại ngầm (Exit code 0 nhưng thiếu side-effect)
    if (positiveDelta.missingExpectedEffects.length > 0) {
      if (positiveResult.exitCode === 0) {
        verdict = 'SILENT_FAILURE_NO_OP';
        confidenceScore = 0.99;
        remediationAdvice = `CRITICAL SILENT FAILURE (arXiv:2609.26836): Tool returned exit code 0 and claimed success, but expected physical state changes did not occur on disk (${positiveDelta.missingExpectedEffects.map(e => e.target).join(', ')}).`;
      } else {
        verdict = 'HALLUCINATED_MOCK_SUCCESS';
        confidenceScore = 0.9;
        remediationAdvice = 'Tool failed to materialize expected side-effects.';
      }
    }
    // Ưu tiên 2: Rò rỉ trạng thái (Mutations nằm ngoài hợp đồng cho phép)
    else if (positiveDelta.unintendedMutations.length > 0) {
      verdict = 'UNINTENDED_STATE_LEAKAGE';
      confidenceScore = 0.98;
      remediationAdvice = `SECURITY WARNING: Side-effect leakage detected! Tool mutated undeclared resources: ${positiveDelta.unintendedMutations.map(m => m.path).join(', ')}. Scope violation.`;
    }
    // Ưu tiên 3: Sụp đổ độ nhạy (Mock stub trả về kết quả giống hệt cho đối kháng)
    else if (sensitivity.detectedAnomaly === 'SENSITIVITY_COLLAPSE') {
      verdict = 'SENSITIVITY_COLLAPSE';
      confidenceScore = 0.95;
      remediationAdvice = 'CRITICAL: Tool exhibits Sensitivity Collapse (arXiv:2609.26911). Tool returned exit code 0 and identical output for opposite/invalid inputs. Reject tool invocation as hallucinated mock.';
    }

    // 7. Tạo bằng chứng mật mã SHA-256
    const sha256Evidence = toolCall.declaredSideEffects.map(exp => {
      const normTarget = exp.target.replace(/\\/g, '/');
      const preFiles = preSnapshot.files;
      const postFiles = postSnapshot.files;
      const isModified = (postFiles[normTarget]?.sha256 || '') !== (preFiles[normTarget]?.sha256 || '');
      const isCreated = (!preFiles[normTarget] || !preFiles[normTarget].exists) && postFiles[normTarget]?.exists;
      return {
        target: normTarget,
        preHash: preFiles[normTarget]?.sha256 || 'NONE',
        postHash: postFiles[normTarget]?.sha256 || 'NONE',
        verified: isCreated || isModified
      };
    });

    return {
      auditId,
      callId: toolCall.callId,
      toolName: toolCall.toolName,
      verdict,
      confidenceScore,
      preSnapshotChecksum: preSnapshot.snapshotChecksum,
      postSnapshotChecksum: postSnapshot.snapshotChecksum,
      physicalMutationsDetected: {
        createdCount: positiveDelta.createdFiles.length,
        modifiedCount: positiveDelta.modifiedFiles.length,
        deletedCount: positiveDelta.deletedFiles.length,
        leakageCount: positiveDelta.unintendedMutations.length
      },
      sha256Evidence,
      negativeTwinEvidence: {
        twinId: twinSpec.twinId,
        strategy: twinSpec.strategy,
        divergenceScore: sensitivity.divergenceScore,
        hypothesisConfirmed: sensitivity.isSensitive
      },
      remediationAdvice,
      auditedAt: new Date().toISOString()
    };
  }
}
