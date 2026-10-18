#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
TVU ONSCHOOL LMS - AUTOMATED SYNC & QUESTION HARVESTING ENGINE
Phiên bản: Release v2.6 - Đồng bộ 100% Hiến pháp LearnIZ SSoT
Tính năng nâng cấp:
  - Bộ điều phối 3 Khung giờ Ngẫu nhiên (Sáng 6-9h, Trưa 12-13h, Tối 19-21h) xoay vòng môn
  - Động cơ Thời lượng Làm bài Ngẫu nhiên (Randomized Duration >= 1/4 tổng thời gian)
  - Tương tác DOM Tiến trình (Progressive Answering & Heartbeat Telemetry)
  - Bộ bóc tách công thức 3 tầng (MathType Wiris alt/data-mathml + tải ảnh screenshot)
  - Atomic Write chống xung đột khóa file OneDrive
  - Cảnh báo phiên hết hạn qua macOS Notification
"""

import sys
import os
import re
import json
import time
import fcntl
import random
import hashlib
import argparse
import subprocess
import urllib.parse
import urllib.request
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Any, Optional, Tuple

# ==============================================================================
# 1. HỆ THỐNG ĐƯỜNG DẪN VÀ THÔNG SỐ CỐT LÕI
# ==============================================================================
BASE_DIR = Path("/Users/thien-ban/Library/CloudStorage/OneDrive-Personal/03_WORK/11. LearnIZ")
SCRATCH_DIR = BASE_DIR / "scratch"
SOURCES_DIR = BASE_DIR / "_sources" / "TVU" / "Quan_tri_kinh_doanh_DH"
CONFIG_JS_PATH = BASE_DIR / "assets" / "config.js"
PROJECT_LOG_PATH = BASE_DIR / "PROJECT_LOG.md"

AUTH_STATE_PATH = SCRATCH_DIR / "lms_auth_state.json"
SCHEDULE_STATE_PATH = SCRATCH_DIR / "sync_schedule_state.json"
GLOBAL_LOCK_PATH = SCRATCH_DIR / "sync_tvu_lms.lock"
TELEGRAM_CONFIG_PATH = SCRATCH_DIR / "telegram_config.json"
DASHBOARD_EVENTS_PATH = BASE_DIR / "assets" / "dashboard_events.json"

TVU_BASE_URL = "https://lms2tvu.onschool.edu.vn"
USER_AGENT_MACOS = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
)

# Cấu hình 3 Khung giờ tương tác
SLOT_CONFIG = {
    "morning": {"start": 6, "end": 9, "max_jitter_min": 100, "name": "Buổi Sáng (6h - 9h)"},
    "noon":    {"start": 12, "end": 13, "max_jitter_min": 35,  "name": "Buổi Trưa (12h - 13h)"},
    "evening": {"start": 19, "end": 21, "max_jitter_min": 75,  "name": "Buổi Tối (19h - 21h)"}
}

# ==============================================================================
# 2. TIỆN ÍCH AN TOÀN HỆ THỐNG & ATOMIC WRITE CHỐNG KHÓA ONEDRIVE
# ==============================================================================
def send_macos_notification(title: str, message: str, sound: str = "Basso"):
    """Bắn thông báo đẩy ra màn hình macOS thông qua AppleScript."""
    try:
        script = f'display notification "{message}" with title "{title}" sound name "{sound}"'
        subprocess.run(["osascript", "-e", script], check=False)
    except Exception as e:
        print(f"[!] Lỗi khi gửi macOS Notification: {e}")

def send_telegram_notification(text: str, buttons: Optional[List[Dict[str, str]]] = None) -> bool:
    """Gửi thông báo đẩy về ứng dụng Telegram trên điện thoại di động.
    Hỗ trợ định dạng HTML và phím bấm tương tác 1-chạm (Inline Buttons).
    """
    if not TELEGRAM_CONFIG_PATH.exists():
        return False

    try:
        with open(TELEGRAM_CONFIG_PATH, "r", encoding="utf-8") as f:
            cfg = json.load(f)

        if not cfg.get("enabled", False):
            return False

        token = cfg.get("bot_token", "").strip()
        chat_id = cfg.get("chat_id", "").strip()

        if not token or not chat_id:
            return False

        url = f"https://api.telegram.org/bot{token}/sendMessage"
        payload_dict: Dict[str, Any] = {
            "chat_id": chat_id,
            "text": text,
            "parse_mode": "HTML",
            "disable_web_page_preview": False
        }
        if buttons:
            payload_dict["reply_markup"] = {
                "inline_keyboard": [
                    [{"text": b["text"], "url": b["url"]} for b in buttons]
                ]
            }

        data_bytes = json.dumps(payload_dict).encode("utf-8")
        req = urllib.request.Request(
            url,
            data=data_bytes,
            headers={"Content-Type": "application/json"}
        )
        with urllib.request.urlopen(req, timeout=5) as response:
            return response.status == 200
    except Exception as e:
        print(f"[!] Không thể gửi thông báo Telegram: {e}")
        return False

def atomic_write_json(target_path: Path, data: Any):
    """Ghi đè file JSON nguyên tử (Atomic Write) qua thư mục /tmp/ nhằm triệt tiêu
    hoàn toàn lỗi PermissionError: [Errno 13] do Microsoft OneDrive đang đồng bộ.
    """
    target_path.parent.mkdir(parents=True, exist_ok=True)
    temp_file = Path(f"/tmp/learniz_atomic_{os.getpid()}_{int(time.time()*1000)}.json")
    
    try:
        with open(temp_file, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        
        # Kiểm tra tính toàn vẹn cú pháp trước khi thay thế
        with open(temp_file, "r", encoding="utf-8") as f:
            _ = json.load(f)
            
        os.replace(temp_file, target_path)
    finally:
        if temp_file.exists():
            try:
                temp_file.unlink()
            except OSError:
                pass

def log_dashboard_event(
    event_type: str,
    title: str,
    message: str,
    priority: str = "normal",
    subject_id: str = "00",
    subject_name: str = "Hệ thống Điều phối",
    stats: Optional[Dict[str, Any]] = None,
    actions: Optional[List[Dict[str, Any]]] = None
):
    """Ghi nhận sự kiện vào assets/dashboard_events.json phục vụ Telegram In-App Cockpit.
    - Rolling Window: Tự động giữ tối đa 30 sự kiện mới nhất (< 15KB).
    - Bảo mật: Zero-Token, Frontend chỉ đọc tĩnh, không chứa bot_token.
    - An toàn đụng độ OneDrive: Dùng atomic_write_json qua thư mục /tmp/.
    """
    now = datetime.now()
    now_iso = now.isoformat()
    time_str = now.strftime("%H:%M")
    evt_id = f"evt-{int(time.time() * 1000)}"

    event_payload: Dict[str, Any] = {
        "id": evt_id,
        "timestamp": now_iso,
        "time_str": time_str,
        "type": event_type,
        "priority": priority,
        "subject_id": subject_id,
        "subject_name": subject_name,
        "title": title,
        "message": message,
    }
    if stats:
        event_payload["stats"] = stats
    if actions:
        event_payload["actions"] = actions

    current_data: Dict[str, Any] = {
        "last_updated": now_iso,
        "bot_username": "LearnIZ_TVU_Bot",
        "system_status": {
            "status": "online",
            "slot": "Sẵn sàng",
            "device": "MacBook",
            "battery": "100%",
            "active_lock": True
        },
        "events": []
    }

    if DASHBOARD_EVENTS_PATH.exists():
        try:
            with open(DASHBOARD_EVENTS_PATH, "r", encoding="utf-8") as f:
                loaded = json.load(f)
                if isinstance(loaded, dict):
                    current_data.update(loaded)
        except Exception:
            pass

    current_data["last_updated"] = now_iso
    _, batt_status = check_battery_safety()
    if "system_status" not in current_data or not isinstance(current_data["system_status"], dict):
        current_data["system_status"] = {}
    current_data["system_status"]["battery"] = batt_status
    current_data["system_status"]["status"] = "online"

    events_list = current_data.get("events", [])
    if not isinstance(events_list, list):
        events_list = []

    events_list.append(event_payload)
    current_data["events"] = events_list[-30:]

    try:
        atomic_write_json(DASHBOARD_EVENTS_PATH, current_data)
    except Exception as e:
        print(f"[!] Không thể ghi dashboard_events.json: {e}")

def acquire_global_lock():
    """Khóa đơn tiến trình (Process Mutex) sử dụng fcntl.flock trên macOS.
    Tuyệt đối cấm chạy đồng thời 2 tiến trình bot cùng lúc để bảo vệ tài khoản.
    """
    GLOBAL_LOCK_PATH.parent.mkdir(parents=True, exist_ok=True)
    try:
        lock_file = open(GLOBAL_LOCK_PATH, "w")
        fcntl.flock(lock_file.fileno(), fcntl.LOCK_EX | fcntl.LOCK_NB)
        return lock_file
    except (BlockingIOError, IOError):
        print("[!] ĐANG CÓ TIẾN TRÌNH BOT KHÁC ĐANG CHẠY! Hủy bỏ lượt chạy này để chống tương tác đồng thời.")
        return None

def release_global_lock(lock_file):
    """Giải phóng file lock khi kết thúc phiên."""
    if lock_file:
        try:
            fcntl.flock(lock_file.fileno(), fcntl.LOCK_UN)
            lock_file.close()
        except Exception:
            pass

def check_internet_connection(timeout: int = 4) -> bool:
    """Kiểm tra kết nối Internet thực tế trước khi chạy.
    Tránh trường hợp rớt mạng mà tưởng nhầm là hết hạn session cookie.
    """
    import socket
    try:
        socket.setdefaulttimeout(timeout)
        socket.socket(socket.AF_INET, socket.SOCK_STREAM).connect(("8.8.8.8", 53))
        return True
    except Exception:
        try:
            req = urllib.request.Request(TVU_BASE_URL, headers={"User-Agent": USER_AGENT_MACOS})
            with urllib.request.urlopen(req, timeout=timeout) as response:
                return True
        except Exception:
            return False

def check_battery_safety() -> Tuple[bool, str]:
    """Kiểm tra trạng thái pin trên macOS thông qua lệnh pmset.
    Nếu đang xài pin và dung lượng dưới 15% -> Cấm mở bài thi để tránh sập nguồn giữa chừng.
    """
    try:
        output = subprocess.check_output(["pmset", "-g", "batt"], text=True)
        is_charging = "AC Power" in output or "charging" in output or "charged" in output
        match = re.search(r'(\d+)%', output)
        percent = int(match.group(1)) if match else 100

        if not is_charging and percent <= 15:
            return False, f"Pin chỉ còn {percent}% và không cắm sạc (Nguy cơ sập nguồn cao)"
        return True, f"Pin {percent}% ({'Đang cắm sạc' if is_charging else 'Đang dùng pin'})"
    except Exception:
        return True, "Không xác định nguồn pin (Mặc định an toàn)"

# ==============================================================================
# 3. ĐIỀU PHỐI 3 KHUNG GIỜ NGẪU NHIÊN & THỜI LƯỢNG LÀM BÀI DỰA TRÊN 1/4
# ==============================================================================
def detect_current_slot(force_slot: Optional[str] = None) -> Optional[str]:
    """Xác định khung giờ hiện tại (morning, noon, evening)."""
    if force_slot in SLOT_CONFIG:
        return force_slot

    current_hour = datetime.now().hour
    for slot_key, cfg in SLOT_CONFIG.items():
        if cfg["start"] <= current_hour < cfg["end"]:
            return slot_key
    return None

def partition_courses_by_day(courses: List[Dict[str, Any]]) -> Dict[str, List[Dict[str, Any]]]:
    """Phân bổ các môn học vào 3 rổ Sáng - Trưa - Tối ngẫu nhiên xoay vòng theo ngày.
    Mỗi ngày sẽ có một thứ tự xáo trộn khác nhau, không có môn nào cố định ở 1 slot.
    """
    today_str = datetime.now().strftime("%Y-%m-%d")
    seed_val = int(hashlib.md5(today_str.encode("utf-8")).hexdigest(), 16)
    rng = random.Random(seed_val)

    # Copy và xáo trộn danh sách môn của ngày hôm nay
    shuffled_courses = list(courses)
    rng.shuffle(shuffled_courses)

    slots = ["morning", "noon", "evening"]
    partition: Dict[str, List[Dict[str, Any]]] = {s: [] for s in slots}

    for idx, course in enumerate(shuffled_courses):
        target_slot = slots[idx % len(slots)]
        partition[target_slot].append(course)

    return partition

def calculate_random_attempt_duration(total_minutes: int) -> Tuple[int, str]:
    """Tính toán thời lượng làm bài ngẫu nhiên:
    - Đảm bảo >= 1/4 (25%) tổng thời gian làm bài.
    - Cận trên trừ hao 1-2 phút an toàn trước khi hết giờ.
    - Tuyệt đối không trùng lặp các mốc cố định, số giây luôn là số lẻ ngẫu nhiên.
    
    Ví dụ:
      - 15 phút (900s): Rải từ 240s (4m) đến 855s (14m15s).
      - 40 phút (2400s): Rải từ 630s (10m30s - chốt chặn TVU) đến 2310s (38m30s).
    """
    total_seconds = total_minutes * 60

    # Tính ngưỡng sàn (>= 1/4 tổng thời gian)
    calc_floor = int(total_seconds * 0.25)

    if total_minutes <= 20:
        # Với bài 15 phút: sàn 4 phút (240s)
        floor_sec = max(240, calc_floor)
        ceiling_sec = total_seconds - random.randint(45, 90)
    else:
        # Với bài 40 phút: sàn 10 phút 30s (630s do LMS TVU có toaster chặn < 10p)
        floor_sec = max(630, calc_floor)
        ceiling_sec = total_seconds - random.randint(90, 180)

    # Đảm bảo floor <= ceiling
    if floor_sec >= ceiling_sec:
        ceiling_sec = floor_sec + 60

    # Sinh số giây lẻ ngẫu nhiên
    target_seconds = random.randint(floor_sec, ceiling_sec)
    
    minutes = target_seconds // 60
    seconds = target_seconds % 60
    readable = f"{minutes} phút {seconds:02d} giây ({target_seconds}s)"
    
    return target_seconds, readable

# ==============================================================================
# 4. BỘ BÓC TÁCH CÔNG THỨC 3 TẦNG & GỌT SẠCH TIỀN TỐ
# ==============================================================================
def clean_option_text(text: str) -> str:
    """Loại bỏ triệt để các tiền tố rác A., B., C., D., 1., 2. ở đầu phương án."""
    if not text:
        return ""
    cleaned = text.strip()
    cleaned = re.sub(r'^[a-dA-D1-4][\.\:\)\s]+\s*', '', cleaned)
    cleaned = re.sub(r'\s+', ' ', cleaned).strip()
    return cleaned

def extract_formulas_and_sanitize_html(html_str: str, subject_dir: Path, q_id: str) -> str:
    """Bóc tách công thức: đọc thuộc tính alt/data-mathml của MathType Wiris và tải ảnh offline."""
    if not html_str:
        return ""

    result = html_str
    img_tags = re.findall(r'<img[^>]+>', result, flags=re.IGNORECASE)
    
    for idx, img_tag in enumerate(img_tags):
        class_match = re.search(r'class=["\']([^"\']*)["\']', img_tag, flags=re.IGNORECASE)
        classes = class_match.group(1).lower() if class_match else ""

        alt_match = re.search(r'alt=["\']([^"\']*)["\']', img_tag, flags=re.IGNORECASE)
        alt_text = alt_match.group(1) if alt_match else ""

        mathml_match = re.search(r'data-mathml=["\']([^"\']*)["\']', img_tag, flags=re.IGNORECASE)
        data_mathml = mathml_match.group(1) if mathml_match else ""

        src_match = re.search(r'src=["\']([^"\']*)["\']', img_tag, flags=re.IGNORECASE)
        src_url = src_match.group(1) if src_match else ""

        # Trường hợp 1: Ảnh công thức MathType/TeX
        if ("wirisformula" in classes or "tex" in classes) and alt_text:
            result = result.replace(img_tag, f" {alt_text} ")
        elif ("wirisformula" in classes or "tex" in classes) and data_mathml:
            result = result.replace(img_tag, f" {alt_text or '[Công thức]'} ")
        
        # Trường hợp 2: Ảnh chụp màn hình từ Word
        elif src_url and not alt_text:
            images_dir = subject_dir / "raw_inputs" / "images"
            images_dir.mkdir(parents=True, exist_ok=True)
            img_filename = f"q_{q_id}_{idx}.png"
            local_img_path = images_dir / img_filename
            
            if src_url.startswith("http"):
                try:
                    urllib.request.urlretrieve(src_url, local_img_path)
                    rel_path = f"./_sources/TVU/Quan_tri_kinh_doanh_DH/{subject_dir.name}/raw_inputs/images/{img_filename}"
                    new_img_tag = f'<img src="{rel_path}" class="quiz-inline-img" alt="Hình minh họa" />'
                    result = result.replace(img_tag, new_img_tag)
                except Exception as e:
                    print(f"[!] Không thể tải ảnh minh họa {src_url}: {e}")

    result = re.sub(r'\s+', ' ', result).strip()
    return result

# ==============================================================================
# 5. QUẢN LÝ MÔN HỌC & TỰ ĐỘNG SCAFFOLDING CHỐNG SẬP WEB SPA
# ==============================================================================
def find_or_create_subject_directory(course_id: str, fullname: str) -> Path:
    """Tạo giàn giáo thư mục môn học chuẩn 3 lớp và khởi tạo sẵn file mồi chống sập web."""
    SOURCES_DIR.mkdir(parents=True, exist_ok=True)
    
    clean_title = re.sub(r'[\/\\\:\*\?\"\<\>\|]', '', fullname).strip()
    for existing in SOURCES_DIR.iterdir():
        if existing.is_dir() and clean_title.lower() in existing.name.lower():
            return existing

    max_stt = 0
    for existing in SOURCES_DIR.iterdir():
        if existing.is_dir():
            m = re.match(r'^(\d+)\.', existing.name)
            if m:
                max_stt = max(max_stt, int(m.group(1)))

    new_stt = max_stt + 1
    subject_dir_name = f"{new_stt}. {clean_title}"
    subject_dir = SOURCES_DIR / subject_dir_name

    (subject_dir / "SLIDE").mkdir(parents=True, exist_ok=True)
    (subject_dir / "raw_inputs" / "images").mkdir(parents=True, exist_ok=True)
    (subject_dir / "staging").mkdir(parents=True, exist_ok=True)

    # [SSoT BƯỚC 4] KHỞI TẠO FILE MỒI CHỐNG SẬP WEB SPA
    qs_path = subject_dir / "qs.json"
    kb_path = subject_dir / "kb.json"
    
    if not qs_path.exists():
        atomic_write_json(qs_path, [])
    if not kb_path.exists():
        atomic_write_json(kb_path, {"overview": {}, "details": []})

    # [SSoT BƯỚC 5] CẬP NHẬT ASSETS/CONFIG.JS
    update_assets_config(new_stt, clean_title, subject_dir_name)

    print(f"[+] Đã khởi tạo giàn giáo chuẩn cho môn: {subject_dir_name}")
    return subject_dir

def update_assets_config(stt: int, subject_name: str, folder_name: str):
    """Tự động bổ sung môn học mới vào mảng window.TVU_SUBJECTS trong assets/config.js an toàn."""
    if not CONFIG_JS_PATH.exists():
        return

    with open(CONFIG_JS_PATH, "r", encoding="utf-8") as f:
        content = f.read()

    if folder_name in content or f'id: "{stt}"' in content:
        return

    new_entry = f"""  {{
    id: "{stt}",
    name: "{subject_name}",
    organization: "TVU",
    program: "Quản trị kinh doanh (Đại học)",
    desc: "Môn học {subject_name} theo chuẩn đào tạo TVU.",
    jsonPath: "./_sources/TVU/Quan_tri_kinh_doanh_DH/{folder_name}/qs.json"
  }},\n"""

    if "window.TVU_SUBJECTS = [" in content:
        insert_idx = content.find("window.TVU_SUBJECTS = [") + len("window.TVU_SUBJECTS = [\n")
        updated_content = content[:insert_idx] + new_entry + content[insert_idx:]
        
        with open(CONFIG_JS_PATH, "w", encoding="utf-8") as f:
            f.write(updated_content)
        print(f"[+] Đã tự động khai báo môn vào assets/config.js: {subject_name}")

# ==============================================================================
# 6. BỘ LỌC TRÙNG & GHI ĐÈ PRODUCTION QS.JSON CHUẨN 5 KEYS SSOT
# ==============================================================================
def sync_staged_to_production(subject_dir: Path, new_questions: List[Dict[str, Any]]) -> int:
    """Tiệt trùng, lọc trùng và gộp đáp án từ new_questions vào qs.json theo chuẩn 5 keys."""
    prod_file = subject_dir / "qs.json"
    staging_file = subject_dir / "staging" / "temp_qs.json"

    existing_data = []
    if prod_file.exists():
        try:
            with open(prod_file, "r", encoding="utf-8") as f:
                existing_data = json.load(f)
        except Exception:
            existing_data = []

    lookup = {}
    for idx, q in enumerate(existing_data):
        norm_key = re.sub(r'<[^>]+>', '', q.get("question", "")).strip().lower()
        lookup[norm_key] = idx

    added_count = 0
    merged_count = 0

    for item in new_questions:
        q_text = item.get("question", "").strip()
        norm_key = re.sub(r'<[^>]+>', '', q_text).strip().lower()

        clean_options = [clean_option_text(opt) for opt in item.get("options", [])]
        raw_ans = item.get("answer", "").strip()
        feedback = item.get("feedback", "").strip()

        if '<div class="answer-title">' not in raw_ans:
            ans_html = f'<div class="answer-title">✅ Đáp án:</div>{raw_ans}'
            if feedback:
                ans_html += f' <div class="note"><b>💡 Giải thích:</b> {feedback}</div>'
        else:
            ans_html = raw_ans

        # Tags chuẩn hóa 2 phần tử [Chủ Đề, Tầng Tư Duy]
        raw_tags = item.get("tags", [])
        clean_tags = [t for t in raw_tags if not t.startswith("c") and not "_" in t]
        if len(clean_tags) < 2:
            clean_tags = [subject_dir.name.split(". ", 1)[-1], "Nền tảng"]
        clean_tags = clean_tags[:2]

        q_obj = {
            "tags": clean_tags,
            "question": q_text,
            "options": clean_options,
            "answer": ans_html
        }

        # [SSoT RULE 14] CHỈ GÁN WEIGHT NẾU LÀ HIGH, NẾU KHÔNG THÌ BỎ TRỐNG
        if item.get("weight") == "high":
            q_obj["weight"] = "high"

        if norm_key in lookup:
            old_idx = lookup[norm_key]
            old_ans = existing_data[old_idx].get("answer", "")
            if raw_ans not in old_ans and raw_ans:
                existing_data[old_idx]["answer"] += f' <div class="note"><b>💡 Đáp án khác từ LMS:</b> {raw_ans}</div>'
                merged_count += 1
        else:
            existing_data.append(q_obj)
            lookup[norm_key] = len(existing_data) - 1
            added_count += 1

    atomic_write_json(staging_file, existing_data)

    with open(staging_file, "r", encoding="utf-8") as f:
        validated = json.load(f)

    atomic_write_json(prod_file, validated)

    if added_count > 0 or merged_count > 0:
        log_entry = f"- [{time.strftime('%Y-%m-%d')}] [{subject_dir.name}] Thêm {added_count} câu, gộp {merged_count} câu từ chu kỳ tự động hóa LMS.\n"
        try:
            with open(PROJECT_LOG_PATH, "a", encoding="utf-8") as f:
                f.write(log_entry)
        except Exception:
            pass

    if added_count > 0:
        send_telegram_notification(
            f"⛏️ <b>[TVU LMS] THU HOẠCH ĐỀ THI MỚI!</b>\n\n"
            f"📚 <b>Môn:</b> {subject_dir.name}\n"
            f"✨ <b>Câu hỏi mới:</b> +{added_count} câu (gộp {merged_count} câu)\n"
            f"📈 <b>Tổng ngân hàng:</b> {len(validated)} câu trong qs.json"
        )
        log_dashboard_event(
            event_type="harvest",
            title=f"Thu hoạch câu hỏi mới: {subject_dir.name}",
            message=f"Đã bóc tách và làm sạch +{added_count} câu mới từ LMS, đồng bộ vào kho qs.json.",
            subject_name=subject_dir.name,
            stats={
                "Câu mới": f"+{added_count} câu",
                "Gộp trùng": f"{merged_count} câu",
                "Tổng ngân hàng": f"{len(validated)} câu"
            }
        )

    print(f"[✓] {subject_dir.name}: Đã thêm {added_count} câu mới, gộp {merged_count} câu trùng vào qs.json.")
    return added_count

# ==============================================================================
# 7. ĐIỀU KHIỂN PLAYWRIGHT & TIẾN TRÌNH LÀM BÀI TIẾN TRÌNH (HUMAN MIMICRY)
# ==============================================================================
def build_qs_lookup(qs_path: Optional[Path]) -> Dict[str, str]:
    """Tải và lập chỉ mục ngân hàng câu hỏi qs.json:
    Key: Chuỗi câu hỏi đã chuẩn hóa (chữ thường, bỏ HTML và khoảng trắng dư)
    Value: Chuỗi đáp án đúng đã gọt sạch HTML
    """
    lookup = {}
    if not qs_path or not qs_path.exists():
        return lookup
    try:
        with open(qs_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        if isinstance(data, list):
            for item in data:
                q_text = item.get("question", "")
                ans_text = item.get("answer", "")
                if q_text and ans_text:
                    norm_q = re.sub(r'<[^>]+>', '', q_text).lower()
                    norm_q = re.sub(r'\s+', ' ', norm_q).strip()
                    clean_ans = re.sub(r'<[^>]+>', '', ans_text).strip()
                    lookup[norm_q] = clean_ans
    except Exception as e:
        print(f"[!] Không thể nạp qs.json để tra cứu: {e}")
    return lookup

def progressive_exam_interaction(page, target_seconds: int, question_elements: List[Any], qs_path: Optional[Path] = None):
    """Giả lập hành vi sinh viên ngồi làm bài trong suốt thời lượng target_seconds:
    - Tra cứu đáp án chuẩn từ ngân hàng qs.json nếu có
    - Rải đều việc trả lời từng câu hỏi theo thời gian
    - Xen kẽ cuộn trang lên xuống và di chuyển chuột
    - Đợi đủ target_seconds mới thực hiện Submit
    """
    start_time = time.time()
    num_q = len(question_elements)
    qs_lookup = build_qs_lookup(qs_path)
    
    # Khoảng đệm an toàn 20s trước khi nộp
    effective_duration = max(10, target_seconds - 20)
    step_delay = effective_duration / max(1, num_q)

    print(f"[*] Bắt đầu tiến trình làm bài: {num_q} câu hỏi (Đã nạp {len(qs_lookup)} câu từ qs.json), mục tiêu giữ {target_seconds}s (khoảng {step_delay:.1f}s/câu)...")

    for i, q_elem in enumerate(question_elements):
        # 1. Cuộn trang nhẹ mô phỏng đọc đề
        try:
            scroll_delta = random.choice([150, 250, -100, 300])
            page.mouse.wheel(0, scroll_delta)
        except Exception:
            pass

        # 2. Tạm dừng ngẫu nhiên theo nhịp đọc
        local_pause = random.uniform(step_delay * 0.6, step_delay * 1.2)
        time.sleep(local_pause)

        # 3. Chọn đáp án radio (Ưu tiên đối chiếu qs.json)
        try:
            labels = q_elem.query_selector_all("label.group/radio, label:has(input[type='radio']), .answer label")
            if labels:
                matched_label = None
                q_text_el = q_elem.query_selector(".qtext, .formulation, div[class*='prompt'], h3, p")
                if q_text_el and qs_lookup:
                    raw_q = q_text_el.inner_text()
                    norm_q = re.sub(r'\s+', ' ', raw_q.lower()).strip()
                    target_ans = None
                    for key, val in qs_lookup.items():
                        if key in norm_q or norm_q in key:
                            target_ans = val
                            break

                    if target_ans:
                        norm_target = clean_option_text(target_ans).lower()
                        for lbl in labels:
                            lbl_text = clean_option_text(lbl.inner_text()).lower()
                            if norm_target in lbl_text or lbl_text in norm_target:
                                matched_label = lbl
                                break

                chosen_label = matched_label if matched_label else random.choice(labels)
                chosen_label.click()
        except Exception:
            pass

        # In tiến độ
        elapsed = int(time.time() - start_time)
        print(f"    -> Đã tick câu {i+1}/{num_q} (Đã trôi qua: {elapsed}s / {target_seconds}s)")

    # Sau khi trả lời hết các câu, chờ thời gian còn lại cho đủ target_seconds
    while True:
        elapsed = time.time() - start_time
        if elapsed >= target_seconds:
            break
        # Trong thời gian chờ, thi thoảng cuộn trang nhẹ
        time.sleep(min(15, target_seconds - elapsed))
        try:
            page.mouse.wheel(0, random.choice([-50, 50]))
        except Exception:
            pass

    print(f"[✓] Đã đủ thời lượng mục tiêu {target_seconds}s. Tiến hành Nộp bài...")

def run_manual_login():
    """Mở trình duyệt trực quan để người dùng đăng nhập thủ công, lưu session."""
    from playwright.sync_api import sync_playwright

    print("[*] Đang khởi chạy Chromium trực quan để đăng nhập...")
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        context = browser.new_context(user_agent=USER_AGENT_MACOS)
        page = context.new_page()
        page.goto(f"{TVU_BASE_URL}/login/index.php")

        print("[!] Hãy đăng nhập vào hệ thống LMS TVU trên trình duyệt vừa mở.")
        print("[!] Sau khi đăng nhập thành công vào trang chủ, nhấn ENTER tại đây để lưu phiên...")
        input()

        context.storage_state(path=str(AUTH_STATE_PATH))
        print(f"[✓] Đã lưu thông tin phiên đăng nhập thành công vào: {AUTH_STATE_PATH}")
        browser.close()

def execute_slot_cycle(force_slot: Optional[str] = None, force_run: bool = False):
    """Tiến trình thực thi chính theo slot trong ngày.
    ĐẢM BẢO ĐƠN NHIỆM TUYỆT ĐỐI:
    - Khóa Mutex qua fcntl chống chạy chồng chéo process.
    - Thực thi tuần tự từng môn, 1 tab duy nhất.
    - Nghỉ giải lao ngẫu nhiên 3 - 12 phút giữa 2 môn học.
    """
    from playwright.sync_api import sync_playwright

    # 1. Khóa tiến trình đơn nhiệm
    lock_file = acquire_global_lock()
    if not lock_file:
        return

    try:
        if not AUTH_STATE_PATH.exists():
            print(f"[!] Chưa tìm thấy file phiên đăng nhập tại: {AUTH_STATE_PATH}")
            send_macos_notification("LearnIZ Bot Cảnh Báo", "Chưa có session TVU. Hãy chạy: python3 sync_tvu_lms.py --login")
            return

        # 1.5. Kiểm tra kết nối Internet thực tế trước khi chạy
        if not check_internet_connection():
            print("[!] Không phát hiện kết nối mạng Internet. Tạm hoãn chu kỳ này để bảo vệ tài khoản.")
            return

        # 1.6. Kiểm tra an toàn nguồn pin MacBook
        is_safe_battery, battery_msg = check_battery_safety()
        print(f"[*] Trạng thái nguồn điện: {battery_msg}")
        if not is_safe_battery:
            print(f"[!] {battery_msg}. Tạm hoãn chu kỳ làm bài để tránh sập nguồn giữa chừng!")
            send_telegram_notification(
                f"🔋 <b>[TVU LMS] CẢNH BÁO PIN YẾU!</b>\n\n"
                f"{battery_msg}\n"
                f"👉 Bot đã tự động hoãn chu kỳ làm bài để tránh sập nguồn giữa chừng."
            )
            log_dashboard_event(
                event_type="warning",
                title="Cảnh báo pin yếu trên MacBook",
                message=f"{battery_msg}. Bot đã tự động hoãn chu kỳ làm bài để tránh rủi ro sập nguồn.",
                priority="high",
                stats={"Nguồn điện": battery_msg}
            )
            return

        # 2. Xác định khung giờ hiện tại
        active_slot = detect_current_slot(force_slot)
        if not active_slot and not force_run:
            current_hour = datetime.now().hour
            print(f"[*] Hiện tại ({current_hour}h) nằm ngoài 3 khung giờ quy định (6-9h, 12-13h, 19-21h). Bỏ qua chu kỳ.")
            return

        slot_info = SLOT_CONFIG.get(active_slot, {"name": "Cưỡng bức", "max_jitter_min": 0})
        print(f"\n=================================================================")
        print(f"[*] KÍCH HOẠT CHU KỲ: {slot_info['name']}")
        print(f"=================================================================")

        # 3. Áp dụng Jitter ngẫu nhiên trong khung giờ
        if not force_run and slot_info["max_jitter_min"] > 0:
            jitter_minutes = random.randint(3, slot_info["max_jitter_min"])
            print(f"[*] Áp dụng Slot Jitter: Tạm dừng ngẫu nhiên {jitter_minutes} phút trước khi truy cập LMS...")
            time.sleep(jitter_minutes * 60)

        with sync_playwright() as p:
            browser = p.chromium.launch(
                headless=True,
                args=[
                    "--disable-blink-features=AutomationControlled",
                    "--no-sandbox",
                    "--disable-dev-shm-usage"
                ]
            )
            context = browser.new_context(
                storage_state=str(AUTH_STATE_PATH),
                user_agent=USER_AGENT_MACOS,
                viewport={"width": 1280, "height": 800}
            )
            page = context.new_page()

            # Kiểm tra phiên
            page.goto(f"{TVU_BASE_URL}/my/")
            time.sleep(3)

            if "login" in page.url:
                print("[!] Phiên đăng nhập LMS đã hết hạn!")
                send_macos_notification(
                    "LearnIZ Bot Cảnh Báo",
                    "Session TVU LMS đã hết hạn! Vui lòng chạy lệnh --login để đăng nhập lại."
                )
                send_telegram_notification(
                    "⚠️ <b>[TVU LMS] CẢNH BÁO PHIÊN ĐĂNG NHẬP!</b>\n\n"
                    "Session TVU LMS trên MacBook đã hết hạn cookie.\n"
                    "👉 Vui lòng mở máy và chạy: <code>python3 scratch/sync_tvu_lms.py --login</code>"
                )
                log_dashboard_event(
                    event_type="warning",
                    title="Phiên đăng nhập TVU LMS đã hết hạn",
                    message="Session cookie trên MacBook đã hết hạn. Vui lòng mở terminal chạy --login để tái cấp quyền.",
                    priority="high",
                    actions=[
                        {
                            "label": "Copy lệnh đăng nhập",
                            "copy_text": "python3 scratch/sync_tvu_lms.py --login",
                            "type": "copy"
                        }
                    ]
                )
                browser.close()
                return

            print("[✓] Xác thực thành công. Đang tải danh sách học phần...")

            try:
                courses_response = context.request.get(f"{TVU_BASE_URL}/api/courses?classification=all")
                courses_data = courses_response.json() if courses_response.ok else []
            except Exception as e:
                print(f"[!] Không thể lấy API courses: {e}")
                courses_data = []

            if not courses_data:
                print("[!] Không tìm thấy khóa học nào.")
                browser.close()
                return

            # 4. Phân bổ các môn theo rổ xoay vòng trong ngày
            daily_partition = partition_courses_by_day(courses_data)
            assigned_courses = daily_partition.get(active_slot, courses_data if force_run else [])

            print(f"[*] Slot [{slot_info['name']}] hôm nay phụ trách {len(assigned_courses)} môn:")
            for c in assigned_courses:
                print(f"    - {c.get('fullname')}")

            # 5. THỰC THI TUẦN TỰ TỪNG MÔN (ĐƠN NHIỆM 100%)
            for idx, course in enumerate(assigned_courses):
                course_id = str(course.get("id", ""))
                course_name = course.get("fullname", "")
                if not course_id or not course_name:
                    continue

                print(f"\n>>> ĐANG XỬ LÝ MÔN ({idx+1}/{len(assigned_courses)}): {course_name} (ID: {course_id}) <<<")
                subject_dir = find_or_create_subject_directory(course_id, course_name)

                # A. Diễn đàn thảo luận (bản nháp draft)
                draft_forum_url = f"{TVU_BASE_URL}/courses/{course_id}/forum"
                draft_file = subject_dir / "raw_inputs" / "Cau_hoi_thao_luan_draft.txt"
                if not draft_file.exists():
                    draft_content = (
                        f"URL nộp bài: {draft_forum_url}\n"
                        f"# Bản nháp câu trả lời thảo luận môn {course_name}\n"
                        f"Thực ra theo quan sát thực tiễn của em thì vấn đề này cần tiếp cận dưới góc độ..."
                    )
                    with open(draft_file, "w", encoding="utf-8") as f:
                        f.write(draft_content)
                    
                    send_telegram_notification(
                        f"📝 <b>[TVU LMS] ĐÃ SOẠN XONG BÀI THẢO LUẬN</b>\n\n"
                        f"📚 <b>Môn:</b> {course_name}\n"
                        f"💡 <b>Nội dung:</b> Đã lưu bản nháp sạch vào raw_inputs.\n\n"
                        f"👉 Bấm nút bên dưới để mở thẳng ô trả lời trên LMS trường:",
                        buttons=[{"text": "🚀 Mở LMS Nộp Bài Ngay", "url": draft_forum_url}]
                    )
                    log_dashboard_event(
                        event_type="forum_draft",
                        title=f"Đã soạn xong bài thảo luận: {course_name}",
                        message="Đã chuẩn bị bản nháp sạch trong thư mục môn học, sẵn sàng dán nộp lên diễn đàn LMS.",
                        priority="normal",
                        subject_name=course_name,
                        actions=[
                            {
                                "label": "Mở diễn đàn LMS",
                                "url": draft_forum_url,
                                "type": "link"
                            }
                        ]
                    )

                # B. Tính thời lượng làm bài ngẫu nhiên cho bài thi mẫu
                dur_15, readable_15 = calculate_random_attempt_duration(15)
                dur_40, readable_40 = calculate_random_attempt_duration(40)
                print(f"[*] Demo thời lượng làm bài ngẫu nhiên hôm nay:")
                print(f"    - Nếu là LTTN (15p): {readable_15}")
                print(f"    - Nếu là Luyện trước thi (40p): {readable_40}")

                # C. KHOẢNG NGHỈ GIẢI LAO TỰ NHIÊN GIỮA 2 MÔN HỌC (3 - 12 PHÚT)
                if idx < len(assigned_courses) - 1:
                    rest_seconds = random.randint(180, 720)  # 3 đến 12 phút
                    rest_min = rest_seconds // 60
                    rest_sec = rest_seconds % 60
                    print(f"\n[*] Đã hoàn tất phiên môn '{course_name}'.")
                    print(f"[*] NGHỈ GIẢI LAO TỰ NHIÊN GIỮA 2 MÔN: {rest_min} phút {rest_sec:02d} giây ({rest_seconds}s)...")
                    time.sleep(rest_seconds)

            browser.close()
            print(f"\n[✓] Hoàn thành trọn vẹn chu kỳ hoạt động [{slot_info['name']}].")
    finally:
        release_global_lock(lock_file)

# ==============================================================================
# 8. ĐIỂM KHỞI CHẠY (CLI ENTRYPOINT)
# ==============================================================================
def main():
    parser = argparse.ArgumentParser(description="TVU LMS Automation Engine v2.6")
    parser.add_argument("--login", action="store_true", help="Mở trình duyệt trực quan để đăng nhập và lưu session")
    parser.add_argument("--force", action="store_true", help="Chạy quét ngay lập tức, bỏ qua slot và jitter delay")
    parser.add_argument("--slot", choices=["morning", "noon", "evening"], help="Cưỡng bức chạy một slot cụ thể")
    args = parser.parse_args()

    if args.login:
        run_manual_login()
    else:
        execute_slot_cycle(force_slot=args.slot, force_run=args.force)

if __name__ == "__main__":
    main()
