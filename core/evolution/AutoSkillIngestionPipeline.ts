/**
 * ============================================================================
 * ANTIGRAVITY ENTERPRISE 2.0 — AUTONOMOUS SKILL INGESTION PIPELINE
 * ============================================================================
 * Module: core/evolution/AutoSkillIngestionPipeline.ts
 * Role: Đường ống Tự động Hóa Nạp & Đăng ký Kỹ năng Tác tử (Auto-Skill Ingestion)
 * Governance: Khối 5 (Quản trị Tri thức & Tự học Doanh nghiệp)
 * Lead Architect: Anh (Product Owner) | Senior Engineering Agent: Pod 2 Lead
 * ============================================================================
 */

import * as fs from 'fs';
import * as path from 'path';
import {
  RunToSkillCompiler,
  TrajectoryParser,
  PatternExtractor,
  SkillSynthesizer,
  QualityBenchmarkEngine,
  SessionTrajectory,
  CausalExecutionGraph,
  TrajectoryStep,
  ExtractedPatternBundle,
  SynthesizedSkillDocument,
  BenchmarkEvaluationResult,
  DESTRUCTIVE_COMMAND_PATTERNS,
  sanitizeSecrets
} from './RunToSkillCompiler';

export interface IngestionConfig {
  skillsDirectory: string;
  candidatesDirectory: string;
  registryFilePath: string;
  minBenchmarkScore: number;
  allowAutoPromotion: boolean;
  dryRun: boolean;
  forceOverwrite: boolean;
  backupBeforeWrite: boolean;
}

export interface IngestionScanResult {
  discoveredTranscripts: string[];
  scannedCount: number;
  skippedAlreadyIngestedCount: number;
}

export interface SkillIngestionResult {
  status: 'SUCCESS' | 'PROMOTED' | 'CANDIDATE_ONLY' | 'REJECTED' | 'DRY_RUN';
  skillName: string;
  skillPath?: string;
  candidatePath?: string;
  benchmarkResult: BenchmarkEvaluationResult;
  pruningMetrics: {
    totalRawSteps: number;
    prunedDeadEnds: number;
    winningStepsCount: number;
    compressionRatio: number;
  };
  secretsSanitized: boolean;
  rejectionReason?: string;
  registeredAt: string;
  manifest: Record<string, unknown>;
}

export interface PipelineBatchResult {
  totalProcessed: number;
  successCount: number;
  promotedCount: number;
  candidateCount: number;
  rejectedCount: number;
  results: SkillIngestionResult[];
  startedAt: string;
  completedAt: string;
  durationMs: number;
}

export interface SkillRegistryEntry {
  name: string;
  skillPath: string;
  intentKey: string;
  sourceSessionId: string;
  status: 'ACTIVE' | 'CANDIDATE' | 'DEPRECATED';
  benchmarkScore: number;
  benchmarkRating: string;
  ingestedAt: string;
  lastUpdatedAt: string;
}

export interface SkillRegistryData {
  version: string;
  lastUpdated: string;
  totalSkills: number;
  skills: Record<string, SkillRegistryEntry>;
}

export const DEFAULT_INGESTION_CONFIG: IngestionConfig = {
  skillsDirectory: path.resolve('c:/Users/game/.gemini/config/skills'),
  candidatesDirectory: path.resolve('c:/Users/game/.gemini/config/learning/candidates'),
  registryFilePath: path.resolve('c:/Users/game/.gemini/config/skills/skills_registry.json'),
  minBenchmarkScore: 7.5,
  allowAutoPromotion: true,
  dryRun: false,
  forceOverwrite: false,
  backupBeforeWrite: true
};

