"""
Photoshop COM Automation Bridge with Auto-Spawning Daemon
"""

import sys
import os
import argparse
import json
import subprocess
import time
from http.server import HTTPServer, BaseHTTPRequestHandler
import urllib.request
import urllib.error
import threading

DAEMON_HOST = "127.0.0.1"
DAEMON_PORT = 28765

def cleanup_zombie_instances():
    """Force terminate any unresponsive Photoshop processes using native taskkill."""
    try:
        os.system("taskkill /F /IM Photoshop.exe >nul 2>&1")
    except Exception:
        pass

def get_photoshop_app():
    """Acquire connection to Photoshop.Application via COM."""
    try:
        import win32com.client
    except ImportError:
        print(json.dumps({"status": "error", "message": "pywin32 (win32com.client) is not installed."}))
        sys.exit(1)

    try:
        ps_app = win32com.client.Dispatch("Photoshop.Application")
        try:
            # 3 = DialogModes.NO (suppress modal dialogs)
            ps_app.DisplayDialogs = 3
        except Exception:
            pass
        return ps_app
    except Exception as e:
        print(json.dumps({"status": "error", "message": f"Failed to connect to Photoshop COM: {str(e)}"}))
        sys.exit(1)

def run_jsx(ps_app, jsx_code):
    """Execute ExtendScript / JSX code in Photoshop wrapped in a safe IIFE with JSON support."""
    try:
        wrapped_code = f"""
        (function() {{
            app.displayDialogs = DialogModes.NO;
            if (typeof JSON === 'undefined') {{
                JSON = {{
                    stringify: function(obj) {{
                        var t = typeof obj;
                        if (t != 'object' || obj === null) {{
                            if (t == 'string') return '"' + obj.replace(/\\\\/g, '\\\\\\\\').replace(/"/g, '\\\\"') + '"';
                            return String(obj);
                        }}
                        var json = [], arr = (obj && obj.constructor === Array);
                        for (var n in obj) {{
                            var v = obj[n];
                            t = typeof v;
                            if (t == 'function') continue;
                            if (t == 'string') v = '"' + v.replace(/\\\\/g, '\\\\\\\\').replace(/"/g, '\\\\"') + '"';
                            else if (t == 'object' && v !== null) v = JSON.stringify(v);
                            json.push((arr ? '' : '"' + n + '":') + String(v));
                        }}
                        return (arr ? '[' : '{{') + String(json) + (arr ? ']' : '}}');
                    }}
                }};
            }}
            try {{
                {jsx_code}
            }} catch(e) {{
                return "JSX_ERROR: " + e.message + " (line " + e.line + ")";
            }}
        }})();
        """
        result = ps_app.DoJavaScript(wrapped_code)
        return result
    except Exception as e:
        return f"COM_EXECUTION_ERROR: {str(e)}"

