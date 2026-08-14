import json
import os

qs_path = "/Users/thien-ban/Library/CloudStorage/OneDrive-Personal/03_WORK/11. LearnIZ/_sources/TVU/Quan_tri_kinh_doanh_DH/15. TÀI CHÍNH TIỀN TỆ/qs.json"

with open(qs_path, "r", encoding="utf-8") as f:
    questions = json.load(f)

count = 0
for q in questions:
    if "tags" not in q:
        q["tags"] = []
    if "[Kiến thức]" not in q["tags"]:
        q["tags"].append("[Kiến thức]")
        count += 1

with open(qs_path, "w", encoding="utf-8") as f:
    json.dump(questions, f, ensure_ascii=False, indent=2)

print(f"Đã thêm tag [Kiến thức] vào {count} câu hỏi.")
