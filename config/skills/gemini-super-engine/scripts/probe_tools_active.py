import sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

import urllib.request
import json
from pathlib import Path

ENV_FILE = Path(r"C:\Users\game\.gemini\config\sidecars\anti_live_voice\.env.local")
api_key = ""
with open(ENV_FILE, "r") as f:
    for line in f:
        if line.startswith("GEMINI_API_KEY="):
            api_key = line.split("=", 1)[1].strip().strip("\"'")

def test_tool(model, tool_name, tool_config, prompt):
    print(f"\nTesting {tool_name} on {model}...")
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "tools": [{tool_name: tool_config}]
    }
    req = urllib.request.Request(url, data=json.dumps(payload).encode("utf-8"), headers={"Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            print(f"[+] {tool_name} on {model} SUCCESS!")
            cand = data.get("candidates", [{}])[0]
            parts = cand.get("content", {}).get("parts", [])
            for p in parts:
                if "executableCode" in p:
                    print(f"  Code: {p['executableCode'].get('code', '')[:80]}...")
                if "codeExecutionResult" in p:
                    print(f"  Result: {p['codeExecutionResult'].get('output', '')[:80]}...")
                if "text" in p:
                    print(f"  Text: {p['text'][:100]}...")
            if "groundingMetadata" in cand:
                gm = cand["groundingMetadata"]
                chunks = gm.get("groundingChunks", [])
                print(f"  Grounding chunks: {len(chunks)}")
                for c in chunks[:2]:
                    print(f"    • {c.get('web', {}).get('title')}: {c.get('web', {}).get('uri')}")
            return True
    except Exception as e:
        print(f"[-] {tool_name} on {model} FAILED: {e}")
        return False

# Test Code Execution on gemini-3.5-flash and gemini-flash-latest
test_tool("gemini-3.5-flash", "code_execution", {}, "Hãy tính giai thừa của 20 bằng Python")
test_tool("gemini-flash-latest", "code_execution", {}, "Hãy tính giai thừa của 20 bằng Python")
