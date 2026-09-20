#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
════════════════════════════════════════════════════════════════════════════
GEMINI NATIVE VOICEOVER ENGINE FOR SCRIPT FACTORY PRO (v1.0.0)
Part of Google Antigravity Engineering Ecosystem.
Converts Script Factory Pro Canonical Scenes into Studio 24kHz Voiceover WAVs,
calculates frame-accurate durations for Veo 3.1, and prepares CapCut timelines.
════════════════════════════════════════════════════════════════════════════
"""

import os
import sys
import json
import base64
import wave
import urllib.request
import urllib.error
from pathlib import Path

# Đảm bảo xuất UTF-8 an toàn trên Windows
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

BASE_DIR = Path(r"C:\Users\game\.gemini")
ENV_FILE = BASE_DIR / "config" / "sidecars" / "anti_live_voice" / ".env.local"
API_URL_TEMPLATE = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key={key}"

VOICE_MAP = {
    "narrator": "Puck",       # Lời dẫn chuyện nam ấm áp
    "narrator_female": "Aoede",# Lời dẫn chuyện nữ truyền cảm
    "female": "Kore",         # Nhân vật nữ dịu dàng, thanh lịch
    "male": "Puck",           # Nhân vật nam trẻ trung
    "authoritative": "Charon",# Nhân vật nam trầm uy quyền
    "energetic": "Fenrir"     # Nhân vật nam năng động
}

def load_gemini_api_key() -> str:
    """Đọc GEMINI_API_KEY từ biến môi trường hoặc .env.local an toàn"""
    api_key = os.environ.get("GEMINI_API_KEY", "")
    if not api_key and ENV_FILE.exists():
        for line in ENV_FILE.read_text(encoding='utf-8').splitlines():
            line = line.strip()
            if line.startswith("GEMINI_API_KEY="):
                api_key = line.split("=", 1)[1].strip()
                break
    return api_key

def synthesize_speech(text: str, voice_name: str = "Puck", api_key: str = None) -> bytes:
    """Gọi Google Gemini TTS API sinh âm thanh 24kHz PCM thô"""
    if not api_key:
        api_key = load_gemini_api_key()
    if not api_key:
        raise ValueError("Không tìm thấy GEMINI_API_KEY! Vui lòng cấu hình trong .env.local")

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

    with urllib.request.urlopen(req) as resp:
        res_data = json.loads(resp.read().decode('utf-8'))

    candidates = res_data.get('candidates', [])
    if not candidates:
        raise RuntimeError("Không có phản hồi candidate từ Gemini API.")

    parts = candidates[0].get('content', {}).get('parts', [])
    for p in parts:
        if 'inlineData' in p and p['inlineData'].get('data'):
            return base64.b64decode(p['inlineData']['data'])

    raise RuntimeError("Không tìm thấy dữ liệu inlineData audio trong phản hồi.")

def save_pcm_as_wav(pcm_data: bytes, output_wav_path: Path, sample_rate: int = 24000) -> float:
    """Đóng gói dữ liệu PCM 16-bit mono thành file WAV chuẩn và trả về thời lượng (giây)"""
    output_wav_path.parent.mkdir(parents=True, exist_ok=True)
    with wave.open(str(output_wav_path), 'wb') as wf:
        wf.setnchannels(1)       # Mono
        wf.setsampwidth(2)       # 16-bit (2 bytes)
        wf.setframerate(sample_rate)
        wf.writeframes(pcm_data)

    duration_seconds = len(pcm_data) / (sample_rate * 2)
    return round(duration_seconds, 2)

def generate_voiceover_for_scenes(scenes: list, output_dir: Path, default_voice: str = "Puck") -> dict:
    """
    Sinh file âm thanh lồng tiếng cho danh sách các phân cảnh kịch bản:
    Input scenes schema:
    [
      {
        "scene_id": 1,
        "speaker": "narrator", # hoặc "female", "authoritative", "Puck", "Kore"...
        "text": "Lời thoại hoặc lời dẫn của scene..."
      }
    ]
    Output:
    {
      "total_duration": 18.5,
      "scenes": [
        {
          "scene_id": 1,
          "file": "scene_01.wav",
          "path": "...",
          "duration": 4.25,
          "speaker": "narrator",
          "voice": "Puck",
          "recommended_veo_duration": 6
        }
      ]
    }
    """
    api_key = load_gemini_api_key()
    output_dir.mkdir(parents=True, exist_ok=True)
    result_manifest = {
        "engine": "Gemini Native Voiceover Engine v1.0",
        "total_duration_seconds": 0.0,
        "scenes": []
    }

    total_dur = 0.0
    for scene in scenes:
        sid = scene.get("scene_id", 1)
        text = scene.get("text", "").strip()
        speaker = scene.get("speaker", "narrator")
        voice = VOICE_MAP.get(speaker, speaker if speaker in ["Puck", "Charon", "Kore", "Fenrir", "Aoede"] else default_voice)

        if not text:
            continue

        print(f"[*] Đang sinh lồng tiếng cho Scene {sid:02d} ({voice}): \"{text[:40]}...\"")
        pcm_bytes = synthesize_speech(text, voice_name=voice, api_key=api_key)
        wav_file_name = f"scene_{sid:02d}_voice.wav"
        wav_path = output_dir / wav_file_name

        dur = save_pcm_as_wav(pcm_bytes, wav_path)
        total_dur += dur

        # Tính thời lượng khuyến nghị cho Veo 3.1 (4s, 6s hoặc 8s)
        if dur <= 3.8:
            rec_veo = 4
        elif dur <= 5.8:
            rec_veo = 6
        else:
            rec_veo = 8

        result_manifest["scenes"].append({
            "scene_id": sid,
            "file": wav_file_name,
            "path": str(wav_path),
            "duration_seconds": dur,
            "speaker": speaker,
            "voice_used": voice,
            "recommended_veo_duration": rec_veo,
            "text": text
        })

    result_manifest["total_duration_seconds"] = round(total_dur, 2)
    manifest_path = output_dir / "scene_durations.json"
    with open(manifest_path, 'w', encoding='utf-8') as f:
        json.dump(result_manifest, f, ensure_ascii=False, indent=2)

    print(f"\n[+] HOÀN TẤT: Đã sinh {len(result_manifest['scenes'])} file lồng tiếng (Tổng: {round(total_dur, 2)}s).")
    print(f"[+] Bảng kê thời lượng lưu tại: {manifest_path}")
    return result_manifest

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Gemini Native Voiceover Engine")
    parser.add_argument("--text", type=str, help="Văn bản cần lồng tiếng đơn lẻ")
    parser.add_argument("--voice", type=str, default="Puck", choices=["Puck", "Charon", "Kore", "Fenrir", "Aoede"])
    parser.add_argument("--out", type=str, default="output_voice.wav", help="Đường dẫn file wav xuất ra")
    args = parser.parse_args()

    if args.text:
        print(f"[*] Đang sinh giọng đọc cho: {args.text}")
        pcm = synthesize_speech(args.text, voice_name=args.voice)
        dur = save_pcm_as_wav(pcm, Path(args.out))
        print(f"[+] Xuất thành công file {args.out} (Thời lượng: {dur}s)")
    else:
        print("Vui lòng cung cấp --text hoặc nhập module vào quy trình sản xuất.")
