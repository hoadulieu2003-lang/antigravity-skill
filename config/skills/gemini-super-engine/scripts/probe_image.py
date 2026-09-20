import sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

import urllib.request
import json
import time
from pathlib import Path

ENV_FILE = Path(r"C:\Users\game\.gemini\config\sidecars\anti_live_voice\.env.local")
api_key = ""
with open(ENV_FILE, "r") as f:
    for line in f:
        if line.startswith("GEMINI_API_KEY="):
            api_key = line.split("=", 1)[1].strip().strip("\"'")

def test_image_model(model):
    print(f"\n--- Testing Image Generation on {model} ---")
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
    payload = {
        "contents": [
            {
                "parts": [
                    {"text": "A luxurious silk dress in studio lighting, fashion photography, 8k"}
                ]
            }
        ]
    }
    req_data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(url, data=req_data, headers={"Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=40) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            print(f"SUCCESS on {model}!")
            parts = data.get("candidates", [{}])[0].get("content", {}).get("parts", [])
            for p in parts:
                if "inlineData" in p:
                    print(f"  Found inlineData: mimeType={p['inlineData'].get('mimeType')}, size={len(p['inlineData'].get('data', ''))}")
                elif "text" in p:
                    print(f"  Found text: {p['text'][:100]}")
            return data
    except Exception as e:
        print(f"FAILED on {model}: {e}")
        if hasattr(e, 'read'):
            print(f"Details: {e.read().decode('utf-8', errors='replace')}")
        return None

# Sleep to ensure fresh RPM window
time.sleep(3)
test_image_model("gemini-2.5-flash-image")
