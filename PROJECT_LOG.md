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
