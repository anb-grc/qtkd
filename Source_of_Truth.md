# SOURCE OF TRUTH (FILE NỀN TẢNG DỰ ÁN)

---
## 🚨 0. NGUYÊN TẮC BẢO TOÀN HỆ THỐNG (META-RULE DÀNH CHO AGENT)
**NGUYÊN TẮC BẤT KHẢ XÂM PHẠM (THIẾT QUÂN LUẬT):** Tuyệt đối CẤM mọi Agent tự ý chỉnh sửa, cập nhật hay thêm bớt nội dung vào file `Source_of_Truth.md` và `.agents/AGENTS.md`. Bất cứ khi nào có ý định thay đổi hai file cốt lõi này, Agent BẮT BUỘC phải trình bày phương án (câu chữ định thêm/sửa) cho User xem xét. CHỈ KHI User xác nhận "Duyệt" thì mới được quyền dùng lệnh để ghi vào file.

**Sau khi được duyệt để cập nhật, Agent phải tuân thủ:**
1. **BẮT BUỘC phải đọc (view_file) lại toàn bộ file một cách cẩn thận từ trên xuống dưới.**
2. Phân tích tác động chéo: Đảm bảo luật mới thêm vào phải ĐỒNG BỘ với luật cũ. Tuyệt đối không để luật mới triệt tiêu, xung đột hay tạo kẽ hở với các logic đã có sẵn.
3. Source of Truth phải luôn là một hệ thống tổng thể đồng nhất, không có luật "đá" nhau.

---
## 🚨 1. NGUYÊN TẮC TỐI THƯỢNG BẤT DI BẤT DỊCH (NGHIÊM CẤM VI PHẠM)
**TUYỆT ĐỐI KHÔNG rút gọn, viết tắt, giản lược hay thay đổi cách thể hiện nội dung câu hỏi và đáp án.**
- Hình ảnh/Bảng biểu xuất hiện trong đề gốc phải được tái tạo/giữ nguyên 100% y như bản gốc (ví dụ: dùng HTML Table để dựng lại bảng SPSS). 
- Nội dung chữ của câu hỏi phải giữ nguyên xi từng dấu chấm, dấu phẩy. 
- Nhiệm vụ duy nhất của quy trình là **Đánh dấu (Highlight)**, KHÔNG ĐƯỢC PHÉP "tóm tắt cho gọn" khiến người học bị bỡ ngỡ, mất phương hướng khi đối chiếu với đề thi thực tế.

---
## 🚀 QUY TRÌNH "MỘT CHẠM" (ONE-TOUCH AUTOMATION)
Quy trình này áp dụng bắt buộc nhằm triệt tiêu mọi sai sót do con người/AI can thiệp thủ công.

### 1. QUY TRÌNH 6 BƯỚC KHỞI TẠO MÔN HỌC MỚI
Khi có yêu cầu xây dựng ngân hàng đề cho một môn học mới toanh, BẮT BUỘC tuân thủ chu trình sau:
1. **Khởi tạo Folder:** Tạo thư mục riêng cho môn học. Nhân bản file mẫu `.agents/HTML_TEMPLATE.html` thành file `[Tên_Môn_Học].html` và tạo file rỗng `[Tên_Môn_Học]_qs.json` (`[]`).
2. **Nạp tài liệu gốc:** Thêm các tài liệu kiến thức (PDF, PPTX, Word...) từ phía nhà trường cung cấp vào thư mục môn học.
3. **Xử lý & Trực quan hóa:** Đọc hiểu tài liệu, bóc tách và trực quan hóa các kiến thức nền tảng (nếu cần).
4. **Xác định Cấu trúc Bài thi:** Dựa vào file hướng dẫn học tập của trường hoặc nghiên cứu sâu trên internet để chốt cấu trúc (các chương, các dạng bài).
5. **Định hình Bộ thẻ (Tags):** Thiết lập bộ thẻ (Tags) chuẩn cho môn học. Hệ thống sẽ sử dụng 2 loại thẻ:
   - Thẻ tối ưu trọng số (Ví dụ: `["80/20"]`, `["Trọng tâm"]`).
   - Thẻ cấu trúc/dạng kiến thức (Ví dụ: `["Chương 1"]`, `["Lý thuyết"]`, `["Bài tập"]`).
   - *QUY TẮC:* Thẻ phải siêu ngắn gọn, tối đa 3 từ (trường hợp đặc biệt có thể nới thành 4 từ).
6. **Xử lý Dữ liệu Câu hỏi:** Đưa data raw vào, dọn rác HTML, gắn chính xác các thẻ (tags) đã tạo ở Bước 5 cho từng câu, bọc highlight và đẩy vào file `_qs.json`.

### 2. DÀNH CHO THÊM CÂU HỎI VÀO MÔN ĐÃ CÓ (KIẾN TRÚC JSON)
Dự án áp dụng kiến trúc tách bạch: Giao diện (UI) nằm ở file `.html`, còn Dữ liệu (Data) nằm ở file `_qs.json`.
Mỗi khi có luồng câu hỏi mới cần nạp vào môn học, BẮT BUỘC phải thực hiện luồng "1 chạm" gồm 6 bước chuẩn chỉnh:
- **QUY TẮC IM LẶNG (SILENT EXECUTION):** AI bắt buộc phải tự động viết code xử lý ngầm toàn bộ lô dữ liệu đầu vào từ câu đầu tiên đến câu cuối cùng. TUYỆT ĐỐI CẤM thói quen lười biếng, dừng lại hỏi xin phép lắt nhắt giữa chừng. Chỉ mở miệng báo cáo với người dùng khi đã chốt hạ xong 100% dữ liệu.

