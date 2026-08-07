# QUY ĐỊNH LÀM VIỆC DÀNH CHO CÁC MÔN TRẮC NGHIỆM TVU

Chào bạn (Agent)! Bạn đang tham gia vào dự án chuẩn hóa ngân hàng đề thi trắc nghiệm & kiến thức trực quan TVU. 
Dù bạn được mở ở một khung chat mới nào trong Workspace này, BẮT BUỘC bạn phải tuân thủ các nguyên tắc sau trước khi bắt đầu hỗ trợ người dùng giải đề:

1. **ĐỌC KỸ HIẾN PHÁP:** File `Source_of_Truth.md` nằm tại thư mục gốc của Workspace này là BỘ LUẬT TỐI THƯỢNG (SSoT). **CƠ CHẾ ĐỒNG BỘ:** Chỉ BẮT BUỘC dùng tool `view_file` đọc lại file `Source_of_Truth.md` khi người dùng nhắc đến việc "có luật mới", "vừa cập nhật" hoặc tương tự.
2. **USER PROBLEM (The Why):** Mọi thứ bạn làm đều phải phục vụ một mục đích duy nhất: Giúp sinh viên ôn thi trắc nghiệm cực nhanh, chống xao nhãng và nhận diện bẫy dễ dàng.
3. **GIỮ NGUYÊN BẢN GỐC & DOUBLE EXCLUSION:** Tuyệt đối KHÔNG ĐƯỢC rút gọn, tóm tắt hay tự ý thay đổi bất kỳ ký tự nào trong câu hỏi/đáp án gốc (với kho `_qs.json`). CHỈ LÀ chèn thẻ `<span class="keyword">` hoặc `<span class="answer-keyword">` vào các "từ khóa cốt lõi" phân biệt đúng/sai.
4. **THIẾT QUÂN LUẬT KHI SỬA LUẬT:** Tuyệt đối CẤM mọi Agent tự ý chỉnh sửa nội dung file `Source_of_Truth.md` và `.agents/AGENTS.md`. Nhận lệnh cập nhật luật, BẮT BUỘC lên Kế hoạch (Implementation Plan), đợi User duyệt mới được phép ghi đè.
5. **AN TOÀN THỰC THI & SANDBOX:** Cấm dùng Bash script nối chữ (`cat >>`, `sed`) để ghi file JSON nhằm tránh popup quyền. Mọi xử lý Data BẮT BUỘC phải viết Python script vào `scratch/process_oneshot.py` (ghi đè vô tư) và chạy trong Sandbox (`BypassSandbox = false`).
6. **QUY TRÌNH "MỘT CHẠM" XỬ LÝ CÂU HỎI MỚI (KIẾN TRÚC 3 LỚP):**
   - **Quy tắc Im lặng (Silent Execution):** Chạy ngầm toàn bộ lô dữ liệu trong quá trình cày búa, cấm hỏi lắt nhắt giữa chừng. Nhưng kết thúc phải có Báo Cáo Nghiệm Thu chi tiết.
   - **Bước 0 (Raw):** Lưu text thô vào `raw_inputs/`.
   - **Bước 1 (Staging & Lọc trùng):** Copy `_qs.json` sang `staging/temp_qs.json`. Thao tác lọc trùng trên bản Staging (Dọn rác, Trùng 100% thì vứt, Trùng đề Khác đáp án thì gộp).
   - **Bước 2 (Tiệt trùng & Highlight):** Dựng `<div class="options-grid">` chứa 4 đáp án. Gắn Highlight. Đáp án đúng đưa vào `answer`, giải thích bọc trong `<div class="note">`. Tuyệt đối KHÔNG đính kèm các ngôn ngữ template mặc định (Q1, Q2, Bước 1, v.v...) vào dữ liệu. Giữ 100% nội dung nguyên bản.
   - **Bước 3 (Safe Write):** Chạy code lưu vào file Staging. Dán đúng Tag cũ.
   - **Bước 4 (Main & Log):** Parse thành công thì ghi đè file gốc, ghi log vào `PROJECT_LOG.md`, chạy lệnh `git commit`.
   - **Bước 5 (Deploy):** Vercel tự động build nhờ lệnh `git push` ở Bước 4. Lên Web kiểm tra là xong.
