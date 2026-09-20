import sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

import urllib.request
import base64
import json
from pathlib import Path

ENV_FILE = Path(r"C:\Users\game\.gemini\config\sidecars\anti_live_voice\.env.local")
api_key = ""
with open(ENV_FILE, "r") as f:
    for line in f:
        if line.startswith("GEMINI_API_KEY="):
            api_key = line.split("=", 1)[1].strip().strip("\"'")

test_audio = Path(r"C:\Users\game\.gemini\config\sidecars\anti_live_voice\public\korean_voice_sample.wav")
with open(test_audio, "rb") as f:
    b64_audio = base64.b64encode(f.read()).decode("utf-8")

print(f"Testing inlineData audio analysis on gemini-3.5-flash ({len(b64_audio)} chars base64)...")
url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key={api_key}"
payload = {
    "contents": [
        {
            "parts": [
                {"inlineData": {"mimeType": "audio/wav", "data": b64_audio}},
                {"text": "Hãy lắng nghe file âm thanh này và mô tả: người nói dùng ngôn ngữ gì, giọng nam hay nữ, cảm xúc, dịch nghĩa nội dung câu nói sang tiếng Việt?"}
            ]
        }
    ]
}
req = urllib.request.Request(url, data=json.dumps(payload).encode("utf-8"), headers={"Content-Type": "application/json"})
try:
    with urllib.request.urlopen(req, timeout=40) as resp:
        data = json.loads(resp.read().decode("utf-8"))
        cand = data.get("candidates", [{}])[0]
        text = "".join([p.get("text", "") for p in cand.get("content", {}).get("parts", [])])
        print("\n🎉 THÀNH CÔNG NGOẠI HẠNG: NATIVE AUDIO/MULTIMODAL UNDERSTANDING HOẠT ĐỘNG HOÀN HẢO!")
        print(text)
except Exception as e:
    print(f"FAILED: {e}")
    if hasattr(e, 'read'):
        print(e.read().decode('utf-8'))