**Bước 0 - Lưu vết (Raw Input Archive):** BẮT BUỘC lưu nguyên văn nội dung text thô mà người dùng paste vào khung chat thành một file `.txt` trong thư mục `raw_inputs/`. Tên file format: `YYYY-MM-DD_mon-hoc_batchX.txt`.

**Bước 1 - Tạo vùng đệm (Staging) & Lọc trùng:** COPY file `_qs.json` của môn học sang thư mục `staging/temp_qs.json`. Các thao tác xử lý tiếp theo CHỈ ĐƯỢC làm trên bản staging này, tuyệt đối chưa đụng vào file gốc. Tiến hành lọc trùng trên bản staging...
  - **CẢNH BÁO CHUẨN HÓA:** Tẩy sạch HTML, gộp khoảng trắng. **ĐẶC BIỆT LƯU Ý:** Dọn sạch các dấu câu thừa (chấm `.`, phẩy `,`, nháy `"`, `'`) ở đầu/cuối chuỗi để tránh lỗi nhận diện sai (`2` phải giống hệt `2.`).
  - **TH1 - Trùng đề nhưng KHÁC đáp án đúng:** Gộp đáp án mới vào trường `answer` cũ. Bốc `<div class="options-grid">` đắp sang nếu câu cũ bị khuyết.
  - **TH2 - Trùng 100% cả đề lẫn đáp án:** Bỏ qua ngay lập tức.
  - **TH3 - Câu hỏi mới hoàn toàn:** Chuyển sang Bước 2.

**Bước 2 - Tiệt trùng, Phân tích, Highlight & Dựng Khối HTML:**
  - **Tiệt trùng Dữ liệu:** Xóa rác hệ thống (Ví dụ: "1 điểm", "Gắn cờ"). Chuẩn hóa tiếng Việt chuẩn NFC.
  - **Quy tắc Đáp án nhiễu:** Bốc đủ 4 lựa chọn nhúng thẳng vào cuối trường `question` dưới định dạng `<div class="options-grid"><div>A. ...</div><div>B. ...</div>...</div>`.
  - **Bảo toàn Cấu trúc DOM:** BẮT BUỘC đếm kỹ thẻ `<div...>` phải bằng chính xác `</div>`. Dư/thiếu 1 thẻ sẽ sập toàn bộ Web.
  - **Quy tắc Highlight:** Áp dụng nghiêm ngặt Lớp 1 và Lớp 2. CHỈ bọc thẻ `<span class="keyword">` / `<span class="answer-keyword">` vào phần chữ cốt lõi. NGHIÊM CẤM bọc dấu câu thừa.
  - **Bảo toàn Điểm số & Giải thích:** Đáp án đúng đưa vào `answer`. Lời giải/cảnh báo học thuật bọc trong `<div class="note">💡 Giải thích: ...</div>`.

**Bước 3 - Cập nhật JSON an toàn (Safe Write):** 
  - Ghi vào file `staging/temp_qs.json`.
  - BẮT BUỘC quét và tái sử dụng chính xác các Tags đang có sẵn. CẤM tự bịa tag mới.
  - **Cảnh báo ghi file & Sandbox:** BẮT BUỘC dùng code (Python/JS) để cập nhật file. **Đặc biệt:** Để tránh bị hệ thống bảo mật spam hỏi quyền liên tục, AI BẮT BUỘC phải viết code vào một file cố định tên là `scratch/process_oneshot.py` (ghi đè nếu đã có) và chạy lệnh `python3 scratch/process_oneshot.py`. TUYỆT ĐỐI KHÔNG dùng lệnh nối chuỗi text (append bash).

**Bước 4 - Kiểm tra, Đồng bộ & Ghi Log:** 
  - Đọc lại file staging để đảm bảo parse JSON thành công.
  - Nếu OK, ghi đè file `staging/temp_qs.json` lên file gốc `_qs.json`.
  - Tự động ghi 1 dòng log vào file `PROJECT_LOG.md`.
  - Tự động chạy lệnh `git add .` và `git commit -m "Thêm câu hỏi môn..."` để bảo vệ dữ liệu.

**Bước 5 - Auto Deploy (Lên sóng):** AI BẮT BUỘC tự động kích hoạt lệnh Terminal `npx vercel --prod --yes` để đẩy App lên server. Chờ Vercel build xong thì dán link Production thông báo.

### 3. QUY TẮC BẢO TOÀN ĐIỂM SỐ (XỬ LÝ ĐÁP ÁN TỪ TRƯỜNG)
Cho dù người dùng yêu cầu **đính chính đáp án cũ** hay **nhập lô câu hỏi mới đã có sẵn đáp án**, miễn là có sự can thiệp của "Đáp án từ trường", BẮT BUỘC tuân thủ chiến thuật "Thực dụng lấy điểm":
1. **Tuyệt đối tôn trọng đáp án của trường:** Lấy đáp án của trường làm đáp án chính (`✅ Đáp án:`) đưa vào DB. KHÔNG ĐƯỢC tự ý đổi đáp án chính dù AI phát hiện đáp án đó sai về mặt học thuật. (Đối với yêu cầu đính chính, phải dùng code tự động dò tìm vị trí câu hỏi trong JSON để ghi đè đáp án).
2. **Chạy ngầm Process AI Verification:** AI bắt buộc phải ngầm giải lại câu hỏi để:
   - Dựng hoặc cập nhật lại thẻ `<span class="answer-keyword">` (Double Exclusion) dựa trên đáp án (mới) của trường.
   - Viết hoặc cập nhật nội dung giải thích vào thẻ `<div class="note">💡 Giải thích: ...</div>`.