export class TrajectoryScanner {
  /**
   * Quét đệ quy tìm các file transcript.jsonl trong thư mục
   */
  scanDirectory(baseDir: string, maxDepth: number = 5): string[] {
    const results: string[] = [];
    if (!fs.existsSync(baseDir)) return results;

    const traverse = (currentDir: string, currentDepth: number) => {
      if (currentDepth > maxDepth) return;
      try {
        const entries = fs.readdirSync(currentDir, { withFileTypes: true });
        for (const entry of entries) {
          const fullPath = path.join(currentDir, entry.name);
          if (entry.isDirectory()) {
            if (entry.name === 'node_modules' || entry.name === '.git') continue;
            traverse(fullPath, currentDepth + 1);
          } else if (entry.isFile()) {
            if (
              entry.name === 'transcript.jsonl' ||
              entry.name.endsWith('.transcript.jsonl') ||
              (entry.name.endsWith('.jsonl') && !entry.name.includes('full'))
            ) {
              results.push(path.normalize(fullPath));
            }
          }
        }
      } catch (err) {
        // Skip unreadable directories
      }
    };

    traverse(baseDir, 0);
    return results;
  }

  /**
   * Quét nhanh các phiên làm việc gần nhất từ thư mục brain
   */
  findRecentTranscripts(brainDir: string, limit: number = 10): string[] {
    const all = this.scanDirectory(brainDir, 6);
    // Sort by modification time descending
    return all
      .map(p => {
        try {
          return { path: p, mtime: fs.statSync(p).mtimeMs };
        } catch {
          return { path: p, mtime: 0 };
        }
      })
      .sort((a, b) => b.mtime - a.mtime)
      .slice(0, limit)
      .map(x => x.path);
  }
}

export class AutoSkillIngestionPipeline {
  private config: IngestionConfig;
  private compiler: RunToSkillCompiler;
  private scanner: TrajectoryScanner;
  private backups: Map<string, string> = new Map();

  constructor(customConfig?: Partial<IngestionConfig>) {
    this.config = {
      ...DEFAULT_INGESTION_CONFIG,
      ...customConfig
    };
    this.compiler = new RunToSkillCompiler();
    this.scanner = new TrajectoryScanner();
  }

  getConfig(): IngestionConfig {
    return { ...this.config };
  }

  getScanner(): TrajectoryScanner {
    return this.scanner;
  }

