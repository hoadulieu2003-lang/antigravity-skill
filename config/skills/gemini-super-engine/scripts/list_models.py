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

url = f"https://generativelanguage.googleapis.com/v1beta/models?key={api_key}"
with urllib.request.urlopen(url) as resp:
    data = json.loads(resp.read().decode("utf-8"))

print(f"Tổng cộng có {len(data.get('models', []))} models:")
for m in data.get("models", []):
    name = m.get("name")
    methods = m.get("supportedGenerationMethods", [])
    print(f"{name} -> {methods}")
