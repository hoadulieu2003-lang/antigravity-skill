# 📘 Cẩm Nang Thiết Kế Kiến Trúc Đa Tác Tử Động (Multi-Agent Orchestration Playbook)

> **Chủ quản**: Anh — Lead Architect / Product Owner  
> **Hệ thống áp dụng**: Anti AI Pair-Programmer  
> **Hệ sinh thái công nghệ**: `Antigravity Dynamic Project System V2, Spec-Driven Development, Human Gate`  
> **Cập nhật lần cuối**: 2026-09-18 10:42:09 UTC

---

## 1. Các Quy Tắc Bất Biến Cốt Lõi (`Core Engineering Invariants`)
- **INV-01**: Nguyên tắc Bất biến: Antigravity là Lead Engine kiêm Integrator duy nhất, chịu trách nhiệm tích hợp toàn bộ output từ các tác tử phụ.
- **INV-02**: Áp dụng quy tắc 2-Strike nghiêm ngặt: Khi gặp lỗi lần 2 phải dừng lập tức, rollback về checkpoint an toàn và báo cáo nguyên nhân gốc rễ.
- **INV-03**: Khóa chết hạn mức đầu ra 128K Token (131,072 tokens) và Always-On Max Reasoning cho mọi quyết định kiến trúc.

---

## 2. Các Mẫu Lệnh & Code Thực Chiến (`Production Code Patterns`)
### 📌 Spec-First Handoff Pattern
```bash
$plan (Definition) -> $dev (Partition & Verify) -> $test (Explicit Independent Audit)
```

### 📌 Adversarial Code Review Scaffold
```bash
Self-Reflection Prompt: 'Find at least 2 residual risks, security loopholes, or trade-offs before output.'
```



---

## 3. Quy Chuẩn Kiểm Chứng Độc Lập (`Verification Criteria`)
* Mọi giải pháp mã nguồn thuộc lĩnh vực này đều phải chạy kiểm thử cú pháp và đo lường số liệu thực tế trước khi xuất xưởng.
* Luôn tự kiểm toán bẫy lỗi biên (`Edge Cases`) để bảo toàn hiệu năng cao nhất.

---
*Cẩm nang này là tài sản kiến thức độc quyền, được duy trì tự động bởi Topical Research Crawler.*
