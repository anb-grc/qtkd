import json
import os
import shutil
import re

def clean_html(raw_html):
    cleanr = re.compile('<.*?>')
    cleantext = re.sub(cleanr, '', raw_html)
    return cleantext

subject_dir = '/Users/thien-ban/Library/CloudStorage/OneDrive-Personal/03_WORK/11. LearnIZ/_sources/TVU/Quan_tri_kinh_doanh_DH/16. TIN HỌC ỨNG DỤNG CƠ BẢN'
staging_file = os.path.join(subject_dir, 'staging', 'temp_qs.json')
main_file = os.path.join(subject_dir, 'qs.json')

os.makedirs(os.path.dirname(staging_file), exist_ok=True)

new_data = [
    {
        "weight": "normal",
        "tags": ["Phần cứng"],
        "question": "Trong cấu trúc của một máy tính điện tử, thiết bị nào sau đây <span class=\"keyword\">KHÔNG phải</span> là thiết bị nhập?",
        "options": [
            "A. Bàn phím",
            "B. Chuột",
            "C. <span class=\"answer-keyword\">Màn hình</span>",
            "D. Máy quét"
        ],
        "answer": "<div class=\"answer-title\">✅ Đáp án:</div> C. Màn hình\n<div class=\"note\">Màn hình là thiết bị xuất dữ liệu, không phải thiết bị nhập.</div>"
    },
    {
        "weight": "normal",
        "tags": ["Mạng máy tính"],
        "question": "Loại mạng nào sau đây là một hệ thống mạng tư nhân trong một tòa nhà, một khu vực và có <span class=\"keyword\">phạm vi hoạt động từ vài mét cho đến 1 km</span>?",
        "options": [
            "A. <span class=\"answer-keyword\">LAN</span>",
            "B. MAN",
            "C. WAN",
            "D. INTERNET"
        ],
        "answer": "<div class=\"answer-title\">✅ Đáp án:</div> A. LAN\n<div class=\"note\">LAN (Local Area Network) là mạng cục bộ, phạm vi giới hạn trong một tòa nhà, công ty.</div>"
    },
    {
        "weight": "normal",
        "tags": ["Phần mềm"],
        "question": "Phần mềm nào sau đây là phần mềm <span class=\"keyword\">ứng dụng</span>?",
        "options": [
            "A. Windows 10",
            "B. Unix",
            "C. <span class=\"answer-keyword\">Google Chrome</span>",
            "D. Linux"
        ],
        "answer": "<div class=\"answer-title\">✅ Đáp án:</div> C. Google Chrome\n<div class=\"note\">Windows, Unix, Linux là hệ điều hành (phần mềm hệ thống). Google Chrome là phần mềm ứng dụng.</div>"
    },
    {
        "weight": "normal",
        "tags": ["Phần mềm"],
        "question": "Hãy cho biết phần mềm nào sau đây <span class=\"keyword\">KHÔNG phải</span> là phần mềm độc hại (Malware)?",
        "options": [
            "A. Adware",
            "B. <span class=\"answer-keyword\">Unikey</span>",
            "C. Spyware",
            "D. Trojan Horse"
        ],
        "answer": "<div class=\"answer-title\">✅ Đáp án:</div> B. Unikey\n<div class=\"note\">Unikey là bộ gõ tiếng Việt hợp pháp. Adware, Spyware, Trojan là các loại mã độc.</div>"
    },
    {
        "weight": "normal",
        "tags": ["Windows"],
        "question": "Trong hệ điều hành Windows 10, để thực hiện thao tác <span class=\"keyword\">gỡ bỏ font chữ</span> đã cài vào máy tính người sử dụng sẽ chọn nhóm lệnh nào trong cửa sổ All Control Panel Items của Control Panel?",
        "options": [
            "A. <span class=\"answer-keyword\">Fonts</span>",
            "B. Date and Time",
            "C. Devices and Printers",
            "D. User Accounts"
        ],
        "answer": "<div class=\"answer-title\">✅ Đáp án:</div> A. Fonts\n<div class=\"note\">Mục Fonts dùng để xem, cài đặt và gỡ bỏ font chữ.</div>"
    },
    {
        "weight": "normal",
        "tags": ["Windows"],
        "question": "Hãy cho biết tổ hợp phím nào được sử dụng để <span class=\"keyword\">đóng cửa sổ</span> 1 chương trình ứng dụng?",
        "options": [
            "A. CTRL+F4",
            "B. <span class=\"answer-keyword\">ALT+F4</span>",
            "C. SHIFT+F4",
            "D. ALT+TAB"
        ],
        "answer": "<div class=\"answer-title\">✅ Đáp án:</div> B. ALT+F4\n<div class=\"note\">ALT + F4 đóng cửa sổ ứng dụng hiện tại. CTRL + F4 chỉ đóng tab bên trong ứng dụng.</div>"
    },
    {
        "weight": "normal",
        "tags": ["Windows"],
        "question": "Hãy cho biết đối tượng nào sau đây sẽ có <span class=\"keyword\">phần mở rộng</span>?",
        "options": [
            "A. Ổ đĩa",
            "B. <span class=\"answer-keyword\">Tập tin</span>",
            "C. Thư mục",
            "D. Đường dẫn"
        ],
        "answer": "<div class=\"answer-title\">✅ Đáp án:</div> B. Tập tin\n<div class=\"note\">Chỉ có tập tin (file) mới có định dạng phân biệt qua phần mở rộng (extension).</div>"
    },
    {
        "weight": "normal",
        "tags": ["Windows"],
        "question": "Trong chương trình File Explorer, khi tìm kiếm tập tin thì ký tự nào sau đây được sử dụng để đại diện cho <span class=\"keyword\">nhiều ký tự bất kỳ</span> trong chuỗi từ khóa?",
        "options": [
            "A. #",
            "B. <span class=\"answer-keyword\">*</span>",
            "C. ?",
            "D. !"
        ],
        "answer": "<div class=\"answer-title\">✅ Đáp án:</div> B. *\n<div class=\"note\">Dấu sao (*) là ký tự đại diện cho một chuỗi nhiều ký tự bất kỳ.</div>"
    },
    {
        "weight": "normal",
        "tags": ["Windows"],
        "question": "Trong chương trình File Explorer, khi tìm kiếm tập tin thì ký tự nào sau đây được sử dụng để đại diện cho <span class=\"keyword\">1 ký tự</span> trong chuỗi từ khóa?",
        "options": [
            "A. *",
            "B. <span class=\"answer-keyword\">?</span>",
            "C. #",
            "D. !"
        ],
        "answer": "<div class=\"answer-title\">✅ Đáp án:</div> B. ?\n<div class=\"note\">Dấu hỏi chấm (?) đại diện cho một và chỉ một ký tự bất kỳ.</div>"
    },
    {
        "weight": "normal",
        "tags": ["Windows"],
        "question": "Phần mềm <span class=\"keyword\">WinRAR</span> được cài đặt vào Windows, mục đích dùng để làm gì?",
        "options": [
            "A. Gõ dấu tiếng việt",
            "B. Soạn thảo văn bản",
            "C. Vẽ cơ bản",
            "D. <span class=\"answer-keyword\">Giải nén dữ liệu</span>"
        ],
        "answer": "<div class=\"answer-title\">✅ Đáp án:</div> D. Giải nén dữ liệu\n<div class=\"note\">WinRAR là phần mềm quản lý và nén/giải nén các tệp tin lưu trữ (ZIP, RAR).</div>"
    },
    {
        "weight": "normal",
        "tags": ["Windows"],
        "question": "Hãy cho biết tổ hợp phím nào được sử dụng để <span class=\"keyword\">chuyển đổi qua lại</span> giữa các cửa sổ của các ứng dụng đang mở?",
        "options": [
            "A. <span class=\"answer-keyword\">ALT+TAB</span>",
            "B. SHIFT+TAB",
            "C. Windows+TAB",
            "D. CTRL+TAB"
        ],
        "answer": "<div class=\"answer-title\">✅ Đáp án:</div> A. ALT+TAB\n<div class=\"note\">ALT + TAB giúp chuyển nhanh (switch) giữa các cửa sổ chương trình đang mở.</div>"
    },
    {
        "weight": "normal",
        "tags": ["Word"],
        "question": "Trong chương trình Microsoft Office Word 2013, hãy cho biết thao tác nào sau đây được sử dụng để <span class=\"keyword\">chia cột</span> cho đoạn văn bản đang được chọn?",
        "options": [
            "A. Home, Nhóm Editing, Columns",
            "B. Insert, Nhóm Text, Columns",
            "C. <span class=\"answer-keyword\">Page Layout, Nhóm Page Setup, Columns</span>",
            "D. Design, Nhóm Page Background, Columns"
        ],
        "answer": "<div class=\"answer-title\">✅ Đáp án:</div> C. Page Layout, Nhóm Page Setup, Columns\n<div class=\"note\">Tính năng chia cột văn bản nằm trong thẻ Page Layout (hoặc Layout), nhóm Page Setup.</div>"
    },
    {
        "weight": "normal",
        "tags": ["Word"],
        "question": "Trong chương trình Microsoft Office Word 2013, trong khi thực hiện thao tác định dạng chữ <span class=\"keyword\">Drop Cap</span> tùy chọn nào xác định <span class=\"keyword\">khoảng cách</span> chữ cái và văn bản còn lại?",
        "options": [
            "A. Lines to drop",
            "B. Font",
            "C. <span class=\"answer-keyword\">Distance from text</span>",
            "D. Position"
        ],
        "answer": "<div class=\"answer-title\">✅ Đáp án:</div> C. Distance from text\n<div class=\"note\">Distance from text dùng để thiết lập khoảng cách (độ rỗng) giữa chữ Drop Cap lớn và phần văn bản kế bên.</div>"
    },
    {
        "weight": "normal",
        "tags": ["Word"],
        "question": "Trong chương trình Microsoft Office Word 2013, khi định dạng khung viền cho trang giấy tùy chọn nào cho phép chọn <span class=\"keyword\">kiểu đường viền</span>?",
        "options": [
            "A. <span class=\"answer-keyword\">Styles</span>",
            "B. Preview",
            "C. Color",
            "D. Width"
        ],
        "answer": "<div class=\"answer-title\">✅ Đáp án:</div> A. Styles\n<div class=\"note\">Styles quy định kiểu đường nét (liền, đứt khúc, dấu chấm...). Color (Màu) và Width (Độ dày).</div>"
    },
    {
        "weight": "normal",
        "tags": ["Word"],
        "question": "Trong chương trình Microsoft Office Word 2013, trong khi thực hiện thao tác định dạng cho đối tượng Shape lệnh nào cho phép xác định <span class=\"keyword\">màu đường viền</span> của Shape?",
        "options": [
            "A. <span class=\"answer-keyword\">Shape Outline</span>",
            "B. Shape Fill",
            "C. Align Text",
            "D. Shape Effects"
        ],
        "answer": "<div class=\"answer-title\">✅ Đáp án:</div> A. Shape Outline\n<div class=\"note\">Shape Outline quản lý màu và độ dày của viền hình vẽ, trong khi Shape Fill là màu nền bên trong.</div>"
    },
    {
        "weight": "normal",
        "tags": ["Word"],
        "question": "Trong chương trình Microsoft Office Word 2013, cho biết tổ hợp phím tắt nào được sử dụng để định dạng chữ <span class=\"keyword\">in nghiêng</span>?",
        "options": [
            "A. <span class=\"answer-keyword\">CTRL+I</span>",
            "B. CTRL+B",
            "C. CTRL+U",
            "D. CTRL+Z"
        ],
        "answer": "<div class=\"answer-title\">✅ Đáp án:</div> A. CTRL+I\n<div class=\"note\">CTRL+I = Italic (Nghiêng), CTRL+B = Bold (Đậm), CTRL+U = Underline (Gạch chân).</div>"
    },
    {
        "weight": "normal",
        "tags": ["Word"],
        "question": "Trong chương trình Microsoft Office Word 2013, trong khi thực hiện thao tác định dạng bảng biểu, nhóm lệnh nào trong thẻ Layout cho phép thay đổi <span class=\"keyword\">độ rộng của ô</span>?",
        "options": [
            "A. Alignment",
            "B. Merge",
            "C. <span class=\"answer-keyword\">Cell Size</span>",
            "D. Rows & Columns"
        ],
        "answer": "<div class=\"answer-title\">✅ Đáp án:</div> C. Cell Size\n<div class=\"note\">Nhóm Cell Size chứa Height và Width để điều chỉnh chiều cao và độ rộng của hàng/cột.</div>"
    },
    {
        "weight": "normal",
        "tags": ["Word"],
        "question": "Khi mở hộp thoại Font trong chương trình Microsoft Office Word 2013, để thiết lập thông số <span class=\"keyword\">màu chữ</span> cho văn bản đang chọn khối ta sử dụng tùy chọn nào sau đây?",
        "options": [
            "A. Font Style",
            "B. Font size",
            "C. Underline Color",
            "D. <span class=\"answer-keyword\">Font Color</span>"
        ],
        "answer": "<div class=\"answer-title\">✅ Đáp án:</div> D. Font Color\n<div class=\"note\">Font Color là tùy chọn để thay đổi màu sắc của văn bản.</div>"
    },
    {
        "weight": "normal",
        "tags": ["Word"],
        "question": "Trong chương trình Microsoft Office Word 2013, khi định dạng khung viền cho trang giấy tùy chọn nào cho phép chọn <span class=\"keyword\">màu của đường viền</span>?",
        "options": [
            "A. Styles",
            "B. Width",
            "C. <span class=\"answer-keyword\">Color</span>",
            "D. Preview"
        ],
        "answer": "<div class=\"answer-title\">✅ Đáp án:</div> C. Color\n<div class=\"note\">Tùy chọn Color thiết lập màu sắc cho khung viền của trang (Page Border).</div>"
    },
    {
        "weight": "normal",
        "tags": ["Word"],
        "question": "Trong chương trình Microsoft Office Word 2013, trong khi thực hiện thao tác định dạng bảng biểu, lệnh nào thiết lập việc <span class=\"keyword\">lặp lại tiêu đề bảng</span> ở các trang giấy?",
        "options": [
            "A. Convert to Text",
            "B. Distribute Columns",
            "C. <span class=\"answer-keyword\">Repeat Header Rows</span>",
            "D. Sort"
        ],
        "answer": "<div class=\"answer-title\">✅ Đáp án:</div> C. Repeat Header Rows\n<div class=\"note\">Repeat Header Rows giúp dòng đầu tiên của bảng tự động lặp lại khi bảng bị tràn sang trang mới.</div>"
    }
]

try:
    with open(main_file, 'r', encoding='utf-8') as f:
        existing_data = json.load(f)
except Exception:
    existing_data = []

existing_questions_cleaned = [clean_html(item['question']) for item in existing_data]

added_count = 0
for item in new_data:
    q_clean = clean_html(item['question'])
    if q_clean not in existing_questions_cleaned:
        existing_data.append(item)
        added_count += 1

with open(staging_file, 'w', encoding='utf-8') as f:
    json.dump(existing_data, f, ensure_ascii=False, indent=2)

shutil.copy2(staging_file, main_file)
print(f"DONE: Appended {added_count} new questions. Total questions now: {len(existing_data)}")
