/**
 * ============================================================================
 * UNIT TEST SUITE: RUN-TO-SKILL COMPILER
 * ============================================================================
 * Module: core/evolution/RunToSkillCompiler.test.js
 * Runner: Node.js standard assertion runner (Zero-dependency)
 * ============================================================================
 */

const assert = require('assert');
const path = require('path');
const {
  TrajectoryParser,
  PatternExtractor,
  SkillSynthesizer,
  QualityBenchmarkEngine,
  RunToSkillCompiler,
  DESTRUCTIVE_COMMAND_PATTERNS,
  sanitizeSecrets
} = require('./RunToSkillCompiler.js');

let passCount = 0;
let failCount = 0;

function runTest(testName, fn) {
  try {
    fn();
    console.log(`  [PASS] ${testName}`);
    passCount++;
  } catch (err) {
    console.error(`  [FAIL] ${testName}: ${err.message}`);
    failCount++;
  }
}

console.log('════════════════════════════════════════════════════════════════');
console.log('   RUNNING UNIT TESTS: RunToSkillCompiler (Pod 2 Production)');
console.log('════════════════════════════════════════════════════════════════');

// Fixture: sample JSONL transcript with dead-ends and recovery
const sampleJsonl = [
  JSON.stringify({
    step_index: 0,
    source: "USER_EXPLICIT",
    type: "USER_INPUT",
    created_at: "2026-09-26T04:00:00Z",
    content: "<USER_REQUEST>Cấu hình Redis Cache bảo mật với TLS và ACL user trên port 6380</USER_REQUEST>"
  }),
  // Step 1: Failed CLI attempt (Dead-End)
  JSON.stringify({
    step_index: 1,
    source: "MODEL",
    type: "PLANNER_RESPONSE",
    created_at: "2026-09-26T04:00:05Z",
    tool_calls: [{
      name: "run_command",
      args: {
        CommandLine: "redis-server --tls-port 6380 --port 0",
        Cwd: "c:/Users/game/.gemini",
        toolAction: "Khởi động Redis TLS",
        toolSummary: "Start Redis server"
      }
    }],
    tool_results: [{
      name: "run_command",
      is_error: true,
      error: "Fatal error: TLS enabled but tls-cert-file not specified"
    }]
  }),
  // Step 2: Failed draft file (Dead-End)
  JSON.stringify({
    step_index: 2,
    source: "MODEL",
    type: "PLANNER_RESPONSE",
    created_at: "2026-09-26T04:00:10Z",
    tool_calls: [{
      name: "write_to_file",
      args: {
        TargetFile: "c:/Users/game/.gemini/redis.conf",
        CodeContent: "port 6380\ntls-port 0",
        Description: "Draft redis config (invalid)"
      }
    }],
    status: "ERROR",
    content: "Encountered error: File cấu hình thiếu chứng chỉ TLS hợp lệ."
  }),
  // Step 3: Verified Correct File (Winning Branch)
  JSON.stringify({
    step_index: 3,
    source: "MODEL",
    type: "PLANNER_RESPONSE",
    created_at: "2026-09-26T04:00:15Z",
    tool_calls: [{
      name: "write_to_file",
      args: {
        TargetFile: "c:/Users/game/.gemini/redis.conf",
        CodeContent: "port 0\ntls-port 6380\ntls-cert-file /etc/ssl/redis.crt\ntls-key-file /etc/ssl/redis.key\nuser default on >SecretPass123! ~* +@all",
        Description: "Cấu hình chuẩn Redis TLS 6380 kèm ACL"
      }
    }],
    tool_results: [{
      name: "write_to_file",
      is_error: false,
      content: "File written successfully."
    }]
  }),
  // Step 4: Validated CLI verification (Winning Branch)
  JSON.stringify({
    step_index: 4,
    source: "MODEL",
    type: "PLANNER_RESPONSE",
    created_at: "2026-09-26T04:00:20Z",
    tool_calls: [{
      name: "run_command",
      args: {
        CommandLine: "redis-cli -p 6380 --tls --cacert /etc/ssl/ca.crt ping",
        Cwd: "c:/Users/game/.gemini",
        toolAction: "Kiểm tra kết nối Redis TLS",
        toolSummary: "Ping verification"
      }
    }],
    tool_results: [{
      name: "run_command",
      is_error: false,
      content: "PONG"
    }]
  })
].join('\n');

