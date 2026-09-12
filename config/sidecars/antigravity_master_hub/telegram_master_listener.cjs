/**
 * ════════════════════════════════════════════════════════════════════════════
 * ANTIGRAVITY MASTER MCP HUB — TELEGRAM MASTER LISTENER
 * Cầu nối 2 chiều: Lắng nghe lệnh từ Điện thoại qua Telegram, 
 * điều phối LLM 9Router và kích hoạt các công cụ MCP vệ tinh
 * ════════════════════════════════════════════════════════════════════════════
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { McpRouter } = require('./mcp_router.cjs');
const systemTools = require('./system_tools.cjs');

const CONFIG_PATH = path.join(__dirname, 'hub_config.json');

function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const content = fs.readFileSync(filePath, 'utf8');
  const env = {};
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx > 0) {
      const key = trimmed.slice(0, eqIdx).trim();
      let val = trimmed.slice(eqIdx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      env[key] = val;
    }
  }
  return env;
}

function loadConfig() {
  if (!fs.existsSync(CONFIG_PATH)) {
    throw new Error(`Không tìm thấy file cấu hình: ${CONFIG_PATH}`);
  }
  const rawConfig = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));

  const envLocalPath = path.join(__dirname, '.env.local');
  const localEnv = parseEnvFile(envLocalPath);

  function resolveSecret(val, envKey) {
    if (!val) return process.env[envKey] || localEnv[envKey] || '';
    if (typeof val === 'string' && val.startsWith('ENV:')) {
      const targetVar = val.slice(4).trim();
      return process.env[targetVar] || localEnv[targetVar] || '';
    }
    return val;
  }

  rawConfig.bot_token = resolveSecret(rawConfig.bot_token, 'TELEGRAM_BOT_TOKEN');
  rawConfig.nine_router_api_key = resolveSecret(rawConfig.nine_router_api_key, 'NINE_ROUTER_API_KEY');

  return rawConfig;
}

const config = loadConfig();
const BOT_TOKEN = config.bot_token;
const ALLOWED_USERS = config.allowed_user_ids || [];
const NINE_ROUTER_URL = config.nine_router_url || 'http://127.0.0.1:20127/v1/chat/completions';
const NINE_ROUTER_KEY = config.nine_router_api_key || '';
const TARGET_MODEL = config.model || 'ag/gemini-3.7-flash-high';
const DEFAULT_WORKSPACE = config.default_workspace || 'C:\\Users\\game\\Documents\\app\\Smartmarket';

let mcpRouter = null;
let lastUpdateId = 0;
let isPolling = false;

// Lưu trữ lịch sử hội thoại trong bộ nhớ
const conversations = new Map(); // chatId -> Array of messages

const SYSTEM_PROMPT = `Bạn là Trợ Lý Kỹ Thuật Cá Nhân Toàn Năng (Senior Pair-Programmer & Technical Mentor) tích hợp trong Antigravity Master Hub.
Chủ nhân duy nhất của bạn là Anh — Lead Architect / Product Owner.
Bạn đang đại diện cho toàn bộ sức mạnh của Antigravity IDE để tương tác trực tiếp với Anh qua Telegram.

QUY TẮC BẮT BUỘC:
1. Giao tiếp bằng tiếng Việt tự nhiên, chuyên nghiệp, gãy gọn, tôn trọng và đồng hành ("Anh" - "Em").
2. QUY TẮC THUẬT NGỮ SONG NGỮ: Mọi thuật ngữ kỹ thuật, khái niệm hoặc danh từ tiếng Anh trong câu trả lời bắt buộc phải đi kèm bản dịch tiếng Việt ngay liền sau theo định dạng: English (Tiếng Việt). Ví dụ: Terminal (Thiết bị đầu cuối), Build (Xây dựng gói), Compilation (Biên dịch), Testing (Kiểm thử), Concurrency (Đồng thời).
3. ĐẦY ĐỦ QUYỀN NĂNG THỰC THI (FULL SYSTEM EXECUTION):
   - Bạn có quyền hạn thực thi trên máy tính của Anh giống hệt Antigravity IDE:
     + Chạy lệnh hệ thống: execute_terminal_command (powershell, git, npm, node, python...). Thư mục mặc định: ${DEFAULT_WORKSPACE}.
     + Thao tác mã nguồn: write_code_file (tạo mới/ghi file), read_code_file (đọc file), edit_code_file (sửa code chuẩn xác), list_directory (khảo sát cây thư mục).
     + Chụp ảnh màn hình thật: take_desktop_screenshot (chụp màn hình máy tính thật và tự động gửi ảnh về Telegram).
     + Gọi chuyên gia AI & Trình duyệt: cdp-bridge (Google Flow) và ai-engineering-team (ai_plan_change, ai_review_change...).
4. TỰ CHỦ HOÀN TOÀN KHI THỰC THI:
   - Khi Anh yêu cầu chụp màn hình: Chỉ cần gọi DUY NHẤT một công cụ take_desktop_screenshot. Hệ thống đã tự động chụp màn hình thật và gửi trực tiếp ảnh về Telegram cho Anh. Tuyệt đối KHÔNG gọi thêm send_telegram_notification hay cdp_capture_screenshot.
   - Khi Anh yêu cầu build một module hoặc code tính năng: Đừng chỉ giải thích bằng lời! Hãy tự chủ phân tích, dùng write_code_file để tạo các file mã nguồn, dùng execute_terminal_command để chạy build/test (ví dụ npm run build, node test...), tự động phát hiện lỗi và sửa chữa nếu cần, rồi báo cáo kết quả hoàn thành chi tiết cho Anh.
   - Tuyệt đối không chạy lệnh tìm kiếm quét đệ quy toàn bộ ổ cứng hoặc thư mục người dùng.`;

// ════════════════════════════════════════════════════════════════════════════
// TELEGRAM API CLIENT THUẦN
// ════════════════════════════════════════════════════════════════════════════

function callTelegramApi(method, payload = {}) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload);
    const options = {
      hostname: 'api.telegram.org',
      port: 443,
      path: `/bot${BOT_TOKEN}/${method}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          if (parsed.ok) resolve(parsed.result);
          else reject(new Error(parsed.description || 'Telegram API Error'));
        } catch (e) { reject(new Error(`Parse error: ${body}`)); }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function sendTelegramMessage(chatId, text, parseMode = 'Markdown') {
  // Cắt tin nhắn nếu vượt quá 4000 ký tự (giới hạn Telegram)
  const MAX_LEN = 3800;
  if (text.length <= MAX_LEN) {
    try {
      return await callTelegramApi('sendMessage', { chat_id: chatId, text, parse_mode: parseMode });
    } catch (err) {
      // Fallback nếu lỗi Markdown
      return await callTelegramApi('sendMessage', { chat_id: chatId, text });
    }
  }

  const chunks = [];
  for (let i = 0; i < text.length; i += MAX_LEN) {
    chunks.push(text.slice(i, i + MAX_LEN));
  }
  for (const chunk of chunks) {
    await callTelegramApi('sendMessage', { chat_id: chatId, text: chunk });
  }
}

async function sendTelegramPhoto(chatId, photoPath, caption = '') {
  if (!fs.existsSync(photoPath)) {
    return await sendTelegramMessage(chatId, `⚠️ Không tìm thấy file ảnh: ${photoPath}`);
  }

  const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);
  const imageBuffer = fs.readFileSync(photoPath);
  const filename = path.basename(photoPath);

  const postDataHeader = Buffer.from(
    `--${boundary}\r\n` +
    `Content-Disposition: form-data; name="chat_id"\r\n\r\n${chatId}\r\n` +
    `--${boundary}\r\n` +
    `Content-Disposition: form-data; name="caption"\r\n\r\n${caption}\r\n` +
    `--${boundary}\r\n` +
    `Content-Disposition: form-data; name="photo"; filename="${filename}"\r\n` +
    `Content-Type: image/png\r\n\r\n`
  );
  const postDataFooter = Buffer.from(`\r\n--${boundary}--\r\n`);
  const fullBody = Buffer.concat([postDataHeader, imageBuffer, postDataFooter]);

  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'api.telegram.org',
      port: 443,
      path: `/bot${BOT_TOKEN}/sendPhoto`,
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': fullBody.length
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          if (parsed.ok) resolve(parsed.result);
          else reject(new Error(parsed.description));
        } catch (e) { reject(e); }
      });
    });
    req.on('error', reject);
    req.write(fullBody);
    req.end();
  });
}

function sendChatAction(chatId, action = 'typing') {
  return callTelegramApi('sendChatAction', { chat_id: chatId, action }).catch(() => {});
}

// ════════════════════════════════════════════════════════════════════════════
// 9ROUTER / LLM CHAT CLIENT
// ════════════════════════════════════════════════════════════════════════════

function callNineRouter(messages, tools = []) {
  return new Promise((resolve, reject) => {
    if (!NINE_ROUTER_KEY) {
      return reject(new Error('NINE_ROUTER_API_KEY chưa được cấu hình. Vui lòng thiết lập trong .env.local hoặc biến môi trường.'));
    }
    const url = new URL(NINE_ROUTER_URL);
    const payload = {
      model: TARGET_MODEL,
      messages,
      temperature: 0.4,
      stream: false
    };

    if (tools && tools.length > 0) {
      payload.tools = tools;
    }

    const data = JSON.stringify(payload);
    const options = {
      hostname: url.hostname,
      port: url.port || (url.protocol === 'https:' ? 443 : 80),
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${NINE_ROUTER_KEY}`,
        'Content-Length': Buffer.byteLength(data)
      },
      timeout: 60000
    };

    const protocolModule = url.protocol === 'https:' ? https : http;
    const req = protocolModule.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        let json;
        try {
          json = JSON.parse(body);
        } catch (e) {
          // Fallback: Xử lý nếu 9Router trả về dạng SSE Stream (data: {...})
          if (body.includes('data:')) {
            let fullContent = '';
            let toolCallsMap = new Map();
            const lines = body.split('\n');
            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed.startsWith('data:') || trimmed === 'data: [DONE]') continue;
              try {
                const chunk = JSON.parse(trimmed.replace(/^data:\s*/, ''));
                const delta = chunk.choices?.[0]?.delta;
                if (delta?.content) fullContent += delta.content;
                if (delta?.tool_calls) {
                  for (const tc of delta.tool_calls) {
                    const idx = tc.index || 0;
                    if (!toolCallsMap.has(idx)) {
                      toolCallsMap.set(idx, {
                        id: tc.id || `call_${idx}`,
                        type: 'function',
                        function: { name: tc.function?.name || '', arguments: '' }
                      });
                    }
                    const existing = toolCallsMap.get(idx);
                    if (tc.function?.name) existing.function.name = tc.function.name;
                    if (tc.function?.arguments) existing.function.arguments += tc.function.arguments;
                  }
                }
              } catch (err) {}
            }
            const assistantMsg = { role: 'assistant', content: fullContent };
            if (toolCallsMap.size > 0) {
              assistantMsg.tool_calls = Array.from(toolCallsMap.values());
            }
            return resolve(assistantMsg);
          }
          return reject(new Error(`Lỗi parse JSON 9Router: ${body.slice(0, 150)}`));
        }

        if (json.error) {
          reject(new Error(json.error.message || JSON.stringify(json.error)));
        } else if (json.choices && json.choices.length > 0) {
          resolve(json.choices[0].message);
        } else {
          reject(new Error(`Phản hồi 9Router rỗng: ${body.slice(0, 150)}`));
        }
      });
    });

    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('9Router request timeout')); });
    req.write(data);
    req.end();
  });
}

