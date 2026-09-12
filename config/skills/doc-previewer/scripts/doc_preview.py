# -*- coding: utf-8 -*-
import os, sys, argparse
from pathlib import Path

def preview_pdf(file_path: str, output_dir: str, dpi: int = 150) -> dict:
    import pymupdf as fitz
    doc = fitz.open(file_path)
    os.makedirs(output_dir, exist_ok=True)
    images = []
    zoom = dpi / 72.0
    mat = fitz.Matrix(zoom, zoom)
    for i, page in enumerate(doc):
        pix = page.get_pixmap(matrix=mat, alpha=False)
        img_name = f"page_{i+1:02d}.png"
        out_p = os.path.join(output_dir, img_name)
        pix.save(out_p)
        images.append(out_p.replace("\\", "/"))
    doc.close()
    return {"total_pages": len(images), "images": images, "output_dir": output_dir.replace("\\", "/")}

def preview_docx(file_path: str, output_file: str) -> dict:
    import mammoth
    with open(file_path, "rb") as f:
        res = mammoth.convert_to_html(f)
    styled_html = f"""<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Preview: {Path(file_path).name}</title>
<style>
body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; padding: 24px; background: #0d1117; color: #e6edf3; display: flex; justify-content: center; }}
.container {{ max-width: 860px; width: 100%; background: #161b22; border: 1px solid #30363d; border-radius: 8px; padding: 32px; box-shadow: 0 4px 12px rgba(0,0,0,0.2); }}
h1, h2, h3, h4 {{ color: #58a6ff; border-bottom: 1px solid #30363d; padding-bottom: 6px; margin-top: 20px; }}
table {{ border-collapse: collapse; width: 100%; margin: 16px 0; }}
th, td {{ border: 1px solid #30363d; padding: 8px 12px; }}
th {{ background: #21262d; }}
img {{ max-width: 100%; height: auto; border-radius: 4px; }}
blockquote {{ border-left: 4px solid #58a6ff; padding-left: 14px; color: #8b949e; margin: 12px 0; }}
</style>
</head>
<body>
<div class="container">
{res.value}
</div>
</body>
</html>"""
    os.makedirs(os.path.dirname(output_file), exist_ok=True)
    with open(output_file, "w", encoding="utf-8") as f:
        f.write(styled_html)
    return {"output_file": output_file.replace("\\", "/")}

def main():
    parser = argparse.ArgumentParser(description="Generate preview artifacts for Antigravity 2.0")
    parser.add_argument("input_file", help="Path to PDF or DOCX file")
    parser.add_argument("-o", "--output", required=True, help="Output path (dir for PDF, file for DOCX)")
    parser.add_argument("--dpi", type=int, default=150, help="DPI for PDF rendering")
    args = parser.parse_args()
    p = Path(args.input_file)
    if not p.exists():
        print(f"File not found: {p}", file=sys.stderr)
        sys.exit(1)
    if p.suffix.lower() == ".pdf":
        r = preview_pdf(str(p), args.output, args.dpi)
        print(f"SUCCESS: PDF {r['total_pages']} pages -> {r['output_dir']}")
    elif p.suffix.lower() in [".docx", ".doc"]:
        out = args.output if args.output.endswith(".html") else os.path.join(args.output, f"{p.stem}.html")
        r = preview_docx(str(p), out)
        print(f"SUCCESS: DOCX -> {r['output_file']}")
    else:
        print(f"Unsupported: {p.suffix}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()

