#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Verification Script: Document Contract Integrity for Antigravity 2.0 (WP-04)
Validates config/AGENTS.md and GEMINI.md for structural consistency,
required design engineering duo tokens, dual audit mechanisms,
markdown link resolution, and UTF-8 encoding validity.
"""

import os
import sys
import re

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

BASE_DIR = r"C:\Users\game\.gemini"
FILES_TO_CHECK = [
    os.path.join(BASE_DIR, "GEMINI.md"),
    os.path.join(BASE_DIR, "config", "AGENTS.md")
]

REQUIRED_PATTERNS = [
    ("Design Engineering Duo", r"Design Engineering Duo"),
    ("Pod 4 with 153 Brands", r"Pod 4.*153 Brands.*Linear.*Stripe.*Apple"),
    ("Pod 5 with 20% Delight Budget", r"Pod 5.*20%.*Delight Budget"),
    ("Pod 5 physical interactions / spotlight / lenis / WebAudioHaptics", r"spotlight.*lenis.*WebAudioHaptics"),
    ("Dual Audit mechanism", r"Dual Audit"),
    ("Audit 1: WCAG AA & responsive", r"Audit 1.*WCAG AA.*responsive"),
    ("Audit 2: Delight & Craftsmanship Score >= 8.5/10", r"Audit 2.*Delight & Craftsmanship Score.*8\.5/10"),
    ("Reject flat monotonic web", r"(?:phẳng lì đơn điệu|web phẳng lì)"),
]

def check_file_integrity(file_path):
    print(f"\n🔍 Checking integrity of: {os.path.relpath(file_path, BASE_DIR)}")
    print("-" * 60)
    
    if not os.path.exists(file_path):
        print(f"❌ File does not exist: {file_path}")
        return False
        
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
    except UnicodeDecodeError as e:
        print(f"❌ UTF-8 decode error: {e}")
        return False
        
    print(f"✅ UTF-8 encoding valid. Total characters: {len(content)}, Lines: {len(content.splitlines())}")
    
    # Check required patterns
    all_patterns_found = True
    for label, pattern in REQUIRED_PATTERNS:
        match = re.search(pattern, content, re.IGNORECASE | re.DOTALL)
        if match:
            print(f"  ✅ Pattern satisfied: {label}")
        else:
            print(f"  ❌ Missing required pattern: {label} (Regex: {pattern})")
            all_patterns_found = False
            
    # Check markdown link targets if local file://
    links = re.findall(r'\[([^\]]+)\]\(([^)]+)\)', content)
    broken_links = []
    for link_text, link_target in links:
        if link_target.startswith("file:///"):
            target_path = link_target.replace("file:///", "").replace("/", os.sep)
            if not os.path.exists(target_path):
                broken_links.append((link_text, link_target, target_path))
                
    if broken_links:
        print(f"  ⚠️ Warning: {len(broken_links)} local links could not be resolved:")
        for t, orig, p in broken_links:
            print(f"     - [{t}]({orig}) -> {p}")
    else:
        print(f"  ✅ All local file:/// links resolved successfully ({len(links)} links checked).")

    return all_patterns_found

def main():
    print("=" * 60)
    print("ANTIGRAVITY 2.0 CONTRACT INTEGRITY VERIFICATION SUITE")
    print("=" * 60)
    
    all_ok = True
    for fpath in FILES_TO_CHECK:
        if not check_file_integrity(fpath):
            all_ok = False
            
    print("\n" + "=" * 60)
    if all_ok:
        print("🎉 ALL CONTRACT DOCUMENTS VERIFIED: 100% COMPLIANT WITH WP-04")
        sys.exit(0)
    else:
        print("❌ VERIFICATION FAILED: Missing patterns or broken contracts")
        sys.exit(1)

if __name__ == "__main__":
    main()
