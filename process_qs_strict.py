import json
import re

bp_path = '_sources/TVU/Quan_tri_kinh_doanh_DH/13. GIÁO DỤC THỂ CHẤT 1/blueprint.json'
qs_path = '_sources/TVU/Quan_tri_kinh_doanh_DH/13. GIÁO DỤC THỂ CHẤT 1/qs.json'

with open(bp_path, 'r', encoding='utf-8') as f:
    bp = json.load(f)

# Extract keywords directly from the blueprint based on strict definitions
core_focus = bp.get("core_focus_80_20", {})
root_concepts = core_focus.get("root_concepts", [])
common_traps = core_focus.get("common_traps", [])
high_coverage = core_focus.get("high_coverage", [])

# We manually define regex patterns for each point to ensure strict matching
patterns = [
    # root_concepts
    r"khẩu lệnh.*(dự lệnh|động lệnh)|dự lệnh.*động lệnh",
    r"chạy cự ly ngắn.*(xuất phát|chạy lao|chạy giữa quãng|về đích)|xuất phát thấp|chạy lao",
    r"xuất phát cao.*chạy cự ly trung bình|nhịp thở.*2 bước hít.*2 bước thở|2 bước hít",
    r"quy định thi đấu.*điền kinh|phạm quy.*xuất phát|chạy lấn làn",
    
    # common_traps
    r"bài thể dục phát triển chung.*nhịp 1|nhịp 1.*nhịp 2",
    r"chạy lao.*(tăng tốc độ)|chạy giữa quãng.*(duy trì tốc độ)",
    r"xuất phát thấp.*(100m|200m|400m)|xuất phát cao.*(800m)",
    r"kỹ thuật đánh tay|góc độ ngả người",
    
    # high_coverage
    r"phân phối thể lực|chiến thuật.*chạy cự ly trung bình",
    r"tư thế xuất phát.*(chân thuận|bàn đạp)|chân thuận đặt trước",
    r"lịch sử điền kinh|thế vận hội|olympic|kích thước sân bãi|vận động viên tiêu biểu|kỷ lục"
]

regexes = [re.compile(p, re.IGNORECASE) for p in patterns]

with open(qs_path, 'r', encoding='utf-8') as f:
    qs = json.load(f)

high_count = 0

for q in qs:
    # Build text to search
    text_to_search = q.get('question', '')
    if 'options' in q:
        if isinstance(q['options'], list):
            text_to_search += " " + " ".join([str(o) for o in q['options']])
        elif isinstance(q['options'], dict):
            text_to_search += " " + " ".join([str(o) for o in q['options'].values()])
            
    if 'answer' in q:
        text_to_search += " " + str(q['answer'])

    # Check if matches any pattern strictly
    is_high = False
    for r in regexes:
        if r.search(text_to_search):
            is_high = True
            break
            
    if is_high:
        q['weight'] = 'high'
        high_count += 1
    else:
        q['weight'] = 'normal'

with open(qs_path, 'w', encoding='utf-8') as f:
    json.dump(qs, f, ensure_ascii=False, indent=2)

print(f"Updated {len(qs)} questions in qs.json.")
print(f"Number of 'high' weight questions: {high_count}")
