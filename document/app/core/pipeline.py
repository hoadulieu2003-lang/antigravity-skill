import os
import asyncio
from pathlib import Path
from typing import Dict, Any

from .config_manager import ConfigManager
from .cdp_crawler import CDPCrawler
from .ai_newsroom import AINewsroom
from .voice_synthesizer import VoiceSynthesizer
from .video_compositor import VideoCompositor

class NewsPipeline:
    """
    Subsystem 5: Master Pipeline Orchestrator
    Binds Ingestion, AI Newsroom, Voice Synthesis, and Video Compositor
    into a single executable workflow.
    """

    def __init__(self, config_path: str = None):
        self.cfg = ConfigManager(config_path)
        self.crawler = CDPCrawler(
            cdp_port=self.cfg.get("cdp_crawler", "cdp_port", 9223),
            workspace_dir=self.cfg.get("system", "workspace_dir")
        )
        self.newsroom = AINewsroom(
            model_name=self.cfg.get("ai_newsroom", "model", "gemini-2.5-flash"),
            target_duration=self.cfg.get("ai_newsroom", "target_duration_sec", 58)
        )
        self.voice = VoiceSynthesizer(
            voice_name=self.cfg.get("voice_engine", "gemini_voice", "Aoede"),
            sample_rate=self.cfg.get("voice_engine", "sample_rate_hz", 48000),
            strip_sfx=self.cfg.get("voice_engine", "strip_sfx", True)
        )
        self.compositor = VideoCompositor(
            width=self.cfg.get("video_compositor", "width", 1080),
            height=self.cfg.get("video_compositor", "height", 1920),
            fps=self.cfg.get("video_compositor", "fps", 25.0)
        )

    async def run(self, topic: str, output_file: str = None) -> Dict[str, Any]:
        workspace = Path(self.cfg.get("system", "workspace_dir"))
        out_dir = Path(self.cfg.get("system", "output_dir"))
        out_dir.mkdir(parents=True, exist_ok=True)
        final_video_path = output_file or str(out_dir / "master_ugc_news.mp4")

        # Step 1: Harvest UGC media from Chrome session
        print(f"[*] Bước 1: Đang cào dữ liệu hiện trường Threads cho chủ đề: '{topic}'...")
        try:
            harvest_res = await self.crawler.harvest()
            videos = harvest_res.get("videos", [])
            posts = harvest_res.get("posts", [])
        except Exception as e:
            print(f"[-] Cảnh báo cào trực tiếp: {e}. Sử dụng kho tư liệu đã lưu...")
            videos = [str(p) for p in workspace.glob("ugc_video_*.mp4")]
            posts = ["Người dân ghi lại hình ảnh ngập sâu tại các tuyến phố."]

        if not videos:
            raise RuntimeError(f"Không tìm thấy video hiện trường nào trong {workspace}")

        # Step 2: AI Newsroom script generation
        print("[*] Bước 2: AI Newsroom đang biên tập kịch bản thời sự & phân cảnh...")
        script = self.newsroom.generate_script(topic, posts, len(videos))

        # Step 3: Studio Voiceover synthesis
        print("[*] Bước 3: Tổng hợp giọng đọc BTV thời sự không tạp âm (Clean Voice)...")
        voice_path = workspace / "thoi_su_voice.wav"
        self.voice.synthesize(
            script_text=script.get("full_voiceover", ""),
            output_path=str(voice_path),
            fallback_source=r"C:\Users\game\.gemini\config\sidecars\anti_live_voice\public\thoi_su_clean_voice.wav"
        )

        # Step 4: Render Master Video 1080x1920
        print("[*] Bước 4: Xưởng dựng video OpenCV đang render bản tin 1080x1920...")
        rendered_mp4 = self.compositor.render_master_news(
            scene_assets=videos,
            script_scenes=script.get("scenes", []),
            audio_path=str(voice_path),
            output_path=final_video_path
        )

        print(f"[+] Hoàn tất! Video đã sẵn sàng tại: {rendered_mp4}")
        return {
            "status": "success",
            "video_path": rendered_mp4,
            "script": script,
            "harvested_videos_count": len(videos)
        }
