const fs = require('fs');

function normalizeTextForSearch(text) {
  if (!text) return "";
  let s = text.toLowerCase().normalize('NFC');
  s = s.replace(/[\p{Cf}\u200B-\u200D\uFEFF\u00AD]/gu, '');
  s = s.replace(/oà/g, 'òa').replace(/oá/g, 'óa').replace(/oả/g, 'ỏa').replace(/oã/g, 'õa').replace(/oạ/g, 'ọa');
  s = s.replace(/oè/g, 'òe').replace(/oé/g, 'óe').replace(/oẻ/g, 'ỏe').replace(/oẽ/g, 'õe').replace(/oẹ/g, 'ọe');
  s = s.replace(/uỳ/g, 'ùy').replace(/uý/g, 'úy').replace(/uỷ/g, 'ủy').replace(/uỹ/g, 'ũy').replace(/uỵ/g, 'ụy');
  s = s.replace(/[^\p{L}\p{N}\s]/gu, ' ');
  return s.replace(/\s+/g, ' ').trim();
}

const html = fs.readFileSync('Ngan_hang_de_Mac_Lenin.html', 'utf8');

// Match question 95
const q95Match = html.match(/<div class="question-container".*?Câu 95.*?<\/div>\n    <\/div>/s);
if (q95Match) {
    // extract inner text from html roughly
    let innerText = q95Match[0].replace(/<[^>]+>/g, ' ');
    const cardText = normalizeTextForSearch(innerText);
    console.log("CARD TEXT:", cardText);
    
    const userQuery1 = "Công nghiệp hóa, hiện đại hóa là quá trình chuyển đổi căn bản, toàn diện các hoạt động sản xuất kinh doanh, dịch vụ và quản lý kinh tế - xã hội, từ sử dụng ___, dựa trên sự phát triển của công nghiệp và tiến bộ khoa học công nghệ, nhằm tạo ra năng suất lao động xã hội cao.";
    const query1 = normalizeTextForSearch(userQuery1);
    console.log("\nQUERY 1:", query1);
    console.log("MATCH 1?", cardText.includes(query1));
    
    const userQuery2 = "Con đường công nghiệp hóa theo mô hình Liên Xô (cũ) thường là ưu tiên phát triển___";
    const query2 = normalizeTextForSearch(userQuery2);
    console.log("\nQUERY 2:", query2);
    console.log("MATCH 2?", cardText.includes(query2));
} else {
    console.log("Q95 not found");
}

const q96Match = html.match(/<div class="question-container".*?Câu 96.*?<\/div>\n    <\/div>/s);
if (q96Match) {
    let innerText = q96Match[0].replace(/<[^>]+>/g, ' ');
    const cardText = normalizeTextForSearch(innerText);
    const userQuery2 = "Con đường công nghiệp hóa theo mô hình Liên Xô (cũ) thường là ưu tiên phát triển___";
    const query2 = normalizeTextForSearch(userQuery2);
    console.log("\nQ96 CARD TEXT:", cardText);
    console.log("MATCH Q96?", cardText.includes(query2));
}
