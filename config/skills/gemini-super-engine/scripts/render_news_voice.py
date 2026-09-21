#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Render bản tin thời sự với giọng đọc BTV Thời Sự chuyên nghiệp qua Gemini TTS.
Tự động lưu file WAV 24kHz, cập nhật web và phát qua loa ngoài laptop.
"""

import os
import sys
import wave
import json
import base64
import urllib.request
from pathlib import Path

# Đảm bảo UTF-8
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

BASE_DIR = Path(r"C:\Users\game\.gemini")
ENV_FILE = BASE_DIR / "config" / "sidecars" / "anti_live_voice" / ".env.local"
PUBLIC_DIR = BASE_DIR / "config" / "sidecars" / "anti_live_voice" / "public"
ARTIFACT_DIR = Path(r"C:\Users\game\.gemini\antigravity\brain\6f46af53-7f44-46a4-83e9-d518ccfc6f9f")
API_URL_TEMPLATE = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key={key}"

TEXT_CONTENT = (
    "Dù mưa tại miền Bắc đã dừng, lũ sông Tích và sông Bùi ở thành phố Hà Nội vẫn rút rất chậm và tiếp tục duy trì trên mức báo động 3. "
    "Tính đến sáng ngày 21 tháng 9, hơn năm nghìn căn nhà tại Ninh Bình và thành phố Hà Nội vẫn ngập trong nước.\n\n"
    "Mưa lũ những ngày qua đã làm 3 người chết tại Phú Thọ, 8 căn nhà bị sập và 111 nhà hư hỏng. "
    "Tuy tổng số nhà ngập đã giảm hơn tám nghìn căn so với ngày 20 tháng 9, các khu vực trũng thấp ven sông vẫn chịu ảnh hưởng nặng nề.\n\n"
    "Dự báo trong 12 đến 24 giờ tới, lũ trên sông Bùi và sông Tích tiếp tục xuống chậm, cuộc sống của hàng nghìn hộ dân ngoại thành vẫn chưa thể sớm ổn định.\n\n"
    "Trái ngược với miền Bắc đang dần nắng ráo, khu vực Tây Nguyên và Nam Bộ lại bước vào đợt mưa lớn kéo dài đến ngày 24 tháng 9. "
    "Liệu thời tiết tại các khu vực này có gây thêm bất ngờ trong những ngày tới?"
)

def load_gemini_api_key() -> str:
    api_key = os.environ.get("GEMINI_API_KEY", "")
    if not api_key and ENV_FILE.exists():
        for line in ENV_FILE.read_text(encoding='utf-8').splitlines():
            line = line.strip()
            if line.startswith("GEMINI_API_KEY="):
                api_key = line.split("=", 1)[1].strip().strip('"').strip("'")
                break
    return api_key

def synthesize_voice(text: str, voice_name: str, api_key: str) -> bytes:
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
    with urllib.request.urlopen(req, timeout=60) as resp:
        res_data = json.loads(resp.read().decode('utf-8'))
    
    parts = res_data.get('candidates', [{}])[0].get('content', {}).get('parts', [])
    for p in parts:
        if 'inlineData' in p and p['inlineData'].get('data'):
            return base64.b64decode(p['inlineData']['data'])
    raise RuntimeError(f"Không tìm thấy audio inlineData cho voice {voice_name}")

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
    print("================================================================")
    print("🎙️ ĐANG SINH BẢN TIN THỜI SỰ VỚI GOOGLE GEMINI TTS...")
    print("================================================================")
    
    # Render bản tin với giọng Charon (Nam trầm đĩnh đạc, chuẩn thời sự 19h)
    print("\n[*] 1. Đang sinh giọng BTV Nam Thời Sự (Charon - Trầm ấm, trang nghiêm)...")
    pcm_charon = synthesize_voice(TEXT_CONTENT, "Charon", api_key)
    path_charon_pub = PUBLIC_DIR / "thoi_su_charon.wav"
    path_charon_art = ARTIFACT_DIR / "thoi_su_charon.wav"
    dur_charon = save_wav(pcm_charon, path_charon_pub)
    save_wav(pcm_charon, path_charon_art)
    print(f"[+] Hoàn tất Charon: {dur_charon} giây ({len(pcm_charon)} bytes PCM)")

    # Render thêm 1 bản với giọng Puck (Nam ấm áp, rõ ràng, truyền cảm) để Anh so sánh
    print("\n[*] 2. Đang sinh giọng BTV Nam Thời Sự (Puck - Ấm áp, truyền cảm)...")
    pcm_puck = synthesize_voice(TEXT_CONTENT, "Puck", api_key)
    path_puck_pub = PUBLIC_DIR / "thoi_su_puck.wav"
    path_puck_art = ARTIFACT_DIR / "thoi_su_puck.wav"
    dur_puck = save_wav(pcm_puck, path_puck_pub)
    save_wav(pcm_puck, path_puck_art)
    print(f"[+] Hoàn tất Puck: {dur_puck} giây ({len(pcm_puck)} bytes PCM)")

    print("\n================================================================")
    print("🎉 ĐÃ SINH XONG CẢ 2 BẢN TIN THỜI SỰ!")
    print(f"  • Bản Charon (Trang nghiêm): {dur_charon}s -> {path_charon_pub}")
    print(f"  • Bản Puck (Truyền cảm): {dur_puck}s -> {path_puck_pub}")
    print("================================================================")

if __name__ == "__main__":
    main()
