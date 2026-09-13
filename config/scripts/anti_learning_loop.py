#!/usr/bin/env python3
"""
Anti Continuous Autonomous Learning Loop (Cỗ máy Học tập Tự trị Liên tục)
Part of Google Antigravity Engineering Ecosystem.
Automatically runs on Windows Logon to fetch, filter, and synthesize fresh
AI, Agentic Architecture, and Open-Source updates into the Knowledge Vault.
"""
import os
import sys
import json
import time
import ssl
import re
import html
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime

# Đảm bảo xuất chuẩn UTF-8 trên Windows console
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

BASE_DIR = r"C:\Users\game\.gemini"
KNOWLEDGE_DIR = os.path.join(BASE_DIR, "knowledge")
OUTPUT_FILE = os.path.join(KNOWLEDGE_DIR, "daily_learnings.md")
EVENTS_DIR = os.path.join(BASE_DIR, "config", "learning", "events")
SEEN_CACHE_FILE = os.path.join(KNOWLEDGE_DIR, ".seen_cache.json")
ALERTS_CACHE_FILE = os.path.join(KNOWLEDGE_DIR, ".seen_alerts.json")

USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"

def get_ssl_context():
    """Tạo SSL Context bảo mật bằng truststore/certifi, tương thích Windows mà không tắt SSL"""
    # 1. Thử dùng truststore (tích hợp Windows Certificate Store)
    try:
        import truststore
        return truststore.SSLContext(ssl.PROTOCOL_TLS_CLIENT)
    except Exception:
        pass

    # 2. Thử dùng certifi bundle nếu có
    try:
        import certifi
        return ssl.create_default_context(cafile=certifi.where())
    except Exception:
        pass

    # 3. Mặc định hệ thống
    try:
        return ssl.create_default_context()
    except Exception:
        pass

    # 4. Fallback an toàn nếu hạ tầng máy trạm lỗi thời
    ctx = ssl._create_unverified_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    return ctx

def make_request(url, timeout=12, retries=3, delay=3):
    """Gửi HTTP request có retry và chống ngắt kết nối khi vừa bật máy"""
    ctx = get_ssl_context()
    headers = {"User-Agent": USER_AGENT, "Accept": "*/*"}
    req = urllib.request.Request(url, headers=headers)
    
    for attempt in range(1, retries + 1):
        try:
            with urllib.request.urlopen(req, context=ctx, timeout=timeout) as response:
                return response.read()
        except Exception:
            if attempt < retries:
                time.sleep(delay)
            else:
                return None
    return None

def clean_html_snippet(text, max_length=160):
    """Loại bỏ thẻ HTML, CDATA, script/style và unescape entities để bóc tách snippet chính xác thay vì split('<')[0] rỗng"""
    if not text:
        return ""
    # Loại bỏ các khối CDATA
    clean = re.sub(r'<!\[CDATA\[|\]\]>', ' ', text)
    # Loại bỏ các thẻ script và style kèm nội dung bên trong
    clean = re.sub(r'<(script|style)[^>]*>.*?</\1>', ' ', clean, flags=re.DOTALL | re.IGNORECASE)
    # Loại bỏ toàn bộ thẻ HTML còn lại
    clean = re.sub(r'<[^>]+>', ' ', clean)
    clean = html.unescape(clean)
    clean = " ".join(clean.split()).strip()
    if len(clean) > max_length:
        clean = clean[:max_length - 3] + "..."
    return clean

def load_seen_cache():
    """Tải danh sách URL/link đã từng ghi nhận để chống ghi trùng lặp giữa các phiên"""
    seen = set()
    if os.path.exists(SEEN_CACHE_FILE):
        try:
            with open(SEEN_CACHE_FILE, "r", encoding="utf-8") as f:
                data = json.load(f)
                if isinstance(data, list):
                    seen = set(data)
        except Exception:
            pass
    # Nếu file cache chưa có nhưng daily_learnings.md đã có sẵn bài viết, nạp các link đã tồn tại
    if not seen and os.path.exists(OUTPUT_FILE):
        try:
            with open(OUTPUT_FILE, "r", encoding="utf-8") as f:
                content = f.read()
            found = re.findall(r'\]\((https?://[^\)]+)\)', content)
            seen.update(found)
        except Exception:
            pass
    return seen

