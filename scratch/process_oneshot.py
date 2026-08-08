import json
import os
import shutil

subject_dir = '/Users/thien-ban/Library/CloudStorage/OneDrive-Personal/03_WORK/11. LearnIZ/_sources/TVU/Quan_tri_kinh_doanh_DH/15. TÀI CHÍNH TIỀN TỆ'
staging_file = os.path.join(subject_dir, 'staging', 'temp_qs.json')
main_file = os.path.join(subject_dir, 'qs.json')

new_data = [
    {
        "weight": "normal",
        "tags": ["Tài chính doanh nghiệp"],
        "question": "Mục đích tài chính cuối cùng của các doanh nghiệp là <span class=\"keyword\">tối đa hóa</span>",
        "options": [
            "A. các chỉ số tài chính.",
            "B. <span class=\"answer-keyword\">lợi nhuận</span>.",
            "C. doanh thu.",
            "D. tài sản."
        ],
        "answer": "<div class=\"answer-title\">✅ Đáp án:</div> B. lợi nhuận.\n<div class=\"note\">Theo giáo trình, mục tiêu tài chính cuối cùng của doanh nghiệp được định hướng là tối đa hóa lợi nhuận.</div>"
    },
    {
        "weight": "high",
        "tags": ["Bản chất tài chính"],
        "question": "<span class=\"keyword\">Phân phối lại</span> là tiếp tục phân phối những phần thu nhập cơ bản, những quỹ tiền tệ được hình thành trong",
        "options": [
            "A. từng khâu tài chính ra phạm vi toàn xã hội.",
            "B. quá trình phân phối ra phạm vi toàn xã hội.",
            "C. <span class=\"answer-keyword\">phân phối lần đầu</span> ra phạm vi toàn xã hội.",
            "D. hệ thống tài chính ra phạm vi toàn xã hội."
        ],
        "answer": "<div class=\"answer-title\">✅ Đáp án:</div> C. phân phối lần đầu ra phạm vi toàn xã hội.\n<div class=\"note\">Phân phối lại là quá trình tiếp tục phân phối những phần thu nhập (quỹ tiền tệ) đã được hình thành ở khâu phân phối lần đầu, nhằm điều hòa và phục vụ các mục tiêu chung của xã hội.</div>"
    },
    {
        "weight": "normal",
        "tags": ["Ngân sách Nhà nước"],
        "question": "<span class=\"keyword\">Thuế</span> được coi là có vai trò quan trọng đối với nền kinh tế bởi vì",
        "options": [
            "A. thuế là công cụ để kích thích nhập khẩu và thu hút đầu tư nước ngoài...",
            "B. việc quy định nghĩa vụ đóng góp về thuế thường được phổ biến thành luật...",
            "C. chính sách thuế là một trong những nội dung cơ bản của chính sách tài chính quốc gia.",
            "D. thuế là <span class=\"answer-keyword\">nguồn thu chủ yếu</span> của ngân sách nhà nước và là công cụ quản lý và <span class=\"answer-keyword\">điều tiết vĩ mô</span> nền kinh tế quốc dân."
        ],
        "answer": "<div class=\"answer-title\">✅ Đáp án:</div> D. thuế là nguồn thu chủ yếu của ngân sách nhà nước và là công cụ quản lý và điều tiết vĩ mô nền kinh tế quốc dân.\n<div class=\"note\">Vai trò sống còn của thuế thể hiện ở việc nó vừa đảm bảo nguồn thu chính (80-90%) cho NSNN, vừa là công cụ sắc bén để Nhà nước điều tiết kinh tế vĩ mô.</div>"
    },
    {
        "weight": "normal",
        "tags": ["Ngân sách Nhà nước"],
        "question": "Đâu là <span class=\"keyword\">công việc khởi đầu</span> có ý nghĩa quyết định đến toàn bộ các khâu của quá trình quản lý ngân sách?",
        "options": [
            "A. Thông báo ngân sách",
            "B. Chấp hành ngân sách",
            "C. <span class=\"answer-keyword\">Lập ngân sách</span>",
            "D. Phê chuẩn ngân sách"
        ],
        "answer": "<div class=\"answer-title\">✅ Đáp án:</div> C. Lập ngân sách\n<div class=\"note\">Quy trình quản lý NSNN có 3 khâu: Lập ngân sách (dự toán) ➔ Chấp hành ngân sách ➔ Quyết toán ngân sách. Bước \"Lập ngân sách\" là bước khởi đầu quyết định mọi hoạt động sau này.</div>"
    },
    {
        "weight": "normal",
        "tags": ["Tài chính doanh nghiệp"],
        "question": "Vai trò nào của tài chính doanh nghiệp đặt ra như một vấn đề có <span class=\"keyword\">tính sống còn</span> đối với doanh nghiệp?",
        "options": [
            "A. Giúp doanh nghiệp sử dụng vốn tiết kiệm và hiệu quả.",
            "B. Công cụ khai thác <span class=\"answer-keyword\">thu hút các nguồn tài chính</span> nhằm đáp ứng nhu cầu của doanh nghiệp.",
            "C. Khuyến khích và điều tiết hoạt động kinh doanh của doanh nghiệp.",
            "D. Kiểm tra, giám sát hoạt động của doanh nghiệp."
        ],
        "answer": "<div class=\"answer-title\">✅ Đáp án:</div> B. Công cụ khai thác thu hút các nguồn tài chính nhằm đáp ứng nhu cầu của doanh nghiệp.\n<div class=\"note\">Việc huy động đủ vốn là điều kiện tiên quyết (sống còn) để doanh nghiệp có thể thành lập, tồn tại và tiến hành kinh doanh.</div>"
    },
    {
        "weight": "high",
        "tags": ["Tài chính doanh nghiệp"],
        "question": "Để lập <span class=\"keyword\">quỹ dự phòng</span> bắt buộc, doanh nghiệp phải lấy từ nguồn nào sau đây?",
        "options": [
            "A. Vốn pháp định",
            "B. Vốn chủ sở hữu",
            "C. <span class=\"answer-keyword\">Lợi nhuận ròng</span>",
            "D. Doanh thu"
        ],
        "answer": "<div class=\"answer-title\">✅ Đáp án:</div> C. Lợi nhuận ròng\n<div class=\"note\">Mọi quỹ của doanh nghiệp, bao gồm cả quỹ dự phòng, đều được trích lập từ lợi nhuận ròng (sau thuế) trước khi đem chia cổ tức.</div>"
    },
    {
        "weight": "normal",
        "tags": ["Tài chính doanh nghiệp"],
        "question": "<span class=\"keyword\">Thời gian sử dụng</span> tài sản trong doanh nghiệp bao lâu được coi là tài sản cố định?",
        "options": [
            "A. <span class=\"answer-keyword\">Từ 1 năm trở lên</span>",
            "B. Từ 3 tháng trở lên",
            "C. Từ 2 năm trở lên",
            "D. Từ 5 tháng trở lên"
        ],
        "answer": "<div class=\"answer-title\">✅ Đáp án:</div> A. Từ 1 năm trở lên\n<div class=\"note\">Theo quy chuẩn kế toán và tài chính, một trong những điều kiện tiên quyết để ghi nhận Tài sản cố định là có thời gian sử dụng từ 1 năm (12 tháng) trở lên.</div>"
    },
    {
        "weight": "normal",
        "tags": ["Vai trò tài chính"],
        "question": "Ý nào sau đây <span class=\"keyword\">KHÔNG phải</span> vai trò của tài chính ở tầm <span class=\"keyword\">vi mô</span>?",
        "options": [
            "A. Tích tụ và tập trung vốn, cung ứng vốn cho các nhu cầu công nghiệp hóa, hiện đại hóa.",
            "B. Xác lập và tăng cường các quan hệ kinh tế - xã hội.",
            "C. Điều tiết kinh tế.",
            "D. <span class=\"answer-keyword\">Tăng cường tiềm lực</span> tài chính của đất nước."
        ],
        "answer": "<div class=\"answer-title\">✅ Đáp án:</div> D. Tăng cường tiềm lực tài chính của đất nước.\n<div class=\"note\">\"Tăng cường tiềm lực tài chính của đất nước\" là mục tiêu và vai trò mang tầm vĩ mô (của toàn nền kinh tế quốc gia), không phải vi mô.</div>"
    },
    {
        "weight": "high",
        "tags": ["Bản chất tài chính"],
        "question": "<span class=\"keyword\">Căn cứ</span> để các khâu tài chính hợp thành một hệ thống <span class=\"keyword\">thống nhất</span>",
        "options": [
            "A. Phải gắn liền với một chủ thể phân phối cụ thể, xác định.",
            "B. Có cùng tính chất, đặc điểm, vai trò...",
            "C. Phải là một điểm hội tụ của các nguồn tài chính...",
            "D. Có <span class=\"answer-keyword\">cùng bản chất, chức năng</span>; các khâu tài chính có mối <span class=\"answer-keyword\">liên hệ hữu cơ</span> trong việc tạo lập, sử dụng các quỹ tiền tệ..."
        ],
        "answer": "<div class=\"answer-title\">✅ Đáp án:</div> D. Có cùng bản chất, chức năng; các khâu tài chính có mối liên hệ hữu cơ...\n<div class=\"note\">Hệ thống tài chính là một thể thống nhất vì các khâu cấu thành nó đều có chung bản chất (quan hệ kinh tế dưới hình thái giá trị), chức năng và có mối liên hệ hữu cơ khăng khít với nhau.</div>"
    },
    {
        "weight": "normal",
        "tags": ["Bản chất tài chính"],
        "question": "<span class=\"keyword\">Chức năng</span> của tài chính gồm có",
        "options": [
            "A. chức năng phân phối và chức năng thanh tra.",
            "B. chức năng thanh tra và chức năng giám đốc.",
            "C. chức năng thanh tra và chức năng giám sát.",
            "D. chức năng <span class=\"answer-keyword\">phân phối</span> và chức năng <span class=\"answer-keyword\">giám đốc</span>."
        ],
        "answer": "<div class=\"answer-title\">✅ Đáp án:</div> D. chức năng phân phối và chức năng giám đốc.\n<div class=\"note\">Tài chính có 2 chức năng cơ bản nhất là: Chức năng phân phối và Chức năng giám đốc (kiểm tra bằng đồng tiền).</div>"
    },
    {
        "weight": "normal",
        "tags": ["Ngân sách Nhà nước"],
        "question": "<span class=\"keyword\">Phí</span> thuộc ngân sách nhà nước thu về",
        "options": [
            "A. đủ để bù đắp chi phí đã bỏ ra.",
            "B. vượt quá chi phí đã bỏ ra.",
            "C. không tính tới chi phí đã bỏ ra.",
            "D. <span class=\"answer-keyword\">không đủ bù đắp</span> chi phí đã bỏ ra."
        ],
        "answer": "<div class=\"answer-title\">✅ Đáp án:</div> D. không đủ bù đắp chi phí đã bỏ ra.\n<div class=\"note\">Phí mang tính chất phục vụ lợi ích công cộng do cơ quan nhà nước cung cấp nên khoản thu này thường không nhằm mục đích kinh doanh sinh lời và không đủ bù đắp chi phí thực tế bỏ ra.</div>"
    },
    {
        "weight": "high",
        "tags": ["Ngân sách Nhà nước"],
        "question": "Yếu tố <span class=\"keyword\">khách quan</span> nào quyết định <span class=\"keyword\">mức động viên</span> của thu ngân sách nhà nước?",
        "options": [
            "A. ODA",
            "B. <span class=\"answer-keyword\">GDP</span>",
            "C. FDI",
            "D. GNP"
        ],
        "answer": "<div class=\"answer-title\">✅ Đáp án:</div> B. GDP\n<div class=\"note\">GDP (Tổng sản phẩm quốc nội) là thước đo quy mô nền kinh tế. Nền kinh tế càng lớn (GDP càng cao) thì mức động viên (khả năng thu) của NSNN càng dồi dào. Đây là yếu tố khách quan cơ bản nhất.</div>"
    },
    {
        "weight": "normal",
        "tags": ["Ngân sách Nhà nước"],
        "question": "Nhân tố nào <span class=\"keyword\">KHÔNG gây ảnh hưởng</span> đến thu ngân sách nhà nước?",
        "options": [
            "A. Mức độ trang trải các khoản chi phí của nhà nước.",
            "B. Tỉ suất doanh lợi của nền kinh tế.",
            "C. Mức <span class=\"answer-keyword\">nhập khẩu tài nguyên</span> thiên nhiên.",
            "D. GDP bình quân đầu người."
        ],
        "answer": "<div class=\"answer-title\">✅ Đáp án:</div> C. Mức nhập khẩu tài nguyên thiên nhiên.\n<div class=\"note\">Xuất khẩu tài nguyên (ví dụ xuất khẩu dầu thô) mới đóng góp trực tiếp vào thu NSNN. Việc nhập khẩu tài nguyên thiên nhiên không phải là nhân tố cơ bản ảnh hưởng trực tiếp đến sự gia tăng thu NSNN.</div>"
    },
    {
        "weight": "normal",
        "tags": ["Tài chính doanh nghiệp"],
        "question": "Bản chất của tài chính doanh nghiệp là hệ thống những <span class=\"keyword\">mối quan hệ nào</span> dưới hình thái giá trị phát sinh trong quá trình hình thành, phân phối và sử dụng các quỹ tiền tệ...?",
        "options": [
            "A. Quan hệ mật thiết",
            "B. Quan hệ xã hội",
            "C. Quan hệ tiền tệ",
            "D. <span class=\"answer-keyword\">Quan hệ kinh tế</span>"
        ],
        "answer": "<div class=\"answer-title\">✅ Đáp án:</div> D. Quan hệ kinh tế\n<div class=\"note\">Bản chất của tài chính nói chung và TCDN nói riêng luôn là các quan hệ kinh tế dưới hình thái giá trị, ẩn sau sự vận động của đồng tiền.</div>"
    },
    {
        "weight": "normal",
        "tags": ["Tài chính doanh nghiệp"],
        "question": "Để tiến hành hoạt động sản xuất kinh doanh, các doanh nghiệp phải hội tụ các <span class=\"keyword\">yếu tố cơ bản</span> sau:",
        "options": [
            "A. Tư liệu lao động, sức lao động, đối tượng lao động và vốn.",
            "B. <span class=\"answer-keyword\">Tư liệu lao động</span>, <span class=\"answer-keyword\">sức lao động</span> và <span class=\"answer-keyword\">đối tượng lao động</span>.",
            "C. Tư liệu lao động, sức lao động và vốn.",
            "D. Đối tượng lao động, sức lao động và vốn."
        ],
        "answer": "<div class=\"answer-title\">✅ Đáp án:</div> B. Tư liệu lao động, sức lao động và đối tượng lao động.\n<div class=\"note\">Theo kinh tế học Mác-Lênin, 3 yếu tố cơ bản của mọi quá trình sản xuất kinh doanh là: Sức lao động, Đối tượng lao động và Tư liệu lao động. (Vốn chỉ là biểu hiện bằng tiền của 3 yếu tố này).</div>"
    },
    {
        "weight": "normal",
        "tags": ["Tài chính doanh nghiệp"],
        "question": "Nhân tố cấu thành <span class=\"keyword\">vốn cố định</span> là",
        "options": [
            "A. Đầu tư tài chính <span class=\"answer-keyword\">dài hạn</span>.",
            "B. Tài sản ngằn hạn.",
            "C. Hàng tồn kho.",
            "D. Vốn bằng tiền."
        ],
        "answer": "<div class=\"answer-title\">✅ Đáp án:</div> A. Đầu tư tài chính dài hạn.\n<div class=\"note\">Vốn cố định tương ứng với các Tài sản dài hạn. Trong 4 đáp án trên, chỉ có Đầu tư tài chính dài hạn thuộc nhóm TS dài hạn, 3 đáp án còn lại là TS ngắn hạn (VLĐ).</div>"
    },
    {
        "weight": "normal",
        "tags": ["Tài chính doanh nghiệp"],
        "question": "Vai trò của <span class=\"keyword\">vốn</span> đối với các doanh nghiệp là",
        "options": [
            "A. điều kiện để doanh nghiệp ra đời và chiến thắng trong cạnh tranh.",
            "B. điều kiện để sản xuất kinh doanh diễn ra liên tục và ổn định.",
            "C. điều kiện để đầu tư và phát triển.",
            "D. <span class=\"answer-keyword\">điều kiện tiền đề</span>, đảm bảo sự <span class=\"answer-keyword\">tồn tại ổn định</span> và phát triển."
        ],
        "answer": "<div class=\"answer-title\">✅ Đáp án:</div> D. điều kiện tiền đề, đảm bảo sự tồn tại ổn định và phát triển.\n<div class=\"note\">Vốn là bệ phóng đầu tiên (tiền đề) để thành lập doanh nghiệp, là huyết mạch duy trì sự ổn định trong kinh doanh và là sức bật để mở rộng phát triển. Đây là vai trò tổng quát nhất.</div>"
    },
    {
        "weight": "normal",
        "tags": ["Các khâu tài chính"],
        "question": "Quỹ đoàn thu từ <span class=\"keyword\">đoàn phí</span> thuộc",
        "options": [
            "A. tài chính hộ gia đình.",
            "B. tài chính doanh nghiệp.",
            "C. <span class=\"answer-keyword\">tài chính công</span>.",
            "D. tài chính trung gian."
        ],
        "answer": "<div class=\"answer-title\">✅ Đáp án:</div> C. tài chính công.\n<div class=\"note\">Tài chính của các tổ chức đoàn thể xã hội (như Đoàn thanh niên, Công đoàn) được phân loại thuộc nhóm Tài chính công (hoặc tài chính các tổ chức phi lợi nhuận của Nhà nước).</div>"
    },
    {
        "weight": "high",
        "tags": ["Ngân sách Nhà nước"],
        "question": "Giải pháp bù đắp <span class=\"keyword\">thâm hụt ngân sách</span> nhà nước có <span class=\"keyword\">chi phí cơ hội thấp nhất</span> là",
        "options": [
            "A. <span class=\"answer-keyword\">vay tiền của dân cư</span>.",
            "B. chỉ cần tăng thuế, đặc biệt thuế thu nhập doanh nghiệp.",
            "C. chỉ cần phát hành thêm tiền mặt vào lưu thông.",
            "D. chỉ cần tăng thuế, đặc biệt là thuế xuất – nhập khẩu."
        ],
        "answer": "<div class=\"answer-title\">✅ Đáp án:</div> A. vay tiền của dân cư.\n<div class=\"note\">Vay nợ trong nước (phát hành trái phiếu) là giải pháp an toàn nhất, ít gây sốc lạm phát (như in tiền) và ít làm suy kiệt sản xuất (như tăng thuế).</div>"
    },
    {
        "weight": "high",
        "tags": ["Tài chính doanh nghiệp"],
        "question": "Ý nghĩa của việc nghiên cứu sự <span class=\"keyword\">phân biệt</span> giữa vốn cố định và vốn lưu động của một doanh nghiệp là",
        "options": [
            "A. tìm ra các biện pháp quản lý, sử dụng để thực hiện khâu hao tài sản cố định nhanh chóng nhất.",
            "B. tìm ra các biện pháp để tiết kiệm vốn.",
            "C. <span class=\"answer-keyword\">tìm ra các biện pháp quản lý sử dụng hiệu quả</span> nhất đối với <span class=\"answer-keyword\">mỗi loại</span>.",
            "D. tìm ra các biện pháp để quản lý và tăng nhanh vòng quay của vốn lưu động."
        ],
        "answer": "<div class=\"answer-title\">✅ Đáp án:</div> C. tìm ra các biện pháp quản lý sử dụng hiệu quả nhất đối với mỗi loại.\n<div class=\"note\">Vì đặc điểm luân chuyển của VCĐ (dần dần) và VLĐ (toàn bộ 1 lần) hoàn toàn khác nhau, việc phân biệt chúng giúp nhà quản trị áp dụng biện pháp quản lý chuyên biệt và tối ưu hóa hiệu quả cho từng loại.</div>"
    }
]

try:
    with open(main_file, 'r', encoding='utf-8') as f:
        existing_data = json.load(f)
except Exception:
    existing_data = []

import re
def clean_html(raw_html):
    return re.sub('<.*?>', '', raw_html).strip()

existing_questions_cleaned = [clean_html(item['question']) for item in existing_data]

added_count = 0
for item in new_data:
    q_clean = clean_html(item['question'])
    if q_clean not in existing_questions_cleaned:
        existing_data.append(item)
        added_count += 1
    else:
        # Update existing question with new options/highlight if it matches
        for idx, exist_item in enumerate(existing_data):
            if clean_html(exist_item['question']) == q_clean:
                existing_data[idx] = item
                break

with open(staging_file, 'w', encoding='utf-8') as f:
    json.dump(existing_data, f, ensure_ascii=False, indent=2)

shutil.copy2(staging_file, main_file)
print(f"DONE: Processed {len(new_data)} questions. Total in database: {len(existing_data)}")
