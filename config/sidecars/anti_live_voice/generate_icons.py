import os
from PIL import Image, ImageDraw

icons_dir = r"C:\Users\game\.gemini\config\sidecars\anti_live_voice\public\icons"
os.makedirs(icons_dir, exist_ok=True)

def create_icon(size, filename):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # 1. Vẽ nền tròn xanh gradient
    margin = int(size * 0.05)
    r = size // 2
    # Vẽ vòng tròn bóng và nền xanh
    draw.ellipse([margin, margin, size - margin, size - margin], fill=(37, 99, 235, 255))
    
    # 2. Vẽ hình micro cách điệu màu trắng
    # Thân micro
    mic_w = int(size * 0.22)
    mic_h = int(size * 0.35)
    mic_left = (size - mic_w) // 2
    mic_top = int(size * 0.25)
    mic_radius = mic_w // 2
    draw.rounded_rectangle([mic_left, mic_top, mic_left + mic_w, mic_top + mic_h], radius=mic_radius, fill=(255, 255, 255, 255))
    
    # Vòng cung đón âm thanh
    arc_margin = int(size * 0.28)
    arc_bottom = int(size * 0.65)
    line_w = max(4, int(size * 0.04))
    draw.arc([arc_margin, int(size * 0.35), size - arc_margin, arc_bottom], start=0, end=180, fill=(255, 255, 255, 255), width=line_w)
    
    # Chân đế micro
    stem_top = int(size * 0.63)
    stem_bottom = int(size * 0.74)
    draw.line([(size // 2, stem_top), (size // 2, stem_bottom)], fill=(255, 255, 255, 255), width=line_w)
    
    base_w = int(size * 0.25)
    draw.line([(size // 2 - base_w // 2, stem_bottom), (size // 2 + base_w // 2, stem_bottom)], fill=(255, 255, 255, 255), width=line_w)
    
    out_path = os.path.join(icons_dir, filename)
    img.save(out_path, "PNG")
    print(f"Created {out_path} ({size}x{size})")

create_icon(192, "icon-192.png")
create_icon(512, "icon-512.png")
