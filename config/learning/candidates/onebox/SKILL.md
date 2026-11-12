---
name: onebox
description: >-
  Kỹ năng chuyên gia vận hành cho wangzhishou/OneBox (1164 ⭐).
  Tự động kích hoạt khi người dùng muốn:
    - Tự động hóa hoặc tích hợp công cụ mã nguồn mở onebox vào hệ thống
    - Giải quyết các tác vụ kỹ thuật chuyên sâu liên quan đến A free AI agent & toolbox for Android | 一站式安卓 AI 智能体 & 工具箱
    - Thiết lập cấu hình và vận hành lệnh CLI của wangzhishou/OneBox
  KHÔNG CẦN người dùng phải nhớ tên kỹ thuật 'onebox'.
---

# wangzhishou/OneBox — Cẩm Nang Kỹ Năng Vận Hành Chuyên Sâu

> **Nguồn gốc**: GitHub Repository `https://github.com/wangzhishou/OneBox`  
> **Độ uy tín cộng đồng**: 1164 ⭐  
> **Trạng thái Quản trị**: `CANDIDATE` (Tuân thủ FRAMEWORK_V2_CAPABILITY_AND_LEARNING_REGISTRY)  
> **Tự động đóng gói lúc**: 2026-11-12 04:42:09Z

---

## 1. Bản Chất Kiến Trúc & Giá Trị Cốt Lõi (Architectural Essence)

* **Mục tiêu cốt lõi**: A free AI agent & toolbox for Android | 一站式安卓 AI 智能体 & 工具箱
* **Lĩnh vực áp dụng**: Tự động hóa lập trình, Tác tử AI (AI Agents), và Tối ưu hóa quy trình kỹ thuật.
* **Các tính năng nổi bật được trích xuất**:
- **International**: [Google Play](https://play.google.com/store/apps/details?id=com.shifenmiao.app) · [Official site](https://www.oneboxable.com)
- **中国**: [万宝盒官网](https://www.wanbaohe.com) · 小米 / 应用宝 / OPPO / vivo / 华为应用商店搜索「万宝盒」
- **One chat, many models**: talk to multiple mainstream LLMs from a single entry, with custom AI engines and prompt management.
- **Transparent by source**: every line is public — how data is processed locally and what never leaves the device is something you can verify, not a promise you have to trust.
- **UI**: Jetpack Compose, Material 3
- **Navigation / components**: Decompose (`StackNavigation`, `childStack`, retained components)

---

## 2. Thông Số Kỹ Thuật & Cú Pháp Lệnh (Specifications & Contracts)

Dưới đây là các cấu trúc lệnh và cấu hình thực thi tiêu chuẩn được trích xuất từ tài liệu chính thức:

```bash
git clone --depth=1 https://github.com/wangzhishou/OneBox.git

export GITCODE_TOKEN=xxx          # https://gitcode.com/setting/token-classic
git push gitcode --tags           # the tag must exist: it is used as target_commitish
./scripts/publish_gitcode_release.py --tag 1.4.0 --dir release --abi arm64
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