// TEST 1
runTest('TrajectoryParser: Phân giải chính xác số steps từ JSONL', () => {
  const parser = new TrajectoryParser();
  const trajectory = parser.parseJsonl(sampleJsonl);
  assert.strictEqual(trajectory.totalSteps, 5, 'Phải bóc tách đủ 5 steps');
  assert.ok(trajectory.userGoal.includes('Redis Cache bảo mật'), 'Phải trích xuất đúng userGoal');
});

// TEST 2
runTest('TrajectoryParser: Trích xuất đúng toolCalls và toolResults', () => {
  const parser = new TrajectoryParser();
  const trajectory = parser.parseJsonl(sampleJsonl);
  const step1 = trajectory.steps[1];
  assert.strictEqual(step1.toolCalls.length, 1);
  assert.strictEqual(step1.toolCalls[0].name, 'run_command');
  assert.strictEqual(step1.toolResults[0].status, 'ERROR');
});

// TEST 3
runTest('PatternExtractor: Nhận diện chính xác Dead-Ends và nhánh Thắng cuộc', () => {
  const parser = new TrajectoryParser();
  const trajectory = parser.parseJsonl(sampleJsonl);
  const extractor = new PatternExtractor();
  const graph = extractor.buildCausalGraph(trajectory);

  assert.ok(graph.prunedIndices.includes(1), 'Step 1 phải bị gán nhãn Dead-End do lỗi lệnh');
  assert.ok(graph.prunedIndices.includes(2), 'Step 2 phải bị gán nhãn Dead-End do lỗi cấu hình');
  assert.ok(graph.winningBranchIndices.includes(3), 'Step 3 phải thuộc Winning Branch');
  assert.ok(graph.winningBranchIndices.includes(4), 'Step 4 phải thuộc Winning Branch');
});

// TEST 4
runTest('PatternExtractor: pruneBacktracking loại bỏ các steps thất bại', () => {
  const parser = new TrajectoryParser();
  const trajectory = parser.parseJsonl(sampleJsonl);
  const extractor = new PatternExtractor();
  const graph = extractor.buildCausalGraph(trajectory);
  const winningSteps = extractor.pruneBacktracking(graph, trajectory);

  assert.strictEqual(winningSteps.length, 3, 'Chỉ còn 3 steps hợp lệ (User Goal + Step 3 + Step 4)');
  assert.ok(!winningSteps.some(s => s.stepIndex === 1 || s.stepIndex === 2));
});

// TEST 5
runTest('PatternExtractor: Trích xuất ErrorRecoveryPattern từ Dead-End', () => {
  const parser = new TrajectoryParser();
  const trajectory = parser.parseJsonl(sampleJsonl);
  const extractor = new PatternExtractor();
  const graph = extractor.buildCausalGraph(trajectory);
  const winningSteps = extractor.pruneBacktracking(graph, trajectory);
  const patterns = extractor.extractPatterns(winningSteps, trajectory);

  assert.ok(patterns.recoveryPatterns.length >= 1, 'Phải có ít nhất 1 Recovery Recipe');
  assert.ok(patterns.recoveryPatterns[0].errorSignature.includes('TLS enabled but tls-cert-file not specified') ||
            patterns.recoveryPatterns[0].rootCause.length > 0);
});

// TEST 6
runTest('PatternExtractor: Trích xuất mã nguồn mẫu và verifiedCommands', () => {
  const parser = new TrajectoryParser();
  const trajectory = parser.parseJsonl(sampleJsonl);
  const extractor = new PatternExtractor();
  const graph = extractor.buildCausalGraph(trajectory);
  const winningSteps = extractor.pruneBacktracking(graph, trajectory);
  const patterns = extractor.extractPatterns(winningSteps, trajectory);

  assert.ok(patterns.reusableCodeSnippets.length >= 1, 'Phải trích xuất file redis.conf');
  assert.strictEqual(patterns.reusableCodeSnippets[0].filename, 'redis.conf');
  assert.ok(patterns.provenance.compressionRatio > 0, 'Tỷ lệ nén rác phải dương');
});

// TEST 7
runTest('SkillSynthesizer: Sinh định dạng YAML Frontmatter đạt chuẩn Intent-First', () => {
  const parser = new TrajectoryParser();
  const trajectory = parser.parseJsonl(sampleJsonl);
  const extractor = new PatternExtractor();
  const graph = extractor.buildCausalGraph(trajectory);
  const winningSteps = extractor.pruneBacktracking(graph, trajectory);
  const patterns = extractor.extractPatterns(winningSteps, trajectory);
  const synthesizer = new SkillSynthesizer();
  const skillDoc = synthesizer.synthesize(patterns);

  assert.ok(skillDoc.frontmatter.name.startsWith('skill-'), 'Tên kỹ năng phải có tiền tố');
  assert.ok(skillDoc.frontmatter.description.includes('Tự động kích hoạt khi'));
  assert.ok(skillDoc.frontmatter.description.includes('KHÔNG CẦN người dùng phải nhớ'));
});

