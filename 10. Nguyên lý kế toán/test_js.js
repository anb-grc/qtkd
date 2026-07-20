const htmlText = `Khi doanh nghiệp xuất hàng hóa ký gửi đại lý bán, kế toán ghi`;
const answerTextHtml = `Xuất hàng gửi đại lý thì chưa được tính là bán`;

function normalizeTextForSearch(text) {
    if (!text) return "";
    return text.toLowerCase().normalize('NFC').replace(/\s+/g, ' ').trim();
}

const rawQuery = "Khi doanh nghiệp xuất hàng hóa ký gửi đại lý bán, kế toán ghi";
const query = normalizeTextForSearch(rawQuery);
const searchTerms = query.split(' ').filter(t => t.length > 0);

const questionText = normalizeTextForSearch(htmlText);
const answerText = normalizeTextForSearch(answerTextHtml);
const combinedText = questionText + " " + answerText;

const isMatch = searchTerms.length === 0 || searchTerms.every(term => combinedText.includes(term));
console.log("query:", query);
console.log("searchTerms:", searchTerms);
console.log("combinedText:", combinedText);
console.log("isMatch:", isMatch);
