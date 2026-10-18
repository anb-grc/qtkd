# TÀI LIỆU KỸ THUẬT & KIẾN TRÚC HỆ THỐNG | TVU ONSCHOOL LMS
## ĐẶC TẢ QUY TRÌNH TỰ ĐỘNG HÓA VÒNG ĐỜI HỌC TẬP & KHAI THÁC DỮ LIỆU ĐỀ THI
### Hệ thống Tự động hoá Toàn diện (Playwright & API Engine) • Chống Ban Tuyệt đối (Human Mimicry) • Chuẩn hoá SSoT LearnIZ Pipeline

| Thông số | Giá trị chuẩn hóa |
| :--- | :--- |
| **Nền tảng mục tiêu** | Hệ thống LMS2 Đại học Trà Vinh (`https://lms2tvu.onschool.edu.vn`) |
| **Phiên bản kiến trúc** | Release v2.6 - Đồng bộ SSoT LearnIZ + Điều phối 3 Khung giờ + Thời lượng Ngẫu nhiên >= 1/4 |
| **Thư mục gốc hệ thống** | `/Users/thien-ban/Library/CloudStorage/OneDrive-Personal/03_WORK/11. LearnIZ/` |
| **Cơ chế vận hành** | Python 3.14 + Playwright Stealth + macOS LaunchAgent (Tri-Slot Daily Pulse) |
| **3 Khung giờ tương tác** | Sáng: 6:00 - 9:00 \| Trưa: 12:00 - 13:00 \| Tối: 19:00 - 21:00 (Phân bổ xoay vòng môn) |
| **Quy chuẩn thời lượng thi** | Rải ngẫu nhiên lẻ từng giây trong khoảng [1/4 tổng thời gian -> Tổng thời gian - buffer] |

---

## 1. TỔNG QUAN HỆ THỐNG VÀ BỐN TRỤ CỘT THIẾT KẾ CỐT LÕI

Hệ thống được thiết kế khép kín nhằm giải quyết bài toán học tập trực tuyến cho sinh viên Đại học Trà Vinh (hệ Từ xa - E-Learning). Toàn bộ kiến trúc vận hành trên 4 trụ cột cốt lõi đã được đồng bộ với Hiến pháp LearnIZ SSoT:

1. **Tối đa hóa Điểm Chuyên cần (100% Attendance & Engagement):** 
   - Tự động hoàn thành các bài trắc nghiệm tuần (LTTN 1, 2, 3, 4) đạt điểm an toàn (6.0 - 8.0 điểm) nhờ thuật toán đối chiếu kho đề đã cào trước, không đoán mò ngẫu nhiên.
   - Soạn thảo bản nháp câu hỏi thảo luận diễn đàn chuẩn 4 quy chuẩn văn phong sinh viên kèm Direct URL để User 1-click duyệt nộp.
2. **An toàn Tuyệt đối cho Tài khoản (Zero-Ban & Tri-Slot Human Mimicry):**
   - **Phân bổ 3 Khung giờ Linh hoạt (Không dồn toa):** Chia đều các môn học vào 3 buổi: Sáng (6h-9h), Trưa (12h-13h), Tối (19h-21h). Các môn được xoay vòng luân phiên hàng ngày, không bao giờ có môn nào bị cố định vào một khung giờ.
   - **Động cơ Thời lượng Làm bài Ngẫu nhiên (Randomized Duration Engine):** Thời gian làm bài linh hoạt, tuyệt đối không trùng lặp các mốc cố định. Cận dưới tối thiểu $\ge 1/4$ tổng thời gian làm bài, cận trên sát giờ nộp (trừ hao 1-2 phút). Ví dụ: bài 15 phút rải ngẫu nhiên từ 4 phút đến 14 phút 30s; bài 40 phút rải ngẫu nhiên từ 10 phút 30s đến 39 phút.
   - **Tương tác DOM Tiến trình (Heartbeat Telemetry):** Không sleep chết một chỗ mà rải đều hành vi: cuộn chuột nhẹ, rê chuột ngẫu nhiên và tick chọn câu hỏi rải rác trong suốt thời lượng làm bài để duy trì ping tự nhiên của Moodle LMS.
   - **Tuyệt đối không can thiệp làm bài thi Giữa kỳ**.