3. **Cơ chế Cảnh báo Bắt buộc:** Nếu AI phát hiện đáp án của trường bị SAI hoàn toàn về mặt kiến thức (so với giáo trình chuẩn), BẮT BUỘC chèn cảnh báo đỏ vào đầu phần Giải thích. *Ví dụ: "⚠️ Lưu ý: Về mặt học thuật, đáp án này sai vì [...], chuẩn phải là [...]. Tuy nhiên, hệ thống của trường đang chấm đáp án này đúng, bắt buộc chọn theo để lấy điểm."*

---
## 🌟 CÁC NGUYÊN TẮC ƯU TIÊN HÀNG ĐẦU (TỐI ƯU GHI NHỚ)
Mục tiêu số 1 của quy trình là **tối ưu khả năng ghi nhớ của người học**. Do đó, các nguyên tắc sau được đẩy lên mức độ ưu tiên cao nhất, áp dụng linh hoạt, chiến lược và logic:

1. **Bắt buộc có từ khóa nhận dạng:** Tất cả các câu hỏi đều phải có từ khóa nhận dạng phân biệt in đậm ở nội dung câu hỏi và đáp án.
2. **Ưu tiên Tính Nhận Dạng Khác Biệt trước Nội dung Trọng tâm:**
   - **Ở câu hỏi:** Từ khóa nhận dạng là từ khóa để không nhầm lẫn với các câu hỏi có nội dung tương tự (nhiều câu hỏi có nội dung giống đến hơn 90%).
   - **Ở đáp án:** Từ khóa nhận dạng là từ khóa giúp chỉ ra sự khác biệt của đáp án đó so với các đáp án sai còn lại (Double Exclusion) để đạt mức nhận diện tuyệt đối 100%.
3. **Giới hạn số lượng in đậm:** Hạn chế tối đa lỗi khiến in đậm toàn bộ câu hỏi hoặc toàn bộ nội dung đáp án. Mỗi câu chỉ in từ 1-5 từ khóa, mỗi từ khóa chỉ dài từ 1-3 từ mang ý nghĩa trọng tâm/nhận dạng.
4. **Tính linh hoạt:** Các nguyên tắc chi tiết (phía dưới) được giữ nguyên nhưng phải áp dụng một cách chiến lược, có logic, không cứng nhắc, nhằm phục vụ mục đích cuối cùng là hỗ trợ tối đa cho người học ghi nhớ phản xạ nhanh nhất.

---

## 1. Lớp 1: In đậm trên Câu hỏi (`<span class="keyword">`)

**Mục tiêu:** Giúp bạn đọc lướt qua cả một đoạn văn dài hoặc một bảng số liệu phức tạp và biết ngay đề bài đang muốn hỏi/tính cái gì, ĐẶC BIỆT LÀ phân biệt với các câu hỏi tương tự.

**Tiêu chuẩn áp dụng:**
1. **Chủ thể chính:** Chỉ in đậm cụm danh từ hoặc thuật ngữ là chủ thể chính.
2. **Từ khóa Phủ định/Khẳng định:** Bắt buộc in đậm `KHÔNG PHẢI`, `NGOẠI TRỪ`, `SAI`, `ĐÚNG NHẤT`.
3. **Bẫy Phủ Định Kép (Double Negatives):** In đậm CẢ HAI từ phủ định.
4. **Bẫy Tương Phản (Contrast Trap):** Nếu có 2 câu hỏi giống hệt nhau chỉ khác 1 chữ, BẮT BUỘC in đậm từ khóa tương phản.
5. **Bẫy Hướng Tương Tác / Nhân Quả (Directional Trap):** In đậm hướng tác động chính xác (VD: `X tác động lên Y` hay `Y lên X`) để tránh nhầm lẫn biến độc lập và phụ thuộc.
6. **Bẫy Không Gian / Vector (Spatial Trap):** Nếu đề tham chiếu vị trí bảng biểu, bắt buộc in đậm định hướng không gian (VD: `DÒNG` vs `CỘT`).
7. **Bẫy Hệ Quy Chiếu (Framework Trap):** In đậm tiêu chuẩn/luật áp dụng (VD: Theo `VAS` vs `IFRS`).
8. **Bẫy Cực Trị Toán Học (Extremes):** In đậm `TỐI ĐA`, `TỐI THIỂU`, `LỚN NHẤT`, `NHỎ NHẤT`.
9. **Bẫy Giả Định Bắt Buộc (Assumptions):** In đậm điều kiện tiên quyết (VD: `yếu tố khác không đổi`, `phân phối chuẩn`).
10. **Nguyên nhân - Kết quả:** In đậm [Nguyên nhân + Xu hướng (tăng/giảm)].
11. **Câu hỏi Điều kiện (Nếu... Thì...):** In đậm các **Từ khóa Điều kiện (Modifiers)** (VD: `thay thế` vs `bổ sung`).
12. **Câu hỏi Tình huống (Case Study):** Bỏ qua bối cảnh. Chỉ in đậm **Dữ liệu thực sự dùng để tính toán**, tuyệt đối KHÔNG in đậm dữ liệu nhiễu (Red Herring).
13. **Bẫy Mốc Thời Gian (Time-shift):** Bắt buộc in đậm **Mốc thời gian gốc và Mốc so sánh** (VD: `2022` so với `2021`).
14. **Bẫy Đơn vị đo lường (Unit Trap):** Bắt buộc in đậm **Đơn vị được yêu cầu** (VD: `tỷ VNĐ`, `%`, `USD`).
15. **Câu hỏi Điền khuyết:** In đậm cụm từ đứng ngay trước/sau dấu `___`.
16. **Câu hỏi Dây chuyền (Cascading):** In đậm **Neo tham chiếu** (VD: `Từ kết quả câu 12...`).
17. **Bẫy Đọc Hình Ảnh/Biểu Đồ (Graph Trap):** In đậm **Tên Trục (Axis)** hoặc **Chú giải (Legend)**.