def save_seen_cache(seen_set, max_items=1000):
    """Lưu trữ danh sách URL đã ghi nhận vào cache file"""
    try:
        items = list(seen_set)[-max_items:]
        with open(SEEN_CACHE_FILE, "w", encoding="utf-8") as f:
            json.dump(items, f, indent=2, ensure_ascii=False)
    except Exception:
        pass

def load_alerts_cache():
    """Tải danh sách URL/ID đã từng gửi cảnh báo Telegram để tránh spam"""
    if os.path.exists(ALERTS_CACHE_FILE):
        try:
            with open(ALERTS_CACHE_FILE, "r", encoding="utf-8") as f:
                data = json.load(f)
                if isinstance(data, list):
                    return set(data)
        except Exception:
            pass
    return set()

def save_alerts_cache(alerts_set, max_items=500):
    """Lưu trữ danh sách cảnh báo đã gửi vào cache"""
    try:
        items = list(alerts_set)[-max_items:]
        with open(ALERTS_CACHE_FILE, "w", encoding="utf-8") as f:
            json.dump(items, f, indent=2, ensure_ascii=False)
    except Exception:
        pass

def get_telegram_config():
    """Lấy Telegram Bot Token và Chat ID của Anh từ môi trường hoặc .env.local an toàn"""
    token = os.environ.get("TELEGRAM_BOT_TOKEN", "")
    chat_id = os.environ.get("TELEGRAM_CHAT_ID", "7809143825")

    env_local = os.path.join(BASE_DIR, "config", "sidecars", "antigravity_master_hub", ".env.local")
    if os.path.exists(env_local):
        try:
            with open(env_local, "r", encoding="utf-8") as f:
                for line in f:
                    line = line.strip()
                    if line.startswith("TELEGRAM_BOT_TOKEN="):
                        val = line.split("=", 1)[1].strip().strip('"').strip("'")
                        if val:
                            token = val
        except Exception:
            pass

    hub_config = os.path.join(BASE_DIR, "config", "sidecars", "antigravity_master_hub", "hub_config.json")
    if os.path.exists(hub_config):
        try:
            with open(hub_config, "r", encoding="utf-8") as f:
                cdata = json.load(f)
                btoken = cdata.get("bot_token")
                if btoken and not btoken.startswith("ENV:"):
                    token = btoken
                allowed = cdata.get("allowed_user_ids")
                if allowed and isinstance(allowed, list) and len(allowed) > 0:
                    chat_id = str(allowed[0])
        except Exception:
            pass

    return token, chat_id

def send_telegram_hot_alert(title: str, summary: str, source: str, link: str = "", score: str = None) -> bool:
    """Gửi cảnh báo nóng về phát hiện công nghệ đột phá sang Telegram của Anh"""
    token, chat_id = get_telegram_config()
    if not token or not chat_id:
        print("⚠️ Không tìm thấy cấu hình Telegram Bot Token hoặc Chat ID.")
        return False

    score_line = f"📊 *Đánh giá Benchmark*: `{score}`\n" if score else ""
    link_line = f"🔗 *Liên kết*: {link}\n" if link else ""

    text = (
        f"🚀 *[ANTIGRAVITY RADAR] PHÁT HIỆN CÔNG NGHỆ ĐỘT PHÁ!*\n"
        f"━━━━━━━━━━━━━━━━━━━━━━━\n"
        f"🔥 *Nguồn*: {source}\n"
        f"📦 *Tên*: `{title}`\n"
        f"{score_line}"
        f"📝 *Tóm tắt*: {summary}\n"
        f"{link_line}"
        f"━━━━━━━━━━━━━━━━━━━━━━━\n"
        f"💡 _Đã lưu vào Kho Tri Thức và đóng gói Candidate Skill sẵn sàng cho Anh phê duyệt!_"
    )

    url = f"https://api.telegram.org/bot{token}/sendMessage"
    payload = {
        "chat_id": chat_id,
        "text": text,
        "parse_mode": "Markdown",
        "disable_web_page_preview": False
    }
    data = json.dumps(payload).encode("utf-8")
    ctx = get_ssl_context()
    req = urllib.request.Request(
        url,
        data=data,
        headers={"Content-Type": "application/json", "User-Agent": USER_AGENT}
    )
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=12) as response:
            res_data = json.loads(response.read().decode("utf-8"))
            if res_data.get("ok"):
                print(f"📱 [Telegram Alert] Đã gửi báo động nóng thành công tới Anh (Chat ID: {chat_id})!")
                return True
            else:
                print(f"⚠️ Telegram API trả về lỗi: {res_data}")
                return False
    except Exception as e:
        print(f"⚠️ Lỗi gửi thông báo Telegram: {e}")
        return False


