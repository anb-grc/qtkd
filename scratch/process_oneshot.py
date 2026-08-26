import json, re

path = 'staging/temp_qs.json'
with open(path, 'r', encoding='utf-8') as f:
    qs = json.load(f)

# Define categories and their strong keywords
categories = {
    "ĐỘI HÌNH ĐỘI NGŨ VÀ BÀI THỂ DỤC PHÁT TRIỂN CHUNG": [
        'tập hợp', 'hàng ngang', 'hàng dọc', 'điểm số', 'dóng hàng', 'quay phải', 'quay trái', 
        'đằng sau quay', 'đi đều', 'đứng lại', 'đổi chân', 'vươn thở', 'tay', 'ngực', 'bụng', 
        'vặn mình', 'phối hợp', 'điều hòa', 'đội hình', 'chỉ huy', 'khẩu lệnh', 'dự lệnh', 
        'động lệnh', 'cự ly', 'giãn cách', 'bước', 'đội ngũ', 'nghiêm', 'nghỉ'
    ],
    "KỸ THUẬT CHẠY CỰ LY NGẮN": [
        'ngắn', '100m', '200m', '400m', 'xuất phát thấp', 'bàn đạp', 'chạy lao', 'giữa quãng', 
        'về đích', 'đánh tay', 'góc độ', 'tiếp sức', 'trao gậy', 'nhận gậy', 'tốc độ tối đa', 
        'phản ứng', 'lấn làn', 'xuất phát sớm', 'phạm quy xuất phát', 'sẵn sàng', 'vào chỗ'
    ],
    "KỸ THUẬT CHẠY CỰ LY TRUNG BÌNH": [
        'trung bình', 'cự ly dài', '800m', '1500m', '3000m', '5000m', '10000m', 'marathon', 
        'việt dã', 'xuất phát cao', 'không bàn đạp', 'chạy vòng cua', 'ly tâm', 'hô hấp', 
        'nhịp thở', 'phân phối', 'kiệt sức', 'cực điểm', 'hô hấp thứ hai', 'rút đích', 'chiến thuật'
    ],
    "NHẬP MÔN ĐIỀN KINH": [
        'lịch sử', 'olympic', 'cổ đại', 'hiện đại', 'hy lạp', 'iaaf', 'world athletics', 'liên đoàn', 
        'điền kinh', 'thể thao nữ hoàng', 'nền tảng', 'cơ sở', 'ném lao', 'đẩy tạ', 'nhảy xa', 
        'nhảy cao', 'trọng tài', 'tổng trọng tài', 'sân bãi', 'đường chạy', 'kỷ lục', 'sea games', 
        'asiad', 'nguyễn văn lai', 'hoàng nguyên thanh', 'châu lục', 'việt nam', 'vận động viên'
    ]
}

# Determine new tags
for q in qs:
    text = (q.get('question', '') + " " + q.get('answer', '') + " " + " ".join(q.get('options', []))).lower()
    
    best_cat = "NHẬP MÔN ĐIỀN KINH"
    max_score = -1
    
    for cat, kws in categories.items():
        score = sum(text.count(kw) for kw in kws)
        # Give exact match heavy weight
        if cat.lower() in text:
            score += 10
        if score > max_score:
            max_score = score
            best_cat = cat
            
    # Fallback to Nhập môn if score is very low
    if max_score == 0:
        best_cat = "NHẬP MÔN ĐIỀN KINH"
        
    old_tags = q.get('tags', [])
    fw_tag = "[Nền tảng]"
    for t in old_tags:
        if t in ["[Nền tảng]", "[Cấu trúc]", "[Hệ thống]", "[Phân luồng]", "[Logic & Nguyên tắc]", "[Giới hạn & Rủi ro]", "[Góc nhìn Đa chiều]"]:
            fw_tag = t
            break
        # also handle versions without brackets just in case
        if t in ["Nền tảng", "Cấu trúc", "Hệ thống", "Phân luồng", "Logic & Nguyên tắc", "Giới hạn & Rủi ro", "Góc nhìn Đa chiều"]:
            fw_tag = t
            break
            
    # Clean bracket from fw_tag
    fw_tag = fw_tag.replace('[', '').replace(']', '')
    
    q['tags'] = [best_cat, fw_tag]

# Recalculate weights based on 80/20 Target per category
# Total = 197. Highs = 60.
# NGẮN: 40% of 60 = 24
# TRUNG BÌNH: 30% of 60 = 18
# ĐỘI HÌNH: 20% of 60 = 12
# NHẬP MÔN: 10% of 60 = 6

high_keywords = ['cốt lõi', 'phân biệt', 'nguyên lý', 'bản chất', 'phạm quy', 'không được', 'bắt buộc', 'quyết định', 'lỗi', 'sai', 'tại sao', 'mục đích']

cat_pools = {k: [] for k in categories.keys()}
for q in qs:
    q.pop('weight', None) # Clear old weight
    cat_pools[q['tags'][0]].append(q)

targets = {
    "KỸ THUẬT CHẠY CỰ LY NGẮN": 24,
    "KỸ THUẬT CHẠY CỰ LY TRUNG BÌNH": 18,
    "ĐỘI HÌNH ĐỘI NGŨ VÀ BÀI THỂ DỤC PHÁT TRIỂN CHUNG": 12,
    "NHẬP MÔN ĐIỀN KINH": 6
}

for cat, pool in cat_pools.items():
    # Score each question in pool to pick top targets
    for q in pool:
        text = (q.get('question', '') + " " + q.get('answer', '')).lower()
        score = sum(text.count(kw) for kw in high_keywords)
        q['_score'] = score
        
    # Sort pool descending by score
    pool.sort(key=lambda x: x['_score'], reverse=True)
    
    # Assign 'high' to top N
    n_high = targets[cat]
    for i in range(min(n_high, len(pool))):
        pool[i]['weight'] = 'high'
        
    # Cleanup temp score
    for q in pool:
        q.pop('_score', None)

with open(path, 'w', encoding='utf-8') as f:
    json.dump(qs, f, ensure_ascii=False, indent=2)

print("Processed Successfully!")
