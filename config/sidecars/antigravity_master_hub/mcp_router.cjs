/**
 * ════════════════════════════════════════════════════════════════════════════
 * ANTIGRAVITY MASTER MCP HUB — DYNAMIC MCP ROUTER
 * Quản lý vòng đời và định tuyến công cụ (Tools) tới các MCP Server con qua STDIO
 * ════════════════════════════════════════════════════════════════════════════
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

class McpRouter {
  constructor(options = {}) {
    this.mcpConfigPath = options.mcpConfigPath || 'C:\\Users\\game\\.gemini\\config\\mcp_config.json';
    this.enabledServers = options.enabledServers || [];
    this.serverProcesses = new Map(); // serverKey -> { process, pendingRequests }
    this.toolsRegistry = new Map();   // toolName -> { serverKey, schema }
    this.requestIdCounter = 1;
  }

  /**
   * Khởi động toàn bộ MCP Servers được chỉ định và đọc danh sách Tools
   */
  async initialize() {
    console.log('[McpRouter] 🔄 Đang nạp cấu hình MCP từ:', this.mcpConfigPath);
    if (!fs.existsSync(this.mcpConfigPath)) {
      throw new Error(`Không tìm thấy file cấu hình: ${this.mcpConfigPath}`);
    }

    const raw = fs.readFileSync(this.mcpConfigPath, 'utf8');
    const mcpConfig = JSON.parse(raw);
    const mcpServers = mcpConfig.mcpServers || {};

    const targetKeys = this.enabledServers.length > 0 
      ? this.enabledServers 
      : Object.keys(mcpServers);

    for (const key of targetKeys) {
      const serverDef = mcpServers[key];
      if (!serverDef) {
        console.warn(`[McpRouter] ⚠️ Không tìm thấy định nghĩa cho server: ${key}`);
        continue;
      }

      try {
        await this._startServer(key, serverDef);
      } catch (err) {
        console.error(`[McpRouter] ❌ Lỗi khởi động server ${key}:`, err.message);
      }
    }

    console.log(`[McpRouter] ✓ Hoàn tất khởi động! Tổng số công cụ nạp được: ${this.toolsRegistry.size}`);
    return this.getOpenAiToolsList();
  }

  /**
   * Khởi chạy một MCP Server con qua stdio child_process
   */
  async _startServer(key, def) {
    console.log(`[McpRouter] 🚀 Đang khởi chạy MCP Server: [${key}] -> ${def.command} ${(def.args || []).join(' ')}`);
    
    const cp = spawn(def.command, def.args || [], {
      stdio: ['pipe', 'pipe', 'pipe'],
      windowsHide: true
    });

    const serverEntry = {
      key,
      process: cp,
      pendingRequests: new Map() // id -> { resolve, reject, timer }
    };

    this.serverProcesses.set(key, serverEntry);

    // Bắt log lỗi stderr
    cp.stderr.on('data', (chunk) => {
      const line = chunk.toString().trim();
      if (line) console.log(`[${key}:stderr] ${line}`);
    });

    // Lắng nghe stdout line-by-line
    const rl = readline.createInterface({ input: cp.stdout, terminal: false });
    rl.on('line', (line) => {
      const trimmed = line.trim();
      if (!trimmed) return;
      try {
        const message = JSON.parse(trimmed);
        if (message.id && serverEntry.pendingRequests.has(message.id)) {
          const { resolve, reject, timer } = serverEntry.pendingRequests.get(message.id);
          clearTimeout(timer);
          serverEntry.pendingRequests.delete(message.id);

          if (message.error) {
            reject(new Error(message.error.message || JSON.stringify(message.error)));
          } else {
            resolve(message.result);
          }
        }
      } catch (e) {
        console.warn(`[${key}:stdout parse error]:`, line);
      }
    });

    cp.on('exit', (code, signal) => {
      console.warn(`[McpRouter] ⚠️ Server [${key}] đã thoát với code: ${code}, signal: ${signal}`);
      this.serverProcesses.delete(key);
      if (serverEntry.pendingRequests.size > 0) {
        for (const [id, req] of serverEntry.pendingRequests.entries()) {
          clearTimeout(req.timer);
          req.reject(new Error(`Server [${key}] đã dừng đột ngột (code: ${code}, signal: ${signal})`));
        }
        serverEntry.pendingRequests.clear();
      }
    });

    // 1. Gửi bắt tay chuẩn MCP: initialize
    try {
      await this._sendJsonRpc(serverEntry, 'initialize', {
        protocolVersion: '2024-11-05',
        capabilities: {},
        clientInfo: { name: 'AntigravityMasterHub', version: '2.0.0' }
      }, 10000);

      // 2. Gửi thông báo initialized notification
      this._sendJsonRpcNotification(serverEntry, 'notifications/initialized', {});
    } catch (initErr) {
      console.warn(`[McpRouter] ⚠️ Bắt tay initialize với server [${key}] có cảnh báo: ${initErr.message}`);
    }

    // 3. Gửi yêu cầu tools/list
    const listResult = await this._sendJsonRpc(serverEntry, 'tools/list', {});
    if (listResult && Array.isArray(listResult.tools)) {
      for (const t of listResult.tools) {
        this.toolsRegistry.set(t.name, {
          serverKey: key,
          schema: t
        });
        console.log(`   + [Tool Loaded]: ${t.name} (từ ${key})`);
      }
    }
  }

  /**
   * Gửi thông báo JSON-RPC 2.0 (không cần chờ id phản hồi)
   */
  _sendJsonRpcNotification(serverEntry, method, params = {}) {
    const notification = {
      jsonrpc: '2.0',
      method,
      params
    };
    try {
      serverEntry.process.stdin.write(JSON.stringify(notification) + '\n');
    } catch (err) {
      console.warn(`[McpRouter] ⚠️ Lỗi gửi notification ${method} tới server ${serverEntry.key}:`, err.message);
    }
  }

  /**
   * Gửi thông điệp JSON-RPC 2.0 tới tiến trình con
   */
  _sendJsonRpc(serverEntry, method, params = {}, timeoutMs = 30000) {
    return new Promise((resolve, reject) => {
      const id = this.requestIdCounter++;
      const request = {
        jsonrpc: '2.0',
        id,
        method,
        params
      };

      const timer = setTimeout(() => {
        if (serverEntry.pendingRequests.has(id)) {
          serverEntry.pendingRequests.delete(id);
          reject(new Error(`Timeout (${timeoutMs}ms) khi gọi ${method} trên server ${serverEntry.key}`));
        }
      }, timeoutMs);

      serverEntry.pendingRequests.set(id, { resolve, reject, timer });

      try {
        serverEntry.process.stdin.write(JSON.stringify(request) + '\n');
      } catch (err) {
        clearTimeout(timer);
        serverEntry.pendingRequests.delete(id);
        reject(err);
      }
    });
  }

  /**
   * Thực thi một công cụ theo tên và tham số
   */
  async executeTool(toolName, args = {}) {
    const entry = this.toolsRegistry.get(toolName);
    if (!entry) {
      throw new Error(`Không tìm thấy công cụ [${toolName}] trong danh mục MCP.`);
    }

    const serverEntry = this.serverProcesses.get(entry.serverKey);
    if (!serverEntry) {
      throw new Error(`Server [${entry.serverKey}] cung cấp công cụ [${toolName}] hiện không hoạt động.`);
    }

    console.log(`[McpRouter] ⚡ Đang thực thi [${toolName}] qua server [${entry.serverKey}]...`);
    const result = await this._sendJsonRpc(serverEntry, 'tools/call', {
      name: toolName,
      arguments: args
    });

    return result;
  }

  /**
   * Chuyển đổi danh sách tools sang định dạng OpenAI Tools Schema cho 9Router
   */
  getOpenAiToolsList() {
    const openAiTools = [];
    for (const [name, entry] of this.toolsRegistry.entries()) {
      const schema = entry.schema;
      openAiTools.push({
        type: 'function',
        function: {
          name: schema.name,
          description: schema.description || `Công cụ ${schema.name}`,
          parameters: schema.inputSchema || { type: 'object', properties: {} }
        }
      });
    }
    return openAiTools;
  }

  /**
   * Tắt toàn bộ tiến trình
   */
  shutdown() {
    for (const [key, entry] of this.serverProcesses.entries()) {
      try {
        console.log(`[McpRouter] 🛑 Đang tắt server [${key}]...`);
        entry.process.kill();
      } catch (e) {}
    }
    this.serverProcesses.clear();
    this.toolsRegistry.clear();
  }
}

module.exports = { McpRouter };

// Test độc lập nếu chạy trực tiếp
if (require.main === module) {
  const router = new McpRouter({
    mcpConfigPath: 'C:\\Users\\game\\.gemini\\config\\mcp_config.json',
    enabledServers: ['cdp-bridge', 'ai-engineering-team', 'aider-bridge']
  });

  router.initialize().then(() => {
    console.log('\n✓ Danh sách OpenAI Tools format:');
    console.log(JSON.stringify(router.getOpenAiToolsList().slice(0, 2), null, 2));
    router.shutdown();
  }).catch(err => {
    console.error('❌ Lỗi:', err);
    router.shutdown();
  });
}