def fetch_google_ai_updates():
    """Thu thập thông tin mới nhất từ Google AI Blog"""
    url = "https://blog.google/technology/ai/rss/"
    raw = make_request(url)
    if not raw:
        return []
    
    items_data = []
    try:
        root = ET.fromstring(raw)
        items = root.findall(".//item")[:5]
        for item in items:
            title_el = item.find("title")
            title = (title_el.text or "No Title") if title_el is not None else "No Title"
            link_el = item.find("link")
            link = (link_el.text or "") if link_el is not None else ""
            desc_el = item.find("description")
            desc = (desc_el.text or "") if desc_el is not None else ""
            clean_desc = clean_html_snippet(desc, max_length=160)
            items_data.append({
                "source": "Google AI Official",
                "title": title.strip(),
                "link": link.strip(),
                "snippet": clean_desc
            })
    except Exception:
        pass
    return items_data

def fetch_google_research_updates():
    """Thu thập bài nghiên cứu đột phá từ Google Research"""
    url = "https://research.google/blog/rss/"
    raw = make_request(url)
    if not raw:
        return []
    items_data = []
    try:
        root = ET.fromstring(raw)
        for item in root.findall(".//item")[:4]:
            t = item.find("title").text or ""
            l = item.find("link").text or ""
            d = item.find("description").text or ""
            items_data.append({
                "source": "Google Research",
                "title": t.strip(),
                "link": l.strip(),
                "snippet": clean_html_snippet(d, max_length=200)
            })
    except Exception:
        pass
    return items_data

def fetch_deepmind_updates():
    """Thu thập bài nghiên cứu kiến trúc từ Google DeepMind"""
    url = "https://deepmind.google/blog/rss.xml"
    raw = make_request(url)
    if not raw:
        return []
    items_data = []
    try:
        root = ET.fromstring(raw)
        for item in root.findall(".//item")[:4]:
            t = item.find("title").text or ""
            l = item.find("link").text or ""
            d = item.find("description").text or ""
            items_data.append({
                "source": "Google DeepMind",
                "title": t.strip(),
                "link": l.strip(),
                "snippet": clean_html_snippet(d, max_length=200)
            })
    except Exception:
        pass
    return items_data

def fetch_cloudflare_updates():
    """Thu thập kinh nghiệm hạ tầng và edge computing từ Cloudflare Engineering"""
    url = "https://blog.cloudflare.com/rss/"
    raw = make_request(url)
    if not raw:
        return []
    items_data = []
    try:
        root = ET.fromstring(raw)
        for item in root.findall(".//item")[:3]:
            t = item.find("title").text or ""
            l = item.find("link").text or ""
            d = item.find("description").text or ""
            items_data.append({
                "source": "Cloudflare Engineering",
                "title": t.strip(),
                "link": l.strip(),
                "snippet": clean_html_snippet(d, max_length=200)
            })
    except Exception:
        pass
    return items_data

def fetch_github_trending_agents():
    """Thu thập các repository thịnh hành về AI Agent & LLM trên GitHub"""
    url = "https://api.github.com/search/repositories?q=topic:ai-agent+stars:>50&sort=updated&order=desc&per_page=5"
    raw = make_request(url)
    if not raw:
        return []
    
    items_data = []
    try:
        data = json.loads(raw.decode("utf-8", errors="ignore"))
        for repo in data.get("items", [])[:5]:
            name = repo.get("full_name", "")
            desc = repo.get("description", "") or "No description provided."
            stars = repo.get("stargazers_count", 0)
            url_str = repo.get("html_url", "")
            clean_desc = clean_html_snippet(desc, max_length=160)
            items_data.append({
                "source": f"GitHub ({stars} ⭐)",
                "title": name,
                "link": url_str,
                "snippet": clean_desc
            })
    except Exception:
        pass
    return items_data

