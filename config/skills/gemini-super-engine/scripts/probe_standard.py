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

url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key={api_key}"
payload = {
    "contents": [{"parts": [{"text": "Hãy phân tích ngắn gọn: Ưu điểm của kiến trúc Agentic AI kết hợp hệ điều hành là gì?"}]}]
}
req_data = json.dumps(payload).encode("utf-8")
req = urllib.request.Request(url, data=req_data, headers={"Content-Type": "application/json"})
try:
    with urllib.request.urlopen(req, timeout=20) as resp:
        data = json.loads(resp.read().decode("utf-8"))
        print("[+] gemini-3.6-flash THÀNH CÔNG RỰC RỠ!")
        cand = data.get("candidates", [{}])[0]
        text = "".join([p.get("text", "") for p in cand.get("content", {}).get("parts", [])])
        print(text[:250] + "...")
except Exception as e:
    print(f"[-] Lỗi: {e}")