3. **Khai thác Toàn bộ Ngân hàng Đề thi & Bóc tách Công thức 100%:**
   - Tận dụng cơ chế sinh đề ngẫu nhiên từ bài "Luyện tập trước thi (40 câu)" và các bài review sau khi thi để vét trọn 200 - 300 câu/môn.
   - **Bộ bóc tách công thức 3 tầng (Cascading Formula Extractor):** Đọc xuyên qua ảnh MathType/WIRIS lấy text/LaTeX từ thuộc tính `alt`/`data-mathml`; đọc UTF-8 nguyên thủy qua API; tự động tải ảnh về `raw_inputs/images/` đối với ảnh chụp màn hình cắt từ Word.
4. **Tích hợp Liền mạch Dây chuyền LearnIZ SSoT (3 Lớp & Safe Write):**
   - Raw (`crawled_questions.json`) -> Staging (`temp_qs.json`) -> Production (`qs.json`).
   - Gọt sạch tiền tố `A.`, `B.`, `1.`, `2.` trong `options`.
   - Chuẩn hoá thẻ tags 2 thành phần: `["Tên Chủ Đề", "Tên Tầng Tư Duy"]`.
   - Gán `weight: "high"` theo `blueprint.json` 80/20, câu thường **bỏ trống trường weight** (cấm ghi `"normal"`).
   - Áp dụng **Atomic Write** (`/tmp` -> `os.replace`) để triệt tiêu lỗi khóa file của OneDrive.

---

## 2. KIẾN TRÚC ĐIỀU PHỐI 3 KHUNG GIỜ & THỜI LƯỢNG LÀM BÀI

### 2.1 Ma trận Phân bổ 3 Khung giờ Ngẫu nhiên (Tri-Slot Daily Distribution)

