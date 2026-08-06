import json
import os

FILE_PATH = "/Users/thien-ban/Library/CloudStorage/OneDrive-Personal/04_GROWTH/1. Mindset/2. TVU/knowledge-app/public/data/mac-lenin/kb.json"

with open(FILE_PATH, "r", encoding="utf-8") as f:
    data = json.load(f)

# Ensure only the first original section remains, and reset its blocks to exactly the original 19 blocks
if "sections" in data and len(data["sections"]) > 0:
    first_section = data["sections"][0]
    if "blocks" in first_section and len(first_section["blocks"]) >= 19:
        first_section["blocks"] = first_section["blocks"][:19]
    data["sections"] = [first_section]

# =========================================================
# 15 NEW SHOWCASE BLOCKS (TO BE NUMBERED 20 - 34)
# =========================================================
new_blocks = [
    # Block 20: radar-chart
    {
        "type": "radar-chart",
        "title": "Radar Chart: Năng Lực Giải Đề & Quét Từ Khóa Lục Hợp",
        "data": {
            "title": "Biểu Đồ Đánh Giá Kỹ Năng Làm Bài Trắc Nghiệm Tốc Độ Cao",
            "axes": ["Khả năng ghi nhớ", "Tốc độ làm bài", "Nhận diện bẫy", "Tư duy tổng hợp", "Phản xạ trực giác"],
            "datasets": [
                {
                    "label": "Sinh Viên Dùng App Hack Nhão (Lục Hợp)",
                    "color": "#00d2a0",
                    "values": [95, 90, 98, 88, 92],
                    "description": "Nắm vững ma trận từ khóa Độc Bản, xử lý thần tốc."
                },
                {
                    "label": "Học Thuộc Lòng Nhồi Nhét Truyền Thống",
                    "color": "#ff6b6b",
                    "values": [50, 45, 30, 40, 35],
                    "description": "Dễ lúng túng khi gặp các bẫy lật kèo và phủ định."
                }
            ]
        }
    },
    # Block 21: line-chart
    {
        "type": "line-chart",
        "title": "Line Chart: Diễn Biến Phong Độ Ôn Thi Theo Tuần",
        "data": {
            "title": "Trục Theo Dõi Độ Nhạy Bến Trước Kỳ Thi",
            "xAxisLabel": "Thời gian tiến bộ",
            "yAxisLabel": "Tỷ lệ nhận diện bẫy (%)",
            "points": [
                {
                    "label": "Tuần 1",
                    "value": 40,
                    "annotation": "Mới tiếp cận",
                    "explanation": "Sinh viên còn bơ vơ trước hàng ngàn câu hỏi thô."
                },
                {
                    "label": "Tuần 2",
                    "value": 58,
                    "annotation": "Làm quen bẫy",
                    "explanation": "Bắt đầu nhận diện được câu phủ định Lặt Kèo."
                },
                {
                    "label": "Tuần 3",
                    "value": 75,
                    "annotation": "Tăng tốc",
                    "explanation": "Thành thạo đối chiếu chéo các đáp án sai Delta."
                },
                {
                    "label": "Tuần 4",
                    "value": 88,
                    "annotation": "Nhạy bén",
                    "explanation": "Phản xạ thần tốc với từ khóa Độc Bản."
                },
                {
                    "label": "Tuần 5",
                    "value": 95,
                    "annotation": "Tinh thông",
                    "explanation": "Tự tin bóc tách 100% câu hỏi trong ngân hàng."
                },
                {
                    "label": "Lúc Vào Thi",
                    "value": 99,
                    "annotation": "Đạt điểm tối đa",
                    "explanation": "Vượt thi nhẹ nhàng nhờ phong độ kiên định."
                }
            ]
        }
    },
    # Block 22: bar-chart
    {
        "type": "bar-chart",
        "title": "Bar Chart: Phân Bổ Mật Độ Bẫy Trắc Nghiệm Theo Chương",
        "data": {
            "title": "Thống Kê Trọng Tâm Cạm Bẫy Trong Ngân Hàng Đề Thi",
            "orientation": "vertical",
            "maxValue": 80,
            "items": [
                {
                    "label": "Chương 1: Khái Luận (Từ khóa Lật Kèo)",
                    "value": 25,
                    "unit": "câu bẫy",
                    "highlight": False,
                    "explanation": "Chủ yếu xoay quanh định nghĩa và khái niệm nền tảng."
                },
                {
                    "label": "Chương 2: Hàng Hóa & Thị Trường",
                    "value": 45,
                    "unit": "câu bẫy",
                    "highlight": True,
                    "explanation": "Trọng tâm bẫy cực dày! Đặc biệt là hàng hóa sức lao động và lượng giá trị."
                },
                {
                    "label": "Chương 3: Giá Trị Thặng Dư",
                    "value": 65,
                    "unit": "câu bẫy",
                    "highlight": True,
                    "explanation": "Vùng cạm bẫy lớn nhất! Các bài tập tính toán tỷ suất m' và cấu tạo hữu cơ c/v."
                },
                {
                    "label": "Chương 4: Độc Quyền & Cạnh Tranh",
                    "value": 35,
                    "unit": "câu bẫy",
                    "highlight": False,
                    "explanation": "Bẫy về nguyên nhân xuất hiện và các hình thức độc quyền nhà nước."
                },
                {
                    "label": "Chương 5: Kinh Tế Thị Trường XHCN",
                    "value": 30,
                    "unit": "câu bẫy",
                    "highlight": False,
                    "explanation": "Bẫy về thể chế và cơ cấu sở hữu trong nền kinh tế."
                }
            ]
        }
    },
    # Block 23: scatter-plot
    {
        "type": "scatter-plot",
        "title": "Scatter Plot: Ma Trận Tương Quan Nỗ Lực & Hiệu Quả Đích",
        "data": {
            "title": "Tương Quan Giữa Thời Gian Luyện Đề Và Điểm Số Đạt Được",
            "xAxisLabel": "Thời gian luyện trên Web (Giờ)",
            "yAxisLabel": "Điểm kiểm tra thực tế (Thang 100)",
            "xMin": 0,
            "xMax": 12,
            "yMin": 20,
            "yMax": 100,
            "points": [
                {"x": 2, "y": 45, "name": "Sinh viên A", "category": "Chưa nhạy bẫy", "size": 8, "strategy": "Cần tập trung rèn luyện các từ khóa Lật Kèo và Ngữ cảnh."},
                {"x": 4, "y": 60, "name": "Sinh viên B", "category": "Đang tiến bộ", "size": 10, "strategy": "Đã hiểu khái niệm nhưng dễ bị nhầm khi gặp đáp án chênh 1 chữ."},
                {"x": 6, "y": 78, "name": "Sinh viên C", "category": "Thạo Lục Hợp", "size": 14, "strategy": "Áp dụng thuần thục đối chiếu chéo Delta để loại bỏ đáp án sai."},
                {"x": 8, "y": 90, "name": "Sinh viên D", "category": "Thạo Lục Hợp", "size": 16, "strategy": "Phán đoán nhanh bén, làm bài gấp đôi tốc độ bình thường."},
                {"x": 10, "y": 98, "name": "Thủ Khoa TVU", "category": "Siêu thủ khoa", "size": 20, "strategy": "Đạt cảnh giới thượng thừa: Quét chớp nhoáng, bẻ mọi bẫy tinh vi!"}
            ]
        }
    },
    # Block 24: area-chart
    {
        "type": "area-chart",
        "title": "Area Chart: Lực Hút Khối Lượng Tri Thức Ghi Nhớ",
        "data": {
            "title": "Sự Bùng Nổ Tích Lũy Từ Khóa Lục Hợp Trước Kỳ Thi",
            "thresholdValue": 50,
            "thresholdLabel": "Ngưỡng An Toàn (50 điểm)",
            "positiveRegionExplanation": "Vùng Kiến Thức Nằm Lòng (Tự tin xử lý mọi biến thể đề)",
            "negativeRegionExplanation": "Vùng Nhớ Vặt / Học Vẹt (Dễ bị đánh lừa bởi bẫy phủ định)",
            "points": [
                {"label": "Ngày 1", "value": 20, "note": "Bắt đầu làm quen với ngân hàng đề thi thô."},
                {"label": "Ngày 5", "value": 45, "note": "Tiến dần gần tới ngưỡng an toàn nhờ học bảng Từ khóa."},
                {"label": "Ngày 10", "value": 75, "note": "Bứt phá vượt ngưỡng! Khối kiến thức cốt lõi tăng nhanh."},
                {"label": "Ngày 15", "value": 130, "note": "Tích lũy vốn từ khóa Lục Hợp cực kỳ uyên thâm."},
                {"label": "Ngày 20", "value": 200, "note": "Hầu như không còn sai sót ở các câu trắc nghiệm bẫy."},
                {"label": "Ngày Thi", "value": 280, "note": "Đỉnh cao tri thức: Sẵn sàng giành trọn điểm số!"}
            ]
        }
    },
    # Block 25: sankey-diagram
    {
        "type": "sankey-diagram",
        "title": "Sankey Diagram: Luồng Phân Bổ Giá Trị Thặng Dư (Tư Bản)",
        "data": {
            "title": "Sự Hóa Thân Và Bí Mật Phân Bổ Giá Trị Thặng Dư Trong Doanh Nghiệp",
            "flows": [
                {"from": "Lao Động Thặng Dư (m)", "to": "Lợi Nhuận Công Nghiệp", "value": 45, "highlight": True, "explanation": "Nhà tư bản sản xuất trực tiếp chiếm đoạt phần lớn giá trị thặng dư do công nhân tạo ra."},
                {"from": "Lao Động Thặng Dư (m)", "to": "Lợi Nhuận Thương Nghiệp", "value": 25, "highlight": False, "explanation": "Nhường một phần cho tư bản thương nghiệp thông qua chênh lệch giá để đẩy nhanh tốc độ tiêu thụ."},
                {"from": "Lao Động Thặng Dư (m)", "to": "Lợi Tức Cho Vay (z)", "value": 15, "highlight": False, "explanation": "Một phần chuyển thành lợi tức cho giới tư bản tiền tệ cho vay vốn."},
                {"from": "Lao Động Thặng Dư (m)", "to": "Địa Tô Đất Đai (r)", "value": 15, "highlight": False, "explanation": "Phần nộp cho chủ đất dưới hình thức địa tô siêu ngạch hoặc chênh lệch."}
            ]
        }
    },
    # Block 26: waterfall-chart
    {
        "type": "waterfall-chart",
        "title": "Waterfall Chart: Dòng Tiền Tối Ưu Lợi Nhuận Khách Hàng",
        "data": {
            "title": "Phân Tích Thác Nước Từ Doanh Thu Thô Đến Trị Giá Độc Bản",
            "unit": "$",
            "steps": [
                {"label": "Doanh thu gộp", "value": 500, "type": "start", "note": "Mức khởi điểm", "explanation": "Tổng dòng tiền thu về chưa trừ chi phí hao hụt và rủi ro thị trường."},
                {"label": "Chi phí nguyên liệu", "value": 120, "type": "sub", "note": "Hao phí vật chất", "explanation": "Hao phí vật chất tất yếu trong quá trình vận hành sản xuất."},
                {"label": "Tối ưu AI Hack Não", "value": 80, "type": "add", "note": "Tăng trưởng công nghệ", "explanation": "Tăng trưởng vọt nhờ cải tiến kỹ thuật hack não và tự động hóa quy trình."},
                {"label": "Rủi ro lạm phát", "value": 90, "type": "sub", "note": "Hao hụt vĩ mô", "explanation": "Khoản hao hụt do dao động bất ngờ của nền kinh tế vĩ mô."},
                {"label": "Lợi Nhuận Đích Ròng", "value": 370, "type": "total", "note": "Thành quả bảo toàn", "explanation": "Con số tài chính kim tự tháp cuối cùng được bảo toàn ngoạn mục!"}
            ]
        }
    },
    # Block 27: gauge-chart
    {
        "type": "gauge-chart",
        "title": "Gauge Chart: Đồng Hồ Kháo Kiểm Sức Phản Xạ Đề Thi",
        "data": {
            "title": "Đo Lường Tốc Độ Phát Hiện Từ Khóa Độc Bản Lục Hợp",
            "min": 0,
            "max": 100,
            "currentValue": 85,
            "valueLabel": "Phản Xạ Thần Tộc",
            "unit": " Điểm Nhạy",
            "zones": [
                {"label": "Vùng Cạm Bẫy (Yếu)", "min": 0, "max": 40, "color": "#ff6b6b", "advice": "Nguy cơ sập bẫy cao! Cần luyện thêm bảng từ khóa Độc Bản."},
                {"label": "Vùng Do Dự (Trung bình)", "min": 40.1, "max": 74.9, "color": "#feca57", "advice": "Đã có nền tảng nhưng tốc độ làm bài còn chậm, dễ vân vân giữa 2 đáp án."},
                {"label": "Vùng Phản Xạ Thần Tộc", "min": 75, "max": 100, "color": "#00d2a0", "advice": "Đạt ngưỡng phản xạ THẦN TỘC! Lướt qua dòng đề thi là chộp ngay đúng bẫy phủ định và khoanh ngay phương án <span class=\"answer-keyword\">Độc Bản</span> trong vòng 3 giây!"}
            ]
        }
    },
    # Block 28: treemap
    {
        "type": "treemap",
        "title": "Treemap: Bản Đồ Trọng lượng Cấu Trúc Đề Thi & Điểm Bẫy",
        "data": {
            "title": "Phân Bổ Tỷ Trọng Kiến Thức Môn Học",
            "rootLabel": "Khối lượng kiến thức Kinh tế chính trị",
            "items": [
                {"name": "Hàng Hóa & Sức Lao Động", "value": 40, "category": "Kinh tế chính trị", "highlight": True, "details": "BẪY KINH THIÊN: Nhớ kỹ hàng hóa sức lao động mang tính <span class=\"keyword\">đặc biệt</span> vì khi tiêu dùng nó tạo ra một giá trị mới <span class=\"answer-keyword\">lớn hơn giá trị bản thân nó</span> (chính là giá trị thặng dư)."},
                {"name": "Quy Luật Giá Trị & Cạnh Tranh", "value": 25, "category": "Thị trường", "highlight": False, "details": "Quy luật cơ bản của sản xuất và lưu thông hàng hóa, dựa trên ao động xã hội cần thiết."},
                {"name": "Độc Quyền Tự Nhiên & Nhà Nước", "value": 20, "category": "Kinh tế vĩ mô", "highlight": True, "details": "BẪY THỜI GIAN: Độc quyền không tiêu diệt cạnh tranh mà làm cho cạnh tranh trở nên <span class=\"answer-keyword\">gay gắt, quyết liệt hơn</span>."},
                {"name": "Các Phương Pháp Sản Xuất Thặng Dư", "value": 15, "category": "Kinh tế chính trị", "highlight": False, "details": "Phân biệt thặng dư tuyệt đối (kéo dài ngày lao động) và tương đối (tăng năng suất lao động)."}
            ]
        }
    },
    # Block 29: decision-tree
    {
        "type": "decision-tree",
        "title": "Decision Tree: Cây Quyết Định Chọn Đáp Án Vượt Bẫy Lật Kèo",
        "data": {
            "title": "Trò Chơi Ngã Rẽ Trí Tuệ: Xử Lý Biến Thể Câu Hỏi Phủ Định",
            "startNodeId": "step_1",
            "nodes": {
                "step_1": {
                    "label": "Đề Bài Xuất Hiện: \"Yếu tố nào KHÔNG thuộc tính chất...\"",
                    "question": "Bạn vừa chạm trán câu hỏi có chữ <span class=\"keyword\">KHÔNG</span>. Đâu là động thái phản xạ đầu tiên của bạn?",
                    "isTrap": False,
                    "explanation": "Nhận diện bẫy phủ định là kỹ năng sinh tồn trong môn thi trắc nghiệm.",
                    "options": [
                        {
                            "text": "Đọc nghìn nghịt đáp án dài nhất rồi khoanh vội vì ngỡ là đúng",
                            "nextNodeId": "step_trap",
                            "tag": "Nguy hiểm"
                        },
                        {
                            "text": "Kích hoạt tiêu chuẩn Lật Kèo: Khoanh vùng chữ KHÔNG và truy lùng phương án mang logic đảo ngược",
                            "nextNodeId": "step_win",
                            "tag": "Khuyên dùng"
                        }
                    ]
                },
                "step_trap": {
                    "label": "BỊ LỌT HỐ CẠM BẪY ĐỀ THI!",
                    "outcome": "💥 Bạn đã dính bẫy tử huyệt của câu hỏi phủ định. Điểm số bị hao hụt cay đắng!",
                    "isTrap": True,
                    "explanation": "Khi gặp chữ <span class=\"keyword\">KHÔNG, NGOẠI TRỪ, SAI</span>, tuyệt đối cấm khoanh theo lối mòn thuận tai! Đáp án dài nhất thường là kiến thức đúng sách giáo khoa (tức là đáp án SAI của bài)."
                },
                "step_win": {
                    "label": "CHIẾN THẮNG TUYỆT ĐỔI - KHOANH ĐÚNG DELTA CORE!",
                    "outcome": "🏆 Bạn đã chộp đúng phương án lạc loài duy nhất, giật trọn 10 điểm nhẹ như lông hồng!",
                    "isTrap": False,
                    "explanation": "Quá đẳng cấp! Tư duy Lục Hợp giúp bạn loại bỏ ngay lập tức 3 đáp án rườm rà đúng lý thuyết để chộp ngay kẻ lạ mặt."
                }
            }
        }
    },
    # Block 30: chat-simulation
    {
        "type": "chat-simulation",
        "title": "Chat Simulation: Thực Chiến Xử Lý Cạm Bẫy Quản Trị / HR",
        "data": {
            "title": "Phòng Trao Đổi: Tranh Luận Định Mức Tiền Lương Thâm Niên Vs Hiệu Quả",
            "scenario": "Tình huống căng thẳng giữa Giám Đốc Nhân sự (HR) và Trưởng Phòng Sales về việc cải tổ quỹ thù lao theo hiệu suất KPI, chạm trán các bẫy luật lao động.",
            "messages": [
                {
                    "sender": "Giám Đốc HR (Lan Anh)",
                    "role": "manager",
                    "avatar": "👩‍💼",
                    "text": "Tuần tới chúng ta phải xóa bỏ hoàn toàn lương thâm niên và trừ trực tiếp 50% lương cứng của các nhân viên sales không đạt KPI tháng này!",
                    "isTrap": True,
                    "highlight": False,
                    "note": "BẪY NGHIỆP VỤ THỰC TẾ: Việc tự ý cắt giảm lương cứng dưới mức lương tối thiểu vùng do không đạt KPI là <span class=\"keyword\">vi phạm quy định pháp luật lao động</span>."
                },
                {
                    "sender": "Trưởng Phòng Sales (Minh Tuấn)",
                    "role": "sales_lead",
                    "avatar": "💼",
                    "text": "Khoan đã! Thay vì tước bỏ thù lao cứng trái luật, tại sao chúng ta không giữ lương cơ bản và áp dụng thang thưởng hoa hồng lũy tiến (Delta Commission)? Ai làm vượt 120% sẽ được x2 hệ số thưởng!",
                    "isTrap": False,
                    "highlight": True,
                    "note": "Gợi ý xuất sắc! Cân bằng hài hòa giữa Động lực bán hàng và tính Pháp lý vững chắc."
                },
                {
                    "sender": "Cố Vấn Chiến Lược (Bạn)",
                    "role": "advisor",
                    "avatar": "⚖️",
                    "text": "Chính xác! Trong bài tập tình huống Quản trị nhân sự, khi chọn đáp án xử lý vi phạm KPI, phải luôn loại bỏ các phương án bẫy như <span class=\"answer-keyword\">Cắt lương cứng</span> hoặc <span class=\"answer-keyword\">Sa thải lập tức không qua hội đồng disciplinary</span>.",
                    "isTrap": False,
                    "highlight": False,
                    "note": "Tiêu chuẩn đối chiếu Lục Hợp: Loại trừ ngay đáp án mang tính độc đoán trái quy chế."
                }
            ]
        }
    },
    # Block 31: pair-grid
    {
        "type": "pair-grid",
        "title": "Pair Grid: Bàn Cờ Nối Ô Nhanh (Khái Niệm ↔ Bản Chất Lục Hợp)",
        "data": {
            "title": "Thực Hành Ghép Đôi Thần Tộc Tránh Bẫy Khái Niệm Kinh Tế",
            "instruction": "👉 Nhấn chọn 1 ô thuật ngữ ở cột trái, rồi tìm ô bản chất/đặc điểm cốt lõi tương ứng ở cột phải để ghép nối!",
            "pairs": [
                {
                    "id": "pair_1",
                    "leftText": "Tư Bản Bất Biến (c)",
                    "rightText": "Giá trị KHÔNG thay đổi về lượng trong quá trình sản xuất",
                    "explanation": "Tư bản bất biến (c) tồn tại dưới hình thức tư liệu sản xuất, chỉ được lao động cụ thể chuyển nguyên vẹn giá trị vào sản phẩm mới."
                },
                {
                    "id": "pair_2",
                    "leftText": "Tư Bản Khả Biến (v)",
                    "rightText": "Nguồn gốc TRỰC TIẾP duy nhất tạo ra giá trị thặng dư",
                    "explanation": "Tư bản khả biến (v) dùng để mua sức lao động, thông qua quá trình tiêu dùng sức lao động mà gia tăng về lượng (tạo ra m)."
                },
                {
                    "id": "pair_3",
                    "leftText": "Tư Bản Cố Định",
                    "rightText": "Tham gia TOÀN BỘ vào sản xuất nhưng chu chuyển GIÁ TRỊ TỪNG PHẦN",
                    "explanation": "Máy móc, nhà xưởng tham gia cả vòng sản xuất dài nhưng hao mòn dần và chuyển từng phần giá trị vào sản phẩm."
                }
            ]
        }
    },
    # Block 32: journey-map
    {
        "type": "journey-map",
        "title": "Journey Map: Bản Đồ Cảm Xúc Ôn Thi & Điểm Đau (Pain Point)",
        "data": {
            "title": "Hành Trình Vượt Thời Gian Ôn Thi Môn Khối Dày Kèo",
            "persona": "Sinh Viên Trắc Nghiệm TVU",
            "stages": [
                {
                    "stage": "1. Mở Tài Liệu Gốc",
                    "action": "Tải file PDF hàng trăm trang với 2.000 câu hỏi thô chưa qua chỉnh lý.",
                    "emotion": "negative",
                    "painPoint": "Hoa mắt ngợp thở, các câu hỏi chằng chéo nhau không biết đâu là trọng tâm, dễ buồn ngủ và chán nản.",
                    "solution": "Áp dụng ngay <span class=\"answer-keyword\">Kiến trúc 3 lớp Tiệt Trùng</span> của App để lọc bớt câu trùng và hiển thị Editorial Clean."
                },
                {
                    "stage": "2. Gặp Đề Biến Thể",
                    "action": "Làm bài thử nhưng liên tục chọn sai ở những câu na ná nhau chênh lệch vài từ.",
                    "emotion": "frustration",
                    "painPoint": "Học thuộc vẹt nên bị lừa bởi các bẫy đảo ngữ, bẫy phủ định và từ khóa tinh vi.",
                    "solution": "Kích hoạt <span class=\"answer-keyword\">Ma Trận Lục Hợp</span>: Chỉ chèn thẻ bôi đậm vào các từ khóa Độc Bản & Đối Chiếu Chéo Delta.",
                    "trapWarning": "Cấm học theo kiểu nhắm mắt chọn câu dài nhất hoặc học thuộc vị trí A/B/C/D!"
                },
                {
                    "stage": "3. Tự Tin Làm Chủ",
                    "action": "Luyện trên App, lướt câu hỏi nào là điểm huyệt câu đó thần tốc.",
                    "emotion": "positive",
                    "solution": "Ghi nhớ sâu nhờ tương tác trực tiếp trên 34 component Đẹp mắt - Tối ưu - SSoT!"
                }
            ]
        }
    },
    # Block 33: interactive-calc
    {
        "type": "interactive-calc",
        "title": "Interactive Calc: Bảng Tính Tự Động Biến Chuyển Cấu Trúc Giá Trị",
        "data": {
            "title": "Mô Phỏng Tính Toán Giá Trị Thặng Dư & Tỷ Suất Lợi Nhuận",
            "description": "Điều chỉnh các thông số để kiểm chứng ngay công thức và tốc độ nhận nhạy đề thi",
            "operation": "divide",
            "resultLabel": "Hệ Số Phản Xạ Thực Chiến",
            "unit": " Điểm",
            "inputs": [
                {"id": "c_val", "name": "Độ Khái Quát Từ Khóa Lục Hợp", "min": 10, "max": 100, "defaultValue": 80, "step": 5, "unit": "%"},
                {"id": "v_val", "name": "Thời Gian Suy Nghĩ Trên Câu (Giờ/Số giây)", "min": 1, "max": 10, "defaultValue": 2, "step": 1, "unit": "giây"}
            ],
            "diagnoses": [
                {"minThreshold": 0, "maxThreshold": 20, "message": "Nguy hiểm! Thời gian suy nghĩ quá lâu mà độ chính xác thấp -> Cần ôn lại bảng từ khóa.", "color": "#ff6b6b"},
                {"minThreshold": 20.01, "maxThreshold": 50, "message": "Tốt! Bạn xử lý câu hỏi vững chãi, sẵn sàng chinh phục ngân hàng đề thi thô.", "color": "#00d2a0"},
                {"minThreshold": 50.01, "maxThreshold": 100, "message": "SIÊU HOÀN HẢO! Tốc độ phản xạ như chớp mắt, nhạy bén tuyệt đối trước bẫy Lục Hợp!", "color": "#00d2a0"}
            ]
        }
    },
    # Block 34: delta-cheat-sheet
    {
        "type": "delta-cheat-sheet",
        "title": "Delta Cheat Sheet: Ma Trận Song Sát Bẫy Đề Thi & Từ Khóa",
        "data": {
            "title": "Bảng Sát Hạch Thần Tộc: Chĩa Ngay Mũi Đao Vào Đúng Đáp Án Bẫy",
            "categoryFilters": ["Khái Niệm Cốt Lõi", "Bẫy Phủ Định", "Bẫy Con Số"],
            "items": [
                {
                    "category": "Khái Niệm Cốt Lõi",
                    "questionSnippet": "Giá trị sử dụng của hàng hóa là gì và do yếu tố nào quy định?",
                    "keyword": "Do yếu tố nào quy định",
                    "correctDelta": "Thuộc tính tự nhiên của vật thể hàng hóa quyết định",
                    "wrongTraps": [
                        "Do ý muốn chủ quan của người mua sắm quyết định",
                        "Do giá cả trên thị trường cao hay thấp quyết định",
                        "Do chi phí sản xuất quảng cáo quyết định"
                    ],
                    "explanation": "Nguyên tắc Độc Bản (1): Giá trị sử dụng là công dụng của vật, do <span class=\"answer-keyword\">thuộc tính tự nhiên</span> của chất liệu cấu tạo nên nó quy định, không phụ thuộc vào giá cả hay sở thích cá nhân."
                },
                {
                    "category": "Bẫy Phủ Định",
                    "questionSnippet": "Yếu tố nào SAU ĐÂY KHÔNG thuộc cấu trúc của lực lượng sản xuất?",
                    "keyword": "KHÔNG thuộc cấu trúc LLSX",
                    "correctDelta": "Quan hệ sở hữu về tư liệu sản xuất",
                    "wrongTraps": [
                        "Người lao động với tri thức và kinh nghiệm",
                        "Tư liệu sản xuất và máy móc công cụ",
                        "Đối tượng lao động và nguyên liệu thô"
                    ],
                    "explanation": "Nguyên tắc Lật Kèo (3): Lực lượng sản xuất gồm Người lao động và Tư liệu sản xuất. <span class=\"answer-keyword\">Quan hệ sở hữu</span> là nhân tố cốt lõi của <span class=\"keyword\">Quan hệ sản xuất</span>, tuyệt đối không bị nhầm lẫn!"
                },
                {
                    "category": "Bẫy Con Số",
                    "questionSnippet": "Cấu tạo hữu cơ của tư bản (c/v) thay đổi theo xu hướng nào trong sự phát triển của CNTB?",
                    "keyword": "Xu hướng thay đổi cấu tạo hữu cơ (c/v)",
                    "correctDelta": "Tăng lên không ngừng cả về tương đối và tuyệt đối",
                    "wrongTraps": [
                        "Giảm xuống liên tục do máy móc rẻ đi",
                        "Bản chất luôn cố định ở tỷ lệ 1 : 1",
                        "Chỉ tăng trong nông nghiệp, giảm trong công nghiệp"
                    ],
                    "explanation": "Nguyên tắc Ngữ cảnh (2): Trong tiến trình hiện đại hóa, máy móc thay thế con người ngày càng nhiều, do đó lượng <span class=\"answer-keyword\">c (tư bản bất biến)</span> tăng nhanh hơn <span class=\"keyword\">v (tư bản khả biến)</span> khiến tỷ lệ c/v có xu hướng không ngừng tăng lên."
                }
            ]
        }
    }
]

# Append the 15 new blocks directly into the first section's block list!
data["sections"][0]["blocks"].extend(new_blocks)

with open(FILE_PATH, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"SUCCESS! Total components now in main section: {len(data['sections'][0]['blocks'])} ( numbered 1 - 34 )")
