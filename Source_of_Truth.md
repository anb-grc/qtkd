# SOURCE OF TRUTH (BỘ LUẬT TỐI THƯỢNG)

File này là Chân lý gốc (Single Source of Truth) định hình toàn bộ tư duy, kiến trúc và luồng xử lý của hệ thống Ngân hàng Đề thi Trắc nghiệm & Kiến thức Trực quan TVU. Bất kỳ Agent nào tham gia vào dự án đều **BẮT BUỘC** tuân thủ tuyệt đối các quy định dưới đây.

---

## TẦNG 1: THE WHY (Chân lý gốc & Domain)

**1. Mục Tiêu Tối Thượng (User Problem):**
Hệ thống được sinh ra để giải quyết một nỗi đau duy nhất: Giúp sinh viên ôn kiến thức một cách tối ưu đồng thời thi trắc nghiệm **cực nhanh, chống xao nhãng, trực quan hóa kiến thức phức tạp và nhận diện bẫy dễ dàng**. Mọi tính năng, giao diện hay logic code nếu không phục vụ trực tiếp cho mục tiêu này đều được coi là "Rác" (Waste) và phải bị loại bỏ.

**2. Giá Trị Cốt Lõi (Core Value) & Ranh Giới Xử Lý Dữ Liệu:**
Hệ thống phân định rõ hai vùng xử lý với tiêu chuẩn tuyệt đối:
- **Với Hồ Đề Trắc Nghiệm (`_qs.json`): Tôn trọng Bản gốc 100%.** Tuyệt đối không được tóm tắt, viết tắt hay tự ý thay đổi bất kỳ từ ngữ nào trong đề và đáp án của trường. Sự xa lạ về mặt câu chữ sẽ giết chết trí nhớ của sinh viên trong phòng thi.
- **Với Hồ Kiến Thức Nền Trực Quan (`kb.json` - 34 Component):** Áp dụng nguyên tắc **"Tái Cấu Trúc Triệt Để (Radical Restructuring)"**. Phá vỡ cấu trúc chương mục tuyến tính của giáo trình để tái lắp ráp toàn bộ lượng kiến thức vào **"Khung Tư Duy 7 Tầng"** dưới đây nhằm tối ưu hóa việc học sâu. Tuy nhiên, vẫn **BẮT BUỘC BẢO TOÀN 100% FACT & DATA CỦA TRƯỜNG** (Không làm rớt bất kỳ khái niệm/định nghĩa nào trong mục lục gốc).

**Khung Tư Duy Tái Cấu Trúc 7 Tầng (Áp dụng cho cả kb.json và tag qs.json):**
Bất kể kiến thức đầu vào là gì, Agent BẮT BUỘC nhào nặn và phân bổ nội dung vào 7 "Rổ" sau:
1. **[Nền tảng]:** Nền móng định hình (Khái niệm gốc, Định nghĩa, Bản chất cốt lõi).
2. **[Cấu trúc]:** Bộ khung cơ sở đặt trên nền tảng (Các thành phần, Yếu tố cấu thành, Phân loại).
3. **[Hệ thống]:** Cách các cấu trúc được lắp ráp lại với nhau (Sự liên kết, Sơ đồ tổ chức, Mô hình tổng thể).
4. **[Phân luồng]:** Cách dòng chảy thông tin/vật chất chạy qua hệ thống (Quy trình, Chu trình, Các bước tiến hành).
5. **[Logic & Nguyên tắc]:** Điều kiện, "luật chơi" của hệ thống (Công thức, Nguyên lý hoạt động, Tại sao nó chạy được).
6. **[Giới hạn & Rủi ro]:** Những điểm mù (Nhược điểm, Ngoại lệ, Rủi ro, Cảnh báo bẫy lật kèo).
7. **[Góc nhìn Đa chiều]:** Bức tranh thống nhất được soi chiếu qua lăng kính các chủ thể khác nhau (Góc nhìn quản lý vs nhân viên, Buyer vs Seller, Vi mô vs Vĩ mô).
*(Lưu ý: Khung 7 Tầng là một lăng kính (Scanner), không phải rọ ép buộc. Nếu tài liệu trường hoàn toàn khuyết tầng nào đó (VD: không có Rủi ro), Agent ĐƯỢC PHÉP ẨN nhánh đó đi. TUYỆT ĐỐI CẤM tự sáng tác kiến thức ngoài luồng để lấp chỗ trống).*