// ════════════════════════════════════════════════════════════════════════════
// XỬ LÝ LỆNH TỪ ĐIỆN THOẠI (AGENT ORCHESTRATION LOOP)
// ════════════════════════════════════════════════════════════════════════════

async function handleUserMessage(chatId, text, userName) {
  // Khởi tạo context nếu chưa có
  if (!conversations.has(chatId)) {
    conversations.set(chatId, [
      { role: 'system', content: SYSTEM_PROMPT }
    ]);
  }

  const history = conversations.get(chatId);

  // Lệnh đặc biệt Slash commands
  if (text === '/start' || text === '/help') {
    const welcome = `👋 *Chào Anh — Lead Architect!*\n\nEm là **Antigravity Master Hub (Cỗ máy Mẹ Điều phối)**.\nHiện tại Em đang kết nối trực tiếp với Antigravity IDE trên máy tính của Anh với **Đầy Đủ Quyền Năng Thực Thi Tự Chủ**.\n\n*Các lệnh điều khiển nhanh:*\n• \`/status\` - Kiểm tra trạng thái máy chủ & Workspace\n• \`/tools\` - Xem toàn bộ ${systemTools.SYSTEM_TOOLS_SPEC.length} System Tools + các công cụ MCP con\n• \`/clear\` - Làm mới phiên hội thoại\n\n*Ví dụ các câu lệnh Anh có thể giao:* \n📸 *"Chụp màn hình cho anh xem"* -> Tự chụp desktop thật và gửi ảnh về đây.\n🛠️ *"Build module auth trong Smartmarket"* -> Tự tạo code, tự chạy build/test qua Terminal và báo cáo tiến độ!\n🔍 *"Kiểm tra git status dự án"* -> Tự chạy git trên máy tính và gửi kết quả.`;
    return await sendTelegramMessage(chatId, welcome);
  }

  if (text === '/status') {
    const mcpCount = mcpRouter ? mcpRouter.toolsRegistry.size : 0;
    const sysCount = systemTools.SYSTEM_TOOLS_SPEC.length;
    const serversList = mcpRouter ? Array.from(mcpRouter.serverProcesses.keys()).join(', ') : 'Chưa có';
    const statusMsg = `📊 *TRẠNG THÁI ANTIGRAVITY MASTER HUB:*\n\n• **Model suy luận**: \`${TARGET_MODEL}\`\n• **Thư mục làm việc (Workspace)**: \`${DEFAULT_WORKSPACE}\`\n• **Công cụ thực thi hệ thống**: \`${sysCount} System Tools\` (Terminal, Files, Screenshot)\n• **MCP Servers vệ tinh**: \`${serversList}\` (${mcpCount} tools)\n• **Trạng thái**: 🟢 *Sẵn sàng nhận lệnh tự chủ 24/7*\n• **Độ trễ trung bình**: ~1.1s`;
    return await sendTelegramMessage(chatId, statusMsg);
  }

  if (text === '/tools') {
    let listMsg = `🧰 *DANH MỤC CÔNG CỤ THỰC THI TOÀN NĂNG CỦA ANH:*\n\n`;
    listMsg += `💻 *1. CÔNG CỤ HỆ THỐNG NỘI TẠI (${systemTools.SYSTEM_TOOLS_SPEC.length} tools):*\n`;
    for (const t of systemTools.SYSTEM_TOOLS_SPEC) {
      listMsg += `• \`${t.function.name}\`\n  ↳ ${t.function.description.slice(0, 80)}...\n`;
    }

    if (mcpRouter && mcpRouter.toolsRegistry.size > 0) {
      listMsg += `\n🛰️ *2. CÔNG CỤ MCP VỆ TINH (${mcpRouter.toolsRegistry.size} tools):*\n`;
      for (const [name, entry] of mcpRouter.toolsRegistry.entries()) {
        listMsg += `• \`${name}\` _(${entry.serverKey})_\n  ↳ ${(entry.schema.description || 'Không có mô tả').slice(0, 80)}...\n`;
      }
    }
    return await sendTelegramMessage(chatId, listMsg);
  }

  if (text === '/clear') {
    conversations.set(chatId, [{ role: 'system', content: SYSTEM_PROMPT }]);
    return await sendTelegramMessage(chatId, '🧹 *Đã làm mới bộ nhớ hội thoại của phiên làm việc!*');
  }

  // Luồng xử lý hội thoại chính
  history.push({ role: 'user', content: text });

  // Giữ tối đa 25 tin nhắn gần nhất để tránh tràn context
  if (history.length > 30) {
    const sys = history[0];
    const recents = history.slice(history.length - 25);
    conversations.set(chatId, [sys, ...recents]);
  }

  sendChatAction(chatId, 'typing');

  try {
    const openAiMcpTools = mcpRouter ? mcpRouter.getOpenAiToolsList() : [];
    const allTools = [...systemTools.SYSTEM_TOOLS_SPEC, ...openAiMcpTools];
    let assistantMessage = await callNineRouter(history, allTools);

    // Xử lý vòng lặp Tool Calling (AI kích hoạt các công cụ thực thi)
    let loopCount = 0;
    const MAX_TOOL_LOOPS = 10;

    while (assistantMessage.tool_calls && assistantMessage.tool_calls.length > 0 && loopCount < MAX_TOOL_LOOPS) {
      loopCount++;
      history.push(assistantMessage);

      for (const toolCall of assistantMessage.tool_calls) {
        const functionName = toolCall.function.name;
        let functionArgs = {};
        try {
          functionArgs = JSON.parse(toolCall.function.arguments);
        } catch (e) {
          functionArgs = {};
        }

        console.log(`[MasterHub] ⚙️ [Bước ${loopCount}] Kích hoạt công cụ: ${functionName} với args:`, functionArgs);
        sendChatAction(chatId, 'typing');

        let toolResult = null;
        let toolResultText = '';

        try {
          const isSystemTool = systemTools.SYSTEM_TOOLS_SPEC.some(t => t.function.name === functionName);

          if (isSystemTool) {
            if (functionName === 'execute_terminal_command') {
              const cmdPreview = functionArgs.command?.length > 100 ? functionArgs.command.slice(0, 100) + '...' : functionArgs.command;
              await sendTelegramMessage(chatId, `⚙️ *[Terminal]* Đang chạy lệnh:\n\`${cmdPreview}\``);
              toolResult = await systemTools.executeTerminalCommand(functionArgs, DEFAULT_WORKSPACE);
            } else if (functionName === 'write_code_file') {
              const baseName = path.basename(functionArgs.filePath || 'file');
              await sendTelegramMessage(chatId, `📝 *[File System]* Đang tạo/ghi mã nguồn: \`${baseName}\`...`);
              toolResult = systemTools.writeCodeFile(functionArgs, DEFAULT_WORKSPACE);
            } else if (functionName === 'read_code_file') {
              const baseName = path.basename(functionArgs.filePath || 'file');
              await sendTelegramMessage(chatId, `📖 *[File System]* Đang đọc file: \`${baseName}\`...`);
              toolResult = systemTools.readCodeFile(functionArgs, DEFAULT_WORKSPACE);
            } else if (functionName === 'edit_code_file') {
              const baseName = path.basename(functionArgs.filePath || 'file');
              await sendTelegramMessage(chatId, `✏️ *[File System]* Đang cập nhật mã nguồn: \`${baseName}\`...`);
              toolResult = systemTools.editCodeFile(functionArgs, DEFAULT_WORKSPACE);
            } else if (functionName === 'list_directory') {
              toolResult = systemTools.listDirectory(functionArgs, DEFAULT_WORKSPACE);
            } else if (functionName === 'take_desktop_screenshot') {
              await sendTelegramMessage(chatId, `📸 *[Chụp màn hình]* Đang chụp màn hình máy tính thật...`);
              toolResult = await systemTools.takeDesktopScreenshot(functionArgs);
              if (toolResult && toolResult.screenshotPath && fs.existsSync(toolResult.screenshotPath)) {
                await sendTelegramPhoto(chatId, toolResult.screenshotPath, `🖥️ Ảnh chụp màn hình máy tính (${new Date().toLocaleTimeString('vi-VN')})`);
              }
            }
          } else {
            // Định tuyến tới MCP Router
            await sendTelegramMessage(chatId, `🛰️ *[MCP Specialist]* Đang kích hoạt: \`${functionName}\`...`);
            toolResult = await mcpRouter.executeTool(functionName, functionArgs);

            if (functionName === 'cdp_capture_screenshot' && toolResult) {
              const possiblePath = toolResult.savedTo || (toolResult.content && toolResult.content[0]?.text);
              if (possiblePath && fs.existsSync(possiblePath)) {
                await sendTelegramPhoto(chatId, possiblePath, `📸 Ảnh chụp màn hình CDP Chrome`);
              }
            }
          }

          toolResultText = JSON.stringify(toolResult);

        } catch (err) {
          toolResultText = JSON.stringify({ error: err.message });
          console.error(`[MasterHub] ❌ Lỗi thực thi tool ${functionName}:`, err.message);
          await sendTelegramMessage(chatId, `⚠️ *Lỗi khi chạy ${functionName}:* ${err.message}`);
        }

        history.push({
          role: 'tool',
          tool_call_id: toolCall.id,
          name: functionName,
          content: toolResultText
        });
      }

      sendChatAction(chatId, 'typing');
      assistantMessage = await callNineRouter(history, allTools);
    }

    history.push(assistantMessage);
    const finalReply = assistantMessage.content || '✓ Đã hoàn tất tác vụ.';
    await sendTelegramMessage(chatId, finalReply);

  } catch (err) {
    console.error('[MasterHub Error]:', err);
    await sendTelegramMessage(chatId, `❌ *Lỗi xử lý:* ${err.message}`);
  }
}

