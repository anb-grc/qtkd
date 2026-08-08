import json
import os

target_path = "/Users/thien-ban/Library/CloudStorage/OneDrive-Personal/03_WORK/11. LearnIZ/_sources/TVU/Quan_tri_kinh_doanh_DH/13. GIÁO DỤC THỂ CHẤT 1/kb.json"

with open(target_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

if isinstance(data, dict):
    # Convert dict to list of chapters
    new_data = [
        {
            "title": data.get("title", "Kiến thức chung"),
            "blocks": data.get("components", [])
        }
    ]
    with open(target_path, 'w', encoding='utf-8') as f:
        json.dump(new_data, f, ensure_ascii=False, indent=2)
    print("Fixed kb.json format successfully.")
else:
    print("kb.json is already in array format.")