**3. Double Exclusion (Loại trừ kép) - Ma Trận Lục Hợp:**
Thay vì bắt học sinh nhớ cả câu dài, hệ thống chỉ Highlight (in đậm + đổi màu) các "Từ khóa cốt lõi" tạo nên điểm khác biệt giữa đáp án đúng và đáp án sai. Bắt buộc tuân thủ 6 tiêu chuẩn sau:
  1. **Độc bản** (Danh từ cốt lõi của câu hỏi)
  2. **Ngữ cảnh** (Phạm vi/Mốc thời gian của câu hỏi)
  3. **Lật kèo** (Điều kiện phủ định/ngoại trừ)
  4. **Đối chiếu chéo** (Từ khóa đáp án ĐÚNG tuyệt đối không được xuất hiện trong 3 đáp án SAI - Delta)
  5. **Mỏ neo** (Từ khóa đáp án phải nối logic 1-1 với từ khóa câu hỏi)
  6. **Cô đọng** (Đủ ý & Bao quát: 2-4 cụm từ khóa/câu hỏi, mỗi cụm 2-4 chữ). Đảm bảo người dùng chỉ cần ráp các từ khóa lại là hiểu được 80% câu hỏi mà không cần đọc chữ thường.

---

## TẦNG 2: GOVERNANCE & SECURITY (Bảo mật & Quản trị Rủi ro)

Đây là lớp khiên bảo vệ hệ thống khỏi sự "nhiệt tình thái quá" hoặc ảo giác (hallucination) của AI.

**1. Bảo vệ Chân Lý (SSoT Immunity - Thiết Quân Luật):**
- **TUYỆT ĐỐI CẤM** mọi Agent tự ý dùng công cụ sửa file (write_to_file/replace_file_content) để thay đổi nội dung của `Source_of_Truth.md` và `.agents/AGENTS.md`.
- Bất cứ khi nào nhận lệnh cập nhật luật, Agent phải lên kế hoạch (Implementation Plan), giải trình rõ ràng sự thay đổi. Chỉ khi User nói "Duyệt" mới được phép ghi đè.

**2. An toàn Thực thi (Sandbox & Permission):**
- Hệ thống macOS/IDE sẽ spam hỏi quyền liên tục nếu AI dùng script bash rườm rà.
- Để chặn đứng điều này: Mọi tác vụ ghi/cập nhật dữ liệu vào JSON **BẮT BUỘC** phải được viết gọn vào file `scratch/process_oneshot.py` (ghi đè file này vô tư) và chạy lệnh `python3 scratch/process_oneshot.py` trong Sandbox an toàn (`BypassSandbox = false`).
- NGHIÊM CẤM dùng các lệnh Bash chắp vá như `cat >>` hay `sed` để sửa file JSON.

**3. Giới hạn Vùng nổ (Blast Radius - Kiến trúc 3 Lớp):**
- **Lớp 1 (Raw):** Mọi text thô từ User phải được lưu thành file tại `raw_inputs/`.
- **Lớp 2 (Staging):** File Database thật `_qs.json` phải được COPY sang `staging/temp_qs.json`. AI chỉ được phép nhào nặn, cắt gọt, tẩy trùng trên file Staging này.
- **Lớp 3 (Main & CI/CD):** Chỉ khi JSON trong Staging parse thành công không lỗi, hệ thống mới được phép ghi đè lên file gốc, ghi log vào `PROJECT_LOG.md`, và chạy lệnh Git theo **Quy Tắc Phạm Vi Commit** (xem mục 4 bên dưới).

**4. Quy Tắc Đa Nhiệm Đồng Thời (Parallel Mode - Chống Giẫm Đạp Tài Nguyên):**
Khi User mở nhiều khung chat cùng làm việc trên một Workspace, hệ thống phân định rõ **2 vai trò Agent** để tránh xung đột Git:
- **Khung Chat Data (Subject Worker):** Agent được User giao cày 1 môn học cố định (từ Bước 3). Agent này **BỊ KHÓA VÙNG TRỜI** trong thư mục môn đó. Lệnh Git lúc này **NGHIÊM CẤM** dùng `git add .`. Bắt buộc phải dùng `git add "_sources/[Tổ chức]/[Chương trình]/[Tên Môn]/"` để chỉ commit đúng phạm vi môn học đang làm. Đồng thời **KHÔNG ĐƯỢC** tự ý mở và chỉnh sửa file `assets/config.js` trừ khi User ra lệnh trực tiếp, nhằm tránh Race Condition (2 Agent ghi đè cùng lúc gây mất data môn học).
- **Khung Chat System (App Developer):** Agent được User giao sửa UI/UX, thêm tính năng, refactor hệ thống chung. Agent này vẫn hoạt động bình thường theo quy trình Build-Measure-Learn (Mục 2 của Tầng 3). Lệnh `git add` được phép chạy trên các file hệ thống (`.html`, `.js`, `.css`, `config.js`) để push tính năng lên Vercel.
- **Nguyên tắc chung:** Mỗi Agent phải tự ý thức vai trò của mình (Data Worker hay System Developer) dựa trên ngữ cảnh cuộc hội thoại với User để chọn phạm vi `git add` cho chính xác.

