#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
════════════════════════════════════════════════════════════════════════════
CLOUD PYTHON CODE EXECUTOR FOR ANTIGRAVITY 2.0
Executes calculations, simulations, and data analysis in Google's Cloud Python Sandbox.
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

def execute_cloud_code(prompt: str, model: str = DEFAULT_MODEL) -> dict:
    api_key = load_gemini_api_key()
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
    
    payload = {
        "contents": [
            {
                "parts": [
                    {"text": prompt}
                ]
            }
        ],
        "tools": [
            {
                "code_execution": {}
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
        with urllib.request.urlopen(req, timeout=45) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            
            candidate = data.get("candidates", [{}])[0]
            parts = candidate.get("content", {}).get("parts", [])
            
            code_blocks = []
            execution_outputs = []
            final_text = []
            
            for part in parts:
                if "executableCode" in part:
                    exec_code = part["executableCode"]
                    code_blocks.append({
                        "language": exec_code.get("language", "PYTHON"),
                        "code": exec_code.get("code", "")
                    })
                elif "codeExecutionResult" in part:
                    exec_res = part["codeExecutionResult"]
                    execution_outputs.append({
                        "outcome": exec_res.get("outcome", ""),
                        "output": exec_res.get("output", "")
                    })
                elif "text" in part:
                    final_text.append(part["text"])
            
            return {
                "success": True,
                "prompt": prompt,
                "explanation": "\n".join(final_text),
                "code_blocks": code_blocks,
                "execution_outputs": execution_outputs
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
    math_prompt = "Hãy viết code Python để tính số Fibonacci thứ 100 và phân tích thừa số nguyên tố của số 123456789. Chạy code và xuất kết quả chính xác."
    print(f"💻 Đang gửi tác vụ tới Cloud Python Sandbox...")
    res = execute_cloud_code(math_prompt)
    if res["success"]:
        print("\n✅ KẾT QUẢ CHẠY TRÊN CLOUD GOOGLE:")
        for idx, cb in enumerate(res["code_blocks"], 1):
            print(f"\n--- Code Python #{idx} ---")
            print(cb["code"].strip())
        for idx, eo in enumerate(res["execution_outputs"], 1):
            print(f"\n--- Kết quả chạy #{idx} ({eo['outcome']}) ---")
            print(eo["output"].strip())
        print(f"\n--- Lời bình của AI ---")
        print(res["explanation"])
    else:
        print(f"\n❌ Lỗi: {res['error']}")
