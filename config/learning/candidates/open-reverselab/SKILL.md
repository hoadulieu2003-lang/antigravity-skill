---
name: open-reverselab
description: >-
  Kỹ năng chuyên gia vận hành cho LING71671/open-reverselab (1280 ⭐).
  Tự động kích hoạt khi người dùng muốn:
    - Tự động hóa hoặc tích hợp công cụ mã nguồn mở open-reverselab vào hệ thống
    - Giải quyết các tác vụ kỹ thuật chuyên sâu liên quan đến Open-source AI reverse-engineering agent platform and MCP server for Ghidra, Frida, x64dbg and Rizin — automated PE/APK/binary analysis, CTF and malware rese
    - Thiết lập cấu hình và vận hành lệnh CLI của LING71671/open-reverselab
  KHÔNG CẦN người dùng phải nhớ tên kỹ thuật 'open-reverselab'.
---

# LING71671/open-reverselab — Cẩm Nang Kỹ Năng Vận Hành Chuyên Sâu

> **Nguồn gốc**: GitHub Repository `https://github.com/LING71671/open-reverselab`  
> **Độ uy tín cộng đồng**: 1280 ⭐  
> **Trạng thái Quản trị**: `CANDIDATE` (Tuân thủ FRAMEWORK_V2_CAPABILITY_AND_LEARNING_REGISTRY)  
> **Tự động đóng gói lúc**: 2026-10-19 07:42:09Z

---

## 1. Bản Chất Kiến Trúc & Giá Trị Cốt Lõi (Architectural Essence)

* **Mục tiêu cốt lõi**: Open-source AI reverse-engineering agent platform and MCP server for Ghidra, Frida, x64dbg and Rizin — automated PE/APK/binary analysis, CTF and malware rese...
* **Lĩnh vực áp dụng**: Tự động hóa lập trình, Tác tử AI (AI Agents), và Tối ưu hóa quy trình kỹ thuật.
* **Các tính năng nổi bật được trích xuất**:
- **5 boards** spanning web, mobile, Windows, and cross-domain reverse work.
- **180+ articles** organized by attack surface, not by tooling.
- **100+ MCP tools** exposed through `reverse_lab_tools` — curl, frida, ghidra, rizin, yara, triage, kb_router, … all callable from Claude Code, Codex, or any MCP-aware Agent.
- **Directory-as-convention**: every artifact has a fixed home (`samples/`, `exports/`, `patches/`, `kb/`, `reports/`). Drop-in a sample, follow the chain, ship the report.
- **Discord** — [discord.gg/But5j58J2f](https://discord.gg/But5j58J2f). Best place for "how do I do X" questions.
- **Contributing** — see [`.github/CONTRIBUTING.md`](.github/CONTRIBUTING.md). Bug reports, KB article PRs, new MCP tool wrappers, and board additions are all welcome.

---

## 2. Thông Số Kỹ Thuật & Cú Pháp Lệnh (Specifications & Contracts)

Dưới đây là các cấu trúc lệnh và cấu hình thực thi tiêu chuẩn được trích xuất từ tài liệu chính thức:

```bash
./scripts/misc/bootstrap.sh
export PATH="$PWD/tools/bin:$PWD/tools/ctf-website/bin:$PATH"
python scripts/misc/ai_toolcheck.py --board misc    # verify the fresh-clone core

uv run --project tools/skills/mcp/ReverseLabToolsMCP \
     python scripts/misc/mcp_smoke_check.py --write-report
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