**5. Quy Tắc Phân Quyền Lính Đánh Thuê (Orchestration Protocol):**
Hệ thống cấm tuyệt đối tình trạng giẫm đạp tài nguyên khi gọi nhiều Agent phụ. Phân cấp rõ 2 bậc:
- **Agent Trưởng (Orchestrator):** Là thực thể đang chat trực tiếp với User. Đặc quyền duy nhất được nắm chìa khóa hệ thống (được xài Sandbox, gọi Python script, xài tool ghi file, và quản lý Git). 
- **Sub-agent (Đám lính ngầm):** Là các Agent con được gọi trong quá trình xử lý (như Thợ Đào, Thợ Xây, Thanh Tra). **NGHIÊM CẤM 100%** sử dụng các tool tương tác vật lý với máy chủ (Ghi đè file, chạy lệnh Terminal, Git). Sub-agent chỉ được phép nhận Text (Input) và nhả JSON/Text (Output). Chỉ có Agent Trưởng mới được quyền gom data từ đám lính và thực hiện Safe Write.

---

## TẦNG 3: ARCHITECTURE & PROCESS (Quy trình & Tổ chức)

**1. Giao Thức Hợp Tác 13 Bước Dev ↔ Agent & Vòng Lặp CI/CD Song Song:**
Quy trình co-work chuẩn hóa cho toàn bộ vòng đời môn học, vận hành theo tiêu chí: *“Làm tới đâu, kiểm thử 0 lỗi, lên sàn Vercel ngay tới đó”*:
- **Bước 1:** **User** mở khung chat lên và nhập lệnh khởi động: **"Bắt đầu"**.
- **Bước 2:** **Agent** nhận lệnh khởi động, lập tức quét thư mục `_sources/` ở gốc Workspace (và các thư mục Tổ chức/Chương trình bên trong), đối chiếu với mảng `window.TVU_SUBJECTS` trong file `assets/config.js` để tìm ra các môn học mới. Khi liệt kê, **BẮT BUỘC** phải ghi chú lại thông tin `[Tổ chức]` và `[Chương trình]` từ đường dẫn thư mục để làm data. Sau đó, **liệt kê rõ ràng danh sách các môn chưa được build** và hỏi User: *"Mày muốn bắt đầu môn nào trước?"*
- **Bước 3:** **User** phản hồi chọn tên môn học cần xử lý.
- **Bước 4:** **Agent** tự động làm việc bên trong thư mục môn học đó tại `_sources/[Tổ chức]/[Chương trình]/[Tên Môn]/` và xây nền móng giàn giáo (`raw_inputs/`, `staging/`, tạo file `kb.json` và file `qs.json`). **LƯU Ý KHỞI TẠO CHỐNG SẬP WEB:** Tuyệt đối cấm tạo file rỗng 0 byte. Khi tạo file mới, BẮT BUỘC phải ghi vào đúng cấu trúc sau:
  - `qs.json`: Nội dung là mảng rỗng `[]`.
  - `kb.json`: Nội dung BẮT BUỘC là `{ "overview": {}, "details": [] }`.
  Hoàn tất phản hồi kèm **Báo Cáo Nghiệm Thu**.
- **Bước 5:** (Tuỳ chọn) Nếu web chưa khai báo môn, cập nhật ngay file `assets/config.js` trỏ đường dẫn tới JSON để App nhận diện. **CẢNH BÁO:** Bắt buộc phải viết script Python (vd: dùng regex hoặc AST) vào `scratch/process_oneshot.py` để parse và cập nhật mảng JS an toàn. Tuyệt đối cấm dùng lệnh replace text thủ công để tránh lỗi syntax sập web.
- **Bước 6:** **Agent** chủ động hỏi: *"Có kiến thức nào cần nạp nữa không? (Mày có thể hô 'Bỏ qua' để sang thẳng phần Đề thi)"* để chờ User ném thêm dữ liệu hoặc chờ lệnh nhảy cóc.
- **Bước 7:** **User** quăng toàn bộ kiến thức, tài liệu giáo trình vào thư mục môn học rồi chốt lệnh (VD: "Chốt"). NẾU User hô *"Bỏ qua"* hoặc *"Nhảy qua đề thi"*, Agent lập tức BỎ QUA Bước 8 & 9 và nhảy thẳng sang Bước 10.
- **Bước 8 (Dây chuyền Phân xưởng Kiến thức - Chống Rớt Chữ):** Nhận lệnh chốt từ User, **Agent Trưởng** BẮT BUỘC dùng `list_dir` để quét tài liệu trong thư mục môn học. Tuyệt đối cấm đoán mò nội dung nếu chưa quét file. Dựa vào khối lượng tài liệu, Agent kích hoạt quy trình Map-Reduce:
  - **Khâu 1 (Cắt lát - Semantic Chunking):** Chẻ nhỏ file tài liệu dài dựa trên Tiêu đề/Chương mục (đảm bảo không cắt vỡ ngữ nghĩa).
  - **Khâu 2 (Thợ Đào - Map):** Gọi các Sub-agent (Thợ Đào) vào cày từng lát cắt. Nhiệm vụ: vắt kiệt 100% định nghĩa/ý chính và tự ráp sơ bộ vào Khung 7 Tầng (Thành bản nháp Mini).
  - **Khâu 3 (Thợ Xây - Reduce):** Agent Trưởng thu thập các bản nháp Mini từ đám lính, gộp (merge) lại thành một Bản Nháp Tổng Thể duy nhất, loại bỏ trùng lặp.
  - **Khâu 4 (Thanh Tra - Audit):** Gọi Sub-agent Thanh Tra đọ chéo Bản Nháp Tổng Thể với đống list Fact thô ban đầu (đối chiếu list vs list) để bắt quả tang bất kỳ kiến thức nào bị rớt. Bắt buộc sửa đến khi Thanh Tra báo "Sạch 100%".
