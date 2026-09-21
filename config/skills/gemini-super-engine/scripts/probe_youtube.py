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

# Test YouTube URL direct understanding on Gemini
url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key={api_key}"

# Link video giới thiệu Gemini của Google DeepMind
test_yt = "https://www.youtube.com/watch?v=jV1vkHv4zq8"

payload = {
    "contents": [
        {
            "parts": [
                {"text": f"Hãy xem và tóm tắt nội dung video YouTube này: {test_yt}. Cho biết video nói về cái gì và các mốc thời gian chính."}
            ]
        }
    ]
}

req = urllib.request.Request(url, data=json.dumps(payload).encode("utf-8"), headers={"Content-Type": "application/json"})
try:
    with urllib.request.urlopen(req, timeout=30) as resp:
        data = json.loads(resp.read().decode("utf-8"))
        cand = data.get("candidates", [{}])[0]
        text = "".join([p.get("text", "") for p in cand.get("content", {}).get("parts", [])])
        print("[+] KẾT QUẢ TÓM TẮT YOUTUBE TRỰC TIẾP TỪ GEMINI:")
        print(text[:500] + "...")
except Exception as e:
    print(f"[-] Lỗi: {e}")
    if hasattr(e, 'read'):
        print(e.read().decode('utf-8'))
