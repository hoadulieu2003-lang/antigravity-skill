/**
 * ════════════════════════════════════════════════════════════════════════════
 * ANTIGRAVITY MASTER MCP HUB — SYSTEM EXECUTION TOOLS
 * Cung cấp các công cụ thực thi hệ thống cho AI:
 * - Terminal Runner (PowerShell CLI execution)
 * - File System Operations (read, write, edit, list)
 * - Native Desktop Screenshot Engine (screenshot-desktop)
 * ════════════════════════════════════════════════════════════════════════════
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const screenshot = require('screenshot-desktop');

// Thư mục lưu trữ artifact ảnh chụp màn hình
const SCREENSHOT_DIR = 'C:\\Users\\game\\.gemini\\antigravity-ide\\brain\\fd77714d-97c6-48db-9c07-b7f387af6b39';

/**
 * 1. Chạy lệnh Terminal / PowerShell trên hệ thống
 */
function executeTerminalCommand(args, defaultCwd) {
  const command = args?.command;
  if (!command) {
    throw new Error('Tham số command là bắt buộc!');
  }

  // Khử các lệnh phá hủy nguy hiểm
  const dangerousPatterns = [/format\s+[a-z]:/i, /del\s+\/f\s+\/s\s+\/q\s+c:\\windows/i, /rmdir\s+\/s\s+\/q\s+c:\\windows/i];
  for (const pattern of dangerousPatterns) {
    if (pattern.test(command)) {
      throw new Error(`[Security Alert] Lệnh bị từ chối do có nguy cơ gây hỏng hệ điều hành: ${command}`);
    }
  }

  let cwd = args?.cwd || defaultCwd || process.cwd();
  if (!fs.existsSync(cwd)) {
    cwd = process.cwd();
  }

  const timeoutMs = Math.min((args?.timeoutSeconds || 90) * 1000, 300000);

  return new Promise((resolve) => {
    // Chạy qua PowerShell với cờ ExecutionPolicy Bypass
    exec(command, {
      cwd,
      timeout: timeoutMs,
      shell: 'powershell.exe',
      maxBuffer: 5 * 1024 * 1024 // 5MB buffer
    }, (error, stdout, stderr) => {
      resolve({
        success: !error,
        command,
        cwd,
        exitCode: error ? (error.code || 1) : 0,
        stdout: stdout ? stdout.trim() : '',
        stderr: stderr ? stderr.trim() : '',
        errorMessage: error ? error.message : null
      });
    });
  });
}

/**
 * 2. Ghi / Tạo mới file mã nguồn
 */
function writeCodeFile(args, defaultCwd) {
  let targetPath = args?.filePath;
  const content = args?.content;

  if (!targetPath) throw new Error('Tham số filePath là bắt buộc!');
  if (content === undefined || content === null) throw new Error('Tham số content là bắt buộc!');

  if (!path.isAbsolute(targetPath)) {
    targetPath = path.resolve(defaultCwd || process.cwd(), targetPath);
  }

  const parentDir = path.dirname(targetPath);
  if (!fs.existsSync(parentDir)) {
    fs.mkdirSync(parentDir, { recursive: true });
  }

  fs.writeFileSync(targetPath, content, 'utf8');
  const stats = fs.statSync(targetPath);

  return {
    success: true,
    filePath: targetPath,
    bytesWritten: stats.size,
    message: `Đã ghi thành công file: ${path.basename(targetPath)} (${stats.size} bytes)`
  };
}

/**
 * 3. Đọc nội dung file mã nguồn
 */
function readCodeFile(args, defaultCwd) {
  let targetPath = args?.filePath;
  if (!targetPath) throw new Error('Tham số filePath là bắt buộc!');

  if (!path.isAbsolute(targetPath)) {
    targetPath = path.resolve(defaultCwd || process.cwd(), targetPath);
  }

  if (!fs.existsSync(targetPath)) {
    throw new Error(`File không tồn tại: ${targetPath}`);
  }

  const content = fs.readFileSync(targetPath, 'utf8');
  const lines = content.split('\n');

  const startLine = Math.max(1, args?.startLine || 1);
  const maxLines = Math.min(args?.maxLines || 400, 800);
  const selectedLines = lines.slice(startLine - 1, startLine - 1 + maxLines);

  return {
    success: true,
    filePath: targetPath,
    totalLines: lines.length,
    startLine,
    lineCountReturned: selectedLines.length,
    content: selectedLines.join('\n')
  };
}