Để loại bỏ hoàn toàn dấu vết tự động hóa dồn cục vào sáng sớm, hệ thống chia một ngày thành 3 cửa sổ hoạt động:

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                             MỘT NGÀY HOẠT ĐỘNG (24H)                             │
├─────────────────────────┬───────────────────────────┬────────────────────────────┤
│  SLOT 1: BUỔI SÁNG      │  SLOT 2: BUỔI TRƯA        │  SLOT 3: BUỔI TỐI          │
│  06:00 - 09:00 (180p)   │  12:00 - 13:00 (60p)      │  19:00 - 21:00 (120p)      │
│  Delay: 0 - 120 phút    │  Delay: 0 - 40 phút       │  Delay: 0 - 90 phút        │
│  Môn phân bổ: Rổ Sáng   │  Môn phân bổ: Rổ Trưa     │  Môn phân bổ: Rổ Tối       │
└─────────────────────────┴───────────────────────────┴────────────────────────────┘
```

* **Thuật toán Xoay vòng Môn học (Dynamic Shuffling):**
  * Đầu mỗi ngày, script tạo mã băm dựa trên ngày hiện tại (`seed = hash(YYYY-MM-DD)`).
  * Xáo trộn danh sách $K$ môn học đang hoạt động và chia đều vào 3 rổ (Morning Bucket, Noon Bucket, Evening Bucket).
  * *Ví dụ:*
    * *Thứ Hai:* Môn A, B làm buổi Sáng; Môn C làm buổi Trưa; Môn D làm buổi Tối.
    * *Thứ Ba:* Môn D, C làm buổi Sáng; Môn A làm buổi Trưa; Môn B làm buổi Tối.
  * Khi LaunchAgent kích hoạt ở đầu mỗi khung giờ (6:00, 12:00, 19:00), script nhận diện slot hiện tại, tự động ngủ thêm một khoảng Jitter ngẫu nhiên trong khung giờ đó, rồi mới chạy các môn thuộc rổ tương ứng.

### 2.2 Động cơ Thời lượng Làm bài Ngẫu nhiên (Randomized Duration Engine)

Tuyệt đối cấm giữ một con số thời gian làm bài cố định (như 615s hay 10 phút tròn). Thời lượng làm bài $T_{target}$ cho từng attempt được tính toán động theo giây lẻ:

* **Công thức xác định ngưỡng an toàn:**
  $$T_{floor} = \max\left(\lceil T_{total} \times 0.25 \rceil, T_{lms\_min}\right)$$
  $$T_{ceiling} = T_{total} - \text{random}(45, 120)$$
  $$T_{target} = \text{random.randint}(T_{floor}, T_{ceiling})$$

* **Bảng Quy chuẩn Thời lượng theo Loại Đề:**
  | Loại Bài Kiểm Tra | Tổng Thời Gian ($T_{total}$) | Ngưỡng Tối Thiểu ($T_{floor}$) | Ngưỡng Tối Đa ($T_{ceiling}$) | Dải Thời Gian Nộp Ngẫu Nhiên |
  | :--- | :--- | :--- | :--- | :--- |
  | **LTTN Tuần 1 - 4** | 15 phút (900 giây) | 4 phút (240 giây) | ~14 phút 15 giây (855 giây) | **240s – 855s** (Ví dụ: 4m47s, 8m12s, 11m39s, 13m05s...) |
  | **Luyện tập 40 câu** | 40 phút (2400 giây) | 10 phút 30s (630 giây)* | ~38 phút 30s (2310 giây) | **630s – 2310s** (Ví dụ: 11m42s, 19m23s, 27m54s, 35m10s...) |

  *\*Lưu ý:* Đối với bài 40 phút, LMS TVU cài đặt bộ lọc toaster chặn nộp bài dưới 10 phút. Do đó ngưỡng sàn thực tế được chốt cứng ở 10 phút 30 giây (630s) để đảm bảo không bị từ chối nộp bài.

* **Tiến trình Tương tác Người thật trong suốt thời lượng (Progressive Interaction):**
  * Nếu bài có $N$ câu hỏi và thời lượng tính ra là $T_{target}$ giây:
  * Script chia đều $N$ câu hỏi rải rác từ giây thứ 10 đến giây $(T_{target} - 30)$.
  * Cứ mỗi nhịp khoảng 15 – 45 giây:
    1. Cuộn trang nhẹ lên/xuống mô phỏng việc đọc đề.
    2. Rê chuột ngẫu nhiên trên màn hình.
    3. Tick chọn câu trả lời tiếp theo.
  * Khi đồng hồ chạm mốc $T_{target}$ lẻ: Kích hoạt nút Nộp bài.

### 2.3 Nguyên tắc Đơn Nhiệm Tuyệt Đối & Khoảng Nghỉ Giữa 2 Môn (Strict Serial & Inter-Course Rest)

Hành vi sinh viên người thật **tuyệt đối không bao giờ mở 2 hay nhiều tab cùng lúc để làm bài hoặc trả lời thảo luận cho nhiều môn khác nhau**. Hệ thống thiết lập 3 chốt chặn chống tương tác đồng thời:

1. **Khóa Đơn Tiến Trình Hệ Thống (Process Mutex via `fcntl.flock`):**
   - Đảm bảo tại một thời điểm trên toàn hệ điều hành macOS chỉ có DUY NHẤT 1 tiến trình bot chạy.
   - Nếu có tiến trình thứ 2 được kích hoạt (do LaunchAgent hoặc User chạy thủ công), tiến trình mới sẽ lập tức phát hiện file khóa `scratch/sync_tvu_lms.lock` và tự động rút lui trong im lặng (Silent Exit), ngăn chặn 100% rủi ro chạy đè hoặc tương tác song song trên cùng tài khoản.
2. **Thực thi Tuần tự 100% (Single-Thread, Single-Tab Execution):**
   - Không dùng cơ chế đa luồng (multi-threading / async concurrent) đối với các môn học.
   - Hoàn thành dứt điểm 100% môn thứ nhất (đóng tab bài thi, cào review, ghi log) rồi mới chuyển sang môn thứ hai.
3. **Khoảng Nghỉ Giải Lao Tự Nhiên Giữa 2 Môn Học (Inter-Course Rest Gap):**
   - Sau khi hoàn thành xong môn A, bot không bao giờ lao vào môn B trong vòng vài tích tắc.
   - Bot tự động kích hoạt trạng thái **Nghỉ giải lao ngẫu nhiên từ 3 đến 12 phút** (`random.randint(180, 720)` giây).
   - Mô phỏng hành vi người thật: đóng tab, đi uống nước, giải lao, vươn vai rồi mới bắt đầu học môn tiếp theo.

### 2.4 Chốt Chặn Phòng Thủ Ngoại Cảnh: Mất Mạng & Hết Pin (Network & Power Fail-Safes)

1. **Phòng vệ Mất Mạng (Pre-flight Network Check):**
   - Trước khi gọi API hay mở Chromium, bot thực hiện kiểm tra mạng (DNS ping 8.8.8.8:53).
   - Nếu mất mạng: Bot ghi log `[!] Không có kết nối mạng Internet. Bỏ qua chu kỳ này.` rồi thoát an toàn (Exit 0). Tuyệt đối **không báo ảo session hết hạn**.
   - Nếu rớt mạng giữa lúc đang làm bài: Kích hoạt cơ chế **Retry 3 - 5 lần** (mỗi lần cách 15-30s) chờ mạng hồi phục để bấm Nộp bài.
2. **Phòng vệ Hết Pin / Sập Nguồn (Low Battery Guard):**
   - Sử dụng lệnh `pmset -g batt` đọc trực tiếp nguồn điện MacBook.
   - Nếu máy **đang dùng pin và dung lượng $\le 15\%$**: Tuyệt đối **CẤM mở bài thi mới**, ghi log hoãn làm bài để tránh sập nguồn làm hỏng kết quả thi giữa chừng.
3. **Miễn dịch Kẹt Khóa khi Tắt Máy Đột Ngột (Kernel Mutex Auto-Release):**
   - Khóa file `sync_tvu_lms.lock` được quản lý bởi `fcntl.flock` ở tầng kernel macOS.
   - Khi máy tính hết pin tắt ngúm hoặc sập nguồn đột ngột, toàn bộ PID trong RAM bị xóa sổ ➔ **Khóa tự động giải phóng 100%**, bật máy lại là chạy bình thường, không bao giờ bị Deadlock.

---

## 3. SƠ ĐỒ DÒNG CHẢY DỮ LIỆU ĐỒNG BỘ 8 GIAI ĐOẠN

```
[GIAI ĐOẠN 0: Quét TVU API /api/courses]
                    │
                    ▼
