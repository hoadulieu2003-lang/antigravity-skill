import os
import zipfile
import hashlib

base_dir = r"C:\Users\game\.gemini\exercises\design_training_007"
zip_output = os.path.join(base_dir, "design_training_007_submission_r04.zip")

files_and_dirs = [
    "baseline",
    "directions",
    "candidate",
    "DESIGN_CONTRACT.yaml",
    "DESIGN_TRAINING_007_DIRECTIVE.md",
    "DESIGN_TRAINING_007_REPORT.md",
    "DESIGN_TRAINING_007_REVIEW_001.md",
    "DESIGN_TRAINING_007_REVIEW_002.md",
    "DESIGN_TRAINING_007_FINAL_REVIEW_003.md",
    "CHANGE_LEDGER.md",
    "VERIFICATION.json",
    "verify_module_007.js",
    "screenshots"
]

print(f"Packaging {zip_output}...")
with zipfile.ZipFile(zip_output, 'w', compression=zipfile.ZIP_DEFLATED) as zf:
    for item in files_and_dirs:
        item_path = os.path.join(base_dir, item)
        if os.path.isdir(item_path):
            for root, dirs, files in os.walk(item_path):
                for f in files:
                    full_p = os.path.join(root, f)
                    rel_p = os.path.relpath(full_p, base_dir)
                    zip_arcname = rel_p.replace('\\', '/')
                    zf.write(full_p, zip_arcname)
                    print(f"  + {zip_arcname}")
        elif os.path.isfile(item_path):
            rel_p = os.path.relpath(item_path, base_dir)
            zip_arcname = rel_p.replace('\\', '/')
            zf.write(item_path, zip_arcname)
            print(f"  + {zip_arcname}")

with open(zip_output, 'rb') as f:
    sha256 = hashlib.sha256(f.read()).hexdigest()

print(f"DONE! ZIP: {zip_output}")
print(f"SHA-256: {sha256}")
print(f"Size: {os.path.getsize(zip_output)} bytes")

with zipfile.ZipFile(zip_output, 'r') as zf:
    has_backslash = any('\\' in name for name in zf.namelist())
    if has_backslash:
        print("[WARNING] Backslash found in ZIP entry names!")
    else:
        print("[OK] All ZIP entries use pure forward slashes '/'.")
