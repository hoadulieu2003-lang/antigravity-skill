#!/usr/bin/env node
/**
 * ════════════════════════════════════════════════════════════════════════════
 * SCRIPT FACTORY PRO — CDP NATIVE MCP SERVER (Stdio JSON-RPC 2.0)
 * Model Context Protocol Engine for Chrome Remote Debugging & Google Flow
 * ════════════════════════════════════════════════════════════════════════════
 */

const readline = require('readline');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');
const { generateRepoMap, findSymbolInRepo } = require('./ast_repo_map');

// Cache browser connections
const browserCache = {};

/**
 * Connect or reuse Puppeteer CDP connection with auto-fallback
 */
async function getConnectedFlowPage(port = 9222) {
  let targetPort = port;
  let browser = browserCache[targetPort];

  if (!browser || !browser.connected) {
    try {
      browser = await puppeteer.connect({
        browserURL: `http://127.0.0.1:${targetPort}`,
        defaultViewport: null
      });
      browserCache[targetPort] = browser;
    } catch (err1) {
      const fallbackPort = targetPort === 9222 ? 9223 : 9222;
      try {
        targetPort = fallbackPort;
        browser = await puppeteer.connect({
          browserURL: `http://127.0.0.1:${targetPort}`,
          defaultViewport: null
        });
        browserCache[targetPort] = browser;
      } catch (err2) {
        throw new Error(`Không thể kết nối Chrome Remote Debugging tại port ${port} lẫn port ${fallbackPort}. Vui lòng mở Chrome Debug trước!`);
      }
    }
  }

  const pages = await browser.pages();
  let flowPage = pages.find(p => p.url().includes('labs.google/fx'));

  if (!flowPage) {
    if (pages.length > 0) {
      flowPage = pages[0];
    } else {
      flowPage = await browser.newPage();
      await flowPage.goto('https://labs.google/fx/vi/tools/flow', { waitUntil: 'networkidle2' });
    }
  }

  return { browser, flowPage, activePort: targetPort };
}

async function findToolFrame(flowPage) {
  const frames = flowPage.frames();
  for (const f of frames) {
    try {
      const hasApplet = await f.evaluate(() => {
        return !!document.querySelector('textarea') || !!window.__FLOW04_READY__ || !!window.__FLOW_APPLET_READY__;
      });
      if (hasApplet) return f;
    } catch (e) {}
  }
  return frames.find(f => {
    const u = f.url();
    return u === 'about:srcdoc' || u.includes('flow-applet') || u.includes('scf.usercontent.goog') || u.startsWith('blob:');
  }) || null;
}

/**
 * TOOL 1: Inspect Deep State & React Fiber
 */
async function handleInspectState(args) {
  const port = args?.port || 9222;
  const { flowPage, activePort } = await getConnectedFlowPage(port);
  const appFrame = await findToolFrame(flowPage);

  const pageInfo = {
    connectedPort: activePort,
    pageTitle: await flowPage.title(),
    pageUrl: flowPage.url(),
    hasToolFrame: !!appFrame,
    scenes: [],
    assets: [],
    isStoppedOnError: false,
    hasResumeButton: false,
    visibleButtons: [],
    textareaSnippet: ''
  };

  if (appFrame) {
    const fiberData = await appFrame.evaluate(() => {
      let scenes = [];
      let assets = [];
      const elements = Array.from(document.querySelectorAll('*'));
      
      for (const el of elements) {
        const fiberKey = Object.keys(el).find(k => k.startsWith('__reactFiber$') || k.startsWith('__reactInternalInstance$'));
        if (fiberKey) {
          let fiber = el[fiberKey];
          while (fiber) {
            if (fiber.memoizedState) {
              let s = fiber.memoizedState;
              while (s) {
                if (Array.isArray(s.memoizedState) && s.memoizedState.length > 0) {
                  const arr = s.memoizedState;
                  if (arr[0] && arr[0].sceneId && scenes.length === 0) {
                    scenes = arr.map(i => ({
                      sceneId: i.sceneId,
                      status: i.status,
                      error: i.error || null,
                      mediaId: i.resultMediaId || null,
                      hasVideo: !!(i.videoUrl || i.url || i.mediaUrl || i.resultBase64)
                    }));
                  }
                  if (arr[0] && arr[0].logicalId && assets.length === 0) {
                    assets = arr.map(i => ({
                      id: i.id,
                      logicalId: i.logicalId,
                      type: i.type,
                      status: i.status,
                      error: i.error || null
                    }));
                  }
                }
                s = s.next;
              }
            }
            fiber = fiber.return;
          }
        }
        if (scenes.length > 0 && assets.length > 0) break;
      }

      const text = document.body ? document.body.innerText : '';
      const isStopped = text.includes('STOPPED ON ERROR') || text.includes('Rate limit exceeded');
      const btns = Array.from(document.querySelectorAll('button')).map(b => (b.innerText || '').trim()).filter(Boolean);
      const hasResume = btns.some(t => t.includes('RESUME AUTO PIPELINE'));
      const textarea = document.querySelector('textarea');

      return {
        scenes,
        assets,
        isStoppedOnError: isStopped,
        hasResumeButton: hasResume,
        visibleButtons: btns.slice(0, 15),
        textareaSnippet: textarea ? (textarea.value || '').slice(0, 300) : ''
      };
    });

    Object.assign(pageInfo, fiberData);
  }

  return {
    success: true,
    data: pageInfo
  };
}

