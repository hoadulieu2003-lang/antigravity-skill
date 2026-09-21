"""
UGC News Studio Pro - Core Package
Autonomous UGC Social Scraping & Broadcast News Video Production
"""

from .config_manager import ConfigManager
from .cdp_crawler import CDPCrawler
from .ai_newsroom import AINewsroom
from .voice_synthesizer import VoiceSynthesizer
from .video_compositor import VideoCompositor
from .pipeline import NewsPipeline

__all__ = [
    "ConfigManager",
    "CDPCrawler",
    "AINewsroom",
    "VoiceSynthesizer",
    "VideoCompositor",
    "NewsPipeline"
]
