import json
import re
import os

new_qs = [
    {
        "weight": "normal",
        "tags": ["ĐẠI CƯƠNG VỀ MÁY TÍNH ĐIỆN TỬ & CNTT", "Cấu trúc"],
        "question": "Trong cấu trúc của một máy tính điện tử, thiết bị nào sau đây <span class=\"keyword\">KHÔNG phải</span> là <span class=\"keyword\">thiết bị xuất</span>?",
        "options": ["Máy quét", "Màn hình", "Máy in", "Loa"],
        "correct_index": 0,
        "explanation": "Các thiết bị nhập cơ bản gồm: bàn phím (keyboard), chuột (mouse), máy quét (scanner)."
    },
    {
        "weight": "normal",
        "tags": ["ĐẠI CƯƠNG VỀ MÁY TÍNH ĐIỆN TỬ & CNTT", "Cấu trúc"],
        "question": "Trong cấu trúc của một máy tính điện tử, <span class=\"keyword\">đơn vị xử lý trung tâm (CPU)</span> gồm <span class=\"keyword\">bao nhiêu bộ phận</span> chính?",
        "options": ["2", "1", "4", "3"],
        "correct_index": 3,
        "explanation": "Bộ xử lý trung tâm (CPU) chỉ huy các hoạt động của máy tính theo lệnh và thực hiện các phép tính. CPU có 3 bộ phận chính: khối điều khiển; khối tính toán số học, logic; các thanh ghi."
    },
    {
        "weight": "normal",
        "tags": ["ĐẠI CƯƠNG VỀ MÁY TÍNH ĐIỆN TỬ & CNTT", "Hệ thống"],
        "question": "Phần mềm nào sau đây là <span class=\"keyword\">phần mềm ứng dụng</span>?",
        "options": ["Google Chrome", "Unix", "Windows 10", "Linux"],
        "correct_index": 0,
        "explanation": "Một số phần mềm ứng dụng được sử dụng rất phổ biến hiện nay như: MS Word, MS Excel, MS Access, Photoshop, Google Chrome (trình duyệt web),…"
    },
    {
        "weight": "normal",
        "tags": ["ĐẠI CƯƠNG VỀ MÁY TÍNH ĐIỆN TỬ & CNTT", "Cấu trúc"],
        "question": "Trong cấu trúc của một máy tính điện tử, <span class=\"keyword\">ổ đĩa cứng</span> thuộc <span class=\"keyword\">loại bộ nhớ</span> nào?",
        "options": ["Bộ nhớ ngoài", "Bộ nhớ trong", "Bộ nhớ chỉ đọc", "Bộ nhớ truy xuất ngẫu nhiên"],
        "correct_index": 0,
        "explanation": "Bộ nhớ ngoài là thiết bị lưu trữ thông tin với dung lượng lớn, thông tin không bị mất khi không có điện. Hiện nay có các loại bộ nhớ ngoài phổ biến như: Đĩa cứng (hard disk); Đĩa quang (Compact disk); thẻ nhớ..."
    },
    {
        "weight": "normal",
        "tags": ["ĐẠI CƯƠNG VỀ MÁY TÍNH ĐIỆN TỬ & CNTT", "Cấu trúc"],
        "question": "Trong cấu trúc của một máy tính điện tử, thiết bị nào sau đây là <span class=\"keyword\">thiết bị nhập</span>?",
        "options": ["Chuột", "Máy in", "Loa", "Màn hình"],
        "correct_index": 0,
        "explanation": "Các thiết bị nhập cơ bản gồm: bàn phím (keyboard), chuột (mouse), máy quét (scanner)."
    },
    {
        "weight": "normal",
        "tags": ["SỬ DỤNG HỆ ĐIỀU HÀNH WINDOWS 10", "Phân luồng"],
        "question": "Trong cửa sổ File Explorer, tổ hợp phím nào được sử dụng <span class=\"keyword\">dán đối tượng</span> vừa sao chép vào vị trí hiện hành?",
        "options": ["Ctrl + C", "Ctrl + V", "Ctrl + P", "Ctrl + A"],
        "correct_index": 1,
        "explanation": "Ctrl + V dùng để dán đối tượng."
    },
    {
        "weight": "normal",
        "tags": ["SỬ DỤNG HỆ ĐIỀU HÀNH WINDOWS 10", "Phân luồng"],
        "question": "Trong hệ điều hành Windows 10, nhấn tổ hợp phím nào để <span class=\"keyword\">sao chép (copy)</span> đối tượng đang được chọn khối?",
        "options": ["Ctrl + X", "Ctrl + A", "Ctrl + C", "Ctrl + P"],
        "correct_index": 2,
        "explanation": "Ctrl + C dùng để sao chép đối tượng."
    },
    {
        "weight": "normal",
        "tags": ["SỬ DỤNG HỆ ĐIỀU HÀNH WINDOWS 10", "Logic & Nguyên tắc"],
        "question": "Trong hệ điều hành Windows 10, biểu tượng nào trên màn hình Desktop là nơi <span class=\"keyword\">lưu trữ tạm thời</span> các tập tin và các đối tượng <span class=\"keyword\">đã bị xoá</span>?",
        "options": ["Network", "Shortcut", "This PC", "Recycle Bin"],
        "correct_index": 3,
        "explanation": "This PC: biểu tượng duyệt nhanh tài nguyên, Recycle Bin: nơi lưu trữ tạm thời các tập tin và đối tượng đã bị xoá."
    },
    {
        "weight": "normal",
        "tags": ["SỬ DỤNG HỆ ĐIỀU HÀNH WINDOWS 10", "Logic & Nguyên tắc"],
        "question": "Phần mềm <span class=\"keyword\">Unikey</span> được cài đặt vào Windows, <span class=\"keyword\">mục đích</span> dùng để làm gì?",
        "options": ["Vẽ cơ bản", "Giải nén dữ liệu", "Duyệt web", "Gõ dấu tiếng việt"],
        "correct_index": 3,
        "explanation": "Unikey là một phần mềm tiện ích được cài đặt vào Windows để hỗ trợ gõ văn bản tiếng Việt."
    },
    {
        "weight": "normal",
        "tags": ["SỬ DỤNG HỆ ĐIỀU HÀNH WINDOWS 10", "Logic & Nguyên tắc"],
        "question": "Để <span class=\"keyword\">bật hoặc tắt</span> chế độ <span class=\"keyword\">gõ dấu tiếng Việt</span> khi sử dụng phần mềm tiện ích <span class=\"keyword\">Unikey</span>, chúng ta chọn tổ hợp phím nào sau đây?",
        "options": ["Shift + Z", "Ctrl + Shift + F6", "Ctrl + Shift", "Alt + Shift"],
        "correct_index": 2,
        "explanation": "Để bật hoặc tắt chế độ gõ dấu tiếng Việt khi sử dụng phần mềm tiện ích Unikey, chúng ta chọn tổ hợp phím Ctrl + Shift hoặc Alt + Z tùy theo thiết lập của người sử dụng."
    },
    {
        "weight": "normal",
        "tags": ["SỬ DỤNG HỆ ĐIỀU HÀNH WINDOWS 10", "Phân luồng"],
        "question": "Trong cửa sổ Recycle Bin, để <span class=\"keyword\">phục hồi đối tượng</span> sau khi xóa, người dùng nhấp phải trên đối tượng cần phục hồi và chọn lệnh nào sau đây?",
        "options": ["Cut", "Properties", "Delete", "Restore"],
        "correct_index": 3,
        "explanation": "Trong cửa sổ Recycle Bin, chọn lệnh Restore: để phục hồi đối tượng sau khi xóa."
    },
    {
        "weight": "normal",
        "tags": ["MICROSOFT WORD 2013 CƠ BẢN", "Phân luồng"],
        "question": "Trong chương trình Microsoft Office Word 2013, trong khi thực hiện thao tác <span class=\"keyword\">định dạng bảng biểu</span>, lệnh nào cho phép <span class=\"keyword\">tự động canh chỉnh</span> độ rộng của bảng biểu?",
        "options": ["Auto Fit", "Draw Table", "Cell Margins", "Text Direction"],
        "correct_index": 0,
        "explanation": "Auto Fit (Tự động canh chỉnh) dùng để tự động vừa vặn cột bảng biểu."
    },
    {
        "weight": "normal",
        "tags": ["MICROSOFT WORD 2013 CƠ BẢN", "Cấu trúc"],
        "question": "Trong chương trình Microsoft Office Word 2013, trong khi thực hiện thao tác định dạng cho <span class=\"keyword\">đối tượng Shape</span> nhóm lệnh nào trong thẻ Format cho phép định dạng <span class=\"keyword\">hướng chữ</span> cho nội dung văn bản bên trong Shape?",
        "options": ["Insert Shapes", "Size", "Shape Styles", "Text"],
        "correct_index": 3,
        "explanation": "Nhóm Text chứa các định dạng hướng chữ (Text Direction) cho Shape."
    },
    {
        "weight": "normal",
        "tags": ["MICROSOFT WORD 2013 CƠ BẢN", "Cấu trúc"],
        "question": "Trong chương trình Microsoft Office Word 2013, lệnh <span class=\"keyword\">chèn chữ nghệ thuật</span> (WordArt) thuộc <span class=\"keyword\">nhóm lệnh nào</span> của thẻ Insert?",
        "options": ["Illustrations", "Comments", "Links", "Text"],
        "correct_index": 3,
        "explanation": "WordArt nằm trong nhóm Text của thẻ Insert."
    },
    {
        "weight": "normal",
        "tags": ["MICROSOFT WORD 2013 CƠ BẢN", "Phân luồng"],
        "question": "Trong chương trình Microsoft Office Word 2013, hãy cho biết khi thao tác trong bảng biểu, lệnh nào được sử dụng để <span class=\"keyword\">chèn thêm 1 dòng</span> ở <span class=\"keyword\">phía trên</span> dòng hiện hành?",
        "options": ["Insert Left", "Insert Above", "Insert Below", "Insert Right"],
        "correct_index": 1,
        "explanation": "Insert Above để chèn một dòng mới phía trên dòng hiện tại trong bảng biểu."
    },
    {
        "weight": "normal",
        "tags": ["MICROSOFT WORD 2013 CƠ BẢN", "Phân luồng"],
        "question": "Trong chương trình Microsoft Office Word 2013, trong khi thực hiện thao tác <span class=\"keyword\">chia cột</span> cho đoạn văn bản tùy chọn nào cho phép xác định <span class=\"keyword\">số cột</span> cần chia đoạn văn bản?",
        "options": ["Line between", "Width and spacing", "Number of columns", "Equal column width"],
        "correct_index": 2,
        "explanation": "Tùy chọn Number of columns xác định số cột cần chia đoạn văn bản."
    },
    {
        "weight": "normal",
        "tags": ["MICROSOFT WORD 2013 CƠ BẢN", "Phân luồng"],
        "question": "Trong chương trình Microsoft Office Word 2013, khi <span class=\"keyword\">cài đặt trang giấy</span>, thông số nào giúp xác định <span class=\"keyword\">hướng giấy</span>?",
        "options": ["Page Borders", "Orientation", "Margin", "Size"],
        "correct_index": 1,
        "explanation": "Thông số Orientation giúp xác định hướng giấy (dọc hoặc ngang)."
    },
    {
        "weight": "normal",
        "tags": ["MICROSOFT WORD 2013 CƠ BẢN", "Phân luồng"],
        "question": "Trong chương trình Microsoft Office Word 2013, để tùy chỉnh các thông số <span class=\"keyword\">cài đặt trang giấy</span> chúng ta vào <span class=\"keyword\">thẻ nào</span> sau đây?",
        "options": ["Page Layout", "Insert", "View", "Home"],
        "correct_index": 0,
        "explanation": "Thẻ Page Layout (hay Layout) chứa các công cụ thiết lập lề, khổ giấy, hướng giấy."
    },
    {
        "weight": "normal",
        "tags": ["MICROSOFT WORD 2013 CƠ BẢN", "Cấu trúc"],
        "question": "Trong chương trình Microsoft Office Word 2013, cho biết tùy chọn nào sau đây được sử dụng để <span class=\"keyword\">thay đổi hình dáng</span> cho đối tượng <span class=\"keyword\">WordArt</span>?",
        "options": ["Glow", "Reflection", "Transform", "Shadow"],
        "correct_index": 2,
        "explanation": "Hiệu ứng Transform sử dụng để thay đổi hình dáng cho đối tượng WordArt."
    },
    {
        "weight": "normal",
        "tags": ["MICROSOFT WORD 2013 CƠ BẢN", "Cấu trúc"],
        "question": "Trong chương trình Microsoft Office Word 2013, trong khi thực hiện thao tác định dạng cho <span class=\"keyword\">đối tượng Shape</span> lệnh nào cho phép xác định <span class=\"keyword\">màu nền</span> của Shape?",
        "options": ["Shape Fill", "Shape Outline", "Align Text", "Shape Effects"],
        "correct_index": 0,
        "explanation": "Shape Fill dùng để đổ màu nền cho đối tượng Shape."
    },
    {
        "weight": "normal",
        "tags": ["MICROSOFT EXCEL 2013 CƠ BẢN", "Hệ thống"],
        "question": "Trong chương trình Microsoft Office Excel 2013, để <span class=\"keyword\">chuyển đổi</span> dữ liệu chuỗi sang <span class=\"keyword\">chữ in hoa</span> người sử dụng dùng hàm gì?",
        "options": ["LEN", "LEFT", "MID", "UPPER"],
        "correct_index": 3,
        "explanation": "UPPER dùng để viết hoa toàn bộ chuỗi ký tự."
    },
    {
        "weight": "normal",
        "tags": ["MICROSOFT EXCEL 2013 CƠ BẢN", "Logic & Nguyên tắc"],
        "question": "Trong chương trình Microsoft Office Excel 2013, cho biết lệnh nào được sử dụng để <span class=\"keyword\">xóa 1 worksheet</span>?",
        "options": ["Delete Sheet", "Delete Sheet Columns", "Delete Sheet Rows", "Delete Cells"],
        "correct_index": 0,
        "explanation": "Lệnh Delete Sheet dùng để xóa toàn bộ một trang tính (worksheet)."
    },
    {
        "weight": "normal",
        "tags": ["MICROSOFT EXCEL 2013 CƠ BẢN", "Hệ thống"],
        "question": "Trong chương trình Microsoft Office Excel 2013, cho biết <span class=\"keyword\">hàm NOW()</span> có <span class=\"keyword\">ý nghĩa</span> gì?",
        "options": ["Trả về ngày hiện hành của hệ thống", "Trả về giá trị tháng trong biểu thức Date", "Trả về giá trị dạng Date theo qui định của hệ thống", "Trả về ngày và giờ hiện hành của hệ thống"],
        "correct_index": 3,
        "explanation": "Hàm NOW() trả về cả ngày và giờ hiện hành của hệ thống máy tính."
    },
    {
        "weight": "normal",
        "tags": ["MICROSOFT EXCEL 2013 CƠ BẢN", "Logic & Nguyên tắc"],
        "question": "Trong chương trình Microsoft Office Excel 2013, khi định dạng cho dữ liệu trong hộp thoại Format Cells định dạng nào dùng để định dạng các <span class=\"keyword\">giá trị ngày và thời gian</span> tùy theo chọn lựa tại phần <span class=\"keyword\">Type và Locale</span>?",
        "options": ["Currency", "Date", "Percentage", "Number"],
        "correct_index": 1,
        "explanation": "Format Cells > Date cho phép định dạng ngày tháng hiển thị theo vùng (Locale)."
    },
    {
        "weight": "normal",
        "tags": ["MICROSOFT EXCEL 2013 CƠ BẢN", "Logic & Nguyên tắc"],
        "question": "Trong chương trình Microsoft Office Excel 2013, cho biết lệnh nào được sử dụng để <span class=\"keyword\">hiển thị các Sheet đã ẩn</span>?",
        "options": ["Move or Copy…", "Show", "Insert…", "Unhide"],
        "correct_index": 3,
        "explanation": "Lệnh Unhide dùng để hiển thị lại những sheet, cột, hoặc dòng đã bị ẩn."
    },
    {
        "weight": "normal",
        "tags": ["MICROSOFT EXCEL 2013 CƠ BẢN", "Hệ thống"],
        "question": "Trong chương trình Microsoft Office Excel 2013, để <span class=\"keyword\">xác định thứ</span> trong tuần của một giá trị kiểu DATE, người sử dụng dùng hàm gì?",
        "options": ["WEEKDAY", "DAY", "TODAY", "DATE"],
        "correct_index": 0,
        "explanation": "Hàm WEEKDAY trả về một số thứ tự tương ứng với ngày trong tuần."
    },
    {
        "weight": "normal",
        "tags": ["MICROSOFT EXCEL 2013 CƠ BẢN", "Hệ thống"],
        "question": "Trong chương trình Microsoft Office Excel 2013, khi sao chép công thức tại ô A3 thì <span class=\"keyword\">cú pháp địa chỉ</span> nào sau đây sẽ <span class=\"keyword\">tham chiếu chính xác</span> giá trị tại ô A3?",
        "options": ["A$3", "A3", "$A$3", "$A3"],
        "correct_index": 2,
        "explanation": "Cú pháp địa chỉ $A$3 là địa chỉ tuyệt đối, cho phép cố định dòng và cố định cột khi sao chép công thức."
    },
    {
        "weight": "normal",
        "tags": ["MICROSOFT EXCEL 2013 CƠ BẢN", "Hệ thống"],
        "question": "Trong chương trình Microsoft Office Excel 2013, cho biết hàm nào sau đây sẽ trả về <span class=\"keyword\">giá trị tuyệt đối</span> của một số thực?",
        "options": ["ABS", "INT", "ODD", "ROUND"],
        "correct_index": 0,
        "explanation": "Hàm ABS (Absolute) trả về giá trị tuyệt đối của một số."
    },
    {
        "weight": "normal",
        "tags": ["MICROSOFT EXCEL 2013 CƠ BẢN", "Logic & Nguyên tắc"],
        "question": "Trong chương trình Microsoft Office Excel 2013, cho biết lệnh nào được sử dụng để <span class=\"keyword\">đổi tên</span> của một Sheet?",
        "options": ["Protect Sheet…", "Move or Copy…", "View Code", "Rename"],
        "correct_index": 3,
        "explanation": "Lệnh Rename cho phép đổi tên một Sheet."
    },
    {
        "weight": "normal",
        "tags": ["MICROSOFT POWERPOINT 2013 CƠ BẢN", "Logic & Nguyên tắc"],
        "question": "Trong chương trình Microsoft Office PowerPoint 2013, để thực hiện thao tác chọn <span class=\"keyword\">hiệu ứng chuyển tiếp</span> <span class=\"keyword\">giữa các slide</span> trình chiếu người sử dụng sẽ vào thẻ lệnh nào?",
        "options": ["Thẻ Transitions", "Thẻ Animations", "Thẻ Review", "Thẻ Slide Show"],
        "correct_index": 0,
        "explanation": "Thẻ Transitions chứa các hiệu ứng chuyển tiếp giữa các slide."
    },
    {
        "weight": "normal",
        "tags": ["MICROSOFT POWERPOINT 2013 CƠ BẢN", "Cấu trúc"],
        "question": "Trong chương trình Microsoft Office PowerPoint 2013, trong cửa sổ Header and Footer tùy chọn nào cho phép <span class=\"keyword\">đánh số thứ tự</span> cho <span class=\"keyword\">mỗi slide</span>?",
        "options": ["Date & time", "Footer", "Don’t show on title slide", "Slide number"],
        "correct_index": 3,
        "explanation": "Tùy chọn Slide number trong Header and Footer dùng để đánh số trang cho từng slide."
    },
    {
        "weight": "normal",
        "tags": ["MICROSOFT POWERPOINT 2013 CƠ BẢN", "Logic & Nguyên tắc"],
        "question": "Trong chương trình Microsoft Office PowerPoint 2013, cho biết lệnh nào sau đây được sử dụng để <span class=\"keyword\">trình chiếu</span> <span class=\"keyword\">slide hiện hành</span>?",
        "options": ["From Beginning", "Custom Slide Show", "From Current Slide", "Set Up Slide Show"],
        "correct_index": 2,
        "explanation": "From Current Slide (Shift + F5) dùng để trình chiếu từ slide đang chọn."
    },
    {
        "weight": "normal",
        "tags": ["MICROSOFT POWERPOINT 2013 CƠ BẢN", "Cấu trúc"],
        "question": "Trong chương trình Microsoft Office PowerPoint 2013, tập tin trình chiếu có <span class=\"keyword\">phần mở rộng</span> là gì?",
        "options": ["txt", "xlsx", "pptx", "docx"],
        "correct_index": 2,
        "explanation": "Định dạng file trình chiếu của PowerPoint từ 2007 trở đi là .pptx."
    },
    {
        "weight": "normal",
        "tags": ["MICROSOFT POWERPOINT 2013 CƠ BẢN", "Cấu trúc"],
        "question": "Trong chương trình Microsoft Office PowerPoint 2013, khi thiết lập nội dung cho footer của mỗi slide trình chiếu tùy chọn nào quy định các nội dung của footer <span class=\"keyword\">không hiển thị</span> trên <span class=\"keyword\">slide tiêu đề</span>?",
        "options": ["Footer", "Date & time", "Slide number", "Don’t show on title slide"],
        "correct_index": 3,
        "explanation": "Tùy chọn Don’t show on title slide giúp ẩn footer ở slide đầu tiên (slide tiêu đề)."
    },
    {
        "weight": "normal",
        "tags": ["MICROSOFT POWERPOINT 2013 CƠ BẢN", "Logic & Nguyên tắc"],
        "question": "Trong chương trình Microsoft Office PowerPoint 2013, cho biết <span class=\"keyword\">tổ hợp phím</span> nào được sử dụng để <span class=\"keyword\">tạo mới</span> một bài trình chiếu?",
        "options": ["CTRL+S", "CTRL+O", "CTRL+A", "CTRL+N"],
        "correct_index": 3,
        "explanation": "Tổ hợp phím Ctrl + N (New) dùng để tạo mới một file trình chiếu trắng."
    },
    {
        "weight": "normal",
        "tags": ["MICROSOFT POWERPOINT 2013 CƠ BẢN", "Logic & Nguyên tắc"],
        "question": "Trong chương trình Microsoft Office PowerPoint 2013, <span class=\"keyword\">phím tắt</span> nào cho phép thực hiện trình chiếu bài thuyết trình <span class=\"keyword\">từ slide đầu tiên</span>?",
        "options": ["F3", "F2", "F5", "F1"],
        "correct_index": 2,
        "explanation": "Phím F5 dùng để bắt đầu phiên trình chiếu từ slide đầu tiên."
    },
    {
        "weight": "normal",
        "tags": ["SỬ DỤNG INTERNET", "Nền tảng"],
        "question": "Loại tên miền nào sau đây do tổ chức <span class=\"keyword\">quản lý tài nguyên Internet Việt Nam</span> - Trung tâm Internet Việt Nam VNNIC chịu trách nhiệm quản lý và cấp cho người dùng?",
        "options": ["au", "fr", "jp", "vn"],
        "correct_index": 3,
        "explanation": "Domain mang tính địa lý: gồm 2 ký tự đại diện cho một quốc gia (vn là Việt Nam)."
    },
    {
        "weight": "normal",
        "tags": ["SỬ DỤNG INTERNET", "Hệ thống"],
        "question": "Trong cửa sổ trình duyệt web, tổ hợp phím nào được sử dụng <span class=\"keyword\">đánh dấu trang web</span> (tạo bookmark) để dễ dàng truy cập cho lần sau?",
        "options": ["CTRL + P", "CTRL + S", "CTRL + D", "CTRL + Z"],
        "correct_index": 2,
        "explanation": "Ctrl + D (Bookmark) dùng để đánh dấu và lưu trữ trang web trên trình duyệt."
    },
    {
        "weight": "normal",
        "tags": ["SỬ DỤNG INTERNET", "Hệ thống"],
        "question": "Khi sử dụng dịch vụ thư điện tử Gmail, người dùng <span class=\"keyword\">kiểm tra thư mới</span> ở <span class=\"keyword\">mục nào</span>?",
        "options": ["Inbox", "Outbox", "Chats", "Drafts"],
        "correct_index": 0,
        "explanation": "Inbox (Hộp thư đến) là nơi chứa các email mới gửi tới tài khoản."
    },
    {
        "weight": "normal",
        "tags": ["SỬ DỤNG INTERNET", "Hệ thống"],
        "question": "Phần mềm ứng dụng nào sau đây gọi là <span class=\"keyword\">trình duyệt Web</span>?",
        "options": ["Mozilla Firefox", "WinRAR", "Paint", "Notepad"],
        "correct_index": 0,
        "explanation": "Mozilla Firefox là phần mềm trình duyệt web mã nguồn mở phổ biến."
    }
]

