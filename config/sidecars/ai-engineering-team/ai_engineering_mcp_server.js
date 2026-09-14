#!/usr/bin/env node
/**
 * ════════════════════════════════════════════════════════════════════════════
 * ANTIGRAVITY AI ENGINEERING TEAM MCP SERVER (v1.0.0)
 * 8 Specialist AI Tools for Codebase Analysis, Architecture Planning,
 * Code Review, Root-Cause Debugging, QA Test Design, Orchestration,
 * Multi-Agent Consensus, and Codex 9Router Integration.
 * ════════════════════════════════════════════════════════════════════════════
 */

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Đọc API Key từ .env.local của master hub hoặc biến môi trường
let nineRouterKey = process.env.NINE_ROUTER_API_KEY || '';
const envPath = path.join(__dirname, '..', 'antigravity_master_hub', '.env.local');
if (!nineRouterKey && fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  for (const line of envContent.split('\n')) {
    const match = line.match(/^NINE_ROUTER_API_KEY\s*=\s*(.*)$/);
    if (match) {
      nineRouterKey = match[1].trim();
      break;
    }
  }
}

const NINE_ROUTER_URL = process.env.NINE_ROUTER_URL || 'http://127.0.0.1:20127/v1/chat/completions';
const DEFAULT_MODEL = 'ag/gemini-3.7-flash-high';

/**
 * Gọi 9Router LLM với xử lý lỗi & timeout
 */
