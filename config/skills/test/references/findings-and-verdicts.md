# Findings Model & Independent Test Verdicts

## 1. Findings Model (Mô Hình Phát Hiện Lỗi)

Mọi sai lệch so với khế ước hoặc thất bại kiểm thử đều phải được đóng gói thành một thực thể `finding` có cấu trúc:

* **id**: Mã định danh duy nhất (ví dụ: `FIND-001`).
* **severity**: `BLOCKER` | `CRITICAL` | `MAJOR` | `MINOR` | `INFO`.
* **status**: `OPEN` (mặc định), `TRIAGED`, `RESOLVED`, `ACCEPTED_RISK`.
* **reproduction**: Các bước tái hiện khách quan, kèm log/lệnh thực tế.
* **defect_type (Cái gì bị hỏng / What failed)**:
  - `CONTRACT_VIOLATION`: Sai lệch hợp đồng giao diện hoặc API.
  - `REGRESSION`: Hỏng chức năng cũ từng hoạt động tốt.
  - `RUNTIME_CRASH`: Ngoại lệ không được xử lý hoặc sập tiến trình.
  - `VISUAL_DEFECT`: Lệch chuẩn mỹ thuật thị giác, vỡ layout, rớt WCAG AA.
  - `SECURITY_DATA_RISK`: Rủi ro bảo mật hoặc tác động dữ liệu ngoài ý muốn.
  - `UNMET_CRITERIA`: Tiêu chí nghiệm thu cốt lõi chưa đạt.
* **likely_failure_class (Thuộc tầng nào / Canonical Escalation Owner)**:
  - `IMPLEMENTATION_DEFECT`: Lỗi logic code vi mô của developer.
  - `SPEC_DEFECT`: Đặc tả mâu thuẫn hoặc thiếu sót.
  - `ARCHITECTURE_DEFECT`: Sai lầm trong thiết kế kiến trúc hoặc ranh giới phân tách.
  - `ENVIRONMENT_DEFECT`: Lỗi hạ tầng, thiếu công cụ, node version sai.
  - `EXTERNAL_DEPENDENCY`: Lỗi từ API bên thứ 3, mạng hoặc dịch vụ ngoài.
  - `DESIGN_DIRECTION_DEFECT`: Lỗi định hướng mỹ thuật thị giác không đạt chuẩn.
* **recommended_owner**: `developer` | `architect` | `product_owner` | `design_director`.

**Bất Biến Quan Trọng Về Ghi Chép & Quyền Hạn**:
* `source_write_access: false`: Tester tuyệt đối không sửa mã nguồn dự án (`src/`, `lib/`, config).
* `audit_artifact_write_access: true`: Tester được phép ghi artifacts phục vụ thẩm định (`.test-audit/`, `artifacts/test/`, `scratch/`).
* `auto_fix: false`: Tester tuyệt đối cấm tự ý vá code (`AUTO_FIX = FALSE`).

---

## 2. Independent Test Verdicts (4 Phán Quyết Nghiệm Thu Độc Lập)

Kiểm thử viên độc lập chỉ được phép ban hành đúng 1 trong 4 phán quyết sau:

1. **`TEST_PASS`**:
   - Toàn bộ các kiểm tra thẩm định **bắt buộc và đã được lựa chọn** (`REQUIRED & SELECTED`) đều vượt qua.
   - Mọi bậc thang kiểm chứng (`ladder rungs`) bị lược bỏ đều có lý do chính đáng và được ghi nhận tường minh.
   - Không còn bất kỳ finding nào thuộc mức `BLOCKER`, `CRITICAL`, hay `MAJOR`.
2. **`TEST_PASS_WITH_FINDINGS`**:
   - Toàn bộ điều kiện nghiệm thu chính đã độc lập đạt.
   - Các finding còn lại chỉ ở mức `MINOR` hoặc `INFO` (ghi chú giao diện, gợi ý tối ưu trong tương lai).
   - Rủi ro tồn đọng (`residual_risk`) được ghi nhận tường minh.
3. **`TEST_FAIL`**:
   - Bất kỳ điều kiện nghiệm thu bắt buộc nào bị bác bỏ hoặc thất bại.
   - Vi phạm hợp đồng thiết kế (`DESIGN_CONTRACT`) hoặc hợp đồng kỹ thuật (`API_CONTRACT`).
   - Xuất hiện lỗi mức `BLOCKER` hoặc `CRITICAL`.
   - **Hành động tiếp theo**: Dừng lại (`STOP`), báo cáo findings, không tự ý sửa chữa.
4. **`TEST_BLOCKED`**:
   - Môi trường thử nghiệm không khả dụng, thiếu secret/quyền hạn.
   - Bản Release Candidate không được đóng băng rõ ràng (`ambiguous baseline`).
   - Không thể thu thập bằng chứng an toàn.
   - **Bất biến**: Tuyệt đối không bao giờ chuyển `TEST_BLOCKED` thành `TEST_PASS`.

---

## 3. Tách Biệt Tuyệt Đối: Quyền Thẩm Định vs Quyền Nghiệm Thu Phát Hành (Release Authority Separation)

> **BẤT BIẾN CỐT LÕI**: Quyền Thẩm định (`Verification Authority`) và Quyền Phát hành (`Release Authority`) tách biệt tuyệt đối.

`$test` chỉ thực thi thẩm tra độc lập, **TUYỆT ĐỐI KHÔNG TỰ ĐỘNG PHÊ DUYỆT PHÁT HÀNH (`RELEASE_ACCEPTED`)**:
* `TEST_PASS` $\to$ `VERIFIED_RC` $\to$ `AWAITING_HUMAN_ACCEPTANCE`
* `TEST_PASS_WITH_FINDINGS` $\to$ `VERIFIED_RC_WITH_RESIDUAL_RISK` $\to$ `AWAITING_HUMAN_ACCEPTANCE`

Chỉ khi Anh (Product Owner) đưa ra quyết định chấp thuận tường minh (`HUMAN_RELEASE_ACCEPTANCE`), hệ thống mới chuyển trạng thái sang **`RELEASE_ACCEPTED`**. Mọi phán quyết khác sẽ giữ trạng thái `HOLD` hoặc `REPLAN`.
