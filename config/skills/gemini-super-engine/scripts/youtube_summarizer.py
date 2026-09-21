#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
════════════════════════════════════════════════════════════════════════════
YOUTUBE DEEP FORENSICS & SUMMARIZER FOR ANTIGRAVITY 2.0
Analyzes, summarizes, and extracts timestamps/scripts from any YouTube URL
directly via Google Gemini's native cloud ingestion.
════════════════════════════════════════════════════════════════════════════
"""

import os
import sys
import json
import urllib.request
import urllib.error
from pathlib import Path

# Đảm bảo xuất UTF-8 an toàn trên Windows
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

BASE_DIR = Path(r"C:\Users\game\.gemini")
ENV_FILE = BASE_DIR / "config" / "sidecars" / "anti_live_voice" / ".env.local"
DEFAULT_MODEL = "gemini-3.5-flash"

def load_gemini_api_key() -> str:
    api_key = os.environ.get("GEMINI_API_KEY", "")
    if not api_key and ENV_FILE.exists():
        with open(ENV_FILE, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line.startswith("GEMINI_API_KEY="):
                    api_key = line.split("=", 1)[1].strip().strip('"').strip("'")
                    break
    if not api_key:
        raise ValueError("Không tìm thấy GEMINI_API_KEY trong .env.local hoặc biến môi trường!")
    return api_key

def summarize_youtube_video(youtube_url: str, custom_instruction: str = None, model: str = DEFAULT_MODEL) -> dict:
    """Tóm tắt và phân tích chuyên sâu bất kỳ video YouTube nào từ URL"""
    api_key = load_gemini_api_key()
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
    
    if not custom_instruction:
        prompt = (
            f"Bạn là Chuyên gia Phân tích Truyền thông & Đạo diễn Nội dung Cấp cao. "
            f"Hãy xem và phân tích toàn diện video YouTube này: {youtube_url}\n\n"
            f"Cấu trúc bản phân tích gồm:\n"
            f"1. 📌 TÓM TẮT CỐT LÕI (Executive Summary): Thông điệp chính và giá trị lớn nhất của video.\n"
            f"2. ⏱️ DÒNG THỜI GIAN & PHÂN CẢNH (Timestamp Breakdown): Liệt kê các mốc thời gian [Phút:Giây] và nội dung tương ứng.\n"
            f"3. 🎯 ĐIỂM GIỮ CHÂN & BÍ QUYẾT VIRAL (Hook & Retention Analysis): Phân tích 30 giây đầu họ làm gì, cách chuyển cảnh và nhịp độ dẫn dắt.\n"
            f"4. 💡 BÀI HỌC VÀ CÁCH ÁP DỤNG: Gợi ý cách để biến ý tưởng video này thành kịch bản video AI mới (cho thương hiệu ANH ATELIER hoặc kênh cá nhân)."
        )
    else:
        prompt = f"Video YouTube: {youtube_url}\n\nYêu cầu phân tích: {custom_instruction}"
    
    payload = {
        "contents": [
            {
                "parts": [
                    {"text": prompt}
                ]
            }
        ]
    }
    
    req_data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=req_data,
        headers={"Content-Type": "application/json"}
    )
    
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            candidate = data.get("candidates", [{}])[0]
            parts = candidate.get("content", {}).get("parts", [])
            text_response = "".join([p.get("text", "") for p in parts if "text" in p])
            
            return {
                "success": True,
                "youtube_url": youtube_url,
                "analysis": text_response
            }
    except urllib.error.HTTPError as e:
        err_msg = e.read().decode("utf-8", errors="replace")
        return {
            "success": False,
            "error": f"HTTP {e.code}: {err_msg}"
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

if __name__ == "__main__":
    test_link = sys.argv[1] if len(sys.argv) > 1 else "https://www.youtube.com/watch?v=jV1vkHv4zq8"
    print(f"🎬 Đang phân tích video YouTube: {test_link}...")
    res = summarize_youtube_video(test_link)
    if res["success"]:
        print("\n" + "="*70)
        print("✅ KẾT QUẢ PHÂN TÍCH CHUYÊN SÂU TỪ GEMINI:")
        print("="*70 + "\n")
        print(res["analysis"])
    else:
        print(f"\n❌ Lỗi: {res['error']}")
