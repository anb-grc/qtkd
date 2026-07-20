import os
import glob
import shutil

root_dir = "."
sources_dir = "_sources"
raw_dir = "raw_inputs"
staging_dir = "staging"
scratch_dir = "scratch"

# Create directories
for d in [sources_dir, raw_dir, staging_dir, scratch_dir]:
    os.makedirs(d, exist_ok=True)

# Subjects
subjects = [d for d in os.listdir() if os.path.isdir(d) and (d[0].isdigit() and "." in d)]

for sub in subjects:
    sub_source = os.path.join(sources_dir, sub)
    os.makedirs(sub_source, exist_ok=True)
    # find pdfs and docx
    for ext in ["*.pdf", "*.docx"]:
        for file_path in glob.glob(os.path.join(sub, ext)):
            base_name = os.path.basename(file_path)
            shutil.move(file_path, os.path.join(sub_source, base_name))
            print(f"Moved {file_path} to {sub_source}")

# Delete python scripts in root and subdirs (except scratch/cleanup.py)
for root, dirs, files in os.walk(root_dir):
    if "node_modules" in root or ".vercel" in root or ".git" in root or ".agents" in root:
        continue
    for f in files:
        if f.endswith(".py") and root != "./scratch":
            os.remove(os.path.join(root, f))
            print(f"Deleted {os.path.join(root, f)}")
        elif f.endswith(".txt") and "Chien_luoc" not in f:
            os.remove(os.path.join(root, f))
            print(f"Deleted {os.path.join(root, f)}")
        elif f == "cleanup.py" and root == "./scratch":
            pass # Keep our cleanup script for now
            
# Remove backup dirs
for d in ["_UPDATE_GITHUB", "scratch/html_backup", "QTKD-KNOWLEDGES", "Thong tin LOP HOC"]:
    if os.path.exists(d):
        shutil.rmtree(d)
        print(f"Deleted directory {d}")
