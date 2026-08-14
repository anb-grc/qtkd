# [Kế Hoạch Tái Trực Quan Hóa] Môn KINH TẾ VĨ MÔ theo chuẩn SSoT Mới

Tao đã nhận ra lỗi tư duy "gộp" của tao: Thay vì mổ xẻ các component nhúng vào từng **Ý con** (Leaf nodes) để sinh viên học theo kiểu rẽ nhánh sâu, tao lại nhét cả nải 7 component vào cái Node bự (Ý phụ), làm cho giao diện bị ngộp và mất đi tính "thông suốt" của cấu trúc tầng lớp trí tuệ (Ý chính -> 3 ý phụ -> các ý con).

Dưới đây là kế hoạch Đập đi xây lại file `kb.json` một cách siêu phân mảnh, khớp 1-1 giữa Component và Node con. Mày xem duyệt không nhé!

## Đề xuất Cấu trúc Tầng lớp Trí Tuệ (Mindmap) & Phân bổ 7 Component

**Root (Ý Chính):** KINH TẾ VĨ MÔ

---

### 1. Ý Phụ 1: Đo Lường & Tổng Cầu
- **Ý con 1.1: Phân biệt GDP và GNP**
  - *Component áp dụng:* `vs-wrap` (Mổ xẻ so sánh trực diện Lãnh thổ vs Quốc tịch).
- **Ý con 1.2: Phương pháp tính GDP**
  - *Component áp dụng:* `formula-breakdown` (Chẻ nhỏ các biến trong công thức huyết mạch `Y = C + I + G + NX`).

### 2. Ý Phụ 2: Tiền Tệ & Chính Sách
- **Ý con 2.1: Các khối lượng tiền tệ**
  - *Component áp dụng:* `onion` (Trực quan hóa vòng tròn lõi M0, mở rộng ra M1, M2).
- **Ý con 2.2: Công cụ của Ngân hàng Trung ương**
  - *Component áp dụng:* `decision-tree` (Sơ đồ rẽ nhánh khi nào cần Kích cầu/Thắt chặt và 3 công cụ tương ứng).

### 3. Ý Phụ 3: Mô hình Cân Bằng & Tổng Cung
- **Ý con 3.1: Phân tích Tổng Cung (AS)**
  - *Component áp dụng:* `quadrant` (Góc nhìn đa chiều về AS Ngắn hạn - SRAS và Dài hạn - LRAS).
- **Ý con 3.2: Mô hình IS-LM**
  - *(Chỉ để Text Description trên mindmap, không xài Component để tiết kiệm quota).*

### 4. Ý Phụ 4: Bẫy Lật Kèo (Trap Breaking)
- **Ý con 4.1: Các bẫy lý thuyết Kinh tế Vĩ mô**
  - *Component áp dụng:* `delta-cheat-sheet` (Bắt thóp các bẫy chữ "Tiền lương danh nghĩa", "Tài khóa vs Tiền tệ").

### 5. Ý Phụ 5: Đấu Trường Thực Chiến
- **Ý con 5.1: Ngân hàng Đề thi**
  - *Component áp dụng:* `quiz` (Khối trích xuất tự động `quiz_tags: []` để nhả 72 câu hỏi ra cho user luyện).

---

## User Review Required

> [!IMPORTANT]
> Mày thấy việc xé nhỏ 7 Components gắn chặt vào 7 **Ý con (Leaf Nodes)** này đã chuẩn với ý đồ "thông suốt" trong SSoT chưa? Nếu OKE thì tao sẽ tiến hành chắp code vào file `kb.json` ngay lập tức!