/**
 * TOOL 2: Capture Real-time Screenshot
 */
async function handleCaptureScreenshot(args) {
  const port = args?.port || 9222;
  const { flowPage, activePort } = await getConnectedFlowPage(port);
  
  let targetPath = args?.savePath;
  if (!targetPath) {
    const timestamp = Date.now();
    targetPath = path.join('C:\\Users\\game\\.gemini\\antigravity-ide\\brain', `screenshot_flow_${timestamp}.png`);
  }

  // Ensure directory exists
  const parentDir = path.dirname(targetPath);
  if (!fs.existsSync(parentDir)) {
    fs.mkdirSync(parentDir, { recursive: true });
  }

  await flowPage.screenshot({ path: targetPath, fullPage: false });

  return {
    success: true,
    connectedPort: activePort,
    screenshotPath: targetPath,
    message: `Đã chụp ảnh màn hình Chrome thời gian thực lưu tại: ${targetPath}`
  };
}

/**
 * TOOL 3: Inject Screenplay JSON and Activate Auto Render
 */
async function handleInjectAndRender(args) {
  const port = args?.port || 9222;
  const scriptPackage = args?.scriptPackage;

  if (!scriptPackage) {
    throw new Error('Tham số scriptPackage (JSON kịch bản) là bắt buộc!');
  }

  const { flowPage, activePort } = await getConnectedFlowPage(port);
  let appFrame = await findToolFrame(flowPage);

  if (!appFrame) {
    // Navigate or click to open tool
    await flowPage.evaluate(() => {
      const all = Array.from(document.querySelectorAll('*'));
      const batchBtn = all.find(e => e.innerText && e.innerText.trim().toLowerCase() === 'batch video final' && e.offsetParent !== null);
      if (batchBtn) batchBtn.click();
    });
    await new Promise(r => setTimeout(r, 2000));
    appFrame = await findToolFrame(flowPage);
  }

  if (!appFrame) {
    throw new Error('Không tìm thấy iframe công cụ "batch video final" trên trang Google Flow!');
  }

  // 0. Xóa sạch toàn bộ trạng thái cũ (Clean Reset)
  await appFrame.evaluate(() => {
    try {
      window.dispatchEvent(new CustomEvent('AUTOPILOT_CLEAR_ALL_STATE'));
    } catch (e) {}
    const textarea = document.querySelector('textarea');
    if (textarea) {
      textarea.value = '';
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
    }
  });
  await new Promise(r => setTimeout(r, 200));

  // 1. Paste JSON into textarea
  const pasted = await appFrame.evaluate((jsonStr) => {
    try {
      window.dispatchEvent(new CustomEvent('AUTOPILOT_INJECT_PAYLOAD', { detail: JSON.parse(jsonStr) }));
    } catch (e) {}
    const textarea = document.querySelector('textarea');
    if (!textarea) return false;
    const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')?.set;
    if (nativeSetter) {
      nativeSetter.call(textarea, jsonStr);
    } else {
      textarea.value = jsonStr;
    }
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
    textarea.dispatchEvent(new Event('change', { bubbles: true }));
    textarea.dispatchEvent(new Event('blur', { bubbles: true }));
    return true;
  }, JSON.stringify(scriptPackage, null, 2));

  if (!pasted) {
    throw new Error('Không tìm thấy textarea nhập liệu JSON trong batch video final');
  }

  await new Promise(r => setTimeout(r, 1000));

  // 2. Click AUTO button
  const clickedAuto = await appFrame.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const autoBtn = btns.find(b => b.innerText && b.innerText.trim() === 'AUTO');
    if (autoBtn && !autoBtn.disabled) {
      autoBtn.click();
      return true;
    }
    return false;
  });

  await new Promise(r => setTimeout(r, 1000));

  // 3. Enable Download
  const enabledDownload = await appFrame.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const dlBtn = btns.find(b => b.innerText && (b.innerText.includes('DISABLED') || b.innerText.includes('TỰ ĐỘNG TẢI XUỐNG')));
    if (dlBtn && dlBtn.innerText.includes('DISABLED')) {
      dlBtn.click();
      return true;
    }
    return false;
  });

  return {
    success: true,
    connectedPort: activePort,
    pastedJson: true,
    clickedAuto,
    enabledDownload,
    message: `Đã nạp kịch bản "${scriptPackage.title || 'Untitled'}" (${scriptPackage.scenes?.length || 0} Scenes) và kích hoạt chế độ AUTO thành công!`
  };
}

