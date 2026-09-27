/**
 * ============================================================================
 * UNIT TEST SUITE: AUTONOMOUS SKILL INGESTION PIPELINE (POD 2)
 * ============================================================================
 * Module: core/evolution/AutoSkillIngestionPipeline.test.js
 * Runner: Node.js standard assertion runner (Zero-dependency)
 * Governance: Khối 5 (Quản trị Tri thức & Tự học Doanh nghiệp)
 * Lead Architect: Anh (Product Owner) | Senior Engineering Agent: Pod 2 Lead
 * ============================================================================
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const os = require('os');
const {
  AutoSkillIngestionPipeline,
  TrajectoryScanner,
  DEFAULT_INGESTION_CONFIG
} = require('./AutoSkillIngestionPipeline.js');

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
console.log('   RUNNING UNIT TESTS: AutoSkillIngestionPipeline (Pod 2 Round 2)');
console.log('════════════════════════════════════════════════════════════════');

// Sandbox test directories
const testBaseDir = path.join(os.tmpdir(), `antigravity_test_pod2_${Date.now()}`);
const testSkillsDir = path.join(testBaseDir, 'skills');
const testCandidatesDir = path.join(testBaseDir, 'candidates');
const testRegistryFile = path.join(testBaseDir, 'skills_registry.json');
const testBrainDir = path.join(testBaseDir, 'brain');

function setupSandbox() {
  if (fs.existsSync(testBaseDir)) {
    fs.rmSync(testBaseDir, { recursive: true, force: true });
  }
  fs.mkdirSync(testSkillsDir, { recursive: true });
  fs.mkdirSync(testCandidatesDir, { recursive: true });
  fs.mkdirSync(testBrainDir, { recursive: true });
}

function teardownSandbox() {
  try {
    if (fs.existsSync(testBaseDir)) {
      fs.rmSync(testBaseDir, { recursive: true, force: true });
    }
  } catch (e) {
    // Ignore cleanup errors on Windows
  }
}

setupSandbox();

// Fixture 1: Standard clean trajectory with dead-ends and recovery
const standardCleanTranscriptJsonl = [
  JSON.stringify({
    step_index: 0,
    session_id: "session-arch-pg-01",
    source: "USER_EXPLICIT",
    type: "USER_INPUT",
    created_at: "2026-09-27T01:00:00Z",
    content: "<USER_REQUEST>Triển khai PostgreSQL Connection Pooling với PgBouncer và chứng chỉ mTLS</USER_REQUEST>"
  }),
  // Step 1: Execution error (Dead-End)
  JSON.stringify({
    step_index: 1,
    source: "MODEL",
    type: "PLANNER_RESPONSE",
    created_at: "2026-09-27T01:00:05Z",
    tool_calls: [{
      name: "run_command",
      args: {
        CommandLine: "pgbouncer -d /etc/pgbouncer/pgbouncer.ini",
        Cwd: "c:/Users/game/.gemini",
        toolAction: "Khởi động PgBouncer daemon",
        toolSummary: "Start PgBouncer"
      }
    }],
    tool_results: [{
      name: "run_command",
      is_error: true,
      error: "FATAL: server_tls_sslmode requires server_tls_ca_file"
    }]
  }),
  // Step 2: Superseded invalid config (Dead-End)
  JSON.stringify({
    step_index: 2,
    source: "MODEL",
    type: "PLANNER_RESPONSE",
    created_at: "2026-09-27T01:00:10Z",
    tool_calls: [{
      name: "write_to_file",
      args: {
        TargetFile: "c:/Users/game/.gemini/pgbouncer.ini",
        CodeContent: "[databases]\n* = host=127.0.0.1 port=5432",
        Description: "Draft config lacking TLS"
      }
    }],
    status: "ERROR",
    content: "Encountered error: File cấu hình thiếu tham số TLS."
  }),
  // Step 3: Verified Correct File with credentials to test sanitization (Winning Branch)
  JSON.stringify({
    step_index: 3,
    source: "MODEL",
    type: "PLANNER_RESPONSE",
    created_at: "2026-09-27T01:00:15Z",
    tool_calls: [{
      name: "write_to_file",
      args: {
        TargetFile: "c:/Users/game/.gemini/pgbouncer.ini",
        CodeContent: "[databases]\n* = host=127.0.0.1 port=5432 auth_user=postgres\n[pgbouncer]\nlisten_port = 6432\nlisten_addr = 127.0.0.1\nauth_type = scram-sha-256\nserver_tls_sslmode = verify-full\nserver_tls_ca_file = /etc/ssl/pg_ca.crt\napi_key: \"sk-pgbouncersecretkey1234567890\"\nBearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.secretpayload",
        Description: "Cấu hình chuẩn PgBouncer Connection Pool kèm mTLS"
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
    created_at: "2026-09-27T01:00:20Z",
    tool_calls: [{
      name: "run_command",
      args: {
        CommandLine: "psql -p 6432 -U postgres -h 127.0.0.1 -c 'SHOW POOLS;'",
        Cwd: "c:/Users/game/.gemini",
        toolAction: "Kiểm tra danh sách Connection Pools",
        toolSummary: "Verify connection pooling"
      }
    }],
    tool_results: [{
      name: "run_command",
      is_error: false,
      content: "database | user | cl_active | cl_waiting | sv_active"
    }]
  })
].join('\n');

// Fixture 2: Malicious destructive command trajectory
const maliciousTranscriptJsonl = [
  JSON.stringify({
    step_index: 0,
    session_id: "session-malicious-01",
    source: "USER_EXPLICIT",
    type: "USER_INPUT",
    created_at: "2026-09-27T02:00:00Z",
    content: "<USER_REQUEST>Xóa dọn dẹp hệ thống ổ đĩa</USER_REQUEST>"
  }),
  JSON.stringify({
    step_index: 1,
    source: "MODEL",
    type: "PLANNER_RESPONSE",
    created_at: "2026-09-27T02:00:05Z",
    tool_calls: [{
      name: "run_command",
      args: {
        CommandLine: "rm -rf /*",
        Cwd: "c:/Users/game/.gemini",
        toolAction: "Xóa sạch toàn bộ hệ điều hành",
        toolSummary: "Nuke drive"
      }
    }],
    tool_results: [{
      name: "run_command",
      is_error: false,
      content: "Done"
    }]
  })
].join('\n');

// TEST 1
runTest('AutoSkillIngestionPipeline: Khởi tạo thành công với cấu hình an toàn mặc định', () => {
  const pipeline = new AutoSkillIngestionPipeline({
    skillsDirectory: testSkillsDir,
    candidatesDirectory: testCandidatesDir,
    registryFilePath: testRegistryFile
  });

  const cfg = pipeline.getConfig();
  assert.strictEqual(cfg.skillsDirectory, testSkillsDir);
  assert.strictEqual(cfg.candidatesDirectory, testCandidatesDir);
  assert.strictEqual(cfg.registryFilePath, testRegistryFile);
  assert.strictEqual(cfg.minBenchmarkScore, 7.5);
  assert.strictEqual(cfg.allowAutoPromotion, true);
  assert.strictEqual(cfg.dryRun, false);
});

// TEST 2
runTest('TrajectoryScanner: Quét và phát hiện các file transcript.jsonl trong cấu trúc thư mục', () => {
  const sessionDir = path.join(testBrainDir, 'sess_abc', '.system_generated', 'logs');
  fs.mkdirSync(sessionDir, { recursive: true });
  const sampleTranscriptPath = path.join(sessionDir, 'transcript.jsonl');
  fs.writeFileSync(sampleTranscriptPath, standardCleanTranscriptJsonl, 'utf-8');

  const scanner = new TrajectoryScanner();
  const discovered = scanner.scanDirectory(testBrainDir, 5);

  assert.ok(discovered.length >= 1, 'Phải tìm thấy ít nhất 1 file transcript.jsonl');
  assert.ok(discovered.some(f => f.includes('transcript.jsonl')), 'Đường dẫn phải chứa transcript.jsonl');
});

// TEST 3
runTest('Dead-End Pruning: Loại bỏ chính xác các bước lỗi execution error và file mutation lỗi', () => {
  const pipeline = new AutoSkillIngestionPipeline({
    skillsDirectory: testSkillsDir,
    candidatesDirectory: testCandidatesDir,
    registryFilePath: testRegistryFile,
    dryRun: true
  });

  const result = pipeline.ingestFromRawJsonl(standardCleanTranscriptJsonl);
  assert.strictEqual(result.pruningMetrics.totalRawSteps, 5, 'Tổng số bước thô là 5');
  assert.ok(result.pruningMetrics.prunedDeadEnds >= 2, 'Phải prune ít nhất 2 bước dead-end (step 1 & step 2)');
  assert.ok(result.pruningMetrics.winningStepsCount <= 3, 'Các bước chiến thắng chỉ giữ lại bước hợp lệ');
  assert.ok(result.pruningMetrics.compressionRatio > 0, 'Tỷ lệ nén nhiễu phải lớn hơn 0%');
});

// TEST 4
runTest('Intent-First Synthesis: Sinh tài liệu SKILL.md đúng chuẩn YAML frontmatter', () => {
  const pipeline = new AutoSkillIngestionPipeline({
    skillsDirectory: testSkillsDir,
    candidatesDirectory: testCandidatesDir,
    registryFilePath: testRegistryFile,
    dryRun: true
  });

  const result = pipeline.ingestFromRawJsonl(standardCleanTranscriptJsonl);
  assert.ok(result.skillName.startsWith('skill-'), 'Tên kỹ năng phải theo chuẩn skill-*');
  assert.ok(result.manifest.skillName, 'Manifest phải chứa skillName');
  assert.ok(result.benchmarkResult.totalScore >= 7.5, 'Điểm đánh giá phải đạt >= 7.5');
});

// TEST 5
runTest('Canonical Sections: SKILL.md chứa đầy đủ 4 phân đoạn cấu trúc chuẩn mực', () => {
  const pipeline = new AutoSkillIngestionPipeline({
    skillsDirectory: testSkillsDir,
    candidatesDirectory: testCandidatesDir,
    registryFilePath: testRegistryFile
  });

  const result = pipeline.ingestFromRawJsonl(standardCleanTranscriptJsonl);
  assert.strictEqual(result.status, 'PROMOTED', 'Kỹ năng chất lượng cao phải được PROMOTED');
  assert.ok(result.skillPath, 'Phải có đường dẫn file skill');

  const content = fs.readFileSync(result.skillPath, 'utf-8');
  assert.ok(content.includes('1. Bản Chất Kiến Trúc'), 'Phải có Section 1');
  assert.ok(content.includes('2. Thông Số Kỹ Thuật'), 'Phải có Section 2');
  assert.ok(content.includes('3. Quy Trình Vận Hành'), 'Phải có Section 3');
  assert.ok(content.includes('4. Các Bẫy Lỗi'), 'Phải có Section 4');
});

// TEST 6
runTest('Security Gate (INV-E07): Làm sạch toàn diện secret keys, Bearer tokens và credential', () => {
  const pipeline = new AutoSkillIngestionPipeline({
    skillsDirectory: testSkillsDir,
    candidatesDirectory: testCandidatesDir,
    registryFilePath: testRegistryFile
  });

  const result = pipeline.ingestFromRawJsonl(standardCleanTranscriptJsonl);
  const content = fs.readFileSync(result.skillPath, 'utf-8');

  assert.ok(!content.includes('sk-pgbouncersecretkey1234567890'), 'Secret key raw phải bị xóa bỏ hoàn toàn');
  assert.ok(!content.includes('secretpayload'), 'Bearer token raw phải bị che chắn');
  assert.ok(content.includes('[REDACTED_SECRET_KEY]') || content.includes('[REDACTED_BEARER_TOKEN]'), 'Phải có placeholder bảo mật REDACTED');
});

// TEST 7
runTest('Safety Gate (INV-SE02): Từ chối nạp kỹ năng khi phát hiện lệnh phá hoại nguy hiểm', () => {
  const pipeline = new AutoSkillIngestionPipeline({
    skillsDirectory: testSkillsDir,
    candidatesDirectory: testCandidatesDir,
    registryFilePath: testRegistryFile
  });

  const result = pipeline.ingestFromRawJsonl(maliciousTranscriptJsonl);
  assert.strictEqual(result.status, 'REJECTED', 'Phải từ chối ngay lập tức kỹ năng có lệnh phá hoại');
  assert.ok(result.rejectionReason.includes('INV-SE02'), 'Lý do từ chối phải viện dẫn INV-SE02');
  assert.ok(result.rejectionReason.includes('rm -rf'), 'Phải chỉ rõ lệnh nguy hiểm');
});

// TEST 8
runTest('Benchmark Threshold: Tự động gắn nhãn CANDIDATE_ONLY nếu allowAutoPromotion = false', () => {
  const pipeline = new AutoSkillIngestionPipeline({
    skillsDirectory: testSkillsDir,
    candidatesDirectory: testCandidatesDir,
    registryFilePath: testRegistryFile,
    allowAutoPromotion: false
  });

  const result = pipeline.ingestFromRawJsonl(standardCleanTranscriptJsonl);
  assert.strictEqual(result.status, 'CANDIDATE_ONLY', 'Khi tắt auto promotion, kỹ năng phải lưu dạng CANDIDATE_ONLY');
  assert.ok(result.candidatePath, 'Phải có candidatePath');
  assert.ok(fs.existsSync(result.candidatePath), 'Tệp ứng viên phải tồn tại trên ổ đĩa');
});

// TEST 9
runTest('Dry-Run Mode: Hoạt động mô phỏng an toàn, không ghi file vào filesystem', () => {
  const dryRunSkillsDir = path.join(testBaseDir, 'dryrun_skills');
  const pipeline = new AutoSkillIngestionPipeline({
    skillsDirectory: dryRunSkillsDir,
    candidatesDirectory: testCandidatesDir,
    registryFilePath: testRegistryFile,
    dryRun: true
  });

  const result = pipeline.ingestFromRawJsonl(standardCleanTranscriptJsonl);
  assert.strictEqual(result.status, 'DRY_RUN');
  assert.strictEqual(fs.existsSync(dryRunSkillsDir), false, 'Thư mục dryrun không được tạo trên ổ cứng');
});

// TEST 10
runTest('Autonomous Registration: Ghi file SKILL.md, manifest.json và cập nhật danh bạ skills_registry.json', () => {
  const pipeline = new AutoSkillIngestionPipeline({
    skillsDirectory: testSkillsDir,
    candidatesDirectory: testCandidatesDir,
    registryFilePath: testRegistryFile
  });

  const result = pipeline.ingestFromRawJsonl(standardCleanTranscriptJsonl);
  assert.strictEqual(result.status, 'PROMOTED');

  // Verify SKILL.md exists
  assert.ok(fs.existsSync(result.skillPath), 'SKILL.md phải tồn tại');

  // Verify manifest.json exists
  const manifestPath = path.join(path.dirname(result.skillPath), 'manifest.json');
  assert.ok(fs.existsSync(manifestPath), 'manifest.json phải tồn tại');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
  assert.strictEqual(manifest.status, 'ACTIVE');

  // Verify Registry updated
  const registry = pipeline.getRegistry();
  assert.ok(registry.skills[result.skillName], 'Skill phải được đăng ký trong skills_registry.json');
  assert.strictEqual(registry.skills[result.skillName].status, 'ACTIVE');
});

// TEST 11
runTest('Integrity Verification: Hàm verifySkillIntegrity kiểm tra hợp lệ file SKILL.md sau khi ghi', () => {
  const pipeline = new AutoSkillIngestionPipeline({
    skillsDirectory: testSkillsDir,
    candidatesDirectory: testCandidatesDir,
    registryFilePath: testRegistryFile
  });

  const result = pipeline.ingestFromRawJsonl(standardCleanTranscriptJsonl);
  const check = pipeline.verifySkillIntegrity(result.skillPath);

  assert.strictEqual(check.isValid, true, 'SKILL.md sản xuất phải vượt qua kiểm tra toàn vẹn');
  assert.strictEqual(check.errors.length, 0, 'Không được có lỗi toàn vẹn');
});

// TEST 12
runTest('Integrity Rejection: verifySkillIntegrity phát hiện và báo lỗi khi file thiếu section chuẩn', () => {
  const pipeline = new AutoSkillIngestionPipeline({
    skillsDirectory: testSkillsDir,
    candidatesDirectory: testCandidatesDir,
    registryFilePath: testRegistryFile
  });

  const corruptSkillPath = path.join(testSkillsDir, 'corrupt_skill', 'SKILL.md');
  fs.mkdirSync(path.dirname(corruptSkillPath), { recursive: true });
  fs.writeFileSync(corruptSkillPath, 'Tập tin này không có YAML frontmatter và thiếu mọi section.', 'utf-8');

  const check = pipeline.verifySkillIntegrity(corruptSkillPath);
  assert.strictEqual(check.isValid, false, 'File hỏng phải bị báo không hợp lệ');
  assert.ok(check.errors.length >= 3, 'Phải liệt kê các lỗi thiếu frontmatter và sections');
});

// TEST 13
runTest('Rollback Mechanism: Hoàn tác tệp và danh bạ an toàn khi kích hoạt rollbackSkill', () => {
  const rollbackSkillsDir = path.join(testBaseDir, 'rollback_test_skills');
  const pipeline = new AutoSkillIngestionPipeline({
    skillsDirectory: rollbackSkillsDir,
    candidatesDirectory: testCandidatesDir,
    registryFilePath: testRegistryFile
  });

  const result = pipeline.ingestFromRawJsonl(standardCleanTranscriptJsonl);
  assert.ok(fs.existsSync(result.skillPath));

  const rolledBack = pipeline.rollbackSkill(result.skillName, rollbackSkillsDir, { purgeFolder: true });
  assert.strictEqual(rolledBack, true, 'Rollback phải trả về true');

  // Skill folder should be removed
  assert.strictEqual(fs.existsSync(path.dirname(result.skillPath)), false, 'Thư mục skill phải được dọn dẹp');

  // Registry entry should be removed
  const registry = pipeline.getRegistry();
  assert.strictEqual(registry.skills[result.skillName], undefined, 'Entry phải bị gỡ khỏi registry');
});

// TEST 14
runTest('Batch Scanning & Ingestion: Quét thư mục và xử lý hàng loạt nhiều transcript thành công', () => {
  const batchSandbox = path.join(testBaseDir, 'batch_run');
  const t1 = path.join(batchSandbox, 'sess_1', 'transcript.jsonl');
  const t2 = path.join(batchSandbox, 'sess_2', 'transcript.jsonl');
  fs.mkdirSync(path.dirname(t1), { recursive: true });
  fs.mkdirSync(path.dirname(t2), { recursive: true });
  fs.writeFileSync(t1, standardCleanTranscriptJsonl, 'utf-8');
  fs.writeFileSync(t2, standardCleanTranscriptJsonl, 'utf-8');

  const pipeline = new AutoSkillIngestionPipeline({
    skillsDirectory: testSkillsDir,
    candidatesDirectory: testCandidatesDir,
    registryFilePath: testRegistryFile
  });

  const batchResult = pipeline.scanAndIngestBatch(batchSandbox);
  assert.strictEqual(batchResult.totalProcessed, 2, 'Phải xử lý đủ 2 file transcript');
  assert.strictEqual(batchResult.successCount, 2, 'Cả 2 file phải thành công');
  assert.ok(batchResult.durationMs >= 0, 'Phải đo lường thời gian thực thi ms');
});

// Clean up sandbox
teardownSandbox();

console.log('────────────────────────────────────────────────────────────────');
console.log(`KẾT QUẢ KIỂM THỬ: ${passCount} PASSED, ${failCount} FAILED.`);
console.log('════════════════════════════════════════════════════════════════');

if (failCount > 0) {
  process.exit(1);
}