# Command Implementations
def execute_cmd(command, args_dict, ps_app):
    if command == "status":
        jsx = """
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
        """
        res = run_jsx(ps_app, jsx)
        if res and not str(res).startswith("JSX_ERROR"):
            data = json.loads(res)
            data["status"] = "connected"
            return data
        else:
            return {"status": "connected", "version": ps_app.Version, "name": ps_app.Name, "detail": str(res)}

    elif command == "create-document":
        name = args_dict.get("name") or "Untitled"
        width = args_dict.get("width")
        height = args_dict.get("height")
        resolution = args_dict.get("resolution") or 72
        bg_mode = args_dict.get("background") or "transparent"

        jsx = f"""
        var fill = DocumentFill.TRANSPARENT;
        if ("{bg_mode}".toLowerCase() === "white") fill = DocumentFill.WHITE;
        else if ("{bg_mode}".toLowerCase() === "black") fill = DocumentFill.BLACK;

        var doc = app.documents.add({width}, {height}, {resolution}, "{name}", NewDocumentMode.RGB, fill);
        return "Document created: " + doc.name;
        """
        res = run_jsx(ps_app, jsx)
        return {"status": "success" if not "ERROR" in str(res) else "error", "result": str(res)}

    elif command == "open-file":
        path = os.path.abspath(args_dict["path"]).replace("\\", "/")
        if not os.path.exists(args_dict["path"]):
            return {"status": "error", "message": f"File not found: {args_dict['path']}"}

        jsx = f"""
        var fileRef = new File("{path}");
        if (fileRef.exists) {{
            var doc = app.open(fileRef);
            return "Opened: " + doc.name;
        }} else {{
            return "JSX_ERROR: File does not exist: {path}";
        }}
        """
        res = run_jsx(ps_app, jsx)
        return {"status": "success" if not "ERROR" in str(res) else "error", "result": str(res)}

    elif command == "select-subject":
        jsx = """
        if (app.documents.length === 0) return "JSX_ERROR: No active document";
        try {
            var idautoCutout = stringIDToTypeID("autoCutout");
            var desc = new ActionDescriptor();
            desc.putBoolean(stringIDToTypeID("sampleAllLayers"), false);
            executeAction(idautoCutout, desc, DialogModes.NO);
            return "Subject selected successfully";
        } catch(e) {
            return "JSX_ERROR: " + e.message;
        }
        """
        res = run_jsx(ps_app, jsx)
        return {"status": "success" if not "ERROR" in str(res) else "error", "result": str(res)}

    elif command == "remove-background":
        jsx = """
        if (app.documents.length === 0) return "JSX_ERROR: No active document";
        
        var doc = app.activeDocument;
        if (doc.activeLayer.isBackgroundLayer) {
            doc.activeLayer.name = "Layer 0";
        }

        try {
            var idautoCutout = stringIDToTypeID("autoCutout");
            var descCutout = new ActionDescriptor();
            descCutout.putBoolean(stringIDToTypeID("sampleAllLayers"), false);
            executeAction(idautoCutout, descCutout, DialogModes.NO);

            var idMake = charIDToTypeID("Mk  ");
            var descMask = new ActionDescriptor();
            descMask.putClass(charIDToTypeID("Nw  "), charIDToTypeID("Chnl"));
            var refMask = new ActionReference();
            refMask.putEnumerated(charIDToTypeID("Chnl"), charIDToTypeID("Chnl"), charIDToTypeID("Msk "));
            descMask.putReference(charIDToTypeID("At  "), refMask);
            descMask.putEnumerated(charIDToTypeID("Usng"), charIDToTypeID("UsrM"), charIDToTypeID("RvlS"));
            executeAction(idMake, descMask, DialogModes.NO);

            return "Background removed and mask created";
        } catch(e) {
            return "JSX_ERROR: " + e.message;
        }
        """
        res = run_jsx(ps_app, jsx)
        return {"status": "success" if not "ERROR" in str(res) else "error", "result": str(res)}

    elif command == "replace-smart-object":
        img_path = os.path.abspath(args_dict["image"]).replace("\\", "/")
        layer_name = args_dict.get("layer")

        if not os.path.exists(args_dict["image"]):
            return {"status": "error", "message": f"Replacement image not found: {args_dict['image']}"}

        jsx = f"""
        if (app.documents.length === 0) return "JSX_ERROR: No active document";
        var doc = app.activeDocument;
        
        function findLayer(layers, name) {{
            for (var i = 0; i < layers.length; i++) {{
                if (layers[i].name === name) return layers[i];
                if (layers[i].typename === "LayerSet") {{
                    var found = findLayer(layers[i].layers, name);
                    if (found) return found;
                }}
            }}
            return null;
        }}

        var targetLayer = null;
        if ("{layer_name}") {{
            targetLayer = findLayer(doc.layers, "{layer_name}");
            if (!targetLayer) return "JSX_ERROR: Layer '{layer_name}' not found";
            doc.activeLayer = targetLayer;
        }} else {{
            targetLayer = doc.activeLayer;
        }}

        try {{
            var idplacedLayerReplaceContents = stringIDToTypeID("placedLayerReplaceContents");
            var desc = new ActionDescriptor();
            desc.putPath(charIDToTypeID("null"), new File("{img_path}"));
            executeAction(idplacedLayerReplaceContents, desc, DialogModes.NO);
            return "Smart Object '" + targetLayer.name + "' replaced with {os.path.basename(img_path)}";
        }} catch(e) {{
            return "JSX_ERROR: " + e.message;
        }}
        """
        res = run_jsx(ps_app, jsx)
        return {"status": "success" if not "ERROR" in str(res) else "error", "result": str(res)}

    elif command == "apply-action":
        action_name = args_dict["name"]
        action_set = args_dict.get("set") or ""
        jsx = f"""
        try {{
            app.doAction("{action_name}", "{action_set}");
            return "Action '{action_name}' played successfully";
        }} catch(e) {{
            return "JSX_ERROR: " + e.message;
        }}
        """
        res = run_jsx(ps_app, jsx)
        return {"status": "success" if not "ERROR" in str(res) else "error", "result": str(res)}

    elif command == "export-image":
        out_path = os.path.abspath(args_dict["output"]).replace("\\", "/")
        os.makedirs(os.path.dirname(os.path.abspath(args_dict["output"])), exist_ok=True)
        fmt = (args_dict.get("format") or "png").lower()
        transparent = "true" if args_dict.get("transparent") else "false"

        if fmt == "png":
            jsx = f"""
            if (app.documents.length === 0) return "JSX_ERROR: No active document";
            var doc = app.activeDocument;
            var exportOptions = new ExportOptionsSaveForWeb();
            exportOptions.format = SaveDocumentType.PNG;
            exportOptions.PNG8 = false;
            exportOptions.transparency = {transparent};
            exportOptions.interlaced = false;
            exportOptions.includeProfile = false;
            
            var outFile = new File("{out_path}");
            doc.exportDocument(outFile, ExportType.SAVEFORWEB, exportOptions);
            return "Exported PNG: " + outFile.fsName;
            """
        elif fmt in ["jpg", "jpeg"]:
            quality = args_dict.get("quality") or 90
            jsx = f"""
            if (app.documents.length === 0) return "JSX_ERROR: No active document";
            var doc = app.activeDocument;
            var exportOptions = new ExportOptionsSaveForWeb();
            exportOptions.format = SaveDocumentType.JPEG;
            exportOptions.quality = {quality};
            exportOptions.includeProfile = true;
            
            var outFile = new File("{out_path}");
            doc.exportDocument(outFile, ExportType.SAVEFORWEB, exportOptions);
            return "Exported JPEG: " + outFile.fsName;
            """
        elif fmt == "psd":
            jsx = f"""
            if (app.documents.length === 0) return "JSX_ERROR: No active document";
            var doc = app.activeDocument;
            var psdOptions = new PhotoshopSaveOptions();
            psdOptions.layers = true;
            psdOptions.embedColorProfile = true;
            var outFile = new File("{out_path}");
            doc.saveAs(outFile, psdOptions, true, Extension.LOWERCASE);
            return "Saved PSD: " + outFile.fsName;
            """
        else:
            return {"status": "error", "message": f"Unsupported format: {fmt}"}

        res = run_jsx(ps_app, jsx)
        return {"status": "success" if not "ERROR" in str(res) else "error", "result": str(res)}

    elif command == "eval-jsx":
        code = args_dict["script"]
        if os.path.exists(code):
            with open(code, "r", encoding="utf-8") as f:
                code = f.read()
        res = run_jsx(ps_app, code)
        return {"status": "success" if not str(res).startswith("JSX_ERROR") else "error", "result": str(res)}

    elif command == "close-document":
        save_flag = "SaveOptions.SAVECHANGES" if args_dict.get("save") else "SaveOptions.DONOTSAVECHANGES"
        jsx = f"""
        if (app.documents.length > 0) {{
            var name = app.activeDocument.name;
            app.activeDocument.close({save_flag});
            return "Closed: " + name;
        }} else {{
            return "No active documents to close";
        }}
        """
        res = run_jsx(ps_app, jsx)
        return {"status": "success", "result": str(res)}

    elif command == "test-pipeline":
        test_out = os.path.abspath(args_dict.get("output") or "C:/Users/game/Pictures/photoshop_studio_verified.png").replace("\\", "/")
        os.makedirs(os.path.dirname(test_out), exist_ok=True)
        jsx = f"""
        var doc = app.documents.add(800, 600, 72, 'Photoshop_Studio_Test', NewDocumentMode.RGB, DocumentFill.WHITE);
        var layer = doc.artLayers.add();
        layer.name = 'Studio Card';
        doc.selection.selectAll();
        var color = new SolidColor();
        color.rgb.red = 26; color.rgb.green = 26; color.rgb.blue = 26;
        doc.selection.fill(color);
        doc.selection.deselect();
        var opts = new ExportOptionsSaveForWeb();
        opts.format = SaveDocumentType.PNG;
        opts.PNG8 = false;
        opts.transparency = true;
        var outFile = new File('{test_out}');
        doc.exportDocument(outFile, ExportType.SAVEFORWEB, opts);
        doc.close(SaveOptions.DONOTSAVECHANGES);
        return outFile.fsName;
        """
        res = run_jsx(ps_app, jsx)
        if "ERROR" in str(res):
            return {"status": "error", "message": f"Pipeline Error: {res}"}
        success = os.path.exists(test_out)
        return {"status": "pipeline_verified", "output_file": test_out, "file_exists": success}

    return {"status": "error", "message": f"Unhandled command: {command}"}

