#!/usr/bin/env python3
"""
package_zip_008.py
Deterministic packaging script for Module 08 submission:
Target Archive: design_training_008_submission_r01.zip
Invariants:
- Pure forward slashes ('/') for all archive internal paths (NO Windows backslashes '\\').
- Sorted archive entries for reproducible, deterministic packaging.
- Validates entry paths, file existence, archive integrity, and computes SHA-256 hash.
"""

import os
import sys
import zipfile
import hashlib
from pathlib import Path

def compute_sha256(filepath):
    h = hashlib.sha256()
    with open(filepath, "rb") as f:
        while chunk := f.read(65536):
            h.update(chunk)
    return h.hexdigest()

def build_submission_zip():
    base_dir = Path(__file__).resolve().parent
    zip_path = base_dir / "design_training_008_verification_audit_correction_001.zip"

    # Explicit list of root and subfolder files to package
    explicit_files = [
        "index.html",
        "directions/option_a.html",
        "directions/option_b.html",
        "COLOR_CONTRACT.yaml",
        "DESIGN_TRAINING_008_REPORT.md",
        "AUDIT_CHANGE_LEDGER.md",
        "DESIGN_TRAINING_008_INITIAL_REVIEW_001.md",
        "DESIGN_TRAINING_008_INTAKE_HOLD_001.md",
        "DESIGN_TRAINING_008_REVIEW_001.md",
        "DESIGN_TRAINING_008_REVIEW_002.md",
        "DESIGN_TRAINING_008_FINAL_REVIEW_003.md",
        "DESIGN_TRAINING_008_VERIFICATION_REMEDIATION_AUTHORIZATION_004.md",
        "DESIGN_TRAINING_008_VERIFICATION_AUDIT_REVIEW_001.md",
        "VERIFICATION.json",
        "verify_module_008.js"
    ]

    # Collect screenshot files
    screenshots_dir = base_dir / "screenshots"
    screenshot_files = []
    if screenshots_dir.is_dir():
        for item in sorted(screenshots_dir.iterdir()):
            if item.is_file() and item.suffix.lower() == ".png":
                rel = item.relative_to(base_dir).as_posix()
                screenshot_files.append(rel)
    else:
        print("ERROR: screenshots directory not found!", file=sys.stderr)
        sys.exit(1)

    all_relative_paths = sorted(explicit_files + screenshot_files)

    print(f"Packaging {len(all_relative_paths)} entries into {zip_path.name}...")

    # Write to zip with pure forward slashes and deterministic metadata
    with zipfile.ZipFile(zip_path, mode="w", compression=zipfile.ZIP_DEFLATED) as zf:
        for rel_path in all_relative_paths:
            # Force forward slash
            arcname = rel_path.replace("\\", "/")
            full_path = base_dir / rel_path

            if not full_path.exists():
                print(f"ERROR: File not found: {full_path}", file=sys.stderr)
                sys.exit(1)

            # Fixed timestamp for determinism (2026-09-14 01:00:00)
            zinfo = zipfile.ZipInfo(filename=arcname, date_time=(2026, 9, 14, 1, 0, 0))
            zinfo.compress_type = zipfile.ZIP_DEFLATED
            zinfo.external_attr = 0o644 << 16  # standard file permissions

            with open(full_path, "rb") as f:
                content = f.read()
            zf.writestr(zinfo, content)
            print(f"  + Added: {arcname} ({len(content):,} bytes)")

    # Independent Verification of created ZIP
    print("\n--- Verifying Archive Integrity ---")
    with zipfile.ZipFile(zip_path, mode="r") as zf:
        namelist = zf.namelist()
        has_backslash = False
        for name in namelist:
            if "\\" in name:
                print(f"VIOLATION: Entry contains backslash: {name}", file=sys.stderr)
                has_backslash = True
        
        if has_backslash:
            print("FATAL: Archive contains backslashes!", file=sys.stderr)
            sys.exit(1)
        
        # Test archive CRC-32
        corrupt = zf.testzip()
        if corrupt:
            print(f"FATAL: Corrupt entry in archive: {corrupt}", file=sys.stderr)
            sys.exit(1)

    zip_size = os.path.getsize(zip_path)
    zip_sha256 = compute_sha256(zip_path)

    print("Verification Result: CLEAN")
    print(f"Total Entries: {len(namelist)}")
    print(f"Archive Size: {zip_size:,} bytes")
    print(f"Archive SHA-256: {zip_sha256}")
    print("All entry paths use pure forward slashes ('/').")
    print("Package creation completed successfully.")

if __name__ == "__main__":
    build_submission_zip()