/**
 * TOOL 4: Click Button in Page or Frame
 */
async function handleClickButton(args) {
  const port = args?.port || 9222;
  const buttonText = (args?.buttonText || '').trim().toLowerCase();

  if (!buttonText) {
    throw new Error('Tham số buttonText là bắt buộc!');
  }

  const { flowPage, activePort } = await getConnectedFlowPage(port);
  const appFrame = await findToolFrame(flowPage);

  const clickTarget = async (frameOrPage) => {
    return await frameOrPage.evaluate((targetText) => {
      const candidates = Array.from(document.querySelectorAll('button, a, div[role="button"], span'));
      const found = candidates.find(el => {
        const text = (el.innerText || el.textContent || '').trim().toLowerCase();
        return text.includes(targetText) && el.offsetParent !== null;
      });
      if (found) {
        found.click();
        return { clicked: true, text: (found.innerText || '').trim() };
      }
      return { clicked: false };
    }, buttonText);
  };

  let res = { clicked: false };
  if (appFrame) {
    res = await clickTarget(appFrame);
  }
  if (!res.clicked) {
    res = await clickTarget(flowPage);
  }

  return {
    success: res.clicked,
    connectedPort: activePort,
    buttonText,
    matchedText: res.text || null,
    message: res.clicked ? `Đã click thành công nút: "${res.text}"` : `Không tìm thấy nút bấm chứa text: "${buttonText}"`
  };
}

/**
 * TOOL 5: Execute Custom JavaScript in Browser
 */
async function handleEvaluateScript(args) {
  const port = args?.port || 9222;
  const script = args?.script;
  const targetFrame = args?.targetFrame || 'tool';

  if (!script) {
    throw new Error('Tham số script (mã JavaScript) là bắt buộc!');
  }

  const { flowPage, activePort } = await getConnectedFlowPage(port);
  const appFrame = await findToolFrame(flowPage);

  let result;
  if (targetFrame === 'tool' && appFrame) {
    result = await appFrame.evaluate(new Function(script));
  } else {
    result = await flowPage.evaluate(new Function(script));
  }

  return {
    success: true,
    connectedPort: activePort,
    frame: targetFrame,
    result: result !== undefined ? result : null
  };
}

/**
 * TOOL 6: Generate AST Codebase Repo Map
 */
async function handleGetAstRepoMap(args) {
  const defaultRoot = path.resolve(__dirname, '..');
  const targetDir = args?.targetDir || defaultRoot;
  const maxDepth = args?.maxDepth || 4;
  const includeSignatures = args?.includeSignatures !== false;

  const result = generateRepoMap(targetDir, { maxDepth, includeSignatures });
  return {
    success: true,
    targetDir,
    fileCount: result.fileCount,
    symbolCount: result.symbolCount,
    repoMapMarkdown: result.raw
  };
}

/**
 * TOOL 7: Search Code Symbols across Repo
 */
async function handleSearchCodeSymbols(args) {
  const defaultRoot = path.resolve(__dirname, '..');
  const targetDir = args?.targetDir || defaultRoot;
  const query = args?.query;

  if (!query) {
    throw new Error('Tham số query (tên class, hàm, interface cần tìm) là bắt buộc!');
  }

  const matches = findSymbolInRepo(targetDir, query);
  return {
    success: true,
    query,
    targetDir,
    matchCount: matches.length,
    matches: matches.slice(0, 50)
  };
}

/**
 * TOOL 8: Send Notification to Telegram on Mobile
 */
