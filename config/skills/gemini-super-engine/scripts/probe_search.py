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

# Test search grounding on gemini-3.6-flash
url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key={api_key}"
payload = {
    "contents": [{"parts": [{"text": "Tin tức thời trang thế giới nổi bật nhất tuần này là gì?"}]}],
    "tools": [{"google_search": {}}]
}
req_data = json.dumps(payload).encode("utf-8")
req = urllib.request.Request(url, data=req_data, headers={"Content-Type": "application/json"})

try:
    with urllib.request.urlopen(req, timeout=30) as resp:
        data = json.loads(resp.read().decode("utf-8"))
        print("SUCCESS ON GEMINI-3.6-FLASH SEARCH GROUNDING!")
        cand = data.get("candidates", [{}])[0]
        text = "".join([p.get("text", "") for p in cand.get("content", {}).get("parts", [])])
        print("\n--- Câu trả lời ---")
        print(text[:300] + "...")
        gm = cand.get("groundingMetadata", {})
        chunks = gm.get("groundingChunks", [])
        print(f"\n--- Tìm thấy {len(chunks)} nguồn Google Search ---")
        for c in chunks[:3]:
            web = c.get("web", {})
            print(f"  • {web.get('title')}: {web.get('uri')}")
except Exception as e:
    print(f"FAILED: {e}")
    if hasattr(e, 'read'):
        print(f"Details: {e.read().decode('utf-8', errors='replace')}")
