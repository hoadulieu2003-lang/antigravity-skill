#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Render bản tin thời sự tiếng Nhật chuẩn đài NHK qua Gemini TTS.
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

# Bản tin dịch chuẩn văn phong thời sự đài truyền hình NHK Nhật Bản
JAPANESE_NEWS_TEXT = (
    "ベトナム北部では雨が止んだものの、ハノイ市のティク川とブイ川の水位は依然として非常に引くのが遅く、警戒レベル3を超えた状態が続いています。"
    "9月21日朝の時点で、ニンビン省とハノイ市で5,000棟以上の住宅が依然として浸水被害に見舞われています。\n\n"
    "ここ数日の豪雨と洪水により、フート省で3人が死亡、8棟の家屋が倒壊し、111棟が一部損壊しました。"
    "浸水家屋の総数は前日に比べ8,000棟以上減少したものの、河川沿いの低地では依然として深刻な影響が続いています。\n\n"
    "今後12時間から24時間は水位の低下が緩慢な見込みで、郊外に暮らす何千もの世帯の生活再建にはなお時間がかかる見通しです。\n\n"
    "一方、北部の天候が回復傾向にあるのとは対照的に、中部高原タイグエン地域および南部では9月24日にかけて大雨が続く見込みです。"
    "今後の気象情報に厳重な警戒が必要です。"
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
    with urllib.request.urlopen(req, timeout=120) as resp:
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
    print("🇯🇵 ĐANG SINH BẢN TIN THỜI SỰ TIẾNG NHẬT VỚI GEMINI TTS...")
    print("================================================================")
    
    # 1. Giọng Nữ Kore: Chuẩn Nữ Phát Thanh Viên Đài NHK Tokyo
    print("\n[*] 1. Đang sinh giọng BTV Nữ Thời Sự Tiếng Nhật (Kore - Chuẩn Tokyo NHK)...")
    pcm_kore = synthesize_voice(JAPANESE_NEWS_TEXT, "Kore", api_key)
    path_kore_pub = PUBLIC_DIR / "thoi_su_nhat_kore.wav"
    path_kore_art = ARTIFACT_DIR / "thoi_su_nhat_kore.wav"
    dur_kore = save_wav(pcm_kore, path_kore_pub)
    save_wav(pcm_kore, path_kore_art)
    print(f"[+] Hoàn tất Kore: {dur_kore} giây ({len(pcm_kore)} bytes PCM)")

    # 2. Giọng Nam Puck / Charon: Nam phát thanh viên Nhật Bản
    print("\n[*] 2. Đang sinh giọng BTV Nam Thời Sự Tiếng Nhật (Puck - Đĩnh đạc, rõ nét)...")
    pcm_puck = synthesize_voice(JAPANESE_NEWS_TEXT, "Puck", api_key)
    path_puck_pub = PUBLIC_DIR / "thoi_su_nhat_puck.wav"
    path_puck_art = ARTIFACT_DIR / "thoi_su_nhat_puck.wav"
    dur_puck = save_wav(pcm_puck, path_puck_pub)
    save_wav(pcm_puck, path_puck_art)
    print(f"[+] Hoàn tất Puck: {dur_puck} giây ({len(pcm_puck)} bytes PCM)")

    print("\n================================================================")
    print("🎉 ĐÃ SINH XONG 2 BẢN TIN THỜI SỰ TIẾNG NHẬT!")
    print(f"  • Bản Nữ Kore (NHK Tokyo): {dur_kore}s -> {path_kore_pub}")
    print(f"  • Bản Nam Puck: {dur_puck}s -> {path_puck_pub}")
    print("================================================================")

if __name__ == "__main__":
    main()
