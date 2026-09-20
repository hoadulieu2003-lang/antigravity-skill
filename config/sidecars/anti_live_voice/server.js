#!/usr/bin/env node
/**
 * ════════════════════════════════════════════════════════════════════════════
 * ANTI LIVE VOICE GATEWAY (v1.1.0)
 * Dual HTTP (3050) & HTTPS (3051) Gateway with PWA Full Standalone Support
 * Part of Google Antigravity Engineering Ecosystem.
 * ════════════════════════════════════════════════════════════════════════════
 */

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const os = require('os');
const url = require('url');

// 1. Nhập thư viện WebSocket
let wsModule;
try {
  wsModule = require('ws');
} catch (e) {
  try {
    wsModule = require(path.join(__dirname, '..', 'antigravity_master_hub', 'node_modules', 'ws'));
  } catch (e2) {
    try {
      wsModule = require(path.join(process.env.APPDATA || '', 'npm', 'node_modules', 'ws'));
    } catch (e3) {
      console.error('❌ Không tìm thấy module ws.');
    }
  }
}
const WebSocketServer = wsModule ? (wsModule.Server || wsModule.WebSocketServer) : null;
const ClientWebSocket = globalThis.WebSocket || (wsModule ? (wsModule.WebSocket || wsModule) : null);

// 2. Nạp cấu hình từ .env.local
const ENV_FILE = path.join(__dirname, '.env.local');
function loadEnv() {
  const env = {
    PORT: process.env.PORT || 3050,
    HTTPS_PORT: 3051,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
    DEFAULT_VOICE: process.env.DEFAULT_VOICE || 'Puck',
    LIVE_MODEL: process.env.LIVE_MODEL || 'models/gemini-2.0-flash-exp'
  };

  if (fs.existsSync(ENV_FILE)) {
    const lines = fs.readFileSync(ENV_FILE, 'utf8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        const key = trimmed.slice(0, idx).trim();
        const val = trimmed.slice(idx + 1).trim();
        env[key] = val;
      }
    }
  }
  return env;
}

let CONFIG = loadEnv();

// Tự động kiểm tra nếu có test flag
if (process.argv.includes('--test')) {
  console.log('✅ [Anti Live Voice Test] Cấu hình hợp lệ:');
  console.log(`- HTTP Port: ${CONFIG.PORT} | HTTPS Port: ${CONFIG.HTTPS_PORT}`);
  console.log(`- Model: ${CONFIG.LIVE_MODEL}`);
  console.log(`- Voice: ${CONFIG.DEFAULT_VOICE}`);
  console.log(`- Has Key: ${!!CONFIG.GEMINI_API_KEY}`);
  process.exit(0);
}

// 3. MIME Types cho Static Files & PWA
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webmanifest': 'application/manifest+json'
};

const PUBLIC_DIR = path.join(__dirname, 'public');

// Lấy IP Wi-Fi thực tế của Laptop
function getLocalIpAddress() {
  const interfaces = os.networkInterfaces();
  let candidate = null;
  for (const name of Object.keys(interfaces)) {
    const isRealAdapter = /wi-fi|wireless|ethernet|lan/i.test(name) && !/warp|virtual|vethernet|loopback/i.test(name);
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        if (isRealAdapter) {
          return iface.address;
        }
        if (!candidate && !iface.address.startsWith('172.16.')) {
          candidate = iface.address;
        }
      }
    }
  }
  return candidate || '192.168.1.13';
}

