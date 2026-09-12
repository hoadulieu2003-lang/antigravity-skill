"""
Photoshop COM Persistent Daemon for Antigravity
Maintains a persistent COM connection to Adobe Photoshop 2024 to eliminate
cold-start overhead and bypass Windows COM SINGLEUSE instantiation locks.
"""

import sys
import os
import json
import http.server
import traceback
import win32com.client
import pythoncom

PORT = 8765
ps_app = None

def log_debug(msg):
    try:
        with open("C:/Users/game/ps_daemon_debug.log", "a", encoding="utf-8") as f:
            f.write(str(msg) + "\n")
    except Exception:
        pass

class PhotoshopHandler(http.server.BaseHTTPRequestHandler):
    def log_message(self, format, *args):
        pass

    def do_GET(self):
        global ps_app
        pythoncom.CoInitialize()
        if self.path == "/status" or self.path == "/":
            try:
                jsx = """
                (function() {
                    app.displayDialogs = DialogModes.NO;
                    var info = {
                        name: app.name,
                        version: app.version,
                        documentsCount: app.documents.length,
                        activeDoc: null
                    };
                    if (app.documents.length > 0) {
                        info.activeDoc = {
                            name: app.activeDocument.name,
                            width: app.activeDocument.width.as('px'),
                            height: app.activeDocument.height.as('px'),
                            resolution: app.activeDocument.resolution,
                            layersCount: app.activeDocument.layers.length
                        };
                    }
                    return JSON.stringify(info);
                })();
                """
                res = ps_app.DoJavaScript(jsx)
                data = json.loads(res)
                data["daemon_status"] = "running"
                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps(data).encode("utf-8"))
            except Exception as e:
                log_debug(f"GET Error: {traceback.format_exc()}")
                self.send_response(500)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({"status": "error", "message": str(e)}).encode("utf-8"))
        else:
            self.send_response(404)
            self.end_headers()

    def do_POST(self):
        global ps_app
        pythoncom.CoInitialize()
        content_length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(content_length).decode("utf-8")
        
        try:
            req = json.loads(body)
        except Exception:
            req = {}

        if self.path == "/eval_jsx":
            code = req.get("code", "")
            wrapped = f"""
            (function() {{
                app.displayDialogs = DialogModes.NO;
                try {{
                    {code}
                }} catch(e) {{
                    return "JSX_ERROR: " + e.message + " (line " + e.line + ")";
                }}
            }})();
            """
            try:
                res = ps_app.DoJavaScript(wrapped)
                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                is_error = str(res).startswith("JSX_ERROR")
                self.wfile.write(json.dumps({"status": "error" if is_error else "success", "result": str(res)}).encode("utf-8"))
            except Exception as e:
                log_debug(f"POST Error: {traceback.format_exc()}")
                self.send_response(500)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({"status": "error", "message": f"COM execution error: {str(e)}"}).encode("utf-8"))

        elif self.path == "/shutdown":
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"status": "shutting_down"}).encode("utf-8"))
            def terminate():
                import time
                time.sleep(0.5)
                os._exit(0)
            import threading
            threading.Thread(target=terminate).start()
        else:
            self.send_response(404)
            self.end_headers()

def main():
    global ps_app
    pythoncom.CoInitialize()
    log_debug("[Daemon] Initializing Photoshop COM Connection...")
    try:
        ps_app = win32com.client.Dispatch("Photoshop.Application")
        ps_app.DisplayDialogs = 3
        log_debug(f"[Daemon] Connected to Adobe Photoshop {ps_app.Version}")
    except Exception as e:
        log_debug(f"[Daemon] Failed to acquire Photoshop COM: {traceback.format_exc()}")
        sys.exit(1)

    server = http.server.HTTPServer(("127.0.0.1", PORT), PhotoshopHandler)
    log_debug(f"[Daemon] Listening on http://127.0.0.1:{PORT}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()

if __name__ == "__main__":
    main()
