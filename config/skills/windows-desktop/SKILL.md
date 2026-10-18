---
name: windows-desktop
description: >-
  Cẩm nang chuyên gia & Động cơ Tự động hóa Ứng dụng Máy tính Để bàn Windows (Windows Desktop & UI Automation MCP Super-Engine v2.0).
  Tự động kích hoạt khi người dùng muốn:
    - Truy cập, đọc nội dung hoặc điều khiển các ứng dụng Desktop đang mở trên Windows (như Codex, Claude Desktop, Cursor, VS Code, Telegram, Zalo, v.v.)
    - Quét danh sách cửa sổ đang mở (HWND, PID, tiêu đề, tọa độ)
    - Đọc cây cấu trúc giao diện Windows UI Automation (UIA Tree) và nhập văn bản/nhấp chuột trực tiếp vào Desktop App
---

# 🖥️ Windows Desktop & UI Automation MCP Super-Engine v2.0 (`windows-desktop`)

> **Vị trí MCP Server**: [`config/sidecars/windows-desktop/windows_desktop_mcp_server.js`](file:///C:/Users/game/.gemini/config/sidecars/windows-desktop/windows_desktop_mcp_server.js)  
> **Cấu hình Toàn cục**: [`config/mcp_config.json`](file:///C:/Users/game/.gemini/config/mcp_config.json) (`mcpServers.windows-desktop`)

---

## 1. Bản Chất Kiến Trúc (`Architectural Essence`)
Kết hợp trực tiếp **Win32 User32 API (`EnumWindows`, `AttachThreadInput`, `SetForegroundWindow`, `mouse_event`)** và **`.NET Windows UI Automation (`System.Windows.Automation.AutomationElement`)`** để giúp Antigravity 2.0 nhìn thấy, đọc hiểu cấu trúc phần tử và điều khiển mọi ứng dụng Desktop đang mở trên Windows (kể cả các ứng dụng không mở cổng Chrome CDP).

---

## 2. Danh Mục 7 Công Cụ MCP (`MCP Tools`) & Lệnh CLI Trực Tiếp

Có thể gọi qua `call_mcp_tool` (`ServerName: "windows-desktop"`) hoặc gọi trực tiếp qua CLI:
```powershell
node "C:\Users\game\.gemini\config\sidecars\windows-desktop\windows_desktop_mcp_server.js" --cli <tool_name> '<json_args>'
```

1. **`desktop_list_windows`**: Liệt kê toàn bộ cửa sổ Desktop đang mở (`hwnd`, `pid`, `processName`, `title`, `bounds`).
2. **`desktop_inspect_ui_tree`**: Đọc cây phần tử giao diện (`UI Automation Tree`: `Button`, `Edit`, `Document`, `Text`, `ValuePattern`, `TextPattern`) của cửa sổ mục tiêu.
3. **`desktop_focus_window`**: Đưa cửa sổ ứng dụng Desktop lên tiền cảnh (`Restore` + `ForceForeground`).
4. **`desktop_click`**: Nhấp chuột theo tọa độ `(x, y)` hoặc tự động định vị tâm phần tử theo `elementName` / `automationId`.
5. **`desktop_type_text`**: Nhập văn bản tiếng Việt / tiếng Anh / Code vào ứng dụng qua cơ chế `Clipboard Paste` chuẩn xác, hỗ trợ `pressEnter: true`.
6. **`desktop_send_keys`**: Gửi phím tắt chuẩn `SendKeys` (`{ENTER}`, `^c`, `^v`, `{ESC}`, `+{ENTER}`).
7. **`desktop_capture_window`**: Chụp ảnh màn hình (`PNG`) của riêng cửa sổ ứng dụng mục tiêu.
