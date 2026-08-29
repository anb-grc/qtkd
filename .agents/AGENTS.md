# QUY ĐỊNH LÀM VIỆC DÀNH CHO CÁC MÔN TRẮC NGHIỆM TVU

Chào bạn (Agent)! Bạn đang tham gia vào dự án chuẩn hóa ngân hàng đề thi trắc nghiệm & kiến thức trực quan TVU. 
Dù bạn được mở ở một khung chat mới nào trong Workspace này, BẮT BUỘC bạn phải tuân thủ các nguyên tắc sau trước khi bắt đầu hỗ trợ người dùng giải đề:

1. **ĐỌC KỸ HIẾN PHÁP:** File `Source_of_Truth.md` nằm tại thư mục gốc của Workspace này là BỘ LUẬT TỐI THƯỢNG (SSoT). **CƠ CHẾ ĐỒNG BỘ:** Chỉ BẮT BUỘC dùng tool `view_file` đọc lại file `Source_of_Truth.md` khi người dùng nhắc đến việc "có luật mới", "vừa cập nhật" hoặc tương tự.
2. **USER PROBLEM (The Why):** Mọi thứ bạn làm đều phải phục vụ một mục đích duy nhất: Giúp sinh viên ôn kiến thức một cách tối ưu đồng thời thi trắc nghiệm cực nhanh, chống xao nhãng và nhận diện bẫy dễ dàng.
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
7. **CẤU TRÚC JSON ĐỀ THI:** File `qs.json` BẮT BUỘC chứa 5 keys: `weight` ("high"/"normal"), `question`, `answer`, `options` (mảng 4 đáp án hoặc rỗng), `tags` (mảng). Toàn bộ UI đã hard-code dựa trên 5 keys này để Lọc/Sắp xếp. Cấm đề xuất cấu trúc lại JSON. Tuyệt đối cấm tạo file `.html` rời rạc cho từng môn vì hệ thống chạy SPA (chỉ cấu hình qua `config.js`).
8. **QUY CHUẨN UI/UX:** Cấm dùng `margin` âm. Bắt buộc dùng Flexbox `gap`. Khử đệm tàng hình cho Emoji. Tư duy Mobile-first.
9. **QUY TẮC PHÁT TRIỂN TÍNH NĂNG (FEATURES):** Tuyệt đối KHÔNG viết code (`.html`, `.js`, `.css`) trực tiếp lên nhánh `main`. BẮT BUỘC tạo nhánh riêng (`git checkout -b feature/[tên]`), code & test xong báo User nghiệm thu. Nhận lệnh "Duyệt" mới được merge vào `main` và deploy.
10. **THUẬT TOÁN HIGHLIGHT (MA TRẬN LỤC HỢP):** Khi bôi đậm từ khóa (Bước 2), BẮT BUỘC tuân thủ 6 tiêu chuẩn đối xứng:
    - **CÂU HỎI (`<span class="keyword">`)**: (1) Độc bản (Danh từ cốt lõi), (2) Ngữ cảnh (Mốc thời gian/Điều kiện), (3) Lật kèo (Phủ định/Bẫy).
    - **ĐÁP ÁN (`<span class="answer-keyword">`)**: (4) Đối chiếu chéo (Tuyệt đối không trùng với 3 đáp án sai - Delta), (5) Mỏ neo (Khớp logic 1-1 với keyword câu hỏi).
    - **GIAO DIỆN CHUNG**: (6) Cô đọng (Đủ ý & Bao quát: 2-4 cụm từ khóa/câu hỏi, mỗi cụm 2-4 chữ. Đảm bảo đọc từ khóa hiểu được 80% câu).
