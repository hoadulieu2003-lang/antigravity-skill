#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
════════════════════════════════════════════════════════════════════════════
GOOGLE SEARCH GROUNDING ENGINE FOR ANTIGRAVITY 2.0
Queries Gemini 2.5 Flash with Real-time Google Search Grounding.
Returns fact-checked responses with live web citations and URLs.
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

def search_grounded_query(query: str, model: str = DEFAULT_MODEL) -> dict:
    api_key = load_gemini_api_key()
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
    
    payload = {
        "contents": [
            {
                "parts": [
                    {"text": query}
                ]
            }
        ],
        "tools": [
            {
                "google_search": {}
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
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            
            candidate = data.get("candidates", [{}])[0]
            content = candidate.get("content", {})
            parts = content.get("parts", [])
            text_response = "".join([p.get("text", "") for p in parts if "text" in p])
            
            grounding_meta = candidate.get("groundingMetadata", {})
            web_sources = []
            
            chunks = grounding_meta.get("groundingChunks", [])
            for chunk in chunks:
                web = chunk.get("web", {})
                if web:
                    web_sources.append({
                        "title": web.get("title", ""),
                        "url": web.get("uri", "")
                    })
            
            search_queries = grounding_meta.get("webSearchQueries", [])
            
            return {
                "success": True,
                "query": query,
                "answer": text_response,
                "search_queries": search_queries,
                "sources": web_sources,
                "raw_metadata": grounding_meta
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
    test_query = "Giá vàng thế giới và tin tức công nghệ AI mới nhất hôm nay là gì?"
    print(f"🔍 Đang tra cứu với Google Search Grounding: \"{test_query}\"...")
    res = search_grounded_query(test_query)
    if res["success"]:
        print("\n✅ KẾT QUẢ ĐÃ ĐƯỢC BẢO CHỨNG BỞI GOOGLE:")
        print(res["answer"])
        print("\n📚 NGUỒN TRÍCH DẪN:")
        for s in res["sources"]:
            print(f"  • {s['title']} -> {s['url']}")
    else:
        print(f"\n❌ Lỗi: {res['error']}")
