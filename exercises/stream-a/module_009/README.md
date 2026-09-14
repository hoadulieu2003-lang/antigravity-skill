# TRIPFLOW Module 09: Accessibility Task Completion
## Stream A: Foundation Integrity · Repair Round 1 (Submission R02)

### 1. Giới thiệu
Mã nguồn nghiệm thu khả năng tiếp cận (Accessibility) toàn diện cho Bàn tiếp nhận yêu cầu hỗ trợ hành khách (AR-901) trên hệ thống TRIPFLOW.
Tuân thủ WAI-ARIA APG Modal Dialog Pattern, Single-Source Status Announcements, 3-Layer Data Architecture (Draft / Payload Snapshot / Committed), Reflow 320px không tràn ngang, và tương phản WCAG 2.2 AA.

### 2. Cài đặt môi trường kiểm thử độc lập (Portable Execution)
Để chạy lại toàn bộ harness kiểm chứng tự động:
```bash
# 1. Cài đặt dependency
npm install puppeteer-core

# 2. Chạy Chromium với Remote Debugging Port (mặc định: 9223 hoặc 9222)
# Windows:
chrome.exe --remote-debugging-port=9223

# 3. Khởi chạy kiểm chứng tự động
# Cách 1: Qua biến môi trường
CDP_PORT=9223 node verify_module_009.js

# Cách 2: Qua tham số dòng lệnh CLI
node verify_module_009.js 9223
```

### 3. Cấu trúc thư mục gói nộp (Archive Layout)
- `index.html`: Bản ứng viên chính thức (Candidate - Direction A Inline Form).
- `baseline/index.html`: Bản đối chứng chứa 8 khuyết tật chủ đích (DEF-01 đến DEF-08) kèm banner cảnh báo.
- `directions/option_a.html`: Hướng A (Inline Accessible Form).
- `directions/option_b.html`: Hướng B (Guided Multi-Step Flow).
- `ACCESSIBILITY_CONTRACT.yaml`: Hợp đồng đặc tả trợ năng có cấu trúc.
- `ASSISTIVE_TECH_REVIEW_PLAN.md`: Kế hoạch kiểm toán công nghệ hỗ trợ và kỳ vọng screen reader.
- `verify_module_009.js`: Động cơ kiểm chứng tự động 8 Cổng (A01–A08) fail-closed.
- `VERIFICATION.json`: Sổ cái viễn trắc đo đạc độc lập.
- `AX_TREE.json`: Ảnh chụp cây trợ năng từ Chromium CDP.
- `DESIGN_TRAINING_009_REPORT.md`: Báo cáo pháp y kỹ thuật 11 phần.
- `screenshots/`: 11 tệp ảnh bằng chứng authoritative DPR=2.
- 4 văn bản Controller byte-identical:
  - `DESIGN_TRAINING_009_DIRECTIVE.md`
  - `DESIGN_TRAINING_009_FIRST_RESPONSE_REVIEW_001.md`
  - `DESIGN_TRAINING_009_FIRST_RESPONSE_REVIEW_002.md`
  - `DESIGN_TRAINING_009_REVIEW_001.md`
