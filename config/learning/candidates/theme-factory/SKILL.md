---
name: theme-factory
description: |
  Kỹ năng chuyên gia thiết kế từ anthropics/skills (189941 ⭐). Tự động kích hoạt khi người dùng muốn:
  - Phối màu thương hiệu, cặp phông chữ tiêu đề/nội dung và hệ thống chủ đề (Theme Factory & Brand Guidelines) cho Web, Slide và Ấn phẩm
  - Áp dụng nhanh 10 bảng màu thẩm mỹ cao (Forest Canopy, Golden Hour, Botanical Garden, Desert Rose...) hoặc sinh bảng màu thương hiệu mới
  - Đảm bảo tính nhất quán nhận diện thương hiệu và độ tương phản chuẩn WCAG AA trên nền sáng
  KHÔNG CẦN người dùng phải nhớ tên kỹ thuật 'theme-factory'.
---

# 🎨 THEME-FACTORY — ENTERPRISE DESIGN SKILL (anthropics/skills • 189,941 ⭐)

## 1. Bản Chất Kiến Trúc (Architectural Essence)
Kỹ năng `theme-factory` được tích hợp từ kho mã nguồn mở danh tiếng `anthropics/skills` (189,941 ⭐) và chuẩn hóa hoàn toàn theo Hiến chương Kỹ thuật Antigravity (`config/AGENTS.md`):
- **Luminous Light Theme Invariant (Bất biến Giao diện Sáng Đa Tầng)**: Mặc định 100% áp dụng nền sáng đa tầng (`Warm Paper #FAF9F6`, `Ivory #FDFBF7`, `Alabaster #F8F9FA`, `Pure White #FFFFFF`), bóng đổ đa chiều mịn màng và độ tương phản chuẩn `WCAG AA`. Chỉ dùng Dark Theme khi Anh yêu cầu tường minh.
- **Anti-AI Slop Craftsmanship (Chống Rác Giao Diện AI)**: Triệt tiêu bố cục rập khuôn, icon emoji rẻ tiền và khối màu giả lập vô hồn; đề cao tỷ lệ chữ tinh tế, chất liệu nhiếp ảnh/vector thực thụ và chiều sâu thẩm mỹ.

