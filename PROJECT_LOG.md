# TVU-HUB: PROJECT LOG

Nhật ký theo dõi các thay đổi dữ liệu của dự án. Mọi thao tác thêm câu hỏi mới, chỉnh sửa đáp án hoặc cập nhật logic đều phải được ghi log vào đây.

## Format Ghi Log (Dành cho Agent)
Khi chạy xong luồng xử lý câu hỏi mới, Agent tự động thêm 1 dòng vào danh sách bên dưới theo format:
`- [YYYY-MM-DD] [Tên Môn Học] Thêm X câu, gộp Y câu, sửa Z câu.`

---

## Nhật Ký Cập Nhật

- [2026-07-19] [Hệ thống] Khởi tạo dự án, dọn dẹp cấu trúc thư mục (3-layer protection).
- [x] (2026-08-08) [KINH TẾ VĨ MÔ]: Tái cấu trúc và trực quan hóa 34 Component từ raw_transcript thành kb.json. Đã commit và chờ Push.
- [2026-08-13] [GIÁO DỤC THỂ CHẤT 1] Tiệt trùng, áp dụng Ma Trận Lục Hợp, lọc trùng 55 câu thô xuống còn 50 câu (gộp 5 câu). Cập nhật vào qs.json.
- [2026-08-13] [GIÁO DỤC THỂ CHẤT 1] Cập nhật lại kb.json theo kiến trúc Mindmap siêu phân mảnh và fix lỗi hardcode câu hỏi.
- 2026-08-15: Hoàn thành Build kb.json (Khung MECE 7 Tầng) cho môn GIÁO DỤC THỂ CHẤT 1.
- [2026-08-16] [TIN HỌC ỨNG DỤNG CƠ BẢN] Hoàn thành Khâu 1, 2, 3, 4 bằng cơ chế Map-Reduce. Build thành công kb.json 6 nhánh, chuẩn hoá Ma Trận 34 Component (không tiền tố).
- [2026-08-16] [TIN HỌC ỨNG DỤNG CƠ BẢN] Nạp lô 40 câu hỏi. Đã tiệt trùng HTML, highlight Ma Trận Lục Hợp, tự xử lý 1 câu thiếu đáp án. Lọc trùng còn 34 câu, gộp 6 câu. Đã lưu vào qs.json.

- Added 32 new questions to 15. TÀI CHÍNH TIỀN TỆ/qs.json.

- Added 0 new questions to 15. TÀI CHÍNH TIỀN TỆ/qs.json.

- Added 0 new questions to 15. TÀI CHÍNH TIỀN TỆ/qs.json.

## [Kinh Tế Vĩ Mô] 2026-08-17 08:30:21
- Đã xử lý lô 40 câu hỏi mới theo SSoT.
- Lọc trùng: Phát hiện 27 câu trùng lặp, giữ lại 13 câu mới.
- Tổng câu hỏi trong ngân hàng KTVM hiện tại đã được cập nhật.

- Added 24 questions to 15. TÀI CHÍNH TIỀN TỆ (Staged from 40). Total: 154
- Added 11 questions to 14. KINH TẾ VĨ MÔ. Total: 130
- [2026-08-18] [GIÁO DỤC THỂ CHẤT 1] Fix lỗi mảng tags rỗng và bổ sung thiếu span keyword.
- [2026-08-18] [GIÁO DỤC THỂ CHẤT 1] Tái cơ cấu toàn bộ mảng tag và phân bổ tỷ lệ weight: high theo sát Ma Trận 80/20 trong blueprint.json.

- Đã rà soát và chuẩn hóa lại toàn bộ thẻ `weight` (High 80/20) cho các môn KTVM, GDTC1, TCTT, THUD theo SSoT mới.
- [2026-08-18] [GIÁO DỤC THỂ CHẤT 1] Xóa bỏ khoảng trắng thừa (double space) giữa các tag HTML và làm sạch data options theo yêu cầu của User.
- [2026-08-18] [GIÁO DỤC THỂ CHẤT 1] Bổ sung highlight keyword bị sót cho câu hỏi kỷ lục Bob Beamon.

- Đã rà soát và dọn dẹp các ký tự A,B,C,D thừa ở đáp án và chuẩn hóa double space cho toàn bộ kho LUYỆN ĐỀ.

- KTVM: Đã bao toàn bộ phương trình BP vào thẻ span answer-keyword cho câu hỏi hàm số tài khoản vốn.

- KTVM: Lọc trùng và bổ sung thành công 4 câu hỏi mới từ Batch 5. Đã highlight Ma trận Lục hợp và thêm giải thích.
- [2026-08-27] [GIÁO DỤC THỂ CHẤT 1] Xóa bỏ metadata 'Mã số học phần' bị dính nhầm vào file kb.json.

- KTVM: Tái cấu trúc và băm nhỏ các node bị lồng ghép trong kb.json (c2_tong_cau, c2_chu_ky, c3_tien_te, c3_nhtw, c3_ngoai_hoi, c4_lam_phat) thành các node đơn lẻ theo nguyên tắc Tinh gọn ý.

- 2026-08-30 23:54:45: Khởi tạo thành công bộ Khung Kiến thức Nền (kb.json) cho môn Thống kê ứng dụng trong kinh doanh, với 23 Micro-nodes. Đã map chính xác Component và đẩy lên Git.
- KTVM: Lọc trùng 20 câu hỏi Batch 6, phát hiện 14 câu trùng lặp. Đã định dạng 6 câu mới tinh (gắn highlight Ma trận Lục hợp, bổ sung giải thích chi tiết) và nối vào qs.json.
