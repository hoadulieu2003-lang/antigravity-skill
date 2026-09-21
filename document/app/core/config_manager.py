import os
from pathlib import Path
import yaml

class ConfigManager:
    """Manages loading and resolving configuration for UGC News Studio Pro."""

    DEFAULT_CONFIG_PATH = Path(__file__).resolve().parent.parent / "config.yaml"

    def __init__(self, config_path: str = None):
        self.config_path = Path(config_path) if config_path else self.DEFAULT_CONFIG_PATH
        self.config = self._load_config()

    def _load_config(self) -> dict:
        if not self.config_path.exists():
            return self._default_fallback()
        try:
            with open(self.config_path, "r", encoding="utf-8") as f:
                return yaml.safe_load(f) or self._default_fallback()
        except Exception:
            return self._default_fallback()

    def _default_fallback(self) -> dict:
        return {
            "system": {
                "workspace_dir": "C:/Users/game/.gemini/threads_harvest",
                "output_dir": "C:/Users/game/.gemini/output_news_videos"
            },
            "cdp_crawler": {
                "cdp_port": 9223,
                "platform": "threads",
                "max_scrolls": 6
            },
            "ai_newsroom": {
                "model": "gemini-2.5-flash",
                "target_duration_sec": 58
            },
            "voice_engine": {
                "provider": "gemini_live",
                "gemini_voice": "Aoede",
                "strip_sfx": True
            },
            "video_compositor": {
                "width": 1080,
                "height": 1920,
                "fps": 25.0
            }
        }

    def get(self, section: str, key: str = None, default=None):
        sec = self.config.get(section, {})
        if key is None:
            return sec
        return sec.get(key, default)
