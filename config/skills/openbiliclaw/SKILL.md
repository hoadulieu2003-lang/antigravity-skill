---
name: openbiliclaw
description: >-
  Kỹ năng chuyên gia vận hành cho whiteguo233/OpenBiliClaw (3313 ⭐).
  Tự động kích hoạt khi người dùng muốn:
    - Tự động hóa hoặc tích hợp công cụ mã nguồn mở openbiliclaw vào hệ thống
    - Giải quyết các tác vụ kỹ thuật chuyên sâu liên quan đến 本地私有、开源的自进化跨平台 AI 内容发现 Agent：先理解你，再主动从 B站、小红书、抖音、YouTube、X、知乎、Reddit、微博等平台与开放 Web 寻找内容。（支持 deepseek harness 插件） | Local-first open-source cross-platform AI c
    - Thiết lập cấu hình và vận hành lệnh CLI của whiteguo233/OpenBiliClaw
  KHÔNG CẦN người dùng phải nhớ tên kỹ thuật 'openbiliclaw'.
---

# whiteguo233/OpenBiliClaw — Cẩm Nang Kỹ Năng Vận Hành Chuyên Sâu

> **Nguồn gốc**: GitHub Repository `https://github.com/whiteguo233/OpenBiliClaw`  
> **Độ uy tín cộng đồng**: 3313 ⭐  
> **Trạng thái Quản trị**: `CANDIDATE` (Tuân thủ FRAMEWORK_V2_CAPABILITY_AND_LEARNING_REGISTRY)  
> **Tự động đóng gói lúc**: 2026-09-16 16:42:11Z

---

## 1. Bản Chất Kiến Trúc & Giá Trị Cốt Lõi (Architectural Essence)

* **Mục tiêu cốt lõi**: 本地私有、开源的自进化跨平台 AI 内容发现 Agent：先理解你，再主动从 B站、小红书、抖音、YouTube、X、知乎、Reddit、微博等平台与开放 Web 寻找内容。（支持 deepseek harness 插件） | Local-first open-source cross-platform AI c...
* **Lĩnh vực áp dụng**: Tự động hóa lập trình, Tác tử AI (AI Agents), và Tối ưu hóa quy trình kỹ thuật.
* **Các tính năng nổi bật được trích xuất**:
- **稍后再看 / 收藏不再因协议相对封面 URL 被拒（issue #237）**：B 站返回的 `//i2.hdslb.com/...` 封面由后端统一归一化为 `https://...` 后入库，桌面 / 移动 Web 与 Flutter 端保存直接成功。
- **B 站播放页互动数据更稳**：新增后端视频信息接口，普通接口被 412 风控时自动回退 WBI 签名，移动端简介与点赞 / 投币 / 收藏 / 评论数不再缺失。
- **相关性评估可选 learned scorer（实验性）**：桌面 Web / 扩展「高级功能」可在 `Agent（默认）`、`Shadow（校准观察）`、`Learned（仅相关性）` 间切换，默认行为保持不变。
- `openbiliclaw-extension-v*-firefox.xpi`：Mozilla AMO unlisted 签名后的正式安装包；仅在发布环境启用 AMO signing 且凭据可用时生成，普通 Firefox Release / Beta 可以直接安装。
- `openbiliclaw-extension-v*-firefox.zip`：未签名开发包，只用于 `about:debugging` 临时加载或 AMO 签名输入。普通 Firefox 直接安装它会提示“未通过验证 / could not be verified”。
- **桌面端**：浏览器直接访问 `http://127.0.0.1:8420/web`（或 `http://127.0.0.1:8420/`，自动跳转）。大屏两栏布局，推荐流、30 天历史、画像、聊天、消息和设置全在一页。

---

## 2. Thông Số Kỹ Thuật & Cú Pháp Lệnh (Specifications & Contracts)

Dưới đây là các cấu trúc lệnh và cấu hình thực thi tiêu chuẩn được trích xuất từ tài liệu chính thức:

```bash
请按照 https://raw.githubusercontent.com/whiteguo233/OpenBiliClaw/main/docs/agent-install.md 的说明帮我部署 OpenBiliClaw 后端(务必用 Bash 的 curl 下载这个文档,不要用 WebFetch — 会丢关键指令)

unzip openbiliclaw-extension-v*-firefox.zip -d openbiliclaw-firefox

# 或从源码构建
git clone https://github.com/whiteguo233/OpenBiliClaw.git
cd OpenBiliClaw/extension
npm install
npm run build:firefox          # 产出 dist-firefox/
npm run package:firefox        # 额外打成未签名 openbiliclaw-extension-v*-firefox.zip
# AMO 凭据配置后可签名成正式安装包：
# AMO_JWT_ISSUER=... AMO_JWT_SECRET=... npm run sign:firefox:only
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