/**
 * 4. Chỉnh sửa nội dung file chính xác (Search & Replace)
 */
function editCodeFile(args, defaultCwd) {
  let targetPath = args?.filePath;
  const targetContent = args?.targetContent;
  const replacementContent = args?.replacementContent;

  if (!targetPath) throw new Error('Tham số filePath là bắt buộc!');
  if (!targetContent) throw new Error('Tham số targetContent là bắt buộc!');
  if (replacementContent === undefined || replacementContent === null) throw new Error('Tham số replacementContent là bắt buộc!');

  if (!path.isAbsolute(targetPath)) {
    targetPath = path.resolve(defaultCwd || process.cwd(), targetPath);
  }

  if (!fs.existsSync(targetPath)) {
    throw new Error(`File không tồn tại: ${targetPath}`);
  }

  const original = fs.readFileSync(targetPath, 'utf8');
  if (!original.includes(targetContent)) {
    throw new Error(`Không tìm thấy đoạn mã targetContent trong file: ${path.basename(targetPath)}`);
  }

  const updated = original.replace(targetContent, replacementContent);
  fs.writeFileSync(targetPath, updated, 'utf8');

  return {
    success: true,
    filePath: targetPath,
    message: `Đã thay thế và cập nhật thành công file: ${path.basename(targetPath)}`
  };
}

/**
 * 5. Duyệt thư mục dự án
 */
function listDirectory(args, defaultCwd) {
  let targetDir = args?.directoryPath || defaultCwd || process.cwd();

  if (!path.isAbsolute(targetDir)) {
    targetDir = path.resolve(defaultCwd || process.cwd(), targetDir);
  }

  if (!fs.existsSync(targetDir)) {
    throw new Error(`Thư mục không tồn tại: ${targetDir}`);
  }

  const items = fs.readdirSync(targetDir, { withFileTypes: true });
  const entries = items.slice(0, 100).map(item => {
    const full = path.join(targetDir, item.name);
    let size = 0;
    try {
      if (item.isFile()) size = fs.statSync(full).size;
    } catch (e) {}

    return {
      name: item.name,
      isDirectory: item.isDirectory(),
      sizeBytes: size
    };
  });

  return {
    success: true,
    directoryPath: targetDir,
    totalEntries: items.length,
    entries
  };
}

/**
 * 6. Chụp ảnh màn hình Desktop thật (GDI BitBlt trên Default Desktop của Anh)
 */
function takeDesktopScreenshot(args) {
  if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  }

  const timestamp = Date.now();
  const filename = `telegram_screen_${timestamp}.png`;
  const outputPath = args?.savePath || path.join(SCREENSHOT_DIR, filename);
  const scriptPath = path.join(__dirname, 'thread_desktop_capture.ps1');

  return new Promise((resolve, reject) => {
    const cmd = `powershell.exe -ExecutionPolicy Bypass -File "${scriptPath}" -outputPath "${outputPath}"`;
    exec(cmd, { timeout: 15000 }, (error, stdout, stderr) => {
      if (error) {
        return reject(new Error(`Lỗi chụp màn hình: ${error.message} - ${stderr}`));
      }
      if (!fs.existsSync(outputPath)) {
        return reject(new Error(`Không tìm thấy file ảnh sau khi chụp: ${stdout}`));
      }
      const stats = fs.statSync(outputPath);
      resolve({
        success: true,
        screenshotPath: outputPath,
        filename: path.basename(outputPath),
        sizeBytes: stats.size,
        message: `Đã chụp ảnh màn hình máy tính thật thành công (${Math.round(stats.size / 1024)} KB) - ${stdout.trim()}`
      });
    });
  });
}

