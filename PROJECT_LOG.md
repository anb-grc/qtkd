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

- KTVM: Xử lý lô 20 câu hỏi Batch 7. Đã lọc ra 11 câu trùng lặp, bóc tách và định dạng Ma trận Lục hợp thành công 9 câu mới (bao gồm cả các lý thuyết về đường IS, LM, LRAS và năng suất). Đã nối vào qs.json.

- KTVM: Lọc lô 10 câu hỏi Batch 8. Loại bỏ 7 câu trùng, cập nhật 3 câu mới (Đường BP, mô hình Mundell-Fleming tỷ giá cố định, thành phần biến động chu kỳ) với Highlight chuẩn chỉ và giải thích chuyên sâu. Đã nối vào qs.json.
- [2026-09-01] [GIÁO DỤC THỂ CHẤT 1] Xử lý Lô Đề Batch 9 (LUYỆN ĐỀ). Đã lọc trùng và bổ sung 9 câu hỏi mới vào ngân hàng. Gắn tag, highlight và weight theo chuẩn SSoT.
- [2026-10-17] [LOGIC HỌC ĐẠI CƯƠNG] Hoàn thành Tái cấu trúc Zero-based & Trực quan hóa kb.json theo chuẩn Độ Sâu Bất Đối Xứng Hữu Cơ (43 Micro-nodes, 12 component Nhóm B = 27.9%, 100% kèm JourneyMap + Quiz + Breadcrumb). Đã cập nhật SSoT và push lên Vercel.
- [2026-10-17] [GIÁO DỤC THỂ CHẤT 2] Hoàn thành Tái cấu trúc Zero-based & Trực quan hóa kb.json theo chuẩn Độ Sâu Bất Đối Xứng Hữu Cơ (23 Micro-nodes, 6 component Nhóm B = 26.1%, 100% kèm JourneyMap + Quiz + Breadcrumb).
- [2026-10-17] [Marketing căn bản] Hoàn thành Tái cấu trúc Zero-based & Trực quan hóa kb.json (61 Micro-nodes, 17 component Nhóm B = 27.9%, 100% kèm JourneyMap + Quiz). Khởi tạo ngân hàng đề thi: Nạp lô LTTN 1 (10 câu), gắn highlight Ma Trận Lục Hợp, gán trọng số blueprint 80/20 (4 câu High). Lưu thành công vào qs.json.
- [2026-10-17] [Marketing căn bản] Xử lý lô LTTN 2 (10 câu hỏi). Đã tiệt trùng HTML, highlight Ma Trận Lục Hợp, gán trọng số blueprint 80/20 (4 câu High). Lọc trùng: 0 trùng, thêm mới 10 câu. Tổng ngân hàng: 20 câu. Lưu thành công vào qs.json.
- [2026-10-17] [Marketing căn bản] Cập nhật đáp án chuẩn TVU cho Câu 7 LTTN 2: 'Mua hàng nhiều và mang tính lặp lại'.
- [2026-10-17] [Hiến pháp & Luật] Cập nhật 3 quy chuẩn trả lời câu hỏi thảo luận diễn đàn vào Source_of_Truth.md và .agents/AGENTS.md: (1) Bỏ chữ 'Dạ' - xưng 'Thưa'; (2) Định dạng văn bản thuần sạch (Anti-AI/Anti-Codeblock); (3) Khử mùi AI & cho phép 1-2 lỗi gõ phím Telex/chính tả tự nhiên ở từ phụ.
- [2026-10-17] [Marketing căn bản] Xử lý lô LTTN 3 (10 câu hỏi). Lọc trùng: 3 câu trùng lặp, thêm mới 7 câu. Highlight Ma Trận Lục Hợp, gán trọng số blueprint 80/20 (5 câu High). Tổng ngân hàng: 27 câu. Lưu thành công vào qs.json.
- [2026-10-17] [Marketing căn bản] Cập nhật đáp án chuẩn TVU cho LTTN 3: Câu 3 (Môi trường toàn cầu, vĩ mô và vi mô) & Câu 8 (Khúc thị trường phải đủ lớn và tăng trưởng tốt, phù hợp mục tiêu và nguồn lực).
- [2026-10-17] [Hiến pháp & Luật] Luật hóa Tháp 3 Tầng Ưu Tiên Giải Đề (Three-Tier Resolution Cascade) vào Source_of_Truth.md và .agents/AGENTS.md: (1) Kho qs.json đã hiệu chỉnh theo LMS; (2) Slide bài giảng & giáo trình trường (SLIDE/); (3) Kiến thức chuyên ngành quy chuẩn (Philip Kotler).
- [2026-10-17] [Marketing căn bản] Xử lý lô LTTN 4 (10 câu hỏi). Lọc trùng: 9 câu trùng lặp (đối chiếu chuẩn kho TVU), thêm mới 1 câu (Mô hình Marketing-mix 4P). Tổng ngân hàng: 28 câu. Lưu thành công vào qs.json.
- [2026-10-17] [Marketing căn bản] Xử lý lô LTTN 5 (10 câu hỏi). Lọc trùng: 7 câu trùng lặp (đối chiếu chuẩn kho TVU), thêm mới 3 câu (Môi trường nội bộ R&D, Nhân tố quyết định mua, Mục đích ma trận SWOT). Tổng ngân hàng: 31 câu. Lưu thành công vào qs.json.
- [2026-10-17] [Marketing căn bản] Xử lý lô BTGK 1 (20 câu hỏi). Lọc trùng: 12 câu trùng lặp (đối chiếu chuẩn kho TVU), thêm mới 8 câu (Định nghĩa Marketing-mix, Chọn thị trường mục tiêu, Môi trường toàn cầu, Quy trình marketing R-STP-MM, Phối hợp SWOT W-O, Phân khúc hành vi, Mặt hàng thuốc chữa bệnh, Hành vi khách hàng). Tổng ngân hàng: 39 câu. Lưu thành công vào qs.json.

