const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execSync } = require('child_process');

const baseDir = 'C:/Users/game/.gemini/exercises/design_training_005';
const zipOut = 'C:/Users/game/.gemini/exercises/design_training_005/design_training_005_submission_r02.zip';
const zipCopy = 'C:/Users/game/cdp_reader/design_training_005_submission_r02.zip';

const pyScript = `
import zipfile, os

base = r'C:\\Users\\game\\.gemini\\exercises\\design_training_005'
out_zip = r'C:\\Users\\game\\.gemini\\exercises\\design_training_005\\design_training_005_submission_r02.zip'

root_files = [
    'index.html',
    'DESIGN_CONTRACT.yaml',
    'DESIGN_TRAINING_005_REPORT.md',
    'DESIGN_TRAINING_005_DIRECTIVE.md',
    'DESIGN_TRAINING_005_REVIEW_001.md',
    'VERIFICATION.json',
    'verify_module_005.js'
]

directions_files = [
    'option_a.html',
    'option_b.html'
]

screenshot_files = [
    'option_a_desktop_1440x900.png',
    'option_b_desktop_1440x900.png',
    'final_desktop_1440x900.png',
    'final_mobile_390x844.png',
    'final_desktop_fullpage.png',
    'final_mobile_fullpage.png'
]

with zipfile.ZipFile(out_zip, 'w', zipfile.ZIP_DEFLATED) as z:
    for f in root_files:
        p = os.path.join(base, f)
        if os.path.exists(p):
            z.write(p, arcname=f)
            print(f"Added: {f}")
        else:
            print(f"WARN: File not found {p}")

    for df in directions_files:
        p = os.path.join(base, 'directions', df)
        if os.path.exists(p):
            arc = 'directions/' + df
            z.write(p, arcname=arc)
            print(f"Added: {arc}")
        else:
            print(f"WARN: Direction file not found {p}")

    for sf in screenshot_files:
        p = os.path.join(base, 'screenshots', sf)
        if os.path.exists(p):
            arc = 'screenshots/' + sf
            z.write(p, arcname=arc)
            print(f"Added: {arc}")
        else:
            print(f"WARN: Screenshot not found {p}")

print("ZIP Created successfully with pure forward slashes!")
`;

fs.writeFileSync('C:/Users/game/cdp_reader/make_zip_005_r02.py', pyScript, 'utf8');
execSync('python C:/Users/game/cdp_reader/make_zip_005_r02.py', { stdio: 'inherit' });

fs.copyFileSync(zipOut, zipCopy);

const stat = fs.statSync(zipOut);
const hash = crypto.createHash('sha256').update(fs.readFileSync(zipOut)).digest('hex');

console.log(`[ZIP OK] Size: ${stat.size} bytes (${(stat.size / 1024).toFixed(1)} KB)`);
console.log(`[SHA-256]: ${hash}`);

// List ZIP entries to verify forward slashes
const checkPy = `
import zipfile
z = zipfile.ZipFile(r'${zipOut}')
for info in z.infolist():
    print(f"  Entry: {info.filename} ({info.file_size} bytes)")
`;
fs.writeFileSync('C:/Users/game/cdp_reader/check_zip_005_r02.py', checkPy, 'utf8');
execSync('python C:/Users/game/cdp_reader/check_zip_005_r02.py', { stdio: 'inherit' });