- **Bước 8.5 (Checkpoint Duyệt Bản Nháp — CỬA CHẶN BẮT BUỘC):** Sau khi Dây chuyền Bước 8 hoàn tất rà soát ngầm, Agent Trưởng **PHẢI DỪNG LẠI** và xuất **Bản Nháp Trực Quan Hóa Tổng Thể** theo template chuẩn bên dưới. Trình User xem và chờ lệnh **"Duyệt"** rồi mới được tiến hành Bước 9. Nếu User yêu cầu chỉnh sửa, Agent phải sửa rồi trình lại. **NGHIÊM CẤM** nhảy thẳng vào viết `kb.json` mà chưa qua checkpoint này.
  - **TEMPLATE BẢN NHÁP (Bắt buộc tuân thủ):**
    ```
    ## TẦNG OVERVIEW
    => [Component: mindmap]
    - Root: TÊN MÔN HỌC
      - [TÊN CHƯƠNG/CHỦ ĐỀ TRONG SÁCH] (VD: Khái quát về Tiền Tệ)
        - [Tên Kiến Thức Thực Tế trong sách] (node_id) => (Thuộc tầng: Nền tảng)
        - [Tên Kiến Thức Thực Tế trong sách] (node_id) => (Thuộc tầng: Cấu trúc)
        - [Tên Kiến Thức Thực Tế trong sách] (node_id) => (Thuộc tầng: Hệ thống)
        - [Tên Kiến Thức Thực Tế trong sách] (node_id) => (Thuộc tầng: Phân luồng) - Nếu có
        - [Tên Kiến Thức Thực Tế trong sách] (node_id) => (Thuộc tầng: Logic & Nguyên tắc)
        - [Tên Kiến Thức Thực Tế trong sách] (node_id) => (Thuộc tầng: Giới hạn & Rủi ro) - Nếu có
        - [Tên Kiến Thức Thực Tế trong sách] (node_id) => (Thuộc tầng: Góc nhìn Đa chiều) - Nếu có
      - [TÊN CHƯƠNG/CHỦ ĐỀ TRONG SÁCH TIẾP THEO]...

    ## TẦNG DETAILS
    ### Nhánh: [Tên Kiến Thức Thực Tế] (node_id)
    => [Component: tên_component_được_chọn]
    - Dữ liệu đã bóc tách theo đúng field chuẩn của Component
    > Lý do chọn Component: [Giải thích ngắn gọn tại sao chọn Component này]
    ```
  - **Quy tắc khi viết bản nháp:** (1) LƯU Ý CỰC KỲ QUAN TRỌNG: Khung 7 Tầng chỉ là "Lớp tư duy ngầm" (Hidden Framework). TUYỆT ĐỐI CẤM dùng các từ như "Nền tảng", "Cấu trúc" làm tiêu đề/nhãn trên giao diện Mindmap. Nhãn (Label) và thẻ (Tag) phải dùng đúng Tiêu đề kiến thức tinh gọn nhất của môn đó (VD: Ghi "Khái quát Tiền tệ" chứ KHÔNG ghi "Chương 1: Khái quát Tiền tệ" hay "C1_Nền tảng"). **TUYỆT ĐỐI CẤM đính kèm các tiền tố dư thừa như "Chương X:", "Chuyên đề:", "Bài Y:" vào bất kỳ Label hay Tag nào, VÀ TUYỆT ĐỐI CẤM nhét tên các Tầng (như "Nền tảng", "Cấu trúc"...) vào trường `description` hay bất kỳ trường hiển thị nào của `kb.json`.** (2) Khung 7 tầng áp dụng ở cấp độ nhóm kiến thức. (3) Cross-check MECE: Đảm bảo 100% Khái niệm gốc không bị rớt chữ.
