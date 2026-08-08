import json
import os
import shutil

data = [
  {
    "weight": "normal",
    "tags": ["Phần cứng"],
    "question": "Trong cấu trúc phần cứng của một máy tính điện tử, thiết bị vật lý nào được sử dụng để <span class=\"keyword\">lưu trữ dữ liệu</span> trong quá trình máy tính xử lý?",
    "options": [
      "A. <span class=\"answer-keyword\">Bộ nhớ</span>",
      "B. Bàn phím",
      "C. Bo mạch chủ",
      "D. Vỏ máy tính"
    ],
    "answer": "<div class=\"answer-title\">✅ Đáp án:</div> A. Bộ nhớ\n<div class=\"note\">Bộ nhớ (RAM, ROM, ổ cứng) là thiết bị vật lý dùng để lưu trữ dữ liệu và chương trình.</div>"
  },
  {
    "weight": "normal",
    "tags": ["Phần cứng"],
    "question": "Trong cấu trúc phần cứng của một máy tính điện tử, thiết bị nào được sử dụng để <span class=\"keyword\">nhập dữ liệu</span>?",
    "options": [
      "A. Vỏ máy tính",
      "B. <span class=\"answer-keyword\">Bàn phím</span>",
      "C. Thanh ghi",
      "D. Bo mạch chủ"
    ],
    "answer": "<div class=\"answer-title\">✅ Đáp án:</div> B. Bàn phím\n<div class=\"note\">Bàn phím là thiết bị nhập dữ liệu cơ bản nhất của máy tính.</div>"
  },
  {
    "weight": "normal",
    "tags": ["Phần mềm"],
    "question": "Hãy cho biết phần mềm nào sau đây là phần mềm <span class=\"keyword\">độc hại</span> (Malware)?",
    "options": [
      "A. Window Defender",
      "B. Unikey",
      "C. Mozilla Firefox",
      "D. <span class=\"answer-keyword\">Trojan Horse</span>"
    ],
    "answer": "<div class=\"answer-title\">✅ Đáp án:</div> D. Trojan Horse\n<div class=\"note\">Trojan Horse là một loại phần mềm độc hại ngụy trang dưới dạng phần mềm hợp pháp.</div>"
  },
  {
    "weight": "normal",
    "tags": ["Mạng máy tính"],
    "question": "Dịch vụ nào sau đây được hiểu là <span class=\"keyword\">tin nhắn tức thời</span>?",
    "options": [
      "A. SMS (Short Messaging Service)",
      "B. VoIP (Voice over Internet Protocol)",
      "C. TCP/IP (Transmission Control Protocol/Internet Protocol)",
      "D. <span class=\"answer-keyword\">IM</span> (Instant Messaging)"
    ],
    "answer": "<div class=\"answer-title\">✅ Đáp án:</div> D. IM (Instant Messaging)\n<div class=\"note\">IM (Instant Messaging) là dịch vụ nhắn tin tức thời qua mạng Internet.</div>"
  },
  {
    "weight": "normal",
    "tags": ["Phần cứng"],
    "question": "Trong cấu trúc của một máy tính điện tử, bộ phận <span class=\"keyword\">ALU</span> (Arithmetic-Logic Unit) trong CPU là gì?",
    "options": [
      "A. Các thanh ghi",
      "B. Khối <span class=\"answer-keyword\">tính toán số học và logic</span>",
      "C. Khối điều khiển",
      "D. Bộ nhớ trung gian"
    ],
    "answer": "<div class=\"answer-title\">✅ Đáp án:</div> B. Khối tính toán số học và logic\n<div class=\"note\">ALU (Arithmetic-Logic Unit) là khối chuyên đảm nhận các phép tính số học và phép toán logic trong CPU.</div>"
  },
  {
    "weight": "normal",
    "tags": ["Phần cứng"],
    "question": "Trong cấu trúc của một máy tính điện tử, bộ phận nào là <span class=\"keyword\">trung tâm điều hành</span> máy tính, có nhiệm vụ giải mã các lệnh, tạo ra các tín hiệu điều khiển công việc của các bộ phận khác?",
    "options": [
      "A. Các thanh ghi (Registers)",
      "B. USB Flash Drive",
      "C. ALU (Arithmetic-Logic Unit)",
      "D. <span class=\"answer-keyword\">CU</span> (Control Unit)"
    ],
    "answer": "<div class=\"answer-title\">✅ Đáp án:</div> D. CU (Control Unit)\n<div class=\"note\">CU (Control Unit) là khối điều khiển, đóng vai trò giải mã lệnh và điều phối hoạt động của toàn hệ thống.</div>"
  },
  {
    "weight": "normal",
    "tags": ["Phần cứng"],
    "question": "Trong cấu trúc của một máy tính điện tử, đơn vị xử lý trung tâm (<span class=\"keyword\">CPU</span>) gồm bao nhiêu <span class=\"keyword\">bộ phận chính</span>?",
    "options": [
      "A. 4",
      "B. 2",
      "C. 1",
      "D. <span class=\"answer-keyword\">3</span>"
    ],
    "answer": "<div class=\"answer-title\">✅ Đáp án:</div> D. 3\n<div class=\"note\">CPU thường gồm 3 bộ phận chính: Khối điều khiển (CU), Khối tính toán số học và logic (ALU), và Các thanh ghi (Registers).</div>"
  },
  {
    "weight": "normal",
    "tags": ["Phần mềm"],
    "question": "Phần mềm nào sau đây là phần mềm <span class=\"keyword\">ứng dụng</span>?",
    "options": [
      "A. Windows 10",
      "B. <span class=\"answer-keyword\">Google Chrome</span>",
      "C. Unix",
      "D. Linux"
    ],
    "answer": "<div class=\"answer-title\">✅ Đáp án:</div> B. Google Chrome\n<div class=\"note\">Google Chrome là trình duyệt web (phần mềm ứng dụng), trong khi Windows 10, Unix, Linux là hệ điều hành.</div>"
  },
  {
    "weight": "normal",
    "tags": ["Gõ tiếng Việt"],
    "question": "Hãy cho biết khi nhập văn bản bằng kiểu gõ <span class=\"keyword\">Telex</span> thì phím <span class=\"keyword\">f</span> đại diện cho dấu gì?",
    "options": [
      "A. Dấu nặng",
      "B. Dấu hỏi",
      "C. <span class=\"answer-keyword\">Dấu huyền</span>",
      "D. Dấu sắc"
    ],
    "answer": "<div class=\"answer-title\">✅ Đáp án:</div> C. Dấu huyền\n<div class=\"note\">Trong bảng gõ Telex: s (sắc), f (huyền), r (hỏi), x (ngã), j (nặng).</div>"
  },
  {
    "weight": "normal",
    "tags": ["Windows"],
    "question": "Trong cửa sổ File Explorer, tổ hợp phím nào được sử dụng <span class=\"keyword\">dán đối tượng</span> vừa sao chép vào vị trí hiện hành?",
    "options": [
      "A. Ctrl + A",
      "B. <span class=\"answer-keyword\">Ctrl + V</span>",
      "C. Ctrl + P",
      "D. Ctrl + C"
    ],
    "answer": "<div class=\"answer-title\">✅ Đáp án:</div> B. Ctrl + V\n<div class=\"note\">Ctrl + V dùng để dán (Paste) dữ liệu đã được copy.</div>"
  },
  {
    "weight": "normal",
    "tags": ["Gõ tiếng Việt"],
    "question": "Để <span class=\"keyword\">bật hoặc tắt</span> chế độ gõ dấu tiếng Việt khi sử dụng phần mềm tiện ích Unikey, chúng ta chọn tổ hợp phím nào sau đây?",
    "options": [
      "A. Shift + Z",
      "B. <span class=\"answer-keyword\">Ctrl + Shift</span>",
      "C. Alt + Shift",
      "D. Ctrl + Shift + F6"
    ],
    "answer": "<div class=\"answer-title\">✅ Đáp án:</div> B. Ctrl + Shift\n<div class=\"note\">Mặc định Unikey sử dụng tổ hợp phím Ctrl + Shift hoặc Alt + Z để chuyển đổi nhanh giữa tiếng Việt và tiếng Anh.</div>"
  },
  {
    "weight": "normal",
    "tags": ["Windows"],
    "question": "Hãy cho biết đối tượng nào sau đây sẽ có <span class=\"keyword\">phần mở rộng</span>?",
    "options": [
      "A. Đường dẫn",
      "B. Ổ đĩa",
      "C. <span class=\"answer-keyword\">Tập tin</span>",
      "D. Thư mục"
    ],
    "answer": "<div class=\"answer-title\">✅ Đáp án:</div> C. Tập tin\n<div class=\"note\">Chỉ có tập tin (file) mới có phần mở rộng (extension) để hệ điều hành nhận biết định dạng.</div>"
  },
  {
    "weight": "normal",
    "tags": ["Windows"],
    "question": "Trong cửa sổ Recycle Bin, để <span class=\"keyword\">phục hồi đối tượng</span> sau khi xóa, người dùng nhấp phải trên đối tượng cần phục hồi và chọn lệnh nào sau đây?",
    "options": [
      "A. Delete",
      "B. Cut",
      "C. Properties",
      "D. <span class=\"answer-keyword\">Restore</span>"
    ],
    "answer": "<div class=\"answer-title\">✅ Đáp án:</div> D. Restore\n<div class=\"note\">Lệnh Restore dùng để khôi phục các file/folder đã bị xóa vào Recycle Bin trở về vị trí ban đầu.</div>"
  },
  {
    "weight": "normal",
    "tags": ["Windows"],
    "question": "Để thay đổi quy ước về <span class=\"keyword\">thời gian</span>, ta vào Control Panel, chọn Region, chọn Additional settings, trong Customize Format ta chọn thẻ nào sau đây?",
    "options": [
      "A. Numbers",
      "B. Date",
      "C. <span class=\"answer-keyword\">Time</span>",
      "D. Currency"
    ],
    "answer": "<div class=\"answer-title\">✅ Đáp án:</div> C. Time\n<div class=\"note\">Thẻ Time trong Customize Format cho phép định dạng lại kiểu hiển thị thời gian (giờ, phút, giây).</div>"
  },
  {
    "weight": "normal",
    "tags": ["Windows"],
    "question": "Trong chương trình File Explorer, khi tìm kiếm tập tin thì ký tự nào sau đây được sử dụng để đại diện cho <span class=\"keyword\">1 ký tự</span> trong chuỗi từ khóa?",
    "options": [
      "A. #",
      "B. *",
      "C. !",
      "D. <span class=\"answer-keyword\">?</span>"
    ],
    "answer": "<div class=\"answer-title\">✅ Đáp án:</div> D. ?\n<div class=\"note\">Ký tự hỏi chấm (?) đại diện cho đúng một ký tự bất kỳ, còn dấu sao (*) đại diện cho chuỗi ký tự.</div>"
  },
  {
    "weight": "normal",
    "tags": ["Windows"],
    "question": "Trong hệ điều hành Windows 10, để thực hiện thao tác <span class=\"keyword\">gỡ bỏ font chữ</span> đã cài vào máy tính người sử dụng sẽ chọn nhóm lệnh nào trong cửa sổ All Control Panel Items?",
    "options": [
      "A. Devices and Printers",
      "B. User Accounts",
      "C. <span class=\"answer-keyword\">Fonts</span>",
      "D. Date and Time"
    ],
    "answer": "<div class=\"answer-title\">✅ Đáp án:</div> C. Fonts\n<div class=\"note\">Chức năng Fonts trong Control Panel dùng để quản lý (cài đặt, gỡ bỏ) các font chữ của hệ thống.</div>"
  },
  {
    "weight": "normal",
    "tags": ["Gõ tiếng Việt"],
    "question": "Phần mềm <span class=\"keyword\">Unikey</span> được cài đặt vào Windows, mục đích dùng để làm gì?",
    "options": [
      "A. <span class=\"answer-keyword\">Gõ dấu</span> tiếng việt",
      "B. Vẽ cơ bản",
      "C. Giải nén dữ liệu",
      "D. Duyệt web"
    ],
    "answer": "<div class=\"answer-title\">✅ Đáp án:</div> A. Gõ dấu tiếng việt\n<div class=\"note\">Unikey là một bộ gõ tiếng Việt phổ biến trên Windows.</div>"
  },
  {
    "weight": "normal",
    "tags": ["Windows"],
    "question": "Trong chương trình File Explorer, khi tìm kiếm tập tin thì ký tự nào sau đây được sử dụng để đại diện cho <span class=\"keyword\">nhiều ký tự</span> bất kỳ trong chuỗi từ khóa?",
    "options": [
      "A. <span class=\"answer-keyword\">*</span>",
      "B. ?",
      "C. !",
      "D. #"
    ],
    "answer": "<div class=\"answer-title\">✅ Đáp án:</div> A. *\n<div class=\"note\">Ký tự dấu sao (*) đại diện cho một chuỗi nhiều ký tự (hoặc không có ký tự nào) trong tìm kiếm.</div>"
  },
  {
    "weight": "normal",
    "tags": ["Windows"],
    "question": "Trong cửa sổ File Explorer, để sửa đổi tên đối tượng, chúng ta vào thẻ Home và chọn <span class=\"keyword\">lệnh Rename</span> ở nhóm lệnh nào?",
    "options": [
      "A. <span class=\"answer-keyword\">Organize</span>",
      "B. New",
      "C. Open",
      "D. Clipboard"
    ],
    "answer": "<div class=\"answer-title\">✅ Đáp án:</div> A. Organize\n<div class=\"note\">Trong ribbon Home của File Explorer, lệnh Rename, Delete, Move to, Copy to thuộc nhóm lệnh Organize.</div>"
  },
  {
    "weight": "normal",
    "tags": ["Gõ tiếng Việt"],
    "question": "Hãy cho biết font chữ nào được chọn khi người sử dụng soạn thảo văn bản với bảng mã <span class=\"keyword\">Unicode</span>?",
    "options": [
      "A. .Vn-time",
      "B. VNI-Thuphap",
      "C. Vni-Times",
      "D. <span class=\"answer-keyword\">Times New Roman</span>"
    ],
    "answer": "<div class=\"answer-title\">✅ Đáp án:</div> D. Times New Roman\n<div class=\"note\">Times New Roman là font chữ chuẩn quốc tế hỗ trợ đầy đủ bảng mã Unicode (khác với .VnTime dùng mã TCVN3 hay Vni-Times dùng mã VNI).</div>"
  }
]

subject_dir = '/Users/thien-ban/Library/CloudStorage/OneDrive-Personal/03_WORK/11. LearnIZ/_sources/TVU/Quan_tri_kinh_doanh_DH/16. TIN HỌC ỨNG DỤNG CƠ BẢN'
staging_file = os.path.join(subject_dir, 'staging', 'temp_qs.json')
main_file = os.path.join(subject_dir, 'qs.json')

with open(staging_file, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

shutil.copy2(staging_file, main_file)
print("DONE: Đã tiệt trùng 20 câu, gắn Ma Trận Lục Hợp và ghi vào qs.json!")
