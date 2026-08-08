import json
import os

kb_data = {
  "title": "Giáo Dục Thể Chất 1 - Điền Kinh",
  "components": [
    {
      "type": "HeroCard",
      "data": {
        "title": "Tổng Quan Điền Kinh",
        "subtitle": "Nữ hoàng của các môn thể thao",
        "description": "Điền kinh bao gồm Chạy, Nhảy, Ném đẩy và Đi bộ. Bắt nguồn từ Olympic cổ đại (Hy Lạp - 776 TCN). Ngày nay, điền kinh là môn thi đấu trung tâm, hướng đến phát triển toàn diện sức mạnh, sức bền và độ dẻo dai."
      }
    },
    {
      "type": "ProcessSteps",
      "data": {
        "title": "9 Động Tác Thể Dục Phát Triển Chung",
        "steps": [
          { "step": "1", "title": "Vươn thở", "desc": "Hít thở sâu, kết hợp vươn tay lên cao." },
          { "step": "2", "title": "Tay ngực", "desc": "Dang tay ngang, gập khuỷu tay trước ngực." },
          { "step": "3", "title": "Lườn", "desc": "Nghiêng người sang hai bên, một tay chống hông." },
          { "step": "4", "title": "Bụng", "desc": "Gập thân, tay chạm mũi chân." },
          { "step": "5", "title": "Vặn mình", "desc": "Vặn thân sang hai bên, tay đưa ngang." },
          { "step": "6", "title": "Chân", "desc": "Lăng chân, khuỵu gối, tay duỗi thẳng." },
          { "step": "7", "title": "Toàn thân", "desc": "Ngồi khuỵu, gập thân, vươn mình vung tay." },
          { "step": "8", "title": "Nhảy", "desc": "Nhảy giạng chân, tay vung cao." },
          { "step": "9", "title": "Điều hòa", "desc": "Thả lỏng tay chân, hít thở đều." }
        ]
      }
    },
    {
      "type": "ProcessSteps",
      "data": {
        "title": "Kỹ Thuật Chạy Cự Ly Ngắn & Xuất Phát Thấp",
        "steps": [
          { "step": "1", "title": "Vào chỗ", "desc": "Chống tay sát vạch, hình vòm. Khoảng cách hai chân 10cm. Vai nhô về trước vạch." },
          { "step": "2", "title": "Sẵn sàng", "desc": "Nâng mông cao hơn đầu. Trọng tâm dồn về hai tay và chân trước. Chờ hiệu lệnh." },
          { "step": "3", "title": "Xuất phát (Chạy!)", "desc": "Đạp chân mạnh về trước, đánh tay ngược chiều, thân ngả về trước." },
          { "step": "4", "title": "Chạy lao & Giữa quãng", "desc": "Nâng dần thân người. Bước chạy dài dần, tần số nhanh. Tiếp đất bằng nửa trước bàn chân." },
          { "step": "5", "title": "Về đích", "desc": "Duy trì tốc độ tối đa. Lao ngực hoặc xoay vai chạm dây đích. Không giảm tốc trước vạch." }
        ]
      }
    },
    {
      "type": "ComparisonTable",
      "data": {
        "title": "Phân Biệt Chạy Cự Ly Ngắn và Cự Ly Trung Bình",
        "headers": ["Yếu tố", "Cự Ly Ngắn (60m-400m)", "Cự Ly Trung Bình (800m-5000m)"],
        "rows": [
          ["Tư thế xuất phát", "Xuất phát thấp (vào chỗ, sẵn sàng, chạy)", "Xuất phát cao (thân hơi ngả về trước)"],
          ["Làn chạy", "Chạy đúng làn riêng suốt cự ly", "Xuất phát theo làn hoặc chung, sau đó nhập làn"],
          ["Kỹ thuật chạy", "Đạp sau mạnh, nhanh, chạy lao tốc độ cao", "Đạp sau đều, tiết kiệm sức, nhịp thở 2-2 hoặc 3-3"],
          ["Về đích", "Lao ngực/xoay vai chạm dây đích", "Tăng dần tần số và độ dài bước, dành sức đoạn cuối"]
        ]
      }
    },
    {
      "type": "DeltaCheatSheet",
      "data": {
        "title": "Luật Thi Đấu & Lỗi Phạm Quy",
        "items": [
          { "term": "Xuất phát sớm (False start)", "definition": "Rời vị trí hoặc chuyển động trước khi có súng lệnh/hiệu lệnh 'Chạy!' -> Bị loại." },
          { "term": "Chạy sai làn", "definition": "Giẫm vạch hoặc lấn sang làn đối thủ (trong cự ly ngắn) -> Phạm quy." },
          { "term": "Cản trở đối thủ", "definition": "Xô đẩy, kéo, hoặc cố tình gây cản trở khi vượt -> Bị loại." },
          { "term": "Tính thành tích", "definition": "Chỉ tính khi THÂN (NGỰC) chạm mặt phẳng đích. Đầu, tay, chân không tính." }
        ]
      }
    },
    {
      "type": "EcosystemMap",
      "data": {
        "title": "Thành Tích Nổi Bật",
        "center": "Điền Kinh",
        "nodes": [
          { "name": "Thế Giới", "desc": "Usain Bolt (Người nhanh nhất hành tinh), Bob Beamon (Kỷ lục nhảy xa 23 năm)" },
          { "name": "Châu Á", "desc": "Trung Quốc thống trị ASIAD. Liu Xiang vô địch Olympic 110m rào." },
          { "name": "Đông Nam Á", "desc": "Thái Lan thống trị SEA Games. Việt Nam lấy điền kinh làm mũi nhọn." },
          { "name": "Việt Nam", "desc": "Nguyễn Thị Oanh (Biểu tượng hiện đại, 4 HCV SEA Games 32), Hoàng Nguyên Thanh (Marathon)" }
        ]
      }
    }
  ]
}

target_path = "/Users/thien-ban/Library/CloudStorage/OneDrive-Personal/04_GROWTH/1. Mindset/2. TVU/_sources/13. GIÁO DỤC THỂ CHẤT 1/kb.json"
with open(target_path, "w", encoding="utf-8") as f:
    json.dump(kb_data, f, ensure_ascii=False, indent=2)

print("Ghi file kb.json thanh cong!")