[GIAI ĐOẠN 1: Tạo giàn giáo thư môn + Khởi tạo qs.json: [] & kb.json: {overview:{}, details:[]} + Update config.js]
                    │
                    ▼
[GIAI ĐOẠN 2: Tải Slide/Học liệu -> SLIDE/ & raw_inputs/De_cuong_chi_tiet.txt, Ke_hoach_hoc_tap.html]
                    │
                    ▼
[GIAI ĐOẠN 3: Diễn đàn Thảo luận -> Tạo bản nháp Cau_hoi_thao_luan_draft.txt kèm Direct URL (User duyệt)]
                    │
                    ▼
[GIAI ĐOẠN 4: LTTN 1, 2, 3, 4 -> Nếu Finished: cào review. Nếu Chưa làm: Tra kho đề đánh 6-8đ, thời lượng 4m - 14m30s]
                    │
                    ▼
[GIAI ĐOẠN 5: Bài thi Giữa kỳ -> CẤM LÀM BÀI. Nếu Finished (User đã thi): Bốc review gom đề]
                    │
                    ▼
[GIAI ĐOẠN 6: Luyện trước thi 40c -> 1 lần/ngày theo Slot ngẫu nhiên, thời lượng 10m30s - 38m30s -> Bóc công thức MathType/Ảnh]
                    │
                    ▼
[GIAI ĐOẠN 7: Dây chuyền SSoT -> Staging -> Gọt regex A/B/C/D -> Tag 2 tầng -> Weight high/bỏ trống -> Atomic Write qs.json]
                    │
                    ▼
