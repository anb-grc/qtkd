# SOURCE OF TRUTH (BỘ LUẬT TỐI THƯỢNG)

File này là Chân lý gốc (Single Source of Truth) định hình toàn bộ tư duy, kiến trúc và luồng xử lý của hệ thống Ngân hàng Đề thi Trắc nghiệm & Kiến thức Trực quan TVU. Bất kỳ Agent nào tham gia vào dự án đều **BẮT BUỘC** tuân thủ tuyệt đối các quy định dưới đây.

---

## TẦNG 1: THE WHY (Chân lý gốc & Domain)

**1. Mục Tiêu Tối Thượng (User Problem):**
Hệ thống được sinh ra để giải quyết một nỗi đau duy nhất: Giúp sinh viên ôn thi trắc nghiệm với tốc độ **cực nhanh, chống xao nhãng, trực quan hóa kiến thức phức tạp và nhận diện bẫy dễ dàng**. Mọi tính năng, giao diện hay logic code nếu không phục vụ trực tiếp cho mục tiêu này đều được coi là "Rác" (Waste) và phải bị loại bỏ.

**2. Giá Trị Cốt Lõi (Core Value) & Ranh Giới Xử Lý Dữ Liệu:**
Hệ thống phân định rõ hai vùng xử lý với tiêu chuẩn tuyệt đối:
- **Với Hồ Đề Trắc Nghiệm (`_qs.json`): Tôn trọng Bản gốc 100%.** Tuyệt đối không được tóm tắt, viết tắt hay tự ý thay đổi bất kỳ từ ngữ nào trong đề và đáp án của trường. Sự xa lạ về mặt câu chữ sẽ giết chết trí nhớ của sinh viên trong phòng thi.
- **Với Hồ Kiến Thức Nền Trực Quan (`kb.json` - 34 Component):** Áp dụng nguyên tắc **"Tinh gọn từ ngữ, Cấm bỏ sót tầng ý"**. Được phép gạt bỏ lời dẫn tự sự lề mề, cô đọng câu chữ thành từ khóa sắc bén, nhưng **BẮT BUỘC BẢO TOÀN 100% CẤU TRÚC TẦNG LỚP TRÍ TUỆ** (Ý chính ➔ 3 ý phụ ➔ các ý con). Tuyệt đối cấm tự ý lược bỏ hay cắt rời bất kỳ lớp kiến thức nào của trường.

**3. Double Exclusion (Loại trừ kép) - Ma Trận Lục Hợp:**
Thay vì bắt học sinh nhớ cả câu dài, hệ thống chỉ Highlight (in đậm + đổi màu) các "Từ khóa cốt lõi" tạo nên điểm khác biệt giữa đáp án đúng và đáp án sai. Bắt buộc tuân thủ 6 tiêu chuẩn sau:
  1. **Độc bản** (Danh từ cốt lõi của câu hỏi)
  2. **Ngữ cảnh** (Phạm vi/Mốc thời gian của câu hỏi)
  3. **Lật kèo** (Điều kiện phủ định/ngoại trừ)
  4. **Đối chiếu chéo** (Từ khóa đáp án ĐÚNG tuyệt đối không được xuất hiện trong 3 đáp án SAI - Delta)
  5. **Mỏ neo** (Từ khóa đáp án phải nối logic 1-1 với từ khóa câu hỏi)
  6. **Cô đọng** (Tối đa 1-3 chữ/cụm, giới hạn 1-2 cụm/câu).

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
- **Lớp 3 (Main & CI/CD):** Chỉ khi JSON trong Staging parse thành công không lỗi, hệ thống mới được phép ghi đè lên file gốc, ghi log vào `PROJECT_LOG.md`, tự động `git commit` và push để Vercel deploy song song.

---

## TẦNG 3: ARCHITECTURE & PROCESS (Quy trình & Tổ chức)

