import os
import json
import urllib.request
import asyncio
import websockets
from pathlib import Path
from typing import List, Dict, Any

class CDPCrawler:
    """
    Subsystem 1: CDP Social Ingestion Agent
    Harvests authentic UGC media (video MP4 and 3K+ photos) and captions
    directly from active Chrome session without API limits or watermarks.
    """

    def __init__(self, cdp_port: int = 9223, workspace_dir: str = None):
        self.cdp_port = cdp_port
        self.workspace_dir = Path(workspace_dir) if workspace_dir else Path(r"C:\Users\game\.gemini\threads_harvest")
        self.workspace_dir.mkdir(parents=True, exist_ok=True)

    async def get_active_tab_ws(self, keyword: str = "threads.net") -> str:
        url = f"http://127.0.0.1:{self.cdp_port}/json"
        req = urllib.request.Request(url, headers={"User-Agent": "UGCNewsStudio/1.0"})
        with urllib.request.urlopen(req, timeout=5) as res:
            tabs = json.loads(res.read().decode("utf-8"))
        for t in tabs:
            tab_url = t.get("url", "")
            if keyword in tab_url:
                return t["webSocketDebuggerUrl"]
        # Fallback to the first valid page tab
        page_tabs = [t for t in tabs if t.get("type") == "page"]
        if page_tabs:
            return page_tabs[0]["webSocketDebuggerUrl"]
        raise RuntimeError(f"No active Chrome tab found matching '{keyword}' on port {self.cdp_port}")

    async def harvest(self, max_scrolls: int = 5, delay_sec: float = 1.2) -> Dict[str, Any]:
        ws_url = await self.get_active_tab_ws()
        async with websockets.connect(ws_url, max_size=50*1024*1024) as ws:
            # Inject auto-scroll script to trigger lazy-loaded media
            scroll_js = f"""
            (async () => {{
                let scrolls = 0;
                while (scrolls < {max_scrolls}) {{
                    window.scrollBy(0, window.innerHeight * 1.5);
                    await new Promise(r => setTimeout(r, {int(delay_sec * 1000)}));
                    scrolls++;
                }}
            }})()
            """
            await ws.send(json.dumps({"id": 1, "method": "Runtime.evaluate", "params": {"expression": scroll_js, "awaitPromise": True}}))
            await ws.recv()

            # Extract media URLs and post captions
            extract_js = """
            (() => {
                const results = { videos: [], images: [], posts: [] };
                
                // 1. Extract Videos
                document.querySelectorAll('video').forEach((v, idx) => {
                    const src = v.src || (v.querySelector('source') ? v.querySelector('source').src : '');
                    if (src && !src.startsWith('blob:') && !results.videos.includes(src)) {
                        results.videos.push(src);
                    }
                });

                // 2. Extract Images (filter out tiny icons/avatars)
                document.querySelectorAll('img').forEach((img, idx) => {
                    const src = img.src;
                    if (src && img.naturalWidth > 500 && !results.images.includes(src)) {
                        results.images.push(src);
                    }
                });

                // 3. Extract text content
                document.querySelectorAll('article, [data-pressable-container="true"]').forEach((art, idx) => {
                    const text = art.innerText.trim();
                    if (text.length > 20 && !results.posts.includes(text)) {
                        results.posts.push(text.slice(0, 300));
                    }
                });

                return results;
            })()
            """
            await ws.send(json.dumps({"id": 2, "method": "Runtime.evaluate", "params": {"expression": extract_js, "returnByValue": True}}))
            resp = json.loads(await ws.recv())
            data = resp.get("result", {}).get("result", {}).get("value", {})

            # Download media files locally
            harvested_videos = self._download_media_batch(data.get("videos", []), "ugc_video", ".mp4")
            harvested_images = self._download_media_batch(data.get("images", []), "ugc_img", ".jpg")

            manifest = {
                "videos": harvested_videos,
                "images": harvested_images,
                "posts": data.get("posts", []),
                "total_videos": len(harvested_videos),
                "total_images": len(harvested_images)
            }
            manifest_file = self.workspace_dir / "harvest_manifest.json"
            manifest_file.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
            return manifest

    def _download_media_batch(self, urls: List[str], prefix: str, ext: str) -> List[str]:
        saved_paths = []
        for i, url in enumerate(urls[:10]):
            target = self.workspace_dir / f"{prefix}_{i:02d}{ext}"
            if target.exists() and target.stat().st_size > 10000:
                saved_paths.append(str(target))
                continue
            try:
                req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
                with urllib.request.urlopen(req, timeout=15) as r, open(target, "wb") as f:
                    f.write(r.read())
                if target.stat().st_size > 10000:
                    saved_paths.append(str(target))
            except Exception:
                continue
        return saved_paths
