DESIGN_TRAINING_006_DIRECTIVE

Module 06: Design Critique — phản biện thiết kế dựa trên bằng chứng

STATUS: AUTHORIZED / SPEC_LOCKED

Điều kiện đầu vào: Module 01–05 đã hoàn thành

Executor: Antigravity

Reviewer: ChatGPT Controller

Product Owner / Taste Authority: Anh — Lead Architect

Mã nộp: DESIGN_TRAINING_006_SUBMISSION_R01

Ngân sách sửa: tối đa 2 vòng sau lần nộp đầu

1. Quyết định chuyển tiếp

Tiếp tục Module 06. Mục tiêu là nâng khả năng đánh giá và ra quyết định: biết lúc nào cần sửa, lúc nào giữ nguyên, và bằng chứng nào đủ để kết luận.

Các phán quyết PASS của Module 01–05 vẫn có hiệu lực. Bài này đánh giá năng lực phản biện và thử một cải tiến có giới hạn trên bản sao, không mở lại nghiệm thu cũ. Không cần thêm motion, 3D hoặc thư viện thiết kế.

2. Đầu vào và phạm vi

Dùng bản TRACE đã được nghiệm thu ở Module 05:

Gói gốc: design_training_005_submission_r02.zip.

SHA-256: 12302f8c948dd48126cb756f20c4e64639642eba8394a0501006c6034c850bf1.

Phán quyết: DESIGN_TRAINING_005_FINAL_REVIEW_002.md.

Hướng B: ACCEPTED_FOR_EXERCISE.

Giữ nguyên gói và mã gốc. Tạo một bản sao để thử nghiệm trong Module 06. Nếu đã cập nhật trạng thái contract sau PASS, ghi rõ phiên bản đó và mối liên hệ với gói gốc; không tự nhận hash của bản cập nhật bằng hash ZIP ban đầu.

Brief vẫn là giới thiệu dự án giả lập TRACE cho người phụ trách sản phẩm/vận hành doanh nghiệp nhỏ. Giữ toàn bộ nội dung chuẩn, ba tài liệu, người phụ trách và trạng thái của Module 05. Không thêm thành tích, khách hàng, tính năng, form hay dữ liệu thật.

Nếu không truy cập được gói gốc trong môi trường của mình, báo thiếu đúng tệp; không tái tạo theo trí nhớ rồi gọi đó là baseline.

3. Năng lực cần chứng minh

Tách quan sát có thể kiểm tra khỏi suy luận về tác động.

Phân biệt lỗi chức năng/khả năng đọc với đánh đổi thiết kế và sở thích cá nhân.

Ưu tiên cải tiến theo nhiệm vụ người xem, thay vì sửa thứ dễ thấy hoặc dễ làm nhất.

So sánh trước/sau bằng cùng điều kiện, ghi nhận cả phần được và mất.

Biết giữ nguyên hoặc quay về bản cũ khi phương án thử không tốt hơn.

Không có yêu cầu bắt buộc tìm ra lỗi mới trong bản đã đạt. Không đánh giá chất lượng critique bằng số lượng finding hoặc số dòng code sửa.

4. Vòng quan sát ban đầu — tối đa sáu nhận xét

Xem baseline ở desktop 1440×900 và mobile 390×844, gồm phần đầu trang và nội dung khi cuộn. Lập tối đa sáu nhận xét, không cần cố đủ sáu.

Mỗi nhận xét dùng schema sau:

id: C01
location: "Phần/element và ảnh liên quan"
observation: "Điều nhìn thấy hoặc hành vi đã quan sát"
interpretation: "Tác động dự kiến, nếu có"
classification: defect_or_tradeoff_or_preference_or_strength
user_task: "Nhiệm vụ cụ thể bị ảnh hưởng hoặc được hỗ trợ"
evidence:
  kind: visual_or_runtime_or_code_or_user_study
  reference: "Tệp ảnh, log hoặc vị trí mã"
confidence: high_or_medium_or_low
recommendation: fix_or_experiment_or_keep_or_defer
reason: "Vì sao hành động này phù hợp"

Dùng bốn loại rõ nghĩa:

Loại	Ý nghĩa	Cách xử lý
defect	Hành vi hoặc nội dung trái brief/contract, lỗi hiển thị hay khả năng dùng có bằng chứng	Mô tả điều kiện tái hiện và tác động cụ thể
tradeoff	Một quyết định đem lại lợi ích nhưng có cái giá trong bối cảnh	So sánh được/mất; không tự gán là lỗi
preference	Sở thích thị giác chưa có căn cứ nhiệm vụ đủ mạnh	Ghi rõ là sở thích; không dùng làm điểm chặn
strength	Quyết định hiện tại hỗ trợ nhiệm vụ rõ ràng	Giải thích điều cần giữ khi thử cải tiến

