#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
════════════════════════════════════════════════════════════════════════════
LIVE THREADS MEDIA HARVESTER FOR ANTIGRAVITY 2.0
Directly connects to Chrome CDP session on port 9223, evaluates the live DOM
of the authenticated Threads search feed, extracts high-res photos & videos,
and downloads them with author captions.
════════════════════════════════════════════════════════════════════════════
"""

import sys
import json
import asyncio
import urllib.request
from pathlib import Path
import websockets

# Đảm bảo UTF-8
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

DEST_DIR = Path(r"C:\Users\game\.gemini\threads_harvest")
DEST_DIR.mkdir(parents=True, exist_ok=True)

CDP_JSON_URL = "http://127.0.0.1:9223/json"

async def get_threads_ws_url():
    req = urllib.request.Request(CDP_JSON_URL)
    with urllib.request.urlopen(req, timeout=5) as resp:
        tabs = json.loads(resp.read().decode("utf-8"))
    for t in tabs:
        if "Threads" in t.get("title", "") or "threads.com" in t.get("url", "") or "threads.net" in t.get("url", ""):
            return t.get("webSocketDebuggerUrl")
    return None

EXTRACT_JS = """
(() => {
    // 1. Quét tất cả bài đăng
    const posts = [];
    const articles = document.querySelectorAll('div[data-pressable-container="true"], article');
    
    // 2. Quét tất cả hình ảnh chất lượng cao
    const images = [];
    document.querySelectorAll('img').forEach((img, idx) => {
        const src = img.src || '';
        // Lọc ảnh bài viết từ CDN Instagram (bỏ avatar nhỏ)
        if (src.includes('cdninstagram.com') && !src.includes('profile') && !src.includes('avatar') && !src.includes('150x150')) {
            images.push({
                index: idx,
                src: src,
                alt: img.alt || ''
            });
        }
    });

    // 3. Quét các video
    const videos = [];
    document.querySelectorAll('video').forEach((v, idx) => {
        const src = v.src || (v.querySelector('source') ? v.querySelector('source').src : '');
        if (src) {
            videos.push({
                index: idx,
                src: src,
                poster: v.poster || ''
            });
        }
    });

    // 4. Quét các đoạn caption / chia sẻ thực tế
    const captions = [];
    document.querySelectorAll('span').forEach(el => {
        const t = el.innerText ? el.innerText.trim() : '';
        if (t.length > 20 && (t.includes('ngập') || t.includes('lụt') || t.includes('nước') || t.includes('mưa') || t.includes('lũ') || t.includes('bão') || t.includes('Hoài Đức') || t.includes('Hà Nội'))) {
            if (!captions.includes(t)) {
                captions.push(t);
            }
        }
    });

    return {
        url: window.location.href,
        title: document.title,
        images: images,
        videos: videos,
        captions: captions
    };
})()
"""

async def run_harvester():
    ws_url = await get_threads_ws_url()
    if not ws_url:
        print("[-] Không tìm thấy tab Threads đang mở trên Chrome port 9223!")
        return

    print(f"[*] Đang kết nối tới Tab Threads qua WebSocket: {ws_url}...")
    async with websockets.connect(ws_url) as ws:
        # Bước 1: Tự động cuộn trang 2 lần để tải thêm bài mới
        print("[*] Đang điều khiển cuộn trang Threads để nạp thêm bài đăng mới...")
        scroll_msg = {
            "id": 1,
            "method": "Runtime.evaluate",
            "params": {
                "expression": "window.scrollBy(0, 1500);",
                "returnByValue": True
            }
        }
        await ws.send(json.dumps(scroll_msg))
        await ws.recv()
        await asyncio.sleep(2)

        # Bước 2: Trích xuất dữ liệu DOM bài viết
        print("[*] Đang bóc tách ảnh, video và caption hiện trường thực tế từ DOM...")
        extract_msg = {
            "id": 2,
            "method": "Runtime.evaluate",
            "params": {
                "expression": EXTRACT_JS,
                "returnByValue": True
            }
        }
        await ws.send(json.dumps(extract_msg))
        raw_res = await ws.recv()
        res_data = json.loads(raw_res)

        result_obj = res_data.get("result", {}).get("result", {}).get("value", {})
        images = result_obj.get("images", [])
        videos = result_obj.get("videos", [])
        captions = result_obj.get("captions", [])

        print("\n" + "="*70)
        print("🎉 KẾT QUẢ QUÉT TRỰC TIẾP TỪ TAB THREADS CỦA ANH:")
        print("="*70)
        print(f"  • Tổng số ảnh hiện trường phát hiện: {len(images)}")
        print(f"  • Tổng số video hiện trường phát hiện: {len(videos)}")
        print(f"  • Số lượng caption / lời kể của người dân: {len(captions)}")

        print("\n📝 MỘT SỐ CÂU CHUYỆN / CAPTION THỰC ĐỊA BÓC TÁCH ĐƯỢC:")
        for idx, cap in enumerate(captions[:5], 1):
            print(f"  {idx}. \"{cap}\"")

        # Bước 3: Tải ảnh chất lượng cao về thư mục máy tính
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        }
        
        print("\n[*] Đang tải các hình ảnh thực tế chất lượng cao về máy...")
        downloaded_count = 0
        for idx, img in enumerate(images[:6], 1):
            img_url = img["src"]
            out_file = DEST_DIR / f"threads_flood_{idx:02d}.jpg"
            try:
                req = urllib.request.Request(img_url, headers=headers)
                with urllib.request.urlopen(req, timeout=15) as r:
                    data = r.read()
                    out_file.write_bytes(data)
                    print(f"  [+] Đã tải ảnh #{idx}: {out_file.name} ({len(data)} bytes) - Alt: {img['alt'][:40]}")
                    downloaded_count += 1
            except Exception as e:
                print(f"  [-] Lỗi tải ảnh #{idx}: {e}")

        # Lưu lại sổ cái báo cáo JSON
        report_file = DEST_DIR / "threads_harvest_report.json"
        with open(report_file, "w", encoding="utf-8") as f:
            json.dump({
                "source": "Threads Meta Authenticated Session (Port 9223)",
                "captions": captions,
                "total_downloaded_images": downloaded_count,
                "images_metadata": images[:6]
            }, f, ensure_ascii=False, indent=2)
        
        print(f"\n[+] ĐÃ LƯU BÁO CÁO CÀO DỮ LIỆU TẠI: {report_file}")
        print("================================================================")

if __name__ == "__main__":
    asyncio.run(run_harvester())