---

## 2. Lớp 2: In đậm trên Đáp án (`<span class="answer-keyword">`)

**Mục tiêu:** Giúp bạn loại trừ ngay lập tức các "đáp án bẫy" trong ma trận A, B, C, D mà không cần đọc hết câu. Ưu tiên hàng đầu là sự khác biệt (Double Exclusion).

**Tiêu chuẩn áp dụng:**
1. **Nguyên tắc In đậm loại trừ (Double Exclusion):** 
   - **Yêu cầu đối chiếu toàn diện:** BẮT BUỘC phải soi kỹ cả 4 đáp án (A, B, C, D) trước khi quyết định in đậm. Nếu 2 đáp án quá giống nhau (ví dụ đều có chữ "Nợ"), phải in đậm thêm phần đuôi khác biệt để triệt hạ hoàn toàn đáp án sai.
   - **In đậm "Mỏ neo" (Anchor):** 2-3 từ đầu tiên để phân biệt với đáp án khác hẳn.
   - **In đậm "Điểm phân biệt" (Differentiator):** Các từ quyết định đúng/sai (không, có, tất cả, con số, hướng) để tách biệt với đáp án "gần đúng".
2. **Câu trả lời định nghĩa:** Bốc ra 1-2 "từ khóa tử huyệt". VD: Trung vị -> **`tách nửa`**.
3. **Dấu hiệu "Dị" (Quirks/Typos):** In đậm các từ sai chính tả hoặc từ lạ khớp 100% với slide bài giảng.
4. **Bẫy Tính Từ/Phó Từ Mức Độ (Degree Adverbs):** In đậm các phó từ chỉ mức độ cường độ, tốc độ (VD: lạm phát tăng `từ từ` vs `đột ngột`).
5. **Bẫy Ngưỡng Ngoại Lệ (Violation Thresholds):** In đậm chính xác **Ngưỡng Toán Học/Lý Thuyết** (VD: `P < AVC`).
6. **Bẫy Ký Hiệu Toán Học (Notation Trap):** BẮT BUỘC in đậm riêng Ký hiệu đó (VD: `s` vs `σ`).
7. **Câu trả lời liệt kê:** In đậm mốc quan trọng nhất. VD: **`(1) không thích`**, **`(4) rất thích`**.
8. **Câu trả lời con số:** In đậm toàn bộ con số và **Đơn vị** nếu có bẫy.
9. **Bẫy Làm Tròn Toán Học (Approximation Trap):** In đậm **Quy tắc làm tròn**.
10. **Bẫy Khoảng Giới Hạn (Interval Trap):** In đậm **Ký hiệu Bao hàm/Không bao hàm** (VD: `[` , `)`).
11. **Câu hỏi Công thức:** Chỉ in đậm "điểm mù" dễ nhầm lẫn (VD: **`n-1`**).
12. **Bẫy "Không có đáp án nào đúng":** Phải in đậm **Kết quả thực sự đúng** ở phần Giải thích.
13. **Câu hỏi Tổ hợp ("Cả A và B đều đúng"):** In đậm nội dung cốt lõi của phương án đúng vào Giải thích.
14. **Bẫy Đồng Nghĩa (Synonyms Trap):** In đậm thuật ngữ đồng nghĩa trong phần giải thích.
15. **Câu hỏi Nhiều đặc điểm (Mệnh đề 1,2,3,4):** In đậm **Mệnh đề SAI** trong Giải thích để loại trừ nhanh.
16. **Câu hỏi Mệnh đề Kép (I đúng, II sai):** In đậm chữ chốt của mệnh đề vào Giải thích.
17. **Câu hỏi Ghép nối (Matching):** Chỉ in đậm **Cặp neo (Anchor pair)** dễ nhớ nhất.
18. **Câu hỏi Sắp xếp trình tự:** In đậm **Bước Đầu** và **Bước Cuối**.
19. **Câu hỏi Điền khuyết:** In đậm các cụm từ điền khuyết theo thứ tự.
20. **Bẫy Từ ngữ Tuyệt đối/Tương đối (Qualifiers):** In đậm các từ **Tuyệt đối** (`luôn luôn`, `tất cả`) hoặc **Tương đối** (`có thể`, `phần lớn`).
21. **Cấu trúc JSON Đáp án & Giải thích:** Đáp án chính phải được chèn dưới dạng chuỗi văn bản (inline) ngay sau thẻ `<div class="answer-title">✅ Đáp án:</div>`. Hệ thống JavaScript (`app.js`) đã được nâng cấp để tự động bọc chuỗi văn bản này vào một thẻ Flexbox `<div class="answer-text">` nhằm dàn trang đồng đều. Do đó, Agent TUYỆT ĐỐI KHÔNG được tự ý bọc thêm thẻ block (`<div>`, `<p>`) vào nội dung đáp án chính để tránh việc dư thừa thẻ và phá vỡ cấu trúc DOM. Mọi nội dung giải thích, mở rộng (nếu có) BẮT BUỘC phải được bọc gọn trong thẻ `<div class="note">💡 Giải thích: ...</div>` để tránh việc thuật toán Thi thử bốc nhầm làm đáp án nhiễu.

