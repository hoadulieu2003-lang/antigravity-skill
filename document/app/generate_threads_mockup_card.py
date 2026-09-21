import os
import sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

OUTPUT_PATH = Path(r"C:\Users\game\.gemini\document\app\threads_card_mockup.png")
BRAIN_PATH = Path(r"C:\Users\game\.gemini\antigravity\brain\6f46af53-7f44-46a4-83e9-d518ccfc6f9f\threads_card_mockup.png")

CARD_W = 980
CARD_H = 680

def create_threads_card():
    # 1. Base transparent canvas
    img = Image.new("RGBA", (CARD_W, CARD_H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # 2. Draw Soft Drop Shadow
    for i in range(12, 0, -2):
        alpha = int(14 - i)
        draw.rounded_rectangle(
            [(16 - i, 16 - i + 4), (CARD_W - 16 + i, CARD_H - 16 + i + 4)],
            radius=36 + i,
            fill=(15, 23, 42, alpha)
        )

    # 3. Main White Card Container (Light Theme)
    card_box = [(16, 16), (CARD_W - 16, CARD_H - 16)]
    draw.rounded_rectangle(card_box, radius=32, fill=(255, 255, 255, 255), outline=(226, 232, 240, 255), width=2)

    # 4. Load Fonts
    try:
        f_user = ImageFont.truetype("arialbd.ttf", 34)
        f_meta = ImageFont.truetype("arial.ttf", 26)
        f_tag = ImageFont.truetype("arialbd.ttf", 22)
        f_hook = ImageFont.truetype("arialbd.ttf", 38)
        f_body = ImageFont.truetype("arial.ttf", 30)
        f_stat = ImageFont.truetype("arialbd.ttf", 26)
    except Exception:
        f_user = ImageFont.load_default()
        f_meta = f_user
        f_tag = f_user
        f_hook = f_user
        f_body = f_user
        f_stat = f_user

    # 5. Avatar Circle
    av_x, av_y, av_r = 55, 50, 42
    draw.ellipse([(av_x, av_y), (av_x + av_r * 2, av_y + av_r * 2)], fill=(37, 99, 235))
    draw.text((av_x + 24, av_y + 16), "H", font=f_user, fill=(255, 255, 255))

    # 6. User Info
    draw.text((av_x + 105, av_y + 12), "hn9976598", font=f_user, fill=(15, 23, 42))
    draw.text((av_x + 295, av_y + 18), "•  2h", font=f_meta, fill=(100, 116, 139))
    
    # Tag Pill
    tag_x, tag_y = av_x + 105, av_y + 55
    draw.rounded_rectangle([(tag_x, tag_y), (tag_x + 225, tag_y + 36)], radius=18, fill=(241, 245, 249))
    draw.text((tag_x + 18, tag_y + 6), "• TÂM SỰ CÔNG SỞ", font=f_tag, fill=(71, 85, 105))

    # Threads three-dot icon
    draw.text((CARD_W - 85, av_y + 10), "•••", font=f_user, fill=(148, 163, 184))

    # 7. Post Hook & Body Text
    hook_line1 = "Sốc thật sự. Hôm nay mình mới biết 80%"
    hook_line2 = "những gì chúng ta cố gắng chăm chỉ ở công sở"
    hook_line3 = "...gần như là VÔ NGHĨA."
    
    draw.text((55, 175), hook_line1, font=f_hook, fill=(15, 23, 42))
    draw.text((55, 225), hook_line2, font=f_hook, fill=(15, 23, 42))
    draw.text((55, 275), hook_line3, font=f_hook, fill=(220, 38, 38)) # Red accent

    body_line1 = "Chiều nay ngồi uống cà phê với một sếp lớn bên tập đoàn X,"
    body_line2 = "anh ấy mới phũ phàng nói một câu làm mình tỉnh cả người:"
    body_line3 = "“Em làm việc tốt, nhưng đó là lý do em mãi chỉ làm nhân viên...”"
    
    draw.text((55, 350), body_line1, font=f_body, fill=(51, 65, 85))
    draw.text((55, 395), body_line2, font=f_body, fill=(51, 65, 85))
    draw.text((55, 440), body_line3, font=f_body, fill=(79, 70, 229)) # Indigo quote

    # Separator Line
    draw.line([(55, 520), (CARD_W - 55, 520)], fill=(241, 245, 249), width=2)

    # 8. Interactive Footer Stats
    # Draw vector heart
    hx, hy = 65, 565
    draw.polygon([(hx, hy+6), (hx-8, hy-3), (hx-8, hy-10), (hx-3, hy-14), (hx, hy-11), (hx+3, hy-14), (hx+8, hy-10), (hx+8, hy-3)], fill=(239, 68, 68))
    draw.text((85, 548), "4.1K", font=f_stat, fill=(71, 85, 105))

    # Comment bubble icon
    cx, cy = 200, 555
    draw.rounded_rectangle([(cx, cy), (cx+22, cy+18)], radius=6, outline=(100, 116, 139), width=2)
    draw.text((232, 548), "459", font=f_stat, fill=(71, 85, 105))

    # Repost icon
    rx, ry = 345, 555
    draw.rectangle([(rx, ry), (rx+22, ry+18)], outline=(100, 116, 139), width=2)
    draw.text((377, 548), "539", font=f_stat, fill=(71, 85, 105))

    # Share icon
    sx, sy = 490, 555
    draw.polygon([(sx, sy), (sx+20, sy+9), (sx, sy+18), (sx+4, sy+9)], fill=(100, 116, 139))
    draw.text((522, 548), "1.2K chia sẻ", font=f_stat, fill=(71, 85, 105))

    # Clean badge right-aligned
    draw.rounded_rectangle([(CARD_W - 270, 545), (CARD_W - 55, 580)], radius=12, fill=(248, 250, 252), outline=(226, 232, 240), width=1)
    draw.text((CARD_W - 250, 550), "@threads.net viral", font=f_tag, fill=(100, 116, 139))

    # Save
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    BRAIN_PATH.parent.mkdir(parents=True, exist_ok=True)
    img.save(str(OUTPUT_PATH), "PNG")
    img.save(str(BRAIN_PATH), "PNG")
    print(f"[+] Đã tạo Threads Mockup Card hoàn hảo: {OUTPUT_PATH}")

if __name__ == "__main__":
    create_threads_card()
