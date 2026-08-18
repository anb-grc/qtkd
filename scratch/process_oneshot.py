import json
import os
import re

# File paths
part1 = 'scratch/new_qs_part1.json'
part2 = 'scratch/new_qs_part2.json'
part3 = 'scratch/new_qs_part3.json'
staging = 'scratch/staging_new_qs.json'
main_qs = '_sources/TVU/Quan_tri_kinh_doanh_DH/15. TÀI CHÍNH TIỀN TỆ/qs.json'
log_file = 'PROJECT_LOG.md'

def strip_html(text):
    return re.sub(r'<[^>]+>', '', text).strip()

def load_json(path):
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)

# Combine parts
new_qs = []
for part in [part1, part2, part3]:
    if os.path.exists(part):
        new_qs.extend(load_json(part))

# Save staging
with open(staging, 'w', encoding='utf-8') as f:
    json.dump(new_qs, f, ensure_ascii=False, indent=2)

print(f"Staged {len(new_qs)} new questions.")

# Load main qs
if os.path.exists(main_qs):
    with open(main_qs, 'r', encoding='utf-8') as f:
        main_data = json.load(f)
else:
    main_data = []

old_count = len(main_data)

# Extract pure text questions from main_data for deduplication
existing_q_texts = {strip_html(q['question']) for q in main_data}

# Filter new questions
added_count = 0
for nq in new_qs:
    q_text = strip_html(nq['question'])
    if q_text not in existing_q_texts:
        main_data.append(nq)
        existing_q_texts.add(q_text)
        added_count += 1
    else:
        print(f"Duplicate found and skipped: {q_text[:30]}...")

# Safe Write to main qs
with open(main_qs, 'w', encoding='utf-8') as f:
    json.dump(main_data, f, ensure_ascii=False, indent=2)

print(f"Added {added_count} new questions. Total is now {len(main_data)}.")

# Update Log
log_entry = f"\n- Added {added_count} questions to 15. TÀI CHÍNH TIỀN TỆ (Staged from {len(new_qs)}). Total: {len(main_data)}"
with open(log_file, 'a', encoding='utf-8') as f:
    f.write(log_entry)

# Git commit
os.system(f'git add "{main_qs}"')
os.system(f'git commit -m "Update Q&A for 15. TÀI CHÍNH TIỀN TỆ: +{added_count} questions"')
os.system('git push')