/**
 * Danh sách đặc tả JSON Schema tương thích OpenAI Tools
 */
const SYSTEM_TOOLS_SPEC = [
  {
    type: "function",
    function: {
      name: "execute_terminal_command",
      description: "Chạy một lệnh Terminal / PowerShell trên máy tính (ví dụ: npm run build, npm test, git status, node script.js, python test.py). Dùng khi Anh yêu cầu build module, chạy kiểm thử hoặc xem log hệ thống.",
      parameters: {
        type: "object",
        properties: {
          command: {
            type: "string",
            description: "Lệnh PowerShell/CMD cần thực thi (ví dụ: 'npm run build', 'git status --short')"
          },
          cwd: {
            type: "string",
            description: "Đường dẫn thư mục làm việc. Bỏ trống sẽ dùng mặc định là workspace của dự án."
          },
          timeoutSeconds: {
            type: "number",
            description: "Thời gian chờ tối đa (giây). Mặc định 90s."
          }
        },
        required: ["command"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "write_code_file",
      description: "Tạo mới hoặc ghi đè toàn bộ nội dung file mã nguồn trong dự án. Dùng khi Anh yêu cầu tạo module mới, tạo component hoặc viết mã nguồn hoàn chỉnh.",
      parameters: {
        type: "object",
        properties: {
          filePath: {
            type: "string",
            description: "Đường dẫn file (tuyệt đối hoặc tương đối so với workspace dự án)."
          },
          content: {
            type: "string",
            description: "Nội dung code đầy đủ cần ghi vào file."
          }
        },
        required: ["filePath", "content"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "read_code_file",
      description: "Đọc nội dung một file mã nguồn trong hệ thống. Dùng khi cần kiểm tra code hiện có trước khi sửa hoặc build.",
      parameters: {
        type: "object",
        properties: {
          filePath: {
            type: "string",
            description: "Đường dẫn file cần đọc."
          },
          startLine: {
            type: "number",
            description: "Dòng bắt đầu đọc (1-indexed). Mặc định 1."
          },
          maxLines: {
            type: "number",
            description: "Số dòng tối đa cần đọc. Mặc định 400."
          }
        },
        required: ["filePath"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "edit_code_file",
      description: "Chỉnh sửa một phần nội dung trong file mã nguồn bằng cách tìm và thay thế đoạn text chính xác (Search & Replace).",
      parameters: {
        type: "object",
        properties: {
          filePath: {
            type: "string",
            description: "Đường dẫn file cần chỉnh sửa."
          },
          targetContent: {
            type: "string",
            description: "Đoạn text/code gốc chính xác cần thay thế."
          },
          replacementContent: {
            type: "string",
            description: "Đoạn text/code mới thay thế vào."
          }
        },
        required: ["filePath", "targetContent", "replacementContent"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "list_directory",
      description: "Liệt kê các tệp và thư mục con trong một đường dẫn để khảo sát cấu trúc dự án.",
      parameters: {
        type: "object",
        properties: {
          directoryPath: {
            type: "string",
            description: "Đường dẫn thư mục. Bỏ trống sẽ lấy thư mục workspace dự án."
          }
        }
      }
    }
  },
  {
    type: "function",
    function: {
      name: "take_desktop_screenshot",
      description: "Chụp ảnh màn hình máy tính thật (Desktop Screenshot) và tự động gửi bức ảnh về điện thoại của Anh qua Telegram. Kích hoạt ngay khi Anh yêu cầu: 'chụp màn hình', 'chụp desktop', 'xem màn hình hiện tại'.",
      parameters: {
        type: "object",
        properties: {
          savePath: {
            type: "string",
            description: "Đường dẫn lưu file ảnh tùy chọn. Bỏ trống sẽ tự sinh trong artifacts."
          }
        }
      }
    }
  }
];

module.exports = {
  executeTerminalCommand,
  writeCodeFile,
  readCodeFile,
  editCodeFile,
  listDirectory,
  takeDesktopScreenshot,
  SYSTEM_TOOLS_SPEC
};
