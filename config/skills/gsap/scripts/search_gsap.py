#!/usr/bin/env python3
"""
GSAP Intelligence Search CLI ($gsap)
Quick keyword lookup for GSAP 60 FPS canonical patterns and deep reference docs.
"""
import os
import sys
import argparse

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

REF_DIR = r"C:\Users\game\.gemini\config\skills\gsap\references"

INDEX = {
    "core": {"file": "core.md", "keywords": ["tween", "to", "from", "fromto", "ease", "stagger", "duration", "autoalpha", "matchmedia", "delay", "immediaterender"]},
    "timeline": {"file": "timeline.md", "keywords": ["timeline", "sequence", "label", "nest", "choreograph", "position", "seek", "reverse", "pause"]},
    "scrolltrigger": {"file": "scrolltrigger.md", "keywords": ["scroll", "scrolltrigger", "pin", "scrub", "parallax", "toggleactions", "refresh", "scrollytelling"]},
    "plugins": {"file": "plugins.md", "keywords": ["plugin", "splittext", "morphsvg", "scrollsmoother", "flip", "draggable", "inertia", "observer", "scrambletext", "free", "club"]},
    "react": {"file": "react.md", "keywords": ["react", "nextjs", "next.js", "usegsap", "hook", "strictmode", "cleanup", "unmount", "ssr", "ref"]},
    "performance": {"file": "performance.md", "keywords": ["performance", "60fps", "fps", "lag", "jank", "gpu", "transform", "will-change", "quickto", "compositor"]},
    "utils": {"file": "utils.md", "keywords": ["utils", "clamp", "maprange", "interpolate", "random", "snap", "toarray", "pipe", "wrap"]},
    "frameworks": {"file": "frameworks.md", "keywords": ["vue", "svelte", "nuxt", "sveltekit", "astro", "angular"]}
}

def search(query):
    query_lower = query.lower().strip()
    words = query_lower.split()
    results = []
    
    for category, meta in INDEX.items():
        score = 0
        for w in words:
            if w in meta["keywords"]:
                score += 2
            elif any(w in k for k in meta["keywords"]):
                score += 1
        if score > 0:
            results.append((score, category, meta["file"]))
            
    results.sort(key=lambda x: x[0], reverse=True)
    return results

def main():
    parser = argparse.ArgumentParser(description="GSAP Motion Intelligence Search")
    parser.add_argument("query", help="Keyword to search (e.g. 'scroll', 'react', 'splittext', '60fps')")
    args = parser.parse_args()
    
    matches = search(args.query)
    print(f"🎬 GSAP MOTION SEARCH: '{args.query}'")
    print("-" * 50)
    if not matches:
        print("No direct reference module found. Refer to C:\\Users\\game\\.gemini\\config\\skills\\gsap\\SKILL.md")
        return
        
    for score, cat, filename in matches:
        filepath = os.path.join(REF_DIR, filename)
        print(f"• [{cat.upper()}] -> file:///{filepath.replace(chr(92), '/')}")

if __name__ == "__main__":
    main()