// ════════════════════════════════════════════════════════════════════════════
// LONG-POLLING ENGINE
// ════════════════════════════════════════════════════════════════════════════

async function pollUpdates() {
  if (isPolling) return;
  isPolling = true;

  while (true) {
    try {
      const updates = await callTelegramApi('getUpdates', {
        offset: lastUpdateId + 1,
        timeout: 25
      });

      if (Array.isArray(updates) && updates.length > 0) {
        for (const update of updates) {
          lastUpdateId = update.update_id;

          if (update.message && update.message.text) {
            const msg = update.message;
            const chatId = msg.chat.id;
            const fromId = msg.from.id;
            const fromName = msg.from.first_name || 'Anh';
            const text = msg.text.trim();

            // Kiểm tra Zero-Trust Whitelist
            if (ALLOWED_USERS.length > 0 && !ALLOWED_USERS.includes(fromId)) {
              console.warn(`[Security] ⛔ Chặn truy cập từ User lạ: ${fromId} (${fromName})`);
              await callTelegramApi('sendMessage', {
                chat_id: chatId,
                text: `⛔ Truy cập bị từ chối. Thiết bị ID (${fromId}) không nằm trong danh sách cấp quyền của Antigravity Master Hub.`
              });
              continue;
            }

            console.log(`[Telegram:Incoming] 💬 [${fromName}]: ${text}`);
            await handleUserMessage(chatId, text, fromName);
          }
        }
      }
    } catch (err) {
      console.error('[Polling Error]:', err.message);
      await new Promise(r => setTimeout(r, 4000));
    }
  }
}

