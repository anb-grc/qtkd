import os
import json
import re

base_dir = "/Users/thien-ban/Library/CloudStorage/OneDrive-Personal/03_WORK/11. LearnIZ/_sources/TVU"

def strip_abcd(text):
    if not isinstance(text, str):
        return text
    
    # 1. Bỏ A. B. C. D. ở đầu chuỗi (vd: "A. IOC")
    cleaned = re.sub(r'^\s*[A-D]\.\s*', '', text)
    
    # 2. Bỏ A. B. C. D. ngay sau dấu > (vd: "<span...>A. IOC" hoặc "</div> D. ")
    cleaned = re.sub(r'(>)\s*[A-D]\.\s*', r'\1', cleaned)
    
    # 3. Đảm bảo có khoảng trắng sau "Đáp án:</div>" hoặc "Đáp án:</span>" để text không bị dính
    cleaned = re.sub(r'(Đáp án:<\/div>|Đáp án:<\/span>)([^\s])', r'\1 \2', cleaned)
    
    # 4. Trường hợp Đáp án trơn không có HTML (vd: "Đáp án: D. Ổn định")
    cleaned = re.sub(r'(Đáp án:\s*)[A-D]\.\s*', r'\1', cleaned)
    
    return cleaned

total_files = 0
total_replacements = 0

for root, dirs, files in os.walk(base_dir):
    if "qs.json" in files:
        # Bỏ qua thư mục temp/staging nếu có
        if "staging" in root or "temp" in root:
            continue
            
        file_path = os.path.join(root, "qs.json")
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            is_modified = False
            
            for item in data:
                if 'options' in item and isinstance(item['options'], list):
                    new_options = []
                    for opt in item['options']:
                        new_opt = strip_abcd(opt)
                        if new_opt != opt:
                            is_modified = True
                            total_replacements += 1
                        new_options.append(new_opt)
                    item['options'] = new_options
                
                if 'answer' in item and isinstance(item['answer'], str):
                    new_ans = strip_abcd(item['answer'])
                    if new_ans != item['answer']:
                        is_modified = True
                        total_replacements += 1
                    item['answer'] = new_ans
                    
            if is_modified:
                with open(file_path, 'w', encoding='utf-8') as f:
                    json.dump(data, f, ensure_ascii=False, indent=2)
                total_files += 1
                print(f"Cleaned {file_path}")
                
        except Exception as e:
            print(f"Error processing {file_path}: {e}")

print(f"\n--- DONE ---")
print(f"Files modified: {total_files}")
print(f"Total replacements: {total_replacements}")