// TEST 8
runTest('SkillSynthesizer: Đầy đủ 4 phân đoạn cấu trúc tài liệu', () => {
  const parser = new TrajectoryParser();
  const trajectory = parser.parseJsonl(sampleJsonl);
  const extractor = new PatternExtractor();
  const graph = extractor.buildCausalGraph(trajectory);
  const winningSteps = extractor.pruneBacktracking(graph, trajectory);
  const patterns = extractor.extractPatterns(winningSteps, trajectory);
  const synthesizer = new SkillSynthesizer();
  const skillDoc = synthesizer.synthesize(patterns);

  const md = skillDoc.rawMarkdown;
  assert.ok(md.includes('1. Bản Chất Kiến Trúc & Giá Trị Cốt Lõi'));
  assert.ok(md.includes('2. Thông Số Kỹ Thuật & Cú Pháp Lệnh Đã Kiểm Chứng'));
  assert.ok(md.includes('3. Quy Trình Vận Hành Chuẩn Mực'));
  assert.ok(md.includes('4. Các Bẫy Lỗi & Công Thức Phục Hồi'));
});

// TEST 9
runTest('QualityBenchmarkEngine: Chấm điểm Structure & Metadata tối đa 2.5', () => {
  const parser = new TrajectoryParser();
  const trajectory = parser.parseJsonl(sampleJsonl);
  const extractor = new PatternExtractor();
  const graph = extractor.buildCausalGraph(trajectory);
  const winningSteps = extractor.pruneBacktracking(graph, trajectory);
  const patterns = extractor.extractPatterns(winningSteps, trajectory);
  const synthesizer = new SkillSynthesizer();
  const skillDoc = synthesizer.synthesize(patterns);
  const benchmark = new QualityBenchmarkEngine();
  const res = benchmark.evaluate(skillDoc);

  assert.strictEqual(res.breakdown.structureMetadata.score, 2.5);
  assert.ok(res.totalScore >= 7.5, 'Tổng điểm phải đạt chuẩn RECOMMENDED');
  assert.strictEqual(res.rating, 'RECOMMENDED');
});

// TEST 10
runTest('QualityBenchmarkEngine: Nhận diện và trừ điểm nếu có lệnh phá hoại', () => {
  const benchmark = new QualityBenchmarkEngine();
  const dummyDoc = {
    skillName: 'test-destructive',
    rawMarkdown: '---\nname: test\ndescription: test\n---\n```bash\nrm -rf /\n```',
    frontmatter: { description: '' },
    manifest: { humanPromotionRequired: true }
  };
  const res = benchmark.evaluate(dummyDoc);
  assert.strictEqual(res.breakdown.commandSafety.zeroDestructivePatterns, false);
});

// TEST 11
runTest('SanitizeSecrets: Làm sạch API keys, Bearer tokens theo INV-E07', () => {
  const leakedText = "auth: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xyz api_key: 'sk-abcdef1234567890abcdef123456'";
  const { cleanText, secretsFound } = sanitizeSecrets(leakedText);
  assert.strictEqual(secretsFound, true);
  assert.ok(cleanText.includes('[REDACTED_BEARER_TOKEN]'));
  assert.ok(cleanText.includes('[REDACTED_API_KEY]'));
});

// TEST 12
runTest('RunToSkillCompiler: Biên dịch End-to-End thành công trọn vẹn', () => {
  const compiler = new RunToSkillCompiler();
  const result = compiler.compile(sampleJsonl);

  assert.ok(result.trajectory);
  assert.ok(result.graph);
  assert.strictEqual(result.prunedSteps.length, 3);
  assert.ok(result.benchmarkResult.totalScore >= 8.5, 'Điểm đạt xuất sắc >= 8.5');
  assert.strictEqual(result.benchmarkResult.rating, 'RECOMMENDED');
  assert.ok(result.candidateManifestYaml.includes('human_promotion_required: true'));
  assert.ok(result.candidateManifestYaml.includes('status: "CANDIDATE"'));
});

console.log('────────────────────────────────────────────────────────────────');
console.log(`KẾT QUẢ KIỂM THỬ: ${passCount} PASSED, ${failCount} FAILED.`);
console.log('════════════════════════════════════════════════════════════════');

if (failCount > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
