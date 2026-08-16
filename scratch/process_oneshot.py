import json
import os

target_file = "/Users/thien-ban/Library/CloudStorage/OneDrive-Personal/03_WORK/11. LearnIZ/_sources/TVU/Quan_tri_kinh_doanh_DH/16. TIN HỌC ỨNG DỤNG CƠ BẢN/kb.json"

kb_data = {
    "subject": "TIN HỌC ỨNG DỤNG CƠ BẢN",
    "overview": {
        "type": "mindmap",
        "title": "Bản Đồ Kiến Thức - Tin Học Ứng Dụng",
        "data": {
            "root": "TIN HỌC ỨNG DỤNG CƠ BẢN",
            "children": [
                {
                    "id": "th1",
                    "label": "ĐẠI CƯƠNG VỀ MÁY TÍNH ĐIỆN TỬ & CNTT",
                    "children": [
                        {"id": "th1_1", "label": "Cấu Trúc Máy Tính Điện Tử"},
                        {"id": "th1_2", "label": "Mạng Máy Tính & Truyền Thông"}
                    ]
                },
                {
                    "id": "th2",
                    "label": "SỬ DỤNG HỆ ĐIỀU HÀNH WINDOWS 10",
                    "children": [
                        {"id": "th2_1", "label": "Quản Lý Tập Tin Và Thư Mục"},
                        {"id": "th2_2", "label": "Phần Mềm Tiện Ích: Unikey & WinRAR"}
                    ]
                },
                {
                    "id": "th3",
                    "label": "MICROSOFT WORD 2013 CƠ BẢN",
                    "children": [
                        {"id": "th3_1", "label": "Cài Đặt Trang & Định Dạng"},
                        {"id": "th3_2", "label": "Chèn Các Đối Tượng"}
                    ]
                },
                {
                    "id": "th4",
                    "label": "MICROSOFT EXCEL 2013 CƠ BẢN",
                    "children": [
                        {"id": "th4_1", "label": "Hệ Thống Hàm & Bẫy Lý Thuyết"},
                        {"id": "th4_2", "label": "Sắp Xếp & Lọc Trích Dữ Liệu"}
                    ]
                },
                {
                    "id": "th5",
                    "label": "MICROSOFT POWERPOINT 2013 CƠ BẢN",
                    "children": [
                        {"id": "th5_1", "label": "Tổng Quan & Cửa Sổ Làm Việc"},
                        {"id": "th5_2", "label": "Slide Master & Thiết Lập Trình Chiếu"}
                    ]
                },
                {
                    "id": "th6",
                    "label": "SỬ DỤNG INTERNET",
                    "children": [
                        {"id": "th6_1", "label": "Kiến Trúc Hạ Tầng Mạng"},
                        {"id": "th6_2", "label": "Dịch Vụ & Trình Duyệt Web"}
                    ]
                }
            ]
        }
    },
    "details": [
        {
            "node_id": "th1_1",
            "components": [
                {
                    "type": "features",
                    "title": "Thành Phần Hệ Thống Máy Tính",
                    "data": {
                        "items": [
                            {"title": "Khối Điều Khiển (CU)", "description": "Giải mã lệnh, điều phối hoạt động toàn hệ thống."},
                            {"title": "Khối Tính Toán (ALU)", "description": "Thực hiện các phép toán số học và logic."},
                            {"title": "Bộ nhớ ROM", "description": "Bộ nhớ chỉ đọc, không mất dữ liệu khi tắt nguồn."},
                            {"title": "Bộ nhớ RAM", "description": "Bộ nhớ truy cập ngẫu nhiên, lưu tạm thời và mất dữ liệu khi tắt nguồn."},
                            {"title": "Phần mềm hệ thống", "description": "Hệ điều hành (Windows, Linux, macOS) điều khiển toàn bộ phần cứng."},
                            {"title": "Phần mềm ứng dụng", "description": "Chương trình phục vụ nhu cầu cụ thể: Unikey, Word, Chrome..."}
                        ]
                    }
                },
                {
                    "type": "quiz",
                    "title": "Luyện Đề - Cấu Trúc Máy Tính Điện Tử",
                    "data": {
                        "quiz_tags": ["ĐẠI CƯƠNG VỀ MÁY TÍNH ĐIỆN TỬ & CNTT", "Cấu trúc"]
                    }
                }
            ]
        },
        {
            "node_id": "th1_2",
            "components": [
                {
                    "type": "vs-wrap",
                    "title": "So Sánh Quy Mô Mạng",
                    "data": {
                        "left": {
                            "title": "Mạng LAN",
                            "content": "Phạm vi vài mét đến 1km. Thường dùng 1 dây cáp. Tốc độ cao nhưng dưới 100 Gbps."
                        },
                        "right": {
                            "title": "Mạng WAN",
                            "content": "Phạm vi quốc gia, châu lục. Truyền qua vệ tinh, cáp quang. Tốc độ vài Gbps."
                        }
                    }
                },
                {
                    "type": "features",
                    "title": "Ứng Dụng CNTT Cốt Lõi",
                    "data": {
                        "items": [
                            {"title": "Chính phủ điện tử (e-Gov)", "description": "Xây dựng mối quan hệ công khai, minh bạch, có thể kiểm soát lẫn nhau."},
                            {"title": "Kinh doanh trực tuyến (e-Commerce)", "description": "Giao dịch B2B, B2C, C2C nhanh chóng, giảm chi phí."},
                            {"title": "Dịch vụ truyền thông", "description": "Hội nghị trực tuyến (Video Conference), Email, VoIP, SMS."}
                        ]
                    }
                },
                {
                    "type": "quiz",
                    "title": "Luyện Đề - Mạng Máy Tính & Truyền Thông",
                    "data": {
                        "quiz_tags": ["ĐẠI CƯƠNG VỀ MÁY TÍNH ĐIỆN TỬ & CNTT", "Hệ thống"]
                    }
                }
            ]
        },
        {
            "node_id": "th2_1",
            "components": [
                {
                    "type": "matrix-table",
                    "title": "Ma Trận Thao Tác Windows",
                    "data": {
                        "headers": ["Thao Tác", "Phím Tắt", "Lệnh Chuột Phải"],
                        "rows": [
                            ["Chọn tất cả", "Ctrl + A", "—"],
                            ["Sao chép", "Ctrl + C", "Copy"],
                            ["Di chuyển (Cắt)", "Ctrl + X", "Cut"],
                            ["Dán", "Ctrl + V", "Paste"],
                            ["Xóa vào thùng rác", "Delete", "Delete"],
                            ["Xóa vĩnh viễn", "Shift + Delete", "—"]
                        ]
                    }
                },
                {
                    "type": "quiz",
                    "title": "Luyện Đề - Quản Lý Tập Tin",
                    "data": {
                        "quiz_tags": ["SỬ DỤNG HỆ ĐIỀU HÀNH WINDOWS 10", "Phân luồng"]
                    }
                }
            ]
        },
        {
            "node_id": "th2_2",
            "components": [
                {
                    "type": "pair-grid",
                    "title": "Đồng Bộ Bảng Mã & Chức Năng Tiện Ích",
                    "data": {
                        "pairs": [
                            {"id": "p1", "leftText": "Bảng mã Unicode", "rightText": "Font: Times New Roman, Arial"},
                            {"id": "p2", "leftText": "Bảng mã VNI Windows", "rightText": "Font: VNI-Times, VNI-Arial"},
                            {"id": "p3", "leftText": "Bảng mã TCVN3 (ABC)", "rightText": "Font: .VnTime"},
                            {"id": "p4", "leftText": "Chuyển Anh/Việt (V/E)", "rightText": "Phím tắt: Ctrl + Shift"},
                            {"id": "p5", "leftText": "Kiểu gõ Telex: Sắc / Huyền / Mũ", "rightText": "Phím: S / F / gõ đúp (aa, ee, oo)"},
                            {"id": "p6", "leftText": "Lệnh Extract Here (WinRAR)", "rightText": "Giải nén ngay tại vị trí hiện hành"}
                        ]
                    }
                },
                {
                    "type": "quiz",
                    "title": "Luyện Đề - Phần Mềm Tiện Ích",
                    "data": {
                        "quiz_tags": ["SỬ DỤNG HỆ ĐIỀU HÀNH WINDOWS 10", "Logic & Nguyên tắc"]
                    }
                }
            ]
        },
        {
            "node_id": "th3_1",
            "components": [
                {
                    "type": "process-steps",
                    "title": "Quy Trình Chuẩn Bị Trang In (Word)",
                    "data": {
                        "steps": [
                            {"name": "Tạo mới tài liệu", "description": "Dùng phím tắt Ctrl + N hoặc File > New."},
                            {"name": "Cài đặt trang (Page Layout)", "description": "Thiết lập Margins (lề) và Orientation (hướng giấy)."},
                            {"name": "Chọn Font chữ", "description": "Phải tương ứng với bảng mã tiếng Việt đang dùng (Unikey)."},
                            {"name": "Lưu file", "description": "Dùng Ctrl + S, lưu dưới định dạng mặc định .docx."},
                            {"name": "Nhập liệu thô", "description": "Dùng Enter để ngắt đoạn, Shift + Enter để ngắt dòng."},
                            {"name": "Chia cột & Drop Cap", "description": "Bắt buộc chia cột trước, sau đó mới tạo Drop Cap."}
                        ]
                    }
                },
                {
                    "type": "quiz",
                    "title": "Luyện Đề - Cài Đặt Trang",
                    "data": {
                        "quiz_tags": ["MICROSOFT WORD 2013 CƠ BẢN", "Phân luồng"]
                    }
                }
            ]
        },
        {
            "node_id": "th3_2",
            "components": [
                {
                    "type": "features",
                    "title": "Đặc Tính Các Đối Tượng (Insert)",
                    "data": {
                        "items": [
                            {"title": "Hình ảnh (Pictures)", "description": "Wrap Text xác định vị trí ảnh (Square, Tight, Behind/In Front of Text)."},
                            {"title": "Hình khối (Shapes)", "description": "Hỗ trợ đổ màu (Fill), bỏ viền (No Outline), gom nhóm (Group)."},
                            {"title": "Lưu đồ (SmartArt)", "description": "Gồm List, Process, Cycle, Hierarchy. Cập nhật qua Text Pane."},
                            {"title": "Bảng biểu (Table)", "description": "Cho phép trộn ô (Merge Cells) và kẻ khung viền (Borders)."},
                            {"title": "Chú thích", "description": "Footnote (cuối trang hiện tại) và Endnote (cuối toàn bộ tài liệu)."}
                        ]
                    }
                },
                {
                    "type": "quiz",
                    "title": "Luyện Đề - Chèn Đối Tượng",
                    "data": {
                        "quiz_tags": ["MICROSOFT WORD 2013 CƠ BẢN", "Cấu trúc"]
                    }
                }
            ]
        },
        {
            "node_id": "th4_1",
            "components": [
                {
                    "type": "pyramid",
                    "title": "Phân Tầng Hàm Excel Cơ Bản",
                    "data": {
                        "levels": [
                            {"name": "Hàm Dò Tìm (VLOOKUP, HLOOKUP)", "description": "Dò chính xác/tương đối theo cột hoặc dòng. Rất hay thi."},
                            {"name": "Hàm Thống Kê", "description": "MAX, MIN, AVERAGE, COUNT, COUNTA, COUNTBLANK, RANK."},
                            {"name": "Hàm Toán Học", "description": "ABS, INT, MOD, ROUND, SUM."},
                            {"name": "Hàm Ngày Giờ & Chuỗi", "description": "TODAY, NOW, DAY/MONTH/YEAR. LEFT, RIGHT, MID, VALUE."}
                        ]
                    }
                },
                {
                    "type": "delta-cheat-sheet",
                    "title": "Bẫy Lý Thuyết Hàm Excel",
                    "data": {
                        "items": [
                            {
                                "questionSnippet": "Phân biệt INT và MOD",
                                "keyword": "INT vs MOD",
                                "correctDelta": "INT lấy phần nguyên, MOD lấy phần dư.",
                                "wrongTraps": ["INT làm tròn số", "MOD là giá trị tuyệt đối"],
                                "explanation": "INT(5.6) = 5. MOD(15, 8) = 7."
                            },
                            {
                                "questionSnippet": "Phân biệt COUNT và COUNTA",
                                "keyword": "COUNT vs COUNTA",
                                "correctDelta": "COUNT đếm ô kiểu số, COUNTA đếm ô có dữ liệu bất kỳ.",
                                "wrongTraps": ["COUNTA đếm ô rỗng", "COUNT đếm chữ"],
                                "explanation": "COUNTA không bỏ sót ô nào trừ khi nó hoàn toàn rỗng."
                            },
                            {
                                "questionSnippet": "Quy tắc cột trị dò VLOOKUP",
                                "keyword": "Cột số mấy",
                                "correctDelta": "Cột 1 là cột chứa trị dò, lấy giá trị từ cột 2 trở đi.",
                                "wrongTraps": ["Lấy giá trị ở cột 1"],
                                "explanation": "VLOOKUP luôn so khớp ở cột ngoài cùng bên trái (cột 1) của bảng tham chiếu."
                            },
                            {
                                "questionSnippet": "Sao chép hàm RANK",
                                "keyword": "Khóa danh sách",
                                "correctDelta": "Tham số thứ 2 (danh sách) phải khóa tuyệt đối $.",
                                "wrongTraps": ["Để địa chỉ tương đối"],
                                "explanation": "Nếu không khóa $, khi kéo công thức xuống, danh sách tham chiếu sẽ bị trượt."
                            }
                        ]
                    }
                },
                {
                    "type": "quiz",
                    "title": "Luyện Đề - Hàm Excel",
                    "data": {
                        "quiz_tags": ["MICROSOFT EXCEL 2013 CƠ BẢN", "Hệ thống"]
                    }
                }
            ]
        },
        {
            "node_id": "th4_2",
            "components": [
                {
                    "type": "vs-wrap",
                    "title": "Sắp Xếp vs Lọc Trích Dữ Liệu",
                    "data": {
                        "left": {
                            "title": "Sắp Xếp (Sort)",
                            "content": "Sắp xếp tăng/giảm dần. Có thể cài đặt đa tiêu chí ưu tiên (Sort by / Then by)."
                        },
                        "right": {
                            "title": "Lọc Trích (Advanced Filter)",
                            "content": "Bắt buộc tạo Vùng Điều Kiện trước. Các điều kiện VÀ nằm cùng dòng, HOẶC nằm khác dòng."
                        }
                    }
                },
                {
                    "type": "quiz",
                    "title": "Luyện Đề - Sắp Xếp & Lọc",
                    "data": {
                        "quiz_tags": ["MICROSOFT EXCEL 2013 CƠ BẢN", "Logic & Nguyên tắc"]
                    }
                }
            ]
        },
        {
            "node_id": "th5_1",
            "components": [
                {
                    "type": "features",
                    "title": "Đặc Tính Nền Tảng PowerPoint 2013",
                    "data": {
                        "items": [
                            {"title": "Đối Tượng Độc Lập", "description": "Tất cả nội dung trên 1 slide đều được xem là đối tượng độc lập (Textbox, Chart, Shape)."},
                            {"title": "Bố Cục (Layout)", "description": "Thiết kế dựa trên các Layout có sẵn hoặc Slide Master để đảm bảo tính đồng nhất."},
                            {"title": "Các Vùng Thao Tác", "description": "Slide Pane (khung thu nhỏ trái), Slide Area (vùng thiết kế), Placeholder (khung định sẵn)."},
                            {"title": "Tính Tích Hợp", "description": "Hỗ trợ chèn trực tiếp Excel Spreadsheet, lấy ảnh từ Online Pictures và lưu trữ đám mây OneDrive."}
                        ]
                    }
                },
                {
                    "type": "quiz",
                    "title": "Luyện Đề - PowerPoint Tổng Quan",
                    "data": {
                        "quiz_tags": ["MICROSOFT POWERPOINT 2013 CƠ BẢN", "Cấu trúc"]
                    }
                }
            ]
        },
        {
            "node_id": "th5_2",
            "components": [
                {
                    "type": "process-steps",
                    "title": "Quy Trình Thiết Kế Bài Thuyết Trình",
                    "data": {
                        "steps": [
                            {"name": "Phác thảo", "description": "Chuẩn bị nội dung chữ và ý tưởng."},
                            {"name": "Tạo mới & Chọn Theme", "description": "Blank Presentation hoặc các Theme có sẵn."},
                            {"name": "Slide Master", "description": "Định dạng chung một lần cho tất cả (View > Master View > Slide Master)."},
                            {"name": "Thiết kế chi tiết", "description": "Thêm Textbox, Shapes, Hình ảnh, Bảng biểu vào từng slide."},
                            {"name": "Thiết lập Trình chiếu", "description": "Tùy chỉnh Animations (hiệu ứng phần tử) và Transitions (hiệu ứng chuyển slide)."}
                        ]
                    }
                },
                {
                    "type": "matrix-table",
                    "title": "Ma Trận Trình Chiếu (Slide Show)",
                    "data": {
                        "headers": ["Lệnh Trình Chiếu", "Phím Tắt", "Ý Nghĩa"],
                        "rows": [
                            ["From Beginning", "F5", "Trình chiếu từ Slide đầu tiên"],
                            ["From Current Slide", "Shift + F5", "Trình chiếu từ Slide hiện tại"],
                            ["Present Online", "—", "Trình chiếu trực tuyến qua mạng"],
                            ["Custom Slide Show", "—", "Tạo phiên trình chiếu tùy chỉnh riêng rẽ"]
                        ]
                    }
                },
                {
                    "type": "quiz",
                    "title": "Luyện Đề - Trình Chiếu",
                    "data": {
                        "quiz_tags": ["MICROSOFT POWERPOINT 2013 CƠ BẢN", "Logic & Nguyên tắc"]
                    }
                }
            ]
        },
        {
            "node_id": "th6_1",
            "components": [
                {
                    "type": "vs-wrap",
                    "title": "Cấu Trúc Hạ Tầng Cung Cấp Mạng",
                    "data": {
                        "left": {
                            "title": "IAP (Access Provider)",
                            "content": "Nhà cung cấp đường truyền và cổng kết nối quốc tế. Phân phối sỉ, nằm ở tầng cao nhất."
                        },
                        "right": {
                            "title": "ISP (Service Provider)",
                            "content": "Thuê đường truyền của IAP để cung cấp/bán lẻ dịch vụ Internet cho người dùng cuối (End-user)."
                        }
                    }
                },
                {
                    "type": "pair-grid",
                    "title": "Đồng Bộ Thuật Ngữ Web & Domain",
                    "data": {
                        "pairs": [
                            {"id": "d1", "leftText": "DNS (Domain Name System)", "rightText": "Hệ thống đổi IP thành Tên miền dễ nhớ"},
                            {"id": "d2", "leftText": "Web tĩnh", "rightText": "Tạo sẵn, không thể tùy biến mã nguồn trực tiếp"},
                            {"id": "d3", "leftText": "Web động", "rightText": "Nội dung sinh ra theo yêu cầu, có thể tùy biến"},
                            {"id": "d4", "leftText": "Tên miền .com", "rightText": "Tổ chức thương mại (Commercial)"},
                            {"id": "d5", "leftText": "Tên miền .edu", "rightText": "Tổ chức giáo dục (Education)"}
                        ]
                    }
                },
                {
                    "type": "quiz",
                    "title": "Luyện Đề - Kiến Trúc Mạng",
                    "data": {
                        "quiz_tags": ["SỬ DỤNG INTERNET", "Nền tảng"]
                    }
                }
            ]
        },
        {
            "node_id": "th6_2",
            "components": [
                {
                    "type": "features",
                    "title": "Công Cụ & Dịch Vụ Mạng Cốt Lõi",
                    "data": {
                        "items": [
                            {"title": "Trình duyệt Web", "description": "Phần mềm để lướt Web như Chrome, Firefox, Opera, Internet Explorer."},
                            {"title": "Search Engine", "description": "Công cụ tìm kiếm thông tin như Google (1997), Yahoo, Bing (2009)."},
                            {"title": "Thư điện tử (Email)", "description": "Giao thức truyền nhận thư. Cấu trúc bắt buộc: <Tên tài khoản>@<Tên miền>."},
                            {"title": "Thao tác cơ bản", "description": "Lưu trang (Ctrl+S), In trang (Ctrl+P), Bookmark đánh dấu (Ctrl+D)."}
                        ]
                    }
                },
                {
                    "type": "quiz",
                    "title": "Luyện Đề - Dịch Vụ Internet",
                    "data": {
                        "quiz_tags": ["SỬ DỤNG INTERNET", "Hệ thống"]
                    }
                }
            ]
        }
    ]
}

os.makedirs(os.path.dirname(target_file), exist_ok=True)
with open(target_file, 'w', encoding='utf-8') as f:
    json.dump(kb_data, f, ensure_ascii=False, indent=2)

print("kb.json generated successfully!")