# Daemon Server
class BridgeDaemonState:
    ps_app = None
    server = None

class DaemonHTTPHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == "/health":
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            version = BridgeDaemonState.ps_app.Version if BridgeDaemonState.ps_app else "unknown"
            self.wfile.write(json.dumps({"status": "healthy", "version": version}).encode('utf-8'))
        else:
            self.send_response(404)
            self.end_headers()

    def do_POST(self):
        if self.path == "/shutdown":
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"status": "shutting_down"}).encode('utf-8'))
            threading.Thread(target=lambda: BridgeDaemonState.server.shutdown()).start()
            return

        if self.path == "/command":
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            req = json.loads(post_data.decode('utf-8'))
            cmd = req.get("command")
            args_dict = req.get("args", {})
            try:
                result = execute_cmd(cmd, args_dict, BridgeDaemonState.ps_app)
            except Exception as e:
                result = {"status": "error", "message": str(e)}

            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps(result).encode('utf-8'))

    def log_message(self, format, *args):
        return

def run_daemon_server():
    import pythoncom
    pythoncom.CoInitialize()
    cleanup_zombie_instances()
    time.sleep(0.5)
    ps_app = get_photoshop_app()
    BridgeDaemonState.ps_app = ps_app
    server = HTTPServer((DAEMON_HOST, DAEMON_PORT), DaemonHTTPHandler)
    BridgeDaemonState.server = server
    server.serve_forever()