  /**
   * Nạp kỹ năng từ chuỗi JSONL thô (Raw JSONL String)
   */
  ingestFromRawJsonl(
    rawJsonl: string,
    overrideConfig?: Partial<IngestionConfig>
  ): SkillIngestionResult {
    const activeConfig = { ...this.config, ...overrideConfig };
    const registeredAt = new Date().toISOString();

    // 1. Biên dịch thông qua RunToSkillCompiler
    let compilation;
    try {
      compilation = this.compiler.compile(rawJsonl);
    } catch (err: any) {
      return {
        status: 'REJECTED',
        skillName: 'unparseable-skill',
        benchmarkResult: {
          skillName: 'unparseable-skill',
          evaluatedAt: registeredAt,
          totalScore: 0,
          maxScore: 10,
          rating: 'REJECTED',
          breakdown: {
            structureMetadata: { score: 0, maxScore: 2.5, notes: ['Lỗi phân giải JSONL'] },
            commandSafety: { score: 0, maxScore: 2.5, notes: [] },
            referenceCoverage: { score: 0, maxScore: 2.5, notes: [] },
            ecosystemFit: { score: 0, maxScore: 2.5, notes: [] }
          },
          summaryNotes: [`Không thể parse trajectory: ${err.message}`]
        },
        pruningMetrics: {
          totalRawSteps: 0,
          prunedDeadEnds: 0,
          winningStepsCount: 0,
          compressionRatio: 0
        },
        secretsSanitized: false,
        rejectionReason: `Lỗi phân giải JSONL: ${err.message}`,
        registeredAt,
        manifest: {}
      };
    }

    const { skillDocument, benchmarkResult, patterns } = compilation;
    const skillName = skillDocument.skillName;

    // Bổ sung Section 5 nếu có Code Snippets hoặc Config đã kiểm chứng
    if (patterns.reusableCodeSnippets && patterns.reusableCodeSnippets.length > 0) {
      const snippetSection = {
        headingLevel: 2 as const,
        title: '5. Mẫu Mã Nguồn & Cấu Hình Đã Kiểm Chứng (Verified Code & Configuration)',
        slug: 'code-snippets',
        content: patterns.reusableCodeSnippets.map(snip =>
          `#### ${snip.filename} (${snip.language})\n*${snip.description}*\n\`\`\`${snip.language}\n${snip.content}\n\`\`\``
        ).join('\n\n')
      };
      if (!skillDocument.sections.some(s => s.slug === 'code-snippets')) {
        skillDocument.sections.push(snippetSection);
        skillDocument.rawMarkdown += `\n---\n\n## ${snippetSection.title}\n\n${snippetSection.content}\n`;
      }
    }

    // 2. Kiểm toán An toàn Lệnh (Safety Gate - INV-SE02)
    const hasDestructive = !benchmarkResult.breakdown.commandSafety.zeroDestructivePatterns;
    if (hasDestructive) {
      return {
        status: 'REJECTED',
        skillName,
        benchmarkResult,
        pruningMetrics: patterns.provenance,
        secretsSanitized: true,
        rejectionReason: `Vi phạm INV-SE02: Phát hiện lệnh phá hoại nguy hiểm (${benchmarkResult.breakdown.commandSafety.detectedDestructivePatterns?.join(', ') || 'Destructive commands'})`,
        registeredAt,
        manifest: {}
      };
    }

    // 3. Kiểm toán Rò rỉ Thông tin Nhạy cảm (Security Gate - INV-E07)
    const { cleanText, secretsFound } = sanitizeSecrets(skillDocument.rawMarkdown);
    skillDocument.rawMarkdown = cleanText;

    // 4. Kiểm toán Ngưỡng Điểm Chất lượng (Quality Benchmark Gate)
    const score = benchmarkResult.totalScore;
    const isQualityApproved = score >= activeConfig.minBenchmarkScore;

    if (!isQualityApproved && score < 5.0) {
      return {
        status: 'REJECTED',
        skillName,
        benchmarkResult,
        pruningMetrics: patterns.provenance,
        secretsSanitized: secretsFound,
        rejectionReason: `Chất lượng không đạt ngưỡng tối thiểu: ${score}/${activeConfig.minBenchmarkScore} (Rating: ${benchmarkResult.rating})`,
        registeredAt,
        manifest: {}
      };
    }

    // Xác định phân loại: PROMOTED (nạp thẳng danh bạ chính) hoặc CANDIDATE_ONLY (lưu vùng ứng viên)
    const shouldPromote = activeConfig.allowAutoPromotion && isQualityApproved;
    const targetStatus = shouldPromote ? 'PROMOTED' : 'CANDIDATE_ONLY';

    const targetDir = shouldPromote
      ? path.join(activeConfig.skillsDirectory, skillName)
      : path.join(activeConfig.candidatesDirectory, skillName);

    const targetSkillFile = path.join(targetDir, 'SKILL.md');
    const targetManifestFile = path.join(targetDir, 'manifest.json');

    // 5. Kiểm tra Dry-Run Mode
    if (activeConfig.dryRun) {
      return {
        status: 'DRY_RUN',
        skillName,
        skillPath: targetSkillFile,
        candidatePath: targetDir,
        benchmarkResult,
        pruningMetrics: patterns.provenance,
        secretsSanitized: secretsFound,
        registeredAt,
        manifest: {
          skillName,
          promoted: shouldPromote,
          dryRun: true,
          targetPath: targetSkillFile
        }
      };
    }

    // 6. Ghi Tệp vào Hệ Thống Tệp (Filesystem Persistence)
    try {
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      // Sao lưu trước khi ghi đè nếu được cấu hình
      if (fs.existsSync(targetSkillFile) && activeConfig.backupBeforeWrite) {
        const existingContent = fs.readFileSync(targetSkillFile, 'utf-8');
        this.backups.set(targetSkillFile, existingContent);
      }

      // Ghi SKILL.md
      fs.writeFileSync(targetSkillFile, skillDocument.rawMarkdown, 'utf-8');

      // Ghi manifest.json
      const manifestData = {
        skillName,
        version: shouldPromote ? '1.0.0' : '1.0.0-candidate',
        status: shouldPromote ? 'ACTIVE' : 'CANDIDATE',
        sourceSessionId: patterns.sourceSessionId,
        userIntent: patterns.intentKey,
        registeredAt,
        benchmark: {
          totalScore: benchmarkResult.totalScore,
          maxScore: benchmarkResult.maxScore,
          rating: benchmarkResult.rating,
          breakdown: benchmarkResult.breakdown
        },
        pruningMetrics: patterns.provenance,
        humanPromotionRequired: !shouldPromote
      };
      fs.writeFileSync(targetManifestFile, JSON.stringify(manifestData, null, 2), 'utf-8');

      // 7. Cập nhật Danh bạ Kỹ năng (Registry Update)
      const registryEntry: SkillRegistryEntry = {
        name: skillName,
        skillPath: targetSkillFile,
        intentKey: patterns.intentKey,
        sourceSessionId: patterns.sourceSessionId,
        status: shouldPromote ? 'ACTIVE' : 'CANDIDATE',
        benchmarkScore: benchmarkResult.totalScore,
        benchmarkRating: benchmarkResult.rating,
        ingestedAt: registeredAt,
        lastUpdatedAt: registeredAt
      };

      this.updateRegistry(registryEntry, activeConfig.registryFilePath);

      return {
        status: targetStatus,
        skillName,
        skillPath: shouldPromote ? targetSkillFile : undefined,
        candidatePath: !shouldPromote ? targetSkillFile : undefined,
        benchmarkResult,
        pruningMetrics: patterns.provenance,
        secretsSanitized: secretsFound,
        registeredAt,
        manifest: manifestData
      };
    } catch (writeErr: any) {
      return {
        status: 'REJECTED',
        skillName,
        benchmarkResult,
        pruningMetrics: patterns.provenance,
        secretsSanitized: secretsFound,
        rejectionReason: `Lỗi ghi filesystem: ${writeErr.message}`,
        registeredAt,
        manifest: {}
      };
    }
  }

