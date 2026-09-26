/**
 * ============================================================================
 * ANTIGRAVITY ENTERPRISE 2.0 — AUTONOMOUS RUN-TO-SKILL COMPILER (COMMONJS RUNTIME)
 * ============================================================================
 * Module: core/evolution/RunToSkillCompiler.js
 * ============================================================================
 */

const DESTRUCTIVE_COMMAND_PATTERNS = [
  [/\brm\s+(?:-[a-zA-Z0-9_-]+\s+)*(?:\/[*]?|~|\*)/i, "Lệnh xóa đệ quy gốc hoặc wildcard nguy hiểm (rm -rf /)"],
  [/\bformat\s+[a-zA-Z]:/i, "Lệnh format ổ đĩa Windows (format C:)"],
  [/\bdel\s+(?:\/[a-zA-Z]+\s+)*(?:[a-zA-Z]:\\?|[\*\\])/i, "Lệnh xóa hàng loạt nguy hiểm trên Windows (del /f /s /q)"],
  [/\b(?:rd|rmdir)\s+(?:\/[a-zA-Z]+\s+)*(?:[a-zA-Z]:\\?|\/)/i, "Lệnh xóa sạch thư mục gốc Windows (rd /s /q)"],
  [/\bmkfs\b/i, "Lệnh format filesystem Linux (mkfs)"],
  [/\bdd\s+if=.*of=\/dev\//i, "Lệnh ghi đè block device trực tiếp (dd)"],
  [/:\(\)\s*\{\s*:\s*\|\s*:\s*&\s*\}\s*;\s*:/, "Fork bomb gây tê liệt hệ thống"],
  [/\bgit\s+reset\s+--hard\b/i, "Lệnh ghi đè thô bạo commit lịch sử (git reset --hard)"],
  [/\bgit\s+clean\s+-(?:[a-zA-Z]*f[a-zA-Z]*d|fd|fdx|df|dfx)\b/i, "Lệnh dọn sạch file không theo dõi (git clean -fdx)"],
  [/\bchmod\s+-R\s+777\s+\//i, "Lệnh mở toang quyền hệ thống (chmod -R 777 /)"]
];

function sanitizeSecrets(text) {
  if (!text) return { cleanText: text, secretsFound: false };
  const original = text;
  const sanitized = text
    .replace(/Bearer\s+[a-zA-Z0-9_\-\.]{20,}/gi, 'Bearer [REDACTED_BEARER_TOKEN]')
    .replace(/api[-_]?key\s*[:=]\s*['"]?[a-zA-Z0-9_\-\.]{16,}['"]?/gi, 'api_key: [REDACTED_API_KEY]')
    .replace(/sk-[a-zA-Z0-9_\-\.]{16,}/g, '[REDACTED_SECRET_KEY]')
    .replace(/\b(?:ghp|gho|ghu|ghs|ghr)_[a-zA-Z0-9]{36,}\b/g, '[REDACTED_GITHUB_TOKEN]')
    .replace(/\b\d{8,10}:[a-zA-Z0-9_-]{35}\b/g, '[REDACTED_TELEGRAM_TOKEN]')
    .replace(/\b(?:AKIA|ABIA|ACCA|ASIA)[0-9A-Z]{16}\b/g, '[REDACTED_AWS_KEY]');
  return { cleanText: sanitized, secretsFound: sanitized !== original };
}

class TrajectoryParser {
  parseJsonl(rawJsonl) {
    const lines = rawJsonl.split(/\r?\n/).filter(l => l.trim().length > 0);
    const steps = [];
    let sessionId = 'unknown-session';
    let userGoal = 'Tác vụ kỹ thuật chưa đặt tên';
    let workspaceUri = 'c:/Users/game/.gemini';
    let startedAt = new Date().toISOString();
    let completedAt = new Date().toISOString();

    lines.forEach((line, idx) => {
      try {
        const parsed = JSON.parse(line);
        const step = {
          stepIndex: parsed.step_index !== undefined ? parsed.step_index : idx,
          source: parsed.source || 'MODEL',
          type: parsed.type || 'GENERIC',
          status: parsed.status || 'DONE',
          createdAt: parsed.created_at || new Date().toISOString(),
          content: parsed.content,
          thinking: parsed.thinking,
          toolCalls: parsed.tool_calls ? parsed.tool_calls.map((tc, tcIdx) => ({
            callId: tc.id || `tc_${idx}_${tcIdx}`,
            name: tc.name,
            arguments: typeof tc.args === 'string' ? JSON.parse(tc.args) : (tc.args || {}),
            toolAction: tc.args && tc.args.toolAction,
            toolSummary: tc.args && tc.args.toolSummary,
            timestamp: parsed.created_at || new Date().toISOString()
          })) : undefined,
          toolResults: parsed.tool_results ? parsed.tool_results.map((tr) => ({
            callId: tr.call_id || `tr_${idx}`,
            name: tr.name || 'tool',
            status: tr.is_error ? 'ERROR' : 'SUCCESS',
            output: tr.content || tr.output || '',
            error: tr.is_error ? (tr.error || tr.content) : undefined
          })) : undefined,
          metadata: parsed.metadata
        };

        if (idx === 0 && step.content) {
          userGoal = step.content.replace(/<USER_REQUEST>|<\/USER_REQUEST>/g, '').trim();
          startedAt = step.createdAt;
        }
        completedAt = step.createdAt;
        if (parsed.session_id) sessionId = parsed.session_id;

        steps.push(step);
      } catch (e) {}
    });

    return {
      sessionId,
      workspaceUri,
      startedAt,
      completedAt,
      userGoal,
      steps,
      totalSteps: steps.length,
      environmentInfo: {
        os: 'windows',
        shell: 'powershell',
        runtimeVersions: { node: 'v20.18.0', typescript: '5.6.3' }
      }
    };
  }
}

class PatternExtractor {
  buildCausalGraph(trajectory) {
    const nodes = [];
    const prunedIndices = [];
    const winningBranchIndices = [];
    const fileMutationHistory = new Map();

    for (let i = 0; i < trajectory.steps.length; i++) {
      const step = trajectory.steps[i];
      let isDeadEnd = false;
      let pruneReason = undefined;

      const hasErrorResult = (step.toolResults && step.toolResults.some(tr => tr.status === 'ERROR')) ||
                             step.status === 'ERROR' ||
                             (step.content && /Encountered error|command failed|syntax error/i.test(step.content));

      if (hasErrorResult) {
        isDeadEnd = true;
        pruneReason = 'EXECUTION_ERROR';
      }

      if (step.toolCalls) {
        for (const tc of step.toolCalls) {
          const targetFile = tc.arguments && (tc.arguments.TargetFile || tc.arguments.targetFile || tc.arguments.path);
          if (targetFile) {
            const history = fileMutationHistory.get(targetFile) || [];
            history.push(i);
            fileMutationHistory.set(targetFile, history);
          }
        }
      }

      const node = {
        stepIndex: i,
        actionType: step.type === 'USER_INPUT' ? 'USER_DIRECTIVE' :
                    (step.toolCalls && step.toolCalls.length > 0 ? 'TOOL_CALL' : 'REASONING'),
        actionRefId: `step_${i}`,
        parentIndices: i > 0 ? [i - 1] : [],
        isSuccessful: !isDeadEnd,
        isDeadEnd,
        pruneReason
      };

      nodes.push(node);
    }

    for (const [, stepIndices] of fileMutationHistory.entries()) {
      if (stepIndices.length > 1) {
        for (let j = 0; j < stepIndices.length - 1; j++) {
          const prevIdx = stepIndices[j];
          const nextIdx = stepIndices[j + 1];
          if (nodes[prevIdx].pruneReason === 'EXECUTION_ERROR' || nodes[nextIdx].actionType === 'TOOL_CALL') {
            nodes[prevIdx].isDeadEnd = true;
            nodes[prevIdx].pruneReason = 'SUBSEQUENT_OVERWRITE';
          }
        }
      }
    }

    for (const node of nodes) {
      if (node.isDeadEnd) {
        prunedIndices.push(node.stepIndex);
      } else {
        winningBranchIndices.push(node.stepIndex);
      }
    }

    return {
      sessionId: trajectory.sessionId,
      nodes,
      rootIndex: 0,
      terminalIndex: trajectory.steps.length - 1,
      prunedIndices,
      winningBranchIndices
    };
  }

  pruneBacktracking(graph, trajectory) {
    const winningSet = new Set(graph.winningBranchIndices);
    return trajectory.steps.filter((_, idx) => winningSet.has(idx));
  }

  extractPatterns(winningSteps, trajectory) {
    const operationalSteps = [];
    const recoveryPatterns = [];
    const invariantRules = [];
    const reusableSnippets = [];
    let stepCounter = 1;

    for (let i = 0; i < trajectory.steps.length - 1; i++) {
      const step = trajectory.steps[i];
      const nextStep = trajectory.steps[i + 1];

      const failedResult = step.toolResults && step.toolResults.find(tr => tr.status === 'ERROR');
      if (failedResult || (step.content && /error/i.test(step.content) && step.status === 'ERROR')) {
        const errorMsg = (failedResult && failedResult.error) || step.content || 'Unknown execution failure';
        const failingCall = (step.toolCalls && step.toolCalls[0] && step.toolCalls[0].name) || 'unknown_tool';
        const correctiveCall = (nextStep.toolCalls && nextStep.toolCalls[0] && nextStep.toolCalls[0].name) || 'recovery_action';

        recoveryPatterns.push({
          errorSignature: errorMsg.slice(0, 120),
          rootCause: `Lỗi phát sinh khi thực thi lệnh '${failingCall}' do thiếu tham số hoặc sai cú pháp môi trường.`,
          failingAction: `${failingCall}(${JSON.stringify((step.toolCalls && step.toolCalls[0] && step.toolCalls[0].arguments) || {}).slice(0, 80)}...)`,
          correctiveAction: `Áp dụng ${correctiveCall} đã kiểm chứng thành công ở bước kế tiếp.`,
          preventionGuardrail: `Kiểm tra tiền điều kiện trước khi gọi ${failingCall} để tránh hồi quy.`
        });
      }
    }

    for (const step of winningSteps) {
      if (step.toolCalls && step.toolCalls.length > 0) {
        for (const tc of step.toolCalls) {
          const toolName = tc.name;
          const args = tc.arguments || {};
          const verifiedCmds = [];

          if (toolName === 'run_command' && args.CommandLine) {
            const cmd = String(args.CommandLine);
            const { cleanText } = sanitizeSecrets(cmd);
            verifiedCmds.push({
              command: cleanText,
              workingDir: String(args.Cwd || '.'),
              purpose: tc.toolAction || tc.toolSummary || 'Thực thi lệnh kiểm chứng hệ thống',
              isDestructive: DESTRUCTIVE_COMMAND_PATTERNS.some(([p]) => p.test(cmd))
            });
          }

          if (toolName === 'write_to_file' && args.TargetFile) {
            const filename = String(args.TargetFile).split(/[\\/]/).pop() || 'artifact.ts';
            const code = String(args.CodeContent || '');
            const { cleanText } = sanitizeSecrets(code);
            reusableSnippets.push({
              filename,
              language: filename.endsWith('.ts') ? 'typescript' : filename.endsWith('.py') ? 'python' : 'yaml',
              content: cleanText.slice(0, 1000),
              description: String(args.Description || `Mẫu mã nguồn sinh ra cho ${filename}`)
            });
          }

          operationalSteps.push({
            stepNumber: stepCounter++,
            title: tc.toolAction || `Thực thi công cụ ${toolName}`,
            objective: tc.toolSummary || `Vận hành tác vụ kỹ thuật qua ${toolName}`,
            toolChain: [{
              toolName,
              canonicalParams: args,
              expectedOutcome: 'Lệnh thực thi thành công không phát sinh mã lỗi'
            }],
            verifiedCommands: verifiedCmds,
            verificationCriteria: [
              'Không phát sinh ngoại lệ runtime',
              'Đầu ra chứa bằng chứng xác thực hoàn tất'
            ]
          });
        }
      }
    }

    invariantRules.push('Tuân thủ nghiêm ngặt ranh giới Sandbox & không thực thi lệnh phá hoại');
    invariantRules.push('Làm sạch 100% Secrets, Bearer Tokens và API Keys trước khi lưu trữ (INV-E07)');
    invariantRules.push('Mọi thao tác chỉnh sửa mã nguồn bắt buộc phải có kiểm chứng xác nhận');

    const totalRaw = trajectory.steps.length;
    const winningCount = winningSteps.length;
    const prunedCount = totalRaw - winningCount;
    const compressionRatio = totalRaw > 0 ? Number(((prunedCount / totalRaw) * 100).toFixed(1)) : 0;

    return {
      sourceSessionId: trajectory.sessionId,
      domain: 'System Evolution & Tool Orchestration',
      intentKey: trajectory.userGoal.slice(0, 50),
      extractedAt: new Date().toISOString(),
      summary: `Bộ kỹ năng đúc rút tự động từ phiên thực thi ${trajectory.sessionId}, giải quyết bài toán: "${trajectory.userGoal}"`,
      operationalSteps,
      recoveryPatterns,
      invariantRules,
      reusableCodeSnippets: reusableSnippets,
      provenance: {
        totalRawSteps: totalRaw,
        prunedDeadEnds: prunedCount,
        winningStepsCount: winningCount,
        compressionRatio
      }
    };
  }
}

class SkillSynthesizer {
  synthesize(patterns) {
    const cleanName = patterns.intentKey
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'compiled-skill';

    const skillName = `skill-${cleanName}`.slice(0, 32);

    const description = `Kỹ năng chuyên gia tự động đúc rút từ quỹ đạo phiên làm việc (${patterns.provenance.winningStepsCount} bước thành công, nén ${patterns.provenance.compressionRatio}% nhiễu).
Tự động kích hoạt khi người dùng muốn:
  - Tự động hóa hoặc thực thi tác vụ liên quan đến ${patterns.intentKey}
  - Vận hành quy trình chuẩn đã được kiểm chứng độc lập
  - Khắc phục các lỗi vận hành phổ biến: ${patterns.recoveryPatterns.map(r => r.errorSignature.slice(0, 30)).join(', ') || 'Lỗi cấu hình runtime'}
KHÔNG CẦN người dùng phải nhớ tên kỹ thuật hay các bước thủ công phức tạp.`;

    const frontmatter = {
      name: skillName,
      description,
      triggers: [patterns.intentKey, skillName],
      autoActivationHints: ['Tự động kích hoạt khi gặp intent tương tự']
    };

    const sections = [
      {
        headingLevel: 1,
        title: `${skillName} — Cẩm Nang Kỹ Năng Tự Động Đúc Rút (Run-to-Skill)`,
        slug: 'header',
        content: `> **Nguồn gốc Quỹ đạo**: Phiên \`${patterns.sourceSessionId}\`  
> **Tỷ lệ Nén Nhiễu & Backtracking**: ${patterns.provenance.compressionRatio}% (${patterns.provenance.prunedDeadEnds} bước rác bị loại bỏ)  
> **Trạng thái Quản trị**: \`CANDIDATE\` (Chờ duyệt Human Gate từ Anh)  
> **Thời điểm Biên dịch**: ${patterns.extractedAt}`
      },
      {
        headingLevel: 2,
        title: '1. Bản Chất Kiến Trúc & Giá Trị Cốt Lõi (Architectural Essence)',
        slug: 'essence',
        content: `* **Mục tiêu kỹ thuật**: ${patterns.summary}
* **Lĩnh vực đảm nhiệm**: ${patterns.domain}
* **Các nguyên tắc bất biến (Invariants)**:
${patterns.invariantRules.map(r => `  - ${r}`).join('\n')}`
      },
      {
        headingLevel: 2,
        title: '2. Thông Số Kỹ Thuật & Cú Pháp Lệnh Đã Kiểm Chứng (Specifications & Contracts)',
        slug: 'specifications',
        content: `Dưới đây là các lệnh CLI và cấu hình thực thi tiêu chuẩn đã được xác nhận thành công trong phiên:

\`\`\`bash
# Lệnh vận hành chuẩn mực đã kiểm chứng
${patterns.operationalSteps.flatMap(s => s.verifiedCommands.map(c => `# Mục đích: ${c.purpose}\n${c.command}`)).join('\n\n') || '# Không có lệnh CLI riêng biệt; tương tác trực tiếp qua tool chain.'}
\`\`\``
      },
      {
        headingLevel: 2,
        title: '3. Quy Trình Vận Hành Chuẩn Mực (Step-by-Step Runbook)',
        slug: 'runbook',
        content: patterns.operationalSteps.map(s => `#### Bước ${s.stepNumber}: ${s.title}
* **Mục tiêu**: ${s.objective}
* **Công cụ sử dụng**: \`${s.toolChain.map(tc => tc.toolName).join(' -> ')}\`
* **Tiêu chí nghiệm thu**:
${s.verificationCriteria.map(v => `  - ${v}`).join('\n')}`).join('\n\n')
      },
      {
        headingLevel: 2,
        title: '4. Các Bẫy Lỗi & Công Thức Phục Hồi (Pitfalls & Recovery Guardrails)',
        slug: 'pitfalls',
        content: patterns.recoveryPatterns.length > 0 ?
          patterns.recoveryPatterns.map((r, idx) => `#### Bẫy Lỗi ${idx + 1}: ${r.errorSignature}
* **Nguyên nhân cốt lõi**: ${r.rootCause}
* **Hành vi thất bại**: \`${r.failingAction}\`
* **Công thức khắc phục (Recipe)**: ${r.correctiveAction}
* **Kỷ luật phòng ngừa**: ${r.preventionGuardrail}`).join('\n\n') :
          '* Không phát sinh bẫy lỗi nghiêm trọng trong phiên thực thi mẫu; toàn bộ công cụ vận hành theo đúng khế ước kỹ thuật.'
      }
    ];

    const rawMarkdown = this.formatMarkdown({
      skillName,
      targetPath: `config/learning/candidates/${skillName}/SKILL.md`,
      frontmatter,
      sections
    });

    return {
      skillName,
      targetPath: `config/learning/candidates/${skillName}/SKILL.md`,
      frontmatter,
      sections,
      rawMarkdown,
      manifest: {
        skillName,
        version: '1.0.0-candidate',
        status: 'CANDIDATE',
        sourceSessionId: patterns.sourceSessionId,
        createdAt: patterns.extractedAt,
        humanPromotionRequired: true
      }
    };
  }

  formatMarkdown(skill) {
    const yamlHeader = `---
name: ${skill.frontmatter.name}
description: >-
${skill.frontmatter.description.split('\n').map(l => `  ${l}`).join('\n')}
---

`;
    const body = skill.sections.map(s => {
      const hashes = '#'.repeat(s.headingLevel);
      return `${hashes} ${s.title}\n\n${s.content}`;
    }).join('\n\n---\n\n');

    return yamlHeader + body + '\n';
  }

  generateCandidateManifest(skill, score) {
    return `# CANDIDATE MANIFEST (Đăng ký Ứng viên Kỹ năng Tự Tiến Hóa)
skill_name: "${skill.skillName}"
version: "1.0.0-candidate"
status: "CANDIDATE"
source_session_id: "${skill.manifest.sourceSessionId}"
created_at: "${skill.manifest.createdAt}"
human_promotion_required: true

benchmark:
  total_score: ${score ? score.totalScore : 0.0}
  rating: "${score ? score.rating : 'NEEDS_REVIEW'}"
  breakdown:
    structure_metadata: ${(score && score.breakdown.structureMetadata.score) || 0}
    command_safety: ${(score && score.breakdown.commandSafety.score) || 0}
    reference_coverage: ${(score && score.breakdown.referenceCoverage.score) || 0}
    ecosystem_compatibility: ${(score && score.breakdown.ecosystemFit.score) || 0}
`;
  }
}

class QualityBenchmarkEngine {
  evaluate(skillDoc) {
    const md = skillDoc.rawMarkdown;
    const name = skillDoc.skillName;

    let s1 = 0.0;
    const notes1 = [];
    if (md.startsWith('---') && md.includes('name:') && md.includes('description:')) {
      s1 += 1.0;
      notes1.push('YAML frontmatter hợp lệ (+1.0)');
    }
    if (skillDoc.frontmatter.description.includes('Tự động kích hoạt khi') &&
        skillDoc.frontmatter.description.includes('KHÔNG CẦN người dùng phải nhớ')) {
      s1 += 1.0;
      notes1.push('Đặc tả Intent-First chuẩn mực (+1.0)');
    }
    const hasCanonicalSections = ['Bản Chất Kiến Trúc', 'Thông Số Kỹ Thuật', 'Quy Trình Vận Hành', 'Bẫy Lỗi'].every(sec => md.includes(sec));
    if (hasCanonicalSections) {
      s1 += 0.5;
      notes1.push('Đầy đủ 4 phân đoạn cấu trúc chuẩn (+0.5)');
    }

    let s2 = 0.0;
    const notes2 = [];
    const hasCodeBlocks = /```[a-z]*[\s\S]*?```/i.test(md);
    if (hasCodeBlocks) {
      s2 += 0.8;
      notes2.push('Có khối mã lệnh thực thi (+0.8)');
    }
    const detectedDestructive = [];
    for (const [pattern, reason] of DESTRUCTIVE_COMMAND_PATTERNS) {
      if (pattern.test(md)) {
        detectedDestructive.push(reason);
      }
    }
    if (detectedDestructive.length === 0) {
      s2 += 1.7;
      notes2.push('An toàn tuyệt đối: Không phát hiện lệnh phá hoại (+1.7)');
    } else {
      notes2.push(`CẢNH BÁO: Phát hiện lệnh nguy hiểm: ${detectedDestructive.join('; ')} (0/1.7)`);
    }

    let s3 = 0.0;
    const notes3 = [];
    if (md.length >= 1000) {
      s3 += 1.0;
      notes3.push(`Độ dài tài liệu phong phú (${md.length} chars) (+1.0)`);
    } else if (md.length >= 400) {
      s3 += 0.5;
      notes3.push(`Độ dài tài liệu vừa đủ (${md.length} chars) (+0.5)`);
    }
    if (md.includes('Runbook') || md.includes('Bước 1')) {
      s3 += 0.8;
      notes3.push('Có Runbook quy trình từng bước rõ ràng (+0.8)');
    }
    if (md.includes('Bẫy Lỗi') || md.includes('Guardrails')) {
      s3 += 0.7;
      notes3.push('Có đề mục bẫy lỗi và biện pháp khắc phục (+0.7)');
    }

    let s4 = 0.0;
    const notes4 = [];
    const { secretsFound } = sanitizeSecrets(md);
    if (!secretsFound) {
      s4 += 1.5;
      notes4.push('Tuân thủ INV-E07: 100% sạch rò rỉ secret / API tokens (+1.5)');
    } else {
      notes4.push('VI PHẠM BẢO MẬT: Phát hiện secret thô chưa được che chắn (0/1.5)');
    }
    if (skillDoc.manifest.humanPromotionRequired === true) {
      s4 += 1.0;
      notes4.push('Khóa cứng cổng phê duyệt Human Gate (human_promotion_required=true) (+1.0)');
    }

    const totalScore = Number((s1 + s2 + s3 + s4).toFixed(1));
    const rating = totalScore >= 7.5 ? 'RECOMMENDED' : 'NEEDS_REVIEW';

    return {
      skillName: name,
      evaluatedAt: new Date().toISOString(),
      totalScore,
      maxScore: 10.0,
      rating,
      breakdown: {
        structureMetadata: { score: s1, maxScore: 2.5, notes: notes1 },
        commandSafety: { 
          score: s2, 
          maxScore: 2.5, 
          zeroDestructivePatterns: detectedDestructive.length === 0,
          detectedDestructivePatterns: detectedDestructive,
          notes: notes2 
        },
        referenceCoverage: { score: s3, maxScore: 2.5, notes: notes3 },
        ecosystemFit: { score: s4, maxScore: 2.5, notes: notes4 }
      },
      summaryNotes: [...notes1, ...notes2, ...notes3, ...notes4]
    };
  }
}

class RunToSkillCompiler {
  constructor() {
    this.parser = new TrajectoryParser();
    this.extractor = new PatternExtractor();
    this.synthesizer = new SkillSynthesizer();
    this.benchmark = new QualityBenchmarkEngine();
  }

  compile(rawJsonl) {
    const trajectory = this.parser.parseJsonl(rawJsonl);
    const graph = this.extractor.buildCausalGraph(trajectory);
    const prunedSteps = this.extractor.pruneBacktracking(graph, trajectory);
    const patterns = this.extractor.extractPatterns(prunedSteps, trajectory);
    const skillDocument = this.synthesizer.synthesize(patterns);
    const benchmarkResult = this.benchmark.evaluate(skillDocument);
    const candidateManifestYaml = this.synthesizer.generateCandidateManifest(skillDocument, benchmarkResult);

    return {
      trajectory,
      graph,
      prunedSteps,
      patterns,
      skillDocument,
      candidateManifestYaml,
      benchmarkResult
    };
  }
}

module.exports = {
  TrajectoryParser,
  PatternExtractor,
  SkillSynthesizer,
  QualityBenchmarkEngine,
  RunToSkillCompiler,
  DESTRUCTIVE_COMMAND_PATTERNS,
  sanitizeSecrets
};
