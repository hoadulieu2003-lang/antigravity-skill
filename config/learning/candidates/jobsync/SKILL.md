---
name: jobsync
description: >-
  Kỹ năng chuyên gia vận hành cho Gsync/jobsync (1284 ⭐).
  Tự động kích hoạt khi người dùng muốn:
    - Tự động hóa hoặc tích hợp công cụ mã nguồn mở jobsync vào hệ thống
    - Giải quyết các tác vụ kỹ thuật chuyên sâu liên quan đến Job application tracker and AI-powered job search assistant
    - Thiết lập cấu hình và vận hành lệnh CLI của Gsync/jobsync
  KHÔNG CẦN người dùng phải nhớ tên kỹ thuật 'jobsync'.
---

# Gsync/jobsync — Cẩm Nang Kỹ Năng Vận Hành Chuyên Sâu

> **Nguồn gốc**: GitHub Repository `https://github.com/Gsync/jobsync`  
> **Độ uy tín cộng đồng**: 1284 ⭐  
> **Trạng thái Quản trị**: `CANDIDATE` (Tuân thủ FRAMEWORK_V2_CAPABILITY_AND_LEARNING_REGISTRY)  
> **Tự động đóng gói lúc**: 2026-09-20 22:42:07Z

---

## 1. Bản Chất Kiến Trúc & Giá Trị Cốt Lõi (Architectural Essence)

* **Mục tiêu cốt lõi**: Job application tracker and AI-powered job search assistant. Helps job seekers manage their search journey with AI resume review, job matching, task logging,...
* **Lĩnh vực áp dụng**: Tự động hóa lập trình, Tác tử AI (AI Agents), và Tối ưu hóa quy trình kỹ thuật.
* **Các tính năng nổi bật được trích xuất**:
- **Application Tracker:** Keep a detailed record of all your job applications, including company details, job titles, application dates, and current status.
- **Task & Activity Management:** Manage tasks, track activities linked with tasks including time tracking.
- **Question Bank:** Build a library of interview questions with your answers, tagged by skill, so your preparation is in one place when the next interview comes up.
- **Resume review** — a full review of any of your resumes, with scores and written feedback, saved to the resume so you can come back to it.
- **Ashby** — same company-tracking workflow, backed by a built-in directory of 1,860+ companies (or paste a board URL). No API key required.

---

## 2. Thông Số Kỹ Thuật & Cú Pháp Lệnh (Specifications & Contracts)

Dưới đây là các cấu trúc lệnh và cấu hình thực thi tiêu chuẩn được trích xuất từ tài liệu chính thức:

```bash
git clone https://github.com/Gsync/jobsync.git
cd jobsync
docker compose up

curl -fsSL https://raw.githubusercontent.com/Gsync/jobsync/main/deploy.sh | sudo bash -s
```

---

## 3. Quy Trình Vận Hành Chuẩn Mực (Step-by-Step Runbook)

1. **Khảo sát Môi trường**: Kiểm tra runtime tương thích (Python / Node.js / Docker) trên máy trạm Windows.
2. **Cài đặt & Cấu hình**: Nạp biến môi trường và thiết lập tham số an toàn trong ranh giới Sandbox.
3. **Thực thi & Tự Kiểm chứng**: Chạy thử nghiệm lệnh với phạm vi nhỏ nhất (`FAST Mode`) trước khi tích hợp vào luồng chính.
4. **Bàn giao Bằng chứng**: Xuất bằng chứng kiểm chứng (`Evidence Ledger`) xác nhận kết quả trước khi kết thúc tác vụ.

---

## 4. Các Bẫy Lỗi & Ràng Buộc An Toàn (Pitfalls & Guardrails)

* **Ràng buộc Mạng & Token**: Tuân thủ nghiêm ngặt hạn mức API và cơ chế timeout an toàn.
* **Bảo vệ Secret**: Tuyệt đối không lưu trữ khóa API hoặc token riêng tư dưới dạng văn bản thô.
* **Bảo vệ Không Gian Làm Việc**: Không tự ý ghi đè hoặc thay đổi các file cấu hình hệ sinh thái cốt lõi ngoài phạm vi.