[GIAI ĐOẠN 8: Điều phối LaunchAgent macOS 3 Khung giờ + Fail-safe Notification qua osascript nếu session hết hạn]
```

---

## 4. CẤU HÌNH LAUNCHAGENT MACOS 3 KHUNG GIỜ (TRI-SLOT CONFIG)

File `~/Library/LaunchAgents/com.learniz.tvu-sync.plist`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.learniz.tvu-sync</string>
    <key>ProgramArguments</key>
    <array>
        <string>/opt/homebrew/bin/python3</string>
        <string>/Users/thien-ban/Library/CloudStorage/OneDrive-Personal/03_WORK/11. LearnIZ/scratch/sync_tvu_lms.py</string>
    </array>
    <key>EnvironmentVariables</key>
    <dict>
        <key>PATH</key>
        <string>/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin</string>
        <key>HOME</key>
        <string>/Users/thien-ban</string>
    </dict>
    <key>StartCalendarInterval</key>
    <array>
        <!-- Khung giờ Sáng (6:00 AM) -->
        <dict>
            <key>Hour</key>
            <integer>6</integer>
            <key>Minute</key>
            <integer>0</integer>
        </dict>
        <!-- Khung giờ Trưa (12:00 PM) -->
        <dict>
            <key>Hour</key>
            <integer>12</integer>
            <key>Minute</key>
            <integer>0</integer>
        </dict>
        <!-- Khung giờ Tối (19:00 PM / 7:00 tối) -->
        <dict>
            <key>Hour</key>
            <integer>19</integer>
            <key>Minute</key>
            <integer>0</integer>
        </dict>
    </array>
    <key>StandardOutPath</key>
    <string>/Users/thien-ban/Library/CloudStorage/OneDrive-Personal/03_WORK/11. LearnIZ/scratch/sync_output.log</string>
    <key>StandardErrorPath</key>
    <string>/Users/thien-ban/Library/CloudStorage/OneDrive-Personal/03_WORK/11. LearnIZ/scratch/sync_error.log</string>
</dict>
</plist>
```

---

## 4.1 CẤU HÌNH THÔNG BÁO REALTIME QUA TELEGRAM BOT

Hệ thống tích hợp trực tiếp Telegram Bot để đẩy thông báo thời gian thực về điện thoại di động (iOS / Android) với độ trễ 0.5 giây và hỗ trợ phím bấm 1-chạm:

1. **File cấu hình:** `scratch/telegram_config.json`
   ```json
   {
     "enabled": true,
     "bot_token": "YOUR_BOT_TOKEN_FROM_BOTFATHER",
     "chat_id": "YOUR_CHAT_ID_FROM_USERINFOBOT"
   }
   ```
2. **Các kịch bản tự động gửi thông báo:**
   * **Bản nháp Thảo luận:** Bắn nội dung kèm nút bấm Inline Button `[🚀 Mở LMS Nộp Bài Ngay]` trỏ thẳng vào topic diễn đàn.
   * **Thu hoạch Đề mới:** Báo số câu hỏi mới vừa cào được và tổng số câu trong ngân hàng `qs.json`.
   * **Cảnh báo Khẩn cấp:** Báo động ngay lập tức khi session hết hạn cookie hoặc pin MacBook dưới 15%.

---

## 4.2 IN-APP TELEGRAM COCKPIT TRONG LEARNIZ PWA ("VỎ LEARNIZ — RUỘT TELEGRAM CHAT")

LearnIZ tích hợp trực tiếp buồng lái điều phối bên trong ứng dụng PWA mà không cần người dùng phải liên tục chuyển tab sang Telegram:

1. **Kiến trúc Bảo mật Zero-Token & Rolling Window:**
   * **Zero-Token:** Frontend PWA hoàn toàn không chứa `bot_token` của Telegram. PWA chỉ định kỳ đọc file sự kiện tĩnh `assets/dashboard_events.json`.
   * **Rolling Window:** Script Python tự động giới hạn tối đa 30 sự kiện gần nhất (< 15KB) để chống phình file và tải siêu nhẹ trên mạng 4G.
   * **Atomic Write:** Ghi đè file JSON qua `/tmp/` rồi dùng `os.replace` để triệt tiêu lỗi khóa file OneDrive.

