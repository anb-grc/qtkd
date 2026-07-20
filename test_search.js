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

const query = "Tài khoản 121 là tài khoản thuộc tài sản hay nguồn vốn của doanh nghiệp?";
const htmlStr = `<span class="keyword">Tài khoản 121</span> là tài khoản <span class="keyword">thuộc</span> tài sản hay nguồn vốn của doanh nghiệp?`;

let plainText = htmlStr.replace(/<[^>]+>/g, ' ');

let qStr = normalizeTextForSearch(query);
let tStr = normalizeTextForSearch(plainText);

console.log("QSTR:", qStr);
console.log("TSTR:", tStr);
console.log("EQUAL?", qStr === tStr);
