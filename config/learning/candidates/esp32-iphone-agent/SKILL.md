---
name: esp32-iphone-agent
description: >-
  Kỹ năng chuyên gia vận hành cho onehumanbeing/esp32-iphone-agent (4033 ⭐).
  Tự động kích hoạt khi người dùng muốn:
    - Tự động hóa hoặc tích hợp công cụ mã nguồn mở esp32-iphone-agent vào hệ thống
    - Giải quyết các tác vụ kỹ thuật chuyên sâu liên quan đến Let an AI model use a real iPhone with a $7 ESP32: AirPlay eyes, USB HID hands, any OpenAI-compatible vision model
    - Thiết lập cấu hình và vận hành lệnh CLI của onehumanbeing/esp32-iphone-agent
  KHÔNG CẦN người dùng phải nhớ tên kỹ thuật 'esp32-iphone-agent'.
---

# onehumanbeing/esp32-iphone-agent — Cẩm Nang Kỹ Năng Vận Hành Chuyên Sâu

> **Nguồn gốc**: GitHub Repository `https://github.com/onehumanbeing/esp32-iphone-agent`  
> **Độ uy tín cộng đồng**: 4033 ⭐  
> **Trạng thái Quản trị**: `CANDIDATE` (Tuân thủ FRAMEWORK_V2_CAPABILITY_AND_LEARNING_REGISTRY)  
> **Tự động đóng gói lúc**: 2026-10-28 07:42:10Z

---

## 1. Bản Chất Kiến Trúc & Giá Trị Cốt Lõi (Architectural Essence)

* **Mục tiêu cốt lõi**: Let an AI model use a real iPhone with a $7 ESP32: AirPlay eyes, USB HID hands, any OpenAI-compatible vision model. No Mac, no developer account, no jailbreak.
* **Lĩnh vực áp dụng**: Tự động hóa lập trình, Tác tử AI (AI Agents), và Tối ưu hóa quy trình kỹ thuật.
* **Các tính năng nổi bật được trích xuất**:
- **Eyes — AirPlay to the board.** The board opens its own Wi-Fi hotspot and appears in the phone's Screen Mirroring
- **Hands — USB HID.** The board is a standard USB mouse and keyboard. With AssistiveTouch on, the mouse moves an
- **Brain — the app.** The app decodes the stream, sends screenshots to any OpenAI-compatible vision model, and runs
- **Closing the loop.** The pointer is relative, so the app tracks it and re-homes it in a corner; before precise taps
- **Review.** Every run is kept on the phone: replay it step by step with the taps and swipes drawn on top.
- **AirPlay source must be an iPhone.** Screen Mirroring from macOS is not supported: the handshake can look healthy

---

## 2. Thông Số Kỹ Thuật & Cú Pháp Lệnh (Specifications & Contracts)

Dưới đây là các cấu trúc lệnh và cấu hình thực thi tiêu chuẩn được trích xuất từ tài liệu chính thức:

```bash
arduino-cli lib install "NimBLE-Arduino@2.5.1"
hardware/flash.sh            # optional: [serial port] [--debug]

cp ios/Config/Local.xcconfig.example ios/Config/Local.xcconfig   # set DEVELOPMENT_TEAM and IA_BUNDLE_ID
open ios/IPhoneAgent.xcodeproj                                    # run the IPhoneAgent scheme on your iPhone
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