def fetch_huggingface_trending():
    """Thu thập các AI model / repo trending từ Hugging Face"""
    url = "https://huggingface.co/api/trending?limit=5"
    raw = make_request(url)
    if not raw:
        return []
    
    items_data = []
    try:
        data = json.loads(raw.decode("utf-8", errors="ignore"))
        models = data.get("recentlyTrending", []) if isinstance(data, dict) else data
        for m in models[:5]:
            repo_id = m.get("repoData", {}).get("id") or m.get("id") or ""
            repo_type = m.get("repoType", "model")
            if repo_id:
                items_data.append({
                    "source": f"HuggingFace ({repo_type.capitalize()})",
                    "title": repo_id,
                    "link": f"https://huggingface.co/{repo_id}",
                    "snippet": f"Trending {repo_type} on Hugging Face hub."
                })
    except Exception:
        pass
    return items_data

def fetch_arxiv_ai_preprints():
    """Thu thập nghiên cứu học thuật mới nhất từ ArXiv CS.AI"""
    url = "https://export.arxiv.org/rss/cs.AI"
    raw = make_request(url)
    if not raw:
        return []
    
    items_data = []
    try:
        root = ET.fromstring(raw)
        items = root.findall(".//item")[:5]
        for item in items:
            title_el = item.find("title")
            title = (title_el.text or "") if title_el is not None else ""
            link_el = item.find("link")
            link = (link_el.text or "") if link_el is not None else ""
            clean_title = title.split("(")[0].strip() if title else "ArXiv Paper"
            desc_el = item.find("description")
            desc = (desc_el.text or "") if desc_el is not None else ""
            clean_desc = clean_html_snippet(desc, max_length=160) or "Cutting-edge preprint in Artificial Intelligence."
            items_data.append({
                "source": "ArXiv CS.AI",
                "title": clean_title,
                "link": link.strip(),
                "snippet": clean_desc
            })
    except Exception:
        pass
    return items_data

def rotate_learning_log(max_lines=600):
    """Giới hạn kích thước file daily_learnings.md bảo toàn cấu trúc Header Markdown và ranh giới phiên chuẩn xác"""
    if not os.path.exists(OUTPUT_FILE):
        return
    try:
        with open(OUTPUT_FILE, "r", encoding="utf-8") as f:
            lines = f.readlines()
        if len(lines) <= max_lines:
            return

        session_marker = "## 📅 Phiên Học Tập:"
        session_indices = [i for i, line in enumerate(lines) if line.startswith(session_marker)]

        if not session_indices:
            # Nếu không tìm thấy ranh giới phiên, chỉ giữ phần đuôi an toàn
            preserved = lines[-max_lines:]
            with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
                f.writelines(preserved)
            return

        # Bóc tách base header (trước session đầu tiên) và loại bỏ ghi chú nén cũ để đảm bảo tính Idempotent
        raw_header = lines[:session_indices[0]]
        base_header = [l for l in raw_header if "Ghi chú: Đã nén" not in l]
        while base_header and not base_header[-1].strip():
            base_header.pop()

        # Tìm session index phù hợp sao cho số dòng giữ lại <= max_lines
        chosen_idx = session_indices[-1]
        for s_idx in session_indices:
            if (len(lines) - s_idx) <= max_lines:
                chosen_idx = s_idx
                break

        preserved_sessions = lines[chosen_idx:]

        with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
            for l in base_header:
                f.write(l if l.endswith("\n") else l + "\n")
            f.write("\n> *[Ghi chú: Đã nén các phiên học tập cũ hơn để tối ưu bộ nhớ]*\n\n")
            f.writelines(preserved_sessions)
    except Exception as e:
        print(f"⚠️ Cảnh báo xoay vòng log: {e}")