---

## 3. HỆ THỐNG TRỰC QUAN HÓA KIẾN THỨC NỀN (UI COMPONENTS)
Hệ thống cung cấp **19 dạng Component** để số hóa lý thuyết. Khi phân tích văn bản, việc lựa chọn Component phải tuân thủ nghiêm ngặt các quy tắc sau:

### 3.1 CƠ CHẾ CHẤM ĐIỂM TƯƠNG THÍCH (MATCHING SCORING)
Khi hệ thống phân tích một khối văn bản thô, nó sẽ quét qua một "bộ lọc đặc trưng" để chấm điểm (Thang 100đ) độ match với 19 Component. Component nào điểm cao nhất sẽ được chọn.
1. **Bóc tách Đặc trưng (Feature Extraction):** Rà soát các từ khóa và cấu trúc logic.
   - *Cấu trúc Đối lập (khác với, ngược lại, ưu/nhược điểm):* Kích hoạt nhóm So sánh.
   - *Cấu trúc Tuần tự (bước 1, sau đó, năm, giai đoạn):* Kích hoạt nhóm Quy trình/Thời gian.
   - *Cấu trúc Phân rã (gồm có, chia làm, mức độ):* Kích hoạt nhóm Cấu trúc/Thứ bậc.
   - *Định lượng đối tượng:* Đếm số đối tượng (N=2, N=3, hay N>5) để loại suy.
2. **Chấm điểm (Scoring):** Cộng/trừ điểm dựa trên "Chữ ký Component". (VD: Thấy chữ "nhưng, trái lại" -> +điểm cho VS Wrap. Đếm thấy N=2 -> +điểm cho Venn/VS Wrap. Thấy không có từ khóa "điểm chung" -> -điểm cho Venn).
3. **Chốt hạ (Tie-Breaking):** Nếu 2 Component bằng điểm nhau, hệ thống tự động áp dụng 3 quy tắc chốt hạ (Đặc thù > Chiều Ngang > Ít Chữ) để quyết định cuối cùng.

### 3.2 LOGIC CÂN BẰNG HIỂN THỊ (BALANCING LOGIC)
1. **Quy tắc Thăng hạng (Tier Promotion):** Nếu nội dung có thể hiển thị bằng nhiều dạng, **BẮT BUỘC ưu tiên sử dụng Component có Tier cao hơn**. (VD: Dùng VS Wrap Tier 1 thay vì Features Card Tier 3).
2. **Quy tắc Tie-Breaker (Xử lý đụng độ cùng Tier):** 
   - *Luật Đặc thù (Specific > Generic):* Hình khối càng "dị" càng lạ (Venn, Matrix) luôn thắng các sơ đồ chung chung (Mindmap, Flowchart).
   - *Luật Chiều ngang (Horizontal > Vertical):* Sơ đồ trải ra chiều ngang (Phễu ngang, Carousel) thắng sơ đồ sổ dọc (Vertical Funnel, Timeline) để tiết kiệm thao tác cuộn trên mobile.
   - *Luật Ít chữ (Minimal Text):* Component nào ép người biên soạn phải chắt lọc chữ ngắn nhất thì được chọn. (Ví dụ: Dùng Bảng so sánh Table sẽ ép gõ ngắn hơn một list thẻ liệt kê).
3. **Quy tắc Tránh lặp (Anti-Repetition):** Không xài cùng 1 Component quá 3 lần liên tiếp trong một section/chương.
4. **Quy tắc Phối hợp Nhịp điệu (Rhythm Rule):** Đan xen giữa các khối tĩnh (Mindmap, Flowchart) với các khối tương tác vật lý (Flip Card, Hotspot) để "đánh thức" sự chú ý của não bộ.

### 3.3 PHÂN CẤP TIER CHO 19 COMPONENT
**🌟 TIER 1: TƯƠNG TÁC CAO & KHẮC SÂU ĐIỂM MÙ (Ưu tiên Cao nhất)**
Dùng cho các kiến thức "tử huyệt", cực kỳ dễ sai, dễ nhầm lẫn hoặc đòi hỏi sự chú ý cao độ.
1. **VS Wrap (Thẻ đối lập):** So sánh trực diện 2 khái niệm có tính đối xứng hoặc xung đột (VD: KT Tài chính vs KT Quản trị).
2. **Venn Diagram (Sơ đồ Venn):** Tìm ra điểm giao thoa và khác biệt cốt lõi giữa 2-3 đối tượng.
3. **Formula Breakdown (Bóc tách công thức):** Trực quan hóa công thức, trỏ dòng giải thích xuống từng biến số `x, y, z`.
4. **T-Account (Sổ chữ T - Đặc trị Kế toán):** Biểu diễn biến động tăng/giảm của một tài khoản cụ thể (Bên Nợ - Bên Có).
5. **Flip Card (Thẻ lật tương tác):** Ghi nhớ thuật ngữ bằng tương tác. Lật mặt trước (từ khóa) sang mặt sau (định nghĩa).
6. **Hotspot Image (Điểm chạm không gian):** Chú thích trên hình ảnh thực tế (biểu đồ, hóa đơn). Đưa chuột vào dấu chấm đỏ để hiện tooltips.