Phải có ít nhất một nhận xét strength và một quyết định keep hoặc defer có lý do. Các loại còn lại chỉ dùng khi có căn cứ; không bịa defect để làm đủ bài.

Ví dụ cách suy luận: “Nhãn phụ lặp lại ở hai vị trí” là quan sát. “Người xem chắc chắn thấy rối” là kết luận chưa có bằng chứng người dùng. Có thể viết “giả thuyết: lặp nhãn tăng cạnh tranh với tiêu đề” và đề xuất thử nghiệm nhỏ, hoặc quyết định giữ nếu lợi ích ngữ cảnh lớn hơn.

5. Chọn một thử nghiệm, tối đa hai thay đổi

Từ các nhận xét, chọn một mục tiêu cải tiến duy nhất và tối đa hai thay đổi có liên quan. Viết trước khi sửa:

Giả thuyết: thay đổi nào có thể hỗ trợ nhiệm vụ nào?

Bằng chứng ban đầu: điều gì khiến thử nghiệm đáng làm?

Điều phải giữ: nội dung, dữ liệu, bản sắc hoặc hành vi nào không được suy giảm?

Cách so sánh: nhìn/đo điều gì trước và sau?

Điều kiện dừng: kết quả nào khiến giữ baseline hoặc hủy thử nghiệm?

Có thể thử phân cấp nhãn, nhịp khoảng cách, bố cục một section, cách diễn đạt ba đoạn quyết định thiết kế hoặc quan hệ giữa minh họa và nội dung. Các nội dung chuẩn đã khóa không được sửa. Không cần làm lại cả trang.

Mỗi thay đổi phải được mô tả theo kết quả người dùng nhìn thấy, không chia một thay đổi thành nhiều tên kỹ thuật để vượt giới hạn. Không thêm màu hoặc font mới trừ khi đó là chính giả thuyết được giải thích và vẫn giữ giới hạn hai họ font.

Bản thử nghiệm giữ chế độ không chuyển động. Kế thừa các điều kiện responsive, CTA và dữ liệu đã có.

6. So sánh và quyết định

Chụp baseline và candidate trong cùng viewport, DPR, mức zoom, trạng thái font và vị trí cuộn tương ứng. Dùng cùng nội dung để tránh việc ít chữ hơn tự động trông thoáng hơn.

Lập bảng:

Câu hỏi	Baseline	Candidate	Kết luận và bằng chứng
Nhiệm vụ mục tiêu được hỗ trợ thế nào?	Quan sát	Quan sát	Tốt hơn / ngang / kém hơn / chưa biết
Điểm mạnh đã xác định có được giữ?	Quan sát	Quan sát	Có / không / chưa biết
Desktop và mobile cùng được xét chưa?	Quan sát	Quan sát	Nêu khác biệt
Cái giá mới phát sinh là gì?	Quan sát	Quan sát	Đánh đổi cụ thể

Chọn một trong ba quyết định:

ADOPT: dùng candidate cho bản thử nghiệm Module 06 vì lợi ích có căn cứ vượt cái giá.

KEEP_BASELINE: candidate không tốt hơn hoặc làm mất điểm mạnh quan trọng.

INCONCLUSIVE: bằng chứng chưa đủ để quyết định; giữ baseline làm mặc định và nêu đúng câu hỏi còn thiếu.

Cả ba quyết định đều có thể đạt Module 06. Không bắt buộc thay đổi phải được áp dụng. Không ghi “người dùng thích hơn” hoặc phần trăm cải thiện nếu không có nghiên cứu tương ứng.

Nếu lựa chọn mang bản chất gu, ghi rõ đề xuất để Anh quyết định thay vì giả làm kết luận khách quan. Không cần dừng bài giữa chừng để xin duyệt gu.