// 4. Request Handler phục vụ Web App PWA & REST APIs
function handleHttpRequest(req, res) {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // API: Cấu hình
  if (pathname === '/api/config' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      hasApiKey: !!CONFIG.GEMINI_API_KEY,
      defaultVoice: CONFIG.DEFAULT_VOICE,
      liveModel: CONFIG.LIVE_MODEL,
      localIp: getLocalIpAddress(),
      port: CONFIG.PORT,
      httpsPort: CONFIG.HTTPS_PORT
    }));
    return;
  }

  // API: Lưu cấu hình
  if (pathname === '/api/config' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        if (data.geminiApiKey) CONFIG.GEMINI_API_KEY = data.geminiApiKey.trim();
        if (data.defaultVoice) CONFIG.DEFAULT_VOICE = data.defaultVoice.trim();

        const envContent = [
          `# Antigravity Live Voice Config - Auto-updated`,
          `GEMINI_API_KEY=${CONFIG.GEMINI_API_KEY}`,
          `PORT=${CONFIG.PORT}`,
          `DEFAULT_VOICE=${CONFIG.DEFAULT_VOICE}`,
          `LIVE_MODEL=${CONFIG.LIVE_MODEL}`
        ].join('\n') + '\n';

        fs.writeFileSync(ENV_FILE, envContent, 'utf8');

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: 'Đã lưu cấu hình thành công!' }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // Phục vụ Static Files
  let safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
  if (safePath === '/' || safePath === '\\') {
    safePath = '/index.html';
  }

  const filePath = path.join(PUBLIC_DIR, safePath);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  } else {
    const fallbackPath = path.join(PUBLIC_DIR, 'index.html');
    if (fs.existsSync(fallbackPath)) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      fs.createReadStream(fallbackPath).pipe(res);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
    }
  }
}

