# SOURCE OF TRUTH (BỘ LUẬT TỐI THƯỢNG)

File này là Chân lý gốc (Single Source of Truth) định hình toàn bộ tư duy, kiến trúc và luồng xử lý của hệ thống Ngân hàng Đề thi Trắc nghiệm TVU. Bất kỳ Agent nào tham gia vào dự án đều **BẮT BUỘC** tuân thủ tuyệt đối các quy định dưới đây.

---

## TẦNG 1: THE WHY (Chân lý gốc & Domain)

**1. Mục Tiêu Tối Thượng (User Problem):**
Hệ thống được sinh ra để giải quyết một nỗi đau duy nhất: Giúp sinh viên ôn thi trắc nghiệm với tốc độ **cực nhanh, chống xao nhãng và nhận diện bẫy dễ dàng**. Mọi tính năng, giao diện hay logic code nếu không phục vụ trực tiếp cho mục tiêu này đều được coi là "Rác" (Waste) và phải bị loại bỏ.

**2. Giá Trị Cốt Lõi (Core Value):**
- **Tôn trọng Bản gốc:** Tuyệt đối không được tóm tắt, viết tắt hay tự ý thay đổi bất kỳ từ ngữ nào trong đề và đáp án của trường. Sự xa lạ về mặt câu chữ sẽ giết chết trí nhớ của sinh viên trong phòng thi.
- **Double Exclusion (Loại trừ kép) - Ma trận Lục Hợp:** Thay vì bắt học sinh nhớ cả câu dài, hệ thống chỉ Highlight (in đậm + đổi màu) các "Từ khóa cốt lõi" tạo nên điểm khác biệt giữa đáp án đúng và đáp án sai. Bắt buộc tuân thủ 6 tiêu chuẩn sau:
  1. Độc bản (Danh từ cốt lõi của câu hỏi)
  2. Ngữ cảnh (Phạm vi/Mốc thời gian của câu hỏi)
  3. Lật kèo (Điều kiện phủ định/ngoại trừ)
  4. Đối chiếu chéo (Từ khóa đáp án ĐÚNG tuyệt đối không được xuất hiện trong 3 đáp án SAI)
  5. Mỏ neo (Từ khóa đáp án phải nối logic 1-1 với từ khóa câu hỏi)
  6. Cô đọng (Tối đa 1-3 chữ/cụm, giới hạn 1-2 cụm/câu).

---

## TẦNG 2: GOVERNANCE & SECURITY (Bảo mật & Quản trị Rủi ro)

Đây là lớp khiên bảo vệ hệ thống khỏi sự "nhiệt tình thái quá" hoặc ảo giác (hallucination) của AI.

**1. Bảo vệ Chân Lý (SSoT Immunity - Thiết Quân Luật):**
- **TUYỆT ĐỐI CẤM** mọi Agent tự ý dùng công cụ sửa file (write_file/replace_file_content) để thay đổi nội dung của `Source_of_Truth.md` và `.agents/AGENTS.md`.
- Bất cứ khi nào nhận lệnh cập nhật luật, Agent phải lên kế hoạch (Implementation Plan), giải trình rõ ràng sự thay đổi. Chỉ khi User nói "Duyệt" mới được phép ghi đè.

**2. An toàn Thực thi (Sandbox & Permission):**
- Hệ thống macOS/IDE sẽ spam hỏi quyền liên tục nếu AI dùng script bash rườm rà.
- Để chặn đứng điều này: Mọi tác vụ ghi/cập nhật dữ liệu vào JSON **BẮT BUỘC** phải được viết gọn vào file `scratch/process_oneshot.py` (ghi đè file này vô tư) và chạy lệnh `python3 scratch/process_oneshot.py` trong Sandbox an toàn (`BypassSandbox = false`).
- NGHIÊM CẤM dùng các lệnh Bash chắp vá như `cat >>` hay `sed` để sửa file JSON.

**3. Giới hạn Vùng nổ (Blast Radius - Kiến trúc 3 Lớp):**
- Lớp 1 (Raw): Mọi text thô từ User phải được lưu thành file `YYYY-MM-DD_mon-hoc_batchX.txt` tại `raw_inputs/`.
- Lớp 2 (Staging): File Database thật `_qs.json` phải được COPY sang `staging/temp_qs.json`. AI chỉ được phép nhào nặn, cắt gọt, tẩy trùng trên file Staging này.
- Lớp 3 (Main): Chỉ khi JSON trong Staging parse thành công không lỗi, hệ thống mới được phép ghi đè lên file gốc, ghi log vào `PROJECT_LOG.md` và tự động `git commit`.

