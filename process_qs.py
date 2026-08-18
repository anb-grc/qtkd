import json
import re

qs_path = '_sources/TVU/Quan_tri_kinh_doanh_DH/13. GIÁO DỤC THỂ CHẤT 1/qs.json'
with open(qs_path, 'r', encoding='utf-8') as f:
    qs = json.load(f)

keywords = [
    "khẩu lệnh", "dự lệnh", "động lệnh", "đội hình đội ngũ",
    "xuất phát thấp", "chạy lao", "chạy giữa quãng", "về đích", "cự ly ngắn",
    "xuất phát cao", "nhịp thở", "cự ly trung bình", "hít vào", "thở ra",
    "quy định thi đấu", "phạm quy", "lấn làn",
    "bài thể dục phát triển chung", "nhịp",
    "tăng tốc", "duy trì tốc độ",
    "100m", "200m", "400m", "800m", "1500m",
    "đánh tay", "ngả người", "ngã người",
    "phân phối thể lực", "chiến thuật",
    "chân thuận", "bàn đạp", "tư thế xuất phát",
    "lịch sử", "thế vận hội", "olympic", "sân bãi", "vận động viên", "kỷ lục"
]

regex = re.compile('|'.join(keywords), re.IGNORECASE)

high_count = 0

for q in qs:
    text_to_search = q.get('q', '')
    if 'options' in q:
        for opt in q['options'].values():
            text_to_search += " " + str(opt)
            
    if 'explain' in q and q['explain']:
        text_to_search += " " + str(q['explain'])

    if regex.search(text_to_search):
        q['weight'] = 'high'
        high_count += 1
    else:
        q['weight'] = 'normal'

with open(qs_path, 'w', encoding='utf-8') as f:
    json.dump(qs, f, ensure_ascii=False, indent=2)

print(f"Updated {len(qs)} questions.")
print(f"Number of 'high' questions: {high_count}")