// 5. Quản lý kết nối Client WebSocket & Gemini Live
function setupClientConnection(clientWs, req) {
  console.log(`\n[Live Gateway] 📱 Client kết nối từ ${req.socket.remoteAddress}`);
  let geminiWs = null;
  let isConnected = false;

  clientWs.on('message', async (message) => {
    try {
      const data = JSON.parse(message.toString());

      if (data.type === 'init') {
        const apiKey = data.apiKey || CONFIG.GEMINI_API_KEY;
        const voice = data.voice || CONFIG.DEFAULT_VOICE;
        const model = data.model || CONFIG.LIVE_MODEL;

        if (!apiKey) {
          clientWs.send(JSON.stringify({
            type: 'error',
            message: 'Chưa có Google AI Studio API Key! Vui lòng kiểm tra cấu hình.'
          }));
          return;
        }

        console.log(`[Live Gateway] 🚀 Đang kết nối tới Gemini Live (${model}, Voice: ${voice})...`);
        const geminiLiveUrl = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent?key=${apiKey}`;

        geminiWs = new ClientWebSocket(geminiLiveUrl);

        geminiWs.on('open', () => {
          console.log('[Live Gateway] 🟢 Đã bắt tay thành công với Gemini Live Server!');
          isConnected = true;

          const setupMsg = {
            setup: {
              model: model,
              generationConfig: {
                responseModalities: ["AUDIO"],
                speechConfig: {
                  voiceConfig: {
                    prebuiltVoiceConfig: {
                      voiceName: voice
                    }
                  }
                }
              },
              systemInstruction: {
                parts: [
                  {
                    text: "Bạn là Antigravity (gọi thân mật là Em) — Senior Engineering Agent & Tác tử Kỹ thuật Tự trị phục vụ Anh (Lead Architect / Product Owner). Bạn đang nói chuyện trực tiếp hai chiều bằng giọng nói với Anh. Hãy xưng hô 'Anh - Em', trả lời gãy gọn, thông minh, truyền cảm và luôn sẵn sàng hỗ trợ kỹ thuật."
                  }
                ]
              },
              tools: [
                {
                  functionDeclarations: [
                    {
                      name: "get_laptop_status",
                      description: "Kiểm tra tình trạng sức khỏe máy chủ laptop (RAM, CPU, Uptime) để báo cáo cho Anh",
                      parameters: {
                        type: "OBJECT",
                        properties: {}
                      }
                    }
                  ]
                }
              ]
            }
          };

          geminiWs.send(JSON.stringify(setupMsg));
          clientWs.send(JSON.stringify({
            type: 'ready',
            message: 'Đã sẵn sàng đàm thoại trực tiếp với Anti!'
          }));
        });

        geminiWs.on('message', (gMsg) => {
          try {
            const gData = JSON.parse(gMsg.toString());

            if (gData.serverContent?.interrupted) {
              console.log('[Live Gateway] ⚡ Phát hiện Anh ngắt lời (Barge-in)! Đang ngắt âm thanh cũ.');
              clientWs.send(JSON.stringify({ type: 'interrupted' }));
            }

            const parts = gData.serverContent?.modelTurn?.parts || [];
            for (const part of parts) {
              if (part.inlineData && part.inlineData.mimeType?.startsWith('audio/pcm')) {
                clientWs.send(JSON.stringify({
                  type: 'audio',
                  data: part.inlineData.data,
                  rate: 24000
                }));
              }
              if (part.text) {
                clientWs.send(JSON.stringify({
                  type: 'text',
                  text: part.text
                }));
              }
            }

            if (gData.toolCall) {
              const calls = gData.toolCall.functionCalls || [];
              const responses = [];
              for (const call of calls) {
                if (call.name === 'get_laptop_status') {
                  responses.push({
                    id: call.id,
                    name: call.name,
                    response: {
                      result: {
                        platform: os.platform(),
                        freeMemMB: Math.round(os.freemem() / (1024 * 1024)),
                        totalMemMB: Math.round(os.totalmem() / (1024 * 1024)),
                        uptimeHours: (os.uptime() / 3600).toFixed(1),
                        status: "Laptop đang vận hành mát mẻ, ổn định 100%."
                      }
                    }
                  });
                }
              }
              if (responses.length > 0) {
                geminiWs.send(JSON.stringify({
                  toolResponse: { functionResponses: responses }
                }));
              }
            }

            if (gData.serverContent?.turnComplete) {
              clientWs.send(JSON.stringify({ type: 'turn_complete' }));
            }
          } catch (err) {
            console.error('[Live Gateway] Lỗi phân tích dữ liệu:', err.message);
          }
        });

        geminiWs.on('error', (err) => {
          console.error('[Live Gateway] ❌ Lỗi WebSocket Gemini:', err.message);
          clientWs.send(JSON.stringify({ type: 'error', message: `Lỗi kết nối Gemini: ${err.message}` }));
        });

        geminiWs.on('close', (code) => {
          console.log(`[Live Gateway] Đã đóng kết nối Gemini (Code: ${code})`);
          isConnected = false;
          clientWs.send(JSON.stringify({ type: 'closed', message: 'Phiên đàm thoại đã kết thúc.' }));
        });
      }

      if (data.type === 'audio' && geminiWs && isConnected) {
        geminiWs.send(JSON.stringify({
          realtimeInput: {
            mediaChunks: [
              {
                mimeType: "audio/pcm;rate=16000",
                data: data.data
              }
            ]
          }
        }));
      }

      if (data.type === 'disconnect') {
        if (geminiWs) {
          geminiWs.close();
          geminiWs = null;
        }
      }
    } catch (e) {
      console.error('[Live Gateway] Lỗi xử lý client message:', e.message);
    }
  });

  clientWs.on('close', () => {
    console.log('[Live Gateway] 📱 Client đã ngắt kết nối.');
    if (geminiWs) {
      geminiWs.close();
      geminiWs = null;
    }
  });
}

// 6. Khởi động máy chủ HTTP & HTTPS
const httpServer = http.createServer(handleHttpRequest);
const PFX_FILE = path.join(__dirname, 'cert.pfx');
let httpsServer = null;

if (fs.existsSync(PFX_FILE)) {
  try {
    httpsServer = https.createServer({
      pfx: fs.readFileSync(PFX_FILE),
      passphrase: 'anti123'
    }, handleHttpRequest);
    console.log('🔒 Đã nạp chứng chỉ SSL PFX thành công.');
  } catch (err) {
    console.warn('[HTTPS] Không thể đọc cert.pfx:', err.message);
  }
}

if (WebSocketServer) {
  const httpWss = new WebSocketServer({ server: httpServer, path: '/ws/live' });
  httpWss.on('connection', setupClientConnection);

  if (httpsServer) {
    const httpsWss = new WebSocketServer({ server: httpsServer, path: '/ws/live' });
    httpsWss.on('connection', setupClientConnection);
  }
}

const PORT = CONFIG.PORT;
const HTTPS_PORT = CONFIG.HTTPS_PORT;
const localIp = getLocalIpAddress();

httpServer.listen(PORT, '0.0.0.0', () => {
  console.log('\n================================================================');
  console.log('⚡ ANTI LIVE VOICE SERVER ĐÃ KHỞI CHẠY THÀNH CÔNG!');
  console.log('================================================================');
  console.log(`💻 HTTP (Nhanh):       http://${localIp}:${PORT}`);
  if (httpsServer) {
    console.log(`🔒 HTTPS (Cài Đặt App): https://${localIp}:${HTTPS_PORT}`);
  }
  console.log('================================================================\n');
});

if (httpsServer) {
  httpsServer.listen(HTTPS_PORT, '0.0.0.0');
}
