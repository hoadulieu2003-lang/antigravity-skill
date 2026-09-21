import os
import sys
import wave
import json
import base64
import urllib.request
import time
import socket
from pathlib import Path

# Force IPv4 to bypass Vietnamese ISP IPv6 black-holing on Google Cloud
old_getaddrinfo = socket.getaddrinfo
def new_getaddrinfo(*args, **kwargs):
    responses = old_getaddrinfo(*args, **kwargs)
    return [response for response in responses if response[0] == socket.AF_INET]
socket.getaddrinfo = new_getaddrinfo

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

BASE_DIR = Path(r"C:\Users\game\.gemini")
ENV_FILE = BASE_DIR / "config" / "sidecars" / "anti_live_voice" / ".env.local"
PUBLIC_DIR = BASE_DIR / "config" / "sidecars" / "anti_live_voice" / "public"
BRAIN_DIR = Path(r"C:\Users\game\.gemini\antigravity\brain\6f46af53-7f44-46a4-83e9-d518ccfc6f9f")

API_URL_TEMPLATE = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key={key}"

CHUNKS = [
    (
        "Hook & Gặp Sếp",
        "Sốc thật sự. Hôm nay mình mới biết 80% những gì chúng ta đang cố gắng chăm chỉ ở công sở... gần như là vô nghĩa. "
        "Chiều nay ngồi cà phê với một sếp lớn bên tập đoàn X, anh ấy mới phũ phàng nói một câu làm mình tỉnh cả người: "
        "Em chăm chỉ, ngoan ngoãn, làm tốt việc được giao? Tốt, nhưng đó là lý do em mãi chỉ làm nhân viên. Muốn thăng tiến hay tăng lương gấp đôi, cái người ta nhìn vào hoàn toàn là thứ khác."
    ),
    (
        "3 Quy Luật Ngầm",
        "Lúc đầu nghe bất mãn lắm chứ. Nhưng khi nghe anh ấy phân tích 3 quy luật ngầm thì mình mới ngã ngửa: "
        "Thứ nhất: Người làm việc tốt nhất không bao giờ được thăng chức, vì sếp không tìm được ai thay thế vị trí cày việc của bạn. "
        "Thứ hai: Sự hiện diện quan trọng gấp ba lần nỗ lực âm thầm. Làm được mười mà không ai biết thì giá trị vẫn bằng không. "
        "Và thứ ba: Đừng chỉ giải quyết việc của bạn, hãy giải quyết nỗi đau đầu của sếp trực tiếp. Bạn là cái khiên của sếp, sếp mới kéo bạn lên."
    ),
    (
        "Kết Luận Thấm Thía",
        "Ngẫm lại mà thấy thấm thía thật sự... Bạn thấy ba quy luật này có đúng không? Để lại ý kiến dưới phần bình luận nhé."
    )
]

def load_gemini_api_key() -> str:
    api_key = os.environ.get("GEMINI_API_KEY", "")
    if not api_key and ENV_FILE.exists():
        for line in ENV_FILE.read_text(encoding='utf-8').splitlines():
            line = line.strip()
            if line.startswith("GEMINI_API_KEY="):
                api_key = line.split("=", 1)[1].strip().strip('"').strip("'")
                break
    return api_key

def synthesize_chunk(text: str, voice_name: str, api_key: str, retries: int = 2) -> bytes:
    url = API_URL_TEMPLATE.format(key=api_key)
    payload = {
        "contents": [{
            "parts": [{"text": text}]
        }],
        "generationConfig": {
            "responseModalities": ["AUDIO"],
            "speechConfig": {
                "voiceConfig": {
                    "prebuiltVoiceConfig": {
                        "voiceName": voice_name
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
    for attempt in range(1, retries + 1):
        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                res_data = json.loads(resp.read().decode('utf-8'))
            parts = res_data.get('candidates', [{}])[0].get('content', {}).get('parts', [])
            for p in parts:
                if 'inlineData' in p and p['inlineData'].get('data'):
                    return base64.b64decode(p['inlineData']['data'])
            raise RuntimeError(f"Không có inlineData trong kết quả API")
        except Exception as e:
            print(f"    [!] Thử lại lần {attempt}/{retries} do lỗi: {e}")
            if attempt == retries:
                raise e
            time.sleep(1.5)

def save_wav(pcm_data: bytes, path: Path, sample_rate: int = 24000) -> float:
    path.parent.mkdir(parents=True, exist_ok=True)
    with wave.open(str(path), 'wb') as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(sample_rate)
        wf.writeframes(pcm_data)
    duration = len(pcm_data) / (sample_rate * 2)
    return round(duration, 2)

def main():
    api_key = load_gemini_api_key()
    if not api_key:
        print("[!] Không tìm thấy GEMINI_API_KEY!")
        sys.exit(1)
    
    print("================================================================")
    print("🎙️ ĐANG SINH GIỌNG ĐỌC THREADS STORYTELLING (GEMINI TTS: CHARON)...")
    print("================================================================")
    
    full_pcm = b""
    silence = b"\x00\x00" * int(24000 * 0.35) # 350ms pause between chunks
    
    for i, (title, chunk_text) in enumerate(CHUNKS, 1):
        print(f"[*] Đang xử lý Đoạn {i}/{len(CHUNKS)}: {title} ({len(chunk_text)} ký tự)...")
        pcm = synthesize_chunk(chunk_text, "Charon", api_key)
        dur = len(pcm) / (24000 * 2)
        print(f"    [+] Xong Đoạn {i}: {dur:.1f}s ({len(pcm)} bytes)")
        if full_pcm:
            full_pcm += silence
        full_pcm += pcm

    out_wav_pub = PUBLIC_DIR / "threads_story_charon.wav"
    out_wav_brain = BRAIN_DIR / "threads_story_charon.wav"
    
    total_dur = save_wav(full_pcm, out_wav_pub)
    save_wav(full_pcm, out_wav_brain)
    
    print("\n================================================================")
    print(f"🎉 ĐÃ HOÀN TẤT BẢN THU THREADS STORYTELLING!")
    print(f"  • Tổng thời lượng: {total_dur}s")
    print(f"  • Vị trí lưu: {out_wav_pub}")
    print("================================================================")

if __name__ == "__main__":
    main()