- **Bước 9 (Tái cấu trúc & Trực quan):** Nhận lệnh **"Duyệt"** từ User, **Agent** chuyển đổi bản nháp đã duyệt thành `kb.json` theo Ma trận 34 linh kiện (Component). **BẮT BUỘC** dùng tool `view_file` đọc file `knowledge-app/src/types/schema.ts` để lấy chuẩn cấu trúc JSON.
  - **CẤU TRÚC KHUNG XƯƠNG (FRAME OVERVIEW):** File `kb.json` **BẮT BUỘC** phải tuân thủ kiến trúc phân tầng. Bắt đầu bằng một khối `overview` (thường dùng `mindmap` hoặc `roadmap`) để làm bản đồ điều hướng chính. Sau đó, các thành phần mổ xẻ chi tiết (Deep Dive) và Đề thi (Quiz) được đặt trong mảng `details`, liên kết chặt chẽ với các Node của overview thông qua `node_id`.
  - **TÍCH HỢP ĐỀ THI:** Khối `quiz` bên trong `details` tự động bốc dữ liệu từ `qs.json`. Thêm thuộc tính `"quiz_tags": ["Tag 1"]` vào `data` của khối Quiz để lọc câu hỏi. Nếu bỏ trống, hệ thống sẽ bốc toàn bộ ngân hàng câu hỏi. **TUYỆT ĐỐI** không hard-code câu hỏi vào `kb.json`.
  - Nhớ bám sát "Nguyên tắc tinh gọn ý", chạy Sandbox an toàn và tạo Báo Cáo. Mọi công việc kết thúc thì chạy lệnh Git theo **Quy Tắc Phạm Vi Commit** (Tầng 2, Mục 4): `git add "_sources/[Tổ chức]/[Chương trình]/[Tên Môn]/" && git commit -m "Cập nhật kiến thức" && git push`. Mọi thứ tự động cập nhật lên Web.
- **Bước 10:** **User** quăng bộ câu hỏi trắc nghiệm (có đáp án hoặc **chưa có đáp án**) vào thư mục `raw_inputs/` của môn đó cho Agent.
- **Bước 11:** **Agent Trưởng** kích hoạt Dây chuyền Xử lý Đề 1 Chạm:
  - **Quy tắc Quét File:** BẮT BUỘC dùng `list_dir` vào thư mục `raw_inputs/` để tìm file đề thi User vừa thả vào trước khi xử lý, cấm đoán mò.
  - **Cơ chế Băm Nhỏ Đề Thi (Quiz Chunking - Chống Rớt Câu Hỏi):** 
    - Nếu file thô có **dưới 30 câu**, Agent Trưởng tự xử lý toàn bộ. 
    - Nếu file thô có **từ 30 câu trở lên**, BẮT BUỘC chẻ nhỏ file ra (Băm: tối đa 50 câu/khúc). Gọi các Sub-agent vào xử lý trọn gói song song từng khúc (Nhào: Lọc trùng, Gắn highlight, Tự giải). Sau đó Agent Trưởng thu thập JSON từ các lính gộp lại (Gom: Reduce). Cuối cùng, **Thanh Tra Đếm Số** sẽ đối chiếu tổng câu hỏi đầu vào (trừ trùng lặp) với đầu ra, nếu khớp 100% mới cho phép chạy lệnh Safe Write.
  - **Quy tắc Liên kết Kép (Đồng bộ Tag):** Trước khi dán Tag phân loại cho `qs.json`, Agent BẮT BUỘC phải dùng `view_file` đọc lại `kb.json` để soi Tên Chương/Chủ Đề đã chốt. Tag chuyên đề trong `qs.json` phải KHỚP 100% (cả dấu và viết hoa/thường) với tag trong `kb.json`. Cấm tự chế tên tag mới gây đứt gãy bộ lọc UI.
  - **Quy tắc Định dạng JSON (Cấm Markdown):** Toàn bộ nội dung câu hỏi, đáp án, giải thích BẮT BUỘC dùng 100% thẻ HTML (`<b>`, `<br>`, `<span class="keyword">`, `<span class="answer-keyword">`). TUYỆT ĐỐI CẤM dùng Markdown (`**`, `*`, `\n`) lọt vào chuỗi giá trị của JSON gây rác giao diện.
  - **Quy tắc Tự Giải Đề:** Với những câu hỏi *chưa có đáp án*, Agent có nghĩa vụ móc nối dữ liệu lý do từ Bước 9 để tự động suy luận bẻ khóa tìm đáp án đúng 100%. ĐỐI VỚI CÂU HỎI TỰ GIẢI (CHƯA CÓ ĐÁP ÁN), SAU KHI GIẢI XONG BẮT BUỘC TRÍCH XUẤT LẠI NỘI DUNG CÂU HỎI VÀ ĐÁP ÁN Ở NGÔN NGỮ TỰ NHIÊN ĐỂ USER ĐỌC VÀ KIỂM TRA LẠI TRONG BÁO CÁO NGHIỆM THU. Đặc biệt lưu ý ranh giới 2 loại câu hỏi sau:
    1. **Câu hỏi Thảo luận (Cày chuyên cần):** Agent BẮT BUỘC nhập vai một sinh viên xuất sắc, hành văn rõ ràng, mạch lạc, chia ý cụ thể và trình bày theo dạng quan điểm/góc nhìn cá nhân để đối đáp với giáo viên. **LƯU Ý ĐẶC BIỆT:** Vẫn giữ sự lễ phép (dạ, thưa thầy/cô, theo em) nhưng cấm tuyệt đối dùng các cụm từ xưng hô sáo rỗng, thảo mai kiểu "đã lắng nghe", "cảm ơn thầy cô",... cứ đi thẳng trực diện vào vấn đề chuyên môn một cách tự nhiên. Giải xong chỉ in text ra màn hình cho User copy. **TUYỆT ĐỐI KHÔNG lưu vào `qs.json`**.
    2. **Câu hỏi Tự luận (Thi cử):** KHÔNG nhập vai sinh viên. Bắt buộc giữ văn phong chuẩn mực khoa học theo nguyên tắc ngân hàng đề. Giải xong **LƯU vào `qs.json`** như bình thường.
  - Thực thi luân lưu Kiến trúc 3 lớp (The Core 3-layer protection): Lọc trùng trên Staging ➔ Đánh dấu từ khóa theo Ma Trận Lục Hợp (Highlight từ khóa, tách `<div class="options-grid">` và `<div class="note">`) ➔ Safe Write vào `qs.json`.
  - Xuất **Báo Cáo Nghiệm Thu** (Số lượng, khối lượng, trạng thái giải đề) và chạy lệnh Git theo **Quy Tắc Phạm Vi Commit** (Tầng 2, Mục 4): `git add "_sources/[Tổ chức]/[Chương trình]/[Tên Môn]/" && git commit -m "Cập nhật đề thi" && git push` để Vercel Deploy song song.
