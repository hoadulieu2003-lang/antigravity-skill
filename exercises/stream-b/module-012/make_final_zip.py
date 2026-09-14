import zipfile
import os
import hashlib

ROOT_DIR = r"C:\Users\game\.gemini\exercises\stream-b\module-012"
ZIP_NAME = "design_training_012_final_submission_r01.zip"
ZIP_PATH = os.path.join(ROOT_DIR, ZIP_NAME)

# Exact items to pack according to Directive Sections 18 & 19
root_files = [
    "DESIGN_TRAINING_MODULE_012_DIRECTIVE.md",
    "DESIGN_TRAINING_012_GOVERNANCE_WAIVER_005.md",
    "BRAND_THESIS.md",
    "REFERENCE_BOARD.md",
    "IMAGE_LANGUAGE_MATRIX.md",
    "BRAND_IMAGE_CONTRACT.yaml",
    "ASSET_MANIFEST.yaml",
    "CHANGE_LEDGER.md",
    "TEST_MATRIX_DRAFT.md",
    "SELECTION_DECISION.md",
    "DESIGN_TRAINING_012_REPORT.md",
    "VERIFICATION.json",
    "SCREENSHOT_MANIFEST.json",
    "verify_module_012.js",
]

directions_files = [
    "directions/option_a/index.html",
    "directions/option_b/index.html",
]

candidate_files = [
    "candidate/pre_critique.html",
    "candidate/index.html",
]

asset_files = [
    "assets/ASSET_MANIFEST.yaml",
    "assets/icons/contact_log.svg",
    "assets/icons/departure.svg",
    "assets/icons/missing_dossier.svg",
    "assets/icons/person_lan.svg",
    "assets/icons/ready.svg",
    "assets/icons/waiting_partner.svg",
    "assets/diagrams/t01_route_narrative.svg",
    "assets/diagrams/t01_route_schematic.svg",
    "assets/images/halong_field_documentary.svg",
    "assets/images/lan_avatar.svg",
    "assets/images/operational_scene_prep.svg",
    "assets/images/route_signal_abstract.svg",
    "assets/textures/grid_matrix_pattern.svg",
    "assets/textures/paper_grain_subtle.svg",
]

screenshots_files = [
    "screenshots/01_option_a_desktop_1440x900.png",
    "screenshots/02_option_b_desktop_1440x900.png",
    "screenshots/03_candidate_desktop_1440x900.png",
    "screenshots/04_candidate_tablet_768x1024.png",
    "screenshots/05_candidate_mobile_390x844.png",
    "screenshots/06_candidate_t01_detail_desktop.png",
    "screenshots/07_candidate_t01_detail_mobile.png",
    "screenshots/08_candidate_image_failure_mobile.png",
    "screenshots/09_candidate_icon_family.png",
    "screenshots/10_candidate_asset_disclosure.png",
]

items_to_pack = root_files + directions_files + candidate_files + asset_files + screenshots_files
print(f"Total files to pack: {len(items_to_pack)}")

if os.path.exists(ZIP_PATH):
    os.remove(ZIP_PATH)

missing_count = 0
with zipfile.ZipFile(ZIP_PATH, 'w', zipfile.ZIP_DEFLATED) as zipf:
    for rel_path in items_to_pack:
        full_path = os.path.join(ROOT_DIR, rel_path.replace("/", os.sep))
        if os.path.exists(full_path):
            arcname = rel_path.replace("\\", "/")
            zipf.write(full_path, arcname)
            print(f"  + {arcname}")
        else:
            print(f"  ! MISSING: {full_path}")
            missing_count += 1

if missing_count > 0:
    raise Exception(f"{missing_count} files missing!")

buf = open(ZIP_PATH, 'rb').read()
sha256 = hashlib.sha256(buf).hexdigest()
size_bytes = len(buf)

print("\n========================================================")
print(f"PACKAGE: {ZIP_NAME}")
print(f"FILES COUNT: {len(items_to_pack)}")
print(f"BYTES: {size_bytes}")
print(f"SHA-256: {sha256}")
print("========================================================")

cdp_dest = os.path.join(r"C:\Users\game\cdp_reader", ZIP_NAME)
open(cdp_dest, 'wb').write(buf)
print(f"Mirrored to cdp_reader: {cdp_dest}")
