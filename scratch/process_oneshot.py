import json

with open('scratch/tctt_chunk_3.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

for node in data:
    node_id = node['node_id']
    old_comp = node['components'][0]
    
    if node_id == "chuong_8_comp_1":
        items = old_comp['data']['items']
        back_text = " \n".join([f"- **{i['title']}**: {i.get('description', '')}" for i in items])
        new_comp = {
            "type": "flip-card",
            "title": old_comp['title'],
            "data": {
                "front": "Các quan điểm định nghĩa về Lạm phát (C.Mác, Samuelson, Milton Friedman, Kinh tế học hiện đại)",
                "back": back_text
            }
        }
        node['components'][0] = new_comp
    elif node_id == "chuong_8_comp_2":
        pass
    elif node_id == "chuong_8_comp_3":
        items = old_comp['data']['layers']
        values = [10, 99, 1000]
        new_items = []
        for i, item in enumerate(items):
            new_items.append({
                "label": item['name'],
                "value": values[i],
                "explanation": item.get('description', '')
            })
        new_comp = {
            "type": "bar-chart",
            "title": old_comp['title'],
            "data": {
                "items": new_items
            }
        }
        node['components'][0] = new_comp
    elif node_id == "chuong_8_comp_4":
        rows = old_comp['data']['rows']
        new_items = []
        for r in rows:
            new_items.append({
                "title": r[0],
                "description": r[1]
            })
        new_comp = {
            "type": "spectrum",
            "title": old_comp['title'],
            "data": {
                "items": new_items
            }
        }
        node['components'][0] = new_comp
    elif node_id == "chuong_8_comp_5":
        left = old_comp['data']['left']
        right = old_comp['data']['right']
        new_comp = {
            "type": "flowchart",
            "title": old_comp['title'],
            "data": {
                "steps": [
                    {
                        "name": left['header'],
                        "description": " | ".join(left['entries'])
                    },
                    {
                        "name": right['header'],
                        "description": ", ".join(right['entries'])
                    }
                ]
            }
        }
        node['components'][0] = new_comp
    elif node_id == "chuong_8_comp_6":
        items = old_comp['data']['items']
        new_comp = {
            "type": "quadrant",
            "title": old_comp['title'],
            "data": {
                "quadrants": [
                    {
                        "title": items[0]['title'],
                        "description": items[0].get('description', '')
                    },
                    {
                        "title": items[1]['title'],
                        "description": items[1].get('description', '')
                    },
                    {
                        "title": items[2]['title'],
                        "description": items[2].get('description', '')
                    },
                    {
                        "title": items[3]['title'],
                        "description": items[3].get('description', '')
                    }
                ]
            }
        }
        node['components'][0] = new_comp
    elif node_id == "chuong_8_comp_7":
        items = old_comp['data']['items']
        new_comp = {
            "type": "decision-tree",
            "title": old_comp['title'],
            "data": {
                "startNodeId": "n1",
                "nodes": {
                    "n1": {
                        "label": "Lựa chọn phương pháp kiềm chế lạm phát",
                        "options": [
                            {"text": items[0]['title'], "nextNodeId": "n2"},
                            {"text": items[1]['title'], "nextNodeId": "n3"},
                            {"text": items[2]['title'], "nextNodeId": "n4"}
                        ]
                    },
                    "n2": {
                        "label": items[0]['title'],
                        "explanation": items[0].get('description', '') or "Biện pháp cổ điển."
                    },
                    "n3": {
                        "label": items[1]['title'],
                        "explanation": items[1].get('description', '') or "Biện pháp hiện nay."
                    },
                    "n4": {
                        "label": items[2]['title'],
                        "explanation": items[2].get('description', '') or "Biện pháp các nước phát triển."
                    }
                }
            }
        }
        node['components'][0] = new_comp
    elif node_id == "chuong_9_comp_1":
        items = old_comp['data']['items']
        new_comp = {
            "type": "formula-breakdown",
            "title": old_comp['title'],
            "data": {
                "formula": "Tỷ giá = Khái niệm + Phương pháp + Nhân tố + Phân loại",
                "variables": [
                    {
                        "symbol": i['title'],
                        "definition": i.get('description', '') or i['title']
                    } for i in items
                ]
            }
        }
        node['components'][0] = new_comp
    elif node_id == "chuong_9_comp_2":
        items = old_comp['data']['items']
        new_comp = {
            "type": "t-account",
            "title": old_comp['title'],
            "data": {
                "left": {
                    "header": "Tài khoản và Cán cân",
                    "entries": [f"{i['title']}: {i.get('description', '')}" for i in items[:2]]
                },
                "right": {
                    "header": "Các yếu tố điều chỉnh",
                    "entries": [f"{i['title']}: {i.get('description', '')}" for i in items[2:]]
                }
            }
        }
        node['components'][0] = new_comp
    elif node_id == "chuong_9_comp_3":
        items = old_comp['data']['items']
        new_comp = {
            "type": "sankey-diagram",
            "title": old_comp['title'],
            "data": {
                "flows": [
                    {
                        "from": "Nguồn vốn quốc tế",
                        "to": i['title'],
                        "value": 50,
                        "explanation": i.get('description', '')
                    } for i in items
                ]
            }
        }
        node['components'][0] = new_comp
    elif node_id == "chuong_9_comp_4":
        items = old_comp['data']['steps']
        new_comp = {
            "type": "decision-tree",
            "title": old_comp['title'],
            "data": {
                "startNodeId": "n1",
                "nodes": {
                    "n1": {
                        "label": items[0]['name'] + ": " + items[0].get('description', ''),
                        "options": [
                            {"text": "Ngắn hạn", "nextNodeId": "n2"},
                            {"text": "Dài hạn", "nextNodeId": "n3"}
                        ]
                    },
                    "n2": {
                        "label": items[1]['name'],
                        "explanation": items[1].get('description', '')
                    },
                    "n3": {
                        "label": items[2]['name'],
                        "explanation": items[2].get('description', '')
                    }
                }
            }
        }
        node['components'][0] = new_comp
    elif node_id == "chuong_9_comp_5":
        rows = old_comp['data']['rows']
        new_comp = {
            "type": "venn",
            "title": old_comp['title'],
            "data": {
                "left": {
                    "title": "Tổ chức tài chính vĩ mô",
                    "items": [
                        f"{rows[0][0]}: {rows[0][1]}. {rows[0][2]}. {rows[0][3]}",
                        f"{rows[1][0]}: {rows[1][1]}. {rows[1][2]}. {rows[1][3]}"
                    ]
                },
                "right": {
                    "title": "Tổ chức phát triển khu vực & con người",
                    "items": [
                        f"{rows[2][0]}: {rows[2][1]}. {rows[2][2]}. {rows[2][3]}",
                        f"{rows[3][0]}: {rows[3][1]}. {rows[3][2]}. {rows[3][3]}"
                    ]
                },
                "intersection": "Hệ thống tổ chức tài chính quốc tế",
                "intersection_items": ["Phát triển kinh tế toàn cầu"]
            }
        }
        node['components'][0] = new_comp

with open('scratch/tctt_chunk_3_done.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Done process_oneshot")