- **Bước 12 (Vòng lặp Vĩnh Cửu & Cơ Chế Nạp Bù):** Bất cứ lúc nào (kể cả khi đã hô 'Bỏ qua' ở Bước 7), nếu User thả thêm tài liệu lý luận mới hay đề thi mới và hô *"Nạp thêm kiến thức"* hoặc *"Thêm đề"*, Agent tự động kích hoạt lại Bước 8 & Bước 9 (để build lại `kb.json`) hoặc Bước 11 (để update `qs.json`).
- *Lưu ý về chữ "Im Lặng":* Trong suốt tiến trình cày búa data, cấm lề mề hỏi xin phép vặt vãnh. Tuy nhiên, sau khi gia công xong bất kỳ bước nào (Bước 2, 4, 9, 11), việc gửi **Báo Cáo Nghiệm Thu** là nghĩa vụ bắt buộc!

**2. Build-Measure-Learn (Quy Tắc Phát Triển Tính Năng & Đại Phẫu UI):**
Để bảo vệ UI/UX và Logic không bị vỡ:
- Tuyệt đối KHÔNG viết code (`.html`, `.js`, `.css`) trực tiếp lên nhánh `main`.
- BẮT BUỘC tạo nhánh riêng (`git checkout -b feature/[tên-tính-năng]`).
- Code và Sandboxing toàn bộ trên nhánh này.
- Dừng lại để User "Nghiệm thu Local". Khi User chốt "Duyệt" thì tiến hành `git checkout main`, `git merge feature/[tên-tính-năng]` và Deploy Vercel.

---

## TẦNG 4: DERIVED SoT LAYERS (Kỹ Thuật Thực Thi)

**1. Lớp Kho Vũ Khí (34 Component Trực Quan Hóa):**
- **Quy tắc Hộp Đồ Nghề (No Forced Display & Strict Schema):** Khẳng định bộ 34 component là hòm công cụ. Danh sách và cấu trúc JSON chuẩn của 34 component được định nghĩa cứng tại `knowledge-app/src/types/schema.ts`. **CẤM** Agent tự sáng tác (hallucinate) tên type hay cấu trúc ngoài danh sách này. Nghiêm cấm gượng ép nhét toàn bộ 34 component vào một bài ôn thi gây ngột ngạt rác thảm.
- **Công thức Bộ Tứ Cốt Lõi (4 Pillars):** Mỗi chuyên đề bốc tối đa **4 - 7 component** xoay quanh 4 trụ cột thi lấy điểm (nếu bài quá ngắn, được phép linh hoạt dùng 1 - 3 component để tránh dư thừa):
  1. **Bản Đồ Tổng Thể (The Big Picture):** `HeroCard`, `Roadmap`, `ProcessSteps`, `EcosystemMap`...
  2. **Mổ Xẻ Bản Chất (Deep Dive):** `LayeredModel`, `TAccount`, `ComparisonTable`, `HierarchicalTree`...
  3. **Bí Kíp Delta Lật Kèo (Trap Breaking):** `DeltaCheatSheet`, `PainPoint`, `TrueFalseGrid`, `DecisionTree`...
  4. **Kiểm Chứng Phản Xạ (Checklist/Formula):** `InteractiveCalc`, `PriorityMatrix`, `ScenarioGrid`...
- **Quy tắc Tương tác Mindmap:** Đối với Component `Mindmap` (hoặc các component dùng Zoom-Pan-Pinch), BẮT BUỘC tắt cơ chế neo giữa màn hình (`limitToBounds={false}`). User phải được tự do kéo (pan) bản đồ đi bất cứ đâu mà không bị giật (snap) tuột về trung tâm khi buông chuột.

