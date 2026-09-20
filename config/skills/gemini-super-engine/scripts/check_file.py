import urllib.request
import json
from pathlib import Path

ENV_FILE = Path(r"C:\Users\game\.gemini\config\sidecars\anti_live_voice\.env.local")
api_key = ""
with open(ENV_FILE, "r") as f:
    for line in f:
        if line.startswith("GEMINI_API_KEY="):
            api_key = line.split("=", 1)[1].strip().strip("\"'")

url = f"https://generativelanguage.googleapis.com/v1beta/files/h8t2nbnpnlgt?key={api_key}"
try:
    with urllib.request.urlopen(url) as resp:
        print(resp.read().decode('utf-8'))
except Exception as e:
    print(f"Error: {e}")
    if hasattr(e, 'read'):
        print(e.read().decode('utf-8'))
