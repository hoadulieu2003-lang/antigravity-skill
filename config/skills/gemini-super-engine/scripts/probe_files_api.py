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

# Use native_video_forensics to upload korean_voice_sample.wav or test file
from native_video_forensics import upload_media_file

test_audio = Path(r"C:\Users\game\.gemini\config\sidecars\anti_live_voice\public\korean_voice_sample.wav")
print(f"Testing Google Files API upload with {test_audio.name}...")
res = upload_media_file(test_audio, mime_type="audio/wav")
print(f"[+] UPLOAD SUCCESS! Name: {res['name']}, URI: {res['uri']}")

# Now query gemini-3.5-flash with this file
url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key={api_key}"
payload = {
    "contents": [
        {
            "parts": [
                {"fileData": {"mimeType": "audio/wav", "fileUri": res["uri"]}},
                {"text": "Hãy lắng nghe file âm thanh này và mô tả: người nói dùng ngôn ngữ gì, giọng nam hay nữ, cảm xúc và nội dung tóm tắt?"}
            ]
        }
    ]
}
req = urllib.request.Request(url, data=json.dumps(payload).encode("utf-8"), headers={"Content-Type": "application/json"})
with urllib.request.urlopen(req, timeout=40) as resp:
    data = json.loads(resp.read().decode("utf-8"))
    cand = data.get("candidates", [{}])[0]
    parts = cand.get("content", {}).get("parts", [])
    analysis = "".join([p.get("text", "") for p in parts if "text" in p])
    print("\n[+] PHÂN TÍCH ÂM THANH / VIDEO THÀNH CÔNG RỰC RỠ:")
    print(analysis[:400] + "...")
