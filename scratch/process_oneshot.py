import json

path = '_sources/TVU/Quan_tri_kinh_doanh_DH/13. GIÁO DỤC THỂ CHẤT 1/kb.json'
with open(path, 'r', encoding='utf-8') as f:
    kb = json.load(f)

for detail in kb.get('details', []):
    for comp in detail.get('components', []):
        if comp.get('type') == 'features':
            items = comp.get('data', {}).get('items', [])
            new_items = [item for item in items if item.get('title') != 'Mã số học phần']
            if len(new_items) != len(items):
                comp['data']['items'] = new_items
                print("Removed 'Mã số học phần' from component title:", comp.get('title'))

with open(path, 'w', encoding='utf-8') as f:
    json.dump(kb, f, ensure_ascii=False, indent=2)

