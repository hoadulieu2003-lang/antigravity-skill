# 📘 Cẩm Nang Tự Động Hóa Xưởng Video & Xử Lý Đa Phương Tiện (Media Pipeline Playbook)

> **Chủ quản**: Anh — Lead Architect / Product Owner  
> **Hệ thống áp dụng**: Anti AI Pair-Programmer  
> **Hệ sinh thái công nghệ**: `FFmpeg Master Stitcher, Google Flow Veo 3.1 CDP, Video/Audio Synchronization`  
> **Cập nhật lần cuối**: 2026-09-13 16:42:09 UTC

---

## 1. Các Quy Tắc Bất Biến Cốt Lõi (`Core Engineering Invariants`)
- **INV-01**: Sử dụng codec copy (`-c copy`) khi ghép video có cùng thông số bitrate/fps để tăng tốc xuất xưởng tức thì không tốn CPU re-encode.
- **INV-02**: Chuẩn hóa âm thanh LUFS tích hợp (`-af loudnorm=I=-16:TP=-1.5:LRA=11`) cho mọi video đầu ra để đảm bảo âm lượng đồng nhất trên mọi thiết bị.
- **INV-03**: Phân tách luồng render Veo 3.1 qua CDP sang cổng riêng (9223) để không chiếm dụng tab ChatGPT (cổng 9222).

---

## 2. Các Mẫu Lệnh & Code Thực Chiến (`Production Code Patterns`)
### 📌 Lossless Video Concat with Transition
```bash
ffmpeg -f concat -safe 0 -i filelist.txt -c:v libx264 -preset fast -crf 18 -c:a aac -b:a 192k output.mp4
```

### 📌 Silence Stripper & Pacing Tightener
```bash
ffmpeg -i input.wav -af silenceremove=start_periods=1:start_duration=0.1:start_threshold=-50dB output.wav
```



---

## 3. Quy Chuẩn Kiểm Chứng Độc Lập (`Verification Criteria`)
* Mọi giải pháp mã nguồn thuộc lĩnh vực này đều phải chạy kiểm thử cú pháp và đo lường số liệu thực tế trước khi xuất xưởng.
* Luôn tự kiểm toán bẫy lỗi biên (`Edge Cases`) để bảo toàn hiệu năng cao nhất.

---
*Cẩm nang này là tài sản kiến thức độc quyền, được duy trì tự động bởi Topical Research Crawler.*
