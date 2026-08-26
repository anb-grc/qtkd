const fs = require('fs');
const data = JSON.parse(fs.readFileSync('_sources/TVU/Quan_tri_kinh_doanh_DH/10. Nguyên lý kế toán/Ngan_hang_de_Nguyen_ly_ke_toan_qs.json', 'utf8'));

let essayCount = 0;
let mcqCount = 0;

data.forEach(q => {
    let hasEmbeddedOptions = false;
    let displayQ = q.question || '';
    if (!q.options || q.options.length === 0) {
        let matches = [...displayQ.matchAll(/A[\.\)](?:\s|&nbsp;|<br|<\/?p>|<span)/g)];
        if (matches.length > 0) hasEmbeddedOptions = true;
    }
    let isActuallyMcq = (q.options && q.options.length > 0) || hasEmbeddedOptions;
    
    if (!isActuallyMcq) {
        essayCount++;
        if (essayCount <= 5) console.log("ESSAY:", displayQ);
    } else {
        mcqCount++;
    }
});
console.log("Essay count:", essayCount);
console.log("MCQ count:", mcqCount);