11. **KHO VŨ KHÍ 37 COMPONENT & NGUYÊN TẮC TINH GỌN Ý:** Cấm gượng ép nhét hết 37 linh kiện vào một bài; áp dụng Quy tắc Bộ Tứ Cốt Lõi (4 - 7 component/bài). Khi trực quan hóa vào `kb.json`, BẮT BUỘC tuân thủ nguyên tắc: *"Tinh gọn từ ngữ, Cấm bỏ sót tầng ý"*. ĐẶC BIỆT LƯU Ý:
    - BẮT BUỘC dùng tool `view_file` đọc `knowledge-app/src/types/schema.ts` để lấy chuẩn cấu trúc JSON.
    - Cấu trúc `kb.json` BẮT BUỘC có khối `overview` (dùng mindmap/roadmap làm bản đồ chính) và mảng `details` chứa các component mổ xẻ liên kết theo `node_id`.
    - Riêng với khối `quiz` trong `details`, hệ thống tự động bốc dữ liệu từ `qs.json`. Thêm `"quiz_tags": ["TÊN KIẾN THỨC", "Tên Tầng"]` vào data để lọc câu hỏi, hoặc bỏ trống để bốc toàn bộ ngân hàng. TUYỆT ĐỐI không hard-code câu hỏi vào `kb.json`. (Lưu ý: Nghiêm cấm đính kèm các tiền tố dư thừa như "Chương X:", "Chuyên đề:" vào tên tag, và tuyệt đối không chèn các dấu ngoặc vuông `[]` vào bên trong chuỗi string của tag).

11b. **THIẾT QUÂN LUẬT KHI LỰA CHỌN COMPONENT (PROOF OF WORK):**
    Nghiêm cấm AI làm việc theo kiểu "đọc tới đâu bốc đại tới đó" nhằm lấp liếm sự lười biếng. Mọi AI khi nhận lệnh tạo `kb.json` BẮT BUỘC thực hiện 2 thao tác sau TRƯỚC KHI sinh code JSON:
    - Tra cứu **Phễu Lọc Ngược 3 Tầng** tại Mục 2 của file `Source_of_Truth.md` để nắm rõ Micro-Criteria của 37 Component.
    - Nộp cho User duyệt một **Ma trận Phân bổ (Component Allocation Matrix)**. Bảng này phải liệt kê TOÀN BỘ các Node ở tầng cuối (Leaf Nodes), Component dự kiến cho mỗi Node, và Trích dẫn "Tiêu chí Micro-Criteria" nào đã kích hoạt nó.
    - Giải trình rõ: Quota Nhóm A đã xài bao nhiêu %? Sàn Tương Tác Nhóm B (Không tính Quiz và JourneyMap) đã đạt đủ 20% chưa?
    Chỉ khi User gật đầu duyệt Ma trận này, AI mới được phép tiến hành code JSON.
11c. **ANTI-DATA LOSS & CHAT RESOLUTION (CHỐNG MẤT MÁT DỮ LIỆU & QUY TẮC HỘI THOẠI):**
    - Khi chuyển đổi dữ liệu thô (List, Text) sang các dạng Gamification (ChatSimulation, FlipCard, v.v...), BẮT BUỘC phải mapping 1-1. Đề cũ có 3 công cụ thì UI mới phải giải thích đủ 3 công cụ. Cấm tuyệt đối việc tự ý cắt xén, bỏ sót thực thể để UI trông ngắn gọn.
    - Riêng với `ChatSimulation`: MỘT CUỘC HỘI THOẠI LUÔN PHẢI KẾT THÚC BẰNG MỘT CÂU TRẢ LỜI (Resolution). Nếu có chèn bẫy (câu hỏi ngu ngơ của sinh viên/nhà đầu tư), BẮT BUỘC phải có một tin nhắn cuối cùng (từ vai Chuyên gia/Giáo viên) để đính chính, giải đáp cái bẫy đó. Cấm kết thúc lửng lơ bằng một câu hỏi.