**📊 TIER 2: CẤU TRÚC LÔ-GIC & QUY TRÌNH (Ưu tiên Trung bình)**
Dùng để phân rã khối văn bản học thuật tiêu chuẩn thành sơ đồ, bảng biểu dễ quét mắt (scannable).
7. **Comparison Table (Bảng Highlight đa chiều):** So sánh chi tiết nhiều đối tượng (từ 3 trở lên) qua nhiều tiêu chí.
8. **Quadrant Matrix (Ma trận 2x2):** Phân loại chéo dữ liệu/chiến lược qua 2 trục tiêu chí vuông góc.
9. **Cycle Grid (Chu trình lặp 2x2):** Quá trình tuần hoàn khép kín (VD: Chu trình sản xuất).
10. **Funnel (Phễu ngang/dọc):** Quá trình chắt lọc rơi rụng Đầu vào -> Đầu ra.
11. **Flowchart (Lưu đồ rẽ nhánh):** Quy trình có điều kiện Logic (IF - THEN).
12. **Mindmap (Sơ đồ tư duy):** Phân rã hệ thống kiến thức mẹ thành các nhánh con.
13. **Onion / Concentric Diagram (Sơ đồ đồng tâm):** Thể hiện các lớp môi trường bao bọc nhau từ lõi ra ngoài.
14. **Spectrum / Scale (Thước đo cường độ):** Sự tịnh tiến thuộc tính trên thang đo ngang (VD: Thang đo rủi ro).

**🧱 TIER 3: LIỆT KÊ & NHÓM THÔNG TIN (Ưu tiên Thấp)**
Dùng thay thế các gạch đầu dòng khô khan, chia nhỏ khối văn bản dài.
15. **Features Card (Lưới đặc điểm):** Liệt kê các tính chất, nguyên tắc song song không phân biệt thứ bậc.
16. **Timeline (Dòng thời gian):** Sự kiện lịch sử, cột mốc tuyến tính.
17. **Pyramid (Kim tự tháp):** Phân tầng thứ bậc theo độ lớn hoặc quyền lực (đáy rộng, đỉnh hẹp).
18. **Horizontal Snap Carousel (Băng chuyền ngang):** Danh sách quá nhiều hạng mục (7+) cần cuộn ngang để tối ưu độ dài trang.
19. **Vertical Funnel (Phễu lọc dọc):** Các bước phân tích đi sâu dần, lọc xuống dưới.

---

## 4. TIÊU CHUẨN LÀM SẠCH DỮ LIỆU ĐẦU VÀO (DATA CLEANING)
Để hệ thống chấm điểm và lọc trùng hoạt động chính xác tuyệt đối, mọi text đầu vào (câu hỏi/đáp án) trước khi đóng gói thành JSON phải đi qua bộ lọc "vô trùng":
1. **Khử thẻ HTML rác:** Chỉ giữ lại các thẻ được phép (`<br>` để xuống dòng, `<span>` để highlight). Xóa sạch toàn bộ các thẻ `<p>`, `<div>`, `<b>`, `<i>`, `<font>` rác sinh ra do quá trình người dùng copy-paste từ Word, PDF hay Website của trường.
2. **Khử rác từ hệ thống thi (LMS Artifacts):** BẮT BUỘC phải dùng Regex lọc bỏ hoàn toàn các chuỗi văn bản rác sinh ra khi copy từ hệ thống trắc nghiệm của trường (Ví dụ: "1 điểm", "Gắn cờ") nằm trơ trọi giữa các dòng, để đảm bảo cơ sở dữ liệu được sạch sẽ.
3. **Chuẩn hóa khoảng trắng & Ký tự ẩn:** Biến các khoảng trắng kép (double spaces), phím Tab `\t`, hay khoảng trắng vô hình (`&nbsp;`) thành một dấu cách (space) duy nhất. Cắt bỏ khoảng trắng thừa ở hai đầu (Trim).
3. **Chuẩn hóa Unicode Dựng sẵn (NFC):** Đưa toàn bộ font chữ Tiếng Việt về chuẩn NFC. Ép đồng nhất quy tắc bỏ dấu (Ví dụ: Bắt buộc dùng `òa` thay vì `oà`, `ủy` thay vì `uỷ`, `ỏe` thay vì `oẻ`) để bộ máy tìm kiếm chuỗi (String Matching) không bị mù.
4. **Chuẩn hóa form 4 đáp án:** Đảm bảo cụm lựa chọn (A. B. C. D.) luôn được đặt ở cuối câu hỏi. Giải quyết triệt để lỗi nhảy dòng (Ví dụ: A và B dính liền một dòng, C rớt dòng) để Flexbox CSS có thể dóng hàng dọc thẳng tắp.
5. **Tách bạch nội dung Giải thích đáp án:** Nếu đáp án đúng có kèm theo phần giải thích (ví dụ: giải thích trong ngoặc đơn, hoặc đi sau các từ "Vì...", "Do...", "Giải thích:"), BẮT BUỘC phải dùng thẻ `<br>` để ép phần giải thích xuống một dòng mới độc lập. Việc này giúp người học không bị rối mắt giữa "đáp án lõi" và "lý do", đồng thời giúp bộ máy chấm điểm thi thử tránh bị nhiễu text.
6. **Cân bằng Thẻ HTML Tuyệt đối:** Javascript render nội dung dựa trên `innerHTML`. Do đó, khi chỉnh sửa hoặc đóng gói dữ liệu vào JSON (đặc biệt ở trường `question` và `answer`), BẮT BUỘC phải đảm bảo số lượng thẻ mở `<div...>` bằng chính xác số lượng thẻ đóng `</div>`. Bất kỳ một thẻ `</div>` thừa hoặc thiếu nào cũng sẽ làm vỡ toàn bộ cấu trúc DOM của trang, khiến các câu hỏi phía sau bị hút vào bên trong (Nested DOM) làm sập giao diện hiển thị kiểu "búp bê Nga lồng nhau".
---