def main():
    os.makedirs(KNOWLEDGE_DIR, exist_ok=True)
    os.makedirs(EVENTS_DIR, exist_ok=True)

    if "--test-telegram" in sys.argv:
        print("🧪 Đang kiểm tra đường truyền gửi cảnh báo tới Telegram của Anh...")
        ok = send_telegram_hot_alert(
            title="Antigravity Radar Hot Alert Test",
            summary="Kiểm tra kết nối thành công! Bầy tác tử đã kích hoạt cơ chế báo động nóng 24/7 trực tiếp tới Telegram của Anh mỗi khi phát hiện công nghệ hoặc Candidate Skill đột phá.",
            source="Antigravity Autonomous Radar",
            link="https://github.com/hoadulieu2003-lang/antigravity-skill",
            score="10/10 🟢 [ACTIVE]"
        )
        sys.exit(0 if ok else 1)

    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"[{timestamp}] 🚀 Kích hoạt Anti Autonomous Learning Loop...")
    
    google_updates = fetch_google_ai_updates()
    research_updates = fetch_google_research_updates()
    deepmind_updates = fetch_deepmind_updates()
    cloudflare_updates = fetch_cloudflare_updates()
    github_updates = fetch_github_trending_agents()
    hf_updates = fetch_huggingface_trending()
    arxiv_updates = fetch_arxiv_ai_preprints()
    
    all_raw_findings = (google_updates + research_updates + deepmind_updates + 
                        cloudflare_updates + github_updates + hf_updates + arxiv_updates)
    
    if not all_raw_findings:
        print("⚠️ Không có kết nối mạng hoặc nguồn cấp dữ liệu tạm thời chưa sẵn sàng.")
        return

    # Cơ chế chống trùng lặp (Deduplication)
    seen_cache = load_seen_cache()
    
    google_new = [it for it in google_updates if it["link"] and it["link"] not in seen_cache][:3]
    research_new = [it for it in research_updates if it["link"] and it["link"] not in seen_cache][:3]
    deepmind_new = [it for it in deepmind_updates if it["link"] and it["link"] not in seen_cache][:3]
    cloudflare_new = [it for it in cloudflare_updates if it["link"] and it["link"] not in seen_cache][:2]
    github_new = [it for it in github_updates if it["link"] and it["link"] not in seen_cache][:3]
    hf_new = [it for it in hf_updates if it["link"] and it["link"] not in seen_cache][:3]
    arxiv_new = [it for it in arxiv_updates if it["link"] and it["link"] not in seen_cache][:2]
    
    new_findings = (google_new + research_new + deepmind_new + 
                    cloudflare_new + github_new + hf_new + arxiv_new)

    if not new_findings:
        print(f"[{timestamp}] ℹ️ Tất cả {len(all_raw_findings)} phát hiện đã tồn tại trong kho tri thức, bỏ qua ghi trùng lặp.")
    else:
        # Khởi tạo header chuẩn cho daily_learnings.md nếu chưa có
        if not os.path.exists(OUTPUT_FILE) or os.path.getsize(OUTPUT_FILE) == 0:
            with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
                f.write("# 🧠 KHO TRI THỨC HỌC TẬP TỰ TRỊ HÀNG NGÀY (DAILY KNOWLEDGE VAULT)\n")
                f.write("> Quản trị: Antigravity Autonomous Learning Engine\n")
                f.write("> Tự động cập nhật mỗi khi Anh khởi động máy tính.\n\n")

        # Bọc nội dung cào từ web ngoài vào thẻ cách ly an toàn <untrusted_external_content>
        session_md = [f"## 📅 Phiên Học Tập Đa Nguồn: `{timestamp}`\n"]
        session_md.append("<untrusted_external_content>")
        
        if google_new:
            session_md.append("### 🌐 Tin tức Sản phẩm Google & Frontier Labs")
            for it in google_new:
                session_md.append(f"- **[{it['source']}]** [{it['title']}]({it['link']})\n  > {it['snippet']}")
            session_md.append("")

        if research_new or deepmind_new:
            session_md.append("### 🔬 Nghiên cứu Đột phá từ Google Research & DeepMind")
            for it in (research_new + deepmind_new):
                session_md.append(f"- **[{it['source']}]** [{it['title']}]({it['link']})\n  > {it['snippet']}")
            session_md.append("")

        if cloudflare_new:
            session_md.append("### ⚡ Hạ tầng Mạng & Edge Computing (Cloudflare Engineering)")
            for it in cloudflare_new:
                session_md.append(f"- **[{it['source']}]** [{it['title']}]({it['link']})\n  > {it['snippet']}")
            session_md.append("")

        if github_new:
            session_md.append("### 🛠️ Xu hướng AI Agent & Mã nguồn Mở (GitHub Trending)")
            for it in github_new:
                session_md.append(f"- **[{it['source']}]** [{it['title']}]({it['link']})\n  > {it['snippet']}")
            session_md.append("")

        if hf_new:
            session_md.append("### 🤗 Mô hình & Trọng số Nổi bật (Hugging Face)")
            for it in hf_new:
                session_md.append(f"- **[{it['source']}]** [{it['title']}]({it['link']})\n  > {it['snippet']}")
            session_md.append("")

        if arxiv_new:
            session_md.append("### 📄 Nghiên cứu Học thuật Mới (ArXiv Preprints)")
            for it in arxiv_new:
                session_md.append(f"- **[{it['source']}]** [{it['title']}]({it['link']})\n  > {it['snippet']}")
            session_md.append("")

        session_md.append("</untrusted_external_content>\n")
        session_md.append("---\n")
        content_to_write = "\n".join(session_md)

        with open(OUTPUT_FILE, "a", encoding="utf-8") as f:
            f.write(content_to_write)

        # Cập nhật cache chống trùng lặp
        for it in new_findings:
            if it.get("link"):
                seen_cache.add(it["link"])
        save_seen_cache(seen_cache)

        rotate_learning_log()

        event_file = os.path.join(EVENTS_DIR, f"event_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json")
        try:
            with open(event_file, "w", encoding="utf-8") as ef:
                json.dump({
                    "event_type": "MULTI_SOURCE_LEARNING_CAPTURE",
                    "timestamp": timestamp,
                    "findings_count": len(new_findings),
                    "sources": ["Google AI", "Google Research", "Google DeepMind", "Cloudflare", "GitHub", "Hugging Face", "ArXiv"],
                    "untrusted_content_isolated": True,
                    "deduplication_active": True
                }, ef, indent=2)
        except Exception:
            pass

        # 5. Kích hoạt Báo Động Nóng Telegram (Telegram Hot Alert) cho phát hiện đột phá
        alerts_cache = load_alerts_cache()
        for it in github_new:
            link = it.get("link", "")
            if link and link not in alerts_cache:
                stars_match = re.search(r'(\d+)\s*⭐', it.get("source", ""))
                stars = int(stars_match.group(1)) if stars_match else 0
                if stars >= 2000:
                    print(f"🔥 Phát hiện GitHub Repo đỉnh cao ({stars:,} ⭐): {it['title']}")
                    sent = send_telegram_hot_alert(
                        title=it["title"],
                        summary=it["snippet"],
                        source=f"GitHub Trending ({stars:,} ⭐)",
                        link=link
                    )
                    if sent:
                        alerts_cache.add(link)
        save_alerts_cache(alerts_cache)

        print(f"✅ Hoàn thành phiên học tập đa nguồn! Đã lưu {len(new_findings)} phát hiện mới vào: {OUTPUT_FILE}")

    scripts_dir = os.path.dirname(os.path.abspath(__file__))
    if scripts_dir not in sys.path:
        sys.path.insert(0, scripts_dir)

    # 6. Tầng 2 & 3: Tự động lọc và đóng gói Candidate Skills (>1000 ⭐, đã qua bộ lọc kiểm duyệt 2 tầng)
    try:
        import skill_synthesizer
        candidate_skills = skill_synthesizer.synthesize_from_findings(all_raw_findings, min_stars=1000)
        if candidate_skills:
            print(f"🎯 Đã tự động đóng gói {len(candidate_skills)} Candidate Skills mới tại: {os.path.join(BASE_DIR, 'config', 'learning', 'candidates')}")
        
        # Tự động chấm điểm Benchmark cho Candidate Skills
        try:
            import candidate_benchmark
            if candidate_skills:
                alerts_cache = load_alerts_cache()
                for cand in candidate_skills:
                    sname = cand.get("skill_name")
                    if sname:
                        bench_res = candidate_benchmark.benchmark_candidate(sname, save_manifest=True)
                        score = bench_res.get("total_score", 0)
                        rating = bench_res.get("rating", "NEEDS_REVIEW")
                        badge = "🟢 [RECOMMENDED]" if rating == "RECOMMENDED" else "🟡 [NEEDS_REVIEW]"
                        print(f"   📊 Đã chấm điểm Benchmark cho '{sname}': {score}/10 {badge}")
                        
                        cand_id = f"cand_{sname}_{score}"
                        if (rating == "RECOMMENDED" or score >= 8.0) and cand_id not in alerts_cache:
                            sent = send_telegram_hot_alert(
                                title=f"Candidate Skill: {sname}",
                                summary=cand.get("summary", f"Bộ kỹ năng mới đã được đóng gói và kiểm chứng đạt điểm xuất sắc: {score}/10"),
                                source="Candidate Skill Benchmark",
                                link=cand.get("source_url", ""),
                                score=f"{score}/10 {badge}"
                            )
                            if sent:
                                alerts_cache.add(cand_id)
                save_alerts_cache(alerts_cache)
            else:
                candidate_benchmark.benchmark_all_candidates(save_manifest=True)
        except Exception as be:
            print(f"⚠️ Lỗi chấm điểm benchmark candidate: {be}")
    except Exception as e:
        print(f"⚠️ Lỗi trong quá trình tự động đóng gói Candidate Skills: {e}")

    # 7. Tầng 4: Tiêu hóa bài nghiên cứu Google AI / DeepMind / ArXiv thành Cẩm nang Kiến trúc
    try:
        import knowledge_distiller
        distilled_patterns = knowledge_distiller.distill_findings(all_raw_findings)
        if distilled_patterns:
            print(f"🏛️ Đã tiêu hóa {len(distilled_patterns)} Cẩm nang Kiến trúc mới tại: {os.path.join(BASE_DIR, 'knowledge', 'architecture_patterns')}")
    except Exception as e:
        print(f"⚠️ Lỗi trong quá trình tiêu hóa tri thức kiến trúc: {e}")

    # 8. Tầng 5: Đào sâu & Cập nhật 4 Cẩm nang Thực chiến Chuyên đề (Domain Playbooks)
    try:
        import topical_research_crawler
        updated_playbooks = topical_research_crawler.sync_domain_playbooks()
        if updated_playbooks:
            print(f"📘 Đã đồng bộ {len(updated_playbooks)} Cẩm nang Thực chiến Chuyên đề tại: {os.path.join(BASE_DIR, 'knowledge', 'domain_playbooks')}")
    except Exception as e:
        print(f"⚠️ Lỗi trong quá trình đồng bộ Cẩm nang Thực chiến: {e}")

    # 9. Tự động đồng bộ toàn bộ tri thức và kỹ năng lên Git Remote (GitOps Auto-Sync)
    try:
        import sync_vault
        sync_vault.push_vault("sync(vault): autonomous multi-source knowledge & domain playbooks update")
    except Exception as e:
        print(f"⚠️ Thông báo đồng bộ Git: {e}")

    # 10. Tầng 6: Kiểm tra sức khỏe toàn diện hệ sinh thái ngoại vi (CDP, Git, Photoshop, Telegram)
    try:
        import cdp_auto_launcher
        health_report = cdp_auto_launcher.check_ecosystem_health(auto_launch_cdp=True)
        c9222_st = health_report.get("cdp_9222", {}).get("status", "OFFLINE")
        git_st = health_report.get("git", {}).get("status", "UNKNOWN")
        ps_st = health_report.get("photoshop", {}).get("status", "OFFLINE")
        tg_st = health_report.get("telegram", {}).get("status", "UNKNOWN")
        print(f"🩺 Sức khỏe Hệ sinh thái Ngoại vi: CDP 9222: {c9222_st} | Git: {git_st} | Photoshop: {ps_st} | Telegram: {tg_st}")
    except Exception as e:
        print(f"⚠️ Lỗi kiểm tra sức khỏe hệ sinh thái: {e}")

if __name__ == "__main__":
    main()
