import json

bp_path = '_sources/TVU/Quan_tri_kinh_doanh_DH/13. GIÁO DỤC THỂ CHẤT 1/blueprint.json'
with open(bp_path, 'r', encoding='utf-8') as f:
    bp = json.load(f)

bp['core_focus_80_20']['high_coverage'].append(
    "Lịch sử điền kinh, Thế vận hội (Olympics) và Thông tin ngành (Kích thước sân bãi, vận động viên tiêu biểu, kỷ lục)."
)

with open(bp_path, 'w', encoding='utf-8') as f:
    json.dump(bp, f, ensure_ascii=False, indent=2)

print("Blueprint updated.")
