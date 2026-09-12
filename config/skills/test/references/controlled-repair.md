# Controlled Repair Protocol (Quy Trình Sửa Chữa Có Kiểm Soát)

Quy trình sửa chữa có kiểm soát trong `$test` được vận hành dưới sự giám sát nghiêm ngặt của Quản Trị Hệ Thống (Governance Invariants).

## 1. Điều Kiện Kích Hoạt (Entry Gate)

* **Bắt buộc phải có Lệnh Cho Phép Rõ Ràng Từ Con Người**:
  Chỉ bắt đầu sửa chữa khi có lệnh tường minh từ Anh (`AUTHORIZE_CONTROLLED_REPAIR` hoặc chỉ thị trực tiếp tương đương).
* **Nghiêm Cấm Tự Động Kích Hoạt (`AUTO_FIX = FALSE`)**:
  Sau khi phát hiện lỗi (`TEST_FAIL`), auditor chỉ xuất báo cáo finding và dừng lại.

## 2. Phân Tách Vai Trò Người Kiểm Thử & Người Sửa Lỗi (Role Decoupling)

```text
Tester (Auditor) != Repair Owner (Fixer)
```

* **Kiểm thử viên (Auditor)**: Giữ trạng thái read-only, bảo lưu khách quan, tuyệt đối không tham gia sửa code (`source_write_access: false`).
* **Người sửa lỗi (Repair Owner)**: Là Developer được phân công độc lập để tiếp nhận finding, áp dụng diff tối thiểu, chạy self-verification và đóng băng Release Candidate mới (`RC_n+1`).
* **Quy tắc Thẩm định lại (Fresh Re-Audit Protocol)**:
  - **Ưu tiên cao nhất (Preferred)**: Phân công một Fresh Independent Auditor hoàn toàn mới.
  - **Dự phòng được phép (Allowed Fallback)**: Có thể dùng lại Auditor ban đầu NHƯNG với điều kiện tiên quyết:
    1. Auditor KHÔNG tham gia bất kỳ dòng code sửa đổi nào (`Auditor was NOT the repair owner`).
    2. Phiên thẩm tra lại bắt đầu từ ngữ cảnh hoàn toàn độc lập (`fresh audit context`).
    3. Bản RC mới (`RC_n+1`) được coi là chưa được tin tưởng (`untrusted baseline`), lập kế hoạch kiểm tra mới (`new audit plan`).
  - **NGHIÊM CẤM TUYỆT ĐỐI**: Tester tự sửa code $\to$ tester tự chạy lại 1 test duy nhất $\to$ tester tự phê duyệt (`tester self-approves`).

## 3. Quy Trình Sửa Chữa 5 Bước

```text
[TEST_FAIL]
    │
    ▼
[HUMAN_AUTHORIZATION?] ──(Chưa có)──> [STOP & WAIT]
    │ (Đã duyệt)
    ▼
[SEPARATE_REPAIR_OWNER] ──(Tập trung vào vi mô defect, scope hẹp, RC_n+1)
    │
    ▼
[REPAIR_ATTEMPT] (Áp dụng diff nhỏ nhất, chạy self-verification)
    │
    ▼
[NEW_RELEASE_CANDIDATE] (Đóng băng candidate mới: RC_n+1)
    │
    ▼
[FRESH_INDEPENDENT_RE_AUDIT] (Auditor kiểm thử lại từ đầu trên fresh context)
```

## 4. Ngân Sách Vòng Lặp Sửa Chữa (Repair Budget)

* **Giới hạn tối đa**: `MAX_CONTROLLED_REPAIR_ROUNDS = 2`.
* **Ngắt mạch triệt để**:
  - Nếu sau 2 vòng sửa chữa mà kiểm thử độc lập vẫn thất bại $\to$ **Dừng sửa chữa ngay lập tức**.
  - Phân loại bản chất thất bại (`ARCHITECTURE_DEFECT`, `SPEC_DEFECT`, `ENVIRONMENT_DEFECT`).
  - Báo cáo ngắt mạch lên Anh (Product Owner) để xem xét lại kế hoạch hoặc kiến trúc.
  - Tuyệt đối nghiêm cấm vòng sửa chữa thứ 3 (`No Repair Round #3`).