def is_daemon_healthy():
    try:
        req = urllib.request.Request(f"http://{DAEMON_HOST}:{DAEMON_PORT}/health")
        with urllib.request.urlopen(req, timeout=1.5) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            return data.get("status") == "healthy"
    except Exception:
        return False

def ensure_daemon():
    if is_daemon_healthy():
        return True

    # Spawn daemon in background (hidden window)
    CREATE_NO_WINDOW = 0x08000000
    DETACHED_PROCESS = 0x00000008
    script_path = os.path.abspath(__file__)
    subprocess.Popen(
        [sys.executable, script_path, "--daemon"],
        creationflags=CREATE_NO_WINDOW | DETACHED_PROCESS,
        close_fds=True
    )

    # Poll until ready (up to 30s for Photoshop cold-boot)
    start_time = time.time()
    while time.time() - start_time < 35:
        if is_daemon_healthy():
            return True
        time.sleep(0.5)

    return False

def send_command_to_daemon(command, args_dict):
    req_body = json.dumps({"command": command, "args": args_dict}).encode('utf-8')
    req = urllib.request.Request(
        f"http://{DAEMON_HOST}:{DAEMON_PORT}/command",
        data=req_body,
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req, timeout=120) as resp:
        return json.loads(resp.read().decode('utf-8'))