## 5. CƠ CHẾ CHẤM ĐIỂM & CHẾ ĐỘ THI THỬ (QUIZ MECHANISM)
Hệ thống cung cấp 2 chế độ thi thử thông minh để tối ưu thời gian ôn tập, kích hoạt thông qua Modal Popup khi bấm nút "Thi thử":

### 5.1 Hai Chế Độ Luyện Thi:
1. **Luyện Tối Ưu (80/20):**
   - Rút độc quyền các câu hỏi có độ quan trọng cao (gắn tag `["80/20"]`, `["Trọng tâm"]` hoặc có thuộc tính `weight="high"` trong JSON).
   - *Mục đích:* Dành cho giai đoạn ôn thi nước rút, bắt buộc ăn điểm những câu chắc chắn ra thi. Nếu kho dữ liệu trọng tâm không đủ số lượng 1 đề (ví dụ 40 câu), hệ thống mới tự động bốc ngẫu nhiên thêm các câu thường vào để bù đắp.
2. **Luyện Cấu Trúc Đề:**
   - Rút các câu hỏi dựa theo Khung Cấu Trúc chuẩn của từng môn học (được khai báo qua biến `window.subjectConfig` trong file HTML).
   - Ví dụ: Bốc chính xác 10 câu Chương 1, 15 câu Chương 2, 15 câu Bài tập. Nếu môn nào chưa setup config, hệ thống sẽ fallback về trạng thái bốc ngẫu nhiên toàn bộ data.
   - *Mục đích:* Dành cho lúc kiểm tra năng lực cuối kỳ sát với đề thi thật.

### 5.2 Thuật toán Dò tìm Kép (Hybrid Matching) khi Chấm điểm:
Để triệt tiêu lỗi "chấm đúng sót chữ cũng bị coi là sai", tính năng Thi thử vận hành dựa trên thuật toán:
1. **Lớp 1 - Khớp Tuyệt đối (Exact String Match):**
   - Lột sạch mọi thẻ HTML, bỏ dấu câu, đưa về chữ thường (lowercase). Nếu chuỗi text lựa chọn khớp 100% với chuỗi đáp án gốc -> ghi nhận ĐÚNG ngay.
2. **Lớp 2 - Khớp Chuỗi Trình tự (Sequence Regex Fallback):**
   - Kích hoạt khi Lớp 1 thất bại. Dựng Regex ép các từ khóa của đáp án gốc **phải xuất hiện theo đúng thứ tự**. Chỉ cần thỏa mãn chuỗi trình tự này (mặc kệ ở giữa chèn thêm "30.000.000đ" hay ký tự lạ), hệ thống vẫn tự động nội suy và chấm ĐÚNG 100%.

### 5.3 Cơ chế Ẩn/Hiện Từ khóa Bẫy (Highlight Toggling):
- Đang làm bài: Toàn bộ thẻ `<span class="answer-keyword">` (in đậm, tô màu cam) bị ẩn thuộc tính CSS để chống gian lận màu sắc.
- Nộp bài xong: Bung CSS kích hoạt lại màu sắc Highlight của đáp án đúng. Vừa báo điểm, vừa nhắc mẹo loại trừ bẫy (Double Exclusion).

---

## 6. CẤU TRÚC KIẾN TRÚC HỆ THỐNG (SYSTEM ARCHITECTURE)
Dự án được phân tầng (decoupled) triệt để nhằm tối ưu tốc độ tải trang, dễ bảo trì và phân tách rõ ràng giữa Dữ liệu và Giao diện:

1. **Tầng Giao diện (UI Layer - `.html`):**
   - Đóng vai trò là bộ khung xương (Skeleton) chứa HTML và các component UI tĩnh.
   - Tuyệt đối không chứa Data cứng (Câu hỏi/Đáp án).
   - Gọi các file xử lý tĩnh qua `<script src="assets/app.js"></script>` và `<link rel="stylesheet" href="assets/style.css">`.
2. **Tầng Dữ liệu (Data Layer - `_qs.json`):**
   - File JSON lưu trữ mảng các Object chứa câu hỏi và đáp án đã được làm sạch, bọc thẻ highlight sẵn.
   - Được fetch động bằng JavaScript khi người dùng mở trang.
3. **Tầng Logic xử lý (Logic Layer - `app.js`):**
   - Chứa thuật toán tìm kiếm Real-time.
   - Chứa thuật toán chấm điểm thi thử Hybrid Matching (Khớp tuyệt đối + Sequence Regex).
   - Xử lý mảng JSON, parse nội dung và render động (DOM Manipulation) lên file HTML.
4. **Tầng Hiển thị & Hoạt ảnh (Style Layer - `style.css`):**
   - Chứa hệ thống Design System (biến màu sắc, spacing).
   - Xử lý Responsive, Dark Mode, các luật Flexbox cứng và hiệu ứng Animation (ví dụ Flip Card).

---

## 7. QUY CHUẨN THIẾT KẾ UI & HTML (UI/UX & FLEXBOX STANDARDS)
Mọi can thiệp vào file HTML (đặc biệt khi tạo 19 Component trực quan hóa) phải tuân thủ nghiêm ngặt các nguyên tắc CSS/HTML sau để tránh vỡ layout:

1. **Tuyệt đối KHÔNG DÙNG "margin âm" (`margin: -Xpx`):**
   - Việc dùng margin âm để bóp khoảng cách giữa Icon và chữ bên trong Card là điều CẤM KỴ, nó sẽ phá vỡ flow của layout và gây lỗi đè text trên Mobile.
