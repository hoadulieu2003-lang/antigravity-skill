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

# Check Context Caching endpoint
url = f"https://generativelanguage.googleapis.com/v1beta/cachedContents?key={api_key}"
try:
    with urllib.request.urlopen(url) as resp:
        data = json.loads(resp.read().decode("utf-8"))
        print(f"[+] Context Caching API kết nối thành công: {data}")
except Exception as e:
    print(f"[-] Context Caching: {e}")
    if hasattr(e, 'read'):
        print(e.read().decode('utf-8'))
