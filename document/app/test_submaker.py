import asyncio
import edge_tts
from pathlib import Path

TEXT = "Sốc thật sự. Hôm nay mình mới biết tám mươi phần trăm những gì chúng ta cố gắng ở công sở... gần như là vô nghĩa."
VOICE = "vi-VN-NamMinhNeural"
OUTPUT_AUDIO = Path(r"C:\Users\game\.gemini\document\app\test_voice.mp3")

async def test_tts():
    communicate = edge_tts.Communicate(TEXT, VOICE, rate="+5%")
    submaker = edge_tts.SubMaker()
    with open(str(OUTPUT_AUDIO), "wb") as f:
        async for chunk in communicate.stream():
            if chunk["type"] == "audio":
                f.write(chunk["data"])
            elif chunk["type"] == "WordBoundary":
                submaker.feed(chunk)
    
    print(f"Generated audio: {OUTPUT_AUDIO.stat().st_size} bytes")
    print("SRT sample:\n", submaker.get_srt()[:300])

if __name__ == "__main__":
    asyncio.run(test_tts())
