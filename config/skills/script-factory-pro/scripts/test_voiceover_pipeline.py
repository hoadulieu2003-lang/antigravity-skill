#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Test Pipeline for Gemini Voiceover Engine
Simulates a 3-Scene Script Factory Pro episode.
"""

import sys
from pathlib import Path

# Đảm bảo UTF-8
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

from gemini_voiceover_engine import generate_voiceover_for_scenes

# Kịch bản mẫu 3 phân cảnh chuẩn Script Factory Pro
MOCK_EPISODE_SCENES = [
    {
        "scene_id": 1,
        "speaker": "narrator", # Giọng Puck
        "text": "Bình minh trên vịnh Hạ Long, làn sương mỏng tang nhẹ buông trên mặt nước tĩnh lặng như gương."
    },
    {
        "scene_id": 2,
        "speaker": "female",   # Giọng Kore
        "text": "Từng thớ lụa tơ tằm dệt nắng ôm trọn lấy làn da, nhẹ tênh như một cơn gió sớm mai."
    },
    {
        "scene_id": 3,
        "speaker": "authoritative", # Giọng Charon
        "text": "ANH ATELIER. Nơi hội tụ tinh hoa thời trang thượng lưu và nghệ thuật thủ công tinh tế."
    }
]

output_dir = Path(r"C:\Users\game\.gemini\config\skills\script-factory-pro\scripts\test_output")

print("================================================================")
print("🎬 BẮT ĐẦU KIỂM THỬ PIPELINE LỒNG TIẾNG SCRIPT FACTORY PRO")
print("================================================================")

result = generate_voiceover_for_scenes(MOCK_EPISODE_SCENES, output_dir)

print("\n--- KẾT QUẢ NGHIỆM THU ---")
print(f"Tổng thời lượng tập phim: {result['total_duration_seconds']} giây")
for sc in result["scenes"]:
    print(f"  • Cảnh {sc['scene_id']:02d}: {sc['duration_seconds']}s -> Khuyên nghị Veo 3.1: {sc['recommended_veo_duration']}s ({sc['voice_used']})")
    assert Path(sc['path']).exists(), f"Lỗi: Không tìm thấy file {sc['path']}"
    assert sc['duration_seconds'] > 0, "Lỗi: Thời lượng âm thanh không hợp lệ"

print("\n✅ KIỂM TOÁN THÀNH CÔNG: Toàn bộ 3 phân cảnh đã được sinh file WAV chuẩn studio!")
