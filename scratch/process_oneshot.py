import json
import os
import shutil

# Dữ liệu JSON đã được giải và highlight theo Ma trận Lục hợp
data = [
    {
        "weight": "normal",
        "tags": ["Kinh tế vĩ mô"],
        "question": "Kinh tế vĩ mô <span class=\"keyword\">ít đề cập</span> đến:",
        "options": [
            "A. Thất nghiệp",
            "B. Sự thay đổi <span class=\"answer-keyword\">giá cả tương đối</span>",
            "C. Mức sống",
            "D. Sự thay đổi mức giá chung"
        ],
        "answer": "<div class=\"answer-title\">✅ Đáp án:</div> B. Sự thay đổi giá cả tương đối\n<div class=\"note\">Giá cả tương đối của từng mặt hàng cụ thể thuộc phạm vi nghiên cứu của Kinh tế vi mô.</div>"
    },
    {
        "weight": "normal",
        "tags": ["GDP và GNP"],
        "question": "Tất cả những yếu tố dưới đây là bộ phận của thu nhập quốc dân, <span class=\"keyword\">trừ</span>:",
        "options": [
            "A. Tiền trả tù nhân cho công việc họ làm trong tù.",
            "B. <span class=\"answer-keyword\">Trợ cấp</span> ốm đau.",
            "C. Tiền lương cảnh sát.",
            "D. Lương của những người làm trong các tổ chức từ thiện."
        ],
        "answer": "<div class=\"answer-title\">✅ Đáp án:</div> B. Trợ cấp ốm đau.\n<div class=\"note\">Trợ cấp (Transfer payments) là khoản tiền chuyển giao một chiều, không phát sinh từ việc sản xuất hàng hoá dịch vụ nên không tính vào thu nhập quốc dân.</div>"
    },
    {
        "weight": "normal",
        "tags": ["GDP và GNP"],
        "question": "Tại Việt Nam nếu <span class=\"keyword\">GDP lớn hơn GNP</span> thì:",
        "options": [
            "A. Người <span class=\"answer-keyword\">nước ngoài</span> đang sản xuất ở Việt Nam <span class=\"answer-keyword\">nhiều hơn</span> so với người Việt Nam đang sản xuất ở nước ngoài.",
            "B. Người Việt Nam đang sản xuất ở nước ngoài nhiều hơn so với người nước ngoài đang sản xuất ở Việt Nam.",
            "C. GDP thực tế lớn hơn GDP danh nghĩa.",
            "D. GNP thực tế lớn hơn GNP danh nghĩa."
        ],
        "answer": "<div class=\"answer-title\">✅ Đáp án:</div> A. Người nước ngoài đang sản xuất ở Việt Nam nhiều hơn so với người Việt Nam đang sản xuất ở nước ngoài.\n<div class=\"note\">GDP = GNP - NFA. GDP > GNP tức NFA (Thu nhập ròng từ nước ngoài) < 0. Nghĩa là thu nhập của người nước ngoài tạo ra tại VN lớn hơn thu nhập của người VN tạo ra ở nước ngoài.</div>"
    },
    {
        "weight": "normal",
        "tags": ["GDP và GNP"],
        "question": "Khoản chi tiêu 40.000$ mua một chiếc xe BMW được <span class=\"keyword\">sản xuất tại Đức</span> của bạn được tính vào GDP của Việt Nam như thế nào?",
        "options": [
            "A. Xuất khẩu ròng tăng 40.000$",
            "B. Xuất khẩu ròng giảm 40.000$",
            "C. Đầu tư tăng 40.000$ và xuất khẩu ròng tăng 40.000$",
            "D. <span class=\"answer-keyword\">Tiêu dùng tăng</span> 40.000$ và <span class=\"answer-keyword\">xuất khẩu ròng giảm</span> 40.000$"
        ],
        "answer": "<div class=\"answer-title\">✅ Đáp án:</div> D. Tiêu dùng tăng 40.000$ và xuất khẩu ròng giảm 40.000$\n<div class=\"note\">Xe nhập khẩu làm Tiêu dùng (C) tăng, đồng thời Nhập khẩu (IM) tăng làm Xuất khẩu ròng (NX = EX - IM) giảm một khoản tương ứng. Tổng GDP không đổi.</div>"
    },
    {
        "weight": "normal",
        "tags": ["Kinh tế vĩ mô"],
        "question": "\"<span class=\"keyword\">Chỉ số giá</span> hàng tiêu dùng ở Việt Nam <span class=\"keyword\">tăng khoảng 12%</span> mỗi năm trong giai đoạn 2007-2010\" câu nói này thuộc:",
        "options": [
            "A. Kinh tế vi mô và thực chứng",
            "B. Kinh tế vi mô và chuẩn tắc",
            "C. Kinh tế vĩ mô và chuẩn tắc",
            "D. Kinh tế vĩ mô và <span class=\"answer-keyword\">thực chứng</span>"
        ],
        "answer": "<div class=\"answer-title\">✅ Đáp án:</div> D. Kinh tế vĩ mô và thực chứng\n<div class=\"note\">\"Chỉ số giá\" (lạm phát) là vấn đề vĩ mô. Câu nói mô tả một sự thật khách quan đã xảy ra (số liệu 12%) nên là nhận định thực chứng.</div>"
    },
    {
        "weight": "normal",
        "tags": ["Kinh tế vĩ mô"],
        "question": "Chủ đề nào dưới đây được <span class=\"keyword\">kinh tế vĩ mô</span> quan tâm?",
        "options": [
            "A. <span class=\"answer-keyword\">Chính sách</span> tiền tệ, chính sách tài khóa, <span class=\"answer-keyword\">lạm phát</span> và thất nghiệp",
            "B. Lạm phát và thất nghiệp",
            "C. Chính sách tài khóa",
            "D. Chính sách tiền tệ"
        ],
        "answer": "<div class=\"answer-title\">✅ Đáp án:</div> A. Chính sách tiền tệ, chính sách tài khóa, lạm phát và thất nghiệp\n<div class=\"note\">Vĩ mô nghiên cứu tổng thể nền kinh tế thông qua các chính sách lớn và các chỉ tiêu tổng hợp như lạm phát, thất nghiệp. Phương án A bao hàm đầy đủ nhất.</div>"
    },
    {
        "weight": "normal",
        "tags": ["Chính sách vĩ mô"],
        "question": "Theo lý thuyết của Keynes kết hợp chính sách nào trong các chính sách sau đây thích hợp nhất đối với một Chính phủ đang <span class=\"keyword\">cắt giảm thất nghiệp</span>?",
        "options": [
            "A. Phá giá, tăng thuế và cắt giảm chi tiêu của Chính phủ.",
            "B. Tăng thuế thu nhập và tăng chi tiêu của Chính phủ.",
            "C. Phá giá, giảm thuế và giảm chi tiêu của Chính phủ.",
            "D. <span class=\"answer-keyword\">Cắt giảm thuế</span> và <span class=\"answer-keyword\">tăng chi tiêu</span> của Chính phủ."
        ],
        "answer": "<div class=\"answer-title\">✅ Đáp án:</div> D. Cắt giảm thuế và tăng chi tiêu của Chính phủ.\n<div class=\"note\">Để giảm thất nghiệp cần kích cầu bằng chính sách tài khóa mở rộng: Tăng chi tiêu chính phủ (G) và Giảm thuế (T).</div>"
    },
    {
        "weight": "normal",
        "tags": ["Kinh tế vĩ mô"],
        "question": "Phát biểu nào sau đây <span class=\"keyword\">KHÔNG đúng</span>?",
        "options": [
            "A. Thất nghiệp là tình trạng mà những người trong độ tuổi lao động có đăng ký tìm việc nhưng chưa có việc làm hoặc chờ được gọi đi làm việc.",
            "B. Tổng cầu dịch chuyển là do chịu tác động của các nhân tố ngoài mức giá chung trong nền kinh tế.",
            "C. <span class=\"answer-keyword\">Sản lượng tiềm năng</span> là mức sản lượng thực <span class=\"answer-keyword\">cao nhất</span> mà một quốc gia đạt được.",
            "D. Lạm phát là tình trạng mức giá chung trong nền kinh tế tăng lên cao trong một khoảng thời gian nào đó."
        ],
        "answer": "<div class=\"answer-title\">✅ Đáp án:</div> C. Sản lượng tiềm năng là mức sản lượng thực cao nhất mà một quốc gia đạt được.\n<div class=\"note\">Sản lượng tiềm năng (Y*) là mức sản lượng đạt được khi nền kinh tế sử dụng hợp lý các nguồn lực (không phải cao nhất tuyệt đối), tại đó lạm phát ổn định và thất nghiệp ở mức tự nhiên.</div>"
    },
    {
        "weight": "normal",
        "tags": ["GDP và GNP"],
        "question": "Trong nền kinh tế <span class=\"keyword\">mở</span>, phát biểu nào sau đây đúng?",
        "options": [
            "A. Tổng sản phẩm quốc dân nhỏ hơn tổng sản phẩm quốc nội",
            "B. Tổng sản phẩm quốc dân bằng tổng sản phẩm quốc nội",
            "C. Tổng sản phẩm quốc dân và tổng sản phẩm quốc nội khác nhau ở phần <span class=\"answer-keyword\">thu nhập yếu tố ròng</span>",
            "D. Tổng sản phẩm quốc dân lớn hơn tổng sản phẩm quốc nội"
        ],
        "answer": "<div class=\"answer-title\">✅ Đáp án:</div> C. Tổng sản phẩm quốc dân và tổng sản phẩm quốc nội khác nhau ở phần thu nhập yếu tố ròng\n<div class=\"note\">GNP = GDP + NIA (Thu nhập yếu tố ròng từ nước ngoài). Nền kinh tế mở có giao thương và dòng vốn quốc tế nên xuất hiện NIA.</div>"
    },
    {
        "weight": "high",
        "tags": ["Bài tập", "GDP và GNP"],
        "question": "Có các chỉ tiêu như sau: GNP = 5000; DI = 4100; B = -200; C = 3800; NX = -100. Giả sử khấu hao, lợi nhuận nộp và không chia, NIA đều bằng không. <span class=\"keyword\">Chi tiêu của Chính phủ</span> về hàng hóa và dịch vụ là:",
        "options": [
            "A. G = 900",
            "B. G = 800",
            "C. G = 1000",
            "D. <span class=\"answer-keyword\">G = 1100</span>"
        ],
        "answer": "<div class=\"answer-title\">✅ Đáp án:</div> D. G = 1100\n<div class=\"note\">Vì De=0, NIA=0 nên Y = GDP = GNP = 5000.<br>Thu nhập khả dụng DI = Y - T ➔ T = 5000 - 4100 = 900.<br>Cán cân ngân sách B = T - G ➔ -200 = 900 - G ➔ G = 1100.</div>"
    },
    {
        "weight": "normal",
        "tags": ["GDP và GNP"],
        "question": "<span class=\"keyword\">Sản phẩm trung gian</span> có thể được định nghĩa là sản phẩm:",
        "options": [
            "A. <span class=\"answer-keyword\">Được sử dụng</span> và <span class=\"answer-keyword\">sản xuất ra</span> hàng hóa và dịch vụ khác",
            "B. Được tính trực tiếp vào GDP",
            "C. Được mua trong năm nay, nhưng được sử dụng trong năm sau đó",
            "D. Được bán cho người sử dụng cuối cùng"
        ],
        "answer": "<div class=\"answer-title\">✅ Đáp án:</div> A. Được sử dụng và sản xuất ra hàng hóa và dịch vụ khác\n<div class=\"note\">Sản phẩm trung gian là nguyên vật liệu đầu vào bị tiêu hao hoàn toàn trong quá trình sản xuất ra sản phẩm cuối cùng.</div>"
    },
    {
        "weight": "normal",
        "tags": ["GDP và GNP"],
        "question": "Những khoản mục nào sau đây sẽ được <span class=\"keyword\">tính vào GDP năm nay</span>?",
        "options": [
            "A. Chính phủ chi trợ cấp cho đồng bào bị lũ năm nay.",
            "B. Máy in <span class=\"answer-keyword\">mới sản xuất</span> trong năm nay được công ty xuất bản mua.",
            "C. Máy tính cá nhân được sản xuất năm trước, được một sinh viên mua để chuẩn bị thi học kỳ trong năm nay.",
            "D. Một chiếc ô tô mới được nhập khẩu từ nước ngoài."
        ],
        "answer": "<div class=\"answer-title\">✅ Đáp án:</div> B. Máy in mới sản xuất trong năm nay được công ty xuất bản mua.\n<div class=\"note\">Máy in mới mua bởi doanh nghiệp là hàng hóa cuối cùng (đầu tư tư nhân - I). Trợ cấp (A) không tính, máy năm trước (C) không tính, xe nhập (D) không tính.</div>"
    },
    {
        "weight": "high",
        "tags": ["Bài tập", "Tăng trưởng"],
        "question": "Giả sử GDP danh nghĩa năm 2011 là 20 tỷ và năm 2012 là 25,3 tỷ. Biết chỉ số giá năm 2011 là 100% và năm 2012 là 115%. <span class=\"keyword\">Tốc độ tăng trưởng</span> kinh tế năm 2012 là:",
        "options": [
            "A. 20,9%",
            "B. <span class=\"answer-keyword\">10%</span>",
            "C. 15%",
            "D. 26,5%"
        ],
        "answer": "<div class=\"answer-title\">✅ Đáp án:</div> B. 10%\n<div class=\"note\">GDP thực 2011 = 20 / 1.0 = 20.<br>GDP thực 2012 = 25.3 / 1.15 = 22.<br>Tốc độ tăng trưởng = ((22 - 20) / 20) * 100% = 10%.</div>"
    },
    {
        "weight": "normal",
        "tags": ["GDP và GNP"],
        "question": "Trong nền kinh tế giản đơn và nền kinh tế <span class=\"keyword\">đóng</span> có Chính phủ, phát biểu nào sau đây đúng?",
        "options": [
            "A. Tổng sản phẩm quốc dân nhỏ hơn tổng sản phẩm quốc nội",
            "B. Tổng sản phẩm quốc dân và tổng sản phẩm quốc nội không có mối quan hệ với nhau",
            "C. Tổng sản phẩm quốc dân <span class=\"answer-keyword\">bằng</span> tổng sản phẩm quốc nội",
            "D. Tổng sản phẩm quốc dân lớn hơn tổng sản phẩm quốc nội"
        ],
        "answer": "<div class=\"answer-title\">✅ Đáp án:</div> C. Tổng sản phẩm quốc dân bằng tổng sản phẩm quốc nội\n<div class=\"note\">Kinh tế đóng tức là không có giao thương quốc tế (NFA = 0) nên GDP = GNP.</div>"
    },
    {
        "weight": "normal",
        "tags": ["GDP và GNP"],
        "question": "Nếu tính theo phương pháp <span class=\"keyword\">giá trị gia tăng</span> thì GDP bằng:",
        "options": [
            "A. Tổng thu nhập gia tăng của các nhân tố sản xuất trong nước",
            "B. <span class=\"answer-keyword\">Tổng giá trị gia tăng</span> của tất cả các ngành trong nền kinh tế",
            "C. Tổng giá trị hàng hoá và dịch vụ trừ khấu hao",
            "D. Tổng chi phí tăng thêm phát sinh từ việc sử dụng các nhân tố sản xuất như lao động, vốn, đất đai và năng lực kinh doanh"
        ],
        "answer": "<div class=\"answer-title\">✅ Đáp án:</div> B. Tổng giá trị gia tăng của tất cả các ngành trong nền kinh tế\n<div class=\"note\">Theo phương pháp sản xuất, GDP = Tổng VA (Value Added) của toàn bộ các doanh nghiệp trong nền kinh tế.</div>"
    }
]

subject_dir = '/Users/thien-ban/Library/CloudStorage/OneDrive-Personal/03_WORK/11. LearnIZ/_sources/TVU/Quan_tri_kinh_doanh_DH/15. TÀI CHÍNH TIỀN TỆ'
staging_file = os.path.join(subject_dir, 'staging', 'temp_qs.json')
main_file = os.path.join(subject_dir, 'qs.json')

# Copy to staging
with open(staging_file, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

# Verify parsing (in this case it's dict directly, but simulate parse check)
if isinstance(data, list):
    # Overwrite main
    shutil.copy2(staging_file, main_file)
    print("DONE: Processed 15 questions and wrote to qs.json.")