**1. Giao Thức Hợp Tác 13 Bước Dev ↔ Agent & Vòng Lặp CI/CD Song Song:**
Quy trình co-work chuẩn hóa cho toàn bộ vòng đời môn học, vận hành theo tiêu chí: *“Làm tới đâu, kiểm thử 0 lỗi, lên sàn Vercel ngay tới đó”*:
- **Bước 1:** **User** mở khung chat lên và nhập mật lệnh: **"Bắt đầu"**.
- **Bước 2:** **Agent** lắng nghe mật lệnh, lập tức quét thư mục `_sources/` ở gốc Workspace (và các thư mục Tổ chức/Chương trình bên trong), đối chiếu với danh sách môn đã build để tìm ra các môn học mới. Sau đó, **liệt kê rõ ràng danh sách các môn chưa được build** và hỏi User: *"Mày muốn bắt đầu môn nào trước?"*
- **Bước 3:** **User** phản hồi chọn tên môn học cần xử lý.
- **Bước 4:** **Agent** tự động làm việc bên trong thư mục môn học đó tại `_sources/[Tổ chức]/[Chương trình]/[Tên Môn]/` và xây nền móng giàn giáo (`raw_inputs/`, `staging/`, file `kb.json` và file `qs.json`), hoàn tất phản hồi kèm **Báo Cáo Nghiệm Thu**.
- **Bước 5:** (Tuỳ chọn) Nếu web chưa khai báo môn, cập nhật ngay file `assets/config.js` trỏ đường dẫn tới JSON để App nhận diện.
- **Bước 6:** **Agent** chủ động hỏi: *"Có kiến thức nào cần nạp nữa không?"* để chờ User ném thêm dữ liệu hoặc chờ lệnh chạy tiếp.
- **Bước 7:** **User** quăng toàn bộ kiến thức, tài liệu giáo trình, video (nếu có) vào thư mục `_sources/[Tổ chức]/[Chương trình]/[Tên Môn]/`. Khi nào xong thì chốt lệnh (VD: "Chốt" hoặc "Bắt đầu cày búa").
- **Bước 8 (Thẩm thấu kiến thức):** Nhận lệnh chốt từ User, **Agent** tiến hành đọc, xem xét và phân tích chi tiết các video/tài liệu bài giảng. Mục tiêu: Hiểu sâu định hướng, tầm quan trọng và ý nghĩa cốt lõi của môn học trước khi bóc tách.
- **Bước 9 (Tái cấu trúc & Trực quan):** **Agent** chắt lọc kiến thức theo Ma trận 34 linh kiện (Component) (nhớ bám sát "Nguyên tắc tinh gọn ý"), output lưu vào file `kb.json`. Nhớ chạy Sandbox an toàn và tạo Báo Cáo. Mọi công việc kết thúc thì dùng lệnh `git push` để Deploy ngay. Mọi thứ tự động cập nhật lên Web.
- **Bước 10 (The Core 3-layer protection):**
  - Thi triển luân lưu Kiến trúc 3 lớp: Lọc trùng trên Staging ➔ Khảm bùa Ma Trận Lục Hợp (Highlight từ khóa, tách `<div class="options-grid">` và `<div class="note">`) ➔ Safe Write vào `qs.json`.
- **Bước 11:** **User** quăng bộ câu hỏi trắc nghiệm (có đáp án hoặc **chưa có đáp án**) vào thư mục `raw_inputs/` của môn đó cho Agent.
- **Bước 12:** **Agent** kích hoạt Dây chuyền Xử lý Đề 1 Chạm:
  - **Quy tắc Tự Giải Đề:** Với những câu hỏi *chưa có đáp án*, Agent có nghĩa vụ móc nối dữ liệu lý do từ Bước 9 để tự động suy luận bẻ khóa tìm đáp án đúng 100%.
  - Thi triển luân lưu Kiến trúc 3 lớp: Lọc trùng trên Staging ➔ Khảm bùa Ma Trận Lục Hợp (Highlight từ khóa, tách `<div class="options-grid">` và `<div class="note">`) ➔ Safe Write vào `qs.json`.
  - Tuất **Báo Cáo Nghiệm Thu** (Số lượng, khối lượng, trạng thái giải đề) và tự động push Vercel Deploy song song.
- **Bước 13 (Vòng lặp Vĩnh Cửu):** Agent tự động ráo riết thi triển trỏ lặp lại ván bài ở Bước 9 & 12 mỗi khi User thả thêm tài liệu lý luận mới hay đề thi mới.
- *Lưu ý về chữ "Im Lặng":* Trong suốt tiến trình cày búa data, cấm lề mề hỏi xin phép vặt vãnh. Tuy nhiên, sau khi gia công xong bất kỳ bước nào (Bước 2, 4, 9, 12), việc gửi **Báo Cáo Nghiệm Thu** là nghĩa vụ bắt buộc!

**2. Build-Measure-Learn (Quy Tắc Phát Triển Tính Năng & Đại Phẫu UI):**
Để bảo vệ UI/UX và Logic không bị vỡ:
- Tuyệt đối KHÔNG viết code (`.html`, `.js`, `.css`) trực tiếp lên nhánh `main`.
- BẮT BUỘC tạo nhánh riêng (`git checkout -b feature/[tên-tính-năng]`).
- Code và Sandboxing toàn bộ trên nhánh này.
- Dừng lại để User "Nghiệm thu Local". Khi User chốt "Duyệt" thì tiến hành `git checkout main`, `git merge feature/[tên-tính-năng]` và Deploy Vercel.

---

## TẦNG 4: DERIVED SoT LAYERS (Kỹ Thuật Thực Thi)

