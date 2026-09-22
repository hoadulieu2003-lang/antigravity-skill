import os
import json
import urllib.request
import wave
import shutil

api_key = os.environ.get('GEMINI_API_KEY', '')
url = f'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key={api_key}'

payload = {
    "contents": [{
        "parts": [{
            "text": "안녕하세요! 저는 안티그래비티입니다. 구글 제미나이 AI로 직접 생성된 한국어 음성입니다. 만나서 반가워요, 좋은 하루 되세요!"
        }]
    }],
    "generationConfig": {
        "responseModalities": ["AUDIO"],
        "speechConfig": {
            "voiceConfig": {
                "prebuiltVoiceConfig": {
                    "voiceName": "Kore"
                }
            }
        }
    }
}

req = urllib.request.Request(
    url,
    data=json.dumps(payload).encode('utf-8'),
    headers={'Content-Type': 'application/json'}
)

print("Đang gửi yêu cầu sinh giọng nói tiếng Hàn tới Gemini...")
with urllib.request.urlopen(req) as resp:
    res_data = json.loads(resp.read().decode('utf-8'))

candidate = res_data.get('candidates', [{}])[0]
parts = candidate.get('content', {}).get('parts', [])

pcm_data = None
for p in parts:
    if 'inlineData' in p and p['inlineData'].get('data'):
        import base64
        pcm_data = base64.b64decode(p['inlineData']['data'])
        break

if pcm_data:
    out_dir = r"C:\Users\game\.gemini\config\sidecars\anti_live_voice\public"
    out_wav = os.path.join(out_dir, "korean_voice_sample.wav")
    brain_dir = r"C:\Users\game\.gemini\antigravity\brain\6f46af53-7f44-46a4-83e9-d518ccfc6f9f"
    brain_wav = os.path.join(brain_dir, "korean_voice_sample.wav")
    
    with wave.open(out_wav, "wb") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(24000)
        wf.writeframes(pcm_data)
        
    shutil.copyfile(out_wav, brain_wav)
    print(f"SUCCESS: Đã tạo file tiếng Hàn tại {out_wav} ({len(pcm_data)} bytes)")
else:
    print("ERROR: Không tìm thấy dữ liệu âm thanh trả về.")
