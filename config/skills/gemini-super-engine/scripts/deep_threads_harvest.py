#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Deep Threads Media Harvester with Author & Caption Attribution
Connects to Chrome CDP port 9223, scrolls dynamically, and extracts all media.
"""

import sys
import json
import asyncio
import urllib.request
from pathlib import Path
import websockets

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

OUT_DIR = Path(r"C:\Users\game\.gemini\threads_harvest")
OUT_DIR.mkdir(parents=True, exist_ok=True)

async def deep_harvest():
    req = urllib.request.Request("http://127.0.0.1:9223/json")
    with urllib.request.urlopen(req, timeout=5) as resp:
        tabs = json.loads(resp.read().decode("utf-8"))
    
    th_tab = next((t for t in tabs if "Threads" in t.get("title", "") or "threads" in t.get("url", "")), None)
    if not th_tab:
        print("[-] Không tìm thấy tab Threads!")
        return
    
    ws_url = th_tab["webSocketDebuggerUrl"]
    print(f"[*] Đang kết nối tới Tab Threads: {ws_url}...")
    
    async with websockets.connect(ws_url) as ws:
        print("[*] Đang điều khiển cuộn trang Threads 5 lần để nạp thêm UGC mới nhất...")
        for scroll_i in range(5):
            scroll_msg = {
                "id": 100 + scroll_i,
                "method": "Runtime.evaluate",
                "params": {"expression": "window.scrollBy(0, 2000);", "returnByValue": True}
            }
            await ws.send(json.dumps(scroll_msg))
            await ws.recv()
            await asyncio.sleep(2)
        
        extract_js = """
        (() => {
            const items = [];
            const articles = document.querySelectorAll('div[data-pressable-container="true"], article');
            articles.forEach((art, idx) => {
                const text = art.innerText ? art.innerText.trim() : '';
                const vids = Array.from(art.querySelectorAll('video'))
                    .map(v => v.currentSrc || v.src)
                    .filter(s => s && s.includes('.mp4'));
                
                const imgs = Array.from(art.querySelectorAll('img'))
                    .map(m => m.src)
                    .filter(s => s && s.includes('cdninstagram.com') && !s.includes('profile') && !s.includes('avatar') && !s.includes('150x150'));
                
                const authorEl = art.querySelector('a[href*="/@"]') || art.querySelector('span[dir="auto"]');
                const author = authorEl ? authorEl.innerText.trim() : 'Dân cư mạng';

                if (vids.length > 0 || imgs.length > 0 || text.length > 25) {
                    items.push({
                        id: idx,
                        author: author,
                        snippet: text.substring(0, 300).replace(/\\n+/g, ' '),
                        videos: vids,
                        images: imgs
                    });
                }
            });
            return items;
        })()
        """
        
        msg = {
            "id": 200,
            "method": "Runtime.evaluate",
            "params": {"expression": extract_js, "returnByValue": True}
        }
        await ws.send(json.dumps(msg))
        res = json.loads(await ws.recv())
        posts = res.get("result", {}).get("result", {}).get("value", [])
        
        print(f"\n🎉 TỔNG SỐ BÀI VIẾT BÓC TÁCH ĐƯỢC: {len(posts)}")
        
        all_vids = []
        all_imgs = []
        news_ugc_database = []
        
        for p in posts:
            author = p["author"]
            snippet = p["snippet"]
            vids = p["videos"]
            imgs = p["images"]
            
            is_relevant = any(k in snippet.lower() for k in ["ngập", "lụt", "nước", "mưa", "bão", "hà nội", "hoài đức", "tân tây đô", "lặn"])
            
            if is_relevant:
                news_ugc_database.append(p)
                all_vids.extend(vids)
                all_imgs.extend(imgs)
                print(f"  [+] @{author}: {snippet[:80]}... (Vids: {len(vids)}, Imgs: {len(imgs)})")
        
        # Loại bỏ trùng lặp
        all_vids = list(dict.fromkeys(all_vids))
        all_imgs = list(dict.fromkeys(all_imgs))
        
        print(f"\n📊 THỐNG KÊ MEDIA PHÙ HỢP CHỦ ĐỀ NGẬP LỤT:")
        print(f"  • Video MP4 hiện trường: {len(all_vids)}")
        print(f"  • Ảnh hiện trường: {len(all_imgs)}")
        print(f"  • Bài viết tin cậy: {len(news_ugc_database)}")
        
        # Tải thêm các video mới
        headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
        for i, url in enumerate(all_vids, 1):
            target_f = OUT_DIR / f"threads_stream_vid_{i:02d}.mp4"
            if not target_f.exists():
                try:
                    r = urllib.request.Request(url, headers=headers)
                    with urllib.request.urlopen(r, timeout=30) as resp:
                        target_f.write_bytes(resp.read())
                        print(f"  [+] Đã tải video mới #{i}: {target_f.name}")
                except Exception as e:
                    print(f"  [-] Lỗi tải video #{i}: {e}")
        
        # Tải thêm các ảnh mới
        for i, url in enumerate(all_imgs[:10], 1):
            target_f = OUT_DIR / f"threads_stream_img_{i:02d}.jpg"
            if not target_f.exists():
                try:
                    r = urllib.request.Request(url, headers=headers)
                    with urllib.request.urlopen(r, timeout=15) as resp:
                        target_f.write_bytes(resp.read())
                        print(f"  [+] Đã tải ảnh mới #{i}: {target_f.name}")
                except Exception as e:
                    print(f"  [-] Lỗi tải ảnh #{i}: {e}")
        
        # Lưu lại cơ sở dữ liệu UGC
        db_file = OUT_DIR / "threads_ugc_database.json"
        with open(db_file, "w", encoding="utf-8") as f:
            json.dump({
                "source": "Threads Search 'ngập lụt hà nội' - Authenticated Chrome 9223",
                "total_relevant_posts": len(news_ugc_database),
                "total_videos": len(all_vids),
                "total_images": len(all_imgs),
                "posts": news_ugc_database
            }, f, ensure_ascii=False, indent=2)
        print(f"\n[+] ĐÃ LƯU DATABASE TẠI: {db_file}")

if __name__ == "__main__":
    asyncio.run(deep_harvest())
