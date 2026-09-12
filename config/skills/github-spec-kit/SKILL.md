---
name: github-spec-kit
description: Kích hoạt quy trình Spec-Driven Development (SDD) từ GitHub Spec Kit (specify CLI), tự động quy đổi ý tưởng mơ hồ thành spec.md, plan.md, tasks.md.
---

# GitHub Spec Kit Skill

Sử dụng skill này khi người dùng yêu cầu lập đặc tả (spec), thiết kế kiến trúc (plan), phân chia công việc (tasks) hoặc thực thi quy trình Spec-Driven Development (SDD).

## Các Lệnh Chạy Cốt Lõi:
1. `specify init . --integration gemini --force --ignore-agent-tools`: Khởi tạo cấu hình Spec Kit cho dự án.
2. `specify constitution`: Thiết lập quy chuẩn & hiến pháp dự án.
3. `/speckit.specify`: Tạo bản đặc tả yêu cầu `spec.md`.
4. `/speckit.plan`: Lập bản thiết kế kiến trúc `plan.md`.
5. `/speckit.tasks`: Tự động chia nhỏ công việc thành `tasks.md`.
6. `/speckit.implement`: Kích hoạt Aider MCP Engine để gõ code từng task + Auto Commit + Auto Test.
