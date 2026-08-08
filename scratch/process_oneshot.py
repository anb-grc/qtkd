import json
import os

path = "_sources/TVU/Quan_tri_kinh_doanh_DH/13. GIÁO DỤC THỂ CHẤT 1/kb.json"

if not os.path.exists(path):
    print("File not found")
    exit(1)

with open(path, "r", encoding="utf-8") as f:
    data = json.load(f)

for chapter in data:
    for block in chapter.get("blocks", []):
        if block["type"] == "HeroCard":
            block["type"] = "features"
            title = block["data"].get("title", "")
            sub = block["data"].get("subtitle", "")
            desc = block["data"].get("description", "")
            full_desc = f"<strong>{sub}</strong><br/>{desc}" if sub else desc
            block["data"] = {
                "items": [{"title": title, "description": full_desc}]
            }
        elif block["type"] == "ProcessSteps":
            block["type"] = "process-steps"
        elif block["type"] == "ComparisonTable":
            block["type"] = "matrix-table"
        elif block["type"] == "DeltaCheatSheet":
            block["type"] = "features"
            items = block["data"].get("items", [])
            new_items = []
            for it in items:
                new_items.append({
                    "title": it.get("term", ""),
                    "description": it.get("definition", "")
                })
            block["data"]["items"] = new_items
        elif block["type"] == "EcosystemMap":
            block["type"] = "mindmap"
            center = block["data"].get("center", "")
            nodes = block["data"].get("nodes", [])
            children = []
            for n in nodes:
                children.append({
                    "label": n.get("name", ""),
                    "description": n.get("desc", "")
                })
            block["data"] = {
                "root": center,
                "children": children
            }

with open(path, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Mapping done successfully.")
