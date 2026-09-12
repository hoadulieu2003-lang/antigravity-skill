import sys
import os
import argparse
import base64
import io

# Fix Windows console UTF-8 output encoding
if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

from PIL import Image
import rembg

def hex_to_rgb(hex_str):
    hex_str = hex_str.lstrip('#')
    if len(hex_str) == 3:
        hex_str = ''.join([c*2 for c in hex_str])
    return tuple(int(hex_str[i:i+2], 16) for i in (0, 2, 4))

def process_single_image(input_img, bg_color='transparent', model_name='u2net'):
    """
    Tách nền ảnh và áp dụng màu nền (transparent hoặc màu studio #1a1a1a)
    """
    session = rembg.new_session(model_name)
    cutout = rembg.remove(input_img, session=session)
    
    if bg_color.lower() in ('transparent', 'none', ''):
        return cutout
    
    rgb = hex_to_rgb(bg_color)
    bg = Image.new('RGBA', cutout.size, (*rgb, 255))
    final_img = Image.alpha_composite(bg, cutout)
    return final_img.convert('RGB')

def main():
    parser = argparse.ArgumentParser(description="AI Background Removal & Studio Packshot Isolation")
    parser.add_argument("--input", "-i", help="Đường dẫn file ảnh hoặc thư mục cần tách nền")
    parser.add_argument("--output", "-o", help="Đường dẫn file hoặc thư mục xuất kết quả")
    parser.add_argument("--bg-color", "-c", default="transparent", help="Màu nền: 'transparent' hoặc mã HEX (ví dụ: '#1a1a1a', '#ffffff')")
    parser.add_argument("--model", "-m", default="u2net", help="Model AI (u2net, u2net_human_seg, isnet-general-use)")
    parser.add_argument("--base64", "-b", help="Dữ liệu Base64 chuỗi ảnh đầu vào (dành cho API)")
    
    args = parser.parse_args()
    
    if args.base64:
        raw_b64 = args.base64
        if ',' in raw_b64:
            raw_b64 = raw_b64.split(',', 1)[1]
        img_bytes = base64.b64decode(raw_b64)
        input_img = Image.open(io.BytesIO(img_bytes)).convert('RGB')
        
        result_img = process_single_image(input_img, args.bg_color, args.model)
        
        buf = io.BytesIO()
        fmt = 'PNG' if args.bg_color == 'transparent' else 'JPEG'
        result_img.save(buf, format=fmt, quality=95)
        out_b64 = base64.b64encode(buf.getvalue()).decode('utf-8')
        mime = 'image/png' if fmt == 'PNG' else 'image/jpeg'
        print(f"DATA_URI:data:{mime};base64,{out_b64}")
        return

    if not args.input:
        parser.print_help()
        sys.exit(1)
        
    input_path = os.path.abspath(args.input)
    
    if os.path.isfile(input_path):
        out_path = args.output
        if not out_path:
            base, ext = os.path.splitext(input_path)
            out_path = f"{base}_nobg.png"
            
        print(f"🖼️ Đang tách nền ảnh: {input_path}")
        img = Image.open(input_path).convert('RGB')
        result_img = process_single_image(img, args.bg_color, args.model)
        
        os.makedirs(os.path.dirname(os.path.abspath(out_path)), exist_ok=True)
        result_img.save(out_path)
        print(f"✅ Đã tách nền thành công -> {out_path}")
        
    elif os.path.isdir(input_path):
        out_dir = args.output or os.path.join(input_path, "nobg_output")
        os.makedirs(out_dir, exist_ok=True)
        
        valid_exts = ('.png', '.jpg', '.jpeg', '.webp', '.bmp')
        files = [f for f in os.listdir(input_path) if f.lower().endswith(valid_exts)]
        print(f"📁 Bắt đầu tách nền hàng loạt {len(files)} ảnh trong: {input_path}")
        
        for idx, f in enumerate(files, 1):
            f_in = os.path.join(input_path, f)
            f_out = os.path.join(out_dir, f"{os.path.splitext(f)[0]}_nobg.png")
            try:
                img = Image.open(f_in).convert('RGB')
                res = process_single_image(img, args.bg_color, args.model)
                res.save(f_out)
                print(f"[{idx}/{len(files)}] ✓ {f} -> {os.path.basename(f_out)}")
            except Exception as e:
                print(f"[{idx}/{len(files)}] ❌ Lỗi {f}: {e}")
                
        print(f"🎉 Hoàn thành tách nền hàng loạt tại: {out_dir}")

if __name__ == "__main__":
    main()