async function handleSendTelegramNotification(args) {
  const message = args?.message;
  const title = args?.title || 'THÔNG BÁO TỪ ANTIGRAVITY';
  const photoPath = args?.photoPath || null;

  if (!message) {
    throw new Error('Tham số message (nội dung thông báo) là bắt buộc!');
  }

  const notifierPath = 'c:\\Users\\game\\Documents\\app\\script factory final\\telegram_bridge\\telegram_notifier.cjs';
  if (!fs.existsSync(notifierPath)) {
    throw new Error(`Không tìm thấy module telegram_notifier.cjs tại: ${notifierPath}`);
  }

  const { sendTelegramAlert } = require(notifierPath);
  const res = await sendTelegramAlert({ title, message, photoPath });

  return {
    success: true,
    sentTo: 'Telegram Mobile',
    title,
    message,
    hasPhoto: !!photoPath,
    telegramResponse: res
  };
}

// ════════════════════════════════════════════════════════════════════════════
// MCP DEFINITIONS & DISPATCHER
// ════════════════════════════════════════════════════════════════════════════

const TOOLS = [
  {
    name: "cdp_inspect_state",
    description: "Đọc trạng thái thời gian thực của Google Flow trên Chrome: cấu trúc React Fiber Scenes/Assets, tiến độ render Veo 3.1, lỗi Rate limit và danh sách nút bấm.",
    inputSchema: {
      type: "object",
      properties: {
        port: {
          type: "number",
          description: "Port Chrome Remote Debugging (mặc định: 9222, tự động fallback sang 9223)"
        }
      }
    }
  },
  {
    name: "cdp_capture_screenshot",
    description: "Chụp ảnh màn hình Chrome thực tế và lưu vào file để Agent/Anh xem trực tiếp bằng chứng giao diện.",
    inputSchema: {
      type: "object",
      properties: {
        port: {
          type: "number",
          description: "Port Chrome Remote Debugging (mặc định: 9222)"
        },
        savePath: {
          type: "string",
          description: "Đường dẫn file PNG tuỳ chọn (mặc định lưu vào brain/artifacts)"
        }
      }
    }
  },
  {
    name: "cdp_inject_and_render",
    description: "Dán kịch bản JSON 2.0 vào công cụ batch video final của Google Flow, tự động kích hoạt chế độ AUTO và bật tự động tải xuống video.",
    inputSchema: {
      type: "object",
      properties: {
        scriptPackage: {
          type: "object",
          description: "Đối tượng JSON Screenplay chuẩn 2.0 đầy đủ các Scenes, Prompts và Style"
        },
        port: {
          type: "number",
          description: "Port Chrome Remote Debugging (mặc định: 9222)"
        }
      },
      required: ["scriptPackage"]
    }
  },
  {
    name: "cdp_click_button",
    description: "Bấm một nút bất kỳ trên trang hoặc trong iframe công cụ theo chuỗi text (ví dụ: 'RESUME AUTO PIPELINE', 'AUTO', 'TỰ ĐỘNG TẢI XUỐNG').",
    inputSchema: {
      type: "object",
      properties: {
        buttonText: {
          type: "string",
          description: "Đoạn text của nút cần bấm"
        },
        port: {
          type: "number",
          description: "Port Chrome Remote Debugging (mặc định: 9222)"
        }
      },
      required: ["buttonText"]
    }
  },
  {
    name: "cdp_evaluate_script",
    description: "Thực thi đoạn mã JavaScript tuỳ biến trực tiếp trong tab Google Flow hoặc trong iframe công cụ about:srcdoc.",
    inputSchema: {
      type: "object",
      properties: {
        script: {
          type: "string",
          description: "Chuỗi mã JavaScript cần thực thi (phải có return nếu muốn nhận kết quả)"
        },
        targetFrame: {
          type: "string",
          enum: ["tool", "main"],
          description: "Chọn thực thi trong frame công cụ ('tool') hay tab chính ('main')"
        },
        port: {
          type: "number",
          description: "Port Chrome Remote Debugging (mặc định: 9222)"
        }
      },
      required: ["script"]
    }
  },
  {
    name: "get_ast_repo_map",
    description: "Bản đồ kiến trúc nén AST (Aider-style): Quét toàn bộ Class, Interface, Function signatures và API routes của dự án giúp Agent hiểu rõ toàn bộ codebase mà không bị tràn context.",
    inputSchema: {
      type: "object",
      properties: {
        targetDir: {
          type: "string",
          description: "Đường dẫn thư mục dự án cần quét (mặc định: thư mục gốc hệ sinh thái)"
        },
        maxDepth: {
          type: "number",
          description: "Độ sâu quét thư mục (mặc định: 4)"
        },
        includeSignatures: {
          type: "boolean",
          description: "Có bao gồm chi tiết chữ ký hàm/class hay không (mặc định: true)"
        }
      }
    }
  },
  {
    name: "search_code_symbols",
    description: "Truy tìm nhanh vị trí định nghĩa của bất kỳ Hàm, Class, Interface, Type hoặc Route nào trong toàn bộ dự án kèm số dòng và chữ ký kiểu dữ liệu.",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Tên hàm, class, interface hoặc route cần tìm (ví dụ: 'stitchVideoClips', 'handleCopilotChat', 'VideoOrchestrator')"
        },
        targetDir: {
          type: "string",
          description: "Thư mục cần tìm kiếm (mặc định: hệ sinh thái SCRIPT_FACTORY_PRO_ECOSYSTEM)"
        }
      },
      required: ["query"]
    }
  },
  {
    name: "send_telegram_notification",
    description: "Gửi thông báo tức thì, báo cáo nghiệm thu hoặc ảnh chụp màn hình sang điện thoại của Anh qua Telegram.",
    inputSchema: {
      type: "object",
      properties: {
        message: {
          type: "string",
          description: "Nội dung tin nhắn thông báo cần gửi về điện thoại"
        },
        title: {
          type: "string",
          description: "Tiêu đề thông báo (ví dụ: 'RENDER HOÀN TẤT', 'TASK COMPLETE')"
        },
        photoPath: {
          type: "string",
          description: "Đường dẫn file ảnh PNG/JPG đính kèm nếu muốn gửi ảnh"
        }
      },
      required: ["message"]
    }
  }
];

