#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
════════════════════════════════════════════════════════════════════════════
AUTONOMOUS SFX STUDIO MIXER FOR ANTIGRAVITY 2.0
Mixes Voiceover with Background Foley, Sound Effects, and News Jingles
using NumPy and SoundFile (Studio 24kHz / 44.1kHz).
════════════════════════════════════════════════════════════════════════════
"""

import sys
from pathlib import Path
import numpy as np
import soundfile as sf
from scipy import signal

# Đảm bảo UTF-8
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

BASE_DIR = Path(r"C:\Users\game\.gemini")
SFX_VAULT = BASE_DIR / "config" / "skills" / "gemini-super-engine" / "sfx_vault"
PUBLIC_DIR = BASE_DIR / "config" / "sidecars" / "anti_live_voice" / "public"
ARTIFACT_DIR = Path(r"C:\Users\game\.gemini\antigravity\brain\6f46af53-7f44-46a4-83e9-d518ccfc6f9f")

def load_audio_mono(file_path: Path, target_sr: int = 24000) -> np.ndarray:
    """Đọc file âm thanh bất kỳ (MP3/WAV), chuyển thành mono và resample về target_sr"""
    data, sr = sf.read(str(file_path))
    # Nếu là stereo -> chuyển sang mono
    if data.ndim > 1:
        data = np.mean(data, axis=1)
    
    # Resample về target_sr nếu cần
    if sr != target_sr:
        num_samples = int(len(data) * target_sr / sr)
        data = signal.resample(data, num_samples)
    
    return data.astype(np.float32)

def mix_news_broadcast_with_sfx():
    print("================================================================")
    print("🎬 ĐANG HÒA ÂM BẢN TIN THỜI SỰ CHUYÊN NGHIỆP VỚI HIỆU ỨNG SFX...")
    print("================================================================")

    target_sr = 24000
    
    # 1. Đọc giọng BTV Nữ Thời Sự Aoede
    voice_path = PUBLIC_DIR / "thoi_su_nu_aoede.wav"
    print(f"[*] Đang tải giọng đọc BTV Nữ: {voice_path.name}...")
    voice = load_audio_mono(voice_path, target_sr)
    voice_duration = len(voice) / target_sr
    print(f"    • Thời lượng giọng đọc: {voice_duration:.2f} giây")

    # 2. Đọc Nhạc hiệu Thời sự (Breaking News Jingle)
    jingle_path = SFX_VAULT / "breaking_news_jingle.mp3"
    print(f"[*] Đang tải nhạc hiệu Intro: {jingle_path.name}...")
    jingle = load_audio_mono(jingle_path, target_sr)
    # Giảm âm lượng nhẹ jingle
    jingle = jingle * 0.7

    # 3. Đọc Tiếng Mưa Rơi Bão Lũ (Heavy Rain)
    rain_path = SFX_VAULT / "heavy_rain.mp3"
    print(f"[*] Đang tải hiệu ứng Mưa Bão Nền: {rain_path.name}...")
    rain = load_audio_mono(rain_path, target_sr)

    # 4. Đọc Tiếng Sấm Sét (Thunder Strike)
    thunder_path = SFX_VAULT / "thunder_strike.mp3"
    print(f"[*] Đang tải hiệu ứng Sấm Sét: {thunder_path.name}...")
    thunder = load_audio_mono(thunder_path, target_sr)

    # 5. Xây dựng Dòng Thời Gian Bàn Trộn (Studio Timeline Alignment)
    # Cấu trúc timeline:
    # 0.0s -> 2.5s: Nhạc hiệu mở đầu thời sự
    # 2.0s: BTV bắt đầu cất giọng đọc (gối đầu nhẹ 0.5s với đuôi nhạc hiệu)
    # 0.0s -> Hết: Tiếng mưa bão nền chạy ngầm nhẹ nhàng ở mức -18dB (hệ số 0.15)
    # 8.0s: Tiếng sấm sét vang lên điểm xuyết khi BTV đọc "mức báo động 3"
    
    voice_offset_sec = 2.0
    voice_offset_samples = int(voice_offset_sec * target_sr)
    
    total_samples = voice_offset_samples + len(voice) + int(2.0 * target_sr) # thêm 2s outro
    master_track = np.zeros(total_samples, dtype=np.float32)

    # A. Thêm Nhạc hiệu thời sự vào đầu (offset 0s)
    len_jingle = min(len(jingle), total_samples)
    master_track[:len_jingle] += jingle[:len_jingle]

    # B. Thêm Tiếng Mưa Nền chạy suốt bản tin (Volume nhẹ -18dB = 0.14)
    rain_volume = 0.14
    # Lặp lại tiếng mưa nếu ngắn hơn tổng thời lượng
    rain_repeated = np.tile(rain, int(np.ceil(total_samples / len(rain))))[:total_samples]
    # Fade in mưa 1s đầu, fade out 2s cuối
    fade_in_samples = int(1.0 * target_sr)
    fade_out_samples = int(2.0 * target_sr)
    rain_repeated[:fade_in_samples] *= np.linspace(0, 1, fade_in_samples)
    rain_repeated[-fade_out_samples:] *= np.linspace(1, 0, fade_out_samples)
    master_track += rain_repeated * rain_volume

    # C. Thêm Tiếng Sấm Sét ở giây thứ 8 (khi nhắc đến nước sông lên báo động 3)
    thunder_offset_sec = 8.0
    thunder_offset_samples = int(thunder_offset_sec * target_sr)
    thunder_vol = 0.35
    len_th = min(len(thunder), total_samples - thunder_offset_samples)
    master_track[thunder_offset_samples:thunder_offset_samples+len_th] += thunder[:len_th] * thunder_vol

    # D. Thêm Tiếng Sấm Sét lần 2 ở giây thứ 32 (khi chuyển sang đoạn Phú Thọ thiệt hại)
    thunder2_offset_sec = 32.0
    thunder2_offset_samples = int(thunder2_offset_sec * target_sr)
    len_th2 = min(len(thunder), total_samples - thunder2_offset_samples)
    master_track[thunder2_offset_samples:thunder2_offset_samples+len_th2] += thunder[:len_th2] * (thunder_vol * 0.8)

    # E. Thêm Giọng BTV Nữ Thời Sự ở 2.0s (Volume chính 0dB = 1.0)
    master_track[voice_offset_samples:voice_offset_samples+len(voice)] += voice

    # F. Normalization & Peak Limiting để không bao giờ bị vỡ âm / clipping
    max_peak = np.max(np.abs(master_track))
    if max_peak > 0.95:
        master_track = master_track * (0.95 / max_peak)

    # 6. Xuất file hoàn chỉnh
    out_pub = PUBLIC_DIR / "thoi_su_master_vtv_sfx.wav"
    out_art = ARTIFACT_DIR / "thoi_su_master_vtv_sfx.wav"
    
    sf.write(str(out_pub), master_track, target_sr, subtype='PCM_16')
    sf.write(str(out_art), master_track, target_sr, subtype='PCM_16')

    total_dur_sec = total_samples / target_sr
    print(f"\n[+] HOÀN TẤT HÒA ÂM MASTER!")
    print(f"  • Tổng thời lượng bản tin hoàn chỉnh: {total_dur_sec:.2f} giây")
    print(f"  • File xuất bản: {out_pub} ({out_pub.stat().st_size} bytes)")
    print("================================================================")
    return out_pub

if __name__ == "__main__":
    mix_news_broadcast_with_sfx()