7. Kiểm chứng vừa đủ — Q01–Q07
Ca	Yêu cầu	Cách đánh giá
Q01	Baseline đúng nguồn và không bị chỉnh sửa	Hash ZIP gốc; đối chiếu tệp dùng làm baseline với gói đó
Q02	Nhận xét phân loại đúng, có vị trí và bằng chứng	Controller đọc bảng critique; không tự động PASS bằng script
Q03	Một giả thuyết, tối đa hai thay đổi	Đối chiếu kế hoạch thử và diff; ghi mọi thay đổi thực sự
Q04	So sánh trước/sau công bằng	Ảnh cùng điều kiện; ghi viewport, DPR, font và phần trang
Q05	Không làm hỏng điều đã đạt	Nội dung/ba dòng dữ liệu còn đúng; hai CTA có đích; bàn phím dùng được; không tràn ngang ở 1440, 768, 390; không chuyển động
Q06	Quyết định có căn cứ và có xét cái giá	ADOPT/KEEP_BASELINE/INCONCLUSIVE khớp bằng chứng, không ép kết luận tốt hơn
Q07	Bài học có phạm vi và ngoại lệ	Ba bài học ngắn dựa trên thử nghiệm, không nâng sở thích thành quy luật chung

Q05 chỉ cần kiểm tra mục tiêu trên bản thử nghiệm và ghi phương thức trung thực. Không yêu cầu xây framework test mới hoặc lặp lại toàn bộ các module trước.

Phân biệt phép đo tự kiểm của Antigravity, review ảnh của Controller và kết quả người dùng thật. Với Q02/Q06, để SELF_REVIEW_PENDING_CONTROLLER trong log, không coi một boolean do Executor điền là xác nhận độc lập.

8. Ba bài học cuối module

Mỗi bài học gồm:

Observation: điều thực sự thấy trong bài.

Rule candidate: nguyên tắc có điều kiện có thể thử lại ở dự án khác.

Applies when: khi nào nên áp dụng.

Exception: khi nào không nên áp dụng hoặc cần xem xét lại.

Evidence: tham chiếu ảnh/log/nhận xét.

Status: EXERCISE_SUPPORTED, chưa tự động thành quy tắc dùng chung cho production.

Ví dụ khung diễn đạt: “Khi A xảy ra trong bối cảnh B, ưu tiên thử C vì D; ngoại lệ E”. Không dùng “luôn”, “tuyệt đối”, “mọi UI” để che việc thiếu bối cảnh.

9. Gói bàn giao

Nộp design_training_006_submission_r01.zip gồm:

baseline/: mã và tài sản của TRACE dùng để so sánh, giữ nguyên từ nguồn đã xác minh.

candidate/: bản thử nghiệm chạy được cùng tài sản cần thiết.

DESIGN_TRAINING_006_REPORT.md: nguồn baseline, tối đa sáu nhận xét, giả thuyết, tối đa hai thay đổi, so sánh, quyết định cuối, ba bài học và giới hạn.

VERIFICATION.json: Q01–Q07, số đo kỹ thuật liên quan và phương thức kiểm chứng.

screenshots/: baseline_desktop_fullpage.png, candidate_desktop_fullpage.png, baseline_mobile_fullpage.png, candidate_mobile_fullpage.png.

Bốn ảnh fullpage là đủ; nếu chi tiết quan trọng khó đọc, thêm tối đa hai ảnh viewport cận phần đó. Chụp từ trình duyệt, không chỉnh ảnh để làm candidate nổi bật hơn.

Không cần đóng lại tất cả ZIP của Module 01–05. Nếu có script đã dùng, kèm script và điều kiện chạy. Đường dẫn trong báo cáo tương đối; ZIP dùng dấu /; không kèm node_modules.

10. Tiêu chí PASS và giới hạn vòng sửa

PASS khi nhận xét có bằng chứng, phân loại hợp lý, thử nghiệm giới hạn đúng phạm vi, so sánh công bằng, không làm sai dữ liệu/hành vi đã khóa và kết luận trung thực với kết quả.

Không chặn nghiệm thu chỉ vì candidate ít mới lạ, số finding ít hoặc quyết định KEEP_BASELINE. Điểm chặn phải là lỗi lập luận có tác động, bằng chứng không khớp, so sánh sai điều kiện hoặc hồi quy cụ thể.

Executor được bắt đầu ngay, không cần xin duyệt giữa các bước. Sau review tối đa hai vòng sửa; nếu vẫn còn điểm chặn, tổng hợp để Anh quyết định. Các phán quyết PASS trước đây không bị thu hồi bởi hoạt động thực hành này.

Module 06 kết thúc chặng sáu module nền tảng đã thống nhất: Composition → Visual Hierarchy → Information Architecture → Interaction Design → Art Direction → Design Critique. Sau khi PASS, Controller sẽ chọn bài áp dụng tổng hợp vào một brief mới để kiểm tra khả năng chuyển kiến thức, trước khi quyết định nâng sâu motion/3D.