**2. Thuật toán Ánh Xạ Nhận Thức & Chống Thiên Lệch Component (Anti-Bias Logic):**
- **Quy tắc Mỏ Neo (The Anchor Rule):** Tầng `overview` của `kb.json` BẮT BUỘC luôn là `mindmap` để làm gốc rễ định hướng.
- **Quy tắc Chống Lười (Anti-Safe Choice Bias):** Khi chọn Component cho tầng `details`, Agent BẮT BUỘC phải rà soát qua các Component dị biệt (như `radar-chart`, `venn-diagram`, `funnel`, `kanban`, `ecosystem-map`, v.v.) trước tiên. CẤM lạm dụng `features`, `vs-wrap` hay `matrix-table` một cách vô tội vạ. Chỉ được dùng các Component cơ bản này khi dữ liệu thật sự quá ngắn hoặc không có các đặc tính giao thoa, chiều sâu, hay tiến trình.
- **Cơ chế Đổ Xúc Xắc Component (Roulette Weighting):** Thay vì tự do chọn bừa, Agent phải quét các "Từ khóa hình thái" trong Text thô để kích hoạt Component đặc thù:
  - Text chứa *"giai đoạn, bước, quy trình, tiếp theo"* ➔ BẮT BUỘC ưu tiên `funnel`, `process-steps`, `roadmap` hoặc `gantt-chart`.
  - Text chứa *"ưu điểm, nhược điểm, sai lầm, rủi ro, ngoại lệ"* ➔ BẮT BUỘC ưu tiên `pain-point`, `delta-cheat-sheet` hoặc `true-false-grid`.
  - Text mổ xẻ nhiều góc độ, đa chiều tiêu chí ➔ BẮT BUỘC ưu tiên `radar-chart`, `heatmap`, `matrix-table`.
  - Text thể hiện sự bao hàm, lớp lang ➔ BẮT BUỘC ưu tiên `layered-model`, `hierarchical-tree`.
- **Quy tắc Đo Lường Trọng Lượng (Data Gravity):** Text ngắn (< 50 từ) mang tính liệt kê ➔ Áp dụng Component nhẹ: `pair-grid`, `features`. Text dài, nhiều điều kiện phức tạp ➔ Ép dùng Component nặng và có tính tương tác: `decision-tree`, `interactive-calc`, `scenario-grid`.

**3. Lớp UI/UX Standards ("Less is More"):**
- **Quy Chuẩn Viết In Hoa (Uppercase Consistency):** Không bắt buộc cứng nhắc một màu. Các chuỗi VIẾT IN HOA (`text-transform: uppercase`) được phép phối màu linh hoạt (`--primary`, `--secondary`, `--muted`, v.v...) tùy theo bối cảnh khối UI (VD: Component Kiến thức nền). Tuy nhiên, vẫn **CẤM** lạm dụng các màu rực rỡ chói mắt (đỏ tươi, xanh lá chuối, cam nguyên bản) rải thảm lên tiêu đề gây xao nhãng. (Ngoại lệ: Các thẻ cảnh báo Bẫy Nguy Hiểm/Bẫy Lật Kèo vẫn ưu tiên dùng mờ Đỏ `--color-danger`).
- **Quy Chuẩn Màu Nội Dung:** Văn bản câu hỏi/ý chính dùng **Trắng nguyên bản (`#ffffff`)**; đoạn giải thích dài hay thông tin phụ dùng **Xám mờ (`rgba(255, 255, 255, 0.7)`)**.
- **Tối Giản Tuyệt Đối:** Nghiêm cấm nhét các icon phèn phèn hoặc emoji rễ ràng rườm rà không phục vụ trực tiếp việc giải thích.
- **Cấm Margin Âm:** Tuyệt đối KHÔNG DÙNG "margin âm" (`margin: -Xpx`). Bắt buộc canh giãn bố trí bởi Flexbox/Grid `gap`.
- **Giao diện Bộ lọc (Compact UI):** Đối với các bộ lọc có nhiều tùy chọn (như Filter Tags), BẮT BUỘC dùng thiết kế **Dropdown Menu chứa Checkbox (Multi-select)** thay vì trải dài các nút bấm ra màn hình gây choán diện tích. Dropdown tự động co dãn (`fit-content`) và đếm số lượng lựa chọn.
- **Quy Chuẩn Hiển Thị Thẻ Tag (Clean Tag UI):** Để chống nhiễu thị giác trong Luyện đề:
  1. Trong Dropdown "Lọc Dạng Câu Hỏi": CHỈ hiển thị thẻ nguồn gốc (`Kiến thức`, `Mẫu`) và 7 thẻ Khung Tư Duy. TUYỆT ĐỐI ẩn các thẻ Tên kiến thức chuyên đề.
  2. Trên Card Câu Hỏi: UI CHỈ render tối đa 3 loại thẻ: Thẻ nguồn gốc, Thẻ Khung Tư Duy, và Thẻ Trọng tâm (nhãn High/Trọng tâm). Ẩn hoàn toàn thẻ Tên kiến thức chuyên đề để giữ giao diện gọn gàng (mỗi câu chỉ hiện 1-2 tag). *(LƯU Ý DÀNH CHO AGENT: Tuyệt đối KHÔNG được chèn thủ công chữ `High` hay `Trọng tâm` vào mảng `tags` của `qs.json`. Các thẻ này do UI tự động đẻ ra dựa vào thuộc tính `weight` của câu hỏi).*
