---
name: Gemini Super-Engine Architect
description: Cẩm nang vận hành toàn diện Siêu Động Cơ Google (Gemini Super-Engine), kích hoạt 7 siêu năng lực của Google DeepMind trên Antigravity 2.0 gồm Search Grounding, Video Forensics, Cloud Python Sandbox, Imagen 3 Studio, Context Caching, Model Fine-Tuning và Workspace MCP.
---

# GEMINI SUPER-ENGINE — ENTERPRISE SPECIFICATION

Hệ thống **Gemini Super-Engine** là bộ mở rộng siêu năng lực toàn diện cho Antigravity 2.0, kết nối trực tiếp với Google DeepMind & Google AI Studio thông qua khóa API chính thức của Anh.

---

## 🗺️ 1. BẢN ĐỒ CÁC PHÂN HỆ VẬN HÀNH (CORE SUB-ENGINES)

| Phân Hệ | File Thực Thi | Mô Hình / Dịch Vụ | Chức Năng Cốt Lõi |
| :--- | :--- | :--- | :--- |
| **🌐 Search Grounding** | [`google_search_grounding.py`](file:///C:/Users/game/.gemini/config/skills/gemini-super-engine/scripts/google_search_grounding.py) | `gemini-2.5-flash` | Tra cứu dữ liệu thời gian thực trên Google Search, đính kèm link bài báo kiểm chứng. |
| **💻 Cloud Python Sandbox** | [`cloud_code_executor.py`](file:///C:/Users/game/.gemini/config/skills/gemini-super-engine/scripts/cloud_code_executor.py) | `gemini-2.5-flash` (`code_execution`) | Chạy code Python trực tiếp trên Cloud Google, tính toán số liệu và thuật toán chuẩn 100%. |
| **🎨 Imagen 3 Studio** | [`imagen_studio_engine.py`](file:///C:/Users/game/.gemini/config/skills/gemini-super-engine/scripts/imagen_studio_engine.py) | `imagen-3.0-generate-002` | Sinh ảnh quang học độ phân giải cao, vẽ chữ in sắc nét (`Text-in-Image`) cho thương hiệu. |
| **👁️ Video Forensics** | [`native_video_forensics.py`](file:///C:/Users/game/.gemini/config/skills/gemini-super-engine/scripts/native_video_forensics.py) | `gemini-2.5-flash` + Google Files API | Tải video MP4 lên Google, phân tích góc quay, ánh sáng, kịch bản đến từng timestamp. |
| **🧠 Context Caching** | `context_caching_engine.py` *(Giai đoạn 2)* | `gemini-2.5-flash` / `pro` | Lưu đệm ngữ cảnh 1 triệu token vào RAM đám mây của Google, giảm 80% chi phí. |
| **🎓 Fine-Tuning Pipeline** | `model_fine_tuning.py` *(Giai đoạn 2)* | `gemini-2.5-flash` | Tự động huấn luyện mô hình AI mang giọng điệu riêng biệt của Anh (`ANH ATELIER`). |
| **💼 Workspace Automation** | `google-workspace` MCP *(Giai đoạn 3)* | Gmail, Sheets, Drive, Calendar | Tự động hóa công việc văn phòng, đồng bộ dữ liệu và báo cáo qua Google Workspace. |

---

## ⚡ 2. NGUYÊN TẮC BẢO MẬT & TÀI NGUYÊN (INVARIANTS)

1. **Bảo Mật Khóa API Tuyệt Đối**:
   * Khóa API được lưu an toàn tại `C:\Users\game\.gemini\config\sidecars\anti_live_voice\.env.local`.
   * Mọi script tự động nạp từ file này hoặc biến môi trường `GEMINI_API_KEY`.
2. **Hạn Mức Miễn Phí Tối Ưu**:
   * Tận dụng tối đa 1.500 requests/ngày của gói Google AI Studio Free Tier.
   * Cơ chế tự động fallback và retry có kiểm soát nếu chạm hạn mức nhịp (Rate Limit).
3. **Đồng Bộ Dòng Thời Gian Điện Ảnh**:
   * Hình ảnh từ Imagen 3 và phân tích video từ Video Forensics được liên kết trực tiếp với dòng sản xuất `Script Factory Pro`.