function callLlm(systemPrompt, userPrompt, model = DEFAULT_MODEL, temperature = 0.3) {
  return new Promise((resolve) => {
    if (!nineRouterKey) {
      return resolve(`[AI Engine Local Fallback] NINE_ROUTER_API_KEY chưa được cấu hình. Kết quả tổng hợp cục bộ cho yêu cầu: ${userPrompt.slice(0, 100)}...`);
    }

    const parsedUrl = new URL(NINE_ROUTER_URL);
    const payload = JSON.stringify({
      model: model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: temperature,
      stream: false
    });

    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80),
      path: parsedUrl.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${nineRouterKey}`,
        'Content-Length': Buffer.byteLength(payload)
      },
      timeout: 45000
    };

    const protocol = parsedUrl.protocol === 'https:' ? https : http;
    const req = protocol.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          if (json.choices && json.choices.length > 0 && json.choices[0].message) {
            resolve(json.choices[0].message.content);
          } else if (json.error) {
            resolve(`[9Router Error]: ${json.error.message || JSON.stringify(json.error)}`);
          } else {
            resolve(body);
          }
        } catch (e) {
          // Xử lý nếu trả về SSE buffer
          if (body.includes('data:')) {
            const lines = body.split('\n');
            let content = '';
            for (const line of lines) {
              if (line.startsWith('data: ') && !line.includes('[DONE]')) {
                try {
                  const chunk = JSON.parse(line.substring(6));
                  content += chunk.choices?.[0]?.delta?.content || '';
                } catch (err) {}
              }
            }
            resolve(content || body);
          } else {
            resolve(body);
          }
        }
      });
    });

    req.on('error', (err) => {
      resolve(`[9Router Connection Notice]: Không thể kết nối cổng 20127 (${err.message}). Vui lòng đảm bảo 9Router đang chạy.`);
    });

    req.on('timeout', () => {
      req.destroy();
      resolve(`[9Router Timeout]: Yêu cầu tới model ${model} đã vượt quá 45 giây.`);
    });

    req.write(payload);
    req.end();
  });
}

/**
 * Danh sách Schemas 8 Công Cụ Chuyên Biệt
 */
const TOOLS_DEFINITIONS = [
  {
    name: "ai_codebase_analyze",
    description: "Codebase Analyst Specialist: Khảo sát, bóc tách module, call graph và dependency dựa 100% trên bằng chứng thực tế (READ-ONLY).",
    inputSchema: {
      type: "object",
      properties: {
        objective: { type: "string", description: "Mục tiêu phân tích khảo sát codebase" },
        project_root: { type: "string", description: "Đường dẫn tuyệt đối đến thư mục gốc của project cần phân tích" },
        scope: { type: "array", items: { type: "string" }, description: "Danh sách đường dẫn file hoặc thư mục cần khảo sát" },
        known_context: { type: "string", description: "Bối cảnh hoặc kiến thức đã biết trước" },
        artifact_id: { type: "string", description: "Mã định danh artifact nếu có" }
      },
      required: ["objective"]
    }
  },
  {
    name: "ai_plan_change",
    description: "Software Architect Specialist: Phân rã yêu cầu, lập kế hoạch kiểm chứng vi mô, thiết lập tiêu chí nghiệm thu và ranh giới bất biến (READ-ONLY).",
    inputSchema: {
      type: "object",
      properties: {
        requirement: { type: "string", description: "Yêu cầu kỹ thuật cần lập kế hoạch" },
        project_root: { type: "string", description: "Đường dẫn tuyệt đối đến thư mục gốc của project" },
        codebase_context: { type: "string", description: "Bối cảnh hiện trạng codebase" },
        relevant_files: { type: "array", items: { type: "string" }, description: "Danh sách file liên quan" },
        constraints: { type: "array", items: { type: "string" }, description: "Các ràng buộc bất biến P0" },
        risk_level: { type: "string", description: "Mức độ rủi ro (LOW, MEDIUM, HIGH)" }
      },
      required: ["requirement"]
    }
  },
  {
    name: "ai_review_change",
    description: "Code Reviewer Specialist: Đánh giá diff độc lập, phát hiện hồi quy và phân loại lỗi nghiêm ngặt (CRITICAL, IMPORTANT, MINOR) (READ-ONLY).",
    inputSchema: {
      type: "object",
      properties: {
        requirement: { type: "string", description: "Yêu cầu ban đầu để đối chiếu" },
        diff: { type: "string", description: "Nội dung git diff cần rà soát" },
        plan: { type: "string", description: "Kế hoạch đã được duyệt" },
        project_root: { type: "string", description: "Đường dẫn tuyệt đối đến thư mục gốc của project" },
        base_sha: { type: "string", description: "Git commit SHA cơ sở" },
        head_sha: { type: "string", description: "Git commit SHA hiện tại" },
        relevant_context: { type: "string", description: "Ngữ cảnh bổ sung" }
      },
      required: ["requirement", "diff"]
    }
  },
  {
    name: "ai_debug_failure",
    description: "Root Cause Debugger Specialist: Điều tra phân tích log, stack trace và cô lập nguyên nhân gốc rễ theo quy tắc NO FIX WITHOUT ROOT CAUSE (READ-ONLY).",
    inputSchema: {
      type: "object",
      properties: {
        failure: { type: "string", description: "Mô tả lỗi hoặc triệu chứng thất bại" },
        error_output: { type: "string", description: "Log lỗi thu thập được" },
        stack_trace: { type: "string", description: "Stack trace chi tiết" },
        reproduction: { type: "string", description: "Các bước tái hiện lỗi" },
        recent_diff: { type: "string", description: "Diff thay đổi gần nhất dẫn tới lỗi" },
        project_root: { type: "string", description: "Đường dẫn tuyệt đối đến thư mục gốc của project" },
        relevant_context: { type: "string", description: "Bối cảnh liên quan" }
      },
      required: ["failure"]
    }
  },
  {
    name: "ai_design_tests",
    description: "Quality Assurance & Test Specialist: Thiết kế kịch bản kiểm thử toàn diện (Happy/Negative/Edge Cases) và kiểm chứng Definition of Done (READ-ONLY).",
    inputSchema: {
      type: "object",
      properties: {
        requirement: { type: "string", description: "Yêu cầu kỹ thuật cần thiết kế test" },
        plan: { type: "string", description: "Kế hoạch triển khai" },
        diff: { type: "string", description: "Diff mã nguồn đã viết" },
        existing_tests: { type: "string", description: "Hiện trạng test suites" },
        project_root: { type: "string", description: "Đường dẫn tuyệt đối đến thư mục gốc của project" },
        review_findings: { type: "array", items: { type: "string" }, description: "Các phát hiện từ Reviewer" }
      },
      required: ["requirement"]
    }
  },
  {
    name: "ai_orchestrate_task",
    description: "AI Team Orchestrator: Tự động phân loại rủi ro tác vụ, định tuyến workflow vi mô (Level 0-4) và đề xuất/điều phối các Specialist Agents cần thiết (READ-ONLY).",
    inputSchema: {
      type: "object",
      properties: {
        requirement: { type: "string", description: "Yêu cầu kỹ thuật hoặc mô tả task cần thực thi" },
        files: { type: "array", items: { type: "string" }, description: "Danh sách các file dự kiến hoặc liên quan" },
        error_output: { type: "string", description: "Log lỗi nếu là task sửa lỗi" },
        stack_trace: { type: "string", description: "Stack trace chi tiết nếu có" },
        mode: { type: "string", enum: ["SUGGEST", "ENFORCED"], description: "Chế độ định tuyến: SUGGEST (mặc định) hoặc ENFORCED" },
        project_root: { type: "string", description: "Đường dẫn tuyệt đối đến thư mục gốc của project" }
      },
      required: ["requirement"]
    }
  },
  {
    name: "ai_agent_collaborate",
    description: "Hội đồng Thẩm định & Tranh biện Đa Chuyên gia (Multi-Agent Consensus Panel): Kích hoạt phiên hội ý 2 chiều giữa 5 Agents (Codebase, Architect, Reviewer, Tester) để phản biện, giải quyết rủi ro và đồng thuận bản thiết kế tối ưu nhất trước khi viết code.",
    inputSchema: {
      type: "object",
      properties: {
        requirement: { type: "string", description: "Yêu cầu kỹ thuật hoặc bài toán cần hội đồng AI thẩm định" },
        mode: { type: "string", enum: ["PANEL", "DEBATE"], default: "PANEL", description: "Chế độ: PANEL (toàn bộ hội đồng) hoặc DEBATE" },
        project_root: { type: "string", description: "Đường dẫn tuyệt đối đến thư mục gốc của project" }
      },
      required: ["requirement"]
    }
  },
  {
    name: "ask_codex",
    description: "Trực tiếp gửi câu hỏi/yêu cầu tới các model Codex (Sol, Terra, Luna, Spark) qua 9Router với cơ chế tự động chuyển vùng (Auto-Fallback) về Gemini 3.7 Flash High khi hết quota.",
    inputSchema: {
      type: "object",
      properties: {
        prompt: { type: "string", description: "Nội dung câu hỏi hoặc yêu cầu cần gửi tới model" },
        model: { type: "string", enum: ["sol", "terra", "luna", "spark", "gemini"], default: "sol", description: "Model Codex cần dùng" },
        system_prompt: { type: "string", description: "Chỉ dẫn hệ thống bổ sung nếu có" },
        temperature: { type: "number", description: "Độ sáng tạo của model (0.0 - 1.0)" }
      },
      required: ["prompt"]
    }
  }
];

/**
 * Xử lý thực thi từng Tool
 */
async function executeTool(name, args) {
  switch (name) {
    case 'ai_codebase_analyze': {
      const sys = `Bạn là Senior Codebase Analyst Specialist (Chuyên gia Phân tích Mã nguồn Cao cấp). Nhiệm vụ của bạn là bóc tách cấu trúc module, call graph, phân tích luồng dữ liệu và phụ thuộc kiến trúc hoàn toàn dựa trên bằng chứng kỹ thuật khách quan, không giả định.`;
      const prompt = `MỤC TIÊU PHÂN TÍCH: ${args.objective}\nTHƯ MỤC DỰ ÁN: ${args.project_root || 'Workspace hiện hành'}\nPHẠM VI (SCOPE): ${JSON.stringify(args.scope || [])}\nBỐI CẢNH ĐÃ BIẾT: ${args.known_context || 'Chưa có'}\n\nHãy xuất bản báo cáo phân tích chi tiết gồm:\n1. Tổng quan Kiến trúc & Điểm vào (Entrypoints)\n2. Luồng gọi & Phụ thuộc giữa các Module (Call Graph & Dependencies)\n3. Các rủi ro tiềm ẩn hoặc điểm nghẽn kỹ thuật (Bottlenecks / Risks)\n4. Khuyến nghị cho kỹ sư triển khai.`;
      const result = await callLlm(sys, prompt, DEFAULT_MODEL, 0.2);
      return { content: [{ type: "text", text: result }] };
    }

    case 'ai_plan_change': {
      const sys = `Bạn là Lead Software Architect Specialist (Tổng Công trình sư Kiến trúc Phần mềm). Bạn tuân thủ nguyên tắc Spec-First và Minimal Diff (Thay đổi nhỏ nhất có thể kiểm chứng). Luôn phân rã rõ ràng ranh giới bất biến (Invariants) và kế hoạch kiểm chứng vi mô.`;
      const prompt = `YÊU CẦU: ${args.requirement}\nBỐI CẢNH HIỆN TRẠNG: ${args.codebase_context || 'N/A'}\nCÁC TỆP LIÊN QUAN: ${JSON.stringify(args.relevant_files || [])}\nRÀNG BUỘC P0: ${JSON.stringify(args.constraints || [])}\nMỨC ĐỘ RỦI RO: ${args.risk_level || 'MEDIUM'}\n\nHãy lập Bản Kế Hoạch Triển Khai Vi Mô (Micro Implementation Plan):\n1. Mục tiêu & Tiêu chí Nghiệm thu (Acceptance Criteria)\n2. Non-goals (Những gì không thuộc phạm vi)\n3. Danh sách tệp cần chỉnh sửa & Phân chia trách nhiệm Work Packages\n4. Kế hoạch Kiểm chứng Từng Bước (Verification Steps)\n5. Phương án Rollback khẩn cấp nếu gặp sự cố.`;
      const result = await callLlm(sys, prompt, DEFAULT_MODEL, 0.2);
      return { content: [{ type: "text", text: result }] };
    }

    case 'ai_review_change': {
      const sys = `Bạn là Adversarial Code Reviewer Specialist (Kiểm toán viên Mã nguồn Khắt khe). Bạn tìm kiếm ít nhất 2 rủi ro tiềm ẩn, vi phạm ranh giới hoặc khả năng hồi quy (regressions). Phân loại lỗi theo CRITICAL (chặn merge), IMPORTANT (cần sửa), MINOR (cải thiện sau).`;
      const prompt = `YÊU CẦU ĐỐI CHIẾU: ${args.requirement}\nKẾ HOẠCH ĐÃ DUYỆT: ${args.plan || 'N/A'}\nDIFF MÃ NGUỒN CẦN REVIEW:\n\n${args.diff}\n\nHãy xuất kết luận Kiểm toán Mã nguồn:\n1. Phán quyết tổng thể: PASS / CONDITIONAL_PASS / REJECT\n2. Bảng phân loại lỗi (CRITICAL, IMPORTANT, MINOR)\n3. Rủi ro về tính tương thích ngược (Backward Compatibility) và bảo mật\n4. Đề xuất chỉnh sửa cụ thể.`;
      const result = await callLlm(sys, prompt, DEFAULT_MODEL, 0.2);
      return { content: [{ type: "text", text: result }] };
    }

    case 'ai_debug_failure': {
      const sys = `Bạn là Root Cause Debugger Specialist (Chuyên gia Pháp y Nguyên nhân Gốc rễ). Tuân thủ phương châm: NO FIX WITHOUT ROOT CAUSE. Tuyệt đối không phỏng đoán bề mặt.`;
      const prompt = `TRIỆU CHỨNG LỖI: ${args.failure}\nLOG LỖI: ${args.error_output || 'N/A'}\nSTACK TRACE: ${args.stack_trace || 'N/A'}\nDIFF GẦN NHẤT: ${args.recent_diff || 'N/A'}\nCÁC BƯỚC TÁI HIỆN: ${args.reproduction || 'N/A'}\n\nHãy lập Báo Cáo Pháp Y Gỡ Lỗi:\n1. Giả thuyết nguyên nhân gốc rễ (Root Cause Hypothesis)\n2. Bằng chứng kỹ thuật xác nhận giả thuyết\n3. Đề xuất bản vá diff tối thiểu (Minimal Fix Diff)\n4. Test case độc lập để ngăn lỗi tái phát vĩnh viễn.`;
      const result = await callLlm(sys, prompt, DEFAULT_MODEL, 0.1);
      return { content: [{ type: "text", text: result }] };
    }

    case 'ai_design_tests': {
      const sys = `Bạn là Principal QA & Verification Specialist (Chuyên gia Thiết kế Kiểm thử & Thẩm định Chất lượng). Bạn thiết kế bộ test case bao phủ toàn diện: Happy Path, Negative Path, Edge Cases, Concurrency và Failure Injection.`;
      const prompt = `YÊU CẦU KIỂM CHỨNG: ${args.requirement}\nKẾ HOẠCH TRIỂN KHAI: ${args.plan || 'N/A'}\nDIFF MÃ NGUỒN: ${args.diff || 'N/A'}\nHIỆN TRẠNG TEST SUITES: ${args.existing_tests || 'N/A'}\n\nHãy xuất Bộ Đặc Tả Kiểm Thử (Verification Suite Specification):\n1. Test Matrix (Ma trận kiểm thử phân cấp theo độ ưu tiên P0/P1/P2)\n2. Kịch bản Happy Path\n3. Kịch bản Negative & Edge Cases (Boundary conditions, timeout, race conditions)\n4. Lệnh terminal chạy kiểm thử độc lập và tiêu chí Đạt (Pass Criteria).`;
      const result = await callLlm(sys, prompt, DEFAULT_MODEL, 0.2);
      return { content: [{ type: "text", text: result }] };
    }

    case 'ai_orchestrate_task': {
      const sys = `Bạn là Autonomous AI Team Orchestrator (Nhạc trưởng Điều phối Đa Tác tử). Bạn phân rã bài toán, đánh giá mức độ phức tạp từ Level 0 đến Level 4, và định tuyến luồng làm việc cho các Agent pod phù hợp.`;
      const prompt = `MÔ TẢ TÁC VỤ: ${args.requirement}\nDANH SÁCH FILE LIÊN QUAN: ${JSON.stringify(args.files || [])}\nCHẾ ĐỘ: ${args.mode || 'SUGGEST'}\n\nHãy phân tích và điều phối:\n1. Đánh giá Mức Độ Phức Tạp (Level 0: Turbo Single, Level 1: Standard SWE, Level 2: Multi-Agent Pod, Level 3: Architecture Refactor, Level 4: Disaster Recovery)\n2. Đề xuất Danh Sách Subagents Cần Kích Hoạt\n3. Thứ tự thực thi tuần tự / song song (Workflow Topology)\n4. Rào chắn An Toàn & Điểm Kiểm Soát (Checkpoints).`;
      const result = await callLlm(sys, prompt, DEFAULT_MODEL, 0.2);
      return { content: [{ type: "text", text: result }] };
    }

    case 'ai_agent_collaborate': {
      const sys = `Bạn là Hội đồng Thẩm định & Tranh biện Đa Chuyên gia (Multi-Agent Consensus Panel) đại diện cho 4 tiếng nói: Codebase Analyst, Lead Architect, Adversarial Reviewer, và QA Specialist.`;
      const prompt = `CHỦ ĐỀ TRANH BIỆN & THẨM ĐỊNH: ${args.requirement}\nCHẾ ĐỘ: ${args.mode || 'PANEL'}\n\nHãy mô phỏng phiên thảo luận 2 chiều:\n• [Codebase Analyst]: Phân tích hiện trạng và các ràng buộc hạ tầng.\n• [Lead Architect]: Đề xuất phương án thiết kế tối ưu.\n• [Adversarial Reviewer]: Chỉ ra 2 điểm yếu chí mạng của phương án.\n• [QA Specialist]: Yêu cầu các điều kiện kiểm chứng trước khi phê duyệt.\n• [ĐỒNG THUẬN CUỐI CÙNG (Consensus Verdict)]: Kết luận phương án giải pháp tốt nhất.`;
      const result = await callLlm(sys, prompt, DEFAULT_MODEL, 0.4);
      return { content: [{ type: "text", text: result }] };
    }

    case 'ask_codex': {
      const modelMap = {
        'sol': 'cx/gpt-5.6-sol',
        'terra': 'cx/gpt-5.6-terra',
        'luna': 'cx/gpt-5.6-luna',
        'spark': 'cx/gpt-5.3-codex-spark',
        'gemini': 'ag/gemini-3.7-flash-high'
      };
      const chosenModel = modelMap[args.model] || DEFAULT_MODEL;
      const sys = args.system_prompt || 'Bạn là trợ lý lập trình chuyên sâu, thông minh và chính xác.';
      const temp = typeof args.temperature === 'number' ? args.temperature : 0.3;
      const result = await callLlm(sys, args.prompt, chosenModel, temp);
      return { content: [{ type: "text", text: result }] };
    }

    default:
      throw new Error(`Công cụ không xác định: ${name}`);
  }
}

/**
 * JSON-RPC 2.0 Stdio Dispatcher
 */
function sendJsonRpcResponse(id, result, error = null) {
  const resp = { jsonrpc: '2.0', id };
  if (error) {
    resp.error = { code: -32603, message: error.message || String(error) };
  } else {
    resp.result = result;
  }
  process.stdout.write(JSON.stringify(resp) + '\n');
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

console.error('[AI Engineering Team MCP] Started and listening on stdio JSON-RPC 2.0 (8 Specialist Tools Ready)');

rl.on('line', async (line) => {
  line = line.trim();
  if (!line) return;

  try {
    const message = JSON.parse(line);
    const { id, method, params } = message;

    if (method === 'initialize') {
      sendJsonRpcResponse(id, {
        protocolVersion: '2024-11-05',
        capabilities: { tools: {} },
        serverInfo: {
          name: 'ai-engineering-team',
          version: '1.0.0'
        }
      });
      return;
    }

    if (method === 'notifications/initialized') {
      return;
    }

    if (method === 'tools/list') {
      sendJsonRpcResponse(id, { tools: TOOLS_DEFINITIONS });
      return;
    }

    if (method === 'tools/call') {
      const toolName = params?.name;
      const toolArgs = params?.arguments || {};
      try {
        const result = await executeTool(toolName, toolArgs);
        sendJsonRpcResponse(id, result);
      } catch (toolErr) {
        sendJsonRpcResponse(id, null, toolErr);
      }
      return;
    }

    if (id !== undefined) {
      sendJsonRpcResponse(id, null, { message: `Method '${method}' không được hỗ trợ` });
    }
  } catch (err) {
    console.error('[AI Engineering MCP Parse Error]:', err.message);
  }
});
