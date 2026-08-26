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

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

let dataFile = '12. Thống kê ứng dụng trong kinh doanh/Ngan_hang_de_Thong_ke_qs.json';
let data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));

let fixedCount = 0;

data.forEach((q, i) => {
    let qHtml = q.question.replace(/<br\s*\/?>/gi, '\n');
    let plainText = qHtml.replace(/<[^>]+>/g, '');
    let match = plainText.match(/A[\.\)]\s*(.*?)\s*B[\.\)]\s*(.*?)\s*C[\.\)]\s*(.*?)\s*D[\.\)]\s*(.*)/is);
    
    if (match) {
        let optionsHtml = [...q.question.matchAll(/A[\.\)](?:\s|&nbsp;|<br|<\/?p>|<span)/g)];
        if (optionsHtml.length === 0) return;
        
        let cutIndex = optionsHtml[optionsHtml.length - 1].index;
        let optionsStr = q.question.substring(cutIndex);
        
        let options = [match[1].trim(), match[2].trim(), match[3].trim(), match[4].trim()];
        
        // Extract plain answer text
        let mTitle = q.answer.match(/<div class="answer-title">✅ Đáp án:\s*(.*?)<\/div>/i);
        if(!mTitle) return;
        let ansHtmlContent = mTitle[1];
        let plainCorrect = ansHtmlContent.replace(/<[^>]+>/g, ' ');
        let normCorrect = normalizeTextForSearch(plainCorrect);
        
        let exactMatchIdx = options.findIndex(opt => {
            let normOpt = normalizeTextForSearch(opt);
            return normOpt.includes(normCorrect) || normCorrect.includes(normOpt);
        });
        
        if (exactMatchIdx === -1) {
            // Regex match
            let normCorrectSpaced = normalizeTextForSearch(plainCorrect, true);
            let tokens = normCorrectSpaced.split(' ').filter(t => t.length > 0);
            if (tokens.length > 0) {
                let regex = new RegExp(tokens.join('.*?'), 'i');
                exactMatchIdx = options.findIndex(opt => regex.test(normalizeTextForSearch(opt, true)));
            }
            
            if (exactMatchIdx !== -1) {
                // Found the correct option using regex!
                let matchedOptPlain = options[exactMatchIdx].replace(/\n/g, ' / ').replace(/\s+/g, ' ').trim();
                
                // Extract keywords from original answer
                let kwRegex = /<span class="answer-keyword">(.*?)<\/span>/gi;
                let kws = [];
                let kwMatch;
                while((kwMatch = kwRegex.exec(ansHtmlContent)) !== null) {
                    kws.push(kwMatch[1]);
                }
                
                // Reconstruct matched option with keywords
                let newAnsTitleHtml = matchedOptPlain;
                kws.forEach(kw => {
                    // avoid matching parts of numbers
                    let r = new RegExp('\\b' + escapeRegExp(kw) + '\\b', 'g');
                    newAnsTitleHtml = newAnsTitleHtml.replace(r, `<span class="answer-keyword">${kw}</span>`);
                });
                
                let newAnswerBlock = q.answer.replace(mTitle[0], `<div class="answer-title">✅ Đáp án: ${newAnsTitleHtml}</div>`);
                q.answer = newAnswerBlock;
                fixedCount++;
            }
        }
    }
});

fs.writeFileSync(dataFile, JSON.stringify(data, null, 2), 'utf8');
console.log(`Fixed ${fixedCount} mismatches in ${dataFile}`);
