# 📘 Cẩm Nang Đồ Họa & Chuyển Động Siêu Mượt 60 FPS (GSAP Motion Playbook)

> **Chủ quản**: Anh — Lead Architect / Product Owner  
> **Hệ thống áp dụng**: Anti AI Pair-Programmer  
> **Hệ sinh thái công nghệ**: `GSAP 3.12+, ScrollTrigger, SplitText, Flip, React useGSAP, WebGL Canvas`  
> **Cập nhật lần cuối**: 2026-09-25 22:42:11 UTC

---

## 1. Các Quy Tắc Bất Biến Cốt Lõi (`Core Engineering Invariants`)
- **INV-01**: Khóa cứng tốc độ khung hình 60 FPS bằng cách chỉ can thiệp vào thuộc tính `transform (x, y, scale, rotation)` và `opacity` (Composite-only properties).
- **INV-02**: Luôn dọn dẹp bộ nhớ với `gsap.context()` hoặc `useGSAP({ revertOnUpdate: true })` trong React để triệt tiêu triệt để rò rỉ bộ nhớ (Memory Leaks).
- **INV-03**: Sử dụng `will-change: transform` thận trọng trên các phần tử nặng để ép GPU tăng tốc phần cứng mà không làm tràn bộ nhớ VRAM.

---

## 2. Các Mẫu Lệnh & Code Thực Chiến (`Production Code Patterns`)
### 📌 Scrollytelling Pinned Stage Pattern
```bash
gsap.timeline({ scrollTrigger: { trigger: '.stage', pin: true, scrub: 0.8, start: 'top top', end: '+=300%' } })
```

### 📌 Sub-pixel Antialiasing & Aliases
```bash
gsap.set(element, { force3D: true, z: 0.01, backfaceVisibility: 'hidden' })
```



---

## 3. Quy Chuẩn Kiểm Chứng Độc Lập (`Verification Criteria`)
* Mọi giải pháp mã nguồn thuộc lĩnh vực này đều phải chạy kiểm thử cú pháp và đo lường số liệu thực tế trước khi xuất xưởng.
* Luôn tự kiểm toán bẫy lỗi biên (`Edge Cases`) để bảo toàn hiệu năng cao nhất.

---
*Cẩm nang này là tài sản kiến thức độc quyền, được duy trì tự động bởi Topical Research Crawler.*
