const fs = require('fs');

function normalizeTextForSearch(text, keepSpaces = false) {
    if (!text) return "";
    let s = text.replace(/<br\s*\/?>/gi, ' ');
    s = s.replace(/<[^>]+>/g, ' ');
    s = s.toLowerCase().normalize('NFC');
    s = s.replace(/[\p{Cf}\u200B-\u200D\uFEFF\u00AD]/gu, '');
    s = s.replace(/oà/g, 'òa').replace(/oá/g, 'óa').replace(/oả/g, 'ỏa').replace(/oã/g, 'õa').replace(/oạ/g, 'ọa');
    s = s.replace(/oè/g, 'òe').replace(/oé/g, 'óe').replace(/oẻ/g, 'ỏe').replace(/oẽ/g, 'õe').replace(/oẹ/g, 'ọe');
    s = s.replace(/uỳ/g, 'ùy').replace(/uý/g, 'úy').replace(/uỷ/g, 'ủy').replace(/uỹ/g, 'ũy').replace(/uỵ/g, 'ụy');
    if (!keepSpaces) {
        s = s.replace(/[^\p{L}\p{N}]/gu, '');
    } else {
        s = s.replace(/[^\p{L}\p{N}\s]/gu, ' ').replace(/\s+/g, ' ').trim();
    }
    return s;
}

function extractRawAnswer(ansHtml) {
    let m = ansHtml.match(/✅ Đáp án:\s*(.*?)<\/div>/i);
    if(m) return m[1];
    return "Đúng";
}

let data = JSON.parse(fs.readFileSync('10. Nguyên lý kế toán/Ngan_hang_de_Nguyen_ly_ke_toan_qs.json', 'utf8'));

let mismatchCount = 0;

data.forEach((q, i) => {
    let qHtml = q.question.replace(/<br\s*\/?>/gi, '\n');
    let plainText = qHtml.replace(/<[^>]+>/g, '');
    let match = plainText.match(/A[\.\)]\s*(.*?)\s*B[\.\)]\s*(.*?)\s*C[\.\)]\s*(.*?)\s*D[\.\)]\s*(.*)/is);
    
    if (match) {
        let options = [match[1].trim(), match[2].trim(), match[3].trim(), match[4].trim()];
        let correctAns = extractRawAnswer(q.answer);
        let plainCorrect = correctAns.replace(/<[^>]+>/g, ' ');
        let normCorrect = normalizeTextForSearch(plainCorrect);
        
        let exactMatchIdx = options.findIndex(opt => {
            let normOpt = normalizeTextForSearch(opt);
            return normOpt.includes(normCorrect) || normCorrect.includes(normOpt);
        });
        
        if (exactMatchIdx === -1) {
            mismatchCount++;
            console.log(`Mismatch #${i}:`);
            console.log(`  Title: ${plainCorrect.trim()}`);
            console.log(`  Options:`);
            options.forEach((opt, idx) => {
                console.log(`    ${String.fromCharCode(65+idx)}: ${opt.replace(/\n/g, ' ')}`);
            });
            console.log();
        }
    }
});

console.log(`Total exact mismatches: ${mismatchCount}`);
