import json
import os
import re

new_questions = [
  {
    "weight": "normal",
    "tags": ["Lý thuyết", "Tài khoản"],
    "question": "Tài khoản <span class=\"keyword\">222</span> là tài khoản thuộc tài sản hay nguồn vốn của doanh nghiệp?<div class=\"options-grid\"><div>A. Không xác định được</div><div>B. Tài sản</div><div>C. Nguồn vốn</div><div>D. Vừa thuộc tài sản vừa thuộc nguồn vốn</div></div>",
    "answer": "<div class=\"answer-title\">✅ Đáp án: <span class=\"answer-keyword\">Tài sản</span></div>\n<div class=\"note\">💡 Giải thích: TK 222 (Đầu tư vào công ty liên doanh, liên kết) là nhóm TK 2 - Tài sản dài hạn.</div>"
  },
  {
    "weight": "normal",
    "tags": ["Lý thuyết", "Tài khoản"],
    "question": "Tài khoản <span class=\"keyword\">334</span><div class=\"options-grid\"><div>A. cuối kỳ không bao giờ có số dư</div><div>B. cuối kỳ có thể có số dư bên Có khác 0 hoặc bằng 0</div><div>C. cuối kỳ luôn có số dư bên Nợ</div><div>D. cuối kỳ không xác định được số dư</div></div>",
    "answer": "<div class=\"answer-title\">✅ Đáp án: cuối kỳ có thể có số dư bên <span class=\"answer-keyword\">Có</span> khác 0 hoặc bằng 0</div>\n<div class=\"note\">💡 Giải thích: TK 334 (Phải trả người lao động) thuộc Nguồn vốn, dư cuối kỳ thường ở bên Có (chưa trả hết lương) hoặc bằng 0 (đã trả đủ). Thi thoảng trả thừa thì có dư Nợ, nhưng đáp án của trường chọn là Dư Có khác 0 hoặc bằng 0.</div>"
  },
  {
    "weight": "normal",
    "tags": ["Định khoản", "Vốn chủ sở hữu"],
    "question": "Dùng <span class=\"keyword\">lợi nhuận</span> sau thuế chưa phân phối <span class=\"keyword\">bổ sung quỹ</span> đầu tư phát triển 10.000.000 đồng, kế toán ghi<div class=\"options-grid\"><div>A. Nợ 421 10.000.000<br>Có 414 10.000.000</div><div>B. Nợ 141 10.000.000<br>Có 421 10.000.000</div><div>C. Nợ 441 10.000.000<br>Có 414 10.000.000</div><div>D. Nợ 414 10.000.000<br>Có 421 10.000.000</div></div>",
    "answer": "<div class=\"answer-title\">✅ Đáp án: Nợ <span class=\"answer-keyword\">421</span> 10.000.000 / Có <span class=\"answer-keyword\">414</span> 10.000.000</div>\n<div class=\"note\">💡 Giải thích: Lợi nhuận sau thuế chưa phân phối (TK 421) giảm ghi Nợ. Quỹ đầu tư phát triển (TK 414) tăng ghi Có.</div>"
  },
  {
    "weight": "normal",
    "tags": ["Định khoản", "Quỹ"],
    "question": "Xuất tiền mặt 10.000.000 đồng từ <span class=\"keyword\">quỹ khen thưởng</span> phúc lợi hỗ trợ cho công nhân viên bị tai nạn lao động, kế toán ghi<div class=\"options-grid\"><div>A. Nợ 811 10.000.000<br>Có 111 10.000.000</div><div>B. Nợ 353 10.000.000<br>Có 334 10.000.000</div><div>C. Nợ 353 10.000.000<br>Có 111 10.000.000</div><div>D. Nợ 642 10.000.000<br>Có 111 10.000.000</div></div>",
    "answer": "<div class=\"answer-title\">✅ Đáp án: Nợ <span class=\"answer-keyword\">353</span> 10.000.000 / Có <span class=\"answer-keyword\">111</span> 10.000.000</div>\n<div class=\"note\">💡 Giải thích: Trích từ Quỹ khen thưởng phúc lợi (TK 353) làm quỹ này giảm (ghi Nợ). Chi bằng tiền mặt làm Tiền mặt giảm (Có 111).</div>"
  },
  {
    "weight": "normal",
    "tags": ["Định khoản", "Chi phí"],
    "question": "Chi <span class=\"keyword\">sửa chữa nhỏ</span> TSCĐ dùng ở bộ phận <span class=\"keyword\">quản lý doanh nghiệp</span> bằng tiền mặt 2.000.000 đồng, kế toán ghi<div class=\"options-grid\"><div>A. Nợ 642 2.000.000<br>Có 111 2.000.000</div><div>B. Nợ 641 2.000.000<br>Có 111 2.000.000</div><div>C. Nợ 621 2.000.000<br>Có 111 2.000.000</div><div>D. Nợ 627 2.000.000<br>Có 111 2.000.000</div></div>",
    "answer": "<div class=\"answer-title\">✅ Đáp án: Nợ <span class=\"answer-keyword\">642</span> 2.000.000 / Có <span class=\"answer-keyword\">111</span> 2.000.000</div>\n<div class=\"note\">💡 Giải thích: Phục vụ quản lý doanh nghiệp nên đưa vào Chi phí QLDN (Nợ 642). Tiền mặt giảm (Có 111).</div>"
  },
  {
    "weight": "normal",
    "tags": ["Định khoản", "Chi phí khác"],
    "question": "<span class=\"keyword\">Chi phí khác</span> chi bằng <span class=\"keyword\">tiền mặt</span> 4.000.000 đồng, kế toán ghi<div class=\"options-grid\"><div>A. Nợ 621 4.000.000<br>Có 111 4.000.000</div><div>B. Nợ 811 4.000.000<br>Có 111 4.000.000</div><div>C. Nợ 111 4.000.000<br>Có 711 4.000.000</div><div>D. Nợ 811 4.000.000<br>Có 112 4.000.000</div></div>",
    "answer": "<div class=\"answer-title\">✅ Đáp án: Nợ <span class=\"answer-keyword\">811</span> 4.000.000 / Có <span class=\"answer-keyword\">111</span> 4.000.000</div>\n<div class=\"note\">💡 Giải thích: Chi phí khác (TK 811) tăng ghi Nợ. Tiền mặt (TK 111) giảm ghi Có.</div>"
  },
  {
    "weight": "normal",
    "tags": ["Định khoản", "Vay nợ"],
    "question": "<span class=\"keyword\">Vay ngân hàng</span> 20.000.000 đồng về nhập quỹ <span class=\"keyword\">tiền mặt</span>, kế toán ghi<div class=\"options-grid\"><div>A. Nợ 111 2.000.000<br>Có 341 2.000.000</div><div>B. Nợ 111 20.000.000<br>Có 341 20.000.000</div><div>C. Nợ 111 20.000.000<br>Có 112 20.000.000</div><div>D. Nợ 112 20.000.000<br>Có 111 20.000.000</div></div>",
    "answer": "<div class=\"answer-title\">✅ Đáp án: Nợ <span class=\"answer-keyword\">111</span> 20.000.000 / Có <span class=\"answer-keyword\">341</span> 20.000.000</div>\n<div class=\"note\">💡 Giải thích: Tiền mặt (TK 111) tăng ghi Nợ. Vay nợ (TK 341) tăng ghi Có.</div>"
  },
  {
    "weight": "normal",
    "tags": ["Lý thuyết", "Thuế"],
    "question": "Chi phí <span class=\"keyword\">thuế thu nhập doanh nghiệp</span> thì<div class=\"options-grid\"><div>A. được tập hợp hay không tập hợp vào chi phí khi xác định kết quả kinh doanh là do cơ quan thuế quyết định</div><div>B. được tập hợp hay không tập hợp vào chi phí khi xác định kết quả kinh doanh là do chủ doanh nghiệp quyết định</div><div>C. không được tập hợp vào chi phí khi xác định kết quả kinh doanh</div><div>D. được tập hợp vào chi phí khi xác định kết quả kinh doanh</div></div>",
    "answer": "<div class=\"answer-title\">✅ Đáp án: <span class=\"answer-keyword\">không được</span> tập hợp vào chi phí khi xác định kết quả kinh doanh</div>\n<div class=\"note\">💡 Giải thích: Chi phí thuế TNDN (821) phát sinh SAU khi đã xác định được lợi nhuận kế toán trước thuế. Nên nó không được tập hợp vào để tính kết quả kinh doanh (trước thuế).</div>"
  },
  {
    "weight": "normal",
    "tags": ["Tính toán", "Thuế"],
    "question": "Tổng doanh thu trong kỳ 200.000.000 đồng, tổng chi phí trong kỳ là 100.000.000 đồng, <span class=\"keyword\">thuế suất thuế TNDN 20%</span>, hãy hạch toán số tiền thuế TNDN <span class=\"keyword\">thực tế phải nộp thêm</span>, biết lợi nhuận trước thuế cũng chính là lợi nhuận chịu thuế và trước đây doanh nghiệp đã <span class=\"keyword\">tạm nộp</span> thuế 15.000.000 đồng?<div class=\"options-grid\"><div>A. Nợ 821 5.000.000<br>Có 112 5.000.000</div><div>B. Nợ 3334 5.000.000<br>Có 111 5.000.000</div><div>C. Nợ 821 5.000.000<br>Có 111 5.000.000</div><div>D. Nợ 821 5.000.000<br>Có 3334 5.000.000</div></div>",
    "answer": "<div class=\"answer-title\">✅ Đáp án: Nợ <span class=\"answer-keyword\">821</span> 5.000.000 / Có <span class=\"answer-keyword\">3334</span> 5.000.000</div>\n<div class=\"note\">💡 Giải thích: LN trước thuế = 200 - 100 = 100tr. Tổng thuế TNDN = 100tr x 20% = 20tr. Đã tạm nộp 15tr, vậy phải nộp THÊM 5tr. Hạch toán phần nộp thêm: Nợ 821 / Có 3334.</div>"
  },
  {
    "weight": "normal",
    "tags": ["Định khoản", "Phân bổ"],
    "question": "Bộ phận <span class=\"keyword\">bán hàng báo hỏng</span> một công cụ dụng cụ trị giá mua ban đầu 9.000.000 đồng, thuế GTGT 10%, chi phí vận chuyển 1.000.000 đồng, tất cả trả bằng tiền mặt. Biết công cụ loại <span class=\"keyword\">phân bổ 4 lần</span>, đây là <span class=\"keyword\">đầu kỳ thứ 3</span>, nguyên nhân hỏng là do <span class=\"keyword\">chập điện</span>, kế toán ghi<div class=\"options-grid\"><div>A. Nợ 627 5.000.000<br>Có 153 5.000.000</div><div>B. Nợ 641 5.000.000<br>Có 242 5.000.000</div><div>C. Nợ 641 2.500.000<br>Có 242 2.500.000</div><div>D. Nợ 641 5.000.000<br>Có 153 5.000.000</div></div>",
    "answer": "<div class=\"answer-title\">✅ Đáp án: Nợ <span class=\"answer-keyword\">641</span> 5.000.000 / Có <span class=\"answer-keyword\">242</span> 5.000.000</div>\n<div class=\"note\">💡 Giải thích: Nguyên giá = 9tr + 1tr = 10tr. Phân bổ 4 lần => Mỗi lần 2.5tr. Đã phân bổ 2 lần (5tr). Còn lại 5tr nằm trên TK 242. Hỏng do khách quan (chập điện) => tính hết phần còn lại vào CP bán hàng (Nợ 641 / Có 242).</div>"
  },
  {
    "weight": "normal",
    "tags": ["Lý thuyết", "Doanh thu"],
    "question": "Nếu doanh nghiệp hạch toán thuế GTGT theo phương pháp <span class=\"keyword\">khấu trừ</span> thì số tiền ghi nhận vào <span class=\"keyword\">bên Có</span> của tài khoản 511 là giá nào sau đây?<div class=\"options-grid\"><div>A. giá thành sản xuất</div><div>B. giá vốn</div><div>C. giá bán bao gồm thuế giá trị gia tăng</div><div>D. giá bán chưa có thuế giá trị gia tăng</div></div>",
    "answer": "<div class=\"answer-title\">✅ Đáp án: giá bán <span class=\"answer-keyword\">chưa có</span> thuế giá trị gia tăng</div>\n<div class=\"note\">💡 Giải thích: Phương pháp khấu trừ bóc tách thuế GTGT ngay từ đầu, nên Doanh thu (TK 511) luôn ghi theo giá chưa thuế.</div>"
  },
  {
    "weight": "normal",
    "tags": ["Định khoản", "Lãi"],
    "question": "Nhận giấy báo Có của ngân hàng do <span class=\"keyword\">lãi nhập gốc</span> tiền gửi của doanh nghiệp 5.000.000 đồng, kế toán ghi<div class=\"options-grid\"><div>A. Nợ 515 5.000.000<br>Có 112 5.000.000</div><div>B. Nợ 635 5.000.000<br>Có 112 5.000.000</div><div>C. Nợ 112 5.000.000<br>Có 515 5.000.000</div><div>D. Nợ 811 5.000.000<br>Có 515 5.000.000</div></div>",
    "answer": "<div class=\"answer-title\">✅ Đáp án: Nợ <span class=\"answer-keyword\">112</span> 5.000.000 / Có <span class=\"answer-keyword\">515</span> 5.000.000</div>\n<div class=\"note\">💡 Giải thích: Lãi tiền gửi là doanh thu tài chính (Có 515). Tiền gửi NH tăng (Nợ 112).</div>"
  },
  {
    "weight": "normal",
    "tags": ["Định khoản", "Chiết khấu"],
    "question": "Do thanh toán tiền mua hàng hóa <span class=\"keyword\">trước hạn</span> nên được người bán cho hưởng <span class=\"keyword\">chiết khấu thanh toán</span> 1.000.000 đồng trừ vào các khoản nợ mà doanh nghiệp còn thiếu người bán, kế toán ghi<div class=\"options-grid\"><div>A. Nợ 331 1.000.000<br>Có 515 1.000.000</div><div>B. Nợ 131 1.000.000<br>Có 515 1.000.000</div><div>C. Nợ 331 1.000.000<br>Có 635 1.000.000</div><div>D. Nợ 331 1.000.000<br>Có 711 1.000.000</div></div>",
    "answer": "<div class=\"answer-title\">✅ Đáp án: Nợ <span class=\"answer-keyword\">331</span> 1.000.000 / Có <span class=\"answer-keyword\">515</span> 1.000.000</div>\n<div class=\"note\">💡 Giải thích: Chiết khấu thanh toán ĐƯỢC HƯỞNG ghi vào Doanh thu tài chính (Có 515). Trừ nợ làm Phải trả người bán giảm (Nợ 331).</div>"
  },
  {
    "weight": "normal",
    "tags": ["Định khoản", "Tạm ứng"],
    "question": "<span class=\"keyword\">Tạm ứng</span> cho nhân viên đi công tác bằng tiền mặt 5.000.000 đồng, kế toán ghi<div class=\"options-grid\"><div>A. Nợ 141 5.000.000<br>Có 111 5.000.000</div><div>B. Nợ 111 5.000.000<br>Có 141 5.000.000</div><div>C. Nợ 311 5.000.000<br>Có 112 5.000.000</div><div>D. Nợ 334 5.000.000<br>Có 111 5.000.000</div></div>",
    "answer": "<div class=\"answer-title\">✅ Đáp án: Nợ <span class=\"answer-keyword\">141</span> 5.000.000 / Có <span class=\"answer-keyword\">111</span> 5.000.000</div>\n<div class=\"note\">💡 Giải thích: Tạm ứng công tác tăng (Nợ 141). Tiền mặt giảm (Có 111).</div>"
  },
  {
    "weight": "normal",
    "tags": ["Lý thuyết", "Kết chuyển"],
    "question": "Các tài khoản chi phí dùng để tập hợp và kết chuyển sang tài khoản 911 để <span class=\"keyword\">xác định kết quả kinh doanh trước thuế</span> gồm<div class=\"options-grid\"><div>A. 632, 635, 641, 642, 811</div><div>B. 632, 635, 641, 642</div><div>C. 632, 641, 642</div><div>D. 632, 635, 641, 642, 811, 821</div></div>",
    "answer": "<div class=\"answer-title\">✅ Đáp án: 632, 635, 641, 642, <span class=\"answer-keyword\">811</span></div>\n<div class=\"note\">💡 Giải thích: Để xác định lợi nhuận trước thuế (KQKD), ta KHÔNG kết chuyển 821 (Chi phí thuế TNDN) vì 821 là khoản phát sinh sau khi đã tính xong lợi nhuận trước thuế.</div>"
  },
  {
    "weight": "normal",
    "tags": ["Định khoản", "Thanh toán"],
    "question": "Khi doanh nghiệp <span class=\"keyword\">trả nợ vay</span> bằng tiền gửi ngân hàng 50.000.000 đồng, kế toán ghi<div class=\"options-grid\"><div>A. Nợ 112 50.000.000<br>Có 331 50.000.000</div><div>B. Nợ 341 50.000.000<br>Có 112 50.000.000</div><div>C. Nợ 112 50.000.000<br>Có 341 50.000.000</div><div>D. Nợ 331 50.000.000<br>Có 112 50.000.000</div></div>",
    "answer": "<div class=\"answer-title\">✅ Đáp án: Nợ <span class=\"answer-keyword\">341</span> 50.000.000 / Có <span class=\"answer-keyword\">112</span> 50.000.000</div>\n<div class=\"note\">💡 Giải thích: Vay nợ (TK 341) giảm ghi Nợ. Tiền gửi NH giảm ghi Có.</div>"
  },
  {
    "weight": "normal",
    "tags": ["Định khoản", "Khấu hao"],
    "question": "Trích <span class=\"keyword\">khấu hao</span> TSCĐ dùng ở bộ phận <span class=\"keyword\">bán hàng</span> 50.000.000 đồng, kế toán ghi<div class=\"options-grid\"><div>A. Nợ 214 50.000.000<br>Có 641 50.000.000</div><div>B. Nợ 641 50.000.000<br>Có 214 50.000.000</div><div>C. Nợ 642 50.000.000<br>Có 211 50.000.000</div><div>D. Nợ 641 50.000.000<br>Có 211 50.000.000</div></div>",
    "answer": "<div class=\"answer-title\">✅ Đáp án: Nợ <span class=\"answer-keyword\">641</span> 50.000.000 / Có <span class=\"answer-keyword\">214</span> 50.000.000</div>\n<div class=\"note\">💡 Giải thích: Phục vụ bán hàng -> tính vào CP bán hàng (Nợ 641). Khấu hao làm hao mòn tăng (Có 214).</div>"
  },
  {
    "weight": "normal",
    "tags": ["Định khoản", "Sản xuất"],
    "question": "Nguyên <span class=\"keyword\">vật liệu phụ</span> xuất dùng <span class=\"keyword\">không hết nhập lại</span> kho trị giá 2.000.000 đồng được ghi nhận vào tài khoản<div class=\"options-grid\"><div>A. Nợ 1521 / Có 154</div><div>B. Nợ 154 / Có 1522</div><div>C. Nợ 1522 / Có 154</div><div>D. Nợ 1522 / Có 621</div></div>",
    "answer": "<div class=\"answer-title\">✅ Đáp án: Nợ <span class=\"answer-keyword\">1522</span> / Có <span class=\"answer-keyword\">621</span></div>\n<div class=\"note\">💡 Giải thích: Khi xuất thì ghi Nợ 621 / Có 152. Dùng không hết nhập lại kho thì ghi giảm chi phí (Có 621) và tăng NVL (Nợ 1522 - vì đây là vật liệu phụ).</div>"
  },
  {
    "weight": "normal",
    "tags": ["Định khoản", "Bán hàng"],
    "question": "Xuất hàng hóa trong kho <span class=\"keyword\">gửi đại lý</span> bán, trị giá xuất kho là 20.000.000 đồng, kế toán ghi<div class=\"options-grid\"><div>A. Nợ 157 20.000.000<br>Có 632 20.000.000</div><div>B. Nợ 157 20.000.000<br>Có 156 20.000.000</div><div>C. Nợ 157 20.000.000<br>Có 155 20.000.000</div><div>D. Nợ 632 20.000.000<br>Có 157 20.000.000</div></div>",
    "answer": "<div class=\"answer-title\">✅ Đáp án: Nợ <span class=\"answer-keyword\">157</span> 20.000.000 / Có <span class=\"answer-keyword\">156</span> 20.000.000</div>\n<div class=\"note\">💡 Giải thích: Hàng gửi bán tăng (Nợ 157). Hàng hóa trong kho giảm (Có 156). Chưa bán được nên chưa ghi Giá vốn (632).</div>"
  },
  {
    "weight": "normal",
    "tags": ["Lý thuyết", "Kết chuyển"],
    "question": "Nguyên vật liệu xuất dùng không hết nhập lại kho được <span class=\"keyword\">ghi chép vào sổ sách</span> kế toán <span class=\"keyword\">trước khi tập hợp</span> và kết chuyển chi phí phát sinh trong kỳ sang tài khoản 154<div class=\"options-grid\"><div>A. Không đủ cơ sở để kết luận</div><div>B. Đúng</div><div>C. Có thể hạch toán trước hay sau đều được</div><div>D. Sai</div></div>",
    "answer": "<div class=\"answer-title\">✅ Đáp án: <span class=\"answer-keyword\">Đúng</span></div>\n<div class=\"note\">💡 Giải thích: Phải trừ NVL xuất dùng không hết ra khỏi TK 621 trước, rồi mới lấy số 621 thực tế phát sinh kết chuyển vào 154.</div>"
  },
  {
    "weight": "normal",
    "tags": ["Định khoản", "Khấu hao"],
    "question": "Trích <span class=\"keyword\">khấu hao</span> TSCĐ dùng ở bộ phận <span class=\"keyword\">quản lý doanh nghiệp</span> 20.000.000 đồng, kế toán ghi<div class=\"options-grid\"><div>A. Nợ 642 20.000.000<br>Có 214 20.000.000</div><div>B. Nợ 641 20.000.000<br>Có 214 20.000.000</div><div>C. Nợ 642 20.000.000<br>Có 211 20.000.000</div><div>D. Nợ 627 20.000.000<br>Có 214 20.000.000</div></div>",
    "answer": "<div class=\"answer-title\">✅ Đáp án: Nợ <span class=\"answer-keyword\">642</span> 20.000.000 / Có <span class=\"answer-keyword\">214</span> 20.000.000</div>\n<div class=\"note\">💡 Giải thích: Phục vụ quản lý doanh nghiệp -> tính vào Chi phí QLDN (Nợ 642). Trích khấu hao thì ghi Có 214.</div>"
  },
  {
    "weight": "normal",
    "tags": ["Lý thuyết", "Chi phí"],
    "question": "Chi phí <span class=\"keyword\">sửa chữa thường xuyên</span> TSCĐ của bộ phận <span class=\"keyword\">sản xuất</span> được tính vào<div class=\"options-grid\"><div>A. chi phí khác</div><div>B. chi phí sản xuất chung</div><div>C. chi phí quản lý doanh nghiệp</div><div>D. giá vốn hàng bán trong kỳ</div></div>",
    "answer": "<div class=\"answer-title\">✅ Đáp án: chi phí <span class=\"answer-keyword\">sản xuất chung</span></div>\n<div class=\"note\">💡 Giải thích: TSCĐ thuộc phân xưởng sản xuất nên mọi chi phí phát sinh liên quan (khấu hao, sửa chữa) đều đưa vào Chi phí sản xuất chung (TK 627).</div>"
  },
  {
    "weight": "normal",
    "tags": ["Lý thuyết", "Tài khoản"],
    "question": "Tài khoản <span class=\"keyword\">421</span><div class=\"options-grid\"><div>A. cuối kỳ có thể có số dư bên Nợ hoặc bên Có</div><div>B. cuối kỳ luôn có số dư bên Nợ</div><div>C. cuối kỳ luôn có số dư bên Có</div><div>D. cuối kỳ luôn luôn không có số dư</div></div>",
    "answer": "<div class=\"answer-title\">✅ Đáp án: cuối kỳ có thể có số dư bên <span class=\"answer-keyword\">Nợ hoặc bên Có</span></div>\n<div class=\"note\">💡 Giải thích: TK 421 (Lợi nhuận sau thuế chưa phân phối) là TK lưỡng tính. Nếu Lãi thì dư Có, nếu Lỗ thì dư Nợ.</div>"
  },
  {
    "weight": "normal",
    "tags": ["Định khoản", "Thanh toán"],
    "question": "Nhân viên phân xưởng <span class=\"keyword\">thanh toán</span> tiền tạm ứng kỳ trước 50.000.000 đồng gồm chi phí mua <span class=\"keyword\">TSCĐ</span> 40.000.000 đồng, thuế GTGT 10%, tiền thừa <span class=\"keyword\">nộp lại</span> cho doanh nghiệp bằng tiền mặt, kế toán ghi<div class=\"options-grid\"><div>A. Nợ 211 40.000.000<br>Nợ 133 4.000.000<br>Nợ 111 6.000.000<br>Có 141 50.000.000</div><div>B. Nợ 811 40.000.000<br>Nợ 133 4.000.000<br>Nợ 111 6.000.000<br>Có 141 50.000.000</div><div>C. Nợ 627 50.000.000<br>Nợ 133 4.000.000<br>Nợ 111 6.000.000<br>Có 141 50.000.000</div><div>D. Nợ 642 40.000.000<br>Nợ 133 4.000.000<br>Nợ 111 6.000.000<br>Có 141 50.000.000</div></div>",
    "answer": "<div class=\"answer-title\">✅ Đáp án: Nợ <span class=\"answer-keyword\">211</span> 40.000.000 / Nợ 133 4.000.000 / Nợ 111 6.000.000 / Có <span class=\"answer-keyword\">141</span> 50.000.000</div>\n<div class=\"note\">💡 Giải thích: Thanh toán tạm ứng (Có 141: 50tr). Nhận TSCĐ (Nợ 211: 40tr). Thuế GTGT (Nợ 133: 4tr). Nhận lại tiền thừa (Nợ 111: 6tr).</div>"
  },
  {
    "weight": "normal",
    "tags": ["Định khoản", "Quỹ"],
    "question": "Xuất tiền mặt 20.000.000 đồng từ <span class=\"keyword\">quỹ khen thưởng</span> phúc lợi chi cho cán bộ công nhân viên đi <span class=\"keyword\">nghỉ mát</span> ở Vũng Tàu, kế toán ghi<div class=\"options-grid\"><div>A. Nợ 642 20.000.000<br>Có 111 20.000.000</div><div>B. Nợ 335 20.000.000<br>Có 111 20.000.000</div><div>C. Nợ 353 20.000.000<br>Có 111 20.000.000</div><div>D. Nợ 811 20.000.000<br>Có 111 20.000.000</div></div>",
    "answer": "<div class=\"answer-title\">✅ Đáp án: Nợ <span class=\"answer-keyword\">353</span> 20.000.000 / Có <span class=\"answer-keyword\">111</span> 20.000.000</div>\n<div class=\"note\">💡 Giải thích: Quỹ phúc lợi (TK 353) giảm ghi Nợ. Tiền mặt (111) giảm ghi Có. Không hạch toán vào chi phí.</div>"
  },
  {
    "weight": "normal",
    "tags": ["Lý thuyết", "Mua sắm"],
    "question": "Khi tính <span class=\"keyword\">giá xuất kho</span> nguyên vật liệu dùng cho sản xuất sản phẩm chịu thuế GTGT theo phương pháp <span class=\"keyword\">khấu trừ</span> thì<div class=\"options-grid\"><div>A. giá trị xuất kho bao gồm giá mua chưa thuế và chi phí vận chuyển chưa thuế</div><div>B. giá trị xuất kho có kể cả chi phí vận chuyển chi hộ cho bên bán</div><div>C. giá trị xuất kho bao gồm giá mua có thuế và chi phí vận chuyển có thuế</div><div>D. giá trị xuất kho có kể cả thuế giá trị gia tăng đầu vào</div></div>",
    "answer": "<div class=\"answer-title\">✅ Đáp án: giá trị xuất kho bao gồm giá mua <span class=\"answer-keyword\">chưa thuế</span> và chi phí vận chuyển <span class=\"answer-keyword\">chưa thuế</span></div>\n<div class=\"note\">💡 Giải thích: PP khấu trừ bóc tách thuế ngay từ khâu mua vào. Trị giá nhập kho (152) chỉ là phần chưa thuế, do đó khi xuất ra, giá cũng là giá chưa thuế.</div>"
  },
  {
    "weight": "normal",
    "tags": ["Định khoản", "Thuế"],
    "question": "Tổng số thuế GTGT <span class=\"keyword\">đầu ra</span> 90.000.000 đồng, tổng số thuế GTGT <span class=\"keyword\">đầu vào</span> 10.000.000 đồng thì khi <span class=\"keyword\">khấu trừ</span> thuế GTGT đầu vào sẽ hạch toán<div class=\"options-grid\"><div>A. Nợ 3331 10.000.000<br>Có 133 10.000.000</div><div>B. Nợ 133 10.000.000<br>Có 3331 10.000.000</div><div>C. Nợ 3331 90.000.000<br>Có 133 90.000.000</div><div>D. Nợ 3331 100.000.000<br>Có 133 100.000.000</div></div>",
    "answer": "<div class=\"answer-title\">✅ Đáp án: Nợ <span class=\"answer-keyword\">3331</span> 10.000.000 / Có <span class=\"answer-keyword\">133</span> 10.000.000</div>\n<div class=\"note\">💡 Giải thích: Nguyên tắc khấu trừ thuế: Bút toán Nợ 3331 / Có 133 luôn lấy theo <span class=\"keyword\">SỐ NHỎ HƠN</span> giữa Đầu ra và Đầu vào. Ở đây 10tr < 90tr nên ghi nhận 10tr.</div>"
  },
  {
    "weight": "normal",
    "tags": ["Tính toán", "Tiền lương"],
    "question": "Xuất tiền mặt trả lương cho công nhân viên, biết <span class=\"keyword\">tổng quỹ lương</span> phải trả 100.000.000 đồng, <span class=\"keyword\">trừ các khoản trích</span> theo lương của công nhân viên 10.500.000 đồng, kế toán ghi<div class=\"options-grid\"><div>A. Nợ 622 89.500.000<br>Có 111 89.500.000</div><div>B. Nợ 334 89.500.000<br>Có 111 89.500.000</div><div>C. Nợ 111 110.500.000<br>Có 334 110.500.000</div><div>D. Nợ 334 110.500.000<br>Có 111 110.500.000</div></div>",
    "answer": "<div class=\"answer-title\">✅ Đáp án: Nợ <span class=\"answer-keyword\">334</span> 89.500.000 / Có <span class=\"answer-keyword\">111</span> 89.500.000</div>\n<div class=\"note\">💡 Giải thích: Số tiền thực lãnh = 100.000.000 - 10.500.000 = 89.500.000. Trả lương làm Phải trả NLĐ giảm (Nợ 334) và Tiền mặt giảm (Có 111) đúng với số 89.5tr.</div>"
  },
  {
    "weight": "normal",
    "tags": ["Định khoản", "Tiền lương"],
    "question": "<span class=\"keyword\">Trừ lương</span> công nhân viên do trước đây người này <span class=\"keyword\">tạm ứng</span> tiền đi công tác còn thừa nhưng chưa nộp lại, kế toán ghi<div class=\"options-grid\"><div>A. Nợ 141 / Có 334</div><div>B. Nợ 334 / Có 1381</div><div>C. Nợ 622 / Có 1381</div><div>D. Nợ 334 / Có 141</div></div>",
    "answer": "<div class=\"answer-title\">✅ Đáp án: Nợ <span class=\"answer-keyword\">334</span> / Có <span class=\"answer-keyword\">141</span></div>\n<div class=\"note\">💡 Giải thích: Trừ lương làm khoản Phải trả người lao động giảm (Nợ 334). Thu hồi tạm ứng làm Tạm ứng giảm (Có 141).</div>"
  },
  {
    "weight": "normal",
    "tags": ["Lý thuyết", "Tài khoản"],
    "question": "Khi vẽ sơ đồ tính giá thành sản phẩm thì các tài khoản <span class=\"keyword\">621, 622, 627 nằm bên</span> trái hay bên phải của tài khoản 154?<div class=\"options-grid\"><div>A. Bên phải hay bên trái đều được</div><div>B. Bên trái</div><div>C. Bên phải</div><div>D. không đủ cơ sở để xác định</div></div>",
    "answer": "<div class=\"answer-title\">✅ Đáp án: Bên <span class=\"answer-keyword\">trái</span></div>\n<div class=\"note\">💡 Giải thích: Chi phí 621, 622, 627 được tập hợp bên Có và kết chuyển sang bên Nợ 154. Trong sơ đồ chữ T (từ trái qua phải), dòng tiền chảy từ các tài khoản chi phí vào bên trái của TK 154.</div>"
  },
  {
    "weight": "normal",
    "tags": ["Định khoản", "Bồi thường"],
    "question": "Thu tiền mặt do người vận chuyển <span class=\"keyword\">bồi thường</span> bởi trước đây người này làm <span class=\"keyword\">mất</span> một lượng nguyên vật liệu trị giá 10.000.000 đồng, kế toán ghi<div class=\"options-grid\"><div>A. Nợ 111 10.000.000<br>Có 131 10.000.000</div><div>B. Nợ 111 10.000.000<br>Có 138 10.000.000</div><div>C. Nợ 111 10.000.000<br>Có 331 10.000.000</div><div>D. Nợ 111 10.000.000<br>Có 338 10.000.000</div></div>",
    "answer": "<div class=\"answer-title\">✅ Đáp án: Nợ <span class=\"answer-keyword\">111</span> 10.000.000 / Có <span class=\"answer-keyword\">138</span> 10.000.000</div>\n<div class=\"note\">💡 Giải thích: Lúc phát hiện mất đã treo vào Phải thu khác (Nợ 138). Nay thu được bồi thường bằng tiền mặt thì Phải thu khác giảm (Có 138), Tiền mặt tăng (Nợ 111).</div>"
  },
  {
    "weight": "normal",
    "tags": ["Lý thuyết", "Tài sản"],
    "question": "Công ty <span class=\"keyword\">thương mại</span> PTL mua 10 chiếc xe tải (tổng giá mua chưa thuế 1 tỷ đồng) <span class=\"keyword\">về để bán</span> nhưng <span class=\"keyword\">chưa thanh toán</span> cho người bán, những chiếc xe này sẽ được ghi nhận trên báo cáo tài chính của công ty là<div class=\"options-grid\"><div>A. tài sản cố định vô hình</div><div>B. nợ phải trả người bán</div><div>C. vốn đầu tư của chủ sở hữu</div><div>D. tài sản cố định hữu hình</div></div>",
    "answer": "<div class=\"answer-title\">✅ Đáp án: <span class=\"answer-keyword\">nợ phải trả</span> người bán</div>\n<div class=\"note\">💡 Giải thích: Xe mua về để bán đối với cty thương mại thì nó là Hàng hóa (156), KHÔNG PHẢI Tài sản cố định. Vì chưa thanh toán nên trên BCTC nó tương ứng với khoản \"Nợ phải trả người bán\". Bẫy lừa \"tài sản cố định\".</div>"
  },
  {
    "weight": "normal",
    "tags": ["Định khoản", "Góp vốn"],
    "question": "Nhận <span class=\"keyword\">góp vốn</span> liên doanh bằng một <span class=\"keyword\">TSCĐ</span> hữu hình trị giá 50.000.000 đồng, kế toán ghi<div class=\"options-grid\"><div>A. Nợ 211 50.000.000<br>Nợ 133 25.000.000<br>Có 411 55.000.000</div><div>B. Nợ 222 50.000.000<br>Có 211 50.000.000</div><div>C. Nợ 211 50.000.000<br>Có 411 50.000.000</div><div>D. Nợ 211 50.000.000<br>Có 441 50.000.000</div></div>",
    "answer": "<div class=\"answer-title\">✅ Đáp án: Nợ <span class=\"answer-keyword\">211</span> 50.000.000 / Có <span class=\"answer-keyword\">411</span> 50.000.000</div>\n<div class=\"note\">💡 Giải thích: TSCĐ nhận về tăng (Nợ 211). Vốn đầu tư của CSH tăng (Có 411). Không phát sinh thuế GTGT đối với nghiệp vụ nhận vốn góp.</div>"
  },
  {
    "weight": "normal",
    "tags": ["Định khoản", "Quỹ"],
    "question": "Xuất tiền mặt 5.000.000 đồng từ <span class=\"keyword\">quỹ khen thưởng</span> phúc lợi thưởng cho nhân viên sản xuất giỏi, kế toán ghi<div class=\"options-grid\"><div>A. Nợ 642 5.000.000<br>Có 111 5.000.000</div><div>B. Nợ 811 5.000.000<br>Có 111 5.000.000</div><div>C. Nợ 353 5.000.000<br>Có 111 5.000.000</div><div>D. Nợ 335 5.000.000<br>Có 111 5.000.000</div></div>",
    "answer": "<div class=\"answer-title\">✅ Đáp án: Nợ <span class=\"answer-keyword\">353</span> 5.000.000 / Có <span class=\"answer-keyword\">111</span> 5.000.000</div>\n<div class=\"note\">💡 Giải thích: Trích từ Quỹ khen thưởng phúc lợi (TK 353) làm quỹ giảm ghi Nợ. Tiền mặt giảm ghi Có.</div>"
  },
  {
    "weight": "normal",
    "tags": ["Định khoản", "Giảm giá"],
    "question": "Nguyên vật liệu mua chất lượng kém nên được người bán <span class=\"keyword\">giảm giá</span> 10% trên giá mua chưa thuế. Biết giá mua của lô nguyên vật liệu trước đây chưa thuế là 10.000.000 đồng, thuế GTGT 10%, <span class=\"keyword\">chưa thanh toán</span>. Kế toán ghi đối với <span class=\"keyword\">phần giảm giá</span><div class=\"options-grid\"><div>A. Nợ 331 1.000.000<br>Nợ 133 100.000<br>Có 152 1.100.000</div><div>B. Nợ 331 1.100.000<br>Có 152 1.100.000</div><div>C. Nợ 331 1.100.000<br>Có 152 1.000.000<br>Có 133 100.000</div><div>D. Nợ 331 1.100.000<br>Có 532 1.100.000</div></div>",
    "answer": "<div class=\"answer-title\">✅ Đáp án: Nợ <span class=\"answer-keyword\">331</span> 1.100.000 / Có <span class=\"answer-keyword\">152</span> 1.000.000 / Có <span class=\"answer-keyword\">133</span> 100.000</div>\n<div class=\"note\">💡 Giải thích: Được người bán giảm giá, làm khoản Phải trả người bán giảm xuống (Nợ 331). Ghi giảm Giá trị vật liệu tương ứng (Có 152) và giảm Thuế GTGT đầu vào được khấu trừ (Có 133).</div>"
  },
  {
    "weight": "normal",
    "tags": ["Lý thuyết", "Tài khoản"],
    "question": "Tài khoản <span class=\"keyword\">131</span><div class=\"options-grid\"><div>A. cuối kỳ luôn có số dư bên Nợ</div><div>B. cuối kỳ luôn có số dư bên Có</div><div>C. cuối kỳ không bao giờ có số dư</div><div>D. cuối kỳ có thể có số dư bên Nợ hoặc bên Có</div></div>",
    "answer": "<div class=\"answer-title\">✅ Đáp án: cuối kỳ có thể có số dư bên <span class=\"answer-keyword\">Nợ hoặc bên Có</span></div>\n<div class=\"note\">💡 Giải thích: TK 131 (Phải thu khách hàng) là TK lưỡng tính. Nếu khách chưa trả tiền -> Dư Nợ. Nếu khách ứng trước tiền -> Dư Có.</div>"
  },
  {
    "weight": "normal",
    "tags": ["Tính toán", "Giá xuất kho"],
    "question": "Tài khoản 152 có số dư <span class=\"keyword\">đầu kỳ: 1.000kg</span>, đơn giá 20.000 đồng/kg. Trong kỳ, ngày 01/01/20xx <span class=\"keyword\">mua 1.000kg</span> nguyên vật liệu về nhập kho, đơn giá mua chưa thuế 30.000 đồng/kg, thuế GTGT 10%. Hãy định khoản khi ngày 02/01/20xx <span class=\"keyword\">xuất 1.500kg</span> nguyên vật liệu dùng sản xuất sản phẩm, biết doanh nghiệp xuất kho theo phương pháp <span class=\"keyword\">bình quân liên hoàn</span><div class=\"options-grid\"><div>A. Nợ 621 45.000.000<br>Nợ 133 4.500.000<br>Có 152 49.500.000</div><div>B. Nợ 621 37.500.000<br>Có 152 37.500.000</div><div>C. Nợ 621 45.000.000<br>Có 152 45.000.000</div><div>D. Nợ 621 30.000.000<br>Có 152 30.000.000</div></div>",
    "answer": "<div class=\"answer-title\">✅ Đáp án: Nợ <span class=\"answer-keyword\">621</span> 37.500.000 / Có <span class=\"answer-keyword\">152</span> 37.500.000</div>\n<div class=\"note\">💡 Giải thích: Tổng số lượng kho = 2.000kg. Tổng giá trị = (1000 x 20.000) + (1000 x 30.000) = 50.000.000đ. Đơn giá BQ = 50tr / 2.000 = 25.000đ/kg. Trị giá xuất (1.500kg) = 1.500 x 25.000 = 37.500.000đ. Định khoản Nợ 621 / Có 152.</div>"
  },
  {
    "weight": "normal",
    "tags": ["Lý thuyết", "Định giá"],
    "question": "Công ty PTL mua một ôtô vận tải vào ngày 02/9/N với <span class=\"keyword\">giá 300 triệu</span> đồng, đang sử dụng cho kinh doanh. Ngày 31/9/N, <span class=\"keyword\">giá chiếc xe này trên thị trường</span> là 305 triệu đồng. Theo <span class=\"keyword\">nguyên tắc giá phí</span> (giá gốc) thì<div class=\"options-grid\"><div>A. Giá trị ghi sổ của chiếc xe được giữ nguyên là 300 triệu đồng</div><div>B. Giá trị ghi sổ của chiếc xe sẽ được điều chỉnh theo giá thị trường</div><div>C. Giá trị ghi sổ của chiếc xe sẽ được điều chỉnh tăng thêm 5 triệu đồng cho phù hợp với giá trị thị trường</div><div>D. Khấu hao tăng thêm 5 triệu đồng</div></div>",
    "answer": "<div class=\"answer-title\">✅ Đáp án: Giá trị ghi sổ của chiếc xe được <span class=\"answer-keyword\">giữ nguyên</span> là 300 triệu đồng</div>\n<div class=\"note\">💡 Giải thích: Nguyên tắc giá gốc (giá phí) yêu cầu ghi nhận tài sản theo chi phí thực tế đã bỏ ra tại thời điểm hình thành, không tự ý điều chỉnh theo biến động giá thị trường.</div>"
  },
  {
    "weight": "normal",
    "tags": ["Định khoản", "Bán hàng"],
    "question": "Xuất một lô hàng hóa bán trực tiếp cho khách hàng, giá vốn 1.000.000 đồng, <span class=\"keyword\">giá bán đã bao gồm thuế</span> GTGT 10% là 2.200.000 đồng, <span class=\"keyword\">chưa thu tiền</span>. Kế toán <span class=\"keyword\">ghi nhận doanh thu</span><div class=\"options-grid\"><div>A. Nợ 131 2.200.000<br>Có 511 2.000.000<br>Có 3331 200.000</div><div>B. Nợ 112 2.200.000<br>Có 511 2.000.000<br>Có 3331 200.000</div><div>C. Nợ 131 2.420.000<br>Có 511 2.200.000<br>Có 3331 220.000</div><div>D. Nợ 131 2.000.000<br>Nợ 133 200.000<br>Có 511 2.200.000</div></div>",
    "answer": "<div class=\"answer-title\">✅ Đáp án: Nợ <span class=\"answer-keyword\">131</span> 2.200.000 / Có <span class=\"answer-keyword\">511</span> 2.000.000 / Có <span class=\"answer-keyword\">3331</span> 200.000</div>\n<div class=\"note\">💡 Giải thích: Khách chưa trả tiền (Nợ 131) tổng cộng 2.200.000đ. Doanh thu bán hàng (Có 511) ghi theo giá chưa thuế = 2.000.000đ. Thuế GTGT đầu ra (Có 3331) là 200.000đ.</div>"
  },
  {
    "weight": "normal",
    "tags": ["Tính toán", "Thuế"],
    "question": "Tổng doanh thu trong kỳ 200.000.000 đồng, tổng chi phí trong kỳ là 100.000.000 đồng, <span class=\"keyword\">thuế suất thuế TNDN 20%</span>, tính <span class=\"keyword\">số tiền thuế TNDN thực tế phải nộp</span>, biết lợi nhuận trước thuế cũng chính là lợi nhuận chịu thuế?<div class=\"options-grid\"><div>A. 20.000.000</div><div>B. 30.000.000</div><div>C. 25.000.000</div><div>D. 35.000.000</div></div>",
    "answer": "<div class=\"answer-title\">✅ Đáp án: <span class=\"answer-keyword\">20.000.000</span></div>\n<div class=\"note\">💡 Giải thích: LN chịu thuế = Doanh thu - Chi phí = 200 - 100 = 100tr. Thuế TNDN = 100tr x 20% = 20tr.</div>"
  }
]

file_path = "10. Nguyên lý kế toán/Ngan_hang_de_Nguyen_ly_ke_toan_qs.json"
with open(file_path, "r", encoding="utf-8") as f:
    db = json.load(f)

def normalize_text(text):
    text = re.sub(r'<[^>]+>', '', text)
    text = re.sub(r'\\s+', ' ', text)
    return text.strip().lower()

added_count = 0
for new_q in new_questions:
    new_q_norm = normalize_text(new_q['question'].split('<div class=\"options-grid\">')[0])
    is_duplicate = False
    for existing_q in db:
        existing_q_norm = normalize_text(existing_q['question'].split('<div class=\"options-grid\">')[0])
        if not '<div class=\"options-grid\">' in existing_q['question']:
            existing_q_norm = normalize_text(existing_q['question'].split('A.')[0])
            
        if new_q_norm == existing_q_norm:
            is_duplicate = True
            break
    if not is_duplicate:
        db.append(new_q)
        added_count += 1

with open(file_path, "w", encoding="utf-8") as f:
    json.dump(db, f, ensure_ascii=False, indent=2)

print(f"Báo cáo: Đã thêm {added_count} câu hỏi mới vào CSDL.")
