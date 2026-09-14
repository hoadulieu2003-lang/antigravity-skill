import os
import re
import hashlib

base_dir = "C:/Users/game/.gemini/exercises/stream-b/module-012"

print("=== VERIFYING DELIVERABLES ===")

# 1. Check root directory files
root_files = os.listdir(base_dir)
print("1. Root files:", root_files)
assert "build_all_deliverables.py" not in root_files, "build_all_deliverables.py still exists!"
assert "test_here.py" not in root_files, "test_here.py still exists!"
print("   -> Scratch files cleaned up: PASS")

# 2. Check CHANGE_LEDGER.md
ledger_path = os.path.join(base_dir, "CHANGE_LEDGER.md")
assert os.path.exists(ledger_path), "CHANGE_LEDGER.md missing!"
with open(ledger_path, "r", encoding="utf-8") as f:
    ledger_text = f.read()
assert "e76ab08f4d1e72865f4210299594e175b94f471d3f8960c3f0c61d4259283c76" in ledger_text, "Zip hash missing!"
assert "8f6cc77d13ac3ce376ad7d429bf7f1f6340dc8c57ee1c7785dd8d970a8f35dbb" in ledger_text, "Directive hash missing!"
assert "78689ddccb63b72d4f7d6b30be919bc63f9b1044e3efa518c22f25d1d375cfce" in ledger_text, "Request hash missing!"
assert "T01" in ledger_text and "T08" in ledger_text, "Canonical tours missing in ledger!"
assert "13/09/2026 — 18:00, Asia/Ho_Chi_Minh" in ledger_text, "Anchor time missing in ledger!"
print("   -> CHANGE_LEDGER.md content & hashes: PASS")

# 3. Check BRAND_THESIS.md
thesis_path = os.path.join(base_dir, "BRAND_THESIS.md")
assert os.path.exists(thesis_path), "BRAND_THESIS.md missing!"
with open(thesis_path, "r", encoding="utf-8") as f:
    thesis_text = f.read()
assert "TRIPFLOW giúp đội vận hành nhìn thấy điều chưa sẵn sàng trước giờ khởi hành" in thesis_text, "Brand promise missing!"
assert "bình tĩnh" in thesis_text.lower() and "chính xác" in thesis_text.lower(), "Personality seeds missing!"

matches = re.findall(r'> \*"([^*]+)"\*', thesis_text)
assert len(matches) == 2, f"Expected 2 thesis quotes, found {len(matches)}"
words_a = len(matches[0].split())
words_b = len(matches[1].split())
print(f"   -> Thesis A word count: {words_a} (valid: {80 <= words_a <= 140})")
print(f"   -> Thesis B word count: {words_b} (valid: {80 <= words_b <= 140})")
assert 80 <= words_a <= 140, "Thesis A word count out of bounds!"
assert 80 <= words_b <= 140, "Thesis B word count out of bounds!"

# Check 8 visual decision mappings
vd_matches = re.findall(r'\| \*\*VD_0[1-8]\*\*', thesis_text)
print(f"   -> Visual decision mappings count: {len(vd_matches)}")
assert len(vd_matches) == 8, f"Expected 8 visual decisions, found {len(vd_matches)}"
print("   -> BRAND_THESIS.md: PASS")

# 4. Check REFERENCE_BOARD.md
ref_path = os.path.join(base_dir, "REFERENCE_BOARD.md")
assert os.path.exists(ref_path), "REFERENCE_BOARD.md missing!"
with open(ref_path, "r", encoding="utf-8") as f:
    ref_text = f.read()

ref_headers = re.findall(r'### Tham Chiếu \d:', ref_text)
print(f"   -> References count: {len(ref_headers)}")
assert len(ref_headers) == 8, f"Expected exactly 8 references, found {len(ref_headers)}"
for field in ["URL", "Observation", "Transfer Principle", "Copy Ban", "TRIPFLOW Relevance"]:
    count = len(re.findall(rf'\*\*{field}', ref_text))
    assert count == 8, f"Field {field} found {count} times (expected 8)"
print("   -> REFERENCE_BOARD.md: PASS (All 8 references have all 5 mandatory fields)")

# 5. Check IMAGE_LANGUAGE_MATRIX.md
matrix_path = os.path.join(base_dir, "IMAGE_LANGUAGE_MATRIX.md")
assert os.path.exists(matrix_path), "IMAGE_LANGUAGE_MATRIX.md missing!"
with open(matrix_path, "r", encoding="utf-8") as f:
    matrix_text = f.read()

role_headers = re.findall(r'### Vai Trò \d:', matrix_text)
print(f"   -> Image roles count: {len(role_headers)}")
assert len(role_headers) == 6, f"Expected 6 roles, found {len(role_headers)}"

attrs = ["purpose", "source_type", "style_rule", "do", "do_not", "desktop_crop", "mobile_crop", "color_treatment", "accessibility_treatment", "fallback_behavior"]
for attr in attrs:
    count = len(re.findall(rf'`{attr}`', matrix_text))
    assert count >= 6, f"Attribute {attr} found {count} times (expected >= 6)"
print("   -> IMAGE_LANGUAGE_MATRIX.md: PASS (All 6 roles have all 10 mandatory attributes)")

# 6. Check TEST_MATRIX_DRAFT.md
test_matrix_path = os.path.join(base_dir, "TEST_MATRIX_DRAFT.md")
assert os.path.exists(test_matrix_path), "TEST_MATRIX_DRAFT.md missing!"
with open(test_matrix_path, "r", encoding="utf-8") as f:
    test_text = f.read()

gates = re.findall(r'\| \*\*B0[1-8]\*\*', test_text)
print(f"   -> Blocking gates count: {len(gates)}")
assert len(gates) == 8, f"Expected 8 blocking gates, found {len(gates)}"

tests = re.findall(r'### T(0[1-9]|1[0-4]) —', test_text)
print(f"   -> Locked verification tests count: {len(tests)}")
assert len(tests) == 14, f"Expected 14 locked tests, found {len(tests)}"
print("   -> TEST_MATRIX_DRAFT.md: PASS (All 8 gates and 14 tests verified)")

# 7. Check source snapshot hash on disk
zip_path = os.path.join(base_dir, "source_snapshot", "design_training_007_submission_r04.zip")
h = hashlib.sha256()
with open(zip_path, "rb") as f:
    while chunk := f.read(65536):
        h.update(chunk)
zip_hash = h.hexdigest()
print(f"   -> Actual zip hash: {zip_hash}")
assert zip_hash == "e76ab08f4d1e72865f4210299594e175b94f471d3f8960c3f0c61d4259283c76", "Zip hash mismatch!"

print("\nALL DELIVERABLES VERIFIED 100% PASS!")