---

## TẦNG 3: ARCHITECTURE & PROCESS (Quy trình & Tổ chức)

**1. Lean Workflow (Quy Trình Xử Lý 1 Chạm Khép Kín):**
Khi nhận 1 lô dữ liệu thô, AI BẮT BUỘC chạy ngầm luồng 6 bước cực êm, KHÔNG ĐƯỢC lề mề xin phép giữa chừng:
- **Bước 0:** Lưu vết vào `raw_inputs/`.
- **Bước 1:** Copy sang `staging/temp_qs.json`. Lọc trùng (Dọn sạch HTML, khoảng trắng, dấu câu thừa ở 2 đầu). Câu mới 100% thì qua Bước 2. Trùng đề Khác đáp án thì gộp đáp án. Trùng 100% thì vứt.
- **Bước 2:** Tiệt trùng (NFC, xóa chữ rác). Gắn highlight lớp 1, 2. Bốc đủ 4 lựa chọn vào `<div class="options-grid">`. Tách đáp án đúng và phần giải thích `<div class="note">`.
- **Bước 3:** Cập nhật JSON (Safe Write bằng `scratch/process_oneshot.py`). Dán Tag chuẩn xác (CẤM bịa Tag mới).
- **Bước 4:** Kiểm tra JSON hợp lệ. Ghi đè file gốc. Ghi Log vào `PROJECT_LOG.md`. Chạy lệnh `git add .` & `git commit`.
- **Bước 5:** Tự động trigger Vercel Deploy thông qua lệnh `git push` ở Bước 4. Chờ vài giây rồi báo cáo User hoàn tất.

**2. Build-Measure-Learn (Quy Tắc Phát Triển Tính Năng):**
Để bảo vệ UI/UX và Logic không bị vỡ:
- Tuyệt đối KHÔNG viết code (`.html`, `.js`, `.css`) trực tiếp lên nhánh `main`.
- BẮT BUỘC tạo nhánh riêng (`git checkout -b feature/[tên-tính-năng]`).
- Code và Sandboxing toàn bộ trên nhánh này.
- Dừng lại để User "Nghiệm thu Local". Khi User chốt "Duyệt" thì tiến hành `git checkout main`, `git merge feature/[tên-tính-năng]` và Deploy Vercel.

---

## TẦNG 4: DERIVED SoT LAYERS (Kỹ Thuật Thực Thi)

**1. Lớp Data (JSON Architecture):**
- Giao diện nằm ở file HTML (ví dụ: `[TenMonHoc].html`), dữ liệu tách biệt nằm ở file JSON (ví dụ: `[TenMonHoc]_qs.json`). Cấm trộn lẫn.
- Trong JSON, `question` và `answer` là một khối chuỗi HTML liền mạch. Cấm đề xuất đổi cấu trúc này thành Array hay Object.
- Cấu trúc đáp án: Đáp án chính **bắt buộc** nằm ngang hàng (inline) ngay sau thẻ `<div class="answer-title">✅ Đáp án:</div>`. Giải thích nằm lọt thỏm trong `<div class="note">`. Nếu rớt chữ ra ngoài, thuật toán Thi thử sẽ lấy nhầm chữ đó làm đáp án nhiễu.

**2. Lớp UI/UX (CSS Flexbox Standards):**
- Tuyệt đối KHÔNG DÙNG "margin âm" (`margin: -Xpx`).
- Luôn set Container thành `display: flex; flex-direction: column; align-items: center; justify-content: center; gap: [X]px;`.
- Khử đệm tàng hình (Invisible Padding) của Emoji: `line-height: normal; margin: 0; display: flex; align-items: center; justify-content: center;`.
- Chuẩn hóa Text: Các thẻ `<h>`, `<p>` trong Card luôn có `margin: 0; line-height: 1.3;`.
- Tư duy Mobile-First: Các UI mới phải bo trọn trên màn hình Mobile (dùng `flex-wrap: wrap;`), không để lẹm chữ. Tablet/PC dùng max-width. Tái sử dụng Design Tokens của hệ thống (ví dụ: `var(--primary)`), cấm Hardcode mã màu trừ khi rất đặc thù.

**3. Lớp Xây dựng Môn Mới:**
- Cấm tự chế file HTML từ đầu. BẮT BUỘC sao chép từ khuôn mẫu `.agents/HTML_TEMPLATE.html`.
