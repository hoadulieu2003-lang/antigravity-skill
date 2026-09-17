# 📘 Cẩm Nang Tối Ưu Hiệu Năng Web & Chuẩn Trợ Năng (Web Performance & WCAG AA Playbook)

> **Chủ quản**: Anh — Lead Architect / Product Owner  
> **Hệ thống áp dụng**: Anti AI Pair-Programmer  
> **Hệ sinh thái công nghệ**: `Next.js App Router, React 19 Server Components, Cloudflare Workers, Tailwind CSS`  
> **Cập nhật lần cuối**: 2026-09-17 16:42:10 UTC

---

## 1. Các Quy Tắc Bất Biến Cốt Lõi (`Core Engineering Invariants`)
- **INV-01**: Tương phản màu sắc bắt buộc đạt chuẩn WCAG AA: Tối thiểu 4.5:1 cho văn bản thông thường và 3:1 cho văn bản kích thước lớn/tiêu đề.
- **INV-02**: Tất cả các thành phần tương tác (Sliders, Knobs, Drawers) bắt buộc hỗ trợ đầy đủ bàn phím (`ArrowUp`, `ArrowDown`, `Home`, `End`, `Escape`).
- **INV-03**: Zero Cumulative Layout Shift (CLS = 0): Mọi hình ảnh và iframe bắt buộc định nghĩa rõ `aspect-ratio` hoặc kích thước `width/height` trước khi render.

---

## 2. Các Mẫu Lệnh & Code Thực Chiến (`Production Code Patterns`)
### 📌 Keyboard Accessible Custom Control
```bash
role='slider' aria-valuenow={val} tabIndex={0} onKeyDown={(e) => handleKeyNavigation(e)}
```

### 📌 Cloudflare Workers Edge Caching Header
```bash
headers.set('Cache-Control', 'public, max-age=31536000, immutable, s-maxage=31536000')
```



---

## 3. Quy Chuẩn Kiểm Chứng Độc Lập (`Verification Criteria`)
* Mọi giải pháp mã nguồn thuộc lĩnh vực này đều phải chạy kiểm thử cú pháp và đo lường số liệu thực tế trước khi xuất xưởng.
* Luôn tự kiểm toán bẫy lỗi biên (`Edge Cases`) để bảo toàn hiệu năng cao nhất.

---
*Cẩm nang này là tài sản kiến thức độc quyền, được duy trì tự động bởi Topical Research Crawler.*
