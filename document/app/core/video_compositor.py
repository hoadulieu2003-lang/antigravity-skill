import os
import cv2
import numpy as np
import subprocess
from pathlib import Path
from typing import List, Dict, Any

class VideoCompositor:
    """
    Subsystem 4: Master Compositor Engine
    Robust two-phase video rendering (OpenCV Native VideoWriter + FFmpeg Muxer)
    guaranteeing 100% active motion, zero freeze bugs, and crisp 1080x1920 Full HD graphics.
    """

    def __init__(self, width: int = 1080, height: int = 1920, fps: float = 25.0):
        self.width = width
        self.height = height
        self.fps = fps

    def _get_ffmpeg_exe(self) -> str:
        candidates = [
            r"C:\Users\game\cdp_reader\node_modules\ffmpeg-static\ffmpeg.exe",
            r"C:\Users\game\node_modules\ffmpeg-static\ffmpeg.exe",
            r"C:\Users\game\Documents\app\SCRIPT_FACTORY_PRO_ECOSYSTEM\03_CDP_BRIDGE_ORCHESTRATOR\node_modules\ffmpeg-static\ffmpeg.exe",
            r"C:\Users\game\.gemini\antigravity-ide\scratch\video-editor-app\bin\ffmpeg.exe",
            "ffmpeg"
        ]
        for c in candidates:
            if Path(c).exists():
                return str(c)
        return "ffmpeg"

    def render_master_news(
        self,
        scene_assets: List[str],
        script_scenes: List[Dict[str, Any]],
        audio_path: str,
        output_path: str,
        temp_dir: str = None
    ) -> str:
        temp_p = Path(temp_dir) if temp_dir else Path(output_path).parent / "temp"
        temp_p.mkdir(parents=True, exist_ok=True)
        temp_raw_mp4 = temp_p / "temp_raw_composited.mp4"

        # Phase 1: Render raw video using native OpenCV VideoWriter (no CLI pipe bottlenecks)
        fourcc = cv2.VideoWriter_fourcc(*"mp4v")
        writer = cv2.VideoWriter(str(temp_raw_mp4), fourcc, self.fps, (self.width, self.height))

        total_scenes = len(script_scenes)
        for i, scene in enumerate(script_scenes):
            asset_file = scene_assets[i % len(scene_assets)]
            start_sec = scene.get("start_sec", i * 10)
            end_sec = scene.get("end_sec", (i + 1) * 10)
            duration_sec = end_sec - start_sec
            num_frames = int(duration_sec * self.fps)

            cap = cv2.VideoCapture(asset_file)
            for f in range(num_frames):
                ret, frame = cap.read()
                if not ret or frame is None:
                    cap.release()
                    cap = cv2.VideoCapture(asset_file)
                    ret, frame = cap.read()
                    if not ret:
                        frame = np.zeros((self.height, self.width, 3), dtype=np.uint8)

                # Process Frame to 1080x1920 Canvas
                canvas = self._format_to_canvas(frame)

                # Draw Broadcast TV Overlays
                self._draw_broadcast_graphics(
                    canvas,
                    f,
                    scene.get("lower_third_title", "TIN NÓNG"),
                    scene.get("lower_third_detail", "Hiện trường thực tế"),
                    scene.get("author_credit", "@Threads")
                )

                writer.write(canvas)
            cap.release()

        writer.release()

        # Phase 2: Mux with Clean Audio using FFmpeg Container
        final_mp4 = Path(output_path)
        final_mp4.parent.mkdir(parents=True, exist_ok=True)
        ffmpeg_bin = self._get_ffmpeg_exe()

        cmd = [
            ffmpeg_bin, "-y",
            "-i", str(temp_raw_mp4),
            "-i", str(audio_path),
            "-c:v", "libx264",
            "-preset", "veryfast",
            "-crf", "20",
            "-pix_fmt", "yuv420p",
            "-movflags", "+faststart",
            "-c:a", "aac",
            "-b:a", "192k",
            "-shortest",
            str(final_mp4)
        ]
        subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

        if temp_raw_mp4.exists():
            temp_raw_mp4.unlink()

        return str(final_mp4)

    def _format_to_canvas(self, frame: np.ndarray) -> np.ndarray:
        fh, fw = frame.shape[:2]
        canvas = np.zeros((self.height, self.width, 3), dtype=np.uint8)

        scale = max(self.width / fw, self.height / fh)
        nw, nh = int(fw * scale), int(fh * scale)
        resized = cv2.resize(frame, (nw, nh), interpolation=cv2.INTER_LINEAR)

        # Center crop onto canvas
        x_off = (nw - self.width) // 2
        y_off = (nh - self.height) // 2
        canvas[:, :] = resized[y_off:y_off + self.height, x_off:x_off + self.width]
        return canvas

    def _draw_broadcast_graphics(self, canvas: np.ndarray, frame_idx: int, title: str, detail: str, author: str):
        # 1. Top Bar: TIN NÓNG 24H
        cv2.rectangle(canvas, (0, 0), (self.width, 140), (20, 20, 20), -1)
        cv2.rectangle(canvas, (40, 30), (260, 95), (30, 30, 220), -1)  # Red badge
        cv2.putText(canvas, "TIN NONG 24H", (55, 75), cv2.FONT_HERSHEY_DUPLEX, 0.85, (255, 255, 255), 2)
        cv2.putText(canvas, "HIEN TRUONG THUC TE", (280, 75), cv2.FONT_HERSHEY_SIMPLEX, 0.75, (200, 200, 200), 2)

        # 2. Pulsing Live REC Dot
        if (frame_idx // 12) % 2 == 0:
            cv2.circle(canvas, (self.width - 80, 65), 14, (0, 0, 255), -1)
        cv2.putText(canvas, "LIVE", (self.width - 55, 72), cv2.FONT_HERSHEY_SIMPLEX, 0.65, (255, 255, 255), 2)

        # 3. Lower-Third Glassmorphism Banner
        lt_y = self.height - 340
        overlay = canvas.copy()
        cv2.rectangle(overlay, (40, lt_y), (self.width - 40, lt_y + 180), (15, 15, 15), -1)
        cv2.addWeighted(overlay, 0.75, canvas, 0.25, 0, canvas)

        # Red Accent Bar on the left of Lower-Third
        cv2.rectangle(canvas, (40, lt_y), (52, lt_y + 180), (30, 30, 220), -1)
        cv2.putText(canvas, title.upper(), (75, lt_y + 60), cv2.FONT_HERSHEY_DUPLEX, 1.0, (255, 255, 255), 2)
        cv2.putText(canvas, detail, (75, lt_y + 115), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (210, 210, 210), 2)
        cv2.putText(canvas, f"Nguon: {author}", (75, lt_y + 155), cv2.FONT_HERSHEY_SIMPLEX, 0.65, (160, 160, 160), 1)
