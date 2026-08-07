import json
import os
import re
import glob

# Define root directory
ROOT_DIR = "/Users/thien-ban/Library/CloudStorage/OneDrive-Personal/04_GROWTH/1. Mindset/2. TVU"

# Find all qs.json files
file_patterns = [
    os.path.join(ROOT_DIR, "10. Nguyên lý kế toán/Ngan_hang_de_*_qs.json"),
    os.path.join(ROOT_DIR, "11. Kinh tế chính trị Mác - Lênin/Ngan_hang_de_*_qs.json"),
    os.path.join(ROOT_DIR, "12. Thống kê ứng dụng trong kinh doanh/Ngan_hang_de_*_qs.json")
]

all_files = []
for pattern in file_patterns:
    all_files.extend(glob.glob(pattern))

def extract_options_from_html(html_str):
    """Try to extract options from <div class='options-grid'> if it exists"""
    match = re.search(r'<div class="options-grid">(.*?)</div>\s*$', html_str, re.IGNORECASE | re.DOTALL)
    if match:
        inner_html = match.group(1)
        # Find all <div> inside it
        divs = re.findall(r'<div.*?>(.*?)</div>', inner_html, re.IGNORECASE | re.DOTALL)
        if len(divs) >= 4:
            options = [div.strip() for div in divs]
            # Remove options-grid from html_str
            new_html = html_str[:match.start()].strip()
            new_html = re.sub(r'(<br\s*/?>\s*)+$', '', new_html)
            return options, new_html
    return None, html_str

def extract_options_from_regex(html_str):
    """Fallback regex extraction (legacy)"""
    # Replace <br> with \n for regex matching
    text_for_regex = re.sub(r'<br\s*/?>', '\n', html_str, flags=re.IGNORECASE)
    # Remove HTML tags to get plain text
    plain_text = re.sub(r'<[^>]+>', '', text_for_regex)
    
    match = re.search(r'A[\.\)]\s*(.*?)\s*B[\.\)]\s*(.*?)\s*C[\.\)]\s*(.*?)\s*D[\.\)]\s*(.*)', plain_text, re.IGNORECASE | re.DOTALL)
    if match:
        options = [match.group(1).strip(), match.group(2).strip(), match.group(3).strip(), match.group(4).strip()]
        options = [opt.replace('\n', '<br>') for opt in options]
        
        # Cut the HTML where A. starts
        matches = list(re.finditer(r'A[\.\)](?:\s|&nbsp;|<br|<\/?p>|<span)', html_str))
        if matches:
            cut_index = matches[-1].start()
            new_html = html_str[:cut_index].strip()
            new_html = re.sub(r'(<br\s*/?>\s*)+$', '', new_html)
            return options, new_html
    return None, html_str

for filepath in all_files:
    print(f"Processing: {filepath}")
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    for item in data:
        options = []
        # Case 1: A, B, C, D fields explicitly exist and have content
        has_explicit_options = False
        for key in ['A', 'B', 'C', 'D']:
            if key in item and str(item.get(key, '')).strip() != "":
                has_explicit_options = True
                break
                
        if has_explicit_options:
            options = [
                str(item.get('A', '')).strip(),
                str(item.get('B', '')).strip(),
                str(item.get('C', '')).strip(),
                str(item.get('D', '')).strip()
            ]
            # Remove <br> prefixes if they exist at the start of the option
            options = [re.sub(r'^<br\s*/?>', '', opt, flags=re.IGNORECASE).strip() for opt in options]
        else:
            # Case 2: Embedded in question
            question_html = item.get('question', '')
            ext_opts, new_q_html = extract_options_from_html(question_html)
            if ext_opts:
                options = ext_opts
                item['question'] = new_q_html
            else:
                ext_opts, new_q_html = extract_options_from_regex(question_html)
                if ext_opts:
                    options = ext_opts
                    item['question'] = new_q_html
                    
        # Update item
        item['options'] = options
        
        # Clean up legacy keys
        for key in ['A', 'B', 'C', 'D']:
            if key in item:
                del item[key]
                
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)
        
    print(f"-> Saved {len(data)} items to {filepath}")

# Also process qs.json at the root
root_qs = os.path.join(ROOT_DIR, "qs.json")
if os.path.exists(root_qs):
    print(f"Processing: {root_qs}")
    with open(root_qs, 'r', encoding='utf-8') as f:
        data = json.load(f)
    for item in data:
        options = []
        has_explicit_options = False
        for key in ['A', 'B', 'C', 'D']:
            if key in item and str(item.get(key, '')).strip() != "":
                has_explicit_options = True
                break
        if has_explicit_options:
            options = [
                str(item.get('A', '')).strip(),
                str(item.get('B', '')).strip(),
                str(item.get('C', '')).strip(),
                str(item.get('D', '')).strip()
            ]
            options = [re.sub(r'^<br\s*/?>', '', opt, flags=re.IGNORECASE).strip() for opt in options]
        else:
            question_html = item.get('question', '')
            ext_opts, new_q_html = extract_options_from_html(question_html)
            if ext_opts:
                options = ext_opts
                item['question'] = new_q_html
            else:
                ext_opts, new_q_html = extract_options_from_regex(question_html)
                if ext_opts:
                    options = ext_opts
                    item['question'] = new_q_html
        item['options'] = options
        for key in ['A', 'B', 'C', 'D']:
            if key in item:
                del item[key]
    with open(root_qs, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)
    print(f"-> Saved {len(data)} items to {root_qs}")

print("All done!")