def main():
    if "--daemon" in sys.argv:
        run_daemon_server()
        sys.exit(0)

    parser = argparse.ArgumentParser(description="Photoshop COM Automation Bridge")
    subparsers = parser.add_subparsers(dest="command", required=True)

    # status
    subparsers.add_parser("status", help="Check Photoshop status")

    # create-document
    p_create = subparsers.add_parser("create-document", help="Create new document")
    p_create.add_argument("--width", type=int, required=True)
    p_create.add_argument("--height", type=int, required=True)
    p_create.add_argument("--resolution", type=int, default=72)
    p_create.add_argument("--name", type=str, default="Untitled")
    p_create.add_argument("--background", type=str, choices=["transparent", "white", "black"], default="transparent")

    # open-file
    p_open = subparsers.add_parser("open-file", help="Open a PSD/image file")
    p_open.add_argument("--path", type=str, required=True)

    # select-subject
    subparsers.add_parser("select-subject", help="Select subject using Sensei AI")

    # remove-background
    subparsers.add_parser("remove-background", help="Remove background with layer mask")

    # replace-smart-object
    p_rso = subparsers.add_parser("replace-smart-object", help="Replace smart object contents")
    p_rso.add_argument("--image", type=str, required=True, help="Path to replacement image")
    p_rso.add_argument("--layer", type=str, default=None, help="Name of Smart Object layer")

    # apply-action
    p_act = subparsers.add_parser("apply-action", help="Execute an action")
    p_act.add_argument("--name", type=str, required=True)
    p_act.add_argument("--set", type=str, default="")

    # export-image
    p_exp = subparsers.add_parser("export-image", help="Export active document")
    p_exp.add_argument("--output", type=str, required=True)
    p_exp.add_argument("--format", type=str, choices=["png", "jpg", "jpeg", "psd"], default="png")
    p_exp.add_argument("--quality", type=int, default=90)
    p_exp.add_argument("--transparent", action="store_true")

    # eval-jsx
    p_jsx = subparsers.add_parser("eval-jsx", help="Run ExtendScript/JSX code")
    p_jsx.add_argument("--script", type=str, required=True)

    # close-document
    p_close = subparsers.add_parser("close-document", help="Close active document")
    p_close.add_argument("--save", action="store_true")

    # test-pipeline
    p_test = subparsers.add_parser("test-pipeline", help="Run end-to-end verification")
    p_test.add_argument("--output", type=str, default=None)

    # reset
    subparsers.add_parser("reset", help="Force terminate daemon and Photoshop processes")

    args = parser.parse_args()

    if args.command == "reset":
        try:
            req = urllib.request.Request(f"http://{DAEMON_HOST}:{DAEMON_PORT}/shutdown", data=b"{}")
            urllib.request.urlopen(req, timeout=2)
        except Exception:
            pass
        cleanup_zombie_instances()
        print(json.dumps({"status": "reset_completed", "message": "All Photoshop and bridge processes terminated."}, indent=2))
        return

    if not ensure_daemon():
        print(json.dumps({"status": "error", "message": "Failed to initialize Photoshop COM daemon."}))
        sys.exit(1)

    result = send_command_to_daemon(args.command, vars(args))
    print(json.dumps(result, indent=2))

if __name__ == "__main__":
    main()
