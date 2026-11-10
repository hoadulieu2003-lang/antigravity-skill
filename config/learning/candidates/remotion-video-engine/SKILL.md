---
name: remotion-video-engine
description: |
  Kỹ năng chuyên gia thiết kế từ remotion-dev/skills (6642 ⭐). Tự động kích hoạt khi người dùng muốn:
  - Dựng Video Quảng Cáo (9:16 Reels/TikTok, 16:9), Motion Graphics và Phụ đề động (Captions) bằng mã nguồn React / Remotion xuất ra .MP4
  - Tạo video bản đồ bay 3D chỉ đường địa lý (Remotion Maps với MapLibre miễn phí không cần API key, Mapbox, CesiumJS)
  - Tự động hóa sản xuất video truyền thông sự kiện, intro thương hiệu và trình chiếu sản phẩm mượt 60 FPS
  KHÔNG CẦN người dùng phải nhớ tên kỹ thuật 'remotion-video-engine'.
---

# 🎨 REMOTION-VIDEO-ENGINE — ENTERPRISE DESIGN SKILL (remotion-dev/skills • 6,642 ⭐)

## 1. Bản Chất Kiến Trúc (Architectural Essence)
Kỹ năng `remotion-video-engine` được tích hợp từ kho mã nguồn mở danh tiếng `remotion-dev/skills` (6,642 ⭐) và chuẩn hóa hoàn toàn theo Hiến chương Kỹ thuật Antigravity (`config/AGENTS.md`):
- **Luminous Light Theme Invariant (Bất biến Giao diện Sáng Đa Tầng)**: Mặc định 100% áp dụng nền sáng đa tầng (`Warm Paper #FAF9F6`, `Ivory #FDFBF7`, `Alabaster #F8F9FA`, `Pure White #FFFFFF`), bóng đổ đa chiều mịn màng và độ tương phản chuẩn `WCAG AA`. Chỉ dùng Dark Theme khi Anh yêu cầu tường minh.
- **Anti-AI Slop Craftsmanship (Chống Rác Giao Diện AI)**: Triệt tiêu bố cục rập khuôn, icon emoji rẻ tiền và khối màu giả lập vô hồn; đề cao tỷ lệ chữ tinh tế, chất liệu nhiếp ảnh/vector thực thụ và chiều sâu thẩm mỹ.

## 2. Thông Số Kỹ Thuật & Tài Nguyên Đi Kèm (Technical Specifications & Bundled Assets)
- Đóng gói đầy đủ **13 bộ kỹ năng chính chủ của Remotion** tại `C:\Users\game\.gemini\config\skills\remotion-video-engine\subskills\` (`remotion-create`, `remotion-markup`, `remotion-maps`, `remotion-captions`, `remotion-multimedia`, `remotion-render`, `remotion-interactivity`, `remotion-studio`...).

```powershell
# Khởi chạy Remotion Studio hoặc xuất video MP4 bằng lệnh chuẩn
npx remotion studio
npx remotion render
```

## 3. Quy Trình Vận Hành Chuẩn & An Toàn (Operational Runbook & Sandbox Guardrails)
- **Sandbox & Bảo mật (Rule 14 / INV-E07)**: Tuyệt đối không ghi đè tệp ngoài phạm vi dự án, không lộ khóa bí mật và tuân thủ cơ chế `FAST Mode` / `2-strike` khi gỡ lỗi hiển thị.
- **Tự Kiểm Chứng Thực Tế (Evidence Ledger & Closed-Loop Verification)**: Sau khi xuất thiết kế (HTML/CSS, PNG/PDF Canvas, p5.js hoặc Video Remotion), bắt buộc kiểm tra kết quả hiển thị thực tế qua trình duyệt CDP hoặc kiểm tra kích thước khung hình để đảm bảo 0 lỗi tràn lề chữ (`0 Text Overflow`) và 0 lỗi Console.
- **Bẫy Lỗi Thường Gặp**: Tránh dùng font hệ thống thiếu dấu Tiếng Việt khi thiết kế ấn phẩm đa ngôn ngữ; luôn kiểm tra độ tương phản chữ trên nền giấy sáng.

---

## 4. Cẩm Nang Chuyên Môn Nguyên Bản (Upstream Master Playbook)

## Preserve user changes

Users may make edits in the code outside of the conversation.

If you detect a surprising change made in the meanwhile, don't overwrite it, assume it was intentional or ask for confirmation.

## Creating a video

If the user asks to make, create, or build a new video or composition, load [Create a new Remotion video](./remotion-create/REFERENCE.md), whether or not a Remotion project already exists.

## New project setup

If no Remotion project currently exists, load [Create a new Remotion project](./remotion-create/REFERENCE.md)

## React Markup Best Practices

If you are writing Remotion React Markup, load [Remotion Markup Best Practices](./remotion-markup/REFERENCE.md)

## Maps

For static maps, animated routes and markers, geographic explainers, Mapbox, MapLibre, MapTiler, GeoJSON, or 3D geographic flyovers, load [Remotion Maps](./remotion-maps/REFERENCE.md).

## Multimedia

For achieving multimedia tasks in the browser, such as trimming, cropping videos, or getting metadata from them, load [Remotion Multimedia](./remotion-multimedia/REFERENCE.md)

For video matting, background removal, or placing content behind a subject,
load [Remotion Markup](./remotion-markup/REFERENCE.md).

## Improving Interactivity

By structuring the Remotion markup well, we can allow users to interactively change things in the Studio and write back to code. If relevant: [Interactivity Best Practices](./remotion-interactivity/REFERENCE.md)

## Open the preview

If the user asks to "make" a video, "create" a video, etc.
Don't render the video by default unless they are very explicit. They want to instead see an interactive preview.
As soon as the project can run, start Studio and open the preview in the browser before building or editing the composition. Keep it open while you work so the user can watch progress and steer.

### If you are using Cursor

Run Studio without `--no-open` so it opens the browser automatically:

```bash
npx remotion studio
```

### If you are using another agent client with an in-app browser

You can use the command above to let Studio open the browser, or run:

```bash
npx remotion studio --no-open
```

This will start a long-running process and print the server URL for the preview.  
If the server is already started, it will print the URL.
If you use `--no-open`, open the exact printed URL in the in-app browser and verify that Studio loads. Once a composition exists, verify that its video preview loads. If you cannot open it there, run Studio without `--no-open`.
You can visit a specific composition by navigating to `/[composition-id]`, for example `http://localhost:3000/MapAnimation`.