  /**
   * Nạp kỹ năng từ một tệp transcript.jsonl cụ thể
   */
  ingestFromTranscriptFile(
    filePath: string,
    overrideConfig?: Partial<IngestionConfig>
  ): SkillIngestionResult {
    if (!fs.existsSync(filePath)) {
      const now = new Date().toISOString();
      return {
        status: 'REJECTED',
        skillName: 'missing-file',
        benchmarkResult: {
          skillName: 'missing-file',
          evaluatedAt: now,
          totalScore: 0,
          maxScore: 10,
          rating: 'REJECTED',
          breakdown: {
            structureMetadata: { score: 0, maxScore: 2.5, notes: [] },
            commandSafety: { score: 0, maxScore: 2.5, notes: [] },
            referenceCoverage: { score: 0, maxScore: 2.5, notes: [] },
            ecosystemFit: { score: 0, maxScore: 2.5, notes: [] }
          },
          summaryNotes: ['Tệp transcript không tồn tại']
        },
        pruningMetrics: {
          totalRawSteps: 0,
          prunedDeadEnds: 0,
          winningStepsCount: 0,
          compressionRatio: 0
        },
        secretsSanitized: false,
        rejectionReason: `Tệp không tồn tại: ${filePath}`,
        registeredAt: now,
        manifest: {}
      };
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    return this.ingestFromRawJsonl(content, overrideConfig);
  }

  /**
   * Quét và nạp hàng loạt (Batch Scan & Ingestion)
   */
  scanAndIngestBatch(
    searchDir: string,
    overrideConfig?: Partial<IngestionConfig>
  ): PipelineBatchResult {
    const startedAt = new Date().toISOString();
    const startTime = Date.now();
    const discovered = this.scanner.scanDirectory(searchDir);

    const results: SkillIngestionResult[] = [];
    let successCount = 0;
    let promotedCount = 0;
    let candidateCount = 0;
    let rejectedCount = 0;

    for (const transcriptPath of discovered) {
      const res = this.ingestFromTranscriptFile(transcriptPath, overrideConfig);
      results.push(res);
      if (res.status === 'PROMOTED') {
        promotedCount++;
        successCount++;
      } else if (res.status === 'CANDIDATE_ONLY') {
        candidateCount++;
        successCount++;
      } else if (res.status === 'DRY_RUN' || res.status === 'SUCCESS') {
        successCount++;
      } else {
        rejectedCount++;
      }
    }

    const completedAt = new Date().toISOString();
    const durationMs = Date.now() - startTime;

    return {
      totalProcessed: discovered.length,
      successCount,
      promotedCount,
      candidateCount,
      rejectedCount,
      results,
      startedAt,
      completedAt,
      durationMs
    };
  }

  /**
   * Đọc danh bạ kỹ năng hiện có
   */
  getRegistry(registryPath?: string): SkillRegistryData {
    const p = registryPath || this.config.registryFilePath;
    if (!fs.existsSync(p)) {
      return {
        version: '1.0.0',
        lastUpdated: new Date().toISOString(),
        totalSkills: 0,
        skills: {}
      };
    }

    try {
      const data = JSON.parse(fs.readFileSync(p, 'utf-8'));
      return data;
    } catch {
      return {
        version: '1.0.0',
        lastUpdated: new Date().toISOString(),
        totalSkills: 0,
        skills: {}
      };
    }
  }

  /**
   * Cập nhật danh bạ kỹ năng trung tâm
   */
  private updateRegistry(entry: SkillRegistryEntry, registryPath: string): void {
    const dir = path.dirname(registryPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const current = this.getRegistry(registryPath);
    current.skills[entry.name] = entry;
    current.totalSkills = Object.keys(current.skills).length;
    current.lastUpdated = new Date().toISOString();

    fs.writeFileSync(registryPath, JSON.stringify(current, null, 2), 'utf-8');
  }

  /**
   * Kiểm tra tính toàn vẹn (Integrity Verification) của một file SKILL.md
   */
  verifySkillIntegrity(skillFilePath: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    if (!fs.existsSync(skillFilePath)) {
      return { isValid: false, errors: [`Tệp không tồn tại: ${skillFilePath}`] };
    }

    const content = fs.readFileSync(skillFilePath, 'utf-8');
    if (!content.startsWith('---')) {
      errors.push('Thiếu YAML frontmatter mở đầu (---)');
    }
    if (!content.includes('name:')) {
      errors.push('Thiếu trường metadata `name`');
    }
    if (!content.includes('description:')) {
      errors.push('Thiếu trường metadata `description`');
    }
    if (!content.includes('Tự động kích hoạt khi')) {
      errors.push('Mô tả chưa tuân thủ quy chuẩn Intent-First ("Tự động kích hoạt khi...")');
    }

    const canonicalSections = [
      'Bản Chất Kiến Trúc',
      'Thông Số Kỹ Thuật',
      'Quy Trình Vận Hành',
      'Bẫy Lỗi'
    ];

    for (const sec of canonicalSections) {
      if (!content.includes(sec)) {
        errors.push(`Thiếu phân đoạn cấu trúc chuẩn: "${sec}"`);
      }
    }

    // Check secrets
    const { secretsFound } = sanitizeSecrets(content);
    if (secretsFound) {
      errors.push('Phát hiện secret hoặc auth token chưa làm sạch trong SKILL.md');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Hoàn tác nạp kỹ năng khi có sự cố
   */
  rollbackSkill(skillName: string, targetDir?: string, options?: { purgeFolder?: boolean }): boolean {
    const baseDir = targetDir || this.config.skillsDirectory;
    const skillPath = path.join(baseDir, skillName, 'SKILL.md');
    const folder = path.join(baseDir, skillName);

    try {
      if (options?.purgeFolder || !this.backups.has(skillPath)) {
        if (fs.existsSync(folder)) {
          fs.rmSync(folder, { recursive: true, force: true });
        }
      } else if (this.backups.has(skillPath)) {
        fs.writeFileSync(skillPath, this.backups.get(skillPath)!, 'utf-8');
      }

      // Xóa khỏi danh bạ nếu có
      const reg = this.getRegistry();
      if (reg.skills[skillName]) {
        delete reg.skills[skillName];
        reg.totalSkills = Object.keys(reg.skills).length;
        reg.lastUpdated = new Date().toISOString();
        fs.writeFileSync(this.config.registryFilePath, JSON.stringify(reg, null, 2), 'utf-8');
      }

      return true;
    } catch {
      return false;
    }
  }
}
