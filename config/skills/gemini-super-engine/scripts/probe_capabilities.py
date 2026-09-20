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

def test_model(model, payload, desc):
    print(f"\n--- Testing {desc} on {model} ---")
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
    req_data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(url, data=req_data, headers={"Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            print(f"SUCCESS! Response keys: {list(data.keys())}")
            cand = data.get("candidates", [{}])[0]
            print(f"Content parts count: {len(cand.get('content', {}).get('parts', []))}")
            if "groundingMetadata" in cand:
                print(f"Grounding metadata present: {list(cand['groundingMetadata'].keys())}")
            return data
    except Exception as e:
        print(f"FAILED: {e}")
        if hasattr(e, 'read'):
            print(f"Details: {e.read().decode('utf-8', errors='replace')}")
        return None

# Test 1: Google Search on gemini-3.6-flash
test_model(
    "gemini-3.6-flash",
    {
        "contents": [{"parts": [{"text": "Giá vàng hôm nay và tin tức công nghệ AI mới nhất?"}]}],
        "tools": [{"google_search": {}}]
    },
    "Google Search Grounding"
)

# Test 2: Code Execution on gemini-3.6-flash
test_model(
    "gemini-3.6-flash",
    {
        "contents": [{"parts": [{"text": "Viết và chạy code Python tính 2 mũ 30"}]}],
        "tools": [{"code_execution": {}}]
    },
    "Code Execution"
)