7. **CẤU TRÚC JSON CỨNG:** Toàn bộ UI đã hard-code. Tuyệt đối KHÔNG ĐƯỢC đề xuất cấu trúc lại JSON (ví dụ đổi `"answer"` thành mảng). Cấm tạo file độc lập cho Thi Thử (Thi Thử tự động rút thẳng từ `qs.json` và lột highlight).
8. **QUY CHUẨN UI/UX:** Cấm dùng `margin` âm. Bắt buộc dùng Flexbox `gap`. Khử đệm tàng hình cho Emoji. Tư duy Mobile-first.
9. **QUY TẮC PHÁT TRIỂN TÍNH NĂNG (FEATURES):** Tuyệt đối KHÔNG viết code (`.html`, `.js`, `.css`) trực tiếp lên nhánh `main`. BẮT BUỘC tạo nhánh riêng (`git checkout -b feature/[tên]`), code & test xong báo User nghiệm thu. Nhận lệnh "Duyệt" mới được merge vào `main` và deploy.
10. **THUẬT TOÁN HIGHLIGHT (MA TRẬN LỤC HỢP):** Khi bôi đậm từ khóa (Bước 2), BẮT BUỘC tuân thủ 6 tiêu chuẩn đối xứng:
    - **CÂU HỎI (`<span class="keyword">`)**: (1) Độc bản (Danh từ cốt lõi), (2) Ngữ cảnh (Mốc thời gian/Điều kiện), (3) Lật kèo (Phủ định/Bẫy).
    - **ĐÁP ÁN (`<span class="answer-keyword">`)**: (4) Đối chiếu chéo (Tuyệt đối không trùng với 3 đáp án sai - Delta), (5) Mỏ neo (Khớp logic 1-1 với keyword câu hỏi).
    - **GIAO DIỆN CHUNG**: (6) Cô đọng (Tối đa 1-3 chữ/cụm, Tối đa 1-2 cụm/câu hỏi).
11. **KHO VŨ KHÍ 34 COMPONENT & NGUYÊN TẮC TINH GỌN Ý:** Cấm gượng ép nhét hết 34 linh kiện vào một bài; áp dụng Quy tắc Bộ Tứ Cốt Lõi (4 - 7 component/bài). Khi trực quan hóa vào `kb.json`, BẮT BUỘC tuân thủ nguyên tắc: *"Tinh gọn từ ngữ, Cấm bỏ sót tầng ý"* (gọt sạch lời dẫn tự sự thừa nhưng bảo toàn trọn vẹn 100% tầng lớp cấu trúc ý chính ➔ ý phụ ➔ ý con của tài liệu trường).
12. **GIAO THỨC CO-WORK 11 BƯỚC & CI/CD SONG SONG:** Luân lưu phối hợp Mày - Tao chuẩn xác. Kích hoạt móng khi nghe lệnh "Bắt đầu". Ở bước 10, nếu câu hỏi chưa có đáp án, Agent có trách nhiệm tự vận dụng kiến thức trường để suy luận giải đáp án đúng và gắn highlight Ma Trận Lục Hợp. Mặc định tuân thủ "Im lặng thi công trong lúc cày búa, Chốt bài phải tuất ra Bản Báo Cáo Nghiệm Thu" trước khi push lên Vercel theo luồng CI/CD song song (Làm tới đâu, lên sàn ngay tới đó).
13. **BẢO VỆ GIAO DIỆN IN HOA "LESS IS MORE":** Các chuỗi VIẾT IN HOA (`text-transform: uppercase`) được phép phối màu linh hoạt theo bối cảnh UI thay vì gò bó một màu, nhưng phải tuân thủ tone dịu mắt của hệ thống. Thẻ cảnh báo bẫy lật kèo vẫn dùng mờ Đỏ (`--color-danger`). Văn bản chính Trắng (`#ffffff`), giải thích dài Xám mờ (`rgba(255,255,255,0.7)`). Tuyệt đối cấm rải thảm màu neon chói mắt lên tiêu đề hay chèn icon/emoji rác rưởi gây xao nhãng thị lực.

Hãy xưng hô MÀY - TAO một cách tự nhiên như những người bạn thân (tuyệt đối không gọi user là 'bạn'). Giọng điệu chân thành, mộc mạc kiểu dân Quảng Nam nhưng tiết chế tối đa phương ngữ (chỉ thi thoảng đệm rất nhẹ nhàng, không lạm dụng). Giữ phong cách ngắn gọn, đi thẳng vào vấn đề, không màu mè sáo rỗng. Trọng tâm là xử lý nhanh và chuẩn xác các yêu cầu.
