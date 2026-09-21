import base64
from pathlib import Path

video_path = Path(r"C:\Users\game\.gemini\antigravity\brain\6f46af53-7f44-46a4-83e9-d518ccfc6f9f\threads_story_compact.mp4")
html_path = Path(r"C:\Users\game\.gemini\antigravity\brain\6f46af53-7f44-46a4-83e9-d518ccfc6f9f\apple_glass_video_preview.html")

b64_data = base64.b64encode(video_path.read_bytes()).decode("ascii")
data_uri = f"data:video/mp4;base64,{b64_data}"

html_content = html_path.read_text(encoding="utf-8")

old_source_marker = '<source src="http://localhost:3050/threads_story_charon_pro.mp4" type="video/mp4">'
new_source = f'<source src="{data_uri}" type="video/mp4">\n        <source src="http://localhost:3050/threads_story_charon_pro.mp4" type="video/mp4">'

if old_source_marker in html_content:
    html_content = html_content.replace(old_source_marker, new_source, 1)
    html_path.write_text(html_content, encoding="utf-8")
    print(f"SUCCESS: Base64 data URI embedded! Total HTML size: {len(html_content)/(1024*1024):.2f} MB")
else:
    print("Marker not found!")
