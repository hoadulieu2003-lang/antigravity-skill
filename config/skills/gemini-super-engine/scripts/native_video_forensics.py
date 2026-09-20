#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
════════════════════════════════════════════════════════════════════════════
NATIVE VIDEO FORENSICS ENGINE FOR ANTIGRAVITY 2.0
Uploads MP4 videos via Google Files API and extracts frame-accurate cinematographic,
narrative, audio, and pacing breakdowns with timestamps.
════════════════════════════════════════════════════════════════════════════
"""

import os
import sys
import time
import json
import urllib.request
import urllib.error
from pathlib import Path

# Đảm bảo xuất UTF-8 an toàn trên Windows
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

BASE_DIR = Path(r"C:\Users\game\.gemini")
ENV_FILE = BASE_DIR / "config" / "sidecars" / "anti_live_voice" / ".env.local"
DEFAULT_MODEL = "gemini-2.5-flash"

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

def upload_media_file(file_path: Path, mime_type: str = "video/mp4") -> dict:
    """Tải file video hoặc tài liệu lên Google Files API qua Resumable Upload"""
    api_key = load_gemini_api_key()
    file_size = file_path.stat().st_size
    display_name = file_path.stem
    
    # Bước 1: Khởi tạo Resumable Upload
    init_url = f"https://generativelanguage.googleapis.com/upload/v1beta/files?key={api_key}"
    headers = {
        "X-Goog-Upload-Protocol": "resumable",
        "X-Goog-Upload-Command": "start",
        "X-Goog-Upload-Header-Content-Length": str(file_size),
        "X-Goog-Upload-Header-Content-Type": mime_type,
        "Content-Type": "application/json"
    }
    init_payload = json.dumps({"file": {"display_name": display_name}}).encode("utf-8")
    
    req = urllib.request.Request(init_url, data=init_payload, headers=headers)
    with urllib.request.urlopen(req, timeout=30) as resp:
        upload_url = resp.headers.get("X-Goog-Upload-URL")
    
    if not upload_url:
        raise RuntimeError("Google Files API không trả về X-Goog-Upload-URL!")
    
    # Bước 2: Đẩy dữ liệu nhị phân lên upload_url
    with open(file_path, "rb") as f:
        file_bytes = f.read()
    
    upload_headers = {
        "Content-Length": str(file_size),
        "X-Goog-Upload-Offset": "0",
        "X-Goog-Upload-Command": "upload, finalize"
    }
    upload_req = urllib.request.Request(upload_url, data=file_bytes, headers=upload_headers)
    with urllib.request.urlopen(upload_req, timeout=120) as resp:
        file_info = json.loads(resp.read().decode("utf-8")).get("file", {})
    
    # Bước 3: Đợi file chuyển sang trạng thái ACTIVE (xử lý video)
    file_name = file_info.get("name")
    file_uri = file_info.get("uri")
    
    state = file_info.get("state")
    while state == "PROCESSING":
        time.sleep(3)
        check_url = f"https://generativelanguage.googleapis.com/v1beta/{file_name}?key={api_key}"
        check_req = urllib.request.Request(check_url)
        with urllib.request.urlopen(check_req, timeout=30) as check_resp:
            info = json.loads(check_resp.read().decode("utf-8"))
            state = info.get("state")
            if state == "FAILED":
                raise RuntimeError(f"Xử lý file thất bại trên Google Cloud: {info.get('error')}")
    
    return {
        "name": file_name,
        "uri": file_uri,
        "mime_type": mime_type,
        "display_name": display_name
    }

def analyze_video_forensics(file_path: Path, prompt: str = None, model: str = DEFAULT_MODEL) -> dict:
    """Phân tích video chi tiết theo từng dấu thời gian (timestamps)"""
    if not prompt:
        prompt = (
            "Bạn là Đạo diễn Điện ảnh & Chuyên gia Pháp y Video Cấp cao. "
            "Hãy phân tích chi tiết video này:\n"
            "1. Tóm tắt nội dung cốt lõi và thông điệp cảm xúc.\n"
            "2. Bảng phân tích phân cảnh theo từng dấu thời gian (Timestamps):\n"
            "   - [Phút:Giây - Phút:Giây]: Góc quay (Shot size, Camera angle), Chuyển động máy, Ánh sáng, Màu sắc.\n"
            "   - Lời thoại / Âm thanh / Tiếng động nền tại phân cảnh đó.\n"
            "3. Đánh giá nhịp độ (Pacing) và điểm giữ chân khán giả (Audience Hook).\n"
            "4. Đề xuất cải tiến nếu muốn đưa vào hệ thống Script Factory Pro."
        )
    
    api_key = load_gemini_api_key()
    upload_res = upload_media_file(file_path, mime_type="video/mp4")
    
    generate_url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
    payload = {
        "contents": [
            {
                "parts": [
                    {
                        "fileData": {
                            "mimeType": upload_res["mime_type"],
                            "fileUri": upload_res["uri"]
                        }
                    },
                    {
                        "text": prompt
                    }
                ]
            }
        ]
    }
    
    req_data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        generate_url,
        data=req_data,
        headers={"Content-Type": "application/json"}
    )
    
    with urllib.request.urlopen(req, timeout=120) as resp:
        data = json.loads(resp.read().decode("utf-8"))
        candidate = data.get("candidates", [{}])[0]
        parts = candidate.get("content", {}).get("parts", [])
        analysis_text = "".join([p.get("text", "") for p in parts if "text" in p])
        
        return {
            "success": True,
            "video_file": str(file_path.resolve()),
            "google_file_uri": upload_res["uri"],
            "analysis": analysis_text
        }

if __name__ == "__main__":
    print("🎬 Native Video Forensics Engine đã sẵn sàng nhận file video MP4!")