**1. Lớp Kho Vũ Khí (34 Component Trực Quan Hóa):**
- **Quy tắc Hộp Đồ Nghề (No Forced Display):** Khẳng định bộ 34 component là hòm công cụ. Nghiêm cấm gượng ép nhét toàn bộ 34 component vào một bài ôn thi gây ngột ngạt rác thảm.
- **Công thức Bộ Tứ Cốt Lõi (4 Pillars):** Mỗi chuyên đề chỉ chọn bốc tối thiểu **4 - 7 component** xoay quanh 4 trụ cột thi lấy điểm:
  1. **Bản Đồ Tổng Thể (The Big Picture):** `HeroCard`, `Roadmap`, `ProcessSteps`, `EcosystemMap`...
  2. **Mổ Xẻ Bản Chất (Deep Dive):** `LayeredModel`, `TAccount`, `ComparisonTable`, `HierarchicalTree`...
  3. **Bí Kíp Delta Lật Kèo (Trap Breaking):** `DeltaCheatSheet`, `PainPoint`, `TrueFalseGrid`, `DecisionTree`...
  4. **Kiểm Chứng Phản Xạ (Checklist/Formula):** `InteractiveCalc`, `PriorityMatrix`, `ScenarioGrid`...

**2. Lớp UI/UX Standards ("Less is More"):**
- **Quy Chuẩn Viết In Hoa (Uppercase Consistency):** Không bắt buộc cứng nhắc một màu. Các chuỗi VIẾT IN HOA (`text-transform: uppercase`) được phép phối màu linh hoạt (`--primary`, `--secondary`, `--muted`, v.v...) tùy theo bối cảnh khối UI (VD: Component Kiến thức nền). Tuy nhiên, vẫn **CẤM** lạm dụng các màu rực rỡ chói mắt (đỏ tươi, xanh lá chuối, cam nguyên bản) rải thảm lên tiêu đề gây xao nhãng. (Ngoại lệ: Các thẻ cảnh báo Bẫy Nguy Hiểm/Bẫy Lật Kèo vẫn ưu tiên dùng mờ Đỏ `--color-danger`).
- **Quy Chuẩn Màu Nội Dung:** Văn bản câu hỏi/ý chính dùng **Trắng nguyên bản (`#ffffff`)**; đoạn giải thích dài hay thông tin phụ dùng **Xám mờ (`rgba(255, 255, 255, 0.7)`)**.
- **Tối Giản Tuyệt Đối:** Nghiêm cấm nhét các icon phèn phèn hoặc emoji rễ ràng rườm rà không phục vụ trực tiếp việc giải thích.
- **Cấm Margin Âm:** Tuyệt đối KHÔNG DÙNG "margin âm" (`margin: -Xpx`). Bắt buộc canh giãn bố trí bởi Flexbox/Grid `gap`.
- **Tư duy Mobile-First:** Các UI mới phải bo trọn trên màn hình Mobile (`flex-wrap: wrap`), không để lẹm chữ. Tái sử dụng Design Tokens, cấm hardcode màu tùy hứng.

**3. Lớp Dữ Liệu & Cơ Chế "Thi Thử" (One-Source-of-Truth cho Thi Thử):**
- **Cơ Chế Thi Thử:** Nghiêm cấm mọi Agent tự ý đẻ file HTML hay dữ liệu JSON độc lập riêng lẻ cho chế độ Thi Thử. Chế độ Thi Thử là một **Cỗ máy trích xuất tự động (Automated Extraction Engine)** đọc trực tiếp mảng `options` trong `qs.json`, lột toàn bộ các thẻ bôi đậm highlight (`<span class="keyword">`, `<b>`) trả về văn bản thô trắng tinh y như phòng thi thật, và trộn ngẫu nhiên thứ tự để thi đấu sinh tồn! Đối với các môn Flashcard không có 4 lựa chọn, mảng `options` sẽ rỗng và App tự động ẩn chế độ Thi Thử.
- **Cấu Trúc JSON Đề Thi:** Cấu trúc JSON **bắt buộc** phải sử dụng mảng `options: ["A", "B", "C", "D"]` thuần túy để chứa 4 đáp án (hoặc mảng rỗng `[]` nếu là câu hỏi tự luận/điền khuyết). Trong `_qs.json`, `question` và `answer` là chuỗi HTML liền mạch. Cấm tự ý chèn các tiền tố/nhãn dán mặc định (Q1, Q2, Step 1...) nếu không có trong gốc. Đáp án đúng **bắt buộc** nằm ngang hàng ngay sau thẻ `<div class="answer-title">✅ Đáp án:</div>`. Giải thích lọt thỏm trong `<div class="note">`.
- **Lớp Môn Mới:** Với trang trắc nghiệm thuần thì bám theo khuôn mẫu `.agents/HTML_TEMPLATE.html`; với phần Kiến Thức Nền thì xuất dữ liệu chuẩn vào cấu trúc `kb.json` (được hiển thị tự động qua `knowledge-app/` bằng 34 Component). Cấm tự chế giao diện ad-hoc tự do bên ngoài.