- [2026-10-17] [GIÁO DỤC THỂ CHẤT 2] Xử lý lô LTTN 1 (20 câu hỏi). Đã tạo blueprint.json chuẩn 80/20. Tiệt trùng HTML, highlight Ma Trận Lục Hợp, gán trọng số blueprint 80/20 (6 câu High). Lọc trùng: 0 trùng, thêm mới 20 câu. Tổng ngân hàng: 20 câu. Lưu thành công vào qs.json.
- [2026-10-17] [GIÁO DỤC THỂ CHẤT 2] Xử lý lô LTTN 2 (20 câu hỏi). Tiệt trùng HTML, highlight Ma Trận Lục Hợp, gán trọng số blueprint 80/20 (7 câu High). Lọc trùng: 0 trùng, thêm mới 20 câu. Tổng ngân hàng: 40 câu. Lưu thành công vào qs.json.
- [2026-10-17] [Chủ nghĩa xã hội khoa học] Hoàn thành Tái cấu trúc Zero-based & Trực quan hóa kb.json theo chuẩn Độ Sâu Bất Đối Xứng Hữu Cơ (38 Micro-nodes, 11 component Nhóm B = 28.9%, 100% kèm JourneyMap + Quiz + Breadcrumb).
- [2026-10-17] [Chủ nghĩa xã hội khoa học] Khởi tạo blueprint.json (7 trụ cột học thuật, mỏ neo vi mô 80/20). Xử lý lô đề Batch 1 (20 câu Chương 1 & 2): Tiệt trùng HTML, highlight Ma Trận Lục Hợp, gán trọng số blueprint (12 câu High). Lọc trùng: 0 trùng, thêm mới 20 câu.
- [2026-10-17] [Chủ nghĩa xã hội khoa học] Xử lý lô đề Batch 2 (15 câu Chương 3 & 4): Tiệt trùng HTML, highlight Ma Trận Lục Hợp, gán trọng số blueprint 80/20 (8 câu High). Lọc trùng: 0 trùng, thêm mới 15 câu. Tổng ngân hàng: 35 câu. Lưu thành công vào qs.json.
- [2026-10-17] [Chủ nghĩa xã hội khoa học] Xử lý lô đề Batch 3 (20 câu): Lọc trùng 11 câu đã có trong kho, thêm mới 9 câu (Chương 1, 2, 3, 4). Highlight Ma Trận Lục Hợp, gán trọng số blueprint 80/20 (7 câu High). Tổng ngân hàng: 44 câu. Lưu thành công vào qs.json.
- [2026-10-17] [LOGIC HỌC ĐẠI CƯƠNG] Khởi tạo blueprint.json (10 chuyên đề cốt lõi, ma trận tỷ lệ thi). Xử lý lô LTTN 1 Chương 2 & 3 (10 câu hỏi): Tiệt trùng HTML, gắn highlight Ma Trận Lục Hợp, gán trọng số blueprint 80/20 (10 câu High). Lọc trùng: 0 trùng, thêm mới 10 câu. Lưu thành công vào qs.json.
- [2026-10-17] [LOGIC HỌC ĐẠI CƯƠNG] Cập nhật đáp án chuẩn LMS TVU cho Câu 5 LTTN 1: "p ∧ p̄" (thay vì công thức phủ định quy chuẩn). Cập nhật chính xác 4 options của Câu 3 và Câu 5 theo hình ảnh thực tế từ hệ thống LMS trường.
- [2026-10-17] [GIÁO DỤC THỂ CHẤT 2] Xử lý lô LTTN 3 (20 câu hỏi). Lọc trùng: 4 câu trùng lặp, thêm mới 16 câu. Tiệt trùng HTML, highlight Ma Trận Lục Hợp, gán trọng số blueprint 80/20 (7 câu High). Tổng ngân hàng: 56 câu. Lưu thành công vào qs.json.
- [2026-10-17] [LOGIC HỌC ĐẠI CƯƠNG] Xử lý lô LTTN 2 Chương 4 (20 câu hỏi về Phán đoán & Tính chu diên & Hình vuông logic): Tiệt trùng HTML, gắn highlight Ma Trận Lục Hợp, gán trọng số blueprint 80/20 (20 câu High). Lọc trùng: 0 trùng, thêm mới 20 câu. Tổng ngân hàng: 30 câu. Lưu thành công vào qs.json.
- [2026-10-17] [LOGIC HỌC ĐẠI CƯƠNG] Cập nhật đáp án chuẩn LMS TVU cho Câu 16 LTTN 2: "Quan hệ đối lập chung" (LMS TVU quy ước phán đoán đơn nhất thuộc phán đoán chung, A vs E). Cập nhật chính xác đề và options cho Câu 3 và Câu 10 LTTN 2 theo dữ liệu thực tế từ LMS.
- [2026-10-17] [LOGIC HỌC ĐẠI CƯƠNG] Bổ sung 8 câu hỏi mới từ các lượt luyện tập LTTN 1 & 2 (Câu ca dao "Có thương thì nói là thương", Mở rộng tam giác vuông, Văn hóa vật thể vs phi vật thể, Giá trị phán đoán loài cá, Tri vô bất ngôn, v.v.). Hiệu chỉnh bẫy LMS TVU cho câu "Có loài cá không sống trên cạn" (chân thực theo Slide C4 trang 23). Tổng ngân hàng câu hỏi: 38 câu.
- [2026-10-17] [LOGIC HỌC ĐẠI CƯƠNG] Cập nhật bẫy đáp án LMS TVU cho Câu 20 LTTN 2: "giả dối" (LMS TVU chốt đáp án "giả dối" thay vì "không xác định" hay "chân thực"). Đã lưu chuẩn vào qs.json.
- [2026-10-18] [Hệ thống & Tự động hóa] Tích hợp Telegram In-App Cockpit & TVU LMS Automation engine (Playwright). Vá triệt để lỗ hổng Service Worker null header, XSS URL sanitization, và giải đề thông minh qua qs.json lookup. Tạo điểm rollback an toàn (tag backup-pre-telegram-cockpit).
- [2026-10-18] [Hệ thống & UI/UX] Xây dựng và triển khai TVU Executive Dashboard trực tiếp trên trang chủ index.html kèm 5 tính năng nâng cấp thực chiến: (1) Nút 'Vào ôn ngay' 1-chạm nhảy thẳng quiz.html; (2) Badge cảnh báo đếm ngược hạn chót tuần TVU 23:59 Chủ Nhật; (3) Nút Thu gọn / Mở rộng nhớ trạng thái LocalStorage; (4) Thanh thống kê cá nhân hóa tự động tính lượt thi và điểm TB từ tvu_history; (5) Trạng thái ngoại tuyến mượt mà và chống kẹt cache PWA (v111). Merge hoàn tất vào nhánh main.
- [2026-10-18] [Hệ thống & UI/UX] Tái cấu trúc TVU Dashboard trang chủ theo phong cách Sleek Executive HUD (Clean & Clear, triệt tiêu triệt để bệnh 'hộp lồng hộp'): (1) Khung kính phẳng mỏng dính Single Surface, cắt giảm hơn 80% nhãn text thừa; (2) Tích hợp biểu đồ trực quan siêu gọn: Vòng tiến độ SVG Goal Ring mini (42px) + Biểu đồ sóng 7 ngày SVG Sparkline (20px, highlight ngày hiện tại); (3) Tinh gọn thống kê phẳng 1 dòng inline (LTTN, Thảo luận, Chu kỳ) và 1 dòng hành động cấp thiết thông minh kèm nút 1-chạm; (4) Tối ưu mobile-first đạt độ cân đối hoàn hảo; (5) Bump cache Service Worker lên v113. Đã merge vào main và deploy Vercel.
- [2026-10-18] [Hệ thống & UI/UX] Tái cấu trúc TVU Dashboard theo hướng Môn học thực chiến (Subject-Oriented, Zero Border): (1) Bỏ hoàn toàn viền dashboard (border: none, box-shadow: none), hòa quyện tự nhiên vào nền tối; (2) Bỏ các chỉ số máy móc của bot, thay bằng Tiến độ toàn khóa trực quan: X/11 môn hoàn thành (Y%) kèm thanh tiến độ mượt mà; (3) Theo dõi chi tiết tiến độ từng môn đang học: điểm số gần nhất, lượt thi thử, thanh tiến độ mini, nút 'Vào ôn'; (4) Tính năng '✓ Xong': Đánh dấu hoàn thành môn để tự động ẩn khỏi Dashboard và cộng dồn vào tiến độ tổng; kèm khay 'Đã hoàn thành' hỗ trợ khôi phục/học lại khi cần; (5) Đồng bộ badge '✓ ĐÃ HỌC XONG' tức thì trên grid môn học; (6) Bump cache Service Worker lên v114. Đã merge vào main và deploy Vercel.
- [2026-10-18] [Hệ thống & UI/UX] Triển khai Hệ thống Biểu đồ kép chuẩn Toàn cầu (Global EdTech Dual Visual Charts, Zero Border): (1) Biểu đồ Tổng thể: Vòng tròn SVG Radial Ring phong cách Apple Fitness (54px) hiển thị % toàn khóa + Thanh phân khúc 11 môn (Segmented Bar chuẩn GitHub) chia 3 sắc thái (Đã xong xanh ngọc / Đang học tím / Chưa học xám); (2) Biểu đồ Từng môn: Đồ thị phong độ cột mini (Learning Curve Spark-bars 4-5 vạch) phản ánh trực tiếp lịch sử điểm thi thử các lần gần nhất; (3) Nút '✓ Xong' 1-chạm ẩn môn đã học khỏi Dashboard tức thì; (4) Khay thu gọn xem lại/khôi phục môn đã hoàn thành; (5) Tối ưu mobile-first đạt độ thoáng đãng tối đa, không viền hộp; (6) Bump cache Service Worker lên v115. Đã merge vào main và deploy Vercel.
- [2026-10-18] [Hệ thống & UI/UX] Tinh chỉnh Dashboard đạt độ hoàn thiện cao cấp (Clean & Balanced Polish): (1) Khử sạch icon phèn, xóa sổ vĩnh viễn emoji 🎉 và khối chúc mừng màu xanh cắt xẻ lơ lửng; (2) Tối ưu Vòng tròn SVG lên 58px (r=24, stroke 3.5px, lọt lòng 44.5px, chu vi 150.8), căn chỉnh số % cân đối tuyệt đối ở tâm, triệt tiêu 100% hiện tượng tràn viền; (3) Khử khoảng trắng thừa ở chú thích phân khúc (Đã xong: 11 • Đang học: 0 • Chưa học: 0); (4) Tự động ẩn hoàn toàn mục 'MÔN ĐANG HỌC (0)' khi đã hoàn thành 100%, chỉ giữ 1 dòng trạng thái tinh tế một hàng phẳng; (5) Bump cache Service Worker lên v116. Đã merge vào main và deploy Vercel.
- [2026-10-28] [LƯỢC SỬ HỘI THÁNH TIN LÀNH VIỆT NAM] Hoàn thành Tái cấu trúc Zero-based & Trực quan hóa kb.json theo chuẩn Độ Sâu Bất Đối Xứng Hữu Cơ (19 Micro-nodes, 6 component Nhóm B = 31.6%, 100% kèm JourneyMap + Quiz + Breadcrumb định vị). Đã cập nhật assets/config.js và deploy Vercel thành công.
- [2026-10-29] [GIÁO DỤC THỂ CHẤT 2] Xử lý lô LTTN 4 Chương 3 (20 câu hỏi). Tiệt trùng HTML, highlight Ma Trận Lục Hợp, gán trọng số blueprint 80/20 (12 câu High). Lọc trùng: 0 trùng, thêm mới 20 câu. Tổng ngân hàng: 76 câu. Lưu thành công vào qs.json.
- [2026-10-29] [GIÁO DỤC THỂ CHẤT 2] Xử lý lô LTTN 5 (20 câu hỏi). Lọc trùng: 8 câu trùng lặp, thêm mới 12 câu. Tiệt trùng HTML, highlight Ma Trận Lục Hợp, gán trọng số blueprint 80/20 (7 câu High). Tổng ngân hàng: 88 câu. Lưu thành công vào qs.json.
