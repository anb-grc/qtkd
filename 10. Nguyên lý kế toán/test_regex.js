const text = "Khi doanh nghiệp xuất hàng hóa ký gửi đại lý bán, kế toán ghi 123";
const normalized = text.normalize('NFC').replace(/[^\p{L}\p{N}\s]/gu, '');
console.log(normalized);
