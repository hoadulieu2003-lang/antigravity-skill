#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Verification Script: Document Contract Integrity for Antigravity 2.0 (WP-04)
Validates config/AGENTS.md, GEMINI.md, and operational skills (dev, test)
for structural consistency, required design engineering duo tokens, dual audit mechanisms,
markdown link resolution, and UTF-8 encoding validity.
"""

import os
import sys
import re

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

BASE_DIR = r"C:\Users\game\.gemini"

CORE_CONTRACT_FILES = [
    os.path.join(BASE_DIR, "GEMINI.md"),
    os.path.join(BASE_DIR, "config", "AGENTS.md")
]

SKILL_OPERATIONAL_FILES = [
    os.path.join(BASE_DIR, "config", "skills", "dev", "SKILL.md"),
    os.path.join(BASE_DIR, "config", "skills", "test", "SKILL.md")
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

DEV_SKILL_PATTERNS = [
    ("Dev Skill: Design Engineering Duo Pod 4", r"Design Engineering Duo.*Worker Pod 4.*153 Brands"),
    ("Dev Skill: Design Engineering Duo Pod 5", r"Design Engineering Duo.*Worker Pod 5.*20% Delight Budget.*spotlight.*lenis.*WebAudioHaptics"),
]

TEST_SKILL_PATTERNS = [
    ("Test Skill: Dual Audit in Subagent 2", r"Subagent 2.*Dual Audit"),
    ("Test Skill: Audit 1 WCAG AA & responsive", r"Audit 1.*WCAG AA.*Responsive"),
    ("Test Skill: Audit 2 Delight Score >= 8.5/10", r"Audit 2.*Delight & Craftsmanship Score.*8\.5/10"),
]

def check_file_encoding_and_content(file_path):
    if not os.path.exists(file_path):
        print(f"❌ File does not exist: {file_path}")
        return None
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
        return content
    except UnicodeDecodeError as e:
        print(f"❌ UTF-8 decode error in {file_path}: {e}")
        return None

def check_markdown_links(content, file_path):
    # Strip multiline code blocks (```...```) to avoid syntax examples
    clean_content = re.sub(r'```.*?```', '', content, flags=re.DOTALL)

    # Find all markdown links [text](target)
    links = re.findall(r'\[([^\]]*)\]\(([^)]+)\)', clean_content)
    broken_links = []
    checked_count = 0

    for link_text, link_target in links:
        # Ignore placeholders like <conversation-id> or <image.png>
        if "<" in link_target and ">" in link_target:
            continue
        if link_target.startswith("file:///"):
            checked_count += 1
            target_path = link_target.replace("file:///", "").replace("/", os.sep)
            if not os.path.exists(target_path):
                broken_links.append((link_text, link_target, target_path))

    return checked_count, broken_links

def check_contract_file(file_path, patterns):
    rel_path = os.path.relpath(file_path, BASE_DIR)
    print(f"\n🔍 Checking integrity of: {rel_path}")
    print("-" * 60)

    content = check_file_encoding_and_content(file_path)
    if content is None:
        return False

    print(f"✅ UTF-8 encoding valid. Total characters: {len(content)}, Lines: {len(content.splitlines())}")

    all_patterns_found = True
    for label, pattern in patterns:
        match = re.search(pattern, content, re.IGNORECASE | re.DOTALL)
        if match:
            print(f"  ✅ Pattern satisfied: {label}")
        else:
            print(f"  ❌ Missing required pattern: {label} (Regex: {pattern})")
            all_patterns_found = False

    checked_links, broken_links = check_markdown_links(content, file_path)
    if broken_links:
        print(f"  ❌ Error: {len(broken_links)} broken local links detected:")
        for t, orig, p in broken_links:
            print(f"     - [{t}]({orig}) -> {p}")
        return False
    else:
        print(f"  ✅ All active local file:/// links resolved successfully ({checked_links} links checked).")

    return all_patterns_found

def main():
    print("=" * 60)
    print("ANTIGRAVITY 2.0 CONTRACT INTEGRITY VERIFICATION SUITE")
    print("=" * 60)

    all_ok = True

    # 1. Verify Core Contract Documents (GEMINI.md, AGENTS.md)
    print("\n--- [PART 1] CORE AGENT CONTRACT DOCUMENTS ---")
    for fpath in CORE_CONTRACT_FILES:
        if not check_contract_file(fpath, REQUIRED_PATTERNS):
            all_ok = False

    # 2. Verify Operational Skills (dev/SKILL.md, test/SKILL.md)
    print("\n--- [PART 2] OPERATIONAL SKILL CONTRACTS ---")
    dev_skill_file = os.path.join(BASE_DIR, "config", "skills", "dev", "SKILL.md")
    if not check_contract_file(dev_skill_file, DEV_SKILL_PATTERNS):
        all_ok = False

    test_skill_file = os.path.join(BASE_DIR, "config", "skills", "test", "SKILL.md")
    if not check_contract_file(test_skill_file, TEST_SKILL_PATTERNS):
        all_ok = False

    print("\n" + "=" * 60)
    if all_ok:
        print("🎉 ALL CONTRACT DOCUMENTS & OPERATIONAL SKILLS VERIFIED: 100% COMPLIANT WITH WP-04")
        sys.exit(0)
    else:
        print("❌ VERIFICATION FAILED: Missing patterns or broken contracts")
        sys.exit(1)

if __name__ == "__main__":
    main()