2. **Quy chuẩn Giao diện Buồng Lái (Cockpit UI/UX):**
   * **Không dùng Icon phèn / Không dùng AI Style:** 100% sử dụng Vector SVG sắc nét (Lucide/Feather 2px stroke), không chèn emoji rác rưởi hay màu sắc neon loè loẹt.
   * **Đồng bộ Design System LearnIZ:** Chuẩn Dark Mode (`#0f0f1a`, `#1e1e35`), Glassmorphism `backdrop-filter: blur(12px)`, font hệ thống Apple/Segoe UI và Monospaced cho code/lệnh.
   * **Nút nổi Cockpit FAB:** Tọa lạc góc trái dưới (`bottom: 24px; left: 24px`), tránh đụng độ với nút Nộp bài thi ở góc phải, tích hợp badge thông báo tin chưa đọc.
   * **Drawer Trượt Responsive:** 
     * Desktop: Slide-over trượt từ phải sang (430px).
     * Mobile: Bottom Sheet trượt từ đáy lên (`88dvh`), hỗ trợ vùng tai thỏ `env(safe-area-inset-bottom)`.
   * **In-App Toast Banner:** Tự động trượt nhẹ từ trên xuống thông báo ngay khi có sự kiện mới trong lúc sinh viên đang luyện đề.
   * **Tương tác 1-chạm:** Nút Copy lệnh và Mở bài thi TVU trực tiếp, kèm haptic feedback rung nhẹ trên điện thoại.

---

## 5. BẢNG CHECKLIST NGHIỆM THU AN TOÀN TRƯỚC KHI DEPLOY

- [x] Đổi đường dẫn tuyệt đối sang `11. LearnIZ`.
- [x] Đổi tên file đích từ `_qs.json` sang `qs.json`.
- [x] Khởi tạo đủ `qs.json: []` và `kb.json: {"overview":{}, "details":[]}` ngay khi tạo môn mới.
- [x] Loại bỏ hoàn toàn giá trị `"weight": "normal"`, câu thường bỏ trống key `weight`.
- [x] Giới hạn mảng `tags` còn đúng 2 phần tử `[Chủ Đề, Tầng]`, triệt tiêu `node_id`.
- [x] Bổ sung regex tẩy sạch tiền tố `A.`, `B.`, `1.`, `2.` trong mảng `options`.
- [x] Bổ sung bóc tách ảnh MathType (`alt`/`data-mathml`) và tải ảnh ngoại tuyến.
- [x] Tích hợp bộ điều phối 3 khung giờ ngẫu nhiên (Sáng 6h-9h, Trưa 12h-13h, Tối 19h-21h) xoay vòng môn.
- [x] Tích hợp bộ tính thời lượng làm bài ngẫu nhiên $\ge 1/4$ tổng thời gian, số giây lẻ không trùng lặp.
- [x] Khóa đơn tiến trình (Process Mutex via `fcntl.flock`), tuyệt đối không chạy song song 2 process.
- [x] Thực thi tuần tự 1 luồng 1 tab duy nhất, kèm khoảng nghỉ giải lao 3 - 12 phút ngẫu nhiên giữa 2 môn.
- [x] Bổ sung Pre-flight Network Check chống báo ảo lỗi session khi mất Wifi.
- [x] Bổ sung Low Battery Guard: cấm mở bài thi khi pin MacBook <= 15% không cắm sạc.
- [x] Tích hợp Telegram Bot Realtime Alert kèm phím bấm 1-chạm nộp bài và báo động khẩn cấp.
- [x] Bổ sung Heartbeat tiến trình giả lập tương tác người thật trong suốt thời gian làm bài.
- [x] Thêm thông báo `osascript` khi phiên đăng nhập hết hạn.
- [x] Cào đề review của Bài thi Giữa kỳ khi `finished`.
- [x] Dùng Atomic Write chống lỗi lock file OneDrive.
- [x] Tích hợp In-App Telegram Cockpit Drawer trong PWA (Zero-Token, Rolling Window 30 events).
- [x] Tích hợp In-App Toast Banner thông báo thời gian thực khi sinh viên đang ôn luyện.
- [x] Chuẩn hóa giao diện buồng lái: Dark Mode Glassmorphism, 100% Vector SVG, không icon phèn hay phong cách AI.
- [x] Tích hợp phím tắt 1-chạm Copy lệnh và Mở bài thi TVU trực tiếp kèm haptic feedback.
