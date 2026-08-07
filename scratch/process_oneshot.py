import json

# Keywords mapping for Mác - Lênin — tag names rút gọn 2-4 từ
chuyen_de_keywords = {
    "Nền tảng & Lịch sử": [
        "đối tượng", "phương pháp", "trừu tượng", "lịch sử", "nhận thức", "tư tưởng", "chức năng", "thực tiễn", "chính trị", "chủ nghĩa", "mác", "lênin", "trọng nông", "trọng thương", "cổ điển", "nghiên cứu"
    ],
    "Quy luật Kinh tế": [
        "quy luật", "giá trị", "cung cầu", "cạnh tranh", "lưu thông", "giá cả", "lợi nhuận", "bản chất", "tất yếu", "thặng dư", "sức lao động", "tuần hoàn", "chu chuyển", "tích lũy"
    ],
    "Sản xuất & Hàng hóa": [
        "sản xuất", "hàng hóa", "tiền tệ", "tư bản", "độc quyền", "toàn cầu hóa", "hội nhập", "chuyển biến", "nền kinh tế", "công nghiệp hóa", "hiện đại hóa"
    ],
    "Chủ thể & Nhà nước": [
        "chủ thể", "nhà nước", "chính phủ", "thị trường", "quản lý", "điều tiết", "doanh nghiệp", "định hướng", "xã hội chủ nghĩa", "phân phối", "lợi ích"
    ]
}

qs_file = "./11. Kinh tế chính trị Mác - Lênin/Ngan_hang_de_Mac_Lenin_qs.json"

with open(qs_file, 'r', encoding='utf-8') as f:
    qs = json.load(f)

for q in qs:
    text = (q.get("question", "") + " " + q.get("answer", "")).lower()
    
    assigned_tags = []
    
    # Thẻ 80/20: High hoặc Low
    if q.get("weight") == "high":
        assigned_tags.append("High")
    else:
        assigned_tags.append("Low")
    
    # Thẻ Chuyên đề: keyword matching
    best_match = None
    max_score = 0
    for cd, keywords in chuyen_de_keywords.items():
        score = sum(1 for kw in keywords if kw.lower() in text)
        if score > max_score:
            max_score = score
            best_match = cd
    
    if best_match:
        assigned_tags.append(best_match)
    else:
        assigned_tags.append("Nền tảng & Lịch sử")
        
    q["tags"] = assigned_tags

with open(qs_file, 'w', encoding='utf-8') as f:
    json.dump(qs, f, ensure_ascii=False, indent=4)

print("Done. Tagged 117 questions with High/Low + short topic tags.")
