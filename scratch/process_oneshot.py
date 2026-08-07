import json

# =============================================
# MÔN 1: NGUYÊN LÝ KẾ TOÁN (146 câu)
# =============================================
ke_toan_keywords = {
    "Nguyên tắc & Chuẩn mực": [
        "nguyên tắc", "chuẩn mực", "nhất quán", "thận trọng", "trọng yếu", "phù hợp", "cơ sở dồn tích", "giá gốc", "hoạt động liên tục", "khách quan"
    ],
    "Tài khoản & Ghi sổ": [
        "tài khoản", "bên nợ", "bên có", "số dư", "ghi sổ", "kết chuyển", "đối ứng", "bảng cân đối", "sổ cái", "định khoản", "hạch toán"
    ],
    "Tài sản & Nguồn vốn": [
        "tài sản cố định", "tscđ", "nguyên vật liệu", "hàng hóa", "công cụ dụng cụ", "vốn chủ sở hữu", "nợ phải trả", "khấu hao", "tài sản", "nguồn vốn", "nhập kho", "xuất kho"
    ],
    "Doanh thu & Chi phí": [
        "doanh thu", "chi phí", "giá vốn", "lợi nhuận", "thuế", "gtgt", "thu nhập", "kết quả kinh doanh", "bán hàng", "quản lý doanh nghiệp"
    ],
    "Thanh toán & Tiền tệ": [
        "tiền mặt", "tiền gửi ngân hàng", "vay", "phải thu", "phải trả", "thanh toán", "tạm ứng", "công nợ", "nộp thuế", "chuyển khoản"
    ]
}

# =============================================
# MÔN 2: THỐNG KÊ ỨNG DỤNG TRONG KINH DOANH (123 câu)
# =============================================
thong_ke_keywords = {
    "Tổng quan & Thang đo": [
        "thống kê", "thang đo", "định danh", "thứ bậc", "khoảng", "tỷ lệ", "biến định tính", "biến định lượng", "đo lường", "spss"
    ],
    "Chọn mẫu & Thu thập": [
        "tổng thể", "mẫu", "chọn mẫu", "khung mẫu", "phần tử", "điều tra", "thu thập", "xác suất", "ngẫu nhiên", "cỡ mẫu"
    ],
    "Mô tả & Trực quan": [
        "trung bình", "trung vị", "mode", "phương sai", "độ lệch chuẩn", "tần số", "biểu đồ", "bảng tần số", "histogram", "mô tả", "phân phối"
    ],
    "Ước lượng & Kiểm định": [
        "ước lượng", "kiểm định", "giả thuyết", "khoảng tin cậy", "mức ý nghĩa", "p-value", "t-test", "chi bình phương", "anova", "sig"
    ],
    "Hồi quy & Tương quan": [
        "hồi quy", "tương quan", "hệ số", "r bình phương", "mô hình", "biến phụ thuộc", "biến độc lập", "dự báo", "phân tích nhân tố", "cronbach"
    ]
}

# =============================================
# XỬ LÝ TỪNG MÔN
# =============================================
subjects = [
    {
        "file": "./10. Nguyên lý kế toán/Ngan_hang_de_Nguyen_ly_ke_toan_qs.json",
        "keywords": ke_toan_keywords,
        "fallback": "Nguyên tắc & Chuẩn mực"
    },
    {
        "file": "./12. Thống kê ứng dụng trong kinh doanh/Ngan_hang_de_Thong_ke_qs.json",
        "keywords": thong_ke_keywords,
        "fallback": "Tổng quan & Thang đo"
    }
]

for subj in subjects:
    with open(subj["file"], 'r', encoding='utf-8') as f:
        qs = json.load(f)

    for q in qs:
        text = (q.get("question", "") + " " + q.get("answer", "")).lower()
        
        assigned_tags = []
        
        # Thẻ 80/20: High hoặc Low
        if q.get("weight") == "high":
            assigned_tags.append("High")
        else:
            assigned_tags.append("Low")
        
        # Thẻ Chuyên đề: keyword matching
        best_match = None
        max_score = 0
        for cd, keywords in subj["keywords"].items():
            score = sum(1 for kw in keywords if kw.lower() in text)
            if score > max_score:
                max_score = score
                best_match = cd
        
        if best_match:
            assigned_tags.append(best_match)
        else:
            assigned_tags.append(subj["fallback"])
            
        q["tags"] = assigned_tags

    with open(subj["file"], 'w', encoding='utf-8') as f:
        json.dump(qs, f, ensure_ascii=False, indent=4)

    print(f"Done: {subj['file']} ({len(qs)} câu)")

print("\nAll subjects tagged successfully!")
