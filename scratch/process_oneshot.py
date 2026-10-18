import json
import os
import re

subject_dir = "_sources/TVU/Quan_tri_kinh_doanh_DH/19. Giáo dục thể chất 2"
raw_file = os.path.join(subject_dir, "raw_inputs/raw_batch_3.txt")
staging_file = os.path.join(subject_dir, "staging/temp_qs.json")
qs_file = os.path.join(subject_dir, "qs.json")

# 1. Lưu Raw inputs Batch 3
raw_content = """Câu 1: Màu sắc tiêu chuẩn của bàn cờ vua trong lịch sử luôn là sự kết hợp của?
A. Ô sáng và Ô tối
B. Xanh và Trắng
C. Vàng và Nâu
D. Đen và Đỏ

Câu 2: FIDE được thành lập tại đâu?
A. London
B. Rome
C. Paris
D. Moscow

Câu 3: Trong lịch sử, cờ vua được truyền bá vào châu Âu chủ yếu qua con đường nào?
A. Thập tự chinh
B. Người Ả Rập qua Tây Ban Nha
C. Con đường tơ lụa
D. Thương nhân Ấn Độ

Câu 4: Cờ Vua phát triển mạnh ở đối tượng nào tại Việt Nam?
A. Nông dân
B. Công nhân
C. Sinh viên đại học
D. Người cao tuổi

Câu 5: Cờ Vua hiện nay là một trong bao nhiêu môn thể thao mũi nhọn ở Việt Nam?
A. 10
B. 12
C. 8
D. 5

Câu 6: Giải đấu cờ vua quốc tế đầu tiên trong lịch sử hiện đại được tổ chức tại đâu?
A. New York (1857)
B. Moscow (1900)
C. London (1851)
D. Paris (1850)

Câu 7: Ván cờ kết thúc khi nào?
A. Tất cả đáp án đều đúng
B. Khi hòa
C. Khi một bên chịu thua
D. Khi hết quân

Câu 8: Trận mở đầu gọi là gì trong cờ vua?
A. Trung cuộc
B. Khai cuộc
C. Phản công
D. Hậu cuộc

Câu 9: Mã chiếu vua ở đâu không cần đi tạo đôi?
A. Trước mặt
B. Bên cạnh
C. Vị trí chữ L
D. Gần quân tốt

Câu 10: Nếu chỉ còn vua và hai Tượng khác màu, có thể...?
A. Không kết thúc được
B. Đổi bên đi trước
C. Chiếu bí
D. Hòa

Câu 11: Người thua ván cờ sẽ được ghi là gì?
A. ½
B. 2
C. 1
D. 0

Câu 12: Có bao nhiêu quân Xe trên bàn lúc đầu?
A. 8
B. 6
C. 4
D. 2

Câu 13: Quân nào có thể tạo "song chiếu"?
A. Mã
B. Tốt
C. Xe
D. Hậu

Câu 14: Quân nào di chuyển linh hoạt nhất?
A. Xe
B. Hậu
C. Mã
D. Tượng

Câu 15: Mỗi bên trong cờ vua có bao nhiêu quân lúc bắt đầu?
A. 12
B. 16
C. 8
D. 20

Câu 16: Quân nào mạnh nhất trên bàn cờ?
A. Mã
B. Tượng
C. Xe
D. Hậu

Câu 17: Tốt được phong cấp khi đi đến đâu?
A. Trung tâm bàn cờ
B. Hàng thứ 5
C. Hàng thứ 6
D. Hàng cuối cùng bên đối phương

Câu 18: Quân nào không bao giờ được phong cấp?
A. Vua
B. Hậu
C. Tượng
D. Mã

Câu 19: Tên gọi của ô a1?
A. Đen
B. Màu ngẫu nhiên
C. Trắng
D. Không quy định

Câu 20: Theo luật, một ván cờ hòa nếu trong bao nhiêu nước liên tiếp không có bắt quân và không đi Tốt?
A. 40 nước
B. 50 nước
C. 30 nước
D. 20 nước
"""

