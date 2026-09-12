# Governed Continuous Learning Protocol (Phase E)

Hệ sinh thái Framework V2 vận hành cơ chế Học Hỏi Có Kiểm Soát (**Governed Continuous Learning**).

## 1. Tôn Chỉ Bất Biến (Core Invariants)

1. **INV-E01 — No Autonomous Global Mutation**: Framework tuyệt đối KHÔNG tự ý chỉnh sửa `user_global`, `dynamic-project-system.md`, global rules, hoặc global skills dựa trên quan sát đơn lẻ.
2. **INV-E02 — Observation != Rule**: Một sự kiện thành công hay thất bại đơn lẻ KHÔNG PHẢI là quy tắc toàn cục. Bắt buộc phải qua chu trình thẩm định lặp lại.
3. **INV-E03 — Project Aesthetic Isolation**: Mỹ cảm đặc thù của một dự án (như *Editorial Swiss Specimen*) KHÔNG ĐƯỢC biến thành phong cách toàn cục cho toàn bộ hệ thống.
4. **INV-E04 — Evidence-Backed Learning**: Mọi đề xuất học hỏi phải gắn liền với Sổ cái Bằng chứng (`Evidence Ledger`), Log kiểm thử độc lập, hoặc Quyết định của Con người.
5. **INV-E05 — Human Promotion Gate**: Việc nâng cấp lên mức Toàn Cục (`GLOBAL`) bắt buộc phải có lệnh chấp thuận tường minh từ Anh (Product Owner): `APPROVE`, `APPROVE_WITH_CHANGES`, hoặc `REJECT`.
6. **INV-E06 — Reversibility**: Mọi luật/skill được promote bắt buộc phải có đường lui (`rollback plan`), số phiên bản và lịch sử bằng chứng.
7. **INV-E07 — Secret / Sensitive Data Sanitization**: Tuyệt đối lọc bỏ toàn bộ API keys, secrets, dữ liệu cá nhân trước khi lưu trữ sự kiện học hỏi.

---

## 2. Mô Hình Phân Cấp 4 Tầng Phạm Vi (4-Tier Scope Model)

```text
   [GLOBAL]   ◄── Khắt khe nhất, chỉ có Invariant khung, CẦN HUMAN GATE DUYỆT
      ▲
   [DOMAIN]   ◄── Danh mục dự án (Visual Web, AI Agent, Scriptwriting)
      ▲
  [PROJECT]   ◄── Cục bộ trong 1 repository cụ thể
      ▲
   [TASK]     ◄── Ngắn hạn trong 1 micro-sprint, không lưu trữ dài hạn
```

> **Quy tắc Vàng**: Luôn ưu tiên phạm vi hẹp nhất chính xác với bằng chứng (*Prefer narrowest valid scope*).

8. **INV-E08 — Dual-Path Signal Capture**: Thu thập bài học từ cả thành công lẫn thất bại (TEST_FAIL, TEST_BLOCKED, REJECTED, ESCALATED).

---

## 3. Chu Trình Ba Trạng Thái (Tri-State Lifecycle: RECORD vs ACTIVATE vs PROMOTE)

1. **RECORD**: Ghi nhận quan sát hoặc ứng viên vào registry (status: CANDIDATE). Chưa có hiệu lực.
2. **ACTIVATE**: Kích hoạt trong phạm vi hẹp (PROJECT hoặc DOMAIN) sau khi được domain owner kiểm duyệt. Ứng viên Domain không tự động kích hoạt chéo domain hoặc toàn cục.
3. **PROMOTE**: Nâng cấp thành Invariant/Skill toàn cục (status: PROMOTED_GLOBAL). Bắt buộc 100% qua Human Promotion Gate.

---

## 4. Ngưỡng Kích Hoạt Đánh Giá (Heuristic Review Trigger)

Ngưỡng 2 projects hoặc 3 contexts chỉ là một **heuristic để kích hoạt quy trình xem xét (READY_FOR_PROMOTION_REVIEW)**, tuyệt đối KHÔNG PHẢI là luật tự động thăng hạng.