- **Tư duy Mobile-First:** Các UI mới phải bo trọn trên màn hình Mobile (`flex-wrap: wrap`), không để lẹm chữ. Tái sử dụng Design Tokens, cấm hardcode màu tùy hứng.

**4. Lớp Dữ Liệu & Cơ Chế Liên Kết (One-Source-of-Truth cho Kiến Thức và Đề Thi):**
- **Cơ Chế Liên Kết Kép (Dual-Binding):** File `qs.json` không chỉ đóng vai trò là ngân hàng cho chế độ Thi Thử (Thi đấu sinh tồn) mà nay đã trở thành **lõi cung cấp dữ liệu động (Dynamic Data Provider)** cho các khối Quiz bên trong `kb.json`. Nhờ đó, sinh viên có thể vừa học lý thuyết (Trực quan hóa) vừa thực hành (Câu hỏi nhanh) ngay trong cùng một ngữ cảnh.
- **Cơ Chế Thi Thử:** Nghiêm cấm mọi Agent tự ý đẻ file HTML hay dữ liệu JSON độc lập riêng lẻ cho chế độ Thi Thử. Chế độ Thi Thử là một **Cỗ máy trích xuất tự động (Automated Extraction Engine)** đọc trực tiếp mảng `options` trong `qs.json`, lột toàn bộ các thẻ bôi đậm highlight (`<span class="keyword">`, `<span class="answer-keyword">`, `<b>`) trả về văn bản thô trắng tinh y như phòng thi thật, và trộn ngẫu nhiên thứ tự để thi đấu sinh tồn! Đối với các môn Flashcard không có 4 lựa chọn, mảng `options` sẽ rỗng và App tự động ẩn chế độ Thi Thử.
- **Cấu Trúc JSON Đề Thi (`qs.json`):** Để UI Filter/Sort hoạt động, cấu trúc JSON của mỗi câu hỏi **bắt buộc phải có đủ 5 keys sau**:
  1. `"weight"`: (String) `"high"` hoặc `"normal"` để sắp xếp ưu tiên.
  2. `"question"`: Chuỗi HTML liền mạch chứa câu hỏi. Cấm tự ý chèn các tiền tố/nhãn dán mặc định (Q1, Q2...).
  3. `"answer"`: Chuỗi HTML liền mạch. Đáp án đúng **bắt buộc** nằm ngang hàng ngay sau thẻ `<div class="answer-title">✅ Đáp án:</div>`. Giải thích lọt thỏm trong `<div class="note">`.
  4. `"options"`: Mảng `["A", "B", "C", "D"]` thuần túy chứa 4 đáp án (hoặc mảng rỗng `[]` nếu là câu hỏi tự luận/điền khuyết).
  5. `"tags"`: Mảng chứa các chủ đề dùng để lọc. **LƯU Ý ĐẶC BIỆT:** Ngoài 2 thẻ nguồn gốc (`Kiến thức` hoặc `Mẫu`), mảng tag BẮT BUỘC sử dụng đồng bộ "Khung Tư Duy 7 Tầng" làm Tag Phân Loại Câu Hỏi (VD: `Nền tảng`, `Logic & Nguyên tắc`). Câu hỏi sẽ có mảng tag kép kiểu: `["TÊN KIẾN THỨC", "Nền tảng"]` (Lưu ý: Không dùng dấu ngoặc vuông `[]` làm thành phần của chuỗi). Điều này giúp sinh viên khi luyện đề vừa lọc theo Kiến thức, vừa lọc theo Tầng Tư Duy. Cơ chế liên kết ngầm: Thẻ Tag (`qs.json`) đại diện cho bề rộng (Chủ đề + Tầng), Tên Node (`kb.json`) đại diện cho bề sâu (Trọng tâm) - chúng ĐƯỢC ĐỒNG BỘ qua mảng `"quiz_tags"` (Ví dụ một node thuộc bài Tiền Tệ sẽ có `"quiz_tags": ["Tiền Tệ", "Nền tảng"]`) để tự động kéo đúng dạng câu hỏi lên UI.
- **Lớp Môn Mới (Single Page App):** Cấm Agent tự ý tạo file `.html` rời rạc cho từng môn học. Mọi môn mới chỉ cần khai báo đường dẫn JSON trong `assets/config.js` là SPA tự render. Với phần Kiến Thức Nền thì xuất dữ liệu chuẩn vào cấu trúc `kb.json` (được hiển thị tự động qua `knowledge-app/` bằng 34 Component). Cấm tự chế giao diện ad-hoc tự do bên ngoài.