:::note
The Studio supports WebMCP tools.
:::

### If you do not have an in-app browser

This will open the Studio in the browser or refocus it if it is already open.

```bash
npx remotion studio
```

### More options

To launch a project in Remotion Studio, open its exact local URL, or configure Studio CLI flags, load [Remotion Studio](./remotion-studio/REFERENCE.md).

## Render the video

Only render if the user is very explicit in asking for it.  
E.g. "Render the video", "Export", "Give me the MP4".

The preview also has a more intuitive rendering interface, so consider using it instead of the command line for rendering.

```
npx remotion render
```

For more options, see [Rendering](./remotion-render/REFERENCE.md).

For advanced rendering beyond simple `npx remotion render`, see: [Rendering Best Practices](./remotion-render/REFERENCE.md)

## Captions

When working with Captions, load [Remotion Captions](./remotion-captions/REFERENCE.md).

## Creating a SaaS, automation or application

Use the [Remotion SaaS skill](./remotion-saas/REFERENCE.md) for knowledge about Remotion-powered SaaS apps, such as `<Player>`, rendering on Lambda, Vercel, Cloudflare, via Express.js, client-side rendering, or for finding the right SaaS template.

## Looking up Remotion APIs and documentation

To find and read current Remotion documentation, load [Remotion Docs](./remotion-docs/REFERENCE.md).

## Licensing

For Remotion license information, FAQs, terms, or buying a license, load [Remotion License](./remotion-license/REFERENCE.md).

## Upgrading

To upgrade Remotion, related packages, compatible Mediabunny packages, and installed Remotion Agent Skills, load [Remotion Upgrade](./remotion-upgrade/REFERENCE.md).

---

# Remotion Maps

Choose exactly one technique from the intended shot, then load only that technique's `TECHNIQUE.md`.
Every technique directory is self-contained and may be removed without breaking the others.

## [Static map](techniques/static-map/TECHNIQUE.md)

- Requires you grab a satellite image and mount it in a `<Img>` tag, and animate on top

## [Mapbox](techniques/mapbox/TECHNIQUE.md)

- Requires a Mapbox key
- Nicer styles by default
- Map can display a round globe when zoomed out
- Includes nice 3D buildings such as the Eiffel tower

## [MapLibre](techniques/maplibre/TECHNIQUE.md)

- Requires no API key, fully free
- Does not include 3D building

## [MapTiler](techniques/maptiler/TECHNIQUE.md)

- Uses MapTiler
- Annotations can be drawn on top of geographic features: borders, rivers, labels

## [CesiumJS](techniques/cesium/TECHNIQUE.md)

- Flythroughs through terrain and mountains
- "Flight simulator" perspective