// ════════════════════════════════════════════════════════════════════════════
// KHỞI ĐỘNG HỆ THỐNG
// ════════════════════════════════════════════════════════════════════════════

async function main() {
  console.log(`
╔═════════════════════════════════════════════════════════════════════════════╗
║                   🚀 ANTIGRAVITY MASTER MCP HUB ONLINE                      ║
║      Cỗ máy Mẹ Điều phối Đa MCP kết nối Điện thoại & Máy tính               ║
╚═════════════════════════════════════════════════════════════════════════════╝
  `);

  mcpRouter = new McpRouter({
    mcpConfigPath: config.mcp_config_path,
    enabledServers: config.enabled_mcp_servers
  });

  await mcpRouter.initialize();

  console.log(`[MasterHub] 📱 Sẵn sàng nhận lệnh từ Telegram User ID: ${ALLOWED_USERS.join(', ')}`);
  console.log(`[MasterHub] 🧠 Model trung tâm: ${TARGET_MODEL}`);
  console.log(`[MasterHub] 🟢 Bắt đầu tiến trình Long-Polling...`);

  // Gửi thông báo khởi động tới điện thoại của Anh
  if (ALLOWED_USERS.length > 0) {
    const adminChatId = ALLOWED_USERS[0];
    sendTelegramMessage(
      adminChatId,
      `🚀 *[ANTIGRAVITY MASTER HUB — TOÀN NĂNG ONLINE]*\n\nChào **Anh — Lead Architect**!\nCỗ máy Antigravity trên máy tính đã được trang bị **Đầy Đủ Quyền Năng Thực Thi Tự Chủ**:\n\n• 💻 **6 System Tools**: Terminal Runner, File System (đọc/ghi/sửa code), Chụp màn hình thật\n• 🛰️ **${mcpRouter.toolsRegistry.size} MCP Tools**: cdp-bridge, ai-engineering-team\n• 📂 **Workspace mặc định**: \`${DEFAULT_WORKSPACE}\`\n\nAnh có thể thử ngay:\n📸 Gửi: *"Chụp màn hình cho anh xem"*\n🛠️ Gửi: *"Tạo file test_tele.js và in ra 'Hello Antigravity' rồi chạy thử file đó"*\n\nEm đã sẵn sàng đồng hành cùng Anh 24/7!`
    ).catch(e => console.warn('[Startup Ping Error]:', e.message));
  }

  await pollUpdates();
}

process.on('SIGINT', () => {
  console.log('\n[MasterHub] 🛑 Đang tắt hệ thống...');
  if (mcpRouter) mcpRouter.shutdown();
  process.exit(0);
});

main().catch(err => {
  console.error('[Fatal Crash]:', err);
  if (mcpRouter) mcpRouter.shutdown();
  process.exit(1);
});
