#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
════════════════════════════════════════════════════════════════════════════
TEST SUITE FOR GEMINI SUPER-ENGINE (PHASE 1)
Verifies:
1. Google Search Grounding with Real-time citations
2. Cloud Python Code Execution in Google's cloud sandbox
3. Imagen 3 Studio Photorealism & Typography Generation
════════════════════════════════════════════════════════════════════════════
"""

import sys
import time
from pathlib import Path

# Đảm bảo UTF-8
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

from google_search_grounding import search_grounded_query
from cloud_code_executor import execute_cloud_code
from imagen_studio_engine import generate_image_with_imagen3

output_dir = Path(r"C:\Users\game\.gemini\config\skills\gemini-super-engine\scripts\test_output")
output_dir.mkdir(parents=True, exist_ok=True)

print("======================================================================")
print("⚡ BẮT ĐẦU KIỂM THỬ TOÀN DIỆN GEMINI SUPER-ENGINE (GIAI ĐOẠN 1)")
print("======================================================================\n")

# TEST 1: Google Search Grounding
print("1️⃣ [TEST 1/3] KIỂM THỬ GOOGLE SEARCH GROUNDING (TIN TỨC THỰC TẾ)...")
query = "Sự kiện thời trang quốc tế và công nghệ AI nào đang được chú ý nhất tuần này?"
res_search = search_grounded_query(query)
if res_search["success"]:
    print("   [+] Thành công: Đã lấy dữ liệu thời gian thực từ Google!")
    print(f"   [+] Độ dài câu trả lời: {len(res_search['answer'])} ký tự")
    print(f"   [+] Số nguồn trích dẫn: {len(res_search['sources'])}")
    for s in res_search["sources"][:3]:
        print(f"       • {s['title']} ({s['url']})")
else:
    print(f"   [-] Thất bại: {res_search.get('error')}")

print("\n" + "-"*70 + "\n")
time.sleep(2)

# TEST 2: Cloud Python Code Execution
print("2️⃣ [TEST 2/3] KIỂM THỬ CLOUD PYTHON SANDBOX (TÍNH TOÁN TRÊN CLOUD GOOGLE)...")
math_task = "Tính tổng của 50 số Fibonacci đầu tiên và vẽ ma trận tăng trưởng 5x5. Xuất kết quả rõ ràng."
res_code = execute_cloud_code(math_task)
if res_code["success"]:
    print("   [+] Thành công: AI đã tự viết và chạy code trên Cloud Google!")
    print(f"   [+] Số đoạn code thực thi: {len(res_code['code_blocks'])}")
    for idx, eo in enumerate(res_code["execution_outputs"], 1):
        print(f"   [+] Output đoạn #{idx}: {eo['output'].strip()[:100]}...")
else:
    print(f"   [-] Thất bại: {res_code.get('error')}")

print("\n" + "-"*70 + "\n")
time.sleep(2)

# TEST 3: Imagen 3 Studio
print("3️⃣ [TEST 3/3] KIỂM THỬ IMAGEN 3 STUDIO (SINH ẢNH QUANG HỌC & CHỮ NÉT)...")
img_prompt = (
    "Luxury haute couture editorial shoot for ANH ATELIER. "
    "A stunning Vietnamese woman in a silk embroidered dress standing in modern architectural villa. "
    "Soft studio lighting, 8k resolution, photorealistic, sharp lettering 'ANH ATELIER' visible."
)
img_out = output_dir / "anh_atelier_test.jpg"
res_img = generate_image_with_imagen3(img_prompt, img_out, aspect_ratio="1:1")
if res_img["success"]:
    print("   [+] Thành công: Đã sinh ảnh siêu thực bằng Imagen 3!")
    print(f"   [+] Đường dẫn: {res_img['output_path']}")
    print(f"   [+] Kích thước file: {res_img['file_size_bytes']} bytes")
else:
    print(f"   [-] Thất bại: {res_img.get('error')}")

print("\n======================================================================")
print("🎉 KẾT THÚC KIỂM THỬ TOÀN DIỆN")
print("======================================================================")
