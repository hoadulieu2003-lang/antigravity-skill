#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
UGC News Studio Pro - CLI Interface
Command line runner for automated broadcast news generation from social media.
"""

import argparse
import asyncio
import sys
from pathlib import Path

# Add parent directory to sys.path to enable core imports
sys.path.insert(0, str(Path(__file__).resolve().parent))

from core.pipeline import NewsPipeline

def parse_args():
    parser = argparse.ArgumentParser(
        description="UGC News Studio Pro - Cỗ máy tự động hóa sản xuất video thời sự từ Threads/MXH"
    )
    parser.add_argument(
        "--topic",
        type=str,
        default="ngập lụt hà nội",
        help="Chủ đề tin tức nóng cần khai thác (mặc định: 'ngập lụt hà nội')"
    )
    parser.add_argument(
        "--duration",
        type=int,
        default=58,
        help="Thời lượng video mục tiêu tính bằng giây (mặc định: 58s)"
    )
    parser.add_argument(
        "--voice",
        type=str,
        default="Aoede",
        help="Giọng đọc BTV AI: Aoede (Nữ VTV) hoặc Charon (Nam chính luận)"
    )
    parser.add_argument(
        "--output",
        type=str,
        default=None,
        help="Đường dẫn tệp video MP4 đầu ra (tùy chọn)"
    )
    parser.add_argument(
        "--config",
        type=str,
        default=None,
        help="Đường dẫn tệp config.yaml tùy chỉnh"
    )
    return parser.parse_args()

async def main():
    args = parse_args()
    print("=" * 70)
    print("🌟 UGC NEWS STUDIO PRO - PIPELINE TỰ ĐỘNG KHỞI CHẠY")
    print(f"📌 Chủ đề: {args.topic}")
    print(f"⏱️ Thời lượng: {args.duration}s | 🎙️ Giọng đọc: {args.voice}")
    print("=" * 70)

    pipeline = NewsPipeline(config_path=args.config)
    result = await pipeline.run(topic=args.topic, output_file=args.output)

    print("\n" + "=" * 70)
    print("🎉 BẢN TIN THỜI SỰ ĐÃ ĐƯỢC XUẤT XƯỞNG THÀNH CÔNG!")
    print(f"📁 Tệp Video: {result['video_path']}")
    print(f"📹 Số phân cảnh tư liệu sử dụng: {result['harvested_videos_count']}")
    print("=" * 70)

if __name__ == "__main__":
    asyncio.run(main())
