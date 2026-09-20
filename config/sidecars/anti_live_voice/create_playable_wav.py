import wave
import shutil
import os

src_dir = r"C:\Users\game\.gemini\config\sidecars\anti_live_voice"
raw_path = os.path.join(src_dir, "test_gemini_voice.wav")
out_path = os.path.join(src_dir, "public", "gemini_voice_official.wav")
brain_dir = r"C:\Users\game\.gemini\antigravity\brain\6f46af53-7f44-46a4-83e9-d518ccfc6f9f"
brain_out = os.path.join(brain_dir, "gemini_voice_official.wav")

with open(raw_path, "rb") as f:
    raw_pcm = f.read()

# Đóng gói chuẩn WAV 44-byte header: Mono, 16-bit, 24,000Hz
with wave.open(out_path, "wb") as wf:
    wf.setnchannels(1)
    wf.setsampwidth(2)
    wf.setframerate(24000)
    wf.writeframes(raw_pcm)

shutil.copyfile(out_path, brain_out)
print(f"WAV created successfully at: {out_path} ({os.path.getsize(out_path)} bytes)")
