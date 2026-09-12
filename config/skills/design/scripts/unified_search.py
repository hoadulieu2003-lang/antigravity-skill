#!/usr/bin/env python3
"""
Unified Design Search Bridge ($design)
Simultaneously queries OpenDesign (153 Brands & 114 Templates) and UI-UX-Pro-Max (79 Styles & 192 Palettes).
Zero external dependencies.
"""

import sys
import os
import subprocess
import argparse

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

CONFIG_DIR = r"C:\Users\game\.gemini\config"
OD_SCRIPT = os.path.join(CONFIG_DIR, "skills", "open-design", "scripts", "search_od.py")
UI_SCRIPT = os.path.join(CONFIG_DIR, "skills", "ui-ux-pro-max", "scripts", "search.py")
GSAP_SCRIPT = os.path.join(CONFIG_DIR, "skills", "gsap", "scripts", "search_gsap.py")

def main():
    parser = argparse.ArgumentParser(description="Unified UI/UX & Brand Design Search")
    parser.add_argument("query", help="Search query (e.g., 'dashboard', 'luxury', 'linear')")
    args = parser.parse_args()

    query = args.query.strip()
    print(f"🎨 UNIFIED DESIGN SEARCH: '{query}'")
    print("=" * 60)

    # 1. Query OpenDesign
    print("\n📦 [1/3] OPEN-DESIGN: Brand Systems & Templates")
    print("-" * 50)
    if os.path.exists(OD_SCRIPT):
        try:
            res = subprocess.run([sys.executable, OD_SCRIPT, query], capture_output=True, text=True, encoding="utf-8", errors="replace")
            output = res.stdout.strip()
            # If no matches on full string and query has multiple words, try primary keyword
            if "(0 found)" in output and " " in query:
                words = [w for w in query.split() if len(w) > 2]
                for w in words:
                    w_res = subprocess.run([sys.executable, OD_SCRIPT, w], capture_output=True, text=True, encoding="utf-8", errors="replace")
                    if "(0 found)" not in w_res.stdout:
                        output = f"(Fuzzy match for '{w}'):\n" + w_res.stdout.strip()
                        break
            print(output if output else "No direct brand match found.")
        except Exception as e:
            print(f"Error querying OpenDesign: {e}")
    else:
        print("OpenDesign script not found.")

    # 2. Query UI-UX-Pro-Max
    print("\n✨ [2/3] UI-UX-PRO-MAX: Visual Styles, Palettes & UX Guidelines")
    print("-" * 50)
    if os.path.exists(UI_SCRIPT):
        try:
            res = subprocess.run([sys.executable, UI_SCRIPT, query, "--max-results", "2"], capture_output=True, text=True, encoding="utf-8", errors="replace")
            print(res.stdout.strip() if res.stdout.strip() else "No direct style match found.")
        except Exception as e:
            print(f"Error querying UI-UX-Pro-Max: {e}")
    else:
        print("UI-UX-Pro-Max script not found.")

    # 3. Query GSAP Motion Engine
    print("\n🎬 [3/3] GSAP MOTION ENGINE: 60 FPS Animation & Micro-interactions")
    print("-" * 50)
    if os.path.exists(GSAP_SCRIPT):
        try:
            res = subprocess.run([sys.executable, GSAP_SCRIPT, query], capture_output=True, text=True, encoding="utf-8", errors="replace")
            lines = res.stdout.strip().splitlines()
            # Skip the first header line if present
            relevant = [l for l in lines if not l.startswith("🎬") and not l.startswith("---")]
            print("\n".join(relevant) if relevant else "Standard tweening / timeline recommended. See GSAP SKILL.md.")
        except Exception as e:
            print(f"Error querying GSAP: {e}")
    else:
        print("GSAP script not found.")

    print("\n" + "=" * 60)
    print("💡 PRO-TIP: Combine OpenDesign tokens with UI-UX-Pro-Max typography & GSAP 60 FPS micro-interactions.")

if __name__ == "__main__":
    main()