2. **Sử dụng Flexbox cho mọi Card/Container:**
   - Luôn luôn set thẻ cha thành: `display: flex; flex-direction: column; align-items: center; justify-content: center; gap: [X]px;`.
   - Thuộc tính `gap` là công cụ duy nhất được phép dùng để tạo khoảng cách giữa Icon, Tiêu đề và Mô tả.
3. **Khử đệm tàng hình (Invisible Padding) của Emoji/Icon:**
   - Đối với Icon (đặc biệt là Emoji), bắt buộc phải loại bỏ không gian rỗng mặc định của trình duyệt bằng CSS: 
     `line-height: normal; margin: 0; display: flex; align-items: center; justify-content: center;`.
4. **Chuẩn hóa Tiêu đề và Mô tả trong Card:**
   - Luôn set `margin: 0; line-height: 1.3;` cho các thẻ `<h>`, `<p>` bên trong Card.
   - Điều này kết hợp với `gap` của thẻ cha sẽ đảm bảo toàn bộ khối nội dung tự động ôm vào nhau chuẩn xác, được căn thẳng đứng tuyệt đối giữa Card mà không bị lệch do đặc thù chiều cao của font chữ hay Emoji.
5. **Định dạng layout Đáp án (Chế độ Ngân hàng đề & Thi thử):**
   - Các phương án (A, B, C, D) tuyệt đối không được xả raw text trôi nổi cùng thẻ `<br>`.
   - Để đảm bảo dóng hàng dọc hoàn hảo (Vertical Alignment), phải parse các đáp án này vào một thẻ Container có thuộc tính Flexbox: `display: flex; flex-direction: column; align-items: flex-start; gap: [X]px;`.
   - Mỗi phương án A, B, C, D phải nằm trong một thẻ con riêng biệt (ví dụ `div` hoặc `label`) để kiểm soát trọn vẹn khoảng cách, vùng bấm (hitbox) trên mobile và tránh lỗi text tràn dòng đè lên chữ cái đầu.
6. **Đồng bộ biến màu CSS (Design Tokens):**
   - Tuyệt đối KHÔNG hardcode mã màu HEX/RGB (ví dụ `#f39c12`, `#ffffff`) trực tiếp vào thuộc tính `style="..."` hoặc CSS trừ khi tạo các Component trực quan đặc thù cần màu riêng.
   - Luôn ưu tiên kế thừa các biến CSS hệ thống đã định nghĩa (ví dụ `var(--primary)`, `var(--border)`, `var(--muted)`, `var(--text)`) để đảm bảo tính đồng nhất về nhận diện thương hiệu, dễ bảo trì và không làm vỡ các tính năng chuyển đổi giao diện (Dark Mode/Light Mode).
7. **Tối ưu hiển thị đa màn hình (Mobile-First & Responsive UI):**
   - **Tư duy Mobile-First:** Ở bước xây dựng UI, bắt buộc phải tính toán và ưu tiên trải nghiệm trên màn hình Mobile trước (không gian hẹp, thao tác chạm). Sau đó mới xây dựng cơ chế co giãn (scale-up) hợp lý khi hiển thị trên các thiết bị có không gian rộng hơn như Tablet hoặc PC.
   - **Chống tràn và lẹm nội dung:** Mọi chức năng, dải nút bấm (như thanh tab), hay hộp thoại phải có cơ chế co giãn linh hoạt. Sử dụng triệt để thuộc tính `flex-wrap: wrap;` trên thẻ Container (kết hợp với `gap`) để khi không gian bề ngang bị thu hẹp, các phần tử con tự động rớt dòng có trật tự thay vì bị lẹm viền hoặc xén mất chữ.
   - **Tối ưu không gian:** Ở màn hình lớn (PC/Tablet), tận dụng tối đa `max-width`, hệ thống lưới (Grid/Flex) để nội dung không bị bè ngang quá đà gây khó đọc, đồng thời tối ưu khoảng trống (white-space) cho sang trọng.

---

## 8. QUY TẮC PHÁT TRIỂN TÍNH NĂNG (FEATURES)
Để đảm bảo UI/UX và logic của App không bị vỡ khi nâng cấp tính năng mới, AI **BẮT BUỘC** tuân thủ luồng Git Branching 4 bước sau:
1. **Branching (Tách nhánh):** Tuyệt đối KHÔNG viết code trực tiếp lên nhánh `main`. Mọi yêu cầu thêm/sửa giao diện, logic JS, hoặc CSS phải được thực hiện trên một nhánh riêng biệt, tạo bằng lệnh `git checkout -b feature/[tên-tính-năng]`.
2. **Coding & Sandboxing:** Quá trình chỉnh sửa file diễn ra hoàn toàn trên nhánh feature này. Đảm bảo nhánh `main` luôn trong trạng thái nguyên vẹn.
3. **Local Review (Nghiệm thu):** Sau khi hoàn thiện, AI phải dừng lại để User tự mở file trên máy tính kiểm tra. KHÔNG ĐƯỢC tự ý gộp nhánh (merge) khi chưa có sự đồng ý của User.
4. **Merge & Deploy:** Chỉ khi User xác nhận "Duyệt/OK", AI mới được chạy lệnh `git checkout main` và `git merge feature/[tên-tính-năng]`. Gộp xong bắt buộc chạy lệnh `npx vercel --prod --yes` để cập nhật lên web. Nếu lỗi nặng không cứu được thì hủy nhánh bằng lệnh `git branch -D feature/[tên-tính-năng]`.
