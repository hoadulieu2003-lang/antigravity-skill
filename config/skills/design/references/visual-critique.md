# Visual Critic & Render Evidence Protocol

Quy chuẩn thẩm định thị giác độc lập (Visual Critic) bằng hình ảnh kết xuất thực tế.

---

## 1. Nguyên tắc Bất biến
1. **Không Tự Khen bằng Tính từ Rỗng tuếch**: Nghiêm cấm nhận xét vô căn cứ như "Looks modern", "Very premium", "Great hierarchy".
2. **Thẩm định trên Bằng chứng Thực tế (Render Evidence)**: Bắt buộc chụp ảnh màn hình thời gian thực qua CDP / Browser.
3. **Đối chiếu Trực tiếp với Design Contract**: Từng tiêu chí trong `visual_acceptance` phải được đánh giá PASS/FAIL dựa trên hình ảnh thực tế.
4. **Đánh giá Rủi ro AI Đại trà (Generic-AI Risk)**: Chấm điểm từ 0-10 về nguy cơ bị rơi vào lối mòn thiết kế (card grid, bento box, purple gradient).

## 2. Visual Loop Budget
* `MAX_DESIGN_POLISH_CYCLES = 2`.
* Nếu sau 2 lần tinh chỉnh mà output vẫn không đạt chuẩn:
  - DỪNG SỬA CSS / HIỆU ỨNG.
  - Phân loại lỗi:
    * `IMPLEMENTATION_DEFECT` -> Đổi phương án code.
    * `DESIGN_DIRECTION_DEFECT` -> Trả về Design Director để tái cấu trúc lại bố cục gốc.