async function handleToolCall(name, args) {
  switch (name) {
    case "cdp_inspect_state":
      return await handleInspectState(args);
    case "cdp_capture_screenshot":
      return await handleCaptureScreenshot(args);
    case "cdp_inject_and_render":
      return await handleInjectAndRender(args);
    case "cdp_click_button":
      return await handleClickButton(args);
    case "cdp_evaluate_script":
      return await handleEvaluateScript(args);
    case "get_ast_repo_map":
      return await handleGetAstRepoMap(args);
    case "search_code_symbols":
      return await handleSearchCodeSymbols(args);
    case "send_telegram_notification":
      return await handleSendTelegramNotification(args);
    default:
      throw new Error(`Tool không tồn tại: ${name}`);
  }
}

// ════════════════════════════════════════════════════════════════════════════
// JSON-RPC 2.0 STDIO TRANSPORT
// ════════════════════════════════════════════════════════════════════════════

function sendJsonRpcResponse(id, result, error = null) {
  const response = {
    jsonrpc: "2.0",
    id: id
  };
  if (error) {
    response.error = error;
  } else {
    response.result = result;
  }
  const str = JSON.stringify(response);
  process.stdout.write(str + "\n");
}

const rl = readline.createInterface({
  input: process.stdin,
  terminal: false
});

rl.on('line', async (line) => {
  const trimmed = line.trim();
  if (!trimmed) return;

  let request;
  try {
    request = JSON.parse(trimmed);
  } catch (e) {
    sendJsonRpcResponse(null, null, { code: -32700, message: "Parse error" });
    return;
  }

  const { id, method, params } = request;

  // Handle Notifications (no ID)
  if (id === undefined || id === null) {
    if (method === "notifications/initialized") {
      // Client ready
    }
    return;
  }

  try {
    switch (method) {
      case "initialize":
        sendJsonRpcResponse(id, {
          protocolVersion: "2024-11-05",
          capabilities: {
            tools: {}
          },
          serverInfo: {
            name: "cdp-bridge-mcp",
            version: "1.0.0"
          }
        });
        break;

      case "ping":
        sendJsonRpcResponse(id, {});
        break;

      case "tools/list":
        sendJsonRpcResponse(id, {
          tools: TOOLS
        });
        break;

      case "tools/call": {
        const toolName = params?.name;
        const toolArgs = params?.arguments || {};
        try {
          const result = await handleToolCall(toolName, toolArgs);
          sendJsonRpcResponse(id, {
            content: [
              {
                type: "text",
                text: JSON.stringify(result, null, 2)
              }
            ]
          });
        } catch (callErr) {
          sendJsonRpcResponse(id, {
            isError: true,
            content: [
              {
                type: "text",
                text: `[CDP MCP Error] ${callErr.message}`
              }
            ]
          });
        }
        break;
      }

      default:
        sendJsonRpcResponse(id, null, {
          code: -32601,
          message: `Method '${method}' not found`
        });
    }
  } catch (globalErr) {
    sendJsonRpcResponse(id, null, {
      code: -32603,
      message: globalErr.message
    });
  }
});

process.stderr.write("[CDP MCP Server] Started and listening on stdio JSON-RPC 2.0\n");
