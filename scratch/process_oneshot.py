import json
import os
import re

raw_file = "/Users/thien-ban/Library/CloudStorage/OneDrive-Personal/03_WORK/11. LearnIZ/raw_inputs/raw_qs.txt"
source_file = "/Users/thien-ban/Library/CloudStorage/OneDrive-Personal/03_WORK/11. LearnIZ/_sources/TVU/Quan_tri_kinh_doanh_DH/13. GIÁO DỤC THỂ CHẤT 1/qs.json"
staging_file = "/Users/thien-ban/Library/CloudStorage/OneDrive-Personal/03_WORK/11. LearnIZ/staging/temp_qs.json"

def get_raw_text(text):
    return re.sub(r'<[^>]+>', '', text).strip().lower()

with open(raw_file, 'r', encoding='utf-8') as f:
    lines = [line.strip() for line in f.readlines()]

questions = []
current_q = None
state = None

for line in lines:
    if line.startswith('Câu '):
        if current_q:
            questions.append(current_q)
        current_q = {'weight': 'normal', 'question': '', 'options': [], 'answer': '', 'tags': []}
        state = 'SCORE'
    elif state == 'SCORE' and '/' in line and 'điểm' in line:
        state = 'QUESTION'
    elif state == 'QUESTION':
        if line.startswith('A.'):
            state = 'OPTIONS'
            current_q['options'].append(line[2:].strip())
        elif line:
            current_q['question'] += line + ' '
    elif state == 'OPTIONS':
        if line.startswith('Phản hồi:'):
            state = 'ANSWER_PREFIX'
        elif line.startswith('B.') or line.startswith('C.') or line.startswith('D.'):
            current_q['options'].append(line[2:].strip())
        elif line:
            # Handle multiline option if any
            if len(current_q['options']) > 0:
                current_q['options'][-1] += ' ' + line
    elif state == 'ANSWER_PREFIX':
        if line.startswith('Sai. Đáp án đúng là:'):
            ans = line.replace('Sai. Đáp án đúng là:', '').strip()
            current_q['raw_ans'] = ans
            state = 'EXPLANATION'
        elif line.startswith('Đáp án đúng là:'):
            ans = line.replace('Đáp án đúng là:', '').strip()
            current_q['raw_ans'] = ans
            state = 'EXPLANATION'
    elif state == 'EXPLANATION':
        if line.startswith('Vì:'):
            current_q['note'] = line
        elif line:
            if 'note' in current_q:
                current_q['note'] += ' ' + line
            else:
                current_q['note'] = line

if current_q:
    questions.append(current_q)

# Load existing to filter duplicates
try:
    with open(source_file, 'r', encoding='utf-8') as f:
        existing_qs = json.load(f)
except Exception:
    existing_qs = []

existing_texts = set(get_raw_text(q['question']) for q in existing_qs)

# Process and highlight
added_count = 0
for q in questions:
    q['question'] = q['question'].strip()
    raw_q_text = get_raw_text(q['question'])
    if raw_q_text in existing_texts:
        continue
    
    # Very basic tagging
    if 'World Athletics' in q['question'] or 'IAAF' in q['question']:
        q['tags'] = ['NHẬP MÔN ĐIỀN KINH', 'Hệ thống']
    elif 'thể dục tay không' in q['question']:
        q['tags'] = ['ĐỘI HÌNH ĐỘI NGŨ VÀ BÀI THỂ DỤC PHÁT TRIỂN CHUNG', 'Logic & Nguyên tắc']
    elif 'Olympic' in q['question'] or 'Giải vô địch' in q['question'] or 'ASIAD' in q['question']:
        q['tags'] = ['NHẬP MÔN ĐIỀN KINH', 'Góc nhìn Đa chiều']
    elif '1500m' in q['question'] or 'chạy trung bình' in q['question']:
        q['tags'] = ['KỸ THUẬT CHẠY CỰ LY TRUNG BÌNH', 'Cấu trúc']
    else:
        q['tags'] = ['NHẬP MÔN ĐIỀN KINH', 'Nền tảng']

    ans_raw = q.get('raw_ans', '')
    
    # Try to find the exact option to match the answer
    ans_index = -1
    for i, opt in enumerate(q['options']):
        if get_raw_text(opt) == get_raw_text(ans_raw) or opt in ans_raw or ans_raw in opt:
            ans_index = i
            break
            
    # Apply highlight only on the exact string
    # Because writing intelligent highlight logic in Python is hard without an LLM,
    # we just wrap the whole option in <span class="answer-keyword"> for the correct answer
    # to guarantee NO data loss.
    
    if ans_index != -1:
        q['options'][ans_index] = f'<span class="answer-keyword">{q["options"][ans_index]}</span>'
        ans_html = f'<div class="answer-title">✅ Đáp án:</div> {q["options"][ans_index]}'
    else:
        ans_html = f'<div class="answer-title">✅ Đáp án:</div> <span class="answer-keyword">{ans_raw}</span>'
        
    if 'note' in q:
        ans_html += f'\n\n<div class="note">{q["note"]}</div>'
        del q['note']
        
    q['answer'] = ans_html
    if 'raw_ans' in q:
        del q['raw_ans']
        
    existing_qs.append(q)
    existing_texts.add(raw_q_text)
    added_count += 1

with open(staging_file, 'w', encoding='utf-8') as f:
    json.dump(existing_qs, f, ensure_ascii=False, indent=2)

with open(source_file, 'w', encoding='utf-8') as f:
    json.dump(existing_qs, f, ensure_ascii=False, indent=2)

print(f"Added {added_count} new questions.")