with open(raw_file, "w", encoding="utf-8") as f:
    f.write(raw_content.strip())
print(f"Saved raw batch 3 to {raw_file}")

# 2. Danh sách 20 câu batch 3 kèm highlight và tag
batch3_raw_list = [
  {
    "weight": "high",
    "question": "<span class=\"keyword\">Màu sắc tiêu chuẩn</span> của bàn cờ vua trong lịch sử luôn là sự kết hợp của?",
    "answer": "<div class=\"answer-title\">✅ Đáp án:</div> <span class=\"answer-keyword\">Ô sáng và Ô tối</span><div class=\"note\">💡 Giải thích: Bàn cờ là một hình vuông chia thành 64 ô vuông nhỏ bằng nhau, các ô nhỏ đó được tô màu đậm, nhạt xen kẽ nhau (ô sáng và ô tối).</div>",
    "options": ["Ô sáng và Ô tối", "Xanh và Trắng", "Vàng và Nâu", "Đen và Đỏ"],
    "tags": ["Bàn Cờ Và Quân Cờ", "Cấu trúc"]
  },
  {
    "weight": "high",
    "question": "<span class=\"keyword\">FIDE</span> được thành lập tại <span class=\"keyword\">đâu</span>?",
    "answer": "<div class=\"answer-title\">✅ Đáp án:</div> <span class=\"answer-keyword\">Paris</span><div class=\"note\">💡 Giải thích: Năm 1924, Liên đoàn Cờ Vua thế giới (FIDE) được thành lập chính thức tại thủ đô Paris, nước Pháp.</div>",
    "options": ["London", "Rome", "Paris", "Moscow"],
    "tags": ["Lịch Sử Cờ Vua", "Nền tảng"]
  },
  {
    "weight": "high",
    "question": "Trong <span class=\"keyword\">lịch sử</span>, cờ vua được truyền bá vào châu Âu chủ yếu qua <span class=\"keyword\">con đường nào</span>?",
    "answer": "<div class=\"answer-title\">✅ Đáp án:</div> <span class=\"answer-keyword\">Người Ả Rập qua Tây Ban Nha</span><div class=\"note\">💡 Giải thích: Từ Ấn Độ sang Trung Á, ở Ả Rập cờ mang tên Satơrăng, sau đó theo chiến tranh và buôn bán du nhập vào Tây Ban Nha rồi lan khắp châu Âu.</div>",
    "options": ["Thập tự chinh", "Người Ả Rập qua Tây Ban Nha", "Con đường tơ lụa", "Thương nhân Ấn Độ"],
    "tags": ["Lịch Sử Cờ Vua", "Nền tảng"]
  },
  {
    "question": "Cờ Vua phát triển mạnh ở <span class=\"keyword\">đối tượng nào</span> tại Việt Nam?",
    "answer": "<div class=\"answer-title\">✅ Đáp án:</div> <span class=\"answer-keyword\">Sinh viên đại học</span><div class=\"note\">💡 Giải thích: Theo giáo trình trường, phong trào Cờ Vua phát triển mạnh nhất ở các trường đại học và các trung tâm thành phố lớn.</div>",
    "options": ["Nông dân", "Công nhân", "Sinh viên đại học", "Người cao tuổi"],
    "tags": ["Lịch Sử Cờ Vua", "Hệ thống"]
  },
  {
    "weight": "high",
    "question": "Cờ Vua hiện nay là một trong <span class=\"keyword\">bao nhiêu môn thể thao mũi nhọn</span> ở Việt Nam?",
    "answer": "<div class=\"answer-title\">✅ Đáp án:</div> <span class=\"answer-keyword\">10</span><div class=\"note\">💡 Giải thích: Đến nay, Cờ Vua là một trong 10 môn thể thao mũi nhọn của nước ta với các kỳ thủ tiêu biểu như Lê Quang Liêm, Nguyễn Ngọc Trường Sơn.</div>",
    "options": ["10", "12", "8", "5"],
    "tags": ["Lịch Sử Cờ Vua", "Hệ thống"]
  },
  {
    "question": "Giải đấu cờ vua quốc tế <span class=\"keyword\">đầu tiên trong lịch sử hiện đại</span> được tổ chức tại đâu?",
    "answer": "<div class=\"answer-title\">✅ Đáp án:</div> <span class=\"answer-keyword\">London (1851)</span><div class=\"note\">💡 Giải thích: Giải đấu cờ vua quốc tế đầu tiên trong lịch sử hiện đại được tổ chức tại London (Anh) vào năm 1851 do Howard Staunton khởi xướng.</div>",
    "options": ["New York (1857)", "Moscow (1900)", "London (1851)", "Paris (1850)"],
    "tags": ["Lịch Sử Cờ Vua", "Nền tảng"]
  },
  {
    "question": "<span class=\"keyword\">Ván cờ kết thúc</span> khi nào?",
    "answer": "<div class=\"answer-title\">✅ Đáp án:</div> <span class=\"answer-keyword\">Tất cả đáp án đều đúng</span><div class=\"note\">💡 Giải thích: Một ván cờ vua kết thúc khi có kết quả thắng thua (bị chiếu hết, xin thua, hết giờ) hoặc khi hòa cờ (hết nước đi Pat, thỏa thuận, thiếu lực lượng).</div>",
    "options": ["Tất cả đáp án đều đúng", "Khi hòa", "Khi một bên chịu thua", "Khi hết quân"],
    "tags": ["Kết Quả Ván Cờ", "Logic & Nguyên tắc"]
  },
  {
    "question": "<span class=\"keyword\">Trận mở đầu</span> gọi là gì trong cờ vua?",
    "answer": "<div class=\"answer-title\">✅ Đáp án:</div> <span class=\"answer-keyword\">Khai cuộc</span><div class=\"note\">💡 Giải thích: Giai đoạn đầu của ván đấu gọi là giai đoạn Khai cuộc.</div>",
    "options": ["Trung cuộc", "Khai cuộc", "Phản công", "Hậu cuộc"],
    "tags": ["Giai Đoạn Khai Cuộc", "Phân luồng"]
  },
  {
    "question": "Mã chiếu vua ở đâu <span class=\"keyword\">không cần đi tạo đôi</span>?",
    "answer": "<div class=\"answer-title\">✅ Đáp án:</div> <span class=\"answer-keyword\">Vị trí chữ L</span><div class=\"note\">💡 Giải thích: Quân Mã luôn di chuyển theo đường chéo của hình chữ nhật 2x3 (hình chữ L) và có thể nhảy qua đầu các quân khác để chiếu trực diện Vua đối phương.</div>",
    "options": ["Trước mặt", "Bên cạnh", "Vị trí chữ L", "Gần quân tốt"],
    "tags": ["Nước Đi Quân Cờ", "Logic & Nguyên tắc"]
  },
  {
    "weight": "high",
    "question": "Nếu chỉ còn <span class=\"keyword\">vua và hai Tượng khác màu</span>, có thể...?",
    "answer": "<div class=\"answer-title\">✅ Đáp án:</div> <span class=\"answer-keyword\">Chiếu bí</span><div class=\"note\">💡 Giải thích: Tàn cuộc Vua + 2 Tượng (khác màu ô) chống Vua đơn độc là thế cờ kỹ thuật luôn có thể chiếu hết (chiếu bí) bằng cách dùng 2 Tượng tạo hàng rào đường chéo dồn Vua địch vào góc.</div>",
    "options": ["Không kết thúc được", "Đổi bên đi trước", "Chiếu bí", "Hòa"],
    "tags": ["Giai Đoạn Tàn Cuộc", "Logic & Nguyên tắc"]
  },
  {
    "question": "<span class=\"keyword\">Người thua ván cờ</span> sẽ được <span class=\"keyword\">ghi là gì</span>?",
    "answer": "<div class=\"answer-title\">✅ Đáp án:</div> <span class=\"answer-keyword\">0</span><div class=\"note\">💡 Giải thích: Theo quy chế tính điểm cờ vua tiêu chuẩn: Thắng được 1 điểm, Hòa được ½ điểm, và Thua được 0 điểm.</div>",
    "options": ["½", "2", "1", "0"],
    "tags": ["Biên Bản Thi Đấu", "Cấu trúc"]
  },
  {
    "question": "Có <span class=\"keyword\">bao nhiêu quân Xe</span> trên bàn <span class=\"keyword\">lúc đầu</span>?",
    "answer": "<div class=\"answer-title\">✅ Đáp án:</div> <span class=\"answer-keyword\">4</span><div class=\"note\">💡 Giải thích: Mỗi bên có 2 quân Xe đặt ở các góc bàn cờ lúc bắt đầu ván đấu, tổng cộng là 4 quân Xe.</div>",
    "options": ["8", "6", "4", "2"],
    "tags": ["Bàn Cờ Và Quân Cờ", "Cấu trúc"]
  },
  {
    "question": "Quân nào có thể <span class=\"keyword\">tạo song chiếu</span>?",
    "answer": "<div class=\"answer-title\">✅ Đáp án:</div> <span class=\"answer-keyword\">Mã</span><div class=\"note\">💡 Giải thích: Quân Mã khi nhảy có thể tự mình chiếu Vua đối phương, đồng thời mở đường cho quân Xe, Tượng hoặc Hậu phía sau cùng chiếu Vua, tạo thành thế song chiếu (chiếu đôi).</div>",
    "options": ["Mã", "Tốt", "Xe", "Hậu"],
    "tags": ["Giai Đoạn Trung Cuộc", "Logic & Nguyên tắc"]
  },
  {
    "question": "Quân nào di chuyển <span class=\"keyword\">linh hoạt nhất</span>?",
    "answer": "<div class=\"answer-title\">✅ Đáp án:</div> <span class=\"answer-keyword\">Hậu</span><div class=\"note\">💡 Giải thích: Quân Hậu là quân cơ động và linh hoạt nhất trên bàn cờ vì có thể di chuyển ngang, dọc và chéo không giới hạn số ô (H = X + T).</div>",
    "options": ["Xe", "Hậu", "Mã", "Tượng"],
    "tags": ["Nước Đi Quân Cờ", "Logic & Nguyên tắc"]
  },
  {
    "weight": "high",
    "question": "<span class=\"keyword\">Mỗi bên</span> trong cờ vua có <span class=\"keyword\">bao nhiêu quân lúc bắt đầu</span>?",
    "answer": "<div class=\"answer-title\">✅ Đáp án:</div> <span class=\"answer-keyword\">16</span><div class=\"note\">💡 Giải thích: Khi bắt đầu ván cờ, mỗi đấu thủ đều có 16 quân cờ (gồm 1 Vua, 1 Hậu, 2 Xe, 2 Tượng, 2 Mã và 8 Tốt).</div>",
    "options": ["12", "16", "8", "20"],
    "tags": ["Bàn Cờ Và Quân Cờ", "Cấu trúc"]
  },
  {
    "weight": "high",
    "question": "Quân nào <span class=\"keyword\">mạnh nhất trên bàn cờ</span>?",
    "answer": "<div class=\"answer-title\">✅ Đáp án:</div> <span class=\"answer-keyword\">Hậu</span><div class=\"note\">💡 Giải thích: Hậu là quân mạnh nhất trên bàn cờ có thể cơ động như Xe và Tượng, sức mạnh khống chế trung tâm lên tới 27 ô cờ.</div>",
    "options": ["Mã", "Tượng", "Xe", "Hậu"],
    "tags": ["Nước Đi Quân Cờ", "Logic & Nguyên tắc"]
  },
  {
    "weight": "high",
    "question": "Tốt được <span class=\"keyword\">phong cấp</span> khi <span class=\"keyword\">đi đến đâu</span>?",
    "answer": "<div class=\"answer-title\">✅ Đáp án:</div> <span class=\"answer-keyword\">Hàng cuối cùng bên đối phương</span><div class=\"note\">💡 Giải thích: Khi một quân Tốt tới hàng ngang cuối cùng của đối phương (hàng 8 đối với Trắng, hàng 1 đối với Đen) thì lập tức được phong cấp.</div>",
    "options": ["Trung tâm bàn cờ", "Hàng thứ 5", "Hàng thứ 6", "Hàng cuối cùng bên đối phương"],
    "tags": ["Nước Đi Đặc Biệt", "Logic & Nguyên tắc"]
  },
  {
    "question": "Quân nào <span class=\"keyword\">không bao giờ được phong cấp</span>?",
    "answer": "<div class=\"answer-title\">✅ Đáp án:</div> <span class=\"answer-keyword\">Vua</span><div class=\"note\">💡 Giải thích: Tốt khi phong cấp chỉ được đổi thành một trong 4 quân: Hậu, Xe, Tượng hoặc Mã; luật cấm tuyệt đối không được phong thành Vua hoặc giữ nguyên là Tốt.</div>",
    "options": ["Vua", "Hậu", "Tượng", "Mã"],
    "tags": ["Nước Đi Đặc Biệt", "Giới hạn & Rủi ro"]
  },
  {
    "question": "<span class=\"keyword\">Tên gọi của ô a1</span> (Màu sắc)?",
    "answer": "<div class=\"answer-title\">✅ Đáp án:</div> <span class=\"answer-keyword\">Đen</span><div class=\"note\">💡 Giải thích: Quy ước bàn cờ đặt đúng là ô góc dưới bên tay phải (h1) là ô màu sáng (ô trắng); do đó ô góc dưới bên tay trái (a1) luôn luôn là ô màu sẫm (ô đen).</div>",
    "options": ["Đen", "Màu ngẫu nhiên", "Trắng", "Không quy định"],
    "tags": ["Bàn Cờ Và Quân Cờ", "Cấu trúc"]
  },
  {
    "weight": "high",
    "question": "Theo luật, một ván cờ hòa nếu trong <span class=\"keyword\">bao nhiêu nước liên tiếp</span> không có <span class=\"keyword\">bắt quân và không đi Tốt</span>?",
    "answer": "<div class=\"answer-title\">✅ Đáp án:</div> <span class=\"answer-keyword\">50 nước</span><div class=\"note\">💡 Giải thích: Quy tắc 50 nước đi quy định ván cờ hòa nếu trong 50 nước đi cuối cùng liên tiếp nhau của cả hai bên không có sự di chuyển Tốt và không có nước bắt quân nào.</div>",
    "options": ["40 nước", "50 nước", "30 nước", "20 nước"],
    "tags": ["Kết Quả Ván Cờ", "Giới hạn & Rủi ro"]
  }
]

# 3. Lọc trùng với kho hiện tại
with open(qs_file, "r", encoding="utf-8") as f:
    existing_qs = json.load(f)

def get_clean_q(text):
    return re.sub(r'<[^>]+>', '', text).strip().lower()

existing_map = {get_clean_q(q["question"]): q for q in existing_qs}
new_added = 0
duplicate_count = 0

for q in batch3_raw_list:
    clean_q = get_clean_q(q["question"])
    if clean_q not in existing_map:
        existing_qs.append(q)
        existing_map[clean_q] = q
        new_added += 1
    else:
        duplicate_count += 1

# Staging
os.makedirs(os.path.dirname(staging_file), exist_ok=True)
with open(staging_file, "w", encoding="utf-8") as f:
    json.dump(existing_qs, f, ensure_ascii=False, indent=2)

# Safe Write
with open(qs_file, "w", encoding="utf-8") as f:
    json.dump(existing_qs, f, ensure_ascii=False, indent=2)

print(f"Batch 3 processed: {new_added} new questions added, {duplicate_count} duplicates skipped. Total now: {len(existing_qs)}")
