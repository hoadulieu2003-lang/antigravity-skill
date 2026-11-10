---
name: opendroid
description: >-
  Kỹ năng chuyên gia vận hành cho JMAN730/opendroid (1270 ⭐).
  Tự động kích hoạt khi người dùng muốn:
    - Tự động hóa hoặc tích hợp công cụ mã nguồn mở opendroid vào hệ thống
    - Giải quyết các tác vụ kỹ thuật chuyên sâu liên quan đến Your Open Autonomous Android Agent — A production-ready, self-planning AI assistant powered by local/remote LLMs and accessibility-driven screen automation
    - Thiết lập cấu hình và vận hành lệnh CLI của JMAN730/opendroid
  KHÔNG CẦN người dùng phải nhớ tên kỹ thuật 'opendroid'.
---

# JMAN730/opendroid — Cẩm Nang Kỹ Năng Vận Hành Chuyên Sâu

> **Nguồn gốc**: GitHub Repository `https://github.com/JMAN730/opendroid`  
> **Độ uy tín cộng đồng**: 1270 ⭐  
> **Trạng thái Quản trị**: `CANDIDATE` (Tuân thủ FRAMEWORK_V2_CAPABILITY_AND_LEARNING_REGISTRY)  
> **Tự động đóng gói lúc**: 2026-11-10 19:42:10Z

---

## 1. Bản Chất Kiến Trúc & Giá Trị Cốt Lõi (Architectural Essence)

* **Mục tiêu cốt lõi**: Your Open Autonomous Android Agent — A production-ready, self-planning AI assistant powered by local/remote LLMs and accessibility-driven screen automation.
* **Lĩnh vực áp dụng**: Tự động hóa lập trình, Tác tử AI (AI Agents), và Tối ưu hóa quy trình kỹ thuật.
* **Các tính năng nổi bật được trích xuất**:
- **Offline wake word** detection — say *"OpenDroid"* to activate
- **Speech-to-text** for hands-free commands
- **Text-to-speech** with ElevenLabs premium voice support
- **JDK 21** — not newer. The project compiles against Java 21 (`jvmToolchain(21)`). `gradle/gradle-daemon-jvm.properties`
- **Android SDK 35** (Android 15)
- **Gemini** (free tier available)

---

## 2. Thông Số Kỹ Thuật & Cú Pháp Lệnh (Specifications & Contracts)

Dưới đây là các cấu trúc lệnh và cấu hình thực thi tiêu chuẩn được trích xuất từ tài liệu chính thức:

```bash
# Clone the repository
git clone https://github.com/JMAN730/opendroid.git
cd opendroid

# Build debug APK
./gradlew assembleDebug

# APK output location
# → app/build/outputs/apk/debug/app-debug.apk
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