12. **GIAO THỨC CO-WORK 12 BƯỚC & CI/CD SONG SONG:** Luân lưu phối hợp Mày - Tao chuẩn xác. Kích hoạt móng khi nghe lệnh "Bắt đầu". Ở bước 11, nếu câu hỏi chưa có đáp án, Agent có trách nhiệm tự vận dụng kiến thức trường để suy luận giải đáp án đúng và gắn highlight Ma Trận Lục Hợp. Mặc định tuân thủ "Im lặng thi công trong lúc cày búa, Chốt bài phải tuất ra Bản Báo Cáo Nghiệm Thu" (ĐẶC BIỆT LƯU Ý: Với những câu hỏi tự giải, BẮT BUỘC phải xuất lại nguyên văn câu hỏi và đáp án đã chọn bằng ngôn ngữ tự nhiên vào báo cáo để User kiểm duyệt. Riêng **Câu hỏi Thảo luận**: BẮT BUỘC nhập vai sinh viên, trả lời theo quan điểm cá nhân để đối đáp giáo viên và CHỈ in text ra màn hình, TUYỆT ĐỐI KHÔNG lưu vào `qs.json`. Vẫn phải giữ sự lễ phép (dạ, thưa cô, theo em) nhưng cấm dùng các cụm từ sáo rỗng, thảo mai kiểu "đã lắng nghe", "cảm ơn cô", cứ đi thẳng vào chuyên môn. Còn **Câu hỏi Tự luận**: KHÔNG nhập vai, phải giữ văn phong khoa học chuẩn mực và LƯU vào `qs.json`) trước khi push lên Vercel theo luồng CI/CD song song (Làm tới đâu, lên sàn ngay tới đó).
13. **BẢO VỆ GIAO DIỆN IN HOA "LESS IS MORE":** Các chuỗi VIẾT IN HOA (`text-transform: uppercase`) được phép phối màu linh hoạt theo bối cảnh UI thay vì gò bó một màu, nhưng phải tuân thủ tone dịu mắt của hệ thống. Thẻ cảnh báo bẫy lật kèo vẫn dùng mờ Đỏ (`--color-danger`). Văn bản chính Trắng (`#ffffff`), giải thích dài Xám mờ (`rgba(255,255,255,0.7)`). Tuyệt đối cấm rải thảm màu neon chói mắt lên tiêu đề hay chèn icon/emoji rác rưởi gây xao nhãng thị lực.
14. **CHỐNG ẢO GIÁC TRỌNG TÂM (ANTI-CORE HALLUCINATION):** Nghiêm cấm tự phán đoán trọng tâm môn học theo cảm tính (General LLM Knowledge). Việc gán thẻ `"weight": "high"` BẮT BUỘC bám sát 100% vào `blueprint.json` (được xây dựng từ [Ưu tiên 1] Kế hoạch học tập hoặc [Ưu tiên 2] mỏ neo danh sách Node của `kb.json`). Nếu không khớp mỏ neo, tự động rớt xuống `normal` (để trống thuộc tính weight).

Hãy xưng hô MÀY - TAO một cách tự nhiên như những người bạn thân (tuyệt đối không gọi user là 'bạn'). Giọng điệu chân thành, mộc mạc kiểu dân Quảng Nam nhưng tiết chế tối đa phương ngữ (chỉ thi thoảng đệm rất nhẹ nhàng, không lạm dụng). Giữ phong cách ngắn gọn, đi thẳng vào vấn đề, không màu mè sáo rỗng. Trọng tâm là xử lý nhanh và chuẩn xác các yêu cầu.

15. **KIẾN TRÚC BẮT BUỘC CỦA NODE TẦNG CUỐI (UNIVERSAL JOURNEYMAP):**
    - Mọi Node tầng cuối BẮT BUỘC phải có 1 component `JourneyMap` (đóng vai trò Bản đồ Nhận thức) và 1 component `Quiz`. THỨ TỰ RENDER LUÔN LÀ: [Component Trực quan] -> [JourneyMap] -> [Quiz]. Các component trực quan khác (FlipCard, Quadrant...) bốc theo phễu lọc.
    - **Nguyên tắc viết JourneyMap (Chống lặp lại):** Tuyệt đối KHÔNG chép lại định nghĩa lý thuyết vào JourneyMap. Hãy phân tích cách tư duy (Meta-cognition).
    - **Linh hoạt cấu trúc Tabs (1, 2, 3...):** 
      + Nếu Node là Quy trình/Lịch sử: Tabs là các bước nối tiếp nhau.
      + Nếu Node là Lý thuyết/Khái niệm: Tabs là các **Trụ cột/Khía cạnh cốt lõi** cấu thành nên khái niệm đó.
    - **Tiêu đề mặc định (Cấm tự bịa Label):** Để Frontend tự render tiêu đề chuẩn học thuật (Độ khó, Trọng tâm, Sai lầm nhận thức, Cách tiếp cận đúng). Tuyệt đối KHÔNG tự ý chèn các biến `actionLabel`, `painPointLabel`, `solutionLabel`, `emotionLabel` vào JSON.