## 2. Thông Số Kỹ Thuật & Tài Nguyên Đi Kèm (Technical Specifications & Bundled Assets)
- Đi kèm 10 hồ sơ chủ đề màu sắc & phông chữ chi tiết tại `C:\Users\game\.gemini\config\skills\theme-factory\themes\` (Lưu ý: Khi áp dụng các theme tối như Midnight Galaxy, mặc định chuyển hóa sang biến thể nền sáng Luminous trừ khi Anh yêu cầu nền tối).

```powershell
# Liệt kê 10 chủ đề màu sắc & cặp font chữ mẫu trong themes/
python -c "import os; print(sorted(os.listdir(r'C:\Users\game\.gemini\config\skills\theme-factory\themes')))"
```

## 3. Quy Trình Vận Hành Chuẩn & An Toàn (Operational Runbook & Sandbox Guardrails)
- **Sandbox & Bảo mật (Rule 14 / INV-E07)**: Tuyệt đối không ghi đè tệp ngoài phạm vi dự án, không lộ khóa bí mật và tuân thủ cơ chế `FAST Mode` / `2-strike` khi gỡ lỗi hiển thị.
- **Tự Kiểm Chứng Thực Tế (Evidence Ledger & Closed-Loop Verification)**: Sau khi xuất thiết kế (HTML/CSS, PNG/PDF Canvas, p5.js hoặc Video Remotion), bắt buộc kiểm tra kết quả hiển thị thực tế qua trình duyệt CDP hoặc kiểm tra kích thước khung hình để đảm bảo 0 lỗi tràn lề chữ (`0 Text Overflow`) và 0 lỗi Console.
- **Bẫy Lỗi Thường Gặp**: Tránh dùng font hệ thống thiếu dấu Tiếng Việt khi thiết kế ấn phẩm đa ngôn ngữ; luôn kiểm tra độ tương phản chữ trên nền giấy sáng.

---

## 4. Cẩm Nang Chuyên Môn Nguyên Bản (Upstream Master Playbook)

# Theme Factory Skill

This skill provides a curated collection of professional font and color themes themes, each with carefully selected color palettes and font pairings. Once a theme is chosen, it can be applied to any artifact.

## Purpose

To apply consistent, professional styling to presentation slide decks, use this skill. Each theme includes:
- A cohesive color palette with hex codes
- Complementary font pairings for headers and body text
- A distinct visual identity suitable for different contexts and audiences

## Usage Instructions

To apply styling to a slide deck or other artifact:

1. **Show the theme showcase**: Display the `theme-showcase.pdf` file to allow users to see all available themes visually. Do not make any modifications to it; simply show the file for viewing.
2. **Ask for their choice**: Ask which theme to apply to the deck
3. **Wait for selection**: Get explicit confirmation about the chosen theme
4. **Apply the theme**: Once a theme has been chosen, apply the selected theme's colors and fonts to the deck/artifact

## Themes Available

The following 10 themes are available, each showcased in `theme-showcase.pdf`:

1. **Ocean Depths** - Professional and calming maritime theme
2. **Sunset Boulevard** - Warm and vibrant sunset colors
3. **Forest Canopy** - Natural and grounded earth tones
4. **Modern Minimalist** - Clean and contemporary grayscale
5. **Golden Hour** - Rich and warm autumnal palette
6. **Arctic Frost** - Cool and crisp winter-inspired theme
7. **Desert Rose** - Soft and sophisticated dusty tones
8. **Tech Innovation** - Bold and modern tech aesthetic
9. **Botanical Garden** - Fresh and organic garden colors
10. **Midnight Galaxy** - Dramatic and cosmic deep tones

## Theme Details

Each theme is defined in the `themes/` directory with complete specifications including:
- Cohesive color palette with hex codes
- Complementary font pairings for headers and body text
- Distinct visual identity suitable for different contexts and audiences

## Application Process

After a preferred theme is selected:
1. Read the corresponding theme file from the `themes/` directory
2. Apply the specified colors and fonts consistently throughout the deck
3. Ensure proper contrast and readability
4. Maintain the theme's visual identity across all slides

## Create your Own Theme
To handle cases where none of the existing themes work for an artifact, create a custom theme. Based on provided inputs, generate a new theme similar to the ones above. Give the theme a similar name describing what the font/color combinations represent. Use any basic description provided to choose appropriate colors/fonts. After generating the theme, show it for review and verification. Following that, apply the theme as described above.

---

## Brand Guidelines Extension

# Anthropic Brand Styling

## Overview

To access Anthropic's official brand identity and style resources, use this skill.

**Keywords**: branding, corporate identity, visual identity, post-processing, styling, brand colors, typography, Anthropic brand, visual formatting, visual design

## Brand Guidelines

### Colors

**Main Colors:**

- Dark: `#141413` - Primary text and dark backgrounds
- Light: `#faf9f5` - Light backgrounds and text on dark
- Mid Gray: `#b0aea5` - Secondary elements
- Light Gray: `#e8e6dc` - Subtle backgrounds

**Accent Colors:**

- Orange: `#d97757` - Primary accent
- Blue: `#6a9bcc` - Secondary accent
- Green: `#788c5d` - Tertiary accent

### Typography

- **Headings**: Poppins (with Arial fallback)
- **Body Text**: Lora (with Georgia fallback)
- **Note**: Fonts should be pre-installed in your environment for best results

## Features

### Smart Font Application

- Applies Poppins font to headings (24pt and larger)
- Applies Lora font to body text
- Automatically falls back to Arial/Georgia if custom fonts unavailable
- Preserves readability across all systems

### Text Styling

- Headings (24pt+): Poppins font
- Body text: Lora font
- Smart color selection based on background
- Preserves text hierarchy and formatting

### Shape and Accent Colors

- Non-text shapes use accent colors
- Cycles through orange, blue, and green accents
- Maintains visual interest while staying on-brand

## Technical Details

### Font Management

- Uses system-installed Poppins and Lora fonts when available
- Provides automatic fallback to Arial (headings) and Georgia (body)
- No font installation required - works with existing system fonts
- For best results, pre-install Poppins and Lora fonts in your environment

### Color Application

- Uses RGB color values for precise brand matching
- Applied via python-pptx's RGBColor class
- Maintains color fidelity across different systems
