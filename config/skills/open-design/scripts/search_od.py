#!/usr/bin/env python3
"""
OpenDesign Fast Search Tool for Antigravity IDE
Enables instant lookup of 153 Brand Design Systems, 114 Templates, and 162 Skills.
Zero external dependencies.
"""

import sys
import os
import argparse
import json

# Ensure UTF-8 stdout on Windows console
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SYSTEMS_DIR = os.path.join(BASE_DIR, "design-systems")
TEMPLATES_DIR = os.path.join(BASE_DIR, "design-templates")
SKILLS_DIR = os.path.join(BASE_DIR, "skills")

def search_directory(target_dir, query):
    results = []
    if not os.path.isdir(target_dir):
        return results
    
    query_lower = query.lower()
    for name in os.listdir(target_dir):
        item_path = os.path.join(target_dir, name)
        if not os.path.isdir(item_path) or name.startswith(".") or name.startswith("_"):
            continue
        
        score = 0
        match_reason = []
        
        # Check name
        if query_lower in name.lower():
            score += 10
            match_reason.append(f"Name match '{name}'")
        
        # Check manifest.json or README or DESIGN.md
        manifest_file = os.path.join(item_path, "manifest.json")
        desc = ""
        if os.path.exists(manifest_file):
            try:
                with open(manifest_file, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    desc = data.get("description", "") or data.get("summary", "")
                    if query_lower in desc.lower():
                        score += 5
                        match_reason.append("Manifest description match")
            except Exception:
                pass
        
        if score > 0:
            results.append({
                "name": name,
                "path": item_path,
                "score": score,
                "description": desc,
                "matches": match_reason
            })
            
    results.sort(key=lambda x: x["score"], reverse=True)
    return results

def main():
    parser = argparse.ArgumentParser(description="Search OpenDesign Assets")
    parser.add_argument("query", help="Keyword to search (brand, style, template type)")
    parser.add_argument("--systems", action="store_true", help="Search design systems only")
    parser.add_argument("--templates", action="store_true", help="Search design templates only")
    parser.add_argument("--skills", action="store_true", help="Search design skills only")
    args = parser.parse_args()

    search_all = not (args.systems or args.templates or args.skills)

    print(f"## OpenDesign Search Results for: '{args.query}'\n")

    if search_all or args.systems:
        systems = search_directory(SYSTEMS_DIR, args.query)
        print(f"### [Brand Design Systems] ({len(systems)} found)")
        if systems:
            for s in systems[:6]:
                design_md = os.path.join(s["path"], "DESIGN.md")
                tokens_css = os.path.join(s["path"], "tokens.css")
                print(f"- **{s['name']}**")
                print(f"  - Path: `{s['path']}`")
                if os.path.exists(design_md):
                    print(f"  - Specs: `file:///{design_md.replace(os.sep, '/')}`")
                if os.path.exists(tokens_css):
                    print(f"  - Tokens: `file:///{tokens_css.replace(os.sep, '/')}`")
        else:
            print("  *(No direct matches)*")
        print()

    if search_all or args.templates:
        templates = search_directory(TEMPLATES_DIR, args.query)
        print(f"### [Design Templates] ({len(templates)} found)")
        if templates:
            for t in templates[:6]:
                print(f"- **{t['name']}**")
                print(f"  - Path: `{t['path']}`")
                preview_html = os.path.join(t["path"], "index.html")
                if not os.path.exists(preview_html):
                    preview_html = os.path.join(t["path"], "template.html")
                if os.path.exists(preview_html):
                    print(f"  - Template File: `file:///{preview_html.replace(os.sep, '/')}`")
        else:
            print("  *(No direct matches)*")
        print()

    if search_all or args.skills:
        skills = search_directory(SKILLS_DIR, args.query)
        print(f"### [Specialized Skills] ({len(skills)} found)")
        if skills:
            for sk in skills[:6]:
                print(f"- **{sk['name']}**")
                print(f"  - Path: `{sk['path']}`")
        else:
            print("  *(No direct matches)*")
        print()

if __name__ == "__main__":
    main()