def format_question(q):
    options = []
    for i, opt in enumerate(q["options"]):
        if i == q["correct_index"]:
            options.append(f'<span class="answer-keyword">{opt}</span>')
        else:
            options.append(opt)
    
    ans_text = q["options"][q["correct_index"]]
    answer = f'<div class="answer-title\">✅ Đáp án:</div> <span class="answer-keyword">{ans_text}</span>\\n<div class="note">{q.get("explanation", "")}</div>'
    
    return {
        "weight": q.get("weight", "normal"),
        "tags": q["tags"],
        "question": q["question"],
        "options": options,
        "answer": answer
    }

def clean_html(raw_html):
    cleanr = re.compile('<.*?>')
    return re.sub(cleanr, '', raw_html).strip()

with open('staging/temp_qs.json', 'r', encoding='utf-8') as f:
    existing_qs = json.load(f)

existing_texts = [clean_html(q['question']) for q in existing_qs]
added = 0
duplicates = 0

for q in new_qs:
    q_text_clean = clean_html(q['question'])
    if q_text_clean in existing_texts:
        duplicates += 1
    else:
        existing_qs.append(format_question(q))
        existing_texts.append(q_text_clean)
        added += 1

with open('staging/temp_qs.json', 'w', encoding='utf-8') as f:
    json.dump(existing_qs, f, ensure_ascii=False, indent=2)

print(f"Thành công! Thêm {added} câu mới, lọc bỏ {duplicates} câu trùng lặp.")
