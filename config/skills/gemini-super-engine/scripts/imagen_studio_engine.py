#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
════════════════════════════════════════════════════════════════════════════
IMAGEN 3 STUDIO ENGINE FOR ANTIGRAVITY 2.0
Generates hyper-realistic imagery and sharp typographic visuals (Text-in-Image).
════════════════════════════════════════════════════════════════════════════
"""

import os
import sys
import json
import base64
import urllib.request
import urllib.error
from pathlib import Path

# Đảm bảo xuất UTF-8 an toàn trên Windows
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

BASE_DIR = Path(r"C:\Users\game\.gemini")
ENV_FILE = BASE_DIR / "config" / "sidecars" / "anti_live_voice" / ".env.local"
DEFAULT_MODEL = "imagen-3.0-generate-002"

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

def generate_image_with_imagen3(
    prompt: str,
    output_path: Path,
    aspect_ratio: str = "1:1",
    model: str = DEFAULT_MODEL
) -> dict:
    api_key = load_gemini_api_key()
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:predict?key={api_key}"
    
    payload = {
        "instances": [
            {
                "prompt": prompt
            }
        ],
        "parameters": {
            "sampleCount": 1,
            "aspectRatio": aspect_ratio,
            "outputMimeType": "image/jpeg"
        }
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
            
            predictions = data.get("predictions", [])
            if not predictions:
                return {
                    "success": False,
                    "error": "Không nhận được dự đoán hình ảnh từ Imagen 3 API!"
                }
            
            b64_img = predictions[0].get("bytesBase64Encoded", "")
            if not b64_img:
                return {
                    "success": False,
                    "error": "Dữ liệu hình ảnh rỗng!"
                }
            
            img_bytes = base64.b64decode(b64_img)
            output_path.parent.mkdir(parents=True, exist_ok=True)
            with open(output_path, "wb") as f:
                f.write(img_bytes)
            
            return {
                "success": True,
                "prompt": prompt,
                "output_path": str(output_path.resolve()),
                "file_size_bytes": len(img_bytes),
                "aspect_ratio": aspect_ratio
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
    prompt = (
        "High-end luxury fashion campaign for ANH ATELIER. "
        "An elegant Vietnamese female model wearing a golden silk couture ao dai dress, "
        "posing in front of an ancient Vietnamese imperial palace gate at sunset. "
        "Warm golden hour lighting, cinematic film grain, 8k resolution, photorealistic masterpiece. "
        "Sharp typography on top reads 'ANH ATELIER'."
    )
    test_out = Path(r"C:\Users\game\.gemini\config\skills\gemini-super-engine\scripts\test_output\anh_atelier_imagen3.jpg")
    print("🎨 Đang sinh ảnh quang học chất lượng cao bằng Imagen 3...")
    res = generate_image_with_imagen3(prompt, test_out, aspect_ratio="1:1")
    if res["success"]:
        print(f"✅ ĐÃ SINH ẢNH THÀNH CÔNG: {res['output_path']} ({res['file_size_bytes']} bytes)")
    else:
        print(f"❌ Lỗi: {res['error']}")
