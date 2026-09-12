# Rule & Skill Candidate Extraction Policy

## 1. Chu Trình Trích Xuất Ứng Viên (Candidate Lifecycle)

```text
[OBSERVATION] ──> [LEARNING_EVENT] ──> [REPETITION_DETECTION] (>= 2-3 lần)
                        │
                        ▼
             [COUNTEREXAMPLE_CHECK]
                        │
                        ▼
             [LEARNING_CANDIDATE] (Status: READY_FOR_PROMOTION_REVIEW)
                        │
                        ▼
             [HUMAN_PROMOTION_GATE] ──> [PROMOTE | REJECT | ARCHIVE]
```

## 2. Tiêu Chí Trích Xuất Kỹ Năng Mới (Skill Extraction vs Prompt)

- **Khi nào trích xuất Skill Mới**:
  - Quy trình phức tạp, gồm nhiều bước phối hợp, có công cụ chuyên dụng, và xuất hiện lặp lại ở nhiều dự án.
- **Khi nào KHÔNG trích xuất Skill**:
  - Chỉ là một prompt dài hoặc một hướng dẫn dùng một lần (*Long prompt only*).
  - Đã có Skill hiện hữu bao hàm (*Tránh trùng lặp - Duplication Prevention, ví dụ: GSAP đã có, không tạo thêm custom animation skill*).
  - Phong cách mỹ thuật đơn lẻ của một dự án.
